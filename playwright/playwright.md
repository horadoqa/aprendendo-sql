# Teste com Playwright

Cenários de teste automatizados com Playwright para validar os comandos SQL simulados, verificar os resultados exibidos na interface e garantir que erros como `Table Not Found` sejam apresentados corretamente.

Como seu projeto simula SQL usando JavaScript, há uma distinção importante: o Playwright pode validar tanto o comportamento da interface quanto as regras implementadas no simulador, mas isso não comprova que as consultas funcionariam em um banco de dados real.

## 1. O que podemos testar

| Cenário | Resultado esperado |
| --- | --- |
| Criar a tabela `users` | Sucesso; 0 linhas |
| Criar `users` novamente | Erro; tabela já existe |
| Inserir usuários antes de criar a tabela | Erro; tabela não encontrada |
| Inserir os usuários após criar a tabela | Sucesso; 4 linhas |
| Inserir usuários novamente | Erro; registros já existem |
| Consultar usuários | Sucesso; 4 linhas |
| Filtrar administradores | Sucesso; 1 linha |
| Ordenar usuários por nome | Sucesso; ordem alfabética |
| Criar `orders` antes de `users` | Erro; tabela referenciada não encontrada |
| Inserir pedidos | Sucesso; 4 linhas |
| Executar `JOIN` | Sucesso; 4 linhas relacionadas |
| Atualizar o usuário de ID 2 | Sucesso; 1 linha afetada |
| Excluir o usuário de ID 4 | Sucesso; 1 linha afetada |
| Excluir `users` enquanto `orders` existe | Erro; restrição de chave estrangeira |
| Excluir `orders` e depois `users` | Sucesso |

Também podemos validar o ícone de erro com fundo vermelho, a mensagem em português, a quantidade de linhas e os dados exibidos nas tabelas.

## 2. Instalar o Playwright

Na pasta raiz do projeto, onde estão o HTML e a pasta `assets`, execute:

bash
```
npm init -y
npm install -D @playwright/test
npx playwright install
```

A documentação oficial explica como criar testes, interagir com elementos e verificar resultados com asserções: [Playwright — Writing tests](<https://playwright.dev/docs/writing-tests>). Playwright

Uma estrutura recomendada é:

text
```

seu-projeto/
├── index.html
├── assets/
│   ├── style.css
│   ├── script.js
│   └── logo.png
├── tests/
│   └── sql.spec.js
├── package.json
└── playwright.config.js
```

## 3. Configurar a execução dos testes

Crie o arquivo `playwright.config.js`:

javascript
```

const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
    testDir: "./tests",
    fullyParallel: false,
    reporter: "list",

    use: {
        baseURL: "http://127.0.0.1:4173",
        headless: true
    },

    webServer: {
        command: "npx http-server . -p 4173 -c-1",
        url: "http://127.0.0.1:4173",
        reuseExistingServer: !process.env.CI,
        timeout: 30000
    }
});
```

Instale também o servidor local:

bash
```
npm install -D http-server
```

Essa configuração abre sua aplicação localmente para os testes. Ela pressupõe que o arquivo HTML principal se chama `index.html`.

## 4. Criar os cenários automatizados

Crie `tests/sql.spec.js` com o código abaixo. Ele utiliza os IDs `data-id` gerados pelo seu próprio script, sem depender da posição dos cartões na tela.

javascript
```

const { test, expect } = require("@playwright/test");

test.beforeEach(async ({ page }) => {
    await page.goto("/");
});

async function executar(page, id) {
    await page.locator(`.sql-card[data-id="${id}"]`).click();
}

async function esperarSucesso(page, mensagem) {
    await expect(page.locator("#resultStatus"))
        .toHaveText("STATUS: PASS");

    await expect(page.locator("#resultMessage"))
        .toHaveText(mensagem);

    await expect(page.locator("#resultPass"))
        .toContainText("SUCCESS");
}

async function esperarErro(page, mensagem) {
    await expect(page.locator("#resultStatus"))
        .toHaveText("STATUS: FAIL");

    await expect(page.locator("#resultMessage"))
        .toHaveText(mensagem);

    await expect(page.locator("#resultPass"))
        .toContainText("ERROR");

    await expect(page.locator("#resultIcon"))
        .toHaveClass(/error/);
}

test("a aplicação inicia sem tabelas criadas", async ({ page }) => {
    await expect(page.locator("#usersCount"))
        .toHaveText("NOT FOUND");

    await expect(page.locator("#ordersCount"))
        .toHaveText("NOT FOUND");

    await expect(page.locator("#resultStatus"))
        .toHaveText("STATUS: READY");
});

test("não permite inserir usuários sem criar a tabela", async ({ page }) => {
    await executar(page, "insertUsers");

    await esperarErro(page, "Table Not Found");

    await expect(page.locator("#usersCount"))
        .toHaveText("NOT FOUND");
});

test("não permite criar a mesma tabela duas vezes", async ({ page }) => {
    await executar(page, "create");

    await esperarSucesso(page, "Table Created");

    await executar(page, "create");

    await esperarErro(page, "Table Already Exists");
});

test("insere quatro usuários e impede a duplicação", async ({ page }) => {
    await executar(page, "create");
    await esperarSucesso(page, "Table Created");

    await executar(page, "insertUsers");
    await esperarSucesso(page, "Users Registered");

    await expect(page.locator("#usersCount"))
        .toHaveText("4 ROWS");

    await expect(page.locator("#usersTable tbody tr"))
        .toHaveCount(4);

    await executar(page, "insertUsers");

    await esperarErro(page, "Users Already Exist");

    // A segunda tentativa não deve duplicar os registros.
    await expect(page.locator("#usersTable tbody tr"))
        .toHaveCount(4);
});

test("SELECT, WHERE e ORDER BY retornam os resultados esperados", async ({ page }) => {
    await executar(page, "create");
    await executar(page, "insertUsers");

    await executar(page, "select");
    await esperarSucesso(page, "Query Executed");

    await expect(page.locator("#usersTable tbody tr"))
        .toHaveCount(4);

    await executar(page, "where");
    await esperarSucesso(page, "Filter Applied");

    await expect(page.locator("#usersTable tbody tr"))
        .toHaveCount(1);

    await expect(page.locator("#usersTable tbody tr"))
        .toContainText("Ana Costa");

    await executar(page, "orderby");
    await esperarSucesso(page, "Results Sorted");

    const nomes = await page
        .locator("#usersTable tbody tr td:nth-child(2)")
        .allTextContents();

    expect(nomes).toEqual([
        "Ana Costa",
        "João Pedro",
        "Lucas Mendes",
        "Maria Silva"
    ]);
});

test("valida a chave estrangeira ao criar pedidos", async ({ page }) => {
    // Não deve permitir criar orders antes de users.
    await executar(page, "createOrders");

    await esperarErro(page, "Referenced Table Not Found");

    await executar(page, "create");
    await executar(page, "insertUsers");

    await executar(page, "createOrders");
    await esperarSucesso(page, "Table Created");

    await executar(page, "insertOrders");
    await esperarSucesso(page, "Orders Registered");

    await expect(page.locator("#ordersCount"))
        .toHaveText("4 ROWS");

    await expect(page.locator("#ordersTable tbody tr"))
        .toHaveCount(4);
});

test("JOIN combina os quatro pedidos com seus usuários", async ({ page }) => {
    await executar(page, "create");
    await executar(page, "insertUsers");
    await executar(page, "createOrders");
    await executar(page, "insertOrders");

    await executar(page, "join");

    await esperarSucesso(page, "Tables Joined");

    await expect(page.locator("#ordersTable tbody tr"))
        .toHaveCount(4);

    await expect(page.locator("#ordersTable"))
        .toContainText("Notebook");

    await expect(page.locator("#ordersTable"))
        .toContainText("Ana Costa");
});

test("UPDATE modifica o usuário de ID 2", async ({ page }) => {
    await executar(page, "create");
    await executar(page, "insertUsers");

    await executar(page, "update");

    await esperarSucesso(page, "Record Updated");

    await expect(page.locator("#resultRows"))
        .toHaveText("1 ROW");

    await executar(page, "select");

    const linhaLucas = page
        .locator("#usersTable tbody tr")
        .filter({ hasText: "Lucas Mendes" });

    await expect(linhaLucas).toContainText("TRUE");
});

test("DELETE remove o usuário de ID 4", async ({ page }) => {
    await executar(page, "create");
    await executar(page, "insertUsers");

    await executar(page, "delete");

    await esperarSucesso(page, "Record Deleted");

    await expect(page.locator("#resultRows"))
        .toHaveText("1 ROW");

    await executar(page, "select");

    await expect(page.locator("#usersTable tbody tr"))
        .toHaveCount(3);

    await expect(page.locator("#usersTable"))
        .not.toContainText("João Pedro");
});

test("impede excluir users enquanto orders existir", async ({ page }) => {
    await executar(page, "create");
    await executar(page, "insertUsers");
    await executar(page, "createOrders");
    await executar(page, "insertOrders");

    await executar(page, "drop");

    await esperarErro(page, "Foreign Key Constraint");

    // A tabela de usuários deve continuar existindo.
    await expect(page.locator("#usersCount"))
        .toHaveText("4 ROWS");

    await executar(page, "dropOrders");
    await esperarSucesso(page, "Table Dropped");

    await executar(page, "drop");
    await esperarSucesso(page, "Table Dropped");

    await expect(page.locator("#usersCount"))
        .toHaveText("NOT FOUND");

    await expect(page.locator("#ordersCount"))
        .toHaveText("NOT FOUND");
});
```

Os testes utilizam as asserções do Playwright para verificar mensagens, contagem de linhas e conteúdo das tabelas. As asserções aguardam automaticamente os estados esperados, reduzindo falhas causadas por sincronização. Playwright

+1

Observação: esse arquivo testa as mensagens em inglês porque seu `script.js` atual ainda retorna textos como `Table Created` e `STATUS: PASS`. Se você já traduziu essas mensagens no JavaScript, atualize os textos esperados nos testes para português.

## 5. Executar os testes

No terminal, execute:

bash
```
npx playwright test
```

Para abrir o navegador e acompanhar as ações:

bash
```
npx playwright test --headed
```

Para abrir o relatório de execução:

bash
```
npx playwright show-report
```

## 6. Validar o fundo vermelho do ícone de erro

Como você quer a exclamação branca sobre fundo vermelho, podemos testar também o estilo visual.

Acrescente este teste ao arquivo:

javascript
```

test("ícone de erro possui fundo vermelho e símbolo branco", async ({ page }) => {
    await executar(page, "insertUsers");

    const icone = page.locator("#resultIcon");

    await expect(icone).toHaveText("!");
    await expect(icone).toHaveClass(/error/);

    await expect.poll(async () => {
        return icone.evaluate(element => {
            const css = getComputedStyle(element);

            return {
                background: css.backgroundColor,
                color: css.color
            };
        });
    }).toEqual({
        background: "rgb(239, 68, 68)",
        color: "rgb(255, 255, 255)"
    });
});
```

Esse último teste pressupõe que seu CSS use `#ef4444` como fundo de erro e branco para o símbolo.

## 7\. Um cuidado importante com a simulação

Seu código já valida IDs duplicados, e-mails duplicados, valores de pedidos e referências a usuários inexistentes. Porém, os dados iniciais são fixos e não existe uma interface para inserir valores arbitrários.

Portanto, os testes acima verificam os cenários que a interface consegue produzir hoje. Para testar de forma abrangente restrições como `UNIQUE`, `PRIMARY KEY`, `CHECK` e `FOREIGN KEY`, recomendo futuramente separar as funções de validação do simulador e criar testes unitários específicos para dados válidos e inválidos.

Se você quiser validar a sintaxe SQL de verdade, o próximo passo seria executar as consultas em um banco de teste, por exemplo SQLite, e usar o Playwright para verificar se a interface apresenta os resultados desse banco corretamente. Isso permitiria distinguir testes da simulação de testes de SQL real.
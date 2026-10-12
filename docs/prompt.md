# Aprendendo SQL

## PROPOSTA

A proposta é criar uma interface que pareça um ambiente editorial de SQL integrado a um editor de código, seguindo sua identidade visual: verde profundo, fundo marfim, tipografia serifada nos títulos e monoespaçada nos elementos técnicos.

A página terá duas áreas principais:

Esquerda (aproximadamente 30%): título SQL e 10 cards interativos, com numeração, comando e descrição.

Direita (aproximadamente 70%): quatro painéis que simulam um ambiente de desenvolvimento: query.sql, users, orders e Result.

Interação: ao clicar em um comando, a query, as tabelas e o resultado são atualizados. O painel de código terá numeração de linhas e destaque de sintaxe.

Visual: paleta #0F3D2E, #F3EFE6, #12201A e detalhes pontuais em #8FE3B0, com layout adaptável a telas menores.

Abaixo está uma implementação completa em um único arquivo HTML, sem dependências externas de JavaScript.


A proposta é criar uma interface que pareça um ambiente editorial de SQL integrado a um editor de código, seguindo sua identidade visual: verde profundo, fundo marfim, tipografia serifada nos títulos e monoespaçada nos elementos técnicos.

A página terá duas áreas principais:

- Esquerda (aproximadamente 30%): título `SQL` e 10 cards interativos, com numeração, comando e descrição.
- Direita (aproximadamente 70%): quatro painéis que simulam um ambiente de desenvolvimento: `query.sql`, `users`, `orders` e `Result`.
- Interação: ao clicar em um comando, a query, as tabelas e o resultado são atualizados. O painel de código terá numeração de linhas e destaque de sintaxe.
- Visual: paleta `#0F3D2E`, `#F3EFE6`, `#12201A` e detalhes pontuais em `#8FE3B0`, com layout adaptável a telas menores.

Abaixo está uma implementação completa em um único arquivo HTML, sem dependências externas de JavaScript.

A interface já inclui os 10 cards, realce de sintaxe, numeração de linhas, tabelas de demonstração e atualização dos resultados ao clicar nos comandos.

## Comportamento dos comandos

| Comando | Comportamento na interface |
| --- | --- |
| `CREATE TABLE` | Cria a tabela `users` e exibe `Table Created`. |
| `INSERT` | Adiciona um registro à tabela `users`. |
| `SELECT` | Exibe os registros disponíveis. |
| `WHERE` | Filtra os usuários administradores. |
| `ORDER BY` | Ordena os usuários pelo nome. |
| `GROUP BY` | Agrupa os pedidos por usuário. |
| `JOIN` | Combina os dados de usuários e pedidos. |
| `UPDATE` | Altera o status de administrador de um usuário. |
| `DELETE` | Remove um registro de usuário. |
| `DROP TABLE` | Remove a tabela `users` da simulação. |

Observação: este é um playground visual com dados simulados em JavaScript, não um banco de dados SQL real. A aparência do editor é inspirada no VS Code, mas a execução das consultas é demonstrativa. O painel `orders` começa vazio até que os dados de pedidos sejam inicializados; para visualizar os exemplos de `GROUP BY` e `JOIN`, inicialize também `createdOrders = true` e `orders = structuredClone(ordersSeed)` na inicialização do script.

Com base nesta identidade visual, 

## Identidade visual

Uma identidade visual editorial, técnica e humana, pensada para thumbnails de YouTube que precisam transmitir **credibilidade, personalidade e precisão** sem cair em uma estética genérica de tecnologia.

A direção combina **verde profundo, tipografia editorial e elementos de interface/relatório**, criando um contraste entre o sofisticado e o técnico.

---

 ## Paleta de cores

A paleta foi construída para funcionar tanto em **fundos escuros quanto claros**, mantendo contraste e reconhecimento visual.

| Cor | Hex | Função |
| --- | --- | --- |
| **Verde profundo** | `#0F3D2E` | Cor principal e base da identidade |
| **Verde-musgo** | `#3F6F52` | Cor de apoio e variações secundárias |
| **Verde-sinal** | `#8FE3B0` | Destaques pontuais, status e elementos de aprovação |
| **Dourado** | `#C99A44` | Contraponto sofisticado e detalhes especiais |
| **Marfim** | `#F3EFE6` | Fundos claros e áreas de respiro |
| **Tinta** | `#12201A` | Textos, fundos escuros e elementos de alto contraste |

### Princípio de uso

O **verde profundo `#0F3D2E`** é a cor estrutural da identidade. A proposta não é criar um visual neon sobre preto, mas trabalhar com uma paleta mais **orgânica, sóbria e editorial**.

O **verde-sinal `#8FE3B0`** deve aparecer com parcimônia. Ele funciona como um elemento de sinalização — quase como um **“PASS” em um relatório de teste**.

> Quanto mais raro o verde-sinal, mais atenção ele recebe quando aparece.

---

 ## Tipografia

 A identidade combina três famílias tipográficas, cada uma com uma função específica.

 ### Newsreader Italic

 **Uso:** títulos e wordmark.

 Uma serifada editorial que adiciona personalidade, caráter humano e uma sensação mais autoral à identidade.

 Seu uso em itálico ajuda a fugir da estética excessivamente neutra das interfaces e marcas baseadas apenas em sans-serif.

### JetBrains Mono

 **Uso:** status, tags, metadados, códigos e elementos técnicos.

 É a fonte monoespaçada utilizada de fato em ambientes de terminal, reforçando a linguagem de **teste, documentação, código e sistemas**.

 Exemplos:

```
STATUS: PASS
BUILD: 042
TESTED
v2.4.1
```

### Manrope

**Uso:** corpo de texto e informações secundárias.

Uma sans-serif limpa e contemporânea para garantir legibilidade e equilibrar o caráter editorial da Newsreader com a linguagem técnica da JetBrains Mono.

---

## Aplicação

A identidade deve funcionar naturalmente em **fundos escuros e claros**.

### Fundo escuro

Priorizar:

- Verde profundo
- Tinta
- Marfim
- Verde-sinal para pequenos destaques
- Dourado para detalhes de sofisticação

### Fundo claro

Priorizar:

- Marfim
- Verde profundo
- Tinta
- Verde-musgo como apoio
- Verde-sinal apenas em pontos estratégicos

A mudança entre os modos deve parecer uma **variação da mesma identidade**, e não dois sistemas visuais diferentes.

---

## Linguagem visual

 A estética mistura três referências principais:

 **Editorial**\
 Tipografia serifada, contraste, composição e sensação de publicação.

 **Técnica**\
 Monoespaçada, códigos, tags, status e referências a sistemas de teste.

 **Humana**\
 Cores orgânicas, imperfeição controlada e uma direção que evita o visual genérico de “tech brand”.

 O resultado deve parecer **sofisticado, técnico e autoral**, sem perder a simplicidade necessária para funcionar em uma thumbnail.

---

## Regra principal

**Menos sinal, mais significado.**

O verde-sinal não é uma cor decorativa. Ele representa **confirmação, aprovação, descoberta ou informação importante**.

Se tudo estiver destacado, nada está destacado.

A identidade deve usar o contraste entre **verde profundo + tipografia editorial + sinais técnicos pontuais** para criar reconhecimento visual sem depender de excesso de elementos.


crie uma estrutura HTML da sequinte forma:

Uma página dividida em duas partes,

Do lado esquerdo da página, cards com 1/3 do tamanho da largura da página, pode ser um pouco menor.

título: SQL


01 - CREATE TABLE
Cria uma Tabela

02 - INSERT
Insere dados

03 - SELECT
Lê linhas

04 - WHERE
Filtra linhas

05 - ORDER BY
Organiza 

06 - GROUP BY
Agrupa

07 - JOIN
Combina tabelas

08 - UPDATE
Atualiza informações

09 - DELETE
Apaga linhas

10 - DROP TABLE
Apaga tabela

Do lado direito da página, cards com 2/3 do tamanho da largura da página.

dividido em 4 partes

a primeira com o título: query.sql, simulando uma query, que vai aparecer o conteúdo, conforme eu clico  no card a esquerda.

Com números parecendo o vscode

Quando eu clico no CREATE TABLE tem que aparecer neste quadro:

CRETE TABLE users (
id INT,
name TEXT,
email TEXT,
password TEXT,
administrator BOLEAN
);

No segundo quadro a tabela users

No terceiro orders



e no quarto Result:

Table Created

# Aprendendo Comandos SQL

## Sobre o projeto

O **Aprendendo Comandos SQL** é um simulador interativo desenvolvido para demonstrar o funcionamento dos principais comandos SQL utilizados na criação, consulta, organização, atualização e exclusão de dados em bancos de dados relacionais.

O projeto tem como objetivo facilitar o aprendizado de SQL por meio de uma interface visual, na qual cada comando pode ser selecionado para observar sua estrutura, execução e resultado.

O simulador utiliza JavaScript para reproduzir o comportamento básico de um banco de dados, permitindo visualizar tabelas, registros, resultados de consultas e mensagens de sucesso ou erro.

## Objetivo

Demonstrar, de forma prática e visual, como os comandos SQL funcionam e como eles interagem com as tabelas e os dados de um banco de dados.

A proposta é tornar mais fácil a compreensão da lógica por trás das operações SQL, incluindo a criação de estruturas, a aplicação de filtros, o relacionamento entre tabelas e o controle das restrições dos dados.

## Funcionalidades

- Visualização dos comandos SQL disponíveis.
- Exibição do código SQL correspondente a cada operação.
- Destaque de sintaxe para facilitar a leitura dos comandos.
- Criação e exclusão de tabelas.
- Inserção, consulta, filtragem, ordenação, agrupamento e atualização de dados.
- Combinação de informações de tabelas relacionadas.
- Exibição visual das tabelas e dos resultados das consultas.
- Apresentação de mensagens de sucesso, erro e detalhes da execução.
- Verificação de restrições, como chaves primárias, e-mails únicos e relacionamentos entre tabelas.

## Comandos SQL disponíveis

O simulador apresenta diferentes operações, organizadas de acordo com sua finalidade.

| Comando | Definição |
| --- | --- |
| **CREATE TABLE (users)** | Cria a estrutura da tabela de usuários, definindo suas colunas, tipos de dados e restrições. |
| **INSERT (users)** | Insere os registros de usuários na tabela. |
| **SELECT (users)** | Consulta e retorna informações dos usuários cadastrados. |
| **WHERE** | Filtra os registros de acordo com uma condição definida. |
| **ORDER BY** | Organiza os resultados de uma consulta em ordem crescente ou decrescente. |
| **CREATE TABLE (orders)** | Cria a tabela de pedidos, incluindo a referência aos usuários relacionados. |
| **INSERT (orders)** | Insere os pedidos e suas respectivas informações na tabela. |
| **GROUP BY** | Agrupa os pedidos por usuário, permitindo visualizar a quantidade de pedidos de cada grupo. |
| **JOIN** | Combina informações das tabelas de usuários e pedidos por meio de um relacionamento entre suas colunas. |
| **UPDATE** | Modifica informações de registros existentes de acordo com uma condição. |
| **DELETE** | Remove registros de uma tabela, respeitando as restrições de relacionamento implementadas. |
| **DROP TABLE (orders)** | Exclui a tabela de pedidos e seus dados. |
| **DROP TABLE (users)** | Exclui a tabela de usuários, desde que não exista uma tabela de pedidos dependente dela. |

## Como funciona o simulador

O funcionamento do programa é baseado em uma lista de comandos predefinidos, cada um contendo seu identificador, nome, descrição, código SQL e uma função JavaScript responsável por simular sua execução.

Quando o usuário seleciona um comando na interface, o sistema realiza as seguintes etapas:

1. **Seleção do comando:** identifica a operação escolhida pelo usuário.
2. **Exibição do código:** apresenta o código SQL correspondente, com destaque de sintaxe.
3. **Execução simulada:** executa a função JavaScript associada ao comando.
4. **Validação:** verifica se as tabelas existem e se as operações respeitam as regras definidas pelo programa.
5. **Atualização dos resultados:** atualiza os painéis de dados conforme a operação realizada.
6. **Feedback da execução:** apresenta o status, a descrição do resultado e a quantidade de registros ou grupos retornados.

Dessa maneira, cada operação permite observar como uma instrução SQL influencia o estado das tabelas e os dados apresentados na interface.

## Estrutura dos dados

O simulador trabalha com duas tabelas principais:

- **users:** representa os usuários, armazenando identificador, nome, e-mail, senha e indicador de administrador.
- **orders:** representa os pedidos, armazenando identificador, identificador do usuário relacionado, produto e valor total.

A tabela `orders` possui um relacionamento com a tabela `users` por meio do campo `user_id`, que referencia o campo `id` dos usuários.

Esse relacionamento permite demonstrar conceitos importantes de bancos de dados relacionais, como chaves primárias, chaves estrangeiras e integridade referencial.

## Regras e validações

Para representar o comportamento de um banco de dados, o simulador implementa algumas regras:

- As tabelas precisam ser criadas antes de receber dados.
- Não é permitido criar novamente uma tabela que já existe.
- Os identificadores dos registros devem ser únicos dentro de cada tabela.
- Os e-mails dos usuários não podem se repetir.
- Os campos obrigatórios devem estar preenchidos.
- O valor total de um pedido não pode ser negativo.
- Cada pedido deve estar associado a um usuário existente.
- Uma tabela referenciada não pode ser excluída enquanto houver uma tabela dependente, conforme as regras implementadas no simulador.

Essas verificações permitem visualizar como restrições e dependências influenciam a execução das operações.

## Tecnologias utilizadas

- **HTML:** estrutura da interface.
- **CSS:** estilização e apresentação visual dos componentes.
- **JavaScript:** lógica de execução dos comandos, manipulação dos dados, validações e atualização dos resultados.
- **SQL:** linguagem utilizada para representar as operações simuladas.

## Como executar

1. Baixe ou clone o repositório do projeto.
2. Abra a pasta do projeto em seu editor de código.
3. Abra o arquivo HTML principal em um navegador.
4. Selecione os comandos disponíveis na interface para acompanhar suas instruções e resultados.

Não é necessário configurar um servidor de banco de dados para utilizar a versão atual do simulador.

## Limitações

Este projeto **não executa SQL em um banco de dados real**. Os comandos são representados por instruções SQL predefinidas, enquanto suas operações são reproduzidas por funções JavaScript que manipulam dados mantidos em memória.

Por isso, o simulador é voltado principalmente ao aprendizado conceitual e visual. Ele não substitui a prática com sistemas de gerenciamento de bancos de dados, como MySQL, PostgreSQL ou SQLite.

Além disso, os dados são mantidos em memória e não possuem persistência automática. Ao recarregar a página, o estado das tabelas é reiniciado.

## Considerações finais

O Aprendendo Comandos SQL busca tornar o estudo de SQL mais acessível por meio da visualização do código, da execução simulada e da apresentação dos resultados.

O projeto permite compreender como diferentes comandos atuam sobre tabelas e registros, além de demonstrar a importância das restrições e dos relacionamentos em bancos de dados relacionais.

**O foco é mostrar não apenas a estrutura dos comandos SQL, mas também a lógica de seu funcionamento e os efeitos que produzem nos dados.**

Observação: o README descreve o funcionamento do código apresentado, sem afirmar que o simulador executa consultas SQL reais. Isso é importante para deixar claro o propósito didático do projeto.

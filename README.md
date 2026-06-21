# 🌸 Floricultura Jardim Web 🌿

Sistema web integrado de gestão e frente de caixa desenvolvido para automatizar as operações de uma floricultura. O foco principal da aplicação é a implementação de regras de negócio e operações de CRUD diretamente no nível do banco de dados relacional.

---

## 🎓 Contexto Acadêmico

Este projeto foi construído como requisito prático para o curso de Análise e Desenvolvimento de Sistemas do Instituto Federal do Piauí (IFPI), aplicando conceitos avançados de estruturação e segurança em Banco de Dados.

---

## 🛠️ Tecnologias Utilizadas

* **Banco de Dados:** MySQL
* **Backend:** Node.js com Express e pacote `mysql2`
* **Frontend:** HTML5, CSS3 e Vanilla JavaScript

---

## ⚙️ Arquitetura e Lógica no Banco de Dados

O grande diferencial arquitetural deste projeto é a total delegação do CRUD e das validações para o banco de dados. A aplicação web funciona apenas como interface de usuário, enquanto o MySQL garante a integridade seguindo os requisitos:

* **Stored Procedures:** Gerenciam de forma isolada todo o fluxo de inserção e exclusão no sistema (Cadastro de Clientes, Inserção de Produtos, Exclusão de itens do catálogo e Geração do Cabeçalho da Nota Fiscal).
* **Stored Functions:** Realizam as validações críticas de negócio. A função `fn_checar_estoque` bloqueia e impede transações de produtos sem saldo físico suficiente no momento da venda.
* **Triggers:** Responsáveis pela automação financeira e logística. O gatilho `trg_apos_inserir_item` atua silenciosamente no banco para atualizar o valor total da nota fiscal e realizar a baixa instantânea da quantidade em estoque após cada adição no carrinho.

---

## ✨ Funcionalidades da Interface

* Painel de Frente de Caixa com busca dinâmica e listagem autocompletável de clientes.
* Catálogo de estoque atualizado em tempo real com alertas visuais para quantidades críticas.
* Cesta de compras interativa com cruzamento de dados de produtos.
* Validação de formulários com aplicação de máscaras de preenchimento (CPF, RG, Telefone e Moeda Brasileira).
* Painel de controle de testes com recurso de "Reset Completo" para limpar as tabelas antes de novas demonstrações ou avaliações.

---

## 🚀 Como Executar o Projeto Localmente

### 1. Configuração do Banco de Dados
Abra o seu MySQL Workbench e execute o script SQL fornecido no projeto. Ele criará o banco `floricultura` e estabelecerá automaticamente todas as tabelas, Procedures, Functions e Triggers necessárias.

### 2. Configuração do Servidor Backend
Navegue até a pasta `backend` utilizando o seu terminal.
Execute o comando `npm install` para instalar as dependências necessárias para a API.
Verifique se as credenciais de acesso ao seu MySQL (usuário e senha) no arquivo `server.js` estão corretas para o seu ambiente local.
Inicie a comunicação executando `node server.js`.

### 3. Acesso à Aplicação Web
Com o servidor rodando, abra o seu navegador de preferência.
Acesse o endereço `http://localhost:3000`.

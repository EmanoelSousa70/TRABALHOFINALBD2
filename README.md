# TRABALHOFINALBD2
🌸 Floricultura Jardim Web
Descrição do Projeto
Este é um sistema web integrado de gestão e frente de caixa desenvolvido para automatizar as operações de uma floricultura. O grande diferencial arquitetural deste projeto é a delegação das regras de negócio e operações de CRUD diretamente para o banco de dados relacional, garantindo maior integridade e segurança das informações.

O sistema foi desenhado para gerenciar clientes, catálogo de produtos (com categorização de tipos) e o fluxo completo de vendas, gerando notas fiscais e atualizando estoques em tempo real.

Destaques Técnicos (Regras de Negócio no Banco de Dados)
Para garantir a consistência dos dados sem depender exclusivamente do backend, a lógica de negócio foi implementada em nível de banco de dados utilizando:

Stored Procedures: Todo o fluxo de inserção de dados (Cadastro de Clientes, Cadastro de Produtos e Geração de Vendas) é intermediado por procedures, encapsulando as operações de INSERT e DELETE.

Stored Functions: A validação de disponibilidade de itens na frente de caixa é feita por uma função nativa (fn_checar_estoque), que impede a venda de produtos sem saldo suficiente antes de qualquer gravação.

Triggers: A automação financeira e de logística acontece via gatilhos. Ao registrar a saída de um item (trg_apos_inserir_item), o banco de dados se encarrega autonomamente de abater a quantidade do estoque e recalcular o valor total da nota fiscal associada.

Tecnologias Utilizadas

Banco de Dados: MySQL (Lógica de negócios, Procedures, Functions, Triggers).

Backend: Node.js com Express (Criação da API RESTful para comunicação com o banco via mysql2).

Frontend: HTML5, CSS3 e Vanilla JavaScript (Interface responsiva, assíncrona com fetch API e máscaras de validação em tempo real).

Funcionalidades (Frente de Caixa e Gestão)

Painel de Vendas com busca dinâmica de clientes cadastrados.

Catálogo de produtos em tempo real com alerta visual para estoques baixos.

Cesta de compras interativa.

Validação de formulários (Máscaras de CPF, RG, Telefone e Moeda).

Painel de controle para zerar a base de testes facilmente.

Como Executar o Projeto Localmente

Configuração do Banco de Dados:

Abra o MySQL Workbench e execute o arquivo script.sql (ou cole o script de criação) para gerar o banco floricultura, as tabelas, as procedures, functions e triggers.

Configuração do Backend:

Acesse a pasta backend pelo terminal.

Execute npm install para baixar as dependências (express e mysql2).

Verifique se as credenciais de acesso ao banco (usuário e senha) no arquivo server.js correspondem ao seu ambiente local.

Inicie o servidor rodando o comando node server.js.

Acesso ao Sistema:

Abra o navegador e acesse http://localhost:3000.

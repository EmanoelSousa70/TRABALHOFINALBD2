const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');

const app = express();
app.use(express.json());

app.use(express.static(path.join(__dirname, '../frontend')));

const dbConfig = {
    host: 'localhost',
    user: 'root', 
    password: 'root123', 
    database: 'floricultura'
};

// ==========================================
// ROTAS DE CONSULTA
// ==========================================
app.get('/api/produtos', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.query('SELECT codigo, nome, preco, quantidade_estoque FROM produto');
        await connection.end();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

app.get('/api/clientes', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.query('SELECT cpf, nome FROM cliente');
        await connection.end();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// ==========================================
// ROTA: VENDA (Aciona Procedure e Triggers)
// ==========================================
app.post('/api/vender', async (req, res) => {
    const { cpf_cliente, itens } = req.body;
    let connection;

    try {
        connection = await mysql.createConnection(dbConfig);
        await connection.beginTransaction();

        const [resultCompra] = await connection.query('CALL sp_nova_compra(?, @nota_fiscal)', [cpf_cliente]);
        const [rowNota] = await connection.query('SELECT @nota_fiscal as nota_fiscal');
        const notaFiscal = rowNota[0].nota_fiscal;

        for (let item of itens) {
            await connection.query('CALL sp_adicionar_item_compra(?, ?, ?)', [notaFiscal, item.produto_codigo, item.quantidade]);
        }

        await connection.commit();

        const [rowTotal] = await connection.query('SELECT valor_total FROM compra WHERE numero_nota_fiscal = ?', [notaFiscal]);
        const valorTotal = rowTotal[0].valor_total;

        res.status(201).json({ 
            mensagem: 'Venda realizada com sucesso!', 
            nota_fiscal: notaFiscal,
            valor_total: valorTotal
        });

    } catch (error) {
        if (connection) await connection.rollback();
        res.status(400).json({ erro: error.message });
    } finally {
        if (connection) await connection.end();
    }
});

// ==========================================
// ROTAS DE CADASTRO (C do CRUD)
// ==========================================
app.post('/api/clientes', async (req, res) => {
    const { cpf, rg, nome, telefone, endereco } = req.body;
    try {
        const connection = await mysql.createConnection(dbConfig);
        await connection.query('CALL sp_inserir_cliente(?, ?, ?, ?, ?)', [cpf, rg, nome, telefone, endereco]);
        await connection.end();
        res.status(201).json({ mensagem: 'Cliente cadastrado com sucesso!' });
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
});

app.post('/api/produtos', async (req, res) => {
    const { nome, tipo_codigo, preco, quantidade_estoque } = req.body;
    try {
        const connection = await mysql.createConnection(dbConfig);
        await connection.query('CALL sp_inserir_produto(?, ?, ?, ?)', [nome, tipo_codigo, preco, quantidade_estoque]);
        await connection.end();
        res.status(201).json({ mensagem: 'Produto cadastrado com sucesso!' });
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
});

// ==========================================
// ROTA DE EXCLUSÃO DE PRODUTO (D do CRUD)
// ==========================================
app.delete('/api/produtos/:codigo', async (req, res) => {
    const { codigo } = req.params;
    try {
        const connection = await mysql.createConnection(dbConfig);
        // Invoca a Stored Procedure de exclusão criada no banco
        await connection.query('CALL sp_excluir_produto(?)', [codigo]);
        await connection.end();
        res.json({ mensagem: 'Produto excluído com sucesso!' });
    } catch (error) {
        // Se o produto estiver amarrado a uma venda existente, o banco joga o erro de chave estrangeira para cá
        res.status(400).json({ erro: 'Não é possível excluir um produto que possui histórico de vendas cadastrado.' });
    }
});

// ==========================================
// ROTA ESPECIAL: ZERAR BANCO PARA A APRESENTAÇÃO
// ==========================================
app.post('/api/sistema/reset', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        await connection.query('SET FOREIGN_KEY_CHECKS = 0');
        await connection.query('TRUNCATE TABLE itens_compra');
        await connection.query('TRUNCATE TABLE compra');
        await connection.query('TRUNCATE TABLE produto');
        await connection.query('TRUNCATE TABLE cliente');
        await connection.query('SET FOREIGN_KEY_CHECKS = 1');
        await connection.end();
        res.json({ mensagem: 'Banco de dados limpo com sucesso para a apresentação!' });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
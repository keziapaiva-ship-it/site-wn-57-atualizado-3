const corridaModel = require("../models/corridaModel");

async function criar(req, res) {
    try {
        const {
            origem,
            destino,
            formaPagamento
        } = req.body;

        const passageiroId = req.usuario.id;

        if (!origem || !destino || !formaPagamento) {
            return res.status(400).json({
                erro: "Origem, destino e forma de pagamento são obrigatórios."
            });
        }

        const formasPagamento = ["PIX", "CARTAO", "DINHEIRO"];

        if (!formasPagamento.includes(formaPagamento.toUpperCase())) {
            return res.status(400).json({
                erro: "Forma de pagamento inválida."
            });
        }

        const corrida = corridaModel.criar({
            passageiroId,
            motoristaId: null,
            origem,
            destino,
            formaPagamento: formaPagamento.toUpperCase()
        });

        res.status(201).json({
            mensagem: "Corrida criada com sucesso!",
            corrida
        });

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: "Erro ao criar corrida."
        });
    }
}

async function listar(req, res) {
    try {
        const corridas = corridaModel.listar();

        res.status(200).json({
            corridas
        });

    } catch (erro) {
        res.status(500).json({
            erro: "Erro ao listar corridas."
        });
    }
}

module.exports = {
    criar,
    listar
};
const motoristaModel = require("../models/motoristaModel");

const validarEmail = require("../utils/validarEmail");
const validarSenha = require("../utils/validarSenha");

const bcrypt = require("bcrypt");

async function criar(req, res) {
    try {
        const { nome, email, senha, cnh } = req.body;

        if (!nome || !email || !senha || !cnh) {
            return res.status(400).json({
                erro: "Nome, email, senha e CNH são obrigatórios."
            });
        }

        if (!validarEmail(email)) {
            return res.status(400).json({
                erro: "Email inválido."
            });
        }

        if (!validarSenha(senha)) {
            return res.status(400).json({
                erro: "A senha deve ter pelo menos 6 caracteres."
            });
        }

        const motoristaExistente = motoristaModel.buscarPorEmail(email);

        if (motoristaExistente) {
            return res.status(400).json({
                erro: "Este email já está cadastrado."
            });
        }

        const senhaHash = await bcrypt.hash(senha, 10);

        const motorista = motoristaModel.criar({
            nome,
            email,
            senha: senhaHash,
            cnh
        });

        const motoristaResposta = {
            id: motorista.id,
            nome: motorista.nome,
            email: motorista.email,
            cnh: motorista.cnh
        };

        res.status(201).json({
            mensagem: "Motorista cadastrado com sucesso!",
            motorista: motoristaResposta
        });

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: "Erro ao cadastrar motorista."
        });
    }
}

async function listar(req, res) {
    try {
        const motoristas = motoristaModel.listar();

        const motoristasResposta = motoristas.map(motorista => ({
            id: motorista.id,
            nome: motorista.nome,
            email: motorista.email,
            cnh: motorista.cnh
        }));

        res.status(200).json({
            motoristas: motoristasResposta
        });

    } catch (erro) {
        res.status(500).json({
            erro: "Erro ao listar motoristas."
        });
    }
}

module.exports = {
    criar,
    listar
};
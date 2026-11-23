
const usuarioModel = require("../models/usuarioModel");

const validarEmail = require("../utils/validarEmail");
const validarSenha = require("../utils/validarSenha");

const bcrypt = require("bcrypt");

async function criar(req, res) {
    try {
        const { nome, email, senha, telefone, nascimento } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({
                erro: "Nome, email e senha são obrigatórios."
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

        const usuarioExistente = await usuarioModel.buscarPorEmail(email);

        if (usuarioExistente) {
            return res.status(400).json({
                erro: "Este email já está cadastrado."
            });
        }

        const senhaHash = await bcrypt.hash(senha, 10);

        const usuario = await usuarioModel.criar({
            nome,
            email,
            telefone,
            nascimento,
            senha: senhaHash
        });

        res.status(201).json({
            mensagem: "Usuário cadastrado com sucesso!",
            usuario
        });

    } catch (erro) {
        console.error("Erro ao cadastrar usuário:", erro);

        if (erro.code === "23505") {
            return res.status(400).json({
                erro: "Este email já está cadastrado."
            });
        }

        res.status(500).json({
            erro: "Erro ao cadastrar usuário."
        });
    }
}

async function listar(req, res) {
    try {
        const usuarios = await usuarioModel.listar();

        res.status(200).json({
            usuarios
        });

    } catch (erro) {
        console.error("Erro ao listar usuários:", erro);

        res.status(500).json({
            erro: "Erro ao listar usuários."
        });
    }
}

module.exports = {
    criar,
    listar
};

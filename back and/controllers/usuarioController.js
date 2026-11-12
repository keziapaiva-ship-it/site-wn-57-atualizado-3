const usuarioModel = require("../models/usuarioModel");

const validarEmail = require("../utils/validarEmail");
const validarSenha = require("../utils/validarSenha");

const bcrypt = require("bcrypt");

async function criar(req, res) {
    try {
        const { nome, email, senha } = req.body;

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

        const usuarioExistente = usuarioModel.buscarPorEmail(email);

        if (usuarioExistente) {
            return res.status(400).json({
                erro: "Este email já está cadastrado."
            });
        }

        const senhaHash = await bcrypt.hash(senha, 10);

        const usuario = usuarioModel.criar({
            nome,
            email,
            senha: senhaHash
        });

        // Não enviar a senha protegida na resposta
        const usuarioResposta = {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email
        };

        res.status(201).json({
            mensagem: "Usuário cadastrado com sucesso!",
            usuario: usuarioResposta
        });

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: "Erro ao cadastrar usuário."
        });
    }
}

async function listar(req, res) {
    try {
        const usuarios = usuarioModel.listar();

        const usuariosResposta = usuarios.map(usuario => ({
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email
        }));

        res.status(200).json({
            usuarios: usuariosResposta
        });

    } catch (erro) {
        res.status(500).json({
            erro: "Erro ao listar usuários."
        });
    }
}

module.exports = {
    criar,
    listar
};
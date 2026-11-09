require("dotenv").config();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const usuarioModel = require("../models/usuarioModel");
const motoristaModel = require("../models/motoristaModel");

async function login(req, res) {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({
                erro: "Email e senha são obrigatórios."
            });
        }

        let pessoa = usuarioModel.buscarPorEmail(email);
        let tipo = "usuario";

        if (!pessoa) {
            pessoa = motoristaModel.buscarPorEmail(email);
            tipo = "motorista";
        }

        if (!pessoa) {
            return res.status(401).json({
                erro: "Email ou senha inválidos."
            });
        }

        const senhaValida = await bcrypt.compare(
            senha,
            pessoa.senha
        );

        if (!senhaValida) {
            return res.status(401).json({
                erro: "Email ou senha inválidos."
            });
        }

        const token = jwt.sign(
            {
                id: pessoa.id,
                email: pessoa.email,
                tipo: tipo
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        res.status(200).json({
            mensagem: "Login realizado com sucesso!",
            token: token,
            usuario: {
                id: pessoa.id,
                nome: pessoa.nome,
                email: pessoa.email,
                tipo: tipo
            }
        });

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: "Erro ao realizar login."
        });
    }
}

module.exports = {
    login
};

const db = require("../database");

class UsuarioModel {

    async criar(usuario) {
        const resultado = await db.query(
            `INSERT INTO usuarios
            (nome_completo, email, data_nascimento, telefone, senha_hash)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING
                id,
                nome_completo AS nome,
                email,
                telefone,
                data_nascimento AS nascimento`,
            [
                usuario.nome,
                usuario.email,
                usuario.nascimento || null,
                usuario.telefone || null,
                usuario.senha
            ]
        );

        return resultado.rows[0];
    }

    async listar() {
        const resultado = await db.query(
            `SELECT
                id,
                nome_completo AS nome,
                email,
                telefone,
                data_nascimento AS nascimento
             FROM usuarios
             ORDER BY criado_em DESC`
        );

        return resultado.rows;
    }

    async buscarPorEmail(email) {
        const resultado = await db.query(
            `SELECT id, nome_completo AS nome, email
             FROM usuarios
             WHERE email = $1`,
            [email]
        );

        return resultado.rows[0] || null;
    }
}

module.exports = new UsuarioModel();

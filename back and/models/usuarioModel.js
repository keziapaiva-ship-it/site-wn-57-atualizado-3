class UsuarioModel {

    constructor() {
        this.usuarios = [];
    }

    criar(usuario) {
        const novoUsuario = {
            id: this.usuarios.length + 1,
            nome: usuario.nome,
            email: usuario.email,
            senha: usuario.senha
        };

        this.usuarios.push(novoUsuario);

        return novoUsuario;
    }

    listar() {
        return this.usuarios;
    }

    buscarPorEmail(email) {
        return this.usuarios.find(usuario => usuario.email === email);
    }
}

module.exports = new UsuarioModel();
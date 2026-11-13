function validarSenha(senha) {
    return typeof senha === "string" && senha.length >= 6;
}

module.exports = validarSenha;
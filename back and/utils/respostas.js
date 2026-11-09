function sucesso(res, dados, status = 200) {
    return res.status(status).json(dados);
}

function erro(res, mensagem, status = 400) {
    return res.status(status).json({
        erro: mensagem
    });
}

module.exports = {
    sucesso,
    erro
};
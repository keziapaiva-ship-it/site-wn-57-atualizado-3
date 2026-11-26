console.log("api.js carregou");

window.API_URL = "http://localhost:3000";

async function api(rota, metodo = "GET", dados = null) {
    const opcoes = {
        method: metodo,
        headers: { "Content-Type": "application/json" }
    };

    const token = localStorage.getItem("token");
    if (token) opcoes.headers["Authorization"] = `Bearer ${token}`;

    if (dados) opcoes.body = JSON.stringify(dados);

    const resposta = await fetch(API_URL + rota, opcoes);
    return resposta.json();
}
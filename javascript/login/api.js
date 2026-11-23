
console.log("api.js carregou");

window.API_URL = "http://localhost:3000";

async function api(rota, metodo = "GET", dados = null) {
    try {
        const opcoes = {
            method: metodo,
            headers: {
                "Content-Type": "application/json"
            }
        };

        const token = localStorage.getItem("token");

        if (token) {
            opcoes.headers["Authorization"] = `Bearer ${token}`;
        }

        if (dados !== null) {
            opcoes.body = JSON.stringify(dados);
        }

        const resposta = await fetch(window.API_URL + rota, opcoes);

        const resultado = await resposta.json();

        if (!resposta.ok) {
            throw new Error(
                resultado.mensagem || resultado.erro || "Erro na requisição."
            );
        }

        return resultado;

    } catch (erro) {
        console.error("Erro na comunicação com a API:", erro);

        throw erro;
    }
}

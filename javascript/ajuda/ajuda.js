
let idiomaAtual = "pt";

const traducoes = {
    pt: {
        cadastro: "Cadastre-se",
        cards: [
            ["Usuários", "Problemas durante sua viagem"],
            ["Solicitar uma corrida", "Como solicitar e acompanhar"],
            ["Pagamento", "PIX, cartão e dinheiro"],
            ["Minha conta", "Cadastro, login e perfil"],
            ["Motoristas", "Informações sobre motoristas"],
            ["Segurança", "Segurança durante a viagem"],
            ["Problemas", "Relate um problema"],
            ["Outros assuntos", "Precisa de outra ajuda?"]
        ],
        rodape: "Estamos aqui para ajudar você.",
        links: ["Central de Ajuda", "Suporte", "Cadastre-se"],
        direitos: "© 2026 WN57 · Privacidade · Termos"
    },

    en: {
        cadastro: "Sign up",
        cards: [
            ["Users", "Problems during your ride"],
            ["Request a ride", "How to request and track"],
            ["Payment", "PIX, credit card and cash"],
            ["My account", "Registration, login and profile"],
            ["Drivers", "Information about drivers"],
            ["Safety", "Safety during your ride"],
            ["Problems", "Report a problem"],
            ["Other topics", "Need more help?"]
        ],
        rodape: "We are here to help you.",
        links: ["Help Center", "Support", "Sign up"],
        direitos: "© 2026 WN57 · Privacy · Terms"
    }
};


// APLICAR IDIOMA
function aplicarIdioma(idioma) {

    idiomaAtual = idioma;

    const textos = traducoes[idioma];

    // BOTÃO DE IDIOMA
    document.getElementById("botaoIdioma").textContent =
        idioma === "pt" ? "🌐 PT-BR" : "🌐 EN";

    // TÍTULO DA ABA
    document.title =
        idioma === "pt" ? "Ajuda - WN57" : "Help - WN57";

    // CADASTRO
    document.querySelector(".btn-cadastro").textContent =
        textos.cadastro;

    // CARDS
    document.querySelectorAll(".categoria").forEach((card, index) => {
        card.querySelector("h3").textContent = textos.cards[index][0];
        card.querySelector("p").textContent = textos.cards[index][1];
    });

    // RODAPÉ
    document.querySelector(".footer-brand p").textContent =
        textos.rodape;

    document.querySelectorAll(".footer-links a").forEach((link, index) => {
        link.textContent = textos.links[index];
    });

    document.querySelector(".footer-bottom p").textContent =
        textos.direitos;

    // IDIOMA DO DOCUMENTO
    document.documentElement.lang =
        idioma === "pt" ? "pt-BR" : "en";
}


// ALTERNAR IDIOMA
function trocarIdioma() {

    const novoIdioma = idiomaAtual === "pt" ? "en" : "pt";

    aplicarIdioma(novoIdioma);

}


// INICIAR SEMPRE EM PORTUGUÊS

document.addEventListener("DOMContentLoaded", () => {

    // INICIAR SEMPRE EM PORTUGUÊS
    aplicarIdioma("pt");

    // ANIMAÇÃO DE ENTRADA DOS CARDS
    const categorias = document.querySelectorAll(".categoria");

    categorias.forEach((card, index) => {

        card.style.opacity = "0";
        card.style.transform = "translateY(25px)";

        setTimeout(() => {

            card.style.transition =
                "opacity 0.6s ease, transform 0.6s ease";

            card.style.opacity = "1";
            card.style.transform = "translateY(0)";

        }, 150 + index * 120);

    });

});

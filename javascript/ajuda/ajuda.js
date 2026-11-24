let idiomaAtual = "pt";

const traducoes = {
    pt: {
        menu: ["Inicial", "Viajar", "Sobre-nós"],
        ajuda: "Ajuda",
        login: "Fazer login",
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
        legais: ["Privacidade", "Termos", "Acessibilidade"],
        local: "🌐 Português (Brasil) · 📍 Curitiba"
    },

    en: {
        menu: ["Home", "Travel", "About us"],
        ajuda: "Help",
        login: "Log in",
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
        legais: ["Privacy", "Terms", "Accessibility"],
        local: "🌐 English · 📍 Curitiba"
    }
};


// Troca o texto só se o elemento existir (evita erro se algo faltar na página)
function setTexto(elemento, texto) {
    if (elemento && texto !== undefined) elemento.textContent = texto;
}

function setLista(seletor, textos) {
    document.querySelectorAll(seletor).forEach((el, i) => setTexto(el, textos[i]));
}


// APLICAR IDIOMA
function aplicarIdioma(idioma) {

    idiomaAtual = idioma;

    const textos = traducoes[idioma];

    // BOTÃO DE IDIOMA (vem do cabecalho.js)
    setTexto(
        document.getElementById("btnIdioma"),
        idioma === "pt" ? "🌐 PT-BR" : "🌐 EN"
    );

    // TÍTULO DA ABA
    document.title =
        idioma === "pt" ? "Ajuda - WN57" : "Help - WN57";

    // CABEÇALHO (menu, ajuda, login e cadastro)
    setLista("header nav a", textos.menu);
    setTexto(document.querySelector('.header-right > a:not([data-deslogado])'), textos.ajuda);
    setTexto(document.querySelector('a[href*="login.html"][data-deslogado]'), textos.login);
    setTexto(document.querySelector('a[href*="cadastro.html"][data-deslogado]'), textos.cadastro);

    // CARDS
    document.querySelectorAll(".categoria").forEach((card, index) => {
        if (!textos.cards[index]) return;
        setTexto(card.querySelector("h3"), textos.cards[index][0]);
        setTexto(card.querySelector("p"), textos.cards[index][1]);
    });

    // RODAPÉ
    setTexto(document.querySelector(".rodape-topo p"), textos.rodape);
    setLista(".rodape-links a", textos.links);
    setLista(".rodape-legais a", textos.legais);
    setTexto(document.querySelector(".rodape-bottom > span:last-child"), textos.local);

    // IDIOMA DO DOCUMENTO
    document.documentElement.lang =
        idioma === "pt" ? "pt-BR" : "en";
}


// ALTERNAR IDIOMA
function trocarIdioma() {

    const novoIdioma = idiomaAtual === "pt" ? "en" : "pt";

    aplicarIdioma(novoIdioma);

}


document.addEventListener("DOMContentLoaded", () => {

    // BOTÃO DE IDIOMA DO CABEÇALHO
    const botaoIdioma = document.getElementById("btnIdioma");

    if (botaoIdioma) {
        botaoIdioma.addEventListener("click", trocarIdioma);
    }

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
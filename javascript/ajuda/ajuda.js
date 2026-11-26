
const CHAVE_IDIOMA = "wn57_idioma";

const traducoes = {
    pt: {
        menu: ["Inicial", "Viajar", "Sobre-nós"],
        ajuda: "Ajuda",
        login: "Fazer login",
        cadastro: "Cadastre-se",

        titulo: "Ajuda - WN57",
        etiqueta: "CENTRAL DE ATENDIMENTO WN57",
        tituloPrincipal: "Como podemos ajudar você?",
        descricao: "Encontre respostas para suas dúvidas e tenha todo o suporte necessário para aproveitar sua experiência com a WN57.",

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

        acessar: "Acessar assunto →",
        suporteTitulo: "Não encontrou o que procurava?",
        suporteDescricao: "Nossa equipe está pronta para ajudar você. Entre em contato com o suporte WN57.",
        suporteBotao: "Falar com suporte →",

        marca: "Acesse a Central de Ajuda",
        endereco: "WN57 Tecnologia Ltda | Avenida Brasil, nº 949, Pinhais, Paraná, Brasil - CEP 83320-000",

        colunas: ["Empresa", "Produtos", "Cidadania global"],

        empresa: ["Sobre-Nós", "Blog", "Contato"],
        produtos: ["Viajar", "Como funciona", "Cadastre-se"],
        cidadania: ["Segurança", "Suporte", "Ajuda"],

        redes: ["LinkedIn", "YouTube", "Instagram", "X"],
        local: ["🌐 Português (Brasil)", "📍 Curitiba"],

        direitos: ["Privacidade", "Termos", "Acessibilidade"]
    },

    en: {
        menu: ["Home", "Travel", "About us"],
        ajuda: "Help",
        login: "Log in",
        cadastro: "Sign up",

        titulo: "Help - WN57",
        etiqueta: "WN57 CUSTOMER SUPPORT",
        tituloPrincipal: "How can we help you?",
        descricao: "Find answers to your questions and get all the support you need to enjoy your WN57 experience.",

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

        acessar: "Explore topic →",
        suporteTitulo: "Couldn't find what you were looking for?",
        suporteDescricao: "Our team is ready to help you. Contact WN57 support.",
        suporteBotao: "Contact support →",

        marca: "Visit the Help Center",
        endereco: "WN57 Tecnologia Ltda | Avenida Brasil, No. 949, Pinhais, Paraná, Brazil - ZIP 83320-000",

        colunas: ["Company", "Products", "Global citizenship"],

        empresa: ["About us", "Blog", "Contact"],
        produtos: ["Travel", "How it works", "Sign up"],
        cidadania: ["Safety", "Support", "Help"],

        redes: ["LinkedIn", "YouTube", "Instagram", "X"],
        local: ["🌐 English", "📍 Curitiba"],

        direitos: ["Privacy", "Terms", "Accessibility"]
    }
};


// ALTERA TEXTO COM SEGURANÇA
function setTexto(elemento, texto) {
    if (elemento && texto !== undefined) {
        elemento.textContent = texto;
    }
}


// ALTERA LISTAS DE ELEMENTOS
function setLista(seletor, textos) {
    document.querySelectorAll(seletor).forEach((elemento, index) => {
        if (textos[index] !== undefined) {
            setTexto(elemento, textos[index]);
        }
    });
}


// APLICA O IDIOMA
function aplicarIdioma(idioma) {

    idioma = traducoes[idioma] ? idioma : "pt";

    const t = traducoes[idioma];

    document.documentElement.lang =
        idioma === "pt" ? "pt-BR" : "en";

    document.title = t.titulo;


    // CABEÇALHO
    setLista(".header nav a", t.menu);

    const linksDireita = document.querySelectorAll(".header-direita a");

    linksDireita.forEach(link => {

        const href = (link.getAttribute("href") || "").toLowerCase();

        if (href.includes("ajuda")) {
            setTexto(link, t.ajuda);
        }

        if (href.includes("login") && link.hasAttribute("data-deslogado")) {
            setTexto(link, t.login);
        }

        if (href.includes("cadastro") && link.hasAttribute("data-deslogado")) {
            setTexto(link, t.cadastro);
        }
    });


    // INTRODUÇÃO
    setTexto(
        document.querySelector(".etiqueta-ajuda"),
        t.etiqueta
    );

    const titulo = document.querySelector(".introducao h1");

    if (titulo) {
        const destaque = titulo.querySelector("span");

        if (destaque) {
            titulo.childNodes.forEach(no => {
                if (no.nodeType === Node.TEXT_NODE && no.textContent.trim()) {
                    no.textContent = " " + (idioma === "pt" ? "Como podemos" : "How can we");
                }
            });

            setTexto(
                destaque,
                idioma === "pt" ? "ajudar você?" : "help you?"
            );
        } else {
            setTexto(titulo, t.tituloPrincipal);
        }
    }

    setTexto(
        document.querySelector(".introducao p"),
        t.descricao
    );


    // CARDS
    document.querySelectorAll(".categoria").forEach((card, index) => {

        if (!t.cards[index]) return;

        setTexto(card.querySelector("h3"), t.cards[index][0]);
        setTexto(card.querySelector("p"), t.cards[index][1]);
        setTexto(card.querySelector(".categoria-link"), t.acessar);
    });


    // SUPORTE
    setTexto(
        document.querySelector(".suporte-texto h2"),
        t.suporteTitulo
    );

    setTexto(
        document.querySelector(".suporte-texto p"),
        t.suporteDescricao
    );

    setTexto(
        document.querySelector(".btn-suporte"),
        t.suporteBotao
    );


    // IDENTIDADE DO RODAPÉ
    setTexto(
        document.querySelector(".ajuda-link"),
        t.marca
    );

    setTexto(
        document.querySelector(".rodape-topo .endereco"),
        t.endereco
    );


    // TÍTULOS DAS COLUNAS
    setLista(".rodape-coluna h3", t.colunas);


    // LINKS DAS COLUNAS
    const colunas = document.querySelectorAll(".rodape-coluna");

    if (colunas[0]) {
        setListaDentro(colunas[0], t.empresa);
    }

    if (colunas[1]) {
        setListaDentro(colunas[1], t.produtos);
    }

    if (colunas[2]) {
        setListaDentro(colunas[2], t.cidadania);
    }


    // LOCALIZAÇÃO
    setLista(".localizacao span", t.local);


    // LINKS LEGAIS
    setLista(".rodape-direitos a", t.direitos);


    // BOTÃO DO CABEÇALHO
    const botaoIdioma = document.getElementById("btnIdioma");

    setTexto(
        botaoIdioma,
        idioma === "pt" ? "🌐 PT-BR" : "🌐 EN"
    );
}


// TRADUZ LINKS DE UMA COLUNA
function setListaDentro(coluna, textos) {

    const links = coluna.querySelectorAll("a");

    links.forEach((link, index) => {
        if (textos[index] !== undefined) {
            setTexto(link, textos[index]);
        }
    });
}


// ATUALIZAÇÃO USADA PELO CABEÇALHO
window.atualizarIdiomaPagina = function () {

    const idioma = localStorage.getItem(CHAVE_IDIOMA) || "pt";

    aplicarIdioma(idioma);
};


// INICIALIZAÇÃO
document.addEventListener("DOMContentLoaded", () => {

    const idiomaSalvo = localStorage.getItem(CHAVE_IDIOMA) || "pt";

    aplicarIdioma(idiomaSalvo);


    // ACOMPANHA ALTERAÇÕES FEITAS PELO CABEÇALHO
    window.addEventListener("idiomaAlterado", () => {
        window.atualizarIdiomaPagina();
    });


    // ANIMAÇÃO DOS CARDS
    const categorias = document.querySelectorAll(".categoria");

    categorias.forEach((card, index) => {

        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";

        setTimeout(() => {

            card.style.transition =
                "opacity .5s ease, transform .5s ease";

            card.style.opacity = "1";
            card.style.transform = "translateY(0)";

        }, 100 + index * 100);

    });

});

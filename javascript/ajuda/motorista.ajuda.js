document.addEventListener("DOMContentLoaded", function () {

    // ELEMENTOS
    // Botão de idioma (vem do cabecalho.js)
    const botaoIdioma = document.getElementById("btnIdioma");
    const perguntas = document.querySelectorAll(".perguntas details");

    const expandir = document.getElementById("expandirTodas");
    const recolher = document.getElementById("recolherTodas");
    const voltarTopo = document.getElementById("voltarTopo");

    let idiomaAtual = "pt";

    // TRADUÇÕES
    const traducoes = {

        pt: {
            menu: ["Inicial", "Viajar", "Sobre-nós"],
            ajuda: "Ajuda",
            login: "Fazer login",
            cadastro: "Cadastre-se",

            titulo: "Motoristas",
            descricao: "Orientações para dúvidas relacionadas ao motorista e à viagem.",
            faq: "Perguntas frequentes",

            expandir: "Expandir todas",
            recolher: "Recolher todas",

            contato: "Precisa de mais ajuda?",
            contatoDescricao: "Conte ao suporte o que aconteceu para receber orientação.",
            contatoBotao: "Acessar suporte",

            suporte: "Suporte",

            rodapeMarca: "Estamos aqui para ajudar você.",
            privacidade: "Privacidade",
            termos: "Termos",
            acessibilidade: "Acessibilidade",
            idiomaRodape: "Português (Brasil)",
            cidade: "Curitiba",
            direitos: "© 2026 WN57",

            titulo_aba: "Motoristas • WN57",

            perguntas: [
                [
                    "Como confiro os dados do motorista?",
                    "Antes de entrar no veículo, confira os dados e as informações exibidas no aplicativo ou site."
                ],
                [
                    "O motorista ainda não chegou. O que faço?",
                    "Confira o local de embarque e as informações da corrida. Se necessário, utilize os canais de contato disponíveis."
                ],
                [
                    "Como relato um problema com o motorista?",
                    "Registre o ocorrido com informações objetivas e envie o relato pelo suporte da WN57."
                ],
                [
                    "Posso avaliar o motorista?",
                    "Se houver uma opção de avaliação após a viagem, use-a para compartilhar sua experiência de forma respeitosa."
                ]
            ]
        },

        en: {
            menu: ["Home", "Travel", "About us"],
            ajuda: "Help",
            login: "Log in",
            cadastro: "Sign up",

            titulo: "Drivers",
            descricao: "Guidance for questions related to the driver and your trip.",
            faq: "Frequently Asked Questions",

            expandir: "Expand all",
            recolher: "Collapse all",

            contato: "Need more help?",
            contatoDescricao: "Tell our support team what happened to receive guidance.",
            contatoBotao: "Access support",

            suporte: "Support",

            rodapeMarca: "We are here to help you.",
            privacidade: "Privacy",
            termos: "Terms",
            acessibilidade: "Accessibility",
            idiomaRodape: "English",
            cidade: "Curitiba",
            direitos: "© 2026 WN57",

            titulo_aba: "Drivers • WN57",

            perguntas: [
                [
                    "How can I check the driver's details?",
                    "Before getting into the vehicle, check the driver's details and the information displayed on the app or website."
                ],
                [
                    "The driver has not arrived yet. What should I do?",
                    "Check the pickup location and ride information. If necessary, use the available contact channels."
                ],
                [
                    "How can I report a problem with the driver?",
                    "Describe what happened clearly and submit your report through WN57 support."
                ],
                [
                    "Can I rate the driver?",
                    "If a rating option is available after the trip, use it to share your experience respectfully."
                ]
            ]
        }

    };

    // Troca o texto só se o elemento existir
    function setTexto(elemento, texto) {
        if (elemento && texto !== undefined) elemento.textContent = texto;
    }

    // EXPANDIR TODAS
    if (expandir) {

        expandir.addEventListener("click", function () {

            perguntas.forEach(function (pergunta) {
                pergunta.open = true;
            });

        });

    }

    // RECOLHER TODAS
    if (recolher) {

        recolher.addEventListener("click", function () {

            perguntas.forEach(function (pergunta) {
                pergunta.open = false;
            });

        });

    }

    // ATUALIZAR IDIOMA
    function atualizarIdioma() {

        const t = traducoes[idiomaAtual];

        document.documentElement.lang =
            idiomaAtual === "pt" ? "pt-BR" : "en";

        document.title = t.titulo_aba;

        // BOTÃO DE IDIOMA
        setTexto(botaoIdioma, idiomaAtual === "pt" ? "🌐 PT-BR" : "🌐 EN");

        // CABEÇALHO (menu, ajuda, login e cadastro)
        document.querySelectorAll("header nav a").forEach(function (link, i) {
            setTexto(link, t.menu[i]);
        });

        setTexto(document.querySelector(".header-right > a:not([data-deslogado])"), t.ajuda);
        setTexto(document.querySelector('a[href*="login.html"][data-deslogado]'), t.login);
        setTexto(document.querySelector('a[href*="cadastro.html"][data-deslogado]'), t.cadastro);

        // HERO
        setTexto(document.querySelector(".hero h1"), t.titulo);
        setTexto(document.querySelector(".hero p"), t.descricao);

        // PERGUNTAS
        setTexto(document.querySelector(".faq h2"), t.faq);

        perguntas.forEach(function (item, index) {

            if (!t.perguntas[index]) return;

            setTexto(item.querySelector("summary"), t.perguntas[index][0]);
            setTexto(item.querySelector("p"), t.perguntas[index][1]);

        });

        // CONTROLES
        if (expandir) {
            expandir.innerHTML =
                `<i class="fa-solid fa-plus"></i> ${t.expandir}`;
        }

        if (recolher) {
            recolher.innerHTML =
                `<i class="fa-solid fa-minus"></i> ${t.recolher}`;
        }

        // CONTATO
        setTexto(document.querySelector(".contato h2"), t.contato);
        setTexto(document.querySelector(".contato p"), t.contatoDescricao);
        setTexto(document.querySelector(".btn-contato"), t.contatoBotao);

        // RODAPÉ
        const linksRodape = document.querySelectorAll(".rodape-menu a");
        const linksInferiores = document.querySelectorAll(".rodape-links a");
        const local = document.querySelectorAll(".rodape-local span");

        setTexto(document.querySelector(".rodape-marca p"), t.rodapeMarca);

        // Rodapé tem 2 links: Suporte e Cadastre-se
        setTexto(linksRodape[0], t.suporte);
        setTexto(linksRodape[1], t.cadastro);

        setTexto(linksInferiores[0], t.privacidade);
        setTexto(linksInferiores[1], t.termos);
        setTexto(linksInferiores[2], t.acessibilidade);

        if (local[0]) {
            local[0].innerHTML =
                `<i class="fa-solid fa-globe"></i> ${t.idiomaRodape}`;
        }

        if (local[2]) {
            local[2].innerHTML =
                `<i class="fa-solid fa-location-dot"></i> ${t.cidade}`;
        }

        setTexto(document.querySelector(".copyright"), t.direitos);

    }

    // TROCAR PORTUGUÊS E INGLÊS
    if (botaoIdioma) {

        botaoIdioma.addEventListener("click", function (event) {

            event.preventDefault();

            idiomaAtual = idiomaAtual === "pt" ? "en" : "pt";

            atualizarIdioma();

        });

    } else {

        console.error("WN57: botão de idioma não encontrado.");

    }

    // VOLTAR AO TOPO
    if (voltarTopo) {

        voltarTopo.addEventListener("click", function () {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        });

    }

    // INICIAR EM PORTUGUÊS
    atualizarIdioma();

});
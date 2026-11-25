document.addEventListener("DOMContentLoaded", () => {

    // Elementos da página
    const perguntas = document.querySelectorAll(".perguntas details");

    const botaoExpandir = document.getElementById("expandirTodas");
    const botaoRecolher = document.getElementById("recolherTodas");
    const botaoTopo = document.getElementById("voltarTopo");

    // Botão de idioma (vem do cabecalho.js)
    const botaoIdioma = document.getElementById("btnIdioma");
    const idiomaRodape = document.getElementById("idiomaRodape");


    // ======================================================
    // TRADUÇÕES
    // ======================================================

    const traducoes = {

        "pt-BR": {
            menu: ["Inicial", "Viajar", "Sobre-nós"],
            ajuda: "Ajuda",
            login: "Fazer login",
            cadastro: "Cadastre-se",

            titulo: "Solicitar uma corrida",
            descricao: "Encontre respostas sobre como solicitar e acompanhar suas viagens.",

            faq: "Perguntas frequentes",
            expandir: "Expandir todas",
            recolher: "Recolher todas",

            pergunta1: "Como solicito uma corrida?",
            resposta1: "Entre na sua conta, informe o local de partida e o destino, confira os dados e confirme a solicitação.",

            pergunta2: "Posso alterar meu destino?",
            resposta2: "Se a corrida já começou, entre em contato com o motorista e verifique se a alteração é possível.",

            pergunta3: "Por que não encontro um motorista?",
            resposta3: "A disponibilidade pode variar conforme a região e o horário. Tente novamente após alguns instantes.",

            pergunta4: "Como cancelo uma corrida?",
            resposta4: "Acesse os detalhes da corrida e procure a opção de cancelamento. Confira se há alguma condição aplicável antes de confirmar.",

            ajudaTitulo: "Precisa de mais ajuda?",
            ajudaDescricao: "Acesse nossa página de suporte para buscar outras orientações.",
            suporte: "Acessar suporte",

            fraseRodape: "Estamos aqui para ajudar você.",
            linkSuporte: "Suporte",
            linkCadastro: "Cadastre-se",

            privacidade: "Privacidade",
            termos: "Termos",
            acessibilidade: "Acessibilidade",

            cidade: "Curitiba",
            idiomaRodape: "Português (Brasil)"
        },


        "en": {
            menu: ["Home", "Travel", "About us"],
            ajuda: "Help",
            login: "Log in",
            cadastro: "Sign up",

            titulo: "Request a ride",
            descricao: "Find answers about how to request and track your trips.",

            faq: "Frequently asked questions",
            expandir: "Expand all",
            recolher: "Collapse all",

            pergunta1: "How do I request a ride?",
            resposta1: "Log in to your account, enter the pickup location and destination, check the details and confirm your request.",

            pergunta2: "Can I change my destination?",
            resposta2: "If the ride has already started, contact the driver and check whether the change is possible.",

            pergunta3: "Why can't I find a driver?",
            resposta3: "Availability may vary depending on the area and the time. Try again in a few moments.",

            pergunta4: "How do I cancel a ride?",
            resposta4: "Open the ride details and look for the cancellation option. Check whether any conditions apply before confirming.",

            ajudaTitulo: "Need more help?",
            ajudaDescricao: "Visit our support page to find other guidance.",
            suporte: "Access support",

            fraseRodape: "We are here to help you.",
            linkSuporte: "Support",
            linkCadastro: "Sign Up",

            privacidade: "Privacy",
            termos: "Terms",
            acessibilidade: "Accessibility",

            cidade: "Curitiba",
            idiomaRodape: "English"
        }

    };


    // Troca o texto só se o elemento existir
    function setTexto(elemento, texto) {
        if (elemento && texto !== undefined) elemento.textContent = texto;
    }


    // ======================================================
    // ALTERAR IDIOMA
    // ======================================================

    function alterarIdioma(idioma) {

        const textos = traducoes[idioma];

        if (!textos) return;

        document.querySelectorAll("[data-i18n]").forEach(elemento => {

            const chave = elemento.getAttribute("data-i18n");

            if (textos[chave]) {
                elemento.textContent = textos[chave];
            }

        });

        // Cabeçalho (menu, ajuda, login e cadastro)
        document.querySelectorAll("header nav a").forEach((link, i) => {
            setTexto(link, textos.menu[i]);
        });
        setTexto(document.querySelector(".header-right > a:not([data-deslogado])"), textos.ajuda);
        setTexto(document.querySelector('a[href*="login.html"][data-deslogado]'), textos.login);
        setTexto(document.querySelector('a[href*="cadastro.html"][data-deslogado]'), textos.cadastro);

        // Atualiza o idioma do documento
        document.documentElement.lang = idioma;

        // Atualiza o texto do botão de idioma do cabeçalho
        setTexto(botaoIdioma, idioma === "pt-BR" ? "🌐 PT-BR" : "🌐 EN");

        // Atualiza o idioma no rodapé
        setTexto(idiomaRodape, textos.idiomaRodape);

        // Atualiza o título da aba
        document.title = idioma === "pt-BR"
            ? "Solicitar uma corrida • WN57"
            : "Request a ride • WN57";

        // Salva a preferência no navegador
        localStorage.setItem("idiomaWN57", idioma);

    }


    // Recupera o idioma salvo
    let idiomaAtual = localStorage.getItem("idiomaWN57") || "pt-BR";

    if (!traducoes[idiomaAtual]) idiomaAtual = "pt-BR";

    alterarIdioma(idiomaAtual);


    // ======================================================
    // BOTÃO DE IDIOMA
    // ======================================================

    if (botaoIdioma) {

        botaoIdioma.addEventListener("click", (event) => {

            event.preventDefault();

            idiomaAtual = idiomaAtual === "pt-BR" ? "en" : "pt-BR";

            alterarIdioma(idiomaAtual);

        });

    }


    // ======================================================
    // EXPANDIR TODAS AS PERGUNTAS
    // ======================================================

    if (botaoExpandir) {

        botaoExpandir.addEventListener("click", () => {

            perguntas.forEach(pergunta => {
                pergunta.open = true;
            });

        });

    }


    // ======================================================
    // RECOLHER TODAS AS PERGUNTAS
    // ======================================================

    if (botaoRecolher) {

        botaoRecolher.addEventListener("click", () => {

            perguntas.forEach(pergunta => {
                pergunta.open = false;
            });

        });

    }


    // ======================================================
    // VOLTAR AO TOPO
    // ======================================================

    if (botaoTopo) {

        botaoTopo.addEventListener("click", () => {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        });

    }


    // ======================================================
    // EXIBIR BOTÃO AO ROLAR A PÁGINA
    // ======================================================

    window.addEventListener("scroll", () => {

        if (!botaoTopo) return;

        if (window.scrollY > 300) {
            botaoTopo.classList.add("ativo");
        } else {
            botaoTopo.classList.remove("ativo");
        }

    });

});
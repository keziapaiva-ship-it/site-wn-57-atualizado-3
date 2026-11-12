
document.addEventListener("DOMContentLoaded", function () {

    // ELEMENTOS
    const botaoIdioma = document.querySelector(".idioma");
    const perguntas = document.querySelectorAll(".perguntas details");

    const expandir = document.getElementById("expandirTodas");
    const recolher = document.getElementById("recolherTodas");
    const voltarTopo = document.getElementById("voltarTopo");

    let idiomaAtual = "pt";

    // TRADUÇÕES
    const traducoes = {

        pt: {
            voltar: "Voltar para a Central de Ajuda",
            titulo: "Outros assuntos",
            descricao: "Encontre orientações para dúvidas que não se encaixam nas outras categorias.",
            faq: "Perguntas frequentes",

            expandir: "Expandir todas",
            recolher: "Recolher todas",

            contato: "Precisa de mais ajuda?",
            contatoDescricao: "Entre em contato com o suporte da WN57.",
            contatoBotao: "Acessar suporte",

            login: "Fazer Login",
            cadastro: "Cadastre-se",
            central: "Central de Ajuda",
            suporte: "Suporte",

            rodapeMarca: "Estamos aqui para ajudar você.",
            rodapeCentral: "Acesse a Central de Ajuda",
            privacidade: "Privacidade",
            termos: "Termos",
            acessibilidade: "Acessibilidade",
            idiomaRodape: "Português (Brasil)",
            cidade: "Curitiba",
            direitos: "© 2026 WN57",

            perguntas: [
                [
                    "Onde encontro ajuda para outro assunto?",
                    "Consulte as categorias da Central de Ajuda. Se não encontrar sua dúvida, acesse o suporte."
                ],
                [
                    "Como entro em contato com a WN57?",
                    "Acesse a página de suporte e confira as opções de contato disponíveis no seu site."
                ],
                [
                    "Quais informações devo incluir ao pedir ajuda?",
                    "Explique o que aconteceu, em qual página e quais etapas você realizou. Evite compartilhar senhas e dados sensíveis."
                ],
                [
                    "Posso enviar uma sugestão?",
                    "Sim. Use o canal de suporte disponível para descrever sua ideia ou sugestão de melhoria."
                ]
            ]
        },

        en: {
            voltar: "Back to Help Center",
            titulo: "Other topics",
            descricao: "Find guidance for questions that do not fit into the other categories.",
            faq: "Frequently Asked Questions",

            expandir: "Expand all",
            recolher: "Collapse all",

            contato: "Need more help?",
            contatoDescricao: "Contact WN57 support.",
            contatoBotao: "Access support",

            login: "Log In",
            cadastro: "Sign Up",
            central: "Help Center",
            suporte: "Support",

            rodapeMarca: "We are here to help you.",
            rodapeCentral: "Visit the Help Center",
            privacidade: "Privacy",
            termos: "Terms",
            acessibilidade: "Accessibility",
            idiomaRodape: "English",
            cidade: "Curitiba",
            direitos: "© 2026 WN57",

            perguntas: [
                [
                    "Where can I find help with another topic?",
                    "Check the Help Center categories. If you cannot find your answer, visit the support page."
                ],
                [
                    "How can I contact WN57?",
                    "Visit the support page and check the contact options available on your website."
                ],
                [
                    "What information should I include when asking for help?",
                    "Explain what happened, which page you were on and what steps you took. Avoid sharing passwords and sensitive information."
                ],
                [
                    "Can I send a suggestion?",
                    "Yes. Use the available support channel to describe your idea or suggestion for improvement."
                ]
            ]
        }

    };

    // EXPANDIR TODAS AS PERGUNTAS
    if (expandir) {

        expandir.addEventListener("click", function () {

            perguntas.forEach(function (pergunta) {
                pergunta.open = true;
            });

        });

    }

    // RECOLHER TODAS AS PERGUNTAS
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

        // BOTÃO DE IDIOMA
        if (botaoIdioma) {
            botaoIdioma.textContent =
                idiomaAtual === "pt" ? "🌐 PT-BR" : "🌐 EN";
        }

        // CABEÇALHO
        const menu = document.querySelectorAll(".menu a");

        if (menu[0]) menu[0].textContent = t.central;
        if (menu[1]) menu[1].textContent = t.suporte;

        const login = document.querySelector(".btn-login");
        const cadastro = document.querySelector(".btn-cadastro");

        if (login) login.textContent = t.login;
        if (cadastro) cadastro.textContent = t.cadastro;

        // VOLTAR
        const voltar = document.querySelector(".voltar");

        if (voltar) {
            voltar.innerHTML =
                `<i class="fa-solid fa-arrow-left"></i> ${t.voltar}`;
        }

        // HERO
        const titulo = document.querySelector(".hero h1");
        const descricao = document.querySelector(".hero p");

        if (titulo) titulo.textContent = t.titulo;
        if (descricao) descricao.textContent = t.descricao;

        // PERGUNTAS
        const tituloFaq = document.querySelector(".faq h2");

        if (tituloFaq) {
            tituloFaq.textContent = t.faq;
        }

        perguntas.forEach(function (item, index) {

            if (!t.perguntas[index]) return;

            const pergunta = item.querySelector("summary");
            const resposta = item.querySelector("p");

            if (pergunta) {
                pergunta.textContent = t.perguntas[index][0];
            }

            if (resposta) {
                resposta.textContent = t.perguntas[index][1];
            }

        });

        // BOTÕES DE EXPANSÃO
        if (expandir) {
            expandir.innerHTML =
                `<i class="fa-solid fa-plus"></i> ${t.expandir}`;
        }

        if (recolher) {
            recolher.innerHTML =
                `<i class="fa-solid fa-minus"></i> ${t.recolher}`;
        }

        // CONTATO
        const contatoTitulo = document.querySelector(".contato h2");
        const contatoDescricao = document.querySelector(".contato p");
        const contatoBotao = document.querySelector(".btn-contato");

        if (contatoTitulo) contatoTitulo.textContent = t.contato;
        if (contatoDescricao) contatoDescricao.textContent = t.contatoDescricao;
        if (contatoBotao) contatoBotao.textContent = t.contatoBotao;

        // RODAPÉ
        const marca = document.querySelector(".rodape-marca p");
        const linksRodape = document.querySelectorAll(".rodape-menu a");
        const linksInferiores = document.querySelectorAll(".rodape-links a");
        const local = document.querySelectorAll(".rodape-local span");
        const direitos = document.querySelector(".copyright");

        if (marca) marca.textContent = t.rodapeMarca;

        if (linksRodape[0]) linksRodape[0].textContent = t.rodapeCentral;
        if (linksRodape[1]) linksRodape[1].textContent = t.suporte;
        if (linksRodape[2]) linksRodape[2].textContent = t.cadastro;

        if (linksInferiores[0]) linksInferiores[0].textContent = t.privacidade;
        if (linksInferiores[1]) linksInferiores[1].textContent = t.termos;
        if (linksInferiores[2]) linksInferiores[2].textContent = t.acessibilidade;

        if (local[0]) {
            local[0].innerHTML =
                `<i class="fa-solid fa-globe"></i> ${t.idiomaRodape}`;
        }

        if (local[2]) {
            local[2].innerHTML =
                `<i class="fa-solid fa-location-dot"></i> ${t.cidade}`;
        }

        if (direitos) direitos.textContent = t.direitos;

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

document.addEventListener("DOMContentLoaded", () => {

    "use strict";

    // ========================================
    // ELEMENTOS
    // ========================================

    const formulario = document.getElementById("formProblema");
    const mensagem = document.getElementById("mensagemProblema");
    const perguntas = document.querySelectorAll(".perguntas details");

    // Botões de idioma aceitos (o cabeçalho é gerado pelo cabecalho.js e pode usar qualquer um destes)
    const SELETOR_IDIOMA = "#btnIdioma, .idioma-btn, .idioma";

    let idiomaAtual = "pt";

    // ========================================
    // TRADUÇÕES DA PÁGINA
    // ========================================

    const textos = {
        pt: {
            idioma: "🌐 PT-BR",
            voltar: "← Voltar para a Central de Ajuda",

            titulo: "Relatar um problema",
            descricao: "Encontre orientações para resolver falhas e comunicar dificuldades.",

            tagFormulario: "Relatar um problema",
            descricaoFormulario: "Conte o que aconteceu para que a equipe WN57 possa analisar.",

            tipo: "Tipo de problema",
            selecionar: "Selecione uma opção",
            site: "Site não funciona",
            mapa: "Erro no mapa ou localização",
            corrida: "Problema com uma corrida",
            pagamento: "Problema com pagamento",
            conta: "Problema com minha conta",
            seguranca: "Segurança",
            outro: "Outro problema",

            descricaoProblema: "Descreva o problema",
            placeholder: "Explique o que aconteceu e quando ocorreu...",
            email: "E-mail para contato (opcional)",
            emailPlaceholder: "seuemail@exemplo.com",
            enviar: "Enviar relato",

            tagContato: "PRECISA DE MAIS AJUDA?",
            tituloContato: "Estamos aqui para ajudar você.",
            descricaoContato: "Se precisar de orientação adicional, entre em contato com o suporte WN57.",
            suporte: "Acessar suporte →",

            tagFaq: "TIRE SUAS DÚVIDAS",
            tituloFaq: "Perguntas frequentes",

            perguntas: [
                "O site não está funcionando. O que faço?",
                "O mapa mostra meu local errado. Como resolvo?",
                "Como envio um relato de problema?",
                "O problema continua mesmo depois de tentar resolver?"
            ],

            respostas: [
                "Atualize a página e confira sua conexão. Se o problema continuar, tente novamente mais tarde e contate o suporte.",
                "Confira se a localização do dispositivo está ativada e verifique manualmente o endereço informado.",
                "Preencha o formulário desta página, descreva o ocorrido e envie seu relato para análise.",
                "Informe ao suporte o que você já tentou fazer e, se possível, inclua uma captura de tela sem dados pessoais sensíveis."
            ],

            rodape: "© 2026 WN57 • Todos os direitos reservados",

            sucesso: "Formulário validado! Para enviar o relato à equipe WN57, é necessário conectar o formulário ao servidor.",
            erro: "Confira os campos e tente novamente.",

            documentoTitulo: "Relatar um problema • WN57"
        },

        en: {
            idioma: "🌐 EN",
            voltar: "← Back to Help Center",

            titulo: "Report a problem",
            descricao: "Find guidance to solve issues and report difficulties.",

            tagFormulario: "Report a problem",
            descricaoFormulario: "Tell us what happened so the WN57 team can review it.",

            tipo: "Problem type",
            selecionar: "Select an option",
            site: "Website not working",
            mapa: "Map or location error",
            corrida: "Ride problem",
            pagamento: "Payment problem",
            conta: "Account problem",
            seguranca: "Safety",
            outro: "Other problem",

            descricaoProblema: "Describe the problem",
            placeholder: "Explain what happened and when it occurred...",
            email: "Contact email (optional)",
            emailPlaceholder: "youremail@example.com",
            enviar: "Submit report",

            tagContato: "NEED MORE HELP?",
            tituloContato: "We are here to help you.",
            descricaoContato: "If you need additional guidance, contact WN57 support.",
            suporte: "Access support →",

            tagFaq: "FREQUENTLY ASKED QUESTIONS",
            tituloFaq: "Frequently asked questions",

            perguntas: [
                "The website is not working. What should I do?",
                "The map shows the wrong location. How can I fix it?",
                "How do I submit a problem report?",
                "The problem continues after trying to fix it. What now?"
            ],

            respostas: [
                "Refresh the page and check your connection. If the problem continues, try again later and contact support.",
                "Check whether your device location is enabled and manually verify the address.",
                "Fill out the form on this page, describe what happened and submit your report for review.",
                "Tell support what you have already tried and, if possible, include a screenshot without sensitive personal information."
            ],

            rodape: "© 2026 WN57 • All rights reserved",

            sucesso: "Form validated! Connecting the form to the server is required to send your report to the WN57 team.",
            erro: "Check the fields and try again.",

            documentoTitulo: "Report a problem • WN57"
        }
    };

    // ========================================
    // MENU / CABEÇALHO
    // ========================================
    // O cabeçalho é gerado pelo cabecalho.js, então em vez de depender de classes
    // específicas, traduzimos qualquer texto conhecido que esteja dentro dele.
    // Para um item novo do menu, basta acrescentar um par [português, inglês].

    const MENU = [
        ["Inicial", "Home"],
        ["Viajar", "Ride"],
        ["Atividade", "Activity"],
        ["Entrar", "Log In"],
        ["Fazer login", "Log In"],
        ["Fazer Login", "Log In"],
        ["Cadastre-se", "Sign Up"],
        ["Ajuda", "Help"],
        ["Central de Ajuda", "Help Center"],
        ["Suporte", "Support"],
        ["Perfil", "Profile"],
        ["Minha conta", "My account"],
        ["Meu perfil", "My profile"],
        ["Sair", "Log out"]
    ];

    // texto em português (minúsculo) → { pt, en }
    const dicionarioMenu = {};
    MENU.forEach((par) => {
        dicionarioMenu[par[0].toLowerCase()] = { pt: par[0], en: par[1] };
    });

    // guarda o texto original (português) de cada item já traduzido
    const originaisMenu = new WeakMap();

    function traduzirCabecalho() {

        const raizes = document.querySelectorAll(
            "header, nav, .menu, .cabecalho, #cabecalho, #usuarioArea"
        );

        raizes.forEach((raiz) => {

            const andador = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT);
            let no;

            while ((no = andador.nextNode())) {

                const pai = no.parentElement;
                if (!pai) continue;

                // não mexe no botão de idioma nem no que estiver marcado para não traduzir
                if (pai.closest(SELETOR_IDIOMA) || pai.closest("[data-no-i18n]")) continue;

                // texto em português guardado na primeira vez que o item é visto
                let base = originaisMenu.get(no);

                if (base === undefined) {
                    if (!dicionarioMenu[no.nodeValue.trim().toLowerCase()]) continue;
                    base = no.nodeValue;
                    originaisMenu.set(no, base);
                }

                const entrada = dicionarioMenu[base.trim().toLowerCase()];
                if (!entrada) continue;

                // mantém os espaços e quebras de linha ao redor do texto
                no.nodeValue = base.replace(base.trim(), idiomaAtual === "pt" ? base.trim() : entrada.en);
            }
        });
    }

    // ========================================
    // FORMULÁRIO
    // ========================================

    if (formulario) {

        formulario.addEventListener("submit", (evento) => {

            evento.preventDefault();

            mensagem.className = "";
            mensagem.textContent = "";

            if (!formulario.checkValidity()) {

                formulario.reportValidity();

                mensagem.textContent = textos[idiomaAtual].erro;
                mensagem.classList.add("erro");

                return;
            }

            const tipo = document.getElementById("tipoProblema").value;
            const descricao = document.getElementById("descricaoProblema").value.trim();
            const email = document.getElementById("emailProblema").value.trim();

            if (!tipo || descricao.length < 10) {

                mensagem.textContent = textos[idiomaAtual].erro;
                mensagem.classList.add("erro");

                return;
            }

            console.log("Relato preenchido:", {
                tipoProblema: tipo,
                descricaoProblema: descricao,
                emailProblema: email
            });

            mensagem.textContent = textos[idiomaAtual].sucesso;
            mensagem.classList.add("sucesso");

        });

    }

    // ========================================
    // TROCA DE IDIOMA
    // ========================================

    function atualizarIdioma() {

        const t = textos[idiomaAtual];

        document.documentElement.lang = idiomaAtual === "pt" ? "pt-BR" : "en";

        // Botão de idioma (procurado de novo a cada troca, caso o cabeçalho tenha sido recriado)
        const botaoIdioma = document.querySelector(SELETOR_IDIOMA);

        if (botaoIdioma) {
            botaoIdioma.textContent = t.idioma;
        }

        // CABEÇALHO
        traduzirCabecalho();

        // VOLTAR
        const voltar = document.querySelector(".voltar");

        if (voltar) {
            voltar.textContent = t.voltar;
        }

        // APRESENTAÇÃO
        const heroTitulo = document.querySelector(".hero h1");
        const heroDescricao = document.querySelector(".hero p");

        if (heroTitulo) heroTitulo.textContent = t.titulo;
        if (heroDescricao) heroDescricao.textContent = t.descricao;

        // FORMULÁRIO
        const tituloFormulario = document.querySelector(".relatar-titulo h2");
        const descricaoFormulario = document.querySelector(".relatar-titulo p");

        if (tituloFormulario) tituloFormulario.textContent = t.tagFormulario;
        if (descricaoFormulario) descricaoFormulario.textContent = t.descricaoFormulario;

        const labels = document.querySelectorAll("#formProblema label");

        if (labels[0]) labels[0].textContent = t.tipo;
        if (labels[1]) labels[1].textContent = t.descricaoProblema;
        if (labels[2]) labels[2].textContent = t.email;

        const select = document.getElementById("tipoProblema");

        if (select) {

            const opcoes = [
                t.selecionar,
                t.site,
                t.mapa,
                t.corrida,
                t.pagamento,
                t.conta,
                t.seguranca,
                t.outro
            ];

            [...select.options].forEach((opcao, indice) => {
                if (opcoes[indice]) {
                    opcao.textContent = opcoes[indice];
                }
            });
        }

        const descricao = document.getElementById("descricaoProblema");
        const email = document.getElementById("emailProblema");
        const enviar = formulario?.querySelector('button[type="submit"]');

        if (descricao) descricao.placeholder = t.placeholder;
        if (email) email.placeholder = t.emailPlaceholder;
        if (enviar) enviar.textContent = t.enviar;

        // CONTATO
        const contato = document.querySelector(".contato");

        if (contato) {

            const tag = contato.querySelector(".tag");
            const titulo = contato.querySelector("h2");
            const paragrafo = contato.querySelector("p");
            const link = contato.querySelector("a");

            if (tag) tag.textContent = t.tagContato;
            if (titulo) titulo.textContent = t.tituloContato;
            if (paragrafo) paragrafo.textContent = t.descricaoContato;
            if (link) link.textContent = t.suporte;
        }

        // PERGUNTAS FREQUENTES
        const tagFaq = document.querySelector(".faq .tag");
        const tituloFaq = document.querySelector(".faq h2");

        if (tagFaq) tagFaq.textContent = t.tagFaq;
        if (tituloFaq) tituloFaq.textContent = t.tituloFaq;

        perguntas.forEach((pergunta, indice) => {

            const resumo = pergunta.querySelector("summary");
            const resposta = pergunta.querySelector("p");

            if (resumo && t.perguntas[indice]) {
                resumo.textContent = t.perguntas[indice];
            }

            if (resposta && t.respostas[indice]) {
                resposta.textContent = t.respostas[indice];
            }

        });

        // RODAPÉ
        const rodape = document.querySelector(".rodape");

        if (rodape) {
            rodape.textContent = t.rodape;
        }

        document.title = t.documentoTitulo;
    }

    // Clique no botão de idioma
    // Delegação no document: funciona mesmo que o cabeçalho seja criado depois
    document.addEventListener("click", (evento) => {

        const alvo = evento.target.closest(SELETOR_IDIOMA);
        if (!alvo) return;

        evento.preventDefault();

        idiomaAtual = idiomaAtual === "pt" ? "en" : "pt";
        atualizarIdioma();

    });

    // ========================================
    // PERGUNTAS FREQUENTES
    // ========================================

    perguntas.forEach((pergunta) => {

        pergunta.addEventListener("toggle", () => {

            pergunta.classList.toggle("aberta", pergunta.open);

        });

    });

    // ========================================
    // INICIALIZAÇÃO
    // ========================================

    atualizarIdioma();

    console.log("WN57: Página Relatar um problema carregada!");

});

document.addEventListener("DOMContentLoaded", () => {

    "use strict";

    // ELEMENTOS DA PÁGINA
    const perguntas = [...document.querySelectorAll(".perguntas details")];

    const botaoIdioma = document.getElementById("trocarIdioma");
    const expandirTodas = document.getElementById("expandirTodas");
    const recolherTodas = document.getElementById("recolherTodas");
    const totalPerguntas = document.getElementById("totalPerguntas");

    if (!perguntas.length) {
        console.error("WN57: Nenhuma pergunta frequente foi encontrada.");
        return;
    }

    // TEXTOS ORIGINAIS
    const textosOriginais = perguntas.map((item) => ({
        pergunta: item.querySelector("summary")?.textContent.trim() || "",
        resposta: item.querySelector(".resposta-conteudo p")?.textContent.trim() || ""
    }));

    // TRADUÇÕES
    const traducoes = {

        pt: {

            login: "Fazer login",
            cadastro: "Cadastre-se",

            voltar: "← Voltar para a Central de Ajuda",

            tag: "CUIDADO E PROTEÇÃO",
            titulo: "Segurança",

            descricao: "Saiba como cuidar da sua segurança e relatar situações preocupantes.",

            faq: "Perguntas frequentes",

            perguntas: textosOriginais.map(item => item.pergunta),
            respostas: textosOriginais.map(item => item.resposta),

            contatoTag: "PRECISA DE AJUDA?",
            contatoTitulo: "Estamos aqui para ajudar você.",
            contatoDescricao: "Entre em contato com o suporte quando estiver em segurança.",

            suporte: "Acessar suporte",
            fraseRodape: "Estamos aqui para ajudar você.",

            central: "Central de Ajuda",
            privacidade: "Privacidade",
            termos: "Termos",
            acessibilidade: "Acessibilidade",

            expandir: "＋ Expandir todas",
            recolher: "－ Recolher todas",

            total: "perguntas",

            copiar: "Copiar resposta",

            avaliacao: "Esta informação foi útil?",

            sim: "Sim",
            nao: "Não",

            copiado: "Resposta copiada!",
            erroCopiar: "Não foi possível copiar a resposta.",

            obrigado: "Obrigado pela sua avaliação!",

            idioma: "Idioma alterado para português!"

        },

        en: {

            login: "Log in",
            cadastro: "Sign up",

            voltar: "← Back to Help Center",

            tag: "CARE AND PROTECTION",
            titulo: "Safety",

            descricao: "Learn how to stay safe and report concerning situations.",

            faq: "Frequently Asked Questions",

            perguntas: [
                "How can I confirm I'm entering the correct vehicle?",
                "What should I do if I feel unsafe?",
                "How can I report a safety concern?",
                "How can I protect my personal data?"
            ],

            respostas: [
                "Check the vehicle identification and the driver's details before getting in. If anything does not match, do not enter.",

                "Prioritize your safety, find a safe place and, in an emergency, contact local emergency services.",

                "Once you are safe, contact WN57 support and describe what happened.",

                "Do not share your password, access codes or unnecessary personal information with strangers."
            ],

            contatoTag: "NEED HELP?",
            contatoTitulo: "We are here to help you.",
            contatoDescricao: "Contact support once you are in a safe place.",

            suporte: "Contact support",
            fraseRodape: "We are here to help you.",

            central: "Help Center",
            privacidade: "Privacy",
            termos: "Terms",
            acessibilidade: "Accessibility",

            expandir: "＋ Expand all",
            recolher: "－ Collapse all",

            total: "questions",

            copiar: "Copy answer",

            avaliacao: "Was this information helpful?",

            sim: "Yes",
            nao: "No",

            copiado: "Answer copied!",
            erroCopiar: "Could not copy the answer.",

            obrigado: "Thank you for your feedback!",

            idioma: "Language changed to English!"

        }

    };

    // CONFIGURAÇÕES
    let idiomaAtual = "pt";
    let temporizadorAviso;

    let avaliacoes = {};

    try {

        avaliacoes = JSON.parse(
            localStorage.getItem("wn57_avaliacoes_seguranca") || "{}"
        ) || {};

    } catch (erro) {

        avaliacoes = {};

    }

    // NOTIFICAÇÕES
    function notificar(mensagem) {

        let aviso = document.querySelector(".wn57-notificacao");

        if (!aviso) {

            aviso = document.createElement("div");

            aviso.className = "wn57-notificacao";

            aviso.setAttribute("role", "status");

            aviso.setAttribute("aria-live", "polite");

            document.body.appendChild(aviso);

        }

        aviso.textContent = mensagem;

        aviso.classList.add("mostrar");

        window.clearTimeout(temporizadorAviso);

        temporizadorAviso = window.setTimeout(() => {

            aviso.classList.remove("mostrar");

        }, 2800);

    }

    // ATUALIZAR AVALIAÇÕES
    function atualizarAvaliacao(pergunta, indice) {

        const area = pergunta.querySelector(".wn57-avaliacao");

        if (!area) return;

        const t = traducoes[idiomaAtual];

        area.querySelector("span").textContent = t.avaliacao;

        const botoes = area.querySelectorAll("button");

        botoes[0].textContent = `👍 ${t.sim}`;

        botoes[1].textContent = `👎 ${t.nao}`;

        botoes[0].classList.toggle(
            "selecionado",
            avaliacoes[indice] === "sim"
        );

        botoes[1].classList.toggle(
            "selecionado",
            avaliacoes[indice] === "nao"
        );

    }

    // SALVAR AVALIAÇÃO
    function salvarAvaliacao(indice, valor) {

        avaliacoes[indice] = valor;

        try {

            localStorage.setItem(
                "wn57_avaliacoes_seguranca",
                JSON.stringify(avaliacoes)
            );

        } catch (erro) {

            console.warn(
                "WN57: Não foi possível salvar a avaliação neste navegador."
            );

        }

        atualizarAvaliacao(perguntas[indice], indice);

        notificar(traducoes[idiomaAtual].obrigado);

    }

    // COPIAR RESPOSTAS
    async function copiarTexto(texto) {

        if (navigator.clipboard && window.isSecureContext) {

            await navigator.clipboard.writeText(texto);

            return;

        }

        const campo = document.createElement("textarea");

        campo.value = texto;

        campo.setAttribute("readonly", "");

        campo.style.position = "fixed";

        campo.style.opacity = "0";

        document.body.appendChild(campo);

        campo.select();

        const copiou = document.execCommand("copy");

        campo.remove();

        if (!copiou) {
            throw new Error("Falha ao copiar texto.");
        }

    }

    // CRIAR BOTÕES DE CADA PERGUNTA
    perguntas.forEach((pergunta, indice) => {

        const resposta = pergunta.querySelector(".resposta-conteudo");

        if (!resposta) return;

        // BOTÃO COPIAR
        const botaoCopiar = document.createElement("button");

        botaoCopiar.type = "button";

        botaoCopiar.className = "wn57-copiar";

        botaoCopiar.addEventListener("click", async () => {

            const texto = resposta.querySelector("p")?.textContent.trim() || "";

            try {

                await copiarTexto(texto);

                notificar(traducoes[idiomaAtual].copiado);

            } catch (erro) {

                notificar(traducoes[idiomaAtual].erroCopiar);

            }

        });

        resposta.appendChild(botaoCopiar);

        // AVALIAÇÃO
        const avaliacao = document.createElement("div");

        avaliacao.className = "wn57-avaliacao";

        const legenda = document.createElement("span");

        const sim = document.createElement("button");

        const nao = document.createElement("button");

        sim.type = "button";

        nao.type = "button";

        sim.addEventListener("click", () => {

            salvarAvaliacao(indice, "sim");

        });

        nao.addEventListener("click", () => {

            salvarAvaliacao(indice, "nao");

        });

        avaliacao.append(legenda, sim, nao);

        resposta.appendChild(avaliacao);

        atualizarAvaliacao(pergunta, indice);

        botaoCopiar.textContent = traducoes[idiomaAtual].copiar;

    });

    // EXPANDIR TODAS
    expandirTodas?.addEventListener("click", () => {

        perguntas.forEach(pergunta => {

            pergunta.open = true;

        });

    });

    // RECOLHER TODAS
    recolherTodas?.addEventListener("click", () => {

        perguntas.forEach(pergunta => {

            pergunta.open = false;

        });

    });

    // ATUALIZAR IDIOMA
    function atualizarIdioma() {

        const t = traducoes[idiomaAtual];

        document.documentElement.lang =
            idiomaAtual === "pt" ? "pt-BR" : "en";

        const textoIdioma = botaoIdioma?.querySelector("span");

        if (textoIdioma) {

            textoIdioma.textContent =
                idiomaAtual === "pt" ? "PT-BR" : "EN";

        }

        // ALTERAR TEXTOS DA PÁGINA
        const definirTexto = (seletor, texto) => {

            const elemento = document.querySelector(seletor);

            if (elemento) {

                elemento.textContent = texto;

            }

        };

        definirTexto(".link-login", t.login);

        definirTexto(".btn-cadastro", t.cadastro);

        definirTexto(".voltar", t.voltar);

        definirTexto(".hero-tag", t.tag);

        definirTexto(".hero h1", t.titulo);

        definirTexto(".hero p", t.descricao);

        definirTexto(".faq h2", t.faq);

        definirTexto(".contato .tag", t.contatoTag);

        definirTexto(".contato h2", t.contatoTitulo);

        definirTexto(".contato p", t.contatoDescricao);

        definirTexto(".btn-suporte", t.suporte + " →");

        definirTexto(".rodape-frase", t.fraseRodape);

        // TRADUZIR PERGUNTAS E RESPOSTAS
        perguntas.forEach((pergunta, indice) => {

            const resumo = pergunta.querySelector("summary");

            const textoResposta =
                pergunta.querySelector(".resposta-conteudo p");

            const copiar =
                pergunta.querySelector(".wn57-copiar");

            if (resumo) {

                resumo.textContent = t.perguntas[indice];

            }

            if (textoResposta) {

                textoResposta.textContent = t.respostas[indice];

            }

            if (copiar) {

                copiar.textContent = t.copiar;

            }

            atualizarAvaliacao(pergunta, indice);

        });

        // CONTROLES
        if (totalPerguntas) {

            totalPerguntas.textContent =
                `${perguntas.length} ${t.total}`;

        }

        if (expandirTodas) {

            expandirTodas.textContent = t.expandir;

        }

        if (recolherTodas) {

            recolherTodas.textContent = t.recolher;

        }

        // RODAPÉ
        const textosRodape = [

            ["ajuda.html", t.central],

            ["suporte.html", idiomaAtual === "pt" ? "Suporte" : "Support"],

            ["privacidade.html", t.privacidade],

            ["termos.html", t.termos],

            ["acessibilidade.html", t.acessibilidade]

        ];

        document.querySelectorAll(".rodape a").forEach(link => {

            const href = link.getAttribute("href") || "";

            const item = textosRodape.find(
                ([caminho]) => href.includes(caminho)
            );

            if (item) {

                link.textContent = item[1];

            }

        });

    }

    // BOTÃO DE IDIOMA
    botaoIdioma?.addEventListener("click", () => {

        idiomaAtual = idiomaAtual === "pt" ? "en" : "pt";

        atualizarIdioma();

        notificar(traducoes[idiomaAtual].idioma);

    });

    // ANIMAÇÕES
    if (
        "IntersectionObserver" in window &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {

        const observador = new IntersectionObserver(
            (entradas, observer) => {

                entradas.forEach(entrada => {

                    if (entrada.isIntersecting) {

                        entrada.target.classList.add("wn57-visivel");

                        observer.unobserve(entrada.target);

                    }

                });

            },
            { threshold: 0.12 }
        );

        document.querySelectorAll(
            ".hero, .faq, .perguntas details, .contato"
        ).forEach(elemento => {

            elemento.classList.add("wn57-animar");

            observador.observe(elemento);

        });

    }

    // VOLTAR AO TOPO
    const voltarTopo = document.createElement("button");

    voltarTopo.type = "button";

    voltarTopo.className = "wn57-voltar-topo";

    voltarTopo.textContent = "↑";

    voltarTopo.setAttribute("aria-label", "Voltar ao topo");

    document.body.appendChild(voltarTopo);

    window.addEventListener("scroll", () => {

        voltarTopo.classList.toggle(
            "visivel",
            window.scrollY > 350
        );

    }, { passive: true });

    voltarTopo.addEventListener("click", () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

    // BARRA DE PROGRESSO
    const progresso = document.createElement("div");

    progresso.className = "wn57-progresso";

    document.body.appendChild(progresso);

    function atualizarProgresso() {

        const altura =
            document.documentElement.scrollHeight - window.innerHeight;

        const porcentagem =
            altura > 0 ? (window.scrollY / altura) * 100 : 0;

        progresso.style.width =
            `${Math.min(porcentagem, 100)}%`;

    }

    window.addEventListener("scroll", atualizarProgresso, {
        passive: true
    });

    window.addEventListener("resize", atualizarProgresso);

    atualizarProgresso();

    // ANO AUTOMÁTICO
    const ano = document.getElementById("anoAtual");

    if (ano) {

        ano.textContent = new Date().getFullYear();

    }

    // INICIALIZAÇÃO
    atualizarIdioma();

    console.log("WN57: Página Segurança carregada corretamente.");

});

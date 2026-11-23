
document.addEventListener("DOMContentLoaded", () => {

    "use strict";

    // ==========================================
    // ELEMENTOS DA PÁGINA
    // ==========================================

    const perguntas = [...document.querySelectorAll(".perguntas details")];
    const secaoPerguntas = document.querySelector(".perguntas");
    const botaoIdioma = document.querySelector(".idioma");
    const footer = document.querySelector(".rodape");

    let idiomaAtual = "pt";
    let timerNotificacao;

    if (!secaoPerguntas || !perguntas.length) {
        console.error("WN57: Perguntas frequentes não encontradas.");
        return;
    }

    // ==========================================
    // TEXTOS ORIGINAIS
    // ==========================================

    const textosOriginais = perguntas.map(pergunta => ({
        pergunta: pergunta.querySelector("summary")?.textContent.trim() || "",
        resposta: pergunta.querySelector("p")?.textContent.trim() || ""
    }));

    // ==========================================
    // TRADUÇÕES
    // ==========================================

    const traducoes = {

        pt: {
            login: "Fazer login",
            cadastro: "Cadastre-se",

            tagFaq: "TIRE SUAS DÚVIDAS",
            tituloFaq: "Perguntas frequentes",

            perguntas: textosOriginais.map(item => item.pergunta),
            respostas: textosOriginais.map(item => item.resposta),

            tagSuporte: "PRECISA DE AJUDA?",
            tituloSuporte: "Estamos aqui para ajudar você.",
            descricaoSuporte: "Acesse a Central de Ajuda para encontrar outras orientações sobre sua conta, pagamentos e segurança.",
            linkSuporte: "Acessar suporte →",

            central: "Acesse a Central de Ajuda",

            endereco: "WN57 Tecnologia Ltda | Avenida Brasil, nº 949, Pinhais, Paraná, Brasil - CEP 83320-000",

            colunas: [
                ["Empresa", "Quem somos", "Investidores", "Blog", "Carreiras"],
                ["Produtos", "Viajar", "Gift cards", "WN57 Health", "WN57 Advertising"],
                ["Cidadania global", "Segurança", "Sustentabilidade"],
                ["Viagem", "Reservar", "Aeroportos", "Hotéis", "Cidades"]
            ],

            localizacao: ["🌐 Português (Brasil)", "📍 Curitiba"],

            direitos: ["Privacidade", "Termos", "Acessibilidade"],

            expandir: "＋ Expandir todas",
            recolher: "－ Recolher todas",

            total: "perguntas disponíveis",

            copiar: "Copiar resposta",
            copiado: "Resposta copiada!",
            erroCopiar: "Não foi possível copiar a resposta.",

            avaliacao: "Esta informação foi útil?",
            sim: "Sim 👍",
            nao: "Não 👎",

            obrigado: "Obrigado pela sua avaliação!",

            abertas: "Todas as perguntas foram abertas!",
            fechadas: "Todas as perguntas foram recolhidas!"
        },

        en: {
            login: "Log in",
            cadastro: "Sign up",

            tagFaq: "FREQUENTLY ASKED QUESTIONS",
            tituloFaq: "Frequently asked questions",

            perguntas: [
                "How do I request a ride?",
                "Can I change my destination?",
                "Why can't I find a driver?",
                "How do I cancel a ride?"
            ],

            respostas: [
                "Log in to your account, enter your pickup location and destination, check the details and confirm your request.",

                "If the ride has already started, contact the driver and check whether the change is possible.",

                "Availability may vary depending on the region and time. Try again in a few moments.",

                "Open your ride details and look for the cancellation option. Check the conditions before confirming."
            ],

            tagSuporte: "NEED HELP?",
            tituloSuporte: "We are here to help you.",
            descricaoSuporte: "Visit the Help Center to find more information about your account, payments and safety.",
            linkSuporte: "Access support →",

            central: "Visit the Help Center",

            endereco: "WN57 Tecnologia Ltda | Avenida Brasil, No. 949, Pinhais, Paraná, Brazil - ZIP 83320-000",

            colunas: [
                ["Company", "About us", "Investors", "Blog", "Careers"],
                ["Products", "Ride", "Gift cards", "WN57 Health", "WN57 Advertising"],
                ["Global citizenship", "Safety", "Sustainability"],
                ["Travel", "Book", "Airports", "Hotels", "Cities"]
            ],

            localizacao: ["🌐 English", "📍 Curitiba"],

            direitos: ["Privacy", "Terms", "Accessibility"],

            expandir: "＋ Expand all",
            recolher: "－ Collapse all",

            total: "questions available",

            copiar: "Copy answer",
            copiado: "Answer copied!",
            erroCopiar: "Could not copy the answer.",

            avaliacao: "Was this information helpful?",
            sim: "Yes 👍",
            nao: "No 👎",

            obrigado: "Thank you for your feedback!",

            abertas: "All questions have been expanded!",
            fechadas: "All questions have been collapsed!"
        }

    };

    // ==========================================
    // NOTIFICAÇÕES
    // ==========================================

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

        clearTimeout(timerNotificacao);

        timerNotificacao = setTimeout(() => {

            aviso.classList.remove("mostrar");

        }, 2800);

    }

    // ==========================================
    // ACORDEÃO
    // ==========================================

    // IMPORTANTE:
    // Não existe mais código para fechar outras perguntas.
    // Cada pergunta funciona individualmente.

    perguntas.forEach(pergunta => {

        pergunta.addEventListener("toggle", () => {

            pergunta.classList.toggle(
                "aberta",
                pergunta.open
            );

        });

    });

    // ==========================================
    // CONTROLES DE EXPANDIR E RECOLHER
    // ==========================================

    // Remove controles antigos duplicados.

    document.querySelectorAll(
        ".wn57-controles, .wn57-controles-faq"
    ).forEach(controle => controle.remove());

    const controles = document.createElement("div");

    controles.className = "wn57-controles";

    const acoes = document.createElement("div");

    acoes.className = "wn57-acoes";

    const botaoExpandir = document.createElement("button");

    botaoExpandir.type = "button";

    const botaoRecolher = document.createElement("button");

    botaoRecolher.type = "button";

    const contador = document.createElement("span");

    contador.className = "wn57-total";

    acoes.append(botaoExpandir, botaoRecolher);

    controles.append(acoes, contador);

    secaoPerguntas.before(controles);

    // EXPANDIR TODAS

    botaoExpandir.addEventListener("click", () => {

        perguntas.forEach(pergunta => {

            pergunta.open = true;

            pergunta.classList.add("aberta");

        });

        notificar(traducoes[idiomaAtual].abertas);

    });

    // RECOLHER TODAS

    botaoRecolher.addEventListener("click", () => {

        perguntas.forEach(pergunta => {

            pergunta.open = false;

            pergunta.classList.remove("aberta");

        });

        notificar(traducoes[idiomaAtual].fechadas);

    });

    // ==========================================
    // COPIAR RESPOSTAS
    // ==========================================

    async function copiarTexto(texto) {

        if (navigator.clipboard && window.isSecureContext) {

            await navigator.clipboard.writeText(texto);

            return;

        }

        const campo = document.createElement("textarea");

        campo.value = texto;

        campo.setAttribute("readonly", "");

        campo.style.position = "fixed";
        campo.style.left = "-9999px";

        document.body.appendChild(campo);

        campo.select();

        const sucesso = document.execCommand("copy");

        campo.remove();

        if (!sucesso) {

            throw new Error("Não foi possível copiar.");

        }

    }

    perguntas.forEach(pergunta => {

        const resposta = pergunta.querySelector("p");

        if (!resposta) return;

        const botaoCopiar = document.createElement("button");

        botaoCopiar.type = "button";

        botaoCopiar.className = "wn57-copiar";

        botaoCopiar.addEventListener("click", async () => {

            try {

                await copiarTexto(resposta.textContent.trim());

                notificar(traducoes[idiomaAtual].copiado);

            } catch (erro) {

                notificar(traducoes[idiomaAtual].erroCopiar);

            }

        });

        resposta.after(botaoCopiar);

    });

    // ==========================================
    // AVALIAÇÃO DAS RESPOSTAS
    // ==========================================

    const chaveAvaliacoes = "wn57_avaliacoes_usuario";

    let avaliacoes = {};

    try {

        avaliacoes = JSON.parse(
            localStorage.getItem(chaveAvaliacoes) || "{}"
        ) || {};

    } catch (erro) {

        avaliacoes = {};

    }

    function atualizarBotoesAvaliacao(area, indice) {

        const botoes = area.querySelectorAll("button");

        const t = traducoes[idiomaAtual];

        if (botoes[0]) {

            botoes[0].textContent = t.sim;

            botoes[0].classList.toggle(
                "selecionado",
                avaliacoes[indice] === "sim"
            );

        }

        if (botoes[1]) {

            botoes[1].textContent = t.nao;

            botoes[1].classList.toggle(
                "selecionado",
                avaliacoes[indice] === "nao"
            );

        }

    }

    perguntas.forEach((pergunta, indice) => {

        const resposta = pergunta.querySelector("p");

        if (!resposta) return;

        const avaliacao = document.createElement("div");

        avaliacao.className = "wn57-avaliacao";

        const legenda = document.createElement("span");

        const sim = document.createElement("button");

        const nao = document.createElement("button");

        sim.type = "button";
        nao.type = "button";

        avaliacao.append(legenda, sim, nao);

        resposta.after(avaliacao);

        function salvarAvaliacao(valor) {

            avaliacoes[indice] = valor;

            try {

                localStorage.setItem(
                    chaveAvaliacoes,
                    JSON.stringify(avaliacoes)
                );

            } catch (erro) {

                console.warn("Não foi possível salvar a avaliação.");

            }

            atualizarBotoesAvaliacao(avaliacao, indice);

            notificar(traducoes[idiomaAtual].obrigado);

        }

        sim.addEventListener("click", () => {

            salvarAvaliacao("sim");

        });

        nao.addEventListener("click", () => {

            salvarAvaliacao("nao");

        });

        pergunta.dataset.avaliacao = indice;

    });

    // ==========================================
    // ATUALIZAR IDIOMA
    // ==========================================

    function atualizarIdioma() {

        const t = traducoes[idiomaAtual];

        document.documentElement.lang =
            idiomaAtual === "pt" ? "pt-BR" : "en";

        // BOTÃO DE IDIOMA

        if (botaoIdioma) {

            const icone = botaoIdioma.querySelector("i");

            botaoIdioma.textContent =
                idiomaAtual === "pt" ? "🌐 PT-BR" : "🌐 EN";

            if (icone) {

                botaoIdioma.prepend(icone);

            }

        }

        // TÍTULO DA ABA

        document.title = idiomaAtual === "pt"
            ? "Solicitar uma corrida • WN57"
            : "Request a ride • WN57";

        // CABEÇALHO

        const linksCabecalho = document.querySelectorAll(
            ".header-direita a, .cabecalho nav a, header nav a"
        );

        linksCabecalho.forEach(link => {

            const href = link.getAttribute("href") || "";

            // Verifica cadastro primeiro, pois o endereço também contém "login"
            if (href.includes("cadastro")) {

                link.textContent = t.cadastro;

            } else if (href.includes("login")) {

                link.textContent = t.login;

            }

        });

        // PERGUNTAS FREQUENTES

        const tagFaq = document.querySelector(".faq .tag");

        const tituloFaq = document.querySelector(".faq h2");

        if (tagFaq) tagFaq.textContent = t.tagFaq;

        if (tituloFaq) tituloFaq.textContent = t.tituloFaq;

        perguntas.forEach((pergunta, indice) => {

            const resumo = pergunta.querySelector("summary");

            const resposta = pergunta.querySelector("p");

            const botaoCopiar = pergunta.querySelector(".wn57-copiar");

            const avaliacao = pergunta.querySelector(".wn57-avaliacao");

            if (resumo) {

                resumo.textContent = t.perguntas[indice] ||
                    textosOriginais[indice].pergunta;

            }

            if (resposta) {

                resposta.textContent = t.respostas[indice] ||
                    textosOriginais[indice].resposta;

            }

            if (botaoCopiar) {

                botaoCopiar.textContent = t.copiar;

            }

            if (avaliacao) {

                const legenda = avaliacao.querySelector("span");

                if (legenda) {

                    legenda.textContent = t.avaliacao;

                }

                atualizarBotoesAvaliacao(avaliacao, indice);

            }

        });

        // CONTROLES

        botaoExpandir.textContent = t.expandir;

        botaoRecolher.textContent = t.recolher;

        contador.textContent = `${perguntas.length} ${t.total}`;

        // SEÇÃO DE SUPORTE

        const seguranca = document.querySelector(".seguranca");

        if (seguranca) {

            const tag = seguranca.querySelector(".tag");

            const titulo = seguranca.querySelector("h2");

            const descricao = seguranca.querySelector("p");

            const link = seguranca.querySelector("a");

            if (tag) tag.textContent = t.tagSuporte;

            if (titulo) titulo.textContent = t.tituloSuporte;

            if (descricao) descricao.textContent = t.descricaoSuporte;

            if (link) link.textContent = t.linkSuporte;

        }

        // CENTRAL DE AJUDA

        const linkCentral = document.querySelector(".rodape-topo a");

        if (linkCentral) {

            linkCentral.textContent = t.central;

        }

        // ENDEREÇO

        const endereco = document.querySelector(".endereco");

        if (endereco) {

            endereco.textContent = t.endereco;

        }

        // COLUNAS DO RODAPÉ

        document.querySelectorAll(".rodape-coluna").forEach((coluna, indice) => {

            const textos = t.colunas[indice];

            if (!textos) return;

            const titulo = coluna.querySelector("h3");

            if (titulo) {

                titulo.textContent = textos[0];

            }

            coluna.querySelectorAll("a").forEach((link, index) => {

                if (textos[index + 1]) {

                    link.textContent = textos[index + 1];

                }

            });

        });

        // LOCALIZAÇÃO

        document.querySelectorAll(".localizacao span").forEach((span, indice) => {

            if (t.localizacao[indice]) {

                span.textContent = t.localizacao[indice];

            }

        });

        // DIREITOS

        document.querySelectorAll(".rodape-direitos a").forEach((link, indice) => {

            if (t.direitos[indice]) {

                link.textContent = t.direitos[indice];

            }

        });

    }

    // ==========================================
    // TROCAR IDIOMA
    // ==========================================

    botaoIdioma?.addEventListener("click", evento => {

        evento.preventDefault();

        idiomaAtual = idiomaAtual === "pt" ? "en" : "pt";

        atualizarIdioma();

        notificar(
            idiomaAtual === "pt"
                ? "Idioma alterado para português!"
                : "Language changed to English!"
        );

    });

    // ==========================================
    // ANIMAÇÃO DE ENTRADA
    // ==========================================

    const elementosAnimados = document.querySelectorAll(
        ".faq, .seguranca, .rodape"
    );

    if (
        "IntersectionObserver" in window &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {

        const observador = new IntersectionObserver(entradas => {

            entradas.forEach(entrada => {

                if (entrada.isIntersecting) {

                    entrada.target.classList.add("wn57-visivel");

                    observador.unobserve(entrada.target);

                }

            });

        }, {
            threshold: 0.12
        });

        elementosAnimados.forEach(elemento => {

            elemento.classList.add("wn57-animar");

            observador.observe(elemento);

        });

    }

    // ==========================================
    // BARRA DE PROGRESSO
    // ==========================================

    const progresso = document.createElement("div");

    progresso.className = "wn57-progresso";

    document.body.appendChild(progresso);

    function atualizarProgresso() {

        const altura =
            document.documentElement.scrollHeight - window.innerHeight;

        const porcentagem = altura > 0
            ? (window.scrollY / altura) * 100
            : 0;

        progresso.style.width = `${Math.min(porcentagem, 100)}%`;

    }

    window.addEventListener("scroll", atualizarProgresso, {
        passive: true
    });

    window.addEventListener("resize", atualizarProgresso);

    atualizarProgresso();

    // ==========================================
    // BOTÃO VOLTAR AO TOPO
    // ==========================================

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

    }, {
        passive: true
    });

    voltarTopo.addEventListener("click", () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

    // ==========================================
    // ATUALIZAR ANO DO RODAPÉ
    // ==========================================

    if (footer) {

        const ano = footer.querySelector(".rodape-bottom span");

        if (ano) {

            ano.textContent = `© ${new Date().getFullYear()} WN57`;

        }

    }

    // ==========================================
    // TECLA ESC: RECOLHER TODAS
    // ==========================================

    document.addEventListener("keydown", evento => {

        if (evento.key === "Escape") {

            perguntas.forEach(pergunta => {

                pergunta.open = false;

                pergunta.classList.remove("aberta");

            });

        }

    });

    // ==========================================
    // INICIALIZAÇÃO
    // ==========================================

    atualizarIdioma();

    console.log("WN57: Página de usuário carregada corretamente.");

});

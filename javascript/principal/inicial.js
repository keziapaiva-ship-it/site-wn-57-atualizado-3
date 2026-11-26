
(function () {

    "use strict";

    // ==========================================
    // CONFIGURAÇÕES
    // ==========================================

    const CHAVE_IDIOMA = "wn57_idioma";

    const SELETOR_IDIOMA =
        "#btnIdioma, #trocarIdioma, .idioma-btn, .idioma";

    const TAGS_IGNORADAS = [
        "SCRIPT",
        "STYLE",
        "NOSCRIPT",
        "TEXTAREA",
        "SVG",
        "PATH"
    ];

    const ROTULO_BOTAO = {
        pt: "PT-BR",
        en: "EN"
    };

    // ==========================================
    // DICIONÁRIO DE TRADUÇÃO
    // ==========================================

    const PARES = [

        // CABEÇALHO
        ["Inicial", "Home"],
        ["Início", "Home"],
        ["Viajar", "Ride"],
        ["Atividade", "Activity"],
        ["Sobre-nós", "About us"],
        ["Sobre nós", "About us"],
        ["Sobre", "About"],
        ["Ajuda", "Help"],
        ["Central de Ajuda", "Help Center"],
        ["Suporte", "Support"],
        ["Contato", "Contact"],
        ["Entrar", "Log in"],
        ["Fazer login", "Log in"],
        ["Cadastre-se", "Sign up"],
        ["Cadastrar", "Sign up"],
        ["Perfil", "Profile"],
        ["Meu perfil", "My profile"],
        ["Minha conta", "My account"],
        ["Gerenciar conta", "Manage account"],
        ["Sair", "Log out"],
        ["Idioma", "Language"],

        // PÁGINA INICIAL
        ["WN57 • Mobilidade Premium", "WN57 • Premium Mobility"],
        ["Sua corrida", "Your ride"],
        ["premium", "premium"],
        ["Um aplicativo moderno, rápido e seguro.",
            "A modern, fast and secure app."],
        ["Viaje com conforto em uma experiência extraordinária.",
            "Travel comfortably with an extraordinary experience."],
        ["Pedir corrida", "Request a ride"],
        ["Como funciona", "How it works"],
        ["WN57 Comfort", "WN57 Comfort"],
        ["Motorista chegando • 3 min", "Driver arriving • 3 min"],
        ["Confirmar corrida", "Confirm ride"],
        ["Foto da motorista", "Driver photo"],
        ["Mariana Silva", "Mariana Silva"],
        ["HB20 • ABC-1234", "HB20 • ABC-1234"],

        // ESTATÍSTICAS
        ["Corridas realizadas", "Rides completed"],
        ["Avaliação dos usuários", "User rating"],
        ["Motoristas ativos", "Active drivers"],

        // FUNCIONALIDADES
        ["Por que usar a WN57?", "Why use WN57?"],
        ["Mobilidade moderna, elegante e segura.",
            "Modern, elegant and safe mobility."],
        ["Corridas rápidas", "Fast rides"],
        ["Motoristas próximos em poucos segundos.",
            "Nearby drivers in just a few seconds."],
        ["Mapa em tempo real", "Real-time map"],
        ["Veja sua rota ao vivo com GPS moderno.",
            "See your route live with modern GPS."],
        ["Mais segurança", "More safety"],
        ["Motoristas verificados e suporte 24h.",
            "Verified drivers and 24/7 support."],
        ["Pagamento fácil", "Easy payment"],
        ["PIX, cartão ou dinheiro.", "PIX, card or cash."],

        // CATEGORIAS
        ["WN Black", "WN Black"],
        ["WN Comfort", "WN Comfort"],
        ["Luxo e conforto premium.", "Luxury and premium comfort."],
        ["Viagens mais confortáveis.", "More comfortable rides."],
        ["Corridas rápidas e acessíveis.",
            "Fast and affordable rides."],

        // AVALIAÇÕES
        ["“Aplicativo muito bonito e rápido. A experiência parece app internacional.”",
            "“A very beautiful and fast app. The experience feels international.”"],
        ["“Mapa incrível e motoristas muito educados.”",
            "“Amazing map and very polite drivers.”"],
        ["“Visual premium e muito moderno.”",
            "“Premium and very modern design.”"],

        ["Amanda • ⭐ 5.0", "Amanda • ⭐ 5.0"],
        ["Fernanda • ⭐ 4.9", "Fernanda • ⭐ 4.9"],
        ["Julia • ⭐ 5.0", "Julia • ⭐ 5.0"],

        // DOWNLOAD
        ["Baixe o app WN57", "Download the WN57 app"],
        ["Solicite sua corrida em segundos com uma plataforma moderna, rápida e segura.",
            "Request your ride in seconds with a modern, fast and secure platform."],
        ["Download", "Download"],

        // RODAPÉ
        ["Acesse a Central de Ajuda", "Visit the Help Center"],
        ["Empresa", "Company"],
        ["Produtos", "Products"],
        ["Cidadania global", "Global citizenship"],
        ["Blog", "Blog"],
        ["Privacidade", "Privacy"],
        ["Termos", "Terms"],
        ["Termos de uso", "Terms of use"],
        ["Acessibilidade", "Accessibility"],
        ["Segurança", "Safety"],
        ["Suporte", "Support"],
        ["Ajuda", "Help"],
        ["Português (Brasil)", "English"],
        ["🌐 Português (Brasil)", "🌐 English"],
        ["📍 Curitiba", "📍 Curitiba"],

        ["Sobre-Nós", "About us"],
        ["© 2026 WN57", "© 2026 WN57"],

        ["WN57 Tecnologia Ltda | Avenida Brasil, nº 949, Pinhais, Paraná, Brasil - CEP 83320-000",
            "WN57 Tecnologia Ltda | Avenida Brasil, No. 949, Pinhais, Paraná, Brazil - ZIP 83320-000"],

        // BOTÃO DE TOPO
        ["Voltar ao topo", "Back to top"],

        // OUTRAS PÁGINAS
        ["Vá para qualquer lugar com", "Go anywhere with"],
        ["Alterar cidade", "Change city"],
        ["Escolha o veículo perfeito, calcule sua rota e chegue com estilo.",
            "Choose the perfect vehicle, calculate your route and arrive in style."],
        ["Sua localização", "Your location"],
        ["Para onde você vai?", "Where to?"],

        // SUPORTE
        ["Atendimento digital", "Digital support"],
        ["Converse com a WN57", "Chat with WN57"],
        ["Estamos aqui para ajudar com suas dúvidas.",
            "We're here to help with your questions."],
        ["Informações", "Information"],
        ["Como podemos ajudar?", "How can we help?"],
        ["Conheça os assuntos que nossa assistente pode orientar.",
            "Learn about the topics our assistant can guide you on."],
        ["Assistente WN57", "WN57 Assistant"]

    ];

    // ==========================================
    // ORGANIZAÇÃO DO DICIONÁRIO
    // ==========================================

    const porPt = new Map();
    const porEn = new Map();

    function chave(texto) {

        return String(texto)
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\s+/g, " ")
            .trim()
            .toLowerCase();

    }

    PARES.forEach(([pt, en]) => {

        const entrada = { pt, en };

        porPt.set(chave(pt), entrada);
        porEn.set(chave(en), entrada);

    });

    function buscar(texto) {

        const k = chave(texto);

        return porPt.get(k) || porEn.get(k) || null;

    }

    // ==========================================
    // IDIOMA SALVO
    // ==========================================

    function lerIdioma() {

        try {

            const salvo =
                localStorage.getItem(CHAVE_IDIOMA) ||
                localStorage.getItem("idioma");

            return salvo === "en" ? "en" : "pt";

        } catch (e) {

            return "pt";

        }

    }

    let idioma = lerIdioma();

    function salvarIdioma() {

        try {

            localStorage.setItem(CHAVE_IDIOMA, idioma);
            localStorage.setItem("idioma", idioma);

        } catch (e) {

            console.error("Erro ao salvar idioma:", e);

        }

    }

    // ==========================================
    // GUARDAR TEXTOS ORIGINAIS
    // ==========================================

    const originais = new WeakMap();

    const originaisAtributos = new WeakMap();

    // ==========================================
    // TRADUZIR TEXTOS DA PÁGINA
    // ==========================================

    function traduzirTextos() {

        if (!document.body) return;

        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT
        );

        const nos = [];

        let no;

        while ((no = walker.nextNode())) {

            const pai = no.parentElement;

            if (!pai) continue;

            if (TAGS_IGNORADAS.includes(pai.tagName)) continue;

            if (pai.closest(SELETOR_IDIOMA)) continue;

            if (pai.closest("[data-no-i18n]")) continue;

            if (!no.nodeValue.trim()) continue;

            nos.push(no);

        }

        nos.forEach(item => {

            if (!originais.has(item)) {

                originais.set(item, item.nodeValue);

            }

            const original = originais.get(item);

            const entrada = buscar(original);

            if (!entrada) return;

            const novo = idioma === "en"
                ? entrada.en
                : entrada.pt;

            if (item.nodeValue !== novo) {

                item.nodeValue = novo;

            }

        });

    }

    // ==========================================
    // TRADUZIR ATRIBUTOS
    // ==========================================

    function traduzirAtributos() {

        const atributos = [
            "title",
            "placeholder",
            "alt",
            "aria-label"
        ];

        document.querySelectorAll(
            "[title], [placeholder], [alt], [aria-label]"
        ).forEach(el => {

            if (el.closest(SELETOR_IDIOMA)) return;

            atributos.forEach(attr => {

                if (!el.hasAttribute(attr)) return;

                if (!originaisAtributos.has(el)) {

                    originaisAtributos.set(el, {});

                }

                const dados = originaisAtributos.get(el);

                if (dados[attr] === undefined) {

                    dados[attr] = el.getAttribute(attr);

                }

                const original = dados[attr];

                const entrada = buscar(original);

                if (!entrada) return;

                const novo = idioma === "en"
                    ? entrada.en
                    : entrada.pt;

                if (el.getAttribute(attr) !== novo) {

                    el.setAttribute(attr, novo);

                }

            });

        });

    }

    // ==========================================
    // TRADUZIR TÍTULO DA ABA
    // ==========================================

    function traduzirTitulo() {

        const entrada = buscar("WN57 • Mobilidade Premium");

        if (entrada) {

            document.title = idioma === "en"
                ? entrada.en
                : entrada.pt;

        }

    }

    // ==========================================
    // ATUALIZAR BOTÃO DE IDIOMA
    // ==========================================

    function atualizarBotao() {

        document.querySelectorAll(SELETOR_IDIOMA).forEach(botao => {

            const span = botao.querySelector("span");

            if (span) {

                span.textContent = ROTULO_BOTAO[idioma];

            } else {

                botao.textContent = "🌐 " + ROTULO_BOTAO[idioma];

            }

        });

    }

    // ==========================================
    // APLICAR TRADUÇÃO
    // ==========================================

    let observador = null;

    function aplicar() {

        if (observador) {

            observador.disconnect();

        }

        document.documentElement.lang =
            idioma === "en" ? "en" : "pt-BR";

        traduzirTextos();

        traduzirAtributos();

        traduzirTitulo();

        atualizarBotao();

        observar();

    }

    // ==========================================
    // TROCAR IDIOMA
    // ==========================================

    function definir(novoIdioma) {

        idioma = novoIdioma === "en" ? "en" : "pt";

        salvarIdioma();

        aplicar();

        document.dispatchEvent(
            new CustomEvent("wn57:idioma", {
                detail: { idioma }
            })
        );

    }

    // ==========================================
    // EVENTO DO BOTÃO
    // ==========================================

    document.addEventListener("click", function (evento) {

        const botao = evento.target.closest(SELETOR_IDIOMA);

        if (!botao) return;

        evento.preventDefault();

        evento.stopImmediatePropagation();

        definir(idioma === "pt" ? "en" : "pt");

    }, true);

    // ==========================================
    // OBSERVAR ELEMENTOS DINÂMICOS
    // ==========================================

    function observar() {

        if (!observador || !document.body) return;

        observador.observe(document.body, {

            childList: true,
            subtree: true

        });

    }

    function iniciarObservador() {

        if (!document.body) return;

        observador = new MutationObserver(() => {

            if (idioma === "en") {

                aplicar();

            }

        });

        observar();

    }

    // ==========================================
    // SINCRONIZAR OUTRAS ABAS
    // ==========================================

    window.addEventListener("storage", evento => {

        if (
            evento.key !== CHAVE_IDIOMA &&
            evento.key !== "idioma"
        ) return;

        const novo = evento.newValue === "en" ? "en" : "pt";

        if (novo === idioma) return;

        idioma = novo;

        aplicar();

    });

    // ==========================================
    // INICIALIZAÇÃO
    // ==========================================

    function iniciar() {

        aplicar();

        iniciarObservador();

        window.addEventListener("load", aplicar);

    }

    if (document.readyState === "loading") {

        document.addEventListener("DOMContentLoaded", iniciar);

    } else {

        iniciar();

    }

    // ==========================================
    // API GLOBAL
    // ==========================================

    window.WN57_IDIOMA = {

        get: () => idioma,

        definir,

        alternar: () => definir(
            idioma === "pt" ? "en" : "pt"
        ),

        aplicar,

        faltando: function () {

            const lista = [];

            document.querySelectorAll("body *").forEach(el => {

                if (TAGS_IGNORADAS.includes(el.tagName)) return;

                if (el.children.length > 0) return;

                if (el.closest(SELETOR_IDIOMA)) return;

                if (el.closest("[data-no-i18n]")) return;

                const texto = el.textContent
                    .replace(/\s+/g, " ")
                    .trim();

                if (texto.length < 2) return;

                if (!/[A-Za-zÀ-ÿ]/.test(texto)) return;

                if (buscar(texto)) return;

                if (!lista.includes(texto)) {

                    lista.push(texto);

                }

            });

            console.log(
                lista.map(t => `["${t}", ""],`).join("\n")
            );

            return lista;

        }

    };
    // ==========================================
    // PROTEGER LINKS DE NAVEGAÇÃO
    // ==========================================

    document.addEventListener("click", function (evento) {

        const link = evento.target.closest("a");

        if (!link) return;

        // Botão Cadastre-se do cabeçalho
        if (
            link.id === "menuCadastro" ||
            link.classList.contains("btn-menu")
        ) {

            evento.preventDefault();

            window.location.assign("/html/login/cadastro.html");

        }

    }, true);
})();

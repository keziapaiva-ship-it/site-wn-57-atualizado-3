"use strict";

const DICIONARIO_EN = {
    /* ----- menu / cabeçalho ----- */
    "Inicial": "Home",
    "Viajar": "Ride",
    "Ajuda": "Help",
    "Atividade": "Activity",
    "Carteira": "Wallet",
    "Sair": "Log out",

    /* ----- tela da corrida ----- */
    "Para onde vamos?": "Where to?",
    "Confira os dados da sua viagem.": "Check your trip details.",
    "Localização atual": "Current location",
    "Origem": "Pickup",
    "Destino": "Destination",
    "Escolha seu veículo": "Choose your ride",

    /* ----- categorias ----- */
    "Rápido e econômico": "Fast and affordable",
    "Para o dia a dia": "For everyday trips",
    "Mais conforto": "More comfort",
    "Experiência premium": "Premium experience",
    "Viaje com seu pet": "Travel with your pet",

    /* ----- pagamento ----- */
    "Forma de pagamento": "Payment method",
    "Pagamento": "Payment",
    "Cartão": "Card",
    "Pix": "Pix",
    "Dinheiro": "Cash",
    "Número do cartão": "Card number",
    "Nome impresso no cartão": "Name on card",
    "Nome no cartão": "Name on card",
    "Validade": "Expiry date",
    "Cadastrar cartão": "Add card",
    "Seus cartões": "Your cards",
    "Remover": "Remove",
    "Nenhum cartão cadastrado.": "No cards added.",
    "Categoria": "Category",
    "Valor": "Amount",
    "Resumo": "Summary",
    "Resumo da corrida": "Ride summary",
    "Preço base": "Base fare",
    "Desconto": "Discount",
    "Total": "Total",
    "Confirmar": "Confirm",
    "Confirmar corrida": "Confirm ride",
    "Enviando...": "Sending...",

    /* ----- erros e avisos (feitos por JavaScript) ----- */
    "Informe a origem e o destino.": "Enter the pickup and destination.",
    "Informe origem e destino.": "Enter the pickup and destination.",
    "Informe um número de cartão válido.": "Enter a valid card number.",
    "Informe o nome impresso no cartão.": "Enter the name printed on the card.",
    "Informe a validade no formato MM/AA.": "Enter the expiry date as MM/YY.",
    "O CVV do American Express deve ter 4 dígitos.": "The American Express CVV must have 4 digits.",
    "Informe um CVV válido com 3 dígitos.": "Enter a valid 3-digit CVV.",
    "O cartão está vencido.": "The card has expired.",
    "Faça login para confirmar a corrida.": "Log in to confirm the ride.",
    "Sua sessão expirou. Faça login novamente.": "Your session has expired. Please log in again.",
    "Não foi possível registrar a corrida.": "Could not register the ride.",
    "O servidor demorou demais para responder.": "The server took too long to respond.",
    "Não foi possível conectar ao servidor. Ele está rodando na porta 3000?":
        "Could not connect to the server. Is it running on port 3000?",
    "Calculando trajeto...": "Calculating route...",
    "Endereço não encontrado.": "Address not found.",
    "Serviço de rotas indisponível.": "Route service unavailable.",
    "Não foi encontrada uma rota.": "No route was found.",
    "Tempo de cálculo esgotado.": "Route calculation timed out.",
    "GPS não disponível. Usando endereço informado.": "GPS unavailable. Using the address provided.",
    "Obtendo localização...": "Getting your location...",
    "Localização fora da região atendida.": "Location outside the service area.",
    "Permita o acesso à localização.": "Allow location access.",
    "Localização indisponível.": "Location unavailable.",
    "Tempo de localização esgotado.": "Location request timed out.",
    "Usando endereço informado.": "Using the address provided.",

    /* ----- cadastro de cartão ----- */
    "Preencha todos os dados do cartão.": "Fill in all card details.",
    "Número do cartão inválido.": "Invalid card number.",
    "Cartão não reconhecido": "Card not recognized",
    "Não conseguimos identificar a bandeira deste cartão. Confira o número digitado e tente novamente.":
        "We could not identify this card's brand. Check the number and try again.",
    "Número American Express inválido.": "Invalid American Express number.",
    "Informe o nome impresso no cartão.": "Enter the name printed on the card.",
    "Validade inválida. Use MM/AA.": "Invalid expiry date. Use MM/YY.",
    "Este cartão está vencido.": "This card has expired.",
    "O CVV deve ter 3 dígitos.": "The CVV must have 3 digits.",
    "Este cartão já está cadastrado.": "This card is already added.",
    "Erro ao cadastrar o cartão.": "Error adding the card.",
    "Cartão validado e cadastrado!": "Card verified and added!",
    "Bandeira": "Brand",
    "Final": "Last digits",
    "Forma de pagamento não identificada.": "Payment method not recognized."
};

let idiomaAtual = "pt";

/* Traduz um texto escrito em português (só quando o idioma é EN) */
function t(texto) {
    if (idiomaAtual !== "en") return texto;

    const chave = String(texto);

    if (DICIONARIO_EN[chave]) return DICIONARIO_EN[chave];

    // "aprox. 12 min" -> "approx. 12 min"
    const tempo = chave.match(/^aprox\. (\d+) min$/);
    if (tempo) return `approx. ${tempo[1]} min`;

    return texto;
}


const REGEX_TEXTO_IDIOMA =
    /^(?:🌐\s*)?(PT-BR|PT|EN|EN-US|ENG|PORTUGUÊS|ENGLISH)$/i;

const SELETOR_BOTAO_IDIOMA =
    "#btnIdioma, #idioma, #botaoIdioma, .idioma, .btn-idioma, " +
    ".language, .lang-btn, .language-toggle, .language-button, " +
    ".btn-language, .botao-idioma, [data-idioma], [data-lang]";

const SELETOR_CLICAVEL =
    SELETOR_BOTAO_IDIOMA + ", button, a, [role='button']";

function textoLimpo(el) {
    return (el?.textContent || "").replace(/\s+/g, " ").trim();
}

function ehBotaoDeIdioma(el) {
    if (!el || el.nodeType !== 1) return false;

    if (el.matches(SELETOR_BOTAO_IDIOMA)) return true;

    return REGEX_TEXTO_IDIOMA.test(textoLimpo(el));
}

function acharBotaoIdiomaClicado(alvo) {
    let atual = alvo instanceof Element ? alvo : alvo?.parentElement;

    while (atual && atual !== document.documentElement) {
        if (
            atual.matches(SELETOR_CLICAVEL) &&
            ehBotaoDeIdioma(atual)
        ) {
            return atual;
        }

        atual = atual.parentElement;
    }

    return null;
}

function atualizarBotoesIdioma() {
    const rotulo = idiomaAtual === "en" ? "EN" : "PT-BR";

    document.querySelectorAll(SELETOR_CLICAVEL).forEach(botao => {
        if (!ehBotaoDeIdioma(botao)) return;

        const walker = document.createTreeWalker(
            botao,
            NodeFilter.SHOW_TEXT
        );

        while (walker.nextNode()) {
            const no = walker.currentNode;

            if (/PT-BR|PT|EN-US|EN|ENG|PORTUGUÊS|ENGLISH/i.test(no.nodeValue)) {
                no.nodeValue = no.nodeValue.replace(
                    /PT-BR|PT|EN-US|EN|ENG|PORTUGUÊS|ENGLISH/i,
                    rotulo
                );
            }
        }

        botao.setAttribute(
            "aria-label",
            idiomaAtual === "en"
                ? "Language: English"
                : "Idioma: Português (Brasil)"
        );
    });
}


/* Guarda o texto original de cada nó para poder voltar ao português */
const TEXTOS_ORIGINAIS = new WeakMap();
const ATRIBUTOS_TRADUZIVEIS = ["placeholder", "title", "aria-label"];

function traduzirPagina() {
    const raiz = document.body;
    if (!raiz) return;

    /* ----- textos soltos ----- */
    const walker = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT, {
        acceptNode(no) {
            const pai = no.parentNode;

            if (!pai) return NodeFilter.FILTER_REJECT;

            const tag = pai.nodeName;

            if (tag === "SCRIPT" || tag === "STYLE" || tag === "NOSCRIPT") {
                return NodeFilter.FILTER_REJECT;
            }

            return NodeFilter.FILTER_ACCEPT;
        }
    });

    const nos = [];
    while (walker.nextNode()) nos.push(walker.currentNode);

    nos.forEach(no => {
        const registro = TEXTOS_ORIGINAIS.get(no);
        const atual = no.nodeValue;

        if (idiomaAtual === "en") {
            // se o texto não foi mexido por outro código, parte do original
            const base =
                registro && registro.traduzido === atual
                    ? registro.original
                    : atual;

            const trecho = base.trim();
            const traduzido = DICIONARIO_EN[trecho];

            if (traduzido) {
                const novo = base.replace(trecho, traduzido);
                TEXTOS_ORIGINAIS.set(no, { original: base, traduzido: novo });
                no.nodeValue = novo;
            }

        } else if (registro && registro.traduzido === atual) {
            no.nodeValue = registro.original;
            TEXTOS_ORIGINAIS.delete(no);
        }
    });

    /* ----- placeholder, title e aria-label ----- */
    ATRIBUTOS_TRADUZIVEIS.forEach(attr => {
        raiz.querySelectorAll("[" + attr + "]").forEach(item => {
            const guardado = "wn57Orig" + attr.replace(/-/g, "");
            const valorAtual = item.getAttribute(attr) || "";

            if (idiomaAtual === "en") {
                const base = item.dataset[guardado] || valorAtual;
                const traduzido = DICIONARIO_EN[base.trim()];

                if (traduzido) {
                    item.dataset[guardado] = base;
                    item.setAttribute(attr, traduzido);
                }

            } else if (item.dataset[guardado]) {
                item.setAttribute(attr, item.dataset[guardado]);
                delete item.dataset[guardado];
            }
        });
    });

    document.documentElement.lang = idiomaAtual === "en" ? "en" : "pt-BR";
}

/* Reaplica o idioma em tudo que o JavaScript desta página gera */
function aoMudarIdioma() {
    montarVeiculos();
    atualizarResumo();
    renderizarCartoes();

    if (ultimoErroPT) {
        mostrarErro(ultimoErroPT);
    }

    if (ultimaInfoMapa) {
        atualizarInfoMapa(
            ultimaInfoMapa.distancia,
            ultimaInfoMapa.detalhe
        );
    }
}

function definirIdioma(novo) {
    idiomaAtual = novo === "en" ? "en" : "pt";

    try {
        localStorage.setItem("idioma", idiomaAtual);
    } catch { }

    aoMudarIdioma();
    traduzirPagina();
    atualizarBotoesIdioma();
}


function configurarIdioma() {
    try {
        const salvo = (
            localStorage.getItem("idioma") || ""
        ).toLowerCase();

        idiomaAtual = salvo.startsWith("en") ? "en" : "pt";

    } catch {
        idiomaAtual = "pt";
    }

    document.addEventListener("click", evento => {
        const botao = acharBotaoIdiomaClicado(evento.target);

        if (!botao) return;

        evento.preventDefault();
        evento.stopPropagation();
        evento.stopImmediatePropagation();

        definirIdioma(idiomaAtual === "en" ? "pt" : "en");

    }, true);

    const observadorIdioma = new MutationObserver(() => {
        atualizarBotoesIdioma();
    });

    observadorIdioma.observe(document.body, {
        childList: true,
        subtree: true
    });
}

/* =========================================================
   1. CONFIGURAÇÕES
========================================================= */

const STORAGE_KEYS = {
    origem: "origemCorrida",
    destino: "destinoCorrida",
    gps: "origemCoordenadasGPS",
    viagens: "minhasViagens",
    categoria: "categoriaCorrida",
    valor: "valorCorrida",
    pagamento: "pagamentoCorrida",
    idCorrida: "idCorridaServidor",
    veiculosCache: "wn57_rotas_veiculos_v2"
};

const CONFIG = {
    centroMapa: [-25.4429, -49.1927],
    zoomMapa: 14,
    timeoutAPI: 10000,
    intervaloNominatim: 1100,
    velocidadeCarro: 7,
    velocidadeMoto: 9
};

/* Página de login (ajuste o caminho se o seu login.html estiver em outra pasta) */
const PAGINA_LOGIN = "/html/login/login.html";

/* Forma de pagamento no formato que o back-end espera */
const PAGAMENTO_API = {
    "Cartão": "CARTAO",
    "Pix": "PIX",
    "Dinheiro": "DINHEIRO"
};

/* =========================================================
   2. VARIÁVEIS GLOBAIS
========================================================= */

let mapa = null;
let marcadorOrigem = null;
let marcadorDestino = null;
let linhaRota = null;

let coordenadasOrigemGPS = null;

let categoriaSelecionada = "WN";
let valorSelecionado = 15;
let pagamentoSelecionado = "Cartão";
let descontoCorrida = 0;

let versaoRota = 0;
let ultimaConsultaNominatim = 0;
let filaNominatim = Promise.resolve();

let veiculosAnimadosWN57 = [];
let animacaoVeiculosWN57 = null;
let veiculosAnimadosIniciados = false;

/* últimos textos mostrados (para retraduzir ao trocar de idioma) */
let ultimoErroPT = "";
let ultimaInfoMapa = null;

/* =========================================================
   3. VEÍCULOS DISPONÍVEIS
========================================================= */

const veiculos = [
    {
        nome: "WN Moto",
        valor: 9,
        descricao: "Rápido e econômico",
        lugares: 1,
        icone: "🏍️"
    },
    {
        nome: "WN",
        valor: 15,
        descricao: "Para o dia a dia",
        lugares: 4,
        icone: "🚘"
    },
    {
        nome: "WN Conforto",
        valor: 22,
        descricao: "Mais conforto",
        lugares: 4,
        icone: "🚙"
    },
    {
        nome: "WN Black",
        valor: 32,
        descricao: "Experiência premium",
        lugares: 4,
        icone: "🚗"
    },

    {
        nome: "WN Pet",
        valor: 20,
        descricao: "Viaje com seu pet",
        lugares: 4,
        icone: "🐾"
    }
];

/* =========================================================
   4. ELEMENTOS HTML
========================================================= */

function elemento(id) {
    return document.getElementById(id);
}

/* =========================================================
   5. STORAGE SEGURO
========================================================= */

function lerStorage(chave, fallback = null) {
    try {
        const valor = localStorage.getItem(chave);
        return valor === null ? fallback : valor;
    } catch (erro) {
        console.warn("WN57: erro ao ler armazenamento.", erro);
        return fallback;
    }
}

function salvarStorage(chave, valor) {
    try {
        localStorage.setItem(chave, String(valor));
        return true;
    } catch (erro) {
        console.warn("WN57: erro ao salvar armazenamento.", erro);
        return false;
    }
}

function lerCache(chave) {
    try {
        const valor = sessionStorage.getItem(chave);
        return valor ? JSON.parse(valor) : null;
    } catch {
        return null;
    }
}

function salvarCache(chave, valor) {
    try {
        sessionStorage.setItem(chave, JSON.stringify(valor));
    } catch (erro) {
        console.warn("WN57: não foi possível salvar cache.", erro);
    }
}

/* =========================================================
   6. UTILITÁRIOS
========================================================= */

function moeda(valor) {
    return Number(valor || 0).toLocaleString(
        idiomaAtual === "en" ? "en-US" : "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );
}

function esperar(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function criarPopupSeguro(titulo, texto) {
    const conteudo = document.createElement("div");
    const forte = document.createElement("strong");
    const descricao = document.createElement("div");

    forte.textContent = titulo;
    descricao.textContent = texto;

    conteudo.append(forte, descricao);

    return conteudo;
}

function escaparHTML(texto) {
    return String(texto).replace(/[&<>"']/g, caractere => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[caractere]);
}

/* =========================================================
   7. CARREGAR TRAJETO E PREFERÊNCIAS SALVAS
========================================================= */

function carregarTrajeto() {
    const origem =
        lerStorage(STORAGE_KEYS.origem) ||
        "Escola Municipal José Brunetti Gugelmin, Rua Malásia, Pineville, Pinhais, Paraná";

    const destino =
        lerStorage(STORAGE_KEYS.destino) ||
        "Rua Rio Negro, 403, Weissópolis, Pinhais, Paraná, Brasil";

    const categoriaSalva = lerStorage(STORAGE_KEYS.categoria);
    const pagamentoSalvo = lerStorage(STORAGE_KEYS.pagamento);

    const veiculoSalvo = veiculos.find(
        veiculo => veiculo.nome === categoriaSalva
    );

    if (veiculoSalvo) {
        categoriaSelecionada = veiculoSalvo.nome;
        valorSelecionado = Number(veiculoSalvo.valor);
    }

    if (["Cartão", "Pix", "Dinheiro"].includes(pagamentoSalvo)) {
        pagamentoSelecionado = pagamentoSalvo;
    }

    if (elemento("origemTxt")) {
        elemento("origemTxt").textContent = origem;
    }

    if (elemento("destinoTxt")) {
        elemento("destinoTxt").textContent = destino;
    }

    return { origem, destino };
}

/* =========================================================
   ÍCONES ORIGINAIS WN57
========================================================= */

const GLIFOS = {
    pdc: `
        <circle cx="100" cy="51" r="9" fill="#fff"/>
        <circle cx="99" cy="46" r="1.8" fill="#ff2d8f"/>
        <path d="M99 48.5v5h5l2 4M96 52a4.5 4.5 0 105 5"
            stroke="#ff2d8f" stroke-width="1.6"
            fill="none" stroke-linecap="round"/>
    `,

    pet: `
        <circle cx="100" cy="51" r="9" fill="#fff"/>
        <ellipse cx="100" cy="55" rx="3.6" ry="2.8" fill="#ff2d8f"/>
        <circle cx="95.5" cy="50.5" r="1.5" fill="#ff2d8f"/>
        <circle cx="98.5" cy="47.5" r="1.5" fill="#ff2d8f"/>
        <circle cx="101.5" cy="47.5" r="1.5" fill="#ff2d8f"/>
        <circle cx="104.5" cy="50.5" r="1.5" fill="#ff2d8f"/>
    `
};

function iconeCarro({
    id,
    cor,
    cor2,
    vidro = "#1b2733",
    detalhe = "#ff2d8f",
    longo = false,
    glifo = ""
}) {
    const w = longo ? 214 : 200;
    const f = longo ? 14 : 0;

    return `
    <svg viewBox="0 0 ${w} 90"
         xmlns="http://www.w3.org/2000/svg">

        <defs>
            <linearGradient id="c${id}" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stop-color="${cor}"/>
                <stop offset="1" stop-color="${cor2}"/>
            </linearGradient>

            <linearGradient id="v${id}" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stop-color="${vidro}"/>
                <stop offset="1" stop-color="#3a4a5a"/>
            </linearGradient>

            <radialGradient id="s${id}">
                <stop offset="0" stop-color="#000" stop-opacity=".55"/>
                <stop offset="1" stop-color="#000" stop-opacity="0"/>
            </radialGradient>
        </defs>

        <ellipse cx="${w / 2}" cy="80"
            rx="${w / 2 - 10}" ry="6"
            fill="url(#s${id})"/>

        <path d="
            M8 64 L12 50 Q14 44 24 42
            L58 38 Q70 20 94 18
            L${128 + f} 18
            Q${150 + f} 20 ${160 + f} 38
            L${184 + f} 44
            Q${196 + f} 48 ${196 + f} 58
            L${196 + f} 65
            Q${196 + f} 69 ${191 + f} 69
            L13 69 Q8 69 8 64 Z"
            fill="url(#c${id})"/>

        <path d="M66 38 Q76 24 94 23 L112 23 L112 38 Z"
            fill="url(#v${id})"/>

        <path d="M118 23 L${128 + f} 23
            Q${144 + f} 25 ${153 + f} 38
            L118 38 Z"
            fill="url(#v${id})"/>

        <rect x="116" y="46" width="12" height="3"
            rx="1.5" fill="#000" opacity=".25"/>

        <path d="M20 58 L${186 + f} 58"
            stroke="${detalhe}" stroke-width="2.5"
            stroke-linecap="round" opacity=".9"/>

        <path d="M${188 + f} 49 L${196 + f} 52
            L${196 + f} 56 L${186 + f} 54 Z"
            fill="#fff6d6"/>

        <path d="M8 52 L13 51 L13 57 L8 58 Z"
            fill="${detalhe}"/>

        ${glifo}

        ${[48, 152 + f].map(x => `
            <circle cx="${x}" cy="68" r="17" fill="#0a0a0a"/>
            <circle cx="${x}" cy="68" r="13" fill="#1c1c1c"/>
            <circle cx="${x}" cy="68" r="7" fill="#d9d9d9"/>
            <circle cx="${x}" cy="68" r="2.5" fill="${detalhe}"/>
        `).join("")}

    </svg>`;
}

function iconeMoto() {
    return `
    <svg viewBox="0 0 200 100"
         xmlns="http://www.w3.org/2000/svg">

        <defs>
            <linearGradient id="tm" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stop-color="#ff5cae"/>
                <stop offset="1" stop-color="#d4186f"/>
            </linearGradient>

            <radialGradient id="sm">
                <stop offset="0" stop-color="#000" stop-opacity=".55"/>
                <stop offset="1" stop-color="#000" stop-opacity="0"/>
            </radialGradient>
        </defs>

        <ellipse cx="100" cy="90" rx="88" ry="6"
            fill="url(#sm)"/>

        <circle cx="42" cy="68" r="22"
            fill="none" stroke="#0a0a0a" stroke-width="7"/>

        <circle cx="158" cy="68" r="22"
            fill="none" stroke="#0a0a0a" stroke-width="7"/>

        <circle cx="42" cy="68" r="14"
            fill="none" stroke="#bdbdbd" stroke-width="1.5"/>

        <circle cx="158" cy="68" r="14"
            fill="none" stroke="#bdbdbd" stroke-width="1.5"/>

        <circle cx="42" cy="68" r="4" fill="#ff2d8f"/>
        <circle cx="158" cy="68" r="4" fill="#ff2d8f"/>

        <path d="M158 68 L142 32 L132 26"
            stroke="#8c8c8c" stroke-width="5"
            stroke-linecap="round" fill="none"/>

        <path d="M128 22 L142 20"
            stroke="#ddd" stroke-width="5"
            stroke-linecap="round"/>

        <path d="M144 34 Q154 34 152 42 L142 42 Z"
            fill="#fff6d6"/>

        <path d="M42 68 L84 64"
            stroke="#8c8c8c" stroke-width="5"
            stroke-linecap="round"/>

        <path d="M78 52 L116 50 L122 70 L88 74 Z"
            fill="#2a2a2a"/>

        <circle cx="100" cy="62" r="7" fill="#555"/>

        <path d="M84 72 L50 74"
            stroke="#bdbdbd" stroke-width="5"
            stroke-linecap="round"/>

        <path d="M84 44 Q96 28 122 30
            L134 36 L130 48 L90 50 Z"
            fill="url(#tm)"/>

        <path d="M52 44 Q64 40 84 44
            L90 50 L56 52 Q46 52 52 44 Z"
            fill="#111"/>

        <path d="M38 44 L56 42 L58 48 L40 50 Z"
            fill="#ff2d8f"/>

    </svg>`;
}

/* =========================================================
   RELAÇÃO DOS ÍCONES ORIGINAIS
========================================================= */

const ICONES_VEICULO = {
    "WN Moto": () => iconeMoto(),

    "WN": () => iconeCarro({
        id: "a",
        cor: "#ffffff",
        cor2: "#cfcfd6"
    }),

    "WN Conforto": () => iconeCarro({
        id: "b",
        cor: "#ff6fb5",
        cor2: "#d4186f",
        detalhe: "#ffffff",
        longo: true
    }),

    "WN Black": () => iconeCarro({
        id: "c",
        cor: "#3b3b44",
        cor2: "#0b0b0e",
        vidro: "#0e141b",
        longo: true
    }),

    "WN PDC": () => iconeCarro({
        id: "d",
        cor: "#ffffff",
        cor2: "#cfcfd6",
        glifo: GLIFOS.pdc
    }),

    "WN Pet": () => iconeCarro({
        id: "e",
        cor: "#ffffff",
        cor2: "#cfcfd6",
        glifo: GLIFOS.pet
    })
};

const ICONE_PESSOA = `
<svg width="12" height="12"
     viewBox="0 0 24 24"
     fill="currentColor"
     aria-hidden="true">
    <circle cx="12" cy="7" r="4"/>
    <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8z"/>
</svg>`;

/* =========================================================
   MONTAR VEÍCULOS COM OS DESENHOS ORIGINAIS
========================================================= */

function montarVeiculos() {
    const container = elemento("veiculos");

    if (!container) return;

    container.innerHTML = "";

    container.setAttribute("role", "radiogroup");
    container.setAttribute(
        "aria-label",
        t("Escolha seu veículo")
    );

    veiculos.forEach(veiculo => {
        const botao = document.createElement("button");

        botao.type = "button";
        botao.className = "veiculo";
        botao.setAttribute("role", "radio");

        const selecionado =
            veiculo.nome === categoriaSelecionada;

        botao.setAttribute(
            "aria-checked",
            String(selecionado)
        );

        botao.tabIndex = 0;

        const gerarIcone = ICONES_VEICULO[veiculo.nome];

        botao.innerHTML = `
            <span class="foto" aria-hidden="true">
                ${gerarIcone ? gerarIcone() : ""}
            </span>

            <span>
                <strong class="nome">
                    ${veiculo.nome}
                    <span class="lugares">
                        ${ICONE_PESSOA}${veiculo.lugares}
                    </span>
                </strong>

                <small class="desc">${escaparHTML(t(veiculo.descricao))}</small>
            </span>

            <b class="preco">${moeda(veiculo.valor)}</b>
        `;

        if (selecionado) {
            botao.classList.add("ativo");
        }

        botao.addEventListener("click", () => {
            selecionarVeiculo(veiculo, botao);
        });

        container.appendChild(botao);
    });

    atualizarResumo();
}

/* =========================================================
   9. PAGAMENTOS
========================================================= */

function mostrarFormulario(pg) {
    const formularios = {
        Cartão: "formCartao",
        Pix: "formPix",
        Dinheiro: "formDinheiro"
    };

    Object.entries(formularios).forEach(([tipo, id]) => {
        elemento(id)?.classList.toggle(
            "oculto",
            tipo !== pg
        );
    });
}

function configurarPagamentos() {
    const abas = document.querySelectorAll(".aba");

    abas.forEach(aba => {
        aba.addEventListener("click", () => {
            pagamentoSelecionado =
                normalizarPagamento(aba.dataset.pg);

            // Salvar a escolha imediatamente
            salvarStorage(
                STORAGE_KEYS.pagamento,
                pagamentoSelecionado
            );

            abas.forEach(item => {
                item.classList.toggle("ativo", item === aba);
                item.setAttribute(
                    "aria-selected",
                    String(item === aba)
                );
            });

            mostrarFormulario(pagamentoSelecionado);
            atualizarResumo();
            limparErro();
        });
    });

    configurarMascaraCartao();
    atualizarResumo();
}

/* =========================================================
   10. VALOR FINAL
========================================================= */

function calcularTotalCorrida() {
    return Math.max(
        0,
        Number(valorSelecionado) -
        Number(descontoCorrida || 0)
    );
}

function atualizarResumo() {
    const total = calcularTotalCorrida();

    const definir = (id, texto) => {
        const el = elemento(id);
        if (el) el.textContent = texto;
    };

    definir("rCat", categoriaSelecionada);
    definir("rValor", moeda(total));
    definir("rPg", t(pagamentoSelecionado));

    definir("precoBase", moeda(valorSelecionado));
    definir("valorDesconto", moeda(descontoCorrida));
    definir("valorTotal", moeda(total));
}

/* =========================================================
   11. MÁSCARA DO CARTÃO
========================================================= */

function configurarMascaraCartao() {
    const numero = elemento("numero");
    const validade = elemento("validade");
    const cvv = elemento("cvv");

    if (numero) {
        numero.addEventListener("input", () => {
            const digitos = numero.value
                .replace(/\D/g, "")
                .slice(0, 16);

            numero.value =
                digitos.replace(/(\d{4})(?=\d)/g, "$1 ");
        });
    }

    if (validade) {
        validade.addEventListener("input", () => {
            const digitos = validade.value
                .replace(/\D/g, "")
                .slice(0, 4);

            validade.value = digitos.length > 2
                ? `${digitos.slice(0, 2)}/${digitos.slice(2)}`
                : digitos;
        });
    }

    if (cvv) {
        cvv.addEventListener("input", () => {
            cvv.value = cvv.value
                .replace(/\D/g, "")
                .slice(0, 4);
        });
    }
}

/* =========================================================
   12. ALGORITMO DE LUHN
========================================================= */

function validarLuhn(numero) {
    let soma = 0;
    let dobrar = false;

    for (let i = numero.length - 1; i >= 0; i--) {
        let digito = Number(numero[i]);

        if (dobrar) {
            digito *= 2;

            if (digito > 9) {
                digito -= 9;
            }
        }

        soma += digito;
        dobrar = !dobrar;
    }

    return soma % 10 === 0;
}

/* =========================================================
   13. VALIDAÇÃO DO PAGAMENTO
   (as mensagens ficam em português; mostrarErro() traduz)
========================================================= */

function validarPagamento() {
    if (pagamentoSelecionado !== "Cartão") {
        return "";
    }

    const numero = (
        elemento("numero")?.value || ""
    ).replace(/\D/g, "");

    const nome = (
        elemento("nome")?.value || ""
    ).trim();

    const validade = (
        elemento("validade")?.value || ""
    ).trim();

    const cvv = (
        elemento("cvv")?.value || ""
    ).replace(/\D/g, "");

    const amex = /^3[47]/.test(numero);

    const quantidadeValida = amex
        ? numero.length === 15
        : numero.length >= 13 && numero.length <= 16;

    if (!quantidadeValida || !validarLuhn(numero)) {
        marcarCampoInvalido("numero");
        return "Informe um número de cartão válido.";
    }

    if (nome.length < 3) {
        marcarCampoInvalido("nome");
        return "Informe o nome impresso no cartão.";
    }

    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(validade)) {
        marcarCampoInvalido("validade");
        return "Informe a validade no formato MM/AA.";
    }

    if (
        (amex && cvv.length !== 4) ||
        (!amex && cvv.length !== 3)
    ) {
        marcarCampoInvalido("cvv");

        return amex
            ? "O CVV do American Express deve ter 4 dígitos."
            : "Informe um CVV válido com 3 dígitos.";
    }

    const [mes, ano] = validade.split("/").map(Number);

    const agora = new Date();
    const anoCompleto = 2000 + ano;

    if (
        anoCompleto < agora.getFullYear() ||
        (
            anoCompleto === agora.getFullYear() &&
            mes < agora.getMonth() + 1
        )
    ) {
        marcarCampoInvalido("validade");
        return "O cartão está vencido.";
    }

    return "";
}

/* =========================================================
   14. ERROS POR CAMPO
========================================================= */

function marcarCampoInvalido(id) {
    const campo = elemento(id);

    if (!campo) return;

    campo.setAttribute("aria-invalid", "true");

    campo.addEventListener("input", () => {
        campo.removeAttribute("aria-invalid");
    }, { once: true });

    campo.focus();
}

function mostrarErro(mensagem) {
    ultimoErroPT = mensagem || "";

    const campo =
        elemento("erroPagamento") ||
        elemento("erro");

    if (campo) {
        campo.textContent = t(mensagem);
        campo.classList.remove("oculto");
    } else {
        console.error("WN57:", mensagem);
    }
}

function limparErro() {
    ultimoErroPT = "";

    const campo =
        elemento("erroPagamento") ||
        elemento("erro");

    if (campo) {
        campo.textContent = "";
        campo.classList.add("oculto");
    }

    document
        .querySelectorAll('[aria-invalid="true"]')
        .forEach(item => {
            item.removeAttribute("aria-invalid");
        });
}

/* =========================================================
   15. EDIÇÃO DO DESTINO
========================================================= */

function configurarEdicaoDestino() {
    elemento("editar")?.addEventListener("click", () => {
        window.location.href = "../solicitar.html";
    });
}

/* =========================================================
   16. CONFIRMAÇÃO DA CORRIDA (COM BACK-END)
========================================================= */

function configurarConfirmacao() {
    const botao = elemento("confirmar");

    if (!botao) {
        console.warn("WN57: botão confirmar não encontrado.");
        return;
    }

    botao.type = "button";

    botao.addEventListener("click", evento => {
        evento.preventDefault();
        confirmarCorrida();
    });
}

/*
   Envia a corrida para o back-end (POST /corridas).
   Usa o token salvo no login (localStorage "token").
   Lança um erro com semLogin = true se a pessoa
   não estiver logada ou se a sessão expirou.
*/

async function enviarCorridaAoServidor(origem, destino) {
    const token = lerStorage("token");

    if (!token) {
        const erro = new Error("Faça login para confirmar a corrida.");
        erro.semLogin = true;
        throw erro;
    }

    const base = window.API_URL || "http://localhost:3000";

    const controller = new AbortController();

    const timeout = setTimeout(
        () => controller.abort(),
        CONFIG.timeoutAPI
    );

    try {
        const resposta = await fetch(base + "/corridas", {
            method: "POST",
            signal: controller.signal,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                origem,
                destino,
                formaPagamento:
                    PAGAMENTO_API[pagamentoSelecionado] || "CARTAO"
            })
        });

        const dados = await resposta.json().catch(() => ({}));

        console.log("WN57 - resposta de POST /corridas:", resposta.status, dados);

        if (resposta.status === 401 || resposta.status === 403) {
            try {
                localStorage.removeItem("token");
            } catch { }

            const erro = new Error(
                dados.erro ||
                dados.mensagem ||
                "Sua sessão expirou. Faça login novamente."
            );

            erro.semLogin = true;
            throw erro;
        }

        if (!resposta.ok) {
            throw new Error(
                dados.erro ||
                dados.mensagem ||
                "Não foi possível registrar a corrida."
            );
        }

        return dados;

    } catch (erro) {
        if (erro.name === "AbortError") {
            throw new Error("O servidor demorou demais para responder.");
        }

        if (erro instanceof TypeError) {
            throw new Error(
                "Não foi possível conectar ao servidor. Ele está rodando na porta 3000?"
            );
        }

        throw erro;

    } finally {
        clearTimeout(timeout);
    }
}

async function confirmarCorrida() {
    const origem = (
        elemento("origemTxt")?.textContent ||
        lerStorage(STORAGE_KEYS.origem) ||
        ""
    ).trim();

    const destino = (
        elemento("destinoTxt")?.textContent ||
        lerStorage(STORAGE_KEYS.destino) ||
        ""
    ).trim();

    if (!origem || !destino) {
        mostrarErro("Informe a origem e o destino.");
        return;
    }

    const erroPagamento = validarPagamento();

    if (erroPagamento) {
        mostrarErro(erroPagamento);
        return;
    }

    limparErro();

    const valorFinal = calcularTotalCorrida();

    // Guarda as escolhas (assim nada se perde se precisar ir ao login)
    salvarStorage(STORAGE_KEYS.origem, origem);
    salvarStorage(STORAGE_KEYS.destino, destino);
    salvarStorage(STORAGE_KEYS.categoria, categoriaSelecionada);
    salvarStorage(STORAGE_KEYS.valor, valorFinal);
    salvarStorage(STORAGE_KEYS.pagamento, pagamentoSelecionado);

    /* ---------- Enviar ao back-end ---------- */

    const botao = elemento("confirmar");
    const conteudoOriginal = botao ? botao.innerHTML : "";

    if (botao) {
        botao.disabled = true;
        botao.textContent = t("Enviando...");
    }

    let dadosServidor = null;

    try {
        dadosServidor = await enviarCorridaAoServidor(origem, destino);

    } catch (erro) {
        console.error("WN57 - erro ao registrar corrida:", erro);

        if (botao) {
            botao.disabled = false;
            botao.innerHTML = conteudoOriginal;
        }

        mostrarErro(erro.message);

        if (erro.semLogin) {
            setTimeout(() => {
                window.location.href = PAGINA_LOGIN;
            }, 1500);
        }

        return;
    }

    /* ---------- Guardar a viagem no histórico local ---------- */

    const corridaServidor = dadosServidor?.corrida || dadosServidor || {};
    const idServidor = corridaServidor.id ?? corridaServidor._id ?? null;

    if (idServidor !== null) {
        salvarStorage(STORAGE_KEYS.idCorrida, idServidor);
    }

    const viagem = {
        idServidor,
        origem,
        destino,
        categoria: categoriaSelecionada,
        valor: valorFinal,
        valorOriginal: valorSelecionado,
        desconto: descontoCorrida,
        pagamento: pagamentoSelecionado,
        status: "solicitada",
        data: new Date().toISOString()
    };

    let viagens = [];

    try {
        viagens = JSON.parse(
            lerStorage(STORAGE_KEYS.viagens, "[]")
        );

        if (!Array.isArray(viagens)) {
            viagens = [];
        }
    } catch {
        viagens = [];
    }

    viagens.push(viagem);

    const sucesso = salvarStorage(
        STORAGE_KEYS.viagens,
        JSON.stringify(viagens)
    );

    if (!sucesso) {
        // A corrida já foi registrada no servidor; só o histórico local falhou.
        console.warn("WN57: corrida registrada, mas o histórico local não foi salvo.");
    }

    /* ---------- Próxima página ---------- */

    if (categoriaSelecionada === "WN Pet") {
        window.location.href = "/html/corrida/petaviso.html";
    } else {
        window.location.href = "/html/corrida/confirmar-endereco.html";
    }
}

/* =========================================================
   17. GEOCODIFICAÇÃO - NOMINATIM
========================================================= */

/*
   Região de Pinhais e Curitiba.
   A busca é limitada à região para evitar resultados
   em outros estados, como o Rio de Janeiro.
*/

const LIMITES_PINHAIS = {
    esquerda: -49.30,
    direita: -49.10,
    cima: -25.35,
    baixo: -25.55
};

function executarNominatim(url) {
    const tarefa = async () => {
        const espera = Math.max(
            0,
            CONFIG.intervaloNominatim -
            (Date.now() - ultimaConsultaNominatim)
        );

        if (espera > 0) {
            await esperar(espera);
        }

        const controller = new AbortController();

        const timeout = setTimeout(
            () => controller.abort(),
            CONFIG.timeoutAPI
        );

        try {
            ultimaConsultaNominatim = Date.now();

            const resposta = await fetch(url, {
                signal: controller.signal,
                headers: {
                    Accept: "application/json"
                }
            });

            if (!resposta.ok) {
                throw new Error(
                    "Erro ao consultar o serviço de endereços."
                );
            }

            return await resposta.json();

        } catch (erro) {
            if (erro.name === "AbortError") {
                throw new Error(
                    "A busca do endereço demorou demais."
                );
            }

            throw erro;

        } finally {
            clearTimeout(timeout);
        }
    };

    const resultado = filaNominatim.then(tarefa, tarefa);

    filaNominatim = resultado.catch(() => { });

    return resultado;
}

/* =========================================================
   18. FUNÇÃO GEOCODIFICAR
========================================================= */

async function geocodificar(endereco, tipo = "endereço") {
    if (!endereco || !endereco.trim()) {
        throw new Error(
            `Informe o endereço de ${tipo}.`
        );
    }

    const consulta = endereco.trim();

    const chaveCache =
        "wn57_geo_" +
        consulta.toLocaleLowerCase("pt-BR");

    const cache = lerCache(chaveCache);

    if (
        Array.isArray(cache) &&
        cache.length === 2 &&
        cache.every(Number.isFinite)
    ) {
        return cache;
    }

    /*
       Não acrescentar Weissópolis a endereços que
       já tenham cidade ou bairro especificados.
    */

    const enderecoCompleto =
        /pinhais|curitiba|paraná|parana|pr\b/i.test(consulta)
            ? consulta
            : `${consulta}, Weissópolis, Pinhais, Paraná, Brasil`;

    const parametros = new URLSearchParams({
        format: "jsonv2",
        limit: "5",
        q: enderecoCompleto,
        countrycodes: "br",
        viewbox: [
            LIMITES_PINHAIS.esquerda,
            LIMITES_PINHAIS.cima,
            LIMITES_PINHAIS.direita,
            LIMITES_PINHAIS.baixo
        ].join(","),
        bounded: "1"
    });

    const url =
        "https://nominatim.openstreetmap.org/search?" +
        parametros.toString();

    let resultados = [];

    try {
        resultados = await executarNominatim(url);
    } catch (erro) {
        console.warn("WN57: Nominatim falhou, tentando Photon.", erro);
    }

    // Plano B: Photon entende nomes de lugares (ex.: "condor avenida irai")
    if (!Array.isArray(resultados) || !resultados.length) {
        resultados = await buscarPhoton(consulta);
    }

    if (!resultados.length) {
        throw new Error(
            `Endereço de ${tipo} não encontrado na região de Pinhais.`
        );
    }

    /*
       Verificar se as coordenadas estão dentro
       da região permitida.
    */

    const resultadoValido = resultados.find(item => {
        const lat = Number(item.lat);
        const lon = Number(item.lon);

        return (
            Number.isFinite(lat) &&
            Number.isFinite(lon) &&
            lat <= LIMITES_PINHAIS.cima &&
            lat >= LIMITES_PINHAIS.baixo &&
            lon >= LIMITES_PINHAIS.esquerda &&
            lon <= LIMITES_PINHAIS.direita
        );
    });

    if (!resultadoValido) {
        throw new Error(
            "O endereço encontrado está fora da região atendida."
        );
    }

    const coordenadas = [
        Number(resultadoValido.lat),
        Number(resultadoValido.lon)
    ];

    salvarCache(chaveCache, coordenadas);

    return coordenadas;
}

/*
   Busca alternativa (Photon / OpenStreetMap).
   Retorna no mesmo formato do Nominatim: [{ lat, lon }].
*/

async function buscarPhoton(consulta) {
    const parametros = new URLSearchParams({
        q: consulta,
        limit: "5",
        lang: "default",
        lat: "-25.4429",
        lon: "-49.1927",
        bbox: [
            LIMITES_PINHAIS.esquerda,
            LIMITES_PINHAIS.baixo,
            LIMITES_PINHAIS.direita,
            LIMITES_PINHAIS.cima
        ].join(",")
    });

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), CONFIG.timeoutAPI);

    try {
        const resposta = await fetch(
            "https://photon.komoot.io/api/?" + parametros.toString(),
            { signal: controller.signal }
        );

        if (!resposta.ok) return [];

        const dados = await resposta.json();

        return (dados.features || []).map(f => ({
            lat: f.geometry.coordinates[1],
            lon: f.geometry.coordinates[0]
        }));
    } catch (erro) {
        console.warn("WN57: Photon falhou.", erro);
        return [];
    } finally {
        clearTimeout(timeout);
    }
}

/*
   Disponibilizar a função globalmente também.
   Isso evita problemas caso outro script a utilize.
*/

window.geocodificar = geocodificar;

/* =========================================================
   19. GEOCODIFICAÇÃO REVERSA - GPS
========================================================= */

async function obterEnderecoGPS(latitude, longitude) {
    const url =
        "https://nominatim.openstreetmap.org/reverse?" +
        new URLSearchParams({
            format: "jsonv2",
            lat: String(latitude),
            lon: String(longitude)
        });

    const dados = await executarNominatim(url);

    if (!dados || !dados.display_name) {
        throw new Error("Não foi possível identificar o endereço.");
    }

    return dados.display_name;
}

/* =========================================================
   20. MARCADORES DO MAPA
========================================================= */

function criarMarcador(tipo) {
    const origem = tipo === "origem";

    const cor = origem ? "#ff2d8f" : "#171717";
    const simbolo = origem ? "●" : "■";

    return L.divIcon({
        className: "marcador-wn57",

        html: `
            <div style="
                width:28px;
                height:28px;
                display:flex;
                align-items:center;
                justify-content:center;
                background:${cor};
                color:white;
                border:3px solid white;
                border-radius:50%;
                box-shadow:0 2px 8px rgba(0,0,0,.35);
                font-size:12px;
            ">${simbolo}</div>
        `,

        iconSize: [28, 28],
        iconAnchor: [14, 14]
    });
}

/* =========================================================
   21. INFORMAÇÕES DA ROTA
   (o texto "detalhe" é guardado em português e traduzido
    na hora de mostrar)
========================================================= */

function atualizarInfoMapa(distancia, detalhe) {
    ultimaInfoMapa = { distancia, detalhe };

    const info = elemento("infoRota");

    if (!info) return;

    const negrito = info.querySelector("b");
    const pequeno = info.querySelector("small");

    if (negrito) {
        negrito.textContent = distancia;
    }

    if (pequeno) {
        pequeno.textContent = t(detalhe);
    }
}

/* =========================================================
   22. LIMPAR ROTA ANTIGA
========================================================= */

function limparRotaMapa() {
    if (!mapa) return;

    if (marcadorOrigem) {
        mapa.removeLayer(marcadorOrigem);
        marcadorOrigem = null;
    }

    if (marcadorDestino) {
        mapa.removeLayer(marcadorDestino);
        marcadorDestino = null;
    }

    if (linhaRota) {
        mapa.removeLayer(linhaRota);
        linhaRota = null;
    }
}

/* =========================================================
   23. ATUALIZAR ROTA NO MAPA
========================================================= */

async function atualizarRotaNoMapa() {
    if (!mapa) return;

    const minhaVersao = ++versaoRota;

    const origem =
        elemento("origemTxt")?.textContent?.trim() ||
        lerStorage(STORAGE_KEYS.origem);

    const destino =
        elemento("destinoTxt")?.textContent?.trim() ||
        lerStorage(STORAGE_KEYS.destino);

    if (!origem || !destino) {
        atualizarInfoMapa("-- km", "Informe origem e destino.");
        return;
    }

    limparRotaMapa();
    atualizarInfoMapa("-- km", "Calculando trajeto...");

    /*
       Busca origem e destino SEPARADAMENTE.
       Se um falhar, o outro continua aparecendo no mapa.
    */

    let coordOrigem = null;
    let coordDestino = null;
    let erroOrigem = null;
    let erroDestino = null;

    try {
        coordOrigem = coordenadasOrigemGPS
            ? coordenadasOrigemGPS
            : await geocodificarComFallback(origem, "origem");
    } catch (erro) {
        erroOrigem = erro;
        console.error("WN57 - Origem:", erro);
    }

    if (minhaVersao !== versaoRota) return;

    try {
        coordDestino = await geocodificarComFallback(destino, "destino");
    } catch (erro) {
        erroDestino = erro;
        console.error("WN57 - Destino:", erro);
    }

    if (minhaVersao !== versaoRota) return;

    console.log("WN57 - coordOrigem:", coordOrigem, "coordDestino:", coordDestino);

    /*
       Coloca os marcadores (cria se não existir).
    */

    if (coordOrigem) {
        marcadorOrigem = colocarMarcadorWN57(
            marcadorOrigem, coordOrigem, "origem", t("Origem"), origem
        );
    }

    if (coordDestino) {
        marcadorDestino = colocarMarcadorWN57(
            marcadorDestino, coordDestino, "destino", t("Destino"), destino
        );
    }

    /*
       Enquadra o mapa mesmo se o OSRM falhar.
    */

    if (coordOrigem && coordDestino) {
        mapa.fitBounds(L.latLngBounds(coordOrigem, coordDestino), {
            padding: [60, 60],
            maxZoom: 16
        });
    } else if (coordOrigem || coordDestino) {
        mapa.setView(coordOrigem || coordDestino, 16);
    }

    if (!coordOrigem || !coordDestino) {
        const erro = erroDestino || erroOrigem;
        atualizarInfoMapa("-- km", erro ? erro.message : "Endereço não encontrado.");
        return;
    }

    /*
       Calcular rota pelo OSRM (usa lng,lat).
    */

    const rotaURL =
        "https://router.project-osrm.org/route/v1/driving/" +
        `${coordOrigem[1]},${coordOrigem[0]};` +
        `${coordDestino[1]},${coordDestino[0]}` +
        "?overview=full&geometries=geojson";

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), CONFIG.timeoutAPI);

    try {
        const resposta = await fetch(rotaURL, { signal: controller.signal });

        if (!resposta.ok) {
            throw new Error("Serviço de rotas indisponível.");
        }

        const dados = await resposta.json();

        if (minhaVersao !== versaoRota) return;

        if (dados.code !== "Ok" || !dados.routes?.length) {
            throw new Error("Não foi encontrada uma rota.");
        }

        const rota = dados.routes[0];

        const contorno = L.geoJSON(rota.geometry, {
            style: { color: "#ffffff", weight: 10, opacity: 1 }
        });

        const trajeto = L.geoJSON(rota.geometry, {
            style: { color: "#171717", weight: 5, opacity: 1 }
        });

        if (linhaRota) mapa.removeLayer(linhaRota);

        linhaRota = L.featureGroup([contorno, trajeto]).addTo(mapa);

        // Marcadores sempre por cima da linha
        marcadorOrigem?.setZIndexOffset(1000);
        marcadorDestino?.setZIndexOffset(1000);

        mapa.fitBounds(linhaRota.getBounds(), {
            padding: [45, 45],
            maxZoom: 16
        });

        const km = (rota.distance / 1000)
            .toFixed(1)
            .replace(".", idiomaAtual === "en" ? "." : ",");

        const minutos = Math.max(1, Math.round(rota.duration / 60));

        atualizarInfoMapa(`${km} km`, `aprox. ${minutos} min`);

    } catch (erro) {
        if (minhaVersao !== versaoRota) return;

        console.error("WN57 - Erro de rota:", erro);

        atualizarInfoMapa(
            "-- km",
            erro.name === "AbortError"
                ? "Tempo de cálculo esgotado."
                : erro.message
        );

    } finally {
        clearTimeout(timeout);
    }
}

/*
   Cria o marcador se não existir, ou só move se já existir.
*/

function colocarMarcadorWN57(marcador, coord, tipo, titulo, texto) {
    if (marcador) {
        marcador.setLatLng(coord);
        if (!mapa.hasLayer(marcador)) marcador.addTo(mapa);
    } else {
        marcador = L.marker(coord, {
            icon: criarMarcador(tipo),
            zIndexOffset: 1000
        }).addTo(mapa);
    }

    marcador.bindPopup(criarPopupSeguro(titulo, texto));
    return marcador;
}

/*
   Tenta o endereço completo; se não achar,
   tenta sem o número e depois só rua + cidade.
*/

async function geocodificarComFallback(endereco, tipo) {
    const tentativas = [endereco];

    const semNumero = endereco.replace(/,\s*\d+[a-zA-Z]?\s*(?=,|$)/, "");
    if (semNumero !== endereco) tentativas.push(semNumero);

    const rua = endereco.split(",")[0].trim();
    if (rua) tentativas.push(`${rua}, Pinhais, Paraná`);

    let ultimoErro = null;

    for (const tentativa of tentativas) {
        try {
            return await geocodificar(tentativa, tipo);
        } catch (erro) {
            ultimoErro = erro;
        }
    }

    throw ultimoErro || new Error(`Endereço de ${tipo} não encontrado.`);
}

/* =========================================================
   24. LOCALIZAÇÃO GPS
========================================================= */

function solicitarLocalizacaoGPS() {
    if (!navigator.geolocation) {
        atualizarInfoMapa(
            "-- km",
            "GPS não disponível. Usando endereço informado."
        );

        atualizarRotaNoMapa();
        return;
    }

    atualizarInfoMapa(
        "-- km",
        "Obtendo localização..."
    );

    navigator.geolocation.getCurrentPosition(
        async posicao => {
            const latitude = posicao.coords.latitude;
            const longitude = posicao.coords.longitude;

            const coordenadas = [latitude, longitude];

            /*
               Não aceitar GPS fora da região de Pinhais.
            */

            const dentroDaRegiao =
                latitude <= LIMITES_PINHAIS.cima &&
                latitude >= LIMITES_PINHAIS.baixo &&
                longitude >= LIMITES_PINHAIS.esquerda &&
                longitude <= LIMITES_PINHAIS.direita;

            if (!dentroDaRegiao) {
                coordenadasOrigemGPS = null;

                atualizarInfoMapa(
                    "-- km",
                    "Localização fora da região atendida."
                );

                await atualizarRotaNoMapa();
                return;
            }

            coordenadasOrigemGPS = coordenadas;

            salvarStorage(
                STORAGE_KEYS.gps,
                JSON.stringify(coordenadas)
            );

            try {
                const endereco = await obterEnderecoGPS(
                    latitude,
                    longitude
                );

                /*
                   Evitar substituir uma origem digitada
                   manualmente pelo GPS.
                */

                const origemSalva =
                    lerStorage(STORAGE_KEYS.origem);

                if (!origemSalva) {
                    salvarStorage(
                        STORAGE_KEYS.origem,
                        endereco
                    );
                }

                if (elemento("origemTxt") && !origemSalva) {
                    elemento("origemTxt").textContent = endereco;
                }

            } catch (erro) {
                console.warn(
                    "WN57: não foi possível identificar o GPS.",
                    erro
                );
            }

            await atualizarRotaNoMapa();
        },

        async erro => {
            console.warn("WN57 GPS:", erro.message);

            coordenadasOrigemGPS = null;

            const mensagens = {
                1: "Permita o acesso à localização.",
                2: "Localização indisponível.",
                3: "Tempo de localização esgotado."
            };

            atualizarInfoMapa(
                "-- km",
                mensagens[erro.code] ||
                "Usando endereço informado."
            );

            await atualizarRotaNoMapa();
        },

        {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0
        }
    );
}

/* =========================================================
   25. INICIALIZAR MAPA
========================================================= */

function iniciarMapa() {
    const mapaElemento = elemento("mapa");

    if (!mapaElemento || typeof L === "undefined") {
        console.error(
            "WN57: Leaflet ou elemento mapa não encontrado."
        );
        return;
    }

    if (mapa) {
        mapa.remove();
        mapa = null;
    }

    mapa = L.map("mapa", {
        scrollWheelZoom: true,
        zoomControl: true
    }).setView(
        CONFIG.centroMapa,
        CONFIG.zoomMapa
    );

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 19
        }
    ).addTo(mapa);

    /*
       Uma única inicialização do GPS.
       A rota será atualizada somente depois.
    */

    solicitarLocalizacaoGPS();

    setTimeout(() => {
        iniciarVeiculosAnimados();
    }, 1500);

    setTimeout(() => {
        mapa.invalidateSize();
    }, 300);
}

/* =========================================================
   26. VEÍCULOS ANIMADOS
========================================================= */

const ROTAS_VEICULOS_WN57 = [
    {
        tipo: "carro",
        inicio: [-25.4380, -49.1900],
        fim: [-25.4490, -49.1800]
    },
    {
        tipo: "moto",
        inicio: [-25.4450, -49.2050],
        fim: [-25.4350, -49.1950]
    },
    {
        tipo: "carro",
        inicio: [-25.4300, -49.1850],
        fim: [-25.4500, -49.2000]
    },
    {
        tipo: "moto",
        inicio: [-25.4520, -49.1900],
        fim: [-25.4380, -49.2100]
    },
    {
        tipo: "carro",
        inicio: [-25.4350, -49.2150],
        fim: [-25.4480, -49.1950]
    },
    {
        tipo: "moto",
        inicio: [-25.4470, -49.1750],
        fim: [-25.4320, -49.1900]
    },
    {
        tipo: "carro",
        inicio: [-25.4550, -49.2050],
        fim: [-25.4400, -49.1850]
    },
    {
        tipo: "moto",
        inicio: [-25.4330, -49.2000],
        fim: [-25.4500, -49.2150]
    },
    {
        tipo: "carro",
        inicio: [-25.4250, -49.1980],
        fim: [-25.4420, -49.2120]
    },
    {
        tipo: "moto",
        inicio: [-25.4400, -49.2200],
        fim: [-25.4580, -49.1980]
    },
    {
        tipo: "carro",
        inicio: [-25.4600, -49.1880],
        fim: [-25.4440, -49.1760]
    },
    {
        tipo: "carro",
        inicio: [-25.4280, -49.2080],
        fim: [-25.4460, -49.1900]
    }
];

/* =========================================================
   ÍCONES ORIGINAIS DOS VEÍCULOS NO MAPA WN57
========================================================= */

const SVG_CARRO_MAPA = `
<svg viewBox="0 0 24 48" xmlns="http://www.w3.org/2000/svg">

    <ellipse cx="12" cy="26" rx="11" ry="21"
        fill="#000" opacity=".18"/>

    <rect x="1.2" y="15" width="3" height="3.4"
        rx="1.2" fill="#111"/>

    <rect x="19.8" y="15" width="3" height="3.4"
        rx="1.2" fill="#111"/>

    <rect x="3.5" y="2.5" width="17" height="43"
        rx="8" fill="#141414"
        stroke="#ffffff" stroke-width="1.2"/>

    <path d="M6 9 Q12 5.5 18 9 L18 13 L6 13 Z"
        fill="#262626"/>

    <path d="M6.5 15 Q12 12 17.5 15 L16.6 21 H7.4 Z"
        fill="#8fa3b8"/>

    <rect x="6.5" y="21" width="11" height="9"
        rx="2" fill="#2c2c2c"/>

    <rect x="9.5" y="24" width="5" height="2.4"
        rx="1.2" fill="#ff2d8f"/>

    <path d="M7.4 30 H16.6 L17.5 35 Q12 37.5 6.5 35 Z"
        fill="#8fa3b8"/>

    <rect x="5" y="3.8" width="4.2" height="2"
        rx="1" fill="#fff6d6"/>

    <rect x="14.8" y="3.8" width="4.2" height="2"
        rx="1" fill="#fff6d6"/>

    <rect x="5" y="41.6" width="4.2" height="1.8"
        rx=".9" fill="#ff2d4f"/>

    <rect x="14.8" y="41.6" width="4.2" height="1.8"
        rx=".9" fill="#ff2d4f"/>

</svg>`;


const SVG_MOTO_MAPA = `
<svg viewBox="0 0 16 36" xmlns="http://www.w3.org/2000/svg">

    <ellipse cx="8" cy="19" rx="7" ry="16"
        fill="#000" opacity=".18"/>

    <rect x="6.2" y="1.5" width="3.6" height="9"
        rx="1.8" fill="#111"/>

    <rect x="6.2" y="25.5" width="3.6" height="9"
        rx="1.8" fill="#111"/>

    <rect x="5.4" y="9.5" width="5.2" height="17"
        rx="2.6" fill="#2a2a2a"
        stroke="#ffffff" stroke-width=".9"/>

    <path d="M1.8 12.5 H14.2"
        stroke="#111" stroke-width="2"
        stroke-linecap="round"/>

    <rect x="6.6" y="3.2" width="2.8" height="1.6"
        rx=".8" fill="#fff6d6"/>

    <ellipse cx="8" cy="20" rx="4.2" ry="5"
        fill="#ff2d8f"/>

    <circle cx="8" cy="17.2" r="2.9"
        fill="#111" stroke="#ffffff"
        stroke-width=".9"/>

    <rect x="6.8" y="31" width="2.4" height="1.4"
        rx=".7" fill="#ff2d4f"/>

</svg>`;


/* =========================================================
   CRIAR ÍCONE ANIMADO ORIGINAL
========================================================= */

function criarIconeVeiculoAnimado(tipo, angulo = 0) {

    const ehMoto = String(tipo).toLowerCase().includes("moto");

    const largura = ehMoto ? 14 : 20;
    const altura = ehMoto ? 32 : 40;

    return L.divIcon({

        className: "wn57-veiculo-mapa",

        html: `
            <div class="wn57-veiculo-rotacao"
                 style="transform: rotate(${angulo}deg)">

                ${ehMoto ? SVG_MOTO_MAPA : SVG_CARRO_MAPA}

            </div>
        `,

        iconSize: [largura, altura],

        iconAnchor: [largura / 2, altura / 2]

    });
}

/* =========================================================
   28. BUSCAR ROTA DOS VEÍCULOS
========================================================= */

async function buscarRotaVeiculo(dados) {
    const chave =
        `${STORAGE_KEYS.veiculosCache}_${dados.tipo}_` +
        `${dados.inicio.join(",")}_${dados.fim.join(",")}`;

    const cache = lerCache(chave);

    if (Array.isArray(cache) && cache.length >= 2) {
        return cache;
    }

    const [lat1, lon1] = dados.inicio;
    const [lat2, lon2] = dados.fim;

    const url =
        "https://router.project-osrm.org/route/v1/driving/" +
        `${lon1},${lat1};${lon2},${lat2}` +
        "?overview=full&geometries=geojson";

    const controller = new AbortController();

    const timeout = setTimeout(
        () => controller.abort(),
        CONFIG.timeoutAPI
    );

    try {
        const resposta = await fetch(url, {
            signal: controller.signal
        });

        if (!resposta.ok) {
            throw new Error("Erro ao buscar rota do veículo.");
        }

        const resultado = await resposta.json();

        if (
            resultado.code !== "Ok" ||
            !resultado.routes?.length
        ) {
            throw new Error("Rota do veículo não encontrada.");
        }

        const caminho =
            resultado.routes[0].geometry.coordinates.map(
                ponto => [ponto[1], ponto[0]]
            );

        salvarCache(chave, caminho);

        return caminho;

    } finally {
        clearTimeout(timeout);
    }
}

/* =========================================================
   29. CALCULAR DISTÂNCIAS DOS VEÍCULOS
========================================================= */

function calcularDistancias(caminho) {
    const distancias = [0];

    for (let i = 1; i < caminho.length; i++) {
        const a = L.latLng(caminho[i - 1]);
        const b = L.latLng(caminho[i]);

        distancias.push(
            distancias[i - 1] + a.distanceTo(b)
        );
    }

    return distancias;
}

/* =========================================================
   30. POSIÇÃO DO VEÍCULO
========================================================= */

function pontoNaDistancia(veiculo, distancia) {
    const d = Math.max(
        0,
        Math.min(veiculo.distanciaTotal, distancia)
    );

    const distancias = veiculo.distancias;
    const caminho = veiculo.caminho;

    let indice = 0;

    while (
        indice < distancias.length - 2 &&
        distancias[indice + 1] < d
    ) {
        indice++;
    }

    const trecho =
        distancias[indice + 1] - distancias[indice];

    const fracao = trecho > 0
        ? (d - distancias[indice]) / trecho
        : 0;

    const a = caminho[indice];
    const b = caminho[indice + 1];

    return [
        a[0] + (b[0] - a[0]) * fracao,
        a[1] + (b[1] - a[1]) * fracao
    ];
}

/* =========================================================
   31. DIREÇÃO DO VEÍCULO
========================================================= */

function calcularDirecao(de, para) {
    const dLat = para[0] - de[0];

    const dLng =
        (para[1] - de[1]) *
        Math.cos(de[0] * Math.PI / 180);

    if (
        Math.abs(dLat) < 1e-9 &&
        Math.abs(dLng) < 1e-9
    ) {
        return 0;
    }

    return Math.atan2(dLng, dLat) * 180 / Math.PI;
}

/* =========================================================
   32. ADICIONAR VEÍCULO AO MAPA
========================================================= */

async function adicionarVeiculoAnimado(dados, indice) {
    try {
        const caminho = await buscarRotaVeiculo(dados);

        if (!mapa || !caminho || caminho.length < 2) {
            return;
        }

        const distancias = calcularDistancias(caminho);

        const distanciaTotal =
            distancias[distancias.length - 1];

        if (!distanciaTotal) return;

        const marcador = L.marker(caminho[0], {
            icon: criarIconeVeiculoAnimado(dados.tipo),
            zIndexOffset: 500 + indice,
            interactive: false,
            keyboard: false
        }).addTo(mapa);

        const veiculo = {
            marcador,
            caminho,
            distancias,
            distanciaTotal,
            distanciaPercorrida:
                distanciaTotal * ((indice * 0.117) % 0.7),
            velocidade:
                dados.tipo === "moto"
                    ? CONFIG.velocidadeMoto
                    : CONFIG.velocidadeCarro,
            tipo: dados.tipo,
            sentido: 1,
            ultimaDirecao: 0
        };

        veiculosAnimadosWN57.push(veiculo);

    } catch (erro) {
        console.warn(
            "WN57: não foi possível adicionar veículo.",
            erro
        );
    }
}

/* =========================================================
   33. ATUALIZAR ANIMAÇÃO
========================================================= */

function animarVeiculosWN57() {
    if (document.hidden || !mapa) return;

    if (animacaoVeiculosWN57) {
        cancelAnimationFrame(animacaoVeiculosWN57);
    }

    let ultimoTempo = null;

    function atualizar(tempo) {
        if (!mapa || document.hidden) {
            animacaoVeiculosWN57 = null;
            return;
        }

        const delta = ultimoTempo === null
            ? 0
            : Math.min((tempo - ultimoTempo) / 1000, 0.05);

        ultimoTempo = tempo;

        veiculosAnimadosWN57.forEach(veiculo => {
            veiculo.distanciaPercorrida +=
                veiculo.velocidade *
                delta *
                veiculo.sentido;

            if (
                veiculo.distanciaPercorrida >=
                veiculo.distanciaTotal
            ) {
                veiculo.distanciaPercorrida =
                    veiculo.distanciaTotal;

                veiculo.sentido = -1;
            }

            if (veiculo.distanciaPercorrida <= 0) {
                veiculo.distanciaPercorrida = 0;
                veiculo.sentido = 1;
            }

            const atual = pontoNaDistancia(
                veiculo,
                veiculo.distanciaPercorrida
            );

            const proximo = pontoNaDistancia(
                veiculo,
                veiculo.distanciaPercorrida +
                veiculo.sentido * 12
            );

            const direcao = calcularDirecao(
                atual,
                proximo
            );

            veiculo.ultimaDirecao = direcao;

            veiculo.marcador.setLatLng(atual);

            veiculo.marcador.setIcon(
                criarIconeVeiculoAnimado(
                    veiculo.tipo,
                    direcao
                )
            );
        });

        animacaoVeiculosWN57 =
            requestAnimationFrame(atualizar);
    }

    animacaoVeiculosWN57 =
        requestAnimationFrame(atualizar);
}

/* =========================================================
   34. INICIAR VEÍCULOS ANIMADOS
========================================================= */

async function iniciarVeiculosAnimados() {
    if (!mapa || veiculosAnimadosIniciados) return;

    veiculosAnimadosIniciados = true;

    for (
        let i = 0;
        i < ROTAS_VEICULOS_WN57.length;
        i++
    ) {
        if (!mapa) return;

        await adicionarVeiculoAnimado(
            ROTAS_VEICULOS_WN57[i],
            i
        );

        await esperar(350);
    }

    animarVeiculosWN57();
}

/* =========================================================
   35. PAUSAR ANIMAÇÕES QUANDO A ABA ESTIVER OCULTA
========================================================= */

document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        if (animacaoVeiculosWN57) {
            cancelAnimationFrame(animacaoVeiculosWN57);
        }

        animacaoVeiculosWN57 = null;

    } else if (veiculosAnimadosIniciados) {
        animarVeiculosWN57();
    }
});

/* =========================================================
   SELECIONAR CATEGORIA DO VEÍCULO (escopo global)
========================================================= */

function selecionarVeiculo(veiculo, botaoSelecionado) {
    if (!veiculo) return;

    categoriaSelecionada = veiculo.nome;
    valorSelecionado = Number(veiculo.valor);

    document.querySelectorAll("#veiculos .veiculo").forEach(botao => {
        const selecionado = botao === botaoSelecionado;

        botao.classList.toggle("ativo", selecionado);
        botao.setAttribute("aria-checked", String(selecionado));
        botao.tabIndex = 0;
    });

    salvarStorage(STORAGE_KEYS.categoria, categoriaSelecionada);
    salvarStorage(STORAGE_KEYS.valor, valorSelecionado);

    atualizarResumo();
    limparErro();
}

window.selecionarVeiculo = selecionarVeiculo;

/* =========================================================
   CARTÕES: NORMALIZAR, BANDEIRA, CVV E CARTÕES SALVOS
========================================================= */

function normalizarPagamento(pg) {
    const texto = String(pg || "").normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "").toLowerCase();
    if (texto === "pix") return "Pix";
    if (texto === "dinheiro" || texto === "cash") return "Dinheiro";
    return "Cartão";
}

const CHAVE_CARTOES = "wn57_cartoes";

function detectarBandeira(numero) {
    if (/^4/.test(numero)) return "Visa";
    if (/^(5[1-5]|2[2-7])/.test(numero)) return "Mastercard";
    if (/^3[47]/.test(numero)) return "Amex";
    if (/^(4011|4312|4389|4514|4576|5041|5066|5067|509|6277|6362|6363|650|6516|6550)/.test(numero)) return "Elo";
    if (/^(606282|3841)/.test(numero)) return "Hipercard";
    return "";
}

function lerCartoes() {
    try {
        const lista = JSON.parse(localStorage.getItem(CHAVE_CARTOES) || "[]");
        return Array.isArray(lista) ? lista : [];
    } catch {
        return [];
    }
}

function salvarCartoes(lista) {
    try {
        localStorage.setItem(CHAVE_CARTOES, JSON.stringify(lista));
    } catch (erro) {
        console.warn("WN57: não foi possível salvar cartões.", erro);
    }
}

function renderizarCartoes() {
    const area = elemento("listaCartoes");
    if (!area) return;

    const cartoes = lerCartoes();
    area.innerHTML = "";

    if (!cartoes.length) {
        const vazio = document.createElement("p");
        vazio.style.cssText = "font-size:12px;color:#aaa";
        vazio.textContent = t("Nenhum cartão cadastrado.");
        area.appendChild(vazio);
        return;
    }

    cartoes.forEach((cartao, indice) => {
        const linha = document.createElement("div");
        linha.style.cssText =
            "display:flex;align-items:center;justify-content:space-between;" +
            "gap:10px;padding:10px 12px;margin-top:8px;border:1px solid #333;border-radius:10px";

        const texto = document.createElement("span");
        texto.textContent =
            `${cartao.bandeira || t("Cartão")} •••• ${cartao.final} — ${cartao.nome}`;

        const remover = document.createElement("button");
        remover.type = "button";
        remover.textContent = t("Remover");
        remover.style.cssText =
            "background:none;border:0;color:#ff2d8f;cursor:pointer;font:inherit";
        remover.addEventListener("click", () => {
            const lista = lerCartoes();
            lista.splice(indice, 1);
            salvarCartoes(lista);
            renderizarCartoes();
        });

        linha.append(texto, remover);
        area.appendChild(linha);
    });
}

/* =========================================================
   WN57 - CADASTRO E VALIDAÇÃO SIMULADA DE CARTÃO
========================================================= */

function cadastrarCartaoAtual() {
    limparErro();

    const numeroCampo = elemento("numero");
    const nomeCampo = elemento("nome");
    const validadeCampo = elemento("validade");
    const cvvCampo = elemento("cvv");

    const numero = (numeroCampo?.value || "").replace(/\D/g, "");
    const nome = (nomeCampo?.value || "").trim();
    const validade = (validadeCampo?.value || "").trim();
    const cvv = (cvvCampo?.value || "").replace(/\D/g, "");

    // 1. Verificar campos preenchidos
    if (!numero || !nome || !validade || !cvv) {
        mostrarToast(t("Preencha todos os dados do cartão."), "erro");
        return;
    }

    // 2. Verificar número e algoritmo de Luhn
    if (!validarLuhn(numero)) {
        marcarCampoInvalido("numero");
        mostrarToast(t("Número do cartão inválido."), "erro");
        return;
    }

    // 3. Verificar bandeira reconhecida
    const bandeira = detectarBandeira(numero);
    if (!bandeira) {
        marcarCampoInvalido("numero");

        mostrarAvisoCartao(
            "Cartão não reconhecido",
            "Não conseguimos identificar a bandeira deste cartão. Confira o número digitado e tente novamente."
        );

        return;
    }

    // 4. Verificar tamanho do número
    const amex = /^3[47]/.test(numero);

    if (amex && numero.length !== 15) {
        marcarCampoInvalido("numero");
        mostrarToast(t("Número American Express inválido."), "erro");
        return;
    }

    if (!amex && (numero.length < 13 || numero.length > 16)) {
        marcarCampoInvalido("numero");
        mostrarToast(t("Número do cartão inválido."), "erro");
        return;
    }

    // 5. Verificar nome
    if (nome.length < 3) {
        marcarCampoInvalido("nome");
        mostrarToast(t("Informe o nome impresso no cartão."), "erro");
        return;
    }

    // 6. Verificar validade
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(validade)) {
        marcarCampoInvalido("validade");
        mostrarToast(t("Validade inválida. Use MM/AA."), "erro");
        return;
    }

    const [mes, ano] = validade.split("/").map(Number);
    const anoCompleto = 2000 + ano;
    const agora = new Date();

    if (
        anoCompleto < agora.getFullYear() ||
        (
            anoCompleto === agora.getFullYear() &&
            mes < agora.getMonth() + 1
        )
    ) {
        marcarCampoInvalido("validade");
        mostrarToast(t("Este cartão está vencido."), "erro");
        return;
    }

    // 7. Verificar CVV
    if (amex && cvv.length !== 4) {
        marcarCampoInvalido("cvv");
        mostrarToast(t("O CVV do American Express deve ter 4 dígitos."), "erro");
        return;
    }

    if (!amex && cvv.length !== 3) {
        marcarCampoInvalido("cvv");
        mostrarToast(t("O CVV deve ter 3 dígitos."), "erro");
        return;
    }

    // 8. Verificar se já está cadastrado
    const final = numero.slice(-4);
    const lista = lerCartoes();

    if (lista.some(cartao => cartao.final === final)) {
        mostrarToast(t("Este cartão já está cadastrado."), "aviso");
        return;
    }

    // 9. Cadastro demonstrativo
    lista.push({
        nome: nome,
        final: final,
        bandeira: bandeira
    });

    try {
        localStorage.setItem(CHAVE_CARTOES, JSON.stringify(lista));

        renderizarCartoes();

        // Limpar campos
        numeroCampo.value = "";
        nomeCampo.value = "";
        validadeCampo.value = "";
        cvvCampo.value = "";

        const elementoBandeira = elemento("bandeiraCartao");

        if (elementoBandeira) {
            elementoBandeira.textContent = "";
        }

        mostrarToast(
            `${t("Cartão validado e cadastrado!")} ${bandeira} •••• ${final}`,
            "sucesso",
            4500
        );

    } catch (erro) {
        console.error("Erro ao salvar cartão:", erro);
        mostrarToast(t("Erro ao cadastrar o cartão."), "erro");
    }
}

function configurarCartoes() {
    const numero = elemento("numero");
    const bandeira = elemento("bandeiraCartao");
    const cvv = elemento("cvv");

    numero?.addEventListener("input", () => {
        if (bandeira) {
            bandeira.textContent =
                detectarBandeira(numero.value.replace(/\D/g, ""));
        }
    });

    elemento("mostrarCvv")?.addEventListener("click", () => {
        if (!cvv) return;
        cvv.type = cvv.type === "password" ? "text" : "password";
    });

    elemento("cadastrarCartao")?.addEventListener("click", cadastrarCartaoAtual);

    // Garante que os campos estejam liberados para digitar
    ["numero", "nome", "validade", "cvv"].forEach(id => {
        const campo = elemento(id);
        if (!campo) return;
        campo.disabled = false;
        campo.readOnly = false;
        campo.style.pointerEvents = "auto";
    });

    renderizarCartoes();
}

/* =========================================================
   36. INICIALIZAÇÃO GERAL
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    // idioma primeiro: lê a escolha salva e liga o botão PT-BR / EN
    configurarIdioma();

    carregarTrajeto();

    montarVeiculos();
    configurarPagamentos();

    configurarCartoes();

    // Abre já no formulário da aba marcada como ativa
    const abaAtiva = document.querySelector(".aba.ativo");
    pagamentoSelecionado = normalizarPagamento(abaAtiva?.dataset.pg || pagamentoSelecionado);
    mostrarFormulario(pagamentoSelecionado);
    atualizarResumo();

    configurarEdicaoDestino();

    configurarConfirmacao();

    iniciarMapa();

    // traduz os textos fixos do HTML e acerta o texto do botão de idioma
    traduzirPagina();
    atualizarBotoesIdioma();

    console.log(
        "WN57: sistema de corrida inicializado com sucesso. Idioma:",
        idiomaAtual
    );
});

/* =========================================================
   WN57 - REDIRECIONAMENTO PARA PAGAMENTO FINAL
========================================================= */

function abrirPagamentoFinal() {

    // Recuperar forma de pagamento escolhida
    const pagamento = normalizarPagamento(
        lerStorage(STORAGE_KEYS.pagamento, pagamentoSelecionado)
    );

    // Garantir que o valor da corrida esteja salvo
    salvarStorage(
        STORAGE_KEYS.valor,
        calcularTotalCorrida()
    );

    const paginas = {
        "Pix": "/html/corrida/pagamento.pix.html",
        "Dinheiro": "/html/corrida/pagamento.dinheiro.html",
        "Cartão": "/html/corrida/pagamento.cartao.html"
    };

    const destino = paginas[pagamento];

    if (!destino) {
      mostrarToast(t("Forma de pagamento não identificada."), "erro");
    }

    window.location.href = destino;
}

// Disponibilizar para outros scripts da corrida
window.abrirPagamentoFinal = abrirPagamentoFinal;

/* =========================================================
   WN57 - AVISO PERSONALIZADO DE CARTÃO
========================================================= */

function mostrarAvisoCartao(titulo, mensagem) {
    const avisoAntigo = document.querySelector(".aviso-cartao-custom");

    if (avisoAntigo) {
        avisoAntigo.remove();
    }

    const aviso = document.createElement("div");
    aviso.className = "aviso-cartao-custom";

    aviso.innerHTML = `
        <div class="aviso-icone">
            <i class="fa-solid fa-credit-card"></i>
        </div>

        <div class="aviso-conteudo">
            <strong>${escaparHTML(t(titulo))}</strong>
            <p>${escaparHTML(t(mensagem))}</p>
        </div>

        <button type="button" aria-label="Fechar">&times;</button>
    `;

    document.body.appendChild(aviso);

    aviso.querySelector("button").onclick = () => {
        aviso.style.animation = "avisoSair .25s ease forwards";
        setTimeout(() => aviso.remove(), 250);
    };

    setTimeout(() => {
        if (aviso.isConnected) {
            aviso.style.animation = "avisoSair .25s ease forwards";
            setTimeout(() => aviso.remove(), 250);
        }
    }, 4500);
}

/*alert de cartao nao cadastrado(nao preecheu)*/
function mostrarToast(mensagem, tipo = "erro", duracao = 3500) {
    // CSS (injetado uma única vez)
    if (!document.getElementById("toast-estilo")) {
        const estilo = document.createElement("style");
        estilo.id = "toast-estilo";
        estilo.textContent = `
            #toast-container{position:fixed;top:20px;left:50%;transform:translateX(-50%);
                display:flex;flex-direction:column;gap:10px;z-index:99999;
                width:min(92vw,380px);pointer-events:none}
            .toast{display:flex;align-items:center;gap:12px;padding:14px 16px;
                background:#141414;color:#fff;border:1px solid #2a2a2a;
                border-left:4px solid #ff2d8f;border-radius:12px;
                box-shadow:0 10px 30px rgba(0,0,0,.5);font-size:.95rem;
                opacity:0;transform:translateY(-20px);
                animation:toast-in .3s ease forwards;pointer-events:auto}
            .toast.erro{border-left-color:#ff4d4f}
            .toast.sucesso{border-left-color:#2ecc71}
            .toast.aviso{border-left-color:#f5a623}
            .toast .toast-texto{flex:1}
            .toast .toast-fechar{background:none;border:none;color:#888;
                font-size:1.1rem;cursor:pointer}
            .toast.saindo{animation:toast-out .3s ease forwards}
            @keyframes toast-in{to{opacity:1;transform:translateY(0)}}
            @keyframes toast-out{to{opacity:0;transform:translateY(-20px)}}
        `;
        document.head.appendChild(estilo);
    }

    // Container (criado se não existir)
    let container = document.getElementById("toast-container");
    if (!container) {
        container = document.createElement("div");
        container.id = "toast-container";
        document.body.appendChild(container);
    }

    const icones = { erro: "⚠️", sucesso: "✅", aviso: "🔔" };

    const toast = document.createElement("div");
    toast.className = `toast ${tipo}`;
    toast.innerHTML = `
        <span class="toast-icone">${icones[tipo] || "💬"}</span>
        <span class="toast-texto"></span>
        <button type="button" class="toast-fechar" aria-label="Fechar">✕</button>
    `;
    toast.querySelector(".toast-texto").textContent = mensagem;

    const remover = () => {
        toast.classList.add("saindo");
        toast.addEventListener("animationend", () => toast.remove(), { once: true });
    };

    toast.querySelector(".toast-fechar").addEventListener("click", remover);
    container.appendChild(toast);
    setTimeout(remover, duracao);
}
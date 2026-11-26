(function () {

    "use strict";

    // ==========================================
    // CONFIGURAÇÕES
    // ==========================================

    const KEY = "minhasViagens";
    const CHAVE_IDIOMA = "wn57_idioma";

    let idiomaAtual = localStorage.getItem(CHAVE_IDIOMA) || "pt";

    const listaElemento = document.getElementById("lista");
    const periodo = document.getElementById("periodo");


    // ==========================================
    // ÍCONES
    // ==========================================

    const moto = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="5.5" cy="16.5" r="3"/>
            <circle cx="18.5" cy="16.5" r="3"/>
            <path d="M5.5 16.5 9 9h4l3 7.5M13 9l2-3h3M9 9H6"/>
        </svg>
    `;

    // mapa nas cores preto e rosa
    const mapa = `
        <svg viewBox="0 0 260 220" preserveAspectRatio="xMidYMid slice">
            <rect width="260" height="220" fill="#170a11"/>
            <path d="M0 60H260M0 130H260M0 190H260M60 0V220M140 0V220M210 0V220"
                stroke="#2c1623" stroke-width="10"/>
            <ellipse cx="45" cy="165" rx="40" ry="45" fill="#2a1020"/>
            <path d="M175 35V75H150V110H105V140H70V185"
                fill="none" stroke="#ff2f8b" stroke-width="5" stroke-linejoin="round"/>
            <circle cx="175" cy="35" r="8" fill="#ff2f8b"/>
            <circle cx="175" cy="35" r="3" fill="#fff"/>
            <rect x="63" y="178" width="14" height="14" fill="#ff6fb1"/>
        </svg>
    `;


    // ==========================================
    // TEXTOS CONTROLADOS PELO JS (por id e cartões)
    // ==========================================

    const textos = {

        pt: {
            titulo: "Minhas viagens",
            subtitulo: "Gerencie suas viagens e acompanhe seus próximos destinos.",
            agendadas: "Você não tem viagens agendadas",
            descricaoAgendadas: "Reserve com antecedência e viaje com tranquilidade.",
            reservar: "Reservar viagem",
            anteriores: "Anteriores",
            pessoal: "Pessoal",
            trabalho: "Trabalho",
            todas: "Todas as viagens",
            ultimos30: "Últimos 30 dias",
            esteAno: "Este ano",
            vazioTitulo: "Nenhuma viagem ainda",
            vazioDescricao: "As corridas que você fizer vão aparecer aqui.",
            cancelada: "Cancelada",
            concluida: "Concluída",
            ajuda: "Ajuda",
            informacoes: "Informações",
            minhaConta: "Minha conta",
            semDestino: "Destino não informado",
            tituloPagina: "WN57 - Minhas viagens"
        },

        en: {
            titulo: "My rides",
            subtitulo: "Manage your rides and keep track of your upcoming destinations.",
            agendadas: "You have no scheduled rides",
            descricaoAgendadas: "Book in advance and travel with peace of mind.",
            reservar: "Book a ride",
            anteriores: "Previous rides",
            pessoal: "Personal",
            trabalho: "Work",
            todas: "All rides",
            ultimos30: "Last 30 days",
            esteAno: "This year",
            vazioTitulo: "No rides yet",
            vazioDescricao: "The rides you take will appear here.",
            cancelada: "Canceled",
            concluida: "Completed",
            ajuda: "Help",
            informacoes: "Information",
            minhaConta: "My account",
            semDestino: "Destination not provided",
            tituloPagina: "WN57 - My rides"
        }

    };

    const pagamentos = {
        "dinheiro": "Cash",
        "cartão": "Card",
        "cartao": "Card",
        "cartão de crédito": "Credit card",
        "cartão de débito": "Debit card",
        "pix": "Pix",
        "carteira": "Wallet"
    };


    // ==========================================
    // TRADUÇÃO DO RESTO DA PÁGINA (cabeçalho, menu, rótulos)
    // Texto que não está na lista é deixado como está.
    // ==========================================

    const dicionario = {
        "Início": "Home",
        "Inicial": "Home",
        "Viajar": "Ride",
        "Sobre-nos": "About us",
        "Sobre nós": "About us",
        "Atividade": "Activity",
        "Ajuda": "Help",
        "Fazer login": "Log in",
        "Entrar": "Log in",
        "Cadastre-se": "Sign up",
        "Carteira": "Wallet",
        "Gerenciar conta": "Manage account",
        "Pedir corrida": "Request a ride",
        "Seja motorista": "Drive with us",
        "Suporte": "Support",
        "Sair": "Log out",
        "Perfil": "Profile",
        "Período": "Period",
        "Pessoal": "Personal",
        "Trabalho": "Work",
        "Minha conta": "My account"
    };

    const memoriaTexto = new WeakMap();

    function traduzirNo(no, idioma) {

        const atual = no.nodeValue;

        if (!atual || !atual.trim()) return;

        // guarda o texto original (português) de cada nó
        let m = memoriaTexto.get(no);

        if (!m || atual !== m.aplicado) {
            m = { pt: atual, aplicado: atual };
            memoriaTexto.set(no, m);
        }

        const limpo = m.pt.trim();
        const alvo = idioma === "en" ? (dicionario[limpo] || limpo) : limpo;
        const novo = m.pt.replace(limpo, alvo);

        if (novo !== atual) no.nodeValue = novo;

        m.aplicado = no.nodeValue;

    }

    function traduzirElemento(elemento, idioma) {

        if (!elemento) return;

        if (elemento.nodeType === Node.TEXT_NODE) {
            traduzirNo(elemento, idioma);
            return;
        }

        const walker = document.createTreeWalker(elemento, NodeFilter.SHOW_TEXT);
        const nos = [];
        let no;

        while ((no = walker.nextNode())) {

            const pai = no.parentElement;

            if (pai && ["SCRIPT", "STYLE", "NOSCRIPT"].includes(pai.tagName)) continue;

            nos.push(no);

        }

        nos.forEach(function (n) { traduzirNo(n, idioma); });

        // atributos (leitores de tela e campos)
        if (elemento.querySelectorAll) {

            elemento.querySelectorAll("[aria-label], [placeholder]").forEach(function (el) {

                ["aria-label", "placeholder"].forEach(function (atributo) {

                    if (!el.hasAttribute(atributo)) return;

                    const chave = "pt" + atributo.replace("-", "");

                    if (!el.dataset[chave]) {
                        el.dataset[chave] = el.getAttribute(atributo);
                    }

                    const original = el.dataset[chave];

                    el.setAttribute(
                        atributo,
                        idioma === "en" ? (dicionario[original] || original) : original
                    );

                });

            });

        }

    }

    // textos criados depois (cabeçalho injetado, lista de viagens)
    const observador = new MutationObserver(function (mutacoes) {

        mutacoes.forEach(function (m) {

            m.addedNodes.forEach(function (n) {
                traduzirElemento(n, idiomaAtual);
            });

        });

    });


    // ==========================================
    // UTILITÁRIOS
    // ==========================================

    function definirTexto(id, texto) {

        const elemento = document.getElementById(id);

        if (elemento) elemento.textContent = texto;

    }

    function escapar(texto) {

        return String(texto ?? "").replace(/[&<>"']/g, function (c) {

            return {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            }[c];

        });

    }

    function localeAtual() {
        return idiomaAtual === "en" ? "en-US" : "pt-BR";
    }

    function formatarValor(valor) {

        return Number(valor || 0).toLocaleString(localeAtual(), {
            style: "currency",
            currency: "BRL"
        });

    }

    function formatarData(data) {

        const d = new Date(data);

        if (isNaN(d.getTime())) return "";

        return d.toLocaleDateString(localeAtual(), { day: "numeric", month: "short" })
            + " • "
            + d.toLocaleTimeString(localeAtual(), { hour: "2-digit", minute: "2-digit" });

    }

    function traduzirPagamento(texto) {

        if (idiomaAtual !== "en") return texto;

        return pagamentos[String(texto).trim().toLowerCase()] || texto;

    }


    // ==========================================
    // CARREGAR E FILTRAR VIAGENS
    // ==========================================

    function carregar() {

        try {

            const dados = JSON.parse(localStorage.getItem(KEY) || "[]");

            return Array.isArray(dados) ? dados : [];

        } catch (erro) {

            console.error("Erro ao carregar viagens:", erro);

            return [];

        }

    }

    function filtrar(corridas) {

        const valor = periodo ? periodo.value : "todas";

        if (valor === "todas") return corridas;

        const agora = new Date();

        if (valor === "365") {

            return corridas.filter(function (viagem) {

                const data = new Date(viagem.data);

                return !isNaN(data.getTime()) && data.getFullYear() === agora.getFullYear();

            });

        }

        const limite = Date.now() - 30 * 86400000;

        return corridas.filter(function (viagem) {

            const data = new Date(viagem.data).getTime();

            return !isNaN(data) && data >= limite;

        });

    }


    // ==========================================
    // CARTÃO DA VIAGEM
    // ==========================================

    function card(viagem, destaque) {

        const t = textos[idiomaAtual];

        const cancelada = viagem.status === "cancelada";
        const destino = escapar(viagem.destino || t.semDestino);
        const data = formatarData(viagem.data);

        const pagamento = viagem.pagamento
            ? " • " + escapar(traduzirPagamento(viagem.pagamento))
            : "";

        const status = `
            <span class="status ${cancelada ? "cancelada" : "ok"}">
                ${cancelada ? t.cancelada : t.concluida}
            </span>
        `;

        const valor = formatarValor(cancelada ? 0 : viagem.valor);

        if (destaque && !cancelada) {

            return `
                <article class="viagem destaque">

                    <div class="mapa" aria-hidden="true">${mapa}</div>

                    <div class="corpo">

                        <div class="linha">

                            <div>
                                <h3 title="${destino}">${destino}</h3>
                                <p class="meta">${data}${pagamento}</p>
                                ${status}
                            </div>

                            <div class="valor">${valor}</div>

                        </div>

                        <div class="acoes">
                            <button class="chip" type="button">${t.ajuda}</button>
                            <button class="chip" type="button">${t.informacoes}</button>
                        </div>

                    </div>

                </article>
            `;

        }

        return `
            <article class="viagem">

                <div class="icone" aria-hidden="true">${moto}</div>

                <div>
                    <h3 title="${destino}">${destino}</h3>
                    <p class="meta">${data}${pagamento}</p>
                    ${status}
                </div>

                <div class="valor">${valor}</div>

                <div class="acoes">
                    <button class="chip" type="button">${t.ajuda}</button>
                </div>

            </article>
        `;

    }


    // ==========================================
    // MOSTRAR VIAGENS
    // ==========================================

    function render() {

        if (!listaElemento) return;

        const t = textos[idiomaAtual];

        const corridas = filtrar(carregar()).sort(function (a, b) {
            return new Date(b.data).getTime() - new Date(a.data).getTime();
        });

        if (!corridas.length) {

            listaElemento.innerHTML = `
                <div class="vazio">
                    <strong>${t.vazioTitulo}</strong>
                    ${t.vazioDescricao}
                </div>
            `;

            return;

        }

        listaElemento.innerHTML = corridas.map(function (viagem, indice) {
            return card(viagem, indice === 0);
        }).join("");

    }


    // ==========================================
    // ATUALIZAR IDIOMA (chamado também pelo cabeçalho)
    // ==========================================

    function atualizarIdiomaPagina() {

        idiomaAtual = localStorage.getItem(CHAVE_IDIOMA) || "pt";

        const t = textos[idiomaAtual] || textos.pt;

        document.documentElement.lang = idiomaAtual === "en" ? "en" : "pt-BR";
        document.title = t.tituloPagina;

        definirTexto("tituloAtividade", t.titulo);
        definirTexto("subAtividade", t.subtitulo);
        definirTexto("tituloAgendadas", t.agendadas);
        definirTexto("descricaoAgendadas", t.descricaoAgendadas);
        definirTexto("btnReservar", t.reservar);
        definirTexto("tituloAnteriores", t.anteriores);
        definirTexto("opcaoPessoal", t.pessoal);
        definirTexto("opcaoTrabalho", t.trabalho);
        definirTexto("opcaoTodas", t.todas);
        definirTexto("opcao30", t.ultimos30);
        definirTexto("opcao365", t.esteAno);

        render();

        // traduz o restante da página (cabeçalho, menu, aria-label)
        traduzirElemento(document.body, idiomaAtual);

    }

    // Integração com o cabeçalho compartilhado
    window.atualizarIdiomaPagina = atualizarIdiomaPagina;


    // ==========================================
    // EVENTOS
    // ==========================================

    const btnReservar = document.getElementById("btnReservar");

    if (btnReservar) {
        btnReservar.addEventListener("click", function () {
            window.location.href = "/html/corrida/solicitar.html";
        });
    }

    if (periodo) periodo.addEventListener("change", render);

    window.addEventListener("storage", function (evento) {

        if (evento.key === KEY) render();

        if (evento.key === CHAVE_IDIOMA) atualizarIdiomaPagina();

    });


    // ==========================================
    // INICIALIZAÇÃO
    // ==========================================

    atualizarIdiomaPagina();

    observador.observe(document.body, { childList: true, subtree: true });

})();
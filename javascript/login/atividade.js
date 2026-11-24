
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
        <svg viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round">

            <circle cx="5.5" cy="16.5" r="3"/>
            <circle cx="18.5" cy="16.5" r="3"/>
            <path d="M5.5 16.5 9 9h4l3 7.5M13 9l2-3h3M9 9H6"/>

        </svg>
    `;


    const mapa = `
        <svg viewBox="0 0 260 220" preserveAspectRatio="xMidYMid slice">

            <rect width="260" height="220" fill="#fdeaf3"/>

            <path d="M0 60H260M0 130H260M0 190H260M60 0V220M140 0V220M210 0V220"
                stroke="#fff"
                stroke-width="10"/>

            <ellipse cx="45" cy="165" rx="40" ry="45" fill="#f3c6da"/>

            <path d="M175 35V75H150V110H105V140H70V185"
                fill="none"
                stroke="#a81d63"
                stroke-width="5"
                stroke-linejoin="round"/>

            <circle cx="175" cy="35" r="8" fill="#a81d63"/>

            <circle cx="175" cy="35" r="3" fill="#fff"/>

            <rect x="63" y="178" width="14" height="14" fill="#4a1230"/>

        </svg>
    `;


    // ==========================================
    // TRADUÇÕES
    // ==========================================

    const textos = {

        pt: {

            titulo: "Atividade",

            subtitulo: "Acompanhe suas viagens agendadas e anteriores.",

            agendadas: "Você não tem viagens agendadas",

            descricaoAgendadas:
                "Reserve com antecedência e viaje com tranquilidade.",

            reservar: "Reservar viagem",

            anteriores: "Anteriores",

            pessoal: "Pessoal",

            trabalho: "Trabalho",

            todas: "Todas as viagens",

            ultimos30: "Últimos 30 dias",

            esteAno: "Este ano",

            vazioTitulo: "Nenhuma viagem ainda",

            vazioDescricao:
                "As corridas que você fizer vão aparecer aqui.",

            cancelada: "Cancelada",

            concluida: "Concluída",

            ajuda: "Ajuda",

            informacoes: "Informações",

            minhaConta: "Minha conta",

            semDestino: "Destino não informado"

        },

        en: {

            titulo: "Activity",

            subtitulo: "Track your scheduled and previous rides.",

            agendadas: "You have no scheduled rides",

            descricaoAgendadas:
                "Book in advance and travel with peace of mind.",

            reservar: "Book a ride",

            anteriores: "Previous rides",

            pessoal: "Personal",

            trabalho: "Work",

            todas: "All rides",

            ultimos30: "Last 30 days",

            esteAno: "This year",

            vazioTitulo: "No rides yet",

            vazioDescricao:
                "The rides you take will appear here.",

            cancelada: "Canceled",

            concluida: "Completed",

            ajuda: "Help",

            informacoes: "Information",

            minhaConta: "My account",

            semDestino: "Destination not provided"

        }

    };


    // ==========================================
    // UTILITÁRIOS
    // ==========================================

    function definirTexto(id, texto) {

        const elemento = document.getElementById(id);

        if (elemento) {
            elemento.textContent = texto;
        }

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


    function formatarValor(valor) {

        return Number(valor || 0).toLocaleString(
            idiomaAtual === "en" ? "en-US" : "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );

    }


    function formatarData(data) {

        const d = new Date(data);

        if (isNaN(d.getTime())) {
            return "";
        }

        return d.toLocaleDateString(
            idiomaAtual === "en" ? "en-US" : "pt-BR",
            {
                day: "numeric",
                month: "short"
            }
        ) + " • " + d.toLocaleTimeString(
            idiomaAtual === "en" ? "en-US" : "pt-BR",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    }


    // ==========================================
    // CARREGAR VIAGENS
    // ==========================================

    function carregar() {

        try {

            const dados = JSON.parse(
                localStorage.getItem(KEY) || "[]"
            );

            return Array.isArray(dados) ? dados : [];

        } catch (erro) {

            console.error("Erro ao carregar viagens:", erro);

            return [];

        }

    }


    // ==========================================
    // FILTRAR VIAGENS
    // ==========================================

    function filtrar(corridas) {

        const valor = periodo ? periodo.value : "todas";

        if (valor === "todas") {
            return corridas;
        }

        const agora = new Date();

        if (valor === "365") {

            return corridas.filter(function (viagem) {

                const data = new Date(viagem.data);

                return !isNaN(data.getTime()) &&
                    data.getFullYear() === agora.getFullYear();

            });

        }

        const dias = 30;

        const limite = Date.now() - dias * 86400000;

        return corridas.filter(function (viagem) {

            const data = new Date(viagem.data).getTime();

            return !isNaN(data) && data >= limite;

        });

    }


    // ==========================================
    // CRIAR CARD DA VIAGEM
    // ==========================================

    function card(viagem, destaque) {

        const t = textos[idiomaAtual];

        const cancelada = viagem.status === "cancelada";

        const destino = escapar(
            viagem.destino || t.semDestino
        );

        const data = formatarData(viagem.data);

        const pagamento = viagem.pagamento
            ? " • " + escapar(viagem.pagamento)
            : "";

        const status = `
            <span class="status ${cancelada ? "cancelada" : "ok"}">
                ${cancelada ? t.cancelada : t.concluida}
            </span>
        `;

        const valor = formatarValor(
            cancelada ? 0 : viagem.valor
        );


        if (destaque && !cancelada) {

            return `

                <article class="viagem destaque">

                    <div class="mapa" aria-hidden="true">

                        ${mapa}

                    </div>

                    <div class="corpo">

                        <div class="linha">

                            <div>

                                <h3 title="${destino}">
                                    ${destino}
                                </h3>

                                <p class="meta">
                                    ${data}${pagamento}
                                </p>

                                ${status}

                            </div>

                            <div class="valor">
                                ${valor}
                            </div>

                        </div>

                        <div class="acoes">

                            <button class="chip" type="button">
                                ${t.ajuda}
                            </button>

                            <button class="chip" type="button">
                                ${t.informacoes}
                            </button>

                        </div>

                    </div>

                </article>

            `;

        }


        return `

            <article class="viagem">

                <div class="icone" aria-hidden="true">

                    ${moto}

                </div>

                <div>

                    <h3 title="${destino}">
                        ${destino}
                    </h3>

                    <p class="meta">
                        ${data}${pagamento}
                    </p>

                    ${status}

                </div>

                <div class="valor">
                    ${valor}
                </div>

                <div class="acoes">

                    <button class="chip" type="button">
                        ${t.ajuda}
                    </button>

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

            return new Date(b.data).getTime() -
                new Date(a.data).getTime();

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


        listaElemento.innerHTML = corridas.map(
            function (viagem, indice) {

                return card(viagem, indice === 0);

            }
        ).join("");

    }


    // ==========================================
    // ATUALIZAR IDIOMA
    // ==========================================

    function atualizarIdiomaPagina() {

        idiomaAtual = localStorage.getItem(CHAVE_IDIOMA) || "pt";

        const t = textos[idiomaAtual] || textos.pt;

        document.documentElement.lang =
            idiomaAtual === "en" ? "en" : "pt-BR";


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


        // Atualiza a lista com o novo idioma

        render();

    }


    // Integração com o cabeçalho compartilhado
    window.atualizarIdiomaPagina = atualizarIdiomaPagina;


    // ==========================================
    // BOTÃO RESERVAR
    // ==========================================

    const btnReservar = document.getElementById("btnReservar");

    if (btnReservar) {

        btnReservar.addEventListener("click", function () {

            window.location.href = "/html/corrida/solicitar.html";

        });

    }


    // ==========================================
    // FILTRO DE PERÍODO
    // ==========================================

    if (periodo) {

        periodo.addEventListener("change", render);

    }


    // ==========================================
    // ATUALIZAÇÃO ENTRE ABAS
    // ==========================================

    window.addEventListener("storage", function (evento) {

        if (evento.key === KEY) {
            render();
        }

        if (evento.key === CHAVE_IDIOMA) {
            atualizarIdiomaPagina();
        }

    });


    // ==========================================
    // INICIALIZAÇÃO
    // ==========================================

    atualizarIdiomaPagina();

})();

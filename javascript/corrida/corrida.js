/* =========================================================
   WN57 - JavaScript da página de solicitação de corrida
   ========================================================= */

"use strict";

let mapa = null;
let marcadorOrigem = null;
let marcadorDestino = null;
let linhaRota = null;

let categoriaSelecionada = "WN";
let valorSelecionado = 15;
let pagamentoSelecionado = "Cartão";

const veiculos = [
    { nome: "WN Moto", valor: 9, descricao: "Rápido e econômico", lugares: 1 },
    { nome: "WN", valor: 15, descricao: "Para o dia a dia", lugares: 4 },
    { nome: "WN Conforto", valor: 22, descricao: "Mais conforto", lugares: 4 },
    { nome: "WN Black", valor: 32, descricao: "Experiência premium", lugares: 4 },
    { nome: "WN PDC", valor: 18, descricao: "Acessibilidade", lugares: 4 },
    { nome: "WN Pet", valor: 20, descricao: "Viaje com seu pet", lugares: 4 }
];

document.addEventListener("DOMContentLoaded", () => {
    carregarTrajeto();
    montarVeiculos();
    configurarPagamentos();
    configurarEdicaoDestino();
    configurarConfirmacao();
    iniciarMapa();
});

function elemento(id) {
    return document.getElementById(id);
}

/* ---------- TRAJETO ---------- */

function carregarTrajeto() {
    const origem =
        localStorage.getItem("origemCorrida") ||
        "Rua Malásia, Pineville - Pinhais";

    const destino =
        localStorage.getItem("destinoCorrida") ||
        "Rua Rio Negro, 403";

    if (elemento("origemTxt")) {
        elemento("origemTxt").textContent = origem;
    }

    if (elemento("destinoTxt")) {
        elemento("destinoTxt").textContent = destino;
    }
}

/* ---------- ÍCONES DOS VEÍCULOS (SVG) ---------- */

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
        <svg viewBox="0 0 ${w} 90" xmlns="http://www.w3.org/2000/svg">
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

            <ellipse cx="${w / 2}" cy="80" rx="${w / 2 - 10}" ry="6"
                fill="url(#s${id})"/>

            <path d="M8 64 L12 50 Q14 44 24 42 L58 38 Q70 20 94 18
                L${128 + f} 18 Q${150 + f} 20 ${160 + f} 38
                L${184 + f} 44 Q${196 + f} 48 ${196 + f} 58
                L${196 + f} 65 Q${196 + f} 69 ${191 + f} 69
                L13 69 Q8 69 8 64 Z"
                fill="url(#c${id})"/>

            <path d="M66 38 Q76 24 94 23 L112 23 L112 38 Z"
                fill="url(#v${id})"/>

            <path d="M118 23 L${128 + f} 23 Q${144 + f} 25
                ${153 + f} 38 L118 38 Z"
                fill="url(#v${id})"/>

            <rect x="116" y="46" width="12" height="3" rx="1.5"
                fill="#000" opacity=".25"/>

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
        </svg>
    `;
}

function iconeMoto() {
    return `
        <svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
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

            <ellipse cx="100" cy="90" rx="88" ry="6" fill="url(#sm)"/>

            <circle cx="42" cy="68" r="22" fill="none"
                stroke="#0a0a0a" stroke-width="7"/>

            <circle cx="158" cy="68" r="22" fill="none"
                stroke="#0a0a0a" stroke-width="7"/>

            <circle cx="42" cy="68" r="14" fill="none"
                stroke="#bdbdbd" stroke-width="1.5"/>

            <circle cx="158" cy="68" r="14" fill="none"
                stroke="#bdbdbd" stroke-width="1.5"/>

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

            <path d="M84 44 Q96 28 122 30 L134 36
                L130 48 L90 50 Z"
                fill="url(#tm)"/>

            <path d="M52 44 Q64 40 84 44 L90 50
                L56 52 Q46 52 52 44 Z"
                fill="#111"/>

            <path d="M38 44 L56 42 L58 48 L40 50 Z"
                fill="#ff2d8f"/>
        </svg>
    `;
}

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
    <svg width="12" height="12" viewBox="0 0 24 24"
        fill="currentColor" aria-hidden="true">
        <circle cx="12" cy="7" r="4"/>
        <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8z"/>
    </svg>
`;

/* ---------- VEÍCULOS ---------- */

function montarVeiculos() {
    const container = elemento("veiculos");

    if (!container) return;

    container.innerHTML = "";

    veiculos.forEach((veiculo) => {
        const botao = document.createElement("button");

        botao.type = "button";
        botao.className = "veiculo";
        botao.setAttribute("role", "option");

        botao.setAttribute(
            "aria-selected",
            veiculo.nome === categoriaSelecionada ? "true" : "false"
        );

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

                <small class="desc">${veiculo.descricao}</small>
            </span>

            <b class="preco">
                R$ ${veiculo.valor.toFixed(2).replace(".", ",")}
            </b>
        `;

        if (veiculo.nome === categoriaSelecionada) {
            botao.classList.add("ativo");
        }

        botao.addEventListener("click", () => {
            categoriaSelecionada = veiculo.nome;
            valorSelecionado = veiculo.valor;

            container.querySelectorAll(".veiculo").forEach((item) => {
                item.classList.remove("ativo");
                item.setAttribute("aria-selected", "false");
            });

            botao.classList.add("ativo");
            botao.setAttribute("aria-selected", "true");

            atualizarResumo();
        });

        container.appendChild(botao);
    });

    atualizarResumo();
}

/* ---------- PAGAMENTO ---------- */

function configurarPagamentos() {
    const abas = document.querySelectorAll(".aba");

    abas.forEach((aba) => {
        aba.addEventListener("click", () => {
            pagamentoSelecionado = aba.dataset.pg || "Cartão";

            abas.forEach((item) => {
                item.classList.toggle("ativo", item === aba);
            });

            elemento("formCartao")?.classList.toggle(
                "oculto",
                pagamentoSelecionado !== "Cartão"
            );

            elemento("formPix")?.classList.toggle(
                "oculto",
                pagamentoSelecionado !== "Pix"
            );

            elemento("formDinheiro")?.classList.toggle(
                "oculto",
                pagamentoSelecionado !== "Dinheiro"
            );

            atualizarResumo();
            limparErro();
        });
    });

    configurarMascaraCartao();
    atualizarResumo();
}

function atualizarResumo() {
    if (elemento("rCat")) {
        elemento("rCat").textContent = categoriaSelecionada;
    }

    if (elemento("rValor")) {
        elemento("rValor").textContent =
            `R$ ${valorSelecionado.toFixed(2).replace(".", ",")}`;
    }

    if (elemento("rPg")) {
        elemento("rPg").textContent = pagamentoSelecionado;
    }
}

/* ---------- MÁSCARA DO CARTÃO ---------- */

function configurarMascaraCartao() {
    const numero = elemento("numero");
    const validade = elemento("validade");
    const cvv = elemento("cvv");

    if (numero) {
        numero.addEventListener("input", () => {
            const digitos = numero.value
                .replace(/\D/g, "")
                .slice(0, 16);

            numero.value = digitos.replace(/(\d{4})(?=\d)/g, "$1 ");
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

/* ---------- EDITAR DESTINO ---------- */

function configurarEdicaoDestino() {
    const botao = elemento("editar");

    if (!botao) return;

    botao.addEventListener("click", () => {
        const destinoAtual =
            localStorage.getItem("destinoCorrida") ||
            elemento("destinoTxt")?.textContent ||
            "";

        const novoDestino = prompt(
            "Digite o novo endereço de destino:",
            destinoAtual
        );

        if (!novoDestino || !novoDestino.trim()) return;

        const destino = novoDestino.trim();

        localStorage.setItem("destinoCorrida", destino);

        if (elemento("destinoTxt")) {
            elemento("destinoTxt").textContent = destino;
        }

        atualizarRotaNoMapa();
    });
}

/* ---------- VALIDAR PAGAMENTO ---------- */

function validarPagamento() {
    if (pagamentoSelecionado !== "Cartão") {
        return "";
    }

    const numero = (elemento("numero")?.value || "")
        .replace(/\D/g, "");

    const nome = (elemento("nome")?.value || "").trim();

    const validade = (elemento("validade")?.value || "").trim();

    const cvv = (elemento("cvv")?.value || "")
        .replace(/\D/g, "");

    if (numero.length < 13 || numero.length > 16) {
        return "Informe um número de cartão válido.";
    }

    if (nome.length < 3) {
        return "Informe o nome impresso no cartão.";
    }

    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(validade)) {
        return "Informe a validade no formato MM/AA.";
    }

    if (cvv.length < 3) {
        return "Informe um CVV válido.";
    }

    const [mes, ano] = validade.split("/").map(Number);

    const dataAtual = new Date();
    const anoCompleto = 2000 + ano;

    if (
        anoCompleto < dataAtual.getFullYear() ||
        (
            anoCompleto === dataAtual.getFullYear() &&
            mes < dataAtual.getMonth() + 1
        )
    ) {
        return "O cartão está vencido.";
    }

    return "";
}

/* ---------- CONFIRMAR CORRIDA ---------- */

function configurarConfirmacao() {
    const botao = elemento("confirmar");

    if (!botao) return;

    botao.addEventListener("click", confirmarCorrida);
}

function confirmarCorrida() {
    const origem =
        localStorage.getItem("origemCorrida") ||
        (elemento("origemTxt")?.textContent || "").trim();

    const destino =
        localStorage.getItem("destinoCorrida") ||
        (elemento("destinoTxt")?.textContent || "").trim();

    if (!origem || !destino) {
        mostrarErro("Informe a origem e o destino da corrida.");
        return;
    }

    const erroPagamento = validarPagamento();

    if (erroPagamento) {
        mostrarErro(erroPagamento);
        return;
    }

    limparErro();

    // Salva os dados da corrida
    localStorage.setItem("origemCorrida", origem);
    localStorage.setItem("destinoCorrida", destino);
    localStorage.setItem("categoriaCorrida", categoriaSelecionada);
    localStorage.setItem("valorCorrida", String(valorSelecionado));
    localStorage.setItem("pagamentoCorrida", pagamentoSelecionado);

    const viagem = {
        origem: origem,
        destino: destino,
        categoria: categoriaSelecionada,
        valor: valorSelecionado,
        pagamento: pagamentoSelecionado,
        status: "solicitada",
        data: new Date().toISOString()
    };

    let viagensSalvas = [];

    try {
        viagensSalvas = JSON.parse(
            localStorage.getItem("minhasViagens") || "[]"
        );

        if (!Array.isArray(viagensSalvas)) {
            viagensSalvas = [];
        }
    } catch (erro) {
        viagensSalvas = [];
    }

    viagensSalvas.push(viagem);

    localStorage.setItem(
        "minhasViagens",
        JSON.stringify(viagensSalvas)
    );

    // Atualiza o botão
    const botao = elemento("confirmar");

    if (botao) {
        botao.textContent = "Corrida confirmada! →";
        botao.disabled = true;
    }
    // Verifica se o usuário escolheu WN Pet
if (categoriaSelecionada === "WN Pet") {
    window.location.href = "petaviso.html";
    return;
}

// Demais categorias seguem normalmente
window.location.href = "confirmar-endereco.html";

}


function mostrarErro(mensagem) {
    const campo = elemento("erro");

    if (campo) {
        campo.textContent = mensagem;
        campo.style.color = "#ff7a9c";
    }
}

function limparErro() {
    const campo = elemento("erro");

    if (campo) {
        campo.textContent = "";
        campo.style.color = "";
    }
}

/* =========================================================
   MAPA - LEAFLET + OPENSTREETMAP
   ========================================================= */

function iniciarMapa() {
    const mapaElemento = elemento("mapa");

    if (!mapaElemento) return;

    if (typeof L === "undefined") {
        atualizarInfoMapa("-- km", "Não foi possível carregar o mapa.");
        return;
    }

    mapa = L.map("mapa", {
        scrollWheelZoom: true
    }).setView([-25.4429, -49.1927], 13);

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution:
                '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }
    ).addTo(mapa);

    setTimeout(() => {
        if (mapa) {
            mapa.invalidateSize();
        }
    }, 150);

    atualizarRotaNoMapa();
}

/* ---------- LOCALIZAR ENDEREÇOS ---------- */
async function geocodificar(endereco) {
    const original = endereco.trim();

    // Corrige nomes e abreviações comuns
    let limpo = original
        .replace(/weissopolis/gi, "Weissópolis")
        .replace(/pinhais/gi, "Pinhais")
        .replace(/parana/gi, "Paraná");

    const consultas = [];

    // Primeira tentativa: endereço original
    consultas.push(limpo);

    // Remove o nome do estabelecimento quando ele aparece
    // antes do endereço da rua.
    const semEstabelecimento = limpo.replace(
        /^escola municipal [^,]+,\s*/i,
        ""
    );

    if (semEstabelecimento !== limpo) {
        consultas.push(semEstabelecimento);
    }

    // Simplifica a pesquisa para rua, número e bairro.
    if (/rua/i.test(limpo)) {
        const partes = limpo.split(",");

        const rua = partes.find(p => /rua|avenida|alameda/i.test(p));

        const numero = partes.find(p => /^\s*\d+\s*$/.test(p));

        const bairro = partes.find(p =>
            /pineville|weissópolis|centro|estância|alto tarumã/i.test(p)
        );

        if (rua) {
            consultas.push(
                `${rua}, ${numero || ""}, ${bairro || "Pinhais"}, Pinhais, Paraná, Brasil`
            );
        }
    }

    // Última tentativa com localização regional.
    consultas.push(`${limpo}, Paraná, Brasil`);

    for (const consulta of [...new Set(consultas)]) {
        try {
            const url =
                "https://nominatim.openstreetmap.org/search?" +
                new URLSearchParams({
                    format: "json",
                    limit: "1",
                    countrycodes: "br",
                    q: consulta
                });

            const resposta = await fetch(url);

            if (!resposta.ok) {
                continue;
            }

            const dados = await resposta.json();

            if (dados.length > 0) {
                return [
                    Number(dados[0].lat),
                    Number(dados[0].lon)
                ];
            }

        } catch (erro) {
            console.error("Erro na pesquisa:", consulta, erro);
        }

        // Evita consultas muito próximas ao serviço.
        await new Promise(resolve => setTimeout(resolve, 1100));
    }

    throw new Error(
        `Não foi possível localizar: ${original}`
    );
}
function aguardar(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/* ---------- DESENHAR ROTA NO MAPA ---------- */

async function atualizarRotaNoMapa() {
    if (!mapa) return;

    const origem = (
        localStorage.getItem("origemCorrida") ||
        elemento("origemTxt")?.textContent ||
        ""
    ).trim();

    const destino = (
        localStorage.getItem("destinoCorrida") ||
        elemento("destinoTxt")?.textContent ||
        ""
    ).trim();

    if (!origem || !destino) {
        atualizarInfoMapa("-- km", "Informe origem e destino");
        return;
    }

    atualizarInfoMapa("-- km", "Localizando endereços…");

    try {
        // Localiza a origem primeiro.
        const coordOrigem = await geocodificar(origem);

        // Aguarda entre as consultas ao serviço de geocodificação.
        await aguardar(1100);

        // Localiza o destino.
        const coordDestino = await geocodificar(destino);

        // Remove os elementos antigos do mapa.
        if (marcadorOrigem) {
            mapa.removeLayer(marcadorOrigem);
        }

        if (marcadorDestino) {
            mapa.removeLayer(marcadorDestino);
        }

        if (linhaRota) {
            mapa.removeLayer(linhaRota);
        }

        // Adiciona os marcadores.
        marcadorOrigem = L.marker(coordOrigem)
            .addTo(mapa)
            .bindPopup("Origem");

        marcadorDestino = L.marker(coordDestino)
            .addTo(mapa)
            .bindPopup("Destino");

        atualizarInfoMapa("-- km", "Calculando trajeto…");

        // Solicita a rota ao OSRM.
        const urlRota =
            `https://router.project-osrm.org/route/v1/driving/` +
            `${coordOrigem[1]},${coordOrigem[0]};` +
            `${coordDestino[1]},${coordDestino[0]}` +
            `?overview=full&geometries=geojson`;

        const rotaResposta = await fetch(urlRota);

        if (!rotaResposta.ok) {
            throw new Error("Não foi possível calcular a rota.");
        }

        const rotaDados = await rotaResposta.json();

        if (!rotaDados.routes || !rotaDados.routes.length) {
            throw new Error("Rota não encontrada.");
        }

        const rota = rotaDados.routes[0];

        // Desenha a rota em rosa.
        linhaRota = L.geoJSON(rota.geometry, {
            style: {
                color: "#ff2d8f",
                weight: 5,
                opacity: 0.9
            }
        }).addTo(mapa);

        // Ajusta o mapa para mostrar origem, destino e trajeto.
        const limites = L.featureGroup([
            marcadorOrigem,
            marcadorDestino,
            linhaRota
        ]).getBounds();

        mapa.fitBounds(limites, {
            padding: [35, 35]
        });

        // Calcula distância e duração estimada.
        const km = (rota.distance / 1000)
            .toFixed(1)
            .replace(".", ",");

        const minutos = Math.round(rota.duration / 60);

        atualizarInfoMapa(
            `${km} km`,
            `aprox. ${minutos} min`
        );

    } catch (erro) {
        console.error("Erro ao carregar rota WN57:", erro);

        atualizarInfoMapa(
            "-- km",
            erro.message || "Não foi possível traçar a rota"
        );
    }
}

/* ---------- INFORMAÇÕES DO MAPA ---------- */

function atualizarInfoMapa(distancia, detalhe) {
    const info = elemento("infoRota");

    if (!info) return;

    const negrito = info.querySelector("b");
    const pequeno = info.querySelector("small");

    if (negrito) {
        negrito.textContent = distancia;
    }

    if (pequeno) {
        pequeno.textContent = detalhe;
    }
}
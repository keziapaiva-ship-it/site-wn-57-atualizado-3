// Página de confirmar endereço: mapa + procurar motorista + acompanhar a viagem

// ====== AJUSTES DA SIMULAÇÃO ======
const VELOCIDADE_KMH = 55;   // velocidade do veículo na cidade
const ACELERACAO = 1;        // 1 = tempo real | 2 = 2x mais rápido | 0.5 = mais devagar
const ESPERA_PIN_MS = 7000;  // tempo parado com "Seu motorista chegou" antes de iniciar a viagem
// ==================================

// ====== CAMINHOS DAS PÁGINAS ======
const PAG_SOLICITAR = "/html/corrida/solicitar.html";
const PAG_CORRIDA = "/html/corrida/corrida.html";
const PAG_PET_AVISO = "/html/corrida/petaviso.html";
const PAG_PIX = "/html/corrida/pagamento.pix.html";
const PAG_DINHEIRO = "/html/corrida/pagamento.dinheiro.html";
const PAG_CARTAO = "/html/corrida/pagamento.cartao.html";
// ==================================

const el = function (id) {
    return document.getElementById(id);
};

// ----- estado da corrida -----
let categoria = "WN";
let valor = 0;
let pagamento = "";
let destino = "";

// ----- mapa -----
let mapa = null;
let pino = null;
let posicao = null;
let enderecoAtual = "";
let enderecoMudou = false;
let precisaoMetros = null;
let circulo = null;

// ----- simulação -----
let timerBusca = null;
let timerPin = null;
let animacao = null;
let radar = null;
let carro = null;
let linhaRota = null;
let viagemId = null;
let nomeMotorista = "";
let viagemFinalizada = false;
let nota = 0;

function nomeCategoria(c) {
    if (c === "Pet") return "WN Pet";
    if (c === "Black") return "WN Black";
    return c || "WN";
}

// true quando a categoria escolhida em corrida.html é a moto ("WN Moto")
function ehMoto() {
    const salva = localStorage.getItem("categoriaCorrida") || "";
    return /moto/i.test(String(categoria || "")) || /moto/i.test(salva);
}

function mostrarErro(msg) {
    el("erroMapa").textContent = msg || "";
}

function formatarReais(n) {
    return Number(n || 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

// ----- busca de coordenadas -----

// aceita [lat, lng] ou {lat, lng} / {lat, lon} / {latitude, longitude}
function coordsSalvas(nome) {
    try {
        const c = JSON.parse(localStorage.getItem(nome));

        if (Array.isArray(c) && c.length === 2) {
            const a = Number(c[0]);
            const b = Number(c[1]);
            if (isFinite(a) && isFinite(b)) return [a, b];
        }

        if (c && typeof c === "object") {
            const lat = Number(c.lat != null ? c.lat : c.latitude);
            const lng = Number(
                c.lng != null ? c.lng : (c.lon != null ? c.lon : c.longitude)
            );
            if (isFinite(lat) && isFinite(lng)) return [lat, lng];
        }
    } catch (e) { }
    return null;
}

function geocodificar(texto) {
    const chave = "geo:" + texto.trim().toLowerCase();

    try {
        const salvo = JSON.parse(localStorage.getItem(chave));
        if (Array.isArray(salvo)) return Promise.resolve(salvo);
    } catch (e) { }

    const url =
        "https://nominatim.openstreetmap.org/search?format=json&limit=1" +
        "&countrycodes=br&accept-language=pt-BR" +
        "&viewbox=-49.45,-25.25,-48.95,-25.65" +
        "&q=" + encodeURIComponent(texto);

    return fetch(url)
        .then(function (r) {
            if (!r.ok) throw new Error("busca");
            return r.json();
        })
        .then(function (res) {
            if (!res.length) return null;

            const coords = [parseFloat(res[0].lat), parseFloat(res[0].lon)];
            localStorage.setItem(chave, JSON.stringify(coords));
            return coords;
        });
}

// procura o destino: usa as coordenadas salvas e, se não houver,
// tenta o endereço completo e depois versões mais curtas dele
function obterDestino() {
    const salvas = coordsSalvas("destinoCoords");
    if (salvas) return Promise.resolve(salvas);

    const partes = String(destino || "")
        .split(",")
        .map(function (s) { return s.trim(); })
        .filter(Boolean);

    const tentativas = [String(destino || "")];

    if (partes.length > 2) tentativas.push(partes.slice(0, 3).join(", "));
    if (partes.length > 1) tentativas.push(partes.slice(0, 2).join(", ") + ", Curitiba");
    if (partes.length) tentativas.push(partes[0] + ", Pinhais, Paraná");

    let cadeia = Promise.resolve(null);

    tentativas.forEach(function (t) {
        cadeia = cadeia.then(function (achou) {
            if (achou) return achou;
            return geocodificar(t).catch(function () { return null; });
        });
    });

    return cadeia;
}

function localizacaoDoNavegador() {
    return new Promise(function (resolve, reject) {
        if (!navigator.geolocation) {
            reject(new Error("sem geolocalização"));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            function (p) {
                precisaoMetros = p.coords.accuracy;
                resolve([p.coords.latitude, p.coords.longitude]);
            },
            reject,
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
        );
    });
}

const REGEX_LOCAL_ATUAL = /localiza[cç][aã]o atual|minha localiza|onde estou/i;

function obterOrigem(texto) {
    if (REGEX_LOCAL_ATUAL.test(texto)) {
        return localizacaoDoNavegador().catch(function () {
            return coordsSalvas("origemCoords") || geocodificar(texto);
        });
    }

    const salvas = coordsSalvas("origemCoords");
    if (salvas) return Promise.resolve(salvas);

    return geocodificar(texto);
}

// coordenadas -> endereço escrito
function enderecoDasCoords(coords) {
    const url =
        "https://nominatim.openstreetmap.org/reverse?format=json" +
        "&accept-language=pt-BR&lat=" + coords[0] + "&lon=" + coords[1];

    return fetch(url)
        .then(function (r) {
            if (!r.ok) throw new Error("reverse");
            return r.json();
        })
        .then(function (d) {
            return d && d.display_name ? d.display_name : "";
        })
        .catch(function () {
            return "";
        });
}

// ----- mapa -----

function desenharPrecisao(coords) {
    if (circulo) {
        mapa.removeLayer(circulo);
        circulo = null;
    }

    if (precisaoMetros && precisaoMetros > 50) {
        circulo = L.circle(coords, {
            radius: precisaoMetros,
            color: "#ff2d78",
            weight: 1,
            fillOpacity: 0.08
        }).addTo(mapa);
    }
}

function colocarPino(coords) {
    posicao = coords;

    if (!pino) {
        pino = L.marker(coords, { draggable: true }).addTo(mapa);

        pino.on("dragend", function () {
            const p = pino.getLatLng();
            moverPara([p.lat, p.lng]);
        });
    } else {
        pino.setLatLng(coords);
    }
}

// pessoa moveu o pino ou tocou no mapa
function moverPara(coords) {
    enderecoMudou = true;
    precisaoMetros = null;
    desenharPrecisao(coords);
    colocarPino(coords);
    mapa.panTo(coords);

    el("textoEndereco").textContent = "Buscando endereço...";

    enderecoDasCoords(coords).then(function (texto) {
        enderecoAtual = texto || "Local marcado no mapa";
        el("textoEndereco").textContent = enderecoAtual;
    });
}

function iniciarMapa() {
    mapa = L.map("map").setView([-25.4284, -49.2733], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap contributors"
    }).addTo(mapa);

    mapa.on("click", function (e) {
        moverPara([e.latlng.lat, e.latlng.lng]);
    });
}

// ----- registrar corrida em Atividade -----

function registrarViagem(viagem) {
    const CHAVE = "minhasViagens";
    let lista = [];

    try {
        lista = JSON.parse(localStorage.getItem(CHAVE) || "[]");
        if (!Array.isArray(lista)) lista = [];
    } catch (e) {
        lista = [];
    }

    const id = Date.now();

    lista.push({
        id: id,
        destino: viagem.destino,
        valor: viagem.valor,
        status: viagem.status || "concluida",
        pagamento: viagem.pagamento || "",
        categoria: viagem.categoria || "",
        data: new Date().toISOString()
    });

    localStorage.setItem(CHAVE, JSON.stringify(lista));
    return id;
}

function removerViagem(id) {
    const CHAVE = "minhasViagens";

    try {
        const lista = JSON.parse(localStorage.getItem(CHAVE) || "[]");
        localStorage.setItem(
            CHAVE,
            JSON.stringify(lista.filter(function (v) { return v.id !== id; }))
        );
    } catch (e) { }
}

// atualiza campos de uma viagem já registrada
function atualizarViagem(id, campos) {
    if (!id) return;

    const CHAVE = "minhasViagens";
    let lista = [];

    try {
        lista = JSON.parse(localStorage.getItem(CHAVE) || "[]");
        if (!Array.isArray(lista)) lista = [];
    } catch (e) {
        lista = [];
    }

    lista = lista.map(function (v) {
        return String(v.id) === String(id) ? Object.assign({}, v, campos) : v;
    });

    localStorage.setItem(CHAVE, JSON.stringify(lista));
}

// lê o primeiro valor que existir entre vários nomes de chave
// (localStorage primeiro, depois sessionStorage); ignora "null"/"undefined"/vazio
function lerDado(chaves) {
    const lojas = [localStorage, sessionStorage];

    for (let i = 0; i < lojas.length; i++) {
        for (let j = 0; j < chaves.length; j++) {
            let v = null;

            try { v = lojas[i].getItem(chaves[j]); } catch (e) { }

            if (v && v !== "null" && v !== "undefined" && v.trim()) {
                return v.trim();
            }
        }
    }

    return "";
}

// ----- início da página -----

document.addEventListener("DOMContentLoaded", function () {
    const origem = lerDado(["origemCorrida", "origem", "partida", "embarque"]);
    destino = lerDado(["destinoCorrida", "destino", "chegada"]);

    categoria = lerDado(["categoriaCorrida", "categoria"]) || "WN";
    valor = Number(lerDado(["valorCorrida", "valor", "preco"])) || 0;
    pagamento = lerDado(["pagamentoCorrida", "pagamento", "formaPagamento"]) || "";

    // iniciarMapa() cria o mapa mesmo se faltarem dados, para a tela não ficar vazia
    iniciarMapa();

    // sem dados da corrida: NÃO redireciona em silêncio, mostra o motivo
    if (!origem || !destino) {
        console.warn("WN57: faltam dados da corrida →", {
            origem: origem,
            destino: destino,
            todasAsChaves: Object.keys(localStorage)
        });

        el("tagCategoria").textContent = nomeCategoria(categoria);
        el("textoEndereco").textContent = origem || "Embarque não informado";
        mostrarErro(
            "Não encontramos os dados da corrida (" +
            (!origem ? "embarque" : "destino") +
            "). Toque no lápis para escolher de novo."
        );
        return;
    }

    // guarda com os nomes que esta página usa, para as próximas telas
    localStorage.setItem("origemCorrida", origem);
    localStorage.setItem("destinoCorrida", destino);

    // corrida Pet precisa ter passado pelo aviso
    if (categoria === "Pet" && !localStorage.getItem("petAvisoAceito")) {
        window.location.href = PAG_PET_AVISO;
        return;
    }

    el("tagCategoria").textContent = nomeCategoria(categoria);
    enderecoAtual = origem;
    el("textoEndereco").textContent = origem;

    obterOrigem(origem)
        .then(function (coords) {
            if (!coords) throw new Error("origem");

            colocarPino(coords);
            desenharPrecisao(coords);
            mapa.setView(coords, precisaoMetros && precisaoMetros > 500 ? 15 : 17);
            el("btnConfirmar").disabled = false;

            if (precisaoMetros && precisaoMetros > 500) {
                mostrarErro("Sua localização está imprecisa. Arraste o pino até o local correto.");
            }

            // "Localização atual" não é um endereço: mostra o endereço real
            if (REGEX_LOCAL_ATUAL.test(origem)) {
                enderecoDasCoords(coords).then(function (texto) {
                    if (texto) {
                        enderecoAtual = texto;
                        el("textoEndereco").textContent = texto;
                    }
                });
            }
        })
        .catch(function () {
            el("textoEndereco").textContent = origem;
            mostrarErro("Não encontramos esse endereço. Toque no lápis para corrigir.");
        });
});

// ----- botões da tela de confirmar -----

el("btnGps").addEventListener("click", function () {
    mostrarErro("");
    el("textoEndereco").textContent = "Buscando localização...";

    localizacaoDoNavegador()
        .then(function (coords) {
            const acc = precisaoMetros;
            moverPara(coords);
            precisaoMetros = acc;
            desenharPrecisao(coords);
            mapa.setView(coords, 17);
            el("btnConfirmar").disabled = false;
        })
        .catch(function () {
            el("textoEndereco").textContent = enderecoAtual;
            mostrarErro("Não foi possível usar sua localização. Permita o acesso no navegador.");
        });
});

el("btnEditar").addEventListener("click", function () {
    window.location.href = PAG_SOLICITAR;
});

el("btnConfirmar").addEventListener("click", function () {
    if (!posicao) return;

    el("btnConfirmar").disabled = true; // evita confirmar duas vezes

    // salva o embarque (só troca o texto se a pessoa mexeu no pino)
    if (enderecoMudou) {
        localStorage.setItem("origemCorrida", enderecoAtual);
    }
    localStorage.setItem("origemCoords", JSON.stringify(posicao));

    // aceite do aviso vale só para esta corrida
    localStorage.removeItem("petAvisoAceito");

    iniciarBusca();
});


// =====================================================
// PROCURANDO MOTORISTA + ACOMPANHAR NO MAPA
// (simulação: não há motoristas reais, os dados são fictícios)
// =====================================================

const MOTORISTAS = [
    { nome: "Carlos Silva", nota: 4.9, viagens: 1284 },
    { nome: "Ana Souza", nota: 4.95, viagens: 862 },
    { nome: "Rafael Lima", nota: 4.8, viagens: 2310 },
    { nome: "Juliana Costa", nota: 4.92, viagens: 540 },
    { nome: "Marcos Pereira", nota: 4.85, viagens: 1730 },
    { nome: "Patrícia Alves", nota: 4.97, viagens: 987 }
];

const CARROS = {
    WN: [
        ["Chevrolet Onix", "Prata"],
        ["Hyundai HB20", "Branco"],
        ["Fiat Argo", "Cinza"],
        ["Volkswagen Polo", "Vermelho"]
    ],
    Black: [
        ["Toyota Corolla", "Preto"],
        ["Honda Civic", "Preto"],
        ["Jeep Compass", "Preto"]
    ],
    Pet: [
        ["Chevrolet Spin", "Branco"],
        ["Fiat Cronos", "Prata"],
        ["Volkswagen Virtus", "Cinza"]
    ]
};

// motos usadas na categoria "WN Moto" [modelo, cor]
const MOTOS = [
    ["Honda CG 160", "Preta"],
    ["Yamaha Factor 150", "Vermelha"],
    ["Honda Biz 125", "Branca"],
    ["Honda CB 300F", "Preta"],
    ["Yamaha Fazer 250", "Azul"]
];

function sortear(lista) {
    return lista[Math.floor(Math.random() * lista.length)];
}

function pinAleatorio() {
    return String(Math.floor(1000 + Math.random() * 9000));
}

function placaAleatoria() {
    const L = "ABCDEFGHJKLMNPRSTUVWXYZ";
    const letra = function () { return L[Math.floor(Math.random() * L.length)]; };
    const num = function () { return Math.floor(Math.random() * 10); };

    // padrão Mercosul: ABC1D23
    return letra() + letra() + letra() + num() + letra() + num() + num();
}

function mostrarEstado(nome) {
    ["estadoConfirmar", "estadoBuscando", "estadoMotorista", "estadoFim"].forEach(function (id) {
        el(id).hidden = id !== nome;
    });
}

function distanciaKm(a, b) {
    const R = 6371;
    const rad = function (g) { return g * Math.PI / 180; };
    const dLat = rad(b[0] - a[0]);
    const dLng = rad(b[1] - a[1]);

    const h =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(rad(a[0])) * Math.cos(rad(b[0])) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);

    return 2 * R * Math.asin(Math.sqrt(h));
}

// direção (graus, 0 = norte, 90 = leste) de a para b
function direcaoGraus(a, b) {
    const rad = function (g) { return g * Math.PI / 180; };
    const y = Math.sin(rad(b[1] - a[1])) * Math.cos(rad(b[0]));
    const x =
        Math.cos(rad(a[0])) * Math.sin(rad(b[0])) -
        Math.sin(rad(a[0])) * Math.cos(rad(b[0])) * Math.cos(rad(b[1] - a[1]));

    return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
}

// ponto a "km" de distância, em direção aleatória
function pontoProximo(centro, km) {
    const ang = Math.random() * 2 * Math.PI;
    const dLat = (km / 111) * Math.cos(ang);
    const dLng = (km / (111 * Math.cos(centro[0] * Math.PI / 180))) * Math.sin(ang);

    return [centro[0] + dLat, centro[1] + dLng];
}

// ======================================================
// ROTA REAL PELAS RUAS - OSRM
// Não desenha linha reta caso a API falhe.
// ======================================================

async function rotaMotorista(inicio, fim) {

    const url =
        "https://router.project-osrm.org/route/v1/driving/" +
        inicio[1] + "," + inicio[0] + ";" +
        fim[1] + "," + fim[0] +
        "?overview=full&geometries=geojson&steps=true";

    const controle = new AbortController();

    const limite = setTimeout(function () {
        controle.abort();
    }, 20000);

    try {

        const resposta = await fetch(url, {
            signal: controle.signal
        });

        if (!resposta.ok) {
            throw new Error("Não foi possível consultar a rota.");
        }

        const dados = await resposta.json();

        if (
            dados.code !== "Ok" ||
            !dados.routes ||
            dados.routes.length === 0
        ) {
            throw new Error("Nenhuma rota encontrada.");
        }

        const rota = dados.routes[0];

        const caminho = rota.geometry.coordinates.map(function (coordenada) {
            return [
                coordenada[1],
                coordenada[0]
            ];
        });

        if (caminho.length < 2) {
            throw new Error("Trajeto inválido.");
        }

        return {
            caminho: caminho,
            km: rota.distance / 1000,
            minutos: Math.max(1, Math.round(rota.duration / 60))
        };

    } finally {

        clearTimeout(limite);

    }
}

// tenta achar uma rota até o ponto de embarque; se o ponto sorteado
// não tiver rua por perto, sorteia outro (até 4 tentativas)
async function rotaAteEmbarque() {
    let ultimoErro = null;

    for (let i = 0; i < 4; i++) {
        const inicio = pontoProximo(posicao, 0.8 + Math.random() * 0.9);

        try {
            return await rotaMotorista(inicio, posicao);
        } catch (e) {
            ultimoErro = e;
        }
    }

    throw ultimoErro || new Error("rota");
}

function iniciarBusca() {
    mostrarErro("");

    // trava o pino
    pino.dragging.disable();
    mapa.off("click");
    if (circulo) mapa.removeLayer(circulo);

    el("buscaOrigem").textContent = enderecoAtual;
    el("buscaDestino").textContent = destino;

    // ondas de radar em volta do pino
    radar = L.marker(posicao, {
        interactive: false,
        keyboard: false,
        icon: L.divIcon({
            className: "",
            html: '<div class="radar"><span></span><span></span><span></span></div>',
            iconSize: [24, 24],
            iconAnchor: [12, 12]
        })
    }).addTo(mapa);

    mapa.setView(posicao, 15);
    mostrarEstado("estadoBuscando");

    const frases = [
        "Estamos encontrando o melhor motorista perto de você.",
        "Verificando motoristas disponíveis...",
        categoria === "Pet"
            ? "Procurando motorista que aceita pet..."
            : "Quase lá, aguarde só mais um pouco..."
    ];

    let n = 0;
    const trocaFrase = setInterval(function () {
        n = (n + 1) % frases.length;
        el("textoBusca").textContent = frases[n];
    }, 2200);

    timerBusca = setTimeout(function () {
        clearInterval(trocaFrase);
        encontrarMotorista();
    }, 5000 + Math.random() * 3000);

    el("btnCancelarBusca").onclick = function () {
        clearTimeout(timerBusca);
        clearInterval(trocaFrase);
        window.location.href = PAG_CORRIDA;
    };
}

// ícone do carro visto de cima (a frente aponta para cima e gira conforme a rua)
function criarIconeCarro() {
    return L.divIcon({
        className: "wn57-carro-mapa",

        html: `
            <div class="wn57-carro-topo" style="width:30px;height:48px;will-change:transform;">
                <svg viewBox="0 0 40 64"
                     width="30"
                     height="48"
                     xmlns="http://www.w3.org/2000/svg">

                    <!-- Sombra -->
                    <ellipse cx="20" cy="33" rx="15" ry="28"
                             fill="rgba(0,0,0,0.35)"/>

                    <!-- Rodas -->
                    <rect x="3" y="12" width="5" height="13"
                          rx="2" fill="#111"/>
                    <rect x="32" y="12" width="5" height="13"
                          rx="2" fill="#111"/>
                    <rect x="3" y="40" width="5" height="13"
                          rx="2" fill="#111"/>
                    <rect x="32" y="40" width="5" height="13"
                          rx="2" fill="#111"/>

                    <!-- Carroceria -->
                    <path d="M12 3
                             Q20 0 28 3
                             L34 12
                             L36 48
                             Q35 58 28 61
                             L12 61
                             Q5 58 4 48
                             L6 12 Z"
                          fill="#17191d"
                          stroke="#777"
                          stroke-width="1.5"/>

                    <!-- Para-brisa dianteiro -->
                    <path d="M11 10 Q20 6 29 10
                             L31 23 L9 23 Z"
                          fill="#9caeba"
                          stroke="#333"
                          stroke-width="1"/>

                    <!-- Teto -->
                    <path d="M9 25 L31 25
                             L30 39 L10 39 Z"
                          fill="#252a31"/>

                    <!-- Vidro traseiro -->
                    <path d="M10 42 L30 42
                             L28 53 Q20 57 12 53 Z"
                          fill="#8fa5b4"
                          stroke="#333"
                          stroke-width="1"/>

                    <!-- Lanternas -->
                    <rect x="5" y="55" width="7" height="3"
                          rx="1" fill="#ff304f"/>
                    <rect x="28" y="55" width="7" height="3"
                          rx="1" fill="#ff304f"/>

                    <!-- Detalhe rosa WN57 -->
                    <rect x="16" y="30" width="8" height="3"
                          rx="1.5" fill="#ff2d78"/>

                </svg>
            </div>
        `,

        iconSize: [30, 48],
        iconAnchor: [15, 24]
    });
}

// ícone da moto vista de cima (a frente aponta para cima e gira conforme a rua)
// usa a mesma classe "wn57-carro-topo" para o girarCarro() continuar funcionando
function criarIconeMoto() {
    return L.divIcon({
        className: "wn57-carro-mapa",

        html: `
            <div class="wn57-carro-topo" style="width:26px;height:58px;will-change:transform;">
                <svg viewBox="0 0 16 36"
                     width="26"
                     height="58"
                     xmlns="http://www.w3.org/2000/svg">

                    <!-- Sombra -->
                    <ellipse cx="8" cy="19" rx="7" ry="16"
                             fill="#000" opacity=".25"/>

                    <!-- Roda dianteira -->
                    <rect x="6.2" y="1.5" width="3.6" height="9"
                          rx="1.8" fill="#111"/>

                    <!-- Roda traseira -->
                    <rect x="6.2" y="25.5" width="3.6" height="9"
                          rx="1.8" fill="#111"/>

                    <!-- Corpo da moto -->
                    <rect x="5.4" y="9.5" width="5.2" height="17"
                          rx="2.6" fill="#2a2a2a"
                          stroke="#ffffff" stroke-width=".9"/>

                    <!-- Guidão -->
                    <path d="M1.8 12.5 H14.2"
                          stroke="#111" stroke-width="2"
                          stroke-linecap="round"/>

                    <!-- Farol -->
                    <rect x="6.6" y="3.2" width="2.8" height="1.6"
                          rx=".8" fill="#fff6d6"/>

                    <!-- Banco rosa WN57 -->
                    <ellipse cx="8" cy="20" rx="4.2" ry="5"
                             fill="#ff2d8f"/>

                    <!-- Capacete do motorista -->
                    <circle cx="8" cy="17.2" r="2.9"
                            fill="#111" stroke="#ffffff"
                            stroke-width=".9"/>

                    <!-- Lanterna -->
                    <rect x="6.8" y="31" width="2.4" height="1.4"
                          rx=".7" fill="#ff2d4f"/>

                </svg>
            </div>
        `,

        iconSize: [26, 58],
        iconAnchor: [13, 29]
    });
}

// escolhe moto ou carro conforme a categoria da corrida
function criarIconeVeiculo() {
    return ehMoto() ? criarIconeMoto() : criarIconeCarro();
}

// no cartão do motorista, troca o ícone do carro pelo da moto
function trocarIconeDoCartao() {
    const area = el("estadoMotorista");
    if (!area) return;

    const REGEX_ICONE_CARRO = /(^|\s)fa-car(-side|-rear|-front|-alt)?(?=\s|$)/;

    area.querySelectorAll("i").forEach(function (icone) {
        const classes = String(icone.getAttribute("class") || "");

        if (REGEX_ICONE_CARRO.test(classes)) {
            icone.setAttribute(
                "class",
                classes.replace(REGEX_ICONE_CARRO, "$1fa-motorcycle")
            );
        }
    });
}

function girarCarro(graus) {
    if (!carro) return;

    const elemento = carro.getElement();
    if (!elemento) return;

    const topo = elemento.querySelector(".wn57-carro-topo");
    if (topo) topo.style.transform = "rotate(" + graus + "deg)";
}

function encontrarMotorista() {
    const mot = sortear(MOTORISTAS);
    const moto = ehMoto();
    const veiculo = moto
        ? sortear(MOTOS)
        : sortear(CARROS[categoria] || CARROS.WN);
    const modelo = veiculo[0];
    const cor = veiculo[1];

    rotaAteEmbarque().then(function (rota) {
        if (radar) mapa.removeLayer(radar);

        // tempo de chegada até o embarque, no mínimo 2 min
        const minutos = Math.max(2, Math.round(rota.km / VELOCIDADE_KMH * 60));

        // preenche o painel
        el("motAvatar").textContent = mot.nome.charAt(0);
        el("motNome").textContent = mot.nome;
        el("motNota").textContent = mot.nota.toFixed(2).replace(".", ",");
        el("motViagens").textContent = mot.viagens.toLocaleString("pt-BR");
        el("motPlaca").textContent = placaAleatoria();
        el("motCarro").textContent = modelo;
        el("motCor").textContent = cor;
        el("tagPet").hidden = categoria !== "Pet";
        el("motPin").innerHTML = pinAleatorio()
            .split("")
            .map(function (n) { return "<i>" + n + "</i>"; })
            .join("");
        el("detOrigem").textContent = enderecoAtual;
        el("detDestino").textContent = destino;
        nomeMotorista = mot.nome.split(" ")[0];
        el("resCategoria").textContent = nomeCategoria(categoria);
        el("resValor").textContent = formatarReais(valor);
        el("resPagamento").textContent = pagamento || "-";

        // FASE 1: motorista a caminho (o PIN e o cancelar ficam visíveis)
        el("pinBox").hidden = false;
        el("btnCancelarCorrida").hidden = false;

        mostrarEstado("estadoMotorista");

        // moto: troca o ícone do carro do cartão pelo da moto
        if (moto) trocarIconeDoCartao();

        // registra a corrida em Atividade
        viagemId = registrarViagem({
            destino: destino,
            valor: valor,
            status: "concluida",
            pagamento: pagamento,
            categoria: categoria
        });

        // veículo no mapa (começa no primeiro ponto da rua da rota, longe de você)
        carro = L.marker(rota.caminho[0], {
            interactive: false,
            keyboard: false,
            icon: criarIconeVeiculo()
        }).addTo(mapa);

        girarCarro(direcaoGraus(rota.caminho[0], rota.caminho[1]));

        linhaRota = L.polyline(rota.caminho, {
            color: "#ff2d78",
            weight: 5,
            opacity: 0.85
        }).addTo(mapa);

        mapa.fitBounds(L.latLngBounds(rota.caminho), {
            paddingTopLeft: [40, 40],
            paddingBottomRight: [40, 400]
        });

        // mostra "a caminho" já no primeiro instante
        atualizarTextos("buscar", minutos, false);

        // começa a andar até você
        percorrer(rota.caminho, minutos, "buscar");
    }).catch(function () {
        if (radar) mapa.removeLayer(radar);
        mostrarEstado("estadoConfirmar");
        el("btnConfirmar").disabled = false;
        mostrarErro("Não foi possível encontrar um motorista agora. Tente novamente.");
    });
}

// ---------- distâncias ao longo do caminho ----------

function distanciasAcumuladas(caminho) {
    const cum = [0];

    for (let i = 1; i < caminho.length; i++) {
        cum.push(cum[i - 1] + distanciaKm(caminho[i - 1], caminho[i]) * 1000);
    }

    return cum;
}

// ---------- textos conforme a fase ----------

function horaChegada(minutos) {
    const t = new Date(Date.now() + minutos * 60000);
    return t.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function atualizarTextos(fase, restam, parado) {
    const aviso = el("avisoMapa");
    aviso.hidden = !parado;

    if (fase === "buscar") {
        el("etaTitulo").textContent =
            restam <= 1 ? "Chegando em menos de 1 min" : "Chegando em " + restam + " min";
        el("etaTexto").textContent = parado
            ? "Parado no semáforo, já já segue"
            : nomeMotorista + " está a caminho";
    } else {
        el("etaTitulo").textContent = "Chegada às " + horaChegada(restam);
        el("etaTexto").textContent = parado
            ? "Parado no semáforo, já já segue"
            : "Viagem em andamento";
    }

    const min = el("etaMin");
    if (min) min.textContent = Math.max(restam, 1);
}

// ---------- o veículo anda pelas ruas e vira nas curvas ----------
// (velocidade definida em VELOCIDADE_KMH e ACELERACAO, no topo do arquivo)

function percorrer(caminho, minutos, fase) {

    // Evita duas animações simultâneas
    if (animacao) {
        cancelAnimationFrame(animacao);
        animacao = null;
    }

    const cum = distanciasAcumuladas(caminho);
    const total = cum[cum.length - 1] || 1;

    // metros por milissegundo
    const velocidade =
        (VELOCIDADE_KMH / 3.6 / 1000) * ACELERACAO;

    let d = 0;
    let ultimo = performance.now();
    let anguloAtual = direcaoGraus(caminho[0], caminho[1]);

    // acha o trecho (segmento da rua) em que o veículo está
    function trecho(distancia) {
        let i = 1;

        while (i < cum.length - 1 && cum[i] < distancia) {
            i++;
        }

        return i;
    }

    function posicaoEm(distancia) {
        const i = trecho(distancia);
        const a = caminho[i - 1];
        const b = caminho[i];
        const segmento = cum[i] - cum[i - 1] || 1;

        const fator = Math.min(
            Math.max((distancia - cum[i - 1]) / segmento, 0),
            1
        );

        return [
            a[0] + (b[0] - a[0]) * fator,
            a[1] + (b[1] - a[1]) * fator
        ];
    }

    // direção olhando um pouco à frente, para a curva ficar suave
    function direcaoEm(distancia) {
        const atual = posicaoEm(distancia);
        const frente = posicaoEm(Math.min(distancia + 12, total));

        if (distanciaKm(atual, frente) < 0.001) return null;

        return direcaoGraus(atual, frente);
    }

    function suavizar(de, para) {
        const diferenca = ((para - de + 540) % 360) - 180;
        return (de + diferenca * 0.15 + 360) % 360;
    }

    function quadro(agora) {

        const dt = Math.min(agora - ultimo, 50);
        ultimo = agora;

        d = Math.min(d + velocidade * dt, total);

        carro.setLatLng(posicaoEm(d));

        const novoAngulo = direcaoEm(d);
        if (novoAngulo !== null) {
            anguloAtual = suavizar(anguloAtual, novoAngulo);
            girarCarro(anguloAtual);
        }

        const restante = Math.max(
            0,
            Math.ceil(minutos * (1 - d / total))
        );

        atualizarTextos(fase, restante, false);

        if (d >= total) {

            carro.setLatLng(caminho[caminho.length - 1]);

            el("avisoMapa").hidden = true;

            animacao = null;

            if (fase === "buscar") {
                motoristaChegou();
            } else {
                viagemConcluida();
            }

            return;
        }

        animacao = requestAnimationFrame(quadro);
    }

    animacao = requestAnimationFrame(quadro);
}

// ---------- FASE 2: motorista chegou -> espera o PIN -> FASE 3: viagem até o destino ----------

function motoristaChegou() {
    el("etaTitulo").textContent = "Seu motorista chegou";
    el("etaTexto").textContent = ehMoto()
        ? "Informe o PIN antes de subir na moto"
        : "Informe o PIN ao entrar no carro";
    el("etaBolha").classList.add("chegou");
    el("etaBolha").innerHTML = '<i class="fa-solid fa-check"></i>';

    clearTimeout(timerPin);
    timerPin = setTimeout(iniciarViagem, ESPERA_PIN_MS);
}

function iniciarViagem() {
    // dentro do veículo: some o PIN e o botão de cancelar
    el("pinBox").hidden = true;
    el("btnCancelarCorrida").hidden = true;

    el("etaBolha").classList.remove("chegou");
    el("etaBolha").innerHTML = '<b id="etaMin">-</b><small>min</small>';
    el("etaTitulo").textContent = "Viagem iniciada";
    el("etaTexto").textContent = "Indo para o seu destino. Boa viagem!";

    obterDestino()
        .then(function (coordsDestino) {
            if (!coordsDestino) throw new Error("destino");

            L.marker(coordsDestino).addTo(mapa).bindPopup("🏁 " + destino);

            // a viagem sai de onde o veículo está agora (o ponto de embarque)
            const saida = carro ? [carro.getLatLng().lat, carro.getLatLng().lng] : posicao;

            return rotaMotorista(saida, coordsDestino);
        })
        .then(function (rota) {
            if (linhaRota) mapa.removeLayer(linhaRota);

            linhaRota = L.polyline(rota.caminho, {
                color: "#ff2d78",
                weight: 5,
                opacity: 0.85
            }).addTo(mapa);

            carro.setLatLng(rota.caminho[0]);
            girarCarro(direcaoGraus(rota.caminho[0], rota.caminho[1]));

            mapa.fitBounds(L.latLngBounds(rota.caminho), {
                paddingTopLeft: [40, 40],
                paddingBottomRight: [40, 320]
            });

            const minutos = Math.max(2, Math.round(rota.km / VELOCIDADE_KMH * 60));

            atualizarTextos("viagem", minutos, false);
            percorrer(rota.caminho, minutos, "viagem");
        })
        .catch(function (erro) {
            console.error("WN57: não foi possível traçar a viagem até o destino:", erro);

            // avisa na tela em vez de pular direto para o pagamento
            el("etaTitulo").textContent = "Não foi possível traçar o destino";
            el("etaTexto").textContent = "Encerrando a demonstração...";

            setTimeout(viagemConcluida, 4000);
        });
}

// =====================================================
// CHEGOU NO DESTINO -> PÁGINA DE PAGAMENTO
// =====================================================

function preencherTelaFim() {
    el("fimDestino").textContent = destino;
    el("fimValor").textContent = formatarReais(valor);
    el("fimPagamento").textContent = pagamento || "-";
    el("fimMotorista").textContent = nomeMotorista || "Motorista";
}

// devolve "pix", "dinheiro", "cartao" ou "" (escolha feita em corrida.html)
function formaDePagamento() {
    const texto = String(
        localStorage.getItem("pagamentoCorrida") || pagamento || ""
    ).trim().toLowerCase();

    if (texto.indexOf("pix") !== -1) return "pix";
    if (texto.indexOf("dinheiro") !== -1) return "dinheiro";
    if (texto.indexOf("cart") !== -1) return "cartao";
    return "";
}

// salva os dados da corrida e abre a página de pagamento correta
function irParaPagamento(avisarSeFalhar) {
    const forma = formaDePagamento();

    localStorage.setItem("valorCorrida", String(valor));
    localStorage.setItem("destinoCorrida", destino);
    localStorage.setItem("pagamentoCorrida", pagamento || forma);

    // para a página de pagamento saber qual viagem atualizar em "Atividade"
    if (viagemId) localStorage.setItem("viagemIdCorrida", String(viagemId));

    if (forma === "pix") {
        window.location.href = PAG_PIX;
    } else if (forma === "dinheiro") {
        window.location.href = PAG_DINHEIRO;
    } else if (forma === "cartao") {
        window.location.href = PAG_CARTAO;
    } else {
        console.error("Forma de pagamento não identificada:", pagamento);

        if (avisarSeFalhar) {
            alert("Forma de pagamento não identificada. Volte e selecione novamente.");
        }
    }
}

function viagemConcluida() {
    // evita rodar duas vezes
    if (viagemFinalizada) return;
    viagemFinalizada = true;

    if (animacao) {
        cancelAnimationFrame(animacao);
        animacao = null;
    }

    el("avisoMapa").hidden = true;

    atualizarViagem(viagemId, {
        status: "aguardando_pagamento"
    });

    preencherTelaFim();
    mostrarEstado("estadoFim");

    irParaPagamento(false);
}


// =====================================================
// AVALIAÇÃO + BOTÃO CONCLUIR
// =====================================================

el("estrelas").addEventListener("click", function (e) {
    const botao = e.target.closest("button");
    if (!botao) return;

    nota = Number(botao.dataset.n);

    el("estrelas").querySelectorAll("button").forEach(function (b) {
        b.classList.toggle("on", Number(b.dataset.n) <= nota);
    });
});

el("btnConcluir").addEventListener("click", function () {
    if (nota) {
        localStorage.setItem("avaliacaoCorrida", String(nota));
    }

    irParaPagamento(true);
});

el("btnCancelarCorrida").addEventListener("click", function () {
    if (!window.confirm("Deseja cancelar esta corrida?")) return;

    clearTimeout(timerPin);
    if (animacao) cancelAnimationFrame(animacao);
    if (viagemId) removerViagem(viagemId);

    window.location.href = PAG_CORRIDA;
});

el("btnDetalhes").addEventListener("click", function () {
    const painel = el("detalhes");
    painel.hidden = !painel.hidden;
    el("btnDetalhes").setAttribute("aria-expanded", String(!painel.hidden));
});


// =====================================================
// COMPARTILHAR CORRIDA
// 1) tenta o compartilhamento do sistema (navigator.share)
// 2) se não existir ou falhar, copia o texto
// 3) se nem copiar der, mostra uma caixa para copiar à mão
// =====================================================

// aviso rápido na parte de baixo da tela (criado por aqui, não precisa de HTML)
function mostrarAviso(msg) {
    let t = document.getElementById("wn57Aviso");

    if (!t) {
        t = document.createElement("div");
        t.id = "wn57Aviso";
        t.setAttribute("role", "status");
        t.style.cssText =
            "position:fixed;left:50%;bottom:24px;transform:translateX(-50%);" +
            "background:#222;color:#fff;padding:12px 18px;border-radius:12px;" +
            "font:600 14px sans-serif;z-index:99999;max-width:90%;text-align:center;" +
            "box-shadow:0 4px 16px rgba(0,0,0,.4);opacity:0;" +
            "transition:opacity .2s;pointer-events:none;";
        document.body.appendChild(t);
    }

    t.textContent = msg;
    t.style.opacity = "1";

    clearTimeout(t._timer);
    t._timer = setTimeout(function () {
        t.style.opacity = "0";
    }, 2500);
}

// copia para a área de transferência (com plano B para páginas sem HTTPS)
function copiarTexto(texto) {
    if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(texto);
    }

    return new Promise(function (resolve, reject) {
        const area = document.createElement("textarea");
        area.value = texto;
        area.setAttribute("readonly", "");
        area.style.position = "fixed";
        area.style.opacity = "0";
        document.body.appendChild(area);
        area.select();

        try {
            if (document.execCommand("copy")) {
                resolve();
            } else {
                reject(new Error("copiar"));
            }
        } catch (e) {
            reject(e);
        } finally {
            document.body.removeChild(area);
        }
    });
}

function textoDaCorrida() {
    return (
        "Minha viagem WN57\n\n" +
        "Motorista: " + el("motNome").textContent + "\n" +
        "Veículo: " + el("motCor").textContent + " " + el("motCarro").textContent + "\n" +
        "Placa: " + el("motPlaca").textContent + "\n" +
        "Embarque: " + enderecoAtual + "\n" +
        "Destino: " + destino
    );
}

function compartilharCorrida() {
    const texto = textoDaCorrida();
    const dados = { title: "Minha corrida WN57", text: texto };

    function copiar() {
        copiarTexto(texto)
            .then(function () {
                mostrarAviso("Dados da corrida copiados!");
            })
            .catch(function () {
                window.prompt("Copie os dados da corrida:", texto);
            });
    }

    const podeCompartilhar =
        typeof navigator.share === "function" &&
        (typeof navigator.canShare !== "function" || navigator.canShare(dados));

    if (!podeCompartilhar) {
        copiar();
        return;
    }

    navigator.share(dados).catch(function (erro) {
        // a pessoa só fechou a janela de compartilhar: não faz nada
        if (erro && erro.name === "AbortError") return;

        console.warn("WN57: navigator.share falhou, copiando o texto.", erro);
        copiar();
    });
}

const btnCompartilhar = el("btnCompartilhar");

if (btnCompartilhar) {
    btnCompartilhar.addEventListener("click", compartilharCorrida);
} else {
    console.error('WN57: botão com id="btnCompartilhar" não encontrado no HTML.');
}

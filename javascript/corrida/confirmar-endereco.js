// Página de confirmar endereço: mapa + botão de confirmar

// ====== AJUSTES DA SIMULAÇÃO ======
const VELOCIDADE_KMH = 55;   // velocidade do carro na cidade
const ACELERACAO = 1;        // 1 = tempo real | 2 = 2x mais rápido | 0.5 = mais devagar
// ==================================

// ====== AJUSTES DO PIX ======
// Troque pela SUA chave Pix (CPF, e-mail, telefone com +55 ou chave aleatória).
const CHAVE_PIX = "00000000-0000-0000-0000-000000000000";
const NOME_RECEBEDOR = "WN57";      // até 25 caracteres, sem acento
const CIDADE_RECEBEDOR = "PINHAIS"; // até 15 caracteres, sem acento
const PAGINA_FINAL = "atividade.html"; // para onde ir depois de pagar
// ============================

const el = function (id) {
    return document.getElementById(id);
};

let categoria = "WN";
let valor = 0;
let pagamento = "";
let destino = "";

let mapa = null;
let pino = null;
let posicao = null;
let enderecoAtual = "";
let enderecoMudou = false;

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

// evita HTML injetado em textos que vão para innerHTML
function escaparHTML(texto) {
    return String(texto == null ? "" : texto)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function formatarReais(n) {
    return Number(n || 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

// ----- busca de coordenadas -----

function coordsSalvas(nome) {
    try {
        const c = JSON.parse(localStorage.getItem(nome));
        if (Array.isArray(c) && c.length === 2) return c;
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

let precisaoMetros = null;

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

let circulo = null;

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

// ----- início -----

document.addEventListener("DOMContentLoaded", function () {
    const origem = localStorage.getItem("origemCorrida");
    destino = localStorage.getItem("destinoCorrida");

    categoria = localStorage.getItem("categoriaCorrida") || "WN";
    valor = Number(localStorage.getItem("valorCorrida")) || 0;
    pagamento = localStorage.getItem("pagamentoCorrida") || "";

    // teste: mostra no console qual veículo foi escolhido (pode apagar depois)
    console.log("WN57 categoria:", categoria, "| ehMoto:", ehMoto());

    // sem dados da corrida: volta ao começo
    if (!origem || !destino) {
        window.location.href = "solicitar.html";
        return;
    }

    // corrida Pet precisa ter passado pelo aviso
    if (categoria === "Pet" && !localStorage.getItem("petAvisoAceito")) {
        window.location.href = "petaviso.html";
        return;
    }

    el("tagCategoria").textContent = nomeCategoria(categoria);
    enderecoAtual = origem;
    el("textoEndereco").textContent = origem;

    iniciarMapa();

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

// ----- botões -----

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
    window.location.href = "solicitar.html";
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

let timerBusca = null;
let animacao = null;
let radar = null;
let carro = null;
let viagemId = null;

function sortear(lista) {
    return lista[Math.floor(Math.random() * lista.length)];
}

let nomeMotorista = "";

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
        window.location.href = "corrida.html";
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
    const [modelo, cor] = moto
        ? sortear(MOTOS)
        : sortear(CARROS[categoria] || CARROS.WN);

    rotaAteEmbarque().then(function (rota) {
        if (radar) mapa.removeLayer(radar);

        // tempo: ~ 25 km/h na cidade, no mínimo 2 min
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
        el("resValor").textContent = "R$ " + valor.toFixed(2).replace(".", ",");
        el("resPagamento").textContent = pagamento || "-";

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

        // veículo no mapa (começa no primeiro ponto da rua da rota)
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

        // procura os semáforos reais do caminho e começa a andar
        buscarSemaforos(rota.caminho).then(function (semaforos) {
            percorrer(rota.caminho, minutos, semaforos, "buscar");
        });
    }).catch(function () {
        if (radar) mapa.removeLayer(radar);
        mostrarEstado("estadoConfirmar");
        el("btnConfirmar").disabled = false;
        mostrarErro("Não foi possível encontrar um motorista agora. Tente novamente.");
    });
}

// ---------- semáforos reais (OpenStreetMap / Overpass) ----------

let linhaRota = null;
let semaforoMarcadores = [];

function distanciasAcumuladas(caminho) {
    const cum = [0];

    for (let i = 1; i < caminho.length; i++) {
        cum.push(cum[i - 1] + distanciaKm(caminho[i - 1], caminho[i]) * 1000);
    }

    return cum;
}

function buscarSemaforos(caminho) {
    // Desativa a consulta pesada ao serviço Overpass.
    // A animação continuará funcionando normalmente.
    return Promise.resolve([]);
}

function iconeSemaforo(estado) {
    return L.divIcon({
        className: "",
        html: '<div class="semaforo ' + estado + '"><span></span><span></span></div>',
        iconSize: [18, 34],
        iconAnchor: [9, 17]
    });
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

// ---------- o veículo anda pelas ruas, vira nas curvas e para nos semáforos ----------
// (velocidade definida em VELOCIDADE_KMH e ACELERACAO, no topo do arquivo)

function percorrer(caminho, minutos, semaforos, fase) {

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

    // acha o trecho (segmento da rua) em que o carro está
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
        let diferenca = ((para - de + 540) % 360) - 180;
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

// ---------- motorista chegou -> viagem até o destino ----------

function motoristaChegou() {
    el("etaTitulo").textContent = "Seu motorista chegou";
    el("etaTexto").textContent = ehMoto()
        ? "Informe o PIN antes de subir na moto"
        : "Informe o PIN ao entrar no carro";
    el("etaBolha").classList.add("chegou");
    el("etaBolha").innerHTML = '<i class="fa-solid fa-check"></i>';

    setTimeout(iniciarViagem, 7000);
}

function iniciarViagem() {
    // dentro do veículo: some o PIN e o botão de cancelar
    el("pinBox").hidden = true;
    el("btnCancelarCorrida").hidden = true;

    el("etaBolha").classList.remove("chegou");
    el("etaBolha").innerHTML = '<b id="etaMin">-</b><small>min</small>';
    el("etaTitulo").textContent = "Viagem iniciada";
    el("etaTexto").textContent = "Boa viagem!";

    const salvas = coordsSalvas("destinoCoords");
    const busca = salvas ? Promise.resolve(salvas) : geocodificar(destino);

    busca
        .then(function (coordsDestino) {
            if (!coordsDestino) throw new Error("destino");

            L.marker(coordsDestino).addTo(mapa).bindPopup("🏁 " + destino);

            return rotaMotorista(posicao, coordsDestino);
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

            return buscarSemaforos(rota.caminho).then(function (semaforos) {
                percorrer(rota.caminho, minutos, semaforos, "viagem");
            });
        })
        .catch(function () {
            viagemConcluida(); // sem rota até o destino: encerra a demonstração
        });
}

// =====================================================
// CHEGOU NO DESTINO
// =====================================================

function viagemConcluida() {
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

    // Recupera a forma de pagamento escolhida em corrida.js
    const metodo = String(
        localStorage.getItem("pagamentoCorrida") || pagamento || ""
    ).trim().toLowerCase();

    // Salva os dados da corrida
    localStorage.setItem("valorCorrida", String(valor));
    localStorage.setItem("destinoCorrida", destino);

    // Redireciona para a página correspondente
    if (metodo.includes("pix")) {
        window.location.href = "/html/corrida/pagamento.pix.html";
        return;
    }

    if (metodo.includes("dinheiro")) {
        window.location.href = "/html/corrida/pagamento.dinheiro.html";
        return;
    }

    if (metodo.includes("cart")) {
        window.location.href = "/html/corrida/pagamento.cartao.html";
        return;
    }

    console.error("Forma de pagamento não identificada:", metodo);
}

let pagamentoConfirmado = false;

// "pix", "dinheiro", "cartao" ou "" (vem da escolha feita em corrida.html)
function formaDePagamento() {
    const texto = String(
        pagamento || localStorage.getItem("pagamentoCorrida") || ""
    ).toLowerCase();

    if (texto.indexOf("pix") !== -1) return "pix";
    if (texto.indexOf("dinheiro") !== -1) return "dinheiro";
    if (texto.indexOf("cart") !== -1) return "cartao";
    return "";
}

function preencherTelaFim() {
    el("fimDestino").textContent = destino;
    el("fimValor").textContent = formatarReais(valor);
    el("fimPagamento").textContent = pagamento || "-";
    el("fimMotorista").textContent = nomeMotorista || "Motorista";
}

// =====================================================
// PIX REAL (BR Code / "copia e cola")
// =====================================================

function semAcento(texto) {
    return String(texto || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^A-Za-z0-9 .\-]/g, "")
        .toUpperCase();
}

function crc16(texto) {
    let crc = 0xFFFF;

    for (let i = 0; i < texto.length; i++) {
        crc ^= texto.charCodeAt(i) << 8;

        for (let j = 0; j < 8; j++) {
            crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) : (crc << 1);
            crc &= 0xFFFF;
        }
    }

    return crc.toString(16).toUpperCase().padStart(4, "0");
}

function campoPix(id, conteudo) {
    return id + String(conteudo.length).padStart(2, "0") + conteudo;
}

function gerarCodigoPix(valorPix, identificador) {
    const txid = String(identificador || "WN57")
        .replace(/[^A-Za-z0-9]/g, "")
        .substring(0, 25) || "WN57";

    const conta =
        campoPix("00", "br.gov.bcb.pix") +
        campoPix("01", CHAVE_PIX.trim());

    const dadosAdicionais = campoPix("05", txid);

    const semCrc =
        campoPix("00", "01") +
        campoPix("26", conta) +
        campoPix("52", "0000") +
        campoPix("53", "986") +
        campoPix("54", Number(valorPix).toFixed(2)) +
        campoPix("58", "BR") +
        campoPix("59", semAcento(NOME_RECEBEDOR).substring(0, 25) || "WN57") +
        campoPix("60", semAcento(CIDADE_RECEBEDOR).substring(0, 15) || "CURITIBA") +
        campoPix("62", dadosAdicionais) +
        "6304";

    return semCrc + crc16(semCrc);
}

function gerarQRCodeWN57() {

    const codigo = gerarCodigoPix(valor, "WN57" + (viagemId || Date.now()));

    el("wn57-codigo-pix").value = codigo;

    const areaQR = el("wn57-qr");

    function desenhar() {
        if (typeof QRCode === "undefined") return;

        areaQR.innerHTML = "";

        new QRCode(areaQR, {
            text: codigo,
            width: 190,
            height: 190,
            correctLevel: QRCode.CorrectLevel.M
        });
    }

    if (typeof QRCode !== "undefined") {
        desenhar();
        return;
    }

    const script = document.createElement("script");

    script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";

    script.onload = desenhar;

    script.onerror = function () {
        areaQR.innerHTML =
            '<span style="color:#111;font-size:13px">QR Code indisponível. Use o código abaixo.</span>';
    };

    document.head.appendChild(script);
}

function copiarPixWN57() {

    const campo = el("wn57-codigo-pix");
    const botao = el("wn57-copiar-pix");

    function avisar(texto) {
        if (!botao) return;
        const original = botao.innerHTML;
        botao.textContent = texto;
        setTimeout(function () { botao.innerHTML = original; }, 1800);
    }

    campo.select();
    campo.setSelectionRange(0, 99999);

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(campo.value)
            .then(function () { avisar("Código copiado!"); })
            .catch(function () {
                document.execCommand("copy");
                avisar("Código copiado!");
            });
    } else {
        document.execCommand("copy");
        avisar("Código copiado!");
    }
}

// =====================================================
// PÁGINA DE PAGAMENTO (Pix e dinheiro) - aparece ao tocar em "Concluir"
// =====================================================

function abrirPagamentoFinal() {

    const metodo = String(pagamento || "").toLowerCase().trim();
    const ehPix = metodo.indexOf("pix") !== -1;
    const valorTexto = formatarReais(valor);

    const antiga = el("wn57-pagina-pagamento");
    if (antiga) antiga.remove();

    const pagina = document.createElement("div");
    pagina.id = "wn57-pagina-pagamento";

    pagina.innerHTML = `
        <style>
            #wn57-pagina-pagamento {
                position: fixed;
                inset: 0;
                z-index: 999999;
                overflow-y: auto;
                background: #101010;
                color: white;
                font-family: 'DM Sans', sans-serif;
                padding: 25px 18px;
            }

            #wn57-pagina-pagamento * {
                box-sizing: border-box;
            }

            .pag-container {
                max-width: 480px;
                margin: 20px auto;
            }

            .pag-logo {
                text-align: center;
                font-size: 30px;
                font-weight: 900;
                margin-bottom: 30px;
            }

            .pag-logo span {
                color: #ff2d8f;
            }

            .pag-card {
                background: #1d1d1d;
                border: 1px solid #333;
                border-radius: 22px;
                padding: 25px;
                text-align: center;
            }

            .pag-icone {
                width: 75px;
                height: 75px;
                background: #ff2d8f20;
                color: #ff2d8f;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 20px;
                font-size: 32px;
            }

            .pag-card h1 {
                font-size: 25px;
                margin: 10px 0;
            }

            .pag-descricao {
                color: #aaa;
                font-size: 14px;
                line-height: 1.6;
            }

            .pag-valor {
                background: #111;
                border-radius: 15px;
                padding: 20px;
                margin: 25px 0;
            }

            .pag-valor small {
                display: block;
                color: #aaa;
                margin-bottom: 8px;
            }

            .pag-valor strong {
                color: #ff2d8f;
                font-size: 32px;
            }

            .pag-info {
                text-align: left;
                padding: 14px 0;
                border-bottom: 1px solid #353535;
            }

            .pag-info span {
                display: block;
                font-size: 12px;
                color: #999;
                margin-bottom: 5px;
            }

            .pag-info strong {
                font-size: 14px;
                overflow-wrap: anywhere;
            }

            .pag-botao {
                width: 100%;
                padding: 17px;
                background: #ff2d8f;
                color: white;
                border: none;
                border-radius: 13px;
                font-size: 15px;
                font-weight: 800;
                cursor: pointer;
                margin-top: 20px;
            }

            .pag-botao:hover {
                background: #e91e79;
            }

            .pag-secundario {
                background: transparent;
                border: 1px solid #555;
                margin-top: 10px;
            }

            .pag-qr {
                background: white;
                border-radius: 14px;
                width: 220px;
                min-height: 220px;
                padding: 12px;
                margin: 20px auto;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .pag-codigo {
                width: 100%;
                min-height: 90px;
                background: #111;
                border: 1px solid #444;
                border-radius: 10px;
                padding: 12px;
                color: white;
                resize: none;
                margin-top: 10px;
                font-size: 12px;
            }

            .pag-aviso {
                font-size: 11px;
                color: #999;
                line-height: 1.5;
                margin-top: 18px;
            }

            .pag-sucesso {
                color: #22c55e;
                font-size: 65px;
                margin-bottom: 15px;
            }
        </style>

        <div class="pag-container">

            <div class="pag-logo">
                WN<span>57</span>
            </div>

            <div class="pag-card" id="wn57-card">

                <div class="pag-icone">
                    ${ehPix
            ? '<i class="fa-brands fa-pix"></i>'
            : '<i class="fa-solid fa-money-bill-wave"></i>'}
                </div>

                <h1>
                    ${ehPix ? "Pagamento via Pix" : "Pagamento em dinheiro"}
                </h1>

                <p class="pag-descricao">
                    Sua corrida chegou ao destino!
                    Finalize o pagamento para concluir sua viagem.
                </p>

                <div class="pag-valor">
                    <small>Valor total da corrida</small>
                    <strong>${valorTexto}</strong>
                </div>

                <div class="pag-info">
                    <span>Destino</span>
                    <strong>${escaparHTML(destino)}</strong>
                </div>

                <div class="pag-info">
                    <span>Motorista</span>
                    <strong>${escaparHTML(nomeMotorista)}</strong>
                </div>

                <div class="pag-info">
                    <span>Pagamento</span>
                    <strong>${escaparHTML(pagamento)}</strong>
                </div>

                <div id="wn57-conteudo-pix" hidden>

                    <h3>Escaneie o QR Code</h3>

                    <div class="pag-qr" id="wn57-qr"></div>

                    <p class="pag-descricao">
                        Ou copie o código Pix e cole no app do seu banco.
                    </p>

                    <textarea
                        class="pag-codigo"
                        id="wn57-codigo-pix"
                        readonly
                    ></textarea>

                    <button
                        class="pag-botao pag-secundario"
                        id="wn57-copiar-pix"
                        type="button">
                        <i class="fa-regular fa-copy"></i>
                        Copiar código Pix
                    </button>

                    <p class="pag-aviso">
                        O código é um Pix real para a chave configurada. Como o site
                        ainda não está ligado a um provedor de pagamentos, a
                        confirmação abaixo é feita por você.
                    </p>

                </div>

                <div id="wn57-conteudo-dinheiro" hidden>

                    <div style="padding:25px 0">

                        <i class="fa-solid fa-money-bill-wave"
                           style="font-size:55px;color:#22c55e">
                        </i>

                        <h2>Pagamento ao motorista</h2>

                        <p class="pag-descricao">
                            Entregue ${valorTexto} diretamente
                            ao motorista.
                        </p>

                        <p style="color:#22c55e;font-weight:700">
                            Após realizar o pagamento, confirme abaixo.
                        </p>

                    </div>

                </div>

                <button
                    class="pag-botao"
                    id="wn57-finalizar-pagamento"
                    type="button">
                    ${ehPix ? "Já paguei" : "Confirmar dinheiro entregue"}
                </button>

            </div>
        </div>
    `;

    document.body.appendChild(pagina);

    if (ehPix) {
        el("wn57-conteudo-pix").hidden = false;
        gerarQRCodeWN57();
    } else {
        el("wn57-conteudo-dinheiro").hidden = false;
    }

    el("wn57-finalizar-pagamento").addEventListener("click", function () {
        const mensagem = ehPix
            ? "Você já realizou o pagamento via Pix?"
            : "Confirma que entregou o dinheiro ao motorista?";

        if (!window.confirm(mensagem)) return;

        concluirPagamentoWN57();
    });

    const botaoCopiar = el("wn57-copiar-pix");
    if (botaoCopiar) botaoCopiar.addEventListener("click", copiarPixWN57);
}

// pagamento confirmado: salva e mostra a tela de sucesso
function concluirPagamentoWN57() {

    atualizarViagem(viagemId, {
        status: "concluida",
        pagamentoConfirmado: true,
        dataPagamento: new Date().toISOString()
    });

    pagamentoConfirmado = true;

    const card = el("wn57-card");
    if (!card) return;

    card.innerHTML = `
        <div class="pag-sucesso"><i class="fa-solid fa-circle-check"></i></div>
        <h1>Pagamento confirmado!</h1>
        <p class="pag-descricao">
            Obrigado por viajar com a WN57.
            Sua corrida de ${formatarReais(valor)} foi concluída.
        </p>
        <button class="pag-botao" id="wn57-avaliar" type="button">
            Avaliar viagem
        </button>
    `;

    el("wn57-avaliar").addEventListener("click", function () {
        const pagina = el("wn57-pagina-pagamento");
        if (pagina) pagina.remove();

        preencherTelaFim();
        mostrarEstado("estadoFim");
    });
}


// =====================================================
// AVALIAÇÃO + BOTÃO CONCLUIR
// =====================================================

let nota = 0;

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

    // Pagamento já feito na tela anterior: só encerra a corrida
    if (pagamentoConfirmado) {
        window.location.href = PAGINA_FINAL;
        return;
    }

    // Recupera a escolha feita na página corrida.html.
    const metodo = String(
        localStorage.getItem("pagamentoCorrida") || pagamento || ""
    ).trim().toLowerCase();

    // guarda os dados caso a pessoa precise de outra página de pagamento
    localStorage.setItem("valorCorrida", String(valor));
    localStorage.setItem("destinoCorrida", destino);
    localStorage.setItem("pagamentoCorrida", pagamento || metodo);

    if (metodo.indexOf("pix") !== -1 || metodo.indexOf("dinheiro") !== -1) {
        // Pix e dinheiro são resolvidos aqui mesmo, na tela de pagamento
        pagamento = pagamento || metodo;
        abrirPagamentoFinal();
        return;
    }

    if (metodo.indexOf("cart") !== -1) {
        window.location.href = "pagamento-cartao.html";
        return;
    }

    alert("Forma de pagamento não identificada. Volte e selecione novamente.");
});

el("btnCancelarCorrida").addEventListener("click", function () {
    if (!window.confirm("Deseja cancelar esta corrida?")) return;

    if (animacao) cancelAnimationFrame(animacao);
    if (viagemId) removerViagem(viagemId);

    window.location.href = "corrida.html";
});

el("btnDetalhes").addEventListener("click", function () {
    const painel = el("detalhes");
    painel.hidden = !painel.hidden;
    el("btnDetalhes").setAttribute("aria-expanded", String(!painel.hidden));
});

el("btnCompartilhar").addEventListener("click", function () {
    const texto =
        "Minha viagem WN57\n\n" +
        "Motorista: " + el("motNome").textContent + "\n" +
        "Veículo: " + el("motCor").textContent + " " + el("motCarro").textContent + "\n" +
        "Placa: " + el("motPlaca").textContent + "\n" +
        "Embarque: " + enderecoAtual + "\n" +
        "Destino: " + destino;

    if (navigator.share) {
        navigator.share({ title: "Minha corrida WN57", text: texto }).catch(function () { });
    } else {
        alert(texto);
    }
});

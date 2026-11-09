// Página de confirmar endereço: mapa + botão de confirmar

// ====== AJUSTES DA SIMULAÇÃO ======
const VELOCIDADE_KMH = 25;   // velocidade do carro na cidade
const ACELERACAO = 1;        // 1 = tempo real | 2 = 2x mais rápido | 0.5 = mais devagar
// ==================================

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

function mostrarErro(msg) {
    el("erroMapa").textContent = msg || "";
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

// ----- início -----

document.addEventListener("DOMContentLoaded", function () {
    const origem = localStorage.getItem("origemCorrida");
    destino = localStorage.getItem("destinoCorrida");

    categoria = localStorage.getItem("categoriaCorrida") || "WN";
    valor = Number(localStorage.getItem("valorCorrida")) || 0;
    pagamento = localStorage.getItem("pagamentoCorrida") || "";

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

// ponto a "km" de distância, em direção aleatória
function pontoProximo(centro, km) {
    const ang = Math.random() * 2 * Math.PI;
    const dLat = (km / 111) * Math.cos(ang);
    const dLng = (km / (111 * Math.cos(centro[0] * Math.PI / 180))) * Math.sin(ang);

    return [centro[0] + dLat, centro[1] + dLng];
}

// rota real pelas ruas (OSRM); se falhar, usa linha reta
function rotaMotorista(inicio, fim) {
    const url =
        "https://router.project-osrm.org/route/v1/driving/" +
        inicio[1] + "," + inicio[0] + ";" + fim[1] + "," + fim[0] +
        "?overview=full&geometries=geojson";

    const controle = new AbortController();
    const limite = setTimeout(function () { controle.abort(); }, 6000);

    return fetch(url, { signal: controle.signal })
        .then(function (r) {
            if (!r.ok) throw new Error("rota");
            return r.json();
        })
        .then(function (d) {
            if (d.code !== "Ok" || !d.routes.length) throw new Error("rota");

            return {
                caminho: d.routes[0].geometry.coordinates.map(function (c) {
                    return [c[1], c[0]];
                }),
                km: d.routes[0].distance / 1000
            };
        })
        .catch(function () {
            const passos = 30;
            const caminho = [];

            for (let i = 0; i <= passos; i++) {
                const t = i / passos;
                caminho.push([
                    inicio[0] + (fim[0] - inicio[0]) * t,
                    inicio[1] + (fim[1] - inicio[1]) * t
                ]);
            }

            return { caminho: caminho, km: distanciaKm(inicio, fim) };
        })
        .then(function (r) {
            clearTimeout(limite);
            return r;
        });
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

function encontrarMotorista() {
    const mot = sortear(MOTORISTAS);
    const [modelo, cor] = sortear(CARROS[categoria] || CARROS.WN);
    const inicio = pontoProximo(posicao, 0.8 + Math.random() * 0.9);

    rotaMotorista(inicio, posicao).then(function (rota) {
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

        // registra a corrida em Atividade
        viagemId = registrarViagem({
            destino: destino,
            valor: valor,
            status: "concluida",
            pagamento: pagamento,
            categoria: categoria
        });

        // carro no mapa
        carro = L.marker(rota.caminho[0], {
            interactive: false,
            keyboard: false,
            icon: L.divIcon({
                className: "",
                html: '<div class="carro-pino"><i class="fa-solid fa-car-side"></i></div>',
                iconSize: [38, 38],
                iconAnchor: [19, 19]
            })
        }).addTo(mapa);

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
    const lats = caminho.map(function (p) { return p[0]; });
    const lngs = caminho.map(function (p) { return p[1]; });
    const m = 0.0015;

    const area =
        (Math.min.apply(null, lats) - m) + "," + (Math.min.apply(null, lngs) - m) + "," +
        (Math.max.apply(null, lats) + m) + "," + (Math.max.apply(null, lngs) + m);

    const consulta =
        '[out:json][timeout:8];node["highway"="traffic_signals"](' + area + ");out;";

    const controle = new AbortController();
    const limite = setTimeout(function () { controle.abort(); }, 8000);

    return fetch(
        "https://overpass-api.de/api/interpreter?data=" + encodeURIComponent(consulta),
        { signal: controle.signal }
    )
        .then(function (r) {
            if (!r.ok) throw new Error("overpass");
            return r.json();
        })
        .then(function (dados) {
            const cum = distanciasAcumuladas(caminho);
            const total = cum[cum.length - 1];
            const achados = [];

            dados.elements.forEach(function (no) {
                let melhor = Infinity;
                let ind = 0;

                caminho.forEach(function (p, i) {
                    const dist = distanciaKm(p, [no.lat, no.lon]) * 1000;
                    if (dist < melhor) { melhor = dist; ind = i; }
                });

                // só os semáforos que estão em cima do caminho
                if (melhor <= 35) {
                    achados.push({ pos: [no.lat, no.lon], d: cum[ind] });
                }
            });

            achados.sort(function (a, b) { return a.d - b.d; });

            const finais = [];

            achados.forEach(function (a) {
                const ultimo = finais[finais.length - 1];
                const longeDosExtremos = a.d > 40 && a.d < total - 40;

                if (longeDosExtremos && (!ultimo || a.d - ultimo.d > 80)) {
                    finais.push(a);
                }
            });

            return finais.slice(0, 8);
        })
        .catch(function () {
            return []; // sem internet ou serviço fora: segue sem semáforos
        })
        .then(function (r) {
            clearTimeout(limite);
            return r;
        });
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

// ---------- o carro anda e para nos semáforos ----------
// (velocidade definida em VELOCIDADE_KMH e ACELERACAO, no topo do arquivo)

function percorrer(caminho, minutos, semaforos, fase) {
    const cum = distanciasAcumuladas(caminho);
    const total = cum[cum.length - 1] || 1;
    const velocidade = (VELOCIDADE_KMH / 3.6 / 1000) * ACELERACAO; // metros por milissegundo

    semaforoMarcadores.forEach(function (m) { mapa.removeLayer(m); });

    semaforoMarcadores = semaforos.map(function (s) {
        return L.marker(s.pos, {
            interactive: false,
            keyboard: false,
            icon: iconeSemaforo("verde")
        }).addTo(mapa);
    });

    let d = 0;
    let proximo = 0;
    let parada = null;
    let ultimo = performance.now();

    function posicaoEm(dist) {
        let i = 1;
        while (i < cum.length - 1 && cum[i] < dist) i++;

        const a = caminho[i - 1];
        const b = caminho[i];
        const seg = cum[i] - cum[i - 1] || 1;
        const f = Math.min(Math.max((dist - cum[i - 1]) / seg, 0), 1);

        return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
    }

    function quadro(agora) {
        const dt = Math.min(agora - ultimo, 100);
        ultimo = agora;

        if (parada) {
            // parado no sinal vermelho
            if (agora >= parada) {
                semaforoMarcadores[proximo].setIcon(iconeSemaforo("verde"));
                proximo++;
                parada = null;
            }
        } else {
            d = Math.min(d + velocidade * dt, total);

            if (proximo < semaforos.length && d >= semaforos[proximo].d) {
                d = semaforos[proximo].d;
                parada = agora + 4000 + Math.random() * 3000;
                semaforoMarcadores[proximo].setIcon(iconeSemaforo("vermelho"));
            }
        }

        carro.setLatLng(posicaoEm(d));
        atualizarTextos(fase, Math.ceil(minutos * (1 - d / total)), !!parada);

        if (d >= total && !parada) {
            el("avisoMapa").hidden = true;
            if (fase === "buscar") motoristaChegou(); else viagemConcluida();
            return;
        }

        animacao = requestAnimationFrame(quadro);
    }

    animacao = requestAnimationFrame(quadro);
}

// ---------- motorista chegou -> viagem até o destino ----------

function motoristaChegou() {
    el("etaTitulo").textContent = "Seu motorista chegou";
    el("etaTexto").textContent = "Informe o PIN ao entrar no carro";
    el("etaBolha").classList.add("chegou");
    el("etaBolha").innerHTML = '<i class="fa-solid fa-check"></i>';

    setTimeout(iniciarViagem, 7000);
}

function iniciarViagem() {
    // dentro do carro: some o PIN e o botão de cancelar
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

// ---------- chegou no destino ----------

function viagemConcluida() {
    el("fimDestino").textContent = destino;
    el("fimValor").textContent = "R$ " + valor.toFixed(2).replace(".", ",");
    el("fimPagamento").textContent = pagamento || "-";
    el("fimMotorista").textContent = nomeMotorista;

    mostrarEstado("estadoFim");
}

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
    if (nota) localStorage.setItem("avaliacaoCorrida", String(nota));
    window.location.href = "atividade.html";
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
        "Carro: " + el("motCor").textContent + " " + el("motCarro").textContent + "\n" +
        "Placa: " + el("motPlaca").textContent + "\n" +
        "Embarque: " + enderecoAtual + "\n" +
        "Destino: " + destino;

    if (navigator.share) {
        navigator.share({ title: "Minha corrida WN57", text: texto }).catch(function () { });
    } else {
        alert(texto);
    }
});
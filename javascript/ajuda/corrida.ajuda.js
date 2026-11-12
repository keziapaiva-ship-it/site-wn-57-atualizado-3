
/* ======================================================
   WN57 - PÁGINA DE CONFIRMAÇÃO DA CORRIDA
   Arquivo: /javascript/corrida/corrida.js

   Funcionalidades:
   - Mostrar origem e destino
   - Inicializar mapa Leaflet
   - Buscar endereços no OpenStreetMap
   - Traçar rota
   - Calcular distância e tempo
   - Selecionar veículo
   - Selecionar pagamento
   - Validar cartão
   - Confirmar corrida
   - Encaminhar WN Pet para os termos
====================================================== */


/* ======================================================
   VARIÁVEIS DA CORRIDA
====================================================== */

let categoriaSelecionada = "WN";
let valorSelecionado = 15;

let mapa = null;


/* ======================================================
   INICIALIZAÇÃO DA PÁGINA
====================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const origem = localStorage.getItem("origemCorrida");
    const destino = localStorage.getItem("destinoCorrida");

    if (!origem || !destino) {
        alert("Informe sua localização e destino primeiro.");
        window.location.href = "solicitar.html";
        return;
    }

    const mostrarOrigem = document.getElementById("mostrarOrigem");
    const mostrarDestino = document.getElementById("mostrarDestino");

    if (mostrarOrigem) {
        mostrarOrigem.textContent = origem;
    }

    if (mostrarDestino) {
        mostrarDestino.textContent = destino;
    }

    // Limpa o aceite de uma corrida Pet anterior
    localStorage.removeItem("petAvisoAceito");

    // Inicializa o mapa
    iniciarMapa(origem, destino);

    // Inicializa os pagamentos
    iniciarPagamento();

    // Liga o botão de confirmar
    const botaoConfirmar = document.getElementById("confirmar");

    if (botaoConfirmar) {
        botaoConfirmar.addEventListener("click", confirmarCorrida);
    }

});


/* ======================================================
   INFORMAÇÕES DA ROTA
====================================================== */

function mostrarStatusRota(titulo, subtitulo) {

    const distancia = document.getElementById("distanciaRota");
    const tempo = document.getElementById("tempoRota");

    if (distancia) {
        distancia.textContent = titulo;
    }

    if (tempo) {
        tempo.textContent = subtitulo;
    }

}


/* ======================================================
   CONVERTER ENDEREÇO EM COORDENADAS
   OpenStreetMap - Nominatim
====================================================== */

function geocodificar(texto) {

    const chave = "geo:" + texto.trim().toLowerCase();

    try {
        const salvo = JSON.parse(localStorage.getItem(chave));

        if (Array.isArray(salvo)) {
            return Promise.resolve(salvo);
        }

    } catch (e) {
        console.warn("Não foi possível recuperar coordenadas salvas.");
    }

    const url =
        "https://nominatim.openstreetmap.org/search?format=json&limit=1" +
        "&countrycodes=br&accept-language=pt-BR" +
        "&viewbox=-49.45,-25.25,-48.95,-25.65" +
        "&q=" + encodeURIComponent(texto);

    return fetch(url)

        .then(function (resposta) {

            if (!resposta.ok) {
                throw new Error("Erro ao buscar endereço.");
            }

            return resposta.json();

        })

        .then(function (resultados) {

            if (!resultados.length) {
                return null;
            }

            const coordenadas = [
                parseFloat(resultados[0].lat),
                parseFloat(resultados[0].lon)
            ];

            localStorage.setItem(
                chave,
                JSON.stringify(coordenadas)
            );

            return coordenadas;

        });

}


/* ======================================================
   RECUPERAR COORDENADAS SALVAS
====================================================== */

function coordsSalvas(nome) {

    try {

        const coordenadas = JSON.parse(localStorage.getItem(nome));

        if (
            Array.isArray(coordenadas) &&
            coordenadas.length === 2
        ) {
            return coordenadas;
        }

    } catch (e) {
        console.warn("Coordenadas salvas inválidas.");
    }

    return null;

}


/* ======================================================
   LOCALIZAÇÃO ATUAL DO NAVEGADOR
====================================================== */

function localizacaoDoNavegador() {

    return new Promise(function (resolve, reject) {

        if (!navigator.geolocation) {
            reject(new Error("Geolocalização não disponível."));
            return;
        }

        navigator.geolocation.getCurrentPosition(

            function (posicao) {

                resolve([
                    posicao.coords.latitude,
                    posicao.coords.longitude
                ]);

            },

            reject,

            {
                timeout: 8000,
                enableHighAccuracy: true
            }

        );

    });

}


/* ======================================================
   OBTER COORDENADAS DA ORIGEM
====================================================== */

function obterOrigem(texto) {

    const salvas = coordsSalvas("origemCoords");

    if (salvas) {
        return Promise.resolve(salvas);
    }

    if (/localiza[cç][aã]o atual|minha localiza|onde estou/i.test(texto)) {

        return localizacaoDoNavegador().catch(function () {
            return geocodificar(texto);
        });

    }

    return geocodificar(texto);

}


/* ======================================================
   OBTER COORDENADAS DO DESTINO
====================================================== */

function obterDestino(texto) {

    const salvas = coordsSalvas("destinoCoords");

    if (salvas) {
        return Promise.resolve(salvas);
    }

    return geocodificar(texto);

}


/* ======================================================
   INICIALIZAR MAPA E TRAÇAR ROTA
====================================================== */

function iniciarMapa(origem, destino) {

    const elementoMapa = document.getElementById("mapa");

    // Verifica se o mapa existe no HTML
    if (!elementoMapa) {
        console.error("Elemento #mapa não encontrado no HTML.");
        return;
    }

    // Verifica se a biblioteca Leaflet foi carregada
    if (typeof L === "undefined") {
        console.error("Leaflet não foi carregado.");
        mostrarStatusRota(
            "Mapa indisponível",
            "Verifique a biblioteca Leaflet."
        );
        return;
    }

    // Evita inicializar o mapa duas vezes
    if (mapa) {
        mapa.remove();
    }

    // Cria o mapa centralizado em Curitiba
    mapa = L.map("mapa").setView(
        [-25.4284, -49.2733],
        12
    );

    // Adiciona o mapa de ruas
    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 19,
            attribution: "&copy; OpenStreetMap contributors"
        }
    ).addTo(mapa);

    mostrarStatusRota(
        "Buscando endereços...",
        "Aguarde..."
    );

    let origemCoords;
    let destinoCoords;

    obterOrigem(origem)

        .then(function (coordenadas) {

            if (!coordenadas) {
                throw new Error("origem");
            }

            origemCoords = coordenadas;

            return obterDestino(destino);

        })

        .then(function (coordenadas) {

            if (!coordenadas) {
                throw new Error("destino");
            }

            destinoCoords = coordenadas;

            // Marcador da origem
            L.marker(origemCoords)
                .addTo(mapa)
                .bindPopup("📍 " + origem);

            // Marcador do destino
            L.marker(destinoCoords)
                .addTo(mapa)
                .bindPopup("🏁 " + destino);

            mostrarStatusRota(
                "Calculando rota...",
                "Aguarde..."
            );

            // Solicita rota ao OSRM
            const url =
                "https://router.project-osrm.org/route/v1/driving/" +
                origemCoords[1] + "," + origemCoords[0] + ";" +
                destinoCoords[1] + "," + destinoCoords[0] +
                "?overview=full&geometries=geojson";

            return fetch(url);

        })

        .then(function (resposta) {

            if (!resposta.ok) {
                throw new Error("rota");
            }

            return resposta.json();

        })

        .then(function (dados) {

            if (
                dados.code !== "Ok" ||
                !dados.routes ||
                dados.routes.length === 0
            ) {
                throw new Error("rota");
            }

            const rota = dados.routes[0];

            const distanciaKm = rota.distance / 1000;
            const tempoMinutos = Math.ceil(rota.duration / 60);

            mostrarStatusRota(
                distanciaKm.toFixed(1).replace(".", ",") + " km",
                "Aproximadamente " + tempoMinutos + " min"
            );

            // Desenha a linha da rota
            const linhaRota = L.geoJSON(
                rota.geometry,
                {
                    style: {
                        color: "#ff2d78",
                        weight: 6,
                        opacity: 0.95
                    }
                }
            ).addTo(mapa);

            // Ajusta o zoom para mostrar todo o trajeto
            mapa.fitBounds(
                linhaRota.getBounds(),
                {
                    padding: [50, 50]
                }
            );

            // Corrige a renderização do mapa
            setTimeout(function () {
                mapa.invalidateSize();
            }, 200);

        })

        .catch(function (erro) {

            console.error("Erro ao carregar rota:", erro);

            if (erro.message === "origem") {

                mostrarStatusRota(
                    "Origem não encontrada",
                    "Confira o endereço informado."
                );

            } else if (erro.message === "destino") {

                mostrarStatusRota(
                    "Destino não encontrado",
                    "Confira o endereço informado."
                );

            } else {

                mostrarStatusRota(
                    "Rota indisponível",
                    "Não foi possível calcular o trajeto."
                );

            }

        });

}


/* ======================================================
   SELECIONAR VEÍCULO
====================================================== */

function selecionarCarro(elemento, categoria, valor) {

    document.querySelectorAll(".veiculo").forEach(function (card) {
        card.classList.remove("ativo");
    });

    elemento.classList.add("ativo");

    categoriaSelecionada = categoria;
    valorSelecionado = Number(valor);

    const categoriaElemento = document.getElementById("rCat");
    const valorElemento = document.getElementById("rValor");

    if (categoriaElemento) {
        categoriaElemento.textContent = categoria;
    }

    if (valorElemento) {
        valorElemento.textContent =
            "R$ " + valorSelecionado.toFixed(2).replace(".", ",");
    }

}


/* ======================================================
   EDITAR ROTA
====================================================== */

function voltarEditar() {
    window.location.href = "solicitar.html";
}


/* ======================================================
   PAGAMENTO
====================================================== */

const NOMES_PAGAMENTO = {
    cartao: "Cartão",
    pix: "Pix",
    dinheiro: "Dinheiro"
};


/* ======================================================
   IDENTIFICAR MÉTODO DE PAGAMENTO
====================================================== */

function metodoPagamento() {

    const marcado = document.querySelector(
        'input[name="pagamento"]:checked'
    );

    return marcado ? marcado.value : "cartao";

}


/* ======================================================
   ÚLTIMOS DÍGITOS DO CARTÃO
====================================================== */

function ultimosDigitos() {

    const campo = document.getElementById("cartaoNumero");

    return campo
        ? campo.value.replace(/\D/g, "").slice(-4)
        : "";

}


/* ======================================================
   TEXTO DO PAGAMENTO
====================================================== */

function textoPagamento() {

    const metodo = metodoPagamento();
    const fim = ultimosDigitos();

    if (metodo === "cartao" && fim.length === 4) {
        return "Cartão final " + fim;
    }

    return NOMES_PAGAMENTO[metodo] || "Não informado";

}


/* ======================================================
   ATUALIZAR FORMULÁRIOS DE PAGAMENTO
====================================================== */

function atualizarPagamento() {

    const metodo = metodoPagamento();

    const formCartao = document.getElementById("formCartao");
    const formPix = document.getElementById("formPix");
    const formDinheiro = document.getElementById("formDinheiro");

    if (formCartao) {
        formCartao.classList.toggle("oculto", metodo !== "cartao");
    }

    if (formPix) {
        formPix.classList.toggle("oculto", metodo !== "pix");
    }

    if (formDinheiro) {
        formDinheiro.classList.toggle("oculto", metodo !== "dinheiro");
    }

    const resumo = document.getElementById("rPg");

    if (resumo) {
        resumo.textContent = textoPagamento();
    }

    const erro = document.getElementById("erro");

    if (erro) {
        erro.textContent = "";
    }

}


/* ======================================================
   INICIALIZAR PAGAMENTO
====================================================== */

function iniciarPagamento() {

    const numero = document.getElementById("cartaoNumero");
    const validade = document.getElementById("cartaoValidade");
    const cvv = document.getElementById("cartaoCvv");

    // Máscara do número do cartão
    if (numero) {

        numero.addEventListener("input", function () {

            numero.value = numero.value
                .replace(/\D/g, "")
                .slice(0, 16)
                .replace(/(.{4})/g, "$1 ")
                .trim();

            const resumo = document.getElementById("rPg");

            if (resumo) {
                resumo.textContent = textoPagamento();
            }

        });

    }

    // Máscara da validade
    if (validade) {

        validade.addEventListener("input", function () {

            let valor = validade.value
                .replace(/\D/g, "")
                .slice(0, 4);

            if (valor.length > 2) {
                valor = valor.slice(0, 2) + "/" + valor.slice(2);
            }

            validade.value = valor;

        });

    }

    // Limita o CVV
    if (cvv) {

        cvv.addEventListener("input", function () {

            cvv.value = cvv.value
                .replace(/\D/g, "")
                .slice(0, 4);

        });

    }

    // Atualiza os formulários quando o pagamento muda
    document
        .querySelectorAll('input[name="pagamento"]')
        .forEach(function (radio) {

            radio.addEventListener("change", atualizarPagamento);

        });

    atualizarPagamento();

}


/* ======================================================
   VALIDAR NÚMERO DO CARTÃO
====================================================== */

function numeroCartaoValido(numero) {

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


/* ======================================================
   VALIDAR PAGAMENTO
====================================================== */

function validarPagamento() {

    if (metodoPagamento() !== "cartao") {
        return "";
    }

    const numeroCampo = document.getElementById("cartaoNumero");
    const nomeCampo = document.getElementById("cartaoNome");
    const validadeCampo = document.getElementById("cartaoValidade");
    const cvvCampo = document.getElementById("cartaoCvv");

    if (!numeroCampo || !nomeCampo || !validadeCampo || !cvvCampo) {
        return "Não foi possível localizar os campos do cartão.";
    }

    const numero = numeroCampo.value.replace(/\D/g, "");
    const nome = nomeCampo.value.trim();
    const partes = validadeCampo.value.split("/");
    const cvv = cvvCampo.value;

    const mes = Number(partes[0]);
    const ano = Number(partes[1]);

    if (numero.length < 13 || !numeroCartaoValido(numero)) {
        return "Número de cartão inválido.";
    }

    if (!nome) {
        return "Informe o nome impresso no cartão.";
    }

    const venceEm = new Date(2000 + ano, mes, 0, 23, 59);

    if (
        !mes ||
        mes > 12 ||
        !ano ||
        !partes[1] ||
        partes[1].length < 2 ||
        venceEm < new Date()
    ) {
        return "Validade inválida ou vencida.";
    }

    if (cvv.length < 3) {
        return "CVV inválido.";
    }

    return "";

}


/* ======================================================
   SALVAR CORRIDA NA ATIVIDADE
====================================================== */

function registrarViagem(viagem) {

    const CHAVE = "minhasViagens";

    let lista = [];

    try {

        lista = JSON.parse(
            localStorage.getItem(CHAVE) || "[]"
        );

        if (!Array.isArray(lista)) {
            lista = [];
        }

    } catch (e) {

        lista = [];

    }

    lista.push({

        id: Date.now(),

        origem: viagem.origem || "",
        destino: viagem.destino || "",

        valor: viagem.valor,

        status: viagem.status || "solicitada",

        pagamento: viagem.pagamento || "",

        categoria: viagem.categoria || "",

        data: new Date().toISOString()

    });

    localStorage.setItem(
        CHAVE,
        JSON.stringify(lista)
    );

}


/* ======================================================
   LIMPAR CAMPOS DO CARTÃO
====================================================== */

function limparCamposCartao() {

    [
        "cartaoNumero",
        "cartaoNome",
        "cartaoValidade",
        "cartaoCvv"
    ].forEach(function (id) {

        const campo = document.getElementById(id);

        if (campo) {
            campo.value = "";
        }

    });

}


/* ======================================================
   CONFIRMAR CORRIDA
====================================================== */

function confirmarCorrida() {

    const origem = localStorage.getItem("origemCorrida");
    const destino = localStorage.getItem("destinoCorrida");

    const erroElemento = document.getElementById("erro");

    if (erroElemento) {
        erroElemento.textContent = "";
    }

    if (!origem || !destino) {

        if (erroElemento) {
            erroElemento.textContent =
                "Os dados da corrida não foram encontrados.";
        } else {
            alert("Os dados da corrida não foram encontrados.");
        }

        return;

    }

    // Valida o pagamento
    const erro = validarPagamento();

    if (erro) {

        if (erroElemento) {
            erroElemento.textContent = erro;
        } else {
            alert(erro);
        }

        return;

    }

    const pagamento = textoPagamento();

    // Salva os dados da corrida
    localStorage.setItem(
        "categoriaCorrida",
        categoriaSelecionada
    );

    localStorage.setItem(
        "valorCorrida",
        String(valorSelecionado)
    );

    localStorage.setItem(
        "pagamentoCorrida",
        pagamento
    );

    // Se for WN Pet, abre primeiro os termos
    if (
        categoriaSelecionada.toLowerCase().includes("pet")
    ) {

        limparCamposCartao();

        window.location.href = "petaviso.html";

        return;

    }

    // Registra a corrida normal
    registrarViagem({

        origem: origem,
        destino: destino,

        valor: valorSelecionado,

        status: "solicitada",

        pagamento: pagamento,

        categoria: categoriaSelecionada

    });

    limparCamposCartao();

    const sucesso = document.getElementById("pgSucesso");

    if (sucesso) {

        sucesso.textContent =
            "Corrida confirmada! Pagamento: " + pagamento;

        sucesso.classList.add("ver");

    } else {

        alert("Corrida confirmada com sucesso!");

    }

}


/* ======================================================
   COMPARTILHAR CORRIDA
====================================================== */

function compartilharCorrida() {

    const origem =
        localStorage.getItem("origemCorrida") ||
        "Não informada";

    const destino =
        localStorage.getItem("destinoCorrida") ||
        "Não informado";

    const texto =
        "Minha viagem WN57\n\n" +
        "Origem: " + origem + "\n" +
        "Destino: " + destino;

    if (navigator.share) {

        navigator.share({

            title: "Minha corrida WN57",

            text: texto

        }).catch(function (erro) {

            console.warn("Compartilhamento cancelado:", erro);

        });

    } else {

        alert(texto);

    }

}


/* ======================================================
   VERIFICAR LOGIN
====================================================== */

function irParaLogin() {
    window.location.href = "login.html";
}



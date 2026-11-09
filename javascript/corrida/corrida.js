let categoriaSelecionada = "WN";
let valorSelecionado = 15;

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

  // Nova corrida: apaga o aceite do aviso Pet da corrida anterior
  localStorage.removeItem("petAvisoAceito");

  iniciarMapa(origem, destino);
  iniciarPagamento();
});


// =========================
// MAPA E ROTA (usa o que foi digitado em solicitar.html)
// =========================

function mostrarStatusRota(titulo, subtitulo) {
  const distancia = document.getElementById("distanciaRota");
  const tempo = document.getElementById("tempoRota");

  if (distancia) distancia.textContent = titulo;
  if (tempo) tempo.textContent = subtitulo;
}

// Converte um endereço digitado em [latitude, longitude] (OpenStreetMap / Nominatim)
function geocodificar(texto) {
  const chave = "geo:" + texto.trim().toLowerCase();

  try {
    const salvo = JSON.parse(localStorage.getItem(chave));
    if (Array.isArray(salvo)) return Promise.resolve(salvo);
  } catch (e) { }

  // viewbox só dá preferência à região de Curitiba/Pinhais, não limita a busca
  const url =
    "https://nominatim.openstreetmap.org/search?format=json&limit=1" +
    "&countrycodes=br&accept-language=pt-BR" +
    "&viewbox=-49.45,-25.25,-48.95,-25.65" +
    "&q=" + encodeURIComponent(texto);

  return fetch(url)
    .then(function (resposta) {
      if (!resposta.ok) throw new Error("busca");
      return resposta.json();
    })
    .then(function (resultados) {
      if (!resultados.length) return null;

      const coords = [
        parseFloat(resultados[0].lat),
        parseFloat(resultados[0].lon)
      ];

      localStorage.setItem(chave, JSON.stringify(coords));
      return coords;
    });
}

// Se o solicitar.html já guardou as coordenadas, usa elas
function coordsSalvas(nome) {
  try {
    const c = JSON.parse(localStorage.getItem(nome));
    if (Array.isArray(c) && c.length === 2) return c;
  } catch (e) { }
  return null;
}

function localizacaoDoNavegador() {
  return new Promise(function (resolve, reject) {
    if (!navigator.geolocation) {
      reject(new Error("sem geolocalização"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      function (pos) {
        resolve([pos.coords.latitude, pos.coords.longitude]);
      },
      reject,
      { timeout: 8000 }
    );
  });
}

function obterOrigem(texto) {
  const salvas = coordsSalvas("origemCoords");
  if (salvas) return Promise.resolve(salvas);

  if (/localiza[cç][aã]o atual|minha localiza|onde estou/i.test(texto)) {
    return localizacaoDoNavegador().catch(function () {
      return geocodificar(texto);
    });
  }

  return geocodificar(texto);
}

function obterDestino(texto) {
  const salvas = coordsSalvas("destinoCoords");
  return salvas ? Promise.resolve(salvas) : geocodificar(texto);
}

function iniciarMapa(origem, destino) {
  const mapa = L.map("map").setView([-25.4284, -49.2733], 12);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(mapa);

  mostrarStatusRota("Buscando endereços...", "Aguarde...");

  let origemCoords;
  let destinoCoords;

  obterOrigem(origem)
    .then(function (coords) {
      if (!coords) throw new Error("origem");
      origemCoords = coords;
      return obterDestino(destino);
    })
    .then(function (coords) {
      if (!coords) throw new Error("destino");
      destinoCoords = coords;

      L.marker(origemCoords).addTo(mapa).bindPopup("📍 " + origem);
      L.marker(destinoCoords).addTo(mapa).bindPopup("🏁 " + destino);

      mostrarStatusRota("Calculando rota...", "Aguarde...");

      // O OSRM recebe LONGITUDE, LATITUDE
      const url =
        "https://router.project-osrm.org/route/v1/driving/" +
        origemCoords[1] + "," + origemCoords[0] + ";" +
        destinoCoords[1] + "," + destinoCoords[0] +
        "?overview=full&geometries=geojson";

      return fetch(url);
    })
    .then(function (resposta) {
      if (!resposta.ok) throw new Error("rota");
      return resposta.json();
    })
    .then(function (dados) {
      if (dados.code !== "Ok" || !dados.routes || dados.routes.length === 0) {
        throw new Error("rota");
      }

      const rota = dados.routes[0];
      const distanciaKm = rota.distance / 1000;
      const tempoMinutos = Math.ceil(rota.duration / 60);

      mostrarStatusRota(
        distanciaKm.toFixed(1).replace(".", ",") + " km",
        "Aproximadamente " + tempoMinutos + " min"
      );

      const linhaRota = L.geoJSON(rota.geometry, {
        style: { color: "#ff2d78", weight: 6, opacity: 0.95 }
      }).addTo(mapa);

      mapa.fitBounds(linhaRota.getBounds(), { padding: [50, 50] });
    })
    .catch(function (erro) {
      console.error("Erro da rota:", erro);

      if (erro.message === "origem") {
        mostrarStatusRota("Origem não encontrada", "Toque no lápis e confira o endereço");
      } else if (erro.message === "destino") {
        mostrarStatusRota("Destino não encontrado", "Toque no lápis e confira o endereço");
      } else {
        mostrarStatusRota("Rota indisponível", "Tente novamente");
      }
    });
}


// =========================
// SELECIONAR CARRO
// =========================

function selecionarCarro(elemento, categoria, valor) {
  document.querySelectorAll(".categoria").forEach(function (card) {
    card.classList.remove("ativa");
  });

  elemento.classList.add("ativa");

  categoriaSelecionada = categoria;
  valorSelecionado = valor;

  const categoriaElemento =
    document.getElementById("categoriaEscolhida");

  const valorElemento =
    document.getElementById("valorCorrida");

  if (categoriaElemento) {
    categoriaElemento.textContent = categoria;
  }

  if (valorElemento) {
    valorElemento.textContent =
      "R$ " + valor.toFixed(2).replace(".", ",");
  }
}


// =========================
// EDITAR ROTA
// =========================

function voltarEditar() {
  window.location.href = "solicitar.html";
}


// =========================
// PAGAMENTO
// =========================

const NOMES_PAGAMENTO = {
  cartao: "Cartão",
  pix: "Pix",
  dinheiro: "Dinheiro"
};

function metodoPagamento() {
  const marcado = document.querySelector('input[name="pagamento"]:checked');
  return marcado ? marcado.value : "cartao";
}

function ultimosDigitos() {
  const campo = document.getElementById("cartaoNumero");
  return campo ? campo.value.replace(/\D/g, "").slice(-4) : "";
}

function textoPagamento() {
  const metodo = metodoPagamento();
  const fim = ultimosDigitos();

  if (metodo === "cartao" && fim.length === 4) {
    return "Cartão final " + fim;
  }

  return NOMES_PAGAMENTO[metodo];
}

function atualizarPagamento() {
  const metodo = metodoPagamento();

  ["cartao", "pix", "dinheiro"].forEach(function (nome) {
    const painel = document.getElementById("pg-" + nome);
    if (painel) painel.hidden = nome !== metodo;
  });

  const resumo = document.getElementById("pagamentoEscolhido");
  if (resumo) resumo.textContent = textoPagamento();

  const erro = document.getElementById("pgErro");
  if (erro) erro.textContent = "";
}

function iniciarPagamento() {
  const numero = document.getElementById("cartaoNumero");
  const validade = document.getElementById("cartaoValidade");
  const cvv = document.getElementById("cartaoCvv");

  // Máscara do número: 0000 0000 0000 0000
  if (numero) {
    numero.addEventListener("input", function () {
      numero.value = numero.value
        .replace(/\D/g, "")
        .slice(0, 16)
        .replace(/(.{4})/g, "$1 ")
        .trim();

      const resumo = document.getElementById("pagamentoEscolhido");
      if (resumo) resumo.textContent = textoPagamento();
    });
  }

  // Máscara da validade: MM/AA
  if (validade) {
    validade.addEventListener("input", function () {
      let v = validade.value.replace(/\D/g, "").slice(0, 4);
      if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2);
      validade.value = v;
    });
  }

  // CVV só números
  if (cvv) {
    cvv.addEventListener("input", function () {
      cvv.value = cvv.value.replace(/\D/g, "").slice(0, 4);
    });
  }

  document
    .querySelectorAll('input[name="pagamento"]')
    .forEach(function (radio) {
      radio.addEventListener("change", atualizarPagamento);
    });

  atualizarPagamento();
}

// Confere se o número do cartão é válido (algoritmo de Luhn)
function numeroCartaoValido(numero) {
  let soma = 0;
  let dobrar = false;

  for (let i = numero.length - 1; i >= 0; i--) {
    let d = Number(numero[i]);

    if (dobrar) {
      d *= 2;
      if (d > 9) d -= 9;
    }

    soma += d;
    dobrar = !dobrar;
  }

  return soma % 10 === 0;
}

// Devolve a mensagem de erro ou "" se estiver tudo certo
function validarPagamento() {
  if (metodoPagamento() !== "cartao") return "";

  const numero = document.getElementById("cartaoNumero").value.replace(/\D/g, "");
  const nome = document.getElementById("cartaoNome").value.trim();
  const partes = document.getElementById("cartaoValidade").value.split("/");
  const cvv = document.getElementById("cartaoCvv").value;

  const mes = Number(partes[0]);
  const ano = Number(partes[1]);

  if (numero.length < 13 || !numeroCartaoValido(numero)) {
    return "Número de cartão inválido.";
  }

  if (!nome) {
    return "Informe o nome impresso no cartão.";
  }

  const venceEm = new Date(2000 + ano, mes, 0, 23, 59);

  if (!mes || mes > 12 || !ano || partes[1].length < 2 || venceEm < new Date()) {
    return "Validade inválida ou vencida.";
  }

  if (cvv.length < 3) {
    return "CVV inválido.";
  }

  return "";
}


// =========================
// SALVAR CORRIDA NA ATIVIDADE
// =========================

function registrarViagem(viagem) {
  const CHAVE = "minhasViagens";
  let lista = [];

  try {
    lista = JSON.parse(localStorage.getItem(CHAVE) || "[]");
  } catch (e) {
    lista = [];
  }

  lista.push({
    id: Date.now(),
    destino: viagem.destino,
    valor: viagem.valor,
    status: viagem.status || "concluida",
    pagamento: viagem.pagamento || "",
    categoria: viagem.categoria || "",
    data: new Date().toISOString()
  });

  localStorage.setItem(CHAVE, JSON.stringify(lista));
}


// =========================
// CONFIRMAR CORRIDA
// =========================

function limparCamposCartao() {
  ["cartaoNumero", "cartaoNome", "cartaoValidade", "cartaoCvv"].forEach(function (id) {
    const campo = document.getElementById(id);
    if (campo) campo.value = "";
  });
}

function confirmarCorrida() {
  const origem = localStorage.getItem("origemCorrida");
  const destino = localStorage.getItem("destinoCorrida");

  if (!origem || !destino) {
    alert("Dados da corrida não encontrados.");
    return;
  }

  const erro = validarPagamento();
  const erroElemento = document.getElementById("pgErro");

  if (erro) {
    if (erroElemento) erroElemento.textContent = erro;
    return;
  }

  if (erroElemento) erroElemento.textContent = "";

  const pagamento = textoPagamento(); // nunca guarda número completo, validade ou CVV

  localStorage.setItem("categoriaCorrida", categoriaSelecionada);
  localStorage.setItem("valorCorrida", valorSelecionado);
  localStorage.setItem("pagamentoCorrida", pagamento);

  // WN Pet: vai para a página de aviso (depois dela, confirmar endereço)
  if (categoriaSelecionada === "Pet") {
    limparCamposCartao();
    window.location.href = "petaviso.html";
    return;
  }

  registrarViagem({
    destino: destino,
    valor: valorSelecionado,
    status: "concluida",
    pagamento: pagamento,
    categoria: categoriaSelecionada
  });

  // Limpa os dados do cartão da tela
  limparCamposCartao();

  const sucesso = document.getElementById("pgSucesso");

  if (sucesso) {
    sucesso.innerHTML =
      "Corrida confirmada! Pagamento: " + pagamento +
      ' — <a href="atividade.html">Ver em Atividade</a>';
    sucesso.classList.add("ver");
  }
}


// =========================
// COMPARTILHAR CORRIDA
// =========================

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
    });
  } else {
    alert(texto);
  }
}


// =========================
// NÃO FAZER CORRIDA SEM LOGIN
// =========================

const usuarioLogado = localStorage.getItem("usuarioLogado");
const mensagemLogin = document.getElementById("mensagemLogin");

if (usuarioLogado && mensagemLogin) {
  mensagemLogin.style.display = "none";
}

function irParaLogin() {
  window.location.href = "login.html";
}
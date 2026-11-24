(function () {

  "use strict";

  /* =========================
     UTILITÁRIOS
  ========================= */

  function definirTexto(id, texto) {
    const elemento = document.getElementById(id);
    if (elemento) {
      elemento.textContent = texto;
    }
  }


  /* =========================
     IDIOMA SALVO
  ========================= */

  const OUTRAS_CHAVES = ["idioma", "language", "lang", "wn57_lang"];

  function normalizarIdioma(valor) {
    const v = String(valor || "").toLowerCase().trim();
    if (!v) return null;
    return v.indexOf("en") === 0 ? "en" : "pt";
  }

  function idiomaAtual() {
    const proprio = normalizarIdioma(localStorage.getItem("wn57_idioma"));
    if (proprio) return proprio;

    for (let i = 0; i < OUTRAS_CHAVES.length; i++) {
      const valor = normalizarIdioma(localStorage.getItem(OUTRAS_CHAVES[i]));
      if (valor) return valor;
    }

    return "pt";
  }

  function lerChaves() {
    const copia = {};
    OUTRAS_CHAVES.concat("wn57_idioma").forEach(function (chave) {
      copia[chave] = localStorage.getItem(chave);
    });
    return copia;
  }

  function salvarIdioma(novo) {
    localStorage.setItem("wn57_idioma", novo);

    OUTRAS_CHAVES.forEach(function (chave) {
      if (localStorage.getItem(chave) !== null) {
        localStorage.setItem(chave, novo);
      }
    });
  }


  /* =========================
     VALOR DA CORRIDA
  ========================= */

  function carregarValor() {
    const valor = Number(localStorage.getItem("valorCorrida")) || 15;

    definirTexto(
      "valor",
      valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
      })
    );
  }


  /* =========================
     TROCO
  ========================= */

  function atualizarTroco() {

    const ingles = idiomaAtual() === "en";
    const precisaTroco = localStorage.getItem("precisaTroco") || "Não";
    const valorTroco = localStorage.getItem("valorTroco") || "";

    if (precisaTroco === "Sim") {
      definirTexto(
        "troco",
        ingles ? "Yes, for R$ " + valorTroco : "Sim, para R$ " + valorTroco
      );
    } else {
      definirTexto(
        "troco",
        ingles ? "No change needed" : "Não precisa"
      );
    }

  }


  /* =========================
     FINALIZAR CORRIDA
  ========================= */

  window.finalizar = function () {

    const ingles = idiomaAtual() === "en";

    const mensagem = ingles
      ? "Confirm that you gave the money to the driver?"
      : "Confirma que entregou o dinheiro ao motorista?";

    if (!confirm(mensagem)) {
      return;
    }

    const botao = document.getElementById("botaoFinalizar");
    if (botao) {
      botao.disabled = true;
    }

    localStorage.setItem("pagamentoStatus", "pago_em_dinheiro");
    localStorage.setItem("pagamentoConfirmado", "true");
    localStorage.setItem("pagamentoCorrida", "Dinheiro");
    localStorage.setItem("dataPagamento", new Date().toISOString());

    alert(ingles ? "Payment registered!" : "Pagamento registrado!");

    window.location.href = "/html/corrida/solicitar.html";

  };


  /* =========================
     MENU (traduz pelo href, sem depender de ID)
  ========================= */

  const ITENS_MENU = [
    { teste: /cadastro|cadastr/i,    pt: "Cadastre-se", en: "Sign up" },
    { teste: /login|entrar/i,        pt: "Fazer login", en: "Log in" },
    { teste: /ajuda|help/i,          pt: "Ajuda",       en: "Help" },
    { teste: /sobre/i,               pt: "Sobre-nós",   en: "About us" },
    { teste: /solicitar|viajar/i,    pt: "Viajar",      en: "Ride" },
    { teste: /inicial|inicio|home/i, pt: "Início",      en: "Home" }
  ];

  function definirTextoLink(link, texto) {

    const nos = Array.prototype.filter.call(link.childNodes, function (no) {
      return no.nodeType === 3 && no.nodeValue.trim() !== "";
    });

    if (nos.length) {
      if (nos[0].nodeValue.trim() !== texto) {
        nos[0].nodeValue = texto;
      }
      return;
    }

    if (!link.children.length && link.textContent.trim() !== texto) {
      link.textContent = texto;
    }

  }

  function traduzirMenu() {

    const ingles = idiomaAtual() === "en";

    const links = document.querySelectorAll(
      "header a, nav a, .cabecalho a, #cabecalho a, .menu a, .navbar a"
    );

    links.forEach(function (link) {

      if (link.querySelector("img, svg") ||
          /logo|perfil|avatar|brand/i.test(link.className + " " + link.id)) {
        return;
      }

      const referencia = (link.getAttribute("href") || "") + " " + (link.id || "");
      const item = ITENS_MENU.find(function (i) { return i.teste.test(referencia); });

      if (!item) return;

      definirTextoLink(link, ingles ? item.en : item.pt);

    });

  }

  /* Se o cabecalho.js criar ou refizer o menu depois, traduz de novo */
  let temporizadorMenu = null;

  new MutationObserver(function () {
    clearTimeout(temporizadorMenu);
    temporizadorMenu = setTimeout(traduzirMenu, 50);
  }).observe(document.documentElement, { childList: true, subtree: true });


  /* =========================
     TEXTOS DA PÁGINA
  ========================= */

  function atualizarIdioma() {

    const ingles = idiomaAtual() === "en";

    document.documentElement.lang = ingles ? "en" : "pt-BR";

    /* Cabeçalho por ID (se existirem) */
    definirTexto("botaoIdioma", ingles ? "🌐 EN" : "🌐 PT-BR");

    /* Página */
    definirTexto("tituloPagamento", ingles ? "Cash payment" : "Pagamento em dinheiro");

    definirTexto(
      "descricaoPagamento",
      ingles ? "Your ride has finished!" : "Sua corrida foi finalizada!"
    );

    definirTexto("textoValor", ingles ? "Total ride amount" : "Valor total da corrida");

    definirTexto(
      "tituloAviso",
      ingles ? "How to make the payment?" : "Como realizar o pagamento?"
    );

    definirTexto(
      "textoAviso",
      ingles
        ? "Give the amount directly to the driver to complete your ride payment."
        : "Entregue o valor diretamente ao motorista para finalizar o pagamento da sua viagem."
    );

    definirTexto("textoFormaPagamento", ingles ? "Payment method" : "Forma de pagamento");
    definirTexto("formaPagamento", ingles ? "Cash" : "Dinheiro");
    definirTexto("textoTroco", ingles ? "Change requested" : "Troco solicitado");
    definirTexto("statusTexto", ingles ? "Payment pending" : "Pagamento pendente");
    definirTexto("voltarInicio", ingles ? "Back to home" : "Voltar ao início");

    /* Botão com seta (mantém o <i>) */
    const botao = document.getElementById("botaoFinalizar");
    if (botao) {
      botao.innerHTML = ingles
        ? 'Finish ride <i>→</i>'
        : 'Finalizar corrida <i>→</i>';
    }

    atualizarTroco();
    traduzirMenu();

  }

  function trocarIdioma() {
    salvarIdioma(idiomaAtual() === "pt" ? "en" : "pt");
    atualizarIdioma();
  }

  if (typeof window.alternarIdioma !== "function") {
    window.alternarIdioma = trocarIdioma;
  }

  if (typeof window.atualizarIdioma !== "function") {
    window.atualizarIdioma = atualizarIdioma;
  }


  /* =========================
     BOTÃO DE IDIOMA (um único listener)
  ========================= */

  function acharBotaoIdioma(alvo) {

    let elemento = alvo;

    for (let i = 0; i < 6 && elemento && elemento !== document.body; i++) {

      const id = elemento.id || "";
      const classe = typeof elemento.className === "string" ? elemento.className : "";
      const onclick = elemento.getAttribute ? (elemento.getAttribute("onclick") || "") : "";
      const texto = (elemento.textContent || "").trim();

      const porAtributo = /idioma|lang/i.test(id + " " + classe + " " + onclick);
      const porTexto = texto.length <= 14 && /(🌐|^(PT|EN)\b)/i.test(texto);

      if (porAtributo || porTexto) {
        return elemento;
      }

      elemento = elemento.parentElement;

    }

    return null;

  }

  document.addEventListener("click", function (evento) {

    const botao = acharBotaoIdioma(evento.target);

    if (!botao) {
      return;
    }

    const textoAntes = botao.textContent.trim();
    const chavesAntes = lerChaves();
    const idiomaAntes = idiomaAtual();

    /* Dá tempo para o cabecalho.js tratar o clique */
    setTimeout(function () {

      const chavesDepois = lerChaves();
      let novo = null;

      /* 1) Alguma chave do localStorage mudou? */
      Object.keys(chavesDepois).forEach(function (chave) {
        if (!novo && chavesDepois[chave] !== chavesAntes[chave]) {
          novo = normalizarIdioma(chavesDepois[chave]);
        }
      });

      /* 2) O texto do botão mudou? */
      if (!novo) {
        const textoDepois = botao.textContent.trim();
        if (textoDepois !== textoAntes) {
          novo = /EN/i.test(textoDepois) && !/PT/i.test(textoDepois) ? "en" : "pt";
        }
      }

      /* 3) Ninguém tratou o clique: troca aqui */
      if (!novo) {
        novo = idiomaAntes === "pt" ? "en" : "pt";
      }

      salvarIdioma(novo);
      atualizarIdioma();

    }, 150);

  }, true);


  /* =========================
     MAPA
  ========================= */

  function iniciarMapa() {

    if (typeof L === "undefined" || !document.getElementById("map")) {
      return;
    }

    const mapa = L.map("map", { zoomControl: false })
      .setView([-25.442, -49.192], 15);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap"
    }).addTo(mapa);

    setTimeout(function () {
      mapa.invalidateSize();
    }, 200);

    window.addEventListener("resize", function () {
      mapa.invalidateSize();
    });

  }


  /* =========================
     INICIALIZAÇÃO
  ========================= */

  function executar(etapa) {
    try {
      etapa();
    } catch (erro) {
      console.error("Erro na etapa " + etapa.name + ":", erro);
    }
  }

  executar(carregarValor);
  executar(atualizarIdioma);
  executar(iniciarMapa);

})();
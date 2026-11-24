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

  function valorCorrida() {
    return Number(localStorage.getItem("valorCorrida")) || 15;
  }

  function carregarValor() {
    definirTexto(
      "valor",
      valorCorrida().toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
      })
    );
  }


  /* =========================
     PIX DE DEMONSTRAÇÃO
  ========================= */

  function codigoPix() {
    return "WN57-PAGAMENTO-DEMO-" + valorCorrida().toFixed(2);
  }

  function carregarPix() {

    const codigo = codigoPix();

    const campo = document.getElementById("codigoPix");
    if (campo) {
      campo.value = codigo;
    }

    const qr = document.getElementById("qrCode");
    if (qr) {
      qr.src =
        "https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=" +
        encodeURIComponent(codigo);
    }

  }


  /* =========================
     COPIAR PIX
  ========================= */

  function avisoCopiado() {
    alert(
      idiomaAtual() === "en"
        ? "PIX code copied!"
        : "Código PIX copiado!"
    );
  }

  window.copiarPix = function () {

    const campo = document.getElementById("codigoPix");
    const codigo = codigoPix();

    function copiarAntigo() {
      if (campo) {
        campo.select();
        campo.setSelectionRange(0, 99999);
      }
      try {
        document.execCommand("copy");
      } catch (erro) {
        console.error("Erro ao copiar:", erro);
      }
      avisoCopiado();
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(codigo).then(avisoCopiado).catch(copiarAntigo);
    } else {
      copiarAntigo();
    }

  };


  /* =========================
     CONFIRMAR PAGAMENTO
  ========================= */

  window.confirmarPix = function () {

    const ingles = idiomaAtual() === "en";

    const mensagem = ingles
      ? "Do you confirm that you have made the PIX payment?"
      : "Confirma que você realizou o pagamento via PIX?";

    if (!confirm(mensagem)) {
      return;
    }

    const botao = document.getElementById("botaoConfirmar");
    if (botao) {
      botao.disabled = true;
    }

    localStorage.setItem("pagamentoStatus", "pago");
    localStorage.setItem("pagamentoConfirmado", "true");
    localStorage.setItem("pagamentoCorrida", "Pix");
    localStorage.setItem("dataPagamento", new Date().toISOString());

    alert(
      ingles
        ? "Payment confirmed in the demonstration!"
        : "Pagamento confirmado na demonstração!"
    );

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

    definirTexto("botaoIdioma", ingles ? "🌐 EN" : "🌐 PT-BR");

    definirTexto("tituloPagamento", ingles ? "Payment via PIX" : "Pagamento via PIX");
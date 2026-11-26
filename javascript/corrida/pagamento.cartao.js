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

  /* Salva em wn57_idioma e nas outras chaves que já existirem,
     para o cabeçalho e a página ficarem sempre de acordo */
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
     BUSCAR CARTÃO CADASTRADO
  ========================= */

  function carregarCartaoFinal() {
    const bandeiraElemento = document.getElementById("bandeiraCartaoFinal");
    const numeroElemento = document.getElementById("numeroCartaoFinal");
    const nomeElemento = document.getElementById("nomeCartaoFinal");

    if (!bandeiraElemento || !numeroElemento || !nomeElemento) {
      return;
    }

    let cartoes = [];

    try {
      cartoes = JSON.parse(localStorage.getItem("wn57_cartoes")) || [];
    } catch (erro) {
      cartoes = [];
    }

    if (!cartoes.length) {
      bandeiraElemento.textContent = "---";
      numeroElemento.textContent = "Nenhum cartão cadastrado";
      nomeElemento.textContent = "Cartão não encontrado";
      return;
    }

    const cartao = cartoes[cartoes.length - 1];

    bandeiraElemento.textContent = cartao.bandeira || "Cartão";
    numeroElemento.textContent = "•••• •••• •••• " + (cartao.final || "••••");
    nomeElemento.textContent = cartao.nome || "Cartão cadastrado";
  }


  /* =========================
     PAGAMENTO (só ao clicar em Concluir)
  ========================= */

  function registrarPagamento() {
    localStorage.setItem("pagamentoStatus", "debitado");
    localStorage.setItem("pagamentoConfirmado", "true");
    localStorage.setItem("pagamentoCorrida", "Cartão");
    localStorage.setItem("dataPagamento", new Date().toISOString());
  }

  window.finalizar = function () {

    const pt = idiomaAtual() === "pt";

    const mensagem = pt
      ? "Deseja concluir a corrida?"
      : "Do you want to complete the ride?";

    if (!confirm(mensagem)) {
      return;
    }

    const botao = document.getElementById("botaoConcluir");
    if (botao) {
      botao.disabled = true;
    }

    registrarPagamento();

    alert(pt ? "Pagamento concluído!" : "Payment completed!");

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

  /* Troca só o texto do link e mantém ícones/elementos dentro dele */
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

      /* Não mexe em logo, imagem ou perfil */
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
    definirTexto("menuInicio", ingles ? "Home" : "Início");
    definirTexto("menuViajar", ingles ? "Ride" : "Viajar");
    definirTexto("menuSobre", ingles ? "About us" : "Sobre-nós");
    definirTexto("menuAjuda", ingles ? "Help" : "Ajuda");
    definirTexto("menuLogin", ingles ? "Log in" : "Fazer login");
    definirTexto("menuCadastro", ingles ? "Sign up" : "Cadastre-se");

    /* Página */
    definirTexto("tituloPagamento", ingles ? "Card payment" : "Pagamento com cartão");

    definirTexto(
      "descricaoPagamento",
      ingles
        ? "Your ride is finished! Check the payment details."
        : "Sua corrida foi finalizada! Confira os dados do pagamento."
    );

    definirTexto("textoValor", ingles ? "Total ride amount" : "Valor total da corrida");
    definirTexto("textoFormaPagamento", ingles ? "Payment method" : "Forma de pagamento");
    definirTexto("formaPagamento", ingles ? "Card" : "Cartão");
    definirTexto("statusTexto", ingles ? "Payment charged" : "Pagamento debitado");
    definirTexto("textoBotao", ingles ? "Complete" : "Concluir");
    definirTexto("linkVoltar", ingles ? "Back to home" : "Voltar ao início");

    /* Menu (por href) */
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
  executar(carregarCartaoFinal);
  executar(atualizarIdioma);
  executar(iniciarMapa);

})();

// Abre a mensagem personalizada
function abrirConfirmacao() {
    document.getElementById("modalConfirmacao").classList.add("ativo");
}

// Fecha a mensagem
function fecharConfirmacao() {
    document.getElementById("modalConfirmacao").classList.remove("ativo");
}

// Confirma a finalização

function confirmarFinalizacao() {
    fecharConfirmacao();

    window.location.href = "/html/corrida/solicitar.html";
}

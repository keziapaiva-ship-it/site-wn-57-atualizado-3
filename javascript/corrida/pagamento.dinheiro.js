
"use strict";

/* =====================================================
   WN57 — PAGAMENTO EM DINHEIRO
===================================================== */

(function () {

  /* =================================================
     1. UTILITÁRIOS
  ================================================= */

  function definirTexto(id, texto) {
    const elemento = document.getElementById(id);

    if (elemento) {
      elemento.textContent = texto;
    }
  }

  /* =================================================
     2. IDIOMA
  ================================================= */

  const OUTRAS_CHAVES = [
    "idioma",
    "language",
    "lang",
    "wn57_lang"
  ];

  function normalizarIdioma(valor) {
    const idioma = String(valor || "").toLowerCase().trim();

    if (!idioma) return null;

    return idioma.indexOf("en") === 0 ? "en" : "pt";
  }

  function idiomaAtual() {

    const proprio = normalizarIdioma(
      localStorage.getItem("wn57_idioma")
    );

    if (proprio) return proprio;

    for (const chave of OUTRAS_CHAVES) {

      const valor = normalizarIdioma(
        localStorage.getItem(chave)
      );

      if (valor) return valor;
    }

    return "pt";
  }

  function salvarIdioma(novo) {

    localStorage.setItem("wn57_idioma", novo);

    OUTRAS_CHAVES.forEach(function (chave) {

      if (localStorage.getItem(chave) !== null) {
        localStorage.setItem(chave, novo);
      }

    });

  }

  /* =================================================
     3. VALOR DA CORRIDA
  ================================================= */

  function carregarValor() {

    const valor = Number(
      localStorage.getItem("valorCorrida")
    ) || 15;

    definirTexto(
      "valor",
      valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
      })
    );

  }

  /* =================================================
     4. TROCO
  ================================================= */

  function atualizarTroco() {

    const ingles = idiomaAtual() === "en";

    const precisaTroco =
      localStorage.getItem("precisaTroco") || "Não";

    const valorTroco =
      localStorage.getItem("valorTroco") || "";

    if (precisaTroco === "Sim") {

      definirTexto(
        "troco",
        ingles
          ? "Yes, for R$ " + valorTroco
          : "Sim, para R$ " + valorTroco
      );

    } else {

      definirTexto(
        "troco",
        ingles
          ? "No change needed"
          : "Não precisa"
      );

    }

  }

  /* =================================================
     5. TRADUÇÃO DO MENU
  ================================================= */

  const ITENS_MENU = [
    {
      teste: /cadastro|cadastr/i,
      pt: "Cadastre-se",
      en: "Sign up"
    },
    {
      teste: /login|entrar/i,
      pt: "Fazer login",
      en: "Log in"
    },
    {
      teste: /ajuda|help/i,
      pt: "Ajuda",
      en: "Help"
    },
    {
      teste: /sobre/i,
      pt: "Sobre-nós",
      en: "About us"
    },
    {
      teste: /solicitar|viajar/i,
      pt: "Viajar",
      en: "Ride"
    },
    {
      teste: /inicial|inicio|home/i,
      pt: "Início",
      en: "Home"
    }
  ];

  function definirTextoLink(link, texto) {

    const nos = Array.prototype.filter.call(
      link.childNodes,
      function (no) {
        return no.nodeType === 3 &&
          no.nodeValue.trim() !== "";
      }
    );

    if (nos.length) {
      nos[0].nodeValue = texto;
      return;
    }

    if (!link.children.length) {
      link.textContent = texto;
    }

  }

  function traduzirMenu() {

    const ingles = idiomaAtual() === "en";

    const links = document.querySelectorAll(
      "header a, nav a, .cabecalho a, #cabecalho a, .menu a, .navbar a"
    );

    links.forEach(function (link) {

      if (
        link.querySelector("img, svg") ||
        /logo|perfil|avatar|brand/i.test(
          link.className + " " + link.id
        )
      ) {
        return;
      }

      const referencia =
        (link.getAttribute("href") || "") +
        " " +
        (link.id || "");

      const item = ITENS_MENU.find(function (i) {
        return i.teste.test(referencia);
      });

      if (!item) return;

      definirTextoLink(
        link,
        ingles ? item.en : item.pt
      );

    });

  }

  /* =================================================
     6. TEXTOS DA PÁGINA
  ================================================= */

  function atualizarIdioma() {

    const ingles = idiomaAtual() === "en";

    document.documentElement.lang =
      ingles ? "en" : "pt-BR";

    definirTexto(
      "botaoIdioma",
      ingles ? "🌐 EN" : "🌐 PT-BR"
    );

    definirTexto(
      "tituloPagamento",
      ingles ? "Cash payment" : "Pagamento em dinheiro"
    );

    definirTexto(
      "descricaoPagamento",
      ingles
        ? "Your ride has finished!"
        : "Sua corrida foi finalizada!"
    );

    definirTexto(
      "textoValor",
      ingles ? "Total ride amount" : "Valor total da corrida"
    );

    definirTexto(
      "tituloAviso",
      ingles
        ? "How to make the payment?"
        : "Como realizar o pagamento?"
    );

    definirTexto(
      "textoAviso",
      ingles
        ? "Give the amount directly to the driver to complete your ride payment."
        : "Entregue o valor diretamente ao motorista para finalizar o pagamento da sua viagem."
    );

    definirTexto(
      "textoFormaPagamento",
      ingles ? "Payment method" : "Forma de pagamento"
    );

    definirTexto(
      "formaPagamento",
      ingles ? "Cash" : "Dinheiro"
    );

    definirTexto(
      "textoTroco",
      ingles ? "Change requested" : "Troco solicitado"
    );

    definirTexto(
      "statusTexto",
      ingles ? "Payment pending" : "Pagamento pendente"
    );

    definirTexto(
      "voltarInicio",
      ingles ? "Back to home" : "Voltar ao início"
    );

    const botao = document.getElementById("botaoFinalizar");

    if (botao) {

      botao.innerHTML = ingles
        ? 'Finish ride <span>→</span>'
        : 'Finalizar corrida <span>→</span>';

    }

    atualizarTroco();
    traduzirMenu();

  }

  /* =================================================
     7. ALTERAR IDIOMA
  ================================================= */

  function trocarIdioma() {

    salvarIdioma(
      idiomaAtual() === "pt" ? "en" : "pt"
    );

    atualizarIdioma();

  }

  window.alternarIdioma = trocarIdioma;
  window.atualizarIdioma = atualizarIdioma;

  /* =================================================
     8. OBSERVAR ALTERAÇÕES NO CABEÇALHO
  ================================================= */

  let temporizadorMenu = null;

  const observadorMenu = new MutationObserver(function () {

    clearTimeout(temporizadorMenu);

    temporizadorMenu = setTimeout(
      traduzirMenu,
      100
    );

  });

  observadorMenu.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  /* =================================================
     9. BOTÃO DE IDIOMA
  ================================================= */

  function acharBotaoIdioma(alvo) {

    let elemento = alvo;

    for (
      let i = 0;
      i < 6 && elemento && elemento !== document.body;
      i++
    ) {

      const id = elemento.id || "";

      const classe =
        typeof elemento.className === "string"
          ? elemento.className
          : "";

      const onclick = elemento.getAttribute
        ? elemento.getAttribute("onclick") || ""
        : "";

      const texto = (elemento.textContent || "").trim();

      const porAtributo =
        /idioma|lang/i.test(id + " " + classe + " " + onclick);

      const porTexto =
        texto.length <= 14 &&
        /(🌐|^(PT|EN)\b)/i.test(texto);

      if (porAtributo || porTexto) {
        return elemento;
      }

      elemento = elemento.parentElement;

    }

    return null;

  }

  let cliqueIdiomaPendente = false;

  document.addEventListener("click", function (evento) {

    const botao = acharBotaoIdioma(evento.target);

    if (!botao || cliqueIdiomaPendente) return;

    cliqueIdiomaPendente = true;

    const textoAntes = botao.textContent.trim();

    const idiomaAntes = idiomaAtual();

    const chavesAntes = {};

    OUTRAS_CHAVES.concat("wn57_idioma").forEach(function (chave) {
      chavesAntes[chave] = localStorage.getItem(chave);
    });

    setTimeout(function () {

      let novo = null;

      OUTRAS_CHAVES.concat("wn57_idioma").forEach(function (chave) {

        const depois = localStorage.getItem(chave);

        if (
          !novo &&
          depois !== chavesAntes[chave]
        ) {
          novo = normalizarIdioma(depois);
        }

      });

      const textoDepois = botao.textContent.trim();

      if (!novo && textoDepois !== textoAntes) {

        novo = /EN/i.test(textoDepois) &&
          !/PT/i.test(textoDepois)
          ? "en"
          : "pt";

      }

      if (!novo) {
        novo = idiomaAntes === "pt" ? "en" : "pt";
      }

      salvarIdioma(novo);
      atualizarIdioma();

      cliqueIdiomaPendente = false;

    }, 180);

  }, true);

  /* =================================================
     10. MAPA
  ================================================= */

  function iniciarMapa() {

    const elementoMapa = document.getElementById("map");

    if (
      typeof L === "undefined" ||
      !elementoMapa ||
      elementoMapa.dataset.inicializado === "true"
    ) {
      return;
    }

    elementoMapa.dataset.inicializado = "true";

    const mapa = L.map("map", {
      zoomControl: false
    }).setView([-25.442, -49.192], 15);

    L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution: "&copy; OpenStreetMap"
      }
    ).addTo(mapa);

    setTimeout(function () {
      mapa.invalidateSize();
    }, 200);

    window.addEventListener("resize", function () {
      mapa.invalidateSize();
    });

  }

  /* =================================================
     11. MODAL DE CONFIRMAÇÃO
  ================================================= */

  function obterModal() {
    return document.getElementById("modalConfirmacaoDinheiro");
  }

  window.abrirConfirmacaoDinheiro = function () {

    const modal = obterModal();

    if (!modal) {
      console.error("WN57: modal de confirmação não encontrado.");
      return;
    }

    modal.classList.add("ativo");
    document.body.style.overflow = "hidden";

  };

  window.fecharConfirmacaoDinheiro = function () {

    const modal = obterModal();

    if (!modal) return;

    modal.classList.remove("ativo");
    document.body.style.overflow = "";

  };

  /* =================================================
     12. CONFIRMAR FINALIZAÇÃO
  ================================================= */

  window.confirmarFinalizacaoDinheiro = function () {

    const ingles = idiomaAtual() === "en";

    const botao = document.getElementById("botaoFinalizar");

    // Registrar pagamento
    localStorage.setItem("pagamentoStatus", "pago_em_dinheiro");
    localStorage.setItem("pagamentoConfirmado", "true");
    localStorage.setItem("pagamentoCorrida", "Dinheiro");
    localStorage.setItem("dataPagamento", new Date().toISOString());
    localStorage.setItem("wn57_corrida_finalizada", "true");

    // Atualizar botão
    if (botao) {
      botao.disabled = true;
      botao.textContent = ingles
        ? "Ride completed ✓"
        : "Corrida concluída ✓";
    }

    // Fechar modal
    window.fecharConfirmacaoDinheiro();

    // Mensagem personalizada
    const mensagem = document.getElementById("mensagemFinalizacao");

    if (mensagem) {
      mensagem.textContent = ingles
        ? "Payment successfully confirmed!"
        : "Pagamento confirmado com sucesso!";
      mensagem.style.display = "block";
    }

    // Redirecionar
    setTimeout(function () {
      window.location.href = "/html/corrida/solicitar.html";
    }, 1800);

  };
  /* =================================================
     13. FECHAR MODAL CLICANDO FORA OU ESC
  ================================================= */

  document.addEventListener("click", function (evento) {

    const modal = obterModal();

    if (modal && evento.target === modal) {
      window.fecharConfirmacaoDinheiro();
    }

  });

  document.addEventListener("keydown", function (evento) {

    const modal = obterModal();

    if (
      evento.key === "Escape" &&
      modal &&
      modal.classList.contains("ativo")
    ) {
      window.fecharConfirmacaoDinheiro();
    }

  });

  /* =================================================
     14. INICIALIZAÇÃO
  ================================================= */

  function inicializar() {

    carregarValor();
    atualizarIdioma();
    iniciarMapa();

    console.log("WN57: pagamento em dinheiro inicializado.");

  }

  if (document.readyState === "loading") {

    document.addEventListener(
      "DOMContentLoaded",
      inicializar
    );

  } else {

    inicializar();

  }

})();

"use strict";

/* =========================================
   WN57 — SISTEMA DE AVALIAÇÃO
========================================= */

document.addEventListener("DOMContentLoaded", function () {

  const container = document.getElementById("estrelasMotorista");
  const mensagem = document.getElementById("mensagemEstrelas");

  if (!container || !mensagem) {
    console.error("WN57: avaliação não encontrada no HTML.");
    return;
  }

  const estrelas = container.querySelectorAll("button[data-nota]");

  const textos = {
    1: "Muito ruim!",
    2: "Ruim!",
    3: "Regular!",
    4: "Muito bom!",
    5: "Excelente!"
  };

  if (estrelas.length !== 5) {
    console.error("WN57: foram encontradas " + estrelas.length + " estrelas. Eram esperadas 5.");
    return;
  }

  function selecionarEstrelas(nota) {

    estrelas.forEach(function (estrela) {

      const numero = Number(estrela.dataset.nota);

      if (numero <= nota) {
        estrela.classList.add("selecionada");
      } else {
        estrela.classList.remove("selecionada");
      }

    });

    mensagem.textContent = textos[nota];

  }

  // Recuperar nota salva
  const notaSalva = Number(
    localStorage.getItem("wn57_avaliacao_motorista")
  );

  if (notaSalva >= 1 && notaSalva <= 5) {
    selecionarEstrelas(notaSalva);
  }

  // Registrar clique em cada estrela
  estrelas.forEach(function (estrela) {

    estrela.addEventListener("click", function (evento) {

      evento.preventDefault();

      const nota = Number(this.dataset.nota);

      selecionarEstrelas(nota);

      localStorage.setItem(
        "wn57_avaliacao_motorista",
        nota
      );

      localStorage.setItem(
        "wn57_avaliacao_detalhes",
        JSON.stringify({
          nota: nota,
          data: new Date().toISOString()
        })
      );

      console.log("WN57: nota registrada:", nota);

    });

  });

  console.log("WN57: avaliação carregada. Cinco estrelas prontas.");

});

"use strict";

document.addEventListener("DOMContentLoaded", function () {

  const container = document.getElementById("estrelasMotorista");
  const mensagem = document.getElementById("mensagemEstrelas");

  if (!container || !mensagem) return;

  const estrelas = container.querySelectorAll("button[data-nota]");

  const textos = {
    1: "Muito ruim!",
    2: "Ruim!",
    3: "Regular!",
    4: "Muito bom!",
    5: "Excelente!"
  };

  function selecionarNota(nota) {

    estrelas.forEach(function (estrela) {
      const numero = Number(estrela.dataset.nota);

      estrela.classList.toggle("selecionada", numero <= nota);
    });

    mensagem.textContent = textos[nota];

    localStorage.setItem("wn57_avaliacao_motorista", nota);

    localStorage.setItem(
      "wn57_avaliacao_detalhes",
      JSON.stringify({
        nota: nota,
        data: new Date().toISOString()
      })
    );
  }

  const notaSalva = Number(
    localStorage.getItem("wn57_avaliacao_motorista")
  );

  if (notaSalva >= 1 && notaSalva <= 5) {
    selecionarNota(notaSalva);
  }

  estrelas.forEach(function (estrela) {

    estrela.addEventListener("click", function () {

      selecionarNota(Number(this.dataset.nota));

    });

  });

});

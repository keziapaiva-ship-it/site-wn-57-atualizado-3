
(function () {

  "use strict";

  const CHAVE_IDIOMA = "wn57_idioma";

  const traducoes = {

    pt: {
      titulo: "Crie sua conta",
      descricao: "Preencha seus dados para viajar com a WN57.",
      divisor: "ou cadastre-se com seus dados",

      fotoTitulo: "Foto de perfil",
      fotoDica: "JPG ou PNG, até 5 MB. Ela aparece no seu perfil.",
      escolherFoto: "Escolher foto",
      nenhumArquivo: "Nenhum arquivo escolhido",

      nome: "Nome completo",
      nomePlaceholder: "Ex.: Maria da Silva",

      email: "E-mail",
      emailPlaceholder: "voce@email.com",

      data: "Data de nascimento",
      dataPlaceholder: "dd/mm/aaaa",

      telefone: "Telefone",
      telefonePlaceholder: "(11) 99999-9999",

      senha: "Senha",
      senhaPlaceholder: "Crie uma senha",

      confirmar: "Confirmar senha",
      confirmarPlaceholder: "Repita a senha",

      dicaSenha: "Use 8 ou mais caracteres, com letra maiúscula, minúscula, número e símbolo.",

      botao: "Criar conta",

      termos: "Ao criar a conta, você concorda com os",
      termosLink: "Termos de uso",
      e: "e a",
      privacidade: "Política de privacidade",

      pergunta: "Já tem uma conta?",
      entrar: "Entrar",

      erros: {
        nome: "Digite seu nome completo.",
        email: "Digite um e-mail válido.",
        data: "Use uma data válida no formato dd/mm/aaaa.",
        telefone: "Digite DDD e número do telefone.",
        senha: "Use 8+ caracteres com maiúscula, minúscula, número e símbolo.",
        confirmacao: "As senhas não são iguais."
      },

      status: {
        conferir: "Confira os campos destacados.",
        criando: "Criando sua conta...",
        sucesso: "Conta criada com sucesso!",
        servidor: "Não foi possível conectar ao servidor. Confira se o back está rodando.",
        falha: "Não foi possível criar a conta."
      },

      forca: [
        "",
        "Muito fraca",
        "Fraca",
        "Média",
        "Boa",
        "Forte"
      ],

      mostrarSenha: "Mostrar ou ocultar senha",
      fotoInvalida: "Escolha uma imagem (JPG ou PNG) de até 5 MB."
    },

    en: {
      titulo: "Create your account",
      descricao: "Fill in your details to travel with WN57.",
      divisor: "or sign up with your details",

      fotoTitulo: "Profile picture",
      fotoDica: "JPG or PNG, up to 5 MB. It will appear on your profile.",
      escolherFoto: "Choose photo",
      nenhumArquivo: "No file selected",

      nome: "Full name",
      nomePlaceholder: "E.g.: Maria Silva",

      email: "Email",
      emailPlaceholder: "you@email.com",

      data: "Date of birth",
      dataPlaceholder: "dd/mm/yyyy",

      telefone: "Phone",
      telefonePlaceholder: "(11) 99999-9999",

      senha: "Password",
      senhaPlaceholder: "Create a password",

      confirmar: "Confirm password",
      confirmarPlaceholder: "Repeat your password",

      dicaSenha: "Use 8 or more characters, including uppercase and lowercase letters, a number and a symbol.",

      botao: "Create account",

      termos: "By creating an account, you agree to our",
      termosLink: "Terms of use",
      e: "and",
      privacidade: "Privacy policy",

      pergunta: "Already have an account?",
      entrar: "Log in",

      erros: {
        nome: "Enter your full name.",
        email: "Enter a valid email address.",
        data: "Enter a valid date in dd/mm/yyyy format.",
        telefone: "Enter your area code and phone number.",
        senha: "Use 8+ characters with uppercase, lowercase, a number and a symbol.",
        confirmacao: "Passwords do not match."
      },

      status: {
        conferir: "Please check the highlighted fields.",
        criando: "Creating your account...",
        sucesso: "Account created successfully!",
        servidor: "Could not connect to the server. Check whether the backend is running.",
        falha: "Could not create the account."
      },

      forca: [
        "",
        "Very weak",
        "Weak",
        "Medium",
        "Good",
        "Strong"
      ],

      mostrarSenha: "Show or hide password",
      fotoInvalida: "Choose an image (JPG or PNG) up to 5 MB."
    }

  };


  // ==========================================
  // UTILITÁRIO
  // ==========================================

  function definirTexto(id, texto) {

    const elemento = document.getElementById(id);

    if (elemento) {
      elemento.textContent = texto;
    }

  }


  // ==========================================
  // TRADUZIR A PÁGINA
  // ==========================================

  function atualizarIdiomaCadastro() {

    const idioma = localStorage.getItem(CHAVE_IDIOMA) || "pt";

    const t = traducoes[idioma] || traducoes.pt;

    document.documentElement.lang =
      idioma === "en" ? "en" : "pt-BR";


    // TÍTULO

    definirTexto("cadTitulo", t.titulo);

    definirTexto("cadDescricao", t.descricao);

    definirTexto("cadDivisor", t.divisor);


    // FOTO

    definirTexto("cadFotoTitulo", t.fotoTitulo);

    definirTexto("cadFotoDica", t.fotoDica);

    definirTexto("cadEscolherFoto", t.escolherFoto);


    const arquivo = document.getElementById("nomeArquivo");

    if (arquivo) {

      if (!document.getElementById("foto")?.files?.length) {
        arquivo.textContent = t.nenhumArquivo;
      }

    }


    // CAMPOS

    definirTexto("labelNome", t.nome);

    definirTexto("labelEmail", t.email);

    definirTexto("labelData", t.data);

    definirTexto("labelTelefone", t.telefone);

    definirTexto("labelSenha", t.senha);

    definirTexto("labelConfirmacao", t.confirmar);


    // PLACEHOLDERS

    const placeholders = {

      nome: t.nomePlaceholder,
      email: t.emailPlaceholder,
      date: t.dataPlaceholder,
      telefone: t.telefonePlaceholder,
      senha: t.senhaPlaceholder,
      "confirmacao-senha": t.confirmarPlaceholder

    };

    Object.keys(placeholders).forEach(function (id) {

      const campo = document.getElementById(id);

      if (campo) {
        campo.placeholder = placeholders[id];
      }

    });


    // DICA DA SENHA

    definirTexto("cadDicaSenha", t.dicaSenha);


    // BOTÃO

    definirTexto("cadBotao", t.botao);


    // TERMOS

    const termos = document.getElementById("cadTermos");

    if (termos) {

      termos.innerHTML = `
                ${t.termos}
                <a href="#" id="cadTermosLink">${t.termosLink}</a>
                ${t.e}
                <a href="#" id="cadPrivacidadeLink">${t.privacidade}</a>.
            `;

    }


    // LOGIN

    const pergunta = document.getElementById("cadJaTemConta");

    if (pergunta) {

      pergunta.innerHTML = `
                ${t.pergunta}
                <a href="/html/login/login.html" id="cadEntrar">
                    ${t.entrar}
                </a>
            `;

    }


    // ATUALIZA MENSAGENS DE ERRO JÁ EXIBIDAS

    const erros = document.querySelectorAll(".erro-msg");

    const mensagensErro = {

      "Digite seu nome completo.": t.erros.nome,
      "Digite um e-mail válido.": t.erros.email,
      "Use uma data válida no formato dd/mm/aaaa.": t.erros.data,
      "Digite DDD e número do telefone.": t.erros.telefone,
      "Use 8+ caracteres com maiúscula, minúscula, número e símbolo.": t.erros.senha,
      "As senhas não são iguais.": t.erros.confirmacao

    };

    erros.forEach(function (elemento) {

      const original = elemento.textContent;

      if (mensagensErro[original]) {
        elemento.textContent = mensagensErro[original];
      }

    });


    // FORÇA DA SENHA

    const forcaTexto = document.querySelector(".forca-texto");

    if (forcaTexto) {

      const forcasPt = [
        "",
        "Muito fraca",
        "Fraca",
        "Média",
        "Boa",
        "Forte"
      ];

      const forcasEn = t.forca;

      const posicao = forcasPt.indexOf(forcaTexto.textContent);

      if (posicao >= 0) {
        forcaTexto.textContent = forcasEn[posicao];
      }

    }


    // STATUS

    const status = document.getElementById("cadastro-status");

    if (status && status.textContent) {

      const statusPt = {

        "Confira os campos destacados.": t.status.conferir,
        "Criando sua conta...": t.status.criando,
        "Conta criada com sucesso!": t.status.sucesso,
        "Não foi possível conectar ao servidor. Confira se o back está rodando.": t.status.servidor,
        "Não foi possível criar a conta.": t.status.falha

      };

      if (statusPt[status.textContent]) {
        status.textContent = statusPt[status.textContent];
      }

    }

  }


  // ==========================================
  // INTEGRAÇÃO COM CABEÇALHO
  // ==========================================

  window.atualizarIdiomaPagina = atualizarIdiomaCadastro;


  // ==========================================
  // OBSERVAR MENSAGENS CRIADAS PELO CADASTRO.JS
  // ==========================================

  const observador = new MutationObserver(function () {

    const idioma = localStorage.getItem(CHAVE_IDIOMA) || "pt";

    if (idioma === "en") {

      const t = traducoes.en;

      const erros = document.querySelectorAll(".erro-msg");

      const mensagens = {

        "Digite seu nome completo.": t.erros.nome,
        "Digite um e-mail válido.": t.erros.email,
        "Use uma data válida no formato dd/mm/aaaa.": t.erros.data,
        "Digite DDD e número do telefone.": t.erros.telefone,
        "Use 8+ caracteres com maiúscula, minúscula, número e símbolo.": t.erros.senha,
        "As senhas não são iguais.": t.erros.confirmacao

      };

      erros.forEach(function (elemento) {

        if (mensagens[elemento.textContent]) {
          elemento.textContent = mensagens[elemento.textContent];
        }

      });

      const status = document.getElementById("cadastro-status");

      if (status) {

        const statusMensagens = {

          "Confira os campos destacados.": t.status.conferir,
          "Criando sua conta...": t.status.criando,
          "Conta criada com sucesso!": t.status.sucesso,
          "Não foi possível conectar ao servidor. Confira se o back está rodando.": t.status.servidor,
          "Não foi possível criar a conta.": t.status.falha

        };

        if (statusMensagens[status.textContent]) {
          status.textContent = statusMensagens[status.textContent];
        }

      }

      const forca = document.querySelector(".forca-texto");

      if (forca) {

        const indice = traducoes.pt.forca.indexOf(forca.textContent);

        if (indice >= 0) {
          forca.textContent = t.forca[indice];
        }

      }

    }

  });


  observador.observe(document.body, {

    childList: true,
    subtree: true,
    characterData: true

  });


  // ==========================================
  // INICIALIZAÇÃO
  // ==========================================

  if (document.readyState === "loading") {

    document.addEventListener(
      "DOMContentLoaded",
      atualizarIdiomaCadastro
    );

  } else {

    atualizarIdiomaCadastro();

  }

})();

"use strict";

/* =====================================================
   CADASTRO WN57
   - Validação dos campos (nome, e-mail, data, telefone, senha)
   - Botão de olho nas senhas e medidor de força
   - Salva a conta no back (api.js) e envia o e-mail de boas-vindas
   - Depois de criar a conta, leva a pessoa ao Reconhecimento Facial

   Ordem dos scripts no cadastro.html:
   perfil.js, api.js, email-cadastro.js e cadastro.js
====================================================== */

// Próxima página do fluxo. CONFIRA o caminho/nome do arquivo no seu projeto:
// abra o endereço direto no navegador; se a página abrir, está certo.
const PAGINA_RECONHECIMENTO = "/html/reconhecimento-facial.html";

function reduzirFoto(arquivo) {
  return new Promise((resolve) => {
    const padrao = "data:image/svg+xml;utf8," + encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#f9c6de"/><circle cx="32" cy="25" r="11" fill="#c2185b"/><path d="M10 64c0-14 10-22 22-22s22 8 22 22z" fill="#c2185b"/></svg>');
    if (!arquivo) return resolve(padrao);
    const leitor = new FileReader();
    leitor.onload = () => {
      const img = new Image();
      img.onload = () => {
        const c = document.createElement("canvas");
        c.width = c.height = 256;
        const corte = Math.min(img.width, img.height);
        c.getContext("2d").drawImage(img, (img.width - corte) / 2, (img.height - corte) / 2, corte, corte, 0, 0, 256, 256);
        resolve(c.toDataURL("image/jpeg", 0.85));
      };
      img.onerror = () => resolve(padrao);
      img.src = leitor.result;
    };
    leitor.readAsDataURL(arquivo);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".sessao form");
  if (!form) return;

  const campos = {
    nome: document.getElementById("nome"),
    email: document.getElementById("email"),
    data: document.getElementById("date"),
    telefone: document.getElementById("telefone"),
    senha: document.getElementById("senha"),
    confirmacao: document.getElementById("confirmacao-senha")
  };

  const btnEnviar = form.querySelector(".btn-enviar");


  /* ---------- Foto de perfil (prévia) ---------- */

  const inputFoto = document.getElementById("foto");
  const previaFoto = document.getElementById("previaFoto");
  const nomeArquivo = document.getElementById("nomeArquivo");

  if (inputFoto) {
    inputFoto.addEventListener("change", () => {
      const arq = inputFoto.files[0];
      if (!arq) return;
      if (!arq.type.startsWith("image/") || arq.size > 5 * 1024 * 1024) {
        alert("Escolha uma imagem (JPG ou PNG) de até 5 MB.");
        inputFoto.value = "";
        return;
      }
      if (previaFoto) previaFoto.src = URL.createObjectURL(arq);
      if (nomeArquivo) nomeArquivo.textContent = arq.name;
    });
  }


  /* ---------- Elementos criados pelo JS ---------- */

  // Mensagem de erro embaixo de cada campo
  Object.values(campos).forEach((input) => {
    const aviso = document.createElement("span");
    aviso.className = "erro-msg";
    aviso.setAttribute("aria-live", "polite");
    input.parentElement.appendChild(aviso);
    input._aviso = aviso;
  });

  // Botão de olho nas duas senhas
  [campos.senha, campos.confirmacao].forEach((input) => {
    const caixa = document.createElement("div");
    caixa.className = "campo-senha";
    input.parentElement.insertBefore(caixa, input);
    caixa.appendChild(input);

    const olho = document.createElement("button");
    olho.type = "button";
    olho.className = "toggle-senha";
    olho.textContent = "👁";
    olho.setAttribute("aria-label", "Mostrar ou ocultar senha");
    olho.addEventListener("click", () => {
      input.type = input.type === "password" ? "text" : "password";
    });
    caixa.appendChild(olho);
  });

  // Medidor de força da senha
  const forca = document.createElement("div");
  forca.className = "forca-senha";
  forca.innerHTML =
    '<div class="forca-barra"><span></span></div><span class="forca-texto"></span>';
  campos.senha.closest(".campo-senha").insertAdjacentElement("afterend", forca);
  const forcaBarra = forca.querySelector(".forca-barra span");
  const forcaTexto = forca.querySelector(".forca-texto");

  // Mensagem geral (sucesso / erro)
  const status = document.createElement("p");
  status.id = "cadastro-status";
  status.setAttribute("aria-live", "polite");
  btnEnviar.insertAdjacentElement("afterend", status);

  // Campo isca anti-robô (pessoas não veem; robôs preenchem)
  const isca = document.createElement("input");
  isca.type = "text";
  isca.name = "website";
  isca.tabIndex = -1;
  isca.autocomplete = "off";
  isca.className = "campo-isca";
  isca.setAttribute("aria-hidden", "true");
  form.appendChild(isca);


  /* ---------- Máscaras ---------- */

  campos.data.addEventListener("input", () => {
    const n = campos.data.value.replace(/\D/g, "").slice(0, 8);
    let v = n;
    if (n.length > 4) v = n.slice(0, 2) + "/" + n.slice(2, 4) + "/" + n.slice(4);
    else if (n.length > 2) v = n.slice(0, 2) + "/" + n.slice(2);
    campos.data.value = v;
  });

  campos.telefone.addEventListener("input", () => {
    const n = campos.telefone.value.replace(/\D/g, "").slice(0, 11);
    let v = n;
    if (n.length > 7) v = "(" + n.slice(0, 2) + ") " + n.slice(2, 7) + "-" + n.slice(7);
    else if (n.length > 2) v = "(" + n.slice(0, 2) + ") " + n.slice(2);
    else if (n.length > 0) v = "(" + n;
    campos.telefone.value = v;
  });


  /* ---------- Regras de validação ---------- */

  function dataValida(texto) {
    const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(texto);
    if (!m) return false;
    const dia = +m[1], mes = +m[2], ano = +m[3];
    const d = new Date(ano, mes - 1, dia);
    const real = d.getFullYear() === ano && d.getMonth() === mes - 1 && d.getDate() === dia;
    return real && ano >= 1900 && d <= new Date();
  }

  function pontosSenha(s) {
    return [
      s.length >= 8,
      /[A-Z]/.test(s),
      /[a-z]/.test(s),
      /\d/.test(s),
      /[^A-Za-z0-9]/.test(s)
    ].filter(Boolean).length;
  }

  const regras = {
    nome: (v) =>
      v.trim().split(/\s+/).length >= 2 && v.trim().length >= 5
        ? "" : "Digite seu nome completo.",
    email: (v) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Digite um e-mail válido.",
    data: (v) => (dataValida(v) ? "" : "Use uma data válida no formato dd/mm/aaaa."),
    telefone: (v) => {
      const n = v.replace(/\D/g, "");
      return n.length === 10 || n.length === 11 ? "" : "Digite DDD e número do telefone.";
    },
    senha: (v) =>
      pontosSenha(v) === 5
        ? "" : "Use 8+ caracteres com maiúscula, minúscula, número e símbolo.",
    confirmacao: (v) =>
      v && v === campos.senha.value ? "" : "As senhas não são iguais."
  };

  function validarCampo(chave) {
    const input = campos[chave];
    const erro = regras[chave](input.value);
    input._aviso.textContent = erro;
    input.classList.toggle("input-erro", !!erro);
    input.classList.toggle("input-certo", !erro);
    return !erro;
  }

  // Valida ao sair do campo e corrige ao digitar
  Object.keys(campos).forEach((chave) => {
    campos[chave].addEventListener("blur", () => validarCampo(chave));
    campos[chave].addEventListener("input", () => {
      if (campos[chave].classList.contains("input-erro")) validarCampo(chave);
    });
  });

  // Atualiza o medidor de força
  campos.senha.addEventListener("input", () => {
    const p = pontosSenha(campos.senha.value);
    const niveis = [
      { w: "0%", cor: "transparent", t: "" },
      { w: "20%", cor: "#d93025", t: "Muito fraca" },
      { w: "40%", cor: "#e8710a", t: "Fraca" },
      { w: "60%", cor: "#f9ab00", t: "Média" },
      { w: "80%", cor: "#7cb342", t: "Boa" },
      { w: "100%", cor: "#1e8e3e", t: "Forte" }
    ];
    const n = campos.senha.value ? niveis[p] : niveis[0];
    forcaBarra.style.width = n.w;
    forcaBarra.style.background = n.cor;
    forcaTexto.textContent = n.t;
    if (campos.confirmacao.value) validarCampo("confirmacao");
  });


  /* ---------- Envio ---------- */

  function mostrarStatus(texto, tipo) {
    status.textContent = texto;
    status.className = tipo ? "status-" + tipo : "";
  }

  form.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    // Robô preencheu o campo escondido: ignora sem avisar
    if (isca.value) return;

    const resultados = Object.keys(campos).map(validarCampo);
    if (resultados.includes(false)) {
      mostrarStatus("Confira os campos destacados.", "erro");
      const primeiroErro = form.querySelector(".input-erro");
      if (primeiroErro) primeiroErro.focus();
      return;
    }

    btnEnviar.disabled = true;
    mostrarStatus("Criando sua conta...", "");

    // dd/mm/aaaa -> aaaa-mm-dd
    const [dia, mes, ano] = campos.data.value.split("/");

    const dadosApi = {
      nome: campos.nome.value.trim(),
      email: campos.email.value.trim(),
      telefone: campos.telefone.value.trim(),
      nascimento: `${ano}-${mes}-${dia}`,
      senha: campos.senha.value
    };

    // 1) Salva a conta no back-end
    let usuarioCriado = null;

    try {
      const resp = await api("/usuarios", "POST", dadosApi);
      console.log("Resposta do back:", resp);

      if (!resp.usuario) {
        mostrarStatus(resp.mensagem || resp.erro || "Não foi possível criar a conta.", "erro");
        btnEnviar.disabled = false;
        return;
      }

      usuarioCriado = resp.usuario;
    } catch (erro) {
      console.error(erro);
      mostrarStatus("Não foi possível conectar ao servidor. Confira se o back está rodando.", "erro");
      btnEnviar.disabled = false;
      return;
    }

    // 2) Guarda os dados do perfil (com a foto) no navegador
    const foto = await reduzirFoto(inputFoto ? inputFoto.files[0] : null);
    localStorage.setItem("usuario", JSON.stringify({
      nome: dadosApi.nome,
      email: dadosApi.email,
      telefone: dadosApi.telefone,
      foto: foto,
      origem: "cadastro"
    }));

    // 3) E-mail de boas-vindas (se falhar, a conta já foi criada e o fluxo segue)
    if (typeof enviarEmailCadastro === "function") {
      await Promise.race([
        enviarEmailCadastro({ nome: dadosApi.nome, email: dadosApi.email }),
        new Promise((ok) => setTimeout(() => ok({ ok: false }), 8000))
      ]);
    }

    // 4) Guarda quem acabou de se cadastrar, para o reconhecimento facial
    //    saber a qual conta pertence a verificação
    sessionStorage.setItem("cadastroUsuario", JSON.stringify(usuarioCriado));

    // 5) Segue para o Reconhecimento Facial
    mostrarStatus("Conta criada! Vamos verificar sua identidade.", "ok");
    setTimeout(() => {
      // replace: o botão "voltar" não traz a pessoa de volta ao formulário
      window.location.replace(PAGINA_RECONHECIMENTO);
    }, 1200);
  });
});
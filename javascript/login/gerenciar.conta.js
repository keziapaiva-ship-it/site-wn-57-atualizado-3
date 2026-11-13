/* =========================================================
   WN57 - Gerenciar conta
   Lê os dados do cadastro que estão salvos no navegador
   (localStorage) e deixa o usuário ver e editar.

   De onde vêm os dados:
   - "usuario"  -> usuário logado (cadastro e login com Google)
   - listas como "usuarios" -> cadastros completos (telefone, nascimento, senha)
   Os registros da mesma pessoa são juntados e, ao editar,
   a alteração é gravada em todos eles.
========================================================= */

const $ = id => document.getElementById(id);
const esc = t => String(t).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function ler(chave) {
  const bruto = localStorage.getItem(chave);
  if (bruto === null) return null;
  try { return JSON.parse(bruto); } catch (e) { return bruto; }
}
function gravar(chave, valor) {
  localStorage.setItem(chave, typeof valor === "string" ? valor : JSON.stringify(valor));
}

const semAcento = t => String(t || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();
const iguais = (a, b) => semAcento(a) === semAcento(b);
const primeiroNome = n => semAcento(n).split(/\s+/)[0];

// Páginas (esta página fica na pasta html/)
const PAGINA_LOGIN = "login/login.html";
const PAGINA_INICIAL = "inicial.html";


/* ---------- nomes dos campos (aceita variações) ---------- */

const CAMPOS = {
  nome: ["nomeCompleto", "nome_completo", "fullName", "nome", "name"],
  sobrenome: ["sobrenome", "lastName", "sobreNome"],
  telefone: ["telefone", "celular", "phone", "fone", "whatsapp"],
  email: ["email", "e-mail", "mail"],
  cpf: ["cpf"],
  nascimento: ["nascimento", "dataNascimento", "data_nascimento", "date", "dataNasc", "birthdate", "birthday"],
  foto: ["foto", "fotoPerfil", "avatar", "imagem", "img", "picture"],
  senha: ["senha", "password", "pass"]
};
const PADRAO = { nome: "nome", telefone: "telefone", email: "email", cpf: "cpf", nascimento: "nascimento", foto: "foto", senha: "senha" };

const valorDe = (x, campo) => {
  const k = CAMPOS[campo].find(k => x[k] !== undefined && x[k] !== null && String(x[k]).trim() !== "");
  return k ? String(x[k]).trim() : "";
};
const ehTeste = v => /exemplo\.com|example\.com/i.test(v || "");
const parece = x => x && typeof x === "object" && !Array.isArray(x) && (valorDe(x, "nome") || valorDe(x, "email"));


/* ---------- encontrar o cadastro no navegador ---------- */

let fontes = [];      // todos os registros da mesma pessoa
let u = {};           // visão combinada (só leitura)
let emailAntigo = "";

function coletar() {
  const todos = [];
  for (let n = 0; n < localStorage.length; n++) {
    const chave = localStorage.key(n);
    if (chave === "minhasViagens" || chave.startsWith("geo:")) continue;
    const v = ler(chave);
    if (Array.isArray(v)) v.forEach((x, i) => { if (parece(x)) todos.push({ u: x, tipo: "lista", chave, i }); });
    else if (parece(v)) todos.push({ u: v, tipo: "unica", chave });
  }
  return todos;
}

function carregar() {
  const logado = ler("usuarioLogado");
  const todos = coletar();
  if (!todos.length) return false;

  todos.forEach(f => {
    const x = f.u;
    let p = 0;
    ["nome", "email", "telefone", "nascimento", "senha", "foto"].forEach(c => { if (valorDe(x, c)) p++; });
    p += Math.min(valorDe(x, "nome").split(/\s+/).length, 4) * 0.5;
    if (f.chave === "usuario") p += 4;                                  // chave usada pelo cadastro/login
    if (ehTeste(valorDe(x, "email"))) p -= 3;                           // e-mail de teste
    if (typeof logado === "string" && logado &&
      [x.email, x.login, x.usuario, x.cpf, x.id, x.nome].some(v => iguais(v, logado))) p += 5;
    f.pontos = p;
  });
  todos.sort((a, b) => b.pontos - a.pontos);

  console.log("Cadastros encontrados no navegador:",
    todos.map(f => ({ chave: f.chave, pontos: f.pontos, dados: f.u })));

  const base = todos[0];
  const emailBase = valorDe(base.u, "email");
  const nomeBase = valorDe(base.u, "nome");

  // registros da mesma pessoa: mesmo e-mail, mesmo nome, ou mesmo primeiro nome quando há e-mail de teste
  fontes = todos.filter(f => {
    if (f === base) return true;
    const e = valorDe(f.u, "email"), n = valorDe(f.u, "nome");
    if (e && emailBase && !ehTeste(e) && !ehTeste(emailBase) && iguais(e, emailBase)) return true;
    if (n && nomeBase && iguais(n, nomeBase)) return true;
    if ((ehTeste(e) || ehTeste(emailBase)) && n && nomeBase && primeiroNome(n) === primeiroNome(nomeBase)) return true;
    return false;
  });

  u = mesclar();
  emailAntigo = valorDe(u, "email");
  return true;
}

function mesclar() {
  const m = {};
  // do menos importante para o mais importante: a fonte principal vence
  fontes.slice().reverse().forEach(f => {
    Object.keys(f.u).forEach(k => {
      const v = f.u[k];
      if (v === "" || v === null || v === undefined) return;
      if (typeof v === "string" && ehTeste(v)) return;
      m[k] = v;
    });
  });

  // usa o nome mais completo entre os registros
  let melhor = valorDe(m, "nome");
  fontes.forEach(f => {
    const n = valorDe(f.u, "nome");
    if (n && n.split(/\s+/).length > melhor.split(/\s+/).length && primeiroNome(n) === primeiroNome(melhor)) melhor = n;
  });
  if (melhor) m[CAMPOS.nome.find(k => k in m) || "nome"] = melhor;

  return m;
}

const get = campo => valorDe(u, campo);

function nomeCompleto() {
  let n = get("nome");
  const s = get("sobrenome");
  if (n && s && !n.toLowerCase().includes(s.toLowerCase())) n += " " + s;
  return n;
}


/* ---------- salvar ---------- */

function setEm(f, campo, valor) {
  const k = CAMPOS[campo].find(k => k in f.u);
  if (campo === "nome") {
    const sk = CAMPOS.sobrenome.find(k => k in f.u);
    if (k && sk) {
      const p = valor.trim().split(/\s+/);
      f.u[k] = p.shift();
      f.u[sk] = p.join(" ");
      return true;
    }
  }
  if (k) { f.u[k] = valor; return true; }
  return false;
}

function set(campo, valor) {
  let alguem = false;
  fontes.forEach(f => { if (setEm(f, campo, valor)) alguem = true; });
  if (!alguem) fontes[0].u[PADRAO[campo]] = valor;   // campo novo: vai para o registro principal
  u = mesclar();
}

function persistir() {
  fontes.forEach(f => {
    if (f.tipo === "lista") {
      const lista = ler(f.chave);
      if (Array.isArray(lista)) { lista[f.i] = f.u; gravar(f.chave, lista); }
    } else {
      gravar(f.chave, f.u);
    }
  });

  // se o login guardava só o e-mail antigo, passa a guardar o novo
  const logado = ler("usuarioLogado");
  const novo = get("email");
  if (typeof logado === "string" && emailAntigo && iguais(logado, emailAntigo) && novo) gravar("usuarioLogado", novo);
  emailAntigo = novo;
}

function aviso(texto) {
  const el = $("toast");
  el.textContent = texto;
  el.classList.add("ver");
  clearTimeout(aviso.t);
  aviso.t = setTimeout(() => el.classList.remove("ver"), 2200);
}


/* ---------- desenhar a página ---------- */

function pintarFoto(el, foto, inicial) {
  el.textContent = "";
  if (foto) {
    const img = new Image();
    img.src = foto;
    img.alt = "";
    img.onerror = () => { el.textContent = inicial; };
    el.appendChild(img);
  } else {
    el.textContent = inicial;
  }
}

const doGoogle = () => (u.origem || "").toLowerCase() === "google" && !get("senha");

function pintarTudo() {
  const nome = nomeCompleto() || "Minha conta";
  const foto = get("foto");
  const inicial = nome.charAt(0).toUpperCase();

  $("nomeCompleto").textContent = nome;
  $("nomeMini").textContent = nome.split(" ")[0].toLowerCase();
  ["fotoMini", "fotoGrande", "fotoInicio", "fotoDados"].forEach(id => pintarFoto($(id), foto, inicial));
  $("nomeInicio").textContent = nome.split(" ")[0].toLowerCase();
  $("emailInicio").textContent = get("email");

  // sugestão baseada no que falta no cadastro
  let s;
  if (!get("telefone")) s = { t: "Adicione seu telefone", d: "Com o telefone, o motorista e o suporte conseguem falar com você durante a corrida.", b: "Adicionar telefone" };
  else if (!get("foto")) s = { t: "Adicione uma foto de perfil", d: "Uma foto ajuda o motorista a reconhecer você no embarque.", b: "Adicionar foto" };
  else s = { t: "Sua conta está completa", d: "Seus dados de contato e foto estão em dia.", b: "Revisar dados" };
  $("sugestao").innerHTML = "<h3>" + s.t + "</h3><p>" + s.d + '</p><a class="btn sec" href="#dados" style="display:inline-block">' + s.b + "</a>";

  montarLista();

  if (doGoogle()) {
    $("infoSenha").textContent = "Você entra com o Google. A senha é gerenciada na sua conta Google.";
  } else {
    const dt = u.senhaAlteradaEm ? new Date(u.senhaAlteradaEm).toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" }) : "";
    $("infoSenha").innerHTML = "••••••••" + (dt ? "<br>Última alteração em: " + dt : "");
  }
}


/* ---------- dados pessoais ---------- */

const mascTel = v => {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length > 10) return d.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  if (d.length > 6) return d.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
  if (d.length > 2) return d.replace(/(\d{2})(\d+)/, "($1) $2");
  return d;
};
const mascCpf = v => v.replace(/\D/g, "").slice(0, 11)
  .replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2");
const mascData = v => v.replace(/\D/g, "").slice(0, 8)
  .replace(/(\d{2})(\d)/, "$1/$2").replace(/(\d{2})\/(\d{2})(\d)/, "$1/$2/$3");

function dataValida(v) {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(v);
  if (!m) return false;
  const d = new Date(+m[3], +m[2] - 1, +m[1]);
  return d.getDate() === +m[1] && d.getMonth() === +m[2] - 1 && d.getFullYear() >= 1900 && d <= new Date();
}
// o cadastro pode guardar a data como dd/mm/aaaa ou aaaa-mm-dd
const mostrarData = v => /^\d{4}-\d{2}-\d{2}/.test(v) ? v.slice(0, 10).split("-").reverse().join("/") : v;
const guardarData = (v, original) => /^\d{4}-\d{2}-\d{2}/.test(original) ? v.split("/").reverse().join("-") : v;

const LINHAS = [
  { c: "nome", r: "Nome", tipo: "text", ok: v => v.trim().length >= 3, erro: "Informe seu nome completo." },
  { c: "telefone", r: "Número de telefone", tipo: "tel", masc: mascTel, ok: v => [10, 11].includes(v.replace(/\D/g, "").length), erro: "Telefone inválido. Use DDD + número." },
  { c: "email", r: "E-mail", tipo: "email", ok: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v), erro: "E-mail inválido." },
  { c: "nascimento", r: "Data de nascimento", tipo: "text", opcional: true, masc: mascData, ok: dataValida, erro: "Use o formato dd/mm/aaaa." },
  { c: "cpf", r: "CPF", tipo: "text", opcional: true, masc: mascCpf, ok: v => v.replace(/\D/g, "").length === 11, erro: "CPF deve ter 11 números." }
];

function montarLista() {
  const box = $("listaDados");
  box.innerHTML = "";

  LINHAS.forEach(L => {
    let valor = L.c === "nome" ? nomeCompleto() : get(L.c);
    if (L.opcional && !valor) return;
    if (L.c === "nascimento") valor = mostrarData(valor);

    const el = document.createElement("div");
    el.className = "item";
    el.innerHTML =
      '<button type="button" aria-expanded="false"><div><b>' + L.r + '</b><span class="v">' + esc(valor || "Não informado") + '</span></div><i class="fa-solid fa-chevron-right seta"></i></button>' +
      '<div class="editor"><label for="in-' + L.c + '">' + L.r + '</label><input id="in-' + L.c + '" type="' + L.tipo + '" value="' + esc(valor) + '"><p class="msg"></p>' +
      '<div class="acoes"><button class="btn" type="button" data-salvar>Salvar</button><button class="btn sec" type="button" data-fechar>Cancelar</button></div></div>';

    const campo = el.querySelector("input");
    if (L.masc) campo.addEventListener("input", () => { campo.value = L.masc(campo.value); });

    el.querySelector(":scope>button").addEventListener("click", () => alternar(el));
    el.querySelector("[data-fechar]").addEventListener("click", () => alternar(el, false));
    el.querySelector("[data-salvar]").addEventListener("click", () => {
      const v = campo.value.trim();
      if (!L.ok(v)) { el.querySelector(".msg").textContent = L.erro; return; }
      set(L.c, L.c === "nascimento" ? guardarData(v, get("nascimento")) : v);
      persistir();
      pintarTudo();
      aviso("Dados atualizados");
    });

    box.appendChild(el);
  });
}

function alternar(el, forcar) {
  const abrir = forcar === undefined ? !el.classList.contains("aberto") : forcar;
  el.classList.toggle("aberto", abrir);
  el.querySelector(":scope>button").setAttribute("aria-expanded", abrir);
  if (abrir) { const i = el.querySelector("input"); if (i) i.focus(); }
}


/* ---------- foto ---------- */

$("trocarFoto").addEventListener("click", () => $("arquivoFoto").click());
$("arquivoFoto").addEventListener("change", e => {
  const arquivo = e.target.files[0];
  if (!arquivo) return;
  const img = new Image();
  img.onload = () => {
    const T = 320, c = document.createElement("canvas");
    c.width = c.height = T;
    const m = Math.min(img.width, img.height);
    c.getContext("2d").drawImage(img, (img.width - m) / 2, (img.height - m) / 2, m, m, 0, 0, T, T);
    try {
      set("foto", c.toDataURL("image/jpeg", 0.85));
      persistir();
      pintarTudo();
      aviso("Foto atualizada");
    } catch (erro) {
      aviso("Não foi possível salvar a foto");
    }
  };
  img.src = URL.createObjectURL(arquivo);
});


/* ---------- segurança ---------- */

const itemSenha = $("itemSenha");
itemSenha.querySelector(":scope>button").addEventListener("click", () => { if (!doGoogle()) alternar(itemSenha); });
itemSenha.querySelector("[data-fechar]").addEventListener("click", () => alternar(itemSenha, false));

$("salvarSenha").addEventListener("click", () => {
  const atual = $("senhaAtual").value, nova = $("senhaNova").value, conf = $("senhaConf").value, msg = $("msgSenha");
  const guardada = get("senha");

  if (guardada && atual !== guardada) { msg.textContent = "A senha atual está incorreta."; return; }
  // mesma regra do cadastro
  if (nova.length < 8 || !/[A-Z]/.test(nova) || !/[a-z]/.test(nova) || !/\d/.test(nova) || !/[^A-Za-z0-9]/.test(nova)) {
    msg.textContent = "Use 8 ou mais caracteres, com letra maiúscula, minúscula, número e símbolo.";
    return;
  }
  if (nova !== conf) { msg.textContent = "As senhas não conferem."; return; }

  set("senha", nova);
  const quando = new Date().toISOString();
  fontes.forEach(f => { f.u.senhaAlteradaEm = quando; });
  u = mesclar();
  persistir();
  pintarTudo();

  ["senhaAtual", "senhaNova", "senhaConf"].forEach(id => { $(id).value = ""; });
  msg.textContent = "";
  alternar(itemSenha, false);
  aviso("Senha alterada");
});

(function () {
  const ua = navigator.userAgent;
  const navegador = /Edg\//.test(ua) ? "Edge" : /OPR\//.test(ua) ? "Opera" : /Chrome\//.test(ua) ? "Chrome" : /Firefox\//.test(ua) ? "Firefox" : /Safari\//.test(ua) ? "Safari" : "Navegador";
  const sistema = /Windows/.test(ua) ? "Windows" : /Android/.test(ua) ? "Android" : /iPhone|iPad/.test(ua) ? "iOS" : /Mac/.test(ua) ? "macOS" : /Linux/.test(ua) ? "Linux" : "seu dispositivo";
  $("dispositivo").textContent = navegador + " no " + sistema;
})();

function sair() {
  localStorage.removeItem("usuario");
  localStorage.removeItem("usuarioLogado");
  window.location.href = PAGINA_LOGIN;
}
$("sair").addEventListener("click", sair);
$("sair2").addEventListener("click", sair);


/* ---------- privacidade ---------- */

$("baixar").addEventListener("click", () => {
  const dados = Object.assign({}, u);
  CAMPOS.senha.forEach(k => { delete dados[k]; });
  const arquivo = { cadastro: dados, viagens: ler("minhasViagens") || [], geradoEm: new Date().toISOString() };
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([JSON.stringify(arquivo, null, 2)], { type: "application/json" }));
  a.download = "meus-dados-wn57.json";
  a.click();
  URL.revokeObjectURL(a.href);
});

$("excluir").addEventListener("click", () => {
  if (!confirm("Excluir sua conta? Essa ação não pode ser desfeita.")) return;

  const porLista = {};
  fontes.forEach(f => {
    if (f.tipo === "lista") (porLista[f.chave] = porLista[f.chave] || []).push(f.i);
    else localStorage.removeItem(f.chave);
  });
  Object.keys(porLista).forEach(chave => {
    const lista = ler(chave);
    porLista[chave].sort((a, b) => b - a).forEach(i => lista.splice(i, 1));
    gravar(chave, lista);
  });

  ["usuario", "usuarioLogado", "minhasViagens"].forEach(k => localStorage.removeItem(k));
  window.location.href = PAGINA_INICIAL;
});


/* ---------- abas pela URL (#dados, #seguranca...) ---------- */

function mostrar() {
  const v = (location.hash || "#inicio").slice(1);
  const nome = ["inicio", "dados", "seguranca", "privacidade"].includes(v) ? v : "inicio";
  document.querySelectorAll(".vista").forEach(s => s.classList.toggle("on", s.id === "v-" + nome));
  document.querySelectorAll(".lateral a").forEach(a => a.classList.toggle("on", a.dataset.v === nome));
  window.scrollTo(0, 0);
}
window.addEventListener("hashchange", mostrar);


//menu do perfil (topo)  */

const botaoPerfil = $("perfilBtn"), menuPerfil = $("perfilMenu");
function abrirMenu(abrir) {
  menuPerfil.classList.toggle("aberto", abrir);
  botaoPerfil.setAttribute("aria-expanded", abrir);
}
botaoPerfil.addEventListener("click", e => { e.stopPropagation(); abrirMenu(!menuPerfil.classList.contains("aberto")); });
document.addEventListener("click", e => { if (!menuPerfil.contains(e.target)) abrirMenu(false); });
document.addEventListener("keydown", e => { if (e.key === "Escape") abrirMenu(false); });


/* ---------- iniciar ---------- */

if (carregar()) {
  console.log("Cadastro em uso:", u);
  pintarTudo();
  mostrar();
} else {
  $("conteudo").innerHTML =
    '<div class="vazio"><h1>Não encontramos seu cadastro</h1>' +
    '<p class="sub" style="margin-bottom:16px">Faça login ou crie sua conta para gerenciar seus dados.</p>' +
    '<a class="btn" href="' + PAGINA_LOGIN + '" style="display:inline-block">Fazer login</a></div>';
  document.querySelector(".lateral").style.display = "none";
}
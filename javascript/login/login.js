
const form = document.getElementById("loginForm");
const emailLogin = document.getElementById("email");
const senhaLogin = document.getElementById("senha");
const erro = document.getElementById("erroLogin");

const PAGINA_SOLICITAR = "/html/corrida/solicitar.html";

form.addEventListener("submit", async function (event) {
    event.preventDefault();
    erro.textContent = "";

    const email = emailLogin.value.trim();
    const senha = senhaLogin.value;

    if (!email || !senha) {
        erro.textContent = idiomaAtualLogin() === "en"
            ? "Please enter your email and password."
            : "Preencha o e-mail e a senha.";
        return;
    }

    const botao = form.querySelector("button[type='submit']");

    if (botao) botao.disabled = true;

    try {
        const resp = await api("/auth/login", "POST", {
            email,
            senha
        });

        if (!resp.token) {
            const mensagem = resp.erro || resp.mensagem ||
                "E-mail ou senha inválidos.";

            erro.textContent = traduzirMensagemLogin(mensagem);
            return;
        }

        // Foto guardada no cadastro (só vale se for do mesmo e-mail)
        const cadastro = JSON.parse(
            localStorage.getItem("usuario") || "null"
        );

        const foto =
            cadastro &&
            cadastro.email === resp.usuario.email &&
            cadastro.foto
                ? cadastro.foto
                : "https://i.pravatar.cc/150?img=12";

        localStorage.setItem("token", resp.token);

        localStorage.setItem(
            "usuarioLogado",
            JSON.stringify({
                id: resp.usuario.id,
                nome: resp.usuario.nome,
                email: resp.usuario.email,
                tipo: resp.usuario.tipo,
                foto: foto
            })
        );

        window.location.href = PAGINA_SOLICITAR;

    } catch (e) {
        console.error(e);

        erro.textContent = idiomaAtualLogin() === "en"
            ? "Could not connect to the server."
            : "Não foi possível conectar ao servidor.";

    } finally {
        if (botao) botao.disabled = false;
    }
});


/* ==========================================
   IDIOMA DA PÁGINA DE LOGIN
   ========================================== */

function idiomaAtualLogin() {
    return localStorage.getItem("wn57_idioma") || "pt";
}

const traducoesLogin = {
    "Inicial": "Home",
    "Viajar": "Ride",
    "Atividade": "Activity",
    "Entrar": "Log in",
    "Ajuda": "Help",
    "Cadastre-se": "Sign up",

    "Seu próximo destino começa aqui.": "Your next destination starts here.",
    "Peça sua viagem, acompanhe o trajeto e chegue com tranquilidade.": "Request your ride, follow your route and arrive with peace of mind.",

    "Bem-vindo de volta": "Welcome back",
    "Entre para continuar sua viagem.": "Sign in to continue your journey.",

    "E-mail": "Email",
    "Senha": "Password",
    "Digite sua senha": "Enter your password",
    "Esqueci minha senha": "Forgot my password?",
    "Não tem conta?": "Don't have an account?",
    "Criar conta": "Create account",

    "Mostrar senha": "Show password",
    "Ocultar senha": "Hide password",

    "Preencha o e-mail e a senha.": "Please enter your email and password.",
    "E-mail ou senha inválidos.": "Invalid email or password.",
    "Não foi possível conectar ao servidor.": "Could not connect to the server.",
    "Entrando...": "Signing in..."
};

const traducoesLoginInversas = {};

Object.entries(traducoesLogin).forEach(([pt, en]) => {
    traducoesLoginInversas[en] = pt;
});

function traduzirMensagemLogin(texto) {
    const idioma = idiomaAtualLogin();
    const original = traducoesLoginInversas[texto] || texto;

    return idioma === "en"
        ? (traducoesLogin[original] || original)
        : original;
}

function traduzirElementoLogin(elemento, idioma) {
    if (!elemento) return;

    const walker = document.createTreeWalker(
        elemento,
        NodeFilter.SHOW_TEXT
    );

    const nos = [];
    let no;

    while ((no = walker.nextNode())) {
        const pai = no.parentElement;

        if (
            pai &&
            ["SCRIPT", "STYLE", "NOSCRIPT"].includes(pai.tagName)
        ) {
            continue;
        }

        if (no.nodeValue.trim()) {
            nos.push(no);
        }
    }

    nos.forEach(texto => {
        const atual = texto.nodeValue;
        const inicio = atual.match(/^\s*/)[0];
        const fim = atual.match(/\s*$/)[0];
        const limpo = atual.trim();

        const original = traducoesLoginInversas[limpo] || limpo;

        const resultado = idioma === "en"
            ? (traducoesLogin[original] || original)
            : original;

        texto.nodeValue = inicio + resultado + fim;
    });

    elemento.querySelectorAll(
        "[placeholder], [aria-label], [title]"
    ).forEach(campo => {
        ["placeholder", "aria-label", "title"].forEach(atributo => {
            if (!campo.hasAttribute(atributo)) return;

            const chave = "loginOriginal" + atributo;

            if (!campo.dataset[chave]) {
                const atual = campo.getAttribute(atributo).trim();

                campo.dataset[chave] =
                    traducoesLoginInversas[atual] || atual;
            }

            const original = campo.dataset[chave];

            campo.setAttribute(
                atributo,
                idioma === "en"
                    ? (traducoesLogin[original] || original)
                    : original
            );
        });
    });
}

function atualizarIdiomaPagina() {
    const idioma = idiomaAtualLogin();

    traduzirElementoLogin(document.body, idioma);

    document.documentElement.lang =
        idioma === "en" ? "en" : "pt-BR";
}

// O cabeçalho compartilhado chama esta função ao trocar o idioma.
window.atualizarIdiomaPagina = atualizarIdiomaPagina;

// Atualiza mensagens de erro e textos inseridos dinamicamente.
const observadorIdiomaLogin = new MutationObserver(mutacoes => {
    const idioma = idiomaAtualLogin();

    mutacoes.forEach(mutacao => {
        if (mutacao.type === "characterData") {
            const texto = mutacao.target;
            const atual = texto.nodeValue;

            if (atual && atual.trim()) {
                const inicio = atual.match(/^\s*/)[0];
                const fim = atual.match(/\s*$/)[0];
                const limpo = atual.trim();
                const original = traducoesLoginInversas[limpo] || limpo;

                texto.nodeValue = inicio +
                    (idioma === "en"
                        ? (traducoesLogin[original] || original)
                        : original) +
                    fim;
            }
        }

        mutacao.addedNodes.forEach(adicionado => {
            if (adicionado.nodeType === Node.TEXT_NODE) {
                const atual = adicionado.nodeValue;

                if (atual && atual.trim()) {
                    const inicio = atual.match(/^\s*/)[0];
                    const fim = atual.match(/\s*$/)[0];
                    const limpo = atual.trim();
                    const original = traducoesLoginInversas[limpo] || limpo;

                    adicionado.nodeValue = inicio +
                        (idioma === "en"
                            ? (traducoesLogin[original] || original)
                            : original) +
                        fim;
                }
            }

            if (adicionado.nodeType === Node.ELEMENT_NODE) {
                traduzirElementoLogin(adicionado, idioma);
            }
        });
    });
});

function iniciarTraducaoLogin() {
    atualizarIdiomaPagina();

    observadorIdiomaLogin.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
    });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciarTraducaoLogin);
} else {
    iniciarTraducaoLogin();
}

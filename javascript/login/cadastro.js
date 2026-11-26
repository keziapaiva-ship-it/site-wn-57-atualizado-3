(function () {
    "use strict";
    const CHAVE_IDIOMA = "wn57_idioma";

    function idiomaAtual() {
        return localStorage.getItem(CHAVE_IDIOMA) === "en" ? "en" : "pt";
    }

    // ---------- Textos da página ----------
    // [seletor, português, inglês]
    const TEXTOS = [
        [".sessao-topo h1", "Crie sua conta", "Create your account"],
        [".sessao-topo p", "Preencha seus dados para viajar com a WN57.", "Fill in your details to ride with WN57."],
        [".divisor span", "ou cadastre-se com seus dados", "or sign up with your details"],

        [".foto-titulo", "Foto de perfil", "Profile photo"],
        [".foto-dica", "JPG ou PNG, até 5 MB. Ela aparece no seu perfil.", "JPG or PNG, up to 5 MB. It appears on your profile."],
        [".foto-botao", "Escolher foto", "Choose photo"],

        ["label[for='nome']", "Nome completo", "Full name"],
        ["label[for='email']", "E-mail", "Email"],
        ["label[for='date']", "Data de nascimento", "Date of birth"],
        ["label[for='telefone']", "Telefone", "Phone"],
        ["label[for='senha']", "Senha", "Password"],
        ["label[for='confirmacao-senha']", "Confirmar senha", "Confirm password"],

        [".dica-senha",
            "Use 8 ou mais caracteres, com letra maiúscula, minúscula, número e símbolo.",
            "Use 8 or more characters, with an uppercase letter, a lowercase letter, a number and a symbol."],

        [".btn-enviar", "Criar conta", "Create account"]
    ];

    // ---------- Placeholders ----------
    // [seletor, português, inglês]
    const PLACEHOLDERS = [
        ["#nome", "Ex.: Maria da Silva", "E.g.: Mary Smith"],
        ["#email", "voce@email.com", "you@email.com"],
        ["#date", "dd/mm/aaaa", "dd/mm/yyyy"],
        ["#telefone", "(11) 99999-9999", "(11) 99999-9999"],
        ["#senha", "Crie uma senha", "Create a password"],
        ["#confirmacao-senha", "Repita a senha", "Repeat the password"]
    ];

    // ---------- Nome do arquivo escolhido ----------
    const SEM_ARQUIVO = {
        pt: "Nenhum arquivo escolhido",
        en: "No file chosen"
    };

    function definirTexto(seletor, texto) {
        document.querySelectorAll(seletor).forEach(function (el) {
            el.textContent = texto;
        });
    }

    // ---------- Frases com link no meio ----------
    // Os links (href) são mantidos; só o texto muda.

    function traduzirTermos(en) {
        const termos = document.querySelector(".termos");
        if (!termos) return;

        const links = termos.querySelectorAll("a");
        const hrefTermos = links[0] ? links[0].getAttribute("href") : "#";
        const hrefPrivacidade = links[1] ? links[1].getAttribute("href") : "#";

        termos.innerHTML = en
            ? 'By creating an account, you agree to the <a href="' + hrefTermos + '">Terms of use</a> and the <a href="' + hrefPrivacidade + '">Privacy policy</a>.'
            : 'Ao criar a conta, você concorda com os <a href="' + hrefTermos + '">Termos de uso</a> e a <a href="' + hrefPrivacidade + '">Política de privacidade</a>.';
    }

    function traduzirJaTemConta(en) {
        const bloco = document.querySelector(".ja-tem-conta");
        if (!bloco) return;

        const link = bloco.querySelector("a");
        const href = link ? link.getAttribute("href") : "/html/login/login.html";

        bloco.innerHTML = en
            ? 'Already have an account? <a href="' + href + '">Log in</a>'
            : 'Já tem uma conta? <a href="' + href + '">Entrar</a>';
    }

    // ---------- Botão "Inscrever-se com o Google" ----------
    // O texto desse botão é desenhado pelo Google. Para mudar o idioma
    // dele é preciso desenhar o botão de novo, informando o "locale".

    function desenharGoogle(en) {
        const area = document.querySelector(".g_id_signin");

        if (
            !area ||
            !window.google ||
            !window.google.accounts ||
            !window.google.accounts.id
        ) {
            return false;
        }

        try {
            area.innerHTML = "";

            window.google.accounts.id.renderButton(area, {
                type: "standard",
                size: "large",
                theme: "outline",
                text: "signup_with",
                shape: "pill",
                width: 400,
                locale: en ? "en" : "pt-BR"
            });

            return true;
        } catch (e) {
            return false;
        }
    }

    let tentativasGoogle = null;

    function atualizarGoogle(en) {
        if (tentativasGoogle) {
            clearInterval(tentativasGoogle);
            tentativasGoogle = null;
        }

        if (desenharGoogle(en)) return;

        // O script do Google pode ainda estar carregando: tenta por até ~10 s.
        let tentativas = 0;

        tentativasGoogle = setInterval(function () {
            tentativas++;

            if (desenharGoogle(en) || tentativas >= 20) {
                clearInterval(tentativasGoogle);
                tentativasGoogle = null;
            }
        }, 500);
    }

    // ---------- Função principal ----------

    function atualizarIdiomaPagina() {
        const en = idiomaAtual() === "en";
        const i = en ? 2 : 1;

        document.documentElement.lang = en ? "en" : "pt-BR";
        document.title = en ? "Sign up - WN57" : "Criar conta - WN57";

        TEXTOS.forEach(function (item) {
            definirTexto(item[0], item[i]);
        });

        PLACEHOLDERS.forEach(function (item) {
            const campo = document.querySelector(item[0]);
            if (campo) campo.setAttribute("placeholder", item[i]);
        });

        traduzirTermos(en);
        traduzirJaTemConta(en);

        // "Nenhum arquivo escolhido": só troca se ainda não escolheram foto.
        const nomeArquivo = document.getElementById("nomeArquivo");

        if (nomeArquivo) {
            const texto = nomeArquivo.textContent.trim();

            if (texto === SEM_ARQUIVO.pt || texto === SEM_ARQUIVO.en) {
                nomeArquivo.textContent = SEM_ARQUIVO[en ? "en" : "pt"];
            }
        }

        const previa = document.getElementById("previaFoto");
        if (previa) previa.alt = en ? "Photo preview" : "Prévia da foto";

        atualizarGoogle(en);
    }

    // O perfil.js chama esta função quando a pessoa clica no botão de idioma.
    window.atualizarIdiomaPagina = atualizarIdiomaPagina;

    // Outra aba mudou o idioma.
    window.addEventListener("storage", function (evento) {
        if (evento.key === CHAVE_IDIOMA) atualizarIdiomaPagina();
    });

    // Ao abrir a página, já aplica o idioma salvo.
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", atualizarIdiomaPagina);
    } else {
        atualizarIdiomaPagina();
    }
})();

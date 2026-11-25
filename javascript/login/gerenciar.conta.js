
/* =====================================================
   TRADUÇÃO DA PÁGINA GERENCIAR CONTA
   ===================================================== */

(() => {
    "use strict";

    const traducoes = {
        "Página inicial": "Home",
        "Dados pessoais": "Personal information",
        "Segurança": "Security",
        "Privacidade e dados": "Privacy and data",
        "Informações pessoais": "Personal information",
        "Alterar foto": "Change photo",
        "Sugestões": "Suggestions",
        "Fazer login na WN57": "Sign in to WN57",
        "Senha": "Password",
        "Senha atual": "Current password",
        "Nova senha (mínimo 6 caracteres)": "New password (minimum 6 characters)",
        "Confirmar nova senha": "Confirm new password",
        "Salvar senha": "Save password",
        "Cancelar": "Cancel",
        "Atividade de login": "Login activity",
        "Dispositivo em que você está conectado agora.": "Device you are currently signed in on.",
        "Seu login atual": "Your current login",
        "Página da plataforma WN57": "WN57 platform page",
        "Sair da conta": "Log out",
        "Baixar meus dados": "Download my data",
        "Receba um arquivo com seus dados de cadastro e o histórico de viagens. A senha nunca é incluída.": "Receive a file containing your registration details and trip history. Your password is never included.",
        "Baixar arquivo": "Download file",
        "Excluir conta": "Delete account",
        "Remove seu cadastro deste navegador e encerra sua sessão. Essa ação não pode ser desfeita.": "Removes your registration from this browser and ends your session. This action cannot be undone.",
        "Excluir minha conta": "Delete my account",
        "Adicione seu telefone": "Add your phone number",
        "Com o telefone, o motorista e o suporte conseguem falar com você durante a corrida.": "With your phone number, the driver and support team can contact you during the ride.",
        "Adicionar telefone": "Add phone number",
        "Adicione uma foto de perfil": "Add a profile photo",
        "Uma foto ajuda o motorista a reconhecer você no embarque.": "A photo helps the driver recognize you at pickup.",
        "Adicionar foto": "Add photo",
        "Sua conta está completa": "Your account is complete",
        "Seus dados de contato e foto estão em dia.": "Your contact details and photo are up to date.",
        "Revisar dados": "Review details",
        "Nome": "Name",
        "Número de telefone": "Phone number",
        "E-mail": "Email",
        "Data de nascimento": "Date of birth",
        "CPF": "CPF",
        "Não informado": "Not provided",
        "Salvar": "Save",
        "Informe seu nome completo.": "Enter your full name.",
        "Telefone inválido. Use DDD + número.": "Invalid phone number. Include area code and number.",
        "E-mail inválido.": "Invalid email.",
        "Use o formato dd/mm/aaaa.": "Use the format dd/mm/yyyy.",
        "CPF deve ter 11 números.": "CPF must contain 11 digits.",
        "Dados atualizados": "Details updated",
        "Foto atualizada": "Photo updated",
        "Não foi possível salvar a foto": "Could not save the photo",
        "Selecione uma imagem válida.": "Select a valid image.",
        "Não foi possível abrir a imagem.": "Could not open the image.",
        "Você entra com o Google. A senha é gerenciada na sua conta Google.": "You sign in with Google. Your password is managed by your Google account.",
        "Última alteração em:": "Last changed on:",
        "A senha atual está incorreta.": "The current password is incorrect.",
        "Use 8 ou mais caracteres, com letra maiúscula, minúscula, número e símbolo.": "Use at least 8 characters, including uppercase and lowercase letters, a number, and a symbol.",
        "As senhas não conferem.": "The passwords do not match.",
        "Senha alterada": "Password changed",
        "Não encontramos seu cadastro": "We couldn't find your account",
        "Faça login ou crie sua conta para gerenciar seus dados.": "Sign in or create an account to manage your details.",
        "Fazer login": "Sign in",
        "Minha conta": "My account",
        "Navegador": "Browser",
        "Excluir sua conta? Essa ação não pode ser desfeita.": "Delete your account? This action cannot be undone."
    };

    const inversas = {};

    Object.entries(traducoes).forEach(([pt, en]) => {
        inversas[en] = pt;
    });

    function idiomaAtual() {
        return localStorage.getItem("wn57_idioma") || "pt";
    }

    function textoBase(texto) {
        const limpo = texto.trim();
        return inversas[limpo] || limpo;
    }

    function traduzirNo(no, idioma) {
        if (!no.nodeValue || !no.nodeValue.trim()) return;

        const atual = no.nodeValue;
        const inicio = atual.match(/^\s*/)[0];
        const fim = atual.match(/\s*$/)[0];
        const base = textoBase(atual);

        const resultado = idioma === "en"
            ? (traducoes[base] || base)
            : base;

        no.nodeValue = inicio + resultado + fim;
    }

    function traduzirElemento(elemento, idioma) {
        if (!elemento) return;

        const walker = document.createTreeWalker(
            elemento,
            NodeFilter.SHOW_TEXT
        );

        const textos = [];
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
                textos.push(no);
            }
        }

        textos.forEach(noTexto => traduzirNo(noTexto, idioma));

        elemento.querySelectorAll("[placeholder], [title]").forEach(el => {
            ["placeholder", "title"].forEach(atributo => {
                if (!el.hasAttribute(atributo)) return;

                const chave = "original_" + atributo;

                if (!el.dataset[chave]) {
                    el.dataset[chave] = textoBase(
                        el.getAttribute(atributo)
                    );
                }

                const original = el.dataset[chave];

                el.setAttribute(
                    atributo,
                    idioma === "en"
                        ? (traducoes[original] || original)
                        : original
                );
            });
        });
    }

    function atualizarIdiomaPagina() {
        const idioma = idiomaAtual();

        traduzirElemento(document.body, idioma);

        document.documentElement.lang =
            idioma === "en" ? "en" : "pt-BR";
    }

    window.atualizarIdiomaPagina = atualizarIdiomaPagina;

    // O cabeçalho já controla a troca e chama a função acima.
    // Não adicionamos outro clique para evitar alternância duplicada.

    const observador = new MutationObserver(mutacoes => {
        const idioma = idiomaAtual();

        mutacoes.forEach(mutacao => {
            mutacao.addedNodes.forEach(noAdicionado => {
                if (noAdicionado.nodeType === Node.TEXT_NODE) {
                    traduzirNo(noAdicionado, idioma);
                } else if (noAdicionado.nodeType === Node.ELEMENT_NODE) {
                    traduzirElemento(noAdicionado, idioma);
                }
            });
        });
    });

    function iniciarTraducao() {
        atualizarIdiomaPagina();

        observador.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", iniciarTraducao);
    } else {
        iniciarTraducao();
    }
})();

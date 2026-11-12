
// ======================================================
// WN57 - PÁGINA DE AJUDA: MINHA CONTA
// Arquivo: conta.ajuda.js
// ======================================================

document.addEventListener("DOMContentLoaded", () => {

    // Elementos da página
    const perguntas = document.querySelectorAll(".perguntas details");

    const botaoExpandir = document.getElementById("expandirTodas");
    const botaoRecolher = document.getElementById("recolherTodas");
    const botaoTopo = document.getElementById("voltarTopo");

    const botaoIdioma = document.getElementById("botaoIdioma");
    const textoIdioma = document.getElementById("textoIdioma");
    const idiomaRodape = document.getElementById("idiomaRodape");


    // ======================================================
    // TRADUÇÕES
    // ======================================================

    const traducoes = {

        "pt-BR": {
            login: "Fazer Login",
            cadastro: "Cadastre-se",

            titulo: "Minha conta",
            descricao: "Veja como gerenciar seus dados e acessar sua conta WN57.",

            faq: "Perguntas frequentes",
            expandir: "Expandir todas",
            recolher: "Recolher todas",

            pergunta1: "Como crio uma conta?",
            resposta1: "Acesse a página de cadastro e preencha os campos solicitados com informações corretas.",

            pergunta2: "Não consigo entrar na minha conta. O que faço?",
            resposta2: "Confira seu e-mail ou usuário e sua senha. Se o problema continuar, procure o suporte.",

            pergunta3: "Como atualizo meus dados?",
            resposta3: "Acesse a área de perfil, caso esteja disponível, e procure a opção de editar suas informações.",

            pergunta4: "Esqueci minha senha. Como recupero?",
            resposta4: "Use a opção de recuperação de senha na tela de login, se estiver disponível, ou entre em contato com o suporte.",

            pergunta5: "Como protejo minha conta?",
            resposta5: "Use uma senha forte, não a compartilhe e encerre a sessão em dispositivos que outras pessoas utilizam.",

            ajudaTitulo: "Precisa de mais ajuda?",
            ajudaDescricao: "O suporte pode orientar você sobre o acesso à conta.",
            suporte: "Acessar suporte",

            fraseRodape: "Estamos aqui para ajudar você.",
            linkSuporte: "Suporte",
            linkCadastro: "Cadastre-se",

            privacidade: "Privacidade",
            termos: "Termos",
            acessibilidade: "Acessibilidade",

            idiomaRodape: "Português (Brasil)"
        },


        "en": {
            login: "Log In",
            cadastro: "Sign Up",

            titulo: "My account",
            descricao: "Learn how to manage your information and access your WN57 account.",

            faq: "Frequently asked questions",
            expandir: "Expand all",
            recolher: "Collapse all",

            pergunta1: "How do I create an account?",
            resposta1: "Go to the registration page and fill in the required fields with accurate information.",

            pergunta2: "I can't access my account. What should I do?",
            resposta2: "Check your email or username and password. If the problem continues, contact support.",

            pergunta3: "How do I update my information?",
            resposta3: "Access your profile area, if available, and look for the option to edit your information.",

            pergunta4: "I forgot my password. How can I recover it?",
            resposta4: "Use the password recovery option on the login screen, if available, or contact support.",

            pergunta5: "How can I protect my account?",
            resposta5: "Use a strong password, do not share it, and log out of devices used by other people.",

            ajudaTitulo: "Need more help?",
            ajudaDescricao: "Our support team can guide you through accessing your account.",
            suporte: "Access support",

            fraseRodape: "We are here to help you.",
            linkSuporte: "Support",
            linkCadastro: "Sign Up",

            privacidade: "Privacy",
            termos: "Terms",
            acessibilidade: "Accessibility",

            idiomaRodape: "English"
        }

    };


    // ======================================================
    // ALTERAR IDIOMA
    // ======================================================

    function alterarIdioma(idioma) {

        const textos = traducoes[idioma];

        if (!textos) return;

        document.querySelectorAll("[data-i18n]").forEach(elemento => {

            const chave = elemento.getAttribute("data-i18n");

            if (textos[chave]) {
                elemento.textContent = textos[chave];
            }

        });

        // Atualiza o idioma do documento
        document.documentElement.lang = idioma;

        // Atualiza somente o texto do botão, sem mudar seu estilo
        if (textoIdioma) {
            textoIdioma.textContent =
                idioma === "pt-BR" ? "PT-BR" : "EN";
        }

        // Atualiza o idioma no rodapé
        if (idiomaRodape) {
            idiomaRodape.textContent = textos.idiomaRodape;
        }

        // Atualiza o título da aba
        document.title = idioma === "pt-BR"
            ? "Minha conta • WN57"
            : "My account • WN57";

        // Salva a preferência no navegador
        localStorage.setItem("idiomaWN57", idioma);

    }


    // Recupera o idioma salvo
    let idiomaAtual = localStorage.getItem("idiomaWN57") || "pt-BR";

    alterarIdioma(idiomaAtual);


    // ======================================================
    // BOTÃO DE IDIOMA
    // ======================================================

    if (botaoIdioma) {

        botaoIdioma.addEventListener("click", (event) => {

            event.preventDefault();

            idiomaAtual = idiomaAtual === "pt-BR" ? "en" : "pt-BR";

            alterarIdioma(idiomaAtual);

        });

    }


    // ======================================================
    // EXPANDIR TODAS AS PERGUNTAS
    // ======================================================

    if (botaoExpandir) {

        botaoExpandir.addEventListener("click", () => {

            perguntas.forEach(pergunta => {
                pergunta.open = true;
            });

        });

    }


    // ======================================================
    // RECOLHER TODAS AS PERGUNTAS
    // ======================================================

    if (botaoRecolher) {

        botaoRecolher.addEventListener("click", () => {

            perguntas.forEach(pergunta => {
                pergunta.open = false;
            });

        });

    }


    // ======================================================
    // VOLTAR AO TOPO
    // ======================================================

    if (botaoTopo) {

        botaoTopo.addEventListener("click", () => {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        });

    }


    // ======================================================
    // EXIBIR BOTÃO AO ROLAR A PÁGINA
    // ======================================================

    window.addEventListener("scroll", () => {

        if (!botaoTopo) return;

        if (window.scrollY > 300) {
            botaoTopo.classList.add("ativo");
        } else {
            botaoTopo.classList.remove("ativo");
        }

    });

});


document.addEventListener("DOMContentLoaded", function () {

    // ELEMENTOS
    const botaoIdioma = document.querySelector(".idioma");
    const perguntas = document.querySelectorAll(".perguntas details");

    const expandir = document.getElementById("expandirTodas");
    const recolher = document.getElementById("recolherTodas");
    const voltarTopo = document.getElementById("voltarTopo");

    let idiomaAtual = "pt";

    // TRADUÇÕES
    const traducoes = {

        pt: {
            voltar: "Voltar para a Central de Ajuda",
            titulo: "Motoristas",
            descricao: "Orientações para dúvidas relacionadas ao motorista e à viagem.",
            faq: "Perguntas frequentes",

            expandir: "Expandir todas",
            recolher: "Recolher todas",

            contato: "Precisa de mais ajuda?",
            contatoDescricao: "Conte ao suporte o que aconteceu para receber orientação.",
            contatoBotao: "Acessar suporte",

            login: "Fazer Login",
            cadastro: "Cadastre-se",
            central: "Central de Ajuda",
            suporte: "Suporte",

            rodapeMarca: "Estamos aqui para ajudar você.",
            rodapeCentral: "Acesse a Central de Ajuda",
            privacidade: "Privacidade",
            termos: "Termos",
            acessibilidade: "Acessibilidade",
            idiomaRodape: "Português (Brasil)",
            cidade: "Curitiba",
            direitos: "© 2026 WN57",

            perguntas: [
                [
                    "Como confiro os dados do motorista?",
                    "Antes de entrar no veículo, confira os dados e as informações exibidas no aplicativo ou site."
                ],
                [
                    "O motorista ainda não chegou. O que faço?",
                    "Confira o local de embarque e as informações da corrida. Se necessário, utilize os canais de contato disponíveis."
                ],
                [
                    "Como relato um problema com o motorista?",
                    "Registre o ocorrido com informações objetivas e envie o relato pelo suporte da WN57."
                ],
                [
                    "Posso avaliar o motorista?",
                    "Se houver uma opção de avaliação após a viagem, use-a para compartilhar sua experiência de forma respeitosa."
                ]
            ]
        },

        en: {
            voltar: "Back to Help Center",
            titulo: "Drivers",
            descricao: "Guidance for questions related to the driver and your trip.",
            faq: "Frequently Asked Questions",

            expandir: "Expand all",
            recolher: "Collapse all",

            contato: "Need more help?",
            contatoDescricao: "Tell our support team what happened to receive guidance.",
            contatoBotao: "Access support",

            login: "Log In",
            cadastro: "Sign Up",
            central: "Help Center",
            suporte: "Support",

            rodapeMarca: "We are here to help you.",
            rodapeCentral: "Visit the Help Center",
            privacidade: "Privacy",
            termos: "Terms",
            acessibilidade: "Accessibility",
            idiomaRodape: "English",
            cidade: "Curitiba",
            direitos: "© 2026 WN57",

            perguntas: [
                [
                    "How can I check the driver's details?",
                    "Before getting into the vehicle, check the driver's details and the information displayed on the app or website."
                ],
                [
                    "The driver has not arrived yet. What should I do?",
                    "Check the pickup location and ride information. If necessary, use the available contact channels."
                ],
                [
                    "How can I report a problem with the driver?",
                    "Describe what happened clearly and submit your report through WN57 support."
                ],
                [
                    "Can I rate the driver?",
                    "If a rating option is available after the trip, use it to share your experience respectfully."
                ]
            ]
        }

    };

    // EXPANDIR TODAS
    if (expandir) {

        expandir.addEventListener("click", function () {

            perguntas.forEach(function (pergunta) {
                pergunta.open = true;
            });

        });

    }

    // RECOLHER TODAS
    if (recolher) {

        recolher.addEventListener("click", function () {

            perguntas.forEach(function (pergunta) {
                pergunta.open = false;
            });

        });

    }

    // ATUALIZAR IDIOMA
    function atualizarIdioma() {

        const t = traducoes[idiomaAtual];

        document.documentElement.lang =
            idiomaAtual === "pt" ? "pt-BR" : "en";

        // BOTÃO DE IDIOMA
        if (botaoIdioma) {
            botaoIdioma.textContent =
                idiomaAtual === "pt" ? "🌐 PT-BR" : "🌐 EN";
        }

        // CABEÇALHO
        const menu = document.querySelectorAll(".menu a");

        if (menu[0]) menu[0].textContent = t.central;
        if (menu[1]) menu[1].textContent = t.suporte;

        const login = document.querySelector(".btn-login");
        const cadastro = document.querySelector(".btn-cadastro");

        if (login) login.textContent = t.login;
        if (cadastro) cadastro.textContent = t.cadastro;

        // VOLTAR
        const voltar = document.querySelector(".voltar");

        if (voltar) {
            voltar.innerHTML =
                `<i class="fa-solid fa-arrow-left"></i> ${t.voltar}`;
        }

        // HERO
        const titulo = document.querySelector(".hero h1");
        const descricao = document.querySelector(".hero p");

        if (titulo) titulo.textContent = t.titulo;
        if (descricao) descricao.textContent = t.descricao;

        // PERGUNTAS
        const tituloFaq = document.querySelector(".faq h2");

        if (tituloFaq) tituloFaq.textContent = t.faq;

        perguntas.forEach(function (item, index) {

            if (!t.perguntas[index]) return;

            const pergunta = item.querySelector("summary");
            const resposta = item.querySelector("p");

            if (pergunta) {
                pergunta.textContent = t.perguntas[index][0];
            }

            if (resposta) {
                resposta.textContent = t.perguntas[index][1];
            }

        });

        // CONTROLES
        if (expandir) {
            expandir.innerHTML =
                `<i class="fa-solid fa-plus"></i> ${t.expandir}`;
        }

        if (recolher) {
            recolher.innerHTML =
                `<i class="fa-solid fa-minus"></i> ${t.recolher}`;
        }

        // CONTATO
        const contatoTitulo = document.querySelector(".contato h2");
        const contatoDescricao = document.querySelector(".contato p");
        const contatoBotao = document.querySelector(".btn-contato");

        if (contatoTitulo) contatoTitulo.textContent = t.contato;
        if (contatoDescricao) contatoDescricao.textContent = t.contatoDescricao;
        if (contatoBotao) contatoBotao.textContent = t.contatoBotao;

        // RODAPÉ
        const marca = document.querySelector(".rodape-marca p");
        const linksRodape = document.querySelectorAll(".rodape-menu a");
        const linksInferiores = document.querySelectorAll(".rodape-links a");
        const local = document.querySelectorAll(".rodape-local span");
        const direitos = document.querySelector(".copyright");

        if (marca) marca.textContent = t.rodapeMarca;

        if (linksRodape[0]) linksRodape[0].textContent = t.rodapeCentral;
        if (linksRodape[1]) linksRodape[1].textContent = t.suporte;
        if (linksRodape[2]) linksRodape[2].textContent = t.cadastro;

        if (linksInferiores[0]) linksInferiores[0].textContent = t.privacidade;
        if (linksInferiores[1]) linksInferiores[1].textContent = t.termos;
        if (linksInferiores[2]) linksInferiores[2].textContent = t.acessibilidade;

        if (local[0]) {
            local[0].innerHTML =
                `<i class="fa-solid fa-globe"></i> ${t.idiomaRodape}`;
        }

        if (local[2]) {
            local[2].innerHTML =
                `<i class="fa-solid fa-location-dot"></i> ${t.cidade}`;
        }

        if (direitos) direitos.textContent = t.direitos;

    }

    // TROCAR PORTUGUÊS E INGLÊS
    if (botaoIdioma) {

        botaoIdioma.addEventListener("click", function (event) {

            event.preventDefault();

            idiomaAtual = idiomaAtual === "pt" ? "en" : "pt";

            atualizarIdioma();

        });

    } else {

        console.error("WN57: botão de idioma não encontrado.");

    }

    // VOLTAR AO TOPO
    if (voltarTopo) {

        voltarTopo.addEventListener("click", function () {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        });

    }

    // INICIAR EM PORTUGUÊS
    atualizarIdioma();

});

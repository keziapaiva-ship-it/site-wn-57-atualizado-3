
document.addEventListener("DOMContentLoaded", function () {

    const botaoIdioma = document.querySelector(".idioma");
    const perguntas = document.querySelectorAll(".perguntas details");
    const expandir = document.getElementById("expandirTodas");
    const recolher = document.getElementById("recolherTodas");

    let idiomaAtual = "pt";

    const traducoes = {
        pt: {
            voltar: "← Voltar para a Central de Ajuda",
            titulo: "Pagamentos",
            descricao: "Tire suas dúvidas sobre formas de pagamento, cobranças e reembolsos das suas corridas.",
            faq: "Perguntas frequentes",
            expandir: "Expandir todas",
            recolher: "Recolher todas",
            contato: "Precisa de mais ajuda?",
            contatoDescricao: "Se ainda tiver dúvidas sobre pagamentos, nossa equipe de suporte está disponível para ajudar.",
            contatoBotao: "Entrar em contato",
            login: "Fazer Login",
            cadastro: "Cadastre-se",
            central: "Central de Ajuda",
            suporte: "Suporte",
            rodape: "© 2026 WN57 • Todos os direitos reservados",

            perguntas: [
                ["Quais formas de pagamento posso utilizar?", "Você pode utilizar as formas de pagamento disponibilizadas na plataforma, como PIX, dinheiro ou cartão, conforme as opções habilitadas na sua conta."],
                ["Como faço para pagar uma corrida com PIX?", "Antes de solicitar a corrida, selecione PIX entre as formas de pagamento disponíveis. Siga as instruções exibidas na tela para concluir o pagamento."],
                ["Posso pagar minha corrida em dinheiro?", "Sim, caso a opção esteja disponível. Selecione dinheiro como forma de pagamento antes de confirmar a solicitação da corrida."],
                ["Como cadastro ou altero meu cartão?", "Acesse sua conta e procure a área de pagamentos para verificar se é possível adicionar um cartão ou atualizar os dados de um cartão cadastrado."],
                ["O que faço se fui cobrado duas vezes?", "Confira o histórico de pagamentos e os detalhes da corrida. Se identificar uma possível cobrança duplicada, entre em contato com o suporte da WN57 para solicitar uma verificação."],
                ["Como solicito o reembolso de uma corrida?", "Acesse o suporte da WN57, informe os dados da corrida e explique o motivo da solicitação. A equipe poderá verificar o caso e orientar você sobre os próximos passos."],
                ["O que acontece se meu pagamento com cartão for recusado?", "Verifique os dados do cartão, o limite disponível e se o banco autorizou a transação. Se o problema continuar, tente outra forma de pagamento disponível."],
                ["Como consulto o valor que paguei por uma corrida?", "Consulte o histórico ou os detalhes da corrida na sua conta, caso essa funcionalidade esteja disponível, para conferir o valor registrado."]
            ]
        },

        en: {
            voltar: "← Back to Help Center",
            titulo: "Payments",
            descricao: "Find answers to your questions about payment methods, charges and ride refunds.",
            faq: "Frequently Asked Questions",
            expandir: "Expand all",
            recolher: "Collapse all",
            contato: "Need more help?",
            contatoDescricao: "If you still have questions about payments, our support team is available to help.",
            contatoBotao: "Contact Support",
            login: "Log In",
            cadastro: "Sign Up",
            central: "Help Center",
            suporte: "Support",
            rodape: "© 2026 WN57 • All rights reserved",

            perguntas: [
                ["What payment methods can I use?", "You can use the payment methods available on the platform, such as PIX, cash or card, depending on the options enabled in your account."],
                ["How do I pay for a ride with PIX?", "Before requesting your ride, select PIX from the available payment methods. Follow the instructions displayed on the screen to complete the payment."],
                ["Can I pay for my ride in cash?", "Yes, if the option is available. Select cash as your payment method before confirming your ride request."],
                ["How do I add or change my card?", "Access your account and look for the payments section to check whether you can add a card or update the details of a registered card."],
                ["What should I do if I was charged twice?", "Check your payment history and ride details. If you identify a possible duplicate charge, contact WN57 support to request a review."],
                ["How do I request a ride refund?", "Contact WN57 support, provide your ride details and explain the reason for your request. The team can review your case and guide you through the next steps."],
                ["What happens if my card payment is declined?", "Check your card details, available limit and whether your bank authorized the transaction. If the problem continues, try another available payment method."],
                ["How can I check how much I paid for a ride?", "Check your account's history or ride details, if this feature is available, to see the recorded amount."]
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

        if (botaoIdioma) {
            botaoIdioma.textContent =
                idiomaAtual === "pt" ? "🌐 PT-BR" : "🌐 EN";
        }

        const menu = document.querySelectorAll(".menu a");

        if (menu[0]) menu[0].textContent = t.central;
        if (menu[1]) menu[1].textContent = t.suporte;

        const login = document.querySelector(".btn-login");
        const cadastro = document.querySelector(".btn-cadastro");

        if (login) login.textContent = t.login;
        if (cadastro) cadastro.textContent = t.cadastro;

        const voltar = document.querySelector(".voltar");

        if (voltar) {
            voltar.innerHTML =
                `<i class="fa-solid fa-arrow-left"></i> ${t.voltar}`;
        }

        const titulo = document.querySelector(".hero h1");
        const descricao = document.querySelector(".hero p");
        const tituloFaq = document.querySelector(".faq h2");

        if (titulo) titulo.textContent = t.titulo;
        if (descricao) descricao.textContent = t.descricao;
        if (tituloFaq) tituloFaq.textContent = t.faq;

        // TRADUZIR PERGUNTAS
        perguntas.forEach(function (item, index) {

            if (!t.perguntas[index]) return;

            const summary = item.querySelector("summary");
            const resposta = item.querySelector("p");

            if (summary) {
                summary.textContent = t.perguntas[index][0];
            }

            if (resposta) {
                resposta.textContent = t.perguntas[index][1];
            }

        });

        if (expandir) {
            expandir.innerHTML =
                `<i class="fa-solid fa-plus"></i> ${t.expandir}`;
        }

        if (recolher) {
            recolher.innerHTML =
                `<i class="fa-solid fa-minus"></i> ${t.recolher}`;
        }

        const contatoTitulo = document.querySelector(".contato h2");
        const contatoDescricao = document.querySelector(".contato p");
        const contatoBotao = document.querySelector(".btn-contato");
        const rodape = document.querySelector(".rodape p");

        if (contatoTitulo) contatoTitulo.textContent = t.contato;
        if (contatoDescricao) contatoDescricao.textContent = t.contatoDescricao;
        if (contatoBotao) contatoBotao.textContent = t.contatoBotao;
        if (rodape) rodape.textContent = t.rodape;
    }

    // CLIQUE PARA TROCAR PORTUGUÊS E INGLÊS
    if (botaoIdioma) {

        botaoIdioma.addEventListener("click", function (event) {

            event.preventDefault();

            idiomaAtual = idiomaAtual === "pt" ? "en" : "pt";

            atualizarIdioma();

        });

    } else {
        console.error("WN57: botão de idioma não encontrado.");
    }

    // APLICAR IDIOMA INICIAL
    atualizarIdioma();

});

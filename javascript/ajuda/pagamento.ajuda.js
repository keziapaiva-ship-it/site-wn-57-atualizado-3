document.addEventListener("DOMContentLoaded", function () {

    const perguntas = document.querySelectorAll(".perguntas details");
    const expandir = document.getElementById("expandirTodas");
    const recolher = document.getElementById("recolherTodas");
    const voltarTopo = document.getElementById("voltarTopo");

    // Botões de idioma aceitos (o cabeçalho é gerado pelo cabecalho.js e pode usar qualquer um destes)
    const SELETOR_IDIOMA = "#btnIdioma, .idioma-btn, .idioma";

    let idiomaAtual = "pt";

    const traducoes = {
        pt: {
            voltar: "Voltar para a Central de Ajuda",
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

            // rodapé
            rodapeFrase: "Estamos aqui para ajudar você.",
            rodapeMenu: ["Suporte", "Cadastre-se"],
            rodapeLinks: ["Privacidade", "Termos", "Acessibilidade"],
            rodapeIdioma: "Português (Brasil)",
            voltarTopo: "Voltar ao topo",

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
            voltar: "Back to Help Center",
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

            // rodapé
            rodapeFrase: "We're here to help you.",
            rodapeMenu: ["Support", "Sign Up"],
            rodapeLinks: ["Privacy", "Terms", "Accessibility"],
            rodapeIdioma: "English",
            voltarTopo: "Back to top",

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

    // Troca só o texto de um elemento (se ele existir)
    function texto(seletor, valor) {
        const el = document.querySelector(seletor);
        if (el) el.textContent = valor;
    }

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

    // VOLTAR AO TOPO
    if (voltarTopo) {
        voltarTopo.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // ---------- MENU / CABEÇALHO ----------
    // O cabeçalho é gerado pelo cabecalho.js, então em vez de depender de classes
    // específicas, traduzimos qualquer texto conhecido que esteja dentro dele.
    // Para um item novo do menu, basta acrescentar um par [português, inglês].
    const MENU = [
        ["Inicial", "Home"],
        ["Viajar", "Ride"],
        ["Atividade", "Activity"],
        ["Entrar", "Log In"],
        ["Fazer login", "Log In"],
        ["Fazer Login", "Log In"],
        ["Cadastre-se", "Sign Up"],
        ["Ajuda", "Help"],
        ["Central de Ajuda", "Help Center"],
        ["Suporte", "Support"],
        ["Perfil", "Profile"],
        ["Minha conta", "My account"],
        ["Meu perfil", "My profile"],
        ["Sair", "Log out"]
    ];

    // texto em português (minúsculo) → { pt, en }
    const dicionarioMenu = {};
    MENU.forEach(function (par) {
        dicionarioMenu[par[0].toLowerCase()] = { pt: par[0], en: par[1] };
    });

    // guarda o texto original (português) de cada item já traduzido
    const originaisMenu = new WeakMap();

    function traduzirCabecalho() {

        const raizes = document.querySelectorAll(
            "header, nav, .menu, .cabecalho, #cabecalho, #usuarioArea"
        );

        raizes.forEach(function (raiz) {

            // o rodapé tem o próprio <nav> e é traduzido à parte
            if (raiz.closest(".rodape")) return;

            const andador = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT);
            let no;

            while ((no = andador.nextNode())) {

                const pai = no.parentElement;
                if (!pai) continue;

                // não mexe no botão de idioma nem no que estiver marcado para não traduzir
                if (pai.closest(SELETOR_IDIOMA) || pai.closest("[data-no-i18n]")) continue;

                // texto em português guardado na primeira vez que o item é visto
                let base = originaisMenu.get(no);

                if (base === undefined) {
                    if (!dicionarioMenu[no.nodeValue.trim().toLowerCase()]) continue;
                    base = no.nodeValue;
                    originaisMenu.set(no, base);
                }

                const entrada = dicionarioMenu[base.trim().toLowerCase()];
                if (!entrada) continue;

                // mantém os espaços e quebras de linha ao redor do texto
                no.nodeValue = base.replace(base.trim(), idiomaAtual === "pt" ? base.trim() : entrada.en);
            }
        });
    }

    // ATUALIZAR IDIOMA
    function atualizarIdioma() {

        const t = traducoes[idiomaAtual];

        document.documentElement.lang = idiomaAtual === "pt" ? "pt-BR" : "en";

        // Botão de idioma (procurado de novo a cada troca, caso o cabeçalho tenha sido recriado)
        const botaoIdioma = document.querySelector(SELETOR_IDIOMA);
        if (botaoIdioma) {
            botaoIdioma.textContent = idiomaAtual === "pt" ? "🌐 PT-BR" : "🌐 EN";
        }

        // Cabeçalho (menu + botões de login/cadastro)
        traduzirCabecalho();

        const voltar = document.querySelector(".voltar");
        if (voltar) {
            voltar.innerHTML = `<i class="fa-solid fa-arrow-left"></i> ${t.voltar}`;
        }

        // Apresentação
        texto(".hero h1", t.titulo);
        texto(".hero p", t.descricao);
        texto(".faq h2", t.faq);

        // Perguntas
        perguntas.forEach(function (item, index) {
            if (!t.perguntas[index]) return;

            const summary = item.querySelector("summary");
            const resposta = item.querySelector("p");

            if (summary) summary.textContent = t.perguntas[index][0];
            if (resposta) resposta.textContent = t.perguntas[index][1];
        });

        if (expandir) {
            expandir.innerHTML = `<i class="fa-solid fa-plus"></i> ${t.expandir}`;
        }

        if (recolher) {
            recolher.innerHTML = `<i class="fa-solid fa-minus"></i> ${t.recolher}`;
        }

        // Contato
        texto(".contato h2", t.contato);
        texto(".contato p", t.contatoDescricao);
        texto(".btn-contato", t.contatoBotao);

        // Rodapé (antes ".rodape p" apagava a frase da marca com o copyright)
        texto(".rodape-marca p", t.rodapeFrase);

        document.querySelectorAll(".rodape-menu a").forEach(function (link, i) {
            if (t.rodapeMenu[i]) link.textContent = t.rodapeMenu[i];
        });

        document.querySelectorAll(".rodape-links a").forEach(function (link, i) {
            if (t.rodapeLinks[i]) link.textContent = t.rodapeLinks[i];
        });

        // o ícone fica dentro do <span>, então só o texto é trocado
        const idiomaRodape = document.querySelector(".rodape-local .fa-globe");
        if (idiomaRodape && idiomaRodape.parentElement) {
            idiomaRodape.parentElement.innerHTML =
                `<i class="fa-solid fa-globe"></i> ${t.rodapeIdioma}`;
        }

        if (voltarTopo) {
            voltarTopo.setAttribute("aria-label", t.voltarTopo);
        }
    }

    // CLIQUE PARA TROCAR PORTUGUÊS E INGLÊS
    // Delegação no document: funciona mesmo que o cabeçalho seja criado depois
    document.addEventListener("click", function (event) {

        const alvo = event.target.closest(SELETOR_IDIOMA);
        if (!alvo) return;

        event.preventDefault();

        idiomaAtual = idiomaAtual === "pt" ? "en" : "pt";
        atualizarIdioma();
    });

    // APLICAR IDIOMA INICIAL
    atualizarIdioma();

});
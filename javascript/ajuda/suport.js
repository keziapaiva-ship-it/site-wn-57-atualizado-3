const API_URL = "";

// Botões de idioma aceitos (o cabeçalho é gerado pelo cabecalho.js e pode usar qualquer um destes)
const SELETOR_IDIOMA = "#btnIdioma, #trocarIdioma, .idioma-btn, .idioma";

let idioma = "pt";

// =====================================================
// TEXTOS DA PÁGINA E DO CHAT (português / inglês)
// As chaves "titulo", "lead", "a1"... ligam com data-i18n="..." no HTML.
// =====================================================

const TEXTOS = {
    pt: {
        docTitulo: "Suporte • WN57",
        titulo: "Tire sua dúvida agora, sem esperar atendente.",
        lead: "A assistente de suporte da WN57 responde na hora as perguntas mais comuns dos clientes. Teste ao lado: clique em uma pergunta ou escreva a sua.",
        aceitaTitulo: "O que a assistente responde",
        a1: "Como pedir, cancelar e acompanhar uma corrida",
        a2: "Formas de pagamento, cobranças e reembolso",
        a3: "Diferença entre WN Black, Comfort e Econômico",
        a4: "Segurança, objetos esquecidos e problemas com o app",
        a5: "Login, cadastro e senha",
        videoTitulo: "🎬 Como usar a WN57",
        videoTexto: "Assista ao vídeo para conhecer melhor a plataforma e aprender a utilizar nossos serviços.",
        naoTitulo: "O que ela não faz",
        n1: "Não responde assuntos fora da WN57",
        n2: "Não pede senha nem dados de cartão",
        n3: "Não altera corridas nem cobranças: encaminha para o suporte humano",
        online: "Online • responde em segundos",
        enviar: "Enviar",
        note: "Esta é uma demonstração com respostas de exemplo. Para ligar à IA de verdade, preencha <code>API_URL</code> no script desta página com o endereço do seu servidor.",
        rodape: "© 2026 WN57 • Todos os direitos reservados",

        placeholder: "Escreva sua dúvida...",
        ariaCampo: "Sua dúvida",
        microfoneTitulo: "Perguntar por áudio",
        placeholderVoz: "Escreva ou fale sua dúvida...",
        ouvindo: "Estou ouvindo...",
        erroVoz: "Não foi possível reconhecer sua voz. Verifique a permissão do microfone.",
        semVoz: "Reconhecimento de voz não disponível neste navegador.",
        vozLang: "pt-BR",

        boasVindas: "Olá! Seja bem-vindo(a) ao atendimento da WN57! 💗\n\nSou sua assistente virtual e posso ajudar com corridas, pagamentos, cadastro, segurança e muito mais.\n\nO que você precisa resolver hoje?",
        fora: "Não consegui identificar sua dúvida. 😕\n\nTente escrever de outra maneira ou escolha uma das opções de atendimento.",
        erroChat: "Não consegui responder agora. Tente novamente em instantes.",
        wppTexto: "📱 WhatsApp WN57: (41) 99754-7644",
        wppBotao: "💬 Conversar pelo WhatsApp",

        sugestoes: [
            "🚗 Solicitar uma corrida",
            "❌ Cancelar corrida",
            "📍 Acompanhar motorista",
            "💳 Formas de pagamento",
            "💰 Cobrança e reembolso",
            "🚘 Categorias WN57",
            "👤 Cadastro e login",
            "🔑 Recuperar senha",
            "🛡️ Segurança",
            "🎒 Objeto esquecido",
            "📱 Problemas no aplicativo",
            "🙋 Falar com atendente"
        ],

        seguimento: [
            "🚗 Corridas",
            "💳 Pagamentos",
            "👤 Minha conta",
            "🙋 Falar com atendente"
        ],

        botaoIdioma: "PT-BR"
    },

    en: {
        docTitulo: "Support • WN57",
        titulo: "Get your answer now, no waiting for an agent.",
        lead: "WN57's support assistant instantly answers customers' most common questions. Try it here: tap a question or type your own.",
        aceitaTitulo: "What the assistant answers",
        a1: "How to request, cancel and track a ride",
        a2: "Payment methods, charges and refunds",
        a3: "The difference between WN Black, Comfort and Economy",
        a4: "Safety, lost items and app problems",
        a5: "Log in, sign up and password",
        videoTitulo: "🎬 How to use WN57",
        videoTexto: "Watch the video to get to know the platform and learn how to use our services.",
        naoTitulo: "What it does not do",
        n1: "It does not answer topics unrelated to WN57",
        n2: "It never asks for your password or card details",
        n3: "It does not change rides or charges: it refers you to human support",
        online: "Online • answers in seconds",
        enviar: "Send",
        note: "This is a demo with sample answers. To connect a real AI, set <code>API_URL</code> in this page's script to your server address.",
        rodape: "© 2026 WN57 • All rights reserved",

        placeholder: "Type your question...",
        ariaCampo: "Your question",
        microfoneTitulo: "Ask by voice",
        placeholderVoz: "Type or say your question...",
        ouvindo: "Listening...",
        erroVoz: "We couldn't recognize your voice. Check the microphone permission.",
        semVoz: "Voice recognition is not available in this browser.",
        vozLang: "en-US",

        boasVindas: "Hello! Welcome to WN57 support! 💗\n\nI'm your virtual assistant and I can help with rides, payments, sign up, safety and more.\n\nWhat do you need help with today?",
        fora: "I couldn't understand your question. 😕\n\nTry rephrasing it or pick one of the support options.",
        erroChat: "I couldn't answer right now. Please try again in a moment.",
        wppTexto: "📱 WN57 WhatsApp: (41) 99754-7644",
        wppBotao: "💬 Chat on WhatsApp",

        sugestoes: [
            "🚗 Request a ride",
            "❌ Cancel a ride",
            "📍 Track my driver",
            "💳 Payment methods",
            "💰 Charges and refunds",
            "🚘 WN57 categories",
            "👤 Sign up and log in",
            "🔑 Reset password",
            "🛡️ Safety",
            "🎒 Lost item",
            "📱 App problems",
            "🙋 Talk to an agent"
        ],

        seguimento: [
            "🚗 Rides",
            "💳 Payments",
            "👤 My account",
            "🙋 Talk to an agent"
        ],

        botaoIdioma: "EN"
    }
};

// =====================================================
// BASE DE PERGUNTAS E RESPOSTAS
// A busca usa a PRIMEIRA regra que combinar, então regras específicas
// ficam antes das genéricas (corridas, pagamentos, conta).
// =====================================================

const FAQ = {

    pt: [
        {
            k: /\b(oi|olá|ola|bom dia|boa tarde|boa noite|tudo bem)\b/i,
            r: "Olá! Seja bem-vindo(a) ao suporte WN57! 💗\n\nComo podemos ajudar você hoje?"
        },
        {
            // vem antes das demais: "whatsapp" contém "app" e cairia na regra do aplicativo
            k: /atendente|suporte humano|pessoa real|falar com alguem|falar com uma pessoa|whatsapp/i,
            r: "Claro! Vou te passar o contato do nosso atendimento humano. 💗"
        },
        {
            k: /pedir corrida|solicitar corrida|chamar carro|chamar motorista|fazer uma viagem|nova corrida/i,
            r: "Para solicitar uma corrida:\n\n1. Abra a opção Viajar.\n2. Informe seu endereço de origem.\n3. Digite seu destino.\n4. Escolha a categoria desejada.\n5. Selecione a forma de pagamento.\n6. Confira os dados e confirme a solicitação."
        },
        {
            k: /cancel|desistir da corrida/i,
            r: "Para cancelar uma corrida, acesse Atividade, selecione a corrida e procure a opção de cancelamento. Confira as condições apresentadas antes de confirmar."
        },
        {
            k: /acompanhar|localizar|onde está|onde esta|posição do motorista|posicao do motorista|mapa da corrida|ver minha corrida/i,
            r: "Para acompanhar sua corrida, acesse Atividade e abra a viagem solicitada. Consulte as informações disponíveis sobre o motorista e o andamento da viagem."
        },
        {
            k: /não encontro motorista|nao encontro motorista|sem motorista|ninguém aceitou|ninguem aceitou/i,
            r: "Se nenhum motorista aceitar sua solicitação, confira se os endereços estão corretos e tente novamente. A disponibilidade pode variar conforme a região."
        },
        {
            k: /atras|demor|motorista não chegou|motorista nao chegou|esperando motorista/i,
            r: "Se o motorista estiver demorando, consulte o andamento da corrida em Atividade. Se necessário, utilize a Central de Ajuda."
        },
        {
            k: /endereço|endereco|local de partida|origem|destino|mudar endereço|alterar endereço/i,
            r: "Confira os endereços de origem e destino antes de confirmar a corrida. Se precisar alterar alguma informação, verifique as opções disponíveis na tela da solicitação."
        },
        {
            k: /gps|localização|localizacao/i,
            r: "Verifique se a localização do dispositivo está ativada e se o navegador possui permissão para acessar sua localização. Confira também sua conexão com a internet."
        },
        {
            k: /\bpix\b/i,
            r: "A WN57 possui a opção de pagamento por PIX. Selecione PIX na etapa de escolha da forma de pagamento e confira as instruções apresentadas."
        },
        {
            k: /cartão|cartao|crédito|credito|débito|debito/i,
            r: "Para utilizar cartão, selecione essa opção na etapa de pagamento, caso esteja disponível."
        },
        {
            k: /dinheiro|espécie|especie|pagar em mãos|pagar em maos/i,
            r: "Se a opção estiver disponível, selecione dinheiro como forma de pagamento antes de confirmar sua corrida."
        },
        {
            k: /cobrança|cobranca|cobrou|valor diferente|valor errado|pagamento duplicado/i,
            r: "Se você identificou uma cobrança incorreta, consulte a corrida em Atividade e procure a opção de ajuda. Informe o ocorrido ao suporte humano para análise."
        },
        {
            k: /reembolso|devolver dinheiro|estorno/i,
            r: "Para solicitar a análise de um reembolso, acesse Atividade, selecione a corrida e procure a opção de ajuda."
        },
        {
            k: /black|comfort|econômico|economico|categorias|tipos de corrida|diferença entre categorias/i,
            r: "A WN57 possui três categorias:\n\n🚗 WN Econômico: alternativa mais acessível.\n\n✨ WN Comfort: opção voltada ao conforto.\n\n👑 WN Black: experiência premium."
        },
        {
            k: /cadastro|cadastrar|criar conta|nova conta|registrar/i,
            r: "Para criar sua conta, clique em Cadastre-se no menu. Preencha as informações solicitadas e siga as instruções da página."
        },
        {
            k: /login|entrar na conta|acessar conta|não consigo entrar|nao consigo entrar/i,
            r: "Para acessar sua conta, clique em Fazer login e informe seus dados cadastrados. Se o problema continuar, procure a opção de recuperação de acesso."
        },
        {
            k: /senha|esqueci minha senha|recuperar senha|alterar senha/i,
            r: "Se esqueceu sua senha, procure a opção de recuperação na tela de login e siga as instruções apresentadas."
        },
        {
            k: /alterar dados|mudar nome|mudar email|mudar e-mail|telefone|atualizar cadastro|editar perfil/i,
            r: "Para atualizar seus dados, acesse as opções de perfil ou gerenciamento de conta, caso estejam disponíveis."
        },
        {
            k: /excluir conta|apagar conta|deletar conta|encerrar conta/i,
            r: "Para solicitar o encerramento da conta, procure as opções de gerenciamento de conta ou entre em contato com o suporte humano."
        },
        {
            k: /segurança|seguranca|perigo|ameaça|ameaca|problema durante a viagem/i,
            r: "Sua segurança é importante. Em uma situação de perigo imediato, procure ajuda dos serviços de emergência locais. Para relatar um problema relacionado à viagem, utilize os canais de suporte da WN57."
        },
        {
            k: /motorista|condutor|quem vai me buscar/i,
            r: "As informações disponíveis sobre o motorista podem ser consultadas nos detalhes da corrida, após a solicitação ser atendida."
        },
        {
            k: /esqueci|esquecido|objeto|perdi|perdido|bolsa|celular|carteira/i,
            r: "Esqueceu um objeto durante a viagem? Acesse Atividade, selecione a corrida e procure a opção de ajuda relacionada a objetos esquecidos."
        },
        {
            k: /avaliar|avaliação|avaliacao|nota|estrela|classificar motorista/i,
            r: "Se a opção de avaliação estiver disponível após a corrida, você poderá registrar sua experiência."
        },
        {
            k: /reclamação|reclamacao|reclamar|denunciar|relatar problema/i,
            r: "Para registrar uma reclamação, acesse a Central de Ajuda da WN57 e procure a opção Relatar um problema."
        },
        {
            k: /aplicativo|app|não abre|nao abre|travando|travou|erro|bug|não funciona|nao funciona/i,
            r: "Se o aplicativo apresentar problemas:\n\n1. Confira sua conexão com a internet.\n2. Atualize a página ou aplicativo.\n3. Confira as permissões de localização.\n4. Tente novamente.\n\nSe continuar, entre em contato com o suporte."
        },
        {
            k: /internet|conexão|conexao|sem sinal|offline/i,
            r: "Verifique sua conexão com a internet. Uma conexão instável pode impedir o carregamento do mapa e das informações da corrida."
        },

        // REGRAS GENÉRICAS (ficam depois das específicas)
        {
            k: /\bcorridas?\b|\bviagens?\b/i,
            r: "Sobre corridas, posso ajudar com:\n\n• Como solicitar uma corrida\n• Cancelar ou acompanhar uma viagem\n• Motorista demorando ou sem motorista\n\nEscolha uma opção ou escreva sua dúvida."
        },
        {
            k: /\bpagamentos?\b|\bpagar\b|forma de pagamento|formas de pagamento/i,
            r: "A WN57 aceita as formas de pagamento habilitadas na sua conta, como PIX, cartão ou dinheiro. Posso explicar cada uma, ou ajudar com cobranças e reembolsos. Qual é a sua dúvida?"
        },
        {
            k: /\bconta\b|\bperfil\b/i,
            r: "Sobre sua conta, posso ajudar com cadastro, login, recuperação de senha e atualização de dados. Qual é a sua dúvida?"
        },

        {
            k: /obrigado|obrigada|valeu|agradeço|agradeco/i,
            r: "Por nada! 💗 A WN57 agradece seu contato. Sempre que precisar, estaremos aqui para ajudar!"
        },
        {
            k: /tchau|até mais|ate mais|adeus/i,
            r: "Até mais! Obrigado por entrar em contato com a WN57. Tenha uma ótima viagem! 💗"
        }
    ],

    en: [
        {
            k: /\b(hi|hello|hey|good morning|good afternoon|good evening)\b/i,
            r: "Hello! Welcome to WN57 support! 💗\n\nHow can we help you today?"
        },
        {
            // vem antes das demais: "whatsapp" contém "app" e cairia na regra do aplicativo
            k: /agent|human|real person|talk to someone|speak to someone|whatsapp/i,
            r: "Of course! Here is how to reach our human support team. 💗"
        },
        {
            k: /request a ride|book a ride|order a ride|new ride|call a car|call a driver|get a ride/i,
            r: "To request a ride:\n\n1. Open the Ride option.\n2. Enter your pickup address.\n3. Type your destination.\n4. Choose the category you want.\n5. Select the payment method.\n6. Review the details and confirm your request."
        },
        {
            k: /cancel/i,
            r: "To cancel a ride, go to Activity, select the ride and look for the cancel option. Check the conditions shown before you confirm."
        },
        {
            k: /track|follow my|where is|driver location|see my ride/i,
            r: "To track your ride, go to Activity and open the ride you requested. Check the available driver information and the trip progress."
        },
        {
            k: /no driver|nobody accepted|no one accepted|can.?t find a driver/i,
            r: "If no driver accepts your request, check that the addresses are correct and try again. Availability may vary by region."
        },
        {
            k: /\blate\b|delay|taking long|hasn.?t arrived|has not arrived|waiting for (a |the )?driver/i,
            r: "If your driver is taking a while, check the ride progress in Activity. If needed, use the Help Center."
        },
        {
            k: /address|pickup|drop.?off|destination|origin/i,
            r: "Check the pickup and destination addresses before confirming the ride. If you need to change something, look at the options available on the request screen."
        },
        {
            k: /gps|location/i,
            r: "Check that your device location is turned on and that your browser has permission to access it. Also check your internet connection."
        },
        {
            k: /\bpix\b/i,
            r: "WN57 offers payment by PIX. Select PIX at the payment step and follow the instructions shown."
        },
        {
            k: /\bcard\b|credit|debit/i,
            r: "To pay by card, select that option at the payment step, if it is available."
        },
        {
            k: /\bcash\b/i,
            r: "If the option is available, select cash as the payment method before confirming your ride."
        },
        {
            k: /charge|charged|wrong amount|different amount|duplicate/i,
            r: "If you noticed an incorrect charge, open the ride in Activity and look for the help option. Tell human support what happened so they can review it."
        },
        {
            k: /refund|money back|chargeback/i,
            r: "To request a refund review, go to Activity, select the ride and look for the help option."
        },
        {
            k: /black|comfort|economy|categories|ride types|difference between/i,
            r: "WN57 has three categories:\n\n🚗 WN Economy: the most affordable option.\n\n✨ WN Comfort: focused on comfort.\n\n👑 WN Black: the premium experience."
        },
        {
            k: /sign ?up|register|create (an )?account|new account/i,
            r: "To create your account, click Sign Up in the menu. Fill in the requested information and follow the instructions on the page."
        },
        {
            k: /log ?in|sign ?in|access (my )?account/i,
            r: "To access your account, click Log in and enter your registered details. If the problem continues, look for the account recovery option."
        },
        {
            k: /password|reset/i,
            r: "If you forgot your password, look for the recovery option on the login screen and follow the instructions."
        },
        {
            k: /update (my )?(data|details|profile)|change (my )?(name|email|phone)|edit profile|phone number/i,
            r: "To update your details, open your profile or account management options, if available."
        },
        {
            k: /delete (my )?account|close (my )?account|remove (my )?account/i,
            r: "To ask for your account to be closed, look for the account management options or contact human support."
        },
        {
            k: /safety|\bsafe\b|unsafe|danger|threat/i,
            r: "Your safety matters. In immediate danger, contact your local emergency services. To report a problem related to a trip, use the WN57 support channels."
        },
        {
            k: /driver|who is picking me up/i,
            r: "Driver information can be found in the ride details once your request has been accepted."
        },
        {
            k: /lost|forgot|left behind|\bitem\b|\bbag\b|\bphone\b|wallet/i,
            r: "Left something behind during your trip? Go to Activity, select the ride and look for the help option about lost items."
        },
        {
            k: /\brate\b|rating|\bstars?\b|review/i,
            r: "If the rating option is available after the ride, you can share your experience."
        },
        {
            k: /complain|report/i,
            r: "To file a complaint, open the WN57 Help Center and look for the Report a problem option."
        },
        {
            k: /\bapp\b|not opening|crash|\bbug\b|error|not working|doesn.?t work/i,
            r: "If the app is having problems:\n\n1. Check your internet connection.\n2. Refresh the page or app.\n3. Check the location permissions.\n4. Try again.\n\nIf it continues, contact support."
        },
        {
            k: /internet|connection|offline|no signal/i,
            r: "Check your internet connection. An unstable connection can stop the map and ride information from loading."
        },

        // GENERIC RULES (after the specific ones)
        {
            k: /\brides?\b|\btrips?\b/i,
            r: "About rides, I can help with:\n\n• How to request a ride\n• Cancelling or tracking a trip\n• A late driver or no driver found\n\nPick an option or type your question."
        },
        {
            k: /\bpayments?\b|\bpay\b|payment methods?/i,
            r: "WN57 accepts the payment methods enabled on your account, such as PIX, card or cash. I can explain each one, or help with charges and refunds. What would you like to know?"
        },
        {
            k: /\baccount\b|\bprofile\b/i,
            r: "About your account, I can help with sign up, log in, password recovery and updating your details. What would you like to know?"
        },

        {
            k: /thank|thanks/i,
            r: "You're welcome! 💗 WN57 thanks you for getting in touch. We're here whenever you need us!"
        },
        {
            k: /\bbye\b|goodbye|see you/i,
            r: "See you! Thanks for contacting WN57. Have a great ride! 💗"
        }
    ]
};

const NUMERO_WHATSAPP = "5541997547644";

const msgs = document.getElementById("msgs");
const campo = document.getElementById("campo");
const form = document.getElementById("form");
const chips = document.getElementById("chips");
const botaoMicrofone = document.getElementById("microfone");

let ocupado = false;
let historico = [];

const reduz = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

const espera = ms => new Promise(resolve => {
    setTimeout(resolve, reduz ? 0 : ms);
});

// =====================================================
// MENU / CABEÇALHO
// O cabeçalho é gerado pelo cabecalho.js, então em vez de depender de classes
// específicas, traduzimos qualquer texto conhecido que esteja dentro dele.
// Para um item novo do menu, basta acrescentar um par [português, inglês].
// =====================================================

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
    ["Sobre-nós", "About us"],
    ["Perfil", "Profile"],
    ["Minha conta", "My account"],
    ["Meu perfil", "My profile"],
    ["Sair", "Log out"]
];

// texto em português (minúsculo) → { pt, en }
const dicionarioMenu = {};
MENU.forEach(par => {
    dicionarioMenu[par[0].toLowerCase()] = { pt: par[0], en: par[1] };
});

// guarda o texto original (português) de cada item já traduzido
const originaisMenu = new WeakMap();

function traduzirCabecalho() {

    const raizes = document.querySelectorAll(
        "header, nav, .menu, .cabecalho, #cabecalho, #usuarioArea"
    );

    raizes.forEach(raiz => {

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
            no.nodeValue = base.replace(base.trim(), idioma === "pt" ? base.trim() : entrada.en);
        }
    });
}

// =====================================================
// CHAT
// =====================================================

// ADICIONAR MENSAGEM
function add(texto, tipo) {
    const div = document.createElement("div");

    div.className = "msg " + tipo;
    div.textContent = texto;

    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;

    return div;
}

// BOTÃO DE WHATSAPP
function mostrarWhatsApp() {
    const area = document.createElement("div");
    area.className = "msg ia";

    const texto = document.createElement("p");
    texto.textContent = TEXTOS[idioma].wppTexto;

    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "chip";
    botao.textContent = TEXTOS[idioma].wppBotao;

    botao.addEventListener("click", () => {
        window.open(
            `https://wa.me/${NUMERO_WHATSAPP}`,
            "_blank",
            "noopener,noreferrer"
        );
    });

    area.appendChild(texto);
    area.appendChild(botao);

    msgs.appendChild(area);
    msgs.scrollTop = msgs.scrollHeight;
}

// ANIMAÇÃO DE DIGITAÇÃO
function digitando() {
    const div = document.createElement("div");
    div.className = "msg ia typing";

    for (let i = 0; i < 3; i++) {
        const span = document.createElement("span");
        div.appendChild(span);
    }

    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;

    return div;
}

// MOSTRAR SUGESTÕES
function mostrarSugestoes(lista) {
    chips.innerHTML = "";

    lista.forEach(texto => {
        const botao = document.createElement("button");

        botao.type = "button";
        botao.className = "chip";
        botao.textContent = texto;

        botao.addEventListener("click", () => {
            perguntar(texto);
        });

        chips.appendChild(botao);
    });
}

// RESPONDER
async function responder(texto) {
    if (API_URL) {
        const resposta = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                messages: historico,
                language: idioma
            })
        });

        if (!resposta.ok) {
            throw new Error("Erro na conexão com o servidor.");
        }

        const dados = await resposta.json();
        return dados.reply || TEXTOS[idioma].fora;
    }

    await espera(800);

    const pergunta = texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

    const resultado = FAQ[idioma].find(item => item.k.test(pergunta));

    return resultado ? resultado.r : TEXTOS[idioma].fora;
}

// ENVIAR PERGUNTA
async function perguntar(texto) {
    if (ocupado || !texto.trim()) return;

    ocupado = true;
    chips.innerHTML = "";

    add(texto, "user");

    historico.push({
        role: "user",
        content: texto
    });

    const animacao = digitando();

    try {
        const resposta = await responder(texto);

        animacao.remove();
        add(resposta, "ia");

        historico.push({
            role: "assistant",
            content: resposta
        });

        // IDENTIFICAR PEDIDO DE ATENDENTE
        const normalizado = texto
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();

        if (
            /atendente|suporte humano|falar com alguem|falar com uma pessoa|pessoa real|whatsapp|\bagent\b|human support|real person|talk to someone|speak to someone/.test(normalizado)
        ) {
            mostrarWhatsApp();
        }

        mostrarSugestoes(TEXTOS[idioma].seguimento);

    } catch (erro) {
        animacao.remove();

        add(TEXTOS[idioma].erroChat, "ia");

        historico.pop();
        console.error("Erro no chat:", erro);

        mostrarSugestoes(TEXTOS[idioma].sugestoes);

    } finally {
        ocupado = false;
        campo.focus();
    }
}

// MENSAGEM INICIAL, SEM PERGUNTA AUTOMÁTICA
function iniciarChat() {
    msgs.innerHTML = "";
    historico = [];

    add(TEXTOS[idioma].boasVindas, "ia");
    mostrarSugestoes(TEXTOS[idioma].sugestoes);
}

// =====================================================
// RECONHECIMENTO DE VOZ
// =====================================================

const Reconhecimento =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

let reconhecimento = null;

if (Reconhecimento && botaoMicrofone && campo && form) {

    reconhecimento = new Reconhecimento();

    reconhecimento.lang = TEXTOS[idioma].vozLang;
    reconhecimento.continuous = false;
    reconhecimento.interimResults = false;

    let ouvindo = false;

    botaoMicrofone.addEventListener("click", () => {
        if (ouvindo) return;

        reconhecimento.start();
    });

    reconhecimento.onstart = () => {
        ouvindo = true;
        botaoMicrofone.classList.add("gravando");
        botaoMicrofone.textContent = "🔴";
        campo.placeholder = TEXTOS[idioma].ouvindo;
    };

    reconhecimento.onresult = (event) => {
        const fala = event.results[0][0].transcript;

        campo.value = fala;

        // Envia a pergunta reconhecida pelo microfone
        form.requestSubmit();
    };

    reconhecimento.onend = () => {
        ouvindo = false;
        botaoMicrofone.classList.remove("gravando");
        botaoMicrofone.textContent = "🎙️";
        campo.placeholder = TEXTOS[idioma].placeholderVoz;
    };

    reconhecimento.onerror = () => {
        ouvindo = false;
        botaoMicrofone.classList.remove("gravando");
        botaoMicrofone.textContent = "🎙️";

        alert(TEXTOS[idioma].erroVoz);
    };

} else if (botaoMicrofone) {
    botaoMicrofone.disabled = true;
}

// =====================================================
// TROCA DE IDIOMA
// =====================================================

function atualizarIdioma() {

    const t = TEXTOS[idioma];

    document.documentElement.lang = idioma === "pt" ? "pt-BR" : "en";
    document.title = t.docTitulo;

    // Botão de idioma (procurado de novo a cada troca, caso o cabeçalho tenha sido recriado)
    const botaoIdioma = document.querySelector(SELETOR_IDIOMA);

    if (botaoIdioma) {
        const span = botaoIdioma.querySelector("span");

        if (span) {
            // botão com ícone + <span>: só o texto do span muda
            span.textContent = t.botaoIdioma;
        } else {
            botaoIdioma.textContent = `🌐 ${t.botaoIdioma}`;
        }
    }

    // Cabeçalho
    traduzirCabecalho();

    // Textos fixos da página (data-i18n="chave")
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const valor = t[el.dataset.i18n];

        if (valor === undefined) return;

        // só o aviso tem HTML (<code>), e o texto vem daqui, nunca do usuário
        if (el.dataset.i18n === "note") {
            el.innerHTML = valor;
        } else {
            el.textContent = valor;
        }
    });

    // Campo, microfone e botão enviar
    if (campo) {
        campo.placeholder = t.placeholder;
        campo.setAttribute("aria-label", t.ariaCampo);
    }

    if (botaoMicrofone) {
        if (reconhecimento) {
            botaoMicrofone.title = t.microfoneTitulo;
            botaoMicrofone.setAttribute("aria-label", t.microfoneTitulo);
            reconhecimento.lang = t.vozLang;
        } else {
            botaoMicrofone.title = t.semVoz;
        }
    }

    // O chat recomeça no novo idioma (as respostas antigas ficariam misturadas)
    iniciarChat();
}

// CLIQUE NO BOTÃO DE IDIOMA
// Delegação no document: funciona mesmo que o cabeçalho seja criado depois
document.addEventListener("click", evento => {

    const alvo = evento.target.closest(SELETOR_IDIOMA);
    if (!alvo) return;

    evento.preventDefault();

    idioma = idioma === "pt" ? "en" : "pt";
    atualizarIdioma();
});

// =====================================================
// FORMULÁRIO E INICIALIZAÇÃO
// =====================================================

if (form && campo && msgs && chips) {
    form.addEventListener("submit", function (evento) {
        evento.preventDefault();

        const texto = campo.value.trim();

        if (!texto) return;

        campo.value = "";
        perguntar(texto);
    });

    atualizarIdioma();

} else {
    console.error("Elementos do chat não encontrados no HTML.");
}
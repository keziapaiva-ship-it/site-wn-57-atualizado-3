const API_URL = "";

// Botões de idioma aceitos (o cabeçalho é gerado pelo cabecalho.js e pode usar qualquer um destes)
const SELETOR_IDIOMA = "#btnIdioma, #trocarIdioma, .idioma-btn, .idioma";

// Áreas que a tradução automática nunca deve tocar
const SELETOR_IGNORAR = SELETOR_IDIOMA + ", #msgs, #chips, [data-i18n], [data-no-i18n]";

const CHAVE_IDIOMA = "wn57_idioma";

// Lê o idioma salvo (assim a escolha vale para todas as páginas do site)
function lerIdiomaSalvo() {
    try {
        return localStorage.getItem(CHAVE_IDIOMA) === "en" ? "en" : "pt";
    } catch (e) {
        return "pt";
    }
}

function salvarIdioma(valor) {
    try {
        localStorage.setItem(CHAVE_IDIOMA, valor);
    } catch (e) {
        // sem localStorage: segue funcionando só nesta página
    }
}

let idioma = lerIdiomaSalvo();

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
            "♿ Acessibilidade",
            "💡 Dicas para viajar",
            "❓ Como funciona a WN57",
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
            "♿ Accessibility",
            "💡 Travel tips",
            "❓ How WN57 works",
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
            k: /recomendacao|recomendacoes|o que voce recomenda|qual categoria escolher/i,
            r: "💗 Posso ajudar você a escolher a melhor opção!\n\n🚗 WN Econômico: indicado para quem busca uma opção mais acessível.\n\n✨ WN Comfort: para quem prefere uma experiência com mais conforto.\n\n👑 WN Black: para quem procura uma experiência premium.\n\n🐾 WN Pet: para viagens com animais de estimação, seguindo as regras da modalidade.\n\nMinha dica: escolha a categoria de acordo com sua necessidade e confira as informações antes de confirmar."
        },
        {
            k: /dicas|antes da viagem|antes de viajar|preparar viagem/i,
            r: "💡 Algumas dicas para sua viagem:\n\n1. Confira os endereços de origem e destino.\n2. Verifique a categoria escolhida.\n3. Confira o valor e a forma de pagamento.\n4. Antes de entrar no veículo, confira a foto do motorista, o modelo e a placa.\n5. Durante a viagem, acompanhe as informações disponíveis no aplicativo.\n\nBoa viagem com a WN57! 💗"
        },
        {
            k: /como funciona a wn57|como funciona|sobre a wn57/i,
            r: "🚗 A WN57 é uma plataforma de mobilidade que conecta usuários a opções de transporte.\n\nVocê pode acessar a opção Viajar, informar sua origem e destino, escolher uma categoria e selecionar a forma de pagamento disponível.\n\nDepois, confira os dados e confirme sua solicitação."
        },
        {
            k: /acessibilidade|pessoa com deficiencia|necessidade especial/i,
            r: "♿ Queremos proporcionar uma experiência acessível a todos. Para informar uma necessidade específica ou solicitar orientação, entre em contato com nosso suporte humano pelo WhatsApp."
        },
        {
            k: /privacidade|dados pessoais|meus dados|seguranca dos dados/i,
            r: "🔒 A proteção dos seus dados é importante. Consulte a página de Privacidade da WN57 para conhecer as informações sobre o tratamento de dados pessoais."
        },
        {
            k: /avaliar atendimento|dar nota|avaliar assistente|feedback/i,
            r: "⭐ Sua opinião é muito importante para melhorar nosso atendimento!\n\nVocê pode contar como foi sua experiência e informar se conseguiu resolver sua dúvida."
        },
        {
            k: /bom trabalho|parabens|voce e otima|voce e legal/i,
            r: "Muito obrigada! 💗 Fico feliz em ajudar. Conte comigo sempre que precisar de suporte na WN57!"
        },
        {
            k: /estou com duvida|nao entendi|pode explicar/i,
            r: "Claro! 💗 Vou tentar explicar de outra maneira. Me conte qual parte você não entendeu."
        },
        {
            k: /como sei que o motorista e confiavel|motorista confiavel|verificar motorista/i,
            r: "Antes de iniciar a viagem, confira os dados do motorista, a foto, o veículo e a placa apresentados no aplicativo."
        },
        {
            k: /esqueci algo no carro|perdi meu celular|objeto no veiculo/i,
            r: "Se esqueceu algum objeto no veículo, acesse os detalhes da corrida e procure a opção de ajuda sobre objetos esquecidos."
        },
        {
            k: /quando vou pagar|momento do pagamento|pagar corrida/i,
            r: "A forma e o momento do pagamento dependem da opção selecionada durante a solicitação. Confira as instruções apresentadas na tela de pagamento."
        },
        {
            k: /meu pix nao funciona|pix não funciona|erro no pix/i,
            r: "Se estiver com problemas no PIX, confira os dados e as instruções de pagamento. Se o problema continuar, entre em contato com nosso suporte."
        },
        {
            k: /cartao recusado|cartão recusado|meu cartao nao funciona/i,
            r: "Se seu cartão foi recusado, confira os dados cadastrados e tente novamente. Se necessário, escolha outra forma de pagamento disponível."
        },
        {
            k: /quanto custa|preco da corrida|preço da corrida|valor da viagem/i,
            r: "O valor da corrida depende da distância, da categoria escolhida e das condições da viagem. Informe seu endereço de origem e destino na página Viajar para consultar o valor apresentado."
        },
        {
            k: /posso levar acompanhante|mais de uma pessoa|quantas pessoas/i,
            r: "A quantidade de passageiros depende da capacidade do veículo escolhido. Confira as informações da categoria antes de confirmar sua corrida."
        },
        {
            k: /posso agendar|agendar corrida|corrida agendada/i,
            r: "Para verificar a possibilidade de agendamento, consulte as opções disponíveis na página de solicitação de corrida."
        },
        {
            k: /corrida pet|viajar com animal|levar cachorro|levar gato/i,
            r: "🐾 A WN57 possui a modalidade WN Pet! Consulte as orientações e regras da modalidade antes de solicitar sua viagem."
        },
        {
            k: /o que voce faz|o que você faz|o que voce pode fazer|o que você pode fazer|como voce pode me ajudar|como você pode me ajudar|quais suas funcoes|quais suas funções|qual sua funcao|qual sua função/i,
            r: "Eu sou a assistente virtual da WN57! 💗 Estou aqui para facilitar sua experiência e tirar suas dúvidas.\n\nPosso ajudar você com:\n\n🚗 Solicitação, cancelamento e acompanhamento de corridas.\n\n💳 Formas de pagamento, cobranças e reembolsos.\n\n👤 Cadastro, login e recuperação de senha.\n\n🛡️ Segurança durante as viagens.\n\n🎒 Objetos esquecidos e problemas no aplicativo.\n\n💬 Também posso encaminhar você para o atendimento humano pelo WhatsApp.\n\nO que você gostaria de saber?"
        },
        {
            k: /qual seu nome|quem e voce|quem é você|voce e uma ia|você é uma ia/i,
            r: "Meu nome é Assistente WN57! 💗 Sou a assistente virtual da plataforma e estou aqui para ajudar você com suas dúvidas e orientar sua experiência."
        },
        {
            k: /voce e humana|voce e uma pessoa|voce e real|quem criou voce/i,
            r: "Sou uma assistente virtual da WN57, criada para facilitar o atendimento e responder às dúvidas dos nossos usuários. 💗"
        },
        {
            k: /voce esta online|tem alguem ai|esta funcionando/i,
            r: "Sim! 💗 Estou disponível para ajudar você. Pode escrever sua dúvida ou escolher uma das opções de atendimento."
        },
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
            k: /recommendation|recommendations|what do you recommend|which category should i choose/i,
            r: "💗 I can help you choose the best option!\n\n🚗 WN Economy: ideal for those looking for a more affordable option.\n\n✨ WN Comfort: for those who prefer a more comfortable experience.\n\n👑 WN Black: for those looking for a premium experience.\n\n🐾 WN Pet: for trips with pets, following the service rules.\n\nMy tip: choose the category that best suits your needs and review the details before confirming."
        },
        {
            k: /tips|before my ride|before traveling|travel tips/i,
            r: "💡 Here are some tips for your trip:\n\n1. Check your pickup and destination addresses.\n2. Review your selected category.\n3. Check the fare and payment method.\n4. Before entering the vehicle, verify the driver's photo, vehicle model and license plate.\n5. Follow the trip information available in the app.\n\nHave a great ride with WN57! 💗"
        },
        {
            k: /how does wn57 work|how does it work|about wn57/i,
            r: "🚗 WN57 is a mobility platform that connects users with transportation options.\n\nOpen the Ride option, enter your pickup and destination addresses, choose a category and select an available payment method.\n\nReview the details and confirm your request."
        },
        {
            k: /accessibility|person with a disability|special needs/i,
            r: "♿ We want to provide an accessible experience for everyone. To share a specific need or request guidance, contact our human support team through WhatsApp."
        },
        {
            k: /privacy|personal data|my data|data security/i,
            r: "🔒 Protecting your data is important. Visit the WN57 Privacy Policy page to learn how personal information is handled."
        },
        {
            k: /rate support|rate assistant|feedback|give feedback/i,
            r: "⭐ Your opinion helps us improve our support!\n\nTell us about your experience and whether you were able to resolve your question."
        },
        {
            k: /good job|congratulations|you are great|you are nice/i,
            r: "Thank you so much! 💗 I'm happy to help. Count on me whenever you need WN57 support!"
        },
        {
            k: /i have a question|i don't understand|can you explain/i,
            r: "Of course! 💗 I'll try to explain it another way. Tell me which part you didn't understand."
        },
        {
            k: /how do i know if the driver is reliable|reliable driver|verify driver/i,
            r: "Before starting your trip, check the driver's details, photo, vehicle model and license plate shown in the app."
        },
        {
            k: /i forgot something in the car|lost my phone|item in the vehicle/i,
            r: "If you left an item in the vehicle, open your ride details and look for the help option related to lost items."
        },
        {
            k: /when do i pay|payment time|pay for the ride/i,
            r: "The payment method and timing depend on the option selected when requesting your ride. Check the instructions shown on the payment screen."
        },
        {
            k: /my pix is not working|pix error|pix doesn't work/i,
            r: "If you're having trouble with PIX, check the payment details and instructions. If the problem continues, contact our support team."
        },
        {
            k: /card declined|my card is not working|credit card error/i,
            r: "If your card was declined, check the registered card details and try again. If necessary, choose another available payment method."
        },
        {
            k: /how much does it cost|ride price|trip fare|cost of the ride/i,
            r: "The ride fare depends on the distance, selected category and trip conditions. Enter your pickup and destination addresses on the Ride page to check the displayed fare."
        },
        {
            k: /can i bring someone|more than one passenger|how many passengers/i,
            r: "The number of passengers depends on the capacity of the selected vehicle. Check the category details before confirming your ride."
        },
        {
            k: /can i schedule|schedule a ride|scheduled ride/i,
            r: "To check whether scheduling is available, review the options on the ride request page."
        },
        {
            k: /pet ride|travel with a pet|bring a dog|bring a cat/i,
            r: "🐾 WN57 offers the WN Pet option! Check its guidelines and rules before requesting your trip."
        },
        {
            k: /what do you do|what can you do|how can you help me|what are your functions/i,
            r: "I'm the WN57 virtual assistant! 💗 I'm here to make your experience easier and answer your questions.\n\nI can help you with:\n\n🚗 Requesting, cancelling and tracking rides.\n\n💳 Payment methods, charges and refunds.\n\n👤 Registration, login and password recovery.\n\n🛡️ Ride safety.\n\n🎒 Lost items and app problems.\n\n💬 I can also direct you to human support through WhatsApp.\n\nWhat would you like to know?"
        },
        {
            k: /what is your name|who are you|are you an ai/i,
            r: "My name is WN57 Assistant! 💗 I'm the platform's virtual assistant, and I'm here to answer your questions and guide you through your experience."
        },
        {
            k: /are you human|are you a person|are you real|who created you/i,
            r: "I'm a virtual assistant created for WN57 to make customer support easier and answer users' questions. 💗"
        },
        {
            k: /are you online|is anyone there|is it working/i,
            r: "Yes! 💗 I'm available to help you. You can type your question or choose one of the support options."
        },
        {
            k: /\b(hi|hello|hey|good morning|good afternoon|good evening|how are you)\b/i,
            r: "Hello! Welcome to WN57 support! 💗\n\nHow can we help you today?"
        },
        {
            // Keep before app-related rules because "WhatsApp" contains "app"
            k: /agent|human support|real person|talk to someone|speak to someone|whatsapp/i,
            r: "Of course! I'll provide the contact details for our human support team. 💗"
        },
        {
            k: /request a ride|book a ride|call a car|call a driver|take a trip|new ride/i,
            r: "To request a ride:\n\n1. Open the Ride option.\n2. Enter your pickup address.\n3. Type your destination.\n4. Choose your preferred category.\n5. Select a payment method.\n6. Review the details and confirm your request."
        },
        {
            k: /cancel|give up the ride/i,
            r: "To cancel a ride, go to Activity, select the ride and look for the cancellation option. Review the conditions before confirming."
        },
        {
            k: /track|locate|where is|driver location|ride map|see my ride/i,
            r: "To track your ride, go to Activity and open your requested trip. Check the available driver information and trip progress."
        },
        {
            k: /no driver|nobody accepted|no one accepted|can't find a driver/i,
            r: "If no driver accepts your request, check that the addresses are correct and try again. Driver availability may vary by location."
        },
        {
            k: /late|delay|taking too long|driver hasn't arrived|waiting for the driver/i,
            r: "If your driver is taking too long, check the ride progress in Activity. If necessary, use the Help Center."
        },
        {
            k: /address|pickup location|origin|destination|change address|edit address/i,
            r: "Check your pickup and destination addresses before confirming the ride. If you need to change any information, review the options available on the request screen."
        },
        {
            k: /gps|location/i,
            r: "Make sure your device's location is turned on and that your browser has permission to access it. Also check your internet connection."
        },
        {
            k: /\bpix\b/i,
            r: "WN57 offers PIX as a payment option. Select PIX during the payment step and follow the instructions shown."
        },
        {
            k: /card|credit|debit/i,
            r: "To pay by card, select that option during the payment step, if available."
        },
        {
            k: /cash|pay in cash|cash payment/i,
            r: "If available, select cash as your payment method before confirming your ride."
        },
        {
            k: /charge|charged|wrong amount|incorrect fare|duplicate payment/i,
            r: "If you noticed an incorrect charge, open the ride in Activity and look for the help option. Explain what happened to human support so they can review it."
        },
        {
            k: /refund|money back|reimbursement/i,
            r: "To request a refund review, go to Activity, select the ride and look for the help option."
        },
        {
            k: /black|comfort|economy|categories|ride types|difference between categories/i,
            r: "WN57 offers three ride categories:\n\n🚗 WN Economy: a more affordable option.\n\n✨ WN Comfort: focused on comfort.\n\n👑 WN Black: a premium experience."
        },
        {
            k: /sign ?up|register|create an account|new account/i,
            r: "To create your account, click Sign Up in the menu. Fill in the requested information and follow the instructions on the page."
        },
        {
            k: /log ?in|sign ?in|access my account|can't log in|cannot log in/i,
            r: "To access your account, click Log In and enter your registered details. If the problem continues, look for the account recovery option."
        },
        {
            k: /password|forgot my password|reset password|change password/i,
            r: "If you forgot your password, look for the recovery option on the login screen and follow the instructions."
        },
        {
            k: /change details|change name|change email|phone|update account|edit profile/i,
            r: "To update your details, open your profile or account management options, if available."
        },
        {
            k: /delete account|remove account|close account/i,
            r: "To request account closure, look for the account management options or contact human support."
        },
        {
            k: /safety|danger|threat|problem during the ride/i,
            r: "Your safety matters. In an immediate emergency, contact local emergency services. To report a ride-related problem, use WN57's support channels."
        },
        {
            k: /driver|who is picking me up|who is my driver/i,
            r: "Available driver information can be found in the ride details after your request has been accepted."
        },
        {
            k: /forgot|lost|left behind|item|bag|phone|wallet/i,
            r: "Did you leave something behind during your trip? Go to Activity, select the ride and look for the help option for lost items."
        },
        {
            k: /rate|rating|stars|review|review the driver/i,
            r: "If the rating option is available after your ride, you can share your experience."
        },
        {
            k: /complaint|complain|report a problem|report an issue/i,
            r: "To file a complaint, open the WN57 Help Center and look for the Report a Problem option."
        },
        {
            k: /app|not opening|freezing|crashing|error|bug|not working|doesn't work/i,
            r: "If the app is having problems:\n\n1. Check your internet connection.\n2. Refresh the page or app.\n3. Check location permissions.\n4. Try again.\n\nIf the problem continues, contact support."
        },
        {
            k: /internet|connection|no signal|offline/i,
            r: "Check your internet connection. An unstable connection can prevent the map and ride information from loading."
        },
        {
            // GENERIC RULES (keep these after the specific ones)
            k: /\brides?\b|\btrips?\b/i,
            r: "I can help you with rides:\n\n• How to request a ride\n• How to cancel or track a trip\n• A delayed driver or no driver found\n\nChoose an option or type your question."
        },
        {
            k: /\bpayments?\b|\bpay\b|payment methods?/i,
            r: "WN57 accepts the payment methods enabled for your account, such as PIX, card or cash. I can explain each option or help with charges and refunds. What would you like to know?"
        },
        {
            k: /\baccount\b|\bprofile\b/i,
            r: "I can help with account registration, login, password recovery and updating your details. What would you like to know?"
        },
        {
            k: /thank you|thanks|thank/i,
            r: "You're welcome! 💗 WN57 appreciates you getting in touch. We're always here to help!"
        },
        {
            k: /bye|goodbye|see you|talk to you later/i,
            r: "See you! Thank you for contacting WN57. Have a great ride! 💗"
        }
    ],

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
// DICIONÁRIO DA PÁGINA INTEIRA (menu, rodapé, links e botões
// que NÃO têm data-i18n no HTML).
// Para um texto novo, basta acrescentar um par [português, inglês].
// Maiúsculas, quebras de linha e espaços repetidos são ignorados na comparação.
// =====================================================

const MENU = [
    ["Inicial", "Home"],
    ["Início", "Home"],
    ["Viajar", "Ride"],
    ["Atividade", "Activity"],
    ["Entrar", "Log In"],
    ["Fazer login", "Log In"],
    ["Fazer Login", "Log In"],
    ["Cadastre-se", "Sign Up"],
    ["Cadastrar", "Sign Up"],
    ["Ajuda", "Help"],
    ["Central de Ajuda", "Help Center"],
    ["Suporte", "Support"],
    ["Sobre-nós", "About us"],
    ["Sobre nós", "About us"],
    ["Sobre", "About"],
    ["Contato", "Contact"],
    ["Privacidade", "Privacy"],
    ["Termos", "Terms"],
    ["Termos de uso", "Terms of use"],
    ["Política de privacidade", "Privacy Policy"],
    ["Perfil", "Profile"],
    ["Minha conta", "My account"],
    ["Meu perfil", "My profile"],
    ["Sair", "Log out"],
    ["Pagamento", "Payment"],
    ["Pagamentos", "Payments"],
    ["Corridas", "Rides"],
    ["Segurança", "Safety"],
    ["Atendimento digital", "Digital support"],
    ["Converse com a WN57", "Chat with WN57"],
    ["Estamos aqui para ajudar com suas dúvidas.", "We're here to help with your questions."],
    ["Informações", "Information"],
    ["Como podemos ajudar?", "How can we help?"],
    ["Conheça os assuntos que nossa assistente pode orientar.", "Learn about the topics our assistant can guide you on."],
    ["Assistente WN57", "WN57 Assistant"],
    ["Online", "Online"],
    ["Idioma", "Language"]
];

// ignora maiúsculas, quebras de linha e espaços repetidos
function chave(texto) {
    return texto.replace(/\s+/g, " ").trim().toLowerCase();
}

// texto em português (normalizado) → { pt, en }
const dicionarioMenu = {};
MENU.forEach(par => {
    dicionarioMenu[chave(par[0])] = { pt: par[0], en: par[1] };
});

// guarda o texto original (português) de cada nó de texto já traduzido
const originaisMenu = new WeakMap();

function traduzirTextosDaPagina() {

    if (!document.body) return;

    const andador = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode(no) {
                const pai = no.parentElement;

                if (!pai) return NodeFilter.FILTER_REJECT;

                if (["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA"].includes(pai.tagName)) {
                    return NodeFilter.FILTER_REJECT;
                }

                // não mexe no botão de idioma, no chat nem no que já tem data-i18n
                if (pai.closest(SELETOR_IGNORAR)) return NodeFilter.FILTER_REJECT;

                return NodeFilter.FILTER_ACCEPT;
            }
        }
    );

    const nos = [];
    let no;

    while ((no = andador.nextNode())) nos.push(no);

    nos.forEach(item => {

        // texto em português guardado na primeira vez que o item é visto
        let base = originaisMenu.get(item);

        if (base === undefined) {
            if (!dicionarioMenu[chave(item.nodeValue)]) return;
            base = item.nodeValue;
            originaisMenu.set(item, base);
        }

        const entrada = dicionarioMenu[chave(base)];
        if (!entrada) return;

        const novo = base.replace(base.trim(), entrada[idioma]);

        if (item.nodeValue !== novo) item.nodeValue = novo;
    });
}

// Atributos (title, aria-label, placeholder, alt) de elementos que não são do chat
function traduzirAtributosDaPagina() {

    const atributos = ["title", "aria-label", "placeholder", "alt"];

    document.querySelectorAll("[title], [aria-label], [placeholder], [alt]").forEach(el => {

        if (el.closest(SELETOR_IGNORAR)) return;

        atributos.forEach(attr => {
            if (!el.hasAttribute(attr)) return;

            const chaveOriginal = "orig" + attr.replace("-", "");
            let base = el.dataset[chaveOriginal];

            if (base === undefined) {
                if (!dicionarioMenu[chave(el.getAttribute(attr))]) return;
                base = el.getAttribute(attr);
                el.dataset[chaveOriginal] = base;
            }

            const entrada = dicionarioMenu[chave(base)];
            if (!entrada) return;

            if (el.getAttribute(attr) !== entrada[idioma]) {
                el.setAttribute(attr, entrada[idioma]);
            }
        });
    });
}

// Texto do botão de idioma (procurado de novo a cada vez, caso o cabeçalho tenha sido recriado)
function atualizarBotaoIdioma() {

    const botaoIdioma = document.querySelector(SELETOR_IDIOMA);
    if (!botaoIdioma) return;

    const t = TEXTOS[idioma];
    const span = botaoIdioma.querySelector("span");

    if (span) {
        // botão com ícone + <span>: só o texto do span muda
        if (span.textContent !== t.botaoIdioma) span.textContent = t.botaoIdioma;
    } else {
        const novo = `🌐 ${t.botaoIdioma}`;
        if (botaoIdioma.textContent !== novo) botaoIdioma.textContent = novo;
    }
}

// Traduz tudo o que está fora do chat (usado na troca de idioma e quando algo novo aparece)
function traduzirPagina() {
    atualizarBotaoIdioma();
    traduzirTextosDaPagina();
    traduzirAtributosDaPagina();
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

    reconhecimento.onerror = (event) => {
        ouvindo = false;

        botaoMicrofone.classList.remove("gravando");
        botaoMicrofone.textContent = "🎙️";
        campo.placeholder = TEXTOS[idioma].placeholder;

        let mensagem = TEXTOS[idioma].erroVoz;

        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
            mensagem = idioma === "pt"
                ? "Permissão do microfone negada. Autorize o acesso ao microfone nas configurações do navegador."
                : "Microphone permission denied. Allow microphone access in your browser settings.";
        }

        mostrarMensagemSistema(mensagem);
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

    // Atributos com chave: data-i18n-placeholder, data-i18n-title, data-i18n-aria
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
        const valor = t[el.dataset.i18nPlaceholder];
        if (valor !== undefined) el.setAttribute("placeholder", valor);
    });

    document.querySelectorAll("[data-i18n-title]").forEach(el => {
        const valor = t[el.dataset.i18nTitle];
        if (valor !== undefined) el.setAttribute("title", valor);
    });

    document.querySelectorAll("[data-i18n-aria]").forEach(el => {
        const valor = t[el.dataset.i18nAria];
        if (valor !== undefined) el.setAttribute("aria-label", valor);
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

    // Cabeçalho, rodapé, links, botão de idioma e atributos da página inteira
    traduzirPagina();

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
    salvarIdioma(idioma);

    atualizarIdioma();

    // avisa outros scripts (ex.: cabecalho.js) que o idioma mudou
    document.dispatchEvent(new CustomEvent("wn57:idioma", { detail: { idioma } }));
});

// Se o idioma for trocado em outra aba, esta página acompanha
window.addEventListener("storage", evento => {
    if (evento.key !== CHAVE_IDIOMA) return;

    const novo = evento.newValue === "en" ? "en" : "pt";
    if (novo === idioma) return;

    idioma = novo;
    atualizarIdioma();
});

// =====================================================
// OBSERVADOR: traduz o que for criado DEPOIS do carregamento
// (por exemplo o cabeçalho gerado pelo cabecalho.js)
// =====================================================

function iniciarObservador() {

    if (!document.body || typeof MutationObserver === "undefined") return;

    let agendado = false;

    const observador = new MutationObserver(mutacoes => {

        // ignora o que acontece dentro do chat (mensagens e sugestões)
        const relevante = mutacoes.some(m => {
            const alvo = m.target.nodeType === 1 ? m.target : m.target.parentElement;
            return alvo && !alvo.closest("#msgs, #chips");
        });

        if (!relevante || agendado) return;

        agendado = true;

        requestAnimationFrame(() => {
            agendado = false;
            traduzirPagina();
        });
    });

    // só childList: trocar nodeValue/atributos não dispara de novo (evita laço infinito)
    observador.observe(document.body, { childList: true, subtree: true });
}

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
    iniciarObservador();

    // garantia extra: depois que a página terminar de carregar, traduz de novo
    window.addEventListener("load", traduzirPagina);

} else {
    console.error("Elementos do chat não encontrados no HTML.");
}

function mostrarMensagemSistema(texto) {
    add("🎙️ " + texto, "ia");
}
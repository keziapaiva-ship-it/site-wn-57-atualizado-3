
const API_URL = "";

// BASE DE PERGUNTAS E RESPOSTAS
const FAQ = [
    {
        k: /\b(oi|olá|ola|bom dia|boa tarde|boa noite|tudo bem)\b/i,
        r: "Olá! Seja bem-vindo(a) ao suporte WN57! 💗\n\nComo podemos ajudar você hoje?"
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
    {
        k: /obrigado|obrigada|valeu|agradeço|agradeco/i,
        r: "Por nada! 💗 A WN57 agradece seu contato. Sempre que precisar, estaremos aqui para ajudar!"
    },
    {
        k: /tchau|até mais|ate mais|adeus/i,
        r: "Até mais! Obrigado por entrar em contato com a WN57. Tenha uma ótima viagem! 💗"
    }
];

const FORA = "Não consegui identificar sua dúvida. 😕\n\nTente escrever de outra maneira ou escolha uma das opções de atendimento.";

// OPÇÕES INICIAIS
const SUGESTOES = [
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
];

const NUMERO_WHATSAPP = "5541997547644";

const msgs = document.getElementById("msgs");
const campo = document.getElementById("campo");
const form = document.getElementById("form");
const chips = document.getElementById("chips");

let ocupado = false;
let historico = [];

const reduz = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

const espera = ms => new Promise(resolve => {
    setTimeout(resolve, reduz ? 0 : ms);
});

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
    texto.textContent = "📱 WhatsApp WN57: (41) 99754-7644";

    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "chip";
    botao.textContent = "💬 Conversar pelo WhatsApp";

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
                messages: historico
            })
        });

        if (!resposta.ok) {
            throw new Error("Erro na conexão com o servidor.");
        }

        const dados = await resposta.json();
        return dados.reply || FORA;
    }

    await espera(800);

    const pergunta = texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

    const resultado = FAQ.find(item => item.k.test(pergunta));

    return resultado ? resultado.r : FORA;
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
            /atendente|suporte humano|falar com alguem|falar com uma pessoa|pessoa real|whatsapp/.test(normalizado)
        ) {
            mostrarWhatsApp();
        }

        mostrarSugestoes([
            "🚗 Corridas",
            "💳 Pagamentos",
            "👤 Minha conta",
            "🙋 Falar com atendente"
        ]);

    } catch (erro) {
        animacao.remove();

        add(
            "Não consegui responder agora. Tente novamente em instantes.",
            "ia"
        );

        historico.pop();
        console.error("Erro no chat:", erro);

        mostrarSugestoes(SUGESTOES);

    } finally {
        ocupado = false;
        campo.focus();
    }
}

// FORMULÁRIO
if (form && campo && msgs && chips) {
    form.addEventListener("submit", function(evento) {
        evento.preventDefault();

        const texto = campo.value.trim();

        if (!texto) return;

        campo.value = "";
        perguntar(texto);
    });

    // MENSAGEM INICIAL, SEM PERGUNTA AUTOMÁTICA
    add(
        "Olá! Seja bem-vindo(a) ao atendimento da WN57! 💗\n\nSou sua assistente virtual e posso ajudar com corridas, pagamentos, cadastro, segurança e muito mais.\n\nO que você precisa resolver hoje?",
        "ia"
    );

    mostrarSugestoes(SUGESTOES);

} else {
    console.error("Elementos do chat não encontrados no HTML.");
}
// RECONHECIMENTO DE VOZ

const botaoMicrofone = document.getElementById("microfone");
const campoMensagem = document.getElementById("campo");
const formulario = document.getElementById("form");

const Reconhecimento =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

if (Reconhecimento && botaoMicrofone) {
    const reconhecimento = new Reconhecimento();

    reconhecimento.lang = "pt-BR";
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
        campoMensagem.placeholder = "Estou ouvindo...";
    };

    reconhecimento.onresult = (event) => {
        const fala = event.results[0][0].transcript;

        campoMensagem.value = fala;

        // Envia a pergunta reconhecida pelo microfone
        formulario.requestSubmit();
    };

    reconhecimento.onend = () => {
        ouvindo = false;
        botaoMicrofone.classList.remove("gravando");
        botaoMicrofone.textContent = "🎙️";
        campoMensagem.placeholder = "Escreva ou fale sua dúvida...";
    };

    reconhecimento.onerror = () => {
        ouvindo = false;
        botaoMicrofone.classList.remove("gravando");
        botaoMicrofone.textContent = "🎙️";

        alert("Não foi possível reconhecer sua voz. Verifique a permissão do microfone.");
    };

} else if (botaoMicrofone) {
    botaoMicrofone.disabled = true;
    botaoMicrofone.title = "Reconhecimento de voz não disponível neste navegador.";
}
console.log("JavaScript WN57 carregado!");

// ==================================================
// BOTÃO VOLTAR AO TOPO
// ==================================================

document.addEventListener("DOMContentLoaded", () => {
    const topBtn = document.getElementById("topBtn");

    if (topBtn) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 300) {
                topBtn.classList.add("show");
            } else {
                topBtn.classList.remove("show");
            }
        });

        topBtn.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }
});


// ==================================================
// IDIOMA (PORTUGUÊS / INGLÊS)
// ==================================================

const traducoes = [

    // Menu
    ["nav a", 0, "Home"],
    ["nav a", 1, "Ride"],
    ["nav a", 2, "About us"],

    [".header-right a", 0, "Help"],
    [".header-right a", 1, "Log in"],
    [".header-right a", 2, "Sign up"],

    // Hero
    [".hero h1", 0, 'Your <span>premium</span> ride'],

    [".hero-text p", 0,
        "A modern, fast and secure app. Travel comfortably with an extraordinary experience."
    ],

    [".hero-buttons a", 0, "Request a ride"],
    [".hero-buttons a", 1, "How it works"],

    // Card do celular
    [".ride-card > p", 0, "Driver arriving • 3 min"],
    [".ride-card button", 0, "Confirm ride"],

    // Estatísticas
    [".stat-box p", 0, "Rides completed"],
    [".stat-box p", 1, "User rating"],
    [".stat-box p", 2, "Active drivers"],

    // Funcionalidades
    [".section-title h2", 0, "Why use WN57?"],
    [".section-title p", 0, "Modern, elegant and safe mobility."],

    [".feature-card h3", 0, "Fast rides"],
    [".feature-card p", 0, "Nearby drivers in just a few seconds."],

    [".feature-card h3", 1, "Real-time map"],
    [".feature-card p", 1, "See your route live with modern GPS."],

    [".feature-card h3", 2, "More safety"],
    [".feature-card p", 2, "Verified drivers and 24/7 support."],

    [".feature-card h3", 3, "Easy payment"],
    [".feature-card p", 3, "PIX, card or cash."],

    // Tipos de corrida
    [".ride-option h3", 0, "WN Black"],
    [".ride-option p", 0, "Luxury and premium comfort."],

    [".ride-option h3", 1, "WN Comfort"],
    [".ride-option p", 1, "More comfortable rides."],

    [".ride-option h3", 2, "WN Economy"],
    [".ride-option p", 2, "Fast and affordable rides."],

    // Avaliações
    [".review p", 0,
        "Very beautiful and fast app. The experience feels like an international app."
    ],

    [".review p", 1,
        "Amazing map and very polite drivers."
    ],

    [".review p", 2,
        "Premium and very modern look."
    ],

    // Download
    [".download h2", 0, "Download the WN57 app"],

    [".download p", 0,
        "Request your ride in seconds with a modern, fast and secure platform."
    ],

    [".download button", 0, "Download"],

    // Rodapé
    ["footer", 0, "© 2026 WN57 • All rights reserved"],

    // Cookies
    [".cookie-texto h3", 0, "We use cookies"],

    [".cookie-texto p", 0,
        'We use cookies to improve your browsing experience. By accepting, you agree to the <strong>Privacy Policy</strong> and <strong>Cookie Policy</strong> of WN57.'
    ],

    [".cookie-aceitar", 0, "Accept"],
    [".cookie-recusar", 0, "Decline"]
];


// Guarda os textos originais em português
const textosOriginais = new Map();

const idiomaBtn = document.querySelector(".idioma-btn");


function aplicarIdioma(lang) {

    traducoes.forEach(([seletor, posicao, textoEN]) => {

        const el = document.querySelectorAll(seletor)[posicao];

        if (!el) return;

        // Salva o texto original somente uma vez
        if (!textosOriginais.has(el)) {
            textosOriginais.set(el, el.innerHTML);
        }

        // Aplica o idioma escolhido
        if (lang === "en") {
            el.innerHTML = textoEN;
        } else {
            el.innerHTML = textosOriginais.get(el);
        }

    });

    document.documentElement.lang =
        lang === "en" ? "en" : "pt-BR";

    if (idiomaBtn) {
        idiomaBtn.textContent =
            lang === "en" ? "🌐 EN" : "🌐 PT-BR";
    }

    localStorage.setItem("idioma", lang);
}


// Inicializa o idioma
if (idiomaBtn) {

    aplicarIdioma(localStorage.getItem("idioma") || "pt");

    idiomaBtn.addEventListener("click", () => {

        const atual = localStorage.getItem("idioma") || "pt";

        aplicarIdioma(atual === "pt" ? "en" : "pt");

    });

}


// ==================================================
// COOKIES
// ==================================================

document.addEventListener("DOMContentLoaded", () => {

    const cookieBanner = document.getElementById("cookieBanner");

    const aceitarCookie = document.getElementById("aceitarCookie");

    const recusarCookie = document.getElementById("recusarCookie");

    const fecharCookie = document.getElementById("fecharCookie");


    // Verifica se o aviso existe na página
    if (!cookieBanner) {
        console.error("Aviso de cookies não encontrado!");
        return;
    }


    // Esconde o aviso e salva a escolha
    function esconderCookies(escolha) {

        cookieBanner.classList.add("esconder");

        localStorage.setItem("wn57_cookies", escolha);

    }


    // Verifica se o visitante já escolheu
    const escolhaSalva = localStorage.getItem("wn57_cookies_v2");

    if (escolhaSalva) {

        cookieBanner.classList.add("esconder");

    } else {

        // Se ainda não escolheu, mostra o aviso
        cookieBanner.classList.remove("esconder");

    }


    // Botão aceitar
    if (aceitarCookie) {
        aceitarCookie.addEventListener("click", () => {
            esconderCookies("aceito");
        });
    }


    // Botão recusar
    if (recusarCookie) {
        recusarCookie.addEventListener("click", () => {
            esconderCookies("recusado");
        });
    }


    // Botão fechar
    if (fecharCookie) {
        fecharCookie.addEventListener("click", () => {
            esconderCookies("fechado");
        });
    }

});


// ==================================================
// PERFIL DO USUÁRIO
// ==================================================

const CHAVE_USUARIO = "usuario";

const PAGINA_INICIAL = "/html/principal/inicial.html";


document.addEventListener("DOMContentLoaded", () => {

    const perfil = document.getElementById("perfil");

    const perfilBtn = document.getElementById("perfilBtn");

    const perfilMenu = document.getElementById("perfilMenu");

    const perfilNome = document.getElementById("perfilNome");

    const perfilNomeCurto = document.getElementById("perfilNomeCurto");

    const avatarMini = document.getElementById("avatarMini");

    const perfilFoto = document.getElementById("perfilFoto");

    const perfilSair = document.getElementById("perfilSair");


    // Verifica se os elementos existem
    if (!perfil || !perfilBtn || !perfilMenu) {
        return;
    }


    // Recupera o usuário salvo
    let usuario = null;

    try {

        usuario = JSON.parse(localStorage.getItem(CHAVE_USUARIO));

    } catch (erro) {

        console.error("Erro ao ler o usuário:", erro);

    }


    // Se não estiver logado, mantém os links de login
    if (!usuario || !usuario.nome) {

        document.documentElement.classList.remove("logado");

        return;

    }


    // Usuário conectado
    document.documentElement.classList.add("logado");


    const nome = usuario.nome.trim();

    const primeiroNome = nome.split(" ")[0];

    const inicial = nome.charAt(0).toUpperCase();


    // Preenche os dados do perfil
    if (perfilNome) {
        perfilNome.textContent = nome;
    }

    if (perfilNomeCurto) {
        perfilNomeCurto.textContent = primeiroNome;
    }

    if (avatarMini) {
        avatarMini.textContent = inicial;
    }

    if (perfilFoto) {
        perfilFoto.textContent = inicial;
    }


    // Mostra a foto do usuário, se existir
    if (usuario.foto) {

        const url = `url("${String(usuario.foto).replace(/"/g, "%22")}")`;

        [avatarMini, perfilFoto].forEach((el) => {

            if (!el) return;

            el.textContent = "";

            el.style.backgroundImage = url;

            el.style.backgroundSize = "cover";

            el.style.backgroundPosition = "center";

        });

    }


    // Abre e fecha o menu do perfil
    function alternarMenu(abrir) {

        const aberto = abrir ?? !perfilMenu.classList.contains("aberto");

        perfilMenu.classList.toggle("aberto", aberto);

        perfilBtn.setAttribute("aria-expanded", String(aberto));

    }


    // Clique no botão do perfil
    perfilBtn.addEventListener("click", (evento) => {

        evento.stopPropagation();

        alternarMenu();

    });


    // Clique dentro do menu
    perfilMenu.addEventListener("click", (evento) => {

        evento.stopPropagation();

    });


    // Fecha ao clicar fora
    document.addEventListener("click", () => {

        alternarMenu(false);

    });


    // Fecha ao apertar ESC
    document.addEventListener("keydown", (evento) => {

        if (evento.key === "Escape") {

            alternarMenu(false);

        }

    });


    // Sair da conta
    if (perfilSair) {

        perfilSair.addEventListener("click", () => {

            localStorage.removeItem(CHAVE_USUARIO);

            localStorage.removeItem("usuarioLogado");

            window.location.href = PAGINA_INICIAL;

        });

    }

});


// ==================================================
// FIM DO JAVASCRIPT WN57
// ==================================================

console.log("Todas as funções da página inicial foram carregadas!");
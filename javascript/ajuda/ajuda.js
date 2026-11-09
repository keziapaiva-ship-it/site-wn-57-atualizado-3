// ================================
// MENU DE IDIOMAS
// ================================

function toggleIdioma() {
    const menu = document.getElementById("menuIdiomas");

    if (!menu) {
        console.error("Elemento #menuIdiomas não encontrado.");
        return;
    }

    menu.classList.toggle("aberto");
}


// ================================
// TRADUÇÕES
// ================================

const traducoes = {

    pt: {
        idioma: "🌐 PT-BR",

        titulo: "Olá! Como podemos<br>ajudar você?",
        descricao: "Encontre respostas para suas dúvidas sobre o WN57.<br>Escolha uma categoria para encontrar a ajuda que precisa.",

        viagens: "Viagens",
        viagensDesc: "Problemas durante sua viagem",

        corrida: "Solicitar uma corrida",
        corridaDesc: "Como solicitar e acompanhar",

        pagamento: "Pagamento",
        pagamentoDesc: "PIX, cartão e dinheiro",

        conta: "Minha conta",
        contaDesc: "Cadastro, login e perfil",

        motoristas: "Motoristas",
        motoristasDesc: "Informações sobre motoristas",

        seguranca: "Segurança",
        segurancaDesc: "Segurança durante a viagem",

        problemas: "Problemas",
        problemasDesc: "Relate um problema",

        outros: "Outros assuntos",
        outrosDesc: "Precisa de outra ajuda?",

        ajuda: "Acesse a Central de Ajuda",
        empresa: "Empresa",
        quemSomos: "Quem somos",
        investidores: "Investidores",
        blog: "Blog",
        carreiras: "Carreiras",

        produtos: "Produtos",
        viajar: "Viajar",
        gift: "Gift cards",
        health: "WN57 Health",
        advertising: "WN57 Advertising",

        cidadania: "Cidadania global",
        sustentabilidade: "Sustentabilidade",

        viagem: "Viagem",
        reservar: "Reservar",
        aeroportos: "Aeroportos",
        hoteis: "Hotéis",
        cidades: "Cidades",

        idiomaRodape: "🌐 Português (Brasil)",
        localizacao: "📍 Curitiba",

        privacidade: "Privacidade",
        termos: "Termos",
        acessibilidade: "Acessibilidade"
    },


    en: {
        idioma: "🌐 EN",

        titulo: "Hello! How can we<br>help you?",
        descricao: "Find answers to your questions about WN57.<br>Choose a category to find the help you need.",

        viagens: "Trips",
        viagensDesc: "Problems during your trip",

        corrida: "Request a ride",
        corridaDesc: "How to request and track",

        pagamento: "Payment",
        pagamentoDesc: "PIX, card and cash",

        conta: "My account",
        contaDesc: "Registration, login and profile",

        motoristas: "Drivers",
        motoristasDesc: "Information about drivers",

        seguranca: "Safety",
        segurancaDesc: "Safety during your trip",

        problemas: "Problems",
        problemasDesc: "Report a problem",

        outros: "Other topics",
        outrosDesc: "Need other help?",

        ajuda: "Access Help Center",
        empresa: "Company",
        quemSomos: "About us",
        investidores: "Investors",
        blog: "Blog",
        carreiras: "Careers",

        produtos: "Products",
        viajar: "Ride",
        gift: "Gift cards",
        health: "WN57 Health",
        advertising: "WN57 Advertising",

        cidadania: "Global citizenship",
        sustentabilidade: "Sustainability",

        viagem: "Travel",
        reservar: "Book",
        aeroportos: "Airports",
        hoteis: "Hotels",
        cidades: "Cities",

        idiomaRodape: "🌐 English",
        localizacao: "📍 Curitiba",

        privacidade: "Privacy",
        termos: "Terms",
        acessibilidade: "Accessibility"
    },


    es: {
        idioma: "🌐 ES",

        titulo: "¡Hola! ¿Cómo podemos<br>ayudarte?",
        descricao: "Encuentra respuestas a tus preguntas sobre WN57.<br>Elige una categoría para encontrar la ayuda que necesitas.",

        viagens: "Viajes",
        viagensDesc: "Problemas durante tu viaje",

        corrida: "Solicitar un viaje",
        corridaDesc: "Cómo solicitar y seguir",

        pagamento: "Pago",
        pagamentoDesc: "PIX, tarjeta y efectivo",

        conta: "Mi cuenta",
        contaDesc: "Registro, inicio de sesión y perfil",

        motoristas: "Conductores",
        motoristasDesc: "Información sobre conductores",

        seguranca: "Seguridad",
        segurancaDesc: "Seguridad durante el viaje",

        problemas: "Problemas",
        problemasDesc: "Reportar un problema",

        outros: "Otros temas",
        outrosDesc: "¿Necesitas otra ayuda?",

        ajuda: "Acceder al Centro de Ayuda",
        empresa: "Empresa",
        quemSomos: "Quiénes somos",
        investidores: "Inversores",
        blog: "Blog",
        carreiras: "Carreras",

        produtos: "Productos",
        viajar: "Viajar",
        gift: "Tarjetas de regalo",
        health: "WN57 Health",
        advertising: "WN57 Advertising",

        cidadania: "Ciudadanía global",
        sustentabilidade: "Sostenibilidad",

        viagem: "Viajes",
        reservar: "Reservar",
        aeroportos: "Aeropuertos",
        hoteis: "Hoteles",
        cidades: "Ciudades",

        idiomaRodape: "🌐 Español",
        localizacao: "📍 Curitiba",

        privacidade: "Privacidad",
        termos: "Términos",
        acessibilidade: "Accesibilidad"
    }
};


// ================================
// TROCAR IDIOMA
// ================================

function trocarIdioma(idioma) {

    const t = traducoes[idioma];

    if (!t) {
        console.error("Idioma não encontrado:", idioma);
        return;
    }


    // Botão do idioma
    const botaoIdioma = document.querySelector(".idioma");

    if (botaoIdioma) {
        botaoIdioma.textContent = t.idioma;
    }


    // ================================
    // CONTEÚDO
    // ================================

    alterar("titulo-ajuda", t.titulo, true);
    alterar("descricao-ajuda", t.descricao, true);

    alterar("cat-viagens", t.viagens);
    alterar("desc-viagens", t.viagensDesc);

    alterar("cat-corrida", t.corrida);
    alterar("desc-corrida", t.corridaDesc);

    alterar("cat-pagamento", t.pagamento);
    alterar("desc-pagamento", t.pagamentoDesc);

    alterar("cat-conta", t.conta);
    alterar("desc-conta", t.contaDesc);

    alterar("cat-motoristas", t.motoristas);
    alterar("desc-motoristas", t.motoristasDesc);

    alterar("cat-seguranca", t.seguranca);
    alterar("desc-seguranca", t.segurancaDesc);

    alterar("cat-problemas", t.problemas);
    alterar("desc-problemas", t.problemasDesc);

    alterar("cat-outros", t.outros);
    alterar("desc-outros", t.outrosDesc);


    // ================================
    // RODAPÉ
    // ================================

    alterar("rodape-ajuda", t.ajuda);

    alterar("rodape-empresa", t.empresa);
    alterar("rodape-quem-somos", t.quemSomos);
    alterar("rodape-investidores", t.investidores);
    alterar("rodape-blog", t.blog);
    alterar("rodape-carreiras", t.carreiras);

    alterar("rodape-produtos", t.produtos);
    alterar("rodape-viajar", t.viajar);
    alterar("rodape-gift", t.gift);
    alterar("rodape-health", t.health);
    alterar("rodape-advertising", t.advertising);

    alterar("rodape-cidadania", t.cidadania);
    alterar("rodape-seguranca", t.seguranca);
    alterar("rodape-sustentabilidade", t.sustentabilidade);

    alterar("rodape-viagem", t.viagem);
    alterar("rodape-reservar", t.reservar);
    alterar("rodape-aeroportos", t.aeroportos);
    alterar("rodape-hoteis", t.hoteis);
    alterar("rodape-cidades", t.cidades);

    alterar("rodape-idioma", t.idiomaRodape);
    alterar("rodape-localizacao", t.localizacao);

    alterar("rodape-privacidade", t.privacidade);
    alterar("rodape-termos", t.termos);
    alterar("rodape-acessibilidade", t.acessibilidade);


    // Salvar idioma
    localStorage.setItem("idiomaWN57", idioma);


    // Fechar menu
    const menu = document.getElementById("menuIdiomas");

    if (menu) {
        menu.classList.remove("aberto");
    }
}


// ================================
// FUNÇÃO AUXILIAR
// ================================

function alterar(id, texto, html = false) {

    const elemento = document.getElementById(id);

    if (!elemento) {
        return;
    }

    if (html) {
        elemento.innerHTML = texto;
    } else {
        elemento.textContent = texto;
    }
}


// ================================
// CARREGAR IDIOMA SALVO
// ================================

document.addEventListener("DOMContentLoaded", function () {

    const idiomaSalvo =
        localStorage.getItem("idiomaWN57") || "pt";

    trocarIdioma(idiomaSalvo);

});
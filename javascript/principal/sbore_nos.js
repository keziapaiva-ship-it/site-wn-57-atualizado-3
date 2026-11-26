
"use strict";

/* =====================================================
   WN57 - SOBRE NÓS
   TRADUÇÃO + CARROSSEL + MENU DE PERFIL
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    /* =================================================
       1. TRADUÇÃO PT-BR / EN
    ================================================= */

    const CHAVE_IDIOMA = "wn57_idioma";

    let idiomaAtual = localStorage.getItem(CHAVE_IDIOMA) || "pt";

    const traducoes = {

        pt: {
            home: "Início",
            ride: "Viajar",
            about: "Sobre nós",
            help: "Ajuda",
            login: "Fazer login",
            signup: "Cadastre-se",
            security: "🛡️ Segurança",
            activity: "📋 Atividade",
            manageAccount: "👤 Gerenciar conta",
            requestRide: "🚗 Pedir corrida",
            support: "💬 Suporte",
            logout: "Sair",

            heroTitle: "Muito mais que apenas mobilidade.",
            heroText: "Somos o WN57, uma plataforma de mobilidade desenvolvida para proporcionar mais segurança, liberdade e tranquilidade às mulheres. Acreditamos que toda mulher merece se deslocar com confiança e autonomia.",

            aboutSubtitle: "Nossa essência e história",
            aboutTitle: "Quem é a WN57",

            summaryTitle: "Mobilidade feita por mulheres, para mulheres",
            summaryText1: "A WN57 nasceu para transformar a rotina de deslocamento das mulheres com mais acolhimento, segurança e autonomia. Combinamos tecnologia, atenção aos detalhes e uma rede pensada para que cada passageira viaje com tranquilidade do embarque ao destino.",
            summaryText2: "Desenvolvemos uma plataforma que coloca a segurança feminina no centro de cada escolha, criando uma experiência de transporte mais confortável, acessível e confiável para o dia a dia.",
            summaryText3: "Acreditamos que cada viagem representa liberdade, independência e novas oportunidades para seguir em frente com confiança e respeito.",

            safety: "Segurança",
            safetyText: "Foco total em proteção em cada rota",
            care: "Acolhimento",
            careText: "Respeito e confiança do início ao fim",
            freedom: "Liberdade",
            freedomText: "Mais autonomia para ir e vir",

            purpose: "PROPÓSITO",
            purposeText: "O WN57 nasceu para transformar a experiência de mobilidade das mulheres, criando um ambiente acolhedor, respeitado e protegido.",

            safetyTitle: "SEGURANÇA",
            safetyCardText: "Colocamos a segurança feminina no centro de cada decisão, com transporte confortável, acessível e confiável.",

            freedomTitle: "LIBERDADE",
            freedomCardText: "Acreditamos que a mobilidade representa independência e novas possibilidades para cada mulher.",

            careTitle: "CUIDADO",
            careCardText: "Construímos uma rede baseada no respeito, na confiança e no cuidado em cada trajeto.",

            transparency: "TRANSPARÊNCIA",
            transparencyText: "Informações claras em todas as etapas para você acompanhar cada trajeto com segurança.",

            comfort: "CONFORTO",
            comfortText: "Viagens pensadas para oferecer bem-estar, praticidade e tranquilidade no dia a dia.",

            community: "COMUNIDADE",
            communityText: "Uma rede construída para fortalecer mulheres que buscam segurança e independência.",

            evolution: "EVOLUÇÃO",
            evolutionText: "Aprimoramos constantemente a plataforma para entregar uma experiência cada vez melhor.",

            missionCardTitle: "Nossos<br>Propósitos",
            pillar1: "Pilar 01",
            pillar2: "Pilar 02",
            pillar3: "Pilar 03",
            pillarSafety: "Segurança",
            pillarFreedom: "Liberdade",
            pillarTrust: "Confiança",

            madeForWomen: "Feito para mulheres",
            respectEmpathy: "Respeito, empatia e acolhimento",
            requestTrip: "Solicitar Viagem",

            missionTitle: "Nossos<br>Propósitos",
            missionText1: "Nosso compromisso vai além de levar você ao seu destino. Queremos tornar cada trajeto uma experiência de respeito, acolhimento e tranquilidade.",
            missionText2: "Trabalhamos para oferecer uma plataforma que valorize a segurança, o conforto e a autonomia das mulheres.",
            missionText3: "Nosso objetivo é construir uma experiência de mobilidade baseada na confiança, na responsabilidade e no cuidado.",
            exploreRides: "Explorar viagens",

            valuesTitle: "Nossos valores<br>nos movem.",
            valuesDescription: "Mais do que oferecer mobilidade, queremos construir uma experiência baseada no respeito, na confiança e na liberdade de cada mulher.",

            respect: "Respeito",
            respectText: "Valorizamos cada mulher, sua história e suas escolhas.",
            empathy: "Empatia",
            empathyText: "Entendemos as necessidades de cada passageira.",
            responsibility: "Responsabilidade",
            responsibilityText: "Assumimos o compromisso de priorizar o cuidado.",
            trust: "Confiança",
            trustText: "Construímos relações transparentes e acolhedoras.",

            discover: "Conheça a WN57",

            womenMobility: "Mobilidade feminina",
            differentialTitle: "Uma nova forma<br>de se sentir segura.",
            differentialText: "A WN57 foi desenvolvida pensando nas necessidades das mulheres. Nosso diferencial está em colocar a segurança feminina no centro de cada viagem, proporcionando mais conforto, acolhimento e liberdade.",
            moreFreedom: "Mais liberdade para ir e vir.",

            footerCopyright: "© 2026 WN57 - Mobilidade Premium. Todos os direitos reservados.",
            footerText: "Mobilidade com mais segurança, liberdade e confiança."
        },

        en: {
            home: "Home",
            ride: "Ride",
            about: "About us",
            help: "Help",
            login: "Log in",
            signup: "Sign up",
            security: "🛡️ Safety",
            activity: "📋 Activity",
            manageAccount: "👤 Manage account",
            requestRide: "🚗 Request a ride",
            support: "💬 Support",
            logout: "Log out",

            heroTitle: "Much more than just mobility.",
            heroText: "WN57 is a mobility platform designed to provide women with greater safety, freedom and peace of mind. We believe every woman deserves to travel with confidence and independence.",

            aboutSubtitle: "Our essence and story",
            aboutTitle: "Who is WN57",

            summaryTitle: "Mobility made by women, for women",
            summaryText1: "WN57 was created to transform women's daily journeys with greater care, safety and independence. We combine technology, attention to detail and a network designed to ensure every passenger travels with peace of mind from pickup to destination.",
            summaryText2: "We developed a platform that puts women's safety at the center of every decision, creating a more comfortable, accessible and reliable transportation experience for everyday life.",
            summaryText3: "We believe every journey represents freedom, independence and new opportunities to move forward with confidence and respect.",

            safety: "Safety",
            safetyText: "Total focus on protection on every route",
            care: "Care",
            careText: "Respect and trust from beginning to end",
            freedom: "Freedom",
            freedomText: "More independence to come and go",

            purpose: "PURPOSE",
            purposeText: "WN57 was created to transform women's mobility experience by creating a welcoming, respectful and protected environment.",

            safetyTitle: "SAFETY",
            safetyCardText: "We put women's safety at the center of every decision, offering comfortable, accessible and reliable transportation.",

            freedomTitle: "FREEDOM",
            freedomCardText: "We believe mobility represents independence and new possibilities for every woman.",

            careTitle: "CARE",
            careCardText: "We build a network based on respect, trust and care on every journey.",

            transparency: "TRANSPARENCY",
            transparencyText: "Clear information at every stage so you can follow each journey safely.",

            comfort: "COMFORT",
            comfortText: "Journeys designed to offer well-being, convenience and peace of mind every day.",

            community: "COMMUNITY",
            communityText: "A network built to empower women seeking safety and independence.",

            evolution: "EVOLUTION",
            evolutionText: "We constantly improve the platform to deliver an increasingly better experience.",

            missionCardTitle: "Our<br>Purpose",
            pillar1: "Pillar 01",
            pillar2: "Pillar 02",
            pillar3: "Pillar 03",
            pillarSafety: "Safety",
            pillarFreedom: "Freedom",
            pillarTrust: "Trust",

            madeForWomen: "Made for women",
            respectEmpathy: "Respect, empathy and care",
            requestTrip: "Request a Ride",

            missionTitle: "Our<br>Purpose",
            missionText1: "Our commitment goes beyond taking you to your destination. We want to make every journey an experience of respect, care and peace of mind.",
            missionText2: "We work to offer a platform that values women's safety, comfort and independence.",
            missionText3: "Our goal is to build a mobility experience based on trust, responsibility and care.",
            exploreRides: "Explore rides",

            valuesTitle: "Our values<br>move us forward.",
            valuesDescription: "More than offering mobility, we want to build an experience based on respect, trust and the freedom of every woman.",

            respect: "Respect",
            respectText: "We value every woman, her story and her choices.",
            empathy: "Empathy",
            empathyText: "We understand the needs of every passenger.",
            responsibility: "Responsibility",
            responsibilityText: "We are committed to prioritizing care.",
            trust: "Trust",
            trustText: "We build transparent and welcoming relationships.",

            discover: "Discover WN57",

            womenMobility: "Women's mobility",
            differentialTitle: "A new way<br>to feel safe.",
            differentialText: "WN57 was developed with women's needs in mind. Our difference lies in putting women's safety at the center of every journey, providing greater comfort, care and freedom.",
            moreFreedom: "More freedom to come and go.",

            footerCopyright: "© 2026 WN57 - Premium Mobility. All rights reserved.",
            footerText: "Mobility with greater safety, freedom and confidence."
        }
    };

    function aplicarIdioma() {

        const dicionario = traducoes[idiomaAtual];

        document.documentElement.lang =
            idiomaAtual === "pt" ? "pt-BR" : "en";

        document.title =
            idiomaAtual === "pt"
                ? "Sobre Nós | WN57"
                : "About Us | WN57";

        // Traduz os elementos com data-i18n
        document.querySelectorAll("[data-i18n]").forEach(elemento => {

            const chave = elemento.dataset.i18n;

            if (dicionario[chave] !== undefined) {
                elemento.textContent = dicionario[chave];
            }

        });

        // Traduz os elementos que precisam manter quebras de linha
        document.querySelectorAll("[data-i18n-html]").forEach(elemento => {

            const chave = elemento.dataset.i18nHtml;

            if (dicionario[chave] !== undefined) {
                elemento.innerHTML = dicionario[chave];
            }

        });

        // Atualiza o botão de idioma
        const botaoIdioma = document.getElementById("btnIdioma");

        if (botaoIdioma) {
            botaoIdioma.textContent =
                idiomaAtual === "pt" ? "🌐 PT-BR" : "🌐 EN";

            botaoIdioma.setAttribute(
                "aria-label",
                idiomaAtual === "pt"
                    ? "Mudar idioma para inglês"
                    : "Change language to Portuguese"
            );
        }

        // Atualiza os textos acessíveis do carrossel
        const anterior = document.getElementById("aboutPrev");
        const proximo = document.getElementById("aboutNext");

        if (anterior) {
            anterior.setAttribute(
                "aria-label",
                idiomaAtual === "pt" ? "Etapa anterior" : "Previous step"
            );
        }

        if (proximo) {
            proximo.setAttribute(
                "aria-label",
                idiomaAtual === "pt" ? "Próxima etapa" : "Next step"
            );
        }

        const indicadores = document.querySelectorAll(
            "#aboutIndicator .bar"
        );

        const nomesIndicadores = idiomaAtual === "pt"
            ? [
                "Resumo sobre a WN57",
                "Pilares da WN57",
                "Diferenciais da WN57"
            ]
            : [
                "WN57 overview",
                "WN57 pillars",
                "WN57 advantages"
            ];

        indicadores.forEach((indicador, index) => {
            if (nomesIndicadores[index]) {
                indicador.setAttribute(
                    "aria-label",
                    nomesIndicadores[index]
                );
            }
        });

        localStorage.setItem(CHAVE_IDIOMA, idiomaAtual);
    }

    const botaoIdioma = document.getElementById("btnIdioma");

    if (botaoIdioma) {
        botaoIdioma.addEventListener("click", function () {

            idiomaAtual = idiomaAtual === "pt" ? "en" : "pt";

            aplicarIdioma();

        });
    }

    aplicarIdioma();


    /* =================================================
       2. CARROSSEL - QUEM É A WN57
    ================================================= */

    const track = document.getElementById("aboutTrack");
    const botaoAnterior = document.getElementById("aboutPrev");
    const botaoProximo = document.getElementById("aboutNext");

    const indicadores = Array.from(
        document.querySelectorAll("#aboutIndicator .bar")
    );

    if (track && botaoAnterior && botaoProximo) {

        const slides = Array.from(
            track.querySelectorAll(".about-slide")
        );

        let slideAtual = 0;
        const totalSlides = slides.length;

        // Impede que a largura dos slides cause deslocamento incorreto.
        track.style.display = "flex";
        track.style.width = "100%";
        track.style.transition = "transform 0.45s ease";

        slides.forEach(slide => {
            slide.style.flex = "0 0 100%";
            slide.style.minWidth = "100%";
        });

        function atualizarCarrossel() {

            track.style.transform =
                "translate3d(-" + (slideAtual * 100) + "%, 0, 0)";

            // Esconde a seta anterior no primeiro slide.
            botaoAnterior.classList.toggle(
                "is-hidden",
                slideAtual === 0
            );

            // Esconde a seta próxima no último slide.
            botaoProximo.classList.toggle(
                "is-hidden",
                slideAtual === totalSlides - 1
            );

            // Atualiza os indicadores.
            indicadores.forEach((indicador, index) => {

                indicador.classList.toggle(
                    "active",
                    index === slideAtual
                );

                indicador.setAttribute(
                    "aria-current",
                    index === slideAtual ? "true" : "false"
                );

            });

        }

        function irParaSlide(indice) {

            if (indice < 0 || indice >= totalSlides) {
                return;
            }

            slideAtual = indice;
            atualizarCarrossel();

        }

        // Avançar
        botaoProximo.addEventListener("click", function (evento) {

            evento.preventDefault();
            evento.stopPropagation();

            if (slideAtual < totalSlides - 1) {
                irParaSlide(slideAtual + 1);
            }

        });

        // Voltar
        botaoAnterior.addEventListener("click", function (evento) {

            evento.preventDefault();
            evento.stopPropagation();

            if (slideAtual > 0) {
                irParaSlide(slideAtual - 1);
            }

        });

        // Clicar nos indicadores
        indicadores.forEach((indicador, index) => {

            indicador.addEventListener("click", function (evento) {

                evento.preventDefault();
                irParaSlide(index);

            });

        });

        // Navegação por teclado
        const areaCarrossel = document.querySelector(
            ".about-carousel-wrapper"
        );

        if (areaCarrossel) {

            areaCarrossel.addEventListener("keydown", function (evento) {

                if (evento.key === "ArrowRight") {
                    irParaSlide(Math.min(slideAtual + 1, totalSlides - 1));
                }

                if (evento.key === "ArrowLeft") {
                    irParaSlide(Math.max(slideAtual - 1, 0));
                }

            });

        }

        // Estado inicial
        atualizarCarrossel();

    } else {
        console.error(
            "WN57: não foi possível iniciar o carrossel. Confira os IDs aboutTrack, aboutPrev e aboutNext."
        );
    }


    /* =================================================
       3. MENU DE PERFIL
    ================================================= */

    const perfil = document.getElementById("perfil");
    const perfilBtn = document.getElementById("perfilBtn");
    const perfilMenu = document.getElementById("perfilMenu");

    if (perfil && perfilBtn && perfilMenu) {

        perfilBtn.addEventListener("click", function (evento) {

            evento.preventDefault();
            evento.stopPropagation();

            perfil.classList.toggle("ativo");

            const aberto = perfil.classList.contains("ativo");

            perfilBtn.setAttribute(
                "aria-expanded",
                aberto ? "true" : "false"
            );

        });

        document.addEventListener("click", function (evento) {

            if (!perfil.contains(evento.target)) {
                perfil.classList.remove("ativo");
                perfilBtn.setAttribute("aria-expanded", "false");
            }

        });

        document.addEventListener("keydown", function (evento) {

            if (evento.key === "Escape") {
                perfil.classList.remove("ativo");
                perfilBtn.setAttribute("aria-expanded", "false");
            }

        });

    }

});

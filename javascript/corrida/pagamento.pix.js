
(function () {

    "use strict";

    // =========================
    // UTILITÁRIOS
    // =========================

    function definirTexto(id, texto) {

        const elemento = document.getElementById(id);

        if (elemento) {
            elemento.textContent = texto;
        }

    }

    function idiomaAtual() {
        return localStorage.getItem("wn57_idioma") || "pt";
    }

    // =========================
    // VALOR DA CORRIDA
    // =========================

    function carregarValor() {

        const valor = Number(localStorage.getItem("valorCorrida")) || 15;

        definirTexto(
            "valor",
            valor.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
            })
        );

    }

    // =========================
    // GERAR CÓDIGO PIX
    // =========================

    function carregarPix() {

        const codigo = localStorage.getItem("codigoPix") ||
            "00020126580014BR.GOV.BCB.PIX0136wn57-pagamento-corrida5204000053039865802BR";

        const campo = document.getElementById("codigoPix");

        if (campo) {
            campo.value = codigo;
        }

        const qr = document.getElementById("qrCode");

        if (qr) {

            qr.src =
                "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=" +
                encodeURIComponent(codigo);

        }

    }

    // =========================
    // COPIAR PIX
    // =========================

    window.copiarPix = async function () {

        const campo = document.getElementById("codigoPix");

        if (!campo) return;

        const ingles = idiomaAtual() === "en";

        try {

            await navigator.clipboard.writeText(campo.value);

            alert(
                ingles
                    ? "PIX code copied successfully!"
                    : "Código PIX copiado com sucesso!"
            );

        } catch (erro) {

            campo.select();
            document.execCommand("copy");

            alert(
                ingles
                    ? "PIX code copied!"
                    : "Código PIX copiado!"
            );

        }

    };

    // =========================
    // REGISTRAR PAGAMENTO
    // =========================

    function registrarPagamento() {

        localStorage.setItem("pagamentoStatus", "debitado");

        localStorage.setItem("pagamentoConfirmado", "true");

        localStorage.setItem("pagamentoCorrida", "PIX");

        localStorage.setItem(
            "dataPagamento",
            new Date().toISOString()
        );

    }

    // =========================
    // CONFIRMAR PIX
    // =========================

    window.confirmarPix = function () {

        const ingles = idiomaAtual() === "en";

        const mensagem = ingles
            ? "Do you confirm that you have made the PIX payment?"
            : "Você confirma que realizou o pagamento via PIX?";

        if (!confirm(mensagem)) return;

        registrarPagamento();

        alert(
            ingles
                ? "Payment confirmed successfully!"
                : "Pagamento confirmado com sucesso!"
        );

        window.location.href = "/html/principal/inicial.html";

    };

    // =========================
    // ATUALIZAR IDIOMA
    // =========================

    function atualizarIdioma() {

        const ingles = idiomaAtual() === "en";

        document.documentElement.lang = ingles ? "en" : "pt-BR";

        // PÁGINA PIX

        definirTexto(
            "tituloPagamento",
            ingles ? "PIX Payment" : "Pagamento via PIX"
        );

        definirTexto(
            "descricaoPagamento",
            ingles
                ? "Your ride is finished! Complete the payment to finish."
                : "Sua corrida foi finalizada! Realize o pagamento para concluir."
        );

        definirTexto(
            "textoValor",
            ingles ? "Total ride amount" : "Valor total da corrida"
        );

        definirTexto(
            "instrucaoPix",
            ingles
                ? "Open your bank app, select PIX and scan the QR Code."
                : "Abra o aplicativo do seu banco, escolha PIX e escaneie o QR Code."
        );

        definirTexto(
            "botaoCopiar",
            ingles ? "Copy" : "Copiar"
        );

        definirTexto(
            "statusTexto",
            ingles
                ? "Waiting for payment confirmation"
                : "Aguardando confirmação do pagamento"
        );

        definirTexto(
            "botaoConfirmar",
            ingles
                ? "I have made the payment →"
                : "Já realizei o pagamento →"
        );

        definirTexto(
            "voltarInicio",
            ingles ? "Back to home" : "Voltar ao início"
        );

        // CABEÇALHO

        definirTexto("botaoIdioma", ingles ? "🌐 EN" : "🌐 PT-BR");

        definirTexto("menuInicio", ingles ? "Home" : "Início");

        definirTexto("menuViajar", ingles ? "Ride" : "Viajar");

        definirTexto("menuSobre", ingles ? "About us" : "Sobre-nós");

        definirTexto("menuAjuda", ingles ? "Help" : "Ajuda");

        definirTexto("menuLogin", ingles ? "Log in" : "Fazer login");

        definirTexto("menuCadastro", ingles ? "Sign up" : "Cadastre-se");

    }

    // =========================
    // TROCAR IDIOMA
    // =========================

    function trocarIdioma(evento) {

        if (evento) {
            evento.preventDefault();
        }

        const novoIdioma = idiomaAtual() === "pt" ? "en" : "pt";

        localStorage.setItem("wn57_idioma", novoIdioma);

        atualizarIdioma();

    }

    // Disponibiliza para o cabeçalho
    window.alternarIdioma = trocarIdioma;

    window.atualizarIdiomaPagamento = atualizarIdioma;

    // =========================
    // BOTÃO DE IDIOMA
    // =========================

    // Usa somente UM evento de clique.
    // Não adiciona outro listener que possa duplicar a troca.

    document.addEventListener("click", function (evento) {

        const botao = evento.target.closest(
            "#botaoIdioma, .botao-idioma, .language-button, [data-idioma]"
        );

        if (!botao) return;

        evento.preventDefault();

        trocarIdioma();

    }, true);

    // =========================
    // MAPA
    // =========================

    function iniciarMapa() {

        if (typeof L === "undefined") return;

        const elemento = document.getElementById("map");

        if (!elemento) return;

        const mapa = L.map("map").setView([-25.442, -49.192], 15);

        L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                attribution: "&copy; OpenStreetMap"
            }
        ).addTo(mapa);

    }

    // =========================
    // INICIALIZAÇÃO
    // =========================

    function iniciarPagina() {

        carregarValor();

        carregarPix();

        atualizarIdioma();

        iniciarMapa();

    }

    if (document.readyState === "loading") {

        document.addEventListener("DOMContentLoaded", iniciarPagina);

    } else {

        iniciarPagina();

    }

})();

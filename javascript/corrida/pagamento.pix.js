
(function () {
    "use strict";

    // =========================
    // UTILITÁRIOS
    // =========================

    function definirTexto(id, texto) {
        const elemento = document.getElementById(id);
        if (elemento) elemento.textContent = texto;
    }

    function idiomaAtual() {
        return localStorage.getItem("wn57_idioma") || "pt";
    }

    function estaEmIngles() {
        return idiomaAtual() === "en";
    }

    // =========================
    // ESTILOS DOS MODAIS
    // =========================

    function adicionarEstilosModal() {
        if (document.getElementById("estiloModalPIX")) return;

        const estilo = document.createElement("style");
        estilo.id = "estiloModalPIX";

        estilo.textContent = `
            .wn-modal-overlay {
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.75);
                backdrop-filter: blur(7px);
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
                z-index: 99999;
                opacity: 0;
                visibility: hidden;
                transition: .25s ease;
            }

            .wn-modal-overlay.ativo {
                opacity: 1;
                visibility: visible;
            }

            .wn-modal {
                width: 100%;
                max-width: 420px;
                background: #202023;
                border: 1px solid rgba(255, 45, 120, .35);
                border-radius: 20px;
                padding: 30px;
                text-align: center;
                box-shadow: 0 20px 60px rgba(0, 0, 0, .5);
                transform: translateY(15px) scale(.97);
                transition: .25s ease;
                font-family: 'DM Sans', sans-serif;
            }

            .wn-modal-overlay.ativo .wn-modal {
                transform: translateY(0) scale(1);
            }

            .wn-modal-icone {
                width: 58px;
                height: 58px;
                margin: 0 auto 18px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                background: rgba(255, 45, 120, .13);
                color: #ff2d78;
                font-size: 27px;
            }

            .wn-modal h3 {
                color: #fff;
                font-size: 21px;
                font-weight: 700;
                margin: 0 0 10px;
            }

            .wn-modal p {
                color: #aaaab3;
                font-size: 14px;
                line-height: 1.6;
                margin: 0 0 25px;
            }

            .wn-modal-botoes {
                display: flex;
                gap: 12px;
            }

            .wn-modal-botoes button {
                flex: 1;
                border: none;
                border-radius: 10px;
                padding: 13px 16px;
                font-family: inherit;
                font-size: 14px;
                font-weight: 700;
                cursor: pointer;
                transition: .2s ease;
            }

            .wn-modal-cancelar {
                background: #303035;
                color: #fff;
            }

            .wn-modal-cancelar:hover {
                background: #414149;
            }

            .wn-modal-confirmar {
                background: #ff2d78;
                color: #fff;
            }

            .wn-modal-confirmar:hover {
                background: #e91e68;
                transform: translateY(-2px);
            }

            .wn-toast {
                position: fixed;
                bottom: 25px;
                left: 50%;
                transform: translate(-50%, 20px);
                background: #202023;
                color: #fff;
                border: 1px solid rgba(255, 45, 120, .5);
                border-radius: 12px;
                padding: 15px 22px;
                font-family: 'DM Sans', sans-serif;
                font-size: 14px;
                font-weight: 600;
                box-shadow: 0 10px 35px rgba(0, 0, 0, .4);
                opacity: 0;
                visibility: hidden;
                transition: .25s ease;
                z-index: 100000;
                text-align: center;
                width: max-content;
                max-width: calc(100% - 40px);
            }

            .wn-toast.ativo {
                opacity: 1;
                visibility: visible;
                transform: translate(-50%, 0);
            }

            @media (max-width: 480px) {
                .wn-modal {
                    padding: 25px 20px;
                }

                .wn-modal h3 {
                    font-size: 19px;
                }

                .wn-modal-botoes {
                    flex-direction: column-reverse;
                }
            }
        `;

        document.head.appendChild(estilo);
    }

    // =========================
    // MODAL PERSONALIZADO
    // =========================


function criarModal() {
    if (document.getElementById("modalPIX")) return;

    const modal = document.createElement("div");
    modal.id = "modalPIX";
    modal.className = "wn-modal-overlay";

    modal.innerHTML = `
        <div class="wn-modal" role="dialog" aria-modal="true"
             aria-labelledby="tituloModalPIX">

            <div class="wn-modal-icone">?</div>

            <h3 id="tituloModalPIX"></h3>

            <p id="mensagemModalPIX"></p>

            <div class="wn-modal-botoes">
                <button type="button" class="wn-modal-cancelar"
                        id="cancelarModalPIX">
                    Cancelar
                </button>

                <button type="button" class="wn-modal-confirmar"
                        id="confirmarModalPIX">
                    Confirmar corrida <span>→</span>
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

function mostrarConfirmacao(titulo, mensagem) {
    return new Promise((resolve) => {
        criarModal();

        const modal = document.getElementById("modalPIX");
        const cancelar = document.getElementById("cancelarModalPIX");
        const confirmar = document.getElementById("confirmarModalPIX");

        document.getElementById("tituloModalPIX").textContent = titulo;
        document.getElementById("mensagemModalPIX").textContent = mensagem;

        cancelar.textContent = estaEmIngles() ? "Cancel" : "Cancelar";

        confirmar.innerHTML = estaEmIngles()
            ? 'Confirm payment <span>→</span>'
            : 'Confirmar pagamento <span>→</span>';

        modal.classList.add("ativo");

        function fechar(resultado) {
            modal.classList.remove("ativo");

            cancelar.removeEventListener("click", aoCancelar);
            confirmar.removeEventListener("click", aoConfirmar);
            modal.removeEventListener("click", aoFundo);
            document.removeEventListener("keydown", aoTeclado);

            resolve(resultado);
        }

        function aoCancelar() {
            fechar(false);
        }

        function aoConfirmar() {
            fechar(true);
        }

        function aoFundo(evento) {
            if (evento.target === modal) fechar(false);
        }

        function aoTeclado(evento) {
            if (evento.key === "Escape") fechar(false);
        }

        cancelar.addEventListener("click", aoCancelar);
        confirmar.addEventListener("click", aoConfirmar);
        modal.addEventListener("click", aoFundo);
        document.addEventListener("keydown", aoTeclado);
    });
}

    function mostrarConfirmacao(titulo, mensagem) {
        return new Promise((resolve) => {
            criarModal();

            const modal = document.getElementById("modalPIX");
            const tituloElemento = document.getElementById("tituloModalPIX");
            const mensagemElemento = document.getElementById("mensagemModalPIX");
            const cancelar = document.getElementById("cancelarModalPIX");
            const confirmar = document.getElementById("confirmarModalPIX");

            tituloElemento.textContent = titulo;
            mensagemElemento.textContent = mensagem;

            cancelar.textContent = estaEmIngles() ? "Cancel" : "Cancelar";
            confirmar.textContent = estaEmIngles() ? "Confirm" : "Confirmar";

            modal.classList.add("ativo");

            function fechar(resultado) {
                modal.classList.remove("ativo");

                cancelar.removeEventListener("click", aoCancelar);
                confirmar.removeEventListener("click", aoConfirmar);
                modal.removeEventListener("click", aoFundo);
                document.removeEventListener("keydown", aoTeclado);

                resolve(resultado);
            }

            function aoCancelar() {
                fechar(false);
            }

            function aoConfirmar() {
                fechar(true);
            }

            function aoFundo(evento) {
                if (evento.target === modal) {
                    fechar(false);
                }
            }

            function aoTeclado(evento) {
                if (evento.key === "Escape") {
                    fechar(false);
                }
            }

            cancelar.addEventListener("click", aoCancelar);
            confirmar.addEventListener("click", aoConfirmar);
            modal.addEventListener("click", aoFundo);
            document.addEventListener("keydown", aoTeclado);
        });
    }

    // =========================
    // MENSAGEM PERSONALIZADA
    // =========================

    function mostrarMensagem(mensagem) {
        let toast = document.getElementById("mensagemPIX");

        if (!toast) {
            toast = document.createElement("div");
            toast.id = "mensagemPIX";
            toast.className = "wn-toast";
            document.body.appendChild(toast);
        }

        toast.textContent = mensagem;
        toast.classList.add("ativo");

        clearTimeout(window.wn57ToastTimer);

        window.wn57ToastTimer = setTimeout(() => {
            toast.classList.remove("ativo");
        }, 2500);
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

        const ingles = estaEmIngles();

        try {
            await navigator.clipboard.writeText(campo.value);

            mostrarMensagem(
                ingles
                    ? "PIX code copied successfully!"
                    : "Código PIX copiado com sucesso!"
            );

        } catch (erro) {
            campo.select();
            campo.setSelectionRange(0, campo.value.length);

            const copiado = document.execCommand("copy");

            mostrarMensagem(
                copiado
                    ? (ingles ? "PIX code copied!" : "Código PIX copiado!")
                    : (ingles ? "Unable to copy the code." : "Não foi possível copiar o código.")
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

    window.confirmarPix = async function () {
        const ingles = estaEmIngles();

        const titulo = ingles
            ? "Confirm payment"
            : "Confirmar pagamento";

        const mensagem = ingles
            ? "Do you confirm that you have made the PIX payment?"
            : "Você confirma que realizou o pagamento via PIX?";

        const confirmado = await mostrarConfirmacao(titulo, mensagem);

        if (!confirmado) return;

        registrarPagamento();

        mostrarMensagem(
            ingles
                ? "Payment confirmed successfully!"
                : "Pagamento confirmado com sucesso!"
        );

        setTimeout(() => {
            window.location.href = "/html/principal/inicial.html";
        }, 1400);
    };

    // =========================
    // ATUALIZAR IDIOMA
    // =========================

    function atualizarIdioma() {
        const ingles = estaEmIngles();

        document.documentElement.lang = ingles ? "en" : "pt-BR";

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
        if (evento) evento.preventDefault();

        const novoIdioma = idiomaAtual() === "pt" ? "en" : "pt";

        localStorage.setItem("wn57_idioma", novoIdioma);

        atualizarIdioma();
    }

    window.alternarIdioma = trocarIdioma;
    window.atualizarIdiomaPagamento = atualizarIdioma;

    // =========================
    // BOTÃO DE IDIOMA
    // =========================

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

        if (!elemento || elemento.dataset.iniciado === "true") return;

        elemento.dataset.iniciado = "true";

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
        adicionarEstilosModal();
        criarModal();

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

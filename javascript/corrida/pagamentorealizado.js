/* =========================================================
   ELEMENTOS (com segurança)
========================================================= */

const botaoInicio = document.querySelector(".botao-principal");
const botaoRecibo = document.querySelector(".botao-secundario");
const linkSuporte = document.querySelector(".suporte a");

/* =========================================================
   EVENTOS (só adiciona se existir)
========================================================= */

botaoInicio?.addEventListener("click", voltarInicio);
botaoRecibo?.addEventListener("click", abrirRecibo);
linkSuporte?.addEventListener("click", abrirSuporte);

/* =========================================================
   FUNÇÕES PRINCIPAIS
========================================================= */

function voltarInicio(){
    mostrarMensagem("Voltando para a tela inicial...");
    // window.location.href = "index.html";
}

function abrirRecibo(){
    mostrarMensagem("Abrindo recibo da corrida...");
    // window.location.href = "recibo.html";
}

function abrirSuporte(evento){
    evento.preventDefault();
    mostrarMensagem("Conectando com o suporte...");
}

/* =========================================================
   MENSAGEM (TOAST MELHORADO)
========================================================= */

function mostrarMensagem(texto){

    removerMensagemExistente();

    const mensagem = document.createElement("div");
    mensagem.className = "mensagem-js";
    mensagem.innerText = texto;

    Object.assign(mensagem.style, {
        position: "fixed",
        bottom: "30px",
        left: "50%",
        transform: "translateX(-50%)",
        padding: "14px 22px",
        borderRadius: "14px",
        background: "#1f1f1f",
        color: "#fff",
        fontWeight: "600",
        fontSize: "14px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
        zIndex: "9999",
        animation: "aparecer 0.3s ease"
    });

    document.body.appendChild(mensagem);

    setTimeout(() => {
        mensagem.style.opacity = "0";
        setTimeout(() => mensagem.remove(), 300);
    }, 2200);
}

/* =========================================================
   REMOVER MENSAGEM EXISTENTE
========================================================= */

function removerMensagemExistente(){
    document.querySelector(".mensagem-js")?.remove();
}

/* =========================================================
   ANIMAÇÃO (CSS INJETADO)
========================================================= */

const estilo = document.createElement("style");
estilo.innerHTML = `
@keyframes aparecer {
    from {
        opacity: 0;
        transform: translateX(-50%) translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
    }
}
`;
document.head.appendChild(estilo);

/* =========================================================
   VALOR DA CORRIDA (CORRIGIDO)
========================================================= */

const valor = localStorage.getItem("valorCorrida");

if (valor) {
    const elementoValor = document.querySelector(".corrida h2");
    if (elementoValor) {
        elementoValor.innerText = valor;
    }
}


function mostrarToast(mensagem, tipo = "info") {

    removerToastExistente();

    const toast = document.createElement("div");
    toast.className = "toast";

    toast.innerText = mensagem;

    // cores por tipo
    let cor = "#1f1f1f";

    if (tipo === "sucesso") cor = "#22c55e";
    if (tipo === "erro") cor = "#ef4444";
    if (tipo === "aviso") cor = "#f59e0b";

    Object.assign(toast.style, {
        position: "fixed",
        bottom: "30px",
        left: "50%",
        transform: "translateX(-50%)",
        padding: "14px 22px",
        borderRadius: "14px",
        background: cor,
        color: "#fff",
        fontWeight: "600",
        fontSize: "14px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
        zIndex: "9999",
        animation: "slideUp 0.3s ease",
        transition: "0.3s"
    });

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(-50%) translateY(10px)";
        setTimeout(() => toast.remove(), 300);
    }, 2200);
}

function removerToastExistente() {
    document.querySelector(".toast")?.remove();
}


const style = document.createElement("style");

style.innerHTML = `
@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateX(-50%) translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
    }
}
`;

document.head.appendChild(style);

mostrarToast("Pagamento realizado com sucesso!", "sucesso");
mostrarToast("Erro ao processar pagamento", "erro");
mostrarToast("Preencha todos os campos", "aviso");
mostrarToast("Conectando com o servidor...", "info");
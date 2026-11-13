// Página de aviso WN Pet

// >>> Troque pelo nome real da sua página de confirmar endereço <<<
const PAGINA_CONFIRMAR_ENDERECO = "confirmar-endereco.html";

const check = document.getElementById("petCheck");
const btnAceitar = document.getElementById("petAceitar");
const btnCancelar = document.getElementById("petCancelar");

// Quem abriu a página sem ter escolhido a corrida volta para o início do fluxo
document.addEventListener("DOMContentLoaded", function () {
    const origem = localStorage.getItem("origemCorrida");
    const destino = localStorage.getItem("destinoCorrida");

    if (!origem || !destino) {
        window.location.href = "solicitar.html";
    }
});

// Botão só libera depois de marcar o aceite
check.addEventListener("change", function () {
    btnAceitar.disabled = !check.checked;
});

// Aceitou: guarda o aceite e segue para confirmar o endereço
btnAceitar.addEventListener("click", function () {
    if (!check.checked) return;

    localStorage.setItem("petAvisoAceito", new Date().toISOString());

    window.location.href = PAGINA_CONFIRMAR_ENDERECO;
});

// Cancelou: volta para a corrida sem aceitar
btnCancelar.addEventListener("click", function () {
    localStorage.removeItem("petAvisoAceito");
    window.location.href = "corrida.html";
});

const formProblema = document.getElementById("formProblema");
const mensagemProblema = document.getElementById("mensagemProblema");

formProblema.addEventListener("submit", function (event) {
    event.preventDefault();

    const tipo = document.getElementById("tipoProblema").value;
    const descricao = document.getElementById("descricaoProblema").value.trim();
    const email = document.getElementById("emailProblema").value.trim();

    if (!tipo || descricao.length < 10) {
        mensagemProblema.textContent =
            "Selecione o tipo de problema e escreva pelo menos 10 caracteres.";
        mensagemProblema.style.color = "#c62828";
        return;
    }

    const relato = {
        tipo: tipo,
        descricao: descricao,
        email: email,
        data: new Date().toISOString(),
        status: "Pendente"
    };

    try {
        const relatos = JSON.parse(
            localStorage.getItem("relatosWN57") || "[]"
        );

        relatos.push(relato);
        localStorage.setItem("relatosWN57", JSON.stringify(relatos));

        mensagemProblema.textContent =
            "Relato salvo neste navegador! A equipe ainda não foi notificada.";
        mensagemProblema.style.color = "#16803c";

        formProblema.reset();
    } catch (erro) {
        mensagemProblema.textContent =
            "Não foi possível salvar o relato. Tente novamente.";
        mensagemProblema.style.color = "#c62828";
    }
});

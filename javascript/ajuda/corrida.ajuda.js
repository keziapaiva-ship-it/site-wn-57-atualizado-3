
/* corrida.ajuda.js */

document.addEventListener("DOMContentLoaded", () => {
    const perguntas = document.querySelectorAll(".perguntas details");

    perguntas.forEach((pergunta) => {
        pergunta.addEventListener("toggle", () => {
            if (pergunta.open) {
                perguntas.forEach((outraPergunta) => {
                    if (outraPergunta !== pergunta) {
                        outraPergunta.open = false;
                    }
                });
            }
        });
    });
});

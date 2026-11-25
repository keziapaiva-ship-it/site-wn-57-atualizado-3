"use strict";

(function () {
    const CHAVE_OPCOES = "opcoesBlack";
    const CHAVE_CATEGORIA = "categoriaCorrida";
    const CHAVE_VIAGENS = "minhasViagens";

    const OPCOES = [
        { id: "silencio",   icone: "🤫", titulo: "Modo silencioso",        desc: "Viagem tranquila, sem conversa" },
        { id: "porta",      icone: "🚪", titulo: "Abrir a porta para mim", desc: "O motorista abre a porta ao embarcar" },
        { id: "agua",       icone: "💧", titulo: "Água de cortesia",       desc: "Garrafinha de água durante a viagem" },
        { id: "carregador", icone: "🔌", titulo: "Carregador de celular",  desc: "Cabo disponível no carro" },
        { id: "bagagem",    icone: "🧳", titulo: "Bagagem extra",          desc: "Espaço no porta-malas para malas grandes" }
    ];

    const TEMPERATURAS = [
        { id: "fresco", rotulo: "Mais fresco" },
        { id: "padrao", rotulo: "Padrão" },
        { id: "quente", rotulo: "Mais quente" }
    ];

    const EN = {
        "Opções da viagem": "Trip options",
        "Personalize sua viagem no WN Black.": "Customize your WN Black ride.",
        "Modo silencioso": "Quiet mode",
        "Viagem tranquila, sem conversa": "Quiet ride, no conversation",
        "Abrir a porta para mim": "Open the door for me",
        "O motorista abre a porta ao embarcar": "The driver opens the door when you board",
        "Água de cortesia": "Complimentary water",
        "Garrafinha de água durante a viagem": "Bottled water during the ride",
        "Carregador de celular": "Phone charger",
        "Cabo disponível no carro": "Cable available in the car",
        "Bagagem extra": "Extra luggage",
        "Espaço no porta-malas para malas grandes": "Trunk space for large bags",
        "Temperatura do ar": "Air temperature",
        "Mais fresco": "Cooler",
        "Padrão": "Default",
        "Mais quente": "Warmer"
    };

    /* ---------- utilitários ---------- */

    function ler(chave, fallback) {
        try {
            const valor = localStorage.getItem(chave);
            return valor === null ? fallback : valor;
        } catch {
            return fallback;
        }
    }

    function salvar(chave, valor) {
        try {
            localStorage.setItem(chave, String(valor));
        } catch { }
    }

    function emIngles() {
        return String(ler("idioma", "")).toLowerCase().startsWith("en");
    }

    function t(texto) {
        return emIngles() && EN[texto] ? EN[texto] : texto;
    }

    function esc(texto) {
        return String(texto).replace(/[&<>"']/g, c => ({
            "&": "&amp;", "<": "&lt;", ">": "&gt;",
            '"': "&quot;", "'": "&#039;"
        })[c]);
    }

    /* ---------- escolhas ---------- */

    let escolhas = (() => {
        try {
            const dados = JSON.parse(ler(CHAVE_OPCOES, "{}"));
            return dados && typeof dados === "object" ? dados : {};
        } catch {
            return {};
        }
    })();

    function preferencias() {
        const resultado = {};

        OPCOES.forEach(opcao => {
            resultado[opcao.id] = !!escolhas[opcao.id];
        });

        resultado.temperatura = escolhas.temperatura || "padrao";

        return resultado;
    }

    function salvarEscolhas() {
        salvar(CHAVE_OPCOES, JSON.stringify(escolhas));

        // guarda também na última viagem do histórico local
        try {
            const viagens = JSON.parse(ler(CHAVE_VIAGENS, "[]"));

            if (Array.isArray(viagens) && viagens.length) {
                viagens[viagens.length - 1].preferencias = preferencias();
                salvar(CHAVE_VIAGENS, JSON.stringify(viagens));
            }
        } catch { }
    }

    window.obterPreferenciasBlack = preferencias;

    /* ---------- tela ---------- */

    function acharOuCriarArea() {
        let area = document.getElementById("opcoesBlack");
        if (area) return area;

        area = document.createElement("section");
        area.id = "opcoesBlack";
        area.className = "opcoes-black";

        const botao = document.getElementById("confirmar");
        const principal = document.querySelector("main .conteudo, main");

        if (botao && botao.parentNode) {
            botao.parentNode.insertBefore(area, botao);
        } else if (principal) {
            principal.appendChild(area);
        } else {
            document.body.appendChild(area);
        }

        return area;
    }

    function montar() {
        const area = acharOuCriarArea();

        // só aparece no WN Black
        if (ler(CHAVE_CATEGORIA, "") !== "WN Black") {
            area.innerHTML = "";
            area.hidden = true;
            return;
        }

        area.hidden = false;
        area.classList.add("opcoes-black");

        const temperatura = escolhas.temperatura || "padrao";

        area.innerHTML = `
            <h3>${esc(t("Opções da viagem"))}</h3>
            <p class="opcoes-sub">${esc(t("Personalize sua viagem no WN Black."))}</p>

            ${OPCOES.map(opcao => {
                const ativa = !!escolhas[opcao.id];

                return `
                    <button type="button"
                        class="opcao-black${ativa ? " ativa" : ""}"
                        role="switch"
                        aria-checked="${ativa}"
                        data-opcao="${opcao.id}">

                        <span class="opcao-icone" aria-hidden="true">${opcao.icone}</span>

                        <span class="opcao-texto">
                            <strong>${esc(t(opcao.titulo))}</strong>
                            <small>${esc(t(opcao.desc))}</small>
                        </span>

                        <span class="opcao-chave" aria-hidden="true"></span>
                    </button>
                `;
            }).join("")}

            <div class="opcao-temp">
                <strong>${esc(t("Temperatura do ar"))}</strong>

                <div class="temp-chips" role="radiogroup">
                    ${TEMPERATURAS.map(temp => `
                        <button type="button"
                            class="temp-chip${temp.id === temperatura ? " ativa" : ""}"
                            role="radio"
                            aria-checked="${temp.id === temperatura}"
                            data-temp="${temp.id}">
                            ${esc(t(temp.rotulo))}
                        </button>
                    `).join("")}
                </div>
            </div>
        `;

        area.querySelectorAll("[data-opcao]").forEach(botao => {
            botao.addEventListener("click", () => {
                const id = botao.dataset.opcao;
                escolhas[id] = !escolhas[id];
                salvarEscolhas();
                montar();
            });
        });

        area.querySelectorAll("[data-temp]").forEach(botao => {
            botao.addEventListener("click", () => {
                escolhas.temperatura = botao.dataset.temp;
                salvarEscolhas();
                montar();
            });
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", montar);
    } else {
        montar();
    }

    window.addEventListener("idiomaAlterado", montar);
})();
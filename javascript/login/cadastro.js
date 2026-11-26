"use strict";

// ==========================================
// CADASTRO WN57
// ==========================================

function iniciarCadastro() {

    console.log("Iniciando cadastro WN57...");

    const formulario = document.querySelector(".sessao form");
    const botao = document.getElementById("cadBotao");

    if (!formulario || !botao) {
        console.error("Formulário ou botão de cadastro não encontrado.");
        return;
    }

    // Evita registrar o evento mais de uma vez
    if (formulario.dataset.eventoCadastro === "ativo") {
        return;
    }

    // Elementos do formulário
    const nomeInput = document.getElementById("nome");
    const emailInput = document.getElementById("email");
    const dataInput = document.getElementById("date");
    const telefoneInput = document.getElementById("telefone");
    const senhaInput = document.getElementById("senha");
    const confirmacaoInput = document.getElementById("confirmacao-senha");

    const fotoInput = document.getElementById("foto");
    const previaFoto = document.getElementById("previaFoto");
    const nomeArquivo = document.getElementById("nomeArquivo");

    const campos = [
        nomeInput,
        emailInput,
        dataInput,
        telefoneInput,
        senhaInput,
        confirmacaoInput
    ];

    if (campos.some(campo => !campo)) {
        console.error("Um ou mais campos do cadastro não foram encontrados.");
        return;
    }

    formulario.dataset.eventoCadastro = "ativo";

    // ==========================================
    // STATUS
    // ==========================================

    let status = document.getElementById("cadastro-status");

    if (!status) {
        status = document.createElement("p");
        status.id = "cadastro-status";
        status.setAttribute("role", "status");
        status.setAttribute("aria-live", "polite");

        formulario.insertBefore(status, botao);
    }

    function mostrarStatus(mensagem, tipo = "") {
        status.textContent = mensagem;
        status.className = tipo;
    }

    // ==========================================
    // FOTO DE PERFIL
    // ==========================================

    if (fotoInput) {

        fotoInput.addEventListener("change", function () {

            const arquivo = this.files[0];

            if (!arquivo) return;

            const tiposPermitidos = [
                "image/jpeg",
                "image/png"
            ];

            if (!tiposPermitidos.includes(arquivo.type)) {
                alert("Escolha uma imagem JPG ou PNG.");
                this.value = "";
                return;
            }

            if (arquivo.size > 5 * 1024 * 1024) {
                alert("A imagem deve ter no máximo 5 MB.");
                this.value = "";
                return;
            }

            if (previaFoto) {

                const leitor = new FileReader();

                leitor.onload = function (evento) {
                    previaFoto.src = evento.target.result;
                };

                leitor.readAsDataURL(arquivo);
            }

            if (nomeArquivo) {
                nomeArquivo.textContent = arquivo.name;
            }

        });
    }

    // ==========================================
    // VALIDAÇÃO DO E-MAIL
    // ==========================================

    function validarEmail(email) {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    }

    // ==========================================
    // VALIDAÇÃO DA DATA
    // Aceita dd/mm/aaaa e aaaa-mm-dd
    // ==========================================

    function validarData(valor) {

        let dia;
        let mes;
        let ano;

        if (/^\d{4}-\d{2}-\d{2}$/.test(valor)) {

            [ano, mes, dia] = valor.split("-").map(Number);

        } else if (/^\d{2}\/\d{2}\/\d{4}$/.test(valor)) {

            [dia, mes, ano] = valor.split("/").map(Number);

        } else {

            return false;

        }

        const dataInformada = new Date(
            ano,
            mes - 1,
            dia
        );

        return (
            dataInformada.getFullYear() === ano &&
            dataInformada.getMonth() === mes - 1 &&
            dataInformada.getDate() === dia
        );

    }

    // ==========================================
    // CONVERTE DATA PARA O BACKEND
    // ==========================================

    function converterData(valor) {

        if (/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
            return valor;
        }

        if (/^\d{2}\/\d{2}\/\d{4}$/.test(valor)) {

            const [dia, mes, ano] = valor.split("/");

            return `${ano}-${mes}-${dia}`;

        }

        return null;

    }

    // ==========================================
    // VALIDAÇÃO DA SENHA
    // ==========================================

    function validarSenha(senha) {

        return (
            senha.length >= 8 &&
            /[A-Z]/.test(senha) &&
            /[a-z]/.test(senha) &&
            /[0-9]/.test(senha) &&
            /[^A-Za-z0-9]/.test(senha)
        );

    }

    // ==========================================
    // VALIDAÇÃO DO TELEFONE
    // ==========================================

    function validarTelefone(telefone) {

        const numeros = telefone.replace(/\D/g, "");

        return numeros.length >= 10 && numeros.length <= 11;

    }

    // ==========================================
    // LIMPAR ERROS
    // ==========================================

    function limparErros() {

        formulario.querySelectorAll(".erro-msg").forEach(elemento => {
            elemento.remove();
        });

        formulario.querySelectorAll(".input-erro").forEach(elemento => {
            elemento.classList.remove("input-erro");
        });

    }

    // ==========================================
    // MOSTRAR ERRO
    // ==========================================

    function mostrarErro(campo, mensagem) {

        campo.classList.add("input-erro");

        const erro = document.createElement("span");

        erro.className = "erro-msg";
        erro.textContent = mensagem;

        campo.insertAdjacentElement("afterend", erro);

    }

    // ==========================================
    // VALIDAR FORMULÁRIO
    // ==========================================

    function validarFormulario() {

        limparErros();
        mostrarStatus("");

        let valido = true;

        const nome = nomeInput.value.trim();
        const email = emailInput.value.trim();
        const data = dataInput.value.trim();
        const telefone = telefoneInput.value.trim();
        const senha = senhaInput.value;
        const confirmacao = confirmacaoInput.value;

        if (nome.length < 3 || !nome.includes(" ")) {

            mostrarErro(
                nomeInput,
                "Digite seu nome completo."
            );

            valido = false;
        }

        if (!validarEmail(email)) {

            mostrarErro(
                emailInput,
                "Digite um e-mail válido."
            );

            valido = false;
        }

        if (!validarData(data)) {

            mostrarErro(
                dataInput,
                "Digite uma data válida."
            );

            valido = false;
        }

        if (!validarTelefone(telefone)) {

            mostrarErro(
                telefoneInput,
                "Digite DDD e número do telefone."
            );

            valido = false;
        }

        if (!validarSenha(senha)) {

            mostrarErro(
                senhaInput,
                "Use 8 ou mais caracteres com maiúscula, minúscula, número e símbolo."
            );

            valido = false;
        }

        if (senha !== confirmacao) {

            mostrarErro(
                confirmacaoInput,
                "As senhas não são iguais."
            );

            valido = false;
        }

        if (!valido) {

            mostrarStatus(
                "Confira os campos destacados.",
                "status-erro"
            );

        }

        return valido;

    }

    // ==========================================
    // ENVIO DO CADASTRO
    // ==========================================

    formulario.addEventListener("submit", async function (evento) {

        evento.preventDefault();

        console.log("Clique de envio recebido pelo formulário.");

        if (!validarFormulario()) {
            return;
        }

        const dadosUsuario = {

            nome: nomeInput.value.trim(),

            email: emailInput.value.trim(),

            dataNascimento: converterData(
                dataInput.value.trim()
            ),

            telefone: telefoneInput.value.trim(),

            senha: senhaInput.value

        };

        // Bloqueia o botão durante o envio
        botao.disabled = true;
        botao.textContent = "Criando conta...";

        mostrarStatus(
            "Criando sua conta...",
            "status-ok"
        );

        try {

            // ==========================================
            // REQUISIÇÃO PARA O BACKEND
            // ==========================================

            const resposta = await fetch(
                "http://localhost:3000/usuarios",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(dadosUsuario)
                }
            );

            let resultado = {};

            try {

                resultado = await resposta.json();

            } catch {

                throw new Error(
                    "O servidor retornou uma resposta inválida."
                );

            }

            if (!resposta.ok) {

                throw new Error(
                    resultado.erro ||
                    resultado.mensagem ||
                    "Não foi possível criar sua conta."
                );

            }

            // ==========================================
            // SALVAR DADOS DO USUÁRIO
            // ==========================================

            localStorage.setItem(
                "usuario",
                JSON.stringify({
                    nome: dadosUsuario.nome,
                    email: dadosUsuario.email,
                    telefone: dadosUsuario.telefone
                })
            );

            mostrarStatus(
                "Conta criada com sucesso!",
                "status-ok"
            );

            alert("Conta criada com sucesso!");

            // Redirecionamento
            window.location.href = "/html/login/login.html";

        } catch (erro) {

            console.error("Erro no cadastro:", erro);

            mostrarStatus(
                erro.message ||
                "Não foi possível conectar ao servidor.",
                "status-erro"
            );

        } finally {

            botao.disabled = false;

            const idioma =
                localStorage.getItem("wn57_idioma") || "pt";

            botao.textContent =
                idioma === "en"
                    ? "Create account"
                    : "Criar conta";

        }

    });

    console.log("Cadastro WN57 inicializado com sucesso.");

}

// ==========================================
// INICIALIZAÇÃO
// ==========================================

if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        iniciarCadastro
    );

} else {

    iniciarCadastro();

}
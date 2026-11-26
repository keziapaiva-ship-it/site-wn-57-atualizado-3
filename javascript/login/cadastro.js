
(function () {
    "use strict";

    const API_URL = "http://localhost:3000";

    const form = document.querySelector("form");

    if (!form) {
        console.error("Formulário de cadastro não encontrado.");
        return;
    }

    const nome = document.getElementById("nome");
    const email = document.getElementById("email");
    const data = document.getElementById("date");
    const telefone = document.getElementById("telefone");
    const senha = document.getElementById("senha");
    const confirmarSenha = document.getElementById("confirmacao-senha");

    const botao = form.querySelector(".btn-enviar");

    function idioma() {
        return localStorage.getItem("wn57_idioma") === "en" ? "en" : "pt";
    }

    function mensagem(pt, en) {
        return idioma() === "en" ? en : pt;
    }

    function mostrarMensagem(texto, tipo = "erro") {
        let caixa = document.getElementById("mensagemCadastro");

        if (!caixa) {
            caixa = document.createElement("div");
            caixa.id = "mensagemCadastro";

            caixa.style.marginTop = "15px";
            caixa.style.padding = "12px";
            caixa.style.borderRadius = "10px";
            caixa.style.fontSize = "13px";

            form.appendChild(caixa);
        }

        caixa.textContent = texto;

        caixa.style.background =
            tipo === "sucesso" ? "#e8fff0" : "#fff0f0";

        caixa.style.color =
            tipo === "sucesso" ? "#168348" : "#d93636";
    }

    function validarEmail(valor) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
    }

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const dados = {
            nome: nome.value.trim(),
            email: email.value.trim().toLowerCase(),
            telefone: telefone.value.trim(),
            dataNascimento: data.value,
            senha: senha.value
        };

        // Validações
        if (
            !dados.nome ||
            !dados.email ||
            !dados.telefone ||
            !dados.dataNascimento ||
            !dados.senha
        ) {
            mostrarMensagem(
                mensagem(
                    "Preencha todos os campos.",
                    "Please fill in all fields."
                )
            );
            return;
        }

        if (!validarEmail(dados.email)) {
            mostrarMensagem(
                mensagem(
                    "Digite um e-mail válido.",
                    "Enter a valid email."
                )
            );
            return;
        }

        if (dados.senha.length < 8) {
            mostrarMensagem(
                mensagem(
                    "A senha precisa ter pelo menos 8 caracteres.",
                    "Password must have at least 8 characters."
                )
            );
            return;
        }

        if (!/[A-Z]/.test(dados.senha) ||
            !/[a-z]/.test(dados.senha) ||
            !/[0-9]/.test(dados.senha) ||
            !/[^A-Za-z0-9]/.test(dados.senha)) {

            mostrarMensagem(
                mensagem(
                    "Use letra maiúscula, minúscula, número e símbolo.",
                    "Use uppercase, lowercase, number and symbol."
                )
            );
            return;
        }

        if (dados.senha !== confirmarSenha.value) {
            mostrarMensagem(
                mensagem(
                    "As senhas não coincidem.",
                    "Passwords do not match."
                )
            );
            return;
        }

        try {
            if (botao) {
                botao.disabled = true;
                botao.textContent = mensagem(
                    "Cadastrando...",
                    "Creating account..."
                );
            }

            const resposta = await fetch(API_URL + "/usuarios", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dados)
            });

            const resultado = await resposta.json();

            if (!resposta.ok) {
                throw new Error(
                    resultado.mensagem ||
                    resultado.erro ||
                    mensagem(
                        "Não foi possível realizar o cadastro.",
                        "Registration failed."
                    )
                );
            }

            mostrarMensagem(
                mensagem(
                    "Conta criada com sucesso! Redirecionando para o login...",
                    "Account created successfully! Redirecting to login..."
                ),
                "sucesso"
            );

            form.reset();

            setTimeout(function () {
                window.location.href = "/html/login/login.html";
            }, 2000);

        } catch (erro) {
            console.error("Erro no cadastro:", erro);

            mostrarMensagem(
                erro.message === "Failed to fetch"
                    ? mensagem(
                        "Não foi possível conectar ao servidor.",
                        "Could not connect to the server."
                    )
                    : erro.message
            );

        } finally {
            if (botao) {
                botao.disabled = false;
                botao.textContent = mensagem(
                    "Criar conta",
                    "Create account"
                );
            }
        }
    });

})();

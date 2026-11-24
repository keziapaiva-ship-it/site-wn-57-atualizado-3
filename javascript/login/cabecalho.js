
(function () {

    "use strict";

    // ==========================================
    // CONFIGURAÇÕES
    // ==========================================

    if (document.getElementById("perfil")) return;

    const CHAVE_LOGADO = "usuarioLogado";
    const CHAVE_TOKEN = "token";
    const CHAVE_IDIOMA = "wn57_idioma";

    const PAGINA_INICIAL = "/html/principal/inicial.html";

    function idiomaAtual() {
        return localStorage.getItem(CHAVE_IDIOMA) || "pt";
    }

    // ==========================================
    // LOGIN
    // ==========================================

    function limparLogin() {
        localStorage.removeItem(CHAVE_TOKEN);
        localStorage.removeItem(CHAVE_LOGADO);
    }

    function tokenExpirado(token) {

        try {

            const payload = JSON.parse(
                atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
            );

            return payload.exp && payload.exp * 1000 < Date.now();

        } catch (e) {
            return true;
        }

    }

    function lerUsuarioLogado() {

        try {

            const token = localStorage.getItem(CHAVE_TOKEN);
            const usuario = JSON.parse(
                localStorage.getItem(CHAVE_LOGADO)
            );

            if (!token || !usuario || !usuario.nome) return null;

            if (tokenExpirado(token)) {
                limparLogin();
                return null;
            }

            return usuario;

        } catch (e) {
            return null;
        }

    }

    // ==========================================
    // FOTO DO PERFIL
    // ==========================================

    function resolverFoto(usuario) {

        const foto = usuario && usuario.foto
            ? String(usuario.foto)
            : "";

        if (foto && !foto.includes("pravatar.cc")) {
            return foto;
        }

        const email = usuario && usuario.email
            ? String(usuario.email).toLowerCase()
            : "";

        return (
            (email && localStorage.getItem("fotoPerfil:" + email)) ||
            localStorage.getItem("fotoPerfilAtual") ||
            ""
        );

    }

    if (lerUsuarioLogado()) {
        document.documentElement.classList.add("logado");
    }

    // ==========================================
    // CABEÇALHO HTML
    // ==========================================

    const html = `

    <header>

        <div class="header-container">

            <img
                src="/img/logo/logo1.png"
                class="logo"
                alt="WN57"
            >

            <nav>

                <a href="/html/principal/inicial.html" id="menuInicio">
                    Início
                </a>

                <a href="/html/corrida/solicitar.html" id="menuViajar">
                    Viajar
                </a>

            </nav>

            <div class="header-right">

                <button
                    class="idioma-btn"
                    id="btnIdioma"
                    type="button"
                >
                    🌐 PT-BR
                </button>

                <a href="/html/ajuda/ajuda.html" id="menuAjuda">
                    Ajuda
                </a>

                <a
                    href="/html/login/login.html"
                    data-deslogado
                    id="menuLogin"
                >
                    Fazer login
                </a>

                <a
                    href="/html/login/cadastro.html"
                    class="btn-menu"
                    data-deslogado
                    id="menuCadastro"
                >
                    Cadastre-se
                </a>

                <div class="perfil" id="perfil">

                    <button
                        class="perfil-btn"
                        id="perfilBtn"
                        type="button"
                        aria-haspopup="true"
                        aria-expanded="false"
                    >

                        <span class="perfil-avatar" id="avatarMini">U</span>

                        <span id="perfilNomeCurto">Usuário</span>

                        <span class="seta">▾</span>

                    </button>

                    <div class="perfil-menu" id="perfilMenu">

                        <div class="perfil-topo">

                            <div>

                                <h3 id="perfilNome">Usuário</h3>

                                <span class="nota">
                                    ★ <span id="perfilNota">5,00</span>
                                </span>

                            </div>

                            <div class="perfil-foto" id="perfilFoto">U</div>

                        </div>

                        <div class="perfil-atalhos">

                            <a href="/html/ajuda/ajuda.html">
                                <span>❔</span>
                                Ajuda
                            </a>

                            <a href="/html/ajuda/seguranca.ajuda.html">
                                <span>🛡️</span>
                                Segurança
                            </a>

                            <a href="/html/login/atividade.html">
                                <span>📋</span>
                                Atividade
                            </a>

                        </div>

                        <ul class="perfil-lista">

                            <li>
                                <a href="/html/login/gerenciar.conta.html">
                                    <span>👤</span>
                                    Gerenciar conta
                                </a>
                            </li>

                            <li>
                                <a href="/html/corrida/solicitar.html">
                                    <span>🚗</span>
                                    Pedir corrida
                                </a>
                            </li>

                            <li>
                                <a href="/html/ajuda/suporte.html">
                                    <span>💬</span>
                                    Suporte
                                </a>
                            </li>

                        </ul>

                        <button class="perfil-sair" id="perfilSair" type="button">
                            Sair
                        </button>

                    </div>

                </div>

            </div>

        </div>

    </header>

    `;

    document.currentScript.insertAdjacentHTML("beforebegin", html);

    // ==========================================
    // TRADUÇÃO DO CABEÇALHO
    // ==========================================

    function definirTexto(id, texto) {

        const elemento = document.getElementById(id);

        if (elemento) {
            elemento.textContent = texto;
        }

    }

    function atualizarIdiomaCabecalho() {

        const ingles = idiomaAtual() === "en";

        document.documentElement.lang = ingles ? "en" : "pt-BR";

        definirTexto(
            "btnIdioma",
            ingles ? "🌐 EN" : "🌐 PT-BR"
        );

        definirTexto(
            "menuInicio",
            ingles ? "Home" : "Início"
        );

        definirTexto(
            "menuViajar",
            ingles ? "Ride" : "Viajar"
        );

        definirTexto(
            "menuAjuda",
            ingles ? "Help" : "Ajuda"
        );

        definirTexto(
            "menuLogin",
            ingles ? "Log in" : "Fazer login"
        );

        definirTexto(
            "menuCadastro",
            ingles ? "Sign up" : "Cadastre-se"
        );

    }

    // ==========================================
    // BOTÃO DE TROCAR IDIOMA
    // ==========================================

    function alternarIdiomaCabecalho() {

        const novoIdioma = idiomaAtual() === "pt"
            ? "en"
            : "pt";

        localStorage.setItem(CHAVE_IDIOMA, novoIdioma);

        // Atualiza o cabeçalho
        atualizarIdiomaCabecalho();

        // Atualiza a página atual, se ela possuir tradução própria
        if (typeof window.atualizarIdiomaPagamento === "function") {

            window.atualizarIdiomaPagamento();

        }

        if (
            typeof window.atualizarIdiomaPagina === "function"
        ) {

            window.atualizarIdiomaPagina();

        }

    }

    // Disponibiliza a função global
    window.alternarIdioma = alternarIdiomaCabecalho;

    window.atualizarIdiomaCabecalho = atualizarIdiomaCabecalho;

    // Evento do botão
    const btnIdioma = document.getElementById("btnIdioma");

    if (btnIdioma) {

        btnIdioma.addEventListener("click", function (evento) {

            evento.preventDefault();

            alternarIdiomaCabecalho();

        });

    }

    // Aplica o idioma salvo ao abrir a página
    atualizarIdiomaCabecalho();

    // ==========================================
    // FUNCIONAMENTO DO PERFIL
    // ==========================================

    function iniciarPerfil() {

        const perfilBtn = document.getElementById("perfilBtn");

        const perfilMenu = document.getElementById("perfilMenu");

        if (!perfilBtn || !perfilMenu) return;

        const usuario = lerUsuarioLogado();

        if (!usuario || !usuario.nome) {

            document.documentElement.classList.remove("logado");

            return;

        }

        document.documentElement.classList.add("logado");

        const nome = usuario.nome.trim();

        const primeiroNome = nome.split(" ")[0];

        const inicial = nome.charAt(0).toUpperCase();

        const avatarMini = document.getElementById("avatarMini");

        const perfilFoto = document.getElementById("perfilFoto");

        document.getElementById("perfilNome").textContent = nome;

        document.getElementById("perfilNomeCurto").textContent = primeiroNome;

        avatarMini.textContent = inicial;

        perfilFoto.textContent = inicial;

        // Foto do usuário

        const foto = resolverFoto(usuario);

        if (foto) {

            const url = `url("${foto.replace(/"/g, "%22")}")`;

            [avatarMini, perfilFoto].forEach(function (elemento) {

                elemento.textContent = "";

                elemento.style.backgroundImage = url;

                elemento.style.backgroundSize = "cover";

                elemento.style.backgroundPosition = "center";

            });

        }

        // Abrir e fechar menu

        function alternarMenu(abrir) {

            const aberto = abrir ??
                !perfilMenu.classList.contains("aberto");

            perfilMenu.classList.toggle("aberto", aberto);

            perfilBtn.setAttribute(
                "aria-expanded",
                String(aberto)
            );

        }

        perfilBtn.addEventListener("click", function (evento) {

            evento.stopPropagation();

            alternarMenu();

        });

        perfilMenu.addEventListener("click", function (evento) {

            evento.stopPropagation();

        });

        document.addEventListener("click", function () {

            alternarMenu(false);

        });

        document.addEventListener("keydown", function (evento) {

            if (evento.key === "Escape") {
                alternarMenu(false);
            }

        });

        // Sair da conta

        document.getElementById("perfilSair").addEventListener(
            "click",
            function () {

                limparLogin();

                document.documentElement.classList.remove("logado");

                window.location.href = PAGINA_INICIAL;

            }
        );

    }

    if (document.readyState === "loading") {

        document.addEventListener("DOMContentLoaded", iniciarPerfil);

    } else {

        iniciarPerfil();

    }

})();

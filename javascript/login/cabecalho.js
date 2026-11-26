
(function () {
    "use strict";

    // ==========================================
    // CONFIGURAÇÕES
    // ==========================================

    const CHAVE_LOGADO = "usuarioLogado";
    const CHAVE_TOKEN = "token";
    const CHAVE_IDIOMA = "wn57_idioma";

    const PAGINA_INICIAL = "/html/principal/inicial.html";
    const PAGINA_CADASTRO = "/html/login/cadastro.html";
    const PAGINA_LOGIN = "/html/login/login.html";

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

    // ==========================================
    // CABEÇALHO HTML
    // ==========================================

    function criarCabecalho() {
        if (document.querySelector("header .header-container")) return;

        const html = `
            <header>
                <div class="header-container">

                    <img
                        src="/img/logo/logo1.png"
                        class="logo"
                        alt="WN57"
                    >

                    <nav>
                        <a href="${PAGINA_INICIAL}" id="menuInicio">
                            Início
                        </a>

                        <a href="/html/corrida/solicitar.html" id="menuViajar">
                            Viajar
                        </a>

                        <a href="${PAGINA_INICIAL}#sobre" id="menuSobre">
                            Sobre nós
                        </a>
                    </nav>

                    <div class="header-right">

                        <button class="idioma-btn" id="btnIdioma" type="button">
                            🌐 PT-BR
                        </button>

                        <a href="/html/ajuda/ajuda.html" id="menuAjuda">
                            Ajuda
                        </a>

                        <a
                            href="${PAGINA_LOGIN}"
                            data-deslogado
                            id="menuLogin"
                        >
                            Fazer login
                        </a>

                        <a
                            href="${PAGINA_CADASTRO}"
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
                                        <span>❔</span> Ajuda
                                    </a>

                                    <a href="/html/ajuda/seguranca.html">
                                        <span>🛡️</span> Segurança
                                    </a>

                                    <a href="/html/login/atividade.html">
                                        <span>📋</span> Atividade
                                    </a>

                                </div>

                                <ul class="perfil-lista">

                                    <li>
                                        <a href="/html/login/gerenciar.conta.html">
                                            <span>👤</span> Gerenciar conta
                                        </a>
                                    </li>

                                    <li>
                                        <a href="/html/corrida/solicitar.html">
                                            <span>🚗</span> Pedir corrida
                                        </a>
                                    </li>

                                    <li>
                                        <a href="/html/ajuda/suporte.html">
                                            <span>💬</span> Suporte
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

        const scriptAtual = document.currentScript;

        if (scriptAtual && scriptAtual.parentNode) {
            scriptAtual.insertAdjacentHTML("beforebegin", html);
        } else {
            document.body.insertAdjacentHTML("afterbegin", html);
        }
    }

    // ==========================================
    // TRADUÇÕES
    // ==========================================

    const traducoes = {
        pt: {
            inicio: "Início",
            viajar: "Viajar",
            sobre: "Sobre nós",
            ajuda: "Ajuda",
            login: "Fazer login",
            cadastro: "Cadastre-se",
            idioma: "🌐 PT-BR",
            seguranca: "Segurança",
            atividade: "Atividade",
            gerenciar: "Gerenciar conta",
            corrida: "Pedir corrida",
            suporte: "Suporte",
            sair: "Sair"
        },

        en: {
            inicio: "Home",
            viajar: "Ride",
            sobre: "About us",
            ajuda: "Help",
            login: "Log in",
            cadastro: "Sign up",
            idioma: "🌐 EN",
            seguranca: "Safety",
            atividade: "Activity",
            gerenciar: "Manage account",
            corrida: "Request a ride",
            suporte: "Support",
            sair: "Log out"
        }
    };

    function definirTexto(id, texto) {
        const elemento = document.getElementById(id);
        if (elemento) elemento.textContent = texto;
    }

    function traduzirLinkPerfil(link, texto) {
        if (!link) return;

        const icone = link.querySelector("span");

        link.textContent = "";

        if (icone) {
            link.appendChild(icone);
            link.appendChild(document.createTextNode(" " + texto));
        } else {
            link.textContent = texto;
        }
    }

    function atualizarIdiomaCabecalho() {
        const idioma = idiomaAtual() === "en" ? "en" : "pt";
        const t = traducoes[idioma];

        document.documentElement.lang =
            idioma === "en" ? "en" : "pt-BR";

        definirTexto("btnIdioma", t.idioma);
        definirTexto("menuInicio", t.inicio);
        definirTexto("menuViajar", t.viajar);
        definirTexto("menuSobre", t.sobre);
        definirTexto("menuAjuda", t.ajuda);
        definirTexto("menuLogin", t.login);
        definirTexto("menuCadastro", t.cadastro);
        definirTexto("perfilSair", t.sair);

        const linksPerfil = document.querySelectorAll("#perfilMenu a");

        const textosPerfil = [
            t.ajuda,
            t.seguranca,
            t.atividade,
            t.gerenciar,
            t.corrida,
            t.suporte
        ];

        linksPerfil.forEach((link, indice) => {
            if (textosPerfil[indice]) {
                traduzirLinkPerfil(link, textosPerfil[indice]);
            }
        });
    }

    // ==========================================
    // TROCAR IDIOMA
    // ==========================================

    function alternarIdiomaCabecalho() {
        const novoIdioma = idiomaAtual() === "pt" ? "en" : "pt";

        localStorage.setItem(CHAVE_IDIOMA, novoIdioma);

        atualizarIdiomaCabecalho();

        if (typeof window.atualizarIdiomaPagamento === "function") {
            window.atualizarIdiomaPagamento();
        }

        if (typeof window.atualizarIdiomaPagina === "function") {
            window.atualizarIdiomaPagina();
        }

        window.dispatchEvent(
            new CustomEvent("idiomaAlterado", {
                detail: { idioma: novoIdioma }
            })
        );
    }

    window.alternarIdioma = alternarIdiomaCabecalho;
    window.atualizarIdiomaCabecalho = atualizarIdiomaCabecalho;

    // ==========================================
    // EVENTOS DO CABEÇALHO
    // ==========================================

    function configurarIdioma() {
        const btnIdioma = document.getElementById("btnIdioma");

        if (!btnIdioma || btnIdioma.dataset.idiomaConfigurado === "true") {
            return;
        }

        btnIdioma.dataset.idiomaConfigurado = "true";

        btnIdioma.addEventListener("click", function (evento) {
            evento.preventDefault();
            alternarIdiomaCabecalho();
        });
    }

    // ==========================================
    // PERFIL
    // ==========================================

    function iniciarPerfil() {
        const perfilBtn = document.getElementById("perfilBtn");
        const perfilMenu = document.getElementById("perfilMenu");

        if (!perfilBtn || !perfilMenu) return;

        const usuario = lerUsuarioLogado();

        if (!usuario) {
            document.documentElement.classList.remove("logado");
            return;
        }

        document.documentElement.classList.add("logado");

        const nome = usuario.nome.trim();
        const primeiroNome = nome.split(" ")[0];
        const inicial = nome.charAt(0).toUpperCase();

        const avatarMini = document.getElementById("avatarMini");
        const perfilFoto = document.getElementById("perfilFoto");

        definirTexto("perfilNome", nome);
        definirTexto("perfilNomeCurto", primeiroNome);

        if (avatarMini) avatarMini.textContent = inicial;
        if (perfilFoto) perfilFoto.textContent = inicial;

        const foto = resolverFoto(usuario);

        if (foto) {
            const url = `url("${foto.replace(/"/g, "%22")}")`;

            [avatarMini, perfilFoto].forEach(elemento => {
                if (!elemento) return;

                elemento.textContent = "";
                elemento.style.backgroundImage = url;
                elemento.style.backgroundSize = "cover";
                elemento.style.backgroundPosition = "center";
            });
        }

        function alternarMenu(abrir) {
            const aberto = abrir ??
                !perfilMenu.classList.contains("aberto");

            perfilMenu.classList.toggle("aberto", aberto);
            perfilBtn.setAttribute("aria-expanded", String(aberto));
        }

        if (perfilBtn.dataset.perfilConfigurado !== "true") {
            perfilBtn.dataset.perfilConfigurado = "true";

            perfilBtn.addEventListener("click", evento => {
                evento.stopPropagation();
                alternarMenu();
            });

            perfilMenu.addEventListener("click", evento => {
                evento.stopPropagation();
            });

            document.addEventListener("click", () => {
                alternarMenu(false);
            });

            document.addEventListener("keydown", evento => {
                if (evento.key === "Escape") alternarMenu(false);
            });
        }

        const botaoSair = document.getElementById("perfilSair");

        if (botaoSair && botaoSair.dataset.sairConfigurado !== "true") {
            botaoSair.dataset.sairConfigurado = "true";

            botaoSair.addEventListener("click", function () {
                limparLogin();
                document.documentElement.classList.remove("logado");
                window.location.href = PAGINA_INICIAL;
            });
        }
    }

    // ==========================================
    // PROTEGER O LINK CADASTRE-SE
    // ==========================================

    function configurarCadastro() {
        const botao = document.getElementById("menuCadastro");

        if (!botao || botao.dataset.cadastroConfigurado === "true") {
            return;
        }

        botao.dataset.cadastroConfigurado = "true";

        botao.href = PAGINA_CADASTRO;

        botao.addEventListener("click", function (evento) {
            evento.preventDefault();
            evento.stopPropagation();

            window.location.assign(PAGINA_CADASTRO);
        });
    }

    // ==========================================
    // INICIALIZAÇÃO
    // ==========================================

    function inicializarCabecalho() {
        criarCabecalho();
        configurarIdioma();
        configurarCadastro();
        atualizarIdiomaCabecalho();
        iniciarPerfil();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", inicializarCabecalho);
    } else {
        inicializarCabecalho();
    }

    window.addEventListener("storage", function (evento) {
        if (evento.key === CHAVE_IDIOMA) {
            atualizarIdiomaCabecalho();
        }
    });

})();

// ==================================================
// CABEÇALHO WN57 (compartilhado por todas as páginas)
// Uso: colocar <script src="/javascript/login/cabecalho.js"></script>
// no topo do <body>, no lugar do antigo <header>.
// ==================================================

(function () {

    // Se o cabeçalho já foi inserido (script carregado duas vezes), não repete
    if (document.getElementById("perfil")) return;

    // O login.js salva "token" e "usuarioLogado".
    // ("usuario" é o cadastro e NÃO indica que a pessoa está logada.)
    const CHAVE_LOGADO = "usuarioLogado";
    const CHAVE_TOKEN = "token";
    const PAGINA_INICIAL = "/html/principal/inicial.html";

    function limparLogin() {
        localStorage.removeItem(CHAVE_TOKEN);
        localStorage.removeItem(CHAVE_LOGADO);
    }

    // Token JWT expirado? (o servidor gera com validade de 1h)
    function tokenExpirado(token) {
        try {
            const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
            return payload.exp && payload.exp * 1000 < Date.now();
        } catch (e) {
            return true;
        }
    }

    // Devolve o usuário logado, ou null se não estiver logado
    function lerUsuarioLogado() {
        try {
            const token = localStorage.getItem(CHAVE_TOKEN);
            const u = JSON.parse(localStorage.getItem(CHAVE_LOGADO));

            if (!token || !u || !u.nome) return null;

            if (tokenExpirado(token)) {
                limparLogin();
                return null;
            }

            return u;
        } catch (e) {
            return null;
        }
    }

    // Foto do perfil: usa a foto escolhida no cadastro.
    // O avatar de teste (pravatar.cc) e foto vazia não valem.
    function resolverFoto(u) {

        const foto = u && u.foto ? String(u.foto) : "";

        if (foto && !foto.includes("pravatar.cc")) return foto;

        const email = u && u.email ? String(u.email).toLowerCase() : "";

        return (
            (email && localStorage.getItem("fotoPerfil:" + email)) ||
            localStorage.getItem("fotoPerfilAtual") ||
            ""
        );
    }

    // Marca como logado antes da página aparecer (evita "piscar")
    if (lerUsuarioLogado()) {
        document.documentElement.classList.add("logado");
    }


    const html = `
    <header>
        <div class="header-container">

            <!-- LOGO -->
            <img src="/img/logo/logo1.png" class="logo" alt="WN57">

            <!-- MENU PRINCIPAL -->
            <nav>
                <a href="/html/principal/inicial.html">Inicial</a>
                <a href="/html/corrida/solicitar.html">Viajar</a>
            </nav>

            <!-- AÇÕES DO USUÁRIO -->
            <div class="header-right">

                <button class="idioma-btn" id="btnIdioma" type="button" data-no-i18n>🌐 PT-BR</button>

                <a href="/html/ajuda/ajuda.html">Ajuda</a>

                <!-- USUÁRIOS DESCONECTADOS -->
                <a href="/html/login/login.html" data-deslogado>Fazer login</a>
                <a href="/html/login/cadastro.html" class="btn-menu" data-deslogado>Cadastre-se</a>

                <!-- MENU DO PERFIL (USUÁRIOS CONECTADOS) -->
                <div class="perfil" id="perfil">

                    <button class="perfil-btn" id="perfilBtn" type="button" aria-haspopup="true" aria-expanded="false">
                        <span class="perfil-avatar" id="avatarMini">U</span>
                        <span id="perfilNomeCurto">Usuário</span>
                        <span class="seta">▾</span>
                    </button>

                    <div class="perfil-menu" id="perfilMenu">

                        <div class="perfil-topo">
                            <div>
                                <h3 id="perfilNome">Usuário</h3>
                                <span class="nota" id="perfilNotaBox">★ <span id="perfilNota">5,00</span></span>
                            </div>
                            <div class="perfil-foto" id="perfilFoto">U</div>
                        </div>

                        <div class="perfil-atalhos">
                            <a href="/html/ajuda/ajuda.html"><span>❔</span>Ajuda</a>
                            <a href="/html/ajuda/seguranca.ajuda.html"><span>🛡️</span>Segurança</a>
                            <a href="/html/login/atividade.html"><span>📋</span>Atividade</a>
                        </div>

                        <ul class="perfil-lista">
                            <li><a href="/html/login/gerenciar.conta.html"><span>👤</span>Gerenciar conta</a></li>
                            <li><a href="/html/corrida/solicitar.html"><span>🚗</span>Pedir corrida</a></li>
                            <li><a href="/html/ajuda/suporte.html"><span>💬</span>Suporte</a></li>
                        </ul>

                        <button class="perfil-sair" id="perfilSair" type="button">Sair</button>

                    </div>
                </div>

            </div>
        </div>
    </header>`;


    // Insere o cabeçalho exatamente onde este <script> está (dentro do <body>)
    document.currentScript.insertAdjacentHTML("beforebegin", html);


    // ----------------------------------------------
    // Funcionamento do perfil
    // ----------------------------------------------
    function iniciarPerfil() {

        const perfilBtn = document.getElementById("perfilBtn");
        const perfilMenu = document.getElementById("perfilMenu");

        if (!perfilBtn || !perfilMenu) return;

        const usuario = lerUsuarioLogado();

        // NÃO logado: esconde o menu e mantém "Fazer login / Cadastre-se"
        if (!usuario || !usuario.nome) {
            document.documentElement.classList.remove("logado");
            return;
        }

        // Logado
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

        // Foto do usuário (a do cadastro), se existir
        const foto = resolverFoto(usuario);

        if (foto) {

            const url = `url("${foto.replace(/"/g, "%22")}")`;

            [avatarMini, perfilFoto].forEach((el) => {
                el.textContent = "";
                el.style.backgroundImage = url;
                el.style.backgroundSize = "cover";
                el.style.backgroundPosition = "center";
            });
        }

        // Abre e fecha o menu
        function alternarMenu(abrir) {
            const aberto = abrir ?? !perfilMenu.classList.contains("aberto");
            perfilMenu.classList.toggle("aberto", aberto);
            perfilBtn.setAttribute("aria-expanded", String(aberto));
        }

        perfilBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            alternarMenu();
        });

        perfilMenu.addEventListener("click", (e) => e.stopPropagation());

        document.addEventListener("click", () => alternarMenu(false));

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") alternarMenu(false);
        });

        // SAIR: apaga o login, remove o menu e volta para a página inicial
        // (a foto do cadastro fica guardada para o próximo login)
        document.getElementById("perfilSair").addEventListener("click", () => {
            limparLogin();
            document.documentElement.classList.remove("logado");
            window.location.href = PAGINA_INICIAL;
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", iniciarPerfil);
    } else {
        iniciarPerfil();
    }

})();
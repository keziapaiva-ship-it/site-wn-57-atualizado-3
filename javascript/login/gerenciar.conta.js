/* =====================================================
   WN57 - GERENCIAR CONTA
   Usuário logado: localStorage["usuario"]
===================================================== */

(() => {
    "use strict";

    const CHAVE = "usuario";
    const URL_LOGIN = "/html/login/login.html";
    const URL_INICIAL = "/html/principal/inicial.html";
    const VISTAS = ["inicio", "dados", "seguranca", "privacidade"];
    const MSG_GOOGLE = "Você entra com o Google. A senha é gerenciada na sua conta Google.";

    const $ = (s, r = document) => r.querySelector(s);
    const $$ = (s, r = document) => [...r.querySelectorAll(s)];

    /* ---------- ACHAR O USUÁRIO LOGADO ---------- */

    function lerObjeto(st, k) {
        try {
            const o = JSON.parse(st.getItem(k));
            return o && typeof o === "object" && !Array.isArray(o) ? o : null;
        } catch (e) {
            return null;
        }
    }

    const pareceUsuario = (o) => !!(o && (o.email || o.nome || o.name));

    function acharUsuario() {
        const nomes = ["usuarioLogado", CHAVE, "usuario_logado", "usuarioAtual",
            "user", "wn57_usuario", "wn57_user", "perfil"];

        for (const st of [localStorage, sessionStorage]) {
            for (const k of nomes) {
                const o = lerObjeto(st, k);
                if (pareceUsuario(o)) return { st, k, o };
            }
        }

        // último recurso: qualquer chave que guarde um objeto com e-mail ou nome
        for (const st of [localStorage, sessionStorage]) {
            for (let i = 0; i < st.length; i++) {
                const k = st.key(i);
                const o = lerObjeto(st, k);
                if (pareceUsuario(o)) return { st, k, o };
            }
        }

        return null;
    }

    const achado = acharUsuario();
    const fonte = achado || { st: localStorage, k: CHAVE };
    let usuario = achado ? achado.o : null;

    // aceita nomes de campo alternativos (ex.: Google usa name/picture)
    if (usuario) {
        const apelidos = {
            nome: ["name", "nomeCompleto"],
            foto: ["fotoPerfil", "avatar"],
            nascimento: ["date", "dataNascimento"],
            telefone: ["phone", "celular"]
        };

        Object.entries(apelidos).forEach(([canonico, outros]) => {
            if (usuario[canonico]) return;
            const achou = outros.find((o) => usuario[o]);
            if (achou) usuario[canonico] = usuario[achou];
        });

        // foto genérica que o login.js usa quando não há foto: não é do usuário
        if (/pravatar\.cc/.test(usuario.foto || "")) usuario.foto = "";

        // completa com os dados do cadastro (telefone, nascimento, CPF...) do mesmo e-mail
        const cad = lerObjeto(localStorage, CHAVE);

        if (cad && cad !== usuario && cad.email === usuario.email) {
            Object.keys(cad).forEach((k) => {
                if (k === "senha") return;
                if (usuario[k] === undefined || usuario[k] === null || usuario[k] === "") {
                    usuario[k] = cad[k];
                }
            });
        }
    } else {
        console.warn("WN57: usuário não encontrado. Chaves do localStorage:",
            Object.keys(localStorage), "sessionStorage:", Object.keys(sessionStorage));
    }

    if (achado) {
        const quem = achado.st === localStorage ? "localStorage" : "sessionStorage";
        console.info(`WN57: dados lidos de ${quem}["${achado.k}"]`, {
            nome: usuario.nome, email: usuario.email, temFoto: !!usuario.foto
        });
    }

    const gravar = () => fonte.st.setItem(fonte.k, JSON.stringify(usuario));

    const esc = (t) => String(t ?? "").replace(/[&<>"']/g, (c) => (
        { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
    ));

    const digitos = (v) => String(v || "").replace(/\D/g, "");


    /* ---------- AVISO ---------- */

    let tempoAviso;

    function aviso(texto) {
        const t = $("#toast");
        t.textContent = texto;
        t.classList.add("show");
        clearTimeout(tempoAviso);
        tempoAviso = setTimeout(() => t.classList.remove("show"), 2800);
    }


    /* ---------- MÁSCARAS E VALIDAÇÕES ---------- */

    function mascaraTelefone(v) {
        const d = digitos(v).slice(0, 11);
        if (d.length <= 2) return d ? "(" + d : "";
        if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
        if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
        return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
    }

    function mascaraCpf(v) {
        const d = digitos(v).slice(0, 11);
        return d
            .replace(/^(\d{3})(\d)/, "$1.$2")
            .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
            .replace(/\.(\d{3})(\d)/, ".$1-$2");
    }

    function mascaraData(v) {
        const d = digitos(v).slice(0, 8);
        return d
            .replace(/^(\d{2})(\d)/, "$1/$2")
            .replace(/^(\d{2})\/(\d{2})(\d)/, "$1/$2/$3");
    }

    function dataValida(v) {
        const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(v.trim());
        if (!m) return false;

        const [, d, mes, a] = m.map(Number);
        const data = new Date(a, mes - 1, d);

        return (
            data.getFullYear() === a &&
            data.getMonth() === mes - 1 &&
            data.getDate() === d &&
            a >= 1900 &&
            data <= new Date()
        );
    }

    const CAMPOS = [
        {
            k: "nome", rot: "Nome", tipo: "text", auto: "name",
            mascara: (v) => v,
            validar: (v) => v.trim().split(/\s+/).length >= 2 && v.trim().length >= 5
                ? null : "Informe seu nome completo.",
            salvar: (v) => v.trim().replace(/\s+/g, " ")
        },
        {
            k: "telefone", rot: "Número de telefone", tipo: "tel", auto: "tel",
            mascara: mascaraTelefone,
            validar: (v) => [10, 11].includes(digitos(v).length)
                ? null : "Telefone inválido. Use DDD + número.",
            salvar: mascaraTelefone
        },
        {
            k: "email", rot: "E-mail", tipo: "email", auto: "email",
            mascara: (v) => v,
            validar: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())
                ? null : "E-mail inválido.",
            salvar: (v) => v.trim().toLowerCase()
        },
        {
            k: "nascimento", rot: "Data de nascimento", tipo: "text", auto: "bday",
            mascara: mascaraData,
            validar: (v) => dataValida(v) ? null : "Use o formato dd/mm/aaaa.",
            salvar: (v) => v.trim()
        },
        {
            k: "cpf", rot: "CPF", tipo: "text", auto: "off", opcional: true,
            mascara: mascaraCpf,
            validar: (v) => digitos(v).length === 11 ? null : "CPF deve ter 11 números.",
            salvar: mascaraCpf
        }
    ];

    function valorDe(chave) {
        if (chave === "nascimento") return usuario.nascimento || usuario.date || "";
        return usuario[chave] || "";
    }


    /* ---------- FOTO / CABEÇALHO DA PÁGINA ---------- */

    function pintarFoto(el) {
        if (usuario.foto) {
            el.style.backgroundImage = `url(${JSON.stringify(usuario.foto)})`;
            el.textContent = "";
        } else {
            el.style.backgroundImage = "";
            el.textContent = (usuario.nome || "W").trim().charAt(0).toUpperCase();
        }
    }

    function renderTopo() {
        pintarFoto($("#fotoInicio"));
        pintarFoto($("#fotoDados"));
        $("#nomeInicio").textContent = usuario.nome || "Minha conta";
        $("#emailInicio").textContent = usuario.email || "";

        const remover = $("#removerFoto");
        if (remover) remover.hidden = !usuario.foto;
    }


    /* ---------- SUGESTÃO ---------- */

    function renderSugestao() {
        let icone, titulo, texto, botao, acao;

        if (!usuario.telefone) {
            icone = "fa-phone";
            titulo = "Adicione seu telefone";
            texto = "Com o telefone, o motorista e o suporte conseguem falar com você durante a corrida.";
            botao = "Adicionar telefone";
            acao = "telefone";
        } else if (!usuario.foto) {
            icone = "fa-camera";
            titulo = "Adicione uma foto de perfil";
            texto = "Uma foto ajuda o motorista a reconhecer você no embarque.";
            botao = "Adicionar foto";
            acao = "foto";
        } else {
            icone = "fa-circle-check";
            titulo = "Sua conta está completa";
            texto = "Seus dados de contato e foto estão em dia.";
            botao = "Revisar dados";
            acao = "dados";
        }

        $("#sugestao").innerHTML = `
            <i class="fa-solid ${icone}"></i>
            <div>
                <h3>${titulo}</h3>
                <p>${texto}</p>
                <button class="btn" type="button" data-sug="${acao}">${botao}</button>
            </div>`;
    }


    /* ---------- DADOS PESSOAIS ---------- */

    function renderDados() {
        const lista = $("#listaDados");

        lista.innerHTML = CAMPOS.map((c) => {
            const v = valorDe(c.k);

            return `
            <div class="item" data-campo="${c.k}">
                <button type="button" aria-expanded="false">
                    <span class="rotulo">
                        <b>${c.rot}</b>
                        <span class="v">${v ? esc(v) : "Não informado"}</span>
                    </span>
                    <i class="fa-solid fa-chevron-right seta"></i>
                </button>

                <div class="editor">
                    <label for="campo-${c.k}">${c.rot}</label>
                    <input id="campo-${c.k}" type="${c.tipo}" value="${esc(v)}"
                           autocomplete="${c.auto}" ${c.k === "nascimento" || c.k === "cpf" ? 'inputmode="numeric"' : ""}>
                    <p class="msg"></p>
                    <div class="acoes">
                        <button class="btn" type="button" data-salvar>Salvar</button>
                        <button class="btn sec" type="button" data-fechar>Cancelar</button>
                    </div>
                </div>
            </div>`;
        }).join("");
    }

    function salvarCampo(item) {
        const c = CAMPOS.find((x) => x.k === item.dataset.campo);
        const entrada = $("input", item);
        const msg = $(".msg", item);
        const v = entrada.value;

        const vazio = !v.trim();
        const erro = vazio && c.opcional ? null : c.validar(v);

        if (erro) {
            msg.textContent = erro;
            msg.className = "msg erro";
            entrada.focus();
            return;
        }

        const novo = vazio ? "" : c.salvar(v);
        usuario[c.k] = novo;
        if (c.k === "nascimento" && "date" in usuario) usuario.date = novo;

        try {
            gravar();
        } catch (e) {
            msg.textContent = "Não foi possível salvar.";
            msg.className = "msg erro";
            return;
        }

        renderTudo();
        aviso("Dados atualizados");
    }


    /* ---------- ABRIR / FECHAR ITENS ---------- */

    function fechar(item) {
        item.classList.remove("aberto");
        $(":scope > button", item).setAttribute("aria-expanded", "false");

        const msg = $(".msg", item);
        if (msg) { msg.textContent = ""; msg.className = "msg"; }

        if (item.dataset.campo) {
            $("input", item).value = valorDe(item.dataset.campo);
        } else {
            $$("input", item).forEach((i) => { i.value = ""; });
        }
    }

    function alternar(item, forcarAbrir) {
        if (item.id === "itemSenha" && usuario.origem === "google") {
            aviso(MSG_GOOGLE);
            return;
        }

        const abrir = forcarAbrir ?? !item.classList.contains("aberto");

        $$(".item.aberto").forEach((i) => { if (i !== item) fechar(i); });

        if (!abrir) {
            fechar(item);
            return;
        }

        item.classList.add("aberto");
        $(":scope > button", item).setAttribute("aria-expanded", "true");
        setTimeout(() => $("input", item).focus(), 60);
    }


    /* ---------- FOTO ---------- */

    function tratarFoto(arquivo) {
        if (!arquivo || !/^image\//.test(arquivo.type)) {
            aviso("Selecione uma imagem válida.");
            return;
        }

        const leitor = new FileReader();

        leitor.onerror = () => aviso("Não foi possível abrir a imagem.");

        leitor.onload = () => {
            const img = new Image();

            img.onerror = () => aviso("Não foi possível abrir a imagem.");

            img.onload = () => {
                const lado = 320;
                const corte = Math.min(img.width, img.height);
                const canvas = document.createElement("canvas");

                canvas.width = lado;
                canvas.height = lado;

                canvas.getContext("2d").drawImage(
                    img,
                    (img.width - corte) / 2, (img.height - corte) / 2, corte, corte,
                    0, 0, lado, lado
                );

                usuario.foto = canvas.toDataURL("image/jpeg", 0.85);

                try {
                    gravar();
                } catch (e) {
                    aviso("Não foi possível salvar a foto");
                    return;
                }

                renderTudo();
                aviso("Foto atualizada");
            };

            img.src = leitor.result;
        };

        leitor.readAsDataURL(arquivo);
    }


    /* ---------- SENHA ---------- */

    function renderSenha() {
        const info = $("#infoSenha");

        if (usuario.origem === "google") {
            info.textContent = MSG_GOOGLE;
        } else if (usuario.senhaAlteradaEm) {
            const d = new Date(usuario.senhaAlteradaEm).toLocaleDateString("pt-BR");
            info.innerHTML = `<span>Última alteração em:</span> <span>${esc(d)}</span>`;
        } else {
            info.textContent = "••••••••";
        }
    }

    function removerFoto() {
        delete usuario.foto;

        try {
            gravar();
        } catch (e) {
            aviso("Não foi possível salvar a foto");
            return;
        }

        renderTudo();
        aviso("Foto atualizada");
    }

    async function salvarSenha() {
        const atual = $("#senhaAtual").value;
        const nova = $("#senhaNova").value;
        const conf = $("#senhaConf").value;
        const msg = $("#msgSenha");
        const botao = $("#salvarSenha");

        const falha = (texto) => {
            msg.textContent = texto;
            msg.className = "msg erro";
        };

        if (!atual) return falha("A senha atual está incorreta.");

        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/.test(nova)) {
            return falha("Use 8 ou mais caracteres, com letra maiúscula, minúscula, número e símbolo.");
        }

        if (nova !== conf) return falha("As senhas não conferem.");

        botao.disabled = true;

        try {
            // o servidor confere a senha atual e grava a nova (a mesma que o login usa)
            const resp = await api("/auth/alterar-senha", "PUT", {
                senhaAtual: atual,
                novaSenha: nova
            });

            if (!resp || resp.ok !== true) {
                return falha((resp && (resp.erro || resp.mensagem)) || "Não foi possível alterar a senha.");
            }

            fechar($("#itemSenha"));
            aviso("Senha alterada");
        } catch (e) {
            console.error(e);
            falha("Não foi possível conectar ao servidor.");
        } finally {
            botao.disabled = false;
        }
    }


    /* ---------- DISPOSITIVO ---------- */

    function renderDispositivo() {
        const u = navigator.userAgent;

        const nav = /Edg\//.test(u) ? "Edge"
            : /OPR\//.test(u) ? "Opera"
            : /Chrome\//.test(u) ? "Chrome"
            : /Firefox\//.test(u) ? "Firefox"
            : /Safari\//.test(u) ? "Safari" : "Navegador";

        const so = /Windows/.test(u) ? "Windows"
            : /Android/.test(u) ? "Android"
            : /iPhone|iPad/.test(u) ? "iOS"
            : /Mac OS/.test(u) ? "macOS"
            : /Linux/.test(u) ? "Linux" : "";

        $("#dispositivo").textContent = so ? `${nav}, ${so}` : nav;

        const icone = $("#iconeDispositivo");
        if (icone) {
            icone.className =
                "fa-solid " + (/Android|iPhone|iPad/.test(u) ? "fa-mobile-screen" : "fa-laptop");
        }
    }


    /* ---------- PRIVACIDADE ---------- */

    function baixarDados() {
        const { senha, ...dados } = usuario;
        const extras = {};

        ["historico", "viagens", "corridas", "historico_viagens"].forEach((k) => {
            const bruto = localStorage.getItem(k);
            if (!bruto) return;

            try { extras[k] = JSON.parse(bruto); } catch (e) { extras[k] = bruto; }
        });

        const blob = new Blob(
            [JSON.stringify({ cadastro: dados, ...extras }, null, 2)],
            { type: "application/json" }
        );

        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "wn57-meus-dados.json";
        document.body.appendChild(link);
        link.click();
        link.remove();

        setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    }

    function limparLogin() {
        fonte.st.removeItem(fonte.k);
        localStorage.removeItem("usuarioLogado");
        localStorage.removeItem("token");
    }

    function sair() {
        limparLogin();
        window.location.href = URL_LOGIN;
    }

    function excluir() {
        if (!confirm("Excluir sua conta? Essa ação não pode ser desfeita.")) return;

        limparLogin();
        localStorage.removeItem(CHAVE);
        window.location.href = URL_INICIAL;
    }


    /* ---------- NAVEGAÇÃO ENTRE VISTAS ---------- */

    function mostrarVista() {
        const nome = location.hash.slice(1);
        const v = VISTAS.includes(nome) ? nome : "inicio";

        $$(".vista").forEach((s) => s.classList.toggle("on", s.id === "v-" + v));

        $$(".lateral a").forEach((a) => {
            const ativo = a.dataset.v === v;
            a.classList.toggle("on", ativo);
            if (ativo) a.setAttribute("aria-current", "page");
            else a.removeAttribute("aria-current");
        });

        $$(".item.aberto").forEach(fechar);
        window.scrollTo({ top: 0 });
    }


    /* ---------- RENDER GERAL ---------- */

    function renderTudo() {
        renderTopo();
        renderSugestao();
        renderDados();
        renderSenha();

        if (typeof window.atualizarIdiomaPagina === "function") {
            window.atualizarIdiomaPagina();
        }
    }

    function semCadastro() {
        $(".lateral").hidden = true;

        $("#conteudo").innerHTML = `
            <section class="vazio">
                <i class="fa-regular fa-circle-user"></i>
                <h1>Não encontramos seu cadastro</h1>
                <p class="sub">Faça login ou crie sua conta para gerenciar seus dados.</p>
                <a class="btn" href="${URL_LOGIN}">Fazer login</a>
            </section>`;
    }


    /* ---------- EVENTOS (um só ouvinte para a página toda) ---------- */

    document.addEventListener("click", (e) => {
        if (!usuario) return;

        const alvo = e.target;

        // cabeçalho de um item (dados ou senha)
        const cabecalhoItem = alvo.closest(".item > button");
        if (cabecalhoItem) return alternar(cabecalhoItem.parentElement);

        const item = alvo.closest(".item");

        if (alvo.closest("[data-fechar]")) return alternar(item, false);
        if (alvo.closest("[data-salvar]")) return salvarCampo(item);

        const sug = alvo.closest("[data-sug]");
        if (sug) {
            const acao = sug.dataset.sug;

            if (acao === "foto") return $("#arquivoFoto").click();

            location.hash = "#dados";

            if (acao === "telefone") {
                setTimeout(() => alternar($('.item[data-campo="telefone"]'), true), 80);
            }
            return;
        }

        if (alvo.closest("#trocarFoto")) return $("#arquivoFoto").click();
        if (alvo.closest("#removerFoto")) return removerFoto();
        if (alvo.closest("#salvarSenha")) return salvarSenha();
        if (alvo.closest("#sair2")) return sair();
        if (alvo.closest("#baixar")) return baixarDados();
        if (alvo.closest("#excluir")) return excluir();
    });

    document.addEventListener("input", (e) => {
        const item = e.target.closest(".item[data-campo]");
        if (!item) return;

        const c = CAMPOS.find((x) => x.k === item.dataset.campo);
        e.target.value = c.mascara(e.target.value);
    });

    document.addEventListener("keydown", (e) => {
        const item = e.target.closest && e.target.closest(".item.aberto");
        if (!item) return;

        if (e.key === "Escape") {
            alternar(item, false);
            $(":scope > button", item).focus();
        }

        if (e.key === "Enter" && e.target.tagName === "INPUT") {
            e.preventDefault();
            if (item.dataset.campo) salvarCampo(item);
            else salvarSenha();
        }
    });

    $("#arquivoFoto").addEventListener("change", (e) => {
        if (usuario) tratarFoto(e.target.files[0]);
        e.target.value = "";
    });


    /* ---------- INÍCIO ---------- */

    if (!usuario || typeof usuario !== "object") {
        usuario = null;
        semCadastro();
        return;
    }

    renderTudo();
    renderDispositivo();
    mostrarVista();

    window.addEventListener("hashchange", mostrarVista);
})();


/* =====================================================
   TRADUÇÃO DA PÁGINA GERENCIAR CONTA (PT <-> EN)
   O cabeçalho chama window.atualizarIdiomaPagina ao trocar o idioma.
===================================================== */

(() => {
    "use strict";

    const traducoes = {
        "Página inicial": "Home",
        "Dados pessoais": "Personal information",
        "Segurança": "Security",
        "Privacidade e dados": "Privacy and data",
        "Informações pessoais": "Personal information",
        "Alterar foto": "Change photo",
        "Remover foto": "Remove photo",
        "Sugestões": "Suggestions",
        "Fazer login na WN57": "Sign in to WN57",
        "Senha": "Password",
        "Senha atual": "Current password",
        "Nova senha": "New password",
        "Confirmar nova senha": "Confirm new password",
        "Salvar senha": "Save password",
        "Cancelar": "Cancel",
        "Atividade de login": "Login activity",
        "Dispositivo em que você está conectado agora.": "Device you are currently signed in on.",
        "Seu login atual": "Your current login",
        "Página da plataforma WN57": "WN57 platform page",
        "Sair da conta": "Log out",
        "Baixar meus dados": "Download my data",
        "Receba um arquivo com seus dados de cadastro e o histórico de viagens. A senha nunca é incluída.": "Receive a file containing your registration details and trip history. Your password is never included.",
        "Baixar arquivo": "Download file",
        "Excluir conta": "Delete account",
        "Remove seu cadastro deste navegador e encerra sua sessão. Essa ação não pode ser desfeita.": "Removes your registration from this browser and ends your session. This action cannot be undone.",
        "Excluir minha conta": "Delete my account",
        "Adicione seu telefone": "Add your phone number",
        "Com o telefone, o motorista e o suporte conseguem falar com você durante a corrida.": "With your phone number, the driver and support team can contact you during the ride.",
        "Adicionar telefone": "Add phone number",
        "Adicione uma foto de perfil": "Add a profile photo",
        "Uma foto ajuda o motorista a reconhecer você no embarque.": "A photo helps the driver recognize you at pickup.",
        "Adicionar foto": "Add photo",
        "Sua conta está completa": "Your account is complete",
        "Seus dados de contato e foto estão em dia.": "Your contact details and photo are up to date.",
        "Revisar dados": "Review details",
        "Nome": "Name",
        "Número de telefone": "Phone number",
        "E-mail": "Email",
        "Data de nascimento": "Date of birth",
        "CPF": "CPF",
        "Não informado": "Not provided",
        "Salvar": "Save",
        "Informe seu nome completo.": "Enter your full name.",
        "Telefone inválido. Use DDD + número.": "Invalid phone number. Include area code and number.",
        "E-mail inválido.": "Invalid email.",
        "Use o formato dd/mm/aaaa.": "Use the format dd/mm/yyyy.",
        "CPF deve ter 11 números.": "CPF must contain 11 digits.",
        "Dados atualizados": "Details updated",
        "Foto atualizada": "Photo updated",
        "Não foi possível salvar a foto": "Could not save the photo",
        "Não foi possível salvar.": "Could not save.",
        "Selecione uma imagem válida.": "Select a valid image.",
        "Não foi possível abrir a imagem.": "Could not open the image.",
        "Você entra com o Google. A senha é gerenciada na sua conta Google.": "You sign in with Google. Your password is managed by your Google account.",
        "Última alteração em:": "Last changed on:",
        "A senha atual está incorreta.": "The current password is incorrect.",
        "Use 8 ou mais caracteres, com letra maiúscula, minúscula, número e símbolo.": "Use at least 8 characters, including uppercase and lowercase letters, a number, and a symbol.",
        "As senhas não conferem.": "The passwords do not match.",
        "Senha alterada": "Password changed",
        "Não foi possível alterar a senha.": "Could not change the password.",
        "Não foi possível conectar ao servidor.": "Could not connect to the server.",
        "Não encontramos seu cadastro": "We couldn't find your account",
        "Faça login ou crie sua conta para gerenciar seus dados.": "Sign in or create an account to manage your details.",
        "Fazer login": "Sign in",
        "Minha conta": "My account",
        "Navegador": "Browser",
        "Excluir sua conta? Essa ação não pode ser desfeita.": "Delete your account? This action cannot be undone."
    };

    const inversas = {};

    Object.entries(traducoes).forEach(([pt, en]) => {
        inversas[en] = pt;
    });

    const idiomaAtual = () => localStorage.getItem("wn57_idioma") || "pt";

    function textoBase(texto) {
        const limpo = texto.trim();
        return inversas[limpo] || limpo;
    }

    function traduzirNo(no, idioma) {
        if (!no.nodeValue || !no.nodeValue.trim()) return;

        const atual = no.nodeValue;
        const inicio = atual.match(/^\s*/)[0];
        const fim = atual.match(/\s*$/)[0];
        const base = textoBase(atual);

        const resultado = idioma === "en" ? (traducoes[base] || base) : base;

        if (resultado !== atual.trim()) {
            no.nodeValue = inicio + resultado + fim;
        }
    }

    function traduzirElemento(elemento, idioma) {
        if (!elemento) return;

        const walker = document.createTreeWalker(elemento, NodeFilter.SHOW_TEXT);
        const nos = [];
        let no;

        while ((no = walker.nextNode())) {
            const pai = no.parentElement;

            if (pai && ["SCRIPT", "STYLE", "NOSCRIPT"].includes(pai.tagName)) continue;
            if (no.nodeValue.trim()) nos.push(no);
        }

        nos.forEach((n) => traduzirNo(n, idioma));

        elemento.querySelectorAll("[placeholder], [title]").forEach((el) => {
            ["placeholder", "title"].forEach((atributo) => {
                if (!el.hasAttribute(atributo)) return;

                const chave = "original_" + atributo;

                if (!el.dataset[chave]) {
                    el.dataset[chave] = textoBase(el.getAttribute(atributo));
                }

                const original = el.dataset[chave];

                el.setAttribute(
                    atributo,
                    idioma === "en" ? (traducoes[original] || original) : original
                );
            });
        });
    }

    function atualizarIdiomaPagina() {
        const idioma = idiomaAtual();

        traduzirElemento(document.body, idioma);
        document.documentElement.lang = idioma === "en" ? "en" : "pt-BR";
    }

    window.atualizarIdiomaPagina = atualizarIdiomaPagina;

    // traduz textos criados depois (avisos, listas, mensagens de erro)
    const observador = new MutationObserver((mutacoes) => {
        const idioma = idiomaAtual();

        mutacoes.forEach((m) => {
            m.addedNodes.forEach((adicionado) => {
                if (adicionado.nodeType === Node.TEXT_NODE) {
                    traduzirNo(adicionado, idioma);
                } else if (adicionado.nodeType === Node.ELEMENT_NODE) {
                    traduzirElemento(adicionado, idioma);
                }
            });
        });
    });

    function iniciar() {
        atualizarIdiomaPagina();
        observador.observe(document.body, { childList: true, subtree: true });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", iniciar);
    } else {
        iniciar();
    }
})();
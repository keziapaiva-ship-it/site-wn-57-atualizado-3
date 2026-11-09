const form = document.getElementById("loginForm");
const emailLogin = document.getElementById("email");
const senhaLogin = document.getElementById("senha");
const erro = document.getElementById("erroLogin");

const PAGINA_SOLICITAR =
    "/site-de-corrida-wn-57-main/site-de-corrida-wn-57-main/site-wn-57-corrida-main/html/solicitar.html";

form.addEventListener("submit", async function (event) {
    event.preventDefault();
    erro.textContent = "";

    const email = emailLogin.value.trim();
    const senha = senhaLogin.value; // sem trim: senha pode ter espaço

    if (!email || !senha) {
        erro.textContent = "Preencha o e-mail e a senha.";
        return;
    }

    const botao = form.querySelector("button[type='submit']");
    if (botao) botao.disabled = true;

    try {
        const resp = await api("/auth/login", "POST", { email, senha });

        if (!resp.token) {
            erro.textContent = resp.erro || resp.mensagem || "E-mail ou senha inválidos.";
            return;
        }

        // Foto guardada no cadastro (só vale se for do mesmo e-mail)
        const cadastro = JSON.parse(localStorage.getItem("usuario") || "null");
        const foto =
            cadastro && cadastro.email === resp.usuario.email && cadastro.foto
                ? cadastro.foto
                : "https://i.pravatar.cc/150?img=12";

        localStorage.setItem("token", resp.token);
        localStorage.setItem(
            "usuarioLogado",
            JSON.stringify({
                id: resp.usuario.id,
                nome: resp.usuario.nome,
                email: resp.usuario.email,
                tipo: resp.usuario.tipo,
                foto: foto
            })
        );

        window.location.href = PAGINA_SOLICITAR;
    } catch (e) {
        console.error(e);
        erro.textContent = "Não foi possível conectar ao servidor.";
    } finally {
        if (botao) botao.disabled = false;
    }
});
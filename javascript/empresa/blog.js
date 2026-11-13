
// =====================================================
// WN57 - BLOG OFICIAL
// Funcionalidades e interações da página
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    // Seleciona os elementos da página
    const pesquisa = document.getElementById("pesquisa");
    const botoesCategoria = document.querySelectorAll(".categoria-btn");
    const artigos = document.querySelectorAll(".card-artigo");
    const semResultados = document.getElementById("semResultados");

    const botaoTopo = document.getElementById("voltarTopo");
    const menuMobile = document.getElementById("menuMobile");
    const menu = document.getElementById("menu");

    // Guarda a categoria selecionada atualmente
    let categoriaAtual = "todos";


    // =====================================================
    // FILTRAR E PESQUISAR ARTIGOS
    // =====================================================

    function filtrarArtigos() {

        // Obtém o texto digitado pelo usuário
        const textoPesquisa = pesquisa.value.toLowerCase().trim();

        let quantidadeVisivel = 0;

        // Percorre todos os artigos cadastrados
        artigos.forEach((artigo) => {

            // Obtém a categoria do artigo
            const categoria = artigo.dataset.categoria;

            // Obtém o conteúdo textual do artigo
            const conteudo = artigo.textContent.toLowerCase();

            // Verifica se corresponde à categoria selecionada
            const correspondeCategoria =
                categoriaAtual === "todos" ||
                categoria === categoriaAtual;

            // Verifica se corresponde ao texto pesquisado
            const correspondePesquisa =
                conteudo.includes(textoPesquisa);

            // Exibe somente os artigos correspondentes
            if (correspondeCategoria && correspondePesquisa) {

                artigo.style.display = "block";
                quantidadeVisivel++;

            } else {

                artigo.style.display = "none";

            }

        });

        // Exibe uma mensagem caso nenhum artigo seja encontrado
        if (quantidadeVisivel === 0) {

            semResultados.style.display = "block";

        } else {

            semResultados.style.display = "none";

        }

    }


    // =====================================================
    // EVENTO DE PESQUISA
    // =====================================================

    // Atualiza os resultados enquanto o usuário digita
    if (pesquisa) {

        pesquisa.addEventListener("input", filtrarArtigos);

    }


    // =====================================================
    // FILTRO POR CATEGORIAS
    // =====================================================

    botoesCategoria.forEach((botao) => {

        botao.addEventListener("click", () => {

            // Remove o destaque de todos os botões
            botoesCategoria.forEach((item) => {
                item.classList.remove("ativo");
            });

            // Destaca a categoria selecionada
            botao.classList.add("ativo");

            // Atualiza a categoria atual
            categoriaAtual = botao.dataset.categoria;

            // Atualiza os artigos exibidos
            filtrarArtigos();

        });

    });


    // =====================================================
    // MENU RESPONSIVO
    // =====================================================

    if (menuMobile && menu) {

        menuMobile.addEventListener("click", () => {

            // Abre ou fecha o menu
            menu.classList.toggle("aberto");

            // Atualiza o ícone do botão
            const icone = menuMobile.querySelector("i");

            if (menu.classList.contains("aberto")) {

                icone.classList.replace("fa-bars", "fa-xmark");

                menuMobile.setAttribute("aria-label", "Fechar menu");

            } else {

                icone.classList.replace("fa-xmark", "fa-bars");

                menuMobile.setAttribute("aria-label", "Abrir menu");

            }

        });

        // Fecha o menu ao selecionar uma opção
        menu.querySelectorAll("a").forEach((link) => {

            link.addEventListener("click", () => {

                menu.classList.remove("aberto");

                const icone = menuMobile.querySelector("i");

                icone.classList.replace("fa-xmark", "fa-bars");

                menuMobile.setAttribute("aria-label", "Abrir menu");

            });

        });

    }


    // =====================================================
    // BOTÃO VOLTAR AO TOPO
    // =====================================================

    window.addEventListener("scroll", () => {

        if (botaoTopo) {

            // Mostra o botão após 300 pixels de rolagem
            if (window.scrollY > 300) {

                botaoTopo.classList.add("ativo");

            } else {

                botaoTopo.classList.remove("ativo");

            }

        }

    });


    // Executa a rolagem suave ao clicar no botão
    if (botaoTopo) {

        botaoTopo.addEventListener("click", () => {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        });

    }


    // =====================================================
    // FINALIZAÇÃO
    // =====================================================

    // Exibe todos os artigos inicialmente
    filtrarArtigos();

});

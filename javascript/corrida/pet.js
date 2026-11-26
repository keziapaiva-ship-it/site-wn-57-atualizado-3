
(function () {

    "use strict";

    // ==========================================
    // CONFIGURAÇÕES
    // ==========================================

    const PAGINA_CONFIRMAR_ENDERECO = "confirmar-endereco.html";

    const CHAVE_IDIOMA = "wn57_idioma";

    let idiomaAtual = localStorage.getItem(CHAVE_IDIOMA) || "pt";

    const check = document.getElementById("petCheck");

    const btnAceitar = document.getElementById("petAceitar");

    const btnCancelar = document.getElementById("petCancelar");


    // ==========================================
    // TRADUÇÕES
    // ==========================================

    const textosPet = {

        pt: {

            tag: "WN57 Pet",

            titulo: "Aviso importante",

            descricao:
                "Leia com atenção antes de confirmar sua corrida com animal de estimação.",

            paragrafos: [

                `O WN57 Pet permite que os usuários solicitem viagens pelo aplicativo WN57 acompanhados de um animal de estimação, <strong>limitado a cães e gatos</strong>. Não é permitido o transporte de animais silvestres, exóticos ou de qualquer outra espécie.`,

                `O usuário é o único responsável pelo animal e deve acompanhá-lo durante toda a viagem. Também deve garantir a segurança do animal, do motorista e de terceiros, conforme as normas aplicáveis.`,

                `A WN57 não se responsabiliza pelo animal. Nenhuma cobertura de seguro é fornecida pela WN57 ou pelos motoristas parceiros para animais de estimação, incluindo lesões, fuga, mal-estar, perda ou morte do animal.`,

                `O usuário responde por danos causados pelo animal ao veículo (arranhões, mordidas, sujeira, odores, pelos, necessidades fisiológicas). Poderá ser cobrada taxa de limpeza ou de reparo, conforme os Termos e Condições.`,

                `Recomendamos o uso de cinto de segurança específico para animais, bolsa ou caixa de transporte e toalha durante toda a viagem. O animal deve permanecer no banco traseiro, sem ficar solto no veículo, no colo do motorista ou em local que atrapalhe a condução (arts. 235 e 252 do Código de Trânsito Brasileiro).`,

                `O uso de coleira e focinheira é <strong>obrigatório</strong> para animais de grande porte ou de raças consideradas agressivas, conforme a legislação local aplicável. Nos demais casos, recomenda-se coleira e toalha durante toda a viagem.`,

                `Recomendamos manter vacinas e vermifugação em dia. Animais doentes, agressivos ou em condições que ofereçam risco à saúde e à segurança de terceiros podem ter o transporte recusado.`,

                `É proibido praticar abuso, maus-tratos, ferir ou mutilar animais. Essa conduta é crime, com pena de reclusão de 2 a 5 anos quando envolver cães e gatos (Lei 9.605/98, com a redação da Lei 14.064/2020). Não deixe o animal sozinho no veículo, especialmente em locais fechados ou sob calor.`,

                `O transporte de cão-guia que acompanha pessoa com deficiência é um direito garantido por lei (Lei 11.126/2005 e Lei 13.146/2015) e <strong>não pode ser recusado</strong>. Nesse caso, as regras acima não se aplicam como condição de aceitação da corrida, e não há cobrança adicional.`,

                `Motoristas parceiros podem optar por não aceitar corridas Pet, exceto no caso de cão-guia, o que pode aumentar o tempo de espera. O usuário deve informar corretamente no aplicativo que viajará com animal.`,

                `O uso do WN57 Pet está sujeito ao cumprimento dos Termos e Condições da plataforma e à legislação vigente, incluindo o Código de Defesa do Consumidor.`

            ],

            titulos: [

                "1. Responsabilidade do usuário",
                "2. Sem responsabilidade e sem seguro",
                "3. Danos e limpeza",
                "4. Recomendações de segurança",
                "5. Coleira e focinheira",
                "6. Saúde do animal",
                "7. Maus-tratos",
                "8. Cão-guia e cão de assistência",
                "9. Motoristas e alergias",
                "10. Termos e Condições"

            ],

            aceite:
                "Li e concordo com este aviso e com os Termos e Condições.",

            cancelar: "Cancelar",

            continuar: "Entendi e continuar"

        },


        en: {

            tag: "WN57 Pet",

            titulo: "Important notice",

            descricao:
                "Please read carefully before confirming your ride with a pet.",

            paragrafos: [

                `WN57 Pet allows users to request rides through the WN57 app accompanied by a pet, <strong>limited to dogs and cats</strong>. Wild, exotic, or any other species are not permitted.`,

                `The user is solely responsible for the animal and must accompany it throughout the entire trip. They must also ensure the safety of the animal, driver, and third parties, in accordance with applicable regulations.`,

                `WN57 is not responsible for the animal. No insurance coverage is provided by WN57 or partner drivers for pets, including injuries, escape, illness, loss, or death of the animal.`,

                `The user is responsible for damage caused by the animal to the vehicle (scratches, bites, dirt, odors, hair, or bodily waste). Cleaning or repair fees may be charged according to the Terms and Conditions.`,

                `We recommend using a pet seat belt, carrier, or transport crate and a towel throughout the trip. The animal must remain in the back seat and must not be loose inside the vehicle, on the driver's lap, or in any place that interferes with driving.`,

                `A leash and muzzle are <strong>mandatory</strong> for large animals or breeds considered aggressive, according to applicable local legislation. In other cases, a leash and towel are recommended throughout the trip.`,

                `We recommend keeping vaccinations and deworming up to date. Sick, aggressive animals, or animals in conditions that pose a risk to the health and safety of others may be refused transportation.`,

                `Abuse, mistreatment, injury, or mutilation of animals is prohibited. Such conduct is a crime. Do not leave the animal alone in the vehicle, especially in enclosed spaces or in hot weather.`,

                `Transportation of a guide dog accompanying a person with a disability is a legally guaranteed right and <strong>cannot be refused</strong>. In this case, the rules above cannot be imposed as a condition for accepting the ride, and no additional charge applies.`,

                `Partner drivers may choose not to accept Pet rides, except for guide dogs, which may increase waiting time. Users must correctly inform the app that they will be traveling with an animal.`,

                `Use of WN57 Pet is subject to compliance with the platform's Terms and Conditions and applicable laws, including consumer protection legislation.`

            ],

            titulos: [

                "1. User responsibility",
                "2. No liability or insurance",
                "3. Damage and cleaning",
                "4. Safety recommendations",
                "5. Leash and muzzle",
                "6. Animal health",
                "7. Animal abuse",
                "8. Guide and assistance dogs",
                "9. Drivers and allergies",
                "10. Terms and Conditions"

            ],

            aceite:
                "I have read and agree to this notice and the Terms and Conditions.",

            cancelar: "Cancel",

            continuar: "I understand and continue"

        }

    };


    // ==========================================
    // ATUALIZAR IDIOMA DA PÁGINA
    // ==========================================

    function atualizarIdiomaPet() {

        idiomaAtual = localStorage.getItem(CHAVE_IDIOMA) || "pt";

        const t = textosPet[idiomaAtual] || textosPet.pt;

        document.documentElement.lang =
            idiomaAtual === "en" ? "en" : "pt-BR";


        // TAG

        const tag = document.getElementById("petTag");

        if (tag) {

            tag.innerHTML =
                `<i class="fa-solid fa-paw"></i> ${t.tag}`;

        }


        // TÍTULO E DESCRIÇÃO

        const titulo = document.getElementById("petTitulo");

        if (titulo) {
            titulo.textContent = t.titulo;
        }

        const descricao = document.getElementById("petDescricao");

        if (descricao) {
            descricao.textContent = t.descricao;
        }


        // TÍTULOS DOS 10 TÓPICOS

        t.titulos.forEach(function (texto, i) {

            const elemento = document.getElementById("petTitulo" + (i + 1));

            if (elemento) {
                elemento.textContent = texto;
            }

        });


        // PARÁGRAFOS

        t.paragrafos.forEach(function (texto, i) {

            const elemento = document.getElementById("petParagrafo" + i);

            if (elemento) {
                elemento.innerHTML = texto;
            }

        });


        // CHECKBOX

        const aceiteTexto = document.getElementById("petAceiteTexto");

        if (aceiteTexto) {
            aceiteTexto.textContent = t.aceite;
        }


        // BOTÃO CANCELAR

        if (btnCancelar) {
            btnCancelar.textContent = t.cancelar;
        }


        // BOTÃO CONTINUAR

        const continuarTexto = document.getElementById("petContinuarTexto");

        if (continuarTexto) {
            continuarTexto.textContent = t.continuar;
        }

    }


    // ==========================================
    // INTEGRAÇÃO COM CABEÇALHO COMPARTILHADO
    // ==========================================

    // O cabecalho.js chama esta função quando o idioma muda.
    window.atualizarIdiomaPagina = atualizarIdiomaPet;


    // ==========================================
    // VERIFICAR ORIGEM E DESTINO
    // ==========================================

    function verificarCorrida() {

        const origem = localStorage.getItem("origemCorrida");

        const destino = localStorage.getItem("destinoCorrida");

        if (!origem || !destino) {

            window.location.href = "solicitar.html";

        }

    }


    // ==========================================
    // CHECKBOX DE ACEITE
    // ==========================================

    if (check && btnAceitar) {

        check.addEventListener("change", function () {

            btnAceitar.disabled = !check.checked;

        });

    }


    // ==========================================
    // ACEITAR AVISO
    // ==========================================

    if (btnAceitar) {

        btnAceitar.addEventListener("click", function () {

            if (!check || !check.checked) return;

            localStorage.setItem(
                "petAvisoAceito",
                new Date().toISOString()
            );

            window.location.href = PAGINA_CONFIRMAR_ENDERECO;

        });

    }


    // ==========================================
    // CANCELAR
    // ==========================================

    if (btnCancelar) {

        btnCancelar.addEventListener("click", function () {

            localStorage.removeItem("petAvisoAceito");

            window.location.href = "corrida.html";

        });

    }


    // ==========================================
    // INICIALIZAÇÃO
    // ==========================================

    verificarCorrida();

    atualizarIdiomaPet();

})();

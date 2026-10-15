const SUPABASE_URL =
    "https://mnfryxvtogpiwacpyhgo.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_YYMfDfWKaer8F1IEOFVOMQ_acS2xa2G";


/* =========================================================
   SELEÇÃO DOS ELEMENTOS DO DOM
========================================================= */

const form =
    document.getElementById("formPerfil");

const nomeInput =
    document.getElementById("nome");

const apelidoInput =
    document.getElementById("apelido");

const emailInput =
    document.getElementById("email");

const telefoneInput =
    document.getElementById("telefone");

const dataNascimentoInput =
    document.getElementById("dataNascimento");

const fotoInput =
    document.getElementById("fotoPerfil");

const previewFoto =
    document.getElementById("previewFoto");

const tituloNome =
    document.getElementById("tituloNome");


/* =========================================================
   ELEMENTOS DE FEEDBACK
========================================================= */

const loadingScreen =
    document.getElementById("loadingScreen");

const loadingInicial =
    document.getElementById("loadingInicial");

const loader =
    document.getElementById("loader");

const successIcon =
    document.getElementById("successIcon");

const errorIcon =
    document.getElementById("errorIcon");

const warningIcon =
    document.getElementById("warningIcon");

const statusText =
    document.getElementById("statusText");


/* =========================================================
   ELEMENTOS DO BANNER
========================================================= */

const perfilBanner =
    document.getElementById("perfilBanner");

const btnEscolherBanner =
    document.getElementById("btnEscolherBanner");

const modalBanner =
    document.getElementById("modalBanner");

const fecharModalBanner =
    document.getElementById("fecharModalBanner");


/* =========================================================
   BOTÃO VOLTAR
========================================================= */

const btnVoltar =
    document.getElementById("btnVoltar");


/* =========================================================
   ESTADO DO PERFIL
========================================================= */

let corBannerAtual =
    "banner-verde";

let fotoBase64 =
    "";

let dadosOriginais =
    null;


/* =========================================================
   IDENTIFICAÇÃO DO USUÁRIO
========================================================= */

const usuarioId =
    localStorage.getItem("usuarioId") ||
    sessionStorage.getItem("usuarioId");


/* =========================================================
   PROTEÇÃO DE SESSÃO
========================================================= */

function verificarSessao(){

    const id =
        localStorage.getItem("usuarioId") ||
        sessionStorage.getItem("usuarioId");

    if(!id){

        window.location.replace(
            "./index.html"
        );

    }

}


verificarSessao();


window.addEventListener(
    "pageshow",
    verificarSessao
);


/* =========================================================
   FUNÇÕES DE FEEDBACK
========================================================= */

function abrirLoading(texto){

    if(!loadingScreen) return;

    loadingScreen.classList.add("active");

    if(loader){

        loader.style.display =
            "block";

    }

    if(successIcon){

        successIcon.style.display =
            "none";

    }

    if(errorIcon){

        errorIcon.style.display =
            "none";

    }

    if(warningIcon){

        warningIcon.style.display =
            "none";

    }

    if(statusText){

        statusText.textContent =
            texto;

    }

}


function mostrarSucesso(texto){

    if(loader){

        loader.style.display =
            "none";

    }

    if(successIcon){

        successIcon.style.display =
            "flex";

    }

    if(errorIcon){

        errorIcon.style.display =
            "none";

    }

    if(warningIcon){

        warningIcon.style.display =
            "none";

    }

    if(statusText){

        statusText.textContent =
            texto;

    }

}


function mostrarErro(texto){

    if(loader){

        loader.style.display =
            "none";

    }

    if(successIcon){

        successIcon.style.display =
            "none";

    }

    if(errorIcon){

        errorIcon.style.display =
            "flex";

    }

    if(warningIcon){

        warningIcon.style.display =
            "none";

    }

    if(statusText){

        statusText.textContent =
            texto;

    }

}


function mostrarAviso(texto){

    if(loader){

        loader.style.display =
            "none";

    }

    if(successIcon){

        successIcon.style.display =
            "none";

    }

    if(errorIcon){

        errorIcon.style.display =
            "none";

    }

    if(warningIcon){

        warningIcon.style.display =
            "flex";

    }

    if(statusText){

        statusText.textContent =
            texto;

    }

}


/* =========================================================
   FECHAR FEEDBACK
========================================================= */

function fecharLoading(){

    if(loadingScreen){

        loadingScreen.classList.remove(
            "active"
        );

    }

}


/* =========================================================
   ATUALIZA NOME MOSTRADO NO PERFIL
========================================================= */

function atualizarNomePerfil(
    nome,
    apelido
){

    if(!tituloNome) return;

    const apelidoLimpo =
        typeof apelido === "string"
            ? apelido.trim()
            : "";

    const nomeLimpo =
        typeof nome === "string"
            ? nome.trim()
            : "";

    tituloNome.textContent =
        apelidoLimpo ||
        nomeLimpo ||
        "Usuário";

}


/* =========================================================
   CONVERSÃO DE DATA
========================================================= */

/*
   Banco:
   YYYY-MM-DD

   Tela:
   DD/MM/YYYY
*/


function dataBancoParaTela(data){

    if(!data){

        return "";

    }

    const partes =
        data.split("-");

    if(partes.length !== 3){

        return data;

    }

    return `${partes[2]}/${partes[1]}/${partes[0]}`;

}


function dataTelaParaBanco(data){

    if(!data){

        return null;

    }

    const valor =
        data.trim();

    if(!valor){

        return null;

    }

    const partes =
        valor.split("/");

    if(partes.length !== 3){

        return null;

    }

    const dia =
        partes[0];

    const mes =
        partes[1];

    const ano =
        partes[2];

    if(
        dia.length !== 2 ||
        mes.length !== 2 ||
        ano.length !== 4
    ){

        return null;

    }

    return `${ano}-${mes}-${dia}`;

}


/* =========================================================
   VALIDAÇÃO DA DATA
========================================================= */

function validarDataNascimento(data){

    if(!data){

        return true;

    }

    const partes =
        data.split("/");

    if(partes.length !== 3){

        return false;

    }

    const dia =
        Number(partes[0]);

    const mes =
        Number(partes[1]);

    const ano =
        Number(partes[2]);

    if(
        !Number.isInteger(dia) ||
        !Number.isInteger(mes) ||
        !Number.isInteger(ano)
    ){

        return false;

    }

    if(
        ano < 1900 ||
        ano > new Date().getFullYear()
    ){

        return false;

    }

    if(
        mes < 1 ||
        mes > 12
    ){

        return false;

    }

    const ultimoDia =
        new Date(
            ano,
            mes,
            0
        ).getDate();

    if(
        dia < 1 ||
        dia > ultimoDia
    ){

        return false;

    }

    return true;

}


/* =========================================================
   MÁSCARA DA DATA DE NASCIMENTO
========================================================= */

dataNascimentoInput?.addEventListener(
    "input",
    () => {

        let valor =
            dataNascimentoInput.value
                .replace(/\D/g, "")
                .slice(0, 8);

        if(valor.length > 4){

            valor =
                `${valor.slice(0,2)}/${valor.slice(2,4)}/${valor.slice(4)}`;

        }else if(valor.length > 2){

            valor =
                `${valor.slice(0,2)}/${valor.slice(2)}`;

        }

        dataNascimentoInput.value =
            valor;

    }
);


/* =========================================================
   CARREGAMENTO DO PERFIL
========================================================= */

async function carregarPerfil(){

    if(!usuarioId){

        if(loadingInicial){

            loadingInicial.classList.remove(
                "active"
            );

        }

        alert(
            "Faça login novamente."
        );

        window.location.replace(
            "./login.html"
        );

        return;

    }


    try{

        const resposta =
            await fetch(
                `${SUPABASE_URL}/rest/v1/usuarios?id=eq.${encodeURIComponent(usuarioId)}`,
                {
                    method: "GET",

                    headers: {

                        "apikey":
                            SUPABASE_KEY,

                        "Authorization":
                            `Bearer ${SUPABASE_KEY}`,

                        "Content-Type":
                            "application/json"

                    }

                }
            );


        if(!resposta.ok){

            const mensagem =
                await resposta.text();

            throw new Error(
                mensagem ||
                "Erro ao carregar o perfil."
            );

        }


        const dados =
            await resposta.json();


        if(
            !Array.isArray(dados) ||
            dados.length === 0
        ){

            throw new Error(
                "Usuário não encontrado."
            );

        }


        const usuario =
            dados[0];


        /* =================================================
           BANNER
        ================================================= */

        corBannerAtual =
            usuario.cor_banner ||
            "banner-verde";


        if(perfilBanner){

            perfilBanner.className =
                `perfil-banner ${corBannerAtual}`;

        }


        /* =================================================
           FOTO
        ================================================= */

        fotoBase64 =
            usuario.foto_perfil ||
            "";


        if(
            previewFoto &&
            usuario.foto_perfil
        ){

            previewFoto.src =
                usuario.foto_perfil;

        }


        /* =================================================
           DADOS ORIGINAIS
        ================================================= */

        dadosOriginais = {

            cor_banner:
                corBannerAtual,

            apelido:
                usuario.apelido ||
                "",

            data_nascimento:
                usuario.data_nascimento ||
                null,

            foto_perfil:
                usuario.foto_perfil ||
                ""

        };


        /* =================================================
           PREENCHIMENTO DOS CAMPOS
        ================================================= */

        if(nomeInput){

            nomeInput.value =
                usuario.nome ||
                "";

            /*
               Garantia adicional:
               Nome nunca pode ser editado.
            */

            nomeInput.disabled =
                true;

        }


        if(apelidoInput){

            apelidoInput.value =
                usuario.apelido ||
                "";

        }


        if(emailInput){

            emailInput.value =
                usuario.email ||
                "";

            /*
               Garantia adicional:
               Email nunca pode ser editado.
            */

            emailInput.disabled =
                true;

        }


        if(telefoneInput){

            telefoneInput.value =
                usuario.telefone ||
                "";

            /*
               Garantia adicional:
               Telefone nunca pode ser editado.
            */

            telefoneInput.disabled =
                true;

        }


        if(dataNascimentoInput){

            dataNascimentoInput.value =
                dataBancoParaTela(
                    usuario.data_nascimento
                );

        }


        /* =================================================
           NOME DO CABEÇALHO
        ================================================= */

        atualizarNomePerfil(
            usuario.nome,
            usuario.apelido
        );


        /* =================================================
           FOTO PLACEHOLDER
        ================================================= */

        const fotoPlaceholder =
            document.getElementById(
                "fotoPlaceholder"
            );

        if(
            fotoPlaceholder &&
            usuario.foto_perfil
        ){

            fotoPlaceholder.style.display =
                "none";

        }


        /* =================================================
           FINALIZA LOADING INICIAL
        ================================================= */

        setTimeout(
            () => {

                if(loadingInicial){

                    loadingInicial.classList.remove(
                        "active"
                    );

                }

            },
            500
        );


    }catch(erro){

        console.error(
            "Erro ao carregar perfil:",
            erro
        );


        if(loadingInicial){

            loadingInicial.classList.remove(
                "active"
            );

        }


        alert(
            "Erro ao carregar perfil."
        );

    }

}


/* =========================================================
   INICIA CARREGAMENTO
========================================================= */

carregarPerfil();


/* =========================================================
   FOTO DE PERFIL
========================================================= */

fotoInput?.addEventListener(
    "change",
    () => {

        const arquivo =
            fotoInput.files?.[0];

        if(!arquivo){

            return;

        }


        /* =================================================
           VALIDAÇÃO DO TIPO
        ================================================= */

        const tiposPermitidos = [

            "image/png",
            "image/jpeg",
            "image/webp"

        ];


        if(
            !tiposPermitidos.includes(
                arquivo.type
            )
        ){

            fotoInput.value =
                "";

            abrirLoading(
                "Formato de imagem inválido."
            );

            mostrarErro(
                "Use PNG, JPG ou WEBP."
            );

            setTimeout(
                fecharLoading,
                2500
            );

            return;

        }


        /* =================================================
           LIMITE DE TAMANHO
        ================================================= */

        const tamanhoMaximo =
            5 * 1024 * 1024;


        if(
            arquivo.size >
            tamanhoMaximo
        ){

            fotoInput.value =
                "";

            abrirLoading(
                "Imagem muito grande."
            );

            mostrarErro(
                "A imagem deve ter no máximo 5 MB."
            );

            setTimeout(
                fecharLoading,
                2500
            );

            return;

        }


        /* =================================================
           CONVERSÃO PARA BASE64
        ================================================= */

        const reader =
            new FileReader();


        reader.onload =
            (evento) => {

                fotoBase64 =
                    evento.target.result;


                if(previewFoto){

                    previewFoto.src =
                        fotoBase64;

                }


                const fotoPlaceholder =
                    document.getElementById(
                        "fotoPlaceholder"
                    );


                if(fotoPlaceholder){

                    fotoPlaceholder.style.display =
                        "none";

                }

            };


        reader.onerror =
            () => {

                console.error(
                    "Erro ao ler a imagem."
                );

                fotoInput.value =
                    "";

                alert(
                    "Não foi possível carregar a imagem."
                );

            };


        reader.readAsDataURL(
            arquivo
        );

    }
);


/* =========================================================
   SALVAR PERFIL
========================================================= */

form?.addEventListener(
    "submit",
    async (e) => {

        e.preventDefault();


        /* =================================================
           GARANTIAS DE SEGURANÇA NO FRONT-END
        ================================================= */

        if(nomeInput){

            nomeInput.disabled =
                true;

        }

        if(emailInput){

            emailInput.disabled =
                true;

        }

        if(telefoneInput){

            telefoneInput.disabled =
                true;

        }


        /* =================================================
           GARANTE QUE OS DADOS ORIGINAIS EXISTEM
        ================================================= */

        if(!dadosOriginais){

            abrirLoading(
                "Carregando perfil..."
            );

            mostrarErro(
                "Não foi possível identificar os dados atuais."
            );

            setTimeout(
                fecharLoading,
                2500
            );

            return;

        }


        /* =================================================
           APELIDO
        ================================================= */

        const apelidoAtual =
            apelidoInput
                ? apelidoInput.value.trim()
                : "";


        /* =================================================
           DATA
        ================================================= */

        const dataNascimentoTela =
            dataNascimentoInput
                ? dataNascimentoInput.value.trim()
                : "";


        /* =================================================
           VALIDAÇÃO DA DATA
        ================================================= */

        if(
            dataNascimentoTela &&
            !validarDataNascimento(
                dataNascimentoTela
            )
        ){

            abrirLoading(
                "Data inválida."
            );

            mostrarErro(
                "Digite uma data de nascimento válida."
            );

            setTimeout(
                fecharLoading,
                2500
            );

            return;

        }


        const dataNascimentoAtual =
            dataNascimentoTela
                ? dataTelaParaBanco(
                    dataNascimentoTela
                )
                : null;


        /* =================================================
           GARANTE FORMATO VÁLIDO
        ================================================= */

        if(
            dataNascimentoTela &&
            !dataNascimentoAtual
        ){

            abrirLoading(
                "Data inválida."
            );

            mostrarErro(
                "Use o formato DD/MM/AAAA."
            );

            setTimeout(
                fecharLoading,
                2500
            );

            return;

        }


        /* =================================================
           VERIFICA SE HOUVE ALTERAÇÃO
        ================================================= */

        const semMudancas =
            corBannerAtual ===
                dadosOriginais.cor_banner &&

            apelidoAtual ===
                dadosOriginais.apelido &&

            dataNascimentoAtual ===
                dadosOriginais.data_nascimento &&

            fotoBase64 ===
                dadosOriginais.foto_perfil;


        if(semMudancas){

            abrirLoading(
                "Verificando..."
            );

            mostrarAviso(
                "Nenhuma alteração foi feita."
            );

            setTimeout(
                fecharLoading,
                2000
            );

            return;

        }


        /* =================================================
           ABRE LOADING
        ================================================= */

        abrirLoading(
            "Salvando perfil..."
        );


        /* =================================================
           DADOS QUE PODEM SER ATUALIZADOS
           
           IMPORTANTE:
           Nome, email e telefone NÃO estão aqui.
        ================================================= */

        const dadosAtualizados = {

            apelido:
                apelidoAtual,

            data_nascimento:
                dataNascimentoAtual,

            foto_perfil:
                fotoBase64,

            cor_banner:
                corBannerAtual

        };


        try{

            /* =============================================
               PATCH NO SUPABASE
            ============================================= */

            const resposta =
                await fetch(
                    `${SUPABASE_URL}/rest/v1/usuarios?id=eq.${encodeURIComponent(usuarioId)}`,
                    {
                        method: "PATCH",

                        headers: {

                            "apikey":
                                SUPABASE_KEY,

                            "Authorization":
                                `Bearer ${SUPABASE_KEY}`,

                            "Content-Type":
                                "application/json",

                            "Prefer":
                                "return=representation"

                        },

                        body:
                            JSON.stringify(
                                dadosAtualizados
                            )

                    }
                );


            /* =============================================
               VERIFICAÇÃO REAL DA RESPOSTA
            ============================================= */

            if(!resposta.ok){

                let mensagemErro =
                    "";

                try{

                    const erroJson =
                        await resposta.json();

                    mensagemErro =
                        erroJson.message ||
                        erroJson.error ||
                        erroJson.hint ||
                        "";

                }catch{

                    try{

                        mensagemErro =
                            await resposta.text();

                    }catch{

                        mensagemErro =
                            "";

                    }

                }


                console.error(
                    "Erro retornado pelo Supabase:",
                    mensagemErro
                );


                throw new Error(
                    mensagemErro ||
                    "Erro ao salvar o perfil."
                );

            }


            /* =============================================
               ATUALIZA DADOS ORIGINAIS
            ============================================= */

            dadosOriginais = {

                cor_banner:
                    dadosAtualizados.cor_banner,

                apelido:
                    dadosAtualizados.apelido,

                data_nascimento:
                    dadosAtualizados.data_nascimento,

                foto_perfil:
                    dadosAtualizados.foto_perfil

            };


            /* =============================================
               ATUALIZA O NOME MOSTRADO NO PERFIL
            ============================================= */

            atualizarNomePerfil(
                nomeInput
                    ? nomeInput.value
                    : "",
                dadosAtualizados.apelido
            );


            /* =============================================
               ATUALIZA LOCALSTORAGE DA FOTO
            ============================================= */

            if(
                dadosAtualizados.foto_perfil
            ){

                localStorage.setItem(
                    "usuarioFoto",
                    dadosAtualizados.foto_perfil
                );

            }else{

                localStorage.removeItem(
                    "usuarioFoto"
                );

            }


            /* =============================================
               SUCESSO
            ============================================= */

            mostrarSucesso(
                "Perfil atualizado!"
            );


            /* =============================================
               REDIRECIONA PARA HOME
            ============================================= */

            setTimeout(
                () => {

                    window.location.replace(
                        "./home.html"
                    );

                },
                1500
            );


        }catch(erro){

            console.error(
                "Erro ao salvar perfil:",
                erro
            );


            mostrarErro(
                "Erro ao salvar perfil."
            );


            setTimeout(
                fecharLoading,
                2500
            );

        }

    }
);


/* =========================================================
   MODAL DE BANNER
========================================================= */

btnEscolherBanner?.addEventListener(
    "click",
    () => {

        modalBanner?.classList.add(
            "active"
        );

    }
);


fecharModalBanner?.addEventListener(
    "click",
    () => {

        modalBanner?.classList.remove(
            "active"
        );

    }
);


/* =========================================================
   FECHAR MODAL CLICANDO FORA
========================================================= */

modalBanner?.addEventListener(
    "click",
    (evento) => {

        if(
            evento.target ===
            modalBanner
        ){

            modalBanner.classList.remove(
                "active"
            );

        }

    }
);


/* =========================================================
   SELEÇÃO DOS BANNERS
========================================================= */

document
    .querySelectorAll(".banner-card")
    .forEach(
        (opcao) => {

            opcao.addEventListener(
                "click",
                () => {

                    const novoBanner =
                        opcao.dataset.banner;


                    if(!novoBanner){

                        return;

                    }


                    corBannerAtual =
                        novoBanner;


                    if(perfilBanner){

                        perfilBanner.className =
                            `perfil-banner ${corBannerAtual}`;

                    }


                    /* =====================================
                       MARCA VISUALMENTE O SELECIONADO
                    ===================================== */

                    document
                        .querySelectorAll(
                            ".banner-card"
                        )
                        .forEach(
                            (card) => {

                                card.classList.remove(
                                    "selecionado"
                                );

                            }
                        );


                    opcao.classList.add(
                        "selecionado"
                    );


                    /* =====================================
                       FECHA MODAL
                    ===================================== */

                    modalBanner?.classList.remove(
                        "active"
                    );

                }
            );

        }
    );


/* =========================================================
   BOTÃO VOLTAR
========================================================= */

btnVoltar?.addEventListener(
    "click",
    () => {

        if(
            window.history.length > 1
        ){

            window.history.back();

        }else{

            window.location.href =
                "./home.html";

        }

    }
);
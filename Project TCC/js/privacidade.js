"use strict";

/* =========================================================
   CONFIGURAÇÃO SUPABASE
========================================================= */

const SUPABASE_URL =
    "https://mnfryxvtogpiwacpyhgo.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_YYMfDfWKaer8F1IEOFVOMQ_acS2xa2G";


/* =========================================================
   ELEMENTOS DO HTML
========================================================= */

const emailInput =
    document.getElementById("novoEmail");

const telefoneInput =
    document.getElementById("novoTelefone");

const senhaAtualInput =
    document.getElementById("senha");

const novaSenhaInput =
    document.getElementById("novaSenha");

const confirmarSenhaInput =
    document.getElementById("confirmarSenha");

const form =
    document.getElementById("formPrivacidade");

const loadingInicial =
    document.getElementById("loadingInicial");

const loadingScreen =
    document.getElementById("loadingScreen");

const loader =
    document.getElementById("loader");

const successIcon =
    document.getElementById("successIcon");

const errorIcon =
    document.getElementById("errorIcon");

const statusText =
    document.getElementById("statusText");

const btnVoltar =
    document.getElementById("btnVoltar");


/* =========================================================
   USUÁRIO
========================================================= */

const usuarioId =
    localStorage.getItem("usuarioId") ||
    sessionStorage.getItem("usuarioId");


/* =========================================================
   DADOS ORIGINAIS DO USUÁRIO
========================================================= */

let dadosOriginais = {
    email: "",
    telefone: "",
    senha: ""
};


/* =========================================================
   VERIFICAÇÃO DOS ELEMENTOS
========================================================= */

if (!form) {
    console.error(
        "Erro: o formulário #formPrivacidade não foi encontrado."
    );
}


/* =========================================================
   LOADING INICIAL
========================================================= */

function fecharLoadingInicial() {

    if (!loadingInicial) {
        return;
    }

    loadingInicial.classList.remove("active");
}


/* =========================================================
   ABRIR LOADING DE AÇÃO
========================================================= */

function abrirLoading(texto) {

    if (!loadingScreen) {
        return;
    }

    loadingScreen.classList.add("active");

    if (loader) {
        loader.style.display = "block";
    }

    if (successIcon) {
        successIcon.style.display = "none";
    }

    if (errorIcon) {
        errorIcon.style.display = "none";
    }

    if (statusText) {
        statusText.textContent = texto;
    }
}


/* =========================================================
   MOSTRAR SUCESSO
========================================================= */

function sucesso(texto) {

    if (loader) {
        loader.style.display = "none";
    }

    if (successIcon) {
        successIcon.style.display = "flex";
    }

    if (errorIcon) {
        errorIcon.style.display = "none";
    }

    if (statusText) {
        statusText.textContent = texto;
    }
}


/* =========================================================
   MOSTRAR ERRO
========================================================= */

function erro(texto, icone = "!") {

    if (loader) {
        loader.style.display = "none";
    }

    if (successIcon) {
        successIcon.style.display = "none";
    }

    if (errorIcon) {
        errorIcon.style.display = "flex";
        errorIcon.textContent = icone;
    }

    if (statusText) {
        statusText.textContent = texto;
    }
}


/* =========================================================
   FECHAR LOADING DE AÇÃO
========================================================= */

function fecharLoading() {

    if (!loadingScreen) {
        return;
    }

    loadingScreen.classList.remove("active");
}


/* =========================================================
   FORMATAR TELEFONE
   FORMATO:
   (19) 98873-8046
========================================================= */

function formatarTelefone(valor) {

    let numeros =
        valor.replace(/\D/g, "");

    numeros =
        numeros.substring(0, 11);

    if (numeros.length <= 2) {

        return numeros
            ? `(${numeros}`
            : "";
    }

    if (numeros.length <= 7) {

        return `(${numeros.substring(0, 2)}) ${numeros.substring(2)}`;
    }

    return `(${numeros.substring(0, 2)}) ${numeros.substring(2, 7)}-${numeros.substring(7, 11)}`;
}


/* =========================================================
   MÁSCARA DO TELEFONE
========================================================= */

telefoneInput?.addEventListener(
    "input",
    () => {

        telefoneInput.value =
            formatarTelefone(
                telefoneInput.value
            );
    }
);


/* =========================================================
   PERMITIR SOMENTE NÚMEROS NO TELEFONE
   FUNCIONA TAMBÉM PARA COLAGEM
========================================================= */

telefoneInput?.addEventListener(
    "keydown",
    (event) => {

        const teclasPermitidas = [
            "Backspace",
            "Delete",
            "Tab",
            "ArrowLeft",
            "ArrowRight",
            "Home",
            "End"
        ];

        if (
            teclasPermitidas.includes(event.key) ||
            event.ctrlKey ||
            event.metaKey
        ) {
            return;
        }

        if (!/^\d$/.test(event.key)) {
            event.preventDefault();
        }
    }
);


/* =========================================================
   NORMALIZAR TELEFONE PARA COMPARAÇÃO
========================================================= */

function normalizarTelefone(valor) {

    return valor.replace(/\D/g, "");
}


/* =========================================================
   VALIDAR TELEFONE
========================================================= */

function validarTelefone(telefone) {

    const numeros =
        normalizarTelefone(telefone);

    /*
     * Telefone celular brasileiro:
     * DDD + 9 dígitos
     * Total: 11 números
     */

    if (numeros.length !== 11) {

        return {
            valido: false,
            erro:
                "Digite um telefone válido com DDD."
        };
    }

    return {
        valido: true,
        numero: numeros
    };
}


/* =========================================================
   VALIDAR EMAIL
========================================================= */

function validarEmail(email) {

    const emailLimpo =
        email.trim();

    if (!emailLimpo) {

        return {
            valido: false,
            erro:
                "Digite seu email."
        };
    }

    /*
     * Validação básica e segura
     * para email.
     */

    const regexEmail =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regexEmail.test(emailLimpo)) {

        return {
            valido: false,
            erro:
                "Digite um email válido."
        };
    }

    return {
        valido: true,
        email: emailLimpo
    };
}


/* =========================================================
   LIMITAR SENHAS A 8 CARACTERES
========================================================= */

function limitarSenha(input) {

    if (!input) {
        return;
    }

    input.addEventListener(
        "input",
        () => {

            if (input.value.length > 8) {

                input.value =
                    input.value.substring(
                        0,
                        8
                    );
            }
        }
    );
}


limitarSenha(senhaAtualInput);
limitarSenha(novaSenhaInput);
limitarSenha(confirmarSenhaInput);


/* =========================================================
   MOSTRAR / OCULTAR SENHA
========================================================= */

document
    .querySelectorAll(".btn-mostrar-senha")
    .forEach(
        (botao) => {

            botao.addEventListener(
                "click",
                () => {

                    const targetId =
                        botao.dataset.target;

                    const input =
                        document.getElementById(
                            targetId
                        );

                    if (!input) {
                        return;
                    }

                    const icone =
                        botao.querySelector("i");

                    if (
                        input.type === "password"
                    ) {

                        input.type =
                            "text";

                        if (icone) {

                            icone.classList.remove(
                                "fa-eye"
                            );

                            icone.classList.add(
                                "fa-eye-slash"
                            );
                        }

                        botao.setAttribute(
                            "aria-label",
                            "Ocultar senha"
                        );

                        botao.setAttribute(
                            "title",
                            "Ocultar senha"
                        );

                    } else {

                        input.type =
                            "password";

                        if (icone) {

                            icone.classList.remove(
                                "fa-eye-slash"
                            );

                            icone.classList.add(
                                "fa-eye"
                            );
                        }

                        botao.setAttribute(
                            "aria-label",
                            "Mostrar senha"
                        );

                        botao.setAttribute(
                            "title",
                            "Mostrar senha"
                        );
                    }
                }
            );
        }
    );


/* =========================================================
   CARREGAR DADOS DO USUÁRIO
========================================================= */

async function carregarPrivacidade() {

    try {

        if (!usuarioId) {

            throw new Error(
                "Usuário não identificado."
            );
        }


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


        if (!resposta.ok) {

            throw new Error(
                `Erro ao carregar usuário. Código: ${resposta.status}`
            );
        }


        const dados =
            await resposta.json();


        if (
            !Array.isArray(dados) ||
            dados.length === 0
        ) {

            throw new Error(
                "Usuário não encontrado."
            );
        }


        const usuario =
            dados[0];


        /* =====================================================
           PREENCHER EMAIL
        ===================================================== */

        if (emailInput) {

            emailInput.value =
                usuario.email || "";
        }


        /* =====================================================
           PREENCHER TELEFONE
        ===================================================== */

        const telefoneUsuario =
            usuario.telefone || "";

        if (telefoneInput) {

            telefoneInput.value =
                formatarTelefone(
                    telefoneUsuario
                );
        }


        /* =====================================================
           GUARDAR DADOS ORIGINAIS
        ===================================================== */

        dadosOriginais = {

            email:
                usuario.email || "",

            telefone:
                formatarTelefone(
                    telefoneUsuario
                ),

            senha:
                usuario.senha || ""
        };


        fecharLoadingInicial();

    } catch (error) {

        console.error(
            "Erro ao carregar privacidade:",
            error
        );


        fecharLoadingInicial();

        abrirLoading(
            "Erro ao carregar seus dados."
        );

        erro(
            error.message ||
            "Erro ao carregar seus dados."
        );


        setTimeout(
            () => {

                fecharLoading();

            },
            2500
        );
    }
}


/* =========================================================
   VALIDAR ALTERAÇÃO DE SENHA
========================================================= */

function validarAlteracaoSenha() {

    const senhaAtual =
        senhaAtualInput
            ? senhaAtualInput.value
            : "";

    const novaSenha =
        novaSenhaInput
            ? novaSenhaInput.value
            : "";

    const confirmarSenha =
        confirmarSenhaInput
            ? confirmarSenhaInput.value
            : "";


    /* =====================================================
       NENHUM CAMPO PREENCHIDO
    ===================================================== */

    if (
        senhaAtual === "" &&
        novaSenha === "" &&
        confirmarSenha === ""
    ) {

        return {
            alterar: false
        };
    }


    /* =====================================================
       SENHA ATUAL
    ===================================================== */

    if (senhaAtual === "") {

        return {
            alterar: false,
            erro:
                "Digite sua senha atual."
        };
    }


    /* =====================================================
       SENHA ATUAL DEVE TER EXATAMENTE 8
    ===================================================== */

    if (senhaAtual.length !== 8) {

        return {
            alterar: false,
            erro:
                "A senha atual deve ter exatamente 8 caracteres."
        };
    }


    /* =====================================================
       NOVA SENHA
    ===================================================== */

    if (novaSenha === "") {

        return {
            alterar: false,
            erro:
                "Digite uma nova senha."
        };
    }


    /* =====================================================
       NOVA SENHA DEVE TER EXATAMENTE 8
    ===================================================== */

    if (novaSenha.length !== 8) {

        return {
            alterar: false,
            erro:
                "A nova senha deve ter exatamente 8 caracteres."
        };
    }


    /* =====================================================
       CONFIRMAÇÃO
    ===================================================== */

    if (confirmarSenha === "") {

        return {
            alterar: false,
            erro:
                "Confirme sua nova senha."
        };
    }


    /* =====================================================
       CONFIRMAÇÃO DEVE TER EXATAMENTE 8
    ===================================================== */

    if (confirmarSenha.length !== 8) {

        return {
            alterar: false,
            erro:
                "A confirmação da senha deve ter exatamente 8 caracteres."
        };
    }


    /* =====================================================
       VERIFICAR SENHA ATUAL
    ===================================================== */

    if (
        senhaAtual !==
        dadosOriginais.senha
    ) {

        return {
            alterar: false,
            erro:
                "Senha atual incorreta."
        };
    }


    /* =====================================================
       NOVA SENHA DIFERENTE DA ATUAL
    ===================================================== */

    if (
        novaSenha ===
        senhaAtual
    ) {

        return {
            alterar: false,
            erro:
                "A nova senha deve ser diferente da senha atual."
        };
    }


    /* =====================================================
       CONFIRMAR NOVA SENHA
    ===================================================== */

    if (
        novaSenha !==
        confirmarSenha
    ) {

        return {
            alterar: false,
            erro:
                "As senhas não coincidem."
        };
    }


    return {

        alterar: true,

        senhaAtual:
            senhaAtual,

        novaSenha:
            novaSenha
    };
}


/* =========================================================
   BOTÃO SALVAR
========================================================= */

form?.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        if (!usuarioId) {

            abrirLoading(
                "Verificando usuário..."
            );

            erro(
                "Usuário não identificado."
            );

            setTimeout(
                fecharLoading,
                2500
            );

            return;
        }


        try {

            /* =================================================
               VALORES ATUAIS DO FORMULÁRIO
            ================================================= */

            const emailNovo =
                emailInput
                    ? emailInput.value.trim()
                    : "";

            const telefoneNovo =
                telefoneInput
                    ? formatarTelefone(
                        telefoneInput.value
                    )
                    : "";


            /* =================================================
               VALIDAR EMAIL
            ================================================= */

            const resultadoEmail =
                validarEmail(
                    emailNovo
                );


            if (!resultadoEmail.valido) {

                abrirLoading(
                    "Validando email..."
                );

                erro(
                    resultadoEmail.erro
                );

                setTimeout(
                    fecharLoading,
                    2000
                );

                return;
            }


            /* =================================================
               VALIDAR TELEFONE
            ================================================= */

            const resultadoTelefone =
                validarTelefone(
                    telefoneNovo
                );


            if (!resultadoTelefone.valido) {

                abrirLoading(
                    "Validando telefone..."
                );

                erro(
                    resultadoTelefone.erro
                );

                setTimeout(
                    fecharLoading,
                    2000
                );

                return;
            }


            /* =================================================
               VALIDAR SENHA
            ================================================= */

            const resultadoSenha =
                validarAlteracaoSenha();


            if (resultadoSenha.erro) {

                abrirLoading(
                    "Validando dados..."
                );

                erro(
                    resultadoSenha.erro
                );

                setTimeout(
                    fecharLoading,
                    2000
                );

                return;
            }


            /* =================================================
               VERIFICAR ALTERAÇÕES
            ================================================= */

            const emailAlterado =
                emailNovo.toLowerCase() !==
                dadosOriginais.email
                    .trim()
                    .toLowerCase();


            const telefoneAlterado =
                normalizarTelefone(
                    telefoneNovo
                ) !==
                normalizarTelefone(
                    dadosOriginais.telefone
                );


            const senhaAlterada =
                resultadoSenha.alterar === true;


            const nadaAlterado =
                !emailAlterado &&
                !telefoneAlterado &&
                !senhaAlterada;


            if (nadaAlterado) {

                abrirLoading(
                    "Verificando alterações..."
                );

                erro(
                    "Nenhuma alteração foi realizada."
                );

                setTimeout(
                    fecharLoading,
                    2000
                );

                return;
            }


            /* =================================================
               OBJETO DE ATUALIZAÇÃO
            ================================================= */

            const atualizacao = {};


            /* =================================================
               ALTERAR EMAIL
            ================================================= */

            if (emailAlterado) {

                atualizacao.email =
                    emailNovo;
            }


            /* =================================================
               ALTERAR TELEFONE
            ================================================= */

            if (telefoneAlterado) {

                atualizacao.telefone =
                    telefoneNovo;
            }


            /* =================================================
               ALTERAR SENHA
            ================================================= */

            if (senhaAlterada) {

                atualizacao.senha =
                    resultadoSenha.novaSenha;
            }


            /* =================================================
               SALVAR NO SUPABASE
            ================================================= */

            abrirLoading(
                "Salvando alterações..."
            );


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
                                atualizacao
                            )
                    }
                );


            /* =================================================
               VERIFICAR RESPOSTA DO SUPABASE
            ================================================= */

            if (!resposta.ok) {

                let mensagem =
                    "Erro ao salvar as alterações.";


                try {

                    const respostaErro =
                        await resposta.json();


                    if (
                        respostaErro?.message
                    ) {

                        mensagem =
                            respostaErro.message;

                    } else if (
                        respostaErro?.details
                    ) {

                        mensagem =
                            respostaErro.details;

                    } else if (
                        respostaErro?.hint
                    ) {

                        mensagem =
                            respostaErro.hint;
                    }

                } catch {

                    /*
                     * Mantém a mensagem padrão
                     * caso o Supabase não retorne JSON.
                     */
                }


                throw new Error(
                    mensagem
                );
            }


            /* =================================================
               ATUALIZAR DADOS ORIGINAIS
            ================================================= */

            dadosOriginais.email =
                emailNovo;

            dadosOriginais.telefone =
                telefoneNovo;


            if (senhaAlterada) {

                dadosOriginais.senha =
                    resultadoSenha.novaSenha;
            }


            /* =================================================
               GARANTIR TELEFONE FORMATADO NO CAMPO
            ================================================= */

            if (telefoneInput) {

                telefoneInput.value =
                    formatarTelefone(
                        telefoneNovo
                    );
            }


            /* =================================================
               LIMPAR CAMPOS DE SENHA
            ================================================= */

            if (senhaAtualInput) {

                senhaAtualInput.value =
                    "";
            }

            if (novaSenhaInput) {

                novaSenhaInput.value =
                    "";
            }

            if (confirmarSenhaInput) {

                confirmarSenhaInput.value =
                    "";
            }


            /* =================================================
               SUCESSO
            ================================================= */

            sucesso(
                "Dados atualizados com sucesso!"
            );


            /* =================================================
               REDIRECIONAR PARA HOME
            ================================================= */

            setTimeout(
                () => {

                    window.location.replace(
                        "./home.html"
                    );

                },
                1500
            );


        } catch (error) {

            console.error(
                "Erro ao salvar alterações:",
                error
            );


            erro(
                error.message ||
                "Erro ao atualizar seus dados."
            );


            setTimeout(
                fecharLoading,
                2500
            );
        }
    }
);


/* =========================================================
   BOTÃO VOLTAR
========================================================= */

btnVoltar?.addEventListener(
    "click",
    () => {

        if (
            window.history.length > 1
        ) {

            window.history.back();

        } else {

            window.location.href =
                "./home.html";
        }
    }
);


/* =========================================================
   INICIAR PÁGINA
========================================================= */

carregarPrivacidade();
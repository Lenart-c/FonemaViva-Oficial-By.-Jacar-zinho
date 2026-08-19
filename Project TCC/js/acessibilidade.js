/* =========================================================
   FONEMAVIVA — ACESSIBILIDADE GLOBAL
   JAVASCRIPT
========================================================= */


/* =========================================================
   SUPABASE
========================================================= */

const SUPABASE_URL =
    "https://mnfryxvtogpiwacpyhgo.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_YYMfDfWKaer8F1IEOFVOMQ_acS2xa2G";

const supabaseClient =
    window.supabase?.createClient
        ? window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY
        )
        : null;


/* =========================================================
   CONFIGURAÇÃO PADRÃO
========================================================= */

const CONFIGURACAO_PADRAO_ACESSIBILIDADE = {

    tamanhoTexto: "normal",

    altoContraste: false,

    escalaCinza: false,

    reduzirAnimacoes: false,

    espacamentoTexto: "normal",

    fonteAmigavel: false,

    botoesMaiores: false,

    destaqueFoco: true,

    feedbackSonoro: true,

    indicadorMicrofone: true

};


/* =========================================================
   CHAVE DO LOCALSTORAGE
========================================================= */

const CHAVE_ACESSIBILIDADE =
    "fonemaviva-acessibilidade";


/* =========================================================
   FUNÇÃO — CARREGAR CONFIGURAÇÕES
========================================================= */

function carregarConfiguracoesAcessibilidade() {

    try {

        const configuracoesSalvas =
            localStorage.getItem(
                CHAVE_ACESSIBILIDADE
            );


        if (!configuracoesSalvas) {

            return {
                ...CONFIGURACAO_PADRAO_ACESSIBILIDADE
            };

        }


        const configuracoes =
            JSON.parse(configuracoesSalvas);


        return {
            ...CONFIGURACAO_PADRAO_ACESSIBILIDADE,
            ...configuracoes
        };

    } catch (erro) {

        console.warn(
            "FonemaViva: não foi possível carregar as configurações de acessibilidade.",
            erro
        );


        return {
            ...CONFIGURACAO_PADRAO_ACESSIBILIDADE
        };

    }

}


/* =========================================================
   CONFIGURAÇÕES ATUAIS
========================================================= */

let configuracoesAcessibilidade =
    carregarConfiguracoesAcessibilidade();


/* =========================================================
   FUNÇÃO — SALVAR CONFIGURAÇÕES
========================================================= */

function salvarConfiguracoesAcessibilidade() {

    try {

        localStorage.setItem(
            CHAVE_ACESSIBILIDADE,
            JSON.stringify(
                configuracoesAcessibilidade
            )
        );

    } catch (erro) {

        console.error(
            "FonemaViva: erro ao salvar configurações de acessibilidade.",
            erro
        );

    }

}


/* =========================================================
   FUNÇÃO — OBTER USUÁRIO
========================================================= */

function obterUsuarioIdAcessibilidade() {

    const usuarioIdLocal =
        localStorage.getItem("usuarioId");


    if (usuarioIdLocal) {

        return usuarioIdLocal;

    }


    const usuarioIdSession =
        sessionStorage.getItem("usuarioId");


    if (usuarioIdSession) {

        return usuarioIdSession;

    }


    return null;

}


/* =========================================================
   TEMA
========================================================= */

let temaAtual =
    "system";


/* =========================================================
   APLICAR TEMA
========================================================= */

function aplicarTemaGlobal(tema) {

    if (
        tema !== "system" &&
        tema !== "light" &&
        tema !== "dark"
    ) {

        tema = "system";

    }


    temaAtual = tema;


    const aplicarEscuro =
        tema === "dark" ||
        (
            tema === "system" &&
            window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches
        );


    document.body.classList.toggle(
        "dark-mode",
        aplicarEscuro
    );


    document.documentElement.dataset.tema =
        tema;

}


/* =========================================================
   CARREGAR TEMA
========================================================= */

async function carregarTemaGlobal() {

    const usuarioId =
        obterUsuarioIdAcessibilidade();


    if (
        !usuarioId ||
        !supabaseClient
    ) {

        aplicarTemaGlobal("system");

        return;

    }


    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("usuarios")
            .select("tema")
            .eq("id", usuarioId)
            .maybeSingle();


        if (error) {

            console.error(
                "FonemaViva: erro ao carregar tema:",
                error
            );

            aplicarTemaGlobal("system");

            return;

        }


        const tema =
            data?.tema || "system";


        aplicarTemaGlobal(tema);

    } catch (erro) {

        console.error(
            "FonemaViva: erro inesperado ao carregar tema:",
            erro
        );

        aplicarTemaGlobal("system");

    }

}


/* =========================================================
   SALVAR TEMA
========================================================= */

async function salvarTemaGlobal(tema) {

    if (
        tema !== "system" &&
        tema !== "light" &&
        tema !== "dark"
    ) {

        tema = "system";

    }


    aplicarTemaGlobal(tema);


    const usuarioId =
        obterUsuarioIdAcessibilidade();


    if (
        !usuarioId ||
        !supabaseClient
    ) {

        return;

    }


    try {

        const {
            error
        } = await supabaseClient
            .from("usuarios")
            .update({
                tema: tema
            })
            .eq("id", usuarioId);


        if (error) {

            console.error(
                "FonemaViva: erro ao salvar tema:",
                error
            );

        }

    } catch (erro) {

        console.error(
            "FonemaViva: erro inesperado ao salvar tema:",
            erro
        );

    }

}


/* =========================================================
   TAMANHO DO TEXTO
========================================================= */

function aplicarTamanhoTextoGlobal() {

    document.body.classList.remove(
        "texto-pequeno",
        "texto-grande"
    );


    if (
        configuracoesAcessibilidade.tamanhoTexto ===
        "pequeno"
    ) {

        document.body.classList.add(
            "texto-pequeno"
        );

    }


    if (
        configuracoesAcessibilidade.tamanhoTexto ===
        "grande"
    ) {

        document.body.classList.add(
            "texto-grande"
        );

    }

}


/* =========================================================
   AUMENTAR TEXTO
========================================================= */

function aumentarTexto() {

    const tamanho =
        configuracoesAcessibilidade.tamanhoTexto;


    if (tamanho === "pequeno") {

        configuracoesAcessibilidade.tamanhoTexto =
            "normal";

    }

    else if (tamanho === "normal") {

        configuracoesAcessibilidade.tamanhoTexto =
            "grande";

    }


    salvarConfiguracoesAcessibilidade();

    aplicarTamanhoTextoGlobal();

    atualizarInterfaceAcessibilidade();

}


/* =========================================================
   DIMINUIR TEXTO
========================================================= */

function diminuirTexto() {

    const tamanho =
        configuracoesAcessibilidade.tamanhoTexto;


    if (tamanho === "grande") {

        configuracoesAcessibilidade.tamanhoTexto =
            "normal";

    }

    else if (tamanho === "normal") {

        configuracoesAcessibilidade.tamanhoTexto =
            "pequeno";

    }


    salvarConfiguracoesAcessibilidade();

    aplicarTamanhoTextoGlobal();

    atualizarInterfaceAcessibilidade();

}


/* =========================================================
   ALTO CONTRASTE
========================================================= */

function aplicarAltoContrasteGlobal() {

    document.body.classList.toggle(
        "alto-contraste",
        configuracoesAcessibilidade.altoContraste
    );

}


/* =========================================================
   ESCALA DE CINZA
========================================================= */

function aplicarEscalaCinzaGlobal() {

    document.body.classList.toggle(
        "escala-cinza",
        configuracoesAcessibilidade.escalaCinza
    );

}


/* =========================================================
   REDUZIR ANIMAÇÕES
========================================================= */

function aplicarReducaoAnimacoesGlobal() {

    document.body.classList.toggle(
        "reduzir-animacoes",
        configuracoesAcessibilidade.reduzirAnimacoes
    );

}


/* =========================================================
   ESPAÇAMENTO DO TEXTO
========================================================= */

function aplicarEspacamentoTextoGlobal() {

    document.body.classList.remove(
        "espacamento-normal",
        "espacamento-medio",
        "espacamento-grande"
    );


    const espacamento =
        configuracoesAcessibilidade.espacamentoTexto;


    if (
        espacamento === "normal" ||
        espacamento === "medio" ||
        espacamento === "grande"
    ) {

        document.body.classList.add(
            `espacamento-${espacamento}`
        );

    }

}


/* =========================================================
   FONTE AMIGÁVEL
========================================================= */

function aplicarFonteAmigavelGlobal() {

    document.body.classList.toggle(
        "fonte-amigavel",
        configuracoesAcessibilidade.fonteAmigavel
    );

}


/* =========================================================
   BOTÕES MAIORES
========================================================= */

function aplicarBotoesMaioresGlobal() {

    document.body.classList.toggle(
        "botoes-maiores",
        configuracoesAcessibilidade.botoesMaiores
    );

}


/* =========================================================
   DESTAQUE DE FOCO
========================================================= */

function aplicarDestaqueFocoGlobal() {

    document.body.classList.toggle(
        "sem-destaque-foco",
        !configuracoesAcessibilidade.destaqueFoco
    );

}


/* =========================================================
   FEEDBACK SONORO
========================================================= */

function aplicarFeedbackSonoroGlobal() {

    document.body.classList.toggle(
        "feedback-sonoro-desativado",
        !configuracoesAcessibilidade.feedbackSonoro
    );

}


/* =========================================================
   INDICADOR DO MICROFONE
========================================================= */

function aplicarIndicadorMicrofoneGlobal() {

    document.body.classList.toggle(
        "indicador-microfone-desativado",
        !configuracoesAcessibilidade.indicadorMicrofone
    );

}


/* =========================================================
   APLICAR TODAS AS CONFIGURAÇÕES
========================================================= */

function aplicarTodasConfiguracoesAcessibilidade() {

    if (!document.body) {

        return;

    }


    aplicarTamanhoTextoGlobal();

    aplicarAltoContrasteGlobal();

    aplicarEscalaCinzaGlobal();

    aplicarReducaoAnimacoesGlobal();

    aplicarEspacamentoTextoGlobal();

    aplicarFonteAmigavelGlobal();

    aplicarBotoesMaioresGlobal();

    aplicarDestaqueFocoGlobal();

    aplicarFeedbackSonoroGlobal();

    aplicarIndicadorMicrofoneGlobal();

}


/* =========================================================
   ALTERAR CONFIGURAÇÃO
========================================================= */

function alterarConfiguracaoAcessibilidade(
    propriedade,
    valor
) {

    if (
        !Object.prototype.hasOwnProperty.call(
            CONFIGURACAO_PADRAO_ACESSIBILIDADE,
            propriedade
        )
    ) {

        console.warn(
            `FonemaViva: configuração "${propriedade}" não existe.`
        );

        return;

    }


    configuracoesAcessibilidade[
        propriedade
    ] = valor;


    salvarConfiguracoesAcessibilidade();

    aplicarTodasConfiguracoesAcessibilidade();

    atualizarInterfaceAcessibilidade();

}


/* =========================================================
   ATUALIZAR INTERFACE DA PÁGINA DE ACESSIBILIDADE
========================================================= */

function atualizarInterfaceAcessibilidade() {

    const textoTamanho =
        document.getElementById(
            "textoTamanho"
        );

    const altoContraste =
        document.getElementById(
            "altoContraste"
        );

    const escalaCinza =
        document.getElementById(
            "escalaCinza"
        );

    const reduzirAnimacoes =
        document.getElementById(
            "reduzirAnimacoes"
        );

    const espacamentoTexto =
        document.getElementById(
            "espacamentoTexto"
        );

    const fonteAmigavel =
        document.getElementById(
            "fonteAmigavel"
        );

    const botoesMaiores =
        document.getElementById(
            "botoesMaiores"
        );

    const destaqueFoco =
        document.getElementById(
            "destaqueFoco"
        );

    const feedbackSonoro =
        document.getElementById(
            "feedbackSonoro"
        );

    const indicadorMicrofone =
        document.getElementById(
            "indicadorMicrofone"
        );


    /* =====================================================
       TEXTO
    ===================================================== */

    if (textoTamanho) {

        textoTamanho.textContent =
            configuracoesAcessibilidade
                .tamanhoTexto
                .charAt(0)
                .toUpperCase() +
            configuracoesAcessibilidade
                .tamanhoTexto
                .slice(1);

    }


    /* =====================================================
       CHECKBOXES
    ===================================================== */

    if (altoContraste) {

        altoContraste.checked =
            configuracoesAcessibilidade.altoContraste;

    }


    if (escalaCinza) {

        escalaCinza.checked =
            configuracoesAcessibilidade.escalaCinza;

    }


    if (reduzirAnimacoes) {

        reduzirAnimacoes.checked =
            configuracoesAcessibilidade.reduzirAnimacoes;

    }


    if (fonteAmigavel) {

        fonteAmigavel.checked =
            configuracoesAcessibilidade.fonteAmigavel;

    }


    if (botoesMaiores) {

        botoesMaiores.checked =
            configuracoesAcessibilidade.botoesMaiores;

    }


    if (destaqueFoco) {

        destaqueFoco.checked =
            configuracoesAcessibilidade.destaqueFoco;

    }


    if (feedbackSonoro) {

        feedbackSonoro.checked =
            configuracoesAcessibilidade.feedbackSonoro;

    }


    if (indicadorMicrofone) {

        indicadorMicrofone.checked =
            configuracoesAcessibilidade.indicadorMicrofone;

    }


    if (espacamentoTexto) {

        espacamentoTexto.value =
            configuracoesAcessibilidade.espacamentoTexto;

    }

}


/* =========================================================
   RESTAURAR CONFIGURAÇÕES
========================================================= */

async function restaurarConfiguracoesAcessibilidade() {

    const confirmar =
        window.confirm(
            "Deseja realmente restaurar todas as configurações de acessibilidade?"
        );


    if (!confirmar) {

        return;

    }


    configuracoesAcessibilidade = {
        ...CONFIGURACAO_PADRAO_ACESSIBILIDADE
    };


    salvarConfiguracoesAcessibilidade();


    await salvarTemaGlobal("system");


    aplicarTodasConfiguracoesAcessibilidade();

    atualizarInterfaceAcessibilidade();

}


/* =========================================================
   CONFIGURAÇÃO DOS CONTROLES
========================================================= */

function configurarControlesAcessibilidade() {


    /* =====================================================
       BOTÃO TEXTO MAIOR
    ===================================================== */

    const btnTextoMaior =
        document.getElementById(
            "btnTextoMaior"
        );


    if (btnTextoMaior) {

        btnTextoMaior.addEventListener(
            "click",
            aumentarTexto
        );

    }


    /* =====================================================
       BOTÃO TEXTO MENOR
    ===================================================== */

    const btnTextoMenor =
        document.getElementById(
            "btnTextoMenor"
        );


    if (btnTextoMenor) {

        btnTextoMenor.addEventListener(
            "click",
            diminuirTexto
        );

    }


    /* =====================================================
       ALTO CONTRASTE
    ===================================================== */

    const altoContraste =
        document.getElementById(
            "altoContraste"
        );


    if (altoContraste) {

        altoContraste.addEventListener(
            "change",
            () => {

                alterarConfiguracaoAcessibilidade(
                    "altoContraste",
                    altoContraste.checked
                );

            }
        );

    }


    /* =====================================================
       ESCALA DE CINZA
    ===================================================== */

    const escalaCinza =
        document.getElementById(
            "escalaCinza"
        );


    if (escalaCinza) {

        escalaCinza.addEventListener(
            "change",
            () => {

                alterarConfiguracaoAcessibilidade(
                    "escalaCinza",
                    escalaCinza.checked
                );

            }
        );

    }


    /* =====================================================
       REDUZIR ANIMAÇÕES
    ===================================================== */

    const reduzirAnimacoes =
        document.getElementById(
            "reduzirAnimacoes"
        );


    if (reduzirAnimacoes) {

        reduzirAnimacoes.addEventListener(
            "change",
            () => {

                alterarConfiguracaoAcessibilidade(
                    "reduzirAnimacoes",
                    reduzirAnimacoes.checked
                );

            }
        );

    }


    /* =====================================================
       ESPAÇAMENTO
    ===================================================== */

    const espacamentoTexto =
        document.getElementById(
            "espacamentoTexto"
        );


    if (espacamentoTexto) {

        espacamentoTexto.addEventListener(
            "change",
            () => {

                alterarConfiguracaoAcessibilidade(
                    "espacamentoTexto",
                    espacamentoTexto.value
                );

            }
        );

    }


    /* =====================================================
       FONTE AMIGÁVEL
    ===================================================== */

    const fonteAmigavel =
        document.getElementById(
            "fonteAmigavel"
        );


    if (fonteAmigavel) {

        fonteAmigavel.addEventListener(
            "change",
            () => {

                alterarConfiguracaoAcessibilidade(
                    "fonteAmigavel",
                    fonteAmigavel.checked
                );

            }
        );

    }


    /* =====================================================
       BOTÕES MAIORES
    ===================================================== */

    const botoesMaiores =
        document.getElementById(
            "botoesMaiores"
        );


    if (botoesMaiores) {

        botoesMaiores.addEventListener(
            "change",
            () => {

                alterarConfiguracaoAcessibilidade(
                    "botoesMaiores",
                    botoesMaiores.checked
                );

            }
        );

    }


    /* =====================================================
       DESTAQUE DE FOCO
    ===================================================== */

    const destaqueFoco =
        document.getElementById(
            "destaqueFoco"
        );


    if (destaqueFoco) {

        destaqueFoco.addEventListener(
            "change",
            () => {

                alterarConfiguracaoAcessibilidade(
                    "destaqueFoco",
                    destaqueFoco.checked
                );

            }
        );

    }


    /* =====================================================
       FEEDBACK SONORO
    ===================================================== */

    const feedbackSonoro =
        document.getElementById(
            "feedbackSonoro"
        );


    if (feedbackSonoro) {

        feedbackSonoro.addEventListener(
            "change",
            () => {

                alterarConfiguracaoAcessibilidade(
                    "feedbackSonoro",
                    feedbackSonoro.checked
                );

            }
        );

    }


    /* =====================================================
       INDICADOR DO MICROFONE
    ===================================================== */

    const indicadorMicrofone =
        document.getElementById(
            "indicadorMicrofone"
        );


    if (indicadorMicrofone) {

        indicadorMicrofone.addEventListener(
            "change",
            () => {

                alterarConfiguracaoAcessibilidade(
                    "indicadorMicrofone",
                    indicadorMicrofone.checked
                );

            }
        );

    }


    /* =====================================================
       RESTAURAR
    ===================================================== */

    const btnRestaurar =
        document.getElementById(
            "btnRestaurar"
        );


    if (btnRestaurar) {

        btnRestaurar.addEventListener(
            "click",
            restaurarConfiguracoesAcessibilidade
        );

    }


    /* =====================================================
       VOLTAR
    ===================================================== */

    const btnVoltar =
        document.getElementById(
            "btnVoltar"
        );


    if (btnVoltar) {

        btnVoltar.addEventListener(
            "click",
            () => {

                if (
                    window.history.length > 1
                ) {

                    window.history.back();

                }

                else {

                    window.location.href =
                        "./index.html";

                }

            }
        );

    }

}


/* =========================================================
   TEMA — ALTERAÇÕES DO SISTEMA
========================================================= */

const mediaQueryTema =
    window.matchMedia(
        "(prefers-color-scheme: dark)"
    );


function atualizarTemaAutomaticamente() {

    if (
        temaAtual !== "system"
    ) {

        return;

    }


    aplicarTemaGlobal("system");

}


if (
    mediaQueryTema.addEventListener
) {

    mediaQueryTema.addEventListener(
        "change",
        atualizarTemaAutomaticamente
    );

}

else if (
    mediaQueryTema.addListener
) {

    mediaQueryTema.addListener(
        atualizarTemaAutomaticamente
    );

}


/* =========================================================
   API GLOBAL DO FONEMAVIVA
========================================================= */

window.FonemaVivaAcessibilidade = {

    obterConfiguracoes() {

        return {
            ...configuracoesAcessibilidade
        };

    },


    estaAtivo(nome) {

        return Boolean(
            configuracoesAcessibilidade[nome]
        );

    },


    feedbackSonoroAtivo() {

        return (
            configuracoesAcessibilidade
                .feedbackSonoro === true
        );

    },


    indicadorMicrofoneAtivo() {

        return (
            configuracoesAcessibilidade
                .indicadorMicrofone === true
        );

    },


    tamanhoTextoAtual() {

        return (
            configuracoesAcessibilidade
                .tamanhoTexto
        );

    },


    alterar(nome, valor) {

        alterarConfiguracaoAcessibilidade(
            nome,
            valor
        );

    },


    reaplicar() {

        configuracoesAcessibilidade =
            carregarConfiguracoesAcessibilidade();

        aplicarTodasConfiguracoesAcessibilidade();

        atualizarInterfaceAcessibilidade();

    }

};


/* =========================================================
   INICIALIZAÇÃO GLOBAL
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        /*
         * PRIMEIRO:
         * aplica as configurações locais.
         *
         * Isso faz com que as configurações
         * funcionem em qualquer página.
         */

        configuracoesAcessibilidade =
            carregarConfiguracoesAcessibilidade();


        aplicarTodasConfiguracoesAcessibilidade();


        /*
         * SEGUNDO:
         * atualiza os controles caso
         * estejamos na página de acessibilidade.
         */

        atualizarInterfaceAcessibilidade();


        configurarControlesAcessibilidade();


        /*
         * TERCEIRO:
         * carrega o tema do usuário.
         */

        await carregarTemaGlobal();

    }
);
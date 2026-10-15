/* =========================================================
   FONEMAVIVA
   SISTEMA GLOBAL DE ACESSIBILIDADE
========================================================= */


/* =========================================================
   SUPABASE
========================================================= */

const SUPABASE_ACESSIBILIDADE_URL =
    "https://mnfryxvtogpiwacpyhgo.supabase.co";

const SUPABASE_ACESSIBILIDADE_KEY =
    "sb_publishable_YYMfDfWKaer8F1IEOFVOMQ_acS2xa2G";

const supabaseAcessibilidade =
    window.supabase?.createClient
        ? window.supabase.createClient(
            SUPABASE_ACESSIBILIDADE_URL,
            SUPABASE_ACESSIBILIDADE_KEY
        )
        : null;


/* =========================================================
   CACHE LOCAL
========================================================= */

const CHAVE_CACHE_ACESSIBILIDADE =
    "fonemaviva-acessibilidade";


/* =========================================================
   PREFERÊNCIAS PADRÃO
========================================================= */

const ACESSIBILIDADE_PADRAO = {

    tema: "sistema",

    tamanho_texto: "normal",

    alto_contraste: false,

    escala_cinza: false,

    reduzir_animacoes: false,

    espacamento_texto: "normal",

    fonte_amigavel: false,

    botoes_maiores: false,

    destaque_foco: true,

    feedback_sonoro: true,

    indicador_microfone: true
};


/* =========================================================
   ESTADO
========================================================= */

let preferenciasAcessibilidade = {
    ...ACESSIBILIDADE_PADRAO
};


/* =========================================================
   TEMA DO SISTEMA
========================================================= */

const mediaTemaEscuro =
    window.matchMedia
        ? window.matchMedia(
            "(prefers-color-scheme: dark)"
        )
        : null;


/* =========================================================
   USUÁRIO
========================================================= */

function obterUsuarioId() {

    return (
        localStorage.getItem("usuarioId") ||
        sessionStorage.getItem("usuarioId") ||
        null
    );
}


function usuarioIdValido(usuarioId) {

    if (!usuarioId) {
        return false;
    }

    return /^\d+$/.test(
        String(usuarioId)
    );
}


/* =========================================================
   SESSÃO SUPABASE
   IMPORTANTE:
   getSession() não gera AuthSessionMissingError
========================================================= */

async function obterUsuarioAutenticado() {

    if (!supabaseAcessibilidade) {
        return null;
    }

    try {

        const {
            data,
            error
        } =
            await supabaseAcessibilidade.auth.getSession();


        if (error) {

            console.warn(
                "FonemaViva: não foi possível obter a sessão do Supabase.",
                error
            );

            return null;
        }


        return data?.session?.user || null;

    } catch (erro) {

        console.warn(
            "FonemaViva: sessão do Supabase indisponível.",
            erro
        );

        return null;
    }
}


/* =========================================================
   NORMALIZAR TEMA
========================================================= */

function normalizarTema(tema) {

    if (
        tema === "claro" ||
        tema === "light"
    ) {
        return "claro";
    }


    if (
        tema === "escuro" ||
        tema === "dark"
    ) {
        return "escuro";
    }


    return "sistema";
}


/* =========================================================
   NORMALIZAR PREFERÊNCIAS
========================================================= */

function normalizarPreferencias(dados) {

    const preferencias =
        dados || {};


    return {

        tema:
            normalizarTema(
                preferencias.tema
            ),


        tamanho_texto:
            preferencias.tamanho_texto === "pequeno"
                ? "pequeno"
                : preferencias.tamanho_texto === "grande"
                    ? "grande"
                    : "normal",


        alto_contraste:
            preferencias.alto_contraste === true,


        escala_cinza:
            preferencias.escala_cinza === true,


        reduzir_animacoes:
            preferencias.reduzir_animacoes === true,


        espacamento_texto:
            preferencias.espacamento_texto === "medio"
                ? "medio"
                : preferencias.espacamento_texto === "grande"
                    ? "grande"
                    : "normal",


        fonte_amigavel:
            preferencias.fonte_amigavel === true,


        botoes_maiores:
            preferencias.botoes_maiores === true,


        destaque_foco:
            preferencias.destaque_foco === true,


        feedback_sonoro:
            preferencias.feedback_sonoro === true,


        indicador_microfone:
            preferencias.indicador_microfone === true
    };
}


/* =========================================================
   CACHE LOCAL — SALVAR
========================================================= */

function salvarCacheLocal() {

    try {

        localStorage.setItem(
            CHAVE_CACHE_ACESSIBILIDADE,
            JSON.stringify(
                preferenciasAcessibilidade
            )
        );

        return true;

    } catch (erro) {

        console.error(
            "FonemaViva: erro ao salvar acessibilidade localmente:",
            erro
        );

        return false;
    }
}


/* =========================================================
   CACHE LOCAL — CARREGAR
========================================================= */

function carregarCacheLocal() {

    try {

        const cache =
            localStorage.getItem(
                CHAVE_CACHE_ACESSIBILIDADE
            );


        if (!cache) {
            return false;
        }


        const dados =
            JSON.parse(cache);


        preferenciasAcessibilidade =
            normalizarPreferencias(
                dados
            );


        return true;

    } catch (erro) {

        console.error(
            "FonemaViva: erro ao carregar acessibilidade localmente:",
            erro
        );

        return false;
    }
}


/* =========================================================
   CACHE LOCAL — LIMPAR
========================================================= */

function limparCacheLocal() {

    try {

        localStorage.removeItem(
            CHAVE_CACHE_ACESSIBILIDADE
        );

    } catch (erro) {

        console.error(
            "FonemaViva: erro ao limpar cache de acessibilidade:",
            erro
        );
    }
}


/* =========================================================
   TAMANHO DO TEXTO
========================================================= */

function aplicarTamanhoTexto(tamanho) {

    if (!document.body) {
        return;
    }


    document.body.classList.remove(
        "text-small",
        "text-normal",
        "text-large"
    );


    if (tamanho === "pequeno") {

        document.body.classList.add(
            "text-small"
        );

    } else if (tamanho === "grande") {

        document.body.classList.add(
            "text-large"
        );

    } else {

        document.body.classList.add(
            "text-normal"
        );
    }
}


/* =========================================================
   ESPAÇAMENTO DO TEXTO
========================================================= */

function aplicarEspacamentoTexto(
    espacamento
) {

    if (!document.body) {
        return;
    }


    document.body.classList.remove(
        "spacing-normal",
        "spacing-medium",
        "spacing-large"
    );


    if (espacamento === "medio") {

        document.body.classList.add(
            "spacing-medium"
        );

    } else if (espacamento === "grande") {

        document.body.classList.add(
            "spacing-large"
        );

    } else {

        document.body.classList.add(
            "spacing-normal"
        );
    }
}


/* =========================================================
   VERIFICAR TEMA ESCURO
========================================================= */

function temaEscuroDeveSerAplicado() {

    const tema =
        normalizarTema(
            preferenciasAcessibilidade.tema
        );


    if (tema === "escuro") {
        return true;
    }


    if (tema === "claro") {
        return false;
    }


    return mediaTemaEscuro
        ? mediaTemaEscuro.matches
        : false;
}


/* =========================================================
   APLICAR TEMA
========================================================= */

function aplicarModoTema() {

    if (!document.body) {
        return;
    }


    const modoEscuro =
        temaEscuroDeveSerAplicado();


    document.body.classList.toggle(
        "dark-mode",
        modoEscuro
    );


    document.body.classList.toggle(
        "light-mode",
        !modoEscuro
    );


    document.body.setAttribute(
        "data-theme",
        modoEscuro
            ? "dark"
            : "light"
    );


    document.documentElement.setAttribute(
        "data-theme",
        modoEscuro
            ? "dark"
            : "light"
    );


    document
        .querySelectorAll(
            ".theme-btn[data-theme]"
        )
        .forEach(
            function (botao) {

                const temaBotao =
                    normalizarTema(
                        botao.dataset.theme
                    );


                botao.classList.toggle(
                    "active-theme",
                    temaBotao ===
                    preferenciasAcessibilidade.tema
                );
            }
        );
}


/* =========================================================
   APLICAR ACESSIBILIDADE
========================================================= */

function aplicarAcessibilidade() {

    if (!document.body) {
        return;
    }


    /* Tamanho */

    aplicarTamanhoTexto(
        preferenciasAcessibilidade.tamanho_texto
    );


    /* Alto contraste */

    document.body.classList.toggle(
        "high-contrast",
        preferenciasAcessibilidade.alto_contraste
    );


    /* Escala de cinza */

    document.body.classList.toggle(
        "grayscale",
        preferenciasAcessibilidade.escala_cinza
    );


    /* Reduzir animações */

    document.body.classList.toggle(
        "reduced-motion",
        preferenciasAcessibilidade.reduzir_animacoes
    );


    /* Espaçamento */

    aplicarEspacamentoTexto(
        preferenciasAcessibilidade.espacamento_texto
    );


    /* Fonte amigável */

    document.body.classList.toggle(
        "friendly-font",
        preferenciasAcessibilidade.fonte_amigavel
    );


    /* Botões maiores */

    document.body.classList.toggle(
        "large-buttons",
        preferenciasAcessibilidade.botoes_maiores
    );


    /* Destaque de foco */

    document.body.classList.toggle(
        "focus-highlight",
        preferenciasAcessibilidade.destaque_foco
    );


    /* Feedback sonoro */

    document.body.classList.toggle(
        "sound-feedback-enabled",
        preferenciasAcessibilidade.feedback_sonoro
    );


    /* Indicador de microfone */

    document.body.classList.toggle(
        "microphone-indicator-enabled",
        preferenciasAcessibilidade.indicador_microfone
    );


    /* Tema */

    aplicarModoTema();


    /* Evento global */

    window.dispatchEvent(
        new CustomEvent(
            "fonemaVivaAcessibilidadeAplicada",
            {
                detail: {
                    ...preferenciasAcessibilidade
                }
            }
        )
    );
}


/* =========================================================
   ATUALIZAR INTERFACE
========================================================= */

function atualizarInterfaceAcessibilidade() {


    /* -----------------------------------------------------
       TAMANHO
    ----------------------------------------------------- */

    const textoTamanho =
        document.getElementById(
            "textoTamanho"
        );


    if (textoTamanho) {

        const nomes = {

            pequeno: "Pequeno",

            normal: "Normal",

            grande: "Grande"
        };


        textoTamanho.textContent =
            nomes[
                preferenciasAcessibilidade.tamanho_texto
            ];
    }


    /* -----------------------------------------------------
       BOTÃO TEXTO MENOR
    ----------------------------------------------------- */

    const btnTextoMenor =
        document.getElementById(
            "btnTextoMenor"
        );


    if (btnTextoMenor) {

        btnTextoMenor.disabled =
            preferenciasAcessibilidade.tamanho_texto ===
            "pequeno";
    }


    /* -----------------------------------------------------
       BOTÃO TEXTO MAIOR
    ----------------------------------------------------- */

    const btnTextoMaior =
        document.getElementById(
            "btnTextoMaior"
        );


    if (btnTextoMaior) {

        btnTextoMaior.disabled =
            preferenciasAcessibilidade.tamanho_texto ===
            "grande";
    }


    /* -----------------------------------------------------
       CHECKBOXES
    ----------------------------------------------------- */

    const controles = {

        altoContraste:
            "alto_contraste",

        escalaCinza:
            "escala_cinza",

        reduzirAnimacoes:
            "reduzir_animacoes",

        fonteAmigavel:
            "fonte_amigavel",

        botoesMaiores:
            "botoes_maiores",

        destaqueFoco:
            "destaque_foco",

        feedbackSonoro:
            "feedback_sonoro",

        indicadorMicrofone:
            "indicador_microfone"
    };


    Object.entries(
        controles
    ).forEach(
        function ([id, propriedade]) {

            const elemento =
                document.getElementById(
                    id
                );


            if (!elemento) {
                return;
            }


            elemento.checked =
                Boolean(
                    preferenciasAcessibilidade[
                        propriedade
                    ]
                );
        }
    );


    /* -----------------------------------------------------
       ESPAÇAMENTO
    ----------------------------------------------------- */

    const espacamentoTexto =
        document.getElementById(
            "espacamentoTexto"
        );


    if (espacamentoTexto) {

        espacamentoTexto.value =
            preferenciasAcessibilidade
                .espacamento_texto;
    }


    /* -----------------------------------------------------
       TEMA
    ----------------------------------------------------- */

    const tema =
        document.getElementById(
            "tema"
        );


    if (tema) {

        tema.value =
            preferenciasAcessibilidade.tema;
    }


    /* -----------------------------------------------------
       MODO ESCURO — COMPATIBILIDADE
    ----------------------------------------------------- */

    const modoEscuro =
        document.getElementById(
            "modoEscuro"
        );


    if (modoEscuro) {

        modoEscuro.checked =
            preferenciasAcessibilidade.tema ===
            "escuro";
    }


    /* -----------------------------------------------------
       BOTÕES DE TEMA
    ----------------------------------------------------- */

    document
        .querySelectorAll(
            ".theme-btn[data-theme]"
        )
        .forEach(
            function (botao) {

                const temaBotao =
                    normalizarTema(
                        botao.dataset.theme
                    );


                botao.classList.toggle(
                    "active-theme",
                    temaBotao ===
                    preferenciasAcessibilidade.tema
                );
            }
        );
}


/* =========================================================
   SALVAR ACESSIBILIDADE
========================================================= */

async function salvarAcessibilidade() {

    preferenciasAcessibilidade =
        normalizarPreferencias(
            preferenciasAcessibilidade
        );


    /*
       LOCAL PRIMEIRO
    */

    salvarCacheLocal();


    /*
       APLICA IMEDIATAMENTE
    */

    aplicarAcessibilidade();

    atualizarInterfaceAcessibilidade();


    /*
       SEM SUPABASE
    */

    if (!supabaseAcessibilidade) {
        return false;
    }


    /*
       SESSÃO
    */

    const usuario =
        await obterUsuarioAutenticado();


    /*
       Sem sessão não é erro.
    */

    if (!usuario) {
        return false;
    }


    const usuarioId =
        obterUsuarioId();


    if (!usuarioIdValido(usuarioId)) {
        return false;
    }


    try {

        const dados = {

            usuario_id:
                Number(usuarioId),

            tamanho_texto:
                preferenciasAcessibilidade.tamanho_texto,

            alto_contraste:
                preferenciasAcessibilidade.alto_contraste,

            escala_cinza:
                preferenciasAcessibilidade.escala_cinza,

            reduzir_animacoes:
                preferenciasAcessibilidade.reduzir_animacoes,

            espacamento_texto:
                preferenciasAcessibilidade.espacamento_texto,

            fonte_amigavel:
                preferenciasAcessibilidade.fonte_amigavel,

            botoes_maiores:
                preferenciasAcessibilidade.botoes_maiores,

            destaque_foco:
                preferenciasAcessibilidade.destaque_foco,

            feedback_sonoro:
                preferenciasAcessibilidade.feedback_sonoro,

            indicador_microfone:
                preferenciasAcessibilidade.indicador_microfone
        };


        const {
            error
        } =
            await supabaseAcessibilidade
                .from(
                    "acessibilidade_usuario"
                )
                .upsert(
                    dados,
                    {
                        onConflict:
                            "usuario_id"
                    }
                );


        if (error) {

            console.error(
                "FonemaViva: erro ao salvar acessibilidade no Supabase:",
                error
            );

            return false;
        }


        window.dispatchEvent(
            new CustomEvent(
                "fonemaVivaAcessibilidadeAlterada",
                {
                    detail: {
                        ...preferenciasAcessibilidade
                    }
                }
            )
        );


        return true;

    } catch (erro) {

        console.error(
            "FonemaViva: erro inesperado ao salvar acessibilidade:",
            erro
        );

        return false;
    }
}


/* =========================================================
   CARREGAR ACESSIBILIDADE
========================================================= */

async function carregarAcessibilidade() {

    /*
       PRIMEIRO:
       LOCALSTORAGE
    */

    const possuiCache =
        carregarCacheLocal();


    if (possuiCache) {

        aplicarAcessibilidade();

        atualizarInterfaceAcessibilidade();
    }


    /*
       SEM CACHE:
       PADRÕES
    */

    if (!possuiCache) {

        preferenciasAcessibilidade = {
            ...ACESSIBILIDADE_PADRAO
        };


        salvarCacheLocal();

        aplicarAcessibilidade();

        atualizarInterfaceAcessibilidade();
    }


    /*
       SUPABASE INDISPONÍVEL
    */

    if (!supabaseAcessibilidade) {

        console.warn(
            "FonemaViva: Supabase indisponível. Usando acessibilidade local."
        );

        return;
    }


    /*
       SESSÃO
    */

    const usuario =
        await obterUsuarioAutenticado();


    /*
       SEM SESSÃO:
       CONTINUA NORMALMENTE COM LOCALSTORAGE
    */

    if (!usuario) {

        atualizarInterfaceAcessibilidade();

        return;
    }


    /*
       ID PÚBLICO
    */

    const usuarioId =
        obterUsuarioId();


    if (!usuarioIdValido(usuarioId)) {

        atualizarInterfaceAcessibilidade();

        return;
    }


    try {

        const {
            data,
            error
        } =
            await supabaseAcessibilidade
                .from(
                    "acessibilidade_usuario"
                )
                .select(
                    `
                    usuario_id,
                    tamanho_texto,
                    alto_contraste,
                    escala_cinza,
                    reduzir_animacoes,
                    espacamento_texto,
                    fonte_amigavel,
                    botoes_maiores,
                    destaque_foco,
                    feedback_sonoro,
                    indicador_microfone
                    `
                )
                .eq(
                    "usuario_id",
                    Number(usuarioId)
                )
                .maybeSingle();


        if (error) {

            console.error(
                "FonemaViva: erro ao carregar acessibilidade do Supabase:",
                error
            );

            aplicarAcessibilidade();

            atualizarInterfaceAcessibilidade();

            return;
        }


        if (data) {

            const temaAtual =
                preferenciasAcessibilidade.tema;


            preferenciasAcessibilidade =
                normalizarPreferencias({
                    ...data,
                    tema: temaAtual
                });


            salvarCacheLocal();

            aplicarAcessibilidade();

            atualizarInterfaceAcessibilidade();

            return;
        }


        await criarConfiguracaoInicial(
            Number(usuarioId)
        );


        salvarCacheLocal();

        aplicarAcessibilidade();

        atualizarInterfaceAcessibilidade();

    } catch (erro) {

        console.error(
            "FonemaViva: erro inesperado ao carregar acessibilidade:",
            erro
        );


        /*
           Nunca perde o funcionamento local
           por causa do Supabase.
        */

        aplicarAcessibilidade();

        atualizarInterfaceAcessibilidade();
    }
}


/* =========================================================
   CRIAR CONFIGURAÇÃO INICIAL
========================================================= */

async function criarConfiguracaoInicial(
    usuarioId
) {

    if (!supabaseAcessibilidade) {
        return false;
    }


    try {

        const dados = {

            usuario_id:
                Number(usuarioId),

            tamanho_texto:
                preferenciasAcessibilidade.tamanho_texto,

            alto_contraste:
                preferenciasAcessibilidade.alto_contraste,

            escala_cinza:
                preferenciasAcessibilidade.escala_cinza,

            reduzir_animacoes:
                preferenciasAcessibilidade.reduzir_animacoes,

            espacamento_texto:
                preferenciasAcessibilidade.espacamento_texto,

            fonte_amigavel:
                preferenciasAcessibilidade.fonte_amigavel,

            botoes_maiores:
                preferenciasAcessibilidade.botoes_maiores,

            destaque_foco:
                preferenciasAcessibilidade.destaque_foco,

            feedback_sonoro:
                preferenciasAcessibilidade.feedback_sonoro,

            indicador_microfone:
                preferenciasAcessibilidade.indicador_microfone
        };


        const {
            error
        } =
            await supabaseAcessibilidade
                .from(
                    "acessibilidade_usuario"
                )
                .insert(
                    dados
                );


        if (error) {

            console.error(
                "FonemaViva: erro ao criar configuração inicial:",
                error
            );

            return false;
        }


        return true;

    } catch (erro) {

        console.error(
            "FonemaViva: erro ao criar configuração inicial:",
            erro
        );

        return false;
    }
}


/* =========================================================
   ALTERAR PREFERÊNCIA
========================================================= */

async function alterarPreferencia(
    propriedade,
    valor
) {

    if (
        !Object.prototype.hasOwnProperty.call(
            preferenciasAcessibilidade,
            propriedade
        )
    ) {

        console.warn(
            "FonemaViva: preferência desconhecida:",
            propriedade
        );

        return false;
    }


    preferenciasAcessibilidade[
        propriedade
    ] = valor;


    return await salvarAcessibilidade();
}


/* =========================================================
   AUMENTAR TEXTO
========================================================= */

async function aumentarTexto() {

    const tamanhos = [
        "pequeno",
        "normal",
        "grande"
    ];


    const atual =
        tamanhos.indexOf(
            preferenciasAcessibilidade.tamanho_texto
        );


    if (
        atual < 0 ||
        atual >= tamanhos.length - 1
    ) {

        return false;
    }


    preferenciasAcessibilidade.tamanho_texto =
        tamanhos[
            atual + 1
        ];


    return await salvarAcessibilidade();
}


/* =========================================================
   DIMINUIR TEXTO
========================================================= */

async function diminuirTexto() {

    const tamanhos = [
        "pequeno",
        "normal",
        "grande"
    ];


    const atual =
        tamanhos.indexOf(
            preferenciasAcessibilidade.tamanho_texto
        );


    if (atual <= 0) {
        return false;
    }


    preferenciasAcessibilidade.tamanho_texto =
        tamanhos[
            atual - 1
        ];


    return await salvarAcessibilidade();
}


/* =========================================================
   ALTERAR TEMA
========================================================= */

async function alterarTema(
    tema
) {

    preferenciasAcessibilidade.tema =
        normalizarTema(
            tema
        );


    /*
       Aplica imediatamente.
    */

    salvarCacheLocal();

    aplicarAcessibilidade();

    atualizarInterfaceAcessibilidade();


    /*
       Evento.
    */

    window.dispatchEvent(
        new CustomEvent(
            "fonemaVivaAcessibilidadeAlterada",
            {
                detail: {
                    ...preferenciasAcessibilidade
                }
            }
        )
    );


    /*
       Sincronização com Supabase.
    */

    if (!supabaseAcessibilidade) {
        return true;
    }


    const usuario =
        await obterUsuarioAutenticado();


    if (!usuario) {
        return true;
    }


    const usuarioId =
        obterUsuarioId();


    if (!usuarioIdValido(usuarioId)) {
        return true;
    }


    try {

        const dados = {

            usuario_id:
                Number(usuarioId),

            tamanho_texto:
                preferenciasAcessibilidade.tamanho_texto,

            alto_contraste:
                preferenciasAcessibilidade.alto_contraste,

            escala_cinza:
                preferenciasAcessibilidade.escala_cinza,

            reduzir_animacoes:
                preferenciasAcessibilidade.reduzir_animacoes,

            espacamento_texto:
                preferenciasAcessibilidade.espacamento_texto,

            fonte_amigavel:
                preferenciasAcessibilidade.fonte_amigavel,

            botoes_maiores:
                preferenciasAcessibilidade.botoes_maiores,

            destaque_foco:
                preferenciasAcessibilidade.destaque_foco,

            feedback_sonoro:
                preferenciasAcessibilidade.feedback_sonoro,

            indicador_microfone:
                preferenciasAcessibilidade.indicador_microfone
        };


        const {
            error
        } =
            await supabaseAcessibilidade
                .from(
                    "acessibilidade_usuario"
                )
                .upsert(
                    dados,
                    {
                        onConflict:
                            "usuario_id"
                    }
                );


        if (error) {

            console.error(
                "FonemaViva: erro ao sincronizar tema:",
                error
            );

            return false;
        }


        return true;

    } catch (erro) {

        console.error(
            "FonemaViva: erro ao sincronizar tema:",
            erro
        );

        return false;
    }
}


/* =========================================================
   RESTAURAR ACESSIBILIDADE
========================================================= */

async function restaurarAcessibilidade() {

    preferenciasAcessibilidade = {
        ...ACESSIBILIDADE_PADRAO
    };


    /*
       Primeiro local.
    */

    salvarCacheLocal();

    aplicarAcessibilidade();

    atualizarInterfaceAcessibilidade();


    /*
       Depois Supabase.
    */

    if (!supabaseAcessibilidade) {
        return false;
    }


    const usuario =
        await obterUsuarioAutenticado();


    if (!usuario) {
        return false;
    }


    const usuarioId =
        obterUsuarioId();


    if (!usuarioIdValido(usuarioId)) {
        return false;
    }


    try {

        const dados = {

            usuario_id:
                Number(usuarioId),

            tamanho_texto:
                ACESSIBILIDADE_PADRAO.tamanho_texto,

            alto_contraste:
                ACESSIBILIDADE_PADRAO.alto_contraste,

            escala_cinza:
                ACESSIBILIDADE_PADRAO.escala_cinza,

            reduzir_animacoes:
                ACESSIBILIDADE_PADRAO.reduzir_animacoes,

            espacamento_texto:
                ACESSIBILIDADE_PADRAO.espacamento_texto,

            fonte_amigavel:
                ACESSIBILIDADE_PADRAO.fonte_amigavel,

            botoes_maiores:
                ACESSIBILIDADE_PADRAO.botoes_maiores,

            destaque_foco:
                ACESSIBILIDADE_PADRAO.destaque_foco,

            feedback_sonoro:
                ACESSIBILIDADE_PADRAO.feedback_sonoro,

            indicador_microfone:
                ACESSIBILIDADE_PADRAO.indicador_microfone
        };


        const {
            error
        } =
            await supabaseAcessibilidade
                .from(
                    "acessibilidade_usuario"
                )
                .upsert(
                    dados,
                    {
                        onConflict:
                            "usuario_id"
                    }
                );


        if (error) {

            console.error(
                "FonemaViva: erro ao restaurar acessibilidade:",
                error
            );

            return false;
        }


        return true;

    } catch (erro) {

        console.error(
            "FonemaViva: erro inesperado ao restaurar acessibilidade:",
            erro
        );

        return false;
    }
}


/* =========================================================
   FEEDBACK SONORO
========================================================= */

function feedbackSonoro(
    tipo = "click"
) {

    if (
        !preferenciasAcessibilidade.feedback_sonoro
    ) {
        return;
    }


    window.dispatchEvent(
        new CustomEvent(
            "fonemaVivaFeedbackSonoro",
            {
                detail: {
                    tipo
                }
            }
        )
    );
}


/* =========================================================
   CONFIGURAR CONTROLES
========================================================= */

function configurarControles() {


    /* =====================================================
       BOTÃO VOLTAR
    ===================================================== */

    const btnVoltar =
        document.getElementById(
            "btnVoltar"
        );


    if (btnVoltar) {

        btnVoltar.addEventListener(
            "click",
            function (evento) {

                evento.preventDefault();


                /*
                   Se existe uma página anterior,
                   retorna para ela.
                */

                if (
                    window.history.length > 1
                ) {

                    window.history.back();

                    return;
                }


                /*
                   Caso a página tenha sido aberta
                   diretamente, volta para a Home.
                */

                window.location.href =
                    "./home.html";
            }
        );
    }


    /* =====================================================
       DIMINUIR TEXTO
    ===================================================== */

    const btnTextoMenor =
        document.getElementById(
            "btnTextoMenor"
        );


    if (btnTextoMenor) {

        btnTextoMenor.addEventListener(
            "click",
            async function () {

                await diminuirTexto();

                feedbackSonoro(
                    "texto-menor"
                );
            }
        );
    }


    /* =====================================================
       AUMENTAR TEXTO
    ===================================================== */

    const btnTextoMaior =
        document.getElementById(
            "btnTextoMaior"
        );


    if (btnTextoMaior) {

        btnTextoMaior.addEventListener(
            "click",
            async function () {

                await aumentarTexto();

                feedbackSonoro(
                    "texto-maior"
                );
            }
        );
    }


    /* =====================================================
       CHECKBOXES
    ===================================================== */

    const controles = {

        altoContraste:
            "alto_contraste",

        escalaCinza:
            "escala_cinza",

        reduzirAnimacoes:
            "reduzir_animacoes",

        fonteAmigavel:
            "fonte_amigavel",

        botoesMaiores:
            "botoes_maiores",

        destaqueFoco:
            "destaque_foco",

        feedbackSonoro:
            "feedback_sonoro",

        indicadorMicrofone:
            "indicador_microfone"
    };


    Object.entries(
        controles
    ).forEach(
        function ([id, propriedade]) {

            const elemento =
                document.getElementById(
                    id
                );


            if (!elemento) {
                return;
            }


            elemento.addEventListener(
                "change",
                async function () {

                    preferenciasAcessibilidade[
                        propriedade
                    ] =
                        elemento.checked;


                    await salvarAcessibilidade();


                    if (
                        propriedade !==
                        "feedback_sonoro"
                    ) {

                        feedbackSonoro(
                            propriedade
                        );
                    }
                }
            );
        }
    );


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
            async function () {

                preferenciasAcessibilidade
                    .espacamento_texto =
                    espacamentoTexto.value;


                await salvarAcessibilidade();

                feedbackSonoro(
                    "espacamento"
                );
            }
        );
    }


    /* =====================================================
       TEMA
    ===================================================== */

    const tema =
        document.getElementById(
            "tema"
        );


    if (tema) {

        tema.addEventListener(
            "change",
            async function () {

                await alterarTema(
                    tema.value
                );

                feedbackSonoro(
                    "tema"
                );
            }
        );
    }


    /* =====================================================
       MODO ESCURO — COMPATIBILIDADE
    ===================================================== */

    const modoEscuro =
        document.getElementById(
            "modoEscuro"
        );


    if (modoEscuro) {

        modoEscuro.addEventListener(
            "change",
            async function () {

                await alterarTema(
                    modoEscuro.checked
                        ? "escuro"
                        : "claro"
                );

                feedbackSonoro(
                    "tema"
                );
            }
        );
    }


    /* =====================================================
       BOTÕES DE TEMA DA HOME
    ===================================================== */

    document
        .querySelectorAll(
            ".theme-btn[data-theme]"
        )
        .forEach(
            function (botao) {

                botao.addEventListener(
                    "click",
                    async function () {

                        const temaBotao =
                            botao.dataset.theme;


                        await alterarTema(
                            temaBotao
                        );


                        atualizarInterfaceAcessibilidade();
                    }
                );
            }
        );


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
            async function () {

                await restaurarAcessibilidade();

                feedbackSonoro(
                    "restaurar"
                );
            }
        );
    }
}


/* =========================================================
   TEMA DO SISTEMA
========================================================= */

function observarTemaSistema() {

    if (!mediaTemaEscuro) {
        return;
    }


    const atualizar =
        function () {

            if (
                preferenciasAcessibilidade.tema ===
                "sistema"
            ) {

                aplicarModoTema();

                atualizarInterfaceAcessibilidade();
            }
        };


    if (
        typeof mediaTemaEscuro.addEventListener ===
        "function"
    ) {

        mediaTemaEscuro.addEventListener(
            "change",
            atualizar
        );

    } else if (
        typeof mediaTemaEscuro.addListener ===
        "function"
    ) {

        mediaTemaEscuro.addListener(
            atualizar
        );
    }
}


/* =========================================================
   LOCALSTORAGE ENTRE ABAS
========================================================= */

function observarLocalStorage() {

    window.addEventListener(
        "storage",
        function (evento) {

            if (
                evento.key !==
                CHAVE_CACHE_ACESSIBILIDADE
            ) {
                return;
            }


            if (!evento.newValue) {

                preferenciasAcessibilidade = {
                    ...ACESSIBILIDADE_PADRAO
                };

                aplicarAcessibilidade();

                atualizarInterfaceAcessibilidade();

                return;
            }


            try {

                const dados =
                    JSON.parse(
                        evento.newValue
                    );


                preferenciasAcessibilidade =
                    normalizarPreferencias(
                        dados
                    );


                aplicarAcessibilidade();

                atualizarInterfaceAcessibilidade();

            } catch (erro) {

                console.error(
                    "FonemaViva: erro ao sincronizar acessibilidade:",
                    erro
                );
            }
        }
    );
}


/* =========================================================
   API GLOBAL
========================================================= */

window.FonemaVivaAcessibilidade = {

    obterPreferencias:
        function () {

            return {
                ...preferenciasAcessibilidade
            };
        },


    aplicar:
        aplicarAcessibilidade,


    carregar:
        carregarAcessibilidade,


    salvar:
        salvarAcessibilidade,


    alterar:
        alterarPreferencia,


    aumentarTexto:
        aumentarTexto,


    diminuirTexto:
        diminuirTexto,


    restaurar:
        restaurarAcessibilidade,


    alterarTema:
        alterarTema,


    obterTema:
        function () {

            return preferenciasAcessibilidade.tema;
        },


    feedbackSonoro:
        feedbackSonoro,


    feedbackSonoroAtivo:
        function () {

            return Boolean(
                preferenciasAcessibilidade.feedback_sonoro
            );
        },


    indicadorMicrofoneAtivo:
        function () {

            return Boolean(
                preferenciasAcessibilidade.indicador_microfone
            );
        },


    modoEscuroAtivo:
        function () {

            return temaEscuroDeveSerAplicado();
        }
};


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

async function iniciarAcessibilidade() {

    /*
       1. Carregar cache.
    */

    const possuiCache =
        carregarCacheLocal();


    /*
       2. Aplicar imediatamente.
    */

    if (possuiCache) {

        aplicarAcessibilidade();

        atualizarInterfaceAcessibilidade();
    }


    /*
       3. Caso não exista cache.
    */

    if (!possuiCache) {

        preferenciasAcessibilidade = {
            ...ACESSIBILIDADE_PADRAO
        };


        salvarCacheLocal();

        aplicarAcessibilidade();

        atualizarInterfaceAcessibilidade();
    }


    /*
       4. Configurar controles.
    */

    configurarControles();


    /*
       5. Observar tema do sistema.
    */

    observarTemaSistema();


    /*
       6. Observar localStorage.
    */

    observarLocalStorage();


    /*
       7. Sincronizar com Supabase.
    */

    await carregarAcessibilidade();
}


/* =========================================================
   EXECUÇÃO
========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        iniciarAcessibilidade,
        {
            once: true
        }
    );

} else {

    iniciarAcessibilidade();
}
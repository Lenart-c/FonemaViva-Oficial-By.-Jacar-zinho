/* =========================================================
   FONEMAVIVA
   SISTEMA GLOBAL DE ACESSIBILIDADE

   - Preferências salvas no Supabase
   - Sem Supabase Auth
   - Usuario identificado por usuarioId
   - Aplicação global em todas as páginas
   - Modo escuro automático pelo navegador/sistema
========================================================= */


/* =========================================================
   CONFIGURAÇÃO SUPABASE
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
   CONFIGURAÇÕES PADRÃO
========================================================= */

const ACESSIBILIDADE_PADRAO = {

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
   ESTADO ATUAL
========================================================= */

let preferenciasAcessibilidade = {
    ...ACESSIBILIDADE_PADRAO
};


/* =========================================================
   IDENTIFICAÇÃO DO USUÁRIO
========================================================= */

function obterUsuarioId() {

    const usuarioId =
        localStorage.getItem("usuarioId") ||
        sessionStorage.getItem("usuarioId");

    if (!usuarioId) {
        return null;
    }

    return usuarioId;
}


/* =========================================================
   VALIDAR ID
========================================================= */

function usuarioIdValido(usuarioId) {

    if (!usuarioId) {
        return false;
    }

    return /^\d+$/.test(String(usuarioId));
}


/* =========================================================
   NORMALIZAR PREFERÊNCIAS
========================================================= */

function normalizarPreferencias(dados) {

    return {

        tamanho_texto:
            dados?.tamanho_texto === "pequeno"
                ? "pequeno"
                : dados?.tamanho_texto === "grande"
                    ? "grande"
                    : "normal",

        alto_contraste:
            dados?.alto_contraste === true,

        escala_cinza:
            dados?.escala_cinza === true,

        reduzir_animacoes:
            dados?.reduzir_animacoes === true,

        espacamento_texto:
            dados?.espacamento_texto === "medio"
                ? "medio"
                : dados?.espacamento_texto === "grande"
                    ? "grande"
                    : "normal",

        fonte_amigavel:
            dados?.fonte_amigavel === true,

        botoes_maiores:
            dados?.botoes_maiores === true,

        destaque_foco:
            dados?.destaque_foco === true,

        feedback_sonoro:
            dados?.feedback_sonoro === true,

        indicador_microfone:
            dados?.indicador_microfone === true
    };
}


/* =========================================================
   APLICAR TAMANHO DO TEXTO
========================================================= */

function aplicarTamanhoTexto(tamanho) {

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
   APLICAR ESPAÇAMENTO
========================================================= */

function aplicarEspacamentoTexto(espacamento) {

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
   APLICAR TODAS AS PREFERÊNCIAS
========================================================= */

function aplicarAcessibilidade() {

    if (!document.body) {
        return;
    }


    /* -----------------------------------------------------
       TAMANHO DO TEXTO
    ----------------------------------------------------- */

    aplicarTamanhoTexto(
        preferenciasAcessibilidade.tamanho_texto
    );


    /* -----------------------------------------------------
       ALTO CONTRASTE
    ----------------------------------------------------- */

    document.body.classList.toggle(
        "high-contrast",
        preferenciasAcessibilidade.alto_contraste
    );


    /* -----------------------------------------------------
       ESCALA DE CINZA
    ----------------------------------------------------- */

    document.body.classList.toggle(
        "grayscale",
        preferenciasAcessibilidade.escala_cinza
    );


    /* -----------------------------------------------------
       REDUZIR ANIMAÇÕES
    ----------------------------------------------------- */

    document.body.classList.toggle(
        "reduced-motion",
        preferenciasAcessibilidade.reduzir_animacoes
    );


    /* -----------------------------------------------------
       ESPAÇAMENTO
    ----------------------------------------------------- */

    aplicarEspacamentoTexto(
        preferenciasAcessibilidade.espacamento_texto
    );


    /* -----------------------------------------------------
       FONTE AMIGÁVEL
    ----------------------------------------------------- */

    document.body.classList.toggle(
        "friendly-font",
        preferenciasAcessibilidade.fonte_amigavel
    );


    /* -----------------------------------------------------
       BOTÕES MAIORES
    ----------------------------------------------------- */

    document.body.classList.toggle(
        "large-buttons",
        preferenciasAcessibilidade.botoes_maiores
    );


    /* -----------------------------------------------------
       DESTAQUE DE FOCO
    ----------------------------------------------------- */

    document.body.classList.toggle(
        "focus-highlight",
        preferenciasAcessibilidade.destaque_foco
    );


    /* -----------------------------------------------------
       DISPONIBILIDADE DO FEEDBACK SONORO
    ----------------------------------------------------- */

    document.body.classList.toggle(
        "sound-feedback-enabled",
        preferenciasAcessibilidade.feedback_sonoro
    );


    /* -----------------------------------------------------
       INDICADOR DO MICROFONE
    ----------------------------------------------------- */

    document.body.classList.toggle(
        "microphone-indicator-enabled",
        preferenciasAcessibilidade.indicador_microfone
    );
}


/* =========================================================
   MODO ESCURO AUTOMÁTICO
   BASEADO NO TEMA DO SISTEMA/NAVEGADOR
========================================================= */

const mediaDarkMode =
    window.matchMedia
        ? window.matchMedia(
            "(prefers-color-scheme: dark)"
        )
        : null;


function aplicarModoEscuroAutomatico() {

    if (!document.body || !mediaDarkMode) {
        return;
    }

    document.body.classList.toggle(
        "dark-mode",
        mediaDarkMode.matches
    );
}


/* =========================================================
   OBSERVAR ALTERAÇÃO DO TEMA DO SISTEMA
========================================================= */

function observarModoEscuro() {

    if (!mediaDarkMode) {
        return;
    }

    const atualizar = () => {

        aplicarModoEscuroAutomatico();

    };

    if (typeof mediaDarkMode.addEventListener === "function") {

        mediaDarkMode.addEventListener(
            "change",
            atualizar
        );

    } else if (
        typeof mediaDarkMode.addListener === "function"
    ) {

        mediaDarkMode.addListener(
            atualizar
        );
    }
}


/* =========================================================
   CARREGAR PREFERÊNCIAS DO SUPABASE
========================================================= */

async function carregarAcessibilidade() {

    const usuarioId = obterUsuarioId();


    /* -----------------------------------------------------
       SEM USUÁRIO
    ----------------------------------------------------- */

    if (!usuarioIdValido(usuarioId)) {

        preferenciasAcessibilidade = {
            ...ACESSIBILIDADE_PADRAO
        };

        aplicarAcessibilidade();

        return;
    }


    /* -----------------------------------------------------
       SUPABASE INDISPONÍVEL
    ----------------------------------------------------- */

    if (!supabaseClient) {

        console.error(
            "FonemaViva: Supabase não foi inicializado."
        );

        aplicarAcessibilidade();

        return;
    }


    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("acessibilidade_usuario")
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
                "FonemaViva: erro ao carregar acessibilidade:",
                error
            );

            aplicarAcessibilidade();

            return;
        }


        /* -------------------------------------------------
           USUÁRIO JÁ POSSUI CONFIGURAÇÕES
        ------------------------------------------------- */

        if (data) {

            preferenciasAcessibilidade =
                normalizarPreferencias(data);

        }


        /* -------------------------------------------------
           USUÁRIO AINDA NÃO POSSUI REGISTRO
        ------------------------------------------------- */

        else {

            preferenciasAcessibilidade = {
                ...ACESSIBILIDADE_PADRAO
            };

            await criarConfiguracaoInicial(
                Number(usuarioId)
            );
        }


        /* -------------------------------------------------
           APLICAR NA PÁGINA
        ------------------------------------------------- */

        aplicarAcessibilidade();

        atualizarInterfaceAcessibilidade();

    } catch (erro) {

        console.error(
            "FonemaViva: erro inesperado ao carregar acessibilidade:",
            erro
        );

        preferenciasAcessibilidade = {
            ...ACESSIBILIDADE_PADRAO
        };

        aplicarAcessibilidade();
    }
}


/* =========================================================
   CRIAR CONFIGURAÇÃO INICIAL
========================================================= */

async function criarConfiguracaoInicial(usuarioId) {

    if (!supabaseClient) {
        return false;
    }

    try {

        const {
            error
        } = await supabaseClient
            .from("acessibilidade_usuario")
            .insert({

                usuario_id: usuarioId,

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
            });


        if (error) {

            console.error(
                "FonemaViva: erro ao criar configuração:",
                error
            );

            return false;
        }

        return true;

    } catch (erro) {

        console.error(
            "FonemaViva: erro inesperado ao criar configuração:",
            erro
        );

        return false;
    }
}


/* =========================================================
   SALVAR TODAS AS PREFERÊNCIAS
========================================================= */

async function salvarAcessibilidade() {

    const usuarioId = obterUsuarioId();


    if (!usuarioIdValido(usuarioId)) {

        console.warn(
            "FonemaViva: usuarioId não encontrado."
        );

        return false;
    }


    if (!supabaseClient) {

        console.error(
            "FonemaViva: Supabase não está disponível."
        );

        return false;
    }


    try {

        const {
            error
        } = await supabaseClient
            .from("acessibilidade_usuario")
            .upsert(
                {
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
                        preferenciasAcessibilidade.indicador_microfone,

                    atualizado_em:
                        new Date().toISOString()
                },
                {
                    onConflict:
                        "usuario_id"
                }
            );


        if (error) {

            console.error(
                "FonemaViva: erro ao salvar acessibilidade:",
                error
            );

            return false;
        }

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
   ALTERAR UMA PREFERÊNCIA
========================================================= */

async function alterarAcessibilidade(
    propriedade,
    valor
) {

    if (
        !Object.prototype.hasOwnProperty.call(
            ACESSIBILIDADE_PADRAO,
            propriedade
        )
    ) {

        console.warn(
            "FonemaViva: preferência inválida:",
            propriedade
        );

        return;
    }


    preferenciasAcessibilidade[
        propriedade
    ] = valor;


    /* Aplicar imediatamente */

    aplicarAcessibilidade();

    atualizarInterfaceAcessibilidade();


    /* Salvar no Supabase */

    await salvarAcessibilidade();
}


/* =========================================================
   TAMANHO DO TEXTO
========================================================= */

async function aumentarTexto() {

    const atual =
        preferenciasAcessibilidade.tamanho_texto;


    let novo;


    if (atual === "pequeno") {

        novo = "normal";

    } else if (atual === "normal") {

        novo = "grande";

    } else {

        novo = "grande";
    }


    await alterarAcessibilidade(
        "tamanho_texto",
        novo
    );
}


async function diminuirTexto() {

    const atual =
        preferenciasAcessibilidade.tamanho_texto;


    let novo;


    if (atual === "grande") {

        novo = "normal";

    } else if (atual === "normal") {

        novo = "pequeno";

    } else {

        novo = "pequeno";
    }


    await alterarAcessibilidade(
        "tamanho_texto",
        novo
    );
}


/* =========================================================
   ATUALIZAR INTERFACE DA PÁGINA
========================================================= */

function atualizarInterfaceAcessibilidade() {

    const preferencias =
        preferenciasAcessibilidade;


    /* -----------------------------------------------------
       TAMANHO DO TEXTO
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
                preferencias.tamanho_texto
            ] || "Normal";
    }


    /* -----------------------------------------------------
       BOTÃO MENOR
    ----------------------------------------------------- */

    const btnTextoMenor =
        document.getElementById(
            "btnTextoMenor"
        );

    if (btnTextoMenor) {

        btnTextoMenor.disabled =
            preferencias.tamanho_texto ===
            "pequeno";
    }


    /* -----------------------------------------------------
       BOTÃO MAIOR
    ----------------------------------------------------- */

    const btnTextoMaior =
        document.getElementById(
            "btnTextoMaior"
        );

    if (btnTextoMaior) {

        btnTextoMaior.disabled =
            preferencias.tamanho_texto ===
            "grande";
    }


    /* -----------------------------------------------------
       CHECKBOXES
    ----------------------------------------------------- */

    const controles = {

        altoContraste:
            preferencias.alto_contraste,

        escalaCinza:
            preferencias.escala_cinza,

        reduzirAnimacoes:
            preferencias.reduzir_animacoes,

        fonteAmigavel:
            preferencias.fonte_amigavel,

        botoesMaiores:
            preferencias.botoes_maiores,

        destaqueFoco:
            preferencias.destaque_foco,

        feedbackSonoro:
            preferencias.feedback_sonoro,

        indicadorMicrofone:
            preferencias.indicador_microfone
    };


    Object.entries(controles)
        .forEach(
            ([id, valor]) => {

                const elemento =
                    document.getElementById(id);

                if (elemento) {

                    elemento.checked =
                        Boolean(valor);
                }
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
            preferencias.espacamento_texto;
    }
}


/* =========================================================
   EVENTOS DOS CONTROLES
========================================================= */

function configurarControles() {


    /* -----------------------------------------------------
       DIMINUIR TEXTO
    ----------------------------------------------------- */

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


    /* -----------------------------------------------------
       AUMENTAR TEXTO
    ----------------------------------------------------- */

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


    /* -----------------------------------------------------
       ALTO CONTRASTE
    ----------------------------------------------------- */

    const altoContraste =
        document.getElementById(
            "altoContraste"
        );

    if (altoContraste) {

        altoContraste.addEventListener(
            "change",
            () => {

                alterarAcessibilidade(
                    "alto_contraste",
                    altoContraste.checked
                );
            }
        );
    }


    /* -----------------------------------------------------
       ESCALA DE CINZA
    ----------------------------------------------------- */

    const escalaCinza =
        document.getElementById(
            "escalaCinza"
        );

    if (escalaCinza) {

        escalaCinza.addEventListener(
            "change",
            () => {

                alterarAcessibilidade(
                    "escala_cinza",
                    escalaCinza.checked
                );
            }
        );
    }


    /* -----------------------------------------------------
       REDUZIR ANIMAÇÕES
    ----------------------------------------------------- */

    const reduzirAnimacoes =
        document.getElementById(
            "reduzirAnimacoes"
        );

    if (reduzirAnimacoes) {

        reduzirAnimacoes.addEventListener(
            "change",
            () => {

                alterarAcessibilidade(
                    "reduzir_animacoes",
                    reduzirAnimacoes.checked
                );
            }
        );
    }


    /* -----------------------------------------------------
       ESPAÇAMENTO
    ----------------------------------------------------- */

    const espacamentoTexto =
        document.getElementById(
            "espacamentoTexto"
        );

    if (espacamentoTexto) {

        espacamentoTexto.addEventListener(
            "change",
            () => {

                alterarAcessibilidade(
                    "espacamento_texto",
                    espacamentoTexto.value
                );
            }
        );
    }


    /* -----------------------------------------------------
       FONTE AMIGÁVEL
    ----------------------------------------------------- */

    const fonteAmigavel =
        document.getElementById(
            "fonteAmigavel"
        );

    if (fonteAmigavel) {

        fonteAmigavel.addEventListener(
            "change",
            () => {

                alterarAcessibilidade(
                    "fonte_amigavel",
                    fonteAmigavel.checked
                );
            }
        );
    }


    /* -----------------------------------------------------
       BOTÕES MAIORES
    ----------------------------------------------------- */

    const botoesMaiores =
        document.getElementById(
            "botoesMaiores"
        );

    if (botoesMaiores) {

        botoesMaiores.addEventListener(
            "change",
            () => {

                alterarAcessibilidade(
                    "botoes_maiores",
                    botoesMaiores.checked
                );
            }
        );
    }


    /* -----------------------------------------------------
       DESTAQUE DE FOCO
    ----------------------------------------------------- */

    const destaqueFoco =
        document.getElementById(
            "destaqueFoco"
        );

    if (destaqueFoco) {

        destaqueFoco.addEventListener(
            "change",
            () => {

                alterarAcessibilidade(
                    "destaque_foco",
                    destaqueFoco.checked
                );
            }
        );
    }


    /* -----------------------------------------------------
       FEEDBACK SONORO
    ----------------------------------------------------- */

    const feedbackSonoro =
        document.getElementById(
            "feedbackSonoro"
        );

    if (feedbackSonoro) {

        feedbackSonoro.addEventListener(
            "change",
            () => {

                alterarAcessibilidade(
                    "feedback_sonoro",
                    feedbackSonoro.checked
                );
            }
        );
    }


    /* -----------------------------------------------------
       INDICADOR DO MICROFONE
    ----------------------------------------------------- */

    const indicadorMicrofone =
        document.getElementById(
            "indicadorMicrofone"
        );

    if (indicadorMicrofone) {

        indicadorMicrofone.addEventListener(
            "change",
            () => {

                alterarAcessibilidade(
                    "indicador_microfone",
                    indicadorMicrofone.checked
                );
            }
        );
    }


    /* -----------------------------------------------------
       RESTAURAR
    ----------------------------------------------------- */

    const btnRestaurar =
        document.getElementById(
            "btnRestaurar"
        );

    if (btnRestaurar) {

        btnRestaurar.addEventListener(
            "click",
            restaurarAcessibilidade
        );
    }


    /* -----------------------------------------------------
       VOLTAR
    ----------------------------------------------------- */

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

                } else {

                    window.location.href =
                        "./home.html";
                }
            }
        );
    }
}


/* =========================================================
   RESTAURAR CONFIGURAÇÕES
========================================================= */

async function restaurarAcessibilidade() {

    const confirmar =
        window.confirm(
            "Deseja realmente restaurar todas as configurações de acessibilidade para o padrão?"
        );


    if (!confirmar) {
        return;
    }


    preferenciasAcessibilidade = {
        ...ACESSIBILIDADE_PADRAO
    };


    /* Aplicar imediatamente */

    aplicarAcessibilidade();

    atualizarInterfaceAcessibilidade();


    /* Salvar no Supabase */

    const sucesso =
        await salvarAcessibilidade();


    if (!sucesso) {

        console.error(
            "FonemaViva: não foi possível salvar a restauração."
        );

        return;
    }
}


/* =========================================================
   FEEDBACK SONORO
========================================================= */

function feedbackSonoro(tipo = "acao") {

    if (
        !preferenciasAcessibilidade.feedback_sonoro
    ) {
        return;
    }


    try {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;


        if (!AudioContext) {
            return;
        }


        const contexto =
            new AudioContext();


        const oscilador =
            contexto.createOscillator();


        const ganho =
            contexto.createGain();


        oscilador.connect(
            ganho
        );

        ganho.connect(
            contexto.destination
        );


        let frequencia = 500;


        if (tipo === "acerto") {

            frequencia = 700;

        } else if (tipo === "erro") {

            frequencia = 220;

        } else if (tipo === "acao") {

            frequencia = 500;
        }


        oscilador.frequency.value =
            frequencia;

        oscilador.type =
            "sine";


        ganho.gain.setValueAtTime(
            0.0001,
            contexto.currentTime
        );

        ganho.gain.exponentialRampToValueAtTime(
            0.08,
            contexto.currentTime + 0.01
        );

        ganho.gain.exponentialRampToValueAtTime(
            0.0001,
            contexto.currentTime + 0.12
        );


        oscilador.start();

        oscilador.stop(
            contexto.currentTime + 0.12
        );


        oscilador.addEventListener(
            "ended",
            () => {

                contexto.close();
            }
        );

    } catch (erro) {

        console.warn(
            "FonemaViva: não foi possível reproduzir feedback sonoro.",
            erro
        );
    }
}


/* =========================================================
   VERIFICAR SE FEEDBACK SONORO ESTÁ ATIVO
========================================================= */

function feedbackSonoroAtivo() {

    return Boolean(
        preferenciasAcessibilidade.feedback_sonoro
    );
}


/* =========================================================
   VERIFICAR SE INDICADOR DE MICROFONE ESTÁ ATIVO
========================================================= */

function indicadorMicrofoneAtivo() {

    return Boolean(
        preferenciasAcessibilidade.indicador_microfone
    );
}


/* =========================================================
   API GLOBAL DO FONEMAVIVA
   Outras páginas podem utilizar estas funções.
========================================================= */

window.FonemaVivaAcessibilidade = {

    obterPreferencias: function () {

        return {
            ...preferenciasAcessibilidade
        };
    },


    aplicar: function () {

        aplicarAcessibilidade();
    },


    salvar: async function () {

        return await salvarAcessibilidade();
    },


    feedbackSonoro: function (tipo) {

        feedbackSonoro(tipo);
    },


    feedbackSonoroAtivo: function () {

        return feedbackSonoroAtivo();
    },


    indicadorMicrofoneAtivo: function () {

        return indicadorMicrofoneAtivo();
    },


    alterar: async function (
        propriedade,
        valor
    ) {

        return await alterarAcessibilidade(
            propriedade,
            valor
        );
    }
};


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

async function iniciarAcessibilidade() {

    /*
       O modo escuro é aplicado imediatamente,
       sem esperar o Supabase.
    */

    aplicarModoEscuroAutomatico();

    observarModoEscuro();


    /*
       Configura os controles da página.
       Se estivermos em outra página, simplesmente
       não haverá controles e nada será feito.
    */

    configurarControles();


    /*
       Carrega as preferências persistidas
       no Supabase.
    */

    await carregarAcessibilidade();
}


/* =========================================================
   EXECUTAR
========================================================= */

if (
    document.readyState === "loading"
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
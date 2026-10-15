"use strict";

/* =========================================================
   FONEMAVIVA — CONFIGURAÇÕES
   Arquivo: js/configuracao.js
   ========================================================= */

/* =========================================================
   CONFIGURAÇÕES LOCAIS
   ========================================================= */

const CHAVE_CONFIGURACOES =
    "fonemaviva-configuracoes";

const CONFIGURACOES_PADRAO = {
    notificacoes: true,

    exercicios: {
        reproducaoAutomatica: true,
        feedbackExercicios: true
    },

    continuarExercicios: true
};

let configuracoesFonemaViva = {
    ...CONFIGURACOES_PADRAO,
    exercicios: {
        ...CONFIGURACOES_PADRAO.exercicios
    }
};


/* =========================================================
   ELEMENTOS
   ========================================================= */

const btnNotificacoes =
    document.getElementById(
        "btnNotificacoes"
    );

const btnExercicios =
    document.getElementById(
        "btnExercicios"
    );

const btnContinuarExercicios =
    document.getElementById(
        "btnContinuarExercicios"
    );

const btnDispositivos =
    document.getElementById(
        "btnDispositivos"
    );

const btnExcluirConta =
    document.getElementById(
        "btnExcluirConta"
    );

const btnSobre =
    document.getElementById(
        "btnSobre"
    );

const btnTermos =
    document.getElementById(
        "btnTermos"
    );

const btnPrivacidade =
    document.getElementById(
        "btnPrivacidade"
    );


/* =========================================================
   UTILITÁRIOS
   ========================================================= */

function escaparHTML(valor) {

    return String(valor ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function normalizarConfiguracoes(dados) {

    const origem =
        dados && typeof dados === "object"
            ? dados
            : {};

    const exercicios =
        origem.exercicios &&
        typeof origem.exercicios === "object"
            ? origem.exercicios
            : {};

    return {

        notificacoes:
            origem.notificacoes !== false,

        exercicios: {

            reproducaoAutomatica:
                exercicios.reproducaoAutomatica !== false,

            feedbackExercicios:
                exercicios.feedbackExercicios !== false
        },

        continuarExercicios:
            origem.continuarExercicios !== false
    };
}


/* =========================================================
   CACHE
   ========================================================= */

function salvarConfiguracoes() {

    try {

        localStorage.setItem(
            CHAVE_CONFIGURACOES,
            JSON.stringify(
                configuracoesFonemaViva
            )
        );

        return true;

    } catch (erro) {

        console.error(
            "FonemaViva: não foi possível salvar as configurações.",
            erro
        );

        return false;
    }
}


function carregarConfiguracoes() {

    try {

        const dados =
            localStorage.getItem(
                CHAVE_CONFIGURACOES
            );

        if (!dados) {

            configuracoesFonemaViva =
                normalizarConfiguracoes(
                    CONFIGURACOES_PADRAO
                );

            salvarConfiguracoes();

            return;
        }

        configuracoesFonemaViva =
            normalizarConfiguracoes(
                JSON.parse(dados)
            );

    } catch (erro) {

        console.error(
            "FonemaViva: erro ao carregar configurações.",
            erro
        );

        configuracoesFonemaViva =
            normalizarConfiguracoes(
                CONFIGURACOES_PADRAO
            );
    }
}


/* =========================================================
   ACESSIBILIDADE
   ========================================================= */

function usarAcessibilidade() {

    return Boolean(
        window.FonemaVivaAcessibilidade
    );
}


function emitirFeedback(tipo) {

    if (
        usarAcessibilidade() &&
        typeof
            window.FonemaVivaAcessibilidade
                .feedbackSonoro === "function"
    ) {

        window.FonemaVivaAcessibilidade
            .feedbackSonoro(tipo);
    }
}


/* =========================================================
   ESTILO DOS PAINÉIS
   ========================================================= */

function inserirEstilosPaineis() {

    if (
        document.getElementById(
            "estilosPaineisConfiguracoes"
        )
    ) {
        return;
    }

    const style =
        document.createElement("style");

    style.id =
        "estilosPaineisConfiguracoes";

    style.textContent = `

        .config-modal {

            position: fixed;

            inset: 0;

            z-index: 10000;

            display: flex;

            align-items: center;

            justify-content: center;

            padding: 20px;

            background:
                rgba(0, 0, 0, 0.48);

            opacity: 0;

            visibility: hidden;

            transition:
                opacity 0.2s ease,
                visibility 0.2s ease;
        }


        .config-modal.aberto {

            opacity: 1;

            visibility: visible;
        }


        .config-modal-conteudo {

            width: min(
                100%,
                560px
            );

            max-height: min(
                760px,
                calc(100vh - 40px)
            );

            overflow-y: auto;

            background:
                var(--cor-card, #ffffff);

            color:
                var(--cor-texto, #172121);

            border:
                1px solid
                var(--cor-borda, #e3eaea);

            border-radius:
                20px;

            box-shadow:
                0 25px 70px
                rgba(0, 0, 0, 0.20);

            transform:
                translateY(12px)
                scale(0.98);

            transition:
                transform 0.2s ease;
        }


        .config-modal.aberto
        .config-modal-conteudo {

            transform:
                translateY(0)
                scale(1);
        }


        .config-modal-cabecalho {

            display: flex;

            align-items: center;

            justify-content: space-between;

            gap: 15px;

            padding:
                22px 24px 16px;

            border-bottom:
                1px solid
                var(--cor-borda, #e3eaea);
        }


        .config-modal-titulo {

            display: flex;

            flex-direction: column;

            gap: 5px;
        }


        .config-modal-titulo h2 {

            margin: 0;

            font-size: 20px;

            line-height: 1.3;
        }


        .config-modal-titulo p {

            margin: 0;

            color:
                var(
                    --cor-texto-secundario,
                    #6b7a7a
                );

            font-size: 13px;

            line-height: 1.45;
        }


        .config-modal-fechar {

            width: 38px;

            height: 38px;

            flex-shrink: 0;

            display: flex;

            align-items: center;

            justify-content: center;

            border: 0;

            border-radius: 10px;

            background:
                rgba(0, 168, 158, 0.08);

            color:
                var(--cor-texto, #172121);

            cursor: pointer;

            font-size: 16px;

            transition:
                background 0.2s ease,
                color 0.2s ease;
        }


        .config-modal-fechar:hover {

            background:
                rgba(0, 168, 158, 0.14);

            color:
                var(--cor-primaria, #00a89e);
        }


        .config-modal-corpo {

            padding:
                22px 24px 24px;
        }


        .config-opcoes {

            display: flex;

            flex-direction: column;

            gap: 10px;
        }


        .config-opcao {

            display: flex;

            align-items: center;

            justify-content: space-between;

            gap: 16px;

            padding:
                15px 16px;

            border:
                1px solid
                var(--cor-borda, #e3eaea);

            border-radius:
                13px;

            background:
                transparent;
        }


        .config-opcao-texto {

            min-width: 0;

            flex: 1;
        }


        .config-opcao-texto strong {

            display: block;

            margin-bottom: 4px;

            font-size: 14px;
        }


        .config-opcao-texto span {

            display: block;

            color:
                var(
                    --cor-texto-secundario,
                    #6b7a7a
                );

            font-size: 12px;

            line-height: 1.45;
        }


        .config-switch {

            position: relative;

            width: 48px;

            height: 28px;

            flex-shrink: 0;
        }


        .config-switch input {

            position: absolute;

            opacity: 0;

            pointer-events: none;
        }


        .config-switch-slider {

            position: absolute;

            inset: 0;

            border-radius: 999px;

            background:
                #aebbbb;

            cursor: pointer;

            transition:
                background 0.2s ease;
        }


        .config-switch-slider::after {

            content: "";

            position: absolute;

            top: 4px;

            left: 4px;

            width: 20px;

            height: 20px;

            border-radius: 50%;

            background: #ffffff;

            box-shadow:
                0 2px 5px
                rgba(0,0,0,0.18);

            transition:
                transform 0.2s ease;
        }


        .config-switch input:checked
        + .config-switch-slider {

            background:
                var(--cor-primaria, #00a89e);
        }


        .config-switch input:checked
        + .config-switch-slider::after {

            transform:
                translateX(20px);
        }


        .config-info {

            padding:
                14px 16px;

            border-radius:
                13px;

            background:
                var(
                    --cor-primaria-suave,
                    rgba(0, 168, 158, 0.09)
                );

            color:
                var(--cor-texto, #172121);

            font-size: 13px;

            line-height: 1.55;

            margin-bottom: 14px;
        }


        .config-dispositivo {

            padding:
                17px;

            border:
                1px solid
                var(--cor-borda, #e3eaea);

            border-radius:
                14px;

            margin-bottom: 10px;
        }


        .config-dispositivo strong {

            display: block;

            margin-bottom: 5px;

            font-size: 14px;
        }


        .config-dispositivo span {

            display: block;

            color:
                var(
                    --cor-texto-secundario,
                    #6b7a7a
                );

            font-size: 12px;

            line-height: 1.5;
        }


        .config-botoes {

            display: flex;

            justify-content: flex-end;

            gap: 10px;

            margin-top: 20px;
        }


        .config-botao {

            min-height: 42px;

            padding:
                0 17px;

            border: 0;

            border-radius: 10px;

            font-weight: 700;

            cursor: pointer;
        }


        .config-botao-secundario {

            background:
                var(
                    --cor-borda,
                    #e3eaea
                );

            color:
                var(--cor-texto, #172121);
        }


        .config-botao-primario {

            background:
                var(
                    --cor-primaria,
                    #00a89e
                );

            color: #ffffff;
        }


        .config-botao-perigo {

            background:
                var(
                    --cor-perigo,
                    #dc3545
                );

            color: #ffffff;
        }


        .config-texto {

            color:
                var(
                    --cor-texto-secundario,
                    #6b7a7a
                );

            font-size: 14px;

            line-height: 1.7;
        }


        .config-texto p {

            margin:
                0 0 13px;
        }


        .config-texto p:last-child {

            margin-bottom: 0;
        }


        .config-lista {

            margin:
                0;

            padding-left:
                20px;

            color:
                var(
                    --cor-texto-secundario,
                    #6b7a7a
                );

            font-size: 13px;

            line-height: 1.7;
        }


        @media (max-width: 520px) {

            .config-modal {

                padding: 12px;
            }

            .config-modal-conteudo {

                max-height:
                    calc(100vh - 24px);

                border-radius:
                    17px;
            }

            .config-modal-cabecalho {

                padding:
                    18px 17px 14px;
            }

            .config-modal-corpo {

                padding:
                    18px 17px 20px;
            }

            .config-opcao {

                padding:
                    13px;
            }

            .config-botoes {

                flex-direction:
                    column;
            }

            .config-botao {

                width: 100%;
            }
        }


        @media (prefers-reduced-motion: reduce) {

            .config-modal,
            .config-modal-conteudo,
            .config-switch-slider,
            .config-switch-slider::after {

                transition: none !important;
            }
        }
    `;

    document.head.appendChild(style);
}


/* =========================================================
   MODAL
   ========================================================= */

let modalAtual = null;
let elementoAnterior = null;


function fecharModal() {

    if (!modalAtual) {
        return;
    }

    const modal =
        modalAtual;

    modal.classList.remove(
        "aberto"
    );

    document.body.style.overflow = "";

    const focoAnterior =
        elementoAnterior;

    setTimeout(
        function () {

            if (modal.parentNode) {
                modal.remove();
            }

        },
        220
    );

    modalAtual = null;

    elementoAnterior = null;

    if (
        focoAnterior &&
        document.contains(focoAnterior)
    ) {

        focoAnterior.focus();
    }
}


function abrirModal({
    titulo,
    descricao = "",
    conteudo,
    elementoOrigem = null
}) {

    fecharModal();

    elementoAnterior =
        elementoOrigem;

    const modal =
        document.createElement("div");

    modal.className =
        "config-modal";

    modal.setAttribute(
        "role",
        "dialog"
    );

    modal.setAttribute(
        "aria-modal",
        "true"
    );

    modal.setAttribute(
        "aria-labelledby",
        "tituloModalConfiguracoes"
    );

    modal.innerHTML = `

        <div class="config-modal-conteudo">

            <div class="config-modal-cabecalho">

                <div class="config-modal-titulo">

                    <h2 id="tituloModalConfiguracoes">
                        ${escaparHTML(titulo)}
                    </h2>

                    ${
                        descricao
                            ? `
                                <p>
                                    ${escaparHTML(descricao)}
                                </p>
                              `
                            : ""
                    }

                </div>

                <button
                    type="button"
                    class="config-modal-fechar"
                    aria-label="Fechar"
                >
                    <i
                        class="fa-solid fa-xmark"
                        aria-hidden="true"
                    ></i>
                </button>

            </div>

            <div class="config-modal-corpo">
                ${conteudo}
            </div>

        </div>
    `;

    document.body.appendChild(
        modal
    );

    modalAtual =
        modal;

    document.body.style.overflow =
        "hidden";

    const btnFechar =
        modal.querySelector(
            ".config-modal-fechar"
        );

    btnFechar.addEventListener(
        "click",
        function () {

            fecharModal();

            emitirFeedback(
                "fechar-configuracao"
            );
        }
    );

    modal.addEventListener(
        "click",
        function (evento) {

            if (
                evento.target ===
                modal
            ) {

                fecharModal();
            }
        }
    );

    requestAnimationFrame(
        function () {

            modal.classList.add(
                "aberto"
            );

            btnFechar.focus();
        }
    );

    return modal;
}


/* =========================================================
   NOTIFICAÇÕES
   ========================================================= */

function abrirNotificacoes() {

    const modal =
        abrirModal({

            titulo:
                "Notificações",

            descricao:
                "Controle os avisos e lembretes do FonemaViva.",

            elementoOrigem:
                btnNotificacoes,

            conteudo: `

                <div class="config-info">
                    Esta preferência controla as notificações
                    que o FonemaViva poderá utilizar no futuro.
                </div>

                <div class="config-opcoes">

                    <div class="config-opcao">

                        <div class="config-opcao-texto">

                            <strong>
                                Notificações
                            </strong>

                            <span>
                                Permitir avisos e lembretes do FonemaViva.
                            </span>

                        </div>

                        <label
                            class="config-switch"
                            aria-label="Ativar notificações"
                        >

                            <input
                                type="checkbox"
                                id="configNotificacoes"
                                ${
                                    configuracoesFonemaViva
                                        .notificacoes
                                        ? "checked"
                                        : ""
                                }
                            >

                            <span
                                class="config-switch-slider"
                            ></span>

                        </label>

                    </div>

                </div>
            `
        });

    const controle =
        modal.querySelector(
            "#configNotificacoes"
        );

    controle.addEventListener(
        "change",
        function () {

            configuracoesFonemaViva
                .notificacoes =
                controle.checked;

            salvarConfiguracoes();

            emitirFeedback(
                "notificacoes"
            );
        }
    );
}


/* =========================================================
   EXERCÍCIOS
   ========================================================= */

function abrirExercicios() {

    const exercicios =
        configuracoesFonemaViva
            .exercicios;

    const modal =
        abrirModal({

            titulo:
                "Exercícios",

            descricao:
                "Personalize o funcionamento dos exercícios.",

            elementoOrigem:
                btnExercicios,

            conteudo: `

                <div class="config-opcoes">

                    <div class="config-opcao">

                        <div class="config-opcao-texto">

                            <strong>
                                Reprodução automática
                            </strong>

                            <span>
                                Permitir que conteúdos sonoros
                                dos exercícios sejam reproduzidos
                                automaticamente quando disponível.
                            </span>

                        </div>

                        <label
                            class="config-switch"
                            aria-label="Reprodução automática"
                        >

                            <input
                                type="checkbox"
                                id="configReproducaoAutomatica"
                                ${
                                    exercicios
                                        .reproducaoAutomatica
                                        ? "checked"
                                        : ""
                                }
                            >

                            <span
                                class="config-switch-slider"
                            ></span>

                        </label>

                    </div>


                    <div class="config-opcao">

                        <div class="config-opcao-texto">

                            <strong>
                                Feedback dos exercícios
                            </strong>

                            <span>
                                Permitir feedback sonoro durante
                                a realização dos exercícios.
                            </span>

                        </div>

                        <label
                            class="config-switch"
                            aria-label="Feedback dos exercícios"
                        >

                            <input
                                type="checkbox"
                                id="configFeedbackExercicios"
                                ${
                                    exercicios
                                        .feedbackExercicios
                                        ? "checked"
                                        : ""
                                }
                            >

                            <span
                                class="config-switch-slider"
                            ></span>

                        </label>

                    </div>

                </div>
            `
        });

    const reproducao =
        modal.querySelector(
            "#configReproducaoAutomatica"
        );

    const feedback =
        modal.querySelector(
            "#configFeedbackExercicios"
        );

    reproducao.addEventListener(
        "change",
        function () {

            configuracoesFonemaViva
                .exercicios
                .reproducaoAutomatica =
                reproducao.checked;

            salvarConfiguracoes();

            emitirFeedback(
                "reproducao-exercicios"
            );
        }
    );

    feedback.addEventListener(
        "change",
        function () {

            configuracoesFonemaViva
                .exercicios
                .feedbackExercicios =
                feedback.checked;

            salvarConfiguracoes();

            emitirFeedback(
                "feedback-exercicios"
            );
        }
    );
}


/* =========================================================
   CONTINUAR EXERCÍCIOS
   ========================================================= */

function abrirContinuarExercicios() {

    const modal =
        abrirModal({

            titulo:
                "Continuar exercícios",

            descricao:
                "Defina como o FonemaViva deve retomar seus exercícios.",

            elementoOrigem:
                btnContinuarExercicios,

            conteudo: `

                <div class="config-info">
                    Quando ativado, o FonemaViva poderá utilizar
                    o progresso salvo para continuar um exercício
                    posteriormente.
                </div>

                <div class="config-opcao">

                    <div class="config-opcao-texto">

                        <strong>
                            Continuar automaticamente
                        </strong>

                        <span>
                            Retomar os exercícios de onde você parou.
                        </span>

                    </div>

                    <label
                        class="config-switch"
                        aria-label="Continuar exercícios automaticamente"
                    >

                        <input
                            type="checkbox"
                            id="configContinuarExercicios"
                            ${
                                configuracoesFonemaViva
                                    .continuarExercicios
                                    ? "checked"
                                    : ""
                            }
                        >

                        <span
                            class="config-switch-slider"
                        ></span>

                    </label>

                </div>
            `
        });

    const controle =
        modal.querySelector(
            "#configContinuarExercicios"
        );

    controle.addEventListener(
        "change",
        function () {

            configuracoesFonemaViva
                .continuarExercicios =
                controle.checked;

            salvarConfiguracoes();

            emitirFeedback(
                "continuar-exercicios"
            );
        }
    );
}


/* =========================================================
   DISPOSITIVOS
   ========================================================= */

function obterNomeNavegador() {

    const agente =
        navigator.userAgent;

    if (
        agente.includes("Edg/")
    ) {
        return "Microsoft Edge";
    }

    if (
        agente.includes("Chrome/") &&
        !agente.includes("Edg/")
    ) {
        return "Google Chrome";
    }

    if (
        agente.includes("Firefox/")
    ) {
        return "Mozilla Firefox";
    }

    if (
        agente.includes("Safari/") &&
        !agente.includes("Chrome/")
    ) {
        return "Safari";
    }

    return "Navegador não identificado";
}


function obterSistemaOperacional() {

    const plataforma =
        navigator.platform ||
        "";

    const agente =
        navigator.userAgent ||
        "";

    if (
        agente.includes("Windows")
    ) {
        return "Windows";
    }

    if (
        agente.includes("Android")
    ) {
        return "Android";
    }

    if (
        agente.includes("iPhone") ||
        agente.includes("iPad")
    ) {
        return "iOS";
    }

    if (
        agente.includes("Mac")
    ) {
        return "macOS";
    }

    if (
        agente.includes("Linux") ||
        plataforma.includes("Linux")
    ) {
        return "Linux";
    }

    return "Sistema não identificado";
}


function abrirDispositivos() {

    const navegador =
        obterNomeNavegador();

    const sistema =
        obterSistemaOperacional();

    const modal =
        abrirModal({

            titulo:
                "Dispositivos conectados",

            descricao:
                "Informações sobre esta sessão do FonemaViva.",

            elementoOrigem:
                btnDispositivos,

            conteudo: `

                <div class="config-info">
                    Por segurança e privacidade, esta página
                    mostra somente informações que o navegador
                    disponibiliza para a sessão atual.
                </div>

                <div class="config-dispositivo">

                    <strong>
                        <i
                            class="fa-solid fa-desktop"
                            aria-hidden="true"
                        ></i>
                        Dispositivo atual
                    </strong>

                    <span>
                        Sistema: ${escaparHTML(sistema)}
                    </span>

                    <span>
                        Navegador: ${escaparHTML(navegador)}
                    </span>

                    <span>
                        Status: Sessão atual
                    </span>

                </div>

                <div class="config-botoes">

                    <button
                        type="button"
                        class="config-botao config-botao-secundario"
                        id="btnAtualizarDispositivo"
                    >
                        Atualizar
                    </button>

                </div>
            `
        });

    const btnAtualizar =
        modal.querySelector(
            "#btnAtualizarDispositivo"
        );

    btnAtualizar.addEventListener(
        "click",
        function () {

            fecharModal();

            setTimeout(
                function () {

                    abrirDispositivos();

                },
                240
            );

            emitirFeedback(
                "atualizar-dispositivo"
            );
        }
    );
}


/* =========================================================
   EXCLUSÃO DA CONTA
   ========================================================= */

function abrirExcluirConta() {

    const modal =
        abrirModal({

            titulo:
                "Excluir conta",

            descricao:
                "Esta ação requer confirmação.",

            elementoOrigem:
                btnExcluirConta,

            conteudo: `

                <div class="config-info">

                    A exclusão de uma conta é uma operação
                    permanente. Dados associados à conta poderão
                    ser removidos conforme a política de retenção
                    do FonemaViva.

                </div>

                <div class="config-opcao">

                    <div class="config-opcao-texto">

                        <strong>
                            Confirmar exclusão
                        </strong>

                        <span>
                            Marque esta opção para habilitar
                            a confirmação final.
                        </span>

                    </div>

                    <label
                        class="config-switch"
                        aria-label="Confirmar exclusão da conta"
                    >

                        <input
                            type="checkbox"
                            id="confirmarExclusaoConta"
                        >

                        <span
                            class="config-switch-slider"
                        ></span>

                    </label>

                </div>

                <div class="config-botoes">

                    <button
                        type="button"
                        class="config-botao config-botao-secundario"
                        id="btnCancelarExclusao"
                    >
                        Cancelar
                    </button>

                    <button
                        type="button"
                        class="config-botao config-botao-perigo"
                        id="btnConfirmarExclusao"
                        disabled
                    >
                        Excluir conta
                    </button>

                </div>
            `
        });

    const checkbox =
        modal.querySelector(
            "#confirmarExclusaoConta"
        );

    const btnCancelar =
        modal.querySelector(
            "#btnCancelarExclusao"
        );

    const btnConfirmar =
        modal.querySelector(
            "#btnConfirmarExclusao"
        );

    checkbox.addEventListener(
        "change",
        function () {

            btnConfirmar.disabled =
                !checkbox.checked;
        }
    );

    btnCancelar.addEventListener(
        "click",
        function () {

            fecharModal();
        }
    );

    btnConfirmar.addEventListener(
        "click",
        function () {

            if (
                !checkbox.checked
            ) {
                return;
            }

            abrirConfirmacaoFinalExclusao();
        }
    );
}


/* =========================================================
   CONFIRMAÇÃO FINAL DE EXCLUSÃO
   ========================================================= */

function abrirConfirmacaoFinalExclusao() {

    const modal =
        abrirModal({

            titulo:
                "Confirmação final",

            descricao:
                "Última confirmação antes da exclusão.",

            elementoOrigem:
                btnExcluirConta,

            conteudo: `

                <div class="config-info">

                    Você está prestes a solicitar a exclusão
                    permanente da sua conta.

                    <br><br>

                    Essa operação não deve ser executada
                    diretamente pelo navegador usando uma chave
                    administrativa do Supabase.

                </div>

                <div class="config-botoes">

                    <button
                        type="button"
                        class="config-botao config-botao-secundario"
                        id="btnVoltarExclusao"
                    >
                        Voltar
                    </button>

                    <button
                        type="button"
                        class="config-botao config-botao-perigo"
                        id="btnSolicitarExclusao"
                    >
                        Confirmar
                    </button>

                </div>
            `
        });

    const btnVoltar =
        modal.querySelector(
            "#btnVoltarExclusao"
        );

    const btnConfirmar =
        modal.querySelector(
            "#btnSolicitarExclusao"
        );

    btnVoltar.addEventListener(
        "click",
        function () {

            fecharModal();

            setTimeout(
                function () {

                    abrirExcluirConta();

                },
                240
            );
        }
    );

    btnConfirmar.addEventListener(
        "click",
        async function () {

            /*
             * IMPORTANTE:
             * A exclusão definitiva deverá ser executada
             * por uma Edge Function/backend seguro.
             *
             * Não colocamos service_role no navegador.
             */

            btnConfirmar.disabled =
                true;

            btnConfirmar.textContent =
                "Preparando...";

            console.warn(
                "FonemaViva: a exclusão definitiva deve ser realizada por uma operação segura no servidor."
            );

            btnConfirmar.textContent =
                "Operação não disponível";

            setTimeout(
                function () {

                    fecharModal();

                },
                1200
            );
        }
    );
}


/* =========================================================
   SOBRE
   ========================================================= */

function abrirSobre() {

    abrirModal({

        titulo:
            "Sobre o FonemaViva",

        descricao:
            "Informações da aplicação.",

        elementoOrigem:
            btnSobre,

        conteudo: `

            <div class="config-texto">

                <p>
                    <strong>FonemaViva</strong> é uma plataforma
                    interativa voltada ao apoio de atividades
                    de fonologia, comunicação e exercícios
                    relacionados à fala.
                </p>

                <p>
                    A plataforma reúne exercícios interativos,
                    recursos de acessibilidade e acompanhamento
                    do progresso do usuário.
                </p>

                <p>
                    <strong>Versão:</strong> 1.0.0
                </p>

                <p>
                    © FonemaViva
                </p>

            </div>
        `
    });
}


/* =========================================================
   TERMOS
   ========================================================= */

function abrirTermos() {

    abrirModal({

        titulo:
            "Termos de uso",

        descricao:
            "Condições de utilização do FonemaViva.",

        elementoOrigem:
            btnTermos,

        conteudo: `

            <div class="config-texto">

                <p>
                    O FonemaViva deve ser utilizado de acordo
                    com sua finalidade e com as orientações
                    apresentadas pela plataforma.
                </p>

                <p>
                    O usuário é responsável pelas informações
                    fornecidas à plataforma e pelo uso adequado
                    de sua conta.
                </p>

                <p>
                    Recursos, exercícios e informações apresentados
                    pelo FonemaViva não substituem avaliação,
                    diagnóstico ou acompanhamento profissional
                    quando estes forem necessários.
                </p>

                <p>
                    Os termos completos deverão ser substituídos
                    pelo documento jurídico oficial do FonemaViva
                    quando essa página estiver disponível.
                </p>

            </div>
        `
    });
}


/* =========================================================
   PRIVACIDADE
   ========================================================= */

function abrirPrivacidade() {

    abrirModal({

        titulo:
            "Política de privacidade",

        descricao:
            "Informações sobre o tratamento de dados.",

        elementoOrigem:
            btnPrivacidade,

        conteudo: `

            <div class="config-texto">

                <p>
                    O FonemaViva utiliza informações necessárias
                    para autenticação, funcionamento da conta,
                    preferências e acompanhamento do progresso.
                </p>

                <p>
                    As preferências de acessibilidade podem ser
                    armazenadas localmente e sincronizadas com
                    a conta do usuário quando houver uma sessão
                    autenticada.
                </p>

                <p>
                    O tratamento de dados deve seguir os princípios
                    de segurança, finalidade, necessidade e
                    transparência aplicáveis ao serviço.
                </p>

                <p>
                    O conteúdo apresentado aqui deverá ser
                    substituído pela política de privacidade
                    oficial e completa do FonemaViva.
                </p>

            </div>
        `
    });
}


/* =========================================================
   EVENTOS DOS BOTÕES
   ========================================================= */

function configurarBotoes() {

    if (btnNotificacoes) {

        btnNotificacoes.addEventListener(
            "click",
            function () {

                abrirNotificacoes();

                emitirFeedback(
                    "abrir-notificacoes"
                );
            }
        );
    }


    if (btnExercicios) {

        btnExercicios.addEventListener(
            "click",
            function () {

                abrirExercicios();

                emitirFeedback(
                    "abrir-exercicios"
                );
            }
        );
    }


    if (btnContinuarExercicios) {

        btnContinuarExercicios.addEventListener(
            "click",
            function () {

                abrirContinuarExercicios();

                emitirFeedback(
                    "abrir-continuar-exercicios"
                );
            }
        );
    }


    if (btnDispositivos) {

        btnDispositivos.addEventListener(
            "click",
            function () {

                abrirDispositivos();

                emitirFeedback(
                    "abrir-dispositivos"
                );
            }
        );
    }


    if (btnExcluirConta) {

        btnExcluirConta.addEventListener(
            "click",
            function () {

                abrirExcluirConta();

                emitirFeedback(
                    "abrir-exclusao"
                );
            }
        );
    }


    if (btnSobre) {

        btnSobre.addEventListener(
            "click",
            function () {

                abrirSobre();

                emitirFeedback(
                    "abrir-sobre"
                );
            }
        );
    }


    if (btnTermos) {

        btnTermos.addEventListener(
            "click",
            function () {

                abrirTermos();

                emitirFeedback(
                    "abrir-termos"
                );
            }
        );
    }


    if (btnPrivacidade) {

        btnPrivacidade.addEventListener(
            "click",
            function () {

                abrirPrivacidade();

                emitirFeedback(
                    "abrir-privacidade"
                );
            }
        );
    }
}


/* =========================================================
   ESC
   ========================================================= */

function configurarTeclaEscape() {

    document.addEventListener(
        "keydown",
        function (evento) {

            if (
                evento.key === "Escape" &&
                modalAtual
            ) {

                fecharModal();
            }
        }
    );
}


/* =========================================================
   SINCRONIZAÇÃO COM ACESSIBILIDADE
   ========================================================= */

function observarAcessibilidade() {

    window.addEventListener(
        "fonemaVivaAcessibilidadeAlterada",
        function () {

            /*
             * O sistema global de acessibilidade continua
             * sendo a autoridade para tema, animações,
             * foco, tamanho de texto etc.
             */

            if (
                window.FonemaVivaAcessibilidade &&
                typeof
                    window.FonemaVivaAcessibilidade
                        .aplicar === "function"
            ) {

                window.FonemaVivaAcessibilidade
                    .aplicar();
            }
        }
    );
}


/* =========================================================
   API DA PÁGINA
   ========================================================= */

window.FonemaVivaConfiguracoes = {

    obter: function () {

        return {
            ...configuracoesFonemaViva,
            exercicios: {
                ...configuracoesFonemaViva
                    .exercicios
            }
        };
    },

    salvar: salvarConfiguracoes,

    abrirNotificacoes:
        abrirNotificacoes,

    abrirExercicios:
        abrirExercicios,

    abrirContinuarExercicios:
        abrirContinuarExercicios,

    abrirDispositivos:
        abrirDispositivos,

    abrirExcluirConta:
        abrirExcluirConta
};


/* =========================================================
   INICIALIZAÇÃO
   ========================================================= */

function iniciarConfiguracoes() {

    carregarConfiguracoes();

    inserirEstilosPaineis();

    configurarBotoes();

    configurarTeclaEscape();

    observarAcessibilidade();
}


if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        iniciarConfiguracoes,
        {
            once: true
        }
    );

} else {

    iniciarConfiguracoes();
}
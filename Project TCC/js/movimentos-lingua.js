/* =========================================================
   FONEMAVIVA — CARETAS
   JavaScript completo
   ========================================================= */

"use strict";


/* =========================================================
   CONFIGURAÇÕES
   ========================================================= */

const TEMPO_EXERCICIO = 10;
const TOTAL_EXERCICIOS = 5;

const STORAGE_PROGRESSO = "caretasProgresso";
const STORAGE_CONCLUIDO = "caretasConcluido";


/* =========================================================
   DADOS DOS EXERCÍCIOS
   ========================================================= */

const exercicios = [
  {
    numero: 1,

    titulo: "Sorriso amplo",

    descricao:
      "Abra um sorriso bem largo, elevando os cantos da boca, e mantenha essa posição.",

    instrucao:
      "Abra um sorriso bem largo, levantando os cantos da boca. Mantenha o sorriso nessa posição.",

    icone: "fa-face-smile",

    mensagem:
      "Faça o sorriso e mantenha a posição por 10 segundos.",

    aria:
      "Rosto demonstrando um sorriso amplo",

    classeRosto:
      "face-exercicio-1"
  },

  {
    numero: 2,

    titulo: "Bico de beijo",

    descricao:
      "Projete os lábios para frente, formando um bico, e mantenha essa posição.",

    instrucao:
      "Junte os lábios e projete-os para frente, como se fosse dar um beijo. Mantenha por 10 segundos.",

    icone: "fa-face-kiss-wink-heart",

    mensagem:
      "Faça o bico de beijo e mantenha a posição por 10 segundos.",

    aria:
      "Rosto demonstrando bico de beijo",

    classeRosto:
      "face-exercicio-2"
  },

  {
    numero: 3,

    titulo: "Língua para fora",

    descricao:
      "Abra a boca e coloque a língua para fora, mantendo-a estendida durante o exercício.",

    instrucao:
      "Abra a boca e coloque a língua para fora. Mantenha a língua estendida por 10 segundos.",

    icone: "fa-face-grin-tongue",

    mensagem:
      "Coloque a língua para fora e mantenha por 10 segundos.",

    aria:
      "Rosto demonstrando a língua para fora",

    classeRosto:
      "face-exercicio-3"
  },

  {
    numero: 4,

    titulo: "Língua para o canto",

    descricao:
      "Coloque a língua para o lado da boca, direcionando-a para um dos cantos.",

    instrucao:
      "Abra a boca e leve a língua para o canto direito. Mantenha nessa posição por 10 segundos.",

    icone: "fa-face-grin-tongue-wink",

    mensagem:
      "Leve a língua para o canto e mantenha por 10 segundos.",

    aria:
      "Rosto demonstrando a língua direcionada para o canto da boca",

    classeRosto:
      "face-exercicio-4"
  },

  {
    numero: 5,

    titulo: "Bochechas infladas",

    descricao:
      "Encha as duas bochechas com ar e mantenha-as infladas durante o exercício.",

    instrucao:
      "Encha as duas bochechas com ar, sem deixar o ar escapar. Mantenha por 10 segundos.",

    icone: "fa-face-surprise",

    mensagem:
      "Encha as bochechas e mantenha o ar por 10 segundos.",

    aria:
      "Rosto demonstrando as bochechas infladas",

    classeRosto:
      "face-exercicio-5"
  }
];


/* =========================================================
   ELEMENTOS DA PÁGINA
   ========================================================= */

let pageLoading;
let exercise;
let completion;

let btnVoltar;
let btnConcluir;
let btnFinalizar;

let btnConcluirText;

let stepCounter;

let progressText;
let progressBar;

let exerciseNumber;
let exerciseTitle;
let exerciseDescription;

let demonstrationIcon;

let face;

let instructionIcon;
let instructionText;

let timerCircle;
let timer;
let timerMessage;


/* =========================================================
   ESTADO
   ========================================================= */

let exercicioAtual = 0;

let tempoFinal = 0;

let intervaloTimer = null;

let paginaInicializada = false;


/* =========================================================
   INICIALIZAÇÃO
   ========================================================= */

document.addEventListener("DOMContentLoaded", iniciar);


/* =========================================================
   INICIAR
   ========================================================= */

function iniciar() {

  obterElementos();

  if (!exercise) {
    return;
  }

  configurarEventos();

  paginaInicializada = true;

  iniciarPagina();
}


/* =========================================================
   OBTER ELEMENTOS
   ========================================================= */

function obterElementos() {

  pageLoading =
    document.getElementById("pageLoading");

  exercise =
    document.getElementById("exercise");

  completion =
    document.getElementById("completion");

  btnVoltar =
    document.getElementById("btnVoltar");

  btnConcluir =
    document.getElementById("btnConcluir");

  btnFinalizar =
    document.getElementById("btnFinalizar");

  btnConcluirText =
    document.getElementById("btnConcluirText");

  stepCounter =
    document.getElementById("stepCounter");

  progressText =
    document.getElementById("progressText");

  progressBar =
    document.getElementById("progressBar");

  exerciseNumber =
    document.getElementById("exerciseNumber");

  exerciseTitle =
    document.getElementById("exerciseTitle");

  exerciseDescription =
    document.getElementById("exerciseDescription");

  demonstrationIcon =
    document.getElementById("demonstrationIcon");

  face =
    document.getElementById("face");

  instructionIcon =
    document.getElementById("instructionIcon");

  instructionText =
    document.getElementById("instructionText");

  timerCircle =
    document.getElementById("timerCircle");

  timer =
    document.getElementById("timer");

  timerMessage =
    document.getElementById("timerMessage");
}


/* =========================================================
   EVENTOS
   ========================================================= */

function configurarEventos() {

  if (btnVoltar) {
    btnVoltar.addEventListener(
      "click",
      voltarPagina
    );
  }

  if (btnConcluir) {
    btnConcluir.addEventListener(
      "click",
      concluirEtapa
    );
  }

  if (btnFinalizar) {
    btnFinalizar.addEventListener(
      "click",
      finalizarPagina
    );
  }

  /*
   * Quando o usuário volta para a aba,
   * atualizamos imediatamente o cronômetro.
   */
  document.addEventListener(
    "visibilitychange",
    atualizarTimer
  );
}


/* =========================================================
   INICIAR PÁGINA
   ========================================================= */

function iniciarPagina() {

  carregarProgresso();

  carregarExercicio();

  /*
   * Pequeno tempo para a tela de carregamento
   * não desaparecer instantaneamente.
   */
  setTimeout(
    finalizarCarregamento,
    450
  );
}


/* =========================================================
   FINALIZAR CARREGAMENTO
   ========================================================= */

function finalizarCarregamento() {

  if (!pageLoading) {
    return;
  }

  pageLoading.classList.add("hidden");
}


/* =========================================================
   CARREGAR EXERCÍCIO
   ========================================================= */

function carregarExercicio() {

  pararTimer();

  const exercicio =
    exercicios[exercicioAtual];

  if (!exercicio) {
    return;
  }


  /* -----------------------------------------
     TEXTOS
     ----------------------------------------- */

  if (exerciseNumber) {
    exerciseNumber.textContent =
      `CARETA ${exercicio.numero}`;
  }

  if (exerciseTitle) {
    exerciseTitle.textContent =
      exercicio.titulo;
  }

  if (exerciseDescription) {
    exerciseDescription.textContent =
      exercicio.descricao;
  }

  if (instructionText) {
    instructionText.textContent =
      exercicio.instrucao;
  }

  if (timerMessage) {
    timerMessage.textContent =
      exercicio.mensagem;
  }


  /* -----------------------------------------
     ÍCONE PRINCIPAL
     ----------------------------------------- */

  if (demonstrationIcon) {

    demonstrationIcon.className =
      `fa-solid ${exercicio.icone}`;

    demonstrationIcon.setAttribute(
      "aria-hidden",
      "true"
    );
  }


  /* -----------------------------------------
     ÍCONE DA INSTRUÇÃO
     ----------------------------------------- */

  if (instructionIcon) {

    instructionIcon.innerHTML =
      `<i class="fa-solid ${exercicio.icone}" aria-hidden="true"></i>`;
  }


  /* -----------------------------------------
     ROSTO
     ----------------------------------------- */

  if (face) {

    face.classList.remove(
      "face-exercicio-1",
      "face-exercicio-2",
      "face-exercicio-3",
      "face-exercicio-4",
      "face-exercicio-5"
    );

    face.classList.add(
      exercicio.classeRosto
    );

    face.setAttribute(
      "aria-label",
      exercicio.aria
    );
  }


  /* -----------------------------------------
     PROGRESSO
     ----------------------------------------- */

  atualizarProgresso();


  /* -----------------------------------------
     RESET DO BOTÃO
     ----------------------------------------- */

  if (btnConcluir) {
    btnConcluir.disabled = true;
  }

  if (btnConcluirText) {
    btnConcluirText.textContent =
      "Aguarde 10 segundos";
  }


  /* -----------------------------------------
     TIMER
     ----------------------------------------- */

  iniciarTimer();
}


/* =========================================================
   INICIAR TIMER
   ========================================================= */

function iniciarTimer() {

  pararTimer();

  tempoFinal =
    Date.now() +
    TEMPO_EXERCICIO * 1000;

  atualizarTimer();

  intervaloTimer =
    setInterval(
      atualizarTimer,
      100
    );

  if (timerCircle) {
    timerCircle.classList.add("active");
  }
}


/* =========================================================
   ATUALIZAR TIMER
   ========================================================= */

function atualizarTimer() {

  if (!timer) {
    return;
  }

  /*
   * Calculamos usando Date.now()
   * para trabalhar com o tempo real.
   */
  const restante =
    Math.max(
      0,
      tempoFinal - Date.now()
    );

  const segundos =
    Math.ceil(restante / 1000);

  timer.textContent =
    String(segundos);


  /* -----------------------------------------
     PROGRESSO VISUAL DO CÍRCULO
     ----------------------------------------- */

  if (timerCircle) {

    const porcentagem =
      Math.min(
        100,
        Math.max(
          0,
          ((TEMPO_EXERCICIO * 1000 - restante) /
            (TEMPO_EXERCICIO * 1000)) *
            100
        )
      );

    const graus =
      porcentagem * 3.6;

    timerCircle.style.background =
      `conic-gradient(
        #00a89e ${graus}deg,
        #e1ecee ${graus}deg
      )`;
  }


  /* -----------------------------------------
     FINAL DO TEMPO
     ----------------------------------------- */

  if (restante <= 0) {

    pararTimer();

    liberarBotao();

    timer.textContent = "0";

    if (timerCircle) {
      timerCircle.classList.remove("active");

      timerCircle.style.background =
        `conic-gradient(
          #00a89e 360deg,
          #e1ecee 360deg
        )`;
    }
  }
}


/* =========================================================
   PARAR TIMER
   ========================================================= */

function pararTimer() {

  if (intervaloTimer !== null) {

    clearInterval(
      intervaloTimer
    );

    intervaloTimer = null;
  }
}


/* =========================================================
   LIBERAR BOTÃO
   ========================================================= */

function liberarBotao() {

  if (btnConcluir) {
    btnConcluir.disabled = false;
  }

  if (btnConcluirText) {
    btnConcluirText.textContent =
      exercicioAtual === TOTAL_EXERCICIOS - 1
        ? "Concluir exercício"
        : "Próxima careta";
  }

  if (timerMessage) {
    timerMessage.textContent =
      exercicioAtual === TOTAL_EXERCICIOS - 1
        ? "Muito bem! Você completou o tempo desta última careta."
        : "Muito bem! Você pode passar para a próxima careta.";
  }
}


/* =========================================================
   CONCLUIR ETAPA
   ========================================================= */

function concluirEtapa() {

  /*
   * Segurança:
   * não permite avançar antes dos 10 segundos.
   */
  if (
    btnConcluir &&
    btnConcluir.disabled
  ) {
    return;
  }

  salvarProgresso(
    exercicioAtual + 1
  );


  /* -----------------------------------------
     ÚLTIMA ETAPA
     ----------------------------------------- */

  if (
    exercicioAtual >=
    TOTAL_EXERCICIOS - 1
  ) {

    finalizarExercicio();

    return;
  }


  /* -----------------------------------------
     PRÓXIMA ETAPA
     ----------------------------------------- */

  exercicioAtual++;

  carregarExercicio();

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


/* =========================================================
   ATUALIZAR PROGRESSO
   ========================================================= */

function atualizarProgresso() {

  const etapaAtual =
    exercicioAtual + 1;

  const porcentagem =
    (etapaAtual / TOTAL_EXERCICIOS) * 100;


  if (stepCounter) {

    stepCounter.textContent =
      `${etapaAtual} / ${TOTAL_EXERCICIOS}`;

    stepCounter.setAttribute(
      "aria-label",
      `Etapa ${etapaAtual} de ${TOTAL_EXERCICIOS}`
    );
  }


  if (progressText) {

    progressText.textContent =
      `${etapaAtual} de ${TOTAL_EXERCICIOS}`;
  }


  if (progressBar) {

    progressBar.style.width =
      `${porcentagem}%`;
  }

  const progressTrack =
    document.querySelector(
      ".progress-track"
    );

  if (progressTrack) {

    progressTrack.setAttribute(
      "aria-valuenow",
      String(etapaAtual)
    );
  }
}


/* =========================================================
   SALVAR PROGRESSO
   ========================================================= */

function salvarProgresso(etapaConcluida) {

  const porcentagem =
    Math.min(
      100,
      Math.round(
        (etapaConcluida / TOTAL_EXERCICIOS) *
        100
      )
    );

  localStorage.setItem(
    STORAGE_PROGRESSO,
    String(porcentagem)
  );
}


/* =========================================================
   CARREGAR PROGRESSO
   ========================================================= */

function carregarProgresso() {

  const progressoSalvo =
    localStorage.getItem(
      STORAGE_PROGRESSO
    );

  /*
   * O exercício sempre começa pela primeira
   * careta quando o usuário abre a atividade.
   *
   * O progresso salvo serve para o sistema
   * geral do FonemaViva.
   */
  if (progressoSalvo !== null) {

    const progresso =
      Number(progressoSalvo);

    if (
      Number.isFinite(progresso) &&
      progresso >= 100
    ) {

      localStorage.setItem(
        STORAGE_CONCLUIDO,
        "true"
      );
    }
  }

  exercicioAtual = 0;
}


/* =========================================================
   FINALIZAR EXERCÍCIO
   ========================================================= */

function finalizarExercicio() {

  pararTimer();

  localStorage.setItem(
    STORAGE_PROGRESSO,
    "100"
  );

  localStorage.setItem(
    STORAGE_CONCLUIDO,
    "true"
  );


  /* -----------------------------------------
     ESCONDER EXERCÍCIO
     ----------------------------------------- */

  if (exercise) {
    exercise.hidden = true;
  }


  /* -----------------------------------------
     MOSTRAR CONCLUSÃO
     ----------------------------------------- */

  if (completion) {

    completion.hidden = false;

    completion.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }
}


/* =========================================================
   BOTÃO FINALIZAR
   ========================================================= */

function finalizarPagina() {

  /*
   * Volta para a página anterior.
   * Se não houver histórico, vai para adultos.html.
   */
  if (window.history.length > 1) {

    window.history.back();

    return;
  }

  window.location.href =
    "./adultos.html";
}


/* =========================================================
   BOTÃO VOLTAR
   ========================================================= */

function voltarPagina() {

  pararTimer();

  if (window.history.length > 1) {

    window.history.back();

    return;
  }

  window.location.href =
    "./adultos.html";
}


/* =========================================================
   PROTEÇÃO AO SAIR
   ========================================================= */

window.addEventListener(
  "beforeunload",
  () => {
    pararTimer();
  }
);

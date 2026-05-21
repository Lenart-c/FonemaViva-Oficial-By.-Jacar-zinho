/* =========================================
   PALAVRAS
========================================= */

const palavras = [
  "Banana",
  "Pipoca",
  "Macaco",
  "Sorvete",
  "Dinossauro",
  "Abacaxi",
  "Chocolate",
  "Pirulito",
  "Gelatina",
  "Bolinha",
  "Robô",
  "Fantasma"
];

/* =========================================
   CONTROLE
========================================= */

let index = 0;
let acertou = false;
let acertos = 0;

let ouvindo = false;

let concluidos =
new Array(palavras.length).fill(false);

/* =========================================
   SALVAMENTO
========================================= */

const progressoSalvo =
localStorage.getItem(
  "palavras-divertidas"
);

if(progressoSalvo){

  const dados =
  JSON.parse(progressoSalvo);

  index =
  dados.index || 0;

  acertos =
  dados.acertos || 0;

  concluidos =
  dados.concluidos ||
  new Array(palavras.length).fill(false);
}

/* =========================================
   ELEMENTOS
========================================= */

const palavraEl =
document.getElementById("palavra");

const resultadoEl =
document.getElementById("resultado");

const feedbackEl =
document.getElementById("feedback");

const btnProximo =
document.getElementById("proximo");

const progressoEl =
document.getElementById("progresso");

const progressoTexto =
document.getElementById("progresso-texto");

const btnGravar =
document.getElementById("gravar");

/* =========================================
   RECONHECIMENTO
========================================= */

const SpeechRecognition =
window.SpeechRecognition ||
window.webkitSpeechRecognition;

const recognition =
new SpeechRecognition();

recognition.lang = "pt-BR";

recognition.continuous = false;

recognition.interimResults = false;

recognition.maxAlternatives = 5;

let timeoutAudio;

/* =========================================
   FUNÇÕES
========================================= */

function mostrarFeedback(texto, cor){

  feedbackEl.innerText = texto;

  feedbackEl.style.color = cor;
}

function capitalizar(texto){

  return texto.charAt(0).toUpperCase() +
  texto.slice(1);
}

function normalizar(texto){

  return texto
  .toLowerCase()
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/[^a-z\s]/g, "")
  .replace(/\s+/g, " ")
  .trim();
}

/* =========================================
   SALVAR PROGRESSO
========================================= */

function salvarProgresso(){

  localStorage.setItem(

    "palavras-divertidas",

    JSON.stringify({

      index: index,

      acertos: acertos,

      concluidos: concluidos
    })
  );
}

/* =========================================
   PROGRESSO
========================================= */

function atualizarProgresso(){

  const porcentagem =
  (acertos / palavras.length) * 100;

  progressoEl.style.width =
  porcentagem + "%";

  progressoTexto.innerText =
  Math.round(porcentagem) + "%";
}

function atualizarBotao(){

  btnProximo.disabled = !acertou;

  if(index === palavras.length - 1){

    if(acertou){

      btnProximo.innerHTML =
      "↻ Reiniciar";
    }

  } else {

    btnProximo.innerHTML =
    "Próxima →";
  }
}

function atualizarPalavra(){

  palavraEl.innerText =
  palavras[index];

  resultadoEl.innerText =
  "...";

  feedbackEl.innerText =
  "";

  acertou = false;

  atualizarBotao();
}

/* =========================================
   MICROFONE
========================================= */

btnGravar.addEventListener("click", () => {

  if(ouvindo) return;

  ouvindo = true;

  btnGravar.innerText =
  "🎙️ Ouvindo...";

  mostrarFeedback(
    "Fale a palavra inteira!",
    "#67e8f9"
  );

  recognition.start();

  timeoutAudio = setTimeout(() => {

    recognition.stop();

    ouvindo = false;

    btnGravar.innerText =
    "🎤 Falar Palavra";

    mostrarFeedback(
      "❌ Não consegui ouvir",
      "#ff0000"
    );

  }, 6000);
});

/* =========================================
   RESULTADO
========================================= */

recognition.onresult = (event) => {

  if(!ouvindo) return;

  clearTimeout(timeoutAudio);

  ouvindo = false;

  recognition.stop();

  let texto =
  event.results[0][0].transcript;

  texto =
  texto.trim();

  resultadoEl.innerText =
  capitalizar(texto);

  const correta =
  palavras[index];

  const usuario =
  normalizar(texto);

  const resposta =
  normalizar(correta);

  acertou = false;

  /* VERIFICA REPETIÇÃO */
  const palavrasFaladas =
  usuario.split(" ");

  let repetiu = false;

  for(
    let i = 1;
    i < palavrasFaladas.length;
    i++
  ){

    if(
      palavrasFaladas[i] ===
      palavrasFaladas[i - 1]
    ){

      repetiu = true;
    }
  }

  /* PALAVRA EXATA */
  if(
    usuario === resposta &&
    !repetiu
  ){

    acertou = true;
  }

  /* FEEDBACK */

  if(acertou){

    mostrarFeedback(
      "✅ Correto!",
      "#4ade80"
    );

    if(!concluidos[index]){

      concluidos[index] = true;

      acertos++;

      atualizarProgresso();

      salvarProgresso();
    }

  } else {

    if(repetiu){

      mostrarFeedback(
        "⚠️ Fale apenas uma vez",
        "#facc15"
      );

    } else {

      mostrarFeedback(
        "❌ Tente novamente",
        "#ff0026"
      );
    }
  }

  atualizarBotao();

  btnGravar.innerText =
  "🎤 Falar Palavra";
};

/* =========================================
   FINALIZAÇÃO
========================================= */

recognition.onend = () => {

  clearTimeout(timeoutAudio);

  btnGravar.innerText =
  "🎤 Falar Palavra";

  ouvindo = false;
};

/* =========================================
   ERROS
========================================= */

recognition.onerror = (event) => {

  ouvindo = false;

  clearTimeout(timeoutAudio);

  btnGravar.innerText =
  "🎤 Falar Palavra";

  if(event.error === "no-speech"){

    mostrarFeedback(
      "❌ Não foi possível ouvir",
      "#ff0000"
    );

    return;
  }

  mostrarFeedback(
    "❌ Erro no microfone",
    "#ff0000"
  );
};

/* =========================================
   PRÓXIMO
========================================= */

btnProximo.addEventListener("click", () => {

  if(!acertou) return;

  /* REINICIAR */

  if(index === palavras.length - 1){

    localStorage.removeItem(
      "palavras-divertidas"
    );

    index = 0;

    acertos = 0;

    concluidos =
    new Array(palavras.length).fill(false);

    atualizarProgresso();

    atualizarPalavra();

    return;
  }

  /* PRÓXIMA */

  index++;

  salvarProgresso();

  atualizarPalavra();
});

/* =========================================
   INICIAR
========================================= */

atualizarPalavra();

atualizarProgresso();
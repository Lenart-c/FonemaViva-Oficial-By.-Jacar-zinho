const frases = [

  "O rato roeu a roupa do rei",

  "A aranha arranha a jarra",

  "Pato pato ganso",

  "Bia bebe água",

  "Lili lambeu a lua",

  "O sapo sabia assobiar",

  "Teto sujo chão sujo",

  "Gato escondido com rabo de fora"

];

/* =========================================
   CONTROLE
========================================= */

let index = 0;

let acertou = false;

let ouvindo = false;

let acertos = 0;

let timeoutParar;

let concluidos =
new Array(frases.length).fill(false);

/* =========================================
   SALVAMENTO
========================================= */

const progressoSalvo =
localStorage.getItem(
  "trava-linguas"
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
  new Array(frases.length).fill(false);
}

/* =========================================
   ELEMENTOS
========================================= */

const travaEl =
document.getElementById("trava");

const textoEl =
document.getElementById("texto");

const feedbackEl =
document.getElementById("feedback");

const btnGravar =
document.getElementById("gravar");

const btnProximo =
document.getElementById("proximo");

const progressoEl =
document.getElementById("progresso");

const progressoTexto =
document.getElementById("progresso-texto");

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

recognition.maxAlternatives = 1;

/* =========================================
   FUNÇÕES
========================================= */

function normalizar(txt){

  return txt

  .toLowerCase()

  .normalize("NFD")

  .replace(/[\u0300-\u036f]/g, "")

  .replace(/[.,!?;]/g, "")

  .replace(/\s+/g, " ")

  .trim();
}

function capitalizar(txt){

  return txt.charAt(0).toUpperCase() +

  txt.slice(1);
}

function mostrarFeedback(texto, cor){

  feedbackEl.innerText =
  texto;

  feedbackEl.style.color =
  cor;
}

function salvar(){

  localStorage.setItem(

    "trava-linguas",

    JSON.stringify({

      index:index,

      acertos:acertos,

      concluidos:concluidos
    })
  );
}

function atualizarProgresso(){

  const porcentagem =

  (acertos / frases.length) * 100;

  progressoEl.style.width =

  porcentagem + "%";

  progressoTexto.innerText =

  Math.round(porcentagem) + "%";
}

function atualizarFrase(){

  travaEl.innerText =
  frases[index];

  textoEl.innerText =
  "...";

  feedbackEl.innerText =
  "";

  acertou = false;

  btnProximo.disabled = true;

  if(index === frases.length - 1){

    btnProximo.innerText =
    "↻ Reiniciar";

  } else {

    btnProximo.innerText =
    "Próximo →";
  }
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
    "Fale exatamente o trava-língua",
    "#67e8f9"
  );

  textoEl.innerText =
  "...";

  recognition.start();

  clearTimeout(timeoutParar);

  timeoutParar = setTimeout(() => {

    recognition.stop();

  }, 3000);
});

/* =========================================
   RESULTADO SUPER PRECISO
========================================= */

recognition.onresult = (event) => {

  clearTimeout(timeoutParar);

  const texto =
  event.results[0][0]
  .transcript
  .trim();

  textoEl.innerText =
  capitalizar(texto);

  const usuario =
  normalizar(texto);

  const correta =
  normalizar(
    frases[index]
  );

  /* =========================================
     COMPARAÇÃO SUPER PRECISA
  ========================================= */

  const palavrasUsuario =
  usuario.split(" ");

  const palavrasCorretas =
  correta.split(" ");

  let iguais = 0;

  /* MESMA QUANTIDADE */

  const mesmoTamanho =

  palavrasUsuario.length ===
  palavrasCorretas.length;

  /* COMPARA PALAVRA POR PALAVRA */

  for(
    let i = 0;
    i < palavrasCorretas.length;
    i++
  ){

    if(
      palavrasUsuario[i] ===
      palavrasCorretas[i]
    ){

      iguais++;
    }
  }

  /* PRECISÃO QUASE TOTAL */

  const porcentagem =

  iguais /
  palavrasCorretas.length;

  /* PRECISA:
     - mesmo tamanho
     - 95% correto */

  if(
    mesmoTamanho &&
    porcentagem >= 0.95
  ){

    acertou = true;

    btnProximo.disabled =
    false;

    if(!concluidos[index]){

      concluidos[index] = true;

      acertos++;

      atualizarProgresso();

      salvar();
    }

    mostrarFeedback(
      "✅ Correto!",
      "#4ade80"
    );

    if(
      index === frases.length - 1
    ){

      btnProximo.innerText =
      "↻ Reiniciar";
    }

  } else {

    acertou = false;

    btnProximo.disabled =
    true;

    mostrarFeedback(
      "❌Tente novamente",
      "#ff4d4d"
    );
  }
};

/* =========================================
   FINALIZAÇÃO
========================================= */

recognition.onend = () => {

  clearTimeout(timeoutParar);

  ouvindo = false;

  btnGravar.innerText =
  "🎤 Falar";
};

/* =========================================
   ERRO
========================================= */

recognition.onerror = (event) => {

  clearTimeout(timeoutParar);

  ouvindo = false;

  btnGravar.innerText =
  "🎤 Falar";

  if(
    event.error === "no-speech"
  ){

    mostrarFeedback(
      "❌ Não entendi, pode repetir?",
      "#ff4d4d"
    );

    return;
  }

  mostrarFeedback(
    "❌ Erro no microfone",
    "#ff4d4d"
  );
};

/* =========================================
   PRÓXIMO / REINICIAR
========================================= */

btnProximo.addEventListener("click", () => {

  if(!acertou) return;

  if(index === frases.length - 1){

    localStorage.removeItem(
      "trava-linguas"
    );

    index = 0;

    acertos = 0;

    concluidos =
    new Array(frases.length).fill(false);

    atualizarProgresso();

  } else {

    index++;
  }

  salvar();

  atualizarFrase();
});

/* =========================================
   INICIAR
========================================= */

atualizarFrase();

atualizarProgresso();
const palavras = [
  "Chuva",
  "Chapéu",
  "Chocolate",
  "Chinelo",
  "Chave",
  "Churrasco",
  "Chiclete",
  "Choro",
  "Chama",
  "Chocalho"
];

let index = 0;
let acertos = 0;
let acertou = false;
let ouvindo = false;

let concluidos =
  new Array(palavras.length).fill(false);

/* ELEMENTOS */

const elPalavra = document.getElementById("palavra");
const elResultado = document.getElementById("resultado");
const elFeedback = document.getElementById("feedback");
const btnGravar = document.getElementById("gravar");
const btnProximo = document.getElementById("proximo");
const elProgresso = document.getElementById("progresso");
const elProgressoTxt = document.getElementById("progresso-texto");

/* VOZ */

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();

recognition.lang = "pt-BR";
recognition.continuous = false;
recognition.interimResults = true;
recognition.maxAlternatives = 10;

/* =========================
   FUNÇÃO GLOBAL DE MAIÚSCULA
========================= */

function capitalize(txt) {
  if (!txt) return "";
  txt = txt.trim();
  return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase();
}

/* NORMALIZAÇÃO */

function norm(t) {
  return t
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "");
}

/* PROGRESSO */

function progress() {
  const total = palavras.length;
  const p = Math.round((acertos / total) * 100);

  elProgresso.style.width = p + "%";
  elProgressoTxt.textContent = p + "%";
}

/* SALVAR */

function save() {
  localStorage.setItem(
    "som-ch",
    JSON.stringify({ index, acertos, concluidos })
  );
}

/* FEEDBACK */

function feedback(text, color) {
  elFeedback.textContent = text;
  elFeedback.style.color = color;
}

/* PALAVRA */

function setWord() {
  elPalavra.textContent = capitalize(palavras[index]);
  elResultado.textContent = "...";
  elFeedback.textContent = "";
  acertou = false;
  btnProximo.disabled = true;

  btnProximo.textContent =
    index === palavras.length - 1
      ? "↻ Reiniciar"
      : "Próximo →";
}

/* MATCH */

function match(user, target) {
  return norm(user) === norm(target);
}

/* MICROFONE */

btnGravar.onclick = () => {
  if (ouvindo) return;

  ouvindo = true;
  recognition.start();

  btnGravar.textContent = "🎙️ Ouvindo...";
  feedback("Fale a palavra", "#67e8f9");

  setTimeout(() => recognition.stop(), 3000);
};

/* RESULTADO */

recognition.onresult = (e) => {
  let text = "";

  for (let i = 0; i < e.results.length; i++) {
    text += e.results[i][0].transcript + " ";
  }

  text = text.trim();

  elResultado.textContent = capitalize(text);

  if (match(text, palavras[index])) {
    acertou = true;
    btnProximo.disabled = false;

    if (!concluidos[index]) {
      concluidos[index] = true;
      acertos++;
      progress();
      save();
    }

    feedback("✔ Correto!", "#4ade80");

  } else {
    acertou = false;
    btnProximo.disabled = true;
    feedback("❌ Tente novamente", "#ff4d4d");
  }
};

/* FINAL */

recognition.onend = () => {
  ouvindo = false;
  btnGravar.textContent = "🎤 Falar Palavra";
};

/* PRÓXIMO */

btnProximo.onclick = () => {
  if (!acertou) return;

  if (index === palavras.length - 1) {
    localStorage.removeItem("som-ch");
    index = 0;
    acertos = 0;
    concluidos = new Array(palavras.length).fill(false);
  } else {
    index++;
  }

  save();
  setWord();
};

/* INICIO */

setWord();
progress();
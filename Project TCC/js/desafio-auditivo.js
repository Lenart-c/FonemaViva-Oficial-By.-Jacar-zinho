const pares = [
  { pair: "prato / trato", options: ["prato", "trato"] },
  { pair: "bravo / cravo", options: ["bravo", "cravo"] },
  { pair: "plano / pano", options: ["plano", "pano"] },
  { pair: "trama / drama", options: ["trama", "drama"] },
  { pair: "fraco / saco", options: ["fraco", "saco"] },
  { pair: "grato / gato", options: ["grato", "gato"] },
  { pair: "claro / caro", options: ["claro", "caro"] },
  { pair: "prumo / rumo", options: ["prumo", "rumo"] }
];

let index = 0;
let acertou = false;
let acertos = 0;

let concluidos = new Array(pares.length).fill(false);

const fraseEl = document.getElementById("frase");
const resultadoEl = document.getElementById("resultado");
const feedbackEl = document.getElementById("feedback");
const btnProximo = document.getElementById("proximo");
const progressoEl = document.getElementById("progresso");
const progressoTexto = document.getElementById("progresso-texto");

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = "pt-BR";

const btnPlay = document.getElementById("play");

function speak(text){
  if(!('speechSynthesis' in window)){
    feedbackEl.innerText = "⚠️ Síntese de voz não suportada neste navegador.";
    feedbackEl.style.color = "orange";
    return;
  }

  window.speechSynthesis.cancel();

  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'pt-BR';
  u.rate = 0.95;
  u.pitch = 1;

  u.onstart = () => {
    feedbackEl.innerText = '🔊 Tocando...';
    feedbackEl.style.color = '#555';
  };

  u.onend = () => {
    feedbackEl.innerText = '';
  };

  window.speechSynthesis.speak(u);
}

if(btnPlay){
  btnPlay.addEventListener('click', () => {
    const alvo = alvoEscolhido[index];
    speak(alvo);
  });
}

// Escolhe aleatoriamente qual opção será a esperada para cada par
const alvoEscolhido = pares.map(p => p.options[Math.floor(Math.random() * p.options.length)]);

function atualizarProgresso(){
  const porcentagem = (acertos / pares.length) * 100;
  progressoEl.style.width = porcentagem + "%";
  progressoTexto.innerText = Math.round(porcentagem) + "%";
  localStorage.setItem("desafio-auditivo-progress", Math.round(porcentagem));
}

function salvarProgresso(){
  localStorage.setItem("desafio-auditivo-save", JSON.stringify({ index, acertos, concluidos, acertou }));
}

const salvo = localStorage.getItem("desafio-auditivo-save");
if(salvo){
  const dados = JSON.parse(salvo);
  index = dados.index ?? 0;
  acertos = dados.acertos ?? 0;
  concluidos = dados.concluidos ?? new Array(pares.length).fill(false);
  acertou = dados.acertou ?? false;
}

document.getElementById("gravar").addEventListener("click", () => {
  feedbackEl.innerText = "🎤 Ouvindo...";
  feedbackEl.style.color = "#555";
  recognition.start();
});

recognition.onresult = (event) => {
  const textoOriginal = event.results[0][0].transcript;
  const texto = textoOriginal.toLowerCase();
  resultadoEl.innerText = textoOriginal.charAt(0).toUpperCase() + textoOriginal.slice(1);

  const alvo = alvoEscolhido[index];
  acertou = false;

  if (texto.includes(alvo)){
    feedbackEl.innerText = "✅ Correto!";
    feedbackEl.style.color = "green";
    acertou = true;
    if(!concluidos[index]){ concluidos[index] = true; acertos++; atualizarProgresso(); }
    salvarProgresso();
  } else {
    feedbackEl.innerText = "❌ Não foi esse. Tente novamente.";
    feedbackEl.style.color = "red";
  }

  atualizarBotoes();
};

btnProximo.addEventListener("click", () => {
  if(!acertou) return;
  if(index === pares.length - 1){
    localStorage.setItem("desafio-auditivo-progress", 0);
    localStorage.removeItem("desafio-auditivo-save");
    index = 0; acertos = 0; acertou = false; concluidos = new Array(pares.length).fill(false);
    atualizarProgresso(); atualizar(); atualizarBotoes(); return;
  }
  index++; acertou = false; salvarProgresso(); atualizar();
});

function atualizar(){
  fraseEl.innerText = pares[index].pair;
  resultadoEl.innerText = "...";
  feedbackEl.innerText = "";
  atualizarBotoes();
}

function atualizarBotoes(){
  btnProximo.disabled = !acertou;
  if(index === pares.length - 1){
    btnProximo.innerHTML = acertou ? "↻ Reiniciar" : "Próxima →";
  } else {
    btnProximo.innerHTML = "Próxima →";
  }
}

atualizar();
atualizarProgresso();

// Pequena observação: este exercício usa chaves de localStorage distintas
// (`desafio-auditivo-*`) para não conflitar com a versão infantil.

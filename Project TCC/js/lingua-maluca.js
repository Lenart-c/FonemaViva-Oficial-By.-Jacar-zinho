const exercicios = [
  { texto: 'Pá, pá, pá', alvo: ['pá', 'pa', 'pá', 'pá'] },
  { texto: 'Ta, ta, ta', alvo: ['ta', 'tá', 'ta', 'ta'] },
  { texto: 'Ca, ca, ca', alvo: ['ca', 'cá', 'ca', 'ca'] },
  { texto: 'Ba, ba, ba', alvo: ['ba', 'bá', 'ba', 'ba'] },
  { texto: 'Da, da, da', alvo: ['da', 'dá', 'da', 'da'] },
  { texto: 'Ma, ma, ma', alvo: ['ma', 'má', 'ma', 'ma'] }
];

let index = 0;
let acertos = 0;
let concluidos = new Array(exercicios.length).fill(false);

const elFrase = document.getElementById('frase');
const elInstrucao = document.getElementById('instrucao');
const elResultado = document.getElementById('resultado');
const elFeedback = document.getElementById('feedback');
const btnOuvir = document.getElementById('btn-ouvir');
const btnGravar = document.getElementById('btn-gravar');
const btnProximo = document.getElementById('btn-proximo');
const btnReiniciar = document.getElementById('btn-reiniciar');
const elProgresso = document.getElementById('progresso');
const elProgressoTxt = document.getElementById('progresso-texto');

function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '');
}

function atualizarBarra() {
  const total = exercicios.length;
  const porcento = Math.round((acertos / total) * 100);
  elProgresso.style.width = porcento + '%';
  elProgressoTxt.textContent = porcento + '%';
}

function salvar() {
  localStorage.setItem('lingua-maluca', JSON.stringify({ index, acertos, concluidos }));
}

function carregar() {
  const salvo = JSON.parse(localStorage.getItem('lingua-maluca'));
  if (salvo) {
    index = salvo.index || 0;
    acertos = salvo.acertos || 0;
    concluidos = salvo.concluidos || new Array(exercicios.length).fill(false);
  }
}

function definirExercicio() {
  const exercicio = exercicios[index];
  elFrase.textContent = exercicio.texto;
  elInstrucao.textContent = 'Repita a sequência com calma, mantendo a voz leve e contínua.';
  elResultado.textContent = '...';
  elFeedback.textContent = '';
  btnProximo.disabled = true;
  atualizarBarra();
  salvar();
}

function reproduzirExemplo(texto) {
  if (!window.speechSynthesis) {
    elFeedback.textContent = 'Seu navegador não suporta voz de exemplo.';
    return;
  }

  const utterance = new SpeechSynthesisUtterance(texto);
  utterance.lang = 'pt-BR';
  utterance.rate = 0.8;
  utterance.pitch = 1.2;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

function verificar(texto) {
  const normal = normalizar(texto);
  return exercicios[index].alvo.some((palavra) => normal.includes(normalizar(palavra)));
}

btnOuvir.addEventListener('click', () => {
  reproduzirExemplo(exercicios[index].texto);
  elFeedback.textContent = 'Ouça o exemplo e repita em seguida.';
});

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
  const recognition = new SpeechRecognition();
  recognition.lang = 'pt-BR';
  recognition.continuous = false;
  recognition.interimResults = false;

  btnGravar.addEventListener('click', () => {
    try {
      recognition.start();
      btnGravar.textContent = '🎙️ Ouvindo...';
      elFeedback.textContent = 'Repita: ' + exercicios[index].texto;
    } catch (error) {
      elFeedback.textContent = 'Não foi possível iniciar a gravação.';
    }
  });

  recognition.onresult = (evento) => {
    const texto = Array.from(evento.results)
      .map((resultado) => resultado[0].transcript)
      .join(' ');

    elResultado.textContent = texto.trim() || '...';

    if (verificar(texto)) {
      if (!concluidos[index]) {
        concluidos[index] = true;
        acertos++;
        atualizarBarra();
        salvar();
      }
      elFeedback.textContent = '✔ Muito bem! Sua articulação ficou boa.';
      btnProximo.disabled = false;
    } else {
      elFeedback.textContent = '❌ Tente repetir mais claramente.';
      btnProximo.disabled = true;
    }
  };

  recognition.onerror = () => {
    elFeedback.textContent = 'Não foi possível ouvir sua resposta.';
  };

  recognition.onend = () => {
    btnGravar.textContent = '🎤 Repetir';
  };
} else {
  btnGravar.disabled = true;
  btnGravar.textContent = '🎤 Indisponível';
  elFeedback.textContent = 'Seu navegador não suporta reconhecimento de voz.';
}

btnProximo.addEventListener('click', () => {
  if (index < exercicios.length - 1) {
    index++;
  } else {
    index = 0;
    acertos = 0;
    concluidos = new Array(exercicios.length).fill(false);
  }
  definirExercicio();
});

btnReiniciar.addEventListener('click', () => {
  index = 0;
  acertos = 0;
  concluidos = new Array(exercicios.length).fill(false);
  definirExercicio();
  elFeedback.textContent = 'Exercício reiniciado.';
});

carregar();
definirExercicio();

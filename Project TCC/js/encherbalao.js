const fases = [
  {
    titulo: 'Respire fundo',
    instrucao: 'Inspire pelo nariz por 4 segundos e solte o ar devagar.',
    alvo: ['pa', 'pá', 'papá', 'papa'],
    dica: 'Use uma saída de ar longa e estável.'
  },
  {
    titulo: 'Solte o som',
    instrucao: 'Repita “pá” enquanto o ar sai do corpo.',
    alvo: ['pa', 'pá', 'papá'],
    dica: 'Mantenha o som curto, claro e contínuo.'
  },
  {
    titulo: 'Fluxo estável',
    instrucao: 'Mantenha o som firme sem forçar a voz.',
    alvo: ['pa', 'pá', 'papa'],
    dica: 'A respiração deve parecer leve e controlada.'
  },
  {
    titulo: 'Controle final',
    instrucao: 'Feche o exercício com uma saída de ar calma.',
    alvo: ['pa', 'pá', 'papá'],
    dica: 'Finalize com uma respiração tranquila.'
  }
];

let index = 0;
let acertos = 0;
let concluidos = new Array(fases.length).fill(false);
let ativo = false;

const elFase = document.getElementById('fase');
const elInstrucao = document.getElementById('instrucao');
const elResultado = document.getElementById('resultado');
const elFeedback = document.getElementById('feedback');
const elBalao = document.getElementById('balao');
const btnIniciar = document.getElementById('btn-iniciar');
const btnGravar = document.getElementById('btn-gravar');
const btnProximo = document.getElementById('btn-proximo');
const btnReiniciar = document.getElementById('btn-reiniciar');
const elProgresso = document.getElementById('progresso');
const elProgressoTxt = document.getElementById('progresso-texto');
const cards = document.querySelectorAll('.step');

function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '');
}

function atualizarBarra() {
  const total = fases.length;
  const porcento = Math.round((acertos / total) * 100);
  elProgresso.style.width = porcento + '%';
  elProgressoTxt.textContent = porcento + '%';
}

function salvar() {
  localStorage.setItem('enchar-balao', JSON.stringify({ index, acertos, concluidos }));
}

function carregar() {
  const salvo = JSON.parse(localStorage.getItem('enchar-balao'));
  if (salvo) {
    index = salvo.index || 0;
    acertos = salvo.acertos || 0;
    concluidos = salvo.concluidos || new Array(fases.length).fill(false);
  }
}

function definirFase() {
  const fase = fases[index];
  elFase.textContent = fase.titulo;
  elInstrucao.textContent = fase.instrucao;
  elResultado.textContent = '...';
  elFeedback.textContent = '';
  btnProximo.disabled = true;
  ativo = false;

  const escalado = 0.95 + index * 0.08;
  elBalao.style.transform = `scale(${escalado})`;
  elBalao.style.filter = index === fases.length - 1 ? 'brightness(1.05)' : 'brightness(1)';

  cards.forEach((card, i) => {
    card.classList.toggle('active', i === index);
  });

  atualizarBarra();
  salvar();
}

function verificar(texto) {
  const normal = normalizar(texto);
  return fases[index].alvo.some((palavra) => normal.includes(normalizar(palavra)));
}

function animarBalao() {
  elBalao.style.transform = 'scale(1.12)';
  elBalao.style.filter = 'brightness(1.08)';

  setTimeout(() => {
    elBalao.style.transform = `scale(${0.95 + index * 0.08})`;
    elBalao.style.filter = 'brightness(1)';
  }, 700);
}

btnIniciar.addEventListener('click', () => {
  animarBalao();
  elFeedback.textContent = 'Respire com calma e depois grave o som.';
  ativo = true;
});

btnReiniciar.addEventListener('click', () => {
  index = 0;
  acertos = 0;
  concluidos = new Array(fases.length).fill(false);
  definirFase();
  elFeedback.textContent = 'Exercício reiniciado.';
});

btnProximo.addEventListener('click', () => {
  if (index < fases.length - 1) {
    index++;
    definirFase();
  } else {
    index = 0;
    definirFase();
  }
});

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
  const recognition = new SpeechRecognition();
  recognition.lang = 'pt-BR';
  recognition.continuous = false;
  recognition.interimResults = false;

  btnGravar.addEventListener('click', () => {
    if (!ativo) {
      elFeedback.textContent = 'Toque em “Começar exercício” antes de gravar.';
      return;
    }

    recognition.start();
    btnGravar.textContent = '🎙️ Gravação...';
    elFeedback.textContent = 'Fale: ' + fases[index].alvo.join(' ou ');
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

      elFeedback.textContent = '✔ Muito bem! O fluxo de ar ficou controlado.';
      btnProximo.disabled = false;
    } else {
      elFeedback.textContent = '❌ Tente mais uma vez com um som mais leve e contínuo.';
      btnProximo.disabled = true;
    }
  };

  recognition.onerror = () => {
    elFeedback.textContent = 'Não foi possível capturar o áudio. Tente novamente.';
  };

  recognition.onend = () => {
    btnGravar.textContent = '🎤 Gravar som';
  };
} else {
  btnGravar.disabled = true;
  btnGravar.textContent = '🎤 Mic indisponível';
  elFeedback.textContent = 'Seu navegador não suporta reconhecimento de voz.';
}

carregar();
definirFase();

const animais = [
  { nome: 'Cachorro', id: 'dog', palavras: ['cachorro', 'cao', 'cão', 'dog'] },
  { nome: 'Gato', id: 'cat', palavras: ['gato', 'cat'] },
  { nome: 'Vaca', id: 'cow', palavras: ['vaca', 'cow'] },
  { nome: 'Pato', id: 'duck', palavras: ['pato', 'duck'] },
  { nome: 'Sapo', id: 'frog', palavras: ['sapo', 'frog'] },
  { nome: 'Leão', id: 'lion', palavras: ['leao', 'leão', 'lion'] },
  { nome: 'Pássaro', id: 'bird', palavras: ['passaro', 'pássaro', 'bird', 'ave'] },
  { nome: 'Ovelha', id: 'sheep', palavras: ['ovelha', 'sheep'] }
];

let index = 0;
let acertos = 0;
let concluidos = new Array(animais.length).fill(false);
let audioContext = null;

const elAnimal = document.getElementById('animal-atual');
const elInstrucao = document.getElementById('instrucao');
const elResultado = document.getElementById('resultado');
const elFeedback = document.getElementById('feedback');
const btnOuvir = document.getElementById('btn-ouvir');
const btnFalar = document.getElementById('btn-falar');
const btnProximo = document.getElementById('btn-proximo');
const btnReiniciar = document.getElementById('btn-reiniciar');
const elProgresso = document.getElementById('progresso');
const elProgressoTxt = document.getElementById('progresso-texto');

const elementos = {
  elAnimal,
  elInstrucao,
  elResultado,
  elFeedback,
  btnOuvir,
  btnFalar,
  btnProximo,
  btnReiniciar,
  elProgresso,
  elProgressoTxt
};

const todosOsElementos = Object.values(elementos).every(Boolean);

if (!todosOsElementos) {
  throw new Error('Alguns elementos da página não foram encontrados.');
}

function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '');
}

function atualizarBarra() {
  const total = animais.length;
  const porcento = Math.round((acertos / total) * 100);
  elProgresso.style.width = porcento + '%';
  elProgressoTxt.textContent = porcento + '%';
}

function salvar() {
  localStorage.setItem('qual-e-esse-som', JSON.stringify({ index, acertos, concluidos }));
}

function carregar() {
  const salvo = JSON.parse(localStorage.getItem('qual-e-esse-som'));
  if (salvo) {
    index = salvo.index || 0;
    acertos = salvo.acertos || 0;
    concluidos = salvo.concluidos || new Array(animais.length).fill(false);
  }
}

function definirFase() {
  const animal = animais[index];
  elAnimal.textContent = animal.nome;
  elInstrucao.textContent = 'Ouça com atenção e depois fale o nome do animal.';
  elResultado.textContent = '...';
  elFeedback.textContent = '';
  btnProximo.disabled = true;
  atualizarBarra();
  salvar();
}

function ensureAudioContext() {
  if (!window.AudioContext && !window.webkitAudioContext) {
    return null;
  }

  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  return audioContext;
}

async function playAnimalSound(animal) {
  const ctx = ensureAudioContext();

  if (!ctx) {
    throw new Error('Web Audio API não suportada neste navegador.');
  }

  if (ctx.state === 'suspended') {
    await ctx.resume();
  }

  const now = ctx.currentTime;
  const master = ctx.createGain();
  master.gain.setValueAtTime(0.0001, now);
  master.gain.exponentialRampToValueAtTime(0.3, now + 0.02);
  master.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);
  master.connect(ctx.destination);

  const createTone = (freq, type, duration, volume, delay = 0) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now + delay);
    gain.gain.setValueAtTime(0.0001, now + delay);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.02 + delay);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration + delay);

    osc.connect(gain);
    gain.connect(master);

    osc.start(now + delay);
    osc.stop(now + duration + delay);
  };

  const createNoiseBurst = (duration, volume, delay = 0) => {
    const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 2);
    }

    const source = ctx.createBufferSource();
    const gain = ctx.createGain();

    source.buffer = buffer;
    gain.gain.setValueAtTime(0.0001, now + delay);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.01 + delay);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration + delay);

    source.connect(gain);
    gain.connect(master);

    source.start(now + delay);
    source.stop(now + duration + delay);
  };

  if (animal.id === 'dog') {
    createTone(700, 'triangle', 0.22, 0.18, 0);
    createTone(920, 'sawtooth', 0.18, 0.12, 0.16);
    createTone(650, 'triangle', 0.24, 0.16, 0.34);
    createNoiseBurst(0.18, 0.04, 0.05);
  } else if (animal.id === 'cat') {
    createTone(1300, 'sine', 0.26, 0.12, 0);
    createTone(1600, 'sine', 0.22, 0.08, 0.14);
    createTone(1450, 'sine', 0.18, 0.05, 0.29);
  } else if (animal.id === 'cow') {
    createTone(180, 'sine', 0.6, 0.18, 0);
    createTone(150, 'triangle', 0.5, 0.14, 0.1);
    createNoiseBurst(0.18, 0.03, 0.35);
  } else if (animal.id === 'duck') {
    createTone(580, 'square', 0.16, 0.16, 0);
    createTone(760, 'square', 0.14, 0.12, 0.16);
    createTone(640, 'square', 0.15, 0.1, 0.3);
  } else if (animal.id === 'frog') {
    createTone(320, 'triangle', 0.16, 0.14, 0);
    createTone(290, 'triangle', 0.14, 0.1, 0.18);
    createTone(260, 'triangle', 0.16, 0.08, 0.34);
  } else if (animal.id === 'lion') {
    createTone(200, 'sawtooth', 0.5, 0.2, 0);
    createTone(240, 'sawtooth', 0.46, 0.16, 0.12);
    createNoiseBurst(0.28, 0.05, 0.08);
  } else if (animal.id === 'bird') {
    createTone(980, 'square', 0.12, 0.12, 0);
    createTone(1180, 'square', 0.1, 0.1, 0.1);
    createTone(1080, 'square', 0.12, 0.08, 0.2);
  } else if (animal.id === 'sheep') {
    createTone(300, 'sine', 0.34, 0.14, 0);
    createTone(270, 'sine', 0.3, 0.1, 0.12);
    createTone(245, 'sine', 0.28, 0.08, 0.24);
  }
}

function verificar(texto) {
  const normal = normalizar(texto);
  const animal = animais[index];
  return animal.palavras.some((palavra) => normal.includes(normalizar(palavra)));
}

btnOuvir.addEventListener('click', async () => {
  try {
    await playAnimalSound(animais[index]);
    elFeedback.textContent = `Ouça o som do ${animais[index].nome.toLowerCase()}.`;
  } catch (error) {
    elFeedback.textContent = 'Não foi possível reproduzir o som.';
  }
});

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
  const recognition = new SpeechRecognition();
  recognition.lang = 'pt-BR';
  recognition.continuous = false;
  recognition.interimResults = false;

  btnFalar.addEventListener('click', () => {
    try {
      recognition.start();
      btnFalar.textContent = '🎙️ Ouvindo...';
      elFeedback.textContent = 'Fale o nome do animal.';
    } catch (error) {
      btnFalar.textContent = '🎤 Responder';
      elFeedback.textContent = 'Não foi possível iniciar a gravação de voz.';
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
      elFeedback.textContent = '✔ Muito bem! Você acertou.';
      btnProximo.disabled = false;
    } else {
      elFeedback.textContent = '❌ Tente novamente. Ouça o som mais uma vez.';
      btnProximo.disabled = true;
    }
  };

  recognition.onerror = () => {
    elFeedback.textContent = 'Não foi possível ouvir sua resposta. Tente novamente.';
  };

  recognition.onend = () => {
    btnFalar.textContent = '🎤 Responder';
  };
} else {
  btnFalar.disabled = true;
  btnFalar.textContent = '🎤 Indisponível';
  elFeedback.textContent = 'Seu navegador não suporta reconhecimento de voz.';
}

btnProximo.addEventListener('click', () => {
  if (index < animais.length - 1) {
    index++;
  } else {
    index = 0;
    acertos = 0;
    concluidos = new Array(animais.length).fill(false);
  }
  definirFase();
});

btnReiniciar.addEventListener('click', () => {
  index = 0;
  acertos = 0;
  concluidos = new Array(animais.length).fill(false);
  definirFase();
  elFeedback.textContent = 'Exercício reiniciado.';
});

carregar();
definirFase();

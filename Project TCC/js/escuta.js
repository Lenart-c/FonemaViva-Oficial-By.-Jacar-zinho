const exercicios = [
  { palavra: 'andar', aceitos: ['andar', 'caminhar'], dica: 'Ouça o som de passos lentos.' },
  { palavra: 'correr', aceitos: ['correr', 'corre'], dica: 'Ouça o som de passos rápidos.' },
  { palavra: 'pular', aceitos: ['pular', 'pula'], dica: 'Ouça o som de saltos.' },
  { palavra: 'nadar', aceitos: ['nadar', 'nado'], dica: 'Ouça o som de água.' },
  { palavra: 'voar', aceitos: ['voar', 'voa'], dica: 'Ouça o som de um movimento no ar.' }
];

let index = 0;
let acertos = 0;
let escutando = false;

const elFase = document.getElementById('fase');
const elInstrucao = document.getElementById('instrucao');
const elResultado = document.getElementById('resultado');
const elFeedback = document.getElementById('feedback');
const btnOuvir = document.getElementById('btn-ouvir');
const btnFalar = document.getElementById('btn-falar');
const btnProximo = document.getElementById('btn-proximo');
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
  const porcento = Math.round((acertos / exercicios.length) * 100);
  elProgresso.style.width = porcento + '%';
  elProgressoTxt.textContent = porcento + '%';
}

function mostrarExercicio() {
  const exercicio = exercicios[index];
  elFase.textContent = 'Ouça e repita';
  elInstrucao.textContent = `Ouça o som de ${exercicio.palavra} e diga o nome.`;
  elResultado.textContent = '...';
  elFeedback.textContent = exercicio.dica;
  btnProximo.disabled = true;
  escutando = false;
  atualizarBarra();
}

function falarTexto(texto) {
  if (!('speechSynthesis' in window)) {
    return;
  }

  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(texto);
  utter.lang = 'pt-BR';
  utter.rate = 0.95;
  utter.pitch = 1;
  window.speechSynthesis.speak(utter);
}

function criarSom(exercicio) {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) {
    return;
  }

  const ctx = new AudioCtx();
  const now = ctx.currentTime;
  const gainNode = ctx.createGain();
  gainNode.connect(ctx.destination);
  gainNode.gain.setValueAtTime(0.0001, now);
  gainNode.gain.exponentialRampToValueAtTime(0.06, now + 0.02);

  if (exercicio.palavra === 'andar') {
    [220, 260, 300, 340].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const localGain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.16);
      localGain.gain.setValueAtTime(0.03, now + i * 0.16);
      localGain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.16 + 0.14);
      osc.connect(localGain);
      localGain.connect(gainNode);
      osc.start(now + i * 0.16);
      osc.stop(now + i * 0.16 + 0.14);
    });
  } else if (exercicio.palavra === 'correr') {
    [320, 360, 400, 440, 480].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const localGain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, now + i * 0.08);
      localGain.gain.setValueAtTime(0.025, now + i * 0.08);
      localGain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 0.08);
      osc.connect(localGain);
      localGain.connect(gainNode);
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.08);
    });
  } else if (exercicio.palavra === 'pular') {
    [260, 390].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const localGain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.18);
      localGain.gain.setValueAtTime(0.04, now + i * 0.18);
      localGain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.18 + 0.2);
      osc.connect(localGain);
      localGain.connect(gainNode);
      osc.start(now + i * 0.18);
      osc.stop(now + i * 0.18 + 0.2);
    });
  } else if (exercicio.palavra === 'nadar') {
    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.8, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.15;
    }
    const noise = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    noise.buffer = noiseBuffer;
    noise.loop = true;
    filter.type = 'lowpass';
    filter.frequency.value = 600;
    noise.connect(filter);
    filter.connect(gainNode);
    noise.start(now);
    noise.stop(now + 0.75);
  } else if (exercicio.palavra === 'voar') {
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const localGain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.linearRampToValueAtTime(420, now + 0.7);
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(180, now);
    localGain.gain.setValueAtTime(0.03, now);
    localGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);
    osc.connect(filter);
    filter.connect(localGain);
    localGain.connect(gainNode);
    osc.start(now);
    osc.stop(now + 0.7);
  }

  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);
}

function ouvirExercicio() {
  const exercicio = exercicios[index];
  criarSom(exercicio);
  falarTexto(exercicio.palavra);
  elFeedback.textContent = `Ouça atentamente: ${exercicio.palavra}`;
  escutando = true;
}

function proximoExercicio() {
  index = (index + 1) % exercicios.length;
  mostrarExercicio();
}

btnOuvir.addEventListener('click', ouvirExercicio);

btnProximo.addEventListener('click', () => {
  proximoExercicio();
});

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
  const recognition = new SpeechRecognition();
  recognition.lang = 'pt-BR';
  recognition.continuous = false;
  recognition.interimResults = false;

  btnFalar.addEventListener('click', () => {
    if (!escutando) {
      elFeedback.textContent = 'Primeiro clique em ouvir para escutar a locomoção.';
      return;
    }

    recognition.start();
    btnFalar.textContent = '🎙️ Ouvindo...';
    elFeedback.textContent = 'Diga o nome da locomoção em voz alta.';
  });

  recognition.onresult = (evento) => {
    const texto = Array.from(evento.results)
      .map((resultado) => resultado[0].transcript)
      .join(' ');

    elResultado.textContent = texto.trim() || '...';

    const exercicio = exercicios[index];
    const acerto = exercicio.aceitos.some((palavra) => normalizar(texto).includes(normalizar(palavra)));

    if (acerto) {
      if (acertos < exercicios.length) {
        acertos++;
      }
      atualizarBarra();
      elFeedback.textContent = '✔ Muito bem! Você reconheceu a locomoção.';
      btnProximo.disabled = false;
    } else {
      elFeedback.textContent = '😅 Tente outra vez. Pense no som e diga o nome da locomoção.';
      btnProximo.disabled = true;
    }
  };

  recognition.onerror = () => {
    elFeedback.textContent = 'Não consegui ouvir você. Tente novamente.';
  };

  recognition.onend = () => {
    btnFalar.textContent = '🎤 Falar';
  };
} else {
  btnFalar.disabled = true;
  btnFalar.textContent = '🎤 Indisponível';
  elFeedback.textContent = 'Seu navegador não suporta reconhecimento de voz.';
}

mostrarExercicio();

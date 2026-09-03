const desafios = [
  { titulo: 'Respire e solte', instrucao: 'Inspire pelo nariz, solte o ar devagar e repita um som leve.', alvo: ['pa', 'pá', 'papá'], classe: 'grow' },
  { titulo: 'Fluxo firme', instrucao: 'Mantenha o ar saindo de forma contínua.', alvo: ['fa', 'fá', 'fafa'], classe: 'grow' },
  { titulo: 'Ar controlado', instrucao: 'Aumente a bolha com um sopro constante.', alvo: ['sa', 'sá', 'sasa'], classe: 'grow' },
  { titulo: 'Encerramento', instrucao: 'Solte o ar com calma e termine o som.', alvo: ['ha', 'há', 'haha'], classe: 'shrink' }
];

let index = 0;
let acertos = 0;
let concluidos = new Array(desafios.length).fill(false);

const elTitulo = document.getElementById('titulo');
const elInstrucao = document.getElementById('instrucao');
const elResultado = document.getElementById('resultado');
const elFeedback = document.getElementById('feedback');
const elBolha = document.getElementById('bolha');
const btnIniciar = document.getElementById('btn-iniciar');
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
  const total = desafios.length;
  const porcento = Math.round((acertos / total) * 100);
  elProgresso.style.width = porcento + '%';
  elProgressoTxt.textContent = porcento + '%';
}

function salvar() {
  localStorage.setItem('bolha-imaginaria', JSON.stringify({ index, acertos, concluidos }));
}

function carregar() {
  const salvo = JSON.parse(localStorage.getItem('bolha-imaginaria'));
  if (salvo) {
    index = salvo.index || 0;
    acertos = salvo.acertos || 0;
    concluidos = salvo.concluidos || new Array(desafios.length).fill(false);
  }
}

function definirDesafio() {
  const desafio = desafios[index];
  elTitulo.textContent = desafio.titulo;
  elInstrucao.textContent = desafio.instrucao;
  elResultado.textContent = '...';
  elFeedback.textContent = '';
  elBolha.className = 'bubble ' + desafio.classe;
  btnProximo.disabled = true;
  atualizarBarra();
  salvar();
}

function verificar(texto) {
  const normal = normalizar(texto);
  return desafios[index].alvo.some((palavra) => normal.includes(normalizar(palavra)));
}

btnIniciar.addEventListener('click', () => {
  elBolha.classList.add('grow');
  elFeedback.textContent = 'Respire devagar e depois faça o som.';
  setTimeout(() => {
    elBolha.classList.remove('grow');
  }, 800);
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
      elFeedback.textContent = 'Repita o som com ar controlado.';
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
      elFeedback.textContent = '✔ Muito bem! O fluxo de ar ficou controlado.';
      btnProximo.disabled = false;
    } else {
      elFeedback.textContent = '❌ Tente com um som mais contínuo.';
      btnProximo.disabled = true;
    }
  };

  recognition.onerror = () => {
    elFeedback.textContent = 'Não foi possível ouvir sua resposta.';
  };

  recognition.onend = () => {
    btnGravar.textContent = '🎤 Fazer som';
  };
} else {
  btnGravar.disabled = true;
  btnGravar.textContent = '🎤 Indisponível';
  elFeedback.textContent = 'Seu navegador não suporta reconhecimento de voz.';
}

btnProximo.addEventListener('click', () => {
  if (index < desafios.length - 1) {
    index++;
  } else {
    index = 0;
    acertos = 0;
    concluidos = new Array(desafios.length).fill(false);
  }
  definirDesafio();
});

btnReiniciar.addEventListener('click', () => {
  index = 0;
  acertos = 0;
  concluidos = new Array(desafios.length).fill(false);
  definirDesafio();
  elFeedback.textContent = 'Exercício reiniciado.';
});

carregar();
definirDesafio();

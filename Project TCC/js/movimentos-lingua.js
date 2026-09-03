const desafios = [
  { titulo: 'Sorriso largo', instrucao: 'Faça uma careta alegre e repita o som com a boca aberta.', alvo: ['ah', 'a', 'aa'], classe: 'smile' },
  { titulo: 'Boca redonda', instrucao: 'Abra bem a boca e faça um som arredondado.', alvo: ['o', 'oh', 'oo'], classe: 'big' },
  { titulo: 'Boca aberta', instrucao: 'Mantenha a boca aberta e pronuncie com clareza.', alvo: ['e', 'eh', 'ee'], classe: 'open' },
  { titulo: 'Expressão surpresa', instrucao: 'Levante as sobrancelhas e diga um som firme.', alvo: ['i', 'ih', 'ii'], classe: 'smile' }
];

let index = 0;
let acertos = 0;
let concluidos = new Array(desafios.length).fill(false);

const elTitulo = document.getElementById('titulo');
const elInstrucao = document.getElementById('instrucao');
const elResultado = document.getElementById('resultado');
const elFeedback = document.getElementById('feedback');
const elFace = document.getElementById('face');
const btnVer = document.getElementById('btn-ver');
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
  localStorage.setItem('caretas-no-espelho', JSON.stringify({ index, acertos, concluidos }));
}

function carregar() {
  const salvo = JSON.parse(localStorage.getItem('caretas-no-espelho'));
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
  elFace.className = 'face ' + desafio.classe;
  btnProximo.disabled = true;
  atualizarBarra();
  salvar();
}

function verificar(texto) {
  const normal = normalizar(texto);
  return desafios[index].alvo.some((palavra) => normal.includes(normalizar(palavra)));
}

btnVer.addEventListener('click', () => {
  definirDesafio();
  elFeedback.textContent = 'Olhe para a face e siga o desafio.';
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
      elFeedback.textContent = 'Repita o som do desafio.';
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
      elFeedback.textContent = '✔ Muito bem! Sua coordenação ficou boa.';
      btnProximo.disabled = false;
    } else {
      elFeedback.textContent = '❌ Tente repetir com mais clareza e expressão.';
      btnProximo.disabled = true;
    }
  };

  recognition.onerror = () => {
    elFeedback.textContent = 'Não foi possível ouvir sua resposta.';
  };

  recognition.onend = () => {
    btnGravar.textContent = '🎤 Repetir som';
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

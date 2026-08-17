const desafios = [
  {
    titulo: 'Sorriso largo',
    instrucao: 'Faça uma careta alegre e pronuncie o som "AH" com a boca bem aberta.',
    alvo: ['ah', 'a', 'aa', 'aaa'],
    classe: 'smile',
    dica: '👀 Sorria bem aberto!'
  },
  {
    titulo: 'Boca redonda',
    instrucao: 'Arredonde bem a boca e pronuncie o som "O" com convicção.',
    alvo: ['o', 'oh', 'oo', 'ooo'],
    classe: 'big',
    dica: '😮 Faça um círculo com a boca!'
  },
  {
    titulo: 'Boca aberta para "E"',
    instrucao: 'Abra bem a boca em linha reta e pronuncie o som "E" com clareza.',
    alvo: ['e', 'eh', 'ee', 'eee'],
    classe: 'open',
    dica: '😬 Puxe a boca para os lados!'
  },
  {
    titulo: 'Expressão de surpresa',
    instrucao: 'Levante as sobrancelhas, abra a boca em círculo e diga "I" ou "UH".',
    alvo: ['i', 'ih', 'ii', 'iii', 'u', 'uh', 'uu', 'uuu'],
    classe: 'surprised',
    dica: '😲 Expressão bem surpreso!'
  }
];

let index = 0;
let acertos = 0;
let tentativas = 0;
let concluidos = new Array(desafios.length).fill(false);
let history = [];

// Elementos DOM
const elTitulo = document.getElementById('titulo');
const elInstrucao = document.getElementById('instrucao');
const elResultado = document.getElementById('resultado');
const elFeedback = document.getElementById('feedback');
const elFace = document.getElementById('face');
const elTongue = document.getElementById('tongue');
const elFaceHint = document.getElementById('face-hint');
const elExNumero = document.getElementById('ex-numero');
const elFeedbackBox = document.getElementById('feedback-box');
const elAttemptsInfo = document.getElementById('attempts-info');
const elStarsDisplay = document.getElementById('stars-display');

const btnVer = document.getElementById('btn-ver');
const btnGravar = document.getElementById('btn-gravar');
const btnProximo = document.getElementById('btn-proximo');
const btnReiniciar = document.getElementById('btn-reiniciar');
const elProgresso = document.getElementById('progresso');
const elProgressoTxt = document.getElementById('progresso-texto');

// Funções auxiliares
function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '')
    .trim();
}

function calcularPorcentagem() {
  return Math.round((acertos / desafios.length) * 100);
}

function atualizarBarra() {
  const total = desafios.length;
  const porcento = calcularPorcentagem();
  elProgresso.style.width = porcento + '%';
  elProgressoTxt.textContent = acertos + '/' + total;
  atualizarEstrelas();
}

function atualizarEstrelas() {
  const porcento = calcularPorcentagem();
  let stars = '';
  
  if (porcento >= 100) stars = '⭐⭐⭐⭐';
  else if (porcento >= 75) stars = '⭐⭐⭐';
  else if (porcento >= 50) stars = '⭐⭐';
  else if (porcento >= 25) stars = '⭐';
  
  elStarsDisplay.textContent = stars;
}

function salvar() {
  localStorage.setItem('caretas-no-espelho', JSON.stringify({
    index,
    acertos,
    concluidos,
    history
  }));
}

function carregar() {
  const salvo = JSON.parse(localStorage.getItem('caretas-no-espelho'));
  if (salvo) {
    index = salvo.index || 0;
    acertos = salvo.acertos || 0;
    concluidos = salvo.concluidos || new Array(desafios.length).fill(false);
    history = salvo.history || [];
  }
}

function animarFace() {
  elFace.classList.remove('success');
  void elFace.offsetWidth; // Trigger reflow
  elFace.classList.add('success');
}

function definirDesafio() {
  const desafio = desafios[index];
  tentativas = 0;
  
  elTitulo.textContent = desafio.titulo;
  elInstrucao.textContent = desafio.instrucao;
  elExNumero.textContent = index + 1;
  elFaceHint.textContent = desafio.dica;
  elResultado.textContent = '...';
  elFeedback.textContent = '';
  elFeedbackBox.style.display = 'none';
  elAttemptsInfo.textContent = '';
  
  elFace.className = 'face ' + desafio.classe;
  btnProximo.disabled = true;
  btnVer.textContent = '👀 Ver expressão';
  
  atualizarBarra();
  salvar();
}

function verificar(texto) {
  const normal = normalizar(texto);
  if (!normal) return false;
  
  return desafios[index].alvo.some((palavra) => {
    const normPalavra = normalizar(palavra);
    return normal.includes(normPalavra) || normPalavra.includes(normal);
  });
}

function mostrarFeedback(tipo, mensagem) {
  elFeedback.classList.remove('success', 'error', 'info');
  elFeedback.classList.add(tipo);
  elFeedback.textContent = mensagem;
  
  if (tipo === 'success') {
    animarFace();
  }
}

// Event Listeners
btnVer.addEventListener('click', () => {
  definirDesafio();
  mostrarFeedback('info', '👁️ Olhe bem para a expressão. Tente fazer a mesma!');
  btnVer.textContent = '✓ Expressão preparada';
  btnVer.disabled = true;
  setTimeout(() => {
    btnVer.disabled = false;
    btnVer.textContent = '👀 Ver expressão';
  }, 2000);
});

// Speech Recognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
  const recognition = new SpeechRecognition();
  recognition.lang = 'pt-BR';
  recognition.continuous = false;
  recognition.interimResults = false;

  btnGravar.addEventListener('click', () => {
    try {
      tentativas++;
      elFeedbackBox.style.display = 'none';
      elFeedback.textContent = '';
      recognition.start();
      btnGravar.textContent = '🎙️ Ouvindo...';
      btnGravar.disabled = true;
      mostrarFeedback('info', '🗣️ Fale agora! Repita o som com clareza...');
    } catch (error) {
      mostrarFeedback('error', '❌ Não foi possível iniciar a gravação.');
    }
  });

  recognition.onresult = (evento) => {
    const texto = Array.from(evento.results)
      .map((resultado) => resultado[0].transcript)
      .join(' ');

    elResultado.textContent = '"' + texto.trim() + '"' || '...';
    elFeedbackBox.style.display = 'block';
    elAttemptsInfo.textContent = `Tentativa ${tentativas}`;

    if (verificar(texto)) {
      if (!concluidos[index]) {
        concluidos[index] = true;
        acertos++;
        atualizarBarra();
        salvar();
      }
      
      const mensagens = [
        '✨ Excelente! Muito bem!',
        '🎉 Perfeito! Coordenação ótima!',
        '👏 Ótimo! Sua dicção ficou clara!',
        '🌟 Muito bom! Continue assim!'
      ];
      const msg = mensagens[Math.floor(Math.random() * mensagens.length)];
      mostrarFeedback('success', msg);
      
      btnProximo.disabled = false;
      elAttemptsInfo.textContent += ' ✓ Sucesso!';
    } else {
      const mensagens = [
        '🔄 Quase lá! Tente com mais expressão.',
        '💪 Pode tentar novamente com mais clareza.',
        '👂 Não ouvi bem. Fale mais alto e claro!',
        '😊 Tente repetir focando na expressão.'
      ];
      const msg = mensagens[Math.floor(Math.random() * mensagens.length)];
      mostrarFeedback('error', msg);
      
      elAttemptsInfo.textContent += ' (continue tentando)';
    }
  };

  recognition.onerror = () => {
    mostrarFeedback('error', '🎤 Não foi possível ouvir. Tente novamente.');
  };

  recognition.onend = () => {
    btnGravar.textContent = '🎤 Gravar voz';
    btnGravar.disabled = false;
  };
} else {
  btnGravar.disabled = true;
  btnGravar.textContent = '🎤 Indisponível';
  mostrarFeedback('error', '⚠️ Seu navegador não suporta reconhecimento de voz.');
}

btnProximo.addEventListener('click', () => {
  if (index < desafios.length - 1) {
    index++;
    definirDesafio();
  } else {
    // Finalizar exercício
    const percentual = calcularPorcentagem();
    let mensagemFinal = '';
    
    if (percentual === 100) {
      mensagemFinal = '🏆 PARABÉNS! Você acertou todos os desafios!';
    } else if (percentual >= 75) {
      mensagemFinal = '⭐ Excelente! Muito bom desempenho!';
    } else if (percentual >= 50) {
      mensagemFinal = '👍 Bom trabalho! Continue praticando.';
    } else {
      mensagemFinal = '💪 Ótimo começo! Pratique mais um pouco.';
    }
    
    elTitulo.textContent = 'Parabéns!';
    elInstrucao.textContent = mensagemFinal;
    elFeedback.textContent = `Você completou ${acertos} de ${desafios.length} desafios!`;
    elFace.className = 'face smile';
    animarFace();
    
    btnProximo.textContent = '🔄 Fazer novamente';
    btnProximo.disabled = false;
    btnProximo.onclick = () => {
      index = 0;
      acertos = 0;
      concluidos = new Array(desafios.length).fill(false);
      definirDesafio();
      btnProximo.onclick = null;
    };
  }
});

btnReiniciar.addEventListener('click', () => {
  index = 0;
  acertos = 0;
  concluidos = new Array(desafios.length).fill(false);
  definirDesafio();
  btnProximo.onclick = null;
  mostrarFeedback('info', '🔄 Exercício reiniciado. Boa sorte!');
});

// Inicializar
carregar();
definirDesafio();

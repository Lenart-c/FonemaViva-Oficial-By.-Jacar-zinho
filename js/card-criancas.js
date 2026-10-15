const cartoes = [
  {
    tema: 'Pato dançarino',
    frase: 'O pato Paco pula na poça.',
    silabas: 'pa-to • pa-co • pu-la • po-ça',
    palavrasChave: ['pato', 'paco', 'pula', 'poca'],
    missao: 'Fale a frase e faça os gestos como se o pato estivesse dançando.',
    gestos: ['Bata palmas', 'Toque os ombros', 'Bata palmas']
  },
  {
    tema: 'Macaco malabarista',
    frase: 'Mimi, o macaco, mexe a melancia.',
    silabas: 'mi-mi • ma-ca-co • me-xe • me-lan-ci-a',
    palavrasChave: ['mimi', 'macaco', 'mexe', 'melancia'],
    missao: 'Fale a frase e acompanhe cada gesto sem perder a ordem.',
    gestos: ['Toque os joelhos', 'Bata palmas', 'Toque a cabeça']
  },
  {
    tema: 'Robô dançante',
    frase: 'Rita robô rodopia e ri.',
    silabas: 'ri-ta • ro-bô • ro-do-pi-a • ri',
    palavrasChave: ['rita', 'robo', 'rodopia'],
    missao: 'Fale como um robô divertido e faça os movimentos na sequência.',
    gestos: ['Braços para cima', 'Bata palmas', 'Braços para os lados']
  },
  {
    tema: 'Sapo saltitante',
    frase: 'Sissi, a sapinha, salta seis vezes.',
    silabas: 'sis-si • sa-pi-nha • sal-ta • seis • ve-zes',
    palavrasChave: ['sissi', 'sapinha', 'salta', 'seis', 'vezes'],
    missao: 'Fale a frase devagar e faça os gestos como uma sapinha.',
    gestos: ['Toque os pés', 'Bata palmas', 'Toque os joelhos']
  },
  {
    tema: 'Trem do tatu',
    frase: 'O tatu Tito toca o tambor do trem.',
    silabas: 'ta-tu • ti-to • to-ca • tam-bor • trem',
    palavrasChave: ['tatu', 'tito', 'toca', 'tambor', 'trem'],
    missao: 'Fale a frase e marque o ritmo do trem com os gestos.',
    gestos: ['Toque o ombro esquerdo', 'Toque o ombro direito', 'Bata palmas']
  },
  {
    tema: 'Bruxa da pipoca',
    frase: 'A bruxa Bibi brinca com bolhas.',
    silabas: 'bru-xa • bi-bi • brin-ca • bo-lhas',
    palavrasChave: ['bruxa', 'bibi', 'brinca', 'bolhas'],
    missao: 'Fale a frase com voz de brincadeira e siga a sequência.',
    gestos: ['Bata palmas', 'Faça um coração com as mãos', 'Bata palmas']
  },
  {
    tema: 'Dragão do doce',
    frase: 'Duda, o dragão, divide doces dourados.',
    silabas: 'du-da • dra-gão • di-vi-de • do-ces • dou-ra-dos',
    palavrasChave: ['duda', 'dragao', 'divide', 'doces', 'dourados'],
    missao: 'Fale sem correr e faça os gestos como um dragão gentil.',
    gestos: ['Braços abertos', 'Toque os joelhos', 'Bata palmas']
  },
  {
    tema: 'Final da festa',
    frase: 'Lola, o leão, lambe limonada gelada.',
    silabas: 'lo-la • le-ão • lam-be • li-mo-na-da • ge-la-da',
    palavrasChave: ['lola', 'leao', 'lambe', 'limonada', 'gelada'],
    missao: 'Fale a frase e complete a última sequência de movimentos.',
    gestos: ['Toque a cabeça', 'Bata palmas', 'Erga os braços']
  }
];

const CHAVE_PROGRESSO = 'cartoes-movimentos-infantis';
const ReconhecimentoDeFala = window.SpeechRecognition || window.webkitSpeechRecognition;

const elementos = {
  progressTrack: document.getElementById('progress-track'),
  progressFill: document.getElementById('progress-fill'),
  cardCount: document.getElementById('card-count'),
  cardStack: document.getElementById('card-stack'),
  currentCard: document.getElementById('current-card'),
  nextCard: document.getElementById('next-card'),
  cardTheme: document.getElementById('card-theme'),
  cardPhrase: document.getElementById('card-phrase'),
  cardSyllables: document.getElementById('card-syllables'),
  cardMission: document.getElementById('card-mission'),
  gestureCue: document.getElementById('gesture-cue'),
  gestureProgress: document.getElementById('gesture-progress'),
  listenButton: document.getElementById('listen-button'),
  speakButton: document.getElementById('speak-button'),
  selfCheckButton: document.getElementById('self-check-button'),
  feedback: document.getElementById('feedback'),
  gestureButton: document.getElementById('gesture-button'),
  gestureButtonText: document.getElementById('gesture-button-text'),
  restartGesturesButton: document.getElementById('restart-gestures'),
  recognizedBox: document.getElementById('recognized-box'),
  recognizedText: document.getElementById('recognized-text'),
  nextButton: document.getElementById('next-button'),
  practiceArea: document.getElementById('practice-area'),
  completionCard: document.getElementById('completion-card'),
  restartButton: document.getElementById('restart-button')
};

if (Object.values(elementos).some((elemento) => !elemento)) {
  throw new Error('Não foi possível iniciar os cards infantis: faltam elementos da página.');
}

let indiceAtual = 0;
let cartoesConcluidos = new Array(cartoes.length).fill(false);
let gestosRestantes = [];
let falaConcluida = false;
let gestosConcluidos = false;
let gravando = false;
let avancando = false;
let sessaoReconhecimento = null;

function normalizar(texto) {
  return texto
    .toLocaleLowerCase('pt-BR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function mostrarFeedback(texto, tipo = '') {
  elementos.feedback.textContent = texto;
  elementos.feedback.className = `feedback${tipo ? ` ${tipo}` : ''}`;
}

function atualizarProgresso() {
  const concluidos = cartoesConcluidos.filter(Boolean).length;
  const porcentagem = Math.round((concluidos / cartoes.length) * 100);
  elementos.progressTrack.setAttribute('aria-valuenow', String(concluidos));
  elementos.progressFill.style.width = `${porcentagem}%`;
  elementos.cardCount.textContent = `${Math.min(indiceAtual + 1, cartoes.length)}/${cartoes.length}`;
  elementos.cardCount.setAttribute('aria-label', `Cartão ${Math.min(indiceAtual + 1, cartoes.length)} de ${cartoes.length}`);
}

function salvarProgresso() {
  try {
    localStorage.setItem(CHAVE_PROGRESSO, JSON.stringify({ indiceAtual, cartoesConcluidos }));
  } catch (erro) {
    console.error('Não foi possível salvar o progresso dos cartões:', erro);
    mostrarFeedback('Não foi possível salvar seu progresso neste navegador.', 'error');
  }
}

function carregarProgresso() {
  try {
    const salvo = localStorage.getItem(CHAVE_PROGRESSO);
    if (!salvo) return;

    const dados = JSON.parse(salvo);
    if (!dados || !Array.isArray(dados.cartoesConcluidos)) return;

    cartoesConcluidos = cartoes.map((_, indice) => dados.cartoesConcluidos[indice] === true);
    const indiceSalvo = Number(dados.indiceAtual);
    if (Number.isInteger(indiceSalvo) && indiceSalvo >= 0 && indiceSalvo < cartoes.length) {
      indiceAtual = indiceSalvo;
    }
  } catch (erro) {
    console.error('Não foi possível carregar o progresso dos cartões:', erro);
    mostrarFeedback('Não foi possível carregar o progresso salvo. Você pode começar de novo.', 'error');
  }
}

function atualizarBotaoProximo() {
  elementos.nextButton.disabled = !(falaConcluida && gestosConcluidos) || avancando;
}

function atualizarGestos() {
  if (gestosRestantes.length === 0) {
    gestosConcluidos = true;
    elementos.gestureCue.textContent = 'Muito bem!';
    elementos.gestureProgress.textContent = 'Sequência concluída';
    elementos.gestureButton.disabled = true;
    elementos.gestureButton.classList.add('is-complete');
    elementos.gestureButtonText.textContent = 'Gestos concluídos!';
    elementos.restartGesturesButton.hidden = true;
    mostrarFeedback('Fala e movimentos concluídos. Pode seguir para o próximo cartão!', 'success');
    atualizarBotaoProximo();
    return;
  }

  const totalGestos = cartoes[indiceAtual].gestos.length;
  const feitos = totalGestos - gestosRestantes.length;
  elementos.gestureCue.textContent = gestosRestantes[0];
  elementos.gestureProgress.textContent = `${feitos} de ${totalGestos} gestos`;
  elementos.gestureButtonText.textContent = `Fiz: ${gestosRestantes[0]}`;
}

function reiniciarTentativa() {
  falaConcluida = false;
  gestosConcluidos = false;
  avancando = false;
  gestosRestantes = [...cartoes[indiceAtual].gestos];
  elementos.gestureButton.disabled = true;
  elementos.gestureButton.classList.remove('is-complete');
  elementos.restartGesturesButton.hidden = true;
  elementos.nextButton.disabled = true;
  elementos.recognizedBox.hidden = true;
  elementos.recognizedText.textContent = '';
  atualizarGestos();
}

function preencherPreview(cartao) {
  if (!cartao) {
    elementos.nextCard.hidden = true;
    elementos.nextCard.setAttribute('aria-hidden', 'true');
    return;
  }

  elementos.nextCard.hidden = false;
  elementos.nextCard.setAttribute('aria-hidden', 'true');
  elementos.nextCard.querySelector('[data-preview="theme"]').textContent = cartao.tema;
  elementos.nextCard.querySelector('[data-preview="phrase"]').textContent = cartao.frase;
  elementos.nextCard.querySelector('[data-preview="syllables"]').textContent = cartao.silabas;
}

function renderizarCartao(animarEntrada = false) {
  const cartao = cartoes[indiceAtual];
  elementos.cardStack.classList.remove('card-dismissed', 'card-entering');
  elementos.currentCard.hidden = false;
  elementos.currentCard.setAttribute('aria-hidden', 'false');
  elementos.cardTheme.textContent = cartao.tema;
  elementos.cardPhrase.textContent = cartao.frase;
  elementos.cardSyllables.textContent = cartao.silabas;
  elementos.cardMission.textContent = cartao.missao;
  preencherPreview(cartoes[indiceAtual + 1]);
  reiniciarTentativa();
  elementos.listenButton.disabled = false;
  elementos.speakButton.disabled = !ReconhecimentoDeFala;
  elementos.selfCheckButton.hidden = Boolean(ReconhecimentoDeFala);
  mostrarFeedback(
    ReconhecimentoDeFala
      ? 'Ouça a frase, fale no seu ritmo e depois imite os gestos.'
      : 'O reconhecimento de voz não está disponível. Um adulto pode ajudar a marcar quando a frase for falada.'
  );
  elementos.practiceArea.hidden = false;
  elementos.completionCard.hidden = true;
  atualizarProgresso();

  if (animarEntrada) {
    window.requestAnimationFrame(() => elementos.cardStack.classList.add('card-entering'));
  }
}

function normalizarParaComparar(texto) {
  return normalizar(texto).split(' ').filter(Boolean);
}

function avaliarFala(texto) {
  const palavrasReconhecidas = new Set(normalizarParaComparar(texto));
  const palavrasAlvo = cartoes[indiceAtual].palavrasChave;
  const correspondencias = palavrasAlvo.filter((palavra) => palavrasReconhecidas.has(normalizar(palavra))).length;
  return correspondencias >= Math.ceil(palavrasAlvo.length * 0.6);
}

function concluirFala(texto, autoavaliada = false) {
  falaConcluida = true;
  elementos.recognizedBox.hidden = false;
  elementos.recognizedText.textContent = texto || 'Frase marcada como falada.';
  elementos.gestureButton.disabled = false;
  elementos.restartGesturesButton.hidden = false;
  atualizarGestos();
  mostrarFeedback(
    autoavaliada
      ? 'Frase marcada! Agora faça os gestos na ordem do cartão.'
      : 'Boa tentativa! Agora faça os gestos seguindo a ordem do cartão.',
    'success'
  );
  atualizarBotaoProximo();
}

function ouvirDesafio() {
  if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
    mostrarFeedback('A voz de exemplo não está disponível. Um adulto pode ler a frase em voz alta.', 'error');
    return;
  }

  window.speechSynthesis.cancel();
  const exemplo = new SpeechSynthesisUtterance(cartoes[indiceAtual].frase);
  exemplo.lang = 'pt-BR';
  exemplo.rate = 0.82;
  exemplo.pitch = 1.15;
  window.speechSynthesis.speak(exemplo);
  mostrarFeedback('Escute o exemplo e depois fale junto, se quiser.');
}

function falarFrase() {
  if (!ReconhecimentoDeFala || gravando) return;

  if (sessaoReconhecimento) sessaoReconhecimento.abort();
  const sessao = new ReconhecimentoDeFala();
  sessaoReconhecimento = sessao;
  sessao.lang = 'pt-BR';
  sessao.continuous = false;
  sessao.interimResults = false;
  sessao.maxAlternatives = 3;
  gravando = true;
  reiniciarTentativa();
  elementos.speakButton.disabled = true;
  elementos.speakButton.querySelector('span').textContent = 'Ouvindo...';
  mostrarFeedback('Fale a frase do cartão com calma.');

  sessao.onresult = (evento) => {
    if (sessaoReconhecimento !== sessao) return;

    const alternativas = Array.from(evento.results[0]).map((resultado) => resultado.transcript.trim());
    const reconhecida = alternativas.find((alternativa) => avaliarFala(alternativa));
    elementos.recognizedBox.hidden = false;
    elementos.recognizedText.textContent = alternativas[0] || 'Não reconheci a frase.';

    if (reconhecida) {
      concluirFala(reconhecida);
    } else {
      elementos.gestureButton.disabled = true;
      mostrarFeedback('Obrigado por tentar! Experimente ouvir de novo e falar sem pressa.', 'info');
    }
  };

  sessao.onerror = (evento) => {
    if (sessaoReconhecimento !== sessao || evento.error === 'aborted') return;

    console.error('Erro no reconhecimento de voz dos cartões:', evento.error);
    elementos.selfCheckButton.hidden = false;
    mostrarFeedback('Não foi possível reconhecer a fala. Tente outra vez ou marque quando terminar de falar.', 'error');
  };

  sessao.onend = () => {
    if (sessaoReconhecimento !== sessao) return;
    gravando = false;
    elementos.speakButton.disabled = !ReconhecimentoDeFala;
    elementos.speakButton.querySelector('span').textContent = 'Falar frase';
    sessaoReconhecimento = null;
  };

  try {
    sessao.start();
  } catch (erro) {
    gravando = false;
    sessaoReconhecimento = null;
    elementos.speakButton.disabled = false;
    elementos.speakButton.querySelector('span').textContent = 'Falar frase';
    elementos.selfCheckButton.hidden = false;
    console.error('Não foi possível iniciar o reconhecimento de voz:', erro);
    mostrarFeedback('O microfone não iniciou. Tente novamente ou marque quando terminar de falar.', 'error');
  }
}

function marcarGestoFeito() {
  if (!falaConcluida || gestosConcluidos) return;

  gestosRestantes.shift();
  elementos.gestureButton.classList.add('tapped');
  window.setTimeout(() => elementos.gestureButton.classList.remove('tapped'), 160);
  atualizarGestos();
}

function avancarCartao() {
  if (elementos.nextButton.disabled || avancando) return;
  avancando = true;
  cartoesConcluidos[indiceAtual] = true;
  atualizarProgresso();
  elementos.nextButton.disabled = true;

  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  if (gravando && sessaoReconhecimento) sessaoReconhecimento.abort();

  elementos.cardStack.classList.add('card-dismissed');
  window.setTimeout(() => {
    if (indiceAtual === cartoes.length - 1) {
      salvarProgresso();
      elementos.practiceArea.hidden = true;
      elementos.completionCard.hidden = false;
      elementos.completionCard.focus();
      atualizarProgresso();
      avancando = false;
      return;
    }

    indiceAtual++;
    salvarProgresso();
    renderizarCartao(true);
  }, 560);
}

function reiniciarCartoes() {
  if (gravando && sessaoReconhecimento) sessaoReconhecimento.abort();
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  indiceAtual = 0;
  cartoesConcluidos = new Array(cartoes.length).fill(false);
  try {
    localStorage.removeItem(CHAVE_PROGRESSO);
  } catch (erro) {
    console.error('Não foi possível reiniciar o progresso dos cartões:', erro);
    mostrarFeedback('Não foi possível limpar o progresso salvo.', 'error');
  }
  renderizarCartao();
}

elementos.listenButton.addEventListener('click', ouvirDesafio);
elementos.speakButton.addEventListener('click', falarFrase);
elementos.selfCheckButton.addEventListener('click', () => concluirFala('', true));
elementos.gestureButton.addEventListener('click', marcarGestoFeito);
elementos.restartGesturesButton.addEventListener('click', () => {
  gestosRestantes = [...cartoes[indiceAtual].gestos];
  gestosConcluidos = false;
  elementos.gestureButton.disabled = false;
  elementos.gestureButton.classList.remove('is-complete');
  atualizarGestos();
  atualizarBotaoProximo();
  mostrarFeedback('Vamos fazer a sequência outra vez!', 'info');
});
elementos.nextButton.addEventListener('click', avancarCartao);
elementos.restartButton.addEventListener('click', reiniciarCartoes);

if (ReconhecimentoDeFala) {
  elementos.speakButton.disabled = false;
} else {
  elementos.speakButton.disabled = true;
  elementos.selfCheckButton.hidden = false;
}

window.addEventListener('pagehide', () => {
  if (sessaoReconhecimento) sessaoReconhecimento.abort();
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
});

carregarProgresso();
if (cartoesConcluidos.every(Boolean)) {
  elementos.practiceArea.hidden = true;
  elementos.completionCard.hidden = false;
  atualizarProgresso();
} else {
  renderizarCartao();
}

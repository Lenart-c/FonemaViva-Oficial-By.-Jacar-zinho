const cards = [
  {
    palavra: 'Electroencefalografista',
    silabas: 'e-le-tro-en-ce-fa-lo-gra-fis-ta',
    dica: 'Pratique em blocos curtos e mantenha o ritmo até a sílaba final.',
    dicaExtra: 'Experimente “e-le-tro-en”, “ce-fa-lo” e “gra-fis-ta”; depois junte os blocos.'
  },
  {
    palavra: 'Interdisciplinaridade',
    silabas: 'in-ter-dis-ci-pli-na-ri-da-de',
    dica: 'Use as sílabas como guia e fale sem acelerar no meio da palavra.',
    dicaExtra: 'Treine “in-ter-dis”, “ci-pli-na” e “ri-da-de” antes de falar tudo.'
  },
  {
    palavra: 'Incompreensibilidade',
    silabas: 'in-com-pre-en-si-bi-li-da-de',
    dica: 'Separe os sons com calma, especialmente no encontro “pre-en”.',
    dicaExtra: 'Pratique “in-com-pre-en”, “si-bi-li” e “da-de” em partes.'
  },
  {
    palavra: 'Desinstitucionalização',
    silabas: 'des-ins-ti-tu-ci-o-na-li-za-ção',
    dica: 'Fale em grupos e dê atenção à sequência de sons no centro da palavra.',
    dicaExtra: 'Comece com “des-ins-ti-tu”, continue com “ci-o-na” e termine em “li-za-ção”.'
  },
  {
    palavra: 'Transubstanciação',
    silabas: 'tran-subs-tan-ci-a-ção',
    dica: 'Articule com calma o encontro consonantal em “subs”.',
    dicaExtra: 'Treine “tran-subs”, depois “tan-ci-a-ção”, e una os dois grupos.'
  },
  {
    palavra: 'Hiperparatireoidismo',
    silabas: 'hi-per-pa-ra-ti-re-oi-dis-mo',
    dica: 'Diga cada parte com clareza e evite apressar a sequência “re-oi”.',
    dicaExtra: 'Divida em “hi-per-pa-ra”, “ti-re-oi” e “dis-mo”.'
  },
  {
    palavra: 'Irresponsabilidade',
    silabas: 'ir-res-pon-sa-bi-li-da-de',
    dica: 'Marque o início “ir-res” e mantenha o mesmo ritmo nas demais sílabas.',
    dicaExtra: 'Pratique “ir-res-pon”, “sa-bi-li” e finalize com “da-de”.'
  },
  {
    palavra: 'Inexoravelmente',
    silabas: 'i-ne-xo-ra-vel-men-te',
    dica: 'Fale as sílabas em sequência, sustentando um ritmo tranquilo.',
    dicaExtra: 'Experimente “i-ne-xo”, “ra-vel” e “men-te”, depois una tudo.'
  },
  {
    palavra: 'Otorreinolaringologista',
    silabas: 'o-tor-rei-no-la-rin-go-lo-gis-ta',
    dica: 'Avance pelas sílabas em blocos, sem acelerar no trecho central.',
    dicaExtra: 'Pratique “o-tor-rei”, “no-la-rin” e “go-lo-gis-ta” separadamente.'
  }
];

const elementos = {
  progressTrack: document.getElementById('progress-track'),
  progressFill: document.getElementById('progress-fill'),
  cardCount: document.getElementById('card-count'),
  word: document.getElementById('word'),
  syllables: document.getElementById('syllables'),
  pronunciationTip: document.getElementById('pronunciation-tip'),
  cardStack: document.querySelector('.card-stack'),
  currentCard: document.getElementById('word-card'),
  nextWordCard: document.getElementById('next-word-card'),
  extraTip: document.getElementById('extra-tip'),
  extraTipButton: document.getElementById('extra-tip-button'),
  listenButton: document.getElementById('listen-button'),
  recordButton: document.getElementById('record-button'),
  repeatButton: document.getElementById('repeat-button'),
  nextButton: document.getElementById('next-button'),
  feedback: document.getElementById('feedback'),
  recognizedText: document.getElementById('recognized-text'),
  captionBox: document.getElementById('caption-box'),
  captionText: document.getElementById('caption-text'),
  speechSpeed: document.getElementById('speech-speed'),
  textSizeButton: document.getElementById('text-size-button'),
  captionsButton: document.getElementById('captions-button'),
  practiceArea: document.getElementById('practice-area'),
  completionCard: document.getElementById('completion-card'),
  completionMessage: document.getElementById('completion-message'),
  restartButton: document.getElementById('restart-button')
};

if (Object.values(elementos).some((elemento) => !elemento)) {
  throw new Error('Não foi possível iniciar os cards: faltam elementos da página.');
}

const ReconhecimentoDeFala = window.SpeechRecognition || window.webkitSpeechRecognition;
let indiceAtual = 0;
let tentativasReconhecidas = 0;
let cardReconhecido = false;
let reconhecimentoAtual = null;
let gravando = false;
let timerFeedback = null;

function normalizar(texto) {
  return texto
    .toLocaleLowerCase('pt-BR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

function atualizarProgresso() {
  const concluidos = indiceAtual;
  const porcentagem = Math.round((concluidos / cards.length) * 100);
  elementos.progressTrack.setAttribute('aria-valuenow', String(concluidos));
  elementos.progressFill.style.width = `${porcentagem}%`;
  elementos.cardCount.textContent = `${Math.min(indiceAtual + 1, cards.length)}/${cards.length}`;
  elementos.cardCount.setAttribute('aria-label', `Card ${Math.min(indiceAtual + 1, cards.length)} de ${cards.length}`);
}

function renderizarCard() {
  const card = cards[indiceAtual];
  const proximoCard = cards[indiceAtual + 1];
  cardReconhecido = false;
  elementos.cardStack.classList.remove('card-dismissed', 'card-ready', 'card-entering');
  elementos.currentCard.classList.remove('card-error');
  window.clearTimeout(timerFeedback);
  elementos.currentCard.hidden = false;
  elementos.currentCard.setAttribute('aria-hidden', 'false');
  elementos.nextWordCard.hidden = !proximoCard;
  elementos.nextWordCard.setAttribute('aria-hidden', 'true');
  elementos.word.textContent = card.palavra;
  elementos.syllables.textContent = card.silabas;
  elementos.pronunciationTip.textContent = card.dica;
  elementos.extraTip.textContent = card.dicaExtra;
  elementos.extraTip.hidden = true;
  elementos.extraTipButton.setAttribute('aria-expanded', 'false');
  elementos.feedback.textContent = ReconhecimentoDeFala
    ? 'Quando estiver pronto, experimente falar a palavra.'
    : 'O reconhecimento de fala não está disponível neste navegador. Abra o exercício em um navegador compatível para praticar.';
  elementos.feedback.className = 'feedback';
  elementos.recognizedText.hidden = true;
  elementos.recognizedText.textContent = '';
  elementos.recordButton.disabled = !ReconhecimentoDeFala;
  elementos.recordButton.querySelector('span').textContent = 'Gravar tentativa';
  elementos.listenButton.disabled = false;
  elementos.repeatButton.disabled = !ReconhecimentoDeFala;
  elementos.nextButton.disabled = true;
  elementos.practiceArea.hidden = false;
  elementos.completionCard.hidden = true;
  elementos.captionText.textContent = `Fale esta palavra: ${card.palavra}. Divisão em sílabas: ${card.silabas}. Dica: ${card.dica}`;
  if (proximoCard) {
    elementos.nextWordCard.querySelector('[data-preview="word"]').textContent = proximoCard.palavra;
    elementos.nextWordCard.querySelector('[data-preview="syllables"]').textContent = proximoCard.silabas;
    elementos.nextWordCard.querySelector('[data-preview="tip"]').textContent = proximoCard.dica;
  }
  atualizarProgresso();
}

function falarModelo() {
  if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
    elementos.feedback.textContent = 'O áudio-modelo não está disponível neste navegador.';
    elementos.feedback.className = 'feedback error';
    return;
  }

  window.speechSynthesis.cancel();
  const fala = new SpeechSynthesisUtterance(cards[indiceAtual].palavra);
  const vozPortuguesa = window.speechSynthesis.getVoices().find((voz) => voz.lang.toLowerCase().startsWith('pt-br'))
    || window.speechSynthesis.getVoices().find((voz) => voz.lang.toLowerCase().startsWith('pt'));

  fala.lang = 'pt-BR';
  fala.rate = Number(elementos.speechSpeed.value);
  fala.pitch = 1;
  if (vozPortuguesa) fala.voice = vozPortuguesa;
  window.speechSynthesis.speak(fala);
}

function encerrarGravacao(sessao) {
  if (reconhecimentoAtual !== sessao) return;
  gravando = false;
  elementos.recordButton.disabled = !ReconhecimentoDeFala;
  elementos.recordButton.querySelector('span').textContent = 'Gravar tentativa';
  elementos.listenButton.disabled = false;
}

function gravarTentativa() {
  if (!ReconhecimentoDeFala || gravando) return;

  const sessao = new ReconhecimentoDeFala();
  reconhecimentoAtual = sessao;
  sessao.lang = 'pt-BR';
  sessao.continuous = false;
  sessao.interimResults = false;
  sessao.maxAlternatives = 3;

  let recebeuResultado = false;
  gravando = true;
  elementos.recordButton.disabled = true;
  elementos.recordButton.querySelector('span').textContent = 'Estou ouvindo...';
  elementos.listenButton.disabled = true;
  elementos.feedback.textContent = 'Estou ouvindo. Fale no seu ritmo...';
  elementos.feedback.className = 'feedback';
  elementos.recognizedText.hidden = true;

  sessao.onresult = (evento) => {
    if (reconhecimentoAtual !== sessao) return;
    recebeuResultado = true;

    const alternativas = Array.from(evento.results[0]).map((resultado) => resultado.transcript.trim());
    const foiReconhecida = alternativas.some((alternativa) => normalizar(alternativa) === normalizar(cards[indiceAtual].palavra));
    elementos.recognizedText.textContent = `O navegador reconheceu: “${alternativas[0]}”`;
    elementos.recognizedText.hidden = false;

    if (foiReconhecida) {
      cardReconhecido = true;
      window.clearTimeout(timerFeedback);
      elementos.currentCard.classList.remove('card-error');
      elementos.feedback.textContent = 'Muito bem! Você se dedicou à palavra. Quando quiser, avance para a próxima.';
      elementos.feedback.className = 'feedback encouragement';
      elementos.cardStack.classList.add('card-dismissed');
      elementos.currentCard.setAttribute('aria-hidden', 'true');
    } else {
      elementos.currentCard.classList.remove('card-error');
      void elementos.currentCard.offsetWidth;
      elementos.currentCard.classList.add('card-error');
      timerFeedback = window.setTimeout(() => {
        elementos.currentCard.classList.remove('card-error');
      }, 800);
      elementos.feedback.textContent = 'Obrigado por tentar! Experimente separar as sílabas e alongar um pouco este som.';
      elementos.feedback.className = 'feedback try-again';
    }
    encerrarGravacao(sessao);
    if (foiReconhecida) {
      elementos.nextButton.disabled = true;
      elementos.nextButton.innerHTML = indiceAtual === cards.length - 1
        ? 'Concluir <i class="fa-solid fa-check" aria-hidden="true"></i>'
        : 'Próximo card <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>';
      elementos.listenButton.disabled = true;
      elementos.recordButton.disabled = true;
      elementos.repeatButton.disabled = true;
    }
  };

  sessao.onerror = (evento) => {
    if (reconhecimentoAtual !== sessao) return;
    recebeuResultado = true;
    encerrarGravacao(sessao);
    const mensagens = {
      'not-allowed': 'O microfone está bloqueado. Você pode liberar o acesso nas permissões do navegador e tentar novamente.',
      'service-not-allowed': 'O reconhecimento de voz não foi autorizado pelo navegador. Verifique as permissões e tente novamente.',
      'audio-capture': 'Não encontrei um microfone. Verifique o dispositivo e tente novamente.',
      'no-speech': 'Não ouvi uma tentativa desta vez. Experimente falar um pouco mais perto do microfone.',
      network: 'O reconhecimento está indisponível no momento. Verifique a conexão e tente de novo.'
    };
    elementos.feedback.textContent = mensagens[evento.error]
      || 'Não consegui analisar a tentativa agora. Você pode tentar de novo.';
    elementos.feedback.className = 'feedback try-again';
  };

  sessao.onend = () => {
    if (reconhecimentoAtual !== sessao) return;
    if (!recebeuResultado) {
      encerrarGravacao(sessao);
      elementos.feedback.textContent = 'A escuta terminou. Se quiser, tente falar mais perto do microfone.';
      elementos.feedback.className = 'feedback try-again';
    }
  };

  try {
    sessao.start();
  } catch (erro) {
    encerrarGravacao(sessao);
    elementos.feedback.textContent = 'Não foi possível iniciar o microfone. Verifique as permissões e tente novamente.';
    elementos.feedback.className = 'feedback error';
  }
}

function avancarCard() {
  if (!cardReconhecido) return;
  if (gravando && reconhecimentoAtual) {
    const sessaoAnterior = reconhecimentoAtual;
    reconhecimentoAtual = null;
    gravando = false;
    sessaoAnterior.abort();
  }
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  tentativasReconhecidas++;

  indiceAtual++;
  if (indiceAtual >= cards.length) {
    atualizarProgresso();
    elementos.practiceArea.hidden = true;
    elementos.completionCard.hidden = false;
    elementos.completionMessage.textContent = `Você praticou as ${tentativasReconhecidas} palavras do desafio. Obrigado por praticar no seu ritmo!`;
    elementos.completionCard.focus();
    return;
  }
  renderizarCard();
  elementos.cardStack.classList.add('card-entering');
}

function reiniciarCards() {
  if (gravando && reconhecimentoAtual) {
    const sessaoAnterior = reconhecimentoAtual;
    reconhecimentoAtual = null;
    gravando = false;
    sessaoAnterior.abort();
  }
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  indiceAtual = 0;
  tentativasReconhecidas = 0;
  renderizarCard();
}

elementos.listenButton.addEventListener('click', falarModelo);
elementos.recordButton.addEventListener('click', gravarTentativa);
elementos.repeatButton.addEventListener('click', gravarTentativa);
elementos.nextButton.addEventListener('click', () => avancarCard());
elementos.restartButton.addEventListener('click', reiniciarCards);

elementos.extraTipButton.addEventListener('click', () => {
  const expanded = elementos.extraTipButton.getAttribute('aria-expanded') === 'true';
  elementos.extraTipButton.setAttribute('aria-expanded', String(!expanded));
  elementos.extraTip.hidden = expanded;
});

elementos.textSizeButton.addEventListener('click', () => {
  const enlarged = elementos.textSizeButton.getAttribute('aria-pressed') !== 'true';
  document.body.classList.toggle('large-text', enlarged);
  elementos.textSizeButton.setAttribute('aria-pressed', String(enlarged));
  elementos.textSizeButton.innerHTML = enlarged
    ? '<i class="fa-solid fa-text-height" aria-hidden="true"></i> Tamanho normal'
    : '<i class="fa-solid fa-text-height" aria-hidden="true"></i> Aumentar texto';
});

elementos.captionsButton.addEventListener('click', () => {
  const enabled = elementos.captionsButton.getAttribute('aria-pressed') !== 'true';
  elementos.captionsButton.setAttribute('aria-pressed', String(enabled));
  elementos.captionsButton.innerHTML = enabled
    ? '<i class="fa-solid fa-closed-captioning" aria-hidden="true"></i> Desativar legendas'
    : '<i class="fa-solid fa-closed-captioning" aria-hidden="true"></i> Ativar legendas';
  elementos.captionBox.hidden = !enabled;
});

elementos.cardStack.addEventListener('animationend', (evento) => {
  if (evento.target !== elementos.currentCard) return;

  if (evento.animationName === 'active-card-arrive') {
    elementos.cardStack.classList.remove('card-entering');
    return;
  }

  if (evento.animationName !== 'current-card-out') return;

  elementos.cardStack.classList.remove('card-dismissed');
  elementos.cardStack.classList.add('card-ready');
  elementos.currentCard.setAttribute('aria-hidden', 'true');
  elementos.nextWordCard.setAttribute('aria-hidden', String(indiceAtual === cards.length - 1));
  elementos.nextButton.disabled = false;
  elementos.nextButton.focus({ preventScroll: true });
});

renderizarCard();

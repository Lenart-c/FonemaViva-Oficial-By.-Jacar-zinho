const palavras = [
  { texto: 'Arquipélago', nivel: 'Nível 1 · Aquecimento' },
  { texto: 'Perspicácia', nivel: 'Nível 1 · Aquecimento' },
  { texto: 'Proparoxítona', nivel: 'Nível 2 · Intermediário' },
  { texto: 'Paralelepípedo', nivel: 'Nível 2 · Intermediário' },
  { texto: 'Imprescindibilidade', nivel: 'Nível 3 · Avançado' },
  { texto: 'Desoxirribonucleico', nivel: 'Nível 3 · Avançado' },
  { texto: 'Otorrinolaringologista', nivel: 'Nível 4 · Especialista' },
  { texto: 'Esternocleidomastoideo', nivel: 'Nível 4 · Especialista' },
  { texto: 'Inconstitucionalissimamente', nivel: 'Nível 4 · Especialista' }
];

const elementos = {
  progresso: document.getElementById('progresso'),
  progressTrack: document.getElementById('progress-track'),
  progressText: document.getElementById('progress-text'),
  roundLabel: document.getElementById('round-label'),
  levelLabel: document.getElementById('level-label'),
  targetWord: document.getElementById('target-word'),
  listenButton: document.getElementById('listen-button'),
  speakButton: document.getElementById('speak-button'),
  retryButton: document.getElementById('retry-button'),
  nextButton: document.getElementById('next-button'),
  feedback: document.getElementById('feedback'),
  transcript: document.getElementById('transcript'),
  exerciseCard: document.querySelector('.exercise-card'),
  completionCard: document.getElementById('completion-card'),
  finalScore: document.getElementById('final-score'),
  restartButton: document.getElementById('restart-button')
};

if (Object.values(elementos).some((elemento) => !elemento)) {
  throw new Error('Não foi possível iniciar o desafio: faltam elementos da página.');
}

const ReconhecimentoDeFala = window.SpeechRecognition || window.webkitSpeechRecognition;
let etapa = 0;
let acertosAutomaticos = 0;
let etapasConcluidas = 0;
let reconhecimento = null;
let falando = false;
let respostaRegistrada = false;

function normalizar(texto) {
  return texto
    .toLocaleLowerCase('pt-BR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

function atualizarProgresso() {
  const porcentagem = Math.round((etapasConcluidas / palavras.length) * 100);
  elementos.progressText.textContent = `${etapasConcluidas} de ${palavras.length} palavras`;
  elementos.progressTrack.setAttribute('aria-valuenow', String(etapasConcluidas));
  elementos.progresso.style.width = `${porcentagem}%`;
}

function prepararEtapa() {
  const palavra = palavras[etapa];
  respostaRegistrada = false;
  elementos.roundLabel.textContent = `PALAVRA ${etapa + 1} DE ${palavras.length}`;
  elementos.levelLabel.textContent = palavra.nivel;
  elementos.targetWord.textContent = palavra.texto;
  elementos.speakButton.disabled = !ReconhecimentoDeFala;
  elementos.listenButton.disabled = false;
  elementos.retryButton.hidden = true;
  elementos.nextButton.disabled = true;
  elementos.nextButton.innerHTML = etapa === palavras.length - 1
    ? 'Concluir desafio <i class="fa-solid fa-check" aria-hidden="true"></i>'
    : 'Próxima palavra <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>';
  elementos.feedback.className = 'feedback';
  elementos.feedback.textContent = ReconhecimentoDeFala
    ? 'Quando estiver pronto, toque em “Falar palavra”.'
    : 'O reconhecimento de voz não está disponível neste navegador. Abra a atividade em um navegador compatível para continuar.';
  elementos.transcript.hidden = true;
  elementos.transcript.textContent = '';
}

function encerrarReconhecimento() {
  falando = false;
  elementos.speakButton.disabled = !ReconhecimentoDeFala || respostaRegistrada;
  elementos.listenButton.disabled = false;
}

function registrarConclusao() {
  if (respostaRegistrada) return;

  respostaRegistrada = true;
  etapasConcluidas++;
  acertosAutomaticos++;
  atualizarProgresso();

  elementos.speakButton.disabled = true;
  elementos.listenButton.disabled = false;
  elementos.retryButton.hidden = true;
  elementos.nextButton.disabled = false;
  elementos.feedback.className = 'feedback success';
  elementos.feedback.textContent = 'Boa! O reconhecimento identificou a palavra. Siga para o próximo nível.';
}

function ouvirExemplo() {
  if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
    elementos.feedback.textContent = 'A reprodução de voz não está disponível neste navegador.';
    elementos.feedback.className = 'feedback error';
    return;
  }

  window.speechSynthesis.cancel();
  const exemplo = new SpeechSynthesisUtterance(palavras[etapa].texto);
  const vozPortuguesa = window.speechSynthesis.getVoices().find((voz) => voz.lang.toLowerCase().startsWith('pt-br'))
    || window.speechSynthesis.getVoices().find((voz) => voz.lang.toLowerCase().startsWith('pt'));

  exemplo.lang = 'pt-BR';
  exemplo.rate = 0.78;
  if (vozPortuguesa) exemplo.voice = vozPortuguesa;
  window.speechSynthesis.speak(exemplo);
}

function falarPalavra() {
  if (!ReconhecimentoDeFala || falando || respostaRegistrada) return;

  const sessao = new ReconhecimentoDeFala();
  reconhecimento = sessao;
  sessao.lang = 'pt-BR';
  sessao.continuous = false;
  sessao.interimResults = false;
  sessao.maxAlternatives = 3;
  falando = true;
  elementos.speakButton.disabled = true;
  elementos.listenButton.disabled = true;
  elementos.retryButton.hidden = true;
  elementos.feedback.className = 'feedback listening';
  elementos.feedback.textContent = 'Estou ouvindo. Fale a palavra com clareza...';
  elementos.transcript.hidden = true;

  sessao.onresult = (evento) => {
    if (reconhecimento !== sessao) return;

    falando = false;
    const alternativas = Array.from(evento.results[0]).map((resultado) => resultado.transcript.trim());
    const palavraEsperada = normalizar(palavras[etapa].texto);
    const reconhecida = alternativas.find((alternativa) => normalizar(alternativa) === palavraEsperada);

    elementos.transcript.hidden = false;
    elementos.transcript.textContent = `O navegador reconheceu: “${alternativas[0]}”`;
    if (reconhecida) {
      elementos.feedback.className = 'feedback success';
      elementos.feedback.textContent = 'Muito bem! A palavra foi reconhecida.';
      registrarConclusao();
      return;
    }

    encerrarReconhecimento();
    elementos.retryButton.hidden = false;
    elementos.feedback.className = 'feedback retry';
    elementos.feedback.textContent = 'Não consegui confirmar a palavra. Tente novamente, sem pressa.';
  };

  sessao.onerror = (evento) => {
    if (reconhecimento !== sessao) return;

    encerrarReconhecimento();
    elementos.retryButton.hidden = true;
    elementos.feedback.className = 'feedback error';

    const mensagens = {
      'not-allowed': 'O acesso ao microfone foi negado. Autorize o microfone nas permissões do navegador para continuar.',
      'service-not-allowed': 'O navegador não permitiu usar o reconhecimento de voz. Verifique as permissões ou tente outro navegador.',
      'audio-capture': 'Nenhum microfone foi encontrado. Verifique o dispositivo e tente novamente.',
      'no-speech': 'Não detectei fala. Verifique o microfone e tente novamente.',
      network: 'O serviço de reconhecimento está indisponível. Verifique sua conexão e tente novamente.'
    };
    elementos.feedback.textContent = mensagens[evento.error]
      || 'Ocorreu um problema ao reconhecer a fala. Tente novamente.';
  };

  sessao.onend = () => {
    if (reconhecimento !== sessao) return;

    if (falando) {
      encerrarReconhecimento();
      elementos.feedback.className = 'feedback retry';
      elementos.feedback.textContent = 'A escuta terminou sem uma resposta. Tente novamente.';
      elementos.retryButton.hidden = false;
    }
  };

  try {
    sessao.start();
  } catch (erro) {
    encerrarReconhecimento();
    elementos.feedback.className = 'feedback error';
    elementos.feedback.textContent = 'Não foi possível iniciar o microfone. Verifique as permissões do navegador e tente novamente.';
  }
}

function avancar() {
  if (!respostaRegistrada) return;

  if (etapa === palavras.length - 1) {
    elementos.exerciseCard.hidden = true;
    elementos.completionCard.hidden = false;
    elementos.finalScore.textContent = `Você concluiu as ${palavras.length} palavras e teve ${acertosAutomaticos} confirmações pelo reconhecimento de voz. Continue praticando no seu ritmo!`;
    elementos.completionCard.focus();
    return;
  }

  etapa++;
  prepararEtapa();
}

function iniciarDesafio() {
  if (reconhecimento && falando) {
    const sessaoAnterior = reconhecimento;
    reconhecimento = null;
    falando = false;
    sessaoAnterior.abort();
  }
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  etapa = 0;
  acertosAutomaticos = 0;
  etapasConcluidas = 0;
  falando = false;
  elementos.exerciseCard.hidden = false;
  elementos.completionCard.hidden = true;
  atualizarProgresso();
  prepararEtapa();
}

elementos.listenButton.addEventListener('click', ouvirExemplo);
elementos.speakButton.addEventListener('click', falarPalavra);
elementos.retryButton.addEventListener('click', falarPalavra);
elementos.nextButton.addEventListener('click', avancar);
elementos.restartButton.addEventListener('click', iniciarDesafio);

iniciarDesafio();

const sequencias = [
  {
    nivel: 'Nível 1 · Palavras familiares',
    palavras: ['melodia', 'carinho', 'amizade']
  },
  {
    nivel: 'Nível 1 · Ritmo e clareza',
    palavras: ['elegante', 'telefone', 'maravilha']
  },
  {
    nivel: 'Nível 2 · Mais sílabas',
    palavras: ['estratégia', 'curiosidade', 'criatividade', 'possibilidade']
  },
  {
    nivel: 'Nível 2 · Palavras mais longas',
    palavras: ['responsabilidade', 'comunicação', 'extraordinário', 'planejamento']
  },
  {
    nivel: 'Nível 3 · Articulação avançada',
    palavras: ['conscientização', 'desenvolvimento', 'acessibilidade', 'sustentabilidade', 'participação']
  },
  {
    nivel: 'Nível 3 · Sequências complexas',
    palavras: ['interdisciplinaridade', 'incompreensibilidade', 'desenvolvimento', 'responsabilidade', 'sustentabilidade']
  },
  {
    nivel: 'Nível 4 · Vocabulário técnico',
    palavras: ['otorrinolaringologista', 'paralelepípedo', 'imprescindibilidade', 'eletroencefalograma', 'incompreensibilidade', 'proparoxítona']
  },
  {
    nivel: 'Nível 4 · Desafio',
    palavras: ['esternocleidomastoideo', 'incompreensibilidade', 'desinstitucionalização', 'transubstanciação', 'eletroencefalografista', 'hiperparatireoidismo']
  }
];

const elementos = {
  progressTrack: document.getElementById('progress-track'),
  progressFill: document.getElementById('progress-fill'),
  progressText: document.getElementById('progress-text'),
  roundLabel: document.getElementById('round-label'),
  levelLabel: document.getElementById('level-label'),
  wordSequence: document.getElementById('word-sequence'),
  listenButton: document.getElementById('listen-button'),
  recordButton: document.getElementById('record-button'),
  retryButton: document.getElementById('retry-button'),
  nextButton: document.getElementById('next-button'),
  feedback: document.getElementById('feedback'),
  recognizedText: document.getElementById('recognized-text'),
  speechSpeed: document.getElementById('speech-speed'),
  textSizeButton: document.getElementById('text-size-button'),
  exerciseCard: document.getElementById('exercise-card'),
  completionCard: document.getElementById('completion-card'),
  completionMessage: document.getElementById('completion-message'),
  restartButton: document.getElementById('restart-button')
};

if (Object.values(elementos).some((elemento) => !elemento)) {
  throw new Error('Não foi possível iniciar o exercício: faltam elementos da página.');
}

const ReconhecimentoDeFala = window.SpeechRecognition || window.webkitSpeechRecognition;
let indiceAtual = 0;
let reconhecimentoAtual = null;
let gravando = false;
let sequenciaReconhecida = false;

function normalizarPalavras(texto) {
  return texto
    .toLocaleLowerCase('pt-BR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function correspondeSequencia(texto) {
  const esperadas = sequencias[indiceAtual].palavras.map((palavra) => normalizarPalavras(palavra)[0]);
  const reconhecidas = normalizarPalavras(texto);
  return esperadas.length === reconhecidas.length
    && esperadas.every((palavra, indice) => palavra === reconhecidas[indice]);
}

function atualizarProgresso() {
  const concluidas = sequenciaReconhecida ? indiceAtual + 1 : indiceAtual;
  const porcentagem = Math.round((concluidas / sequencias.length) * 100);
  elementos.progressTrack.setAttribute('aria-valuenow', String(concluidas));
  elementos.progressFill.style.width = `${porcentagem}%`;
  elementos.progressText.textContent = `${concluidas} de ${sequencias.length} sequências`;
}

function renderizarSequencia() {
  const sequencia = sequencias[indiceAtual];
  sequenciaReconhecida = false;
  elementos.roundLabel.textContent = `SEQUÊNCIA ${indiceAtual + 1} DE ${sequencias.length}`;
  elementos.levelLabel.textContent = sequencia.nivel;
  elementos.wordSequence.replaceChildren();

  sequencia.palavras.forEach((palavra) => {
    const item = document.createElement('li');
    item.textContent = palavra;
    elementos.wordSequence.appendChild(item);
  });

  elementos.feedback.textContent = ReconhecimentoDeFala
    ? 'Quando estiver pronto, pratique a sequência.'
    : 'O reconhecimento de fala não está disponível neste navegador. Você ainda pode praticar e avançar no seu ritmo.';
  elementos.feedback.className = 'feedback';
  elementos.recognizedText.hidden = true;
  elementos.recognizedText.textContent = '';
  elementos.recordButton.disabled = !ReconhecimentoDeFala;
  elementos.recordButton.querySelector('span').textContent = 'Gravar sequência';
  elementos.listenButton.disabled = false;
  elementos.retryButton.hidden = true;
  elementos.nextButton.disabled = Boolean(ReconhecimentoDeFala);
  elementos.nextButton.innerHTML = indiceAtual === sequencias.length - 1
    ? 'Concluir exercício <i class="fa-solid fa-check" aria-hidden="true"></i>'
    : 'Próxima sequência <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>';
  atualizarProgresso();
}

function falarModelo() {
  if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
    elementos.feedback.textContent = 'O áudio-modelo não está disponível neste navegador.';
    elementos.feedback.className = 'feedback error';
    return;
  }

  window.speechSynthesis.cancel();
  const fala = new SpeechSynthesisUtterance(sequencias[indiceAtual].palavras.join(', '));
  const vozes = window.speechSynthesis.getVoices();
  const vozPortuguesa = vozes.find((voz) => voz.lang.toLowerCase().startsWith('pt-br'))
    || vozes.find((voz) => voz.lang.toLowerCase().startsWith('pt'));

  fala.lang = 'pt-BR';
  fala.rate = Number(elementos.speechSpeed.value);
  fala.pitch = 1;
  if (vozPortuguesa) fala.voice = vozPortuguesa;

  elementos.listenButton.disabled = true;
  fala.onend = () => {
    elementos.listenButton.disabled = false;
  };
  fala.onerror = (evento) => {
    elementos.listenButton.disabled = false;
    if (evento.error === 'canceled' || evento.error === 'interrupted') return;
    elementos.feedback.textContent = 'Não foi possível reproduzir o modelo. Verifique o áudio do dispositivo e tente novamente.';
    elementos.feedback.className = 'feedback error';
  };
  window.speechSynthesis.speak(fala);
}

function encerrarGravacao(sessao) {
  if (reconhecimentoAtual !== sessao) return;
  gravando = false;
  elementos.recordButton.disabled = !ReconhecimentoDeFala || sequenciaReconhecida;
  elementos.recordButton.querySelector('span').textContent = 'Gravar sequência';
  elementos.listenButton.disabled = false;
}

function gravarSequencia() {
  if (!ReconhecimentoDeFala || gravando || sequenciaReconhecida) return;

  const sessao = new ReconhecimentoDeFala();
  reconhecimentoAtual = sessao;
  sessao.lang = 'pt-BR';
  sessao.continuous = false;
  sessao.interimResults = false;
  sessao.maxAlternatives = 3;
  gravando = true;

  elementos.recordButton.disabled = true;
  elementos.recordButton.querySelector('span').textContent = 'Estou ouvindo...';
  elementos.listenButton.disabled = true;
  elementos.retryButton.hidden = true;
  elementos.feedback.textContent = 'Estou ouvindo. Diga todas as palavras na ordem apresentada...';
  elementos.feedback.className = 'feedback';
  elementos.recognizedText.hidden = true;

  sessao.onresult = (evento) => {
    if (reconhecimentoAtual !== sessao) return;
    const alternativas = Array.from(evento.results[0]).map((resultado) => resultado.transcript.trim());
    const reconhecida = alternativas.find((alternativa) => correspondeSequencia(alternativa));
    encerrarGravacao(sessao);
    elementos.recognizedText.textContent = `O navegador reconheceu: “${alternativas[0]}”`;
    elementos.recognizedText.hidden = false;

    if (reconhecida) {
      sequenciaReconhecida = true;
      atualizarProgresso();
      elementos.feedback.textContent = 'Muito bem! Você falou as palavras na sequência. Avance quando quiser.';
      elementos.feedback.className = 'feedback success';
      elementos.recordButton.disabled = true;
      elementos.retryButton.hidden = true;
      elementos.nextButton.disabled = false;
      return;
    }

    elementos.feedback.textContent = 'Obrigado por tentar! Confira a ordem e experimente novamente, sem pressa.';
    elementos.feedback.className = 'feedback retry';
    elementos.retryButton.hidden = false;
  };

  sessao.onerror = (evento) => {
    if (reconhecimentoAtual !== sessao) return;
    encerrarGravacao(sessao);
    const mensagens = {
      'not-allowed': 'O microfone está bloqueado. Libere o acesso nas permissões do navegador e tente novamente.',
      'service-not-allowed': 'O reconhecimento de voz não foi autorizado pelo navegador. Verifique as permissões.',
      'audio-capture': 'Não encontrei um microfone. Verifique o dispositivo e tente novamente.',
      'no-speech': 'Não ouvi uma tentativa desta vez. Fale um pouco mais perto do microfone.',
      network: 'O reconhecimento está indisponível no momento. Verifique a conexão e tente novamente.'
    };
    elementos.feedback.textContent = mensagens[evento.error]
      || 'Não consegui analisar a tentativa agora. Você pode tentar novamente.';
    elementos.feedback.className = 'feedback error';
    elementos.retryButton.hidden = evento.error === 'not-allowed' || evento.error === 'service-not-allowed';
  };

  sessao.onend = () => {
    if (reconhecimentoAtual !== sessao || !gravando) return;
    encerrarGravacao(sessao);
    elementos.feedback.textContent = 'A escuta terminou. Se quiser, tente falar um pouco mais perto do microfone.';
    elementos.feedback.className = 'feedback retry';
    elementos.retryButton.hidden = false;
  };

  try {
    sessao.start();
  } catch (erro) {
    console.error('Falha ao iniciar o reconhecimento da sequência:', erro);
    encerrarGravacao(sessao);
    elementos.feedback.textContent = 'Não foi possível iniciar o microfone. Verifique as permissões e tente novamente.';
    elementos.feedback.className = 'feedback error';
    elementos.retryButton.hidden = false;
  }
}

function avancarSequencia() {
  if (elementos.nextButton.disabled) return;
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();

  if (indiceAtual === sequencias.length - 1) {
    sequenciaReconhecida = true;
    atualizarProgresso();
    elementos.exerciseCard.hidden = true;
    elementos.completionCard.hidden = false;
    elementos.completionMessage.textContent = `Você praticou as ${sequencias.length} sequências, do aquecimento ao desafio. Obrigado por praticar no seu ritmo!`;
    elementos.completionCard.focus();
    return;
  }

  indiceAtual++;
  renderizarSequencia();
  elementos.exerciseCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function reiniciarExercicio() {
  if (gravando && reconhecimentoAtual) {
    const sessaoAnterior = reconhecimentoAtual;
    reconhecimentoAtual = null;
    gravando = false;
    sessaoAnterior.abort();
  }
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  indiceAtual = 0;
  elementos.exerciseCard.hidden = false;
  elementos.completionCard.hidden = true;
  renderizarSequencia();
  elementos.exerciseCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

elementos.listenButton.addEventListener('click', falarModelo);
elementos.recordButton.addEventListener('click', gravarSequencia);
elementos.retryButton.addEventListener('click', gravarSequencia);
elementos.nextButton.addEventListener('click', avancarSequencia);
elementos.restartButton.addEventListener('click', reiniciarExercicio);
elementos.textSizeButton.addEventListener('click', () => {
  const enlarged = elementos.textSizeButton.getAttribute('aria-pressed') !== 'true';
  document.body.classList.toggle('large-text', enlarged);
  elementos.textSizeButton.setAttribute('aria-pressed', String(enlarged));
  elementos.textSizeButton.innerHTML = enlarged
    ? '<i class="fa-solid fa-text-height" aria-hidden="true"></i> Tamanho normal'
    : '<i class="fa-solid fa-text-height" aria-hidden="true"></i> Aumentar texto';
});

renderizarSequencia();

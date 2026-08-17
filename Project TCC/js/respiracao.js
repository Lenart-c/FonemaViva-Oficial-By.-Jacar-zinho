const fases = [
  {
    nome: 'Inspire',
    duracao: 4,
    texto: 'Inspire pelo nariz por 4 segundos e mantenha o peito relaxado.',
    alvo: ['inspire', 'respire', 'respiração']
  },
  {
    nome: 'Segure',
    duracao: 2,
    texto: 'Segure o ar por 2 segundos sem tensão.',
    alvo: ['segure', 'segurar', 'segurando']
  },
  {
    nome: 'Expire',
    duracao: 6,
    texto: 'Expire lentamente pela boca por 6 segundos, controlando o fluxo de ar e repetindo “pa-pa-pa”.',
    alvo: ['pa', 'pá', 'papa', 'pa pa', 'pá pá']
  }
];

const TOTAL_CICLOS = 5;

let faseIndex = 0;
let tempoRestante = fases[0].duracao;
let ciclosConcluidos = 0;
let intervalo = null;
let emExecucao = false;

const elFaseBadge = document.getElementById('fase-badge');
const elTempo = document.getElementById('tempo');
const elInstrucao = document.getElementById('instrucao');
const elStatus = document.getElementById('status');
const elFeedback = document.getElementById('feedback');
const elCiclos = document.getElementById('ciclos');
const elProgresso = document.getElementById('progresso');
const elProgressoTexto = document.getElementById('progresso-texto');
const timerCircle = document.getElementById('timer-circle');
const resultadoEl = document.getElementById('resultado');
const btnIniciar = document.getElementById('btn-iniciar');
const btnPausar = document.getElementById('btn-pausar');
const btnOuvir = document.getElementById('btn-ouvir');
const btnGravar = document.getElementById('btn-gravar');

function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function falar(texto) {
  if (!('speechSynthesis' in window)) {
    elFeedback.textContent = '⚠️ Sua navegação não oferece leitura de voz.';
    return;
  }

  window.speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(texto);
  msg.lang = 'pt-BR';
  msg.rate = 0.9;
  msg.pitch = 1;
  window.speechSynthesis.speak(msg);
}

function atualizarProgresso() {
  const porcentagem = Math.round((ciclosConcluidos / TOTAL_CICLOS) * 100);
  elProgresso.style.width = porcentagem + '%';
  elProgressoTexto.textContent = porcentagem + '%';
  localStorage.setItem('respiracao-progress', porcentagem);
  window.dispatchEvent(new Event('progressoAtualizado'));
}

function salvarEstado() {
  localStorage.setItem(
    'respiracao-save',
    JSON.stringify({
      faseIndex,
      tempoRestante,
      ciclosConcluidos
    })
  );
}

function carregarEstado() {
  const salvo = localStorage.getItem('respiracao-save');

  if (!salvo) return;

  try {
    const dados = JSON.parse(salvo);
    if (dados && typeof dados === 'object') {
      faseIndex = Number(dados.faseIndex ?? 0);
      tempoRestante = Number(dados.tempoRestante ?? fases[faseIndex].duracao);
      ciclosConcluidos = Number(dados.ciclosConcluidos ?? 0);
    }
  } catch (erro) {
    console.error('Erro ao carregar respiração:', erro);
  }
}

function atualizarRing() {
  const fase = fases[faseIndex];
  const percentual = ((fase.duracao - tempoRestante) / fase.duracao) * 100;
  const grau = (percentual / 100) * 360;
  timerCircle.style.background = `conic-gradient(var(--accent) ${grau}deg, rgba(255,255,255,0.06) 0deg)`;
}

function renderizarFase() {
  const fase = fases[faseIndex];

  elFaseBadge.textContent = fase.nome;
  elInstrucao.textContent = fase.texto;
  elTempo.textContent = String(tempoRestante).padStart(2, '0');
  elStatus.textContent = fase.nome;
  elCiclos.textContent = `${ciclosConcluidos} / ${TOTAL_CICLOS}`;

  atualizarRing();
  atualizarProgresso();
  salvarEstado();
}

function pausarTimer() {
  clearInterval(intervalo);
  intervalo = null;
  emExecucao = false;
  btnIniciar.disabled = false;
  btnPausar.textContent = 'Pausar';
  elFeedback.textContent = 'Exercício pausado. Respire normalmente e continue quando quiser.';
  salvarEstado();
}

function proximoFase() {
  if (faseIndex < fases.length - 1) {
    faseIndex += 1;
    tempoRestante = fases[faseIndex].duracao;
    elFeedback.textContent = 'Mantenha o ritmo e continue com a respiração tranquila.';
    renderizarFase();
    return;
  }

  ciclosConcluidos += 1;
  elFeedback.textContent = '✅ Ciclo concluído! Continue mantendo a expiração lenta e estável.';
  faseIndex = 0;
  tempoRestante = fases[0].duracao;

  if (ciclosConcluidos >= TOTAL_CICLOS) {
    clearInterval(intervalo);
    intervalo = null;
    emExecucao = false;
    btnIniciar.disabled = true;
    btnPausar.textContent = 'Pausar';
    elStatus.textContent = 'Concluído';
    elFeedback.textContent = '✅ Exercício concluído! Sua respiração está mais controlada e estável.';
    atualizarProgresso();
    salvarEstado();
    return;
  }

  renderizarFase();
}

function iniciarTimer() {
  if (emExecucao) return;

  if (ciclosConcluidos >= TOTAL_CICLOS) {
    elFeedback.textContent = 'Este exercício já foi concluído. Reinicie para praticar novamente.';
    return;
  }

  emExecucao = true;
  btnIniciar.disabled = true;
  btnPausar.textContent = 'Pausar';
  elFeedback.textContent = 'Respire em ritmo controlado e acompanhe o cronômetro.';

  intervalo = setInterval(() => {
    if (tempoRestante > 0) {
      tempoRestante -= 1;
      renderizarFase();
      return;
    }

    proximoFase();
  }, 1000);
}

function reiniciarExercicio() {
  clearInterval(intervalo);
  intervalo = null;
  emExecucao = false;
  faseIndex = 0;
  tempoRestante = fases[0].duracao;
  ciclosConcluidos = 0;
  btnIniciar.disabled = false;
  btnPausar.textContent = 'Pausar';
  elStatus.textContent = 'Pronto para começar';
  resultadoEl.textContent = '...';
  elFeedback.textContent = 'Exercício reiniciado. Comece com uma inspiração tranquila.';
  renderizarFase();
}

function verificarResposta(texto) {
  const valor = normalizar(texto);
  const fase = fases[faseIndex];

  if (fase.nome === 'Expire') {
    const acertou = fase.alvo.some((palavra) => valor.includes(normalizar(palavra)));
    return acertou;
  }

  return fase.alvo.some((palavra) => valor.includes(normalizar(palavra)));
}

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
  const recognition = new SpeechRecognition();
  recognition.lang = 'pt-BR';
  recognition.continuous = false;
  recognition.interimResults = false;

  btnGravar.addEventListener('click', () => {
    if (!emExecucao) {
      elFeedback.textContent = 'Comece o ciclo antes de gravar a respiração.';
      return;
    }

    recognition.start();
    btnGravar.textContent = '🎙️ Ouvindo...';
    elFeedback.textContent = `Repita o padrão da fase: ${fases[faseIndex].nome.toLowerCase()}.`;
  });

  recognition.onresult = (event) => {
    const texto = Array.from(event.results)
      .map((resultado) => resultado[0].transcript)
      .join(' ');

    resultadoEl.textContent = texto.trim() || '...';

    if (verificarResposta(texto)) {
      elFeedback.textContent = '✅ Muito bem! O controle do ar ficou mais estável.';
    } else {
      elFeedback.textContent = '❌ Tente novamente com uma saída de ar mais lenta e controlada.';
    }
  };

  recognition.onerror = () => {
    elFeedback.textContent = 'Não foi possível captar o áudio. Tente novamente.';
  };

  recognition.onend = () => {
    btnGravar.textContent = '🎤 Gravar respiração';
  };
} else {
  btnGravar.disabled = true;
  btnGravar.textContent = '🎤 Mic indisponível';
}

btnOuvir.addEventListener('click', () => {
  falar(`Fase atual: ${fases[faseIndex].nome}. ${fases[faseIndex].texto}`);
  elFeedback.textContent = '🔊 Reproduzindo instrução da fase atual.';
});

btnIniciar.addEventListener('click', iniciarTimer);
btnPausar.addEventListener('click', () => {
  if (emExecucao) {
    pausarTimer();
  } else {
    iniciarTimer();
  }
});

const btnReiniciar = document.createElement('button');
btnReiniciar.className = 'btn secondary';
btnReiniciar.textContent = 'Reiniciar';
btnReiniciar.addEventListener('click', reiniciarExercicio);
document.querySelector('.controls').appendChild(btnReiniciar);

carregarEstado();
renderizarFase();

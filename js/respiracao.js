const fases = [
  {
    nome: 'Inspire',
    duracao: 4,
    texto: 'Inspire pelo nariz por 4 segundos, sem esforço e mantendo o peito relaxado.'
  },
  {
    nome: 'Pausa confortável',
    duracao: 2,
    texto: 'Faça uma pausa breve somente se for confortável; caso contrário, continue respirando normalmente.'
  },
  {
    nome: 'Expire',
    duracao: 6,
    texto: 'Expire lentamente pela boca por 6 segundos, sem forçar a saída do ar.'
  }
];

const TOTAL_CICLOS = 5;
const DURACAO_CAPTURA_MS = 6000;
const INTERVALO_CALIBRACAO_MS = 400;
const AudioContextDisponivel = window.AudioContext || window.webkitAudioContext;

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
const audioMeter = document.getElementById('audio-meter');
const audioMeterFill = document.getElementById('audio-meter-fill');

let capturaAtiva = false;
let capturaTimeout = null;
let animationFrame = null;
let streamAtual = null;
let contextoAudio = null;
let audioSource = null;
let analisador = null;
let bufferAudio = null;
let horarioInicioCaptura = 0;
let nivelAmbiente = 0;
let leiturasAmbiente = 0;
let tempoSomDetectado = 0;
let ultimaLeitura = 0;

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
  capturaAtiva = false;
  liberarMicrofone();
  btnGravar.disabled = false;
  btnGravar.innerHTML = '<i class="fa-solid fa-microphone" aria-hidden="true"></i> Captar respiração';
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

function calcularRms(dados) {
  let somaQuadrados = 0;
  for (let indice = 0; indice < dados.length; indice++) {
    somaQuadrados += dados[indice] * dados[indice];
  }
  return Math.sqrt(somaQuadrados / dados.length);
}

function atualizarMedidor(nivel) {
  const percentual = Math.min(100, Math.round(nivel * 700));
  audioMeterFill.style.width = `${percentual}%`;
  audioMeter.setAttribute('aria-valuenow', String(percentual));
}

function liberarMicrofone() {
  capturaAtiva = false;
  if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
  if (capturaTimeout !== null) window.clearTimeout(capturaTimeout);
  animationFrame = null;
  capturaTimeout = null;
  if (streamAtual) streamAtual.getTracks().forEach((track) => track.stop());
  if (audioSource) audioSource.disconnect();
  streamAtual = null;
  audioSource = null;
  analisador = null;
  bufferAudio = null;
  if (contextoAudio && contextoAudio.state !== 'closed') {
    contextoAudio.close().catch((erro) => {
      console.error('Não foi possível fechar o processamento de áudio:', erro);
    });
  }
  contextoAudio = null;
}

function analisarMicrofone() {
  if (!capturaAtiva || !analisador || !bufferAudio) return;

  analisador.getFloatTimeDomainData(bufferAudio);
  const nivel = calcularRms(bufferAudio);
  const tempoAtual = performance.now();
  if (tempoAtual - horarioInicioCaptura < INTERVALO_CALIBRACAO_MS) {
    nivelAmbiente += nivel;
    leiturasAmbiente++;
  } else {
    const nivelMedioAmbiente = leiturasAmbiente ? nivelAmbiente / leiturasAmbiente : 0;
    const limiteSom = Math.max(0.006, nivelMedioAmbiente * 2.2);
    if (nivel >= limiteSom) tempoSomDetectado += Math.min(tempoAtual - ultimaLeitura, 80);
  }

  ultimaLeitura = tempoAtual;
  atualizarMedidor(nivel);
  animationFrame = window.requestAnimationFrame(analisarMicrofone);
}

function concluirCaptura() {
  if (!capturaAtiva) return;
  capturaAtiva = false;
  liberarMicrofone();
  btnGravar.disabled = false;
  btnGravar.innerHTML = '<i class="fa-solid fa-microphone" aria-hidden="true"></i> Captar respiração';
  atualizarMedidor(0);

  const duracaoDetectada = Math.round(tempoSomDetectado / 100) / 10;
  if (duracaoDetectada >= 0.4) {
    resultadoEl.textContent = `Som captado por cerca de ${duracaoDetectada} s`;
    elFeedback.textContent = 'O microfone captou som durante a tentativa. Continue a respiração suavemente, sem forçar.';
  } else {
    resultadoEl.textContent = 'Som baixo ou não detectado';
    elFeedback.textContent = 'Não detectei som suficiente. Tente em um local silencioso, aproximando o microfone sem forçar a respiração.';
  }
}

async function captarRespiracao() {
  if (capturaAtiva) return;
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !AudioContextDisponivel) {
    resultadoEl.textContent = 'Microfone incompatível ou indisponível';
    elFeedback.textContent = 'A captação precisa de um navegador compatível e de uma conexão segura (HTTPS ou localhost).';
    return;
  }

  btnGravar.disabled = true;
  btnGravar.innerHTML = '<i class="fa-solid fa-ear-listen" aria-hidden="true"></i> Preparando microfone...';
  resultadoEl.textContent = 'Aguardando permissão do microfone';
  elFeedback.textContent = 'Permita o acesso ao microfone para captar o som da respiração.';

  try {
    streamAtual = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false
      }
    });
    contextoAudio = new AudioContextDisponivel();
    await contextoAudio.resume();
    audioSource = contextoAudio.createMediaStreamSource(streamAtual);
    analisador = contextoAudio.createAnalyser();
    analisador.fftSize = 2048;
    analisador.smoothingTimeConstant = 0.35;
    audioSource.connect(analisador);
    bufferAudio = new Float32Array(analisador.fftSize);
    capturaAtiva = true;
    horarioInicioCaptura = performance.now();
    ultimaLeitura = horarioInicioCaptura;
    nivelAmbiente = 0;
    leiturasAmbiente = 0;
    tempoSomDetectado = 0;
    btnGravar.innerHTML = '<i class="fa-solid fa-ear-listen" aria-hidden="true"></i> Captando respiração...';
    resultadoEl.textContent = 'Respire suavemente perto do microfone';
    elFeedback.textContent = 'Captação ativa por 6 segundos. Respire normalmente, sem prender nem forçar o ar.';
    animationFrame = window.requestAnimationFrame(analisarMicrofone);
    capturaTimeout = window.setTimeout(concluirCaptura, DURACAO_CAPTURA_MS);
  } catch (erro) {
    liberarMicrofone();
    btnGravar.disabled = false;
    btnGravar.innerHTML = '<i class="fa-solid fa-microphone" aria-hidden="true"></i> Captar respiração';
    resultadoEl.textContent = 'Captação não iniciada';
    console.error('Erro ao acessar ou analisar o microfone:', erro);
    if (erro.name === 'NotAllowedError' || erro.name === 'PermissionDeniedError') {
      elFeedback.textContent = 'O acesso ao microfone foi negado. Autorize-o nas permissões do navegador e tente novamente.';
    } else if (erro.name === 'NotFoundError' || erro.name === 'DevicesNotFoundError') {
      elFeedback.textContent = 'Não encontrei um microfone. Conecte ou habilite um dispositivo e tente novamente.';
    } else {
      elFeedback.textContent = 'Não foi possível iniciar a captação. Verifique as permissões e o microfone e tente novamente.';
    }
  }
}

function encerrarCapturaAoSair() {
  if (!capturaAtiva) return;
  liberarMicrofone();
  btnGravar.disabled = false;
  btnGravar.innerHTML = '<i class="fa-solid fa-microphone" aria-hidden="true"></i> Captar respiração';
}

btnGravar.addEventListener('click', captarRespiracao);
window.addEventListener('pagehide', encerrarCapturaAoSair);

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

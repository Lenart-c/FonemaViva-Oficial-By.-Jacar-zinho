const fases = [
  {
    nome: 'Inspire',
    duracao: 4,
    texto: 'Inspire naturalmente pelo nariz por 4 segundos, sem prender o ar.'
  },
  {
    nome: 'Sopro suave',
    duracao: 4,
    texto: 'Solte o ar suavemente pela boca por 4 segundos, sem fazer força.'
  },
  {
    nome: 'Sopro contínuo',
    duracao: 4,
    texto: 'Se estiver confortável, continue soltando o ar de forma tranquila por mais 4 segundos.'
  },
  {
    nome: 'Respire normalmente',
    duracao: 4,
    texto: 'Respire normalmente antes de iniciar outro ciclo.'
  }
];

const TOTAL_CICLOS = 5;
const DURACAO_CAPTURA_MS = 5000;
const INTERVALO_CALIBRACAO_MS = 400;
const AudioContextDisponivel = window.AudioContext || window.webkitAudioContext;

let faseIndex = 0;
let tempoRestante = fases[0].duracao;
let ciclosConcluidos = 0;
let intervalo = null;
let emExecucao = false;
let pausado = false;
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
const audioMeter = document.getElementById('audio-meter');
const audioMeterFill = document.getElementById('audio-meter-fill');
const btnIniciar = document.getElementById('btn-iniciar');
const btnPausar = document.getElementById('btn-pausar');
const btnReiniciar = document.getElementById('btn-reiniciar');
const btnOuvir = document.getElementById('btn-ouvir');
const btnGravar = document.getElementById('btn-gravar');

function lerEstadoSalvo() {
  try {
    const progressoSalvo = Number(localStorage.getItem('sopro-controlado-progress'));
    if (Number.isFinite(progressoSalvo)) {
      elProgresso.style.width = `${Math.min(100, Math.max(0, progressoSalvo))}%`;
      elProgressoTexto.textContent = `${Math.min(100, Math.max(0, progressoSalvo))}%`;
    }

    const salvo = localStorage.getItem('sopro-controlado-save');
    if (!salvo) return;

    const dados = JSON.parse(salvo);
    if (!dados || typeof dados !== 'object') return;

    const faseSalva = Number(dados.faseIndex);
    const tempoSalvo = Number(dados.tempoRestante);
    const ciclosSalvos = Number(dados.ciclosConcluidos);
    if (Number.isInteger(faseSalva) && faseSalva >= 0 && faseSalva < fases.length) {
      faseIndex = faseSalva;
    }
    if (Number.isInteger(tempoSalvo) && tempoSalvo > 0 && tempoSalvo <= fases[faseIndex].duracao) {
      tempoRestante = tempoSalvo;
    } else {
      tempoRestante = fases[faseIndex].duracao;
    }
    if (Number.isInteger(ciclosSalvos) && ciclosSalvos >= 0 && ciclosSalvos < TOTAL_CICLOS) {
      ciclosConcluidos = ciclosSalvos;
    }
  } catch (erro) {
    console.error('Não foi possível carregar o progresso do exercício de sopro:', erro);
    exibirFeedback('Não foi possível carregar o progresso salvo. Você pode iniciar uma nova prática.', 'error');
  }
}

function salvarEstado() {
  try {
    localStorage.setItem(
      'sopro-controlado-save',
      JSON.stringify({ faseIndex, tempoRestante, ciclosConcluidos })
    );
  } catch (erro) {
    console.error('Não foi possível salvar o progresso do exercício de sopro:', erro);
    exibirFeedback('Seu progresso não pôde ser salvo neste navegador.', 'error');
  }
}

function atualizarProgresso() {
  const porcentagem = Math.round((ciclosConcluidos / TOTAL_CICLOS) * 100);
  elProgresso.style.width = `${porcentagem}%`;
  elProgressoTexto.textContent = `${porcentagem}%`;
  try {
    localStorage.setItem('sopro-controlado-progress', String(porcentagem));
  } catch (erro) {
    console.error('Não foi possível salvar o progresso do exercício de sopro:', erro);
    exibirFeedback('Seu progresso não pôde ser salvo neste navegador.', 'error');
  }
  window.dispatchEvent(new Event('progressoAtualizado'));
}

function atualizarUI() {
  const faseAtual = fases[faseIndex];
  elFaseBadge.textContent = faseAtual.nome;
  elTempo.textContent = String(tempoRestante).padStart(2, '0');
  elInstrucao.textContent = faseAtual.texto;
  elStatus.textContent = emExecucao ? `${faseAtual.nome} em andamento` : pausado ? 'Prática pausada' : 'Pronto para começar';
  elCiclos.textContent = `${ciclosConcluidos} / ${TOTAL_CICLOS}`;
  timerCircle.classList.toggle('active', emExecucao);
}

function falar(texto) {
  if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
    exibirFeedback('A leitura de voz não está disponível neste navegador.', 'error');
    return;
  }

  window.speechSynthesis.cancel();
  const mensagem = new SpeechSynthesisUtterance(texto);
  mensagem.lang = 'pt-BR';
  mensagem.rate = 0.85;
  mensagem.pitch = 1;
  window.speechSynthesis.speak(mensagem);
}

function iniciarCiclo() {
  if (emExecucao || ciclosConcluidos >= TOTAL_CICLOS) return;
  emExecucao = true;
  pausado = false;
  btnIniciar.disabled = true;
  btnPausar.disabled = false;
  atualizarUI();

  intervalo = window.setInterval(() => {
    tempoRestante--;
    if (tempoRestante <= 0) proximaFase();
    if (!emExecucao) return;
    atualizarUI();
  }, 1000);
}

function pausarCiclo() {
  if (!emExecucao) return;
  emExecucao = false;
  pausado = true;
  window.clearInterval(intervalo);
  btnIniciar.disabled = false;
  btnPausar.disabled = true;
  salvarEstado();
  atualizarUI();
  exibirFeedback('Prática pausada. Retome quando estiver confortável.', 'info');
}

function proximaFase() {
  faseIndex++;
  if (faseIndex >= fases.length) {
    faseIndex = 0;
    ciclosConcluidos++;
    atualizarProgresso();
    if (ciclosConcluidos >= TOTAL_CICLOS) {
      finalizarExercicio();
      return;
    }
  }
  tempoRestante = fases[faseIndex].duracao;
  salvarEstado();
  atualizarUI();
}

function finalizarExercicio() {
  emExecucao = false;
  pausado = false;
  window.clearInterval(intervalo);
  btnIniciar.disabled = true;
  btnPausar.disabled = true;
  elStatus.textContent = 'Prática concluída';
  elInstrucao.textContent = 'Você concluiu os ciclos. Descanse e retome somente se estiver confortável.';
  exibirFeedback('Você concluiu os ciclos de prática. Obrigado por respeitar seu próprio ritmo.', 'success');
  try {
    localStorage.removeItem('sopro-controlado-save');
  } catch (erro) {
    console.error('Não foi possível limpar o progresso salvo:', erro);
  }
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

function concluirCaptura() {
  if (!capturaAtiva) return;
  capturaAtiva = false;
  liberarMicrofone();
  btnGravar.disabled = false;
  btnGravar.innerHTML = '<i class="fa-solid fa-microphone" aria-hidden="true"></i> Captar sopro';
  atualizarMedidor(0);

  const duracaoDetectada = Math.round(tempoSomDetectado / 100) / 10;
  if (duracaoDetectada >= 0.4) {
    resultadoEl.textContent = `Som captado por cerca de ${duracaoDetectada} s`;
    exibirFeedback('O microfone captou som durante a tentativa. Se quiser, tente um sopro suave e contínuo.', 'success');
  } else {
    resultadoEl.textContent = 'Som de sopro muito baixo ou não detectado';
    exibirFeedback('Não detectei som suficiente desta vez. Tente em um local silencioso e aproxime o microfone, sem soprar com força.', 'info');
  }
}

function analisarMicrofone() {
  if (!capturaAtiva || !analisador || !bufferAudio) return;

  analisador.getFloatTimeDomainData(bufferAudio);
  const nivel = calcularRms(bufferAudio);
  const tempoAtual = performance.now();
  const tempoDecorrido = tempoAtual - horarioInicioCaptura;
  if (tempoDecorrido < INTERVALO_CALIBRACAO_MS) {
    nivelAmbiente += nivel;
    leiturasAmbiente++;
  } else {
    const nivelMedioAmbiente = leiturasAmbiente ? nivelAmbiente / leiturasAmbiente : 0;
    const limiteSom = Math.max(0.006, nivelMedioAmbiente * 2.2);
    if (nivel >= limiteSom) {
      tempoSomDetectado += Math.min(tempoAtual - ultimaLeitura, 80);
    }
  }
  ultimaLeitura = tempoAtual;
  atualizarMedidor(nivel);
  animationFrame = window.requestAnimationFrame(analisarMicrofone);
}

async function gravarAudio() {
  if (capturaAtiva) return;
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !AudioContextDisponivel) {
    resultadoEl.textContent = 'Microfone incompatível ou indisponível';
    exibirFeedback('A captação precisa de um navegador compatível e de uma conexão segura (HTTPS ou localhost).', 'error');
    return;
  }

  btnGravar.disabled = true;
  btnGravar.innerHTML = '<i class="fa-solid fa-ear-listen" aria-hidden="true"></i> Preparando microfone...';
  resultadoEl.textContent = 'Aguardando permissão do microfone';
  exibirFeedback('Permita o acesso ao microfone para captar o som do sopro.', 'info');

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
    btnGravar.innerHTML = '<i class="fa-solid fa-ear-listen" aria-hidden="true"></i> Captando sopro...';
    resultadoEl.textContent = 'Sopre suavemente perto do microfone';
    exibirFeedback('Captação ativa por 5 segundos. Sopre sem fazer força.', 'info');
    animationFrame = window.requestAnimationFrame(analisarMicrofone);
    capturaTimeout = window.setTimeout(concluirCaptura, DURACAO_CAPTURA_MS);
  } catch (erro) {
    liberarMicrofone();
    btnGravar.disabled = false;
    btnGravar.innerHTML = '<i class="fa-solid fa-microphone" aria-hidden="true"></i> Captar sopro';
    resultadoEl.textContent = 'Captação não iniciada';
    console.error('Erro ao acessar ou analisar o microfone:', erro);
    if (erro.name === 'NotAllowedError' || erro.name === 'PermissionDeniedError') {
      exibirFeedback('O acesso ao microfone foi negado. Autorize-o nas permissões do navegador e tente novamente.', 'error');
    } else if (erro.name === 'NotFoundError' || erro.name === 'DevicesNotFoundError') {
      exibirFeedback('Não encontrei um microfone. Conecte ou habilite um dispositivo e tente novamente.', 'error');
    } else {
      exibirFeedback('Não foi possível iniciar a captação. Verifique as permissões e o microfone e tente novamente.', 'error');
    }
  }
}

function exibirFeedback(mensagem, tipo = 'info') {
  elFeedback.textContent = mensagem;
  elFeedback.className = `feedback ${tipo}`;
}

function reiniciarExercicio() {
  emExecucao = false;
  pausado = false;
  capturaAtiva = false;
  liberarMicrofone();
  btnGravar.disabled = false;
  btnGravar.innerHTML = '<i class="fa-solid fa-microphone" aria-hidden="true"></i> Captar sopro';
  faseIndex = 0;
  tempoRestante = fases[0].duracao;
  ciclosConcluidos = 0;
  window.clearInterval(intervalo);
  try {
    localStorage.removeItem('sopro-controlado-save');
  } catch (erro) {
    console.error('Não foi possível limpar o progresso salvo:', erro);
  }
  btnIniciar.disabled = false;
  btnPausar.disabled = true;
  resultadoEl.textContent = 'Pronto para captar';
  atualizarMedidor(0);
  atualizarProgresso();
  atualizarUI();
  exibirFeedback('Prática reiniciada. Comece quando estiver confortável.', 'info');
}

btnIniciar.addEventListener('click', iniciarCiclo);
btnPausar.addEventListener('click', pausarCiclo);
btnReiniciar.addEventListener('click', reiniciarExercicio);
btnOuvir.addEventListener('click', () => falar(fases[faseIndex].texto));
btnGravar.addEventListener('click', gravarAudio);
window.addEventListener('pagehide', liberarMicrofone);

lerEstadoSalvo();
btnPausar.disabled = true;
atualizarUI();
window.addEventListener('pageshow', atualizarUI);

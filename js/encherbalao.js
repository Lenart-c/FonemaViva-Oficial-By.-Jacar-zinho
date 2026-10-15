const fases = [
  {
    titulo: 'Respire fundo',
    instrucao: 'Inspire pelo nariz por 4 segundos e solte o ar devagar.',
  },
  {
    titulo: 'Solte o ar',
    instrucao: 'Solte o ar suavemente pela boca, sem forçar a voz.',
  },
  {
    titulo: 'Fluxo estável',
    instrucao: 'Continue respirando com calma e mantenha o fluxo confortável.',
  },
  {
    titulo: 'Controle final',
    instrucao: 'Finalize com uma respiração tranquila e sem esforço.',
  }
];

const DURACAO_CAPTURA_MS = 6000;
const INTERVALO_CALIBRACAO_MS = 400;
const AudioContextDisponivel = window.AudioContext || window.webkitAudioContext;

let index = 0;
let acertos = 0;
let concluidos = new Array(fases.length).fill(false);
let ativo = false;
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

const elFase = document.getElementById('fase');
const elInstrucao = document.getElementById('instrucao');
const elResultado = document.getElementById('resultado');
const elFeedback = document.getElementById('feedback');
const elBalao = document.getElementById('balao');
const btnIniciar = document.getElementById('btn-iniciar');
const btnGravar = document.getElementById('btn-gravar');
const btnProximo = document.getElementById('btn-proximo');
const btnReiniciar = document.getElementById('btn-reiniciar');
const elProgresso = document.getElementById('progresso');
const elProgressoTxt = document.getElementById('progresso-texto');
const audioMeter = document.getElementById('audio-meter');
const audioMeterFill = document.getElementById('audio-meter-fill');
const cards = document.querySelectorAll('.step');

function atualizarBarra() {
  const total = fases.length;
  const porcento = Math.round((acertos / total) * 100);
  elProgresso.style.width = porcento + '%';
  elProgressoTxt.textContent = porcento + '%';
}

function salvar() {
  localStorage.setItem('enchar-balao', JSON.stringify({ index, acertos, concluidos }));
}

function carregar() {
  const salvo = JSON.parse(localStorage.getItem('enchar-balao'));
  if (salvo) {
    index = salvo.index || 0;
    acertos = salvo.acertos || 0;
    concluidos = salvo.concluidos || new Array(fases.length).fill(false);
  }
}

function definirFase() {
  const fase = fases[index];
  elFase.textContent = fase.titulo;
  elInstrucao.textContent = fase.instrucao;
  elResultado.textContent = 'Pronto para captar';
  elFeedback.textContent = '';
  btnProximo.disabled = true;
  ativo = false;

  const escalado = 0.95 + index * 0.08;
  elBalao.style.transform = `scale(${escalado})`;
  elBalao.style.filter = index === fases.length - 1 ? 'brightness(1.05)' : 'brightness(1)';

  cards.forEach((card, i) => {
    card.classList.toggle('active', i === index);
  });

  atualizarBarra();
  salvar();
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
  if (capturaAtiva && nivel >= 0.006) {
    elBalao.style.transform = `scale(${Math.min(1.2, 1 + nivel * 8)})`;
  }
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
    if (nivel >= limiteSom) {
      tempoSomDetectado += Math.min(tempoAtual - ultimaLeitura, 80);
    }
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
  elBalao.style.transform = `scale(${0.95 + index * 0.08})`;

  const duracaoDetectada = Math.round(tempoSomDetectado / 100) / 10;
  if (duracaoDetectada >= 0.4) {
    elResultado.textContent = `Som captado por cerca de ${duracaoDetectada} s`;
    elFeedback.textContent = 'O microfone captou som durante a tentativa. Se estiver confortável, avance para a próxima etapa.';
    if (!concluidos[index]) {
      concluidos[index] = true;
      acertos++;
      atualizarBarra();
      salvar();
    }
    btnProximo.disabled = false;
  } else {
    elResultado.textContent = 'Som baixo ou não detectado';
    elFeedback.textContent = 'Não detectei som suficiente. Tente em um local silencioso, aproximando o microfone sem forçar a respiração.';
    btnProximo.disabled = true;
  }
}

async function captarRespiracao() {
  if (!ativo) {
    elFeedback.textContent = 'Toque em “Começar exercício” antes de captar.';
    return;
  }
  if (capturaAtiva) return;
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !AudioContextDisponivel) {
    elResultado.textContent = 'Microfone incompatível ou indisponível';
    elFeedback.textContent = 'A captação precisa de um navegador compatível e de uma conexão segura (HTTPS ou localhost).';
    return;
  }

  btnGravar.disabled = true;
  btnGravar.innerHTML = '<i class="fa-solid fa-ear-listen" aria-hidden="true"></i> Preparando microfone...';
  elResultado.textContent = 'Aguardando permissão do microfone';
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
    elResultado.textContent = 'Respire suavemente perto do microfone';
    elFeedback.textContent = 'Captação ativa por 6 segundos. Respire normalmente, sem prender nem forçar o ar.';
    animationFrame = window.requestAnimationFrame(analisarMicrofone);
    capturaTimeout = window.setTimeout(concluirCaptura, DURACAO_CAPTURA_MS);
  } catch (erro) {
    liberarMicrofone();
    btnGravar.disabled = false;
    btnGravar.innerHTML = '<i class="fa-solid fa-microphone" aria-hidden="true"></i> Captar respiração';
    elResultado.textContent = 'Captação não iniciada';
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

function animarBalao() {
  elBalao.style.transform = 'scale(1.12)';
  elBalao.style.filter = 'brightness(1.08)';

  setTimeout(() => {
    elBalao.style.transform = `scale(${0.95 + index * 0.08})`;
    elBalao.style.filter = 'brightness(1)';
  }, 700);
}

btnIniciar.addEventListener('click', () => {
  animarBalao();
  elFeedback.textContent = 'Respire com calma e capte o som da respiração quando estiver pronto.';
  ativo = true;
});

btnReiniciar.addEventListener('click', () => {
  capturaAtiva = false;
  liberarMicrofone();
  btnGravar.disabled = false;
  btnGravar.innerHTML = '<i class="fa-solid fa-microphone" aria-hidden="true"></i> Captar respiração';
  atualizarMedidor(0);
  index = 0;
  acertos = 0;
  concluidos = new Array(fases.length).fill(false);
  definirFase();
  elResultado.textContent = 'Pronto para captar';
  elFeedback.textContent = 'Exercício reiniciado.';
});

btnProximo.addEventListener('click', () => {
  if (index < fases.length - 1) {
    index++;
    definirFase();
  } else {
    index = 0;
    definirFase();
  }
});

btnGravar.addEventListener('click', captarRespiracao);
window.addEventListener('pagehide', () => {
  capturaAtiva = false;
  liberarMicrofone();
});

carregar();
definirFase();

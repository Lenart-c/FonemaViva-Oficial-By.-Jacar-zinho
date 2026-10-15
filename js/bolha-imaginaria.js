const desafios = [
  { titulo: 'Respire e solte', instrucao: 'Inspire naturalmente e solte o ar devagar, sem fazer força.', classe: 'grow' },
  { titulo: 'Fluxo tranquilo', instrucao: 'Solte o ar de forma suave e contínua, como se estivesse criando uma bolha.', classe: 'grow' },
  { titulo: 'Bolha crescendo', instrucao: 'Respire normalmente e solte um sopro leve perto do microfone.', classe: 'grow' },
  { titulo: 'Encerramento suave', instrucao: 'Finalize com uma respiração tranquila e descanse antes de repetir.', classe: 'shrink' }
];

const DURACAO_CAPTURA_MS = 5000;
const INTERVALO_CALIBRACAO_MS = 400;
const AudioContextDisponivel = window.AudioContext || window.webkitAudioContext;
let index = 0;
let acertos = 0;
let concluidos = new Array(desafios.length).fill(false);
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

const elTitulo = document.getElementById('titulo');
const elInstrucao = document.getElementById('instrucao');
const elResultado = document.getElementById('resultado');
const elFeedback = document.getElementById('feedback');
const elBolha = document.getElementById('bolha');
const btnIniciar = document.getElementById('btn-iniciar');
const btnGravar = document.getElementById('btn-gravar');
const btnProximo = document.getElementById('btn-proximo');
const btnReiniciar = document.getElementById('btn-reiniciar');
const elProgresso = document.getElementById('progresso');
const elProgressoTxt = document.getElementById('progresso-texto');
const audioMeter = document.getElementById('audio-meter');
const audioMeterFill = document.getElementById('audio-meter-fill');

function atualizarBarra() {
  const porcento = Math.round((acertos / desafios.length) * 100);
  elProgresso.style.width = `${porcento}%`;
  elProgressoTxt.textContent = `${porcento}%`;
}

function salvar() {
  try {
    localStorage.setItem('bolha-imaginaria', JSON.stringify({ index, acertos, concluidos }));
  } catch (erro) {
    console.error('Não foi possível salvar o progresso da bolha imaginária:', erro);
    elFeedback.textContent = 'O progresso não pôde ser salvo neste navegador.';
  }
}

function carregar() {
  try {
    const salvo = localStorage.getItem('bolha-imaginaria');
    if (!salvo) return;
    const dados = JSON.parse(salvo);
    if (!dados || typeof dados !== 'object') return;
    if (Number.isInteger(dados.index) && dados.index >= 0 && dados.index < desafios.length) index = dados.index;
    if (Number.isInteger(dados.acertos) && dados.acertos >= 0 && dados.acertos <= desafios.length) acertos = dados.acertos;
    if (Array.isArray(dados.concluidos) && dados.concluidos.length === desafios.length) {
      concluidos = dados.concluidos.map((valor) => Boolean(valor));
      acertos = concluidos.filter(Boolean).length;
    }
  } catch (erro) {
    console.error('Não foi possível carregar o progresso da bolha imaginária:', erro);
    elFeedback.textContent = 'O progresso salvo não pôde ser carregado. Você pode recomeçar o exercício.';
  }
}

function definirDesafio() {
  const desafio = desafios[index];
  elTitulo.textContent = desafio.titulo;
  elInstrucao.textContent = desafio.instrucao;
  elResultado.textContent = 'Pronto para captar';
  elFeedback.textContent = 'Toque em “Captar sopro” e sopre suavemente perto do microfone.';
  elBolha.className = `bubble ${desafio.classe}`;
  elBolha.style.transform = '';
  btnGravar.disabled = false;
  btnGravar.innerHTML = '<i class="fa-solid fa-microphone" aria-hidden="true"></i> Captar sopro';
  btnProximo.disabled = !concluidos[index];
  btnProximo.textContent = index === desafios.length - 1 ? 'Concluir exercício' : 'Próximo →';
  atualizarMedidor(0);
  atualizarBarra();
  salvar();
}

function iniciarAnimacao() {
  elBolha.classList.add('grow');
  elFeedback.textContent = 'Acompanhe a bolha e respire com suavidade. Não prenda o ar.';
  window.setTimeout(() => elBolha.classList.remove('grow'), 800);
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
  const escalaBolha = 1 + Math.min(0.35, percentual / 300);
  if (capturaAtiva) elBolha.style.transform = `scale(${escalaBolha})`;
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
      console.error('Não foi possível fechar o processamento do áudio:', erro);
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
    if (nivel >= Math.max(0.006, nivelMedioAmbiente * 2.2)) {
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
  btnGravar.innerHTML = '<i class="fa-solid fa-microphone" aria-hidden="true"></i> Captar sopro';
  elBolha.style.transform = '';
  atualizarMedidor(0);

  const duracaoDetectada = Math.round(tempoSomDetectado / 100) / 10;
  if (duracaoDetectada >= 0.4) {
    elResultado.textContent = `Som captado por cerca de ${duracaoDetectada} s`;
    elFeedback.textContent = 'O microfone captou som durante a tentativa. Continue respirando e soprando suavemente, sem forçar.';
    if (!concluidos[index]) {
      concluidos[index] = true;
      acertos++;
      atualizarBarra();
      salvar();
    }
    btnProximo.disabled = false;
  } else {
    elResultado.textContent = 'Som baixo ou não detectado';
    elFeedback.textContent = 'Não detectei som suficiente. Tente em um local silencioso e aproxime o microfone, sem soprar com força.';
  }
}

async function captarSopro() {
  if (capturaAtiva) return;
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !AudioContextDisponivel) {
    elResultado.textContent = 'Microfone incompatível ou indisponível';
    elFeedback.textContent = 'A captação precisa de um navegador compatível e de uma conexão segura (HTTPS ou localhost).';
    return;
  }

  btnGravar.disabled = true;
  btnGravar.innerHTML = '<i class="fa-solid fa-ear-listen" aria-hidden="true"></i> Preparando microfone...';
  elResultado.textContent = 'Aguardando permissão do microfone';
  elFeedback.textContent = 'Permita o acesso ao microfone para captar o som.';

  try {
    streamAtual = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false }
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
    elResultado.textContent = 'Sopre suavemente perto do microfone';
    elFeedback.textContent = 'Captação ativa por 5 segundos. Sopre sem fazer força.';
    animationFrame = window.requestAnimationFrame(analisarMicrofone);
    capturaTimeout = window.setTimeout(concluirCaptura, DURACAO_CAPTURA_MS);
  } catch (erro) {
    liberarMicrofone();
    btnGravar.disabled = false;
    btnGravar.innerHTML = '<i class="fa-solid fa-microphone" aria-hidden="true"></i> Captar sopro';
    elResultado.textContent = 'Captação não iniciada';
    console.error('Erro ao acessar ou analisar o microfone:', erro);
    if (erro.name === 'NotAllowedError' || erro.name === 'PermissionDeniedError') {
      elFeedback.textContent = 'O acesso ao microfone foi negado. Autorize-o nas permissões do navegador e tente novamente.';
    } else if (erro.name === 'NotFoundError' || erro.name === 'DevicesNotFoundError') {
      elFeedback.textContent = 'Não encontrei um microfone. Conecte ou habilite um dispositivo e tente novamente.';
    } else {
      elFeedback.textContent = 'Não foi possível iniciar a captação. Verifique as permissões e tente novamente.';
    }
  }
}

function reiniciar() {
  capturaAtiva = false;
  liberarMicrofone();
  index = 0;
  acertos = 0;
  concluidos = new Array(desafios.length).fill(false);
  definirDesafio();
  elFeedback.textContent = 'Exercício reiniciado. Comece quando estiver confortável.';
}

btnIniciar.addEventListener('click', iniciarAnimacao);
btnGravar.addEventListener('click', captarSopro);
btnProximo.addEventListener('click', () => {
  if (btnProximo.disabled) return;
  if (index < desafios.length - 1) {
    index++;
    definirDesafio();
    return;
  }
  index = 0;
  acertos = 0;
  concluidos = new Array(desafios.length).fill(false);
  definirDesafio();
  elFeedback.textContent = 'Você concluiu as etapas. O exercício recomeçou para uma nova prática.';
});
btnReiniciar.addEventListener('click', reiniciar);
window.addEventListener('pagehide', () => {
  capturaAtiva = false;
  liberarMicrofone();
});

carregar();
definirDesafio();

const fases = [
  {
    nome: 'Inspire',
    duracao: 5,
    texto: 'Inspire pelo nariz por 5 segundos, preenchendo os pulmões com ar.',
    alvo: ['inspire', 'respire', 'respiração']
  },
  {
    nome: 'Sopro Forte',
    duracao: 3,
    texto: 'Sopre forte pela boca por 3 segundos, mantendo o fluxo de ar contínuo e intenso.',
    alvo: ['sop', 'pf', 'pfff', 'sopro', 'ar', 'fluxo']
  },
  {
    nome: 'Sopro Fraco',
    duracao: 5,
    texto: 'Sopre de forma fraca e controlada por 5 segundos, diminuindo a pressão de ar gradualmente.',
    alvo: ['pff', 'fff', 'suave', 'fraco', 'controlado']
  },
  {
    nome: 'Recupere-se',
    duracao: 3,
    texto: 'Respire normalmente por 3 segundos para recuperação antes do próximo ciclo.',
    alvo: ['respire', 'recuper', 'repouso']
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
  localStorage.setItem('sopro-controlado-progress', porcentagem);
  window.dispatchEvent(new Event('progressoAtualizado'));
}

function salvarEstado() {
  localStorage.setItem(
    'sopro-controlado-save',
    JSON.stringify({
      faseIndex,
      tempoRestante,
      ciclosConcluidos
    })
  );
}

function carregarEstado() {
  const salvo = localStorage.getItem('sopro-controlado-save');

  if (!salvo) return;

  try {
    const dados = JSON.parse(salvo);
    if (dados && typeof dados === 'object') {
      faseIndex = Number(dados.faseIndex ?? 0);
      tempoRestante = Number(dados.tempoRestante ?? fases[faseIndex].duracao);
      ciclosConcluidos = Number(dados.ciclosConcluidos ?? 0);
    }
  } catch (erro) {
    console.error('Erro ao carregar sopro-controlado:', erro);
  }
}

function atualizarUI() {
  const faseAtual = fases[faseIndex];
  elFaseBadge.textContent = faseAtual.nome;
  elTempo.textContent = String(tempoRestante).padStart(2, '0');
  elInstrucao.textContent = faseAtual.texto;
  elStatus.textContent = `${faseAtual.nome} em progresso`;
  elCiclos.textContent = `${ciclosConcluidos} / ${TOTAL_CICLOS}`;

  if (emExecucao) {
    timerCircle.classList.add('active');
  } else {
    timerCircle.classList.remove('active');
  }
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

function iniciarCiclo() {
  emExecucao = true;
  btnIniciar.disabled = true;
  btnPausar.disabled = false;
  atualizarUI();

  intervalo = setInterval(() => {
    tempoRestante--;

    if (tempoRestante <= 0) {
      exibirFeedback(`✓ ${fases[faseIndex].nome} concluído!`, 'success');

      if (faseIndex === 1 || faseIndex === 2) {
        executarAcaoSopro();
      }

      proximaFase();
    }

    atualizarUI();
  }, 1000);
}

function pausarCiclo() {
  emExecucao = false;
  clearInterval(intervalo);
  btnIniciar.disabled = false;
  btnPausar.disabled = true;
  salvarEstado();
  atualizarUI();
  exibirFeedback('⏸️ Exercício pausado', 'info');
}

function finalizarExercicio() {
  emExecucao = false;
  clearInterval(intervalo);
  btnIniciar.disabled = false;
  btnPausar.disabled = true;
  elStatus.textContent = '✓ Exercício concluído!';
  exibirFeedback('🎉 Excelente! Você completou todos os ciclos de sopro controlado!', 'success');
  localStorage.removeItem('sopro-controlado-save');
}

function executarAcaoSopro() {
  const fase = fases[faseIndex];
  if (fase.nome === 'Sopro Forte' || fase.nome === 'Sopro Fraco') {
    // Simulação visual do sopro
    timerCircle.style.transform = 'scale(1.1)';
    setTimeout(() => {
      timerCircle.style.transform = 'scale(1)';
    }, 300);
  }
}

function gravarAudio() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    exibirFeedback('⚠️ Gravação não disponível neste navegador', 'error');
    return;
  }

  btnGravar.disabled = true;
  btnGravar.textContent = '🎤 Gravando...';

  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      const mediaRecorder = new MediaRecorder(stream);
      let chunks = [];

      mediaRecorder.addEventListener('dataavailable', event => {
        chunks.push(event.data);
      });

      mediaRecorder.addEventListener('stop', () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        stream.getTracks().forEach(track => track.stop());

        // Simulação de processamento
        setTimeout(() => {
          const feedback = gerarFeedbackSopro();
          resultadoEl.textContent = feedback.mensagem;
          exibirFeedback(feedback.texto, feedback.tipo);

          btnGravar.disabled = false;
          btnGravar.textContent = '🎤 Gravar sopro';
        }, 1500);
      });

      // Gravar por 3 segundos
      mediaRecorder.start();
      setTimeout(() => mediaRecorder.stop(), 3000);
    })
    .catch(erro => {
      console.error('Erro ao acessar microfone:', erro);
      exibirFeedback('❌ Não foi possível acessar o microfone', 'error');
      btnGravar.disabled = false;
      btnGravar.textContent = '🎤 Gravar sopro';
    });
}

function gerarFeedbackSopro() {
  const aleatorio = Math.random();

  if (aleatorio > 0.6) {
    return {
      mensagem: '✓ Sopro controlado',
      texto: '👏 Ótimo! Você manteve o sopro controlado corretamente.',
      tipo: 'success'
    };
  } else if (aleatorio > 0.3) {
    return {
      mensagem: '~ Sopro parcial',
      texto: '📢 Tente manter o sopro mais constante na próxima vez.',
      tipo: 'info'
    };
  } else {
    return {
      mensagem: '✗ Sopro não detectado',
      texto: '💡 Aproxime o microfone e sopre com mais pressão de ar.',
      tipo: 'error'
    };
  }
}

function exibirFeedback(mensagem, tipo = 'info') {
  elFeedback.textContent = mensagem;
  elFeedback.className = `feedback ${tipo}`;

  if (tipo !== 'error') {
    setTimeout(() => {
      elFeedback.textContent = '';
      elFeedback.className = 'feedback';
    }, 4000);
  }
}

function resetarExercicio() {
  emExecucao = false;
  faseIndex = 0;
  tempoRestante = fases[0].duracao;
  ciclosConcluidos = 0;
  clearInterval(intervalo);
  localStorage.removeItem('sopro-controlado-save');
  btnIniciar.disabled = false;
  btnPausar.disabled = true;
  resultadoEl.textContent = '...';
  atualizarProgresso();
  atualizarUI();
  exibirFeedback('🔄 Exercício reiniciado', 'info');
}

// Event Listeners
btnIniciar.addEventListener('click', iniciarCiclo);
btnPausar.addEventListener('click', pausarCiclo);
btnOuvir.addEventListener('click', () => {
  const fase = fases[faseIndex];
  falar(fase.texto);
  exibirFeedback('🔊 Ouvindo instrução...', 'info');
});
btnGravar.addEventListener('click', gravarAudio);

// Inicialização
carregarEstado();
atualizarProgresso();
atualizarUI();

// Recuperar progresso ao voltar
window.addEventListener('pageshow', () => {
  carregarEstado();
  atualizarUI();
});

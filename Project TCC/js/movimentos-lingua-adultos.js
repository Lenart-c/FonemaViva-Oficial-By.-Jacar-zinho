// Exercícios avançados de coordenação oral para adultos
const exercicios = [
  {
    id: 1,
    titulo: 'Movimento 1: Língua para Cima e para Baixo',
    instrucao: 'Mova a língua para cima tocando o palato, depois para baixo tocando o chão da boca.',
    beneficio: 'Melhora a precisão articulatória de sons linguodentais (D, T) e a coordenação velofaríngea.',
    alvo: ['data', 'tata', 'dada', 'ta', 'da'],
    dica: 'Repita com velocidade constante: DA-TA-DA-TA',
    tempo_estimado: 45
  },
  {
    id: 2,
    titulo: 'Movimento 2: Protusão Lateral da Língua',
    instrucao: 'Projete a língua para frente e depois mova-a para os lados (esquerda-direita).',
    beneficio: 'Fortalece a musculatura lateral da língua e melhora a articulação de sons como L e R.',
    alvo: ['la', 'lo', 'lu', 'le', 'li', 'ra', 'ro', 'ru', 're', 'ri'],
    dica: 'Faça movimentos lentos e controlados: LA-LO-LU-LE-LI',
    tempo_estimado: 50
  },
  {
    id: 3,
    titulo: 'Movimento 3: Vibrações da Língua',
    instrucao: 'Mantenha a língua relaxada enquanto sopra ar para fazer vibrações (como um motor).',
    beneficio: 'Desenvolve o controle motor fino necessário para sons vibrantes como o R retroflexo.',
    alvo: ['rrr', 'brrr', 'grrr', 'prr'],
    dica: 'Comece lentamente e aumente a velocidade gradualmente',
    tempo_estimado: 45
  },
  {
    id: 4,
    titulo: 'Movimento 4: Flexão de Língua Apical',
    instrucao: 'Toque a ponta da língua nos alvéolos (logo atrás dos dentes) e faça um movimento de flexão.',
    beneficio: 'Melhora a articulação de sons dentais e apicais (T, D, N) com maior precisão.',
    alvo: ['n', 'na', 'no', 'nu', 'ne', 'ni', 'tat', 'tit', 'tot'],
    dica: 'Movimento preciso e controlado: NAN-NEN-NIN-NON-NUN',
    tempo_estimado: 50
  },
  {
    id: 5,
    titulo: 'Movimento 5: Elevação do Dorso Lingual',
    instrucao: 'Eleve o dorso (parte central) da língua em direção ao palato duro, depois ao palato mole.',
    beneficio: 'Desenvolve coordenação para sons velares (K, G) e melhora a qualidade vocálica.',
    alvo: ['ka', 'ko', 'ku', 'ke', 'ki', 'ga', 'go', 'gu', 'ge', 'gi'],
    dica: 'Variação de altura: KA (palato duro) → KO (palato mole)',
    tempo_estimado: 50
  },
  {
    id: 6,
    titulo: 'Movimento 6: Sequência Coordenada Complexa',
    instrucao: 'Combine vários movimentos em sequência: cima-baixo, lateral, protusão (coordenação completa).',
    beneficio: 'Integração de todos os padrões motores para melhorar a inteligibilidade da fala geral.',
    alvo: ['patalala', 'katataka', 'dadalada', 'tatalata', 'nanalana', 'lalatala'],
    dica: 'Mantenha ritmo regular: PA-TA-LA-LA PA-TA-LA-LA',
    tempo_estimado: 60
  }
];

// Variáveis de Estado
let indexAtual = 0;
let acertos = 0;
let tentativas = 0;
let totalSessao = 0;
let concluidos = new Array(exercicios.length).fill(false);
let tempoInicio = null;
let historicoSessao = [];

// Elementos DOM
const elTitulo = document.getElementById('titulo');
const elInstrucao = document.getElementById('instrucao');
const elBeneficio = document.getElementById('beneficio');
const elResultado = document.getElementById('resultado');
const elFeedback = document.getElementById('feedback-message');
const elProgressoTxt = document.getElementById('progresso-texto');
const elProgresso = document.getElementById('progresso');
const elStatusText = document.getElementById('status-text');
const elStatusFill = document.getElementById('status-fill');
const elAttempts = document.getElementById('attempts-number');
const elAttemptsInfo = document.getElementById('attempts-text');
const elAttemptDots = document.getElementById('attempt-dots');
const elExNumero = document.getElementById('ex-numero');
const elFeedbackResult = document.getElementById('feedback-result');
const elInfoText = document.getElementById('info-text');
const elResultsCard = document.getElementById('results-card');
const elExerciseCard = document.querySelector('.exercise-card');

const btnDemonstrar = document.getElementById('btn-demonstrar');
const btnGravar = document.getElementById('btn-gravar');
const btnRepetir = document.getElementById('btn-repetir');
const btnProximo = document.getElementById('btn-proximo');
const btnReiniciar = document.getElementById('btn-reiniciar');
const btnNovaSessao = document.getElementById('btn-nova-sessao');
let recognition = null;

// Funções Auxiliares
function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '')
    .trim();
}

function calcularProgresso() {
  return Math.round((acertos / exercicios.length) * 100);
}

function atualizarBarra() {
  const progresso = calcularProgresso();
  elProgresso.style.width = progresso + '%';
  elProgressoTxt.textContent = acertos + '/' + exercicios.length;
}

function atualizarStatusIndicator(porcentagem) {
  elStatusFill.style.width = porcentagem + '%';
}

function falarTexto(texto) {
  if (!('speechSynthesis' in window)) {
    mostrarFeedback('error', '⚠️ Seu navegador não suporta reprodução de áudio.');
    return;
  }

  window.speechSynthesis.cancel();
  const mensagem = new SpeechSynthesisUtterance(texto);
  mensagem.lang = 'pt-BR';
  mensagem.rate = 0.9;
  mensagem.pitch = 1;
  mensagem.volume = 1;
  window.speechSynthesis.speak(mensagem);
}

function definirExercicio() {
  const exercicio = exercicios[indexAtual];
  tentativas = 0;
  
  elTitulo.textContent = exercicio.titulo;
  elInstrucao.textContent = exercicio.instrucao;
  elBeneficio.textContent = exercicio.beneficio;
  elExNumero.textContent = (indexAtual + 1) + '/' + exercicios.length;
  
  elResultado.textContent = '...';
  elFeedback.textContent = '';
  elFeedback.classList.remove('success', 'error', 'info');
  elFeedbackResult.style.display = 'none';
  elAttemptsInfo.textContent = 'Tentativas: 0';
  elAttemptDots.innerHTML = '';
  elInfoText.textContent = exercicio.dica;
  
  btnProximo.disabled = true;
  btnRepetir.style.display = 'none';
  btnGravar.style.display = 'flex';
  
  const textoAudio = `Repita: ${exercicio.alvo.join(', ')}. ${exercicio.dica}`;
  setTimeout(() => falarTexto(textoAudio), 300);

  atualizarBarra();
  atualizarStatusIndicator(calcularProgresso());
  salvarSessao();
}

function verificarResposta(texto) {
  const exercicio = exercicios[indexAtual];
  const normal = normalizar(texto);
  
  if (!normal) return false;
  
  return exercicio.alvo.some((palavra) => {
    const normPalavra = normalizar(palavra);
    const similaridade = calcularSimilaridade(normal, normPalavra);
    return similaridade >= 0.7; // 70% de similaridade
  });
}

function calcularSimilaridade(str1, str2) {
  const len1 = str1.length;
  const len2 = str2.length;
  const matriz = Array(len1 + 1).fill(null).map(() => Array(len2 + 1).fill(0));

  for (let i = 0; i <= len1; i++) matriz[i][0] = i;
  for (let j = 0; j <= len2; j++) matriz[0][j] = j;

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        matriz[i][j] = matriz[i - 1][j - 1];
      } else {
        matriz[i][j] = 1 + Math.min(
          matriz[i - 1][j],
          matriz[i][j - 1],
          matriz[i - 1][j - 1]
        );
      }
    }
  }

  const maxLen = Math.max(len1, len2);
  return 1 - (matriz[len1][len2] / maxLen);
}

function mostrarFeedback(tipo, mensagem) {
  elFeedback.textContent = mensagem;
  elFeedback.classList.remove('success', 'error', 'info');
  elFeedback.classList.add(tipo);
}

function salvarSessao() {
  localStorage.setItem('movimentos-lingua-adultos', JSON.stringify({
    indexAtual,
    acertos,
    concluidos,
    historicoSessao
  }));
}

function carregarSessao() {
  const salvo = JSON.parse(localStorage.getItem('movimentos-lingua-adultos'));
  if (salvo) {
    indexAtual = salvo.indexAtual || 0;
    acertos = salvo.acertos || 0;
    concluidos = salvo.concluidos || new Array(exercicios.length).fill(false);
    historicoSessao = salvo.historicoSessao || [];
  }
  tempoInicio = Date.now();
}

function atualizarAttemptDots() {
  elAttemptDots.innerHTML = '';
  for (let i = 0; i < Math.min(tentativas, 6); i++) {
    const dot = document.createElement('div');
    dot.className = 'attempt-dot active';
    elAttemptDots.appendChild(dot);
  }
  if (tentativas > 6) {
    const maisText = document.createElement('span');
    maisText.textContent = `+${tentativas - 6}`;
    maisText.style.color = '#cbd5e1';
    maisText.style.fontSize = '0.75rem';
    elAttemptDots.appendChild(maisText);
  }
}

function finalizarSessao() {
  const tempoFinal = Date.now();
  const tempoTotal = Math.round((tempoFinal - tempoInicio) / 60000); // minutos
  
  // Mostrar card de resultados
  elExerciseCard.style.display = 'none';
  elResultsCard.style.display = 'block';
  
  const percentual = calcularProgresso();
  document.getElementById('result-completed').textContent = acertos + '/' + exercicios.length;
  document.getElementById('result-success').textContent = percentual + '%';
  document.getElementById('result-time').textContent = tempoTotal + ' min';
  
  // Gerar recomendações
  const recommendations = document.getElementById('recommendations');
  let recommendationText = '<h3>📋 Recomendações para Próximas Sessões</h3><ul>';
  
  if (percentual === 100) {
    recommendationText += '<li>Excelente! Todos os movimentos foram executados com sucesso!</li>';
    recommendationText += '<li>Considere praticar com velocidade aumentada para maior controle motor.</li>';
    recommendationText += '<li>Tente combinar os movimentos em palavras e frases mais complexas.</li>';
  } else if (percentual >= 75) {
    recommendationText += '<li>Ótimo progresso! Continue praticando regularmente.</li>';
    recommendationText += '<li>Foque nos movimentos que tiveram mais dificuldade.</li>';
    recommendationText += '<li>Aumente gradualmente a velocidade dos movimentos.</li>';
  } else if (percentual >= 50) {
    recommendationText += '<li>Bom começo! Pratique os exercícios diariamente.</li>';
    recommendationText += '<li>Recomenda-se fazer uma sessão de 3 a 4 vezes por semana.</li>';
    recommendationText += '<li>Consulte um fonoaudiólogo para orientação personalizada.</li>';
  } else {
    recommendationText += '<li>Continue praticando com paciência e consistência.</li>';
    recommendationText += '<li>Recomenda-se orientação de um profissional especializado.</li>';
    recommendationText += '<li>Pratique em frente a um espelho para melhor feedback visual.</li>';
  }
  
  recommendationText += '<li>Registre seu progresso e tente melhorar a cada sessão.</li></ul>';
  recommendations.innerHTML = recommendationText;
}

// Speech Recognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.lang = 'pt-BR';
  recognition.continuous = false;
  recognition.interimResults = false;

  btnDemonstrar.addEventListener('click', () => {
    const exercicio = exercicios[indexAtual];
    const textoAudio = `Repita: ${exercicio.alvo.join(', ')}. ${exercicio.dica}`;
    falarTexto(textoAudio);
    mostrarFeedback('info', `🎯 Dica: ${exercicio.dica}`);
    btnDemonstrar.textContent = '✓ Ouviu';
    btnDemonstrar.disabled = true;
    setTimeout(() => {
      btnDemonstrar.disabled = false;
      btnDemonstrar.textContent = '🔊 Ouvir palavra';
    }, 2000);
  });

  btnGravar.addEventListener('click', () => {
    try {
      tentativas++;
      elAttempts.textContent = tentativas;
      atualizarAttemptDots();
      elFeedbackResult.style.display = 'none';
      elFeedback.textContent = '';
      
      recognition.start();
      btnGravar.textContent = '🎙️ Ouvindo...';
      btnGravar.disabled = true;
      mostrarFeedback('info', '🗣️ Fale agora! Execute o movimento enquanto pronuncia...');
    } catch (error) {
      mostrarFeedback('error', '❌ Não foi possível iniciar a gravação.');
    }
  });

  recognition.onresult = (evento) => {
    const texto = Array.from(evento.results)
      .map((resultado) => resultado[0].transcript)
      .join(' ');

    elResultado.textContent = `"${texto.trim()}"`;
    elFeedbackResult.style.display = 'block';
    
    historicoSessao.push({
      exercicio: indexAtual,
      pronuncia: texto,
      timestamp: new Date().toISOString()
    });

    if (verificarResposta(texto)) {
      if (!concluidos[indexAtual]) {
        concluidos[indexAtual] = true;
        acertos++;
        atualizarBarra();
        salvarSessao();
      }
      
      const mensagens = [
        '✨ Excelente! Movimento executado com precisão!',
        '🎉 Perfeito! Ótima coordenação oral!',
        '👏 Muito bem! Qualidade articulatória ótima!',
        '🌟 Fantástico! Excelente controle motor!'
      ];
      const msg = mensagens[Math.floor(Math.random() * mensagens.length)];
      mostrarFeedback('success', msg);
      
      btnProximo.disabled = false;
      btnRepetir.style.display = 'none';
    } else {
      const mensagens = [
        '🔄 Quase lá! Tente novamente com mais atenção ao movimento.',
        '💪 Pode tentar mais uma vez! Foco no movimento lingual.',
        '👂 Não ouvi bem. Pronuncie com mais clareza!',
        '😊 Tente novamente! Siga o padrão de movimento.'
      ];
      const msg = mensagens[Math.floor(Math.random() * mensagens.length)];
      mostrarFeedback('error', msg);
      
      btnProximo.disabled = true;
      btnRepetir.style.display = 'flex';
    }

    totalSessao++;
  };

  recognition.onerror = () => {
    mostrarFeedback('error', '🎤 Não foi possível capturar o áudio. Tente novamente.');
  };

  recognition.onend = () => {
    btnGravar.textContent = '🎤 Gravar Execução';
    btnGravar.disabled = false;
  };
} else {
  btnGravar.disabled = true;
  btnGravar.textContent = '🎤 Indisponível';
  mostrarFeedback('error', '⚠️ Seu navegador não suporta reconhecimento de voz.');
}

// Event Listeners
btnRepetir.addEventListener('click', () => {
  tentativas++;
  elAttempts.textContent = tentativas;
  atualizarAttemptDots();
  try {
    recognition.start();
    btnGravar.textContent = '🎙️ Ouvindo...';
    btnGravar.disabled = true;
  } catch (error) {
    mostrarFeedback('error', '❌ Erro ao tentar gravar.');
  }
});

btnProximo.addEventListener('click', () => {
  if (indexAtual < exercicios.length - 1) {
    indexAtual++;
    definirExercicio();
  } else {
    finalizarSessao();
  }
});

btnReiniciar.addEventListener('click', () => {
  indexAtual = 0;
  acertos = 0;
  tentativas = 0;
  totalSessao = 0;
  concluidos = new Array(exercicios.length).fill(false);
  historicoSessao = [];
  definirExercicio();
  mostrarFeedback('info', '🔄 Sessão reiniciada. Boa sorte!');
});

btnNovaSessao.addEventListener('click', () => {
  indexAtual = 0;
  acertos = 0;
  tentativas = 0;
  totalSessao = 0;
  concluidos = new Array(exercicios.length).fill(false);
  historicoSessao = [];
  tempoInicio = Date.now();
  
  elResultsCard.style.display = 'none';
  elExerciseCard.style.display = 'grid';
  
  definirExercicio();
  mostrarFeedback('info', '🚀 Nova sessão iniciada!');
});

// Inicializar
carregarSessao();
definirExercicio();

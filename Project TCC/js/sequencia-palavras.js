// =============================================
// CONFIGURAÇÃO DE SEQUÊNCIAS
// =============================================

const sequencias = [
  {
    palavras: ["planejamento", "preferência", "preparação"],
    tema: "Aliteração - /pr/",
  },
  {
    palavras: ["criatividade", "credibilidade", "produtividade"],
    tema: "Aliteração - /cr/ e /pr/",
  },
  {
    palavras: ["comunicação", "compreensão", "concentração"],
    tema: "Aliteração - /com/",
  },
  {
    palavras: ["profissional", "procedimento", "produtividade"],
    tema: "Aliteração - /pr/ e /pro/",
  },
  {
    palavras: ["transformação", "transferência", "transmissão"],
    tema: "Aliteração - /tr/",
  },
];

// =============================================
// VARIÁVEIS GLOBAIS
// =============================================

let indiceatual = 0;
let mediaRecorder = null;
let audioChunks = [];
let reconhecimento = null;

// =============================================
// INICIALIZAÇÃO
// =============================================

function inicializar() {
  verificarSessao();
  configurarSpeechRecognition();
  exibirSequencia();

  // Event Listeners
  document.getElementById("play").addEventListener("click", reproduzirAudio);
  document.getElementById("gravar").addEventListener("click", alternarGravacao);
  document.getElementById("proximo").addEventListener("click", proximaSequencia);
  document.getElementById("anterior").addEventListener("click", sequenciaAnterior);
}

// =============================================
// VERIFICAÇÃO DE SESSÃO
// =============================================

function verificarSessao() {
  const usuarioId =
    localStorage.getItem("usuarioId") ||
    sessionStorage.getItem("usuarioId");

  if (!usuarioId) {
    window.location.replace("../index.html");
  }
}

// =============================================
// CONFIGURAÇÃO DO SPEECH RECOGNITION
// =============================================

function configurarSpeechRecognition() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    console.warn("Speech Recognition não disponível neste navegador");
    document.getElementById("gravar").disabled = true;
    return;
  }

  reconhecimento = new SpeechRecognition();
  reconhecimento.lang = "pt-BR";
  reconhecimento.continuous = false;
  reconhecimento.interimResults = false;

  reconhecimento.onstart = () => {
    document.getElementById("mic-status").classList.remove("hidden");
    document.getElementById("gravar").disabled = true;
  };

  reconhecimento.onresult = (event) => {
    let transcript = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      if (event.results[i].isFinal) {
        transcript += event.results[i][0].transcript;
      }
    }

    exibirResultado(transcript);
    analisarPronuncia(transcript);
  };

  reconhecimento.onend = () => {
    document.getElementById("mic-status").classList.add("hidden");
    document.getElementById("gravar").disabled = false;
  };

  reconhecimento.onerror = (event) => {
    console.error("Erro no reconhecimento de voz:", event.error);
    mostrarFeedback(
      "Erro ao reconhecer voz. Tente novamente.",
      "erro"
    );
    document.getElementById("mic-status").classList.add("hidden");
    document.getElementById("gravar").disabled = false;
  };
}

// =============================================
// EXIBIR SEQUÊNCIA
// =============================================

function exibirSequencia() {
  const sequenciaAtual = sequencias[indiceatual];

  // Atualizar palavras
  document.getElementById("palavra-1").textContent = sequenciaAtual.palavras[0];
  document.getElementById("palavra-2").textContent = sequenciaAtual.palavras[1];
  document.getElementById("palavra-3").textContent = sequenciaAtual.palavras[2];

  // Atualizar progresso
  const percentual = ((indiceatual + 1) / sequencias.length) * 100;
  document.getElementById("progresso").style.width = percentual + "%";
  document.getElementById("progresso-texto").textContent =
    `${indiceatual + 1}/${sequencias.length}`;

  // Limpar feedback
  document.getElementById("feedback").textContent = "";
  document.getElementById("resultado").textContent =
    'Clique em "Gravar Pronúncia" para começar';

  // Atualizar status dos botões
  document.getElementById("anterior").disabled = indiceatual === 0;
  document.getElementById("proximo").disabled = true; // Será habilitado após feedback positivo
}

// =============================================
// REPRODUZIR ÁUDIO
// =============================================

function reproduzirAudio() {
  const sequenciaAtual = sequencias[indiceatual];
  const texto = sequenciaAtual.palavras.join(" ");

  // Usar Web Speech API para síntese de voz
  const utterance = new SpeechSynthesisUtterance(texto);
  utterance.lang = "pt-BR";
  utterance.rate = 0.8; // Velocidade mais lenta para melhor pronúncia
  utterance.pitch = 1;
  utterance.volume = 1;

  // Desabilitar botão durante a reprodução
  const botaoPlay = document.getElementById("play");
  botaoPlay.disabled = true;

  utterance.onend = () => {
    botaoPlay.disabled = false;
  };

  speechSynthesis.speak(utterance);
}

// =============================================
// ALTERNAR GRAVAÇÃO
// =============================================

function alternarGravacao() {
  if (reconhecimento) {
    reconhecimento.start();
  } else {
    mostrarFeedback(
      "Microfone não disponível neste navegador",
      "erro"
    );
  }
}

// =============================================
// EXIBIR RESULTADO
// =============================================

function exibirResultado(transcript) {
  document.getElementById("resultado").textContent = transcript || "Não foi possível capturar áudio";
}

// =============================================
// ANALISAR PRONÚNCIA
// =============================================

function analisarPronuncia(transcript) {
  const sequenciaAtual = sequencias[indiceatual];
  const palavrasOridginais = sequenciaAtual.palavras;

  // Normalizar texto para comparação
  const transcriptLower = transcript
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // Remove acentos

  const palavrasNormalizadas = palavrasOridginais.map((p) =>
    p
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
  );

  // Verificar correspondência
  let pontuacao = 0;
  let palavrasIdentificadas = 0;

  palavrasNormalizadas.forEach((palavra) => {
    if (transcriptLower.includes(palavra)) {
      palavrasIdentificadas++;
      pontuacao += 33.33; // Cada palavra vale ~33%
    }
  });

  pontuacao = Math.min(pontuacao, 100);

  // Gerar feedback
  gerarFeedback(pontuacao, palavrasIdentificadas, palavrasNormalizadas.length);
}

// =============================================
// GERAR FEEDBACK
// =============================================

function gerarFeedback(pontuacao, acertos, total) {
  let mensagem = "";
  let tipo = "";

  if (pontuacao >= 80) {
    mensagem = `🎉 Excelente! Você pronunciou ${acertos}/${total} palavras corretamente com fluidez!`;
    tipo = "sucesso";
    document.getElementById("proximo").disabled = false;
  } else if (pontuacao >= 60) {
    mensagem = `👍 Bom! Você acertou ${acertos}/${total} palavras. Tente novamente focando na fluidez.`;
    tipo = "info";
  } else if (pontuacao >= 40) {
    mensagem = `💡 Mais uma vez! Você acertou ${acertos}/${total} palavras. Tente pronunciar com mais cuidado.`;
    tipo = "info";
  } else {
    mensagem = `🔄 Vamos tentar novamente! Ouça o exemplo e foque em cada palavra.`;
    tipo = "erro";
  }

  mostrarFeedback(mensagem, tipo);
}

// =============================================
// MOSTRAR FEEDBACK
// =============================================

function mostrarFeedback(mensagem, tipo) {
  const feedbackElement = document.getElementById("feedback");
  feedbackElement.textContent = mensagem;
  feedbackElement.className = tipo;
}

// =============================================
// NAVEGAÇÃO - PRÓXIMA SEQUÊNCIA
// =============================================

function proximaSequencia() {
  if (indiceatual < sequencias.length - 1) {
    indiceatual++;
    exibirSequencia();
    document.getElementById("proximo").disabled = true;

    // Animar transição
    const palabrasContainer = document.querySelector(".palavras-container");
    palabrasContainer.style.animation = "none";
    setTimeout(() => {
      palabrasContainer.style.animation = "fadeIn 0.5s ease-out";
    }, 10);
  } else {
    finalizarExercicio();
  }
}

// =============================================
// NAVEGAÇÃO - SEQUÊNCIA ANTERIOR
// =============================================

function sequenciaAnterior() {
  if (indiceatual > 0) {
    indiceatual--;
    exibirSequencia();
    document.getElementById("proximo").disabled = true;

    // Animar transição
    const palabrasContainer = document.querySelector(".palavras-container");
    palabrasContainer.style.animation = "none";
    setTimeout(() => {
      palabrasContainer.style.animation = "fadeIn 0.5s ease-out";
    }, 10);
  }
}

// =============================================
// FINALIZAR EXERCÍCIO
// =============================================

function finalizarExercicio() {
  mostrarFeedback(
    "🏆 Parabéns! Você completou o exercício de Sequência de Palavras!",
    "sucesso"
  );

  // Desabilitar botões
  document.getElementById("gravar").disabled = true;
  document.getElementById("play").disabled = true;
  document.getElementById("proximo").disabled = true;
  document.getElementById("anterior").disabled = true;

  // Mostrar botão de retorno
  setTimeout(() => {
    const navBotoes = document.querySelector(".nav-botoes");
    const botaoVoltar = document.createElement("button");
    botaoVoltar.className = "btn-nav btn-retorno";
    botaoVoltar.innerHTML = '<i class="fas fa-home"></i> Voltar ao Menu';
    botaoVoltar.onclick = () => history.back();
    navBotoes.appendChild(botaoVoltar);
  }, 500);
}

// =============================================
// EXECUTAR QUANDO PÁGINA CARREGAR
// =============================================

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", inicializar);
} else {
  inicializar();
}

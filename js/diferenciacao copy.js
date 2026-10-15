// =============================================
// CONFIGURAÇÃO DE PARES DE PALAVRAS
// =============================================

const pares = [
  {
    palavras: ["pato", "bato"],
    fonemas: ["/p/", "/b/"],
    tema: "Aliteração Plosiva",
    descricao: "Diferença entre P (surdo) e B (sonoro)",
  },
  {
    palavras: ["faca", "vaca"],
    fonemas: ["/f/", "/v/"],
    tema: "Fricativas",
    descricao: "Diferença entre F (surdo) e V (sonoro)",
  },
  {
    palavras: ["tato", "dado"],
    fonemas: ["/t/", "/d/"],
    tema: "Alveolares",
    descricao: "Diferença entre T (surdo) e D (sonoro)",
  },
  {
    palavras: ["casa", "caça"],
    fonemas: ["/z/", "/s/"],
    tema: "Sibilantes",
    descricao: "Diferença entre S (surdo) e Z (sonoro)",
  },
  {
    palavras: ["gato", "cato"],
    fonemas: ["/g/", "/k/"],
    tema: "Velares",
    descricao: "Diferença entre G (sonoro) e K (surdo)",
  },
  {
    palavras: ["pala", "bala"],
    fonemas: ["/p/", "/b/"],
    tema: "Plosivas",
    descricao: "Diferença entre P (surdo) e B (sonoro)",
  },
  {
    palavras: ["tela", "dela"],
    fonemas: ["/t/", "/d/"],
    tema: "Alveolares",
    descricao: "Diferença entre T (surdo) e D (sonoro)",
  },
  {
    palavras: ["fita", "vida"],
    fonemas: ["/f/", "/v/"],
    tema: "Fricativas",
    descricao: "Diferença entre F (surdo) e V (sonoro)",
  },
];

// =============================================
// VARIÁVEIS GLOBAIS
// =============================================

let indiceAtual = 0;
let palavraAleatoria = 0; // 0 para primeira, 1 para segunda
let respostaUser = null;
let exercicioAtivo = false;

// =============================================
// INICIALIZAÇÃO
// =============================================

function inicializar() {
  verificarSessao();
  exibirPar();

  // Event Listeners
  document.getElementById("play").addEventListener("click", reproduzirPalavra);
  document.getElementById("opcao-1").addEventListener("click", () => selecionarOpcao(1));
  document.getElementById("opcao-2").addEventListener("click", () => selecionarOpcao(2));
  document.getElementById("proximo").addEventListener("click", proximoPar);
  document.getElementById("anterior").addEventListener("click", parAnterior);
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
// EXIBIR PAR DE PALAVRAS
// =============================================

function exibirPar() {
  const parAtual = pares[indiceAtual];

  // Atualizar fonemas
  document.getElementById("fonema-1").textContent = parAtual.fonemas[0];
  document.getElementById("fonema-2").textContent = parAtual.fonemas[1];

  // Atualizar opções
  document.getElementById("palavra-opcao-1").textContent = parAtual.palavras[0];
  document.getElementById("palavra-opcao-2").textContent = parAtual.palavras[1];
  document.getElementById("fonema-pequeno-1").textContent = parAtual.fonemas[0];
  document.getElementById("fonema-pequeno-2").textContent = parAtual.fonemas[1];

  // Atualizar progresso
  const percentual = ((indiceAtual + 1) / pares.length) * 100;
  document.getElementById("progresso").style.width = percentual + "%";
  document.getElementById("progresso-texto").textContent =
    `${indiceAtual + 1}/${pares.length}`;

  // Limpar feedback
  document.getElementById("feedback").textContent = "";
  document.getElementById("explicacao").textContent = "";
  document.getElementById("status").textContent = "Clique em 'Ouvir Palavra' para começar";

  // Limpar seleções
  document.getElementById("opcao-1").classList.remove("selected", "correto", "erro");
  document.getElementById("opcao-2").classList.remove("selected", "correto", "erro");

  // Resetar variáveis
  respostaUser = null;
  exercicioAtivo = false;

  // Atualizar status dos botões
  document.getElementById("anterior").disabled = indiceAtual === 0;
  document.getElementById("proximo").disabled = true;
  document.getElementById("play").disabled = false;
  document.getElementById("opcao-1").disabled = false;
  document.getElementById("opcao-2").disabled = false;

  // Gerar palavra aleatória
  palavraAleatoria = Math.floor(Math.random() * 2);
}

// =============================================
// REPRODUZIR PALAVRA
// =============================================

function reproduzirPalavra() {
  const parAtual = pares[indiceAtual];
  const palavra = parAtual.palavras[palavraAleatoria];

  // Usar Web Speech API para síntese de voz
  const utterance = new SpeechSynthesisUtterance(palavra);
  utterance.lang = "pt-BR";
  utterance.rate = 0.8; // Velocidade mais lenta para clareza
  utterance.pitch = 1;
  utterance.volume = 1;

  // Desabilitar botão durante a reprodução
  const botaoPlay = document.getElementById("play");
  botaoPlay.disabled = true;

  utterance.onend = () => {
    botaoPlay.disabled = false;
    document.getElementById("status").textContent = "Qual palavra você ouviu?";
    exercicioAtivo = true;
  };

  speechSynthesis.speak(utterance);
}

// =============================================
// SELECIONAR OPÇÃO
// =============================================

function selecionarOpcao(opcao) {
  if (!exercicioAtivo || respostaUser !== null) {
    return;
  }

  respostaUser = opcao;
  const parAtual = pares[indiceAtual];
  const correta = palavraAleatoria + 1; // 1 ou 2

  // Marcar seleção
  document.getElementById(`opcao-${opcao}`).classList.add("selected");

  // Verificar resposta após um pequeno delay para visualização
  setTimeout(() => {
    verificarResposta(opcao, correta, parAtual);
  }, 500);
}

// =============================================
// VERIFICAR RESPOSTA
// =============================================

function verificarResposta(respostaUser, correta, parAtual) {
  const feedbackElement = document.getElementById("feedback");
  const explicacaoElement = document.getElementById("explicacao");

  // Remover classe selected
  document.getElementById(`opcao-${respostaUser}`).classList.remove("selected");

  if (respostaUser === correta) {
    // RESPOSTA CORRETA
    document.getElementById(`opcao-${respostaUser}`).classList.add("correto");
    feedbackElement.textContent = "✅ Correto! Você identificou a palavra corretamente.";
    feedbackElement.className = "sucesso";

    explicacaoElement.innerHTML = `
      <strong>Você ouviu:</strong> ${parAtual.palavras[palavraAleatoria]} (${parAtual.fonemas[palavraAleatoria]})<br>
      <strong>Diferença fonética:</strong> ${parAtual.descricao}
    `;

    document.getElementById("proximo").disabled = false;
  } else {
    // RESPOSTA INCORRETA
    document.getElementById(`opcao-${respostaUser}`).classList.add("erro");
    document.getElementById(`opcao-${correta}`).classList.add("correto");

    feedbackElement.textContent = `❌ Incorreto! A palavra correta era "${parAtual.palavras[palavraAleatoria]}"`;
    feedbackElement.className = "erro";

    explicacaoElement.innerHTML = `
      <strong>A palavra ouvida:</strong> ${parAtual.palavras[palavraAleatoria]} (${parAtual.fonemas[palavraAleatoria]})<br>
      <strong>Diferença fonética:</strong> ${parAtual.descricao}<br>
      <small>Tente concentrar-se na diferença entre os sons.</small>
    `;

    document.getElementById("proximo").disabled = false;
  }

  // Desabilitar opções
  document.getElementById("opcao-1").disabled = true;
  document.getElementById("opcao-2").disabled = true;
  document.getElementById("play").disabled = false;
}

// =============================================
// NAVEGAÇÃO - PRÓXIMO PAR
// =============================================

function proximoPar() {
  if (indiceAtual < pares.length - 1) {
    indiceAtual++;
    exibirPar();

    // Animar transição
    const parInfo = document.querySelector(".par-info");
    parInfo.style.animation = "none";
    setTimeout(() => {
      parInfo.style.animation = "fadeIn 0.5s ease-out";
    }, 10);
  } else {
    finalizarExercicio();
  }
}

// =============================================
// NAVEGAÇÃO - PAR ANTERIOR
// =============================================

function parAnterior() {
  if (indiceAtual > 0) {
    indiceAtual--;
    exibirPar();

    // Animar transição
    const parInfo = document.querySelector(".par-info");
    parInfo.style.animation = "none";
    setTimeout(() => {
      parInfo.style.animation = "fadeIn 0.5s ease-out";
    }, 10);
  }
}

// =============================================
// FINALIZAR EXERCÍCIO
// =============================================

function finalizarExercicio() {
  document.getElementById("feedback").textContent =
    "🏆 Parabéns! Você completou o exercício de Precisão Auditiva!";
  document.getElementById("feedback").className = "sucesso";

  document.getElementById("explicacao").innerHTML = `
    <strong>Exercício finalizado!</strong><br>
    Você trabalhou discriminação de fonemas com sucesso.
    Volte sempre para aprimorar sua precisão auditiva.
  `;

  // Desabilitar botões
  document.getElementById("play").disabled = true;
  document.getElementById("opcao-1").disabled = true;
  document.getElementById("opcao-2").disabled = true;
  document.getElementById("proximo").disabled = true;
  document.getElementById("anterior").disabled = true;

  // Mostrar botão de retorno
  setTimeout(() => {
    const navBotoes = document.querySelector(".nav-botoes");
    if (!document.querySelector(".btn-retorno")) {
      const botaoVoltar = document.createElement("button");
      botaoVoltar.className = "btn-nav btn-retorno";
      botaoVoltar.innerHTML =
        '<i class="fas fa-home"></i> Voltar ao Menu';
      botaoVoltar.onclick = () => history.back();
      navBotoes.appendChild(botaoVoltar);
    }
  }, 500);
}

// =============================================
// ANIMAÇÃO FADEIN
// =============================================

const style = document.createElement("style");
style.textContent = `
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;
document.head.appendChild(style);

// =============================================
// EXECUTAR QUANDO PÁGINA CARREGAR
// =============================================

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", inicializar);
} else {
  inicializar();
}

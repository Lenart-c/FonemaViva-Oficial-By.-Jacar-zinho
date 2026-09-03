  const palavras = [
    "Rato",
    "Lata",
    "Rola",
    "Lua",
    "Carro",
    "Bola",
    "Riso",
    "Lobo"
  ];

  let index = 0;
  let acertou = false;
  let acertos = 0;

  /* EVITA REPETIÇÕES */
  let ouvindo = false;

  /* CONTROLE DE CONCLUSÃO */
  let concluidos =
  new Array(palavras.length).fill(false);

  /* =========================================
    SALVAMENTO AUTOMÁTICO
  ========================================= */

  const progressoSalvo =
  localStorage.getItem("fonema-progresso");

  if(progressoSalvo){

    const dados =
    JSON.parse(progressoSalvo);

    index =
    dados.index || 0;

    acertos =
    dados.acertos || 0;

    concluidos =
    dados.concluidos ||
    new Array(palavras.length).fill(false);
  }

  /* ELEMENTOS */
  const palavraEl =
  document.getElementById("palavra");

  const resultadoEl =
  document.getElementById("resultado");

  const feedbackEl =
  document.getElementById("feedback");

  const btnProximo =
  document.getElementById("proximo");

  const progressoEl =
  document.getElementById("progresso");

  const progressoTexto =
  document.getElementById("progresso-texto");

  const btnGravar =
  document.getElementById("gravar");

  /* =========================================
    RECONHECIMENTO DE VOZ
  ========================================= */

  const SpeechRecognition =
  window.SpeechRecognition ||
  window.webkitSpeechRecognition;

  if (!SpeechRecognition) {

    mostrarFeedback(
      "❌ Seu navegador não suporta reconhecimento de voz.",
      "#ff0000"
    );

    throw new Error(
      "SpeechRecognition não suportado"
    );
  }

  const recognition =
  new SpeechRecognition();

  /* CONFIGURAÇÕES */
  recognition.lang = "pt-BR";

  recognition.continuous = false;

  recognition.interimResults = false;

  recognition.maxAlternatives = 1;


  /* TEMPO LIMITE */
  let timeoutAudio;

  /* =========================================
    FUNÇÕES
  ========================================= */

  function mostrarFeedback(texto, cor){

    feedbackEl.innerText = texto;
    feedbackEl.style.color = cor;
  }

  /* PRIMEIRA LETRA MAIÚSCULA */
  function capitalizar(texto){

    return texto.charAt(0).toUpperCase() +
    texto.slice(1);
  }

  /* REMOVE ACENTOS */
  function normalizar(texto){

    return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
  }

  /* ATUALIZA PROGRESSO */
  function atualizarProgresso(){

  const porcentagem =
  Math.round(
    (acertos / palavras.length) * 100
  );

  progressoEl.style.width =
  porcentagem + "%";

  progressoTexto.innerText =
  porcentagem + "%";

  localStorage.setItem(
    "sons-rl-progress",
    porcentagem
  );

  window.dispatchEvent(
    new Event("progressoAtualizado")
  );

}

  /* SALVAR PROGRESSO */
  function salvarProgresso(){

    localStorage.setItem(
      "fonema-progresso",

      JSON.stringify({

        index: index,

        acertos: acertos,

        concluidos: concluidos
      })
    );
  }

  /* BOTÃO */
  function atualizarBotao(){

    btnProximo.disabled = !acertou;

    /* ÚLTIMA PALAVRA */
    if(index === palavras.length - 1){

      if(acertou){

        btnProximo.innerHTML =
        "↻ Reiniciar";
      }

    } else {

      btnProximo.innerHTML =
      "Próxima →";
    }
  }

  /* MUDA PALAVRA */
  function atualizarPalavra(){

    palavraEl.innerText =
    palavras[index];

    resultadoEl.innerText =
    "...";

    feedbackEl.innerText =
    "";

    acertou = false;

    atualizarBotao();
  }

  /* =========================================
    COMPARAÇÃO EXATA
  ========================================= */

  function similaridade(a, b){

    a = normalizar(a);
    b = normalizar(b);

    /* SOMENTE IGUAL */
    return a === b;
  }

  /* =========================================
    MICROFONE
  ========================================= */

  btnGravar.addEventListener("click", () => {

    /* EVITA REPETIR */
    if(ouvindo) return;

    ouvindo = true;

    btnGravar.innerText =
    "🎙️ Ouvindo...";

    mostrarFeedback(
      "Escutando sua voz...",
      "#67e8f9"
    );

    try {

    recognition.start();

  } catch(err){

    ouvindo = false;

    btnGravar.innerText =
    "🎤 Falar Palavra";

    mostrarFeedback(
      "❌ Erro ao iniciar o microfone.",
      "#ff0000"
    );

    return;
  }

    /* NÃO ENTENDEU */
    timeoutAudio = setTimeout(() => {

      recognition.stop();

      ouvindo = false;

      btnGravar.innerText =
      "🎤 Falar Palavra";

      mostrarFeedback(
        "❌ Não entendi, pode repetir?",
        "#ff0000"
      );

    }, 5000);
  });

  /* =========================================
    RESULTADO
  ========================================= */

  recognition.onresult = (event) => {

    /* EVITA REPETIÇÃO */
    if(!ouvindo) return;

    ouvindo = false;

    clearTimeout(timeoutAudio);

    recognition.stop();

    /* TEXTO COMPLETO */
    let textoCompleto =
    event.results[0][0].transcript;

    /* REMOVE REPETIÇÕES */
    let palavrasFaladas =
    textoCompleto
    .trim()
    .split(" ");

    /* PEGA SÓ A PRIMEIRA */
    let texto =
    palavrasFaladas[0];

    resultadoEl.innerText =
    capitalizar(texto);

    const correta =
    palavras[index];

    const textoComparar =
    normalizar(texto);

    const corretaComparar =
    normalizar(correta);

    acertou = false;

    /* ACERTO */
    if (
      similaridade(
        textoComparar,
        corretaComparar
      )
    ) {

      mostrarFeedback(
        "✅ Correto!",
        "#4ade80"
      );

      if (!concluidos[index]){

        concluidos[index] = true;

        acertos++;

        atualizarProgresso();

        salvarProgresso();
      }

      acertou = true;
    }

    else {

      /* TROCOU R POR L */
      if (

        corretaComparar.includes("r") &&

        textoComparar.includes(
          corretaComparar.replace("r", "l")
        )

      ) {

        mostrarFeedback(
          "⚠️ Você trocou R por L",
          "#facc15"
        );
      }

      /* TROCOU L POR R */
      else if (

        corretaComparar.includes("l") &&

        textoComparar.includes(
          corretaComparar.replace("l", "r")
        )

      ) {

        mostrarFeedback(
          "⚠️ Você trocou L por R",
          "#facc15"
        );
      }

      /* ERRO */
      else {

        mostrarFeedback(
          "❌ Tente novamente",
          "#ff0026"
        );
      }
    }

    atualizarBotao();

    btnGravar.innerText =
    "🎤 Falar Palavra";
  };

  /* =========================================
    QUANDO TERMINA
  ========================================= */

  recognition.onend = () => {

    clearTimeout(timeoutAudio);

    /* SÓ RESETA O BOTÃO */
    btnGravar.innerText =
    "🎤 Falar Palavra";

    /* NÃO APAGA MENSAGEM */
    ouvindo = false;
  };

  /* =========================================
   ERRO
========================================= */

recognition.onerror = (event) => {

  ouvindo = false;

  clearTimeout(timeoutAudio);

  btnGravar.innerText =
  "🎤 Falar Palavra";

  if(event.error === "no-speech"){

    mostrarFeedback(
      "❌ Não entendi, pode repetir?",
      "#ff0000"
    );

    return;
  }

  if(event.error === "audio-capture"){

    mostrarFeedback(
      "🎤 Nenhum microfone encontrado.",
      "#ff0000"
    );

    return;
  }

  if(event.error === "not-allowed"){

    mostrarFeedback(
      "🔒 Permissão do microfone negada.",
      "#ff0000"
    );

    return;
  }

  if(event.error === "network"){

    mostrarFeedback(
      "🌐 Erro de conexão do reconhecimento.",
      "#ff0000"
    );

    return;
  }

  mostrarFeedback(
    "❌ Erro: " + event.error,
    "#ff0000"
  );
};
  /* =========================================
    PRÓXIMO / REINICIAR
  ========================================= */

  btnProximo.addEventListener("click", () => {

    if(!acertou) return;

    /* REINICIAR */
  if(index === palavras.length - 1){

    // REMOVE PROGRESSO LOCAL
    localStorage.removeItem(
      "fonema-progresso"
    );

    // ZERA PROGRESSO GLOBAL
    localStorage.setItem(
      "sons-rl-progress",
      0
    );

    // RESET
    index = 0;

    acertos = 0;

    acertou = false;

    concluidos =
    new Array(palavras.length).fill(false);

    atualizarProgresso();

    atualizarPalavra();

    atualizarBotao();

    return;
  }

    /* PRÓXIMA */
    index++;

    salvarProgresso();

    atualizarPalavra();
  });

  /* =========================================
    INICIAR
  ========================================= */

  atualizarPalavra();

  atualizarProgresso();

  // =========================================
// BOTÃO VOLTAR
// =========================================

document
.getElementById("btnVoltar")
.addEventListener("click", () => {

  window.location.href =
  "./adultos.html";

});
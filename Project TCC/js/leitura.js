const textos = [
  "O rato roeu a roupa do rei de roma e a rainha ficou surpresa com a rapidez do pequeno animal.",
  "Lucas levou o livro para a escola e mostrou para seus colegas durante a aula.",
  "O carro vermelho passou rapidamente pela rua enquanto o cachorro latia sem parar.",
  "Laura gosta de ler histórias longas antes de dormir porque isso ajuda a melhorar sua pronúncia."
];

// ================= CONTROLE DO SISTEMA =================

// 🔢 posição atual no array (qual texto está sendo exibido)
let index = 0;

// 🟢 indica se o usuário acertou o texto atual
let acertou = false;

// 📊 quantidade total de textos acertados (usado na barra)
let acertos = 0;

// 🔥 CONTROLE INTELIGENTE → evita contar o mesmo texto várias vezes
// cada posição representa um texto
// false = ainda não concluído | true = já concluído
let concluidos = new Array(textos.length).fill(false);

// ================= ELEMENTOS DO HTML =================

// 📄 onde o texto aparece na tela
const textoEl = document.getElementById("palavra");

// 🎤 onde aparece o que o usuário falou
const resultadoEl = document.getElementById("resultado");

// 💬 onde aparece o feedback (acerto/erro)
const feedbackEl = document.getElementById("feedback");

// 🔘 botões de navegação
const btnProximo = document.getElementById("proximo");
const btnAnterior = document.getElementById("anterior");

// ================= BARRA DE PROGRESSO =================

// 📊 parte visual da barra (a que cresce)
const progressoEl = document.getElementById("progresso");

// 🔢 texto da porcentagem (ex: 50%)
const progressoTexto = document.getElementById("progresso-texto");

// ================= RECONHECIMENTO DE VOZ =================

// 🎤 ativa API de voz do navegador
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

// cria o objeto de reconhecimento
const recognition = new SpeechRecognition();

// 🌎 define idioma da fala
recognition.lang = "pt-BR";

// ================= TRATAMENTO DE TEXTO =================

// 🔥 normaliza o texto para comparação justa
function normalizar(str) {
  return str
    .toLowerCase()                     // transforma tudo em minúsculo
    .normalize("NFD")                 // separa letras de acentos
    .replace(/[\u0300-\u036f]/g, "")  // remove acentos
    .replace(/[^\w\s]/g, "")          // remove pontuação
    .trim();                          // remove espaços extras
}

// 🔥 calcula similaridade entre duas palavras
function similaridade(a, b) {

  // se algum estiver vazio, retorna 0
  if (!a || !b) return 0;

  let iguais = 0;

  // pega o maior tamanho entre as palavras
  const tamanho = Math.max(a.length, b.length);

  // percorre letra por letra
  for (let i = 0; i < Math.min(a.length, b.length); i++) {

    // se a letra for igual, soma ponto
    if (a[i] === b[i]) iguais++;
  }

  // retorna porcentagem de letras iguais
  return iguais / tamanho;
}

// 🔥 compara o TEXTO COMPLETO (palavra por palavra)
function compararTexto(falado, correto) {

  // transforma os textos em arrays de palavras
  const faladoArr = normalizar(falado).split(" ");
  const corretoArr = normalizar(correto).split(" ");

  let acertosLocal = 0;

  // percorre cada palavra do texto correto
  for (let i = 0; i < corretoArr.length; i++) {

    // palavra falada (ou vazia se não falou)
    const palavraFalada = faladoArr[i] || "";

    // palavra correta
    const palavraCorreta = corretoArr[i];

    // mede o quão parecida é
    const score = similaridade(palavraFalada, palavraCorreta);

    // se for suficientemente parecida → conta como acerto
    if (score >= 0.8) {
      acertosLocal++;
    }
  }

  // retorna a porcentagem de acerto do texto
  return acertosLocal / corretoArr.length;
}

// ================= PROGRESSO =================

// 📊 atualiza a barra de progresso
function atualizarProgresso() {

  // calcula porcentagem
  const porcentagem = (acertos / textos.length) * 100;

  // aumenta largura da barra
  progressoEl.style.width = porcentagem + "%";

  // atualiza texto (ex: 75%)
  progressoTexto.innerText = Math.round(porcentagem) + "%";
}

// ================= INTERAÇÃO =================

// 🎤 quando o usuário clica no botão de falar
document.getElementById("gravar").addEventListener("click", () => {

  // mostra que está ouvindo
  feedbackEl.innerText = "🎤 Ouvindo...";
  feedbackEl.style.color = "#555";

  // inicia reconhecimento de voz
  recognition.start();
});

// 🎯 quando a fala termina
recognition.onresult = (event) => {

  // pega o texto que o usuário falou
  let textoFalado = event.results[0][0].transcript;

  // mostra na tela
  resultadoEl.innerText = textoFalado;

  // pega o texto correto atual
  const textoCorreto = textos[index];

  // calcula o nível de acerto
  const score = compararTexto(textoFalado, textoCorreto);

  // ================= DECISÃO =================

  // 🟢 ACERTO PERFEITO
  if (score >= 0.95) {

    feedbackEl.innerText = "✅ Correto!";
    feedbackEl.style.color = "green";

    // 🔥 só conta uma vez por texto
    if (!concluidos[index]) {
      concluidos[index] = true; // marca como concluído
      acertos++;                // soma progresso
      atualizarProgresso();     // atualiza barra
    }

    acertou = true;

  // 🟡 QUASE CERTO
  } else if (score >= 0.85) {

    feedbackEl.innerText = "⚠️ Quase perfeito, ajuste pequenas partes";
    feedbackEl.style.color = "orange";

    acertou = false;

  // 🔴 ERRADO
  } else {

    feedbackEl.innerText = "❌ Leia exatamente como está escrito";
    feedbackEl.style.color = "red";

    acertou = false;
  }

  // atualiza estado dos botões
  atualizarBotoes();
};

// ================= NAVEGAÇÃO =================

// 👉 botão próximo
btnProximo.addEventListener("click", () => {

  // só avança se acertou
  if (!acertou) return;

  // evita passar do último
  if (index < textos.length - 1) {
    index++; // vai para próximo texto
    atualizarTexto();
  }
});

// 👉 botão anterior
btnAnterior.addEventListener("click", () => {

  // evita ir antes do primeiro
  if (index > 0) {
    index--; // volta um texto
    atualizarTexto();
  }
});

// ================= ATUALIZAÇÃO =================

// 🔄 atualiza tudo na tela
function atualizarTexto() {

  // mostra texto atual
  textoEl.innerText = textos[index];

  // limpa resultado antigo
  resultadoEl.innerText = "...";

  // limpa feedback
  feedbackEl.innerText = "";

  // reseta estado
  acertou = false;

  atualizarBotoes();
}

// 🔘 controla os botões
function atualizarBotoes() {

  // desativa "anterior" se estiver no primeiro
  btnAnterior.disabled = index === 0;

  // se estiver no último → desativa próximo
  if (index === textos.length - 1) {
    btnProximo.disabled = true;

  // senão → só libera se acertou
  } else {
    btnProximo.disabled = !acertou;
  }
}

// ================= INICIALIZAÇÃO =================

// 🚀 inicia sistema
atualizarTexto();     // mostra primeiro texto
atualizarProgresso(); // barra começa em 0%




// •Fontes                   - https://developer.mozilla.org/pt-BR/
                           //- https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API
                           //- https://www.w3schools.com/js/
                           //- https://javascript.info/
                           //- https://stackoverflow.com/questions
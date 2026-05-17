const frases = [
  "O rato roeu a roupa do rei de Roma",
  "A lua brilha no céu estrelado",
  "O lobo correu pela floresta",
  "O carro vermelho passou rápido",
  "A bola rolou pela rua",
  "O leão rugiu bem alto",
  "O relógio faz tic tac",
  "A laranja está madura"
];


let index = 0;                                                   // Controla qual frase está sendo exibida atualmente (posição no array).
let acertou = false;                                             // Indica se o usuário acertou a frase atual.
let acertos = 0;                                                 // Total de frases acertadas (usado na barra de progresso).


// Cria um array com o mesmo tamanho das frases, tudo começando como false.
// Serve para impedir que o progresso suba repetidamente na mesma frase.
let concluidos = new Array(frases.length).fill(false);           // PPPPPPPPPPOOOOOOOOOOOOGGGGGGGGGGGGGGG.


const fraseEl = document.getElementById("frase");                // Onde aparece a frase.
const resultadoEl = document.getElementById("resultado");        // Onde aparece o que o usuário falou.
const feedbackEl = document.getElementById("feedback");          // Mensagem de acerto/erro.

const btnProximo = document.getElementById("proximo");           // Botão próximo.
const btnAnterior = document.getElementById("anterior");         // Botão anterior.


// Barra de progresso.
const progressoEl = document.getElementById("progresso");        // Parte visual da barra (preenchimento).
const progressoTexto = document.getElementById("progresso-texto"); // Texto com % (Ex.: 10%, 20%, 27% etc).


// OOOOOOOOOO BUCETAAAA.          //XXX.
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition; // Escolhe a API de voz disponível no navegador.
const recognition = new SpeechRecognition();                     // Cria o objeto que vai escutar o áudio do usuário.


recognition.lang = "pt-BR";                                      // Define idioma como português br.



function capitalizar(texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1);         // Deixa a primeira letra maiúscula visualmente.
}


function similaridade(a, b) {                                    // É como um assistente inteligente, fazendo comparações pra ver se tem algum erro.


  a = a.toLowerCase().split(" ");                                // Transforma tudo em minúsculo e separa por palavras.
  b = b.toLowerCase().split(" ");                                // Faz o mesmo.

  let corretas = 0;                                              // Ele conta as palavras corretas.

  
  a.forEach(palavra => {                                         // Verifica se a palavra existe.                             
  
    if (b.includes(palavra)) corretas++;                         // Se acertou soma ponto.
  });

  return corretas / a.length;                                    // retorna a porcentagem de acerto (ex: 0.8 = 80%).
}


                            //UNIÃO FLASCO, MANO SEM CAÔ, BATENDO PUNHETA COM O PAL NO VENTILADOR.
function atualizarProgresso() {

  const porcentagem = (acertos / frases.length) * 100;           // Calcula porcentagem baseada nos acertos.

  progressoEl.style.width = porcentagem + "%";                   // Vai atualiza a largura da barra visual.


  progressoTexto.innerText = Math.round(porcentagem) + "%";      // Vai atualiza o texto da porcentagem.
}



document.getElementById("gravar").addEventListener("click", () => {

  
  feedbackEl.innerText = "🎤 Ouvindo...";                       // Mostra uma mensagem de ouvindo, enquanto escuta o usuário.
  feedbackEl.style.color = "#555";

  recognition.start();                                          // Começa a escutar.
});



recognition.onresult = (event) => {

 
  let textoOriginal = event.results[0][0].transcript;           // Ele pega o texto falado pelo usuário.

  
  let texto = textoOriginal.toLowerCase();                      // Versão em minúsculo para comparação.

  
  resultadoEl.innerText = capitalizar(textoOriginal);           // Mostra na tela com primeira letra maiúscula.

  const correta = frases[index];                                // Ele pega a frase correta atual.

  
  const score = similaridade(correta, texto);                   // Vai calcular o nível de acerto.

  acertou = false;                                              // Começa assumindo que você errou.

 
  if (score >= 0.9) {
    feedbackEl.innerText = "✅ Correto!";                      // Se acertar, vai aparecer a palavra "correto" em verde.
    feedbackEl.style.color = "green"; 

  
    if (!concluidos[index]) {
      concluidos[index] = true;                                // Vai marcar como concluído.
      acertos++;                                               // Ele soma no progresso.
      atualizarProgresso();                                    // Atualiza a barra.
    }

    acertou = true;                                            // libera o botão próximo.

  // 🟡 QUASE CERTO
  } else if (score >= 0.6) {
    feedbackEl.innerText = "⚠️ Quase lá, tente novamente";    // Se o usuário quase acertar vai aparecer aa frase em larajá.
    feedbackEl.style.color = "orange"; 

  // 🔴 ERRO TOTAL
  } else {
    feedbackEl.innerText = "❌ Muito diferente, tente novamente";
    feedbackEl.style.color = "red";                           // Se errar a frase vai aparecer em vermelho.
  }

  atualizarBotoes();                                          // Atualiza os botões.
};



btnProximo.addEventListener("click", () => {

  if (!acertou) return;                                      // Se não tiver acertado, ele não deixa passar.

  if (index < frases.length - 1) {
    index++;                                                 // Vai pro próximo exercício.
    atualizar();                                             // Atualiza a tela.
  }
});



btnAnterior.addEventListener("click", () => {

  if (index > 0) {
    index--;                                                 // Se o usuário quiser ele pode voltar ao exercício anterior.
    atualizar();                                             // Atualiza a tela.
  }
});



function atualizar() {

  fraseEl.innerText = frases[index];                         // Mostra a frase atual.

  resultadoEl.innerText = "...";                             // Limpa a resposta anterior.

  feedbackEl.innerText = "";                                 // limpa o feedback anterior.

  acertou = false;                                           // Reseta.

  atualizarBotoes();                                         // Atualiza botões.
}


function atualizarBotoes() {

  btnAnterior.disabled = index === 0;                        // Ele desativa o botão "anterior" se estiver no começo.
  // trava se não acertou OU se chegou no último
  btnProximo.disabled = !acertou || index === frases.length - 1;  // Vai trava se não acertou ou se o usuário chegar no final.
}


atualizar();                                                 // mostra primeira frase.
atualizarProgresso();                                        // inicia barra em 0%.




// •Fontes           - https://developer.mozilla.org/pt-BR/docs/Web/API/Web_Speech_API
                   //- https://www.w3schools.com/js/
                   //- https://developer.chrome.com/blog/voice-driven-web-apps-introduction-to-the-web-speech-api?hl=pt-br
                   //- https://stackoverflow.com/questions
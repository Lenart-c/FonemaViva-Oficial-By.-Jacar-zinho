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

let index = 0;                                                             // Vai controlar qual a palavra o usuário está.
let acertou = false;                                                       // Vai dizer se o usuário errou ou acertou.
let acertos = 0;                                                           // Isso aqui ajuda na questão da barra de acertos (Conta quantons vc acertou).

                                                                           // O "Array" vai guardar as palavras que já foram concluídas. PPPPPPPPPPOOOOOOOOOOOOOOOGGGGGGGG.
                                                                           // cada posição corresponde a uma palavra.
                                                                           // Se for false = Significa que ainda não foi concluído | Se for true = Significa que já foi concluído.
let concluidos = new Array(palavras.length).fill(false);

const palavraEl = document.getElementById("palavra");                      // Mostra onde aparece a palavra..
const resultadoEl = document.getElementById("resultado");                  // Vai mostrar o que o usuário falou.
const feedbackEl = document.getElementById("feedback");                    // Demonstra se o usuário acertou ou errou.

const btnProximo = document.getElementById("proximo");                     // Se o usuário quiser ir para o próximo exercício.
const btnAnterior = document.getElementById("anterior");                   // Se ele quiser voltar pro anterior.

const progressoEl = document.getElementById("progresso");                  // Parte visual da barra de acertos.
const progressoTexto = document.getElementById("progresso-texto");         // Texto da porcentagem (Ex.: 10%, 20%, e 30%).

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition; // Vai ativar o reconhecimento de voz do navegador.
const recognition = new SpeechRecognition();

recognition.lang = "pt-BR";                                                // Isso aqui vai definir em qual idioma o usuário estará falando.


// 🔥 FUNÇÃO PRA EVITAR REPETIÇÃO DE FEEDBACK
function mostrarFeedback(texto, cor) {
  feedbackEl.innerText = texto;
  feedbackEl.style.color = cor;
}


// 🔥 FUNÇÃO PRA EVITAR REPETIÇÃO DE LOWERCASE
function normalizar(texto) {                                               // Evita que tenha repetições.
  return texto.toLowerCase();
}



function capitalizar(texto) {                                              // Este código faz com que a primeira letra que a pessoa fale estará em maiúsculo.
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}


// 🔥 ATUALIZAR PROGRESSO
function atualizarProgresso() {                                            // Vai ficar atualizando a barra de progresso.
                                                                           // Esse aqui ficou facinho     //PPPPPPPPPPPPOOOOOOOOOOOOOOOGGGGGGGGGGGGGG.

  const porcentagem = (acertos / palavras.length) * 100;                   // Calcula a porcentagem com base na quantidade de acertos.

  progressoEl.style.width = porcentagem + "%";                             // Aumenta visualmente a porcentagem da barra de acertos.

  progressoTexto.innerText = Math.round(porcentagem) + "%";                // Vai mostrar o valor calculado em texto (Ex.: 20%).
}


// Por que caralhos tudo é tão difícil nessa bosta de javascript.
// Ok, não tá difíl         //Deixa quieto...   //67676767676767676767.
document.getElementById("gravar").addEventListener("click", () => {        // Isso serve como um botão de gravar(No caso isso é o botão de gravar, Burro do caralho). :)

  mostrarFeedback("🎤 Ouvindo...", "#555");                                // This is shit mostra uma mensagem enquanto escuta o usuário.

  recognition.start();                                                     // Inicia a captura de voz //Uau que demais.
});



recognition.onresult = (event) => {                                        // Isso é pra quando o usuário para de falar.

  let texto = event.results[0][0].transcript;                              // Pega o que o usuário falou.

  texto = capitalizar(texto);                                              // Deixa a primeira letra maiúscula visualmente.

  resultadoEl.innerText = texto;                                           // Mostra na tela o que foi falado   // Deu print filho da puta.

  const correta = palavras[index];                                         // ClOOOOOOOOVIS      // Pega a palavra correta atual.

  const textoComparar = normalizar(texto);                                 // Vai normalizar texto para a comparação se é maiúsculo ou minúsculo.
  const corretaComparar = normalizar(correta);

  acertou = false;                                                         // Isso aqui reseta antes de validar.

  // UMA RAPARIGA É BOM, MAIS 3 RAPARIGAS É BOM DEMAIS, VAI SGADVBSIUANDJKASJDBASJDNASJKDBJHASBNDASJKNDKJASN, TUM, TUM.
  if (textoComparar.includes(corretaComparar)) {

    mostrarFeedback("✅ Correto!", "green");                               // Aparece se vc tiver acertado.

    if (!concluidos[index]) {
      concluidos[index] = true;                                            // Marcar como concluída.
      acertos++;                                                           // Soma pontos.
      atualizarProgresso();                                                // Ele atualiza barra.
    }

    acertou = true;

  } else {

    // Assistente Bicha do caralho.       //Ajuda nos erros específicos de R e L.
    if (
      corretaComparar.includes("r") &&
      textoComparar.includes(corretaComparar.replace("r", "l"))
    ) {
      mostrarFeedback("⚠️ Você trocou R por L", "orange");                  // Se trocar R por L aparecerá uma mensagem em laranja.

    } else if (
      corretaComparar.includes("l") &&
      textoComparar.includes(corretaComparar.replace("l", "r"))
    ) {
      mostrarFeedback("⚠️ Você trocou L por R", "orange");                  // Se trocar L por R aparecerá uma mensagem em laranja.

    } else {
      mostrarFeedback("❌ Tente novamente", "red");                          // Se o usuário estiver errado vai aparecer para tentar novamente, e vai aparecer na cor vermelha.
    }
  }

  atualizarBotoes();                                                       // atualiza os botões.
};



btnProximo.addEventListener("click", () => {                               // Esse é o botão de próximo.

  if (acertou && index < palavras.length - 1) {                            // Só vai permitir ir para o próximo exercíco se acertar.

    index++;                                                               // vai pro próximo exercício.
    atualizarPalavra();                                                    // Ele atualiza a tela.
  }
});



btnAnterior.addEventListener("click", () => {                              // Mesma porra que o outro, esse é o botão de anterior.

  if (index > 0) {                                                         
    index--;                                                               // Volta um exercício.
    atualizarPalavra();                                                    // Ele atualiza a tela.
  }
});



function atualizarPalavra() {                                              // Vai atualizar a palavra na tela.

  palavraEl.innerText = capitalizar(palavras[index]);                      // Ele mostra a palavra atual.

  resultadoEl.innerText = "...";                                           // Limpa a resposta anterior.

  feedbackEl.innerText = "";                                               // Ele limpa o feedback independente se for positivo ou negativo. 

  acertou = false;                                                         // Ele reseta tudo.

  atualizarBotoes();                                                       // Atualiza.
}



function atualizarBotoes() {                                               // Controla os botões.

  btnAnterior.disabled = index === 0;                                      // Ele desativa o botão anterior se estiver na primeira palavra.

  btnProximo.disabled = !acertou || index === palavras.length - 1;         // trava se não acertou ou se estiver no último.
}



atualizarPalavra();                                                        // Mostra primeira palavra.
atualizarProgresso();                                                      // Inicia barra zerada.



// •Fontes           - https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API?utm_source=chatgpt.com
                   //- https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition/start?utm_source=chatgpt.com
                   //- https://www.dot-software.org/articles/coding-education-platforms-for-beginners.html?psystem=PW&domain=www.codeproject.com&oref=https%3A%2F%2Fchatgpt.com%2F&trafficTarget=gd
                   //- https://www.codewithrandom.com/2022/09/13/speech-recognition-javascript-make-your-own-speech-recognition-app-using-javascript/?utm_source=chatgpt.com
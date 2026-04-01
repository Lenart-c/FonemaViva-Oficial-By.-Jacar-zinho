

document.addEventListener("DOMContentLoaded", () => {   // Essa bosta vai esperar toda a pagina do site carregar antes pra depois começar a iniciar o código todo

  // Verificar suporte para Speech Recognition
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert('Reconhecimento de voz não é suportado neste navegador.');
  }

  // Função para calcular acurácia simples baseada em caracteres coincidentes
  function calculateAccuracy(transcript, expected) {
    const maxLen = Math.max(transcript.length, expected.length);
    if (maxLen === 0) return 100;
    let matches = 0;
    const minLen = Math.min(transcript.length, expected.length);
    for (let i = 0; i < minLen; i++) {
      if (transcript[i] === expected[i]) matches++;
    }
    return Math.round((matches / maxLen) * 100);
  }

  // Função para mostrar modal do exercício
  function showExerciseModal(expected) {
    const modal = document.createElement('div');
    modal.id = 'exercise-modal';
    modal.style.position = 'fixed';
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    modal.style.background = 'white';
    modal.style.padding = '20px';
    modal.style.border = '1px solid black';
    modal.style.zIndex = '1000';
    modal.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
    modal.innerHTML = `
      <h3>Exercício de Pronúncia</h3>
      <p>Diga: <strong>${expected}</strong></p>
      <button id="start-speak">Falar</button>
      <div id="result" style="display:none; margin-top: 10px;">
        <p id="feedback"></p>
        <p>Você disse: <span id="transcript"></span></p>
        <p>Acurácia: <span id="accuracy"></span>%</p>
        <button id="retry" style="display:none; margin-top: 10px;">Tentar novamente</button>
      </div>
      <button id="close-modal" style="margin-top: 10px;">Fechar</button>
    `;
    document.body.appendChild(modal);
    document.getElementById('start-speak').addEventListener('click', () => {
      startRecognition(expected, modal);
    });
    document.getElementById('close-modal').addEventListener('click', () => {
      modal.remove();
    });
    document.getElementById('retry').addEventListener('click', () => {
      startRecognition(expected, modal);
    });
  }

  // Função para iniciar reconhecimento de voz
  function startRecognition(expected, modal) {
    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR'; // Definir idioma para português
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      const expectedLower = expected.toLowerCase();
      const accuracy = calculateAccuracy(transcript, expectedLower);
      document.getElementById('transcript').textContent = transcript;
      document.getElementById('accuracy').textContent = accuracy;
      const feedback = document.getElementById('feedback');
      const retryBtn = document.getElementById('retry');
      if (accuracy >= 70) {
        feedback.textContent = 'Correto!';
        retryBtn.style.display = 'none';
      } else {
        feedback.textContent = 'Palavra incorreta, tente novamente.';
        retryBtn.style.display = 'block';
      }
      document.getElementById('result').style.display = 'block';
    };
    recognition.onerror = (event) => {
      alert('Erro no reconhecimento de voz: ' + event.error);
    };
    recognition.start();
  }


  const menu = document.querySelectorAll("#menu li");   // Isso aqui vai pegar e selecionar todos os itens do menu
  const cards = document.querySelectorAll(".card");     // Vai selecionar todos os cards dos exercícios que eu criei


  //Lembre-te pessoal, nunca mais usar javascript, e se sequer passar pela minha cabeça é CORIIIIIIIIINNNNNNNNNNNGÃÃÃÃÃO
  //Obs: Devo me tratar? ou não é curável?

  menu.forEach(item => {                                // Vai funcionar para cada item de cada categoria        
    item.addEventListener("click", () => {              // Vai funcionar quando clicar em um item do menu         //CLovis do caraiiiiiiiiii

      menu.forEach(i => i.classList.remove("active"));  // Este aqui vai remover de todos a classe "active" dos itens em destaque 
      item.classList.add("active");                     // Já nesse ele adiciona a classe "active" no item que for clicado clicado deixando ele destacado



        //Meu Deus do Céu, o que é que eu fiz...    //... 
        //Essas Horas que me pergunto, será que eu lanço um curso, JavaScript só para os adultos.
        //---


      const categoria = item.dataset.cat;               // Ele pega a categoria do item clicado sendo eles "respiracao", "todos", "Pronúncia", essas porras ai  //6767

      cards.forEach(card => {                           // Isso aqui vai funcionar para cada card de exercício

    
        if (categoria === "todos" || card.dataset.cat === categoria) {          // Se for "todos" OU a categoria do card for igual à selecionada
          card.style.display = "block";                 // Vai te mostrar o card
        } else {
          card.style.display = "none";                  // Vadia. Ele esconde o card      //Só os covardes se escondem do Baino
        }

      });

    });
  });


  document.querySelectorAll(".iniciar").forEach(btn => {    // Este vai selecionar todos os botões de "iniciar exercício"
    btn.addEventListener("click", (e) => {                  // Funciona quando clica no botão
      const nome = e.target.closest(".card").querySelector("h4").innerText;     // Vai pegar o card onde o botão está             //Pog demais, foi de primeira
      if (nome === 'Imitar animais') {
        const animals = ['cachorro', 'gato', 'vaca', 'galinha'];
        const expected = animals[Math.floor(Math.random() * animals.length)];
        showExerciseModal(expected);
      } else if (nome === 'Palavras divertidas') {
        const words = ['pipoca', 'banana', 'palhaço', 'bicicleta'];
        const expected = words[Math.floor(Math.random() * words.length)];
        showExerciseModal(expected);
      } else if (nome === 'Trava-língua fácil') {
        const twister = 'O rato roeu a roupa do rei de Roma';
        showExerciseModal(twister);
      } else {
        alert("Carregando o exercício: " + nome);                          // Mostra um alerta "carregando o exercício" com o nome do exercício
      }
    });
  });

});
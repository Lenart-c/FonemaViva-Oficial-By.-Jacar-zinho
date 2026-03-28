

document.addEventListener("DOMContentLoaded", () => {   // Essa bosta vai esperar toda a pagina do site carregar antes pra depois começar a iniciar o código todo


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
      alert("Carregando o exercício: " + nome);                          // Mostra um alerta "carregando o exercício" com o nome do exercício
    });
  });

});
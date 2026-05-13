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
      
      const link = btn.dataset.link;

      if (link) {
        window.location.href = link;                        // Isso funciona pra linkar as páginas
        return;                                             // Essa porra de linha vai resolver meus problemas, graças a Deus.
      }    
      else {
        alert("Este exercício ainda não está disponível.");
      }
    });
  });

});


// Parte do Tema escuro e claro                         // VAI TOMAR NO CÚÚÚÚÚÚÚÚÚÚÚÚÚ  Puta que pariu, que código filho da puta. Raiva do caralho
                                                        // EEEEEEEXXXXXXXXXXXXXX 676767676767676767 -----------------------

const body = document.body;                             // Pega a PORRA do corpo do css da página pra modificar.

const toggle = document.querySelector(".theme-toggle"); // Vai pegar o botão do tema (toggle).

const icon = document.querySelector(".toggle-thumb img");  // Vai pegar o circulo do botão.

function atualizarIcone() {

  if (body.classList.contains("dark")) {                 // Vai verificar se o sistema está no escuro ou claro         /Clovisssssss

    icon.src = "./img/brilho-do-sol.png";                // Quando entrar no modo escuro ele mostra o ícone de sol que eu escolhi.
                                                         // Já dizia Rick and Morty, Cabeça abaixada, bunda levantada, Ouié.

  } else {

    icon.src = "./img/lua-minguante.png";                // Quando entrar no modo claro ele mostra o ícone de lua que eu escolhi.
  }
}

function aplicarTemaSistema() {                          // Verifica se o sistema do navegador está com o tema claro ou escuro.

  const darkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;         // Verifica se está no modo escuro

  if (darkMode) {                                        // Verifica se está no modo escuro

    body.classList.add("dark");                          // Fiz com que fosse adicionado a classe "dark" no css pra mexer na parte escura do site

  } else {                                               // Se o sistema não estiver no modo escuro ele remove a classe "dark" que adicionei

    body.classList.remove("dark");
  }

  atualizarIcone();                                      // Toda vez que eu iniciava a página o ícone do tema não carregava junto. Isso faz com que carregue junto com a página
}


if (toggle) {
  toggle.addEventListener("click", () => {               // Ele faz o efeito de evento do botão

    body.classList.toggle("dark");                       // Altera entre modo claro e escuro

    atualizarIcone();                                    // Atualiza o ícone após clicar
  });
}


aplicarTemaSistema();                                    // Vai aplicar isso quando carregar a página




// •Fontes           - https://developer.mozilla.org/pt-BR/docs/Web/API/Document/DOMContentLoaded_event
                   //- https://developer.mozilla.org/pt-BR/docs/Web/API/Document/querySelector
                   //- https://developer.mozilla.org/pt-BR/docs/Web/API/HTMLElement/dataset
                   //- https://developer.mozilla.org/pt-BR/docs/Web/API/Element/classList
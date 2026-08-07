//Mesma porra que o outro vai levar o usuário até uma parte da página com um scroll mais sua suave. Resumindo é uma animação

function scrollToSection(id) {                              // Pega uma seção pelo id.
  document.getElementById(id).scrollIntoView({              // Leva o usuário até ela.
    behavior: 'smooth'                                      // Animação.
  });
}



// •Fontes                   - https://developer.mozilla.org/pt-BR/docs/Web/API/Element/scrollIntoView
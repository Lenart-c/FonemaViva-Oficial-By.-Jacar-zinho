
    //Está merda vai levar o usuário até uma parte da página com um scroll mais sua suave. Resumindo é uma animação
function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({
    behavior: 'smooth'
  });
}
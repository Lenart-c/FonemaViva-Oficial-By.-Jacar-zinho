// ==========================================
// PÁGINA EM DESENVOLVIMENTO
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

  const btnVoltar = document.getElementById("btnVoltar");

  if (!btnVoltar) return;


  // ==========================================
  // BOTÃO VOLTAR
  // ==========================================

  btnVoltar.addEventListener("click", () => {

    if (window.history.length > 1) {
      window.history.back();
      return;
    }

    window.location.href = "./home.html";

  });

});
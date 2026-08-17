// ==========================
// TELA DE INICIALIZAÇÃO
// ==========================

const introScreen = document.getElementById("introScreen");
const introLogo = document.querySelector(".intro-logo");

if (introScreen && introLogo) {

  introLogo.addEventListener("animationend", function (event) {

    if (event.animationName !== "introLogoEnter") {
      return;
    }

    // Espera um pouco antes do final
    setTimeout(() => {

      introScreen.classList.add("exit");

      // Libera o index depois da animação final
      setTimeout(() => {

        document.body.classList.remove("intro-active");

        introScreen.remove();

      }, 1000);

    }, 1000);

  }, { once: true });

}

// ==========================
// SCROLL SUAVE
// ==========================

function scrollToSection(id) {

  const elemento = document.getElementById(id);

  if (elemento) {

    elemento.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

  }

}

// ==========================
// TEMA AUTOMÁTICO
// ==========================

const mediaTheme =
window.matchMedia("(prefers-color-scheme: dark)");

const themeButtons =
document.querySelectorAll(".theme-btn");

let temaManual = false;

function aplicarTema(theme){

    document.body.classList.toggle(
        "dark-mode",
        theme==="dark"
    );

    localStorage.setItem("tema",theme);

    themeButtons.forEach(btn=>{

        btn.classList.toggle(
            "active-theme",
            btn.dataset.theme===theme
        );

    });

}

function detectarTemaSistema() {

  if (mediaTheme.matches) {

    aplicarTema("dark");

  } else {

    aplicarTema("light");

  }

}

detectarTemaSistema();

mediaTheme.addEventListener("change", (event) => {

  if (!temaManual) {

    aplicarTema(
      event.matches
      ? "dark"
      : "light"
    );

  }

});

themeButtons.forEach(button => {

  button.addEventListener("click", () => {

    temaManual = true;

    aplicarTema(
      button.dataset.theme
    );

  });

});

// ==========================
// CARROSSEL
// ==========================

const slides =
document.querySelectorAll(".slide");

const dots =
document.querySelectorAll(".dot");

const prev =
document.querySelector(".prev");

const next =
document.querySelector(".next");

let slideAtual = 0;

let autoPlay;

// ==========================
// MOSTRAR SLIDE
// ==========================

function mostrarSlide(index) {

  slides.forEach(slide => {

    slide.classList.remove("active");

  });

  dots.forEach(dot => {

    dot.classList.remove("active");

  });

  if (slides[index]) {

    slides[index].classList.add("active");

  }

  if (dots[index]) {

    dots[index].classList.add("active");

  }

}

// ==========================
// PRÓXIMO SLIDE
// ==========================

function proximoSlide() {

  slideAtual++;

  if (slideAtual >= slides.length) {

    slideAtual = 0;

  }

  mostrarSlide(slideAtual);

}

// ==========================
// SLIDE ANTERIOR
// ==========================

function slideAnterior() {

  slideAtual--;

  if (slideAtual < 0) {

    slideAtual = slides.length - 1;

  }

  mostrarSlide(slideAtual);

}

// ==========================
// AUTO PLAY
// ==========================

function iniciarAutoPlay() {

    clearInterval(autoPlay);

    autoPlay = setInterval(() => {

        proximoSlide();

    }, 3000);

}

function pararAutoPlay() {

  clearInterval(autoPlay);

}

// INICIAR
if (slides.length > 0) {

    slideAtual = 0;

    mostrarSlide(slideAtual);

    iniciarAutoPlay();

}

// ==========================
// EVENTOS SETAS
// ==========================

if (next) {

  next.addEventListener("click", () => {

    proximoSlide();

    pararAutoPlay();

    iniciarAutoPlay();

  });

}

if (prev) {

  prev.addEventListener("click", () => {

    slideAnterior();

    pararAutoPlay();

    iniciarAutoPlay();

  });

}

// ==========================
// DOTS
// ==========================

dots.forEach((dot, index) => {

  dot.addEventListener("click", () => {

    slideAtual = index;

    mostrarSlide(slideAtual);

    pararAutoPlay();

    iniciarAutoPlay();

  });

});

// ==========================
// PAUSAR AO PASSAR MOUSE
// ==========================

const hero =
document.querySelector(".hero");

if (hero) {

  hero.addEventListener("mouseenter", () => {

    pararAutoPlay();

  });

  hero.addEventListener("mouseleave", () => {

    iniciarAutoPlay();

  });

}

// ==========================
// ANIMAÇÃO AO ROLAR
// ==========================

const elementosAnimados =
document.querySelectorAll(
  ".sobre-card, .card-moderno, .info-card"
);

function animarAoScroll() {

  elementosAnimados.forEach(elemento => {

    const top =
    elemento.getBoundingClientRect().top;

    const windowHeight =
    window.innerHeight;

    if (top < windowHeight - 100) {

      elemento.classList.add("show");

    }

  });

}

window.addEventListener(
  "scroll",
  animarAoScroll
);

animarAoScroll();
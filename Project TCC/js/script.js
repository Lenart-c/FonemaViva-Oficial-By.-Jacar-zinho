// ==========================
// SCROLL SUAVE
// ==========================

function scrollToSection(id) {

  document.getElementById(id).scrollIntoView({
    behavior: "smooth"
  });

}

// ==========================
// MENU LATERAL
// ==========================

const menuToggle =
document.querySelector(".menu-toggle");

const sideMenu =
document.querySelector(".side-menu");

const closeMenu =
document.querySelector(".close-menu");

const overlay =
document.querySelector(".menu-overlay");

// ABRIR MENU
if (menuToggle) {

  menuToggle.addEventListener("click", () => {

    sideMenu.classList.add("active");

    overlay.classList.add("active");

  });

}

// FECHAR MENU
function fecharMenu() {

  if (sideMenu && overlay) {

    sideMenu.classList.remove("active");

    overlay.classList.remove("active");

  }

}

if (closeMenu) {

  closeMenu.addEventListener("click", fecharMenu);

}

// FECHAR AO CLICAR FORA
if (overlay) {

  overlay.addEventListener("click", fecharMenu);

}

// FECHAR AO CLICAR NOS LINKS
document.querySelectorAll(".menu-links a")
.forEach(link => {

  link.addEventListener("click", () => {

    fecharMenu();

  });

});

// FECHAR COM ESC
document.addEventListener("keydown", (event) => {

  if (event.key === "Escape") {

    fecharMenu();

  }

});

// ==========================
// TEMA AUTOMÁTICO
// ==========================

// DETECTA O TEMA DO:
// ✔ GOOGLE CHROME
// ✔ GOOGLE PESQUISA
// ✔ WINDOWS
// ✔ ANDROID
// ✔ iPHONE
// ✔ SISTEMA OPERACIONAL

const mediaTheme =
window.matchMedia("(prefers-color-scheme: dark)");

// BOTÕES DE TEMA
const themeButtons =
document.querySelectorAll(".theme-btn");

// CONTROLE MANUAL
let temaManual = false;

// ==========================
// APLICAR TEMA
// ==========================

function aplicarTema(theme) {

  if (theme === "dark") {

    document.body.classList.add("dark-mode");

  } else {

    document.body.classList.remove("dark-mode");

  }

  // BOTÃO ATIVO
  themeButtons.forEach(btn => {

    btn.classList.remove("active-theme");

    if (btn.dataset.theme === theme) {

      btn.classList.add("active-theme");

    }

  });

}

// ==========================
// DETECTAR TEMA AUTOMÁTICO
// ==========================

function detectarTemaSistema() {

  if (mediaTheme.matches) {

    aplicarTema("dark");

  } else {

    aplicarTema("light");

  }

}

// EXECUTA AO ENTRAR
detectarTemaSistema();

// ==========================
// ALTERAÇÃO AUTOMÁTICA
// ==========================

// ALTERA EM TEMPO REAL
// CASO O USUÁRIO MUDE O
// TEMA DO NAVEGADOR/SISTEMA

mediaTheme.addEventListener("change", (event) => {

  // SOMENTE SE NÃO ESCOLHER
  // MANUALMENTE

  if (!temaManual) {

    if (event.matches) {

      aplicarTema("dark");

    } else {

      aplicarTema("light");

    }

  }

});

// ==========================
// ESCOLHA MANUAL
// ==========================

themeButtons.forEach(button => {

  button.addEventListener("click", () => {

    temaManual = true;

    const theme =
    button.dataset.theme;

    aplicarTema(theme);

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

  autoPlay = setInterval(() => {

    proximoSlide();

  }, 5000);

}

function pararAutoPlay() {

  clearInterval(autoPlay);

}

// INICIAR AUTO PLAY
if (slides.length > 0) {

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

// ==========================
// SCROLL SUAVE
// ==========================

function scrollToSection(id) {

  document.getElementById(id).scrollIntoView({
    behavior: "smooth"
  });

}

const SUPABASE_URL =
"https://mnfryxvtogpiwacpyhgo.supabase.co";

const SUPABASE_KEY =
"sb_publishable_YYMfDfWKaer8F1IEOFVOMQ_acS2xa2G";

function verificarSessao() {

  const usuarioId =
  localStorage.getItem("usuarioId") ||
  sessionStorage.getItem("usuarioId");

  if (!usuarioId) {

   window.location.replace("./index.html");

  }

}

verificarSessao();

window.addEventListener(
  "pageshow",
  verificarSessao
);

// ==========================
// BLOQUEAR BOTÃO VOLTAR
// ==========================

history.pushState(null, "", location.href);

window.addEventListener("popstate", () => {

  history.pushState(null, "", location.href);

  saiuPeloHistorico = true;

  logoutModal.classList.add("active");

});


// ==========================
// CARREGAR USUÁRIO
// ==========================

async function atualizarPerfilUsuario() {

  try {

    const usuarioId =
localStorage.getItem("usuarioId") ||
sessionStorage.getItem("usuarioId");

if (!usuarioId) {

  window.location.replace(
    "./login.html"
  );

}

    const resposta =
    await fetch(
      `${SUPABASE_URL}/rest/v1/usuarios?id=eq.${usuarioId}`,
      {
        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization":
          `Bearer ${SUPABASE_KEY}`
        }
      }
    );

    const dados =
    await resposta.json();

    if (!dados.length) return;

    const usuario = dados[0];

    const nomeElemento =
    document.getElementById("user-name");

    const fotoElemento =
    document.getElementById("user-photo");

    if (nomeElemento) {

      nomeElemento.textContent =
      usuario.apelido ||
      usuario.nome ||
      "Usuário";

    }

    if (
      fotoElemento &&
      usuario.foto_perfil
    ) {

      fotoElemento.src =
      usuario.foto_perfil;

    }

  }

  catch (erro) {

    console.error(
      "Erro ao carregar usuário:",
      erro
    );

  }

}

atualizarPerfilUsuario();

// ==========================
// BOTÃO EXERCÍCIOS
// ==========================

const btnExercicios =
document.getElementById("btnExercicios");

btnExercicios?.addEventListener("click", async () => {

  const usuarioId =
    localStorage.getItem("usuarioId") ||
    sessionStorage.getItem("usuarioId");

  if (!usuarioId) {

    window.location.replace("./index.html");

    return;

  }

  try {

    const resposta =
      await fetch(
        `${SUPABASE_URL}/rest/v1/usuarios?id=eq.${usuarioId}&select=data_nascimento`,
        {
          method: "GET",

          headers: {
            "apikey": SUPABASE_KEY,
            "Authorization": `Bearer ${SUPABASE_KEY}`
          }
        }
      );

    if (!resposta.ok) {

      throw new Error(
        "Não foi possível verificar a data de nascimento."
      );

    }

    const dados =
      await resposta.json();

    if (!dados || dados.length === 0) {

      throw new Error(
        "Usuário não encontrado."
      );

    }

    const dataNascimento =
      dados[0].data_nascimento;

    // ==========================
    // PRIMEIRO ACESSO
    // ==========================

    if (!dataNascimento) {

      window.location.href =
        "./escolha.html";

      return;

    }

    // ==========================
    // CALCULAR IDADE
    // ==========================

    const nascimento =
      new Date(`${dataNascimento}T00:00:00`);

    const hoje =
      new Date();

    let idade =
      hoje.getFullYear() -
      nascimento.getFullYear();

    const mes =
      hoje.getMonth() -
      nascimento.getMonth();

    if (
      mes < 0 ||
      (
        mes === 0 &&
        hoje.getDate() < nascimento.getDate()
      )
    ) {

      idade--;

    }

    // ==========================
    // DIRECIONAMENTO
    // ==========================

    if (idade >= 18) {

      window.location.href =
        "./adultos/adultos.html";

    } else {

      window.location.href =
        "./crianças/criancas.html";

    }

  }

  catch (erro) {

    console.error(
      "Erro ao verificar data de nascimento:",
      erro
    );

    alert(
      "Não foi possível verificar sua data de nascimento. Tente novamente."
    );

  }

});


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

  slideAtual = index;

  slides.forEach(slide => {

    slide.classList.remove("active");

  });

  dots.forEach(dot => {

    dot.classList.remove("active");

  });

  slides[index].classList.add("active");

  dots[index].classList.add("active");

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


// ==========================
// LOGOUT
// ==========================

const logoutBtn =
document.getElementById("logoutBtn");

const logoutModal =
document.querySelector(".logout-modal");

const cancelLogout =
document.getElementById("cancelLogout");

const confirmLogout =
document.getElementById("confirmLogout");

const logoutLoading =
document.querySelector(".logout-loading");

let saiuPeloHistorico = false;

logoutBtn?.addEventListener("click", () => {

  logoutModal.classList.add("active");

});

cancelLogout?.addEventListener("click", () => {

  logoutModal.classList.remove("active");

  saiuPeloHistorico = false;

});

confirmLogout?.addEventListener("click", () => {

  logoutModal.classList.remove("active");

  logoutLoading.classList.add("active");

  localStorage.clear();
  sessionStorage.clear();

  setTimeout(() => {

    location.replace("./index.html");

  }, saiuPeloHistorico ? 1500 : 1500);

});

// ==========================
// CARREGAMENTO INICIAL
// ==========================

window.addEventListener("load", () => {

  const pageLoading =
    document.getElementById("pageLoading");

  if (!pageLoading) return;

  // Pequeno tempo extra para garantir
  // que os elementos visuais sejam renderizados

  setTimeout(() => {

    pageLoading.classList.add("hidden");

    // Remove completamente depois da animação

    setTimeout(() => {

      pageLoading.remove();

    }, 500);

  }, 1500);

});
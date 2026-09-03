// ==========================
// SCROLL SUAVE
// ==========================

function scrollToSection(id) {
  const elemento = document.getElementById(id);

  if (elemento) {
    elemento.scrollIntoView({
      behavior: "smooth"
    });
  }
}


// ==========================
// SUPABASE
// ==========================

const SUPABASE_URL =
  "https://mnfryxvtogpiwacpyhgo.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_YYMfDfWKaer8F1IEOFVOMQ_acS2xa2G";


// ==========================
// VERIFICAR SESSÃO
// ==========================

function verificarSessao() {

  const usuarioId =
    localStorage.getItem("usuarioId") ||
    sessionStorage.getItem("usuarioId");

  if (!usuarioId) {
    window.location.replace("./index.html");
    return false;
  }

  return true;
}

verificarSessao();

window.addEventListener(
  "pageshow",
  verificarSessao
);


// ==========================
// ELEMENTOS DO LOGOUT
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


// ==========================
// CONTROLE DO LOGOUT
// ==========================

let saiuPeloHistorico = false;

let modalAbertoPeloHistorico = false;


// ==========================
// PREPARAR HISTÓRICO
// ==========================

/*
 * Criamos uma entrada adicional do
 * próprio Home no histórico.
 *
 * Assim, quando o usuário clicar
 * em "Voltar", o popstate será
 * capturado antes de abandonar
 * a página.
 */

history.pushState(
  {
    fonemaVivaHome: true
  },
  "",
  location.href
);


// ==========================
// ABRIR MODAL DE LOGOUT
// ==========================

function abrirModalLogout(
  veioDoHistorico = false
) {

  if (!logoutModal) {
    return;
  }

  saiuPeloHistorico =
    veioDoHistorico;

  modalAbertoPeloHistorico =
    veioDoHistorico;

  logoutModal.classList.add(
    "active"
  );
}


// ==========================
// FECHAR MODAL DE LOGOUT
// ==========================

function fecharModalLogout() {

  if (!logoutModal) {
    return;
  }

  logoutModal.classList.remove(
    "active"
  );

  saiuPeloHistorico = false;

  modalAbertoPeloHistorico = false;
}


// ==========================
// BOTÃO VOLTAR DO NAVEGADOR
// ==========================

window.addEventListener(
  "popstate",
  function () {

    /*
     * O navegador tentou voltar.
     *
     * Recolocamos imediatamente
     * o Home no histórico.
     */

    history.pushState(
      {
        fonemaVivaHome: true
      },
      "",
      location.href
    );

    /*
     * Agora mostramos a mesma tela
     * utilizada pelo botão "Sair".
     */

    abrirModalLogout(true);
  }
);


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

      return;
    }

    const resposta =
      await fetch(
        `${SUPABASE_URL}/rest/v1/usuarios?id=eq.${encodeURIComponent(usuarioId)}`,
        {
          method: "GET",

          headers: {
            "apikey":
              SUPABASE_KEY,

            "Authorization":
              `Bearer ${SUPABASE_KEY}`
          }
        }
      );

    if (!resposta.ok) {

      throw new Error(
        "Não foi possível carregar os dados do usuário."
      );
    }

    const dados =
      await resposta.json();

    if (
      !dados ||
      dados.length === 0
    ) {
      return;
    }

    const usuario =
      dados[0];

    const nomeElemento =
      document.getElementById(
        "user-name"
      );

    const fotoElemento =
      document.getElementById(
        "user-photo"
      );

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
  document.getElementById(
    "btnExercicios"
  );

const footerExercicios =
  document.getElementById(
    "footerExercicios"
  );


// ==========================
// CALCULAR IDADE
// ==========================

function calcularIdade(
  dataNascimento
) {

  const partes =
    dataNascimento.split("-");

  const anoNascimento =
    Number(partes[0]);

  const mesNascimento =
    Number(partes[1]);

  const diaNascimento =
    Number(partes[2]);

  const hoje =
    new Date();

  const anoAtual =
    hoje.getFullYear();

  const mesAtual =
    hoje.getMonth() + 1;

  const diaAtual =
    hoje.getDate();

  let idade =
    anoAtual -
    anoNascimento;

  const aniversarioAindaNaoChegou =
    mesAtual < mesNascimento ||
    (
      mesAtual === mesNascimento &&
      diaAtual < diaNascimento
    );

  if (
    aniversarioAindaNaoChegou
  ) {

    idade--;
  }

  return idade;
}


// ==========================
// IR PARA EXERCÍCIOS
// ==========================

async function irParaExercicios() {

  const usuarioId =
    localStorage.getItem("usuarioId") ||
    sessionStorage.getItem("usuarioId");

  if (!usuarioId) {

    window.location.replace(
      "./index.html"
    );

    return;
  }

  try {

    const resposta =
      await fetch(
        `${SUPABASE_URL}/rest/v1/usuarios?id=eq.${encodeURIComponent(usuarioId)}&select=data_nascimento`,
        {
          method: "GET",

          headers: {
            "apikey":
              SUPABASE_KEY,

            "Authorization":
              `Bearer ${SUPABASE_KEY}`
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

    if (
      !dados ||
      dados.length === 0
    ) {

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
    // CALCULAR IDADE REAL
    // ==========================

    const idade =
      calcularIdade(
        dataNascimento
      );


    // ==========================
    // DIRECIONAMENTO
    // ==========================

    if (idade <= 15) {

      window.location.href =
        "./crianças/criancas.html";

    }

    else if (
      idade >= 16 &&
      idade <= 65
    ) {

      window.location.href =
        "./adultos/adultos.html";

    }

    else {

      console.warn(
        "Idade fora da faixa configurada:",
        idade
      );

      alert(
        "A idade informada está fora da faixa etária disponível."
      );
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
}


// ==========================
// BOTÃO PRINCIPAL
// ==========================

btnExercicios?.addEventListener(
  "click",
  irParaExercicios
);


// ==========================
// EXERCÍCIOS DO FOOTER
// ==========================

footerExercicios?.addEventListener(
  "click",
  (event) => {

    event.preventDefault();

    irParaExercicios();
  }
);


// ==========================
// MENU LATERAL
// ==========================

const menuToggle =
  document.querySelector(
    ".menu-toggle"
  );

const sideMenu =
  document.querySelector(
    ".side-menu"
  );

const closeMenu =
  document.querySelector(
    ".close-menu"
  );

const overlay =
  document.querySelector(
    ".menu-overlay"
  );


// ==========================
// ABRIR MENU
// ==========================

if (menuToggle) {

  menuToggle.addEventListener(
    "click",
    () => {

      if (sideMenu) {
        sideMenu.classList.add(
          "active"
        );
      }

      if (overlay) {
        overlay.classList.add(
          "active"
        );
      }
    }
  );
}


// ==========================
// FECHAR MENU
// ==========================

function fecharMenu() {

  if (sideMenu) {

    sideMenu.classList.remove(
      "active"
    );
  }

  if (overlay) {

    overlay.classList.remove(
      "active"
    );
  }
}


if (closeMenu) {

  closeMenu.addEventListener(
    "click",
    fecharMenu
  );
}


if (overlay) {

  overlay.addEventListener(
    "click",
    fecharMenu
  );
}


// ==========================
// FECHAR AO CLICAR NOS LINKS
// ==========================

document
  .querySelectorAll(
    ".menu-links a"
  )
  .forEach(
    (link) => {

      link.addEventListener(
        "click",
        () => {

          fecharMenu();
        }
      );
    }
  );


// ==========================
// FECHAR COM ESC
// ==========================

document.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key === "Escape"
    ) {

      fecharMenu();

      if (
        logoutModal &&
        logoutModal.classList.contains(
          "active"
        )
      ) {

        fecharModalLogout();
      }
    }
  }
);


// ==========================
// TEMA AUTOMÁTICO
// ==========================

const mediaTheme =
  window.matchMedia(
    "(prefers-color-scheme: dark)"
  );

const themeButtons =
  document.querySelectorAll(
    ".theme-btn"
  );

let temaManual = false;


// ==========================
// APLICAR TEMA
// ==========================

function aplicarTema(
  theme
) {

  if (
    theme === "dark"
  ) {

    document.body.classList.add(
      "dark-mode"
    );

  }
  else {

    document.body.classList.remove(
      "dark-mode"
    );
  }


  // ==========================
  // BOTÃO ATIVO
  // ==========================

  themeButtons.forEach(
    (btn) => {

      btn.classList.remove(
        "active-theme"
      );

      if (
        btn.dataset.theme ===
        theme
      ) {

        btn.classList.add(
          "active-theme"
        );
      }
    }
  );
}


// ==========================
// DETECTAR TEMA SISTEMA
// ==========================

function detectarTemaSistema() {

  if (
    mediaTheme.matches
  ) {

    aplicarTema(
      "dark"
    );

  }
  else {

    aplicarTema(
      "light"
    );
  }
}


// ==========================
// EXECUTAR AO ENTRAR
// ==========================

detectarTemaSistema();


// ==========================
// ALTERAÇÃO AUTOMÁTICA
// ==========================

mediaTheme.addEventListener(
  "change",
  (event) => {

    if (!temaManual) {

      if (
        event.matches
      ) {

        aplicarTema(
          "dark"
        );

      }
      else {

        aplicarTema(
          "light"
        );
      }
    }
  }
);


// ==========================
// ESCOLHA MANUAL
// ==========================

themeButtons.forEach(
  (button) => {

    button.addEventListener(
      "click",
      () => {

        temaManual = true;

        const theme =
          button.dataset.theme;

        aplicarTema(
          theme
        );
      }
    );
  }
);


// ==========================
// CARROSSEL
// ==========================

const slides =
  document.querySelectorAll(
    ".slide"
  );

const dots =
  document.querySelectorAll(
    ".dot"
  );

const prev =
  document.querySelector(
    ".prev"
  );

const next =
  document.querySelector(
    ".next"
  );

let slideAtual = 0;

let autoPlay;


// ==========================
// MOSTRAR SLIDE
// ==========================

function mostrarSlide(
  index
) {

  if (
    slides.length === 0
  ) {
    return;
  }

  slideAtual =
    index;

  slides.forEach(
    (slide) => {

      slide.classList.remove(
        "active"
      );
    }
  );

  dots.forEach(
    (dot) => {

      dot.classList.remove(
        "active"
      );
    }
  );

  slides[index]?.classList.add(
    "active"
  );

  dots[index]?.classList.add(
    "active"
  );
}


// ==========================
// PRÓXIMO SLIDE
// ==========================

function proximoSlide() {

  slideAtual++;

  if (
    slideAtual >=
    slides.length
  ) {

    slideAtual = 0;
  }

  mostrarSlide(
    slideAtual
  );
}


// ==========================
// SLIDE ANTERIOR
// ==========================

function slideAnterior() {

  slideAtual--;

  if (
    slideAtual < 0
  ) {

    slideAtual =
      slides.length - 1;
  }

  mostrarSlide(
    slideAtual
  );
}


// ==========================
// AUTO PLAY
// ==========================

function iniciarAutoPlay() {

  clearInterval(
    autoPlay
  );

  autoPlay =
    setInterval(
      () => {

        proximoSlide();

      },
      3000
    );
}


function pararAutoPlay() {

  clearInterval(
    autoPlay
  );
}


if (
  slides.length > 0
) {

  iniciarAutoPlay();
}


// ==========================
// EVENTO SETA PRÓXIMA
// ==========================

if (next) {

  next.addEventListener(
    "click",
    () => {

      proximoSlide();

      pararAutoPlay();

      iniciarAutoPlay();
    }
  );
}


// ==========================
// EVENTO SETA ANTERIOR
// ==========================

if (prev) {

  prev.addEventListener(
    "click",
    () => {

      slideAnterior();

      pararAutoPlay();

      iniciarAutoPlay();
    }
  );
}


// ==========================
// DOTS
// ==========================

dots.forEach(
  (dot, index) => {

    dot.addEventListener(
      "click",
      () => {

        slideAtual =
          index;

        mostrarSlide(
          slideAtual
        );

        pararAutoPlay();

        iniciarAutoPlay();
      }
    );
  }
);


// ==========================
// PAUSAR AO PASSAR MOUSE
// ==========================

const hero =
  document.querySelector(
    ".hero"
  );

if (hero) {

  hero.addEventListener(
    "mouseenter",
    () => {

      pararAutoPlay();
    }
  );

  hero.addEventListener(
    "mouseleave",
    () => {

      iniciarAutoPlay();
    }
  );
}


// ==========================
// ANIMAÇÃO AO ROLAR
// ==========================

const elementosAnimados =
  document.querySelectorAll(
    ".sobre-card, .card-moderno, .info-card"
  );


function animarAoScroll() {

  elementosAnimados.forEach(
    (elemento) => {

      const top =
        elemento
          .getBoundingClientRect()
          .top;

      const windowHeight =
        window.innerHeight;

      if (
        top <
        windowHeight - 100
      ) {

        elemento.classList.add(
          "show"
        );
      }
    }
  );
}


let scrollAgendado = false;


window.addEventListener(
  "scroll",
  () => {

    if (
      !scrollAgendado
    ) {

      window.requestAnimationFrame(
        () => {

          animarAoScroll();

          scrollAgendado =
            false;
        }
      );

      scrollAgendado =
        true;
    }
  },
  {
    passive: true
  }
);


animarAoScroll();


// ==========================
// BOTÃO INÍCIO DO FOOTER
// ==========================

const footerInicio =
  document.getElementById(
    "footerInicio"
  );


footerInicio?.addEventListener(
  "click",
  (event) => {

    event.preventDefault();

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }
);


// ==========================
// BOTÃO SAIR DO MENU
// ==========================

logoutBtn?.addEventListener(
  "click",
  () => {

    abrirModalLogout(
      false
    );
  }
);


// ==========================
// CANCELAR LOGOUT
// ==========================

cancelLogout?.addEventListener(
  "click",
  () => {

    fecharModalLogout();
  }
);


// ==========================
// CLICAR FORA DO MODAL
// ==========================

logoutModal?.addEventListener(
  "click",
  (event) => {

    if (
      event.target ===
      logoutModal
    ) {

      fecharModalLogout();
    }
  }
);


// ==========================
// CONFIRMAR LOGOUT
// ==========================

confirmLogout?.addEventListener(
  "click",
  () => {

    /*
     * Impede múltiplos cliques.
     */

    confirmLogout.disabled = true;

    if (cancelLogout) {
      cancelLogout.disabled = true;
    }


    /*
     * Fecha o modal.
     */

    logoutModal?.classList.remove(
      "active"
    );


    /*
     * Mostra "Saindo..."
     */

    logoutLoading?.classList.add(
      "active"
    );


    /*
     * Remove SOMENTE os dados
     * relacionados à sessão local.
     *
     * Não precisamos manter dados
     * antigos de usuário logado.
     */

    localStorage.removeItem(
      "usuarioId"
    );

    sessionStorage.removeItem(
      "usuarioId"
    );


    /*
     * Também removemos o email
     * salvo para login.
     */

    localStorage.removeItem(
      "email"
    );


    /*
     * Aguarda a animação.
     */

    setTimeout(
      () => {

        window.location.replace(
          "./index.html"
        );

      },
      1500
    );
  }
);


// ==========================
// CARREGAMENTO INICIAL
// ==========================

window.addEventListener(
  "load",
  () => {

    const pageLoading =
      document.getElementById(
        "pageLoading"
      );

    if (!pageLoading) {
      return;
    }


    /*
     * Pequeno tempo extra para
     * garantir que os elementos
     * visuais sejam renderizados.
     */

    setTimeout(
      () => {

        pageLoading.classList.add(
          "hidden"
        );


        /*
         * Remove completamente
         * depois da animação.
         */

        setTimeout(
          () => {

            pageLoading.remove();

          },
          500
        );

      },
      1500
    );
  }
);
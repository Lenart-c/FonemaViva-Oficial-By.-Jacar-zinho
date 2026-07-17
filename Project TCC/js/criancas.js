// =========================
// SIMULAÇÃO DE LOGIN
// =========================

// false = não salva nada
// true = salva progresso
const isLoggedIn = false;

// =========================
// TEMA (AUTO + MANUAL)
// =========================

const themeBtns = document.querySelectorAll(".theme-btn");

let manualTheme = false;

function setTheme(theme){

  if(theme === "dark"){

    document.body.classList.add("dark-mode");

  } else {

    document.body.classList.remove("dark-mode");

  }

  themeBtns.forEach(btn=>{

    btn.classList.remove("active-theme");

    if(btn.dataset.theme === theme){

      btn.classList.add("active-theme");

    }

  });

}

// DETECTA O TEMA DO NAVEGADOR

function systemTheme(){

  return window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches
    ? "dark"
    : "light";

}

// APLICA AUTOMATICAMENTE

function applyAutoTheme(){

  if(!manualTheme){

    setTheme(systemTheme());

  }

}

// INICIAR TEMA

applyAutoTheme();

// MUDANÇA AUTOMÁTICA DO NAVEGADOR

window.matchMedia(
  "(prefers-color-scheme: dark)"
).addEventListener("change", ()=>{

  applyAutoTheme();

});

// TROCA MANUAL

themeBtns.forEach(btn=>{

  btn.addEventListener("click", ()=>{

    manualTheme = true;

    setTheme(btn.dataset.theme);

  });

});

// =========================
// MENU LATERAL
// =========================

const menuToggle =
document.querySelector(".menu-toggle");

const sideMenu =
document.querySelector(".side-menu");

const closeMenu =
document.querySelector(".close-menu");

const overlay =
document.querySelector(".menu-overlay");

// ABRIR

menuToggle.addEventListener("click", ()=>{

  sideMenu.classList.add("active");
  overlay.classList.add("active");

});

// FECHAR

closeMenu.addEventListener(
  "click",
  closeSideMenu
);

overlay.addEventListener(
  "click",
  closeSideMenu
);

function closeSideMenu(){

  sideMenu.classList.remove("active");
  overlay.classList.remove("active");

}

// =========================
// FILTRO DE CATEGORIAS
// =========================

const menuItems =
document.querySelectorAll("#menu li");

const cards =
document.querySelectorAll(".card");

menuItems.forEach(item=>{

  item.addEventListener("click", ()=>{

    menuItems.forEach(i=>{

      i.classList.remove("active");

    });

    item.classList.add("active");

    const categoria =
    item.dataset.cat;

    cards.forEach(card=>{

      if(
        categoria === "todos" ||
        card.dataset.cat === categoria
      ){

        card.style.display = "block";

      } else {

        card.style.display = "none";

      }

    });

  });

});

// =========================
// PROGRESSO
// =========================

let progress = {
  respiracao: 0,
  pronuncia: 0,
  audicao: 0,
  coordenacao: 0
};

let done = new Set();

// CARREGAR SALVAMENTO

if(isLoggedIn){

  const saved =
  JSON.parse(
    localStorage.getItem(
      "doneExercises"
    )
  );

  if(saved){

    done = new Set(saved);

  }

}

// =========================
// ATUALIZAR UI
// =========================

function updateUI(){

  const totals = {
    respiracao: 0,
    pronuncia: 0,
    audicao: 0,
    coordenacao: 0
  };

  const completed = {
    respiracao: 0,
    pronuncia: 0,
    audicao: 0,
    coordenacao: 0
  };

  cards.forEach(card=>{

    const category =
    card.dataset.cat;

    const id =
    card.dataset.id;

    // TOTAL DE EXERCÍCIOS

    if(
      totals[category] !== undefined
    ){

      totals[category]++;

    }

    // EXERCÍCIOS FEITOS

    if(done.has(id)){

      if(
        completed[category] !== undefined
      ){

        completed[category]++;

      }

    }

  });

  // PORCENTAGEM

  progress.respiracao =
  totals.respiracao
  ? Math.round(
    (
      completed.respiracao /
      totals.respiracao
    ) * 100
  )
  : 0;

  progress.pronuncia =
  totals.pronuncia
  ? Math.round(
    (
      completed.pronuncia /
      totals.pronuncia
    ) * 100
  )
  : 0;

  progress.audicao =
  totals.audicao
  ? Math.round(
    (
      completed.audicao /
      totals.audicao
    ) * 100
  )
  : 0;

  progress.coordenacao =
  totals.coordenacao
  ? Math.round(
    (
      completed.coordenacao /
      totals.coordenacao
    ) * 100
  )
  : 0;

  // TEXTO %

  document.getElementById(
    "p-respiracao"
  ).innerText =
  progress.respiracao + "%";

  document.getElementById(
    "p-pronuncia"
  ).innerText =
  progress.pronuncia + "%";

  document.getElementById(
    "p-audicao"
  ).innerText =
  progress.audicao + "%";

  document.getElementById(
    "p-coordenacao"
  ).innerText =
  progress.coordenacao + "%";

  // BARRAS

  document.getElementById(
    "b-respiracao"
  ).style.width =
  progress.respiracao + "%";

  document.getElementById(
    "b-pronuncia"
  ).style.width =
  progress.pronuncia + "%";

  document.getElementById(
    "b-audicao"
  ).style.width =
  progress.audicao + "%";

  document.getElementById(
    "b-coordenacao"
  ).style.width =
  progress.coordenacao + "%";

  // TOTAL GERAL

  const totalDone =
  done.size;

  const totalCards =
  cards.length;

  const total =
  Math.round(
    (
      totalDone /
      totalCards
    ) * 100
  );

  document.getElementById(
    "p-total"
  ).innerText =
  total + "%";

  // SALVAR SOMENTE LOGADO

  if(isLoggedIn){

    localStorage.setItem(
      "doneExercises",
      JSON.stringify(
        [...done]
      )
    );

  }

}

// =========================
// INICIAR EXERCÍCIOS
// =========================

cards.forEach(card=>{

  const button =
  card.querySelector(".iniciar");

  button.addEventListener("click", (event)=>{

    const id =
    card.dataset.id;

    // CONTA APENAS UMA VEZ

    if(!done.has(id)){

      done.add(id);

      updateUI();

    }

    // REDIRECIONAR

    event.preventDefault();

    window.location.href =
    button.dataset.link;

  });

});

// =========================
// INICIAR
// =========================

updateUI();
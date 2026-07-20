// false = não salva nada TIPO COMO SE TIVESSE UM USUÁRIO LOGADO (SIMULA)
// true = salva progresso
const isLoggedIn = true;

// TEMA (AUTO + MANUAL)
const themeBtns =
document.querySelectorAll(".theme-btn");

let manualTheme = false;

function setTheme(theme){

  if(theme === "dark"){

    document.body.classList.add(
      "dark-mode"
    );

  } else {

    document.body.classList.remove(
      "dark-mode"
    );

  }

  themeBtns.forEach(btn=>{

    btn.classList.remove(
      "active-theme"
    );

    if(
      btn.dataset.theme === theme
    ){

      btn.classList.add(
        "active-theme"
      );

    }

  });

}

// DETECTA O TEMA DO NAVEGADOR SE É CLARO OU ESCURO
function systemTheme(){

  return window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches
    ? "dark"
    : "light";

}

// ELE APLICA AUTOMATICAMENTE
function applyAutoTheme(){

  if(!manualTheme){

    setTheme(systemTheme());

  }

}

// INICIA TEMA
applyAutoTheme();

// TEMA SISTEMA PADRÃO
window.matchMedia(
  "(prefers-color-scheme: dark)"
).addEventListener(
  "change",
  ()=>{

    applyAutoTheme();

  }
);

// TROCA MANUAL DE TEMA
themeBtns.forEach(btn=>{

  btn.addEventListener(
    "click",
    ()=>{

      manualTheme = true;

      setTheme(
        btn.dataset.theme
      );

    }
  );

});

// MENU LATERAL
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

// BOTÃO DE ABRIR MENU
menuToggle.addEventListener(
  "click",
  ()=>{

    sideMenu.classList.add(
      "active"
    );

    overlay.classList.add(
      "active"
    );

  }
);

// BOTÃO DE FECHAR MENU
closeMenu.addEventListener(
  "click",
  closeSideMenu
);

overlay.addEventListener(
  "click",
  closeSideMenu
);

function closeSideMenu(){

  sideMenu.classList.remove(
    "active"
  );

  overlay.classList.remove(
    "active"
  );

}

// FILTRA AS CATEGORIAS
const menuItems =
document.querySelectorAll(
  "#menu li"
);

const cards =
document.querySelectorAll(
  ".card"
);

menuItems.forEach(item=>{

  item.addEventListener(
    "click",
    ()=>{

      menuItems.forEach(i=>{

        i.classList.remove(
          "active"
        );

      });

      item.classList.add(
        "active"
      );

      const categoria =
      item.dataset.cat;

      cards.forEach(card=>{

        if(
          categoria === "todos" ||
          card.dataset.cat === categoria
        ){

          card.style.display =
          "block";

        } else {

          card.style.display =
          "none";

        }

      });

    }
  );

});

// CONTADOR DE PROGRESSO
let progress = {
  respiracao: 0,
  pronuncia: 0,
  audicao: 0,
  coordenacao: 0
};

// EXERCÍCIOS CONCLUÍDOS
let done =
new Set(
  JSON.parse(
    localStorage.getItem(
      "doneExercises"
    )
  ) || []
);

function animateProgressBar(id, value){

  const bar =
  document.getElementById(id);

  if(!bar){
    return;
  }

  bar.style.transition =
  "width 0.45s ease";

  bar.style.width = "0%";

  requestAnimationFrame(()=>{

    bar.style.width =
    value + "%";

  });

}

// ATUALIZA
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
      totals[category] !==
      undefined
    ){

      totals[category]++;

    }

    // EXERCÍCIOS FEITOS  :)))))

    if(done.has(id)){

      completed[category]++;

      // MARCA CARD COMO COMPLETO

      card.classList.add(
        "completed"
      );

    }

  });

  // PORCENTAGENS DAS BARRAS

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

  // BARRA DE PROGRESSO DE CADA CATEGORIA

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

  // BARRAS DE PROGRESSO

  animateProgressBar(
    "b-respiracao",
    progress.respiracao
  );

  animateProgressBar(
    "b-pronuncia",
    progress.pronuncia
  );

  animateProgressBar(
    "b-audicao",
    progress.audicao
  );

  animateProgressBar(
    "b-coordenacao",
    progress.coordenacao
  );

  // TOTAL DO PROGRESSO GERAL 

  const total =
  Math.round(
    (
      done.size /
      cards.length
    ) * 100
  );

  document.getElementById(
    "p-total"
  ).innerText =
  total + "%";

  // SALVA

  if(isLoggedIn){

    localStorage.setItem(
      "doneExercises",
      JSON.stringify(
        [...done]
      )
    );

  }

}
// INICIA OS EXERCÍCIOS


cards.forEach(card=>{

  const button =
  card.querySelector(
    ".iniciar"
  );

  button.addEventListener(
    "click",
    ()=>{

      const id =
      card.dataset.id;

      // ADICIONA 1 VEZ PRA CADA EXERCÍCIO

      if(!done.has(id)){
        done.add(id);
        updateUI();

      }

      // REDIRECIONA
      window.location.href =
      button.dataset.link;

    }
  );

});

// INICIA
updateUI();
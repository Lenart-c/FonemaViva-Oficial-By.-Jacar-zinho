const supabaseUrl =
"https://mnfryxvtogpiwacpyhgo.supabase.co";

const supabaseKey =
"sb_publishable_YYMfDfWKaer8F1IEOFVOMQ_acS2xa2G";

const supabaseClient =
window.supabase.createClient(
  supabaseUrl,
  supabaseKey
);

// ==========================
// PROTEÇÃO DE SESSÃO
// ==========================

function verificarSessao() {

  const usuarioId =
  localStorage.getItem("usuarioId") ||
  sessionStorage.getItem("usuarioId");

  if (!usuarioId) {

    window.location.replace(
      "./index.html"
    );

  }

}

verificarSessao();

window.addEventListener(
  "pageshow",
  verificarSessao
);

// ==========================
// ATUALIZA PERFIL PELO SUPABASE
// ==========================

async function atualizarPerfilUsuario() {

  try {

    const usuarioId = 
    localStorage.getItem("usuarioId") ||
    sessionStorage.getItem("usuarioId");

    if (!usuarioId) return;
    
    const { data, error } =
    await supabaseClient
    .from("usuarios")
    .select("*")
    .eq("id", usuarioId)
    .single();

    if (error) {

      console.error(error);
      return;

    }

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
      data.apelido ||
      data.nome ||
      "Usuário";

    }

    if (
      fotoElemento &&
      data.foto_perfil
    ) {

      fotoElemento.src =
      data.foto_perfil;

    }

  }

  catch (erro) {

    console.error(
      "Erro ao carregar perfil:",
      erro
    );

  }

}

atualizarPerfilUsuario();

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
if(menuToggle && sideMenu && overlay){

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

}

// BOTÃO DE FECHAR MENU
if(closeMenu){

  closeMenu.addEventListener(
    "click",
    closeSideMenu
  );

}

if(overlay){

  overlay.addEventListener(
    "click",
    closeSideMenu
  );

}

function closeSideMenu(){

  if(sideMenu){

    sideMenu.classList.remove(
      "active"
    );

  }

  if(overlay){

    overlay.classList.remove(
      "active"
    );

  }

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

// ATUALIZA
function updateUI(){

// RESPIRAÇÃO
const respiracao =
Number(
  localStorage.getItem("respiracao-progress")
) || 0;

const sopro =
Number(
  localStorage.getItem("sopro-progress")
) || 0;

progress.respiracao =
Math.round(
  (respiracao + sopro) / 2
);

// PRONÚNCIA
const sonsRL =
Number(
  localStorage.getItem("sons-rl-progress")
) || 0;

const leitura =
Number(
  localStorage.getItem("leitura-progress")
) || 0;

const travaLingua =
Number(
  localStorage.getItem("travalingua-progress")
) || 0;

progress.pronuncia =
Math.round(
  (sonsRL + leitura + travaLingua) / 3
);

// AUDIÇÃO
const escuta =
Number(
  localStorage.getItem("escuta-progress")
) || 0;

const diferenciacao =
Number(
  localStorage.getItem("diferenciacao-progress")
) || 0;

progress.audicao =
Math.round(
  (escuta + diferenciacao) / 2
);

// COORDENAÇÃO
const movimentos =
Number(
  localStorage.getItem("movimentos-lingua-progress")
) || 0;

const sequencia =
Number(
  localStorage.getItem("sequencia-palavras-progress")
) || 0;

progress.coordenacao =
Math.round(
  (movimentos + sequencia) / 2
);

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

  // TOTAL DO PROGRESSO GERAL 

  // TOTAL GERAL

const total =
Math.round(

  (

    progress.respiracao +

    progress.pronuncia +

    progress.audicao +

    progress.coordenacao

  ) / 4

);

  const pTotal =
  document.getElementById(
  "p-total"
  );

  if(pTotal){

  pTotal.innerText =
  total + "%";

}

}
// INICIA OS EXERCÍCIOS


cards.forEach(card=>{

  const button =
  card.querySelector(
    ".iniciar"
  );

  if(button){

    button.addEventListener(
      "click",
      ()=>{

        // REDIRECIONA
        window.location.href =
        button.dataset.link;

      }
    );

  }

});

// INICIA
updateUI();

window.addEventListener(
    "focus",
    updateUI
);

window.addEventListener(
    "pageshow",
    updateUI
);

window.addEventListener(
    "progressoAtualizado",
    updateUI
);
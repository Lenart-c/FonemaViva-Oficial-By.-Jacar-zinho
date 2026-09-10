// ==========================================
// TELA DE CARREGAMENTO
// ==========================================

const pageLoading =
document.getElementById(
  "pageLoading"
);

const loadingStartTime =
Date.now();

function finalizarCarregamento(){

  if(!pageLoading) return;

  const tempoDecorrido =
  Date.now() -
  loadingStartTime;

  const tempoMinimo =
  900;

  const tempoRestante =
  Math.max(
    0,
    tempoMinimo -
    tempoDecorrido
  );

  setTimeout(() => {

    pageLoading.classList.add(
      "loaded"
    );

    setTimeout(() => {

      pageLoading.remove();

    }, 550);

  }, tempoRestante);
}

window.addEventListener(
  "load",
  finalizarCarregamento
);


// ==========================================
// SUPABASE
// ==========================================

const supabaseUrl =
"https://mnfryxvtogpiwacpyhgo.supabase.co";

const supabaseKey =
"sb_publishable_YYMfDfWKaer8F1IEOFVOMQ_acS2xa2G";

const supabaseClient =
window.supabase.createClient(
  supabaseUrl,
  supabaseKey
);

const usuarioId =
localStorage.getItem("usuarioId") ||
sessionStorage.getItem("usuarioId");

if (!usuarioId) {
  window.location.replace(
    "./index.html"
  );
}

window.addEventListener(
  "pageshow",
  () => {
    const usuarioId =
    localStorage.getItem("usuarioId") ||
    sessionStorage.getItem("usuarioId");

    if (!usuarioId) {
      window.location.replace(
        "./index.html"
      );
    }
  }
);


// ==========================================
// EXERCÍCIOS E PROGRESSO
// ==========================================

const exercicios = [
{
id:"ch",
categoria:"pronuncia",
estrelas:1
},
{
id:"encherbalao",
categoria:"respiracao",
estrelas:1
},
{
id:"escuta",
categoria:"audicao",
estrelas:1
},
{
id:"movimentos-lingua",
categoria:"coordenacao",
estrelas:1
},
{
id:"lingua-maluca",
categoria:"coordenacao",
estrelas:1
},
{
id:"palavras",
categoria:"pronuncia",
estrelas:1
},
{
id:"bolha-imaginaria",
categoria:"respiracao",
estrelas:1
},
{
id:"diferenciacao",
categoria:"audicao",
estrelas:1
},
{
id:"facil",
categoria:"pronuncia",
estrelas:2
}
];


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


// ==========================================
// MENU LATERAL
// ==========================================

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


// ==========================================
// FILTRA AS CATEGORIAS
// ==========================================

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


// ==========================================
// CONTADOR DE PROGRESSO
// ==========================================

let progress = {

  respiracao: 0,

  pronuncia: 0,

  audicao: 0,

  coordenacao: 0

};


// ==========================================
// ATUALIZA PROGRESSO
// ==========================================

function updateUI(){

  progress = {

    respiracao:0,

    pronuncia:0,

    audicao:0,

    coordenacao:0

  };


  // ========================================
  // VERIFICA CADA EXERCÍCIO
  // ========================================

  exercicios.forEach(
    exercicio=>{

      const recompensa =
      localStorage.getItem(
        exercicio.id +
        "-recompensa"
      );

      if(recompensa){

        progress[
          exercicio.categoria
        ] +=
        exercicio.estrelas;

      }

    }
  );


  // ========================================
  // BARRA DE RESPIRAÇÃO
  // ========================================

  document.getElementById(
    "b-respiracao"
  ).style.width =
  (progress.respiracao / 2) *
  100 +
  "%";


  // ========================================
  // BARRA DE PRONÚNCIA
  // ========================================

  document.getElementById(
    "b-pronuncia"
  ).style.width =
  (progress.pronuncia / 4) *
  100 +
  "%";


  // ========================================
  // BARRA DE AUDIÇÃO
  // ========================================

  document.getElementById(
    "b-audicao"
  ).style.width =
  (progress.audicao / 2) *
  100 +
  "%";


  // ========================================
  // BARRA DE COORDENAÇÃO
  // ========================================

  document.getElementById(
    "b-coordenacao"
  ).style.width =
  (progress.coordenacao / 2) *
  100 +
  "%";


  // ========================================
  // ESTRELAS DE RESPIRAÇÃO
  // ========================================

  document.getElementById(
    "p-respiracao"
  ).innerText =
  "⭐ " +
  progress.respiracao;


  // ========================================
  // ESTRELAS DE PRONÚNCIA
  // ========================================

  document.getElementById(
    "p-pronuncia"
  ).innerText =
  "⭐ " +
  progress.pronuncia;


  // ========================================
  // ESTRELAS DE AUDIÇÃO
  // ========================================

  document.getElementById(
    "p-audicao"
  ).innerText =
  "⭐ " +
  progress.audicao;


  // ========================================
  // ESTRELAS DE COORDENAÇÃO
  // ========================================

  document.getElementById(
    "p-coordenacao"
  ).innerText =
  "⭐ " +
  progress.coordenacao;


  // ========================================
  // TOTAL DE ESTRELAS
  // ========================================

  const totalEstrelas =
  progress.respiracao +
  progress.pronuncia +
  progress.audicao +
  progress.coordenacao;


  document.getElementById(
    "p-total"
  ).innerText =
  "⭐ " +
  totalEstrelas;

}


// ==========================================
// INICIA OS EXERCÍCIOS
// ==========================================

cards.forEach(card=>{

  const button =
  card.querySelector(
    ".iniciar"
  );

  if(button){

    button.addEventListener(
      "click",
      ()=>{

        window.location.href =
        button.dataset.link;

      }
    );

  }

});


// ==========================================
// INICIA PROGRESSO
// ==========================================

updateUI();


// ==========================================
// ATUALIZA AO VOLTAR PARA A PÁGINA
// ==========================================

window.addEventListener(
  "pageshow",
  () => {

    updateUI();

  }
);


// ==========================================
// LOGOUT
// ==========================================

const logoutBtn =
document.getElementById(
  "logoutBtn"
);

const logoutModal =
document.getElementById(
  "logoutModal"
);

const cancelLogout =
document.getElementById(
  "cancelLogout"
);

const confirmLogout =
document.getElementById(
  "confirmLogout"
);

const logoutLoading =
document.getElementById(
  "logoutLoading"
);


// ABRIR MODAL
logoutBtn.addEventListener(
  "click",
  ()=>{

    logoutModal.classList.add(
      "active"
    );

  }
);


// CANCELAR
cancelLogout.addEventListener(
  "click",
  ()=>{

    logoutModal.classList.remove(
      "active"
    );

  }
);


// CONFIRMAR
confirmLogout.addEventListener(
  "click",
  () => {

    logoutModal.classList.remove(
      "active"
    );

    logoutLoading.classList.add(
      "active"
    );


    // Limpa sessão
    localStorage.clear();

    sessionStorage.clear();


    setTimeout(() => {

      // Substitui a página atual pelo login
      window.location.replace(
        "../index.html"
      );

    }, 1500);

  }
);
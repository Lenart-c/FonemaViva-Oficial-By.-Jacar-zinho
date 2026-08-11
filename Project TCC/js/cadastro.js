const SUPABASE_URL =
"https://mnfryxvtogpiwacpyhgo.supabase.co";

const SUPABASE_KEY =
"sb_publishable_YYMfDfWKaer8F1IEOFVOMQ_acS2xa2G";

// ==========================
// FORM
// ==========================

const form =
document.getElementById("formCadastro");

const telefoneInput =
document.getElementById("telefone");

const senhaInput =
document.getElementById("senha");

const confirmarSenhaInput =
document.getElementById("confirmarSenha");

const lembrarInput =
document.getElementById("lembrar");

const fotoInput =
document.getElementById("fotoPerfil");

const previewFoto =
document.getElementById("previewFoto");

let fotoBase64 = "";

const loadingScreen =
document.getElementById("loadingScreen");

const loader =
document.getElementById("loader");

const successIcon =
document.getElementById("successIcon");

const errorIcon =
document.getElementById("errorIcon");

const statusText =
document.getElementById("statusText");

const loadingBox =
document.querySelector(".loading-box");

// ==========================
// FOTO PERFIL
// ==========================

fotoInput.addEventListener("change", () => {

    const arquivo =
    fotoInput.files[0];

    if (!arquivo) return;

    const reader =
    new FileReader();

    reader.onload = (e) => {

        fotoBase64 =
        e.target.result;

        previewFoto.innerHTML =
        `<img src="${fotoBase64}">`;

    };

    reader.readAsDataURL(arquivo);

});

// ==========================
// VALIDAR SENHAS
// ==========================

function validarSenhas() {

    if (
        senhaInput.value !==
        confirmarSenhaInput.value
    ) {

        confirmarSenhaInput.setCustomValidity(
        "As senhas não coincidem."
        );

    }

    else {

        confirmarSenhaInput.setCustomValidity("");

    }

}

senhaInput.addEventListener(
"input",
validarSenhas
);

confirmarSenhaInput.addEventListener(
"input",
validarSenhas
);

// ==========================
// SENHAS
// ==========================

senhaInput.maxLength = 8;
senhaInput.minLength = 8;

confirmarSenhaInput.maxLength = 8;
confirmarSenhaInput.minLength = 8;

// ==========================
// MÁSCARA TELEFONE
// ==========================

telefoneInput.addEventListener(
"input",
(e) => {

    let value =
    e.target.value.replace(/\D/g, "");

    value =
    value.slice(0, 11);

    if (value.length > 10) {

        value =
        value.replace(
        /^(\d{2})(\d{5})(\d{0,4})$/,
        "($1) $2-$3"
        );

    }

    else if (value.length > 6) {

        value =
        value.replace(
        /^(\d{2})(\d{4})(\d{0,4})$/,
        "($1) $2-$3"
        );

    }

    else if (value.length > 2) {

        value =
        value.replace(
        /^(\d{2})(\d{0,5})$/,
        "($1) $2"
        );

    }

    else if (value.length > 0) {

        value =
        value.replace(
        /^(\d*)$/,
        "($1"
        );

    }

    e.target.value =
    value;

});

// ==========================
// BLOQUEAR LETRAS
// ==========================

telefoneInput.addEventListener(
"keypress",
(e) => {

    const char =
    String.fromCharCode(e.which);

    if (!/[0-9]/.test(char)) {

        e.preventDefault();

    }

});

// ==========================
// MOSTRAR SENHA
// ==========================

function toggleSenha(id, el) {

    const input =
    document.getElementById(id);

    const isPassword =
    input.type === "password";

    input.type =
    isPassword
    ? "text"
    : "password";

    el.textContent =
    isPassword
    ? "visibility_off"
    : "visibility";

}

function abrirLoading(){

  loadingScreen.classList.add("active");

  centralizarLoading();

  loader.style.display =
  "block";

  successIcon.style.display =
  "none";

  errorIcon.style.display =
  "none";

  statusText.textContent =
  "Criando conta...";

}

function mostrarSucesso(){

  loader.style.display =
  "none";

  successIcon.style.display =
  "flex";

  errorIcon.style.display =
  "none";

  statusText.textContent =
  "Conta criada com sucesso!";

}

function centralizarLoading(){

    const y =
    window.scrollY +
    (window.innerHeight / 2);

    loadingBox.style.top =
    `${y}px`;

}


function mostrarErro(mensagem){

  loader.style.display =
  "none";

  successIcon.style.display =
  "none";

  errorIcon.style.display =
  "flex";

  statusText.textContent =
  mensagem;

}

// ==========================
// CADASTRO
// ==========================

form.addEventListener(
"submit",
async (e) => {

    e.preventDefault();

    abrirLoading();

    const nome =
    document
    .getElementById("nome")
    .value
    .trim();

    const email =
    document
    .getElementById("email")
    .value
    .trim();

    const telefone =
    telefoneInput.value.trim();

    const senha =
    senhaInput.value.trim();

    const confirmarSenha =
    confirmarSenhaInput.value.trim();

    // VALIDAR CAMPOS

    if (
        !nome ||
        !email ||
        !telefone ||
        !senha ||
        !confirmarSenha
    ) {

        mostrarErro(
"Preencha todos os campos."
);

setTimeout(()=>{

  loadingScreen.classList.remove(
    "active"
  );

},2000);

        return;

    }

    // VALIDAR TELEFONE

    const numerosTelefone =
    telefone.replace(/\D/g, "");

    if (
        numerosTelefone.length < 10 ||
        numerosTelefone.length > 11
    ) {

        mostrarErro(
"Número de telefone inválido."
);

setTimeout(()=>{

  loadingScreen.classList.remove(
    "active"
  );

},2000);    

        return;

    }

    // VALIDAR SENHA

    if (senha.length !== 8) {

        mostrarErro(
"A senha deve ter 8 caracteres."
);

setTimeout(()=>{

  loadingScreen.classList.remove(
    "active"
  );

},2000);

        return;

    }

    // VALIDAR SENHAS

    if (senha !== confirmarSenha) {

        confirmarSenhaInput.setCustomValidity(
        "As senhas não coincidem."
        );

        confirmarSenhaInput.reportValidity();

        return;

    }

    else {

        confirmarSenhaInput.setCustomValidity("");

    }

    // LEMBRAR EMAIL

    if (lembrarInput.checked) {

        localStorage.setItem(
        "email",
        email
        );

    }

    else {

        localStorage.removeItem(
        "email"
        );

    }

    // ==========================
    // ENVIAR PARA SUPABASE
    // ==========================

    try {

    // VERIFICA EMAIL

    const verificar =
await fetch(
`${SUPABASE_URL}/rest/v1/usuarios?email=eq.${encodeURIComponent(email)}`,
{
    method: "GET",

    headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`
    }
});

console.log(
"Status Verificação:",
verificar.status
);

const usuarios =
await verificar.json();

console.log(
"VERIFICAR:"
);

console.log(
usuarios
);

if (usuarios.length > 0) {

    mostrarErro(
"Email já cadastrado."
);

setTimeout(()=>{

  loadingScreen.classList.remove(
    "active"
  );

},2000);

return;

    return;

}

    // CADASTRAR USUÁRIO

    const resposta =
    await fetch(
    `${SUPABASE_URL}/rest/v1/usuarios`,
    {

        method: "POST",

        headers: {

            "Content-Type":
            "application/json",

            "apikey":
            SUPABASE_KEY,

            "Authorization":
            `Bearer ${SUPABASE_KEY}`,

            "Prefer":
            "return=representation"

        },

        body: JSON.stringify({

            nome,
            email,
            telefone,
            senha,
            foto_perfil: fotoBase64

        })

    });

    const usuarioCriado =
    await resposta.json();

    const usuario =
    usuarioCriado[0];

    localStorage.setItem(
        "usuarioId",
    usuario.id
);

    console.log(
    "Status:",
    resposta.status
    );

    if (!resposta.ok) {

        const erro =
        await resposta.text();

        console.error(
        "ERRO SUPABASE:"
        );

        console.error(
        erro
        );

        mostrarErro(
"Erro ao cadastrar."
);

setTimeout(()=>{

  loadingScreen.classList.remove(
    "active"
  );

},2000);

        return;

    }

    // SUCESSO

    mostrarSucesso();

setTimeout(()=>{

  window.location.href =
  "./home.html";

},1500);

}

catch (erro) {

    console.error(
    "ERRO GERAL:"
    );

    console.error(
    erro
    );

    mostrarErro(
"Erro ao realizar cadastro."
);

setTimeout(()=>{

  loadingScreen.classList.remove(
    "active"
  );

},2000);
}

});
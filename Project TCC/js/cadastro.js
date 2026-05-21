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

// ==========================
// VALIDAR SENHAS EM TEMPO REAL
// ==========================

function validarSenhas() {

    if (
        senhaInput.value !==
        confirmarSenhaInput.value
    ) {

        confirmarSenhaInput.setCustomValidity(
        "As senhas não coincidem."
        );

    } else {

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

telefoneInput.addEventListener("input", (e) => {

    let value =
    e.target.value.replace(/\D/g, "");

    value = value.slice(0, 11);

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

    e.target.value = value;

});

// ==========================
// BLOQUEAR LETRAS
// ==========================

telefoneInput.addEventListener("keypress", (e) => {

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

// ==========================
// CADASTRO
// ==========================

form.addEventListener("submit", (e) => {

    e.preventDefault();

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

        alert(
        "Preencha todos os campos."
        );

        return;

    }

    // VALIDAR TELEFONE

    const numerosTelefone =
    telefone.replace(/\D/g, "");

    if (
        numerosTelefone.length < 10 ||
        numerosTelefone.length > 11
    ) {

        alert(
        "Digite um telefone válido."
        );

        return;

    }

    // VALIDAR SENHA

    if (senha.length !== 8) {

        alert(
        "A senha deve conter exatamente 8 caracteres."
        );

        return;

    }

    // VALIDAR CONFIRMAÇÃO

    if (senha !== confirmarSenha) {

        confirmarSenhaInput.setCustomValidity(
        "As senhas não coincidem."
        );

        confirmarSenhaInput.reportValidity();

        return;

    } else {

        confirmarSenhaInput.setCustomValidity("");

    }

    // LEMBRAR EMAIL

    if (lembrarInput.checked) {

        localStorage.setItem(
        "email",
        email
        );

    } else {

        localStorage.removeItem(
        "email"
        );

    }

    // SUCESSO

    alert(
    "Cadastro realizado com sucesso!"
    );

    // REDIRECIONAR

    window.location.href =
    "./index.html";

});
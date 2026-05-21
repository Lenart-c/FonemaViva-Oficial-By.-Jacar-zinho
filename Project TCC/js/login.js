const form =
document.getElementById("formLogin");

const emailInput =
document.getElementById("email");

const lembrarCheckbox =
document.getElementById("lembrar");

// ==========================
// CARREGAR EMAIL
// ==========================

window.onload = () => {

    const email =
    localStorage.getItem("email");

    if (email) {

        emailInput.value = email;

    }

    lembrarCheckbox.checked = false;

};

// ==========================
// LOGIN
// ==========================

form.addEventListener("submit", (e) => {

    e.preventDefault();

    const senha =
    document.getElementById("senha").value;

    if (!emailInput.value || !senha) {

        alert("Preencha todos os campos.");

        return;

    }

    if (lembrarCheckbox.checked) {

        localStorage.setItem(
        "email",
        emailInput.value
        );

    } else {

        localStorage.removeItem("email");

    }

    alert("Login realizado com sucesso!");

    window.location.href =
    "./index.html";

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
    isPassword ? "text" : "password";

    el.textContent =
    isPassword
    ? "visibility_off"
    : "visibility";

}
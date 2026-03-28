const form = document.getElementById("formLogin");
const emailInput = document.getElementById("email");
const lembrarCheckbox = document.getElementById("lembrar");

// Mesma coisa que o cadastro, mas tá mais simplificado


//Aqui ficou fácil demais. 

window.onload = () => {
    const email = localStorage.getItem("email");

    if (email) {
        emailInput.value = email;
    }
};                                              //Pooggg

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const senha = document.getElementById("senha").value;

    if (!emailInput.value || !senha) {
        alert("Preencha tudo!");
        return;
    }                                          //Pooggg


    if (lembrarCheckbox.checked) {
        localStorage.setItem("email", emailInput.value);
    }

    alert("Login realizado!");

    window.location.href = "http://127.0.0.1:5500/index.html";  
                                            //Pooggg        
});



function toggleSenha(id, el) {
    const input = document.getElementById(id);
    const isPassword = input.type === "password";

    input.type = isPassword ? "text" : "password";
    el.textContent = isPassword ? "visibility_off" : "visibility";

                                            //Pooggg

}

                                            
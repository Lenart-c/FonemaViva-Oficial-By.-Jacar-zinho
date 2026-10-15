const SUPABASE_URL =
    "https://mnfryxvtogpiwacpyhgo.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_YYMfDfWKaer8F1IEOFVOMQ_acS2xa2G";

const form =
    document.getElementById("formLogin");

const emailInput =
    document.getElementById("email");

const lembrarCheckbox =
    document.getElementById("lembrar");

const btnLogin =
    document.querySelector(".btn-login");

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


// ==========================
// CARREGAR EMAIL E LEMBRAR-ME
// ==========================

window.onload = () => {

    const email =
        localStorage.getItem("email");

    const loginLembrado =
        localStorage.getItem("loginLembrado");

    if (
        email &&
        loginLembrado === "true"
    ) {

        emailInput.value =
            email;

        lembrarCheckbox.checked =
            true;

    } else {

        lembrarCheckbox.checked =
            false;
    }
};


// ==========================
// LOGIN
// ==========================

function abrirLoading() {

    loadingScreen.classList.add(
        "active"
    );

    loader.style.display =
        "block";

    successIcon.style.display =
        "none";

    errorIcon.style.display =
        "none";

    statusText.textContent =
        "Entrando...";
}


function mostrarSucesso() {

    loader.style.display =
        "none";

    successIcon.style.display =
        "flex";

    errorIcon.style.display =
        "none";

    statusText.textContent =
        "Login realizado!";
}


function mostrarErro(mensagem) {

    loader.style.display =
        "none";

    successIcon.style.display =
        "none";

    errorIcon.style.display =
        "flex";

    statusText.textContent =
        mensagem;
}


form.addEventListener(
    "submit",
    async (e) => {

        e.preventDefault();

        abrirLoading();

        btnLogin.disabled =
            true;

        btnLogin.textContent =
            "Entrando...";


        const email =
            emailInput.value
                .trim()
                .toLowerCase();

        const senha =
            document
                .getElementById("senha")
                .value
                .trim();


        // ==========================
        // VALIDAÇÃO
        // ==========================

        if (
            !email ||
            !senha
        ) {

            mostrarErro(
                "Preencha todos os campos"
            );

            btnLogin.disabled =
                false;

            btnLogin.textContent =
                "Entrar na plataforma";

            setTimeout(() => {

                loadingScreen.classList.remove(
                    "active"
                );

            }, 2000);

            return;
        }


        // ==========================
        // VALIDAÇÃO DO TAMANHO DA SENHA
        // ==========================

        if (senha.length < 8) {

            mostrarErro(
                "A senha deve ter no mínimo 8 caracteres"
            );

            btnLogin.disabled =
                false;

            btnLogin.textContent =
                "Entrar na plataforma";

            setTimeout(() => {

                loadingScreen.classList.remove(
                    "active"
                );

            }, 2000);

            return;
        }


        if (senha.length > 27) {

            mostrarErro(
                "A senha deve ter no máximo 27 caracteres"
            );

            btnLogin.disabled =
                false;

            btnLogin.textContent =
                "Entrar na plataforma";

            setTimeout(() => {

                loadingScreen.classList.remove(
                    "active"
                );

            }, 2000);

            return;
        }


        // ==========================
        // CONSULTAR BANCO
        // ==========================

        try {

            const resposta =
                await fetch(
                    `${SUPABASE_URL}/rest/v1/usuarios?email=eq.${encodeURIComponent(email)}&senha=eq.${encodeURIComponent(senha)}`,
                    {
                        method: "GET",

                        headers: {

                            "apikey":
                                SUPABASE_KEY,

                            "Authorization":
                                `Bearer ${SUPABASE_KEY}`,

                            "Content-Type":
                                "application/json"
                        }
                    }
                );


            // ==========================
            // ERRO NA CONSULTA
            // ==========================

            if (!resposta.ok) {

                const erro =
                    await resposta.text();

                console.error(
                    erro
                );

                mostrarErro(
                    "Erro ao consultar banco"
                );

                setTimeout(() => {

                    loadingScreen.classList.remove(
                        "active"
                    );

                }, 2000);

                btnLogin.disabled =
                    false;

                btnLogin.textContent =
                    "Entrar na plataforma";

                return;
            }


            // ==========================
            // RESPOSTA DO BANCO
            // ==========================

            const usuarios =
                await resposta.json();


            // ==========================
            // USUÁRIO NÃO ENCONTRADO
            // ==========================

            if (
                !usuarios ||
                usuarios.length === 0
            ) {

                mostrarErro(
                    "Email ou senha incorretos"
                );

                setTimeout(() => {

                    loadingScreen.classList.remove(
                        "active"
                    );

                }, 2000);

                btnLogin.disabled =
                    false;

                btnLogin.textContent =
                    "Entrar na plataforma";

                return;
            }


            const usuario =
                usuarios[0];


            // ==========================
            // LIMPAR SESSÕES ANTERIORES
            // ==========================

            localStorage.removeItem(
                "usuarioId"
            );

            localStorage.removeItem(
                "email"
            );

            localStorage.removeItem(
                "loginLembrado"
            );

            sessionStorage.removeItem(
                "usuarioId"
            );

            sessionStorage.removeItem(
                "email"
            );


            // ==========================
            // SALVAR LOGIN
            // ==========================

            if (
                lembrarCheckbox.checked
            ) {

                // Login persistente
                localStorage.setItem(
                    "usuarioId",
                    usuario.id
                );

                // Email persistente
                localStorage.setItem(
                    "email",
                    email
                );

                // Marca que o usuário
                // escolheu permanecer conectado
                localStorage.setItem(
                    "loginLembrado",
                    "true"
                );

            } else {

                // Login somente durante
                // a sessão atual
                sessionStorage.setItem(
                    "usuarioId",
                    usuario.id
                );

                // Também mantém o email
                // somente durante a sessão
                sessionStorage.setItem(
                    "email",
                    email
                );
            }


            // ==========================
            // SUCESSO
            // ==========================

            mostrarSucesso();


            // ==========================
            // REDIRECIONAR PARA HOME
            // ==========================

            setTimeout(() => {

                window.location.href =
                    "./home.html";

            }, 1500);

        } catch (erro) {

            console.error(
                erro
            );

            btnLogin.disabled =
                false;

            btnLogin.textContent =
                "Entrar na plataforma";

            mostrarErro(
                "Erro ao realizar login"
            );

            setTimeout(() => {

                loadingScreen.classList.remove(
                    "active"
                );

            }, 2000);
        }
    }
);


// ==========================
// MOSTRAR / OCULTAR SENHA
// ==========================

function toggleSenha(
    id,
    el
) {

    const input =
        document.getElementById(
            id
        );

    const isPassword =
        input.type ===
        "password";

    input.type =
        isPassword
            ? "text"
            : "password";

    el.textContent =
        isPassword
            ? "visibility_off"
            : "visibility";
}
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

const nomeInput =
    document.getElementById("nome");

const emailInput =
    document.getElementById("email");

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


// ==========================
// LIMITES
// ==========================

nomeInput.maxLength = 45;
nomeInput.minLength = 12;

emailInput.maxLength = 60;
emailInput.minLength = 11;

senhaInput.maxLength = 8;
senhaInput.minLength = 8;

confirmarSenhaInput.maxLength = 8;
confirmarSenhaInput.minLength = 8;


// ==========================
// ELEMENTOS DO LOADING
// ==========================

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
// FOTO DE PERFIL
// ==========================

let fotoBase64 = "";

fotoInput.addEventListener("change", () => {

    const arquivo =
        fotoInput.files[0];

    if (!arquivo) {
        return;
    }

    const reader =
        new FileReader();

    reader.onload = (e) => {

        fotoBase64 =
            e.target.result;

        previewFoto.innerHTML =
            `<img src="${fotoBase64}" alt="Foto de perfil">`;
    };

    reader.readAsDataURL(arquivo);
});


// ==========================
// BLOQUEAR NÚMEROS NO NOME
// ==========================

nomeInput.addEventListener(
    "input",
    (e) => {

        e.target.value =
            e.target.value.replace(/[0-9]/g, "");

    }
);


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

        } else if (value.length > 6) {

            value =
                value.replace(
                    /^(\d{2})(\d{4})(\d{0,4})$/,
                    "($1) $2-$3"
                );

        } else if (value.length > 2) {

            value =
                value.replace(
                    /^(\d{2})(\d{0,5})$/,
                    "($1) $2"
                );

        } else if (value.length > 0) {

            value =
                value.replace(
                    /^(\d{1})$/,
                    "($1"
                );
        }

        e.target.value =
            value;
    }
);


// ==========================
// BLOQUEAR LETRAS NO TELEFONE
// ==========================

telefoneInput.addEventListener(
    "keypress",
    (e) => {

        const char =
            String.fromCharCode(e.which);

        if (!/[0-9]/.test(char)) {

            e.preventDefault();

        }
    }
);


// ==========================
// MOSTRAR / OCULTAR SENHA
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
// LOADING
// ==========================

function abrirLoading() {

    loadingScreen.classList.add("active");

    loader.style.display =
        "block";

    successIcon.style.display =
        "none";

    errorIcon.style.display =
        "none";

    statusText.textContent =
        "Criando sua conta...";
}


function mostrarSucesso() {

    loader.style.display =
        "none";

    successIcon.style.display =
        "flex";

    errorIcon.style.display =
        "none";

    statusText.textContent =
        "Conta criada com sucesso!";
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

    setTimeout(() => {

        loadingScreen.classList.remove("active");

    }, 2000);
}


// ==========================
// CADASTRO
// ==========================

form.addEventListener(
    "submit",
    async (e) => {

        e.preventDefault();

        // ==========================
        // OBTER VALORES
        // ==========================

        const nome =
            nomeInput.value.trim();

        const email =
            emailInput.value
                .trim()
                .toLowerCase();

        const telefone =
            telefoneInput.value.trim();

        const senha =
            senhaInput.value.trim();

        const confirmarSenha =
            confirmarSenhaInput.value.trim();


        // ==========================
        // VALIDAR CAMPOS VAZIOS
        // ==========================

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

            return;
        }


        // ==========================
        // VALIDAR NOME
        // ==========================

        if (nome.length < 12) {

            mostrarErro(
                "O nome deve ter pelo menos 12 caracteres."
            );

            return;
        }

        if (nome.length > 45) {

            mostrarErro(
                "O nome deve ter no máximo 45 caracteres."
            );

            return;
        }

        if (/[0-9]/.test(nome)) {

            mostrarErro(
                "O nome não pode conter números."
            );

            return;
        }


        // ==========================
        // VALIDAR EMAIL
        // ==========================

        if (email.length < 11) {

            mostrarErro(
                "O email deve ter pelo menos 11 caracteres."
            );

            return;
        }

        if (email.length > 60) {

            mostrarErro(
                "O email deve ter no máximo 60 caracteres."
            );

            return;
        }


        // ==========================
        // VALIDAR FORMATO DO EMAIL
        // ==========================

        const emailValido =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailValido.test(email)) {

            mostrarErro(
                "Digite um email válido."
            );

            return;
        }


        // ==========================
        // VALIDAR TELEFONE
        // ==========================

        const numerosTelefone =
            telefone.replace(/\D/g, "");

        if (
            numerosTelefone.length < 10 ||
            numerosTelefone.length > 11
        ) {

            mostrarErro(
                "Número de telefone inválido."
            );

            return;
        }


        // ==========================
        // VALIDAR SENHA
        // ==========================

        if (senha.length !== 8) {

            mostrarErro(
                "A senha deve ter exatamente 8 caracteres."
            );

            return;
        }


        // ==========================
        // VALIDAR CONFIRMAÇÃO
        // ==========================

        if (senha !== confirmarSenha) {

            confirmarSenhaInput.setCustomValidity(
                "As senhas não coincidem."
            );

            confirmarSenhaInput.reportValidity();

            return;

        } else {

            confirmarSenhaInput.setCustomValidity("");

        }


        // ==========================
        // ABRIR LOADING
        // ==========================

        abrirLoading();


        // ==========================
        // VERIFICAR EMAIL NO SUPABASE
        // ==========================

        try {

            const verificar =
                await fetch(
                    `${SUPABASE_URL}/rest/v1/usuarios?email=eq.${encodeURIComponent(email)}`,
                    {
                        method: "GET",

                        headers: {
                            "apikey": SUPABASE_KEY,
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

            if (!verificar.ok) {

                const erro =
                    await verificar.text();

                console.error(
                    "ERRO AO VERIFICAR EMAIL:"
                );

                console.error(erro);

                mostrarErro(
                    "Não foi possível verificar o email."
                );

                return;
            }


            // ==========================
            // VERIFICAR USUÁRIOS
            // ==========================

            const usuarios =
                await verificar.json();

            console.log(
                "USUÁRIOS ENCONTRADOS:",
                usuarios
            );


            if (
                Array.isArray(usuarios) &&
                usuarios.length > 0
            ) {

                mostrarErro(
                    "Email já cadastrado."
                );

                return;
            }


            // ==========================
            // CADASTRAR USUÁRIO
            // ==========================

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

                            nome:
                                nome,

                            email:
                                email,

                            telefone:
                                telefone,

                            senha:
                                senha,

                            foto_perfil:
                                fotoBase64
                        })
                    }
                );


            // ==========================
            // VERIFICAR RESPOSTA DO CADASTRO
            // ==========================

            if (!resposta.ok) {

                const erro =
                    await resposta.text();

                console.error(
                    "ERRO SUPABASE:"
                );

                console.error(erro);

                mostrarErro(
                    "Erro ao cadastrar."
                );

                return;
            }


            // ==========================
            // OBTER USUÁRIO CRIADO
            // ==========================

            const usuarioCriado =
                await resposta.json();

            console.log(
                "USUÁRIO CRIADO:",
                usuarioCriado
            );


            if (
                !Array.isArray(usuarioCriado) ||
                usuarioCriado.length === 0 ||
                !usuarioCriado[0]?.id
            ) {

                console.error(
                    "O Supabase não retornou os dados do usuário criado."
                );

                mostrarErro(
                    "Não foi possível concluir o cadastro."
                );

                return;
            }


            const usuario =
                usuarioCriado[0];


            // ==========================
            // SALVAR LOGIN
            // ==========================
            //
            // Se "Lembrar-me" estiver marcado:
            // o login permanece salvo mesmo
            // depois de fechar o navegador.
            //
            // Se não estiver marcado:
            // o login fica somente na sessão atual.
            //
            // ==========================

            if (lembrarInput.checked) {

                localStorage.setItem(
                    "usuarioId",
                    String(usuario.id)
                );

                sessionStorage.removeItem(
                    "usuarioId"
                );

                localStorage.setItem(
                    "email",
                    email
                );

            } else {

                sessionStorage.setItem(
                    "usuarioId",
                    String(usuario.id)
                );

                localStorage.removeItem(
                    "usuarioId"
                );

                localStorage.removeItem(
                    "email"
                );
            }


            // ==========================
            // MARCAR QUE O USUÁRIO ESTÁ
            // AUTENTICADO
            // ==========================

            localStorage.setItem(
                "usuarioLogado",
                "true"
            );


            // ==========================
            // SUCESSO
            // ==========================

            mostrarSucesso();


            // ==========================
            // IR PARA HOME
            // ==========================

            setTimeout(() => {

                window.location.href =
                    "./home.html";

            }, 1500);

        }

        // ==========================
        // ERRO GERAL
        // ==========================

        catch (erro) {

            console.error(
                "ERRO GERAL NO CADASTRO:",
                erro
            );

            mostrarErro(
                "Erro ao realizar o cadastro."
            );

        }

    }
);
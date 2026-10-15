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

senhaInput.maxLength = 27;
senhaInput.minLength = 8;

confirmarSenhaInput.maxLength = 27;
confirmarSenhaInput.minLength = 8;

// ==========================
// ERROS
// ==========================
const nomeErro =
    document.getElementById("nomeErro");

const emailErro =
    document.getElementById("emailErro");

const telefoneErro =
    document.getElementById("telefoneErro");

const senhaErro =
    document.getElementById("senhaErro");

const confirmarSenhaErro =
    document.getElementById("confirmarSenhaErro");

// ==========================
// ELEMENTOS DA SENHA
// ==========================
const senhaForca =
    document.getElementById("senhaForca");

const senhaForcaTexto =
    document.getElementById("senhaForcaTexto");

const senhaBarraProgresso =
    document.getElementById("senhaBarraProgresso");

const reqComprimento =
    document.getElementById("reqComprimento");

const reqMaiuscula =
    document.getElementById("reqMaiuscula");

const reqNumero =
    document.getElementById("reqNumero");

const reqEspecial =
    document.getElementById("reqEspecial");

const reqUsuario =
    document.getElementById("reqUsuario");

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

fotoInput.addEventListener(
    "change",
    () => {
        const arquivo =
            fotoInput.files[0];

        if (!arquivo) {
            return;
        }

        const reader =
            new FileReader();

        reader.onload =
            (e) => {
                fotoBase64 =
                    e.target.result;

                previewFoto.innerHTML =
                    `<img src="${fotoBase64}" alt="Foto de perfil">`;
            };

        reader.readAsDataURL(arquivo);
    }
);

// ==========================
// FUNÇÕES DE ERRO
// ==========================
function mostrarErroCampo(
    input,
    elementoErro,
    mensagem
) {
    const inputBox =
        input.closest(".input-box");

    elementoErro.textContent =
        mensagem;

    elementoErro.classList.add(
        "active"
    );

    inputBox.classList.add(
        "field-invalid"
    );

    inputBox.classList.remove(
        "field-valid"
    );
}

function limparErroCampo(
    input,
    elementoErro
) {
    const inputBox =
        input.closest(".input-box");

    elementoErro.textContent =
        "";

    elementoErro.classList.remove(
        "active"
    );

    inputBox.classList.remove(
        "field-invalid"
    );
}

function marcarCampoValido(
    input,
    elementoErro
) {
    const inputBox =
        input.closest(".input-box");

    elementoErro.textContent =
        "";

    elementoErro.classList.remove(
        "active"
    );

    inputBox.classList.remove(
        "field-invalid"
    );

    inputBox.classList.add(
        "field-valid"
    );
}

// ==========================
// NOME
// ==========================
function validarNome(
    mostrarMensagem = true
) {
    const nome =
        nomeInput.value.trim();

    if (!nome) {
        if (mostrarMensagem) {
            mostrarErroCampo(
                nomeInput,
                nomeErro,
                "Digite seu nome."
            );
        }

        return false;
    }

    if (nome.length < 12) {
        if (mostrarMensagem) {
            mostrarErroCampo(
                nomeInput,
                nomeErro,
                "O nome deve ter pelo menos 12 caracteres."
            );
        }

        return false;
    }

    if (nome.length > 45) {
        if (mostrarMensagem) {
            mostrarErroCampo(
                nomeInput,
                nomeErro,
                "O nome deve ter no máximo 45 caracteres."
            );
        }

        return false;
    }

    if (/[0-9]/.test(nome)) {
        if (mostrarMensagem) {
            mostrarErroCampo(
                nomeInput,
                nomeErro,
                "O nome não pode conter números."
            );
        }

        return false;
    }

    if (!/^[A-Za-zÀ-ÿ\s]+$/.test(nome)) {
        if (mostrarMensagem) {
            mostrarErroCampo(
                nomeInput,
                nomeErro,
                "O nome contém caracteres inválidos."
            );
        }

        return false;
    }

    const palavras =
        nome
            .split(/\s+/)
            .filter(Boolean);

    if (palavras.length < 2) {
        if (mostrarMensagem) {
            mostrarErroCampo(
                nomeInput,
                nomeErro,
                "Digite seu nome completo."
            );
        }

        return false;
    }

    marcarCampoValido(
        nomeInput,
        nomeErro
    );

    return true;
}

// ==========================
// BLOQUEAR NÚMEROS NO NOME
// ==========================
nomeInput.addEventListener(
    "input",
    (e) => {
        e.target.value =
            e.target.value.replace(
                /[0-9]/g,
                ""
            );

        validarNome(false);
    }
);

// ==========================
// EMAIL
// ==========================
function validarEmail(
    mostrarMensagem = true
) {
    const email =
        emailInput.value
            .trim()
            .toLowerCase();

    if (!email) {
        if (mostrarMensagem) {
            mostrarErroCampo(
                emailInput,
                emailErro,
                "Digite seu email."
            );
        }

        return false;
    }

    if (email.length > 60) {
        if (mostrarMensagem) {
            mostrarErroCampo(
                emailInput,
                emailErro,
                "O email deve ter no máximo 60 caracteres."
            );
        }

        return false;
    }

    // ==========================
    // FORMATO PROFISSIONAL BÁSICO
    // usuario@dominio.extensao
    // ==========================
    const emailValido =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

    if (!emailValido.test(email)) {
        if (mostrarMensagem) {
            mostrarErroCampo(
                emailInput,
                emailErro,
                "Digite um endereço de email válido."
            );
        }

        return false;
    }

    if (
        email.startsWith(".") ||
        email.includes("..") ||
        email.includes("@.")
    ) {
        if (mostrarMensagem) {
            mostrarErroCampo(
                emailInput,
                emailErro,
                "Digite um endereço de email válido."
            );
        }

        return false;
    }

    marcarCampoValido(
        emailInput,
        emailErro
    );

    return true;
}

emailInput.addEventListener(
    "input",
    () => {
        validarEmail(false);
    }
);

// ==========================
// TELEFONE
// ==========================
function validarTelefone(
    mostrarMensagem = true
) {
    const telefone =
        telefoneInput.value.trim();

    const numeros =
        telefone.replace(
            /\D/g,
            ""
        );

    if (!telefone) {
        if (mostrarMensagem) {
            mostrarErroCampo(
                telefoneInput,
                telefoneErro,
                "Digite seu telefone."
            );
        }

        return false;
    }

    if (numeros.length < 10) {
        if (mostrarMensagem) {
            mostrarErroCampo(
                telefoneInput,
                telefoneErro,
                "Digite o telefone completo."
            );
        }

        return false;
    }

    if (numeros.length > 11) {
        if (mostrarMensagem) {
            mostrarErroCampo(
                telefoneInput,
                telefoneErro,
                "O telefone deve ter no máximo 11 dígitos."
            );
        }

        return false;
    }

    // Evita números compostos apenas
    // pelo mesmo dígito.
    if (/^(\d)\1+$/.test(numeros)) {
        if (mostrarMensagem) {
            mostrarErroCampo(
                telefoneInput,
                telefoneErro,
                "Digite um número de telefone válido."
            );
        }

        return false;
    }

    marcarCampoValido(
        telefoneInput,
        telefoneErro
    );

    return true;
}

// ==========================
// MÁSCARA TELEFONE
// ==========================
telefoneInput.addEventListener(
    "input",
    (e) => {
        let value =
            e.target.value.replace(
                /\D/g,
                ""
            );

        value =
            value.slice(
                0,
                11
            );

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

        validarTelefone(false);
    }
);

// ==========================
// BLOQUEAR LETRAS NO TELEFONE
// ==========================
telefoneInput.addEventListener(
    "keypress",
    (e) => {
        const char =
            String.fromCharCode(
                e.which
            );

        if (!/[0-9]/.test(char)) {
            e.preventDefault();
        }
    }
);

// ==========================
// SENHAS COMUNS
// ==========================
const senhasComuns =
    new Set([
        "12345678",
        "123456789",
        "1234567890",
        "password",
        "password1",
        "password123",
        "Password1!",
        "qwertyui",
        "qwerty123",
        "abcdefgh",
        "abcdefg",
        "11111111",
        "00000000",
        "123123123",
        "admin123",
        "admin123!",
        "letmein",
        "welcome",
        "welcome1",
        "iloveyou",
        "senha123",
        "senha123!",
        "fonemaviva",
        "fonemaviva123"
    ].map(
        senha =>
            senha.toLowerCase()
    ));

// ==========================
// NORMALIZAR TEXTO
// ==========================
function normalizarTexto(
    texto
) {
    return texto
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .toLowerCase();
}

// ==========================
// DETECTAR INFORMAÇÕES DO USUÁRIO
// ==========================
function contemInformacaoUsuario(
    senha
) {
    const nome =
        normalizarTexto(
            nomeInput.value.trim()
        );

    const email =
        normalizarTexto(
            emailInput.value.trim()
        );

    const parteEmail =
        email.split("@")[0] || "";

    const nomePartes =
        nome
            .split(/\s+/)
            .filter(
                parte =>
                    parte.length >= 3
            );

    const informacoes =
        [
            parteEmail,
            ...nomePartes
        ]
        .filter(
            valor =>
                valor.length >= 3
        );

    const senhaNormalizada =
        normalizarTexto(senha);

    return informacoes.some(
        informacao =>
            senhaNormalizada.includes(
                informacao
            )
    );
}

// ==========================
// DETECTAR SEQUÊNCIAS
// ==========================
function possuiSequencia(
    senha
) {
    if (senha.length < 3) {
        return false;
    }

    const valor =
        normalizarTexto(senha);

    // Sequências numéricas.
    for (
        let i = 0;
        i <= valor.length - 3;
        i++
    ) {
        const a =
            valor.charCodeAt(i);

        const b =
            valor.charCodeAt(i + 1);

        const c =
            valor.charCodeAt(i + 2);

        if (
            b === a + 1 &&
            c === b + 1
        ) {
            return true;
        }

        if (
            b === a - 1 &&
            c === b - 1
        ) {
            return true;
        }
    }

    // Sequências alfabéticas.
    const sequencias = [
        "abc",
        "bcd",
        "cde",
        "def",
        "efg",
        "fgh",
        "ghi",
        "hij",
        "ijk",
        "jkl",
        "klm",
        "lmn",
        "mno",
        "nop",
        "opq",
        "pqr",
        "qrs",
        "rst",
        "stu",
        "tuv",
        "uvw",
        "vwx",
        "wxy",
        "xyz",
        "qwe",
        "wer",
        "ert",
        "rty",
        "tyu",
        "yui",
        "uio",
        "iop"
    ];

    return sequencias.some(
        sequencia =>
            valor.includes(
                sequencia
            )
    );
}

// ==========================
// REPETIÇÕES
// ==========================
function possuiRepeticaoExcessiva(
    senha
) {
    if (senha.length < 4) {
        return false;
    }

    // 4 caracteres iguais seguidos.
    if (
        /(.)\1\1\1/.test(senha)
    ) {
        return true;
    }

    // Padrão ABAB.
    if (
        /(..)\1/.test(senha)
    ) {
        return true;
    }

    // Senha composta quase
    // exclusivamente por um
    // mesmo caractere.
    const caracteres =
        senha.split("");

    const quantidade =
        caracteres.filter(
            caractere =>
                caractere === caracteres[0]
        ).length;

    if (
        quantidade >=
        Math.ceil(
            senha.length * 0.6
        )
    ) {
        return true;
    }

    return false;
}

// ==========================
// ATUALIZAR CRITÉRIO
// ==========================
function atualizarRequisito(
    elemento,
    valido,
    vazio
) {
    if (!elemento) {
        return;
    }

    elemento.classList.remove(
        "valid",
        "invalid"
    );

    if (vazio) {
        return;
    }

    if (valido) {
        elemento.classList.add(
            "valid"
        );
    } else {
        elemento.classList.add(
            "invalid"
        );
    }

    const icone =
        elemento.querySelector(
            ".requisito-icon i"
        );

    if (icone) {
        icone.classList.remove(
            "fa-circle",
            "fa-circle-check"
        );

        if (valido) {
            icone.classList.add(
                "fa-circle-check"
            );
        } else {
            icone.classList.add(
                "fa-circle"
            );
        }
    }
}

// ==========================
// AVALIAR SENHA
// ==========================
function avaliarSenha() {
    const senha =
        senhaInput.value;

    const comprimento =
        senha.length;

    const temComprimento =
        comprimento >= 8 &&
        comprimento <= 27;

    const temMaiuscula =
        /[A-Z]/.test(senha);

    const temMinuscula =
        /[a-z]/.test(senha);

    const temNumero =
        /[0-9]/.test(senha);

    const temEspecial =
        /[^A-Za-z0-9]/.test(senha);

    const temSequencia =
        possuiSequencia(senha);

    const temRepeticao =
        possuiRepeticaoExcessiva(senha);

    const senhaComum =
        senhasComuns.has(
            senha.toLowerCase()
        );

    const contemUsuario =
        contemInformacaoUsuario(
            senha
        );

    // ==========================
    // ATUALIZAR CRITÉRIOS VISÍVEIS
    // ==========================
    atualizarRequisito(
        reqComprimento,
        temComprimento,
        comprimento === 0
    );

    atualizarRequisito(
        reqMaiuscula,
        temMaiuscula,
        comprimento === 0
    );

    atualizarRequisito(
        reqNumero,
        temNumero,
        comprimento === 0
    );

    atualizarRequisito(
        reqEspecial,
        temEspecial,
        comprimento === 0
    );

    atualizarRequisito(
        reqUsuario,
        !contemUsuario,
        comprimento === 0
    );

    // ==========================
    // SENHA VAZIA
    // ==========================
    if (!senha) {
        senhaBarraProgresso.style.width =
            "0%";

        senhaBarraProgresso.style.background =
            "#CBD5E1";

        senhaForcaTexto.textContent =
            "—";

        senhaForcaTexto.style.color =
            "#64748B";

        limparErroCampo(
            senhaInput,
            senhaErro
        );

        return {
            obrigatoria: false,
            forte: false,
            pontuacao: 0
        };
    }

    // ==========================
    // PONTUAÇÃO
    // ==========================
    let pontuacao = 0;

    // Comprimento.
    if (comprimento >= 8) {
        pontuacao += 20;
    }

    if (comprimento >= 12) {
        pontuacao += 10;
    }

    if (comprimento >= 16) {
        pontuacao += 10;
    }

    if (comprimento >= 20) {
        pontuacao += 5;
    }

    if (comprimento > 27) {
        pontuacao -= 20;
    }

    // Diversidade.
    if (temMaiuscula) {
        pontuacao += 10;
    }

    if (temMinuscula) {
        pontuacao += 10;
    }

    if (temNumero) {
        pontuacao += 10;
    }

    if (temEspecial) {
        pontuacao += 10;
    }

    // Qualidade.
    if (!temSequencia) {
        pontuacao += 5;
    } else {
        pontuacao -= 15;
    }

    if (!temRepeticao) {
        pontuacao += 5;
    } else {
        pontuacao -= 15;
    }

    if (!senhaComum) {
        pontuacao += 5;
    } else {
        pontuacao -= 40;
    }

    if (!contemUsuario) {
        pontuacao += 5;
    } else {
        pontuacao -= 25;
    }

    // Limitar entre 0 e 100.
    pontuacao =
        Math.max(
            0,
            Math.min(
                100,
                pontuacao
            )
        );

    // ==========================
    // ATUALIZAR BARRA
    // ==========================
    senhaBarraProgresso.style.width =
        `${pontuacao}%`;

    let texto =
        "Muito fraca";

    if (pontuacao >= 80) {
        texto =
            "Muito forte";
    } else if (pontuacao >= 60) {
        texto =
            "Forte";
    } else if (pontuacao >= 40) {
        texto =
            "Razoável";
    } else if (pontuacao >= 20) {
        texto =
            "Fraca";
    }

    senhaForcaTexto.textContent =
        texto;

    // ==========================
    // CORES DO MEDIDOR
    // ==========================
    let cor =
        "#DC2626";

    if (pontuacao >= 80) {
        cor =
            "#00A89E";
    } else if (pontuacao >= 60) {
        cor =
            "#16A34A";
    } else if (pontuacao >= 40) {
        cor =
            "#D97706";
    } else if (pontuacao >= 20) {
        cor =
            "#EA580C";
    }

    senhaBarraProgresso.style.background =
        cor;

    senhaForcaTexto.style.color =
        cor;

    // ==========================
    // CRITÉRIOS MÍNIMOS
    // ==========================
    const criteriosObrigatorios =
        temComprimento &&
        temMaiuscula &&
        temMinuscula &&
        temNumero &&
        temEspecial;

    // ==========================
    // CRITÉRIOS DE SEGURANÇA
    // ==========================
    const criteriosSeguros =
        !temSequencia &&
        !temRepeticao &&
        !senhaComum &&
        !contemUsuario;

    const senhaValida =
        criteriosObrigatorios &&
        criteriosSeguros;

    return {
        obrigatoria:
            criteriosObrigatorios,

        forte:
            senhaValida,

        pontuacao
    };
}

// ==========================
// VALIDAR SENHA
// ==========================
function validarSenha(
    mostrarMensagem = true
) {
    const resultado =
        avaliarSenha();

    if (!senhaInput.value) {
        if (mostrarMensagem) {
            mostrarErroCampo(
                senhaInput,
                senhaErro,
                "Digite uma senha."
            );
        }

        return false;
    }

    if (
        senhaInput.value.length < 8
    ) {
        if (mostrarMensagem) {
            mostrarErroCampo(
                senhaInput,
                senhaErro,
                "A senha deve ter pelo menos 8 caracteres."
            );
        }

        return false;
    }

    if (
        senhaInput.value.length > 27
    ) {
        if (mostrarMensagem) {
            mostrarErroCampo(
                senhaInput,
                senhaErro,
                "A senha deve ter no máximo 27 caracteres."
            );
        }

        return false;
    }

    if (!/[A-Z]/.test(
        senhaInput.value
    )) {
        if (mostrarMensagem) {
            mostrarErroCampo(
                senhaInput,
                senhaErro,
                "A senha precisa ter pelo menos uma letra maiúscula."
            );
        }

        return false;
    }

    if (!/[a-z]/.test(
        senhaInput.value
    )) {
        if (mostrarMensagem) {
            mostrarErroCampo(
                senhaInput,
                senhaErro,
                "A senha precisa ter pelo menos uma letra minúscula."
            );
        }

        return false;
    }

    if (!/[0-9]/.test(
        senhaInput.value
    )) {
        if (mostrarMensagem) {
            mostrarErroCampo(
                senhaInput,
                senhaErro,
                "A senha precisa ter pelo menos um número."
            );
        }

        return false;
    }

    if (!/[^A-Za-z0-9]/.test(
        senhaInput.value
    )) {
        if (mostrarMensagem) {
            mostrarErroCampo(
                senhaInput,
                senhaErro,
                "A senha precisa ter pelo menos um caractere especial."
            );
        }

        return false;
    }

    if (
        possuiSequencia(
            senhaInput.value
        )
    ) {
        if (mostrarMensagem) {
            mostrarErroCampo(
                senhaInput,
                senhaErro,
                "Evite sequências previsíveis na senha."
            );
        }

        return false;
    }

    if (
        possuiRepeticaoExcessiva(
            senhaInput.value
        )
    ) {
        if (mostrarMensagem) {
            mostrarErroCampo(
                senhaInput,
                senhaErro,
                "Evite repetições excessivas de caracteres."
            );
        }

        return false;
    }

    if (
        senhasComuns.has(
            senhaInput.value.toLowerCase()
        )
    ) {
        if (mostrarMensagem) {
            mostrarErroCampo(
                senhaInput,
                senhaErro,
                "Essa senha é muito comum. Escolha uma senha mais segura."
            );
        }

        return false;
    }

    if (
        contemInformacaoUsuario(
            senhaInput.value
        )
    ) {
        if (mostrarMensagem) {
            mostrarErroCampo(
                senhaInput,
                senhaErro,
                "A senha não deve conter informações do seu nome ou email."
            );
        }

        return false;
    }

    if (!resultado.forte) {
        if (mostrarMensagem) {
            mostrarErroCampo(
                senhaInput,
                senhaErro,
                "Escolha uma senha mais segura."
            );
        }

        return false;
    }

    marcarCampoValido(
        senhaInput,
        senhaErro
    );

    return true;
}

// ==========================
// EVENTO SENHA
// ==========================
senhaInput.addEventListener(
    "input",
    () => {

        /*
         * O medidor só aparece quando
         * realmente existe conteúdo sendo
         * digitado no campo.
         */
        if (senhaInput.value.length > 0) {
            senhaForca.classList.add(
                "active"
            );
        } else {
            senhaForca.classList.remove(
                "active"
            );
        }

        avaliarSenha();
        validarSenha(false);
        validarSenhas(false);
    }
);

// ==========================
// BLUR DA SENHA
// ==========================
senhaInput.addEventListener(
    "blur",
    () => {

        /*
         * O medidor desaparece quando o
         * usuário deixa o campo de senha.
         */
        senhaForca.classList.remove(
            "active"
        );

        validarSenha(true);
    }
);

// ==========================
// CONFIRMAR SENHA
// ==========================
function validarSenhas(
    mostrarMensagem = true
) {
    const senha =
        senhaInput.value;

    const confirmar =
        confirmarSenhaInput.value;

    if (!confirmar) {
        if (mostrarMensagem) {
            mostrarErroCampo(
                confirmarSenhaInput,
                confirmarSenhaErro,
                "Confirme sua senha."
            );
        }

        return false;
    }

    if (
        confirmar.length < 8
    ) {
        if (mostrarMensagem) {
            mostrarErroCampo(
                confirmarSenhaInput,
                confirmarSenhaErro,
                "A confirmação deve ter pelo menos 8 caracteres."
            );
        }

        return false;
    }

    if (
        confirmar.length > 27
    ) {
        if (mostrarMensagem) {
            mostrarErroCampo(
                confirmarSenhaInput,
                confirmarSenhaErro,
                "A confirmação deve ter no máximo 27 caracteres."
            );
        }

        return false;
    }

    if (senha !== confirmar) {
        if (mostrarMensagem) {
            mostrarErroCampo(
                confirmarSenhaInput,
                confirmarSenhaErro,
                "As senhas não coincidem."
            );
        }

        return false;
    }

    marcarCampoValido(
        confirmarSenhaInput,
        confirmarSenhaErro
    );

    return true;
}

confirmarSenhaInput.addEventListener(
    "input",
    () => {
        validarSenhas(false);
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

    el.setAttribute(
        "aria-label",
        isPassword
            ? "Ocultar senha"
            : "Mostrar senha"
    );
}

// ==========================
// LOADING
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

function mostrarErro(
    mensagem
) {
    loader.style.display =
        "none";

    successIcon.style.display =
        "none";

    errorIcon.style.display =
        "flex";

    statusText.textContent =
        mensagem;

    setTimeout(
        () => {
            loadingScreen.classList.remove(
                "active"
            );
        },
        2000
    );
}

// ==========================
// FOCUS / BLUR
// ==========================
nomeInput.addEventListener(
    "blur",
    () => {
        validarNome(true);
    }
);

emailInput.addEventListener(
    "blur",
    () => {
        validarEmail(true);
    }
);

telefoneInput.addEventListener(
    "blur",
    () => {
        validarTelefone(true);
    }
);

confirmarSenhaInput.addEventListener(
    "blur",
    () => {
        validarSenhas(true);
    }
);

// ==========================
// CADASTRO
// ==========================
form.addEventListener(
    "submit",
    async (e) => {
        e.preventDefault();

        // ==========================
        // VALIDAR TODOS OS CAMPOS
        // ==========================
        const nomeValido =
            validarNome(true);

        const emailValido =
            validarEmail(true);

        const telefoneValido =
            validarTelefone(true);

        const senhaValida =
            validarSenha(true);

        const confirmacaoValida =
            validarSenhas(true);

        /*
         * Se houver qualquer erro,
         * não envia ao Supabase.
         */
        if (
            !nomeValido ||
            !emailValido ||
            !telefoneValido ||
            !senhaValida ||
            !confirmacaoValida
        ) {
            return;
        }

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
            senhaInput.value;

        const confirmarSenha =
            confirmarSenhaInput.value;

        const numerosTelefone =
            telefone.replace(
                /\D/g,
                ""
            );

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
            if (!verificar.ok) {
                const erro =
                    await verificar.text();

                console.error(
                    "ERRO AO VERIFICAR EMAIL:"
                );

                console.error(
                    erro
                );

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
            // CRIAR USUÁRIO
            // ==========================
            const resposta =
                await fetch(
                    `${SUPABASE_URL}/rest/v1/usuarios`,
                    {
                        method: "POST",

                        headers: {
                            "apikey":
                                SUPABASE_KEY,

                            "Authorization":
                                `Bearer ${SUPABASE_KEY}`,

                            "Content-Type":
                                "application/json",

                            "Prefer":
                                "return=representation"
                        },

                        body:
                            JSON.stringify({
                                nome:
                                    nome,

                                email:
                                    email,

                                telefone:
                                    numerosTelefone,

                                senha:
                                    senha,

                                foto_perfil:
                                    fotoBase64 || null
                            })
                    }
                );

            // ==========================
            // ERRO AO CRIAR USUÁRIO
            // ==========================
            if (!resposta.ok) {
                const erro =
                    await resposta.text();

                console.error(
                    "ERRO AO CRIAR USUÁRIO:"
                );

                console.error(
                    erro
                );

                mostrarErro(
                    "Não foi possível criar sua conta."
                );

                return;
            }

            // ==========================
            // USUÁRIO CRIADO
            // ==========================
            const usuarioCriado =
                await resposta.json();

            console.log(
                "USUÁRIO CRIADO:",
                usuarioCriado
            );

            if (
                !Array.isArray(
                    usuarioCriado
                ) ||
                !usuarioCriado[0] ||
                !usuarioCriado[0].id
            ) {
                mostrarErro(
                    "Não foi possível obter os dados da conta."
                );

                return;
            }

            const usuarioId =
                usuarioCriado[0].id;

            // ==========================
            // SALVAR SESSÃO
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

            if (
                lembrarInput.checked
            ) {
                localStorage.setItem(
                    "usuarioId",
                    usuarioId
                );

                localStorage.setItem(
                    "email",
                    email
                );

                localStorage.setItem(
                    "loginLembrado",
                    "true"
                );
            } else {
                sessionStorage.setItem(
                    "usuarioId",
                    usuarioId
                );

                sessionStorage.setItem(
                    "email",
                    email
                );
            }

            // ==========================
            // USUÁRIO LOGADO
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
            // REDIRECIONAR
            // ==========================
            setTimeout(
                () => {
                    window.location.href =
                        "./home.html";
                },
                1500
            );

        } catch (erro) {
            console.error(
                "ERRO NO CADASTRO:",
                erro
            );

            mostrarErro(
                "Ocorreu um erro ao criar sua conta."
            );
        }
    }
);
// CONFIGURAÇÃO SUPABASE


const SUPABASE_URL =
"https://mnfryxvtogpiwacpyhgo.supabase.co";

const SUPABASE_KEY =
"sb_publishable_YYMfDfWKaer8F1IEOFVOMQ_acS2xa2G";

// TEMA AUTOMÁTICO

const mediaTheme =
    window.matchMedia(
        "(prefers-color-scheme: dark)"
    );

// APLICAR TEMA

function aplicarTema(theme) {

    if (theme === "dark") {

        document.body.classList.add(
            "dark-mode"
        );

    } else {

        document.body.classList.remove(
            "dark-mode"
        );

    }

}

// DETECTAR TEMA DO NAVEGADOR

function detectarTema() {

    aplicarTema(
        mediaTheme.matches
            ? "dark"
            : "light"
    );

}

// TEMA INICIAL

detectarTema();

// ACOMPANHAR ALTERAÇÃO

mediaTheme.addEventListener(
    "change",
    (event) => {

        aplicarTema(
            event.matches
                ? "dark"
                : "light"
        );

    }
);

// VERIFICAR USUÁRIO LOGADO

const usuarioId =
    localStorage.getItem("usuarioId") ||
    sessionStorage.getItem("usuarioId");

if (!usuarioId) {

    window.location.replace(
        "./login.html"
    );

}

// BOTÃO VOLTAR

const btnVoltar =
    document.getElementById(
        "btnVoltar"
    );

btnVoltar?.addEventListener(
    "click",
    () => {

        window.location.replace(
            "./home.html"
        );

    }
);

// ELEMENTOS DA TELA

const form =
    document.getElementById(
        "birthForm"
    );

const diaNascimento =
    document.getElementById(
        "diaNascimento"
    );

const mesNascimento =
    document.getElementById(
        "mesNascimento"
    );

const anoNascimento =
    document.getElementById(
        "anoNascimento"
    );

const mensagemErro =
    document.getElementById(
        "mensagemErro"
    );

const btnContinuar =
    document.getElementById(
        "btnContinuar"
    );

    // ==========================
// CONTROLAR ORDEM DOS CAMPOS
// ANO → MÊS → DIA
// ==========================

function atualizarEstadoCamposData() {

    const ano = anoNascimento.value.trim();
    const mes = mesNascimento.value;

    // Verifica se o ano possui exatamente 4 dígitos
    // e está dentro do período permitido.
    const anoValido =
        /^\d{4}$/.test(ano) &&
        Number(ano) >= 1965 &&
        Number(ano) <= 2026;

    // MÊS
    mesNascimento.disabled = !anoValido;

    // Se o ano não for válido,
    // limpa e bloqueia mês e dia.
    if (!anoValido) {

        mesNascimento.value = "";
        diaNascimento.value = "";

        diaNascimento.disabled = true;

        return;
    }

    // Se o ano for válido, mas nenhum mês
    // tiver sido escolhido, o dia continua bloqueado.
    if (!mes) {

        diaNascimento.value = "";

        diaNascimento.disabled = true;

        return;
    }

    // Ano válido + mês escolhido = libera o dia.
    diaNascimento.disabled = false;
}

// SETAS DO ANO

const anoMais =
    document.getElementById(
        "anoMais"
    );

const anoMenos =
    document.getElementById(
        "anoMenos"
    );

// ATUALIZAR ESTADO DAS SETAS

function atualizarSetasAno() {

    const ano =
        Number(
            anoNascimento.value
        );

    const minimo = 1965;

    const maximo = new Date().getFullYear();

    // SETA PARA CIMA

    if (anoMais) {

        anoMais.disabled =
            !ano ||
            ano >= maximo;

    }

    // SETA PARA BAIXO

    if (anoMenos) {

        anoMenos.disabled =
            !ano ||
            ano <= minimo;

    }

}

// AUMENTAR ANO

anoMais?.addEventListener(
    "click",
    () => {

        let ano =
            Number(
                anoNascimento.value
            );

        if (!ano) {

            ano = 1965;

        }

        if (ano < new Date().getFullYear()) {

            ano++;

            anoNascimento.value =
                ano;

            anoNascimento.dispatchEvent(
                new Event("input")
            );

            atualizarSetasAno();

        }

    }
);


// DIMINUIR ANO

anoMenos?.addEventListener(
    "click",
    () => {

        let ano =
            Number(
                anoNascimento.value
            );

        if (!ano) {

            ano = 2026;

        }

        if (ano > 1965) {

            ano--;

            anoNascimento.value =
                ano;

            anoNascimento.dispatchEvent(
                new Event("input")
            );

            atualizarSetasAno();

        }

    }
);

// ATUALIZAR AO DIGITAR

anoNascimento.addEventListener(
    "input",
    atualizarSetasAno
);

// ==========================
// CONTROLE DE HABILITAÇÃO
// DOS CAMPOS
// ==========================

anoNascimento.addEventListener(
    "input",
    () => {

        atualizarEstadoCamposData();
        atualizarDiasDisponiveis();
    }
);

anoNascimento.addEventListener(
    "change",
    () => {

        atualizarEstadoCamposData();
        atualizarDiasDisponiveis();
    }
);

mesNascimento.addEventListener(
    "change",
    () => {

        atualizarEstadoCamposData();
        atualizarDiasDisponiveis();
    }
);

// ESTADO INICIAL

atualizarSetasAno();

// LIMITAR DIGITAÇÃO DO ANO

anoNascimento.addEventListener(
    "input",
    () => {

        let valor =
            anoNascimento.value;

        // Permite somente números
        valor =
            valor.replace(
                /\D/g,
                ""
            );

        // Limita a no máximo 4 dígitos
        valor =
            valor.slice(
                0,
                4
            );

        // Impede valores acima de 2026
        if (
            valor.length === 4 &&
            Number(valor) > 2026
        ) {

            valor = "2026";

        }

        // Impede valores abaixo de 1965
        // quando o usuário já terminou de digitar o ano
        if (
            valor.length === 4 &&
            Number(valor) < 1965
        ) {

            valor = "1965";

        }

        anoNascimento.value =
            valor;

    }
);


// PREENCHER ANOS

function preencherAnos() {

    for (
        let ano = 2026;
        ano >= 1965;
        ano--
    ) {

        const option =
            document.createElement(
                "option"
            );

        option.value =
            ano;

        option.textContent =
            ano;

        anoNascimento.appendChild(
            option
        );

    }

}

// SCROLL MAIS SENSÍVEL NO ANO

function configurarScrollAno() {

    anoNascimento.addEventListener(
        "wheel",
        (event) => {

            event.preventDefault();

            let atual =
                anoNascimento.selectedIndex;

            if (event.deltaY > 0) {

                atual += 3;

            }
            else {

                atual -= 3;

            }

            if (atual < 0) {

                atual = 0;

            }

            if (
                atual >=
                anoNascimento.options.length
            ) {

                atual =
                    anoNascimento.options.length - 1;

            }

            anoNascimento.selectedIndex =
                atual;

            // Atualiza mudança caso necessário
            anoNascimento.dispatchEvent(
                new Event("change")
            );

        },
        {
            passive: false
        }
    );

}

// MENSAGEM DE ERRO

function mostrarMensagem(
    texto
) {

    if (!mensagemErro) {
        return;
    }

    mensagemErro.textContent =
        texto;

}

// LIMPAR MENSAGEM

function limparMensagem() {

    if (!mensagemErro) {
        return;
    }

    mensagemErro.textContent =
        "";

}

// ==========================
// VALIDAR DIGITAÇÃO DO ANO
// ==========================

anoNascimento.addEventListener(
    "input",
    () => {

        const valor =
            anoNascimento.value;


        // CAMPO VAZIO

        if (!valor) {

            limparMensagem();

            return;

        }


        // MENOS DE 4 NÚMEROS

        if (
            valor.length < 4
        ) {

            mostrarMensagem(
                "Informe o ano completo com 4 números."
            );

            return;

        }


        // ANO ABAIXO DO PERMITIDO

        if (
            Number(valor) < 1965
        ) {

            mostrarMensagem(
                "Informe um ano entre 1965 e 2026."
            );

            return;

        }


        // ANO ACIMA DO PERMITIDO

        if (
            Number(valor) > 2026
        ) {

            mostrarMensagem(
                "Informe um ano entre 1965 e 2026."
            );

            return;

        }


        // ANO VÁLIDO

        limparMensagem();

    }
);


// ==========================
// OBTER DATA COMPLETA
// ==========================

function obterDataNascimento() {

    const dia =
        diaNascimento.value;

    const mes =
        mesNascimento.value;

    const ano =
        anoNascimento.value;


    if (
        !dia ||
        !mes ||
        !ano
    ) {

        return null;

    }


    return (
        `${ano}-` +
        `${String(mes).padStart(2, "0")}-` +
        `${String(dia).padStart(2, "0")}`
    );

}


// ==========================
// VERIFICAR DATA REAL
// ==========================

function dataValida(
    dia,
    mes,
    ano
) {

    const data =
        new Date(
            ano,
            mes - 1,
            dia
        );

    return (
        data.getFullYear() === ano &&
        data.getMonth() === mes - 1 &&
        data.getDate() === dia
    );

}

// ==========================
// ATUALIZAR DIAS CONFORME MÊS E ANO
// ==========================

function atualizarDiasDisponiveis() {

    const mes = Number(mesNascimento.value);
    const ano = Number(anoNascimento.value);

    // Se o mês ainda não foi escolhido,
    // mantém todos os dias disponíveis.
    if (!mes) {
        return;
    }

    // Usa o ano escolhido quando disponível.
    // Se ainda não houver ano, usa um ano bissexto
    // para permitir inicialmente até o dia 29 em fevereiro.
    const anoParaCalculo = ano || 2024;

    // O dia 0 do mês seguinte corresponde
    // ao último dia do mês atual.
    const ultimoDia = new Date(
        anoParaCalculo,
        mes,
        0
    ).getDate();

    Array.from(diaNascimento.options).forEach(
        (option, index) => {

            // Mantém a opção "Dia"
            if (index === 0) {
                return;
            }

            const dia = Number(option.value);

            if (dia > ultimoDia) {

                option.disabled = true;
                option.hidden = true;

            } else {

                option.disabled = false;
                option.hidden = false;

            }
        }
    );

    // Se o dia atualmente selecionado
    // deixou de existir nesse mês,
    // limpa a seleção.
    const diaAtual = Number(
        diaNascimento.value
    );

    if (
        diaAtual &&
        diaAtual > ultimoDia
    ) {
        diaNascimento.value = "";
    }
}

// ==========================
// ATUALIZAR DIAS AO ALTERAR MÊS
// ==========================

mesNascimento.addEventListener(
    "change",
    atualizarDiasDisponiveis
);

// ==========================
// ATUALIZAR DIAS AO ALTERAR ANO
// ==========================

anoNascimento.addEventListener(
    "change",
    atualizarDiasDisponiveis
);

anoNascimento.addEventListener(
    "input",
    atualizarDiasDisponiveis
);


// ==========================
// CALCULAR IDADE
// ==========================

function calcularIdade(
    dia,
    mes,
    ano
) {

    const hoje =
        new Date();

    let idade =
        hoje.getFullYear() -
        ano;


    const mesAtual =
        hoje.getMonth() + 1;

    const diaAtual =
        hoje.getDate();


    if (
        mesAtual < mes ||
        (
            mesAtual === mes &&
            diaAtual < dia
        )
    ) {

        idade--;

    }


    return idade;

}


// ==========================
// VALIDAR DATA
// ==========================

function validarData() {

    limparMensagem();


    const dia =
        Number(
            diaNascimento.value
        );

    const mes =
        Number(
            mesNascimento.value
        );

    const ano =
        Number(
            anoNascimento.value
        );


    // CAMPO VAZIO

    if (
        !dia ||
        !mes ||
        !ano
    ) {

        mostrarMensagem(
            "Informe sua data de nascimento completa."
        );

        return false;

    }


    // DATA INVÁLIDA

    if (
        !dataValida(
            dia,
            mes,
            ano
        )
    ) {

        mostrarMensagem(
            "Informe uma data de nascimento válida."
        );

        return false;

    }


    // PERÍODO PERMITIDO

    if (
        ano < 1965 ||
        ano > 2026
    ) {

        mostrarMensagem(
            "A data deve estar entre 1965 e 2026."
        );

        return false;

    }


    // DATA FUTURA

    const hoje =
        new Date();

    const nascimento =
        new Date(
            ano,
            mes - 1,
            dia
        );


    if (
        nascimento > hoje
    ) {

        mostrarMensagem(
            "A data de nascimento não pode ser futura."
        );

        return false;

    }


    // IDADE

    const idade =
        calcularIdade(
            dia,
            mes,
            ano
        );


    // LIMITE DA PLATAFORMA

    if (
        idade > 65
    ) {

        mostrarMensagem(
            "A plataforma está disponível para usuários de até 65 anos."
        );

        return false;

    }


    return true;

}


// ==========================
// REDIRECIONAR POR IDADE
// ==========================

function direcionarPorIdade(
    idade
) {

    // 0 A 15 ANOS
    if (
        idade >= 0 &&
        idade <= 15
    ) {

        window.location.replace(
            "./crianças/criancas.html"
        );

        return;

    }


    // 16 A 65 ANOS
    if (
        idade >= 16 &&
        idade <= 65
    ) {

        window.location.replace(
            "./adultos/adultos.html"
        );

        return;

    }


    mostrarMensagem(
        "Não foi possível determinar uma faixa etária válida."
    );

}

// ==========================
// SALVAR DATA NO SUPABASE
// ==========================

async function salvarDataNascimento() {

    try {

        btnContinuar.disabled =
            true;

        btnContinuar.innerHTML =
            `
            <span>
                Salvando...
            </span>
            `;


        const dia =
            Number(
                diaNascimento.value
            );

        const mes =
            Number(
                mesNascimento.value
            );

        const ano =
            Number(
                anoNascimento.value
            );


        const data =
            obterDataNascimento();


        const resposta =
            await fetch(
                `${SUPABASE_URL}/rest/v1/usuarios?id=eq.${usuarioId}`,
                {

                    method:
                        "PATCH",

                    headers: {

                        "apikey":
                            SUPABASE_KEY,

                        "Authorization":
                            `Bearer ${SUPABASE_KEY}`,

                        "Content-Type":
                            "application/json",

                        "Prefer":
                            "return=minimal"

                    },

                    body:
                        JSON.stringify({

                            data_nascimento:
                                data

                        })

                }
            );


        if (
            !resposta.ok
        ) {

            throw new Error(
                "Erro ao salvar a data de nascimento."
            );

        }


        const idade =
            calcularIdade(
                dia,
                mes,
                ano
            );


        direcionarPorIdade(
            idade
        );

    }

    catch (erro) {

        console.error(
            "Erro ao salvar data de nascimento:",
            erro
        );


        mostrarMensagem(
            "Não foi possível salvar sua data. Tente novamente."
        );


        btnContinuar.disabled =
            false;

        btnContinuar.innerHTML =
            `
            <span>
                Continuar
            </span>

            <span class="material-symbols-outlined">
                arrow_forward
            </span>
            `;

    }

}


// ==========================
// FORMULÁRIO
// ==========================

form?.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        if (
            !validarData()
        ) {

            return;

        }


        await salvarDataNascimento();

    }
);


// ==========================
// INICIALIZAÇÃO
// ==========================

preencherAnos();
configurarScrollAno();
atualizarEstadoCamposData();
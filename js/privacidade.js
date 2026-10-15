"use strict";

/* =========================================================
   CONFIGURAÇÃO SUPABASE
========================================================= */

const SUPABASE_URL =
  "https://mnfryxvtogpiwacpyhgo.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_YYMfDfWKaer8F1IEOFVOMQ_acS2xa2G";


/* =========================================================
   ELEMENTOS DA PÁGINA
========================================================= */

const telefoneInput =
  document.getElementById("novoTelefone");

const senhaAtualInput =
  document.getElementById("senha");

const novaSenhaInput =
  document.getElementById("novaSenha");

const confirmarSenhaInput =
  document.getElementById("confirmarSenha");

const form =
  document.getElementById("formPrivacidade");

const loadingInicial =
  document.getElementById("loadingInicial");

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

const btnVoltar =
  document.getElementById("btnVoltar");


/* =========================================================
   IDENTIFICAÇÃO DO USUÁRIO
========================================================= */

const usuarioId =
  localStorage.getItem("usuarioId") ||
  sessionStorage.getItem("usuarioId");


/* =========================================================
   DADOS ORIGINAIS
========================================================= */

let dadosOriginais = {
  telefone: "",
  senha: ""
};


/* =========================================================
   VERIFICAÇÃO DO FORMULÁRIO
========================================================= */

if (!form) {
  console.error(
    "Erro: o formulário #formPrivacidade não foi encontrado."
  );
}


/* =========================================================
   LOADING INICIAL
========================================================= */

function fecharLoadingInicial() {

  if (!loadingInicial) return;

  loadingInicial.classList.remove("active");
}


/* =========================================================
   ABRIR LOADING DE AÇÃO
========================================================= */

function abrirLoading(texto) {

  if (!loadingScreen) return;

  loadingScreen.classList.add("active");

  if (loader) {
    loader.style.display = "block";
  }

  if (successIcon) {
    successIcon.style.display = "none";
  }

  if (errorIcon) {
    errorIcon.style.display = "none";
  }

  if (statusText) {
    statusText.textContent = texto;
  }
}


/* =========================================================
   SUCESSO
========================================================= */

function sucesso(texto) {

  if (loader) {
    loader.style.display = "none";
  }

  if (successIcon) {
    successIcon.style.display = "flex";
  }

  if (errorIcon) {
    errorIcon.style.display = "none";
  }

  if (statusText) {
    statusText.textContent = texto;
  }
}


/* =========================================================
   ERRO
========================================================= */

function erro(texto, icone = "!") {

  if (loader) {
    loader.style.display = "none";
  }

  if (successIcon) {
    successIcon.style.display = "none";
  }

  if (errorIcon) {

    errorIcon.style.display = "flex";

    errorIcon.textContent = icone;
  }

  if (statusText) {
    statusText.textContent = texto;
  }
}


/* =========================================================
   FECHAR LOADING
========================================================= */

function fecharLoading() {

  if (!loadingScreen) return;

  loadingScreen.classList.remove("active");
}


/* =========================================================
   FORMATAÇÃO DO TELEFONE
========================================================= */

function formatarTelefone(valor) {

  let numeros = valor.replace(/\D/g, "");

  numeros = numeros.substring(0, 11);

  if (numeros.length <= 2) {

    return numeros
      ? `(${numeros}`
      : "";
  }

  if (numeros.length <= 7) {

    return `(${numeros.substring(0, 2)}) ${numeros.substring(2)}`;
  }

  return `(${numeros.substring(0, 2)}) ${numeros.substring(2, 7)}-${numeros.substring(7, 11)}`;
}


/* =========================================================
   EVENTO DE DIGITAÇÃO DO TELEFONE
========================================================= */

telefoneInput?.addEventListener(
  "input",
  () => {

    telefoneInput.value =
      formatarTelefone(
        telefoneInput.value
      );
  }
);


/* =========================================================
   BLOQUEIO DE CARACTERES INVÁLIDOS NO TELEFONE
========================================================= */

telefoneInput?.addEventListener(
  "keydown",
  (event) => {

    const teclasPermitidas = [
      "Backspace",
      "Delete",
      "Tab",
      "ArrowLeft",
      "ArrowRight",
      "Home",
      "End"
    ];

    if (
      teclasPermitidas.includes(event.key) ||
      event.ctrlKey ||
      event.metaKey
    ) {
      return;
    }

    if (!/^\d$/.test(event.key)) {
      event.preventDefault();
    }
  }
);


/* =========================================================
   NORMALIZAR TELEFONE
========================================================= */

function normalizarTelefone(valor) {

  return valor.replace(/\D/g, "");
}


/* =========================================================
   VALIDAR TELEFONE
========================================================= */

function validarTelefone(telefone) {

  const numeros =
    normalizarTelefone(telefone);

  if (numeros.length !== 11) {

    return {
      valido: false,
      erro: "Digite um telefone válido com DDD."
    };
  }

  return {
    valido: true,
    numero: numeros
  };
}


/* =========================================================
   LIMITAR SENHA A 8 CARACTERES
========================================================= */

function limitarSenha(input) {

  if (!input) return;

  input.addEventListener(
    "input",
    () => {

      if (input.value.length > 8) {

        input.value =
          input.value.substring(0, 8);
      }
    }
  );
}


limitarSenha(senhaAtualInput);
limitarSenha(novaSenhaInput);
limitarSenha(confirmarSenhaInput);


/* =========================================================
   MOSTRAR / OCULTAR SENHA
========================================================= */

document
  .querySelectorAll(".btn-mostrar-senha")
  .forEach((botao) => {

    botao.addEventListener(
      "click",
      () => {

        const targetId =
          botao.dataset.target;

        const input =
          document.getElementById(targetId);

        if (!input) return;

        const icone =
          botao.querySelector("i");


        if (input.type === "password") {

          input.type = "text";

          if (icone) {

            icone.classList.remove(
              "fa-eye"
            );

            icone.classList.add(
              "fa-eye-slash"
            );
          }

          botao.setAttribute(
            "aria-label",
            "Ocultar senha"
          );

          botao.setAttribute(
            "title",
            "Ocultar senha"
          );

        } else {

          input.type = "password";

          if (icone) {

            icone.classList.remove(
              "fa-eye-slash"
            );

            icone.classList.add(
              "fa-eye"
            );
          }

          botao.setAttribute(
            "aria-label",
            "Mostrar senha"
          );

          botao.setAttribute(
            "title",
            "Mostrar senha"
          );
        }
      }
    );
  });


/* =========================================================
   CARREGAR DADOS DO USUÁRIO
========================================================= */

async function carregarPrivacidade() {

  try {

    if (!usuarioId) {

      throw new Error(
        "Usuário não identificado."
      );
    }


    const resposta = await fetch(
      `${SUPABASE_URL}/rest/v1/usuarios?id=eq.${encodeURIComponent(usuarioId)}`,
      {
        method: "GET",

        headers: {
          apikey: SUPABASE_KEY,
          Authorization:
            `Bearer ${SUPABASE_KEY}`,
          "Content-Type":
            "application/json"
        }
      }
    );


    if (!resposta.ok) {

      throw new Error(
        `Erro ao carregar usuário. Código: ${resposta.status}`
      );
    }


    const dados =
      await resposta.json();


    if (
      !Array.isArray(dados) ||
      dados.length === 0
    ) {

      throw new Error(
        "Usuário não encontrado."
      );
    }


    const usuario =
      dados[0];


    /* =====================================
       TELEFONE
    ====================================== */

    const telefoneUsuario =
      usuario.telefone || "";


    if (telefoneInput) {

      telefoneInput.value =
        formatarTelefone(
          telefoneUsuario
        );
    }


    /* =====================================
       DADOS ORIGINAIS
    ====================================== */

    dadosOriginais = {

      telefone:
        formatarTelefone(
          telefoneUsuario
        ),

      senha:
        usuario.senha || ""
    };


    fecharLoadingInicial();

  } catch (error) {

    console.error(
      "Erro ao carregar privacidade:",
      error
    );

    fecharLoadingInicial();

    abrirLoading(
      "Erro ao carregar seus dados."
    );

    erro(
      error.message ||
      "Erro ao carregar seus dados."
    );

    setTimeout(
      () => fecharLoading(),
      2500
    );
  }
}


/* =========================================================
   VALIDAR ALTERAÇÃO DE SENHA
========================================================= */

function validarAlteracaoSenha() {

  const senhaAtual =
    senhaAtualInput
      ? senhaAtualInput.value
      : "";

  const novaSenha =
    novaSenhaInput
      ? novaSenhaInput.value
      : "";

  const confirmarSenha =
    confirmarSenhaInput
      ? confirmarSenhaInput.value
      : "";


  /* =====================================
     NENHUM CAMPO DE SENHA PREENCHIDO
  ====================================== */

  if (
    senhaAtual === "" &&
    novaSenha === "" &&
    confirmarSenha === ""
  ) {

    return {
      alterar: false
    };
  }


  /* =====================================
     SENHA ATUAL
  ====================================== */

  if (senhaAtual === "") {

    return {
      alterar: false,
      erro: "Digite sua senha atual."
    };
  }


  if (senhaAtual.length !== 8) {

    return {
      alterar: false,
      erro:
        "A senha atual deve ter exatamente 8 caracteres."
    };
  }


  /* =====================================
     NOVA SENHA
  ====================================== */

  if (novaSenha === "") {

    return {
      alterar: false,
      erro: "Digite uma nova senha."
    };
  }


  if (novaSenha.length !== 8) {

    return {
      alterar: false,
      erro:
        "A nova senha deve ter exatamente 8 caracteres."
    };
  }


  /* =====================================
     CONFIRMAÇÃO
  ====================================== */

  if (confirmarSenha === "") {

    return {
      alterar: false,
      erro: "Confirme sua nova senha."
    };
  }


  if (confirmarSenha.length !== 8) {

    return {
      alterar: false,
      erro:
        "A confirmação da senha deve ter exatamente 8 caracteres."
    };
  }


  /* =====================================
     VERIFICAR SENHA ATUAL
  ====================================== */

  if (
    senhaAtual !==
    dadosOriginais.senha
  ) {

    return {
      alterar: false,
      erro: "Senha atual incorreta."
    };
  }


  /* =====================================
     IMPEDIR REPETIÇÃO
  ====================================== */

  if (
    novaSenha === senhaAtual
  ) {

    return {
      alterar: false,
      erro:
        "A nova senha deve ser diferente da senha atual."
    };
  }


  /* =====================================
     CONFIRMAR NOVA SENHA
  ====================================== */

  if (
    novaSenha !== confirmarSenha
  ) {

    return {
      alterar: false,
      erro: "As senhas não coincidem."
    };
  }


  return {

    alterar: true,

    senhaAtual,

    novaSenha
  };
}


/* =========================================================
   SALVAR ALTERAÇÕES
========================================================= */

form?.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();


    /* =====================================
       VERIFICAR USUÁRIO
    ====================================== */

    if (!usuarioId) {

      abrirLoading(
        "Verificando usuário..."
      );

      erro(
        "Usuário não identificado."
      );

      setTimeout(
        fecharLoading,
        2500
      );

      return;
    }


    try {

      /* =====================================
         TELEFONE ATUAL
      ====================================== */

      const telefoneNovo =
        telefoneInput
          ? formatarTelefone(
              telefoneInput.value
            )
          : "";


      /* =====================================
         VALIDAR TELEFONE
      ====================================== */

      const resultadoTelefone =
        validarTelefone(
          telefoneNovo
        );


      if (!resultadoTelefone.valido) {

        abrirLoading(
          "Validando telefone..."
        );

        erro(
          resultadoTelefone.erro
        );

        setTimeout(
          fecharLoading,
          2000
        );

        return;
      }


      /* =====================================
         VALIDAR SENHA
      ====================================== */

      const resultadoSenha =
        validarAlteracaoSenha();


      if (resultadoSenha.erro) {

        abrirLoading(
          "Validando dados..."
        );

        erro(
          resultadoSenha.erro
        );

        setTimeout(
          fecharLoading,
          2000
        );

        return;
      }


      /* =====================================
         VERIFICAR ALTERAÇÃO DE TELEFONE
      ====================================== */

      const telefoneAlterado =
        normalizarTelefone(
          telefoneNovo
        ) !==
        normalizarTelefone(
          dadosOriginais.telefone
        );


      /* =====================================
         VERIFICAR ALTERAÇÃO DE SENHA
      ====================================== */

      const senhaAlterada =
        resultadoSenha.alterar === true;


      /* =====================================
         VERIFICAR SE NADA FOI ALTERADO
      ====================================== */

      const nadaAlterado =
        !telefoneAlterado &&
        !senhaAlterada;


      if (nadaAlterado) {

        abrirLoading(
          "Verificando alterações..."
        );

        erro(
          "Nenhuma alteração foi realizada."
        );

        setTimeout(
          fecharLoading,
          2000
        );

        return;
      }


      /* =====================================
         MONTAR ATUALIZAÇÃO
      ====================================== */

      const atualizacao = {};


      if (telefoneAlterado) {

        atualizacao.telefone =
          telefoneNovo;
      }


      if (senhaAlterada) {

        atualizacao.senha =
          resultadoSenha.novaSenha;
      }


      /* =====================================
         ABRIR LOADING
      ====================================== */

      abrirLoading(
        "Salvando alterações..."
      );


      /* =====================================
         ATUALIZAR SUPABASE
      ====================================== */

      const resposta = await fetch(
        `${SUPABASE_URL}/rest/v1/usuarios?id=eq.${encodeURIComponent(usuarioId)}`,
        {
          method: "PATCH",

          headers: {
            apikey: SUPABASE_KEY,

            Authorization:
              `Bearer ${SUPABASE_KEY}`,

            "Content-Type":
              "application/json",

            Prefer:
              "return=representation"
          },

          body:
            JSON.stringify(
              atualizacao
            )
        }
      );


      /* =====================================
         VERIFICAR RESPOSTA
      ====================================== */

      if (!resposta.ok) {

        let mensagem =
          "Erro ao salvar as alterações.";


        try {

          const respostaErro =
            await resposta.json();


          if (respostaErro?.message) {

            mensagem =
              respostaErro.message;

          } else if (
            respostaErro?.details
          ) {

            mensagem =
              respostaErro.details;

          } else if (
            respostaErro?.hint
          ) {

            mensagem =
              respostaErro.hint;
          }

        } catch {

          // Mantém mensagem padrão.
        }


        throw new Error(
          mensagem
        );
      }


      /* =====================================
         ATUALIZAR DADOS LOCAIS
      ====================================== */

      dadosOriginais.telefone =
        telefoneNovo;


      if (senhaAlterada) {

        dadosOriginais.senha =
          resultadoSenha.novaSenha;
      }


      /* =====================================
         LIMPAR CAMPOS
      ====================================== */

      if (telefoneInput) {

        telefoneInput.value =
          formatarTelefone(
            telefoneNovo
          );
      }


      if (senhaAtualInput) {

        senhaAtualInput.value = "";
      }


      if (novaSenhaInput) {

        novaSenhaInput.value = "";
      }


      if (confirmarSenhaInput) {

        confirmarSenhaInput.value = "";
      }


      /* =====================================
         MOSTRAR SUCESSO
      ====================================== */

      sucesso(
        "Dados atualizados com sucesso!"
      );


      /* =====================================
         VOLTAR PARA HOME
      ====================================== */

      setTimeout(
        () => {

          window.location.replace(
            "./home.html"
          );

        },
        1500
      );

    } catch (error) {

      console.error(
        "Erro ao salvar alterações:",
        error
      );

      erro(
        error.message ||
        "Erro ao atualizar seus dados."
      );

      setTimeout(
        fecharLoading,
        2500
      );
    }
  }
);


/* =========================================================
   BOTÃO VOLTAR
========================================================= */

btnVoltar?.addEventListener(
  "click",
  () => {

    if (window.history.length > 1) {

      window.history.back();

    } else {

      window.location.href =
        "./home.html";
    }
  }
);


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

carregarPrivacidade();
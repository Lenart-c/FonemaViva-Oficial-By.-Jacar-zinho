document.addEventListener("DOMContentLoaded", () => {
  "use strict";


  /* =========================================================
     ELEMENTOS
  ========================================================== */

  const loadingScreen =
    document.getElementById("loadingScreen");

  const supportSearch =
    document.getElementById("supportSearch");

  const btnClearSearch =
    document.getElementById("btnClearSearch");

  const categoryCards =
    document.querySelectorAll(".category-card");

  const faqSection =
    document.getElementById("faqSection");

  const faqItems =
    document.querySelectorAll(".faq-item");

  const faqQuestions =
    document.querySelectorAll(".faq-question");

  const faqEmpty =
    document.getElementById("faqEmpty");

  const btnAbrirChamado =
    document.getElementById("btnAbrirChamado");

  const btnAbrirChamadoSemResultado =
    document.getElementById(
      "btnAbrirChamadoSemResultado"
    );

  const supportFormSection =
    document.getElementById(
      "supportFormSection"
    );

  const btnFecharFormulario =
    document.getElementById(
      "btnFecharFormulario"
    );

  const supportForm =
    document.getElementById("supportForm");

  const assunto =
    document.getElementById("assunto");

  const categoria =
    document.getElementById("categoria");

  const descricao =
    document.getElementById("descricao");

  const descricaoCounter =
    document.getElementById(
      "descricaoCounter"
    );

  const btnCancelarChamado =
    document.getElementById(
      "btnCancelarChamado"
    );

  const btnEnviarChamado =
    document.getElementById(
      "btnEnviarChamado"
    );

  const supportSuccess =
    document.getElementById(
      "supportSuccess"
    );

  const btnVoltarSuporte =
    document.getElementById(
      "btnVoltarSuporte"
    );

  const btnNovaSolicitacao =
    document.getElementById(
      "btnNovaSolicitacao"
    );

  const logoutModal =
    document.getElementById(
      "logoutModal"
    );

  const btnFecharLogout =
    document.getElementById(
      "btnFecharLogout"
    );

  const btnCancelarLogout =
    document.getElementById(
      "btnCancelarLogout"
    );

  const btnConfirmarLogout =
    document.getElementById(
      "btnConfirmarLogout"
    );

  const supportToast =
    document.getElementById(
      "supportToast"
    );

  const supportToastMessage =
    document.getElementById(
      "supportToastMessage"
    );


  /* =========================================================
     ESTADO
  ========================================================== */

  let categoriaSelecionada = "";

  let toastTimeout = null;


  /* =========================================================
     FUNÇÕES AUXILIARES
  ========================================================== */

  function mostrarElemento(elemento) {

    if (!elemento) {
      return;
    }

    elemento.hidden = false;

  }


  function esconderElemento(elemento) {

    if (!elemento) {
      return;
    }

    elemento.hidden = true;

  }


  function normalizarTexto(texto) {

    return String(texto || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  }


  /* =========================================================
     TELA DE CARREGAMENTO
  ========================================================== */

  if (loadingScreen) {

    window.setTimeout(() => {

      loadingScreen.classList.add(
        "hidden"
      );

      window.setTimeout(() => {

        loadingScreen.style.display =
          "none";

      }, 400);

    }, 500);

  }


  /* =========================================================
     TOAST
  ========================================================== */

  function mostrarToast(mensagem) {

    if (!supportToast) {
      return;
    }


    if (supportToastMessage) {

      supportToastMessage.textContent =
        mensagem;

    }


    clearTimeout(
      toastTimeout
    );


    mostrarElemento(
      supportToast
    );


    toastTimeout =
      window.setTimeout(() => {

        esconderElemento(
          supportToast
        );

      }, 3500);

  }


  /* =========================================================
     PESQUISA / FILTRO FAQ
  ========================================================== */

  function filtrarFAQ() {

    const termo =
      normalizarTexto(
        supportSearch
          ? supportSearch.value.trim()
          : ""
      );


    let encontrados = 0;


    faqItems.forEach((item) => {

      const categoriaItem =
        item.dataset.category || "";


      const textoPesquisa =
        normalizarTexto(
          `${item.dataset.search || ""} ${
            item.textContent || ""
          }`
        );


      const correspondeCategoria =
        !categoriaSelecionada ||
        categoriaItem ===
          categoriaSelecionada;


      const correspondeBusca =
        !termo ||
        textoPesquisa.includes(
          termo
        );


      const deveMostrar =
        correspondeCategoria &&
        correspondeBusca;


      item.hidden =
        !deveMostrar;


      if (deveMostrar) {

        encontrados++;

      }

    });


    const semResultados =
      termo !== "" &&
      encontrados === 0;


    if (semResultados) {

      mostrarElemento(
        faqEmpty
      );

      esconderElemento(
        btnAbrirChamado
      );

    } else {

      esconderElemento(
        faqEmpty
      );

      mostrarElemento(
        btnAbrirChamado
      );

    }


    if (btnClearSearch) {

      btnClearSearch.hidden =
        !termo;

    }

  }


  /* =========================================================
     CAMPO DE PESQUISA
  ========================================================== */

  if (supportSearch) {

    supportSearch.addEventListener(
      "input",
      () => {

        filtrarFAQ();

      }
    );

  }


  /* =========================================================
     LIMPAR PESQUISA
  ========================================================== */

  if (btnClearSearch) {

    btnClearSearch.addEventListener(
      "click",
      () => {

        if (supportSearch) {

          supportSearch.value = "";

          supportSearch.focus();

        }


        categoriaSelecionada = "";


        categoryCards.forEach(
          (card) => {

            card.classList.remove(
              "active"
            );

            card.setAttribute(
              "aria-pressed",
              "false"
            );

          }
        );


        filtrarFAQ();

      }
    );

  }


  /* =========================================================
     CATEGORIAS
  ========================================================== */

  categoryCards.forEach((card) => {

    card.setAttribute(
      "aria-pressed",
      "false"
    );


    card.addEventListener(
      "click",
      () => {

        const categoria =
          card.dataset.category || "";


        if (
          categoriaSelecionada ===
          categoria
        ) {

          categoriaSelecionada = "";


          card.classList.remove(
            "active"
          );


          card.setAttribute(
            "aria-pressed",
            "false"
          );

        } else {

          categoriaSelecionada =
            categoria;


          categoryCards.forEach(
            (outroCard) => {

              outroCard.classList.remove(
                "active"
              );


              outroCard.setAttribute(
                "aria-pressed",
                "false"
              );

            }
          );


          card.classList.add(
            "active"
          );


          card.setAttribute(
            "aria-pressed",
            "true"
          );

        }


        filtrarFAQ();


        if (faqSection) {

          faqSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });

        }

      }
    );

  });


  /* =========================================================
     FAQ — ACORDEÃO
  ========================================================== */

  faqQuestions.forEach((question) => {

    question.addEventListener(
      "click",
      () => {

        const item =
          question.closest(
            ".faq-item"
          );


        if (!item) {
          return;
        }


        const estavaAtivo =
          item.classList.contains(
            "active"
          );


        faqItems.forEach(
          (outroItem) => {

            outroItem.classList.remove(
              "active"
            );

          }
        );


        faqQuestions.forEach(
          (outraQuestion) => {

            outraQuestion.setAttribute(
              "aria-expanded",
              "false"
            );

          }
        );


        if (!estavaAtivo) {

          item.classList.add(
            "active"
          );


          question.setAttribute(
            "aria-expanded",
            "true"
          );

        }

      }
    );

  });


  /* =========================================================
     ABRIR FORMULÁRIO
  ========================================================== */

  function abrirFormulario() {

    esconderElemento(
      faqEmpty
    );


    esconderElemento(
      btnAbrirChamado
    );


    esconderElemento(
      supportSuccess
    );


    mostrarElemento(
      supportFormSection
    );


    if (categoriaSelecionada) {

      if (categoria) {

        const option =
          categoria.querySelector(
            `option[value="${categoriaSelecionada}"]`
          );


        if (option) {

          categoria.value =
            categoriaSelecionada;

        }

      }

    }


    window.setTimeout(() => {

      if (assunto) {

        assunto.focus();

      }

    }, 100);


    if (supportFormSection) {

      supportFormSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    }

  }


  /* =========================================================
     BOTÃO — ABRIR SOLICITAÇÃO
  ========================================================== */

  if (btnAbrirChamado) {

    btnAbrirChamado.addEventListener(
      "click",
      () => {

        abrirFormulario();

      }
    );

  }


  /* =========================================================
     BOTÃO — ABRIR SOLICITAÇÃO SEM RESULTADO
  ========================================================== */

  if (btnAbrirChamadoSemResultado) {

    btnAbrirChamadoSemResultado
      .addEventListener(
        "click",
        () => {

          abrirFormulario();

        }
      );

  }


  /* =========================================================
     FECHAR FORMULÁRIO
  ========================================================== */

  function fecharFormulario() {

    esconderElemento(
      supportFormSection
    );


    mostrarElemento(
      btnAbrirChamado
    );


    if (supportSearch) {

      supportSearch.focus();

    }

  }


  if (btnFecharFormulario) {

    btnFecharFormulario.addEventListener(
      "click",
      () => {

        fecharFormulario();

      }
    );

  }


  if (btnCancelarChamado) {

    btnCancelarChamado.addEventListener(
      "click",
      () => {

        fecharFormulario();

      }
    );

  }


  /* =========================================================
     CONTADOR DA DESCRIÇÃO
  ========================================================== */

  function atualizarContadorDescricao() {

    if (
      !descricao ||
      !descricaoCounter
    ) {

      return;

    }


    const quantidade =
      descricao.value.length;


    const limite =
      descricao.maxLength ||
      2000;


    descricaoCounter.textContent =
      `${quantidade}/${limite}`;

  }


  if (descricao) {

    descricao.addEventListener(
      "input",
      atualizarContadorDescricao
    );

  }


  /* =========================================================
     VALIDAÇÃO DO FORMULÁRIO
  ========================================================== */

  function validarFormulario() {

    if (!supportForm) {

      return false;

    }


    let valido = true;


    const assuntoValor =
      assunto
        ? assunto.value.trim()
        : "";


    const categoriaValor =
      categoria
        ? categoria.value
        : "";


    const descricaoValor =
      descricao
        ? descricao.value.trim()
        : "";


    /* ASSUNTO */

    if (
      assuntoValor.length < 3
    ) {

      valido = false;


      if (assunto) {

        assunto.classList.add(
          "input-error"
        );


        assunto.focus();

      }

    } else if (assunto) {

      assunto.classList.remove(
        "input-error"
      );

    }


    /* CATEGORIA */

    if (!categoriaValor) {

      valido = false;


      if (categoria) {

        categoria.classList.add(
          "input-error"
        );

      }

    } else if (categoria) {

      categoria.classList.remove(
        "input-error"
      );

    }


    /* DESCRIÇÃO */

    if (
      descricaoValor.length < 10
    ) {

      valido = false;


      if (descricao) {

        descricao.classList.add(
          "input-error"
        );


        if (
          document.activeElement !==
          assunto
        ) {

          descricao.focus();

        }

      }

    } else if (descricao) {

      descricao.classList.remove(
        "input-error"
      );

    }


    return valido;

  }


  /* =========================================================
     REMOVER ERRO AO DIGITAR
  ========================================================== */

  if (assunto) {

    assunto.addEventListener(
      "input",
      () => {

        if (
          assunto.value.trim().length >= 3
        ) {

          assunto.classList.remove(
            "input-error"
          );

        }

      }
    );

  }


  if (categoria) {

    categoria.addEventListener(
      "change",
      () => {

        if (categoria.value) {

          categoria.classList.remove(
            "input-error"
          );

        }

      }
    );

  }


  if (descricao) {

    descricao.addEventListener(
      "input",
      () => {

        if (
          descricao.value.trim().length >=
          10
        ) {

          descricao.classList.remove(
            "input-error"
          );

        }

      }
    );

  }


  /* =========================================================
     ENVIO DO FORMULÁRIO
  ========================================================== */

  if (supportForm) {

    supportForm.addEventListener(
      "submit",
      (event) => {

        event.preventDefault();


        if (!validarFormulario()) {

          mostrarToast(
            "Preencha corretamente os campos da solicitação."
          );

          return;

        }


        if (btnEnviarChamado) {

          btnEnviarChamado.disabled =
            true;


          btnEnviarChamado.classList.add(
            "loading"
          );

        }


        /*
         * Envio simulado.
         * A integração com o Supabase poderá ser
         * adicionada posteriormente.
         */

        window.setTimeout(
          () => {

            if (btnEnviarChamado) {

              btnEnviarChamado.disabled =
                false;


              btnEnviarChamado.classList.remove(
                "loading"
              );

            }


            esconderElemento(
              supportFormSection
            );


            esconderElemento(
              btnAbrirChamado
            );


            esconderElemento(
              faqEmpty
            );


            mostrarElemento(
              supportSuccess
            );


            if (supportSuccess) {

              supportSuccess.scrollIntoView({
                behavior: "smooth",
                block: "start"
              });

            }

          },
          800
        );

      }
    );

  }


  /* =========================================================
     VOLTAR PARA O SUPORTE APÓS SUCESSO
  ========================================================== */

  if (btnVoltarSuporte) {

    btnVoltarSuporte.addEventListener(
      "click",
      () => {

        esconderElemento(
          supportSuccess
        );


        mostrarElemento(
          btnAbrirChamado
        );


        if (supportSearch) {

          supportSearch.value = "";

        }


        categoriaSelecionada = "";


        categoryCards.forEach(
          (card) => {

            card.classList.remove(
              "active"
            );


            card.setAttribute(
              "aria-pressed",
              "false"
            );

          }
        );


        filtrarFAQ();


        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });

      }
    );

  }


  /* =========================================================
     NOVA SOLICITAÇÃO
  ========================================================== */

  if (btnNovaSolicitacao) {

    btnNovaSolicitacao.addEventListener(
      "click",
      () => {

        if (supportForm) {

          supportForm.reset();

        }


        if (assunto) {

          assunto.classList.remove(
            "input-error"
          );

        }


        if (categoria) {

          categoria.classList.remove(
            "input-error"
          );

        }


        if (descricao) {

          descricao.classList.remove(
            "input-error"
          );

        }


        atualizarContadorDescricao();


        esconderElemento(
          supportSuccess
        );


        abrirFormulario();

      }
    );

  }


  /* =========================================================
     MODAL DE SAÍDA
  ========================================================== */

  const elementosLogout =
    document.querySelectorAll(
      "[data-logout], #btnSair, .btn-sair"
    );


  function abrirLogoutModal() {

    if (!logoutModal) {

      return;

    }


    mostrarElemento(
      logoutModal
    );


    document.body.classList.add(
      "modal-open"
    );

  }


  function fecharLogoutModal() {

    if (!logoutModal) {

      return;

    }


    esconderElemento(
      logoutModal
    );


    document.body.classList.remove(
      "modal-open"
    );

  }


  elementosLogout.forEach(
    (elemento) => {

      elemento.addEventListener(
        "click",
        (event) => {

          event.preventDefault();

          abrirLogoutModal();

        }
      );

    }
  );


  /* =========================================================
     FECHAR MODAL DE SAÍDA
  ========================================================== */

  if (btnFecharLogout) {

    btnFecharLogout.addEventListener(
      "click",
      () => {

        fecharLogoutModal();

      }
    );

  }


  if (btnCancelarLogout) {

    btnCancelarLogout.addEventListener(
      "click",
      () => {

        fecharLogoutModal();

      }
    );

  }


  /* =========================================================
     CONFIRMAR SAÍDA
  ========================================================== */

  if (btnConfirmarLogout) {

    btnConfirmarLogout.addEventListener(
      "click",
      () => {

        localStorage.removeItem(
          "usuarioFoto"
        );


        sessionStorage.removeItem(
          "usuarioFoto"
        );


        fecharLogoutModal();


        window.location.href =
          "index.html";

      }
    );

  }


  /* =========================================================
     FECHAR MODAL CLICANDO FORA
  ========================================================== */

  if (logoutModal) {

    logoutModal.addEventListener(
      "click",
      (event) => {

        if (
          event.target ===
          logoutModal
        ) {

          fecharLogoutModal();

        }

      }
    );

  }


  /* =========================================================
     TECLA ESC
  ========================================================== */

  document.addEventListener(
    "keydown",
    (event) => {

      if (
        event.key !== "Escape"
      ) {

        return;

      }


      if (
        logoutModal &&
        !logoutModal.hidden
      ) {

        fecharLogoutModal();

        return;

      }


      if (
        supportFormSection &&
        !supportFormSection.hidden
      ) {

        fecharFormulario();

      }

    }
  );


  /* =========================================================
     ESTADO INICIAL
  ========================================================== */

  faqItems.forEach(
    (item) => {

      item.classList.remove(
        "active"
      );

    }
  );


  faqQuestions.forEach(
    (question) => {

      question.setAttribute(
        "aria-expanded",
        "false"
      );

    }
  );


  if (btnClearSearch) {

    btnClearSearch.hidden =
      true;

  }


  esconderElemento(
    supportFormSection
  );


  esconderElemento(
    supportSuccess
  );


  esconderElemento(
    faqEmpty
  );


  esconderElemento(
    logoutModal
  );


  esconderElemento(
    supportToast
  );


  mostrarElemento(
    btnAbrirChamado
  );


  atualizarContadorDescricao();


  filtrarFAQ();

});

"use strict";

/* =========================================================
   FONEMAVIVA — CONFIGURAÇÕES
   Arquivo: js/configuracoes.js
   ========================================================= */


/* =========================================================
   ROTAS
   =========================================================

   Preencha os caminhos quando as páginas correspondentes
   estiverem definidas.

   ========================================================= */

const ROTAS_CONFIGURACOES = {
  notificacoes: "",
  exercicios: "",
  continuarExercicios: "",
  dispositivos: "",
  excluirConta: "",
  sobre: "",
  termos: "",
  privacidade: ""
};


/* =========================================================
   ELEMENTOS
   ========================================================= */

const btnNotificacoes =
  document.getElementById("btnNotificacoes");

const btnExercicios =
  document.getElementById("btnExercicios");

const btnContinuarExercicios =
  document.getElementById("btnContinuarExercicios");

const btnDispositivos =
  document.getElementById("btnDispositivos");

const btnExcluirConta =
  document.getElementById("btnExcluirConta");

const btnSobre =
  document.getElementById("btnSobre");

const btnTermos =
  document.getElementById("btnTermos");

const btnPrivacidade =
  document.getElementById("btnPrivacidade");


/* =========================================================
   FUNÇÃO DE NAVEGAÇÃO
   ========================================================= */

function navegarPara(rota) {

  if (!rota) {
    return;
  }

  window.location.href = rota;

}


/* =========================================================
   NOTIFICAÇÕES
   ========================================================= */

if (btnNotificacoes) {

  btnNotificacoes.addEventListener("click", () => {

    navegarPara(
      ROTAS_CONFIGURACOES.notificacoes
    );

  });

}


/* =========================================================
   EXERCÍCIOS
   ========================================================= */

if (btnExercicios) {

  btnExercicios.addEventListener("click", () => {

    navegarPara(
      ROTAS_CONFIGURACOES.exercicios
    );

  });

}


/* =========================================================
   CONTINUAR EXERCÍCIOS
   ========================================================= */

if (btnContinuarExercicios) {

  btnContinuarExercicios.addEventListener("click", () => {

    navegarPara(
      ROTAS_CONFIGURACOES.continuarExercicios
    );

  });

}


/* =========================================================
   DISPOSITIVOS CONECTADOS
   ========================================================= */

if (btnDispositivos) {

  btnDispositivos.addEventListener("click", () => {

    navegarPara(
      ROTAS_CONFIGURACOES.dispositivos
    );

  });

}


/* =========================================================
   EXCLUIR CONTA
   ========================================================= */

if (btnExcluirConta) {

  btnExcluirConta.addEventListener("click", () => {

    navegarPara(
      ROTAS_CONFIGURACOES.excluirConta
    );

  });

}


/* =========================================================
   SOBRE O FONEMAVIVA
   ========================================================= */

if (btnSobre) {

  btnSobre.addEventListener("click", () => {

    navegarPara(
      ROTAS_CONFIGURACOES.sobre
    );

  });

}


/* =========================================================
   TERMOS DE USO
   ========================================================= */

if (btnTermos) {

  btnTermos.addEventListener("click", () => {

    navegarPara(
      ROTAS_CONFIGURACOES.termos
    );

  });

}


/* =========================================================
   POLÍTICA DE PRIVACIDADE
   ========================================================= */

if (btnPrivacidade) {

  btnPrivacidade.addEventListener("click", () => {

    navegarPara(
      ROTAS_CONFIGURACOES.privacidade
    );

  });

}
/**
 * GERENCIAMENTO DE PERFIL DE USUÁRIO
 * Integração: Supabase (REST API)
 * Objetivo: Carregar e atualizar dados do perfil (apelido, telefone, foto, banner)
 */

// Configurações de Acesso ao Banco de Dados
const SUPABASE_URL = "https://mnfryxvtogpiwacpyhgo.supabase.co";
const SUPABASE_KEY = "sb_publishable_YYMfDfWKaer8F1IEOFVOMQ_acS2xa2G";

// =============================================================================
// SELEÇÃO DE ELEMENTOS DO DOM
// =============================================================================
const form = document.getElementById("formPerfil");
const nomeInput = document.getElementById("nome");
const apelidoInput = document.getElementById("apelido");
const emailInput = document.getElementById("email");
const telefoneInput = document.getElementById("telefone");
const fotoInput = document.getElementById("fotoPerfil");
const previewFoto = document.getElementById("previewFoto");
const tituloNome = document.getElementById("tituloNome");

// Elementos de Feedback de UI
const loadingScreen = document.getElementById("loadingScreen");
const loadingInicial = document.getElementById("loadingInicial");
const loader = document.getElementById("loader");
const successIcon = document.getElementById("successIcon");
const errorIcon = document.getElementById("errorIcon");
const statusText = document.getElementById("statusText");
const warningIcon = document.getElementById("warningIcon");
const perfilBanner = document.getElementById("perfilBanner");

let corBannerAtual = "banner-verde"; // Variável de estado para a cor do banner

// =============================================================================
// FUNÇÕES DE UTILIDADE E UI
// =============================================================================

// Atualiza o título do perfil baseado na prioridade: Apelido > Nome > "Usuário"
function atualizarNomePerfil(nome, apelido) {
    tituloNome.textContent = apelido && apelido.trim() ? apelido : nome || "Usuário";
}

// Funções para gerenciar o estado da tela de carregamento (feedback visual)
function abrirLoading(texto) {
    loadingScreen.classList.add("active");
    loader.style.display = "block";
    successIcon.style.display = "none";
    errorIcon.style.display = "none";
    warningIcon.style.display = "none";
    statusText.textContent = texto;
}

function mostrarSucesso(texto) {
    loader.style.display = "none";
    successIcon.style.display = "flex";
    statusText.textContent = texto;
}

function mostrarErro(texto) {
    loader.style.display = "none";
    errorIcon.style.display = "flex";
    statusText.textContent = texto;
}

function mostrarAviso(texto) {
    loader.style.display = "none";
    warningIcon.style.display = "flex";
    statusText.textContent = texto;
}

// =============================================================================
// DADOS E CARREGAMENTO
// =============================================================================
const usuarioId =
localStorage.getItem("usuarioId") ||
sessionStorage.getItem("usuarioId");

// ==========================
// PROTEÇÃO DE SESSÃO
// ==========================

function verificarSessao() {

  const usuarioId =
  localStorage.getItem("usuarioId") ||
  sessionStorage.getItem("usuarioId");

  if (!usuarioId) {

    window.location.replace(
      "./index.html"
    );

  }

}

verificarSessao();

window.addEventListener(
  "pageshow",
  verificarSessao
);

let fotoBase64 = "";

async function carregarPerfil() {
    if (!usuarioId) {
        alert("Faça login novamente.");
        window.location.href = "./login.html";
        return;
    }

    try {
        // Busca os dados do usuário no Supabase via REST API
        const resposta = await fetch(`${SUPABASE_URL}/rest/v1/usuarios?id=eq.${usuarioId}`, {
            method: "GET",
            headers: {
                "apikey": SUPABASE_KEY,
                "Authorization": `Bearer ${SUPABASE_KEY}`,
                "Content-Type": "application/json"
            }
        });

        if (!resposta.ok) throw await resposta.text();
        const dados = await resposta.json();

        if (!dados || dados.length === 0) {
            alert("Usuário não encontrado.");
            return;
        }

        const usuario = dados[0];
        corBannerAtual = usuario.cor_banner || "banner-verde";
        perfilBanner.className = `perfil-banner ${corBannerAtual}`;

        // Armazena dados originais para comparar no salvamento (evita processamento desnecessário)
        window.dadosOriginais = { 
            cor_banner: corBannerAtual,
            apelido: usuario.apelido || "",
            telefone: usuario.telefone || "",
            foto_perfil: usuario.foto_perfil || ""
        };

        // Preenche campos do formulário
        nomeInput.value = usuario.nome || "";
        apelidoInput.value = usuario.apelido || "";
        emailInput.value = usuario.email || "";
        telefoneInput.value = usuario.telefone || "";

        atualizarNomePerfil(usuario.nome, usuario.apelido);

        // Oculta loading inicial
        setTimeout(() => loadingInicial.classList.remove("active"), 500);

        // Trata exibição da imagem de perfil
        const fotoPlaceholder = document.getElementById("fotoPlaceholder");
        if (usuario.foto_perfil) {
            previewFoto.src = usuario.foto_perfil;
            if (fotoPlaceholder) fotoPlaceholder.style.display = "none";
            fotoBase64 = usuario.foto_perfil;
        }
    } catch (erro) {
        console.error(erro);
        alert("Erro ao carregar perfil.");
    }
}

carregarPerfil();

// =============================================================================
// EVENTOS (Interações do Usuário)
// =============================================================================

// Conversão da imagem selecionada para Base64
fotoInput?.addEventListener("change", () => {
    const arquivo = fotoInput.files[0];
    if (!arquivo) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        fotoBase64 = e.target.result;
        previewFoto.src = fotoBase64;
        document.getElementById("fotoPlaceholder").style.display = "none";
    };
    reader.readAsDataURL(arquivo);
});

// Ação de Salvar Perfil
form?.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Lógica de verificação: só envia ao servidor se houver alteração real
    const semMudancas = corBannerAtual === window.dadosOriginais.cor_banner &&
        apelidoInput.value.trim() === window.dadosOriginais.apelido &&
        telefoneInput.value.trim() === window.dadosOriginais.telefone &&
        fotoBase64 === window.dadosOriginais.foto_perfil;

    if (semMudancas) {
        abrirLoading("Verificando...");
        mostrarAviso("Nenhuma alteração foi feita.");
        setTimeout(() => loadingScreen.classList.remove("active"), 2000);
        return;
    }

    abrirLoading("Salvando perfil...");
    const dadosAtualizados = {
        apelido: apelidoInput.value.trim(),
        telefone: telefoneInput.value.trim(),
        foto_perfil: fotoBase64,
        cor_banner: corBannerAtual,
    };

    try {
        const resposta = await fetch(`${SUPABASE_URL}/rest/v1/usuarios?id=eq.${usuarioId}`, {
            method: "PATCH",
            headers: {
                "apikey": SUPABASE_KEY,
                "Authorization": `Bearer ${SUPABASE_KEY}`,
                "Content-Type": "application/json",
                "Prefer": "return=representation"
            },
            body: JSON.stringify(dadosAtualizados)
        });

        if (!resposta.ok) throw new Error();

// Atualiza estado local após sucesso
window.dadosOriginais = { ...dadosAtualizados };
atualizarNomePerfil(nomeInput.value, dadosAtualizados.apelido);

mostrarSucesso("Perfil atualizado!");

setTimeout(() => {

    window.location.replace(
        "./home.html"
    );

}, 1500);

    } catch (erro) {
        mostrarErro("Erro ao salvar perfil.");
        setTimeout(() => loadingScreen.classList.remove("active"), 2000);
    }
});

// Lógica de Modais e Navegação
btnEscolherBanner?.addEventListener("click", () => modalBanner.classList.add("active"));
fecharModalBanner?.addEventListener("click", () => modalBanner.classList.remove("active"));

document.querySelectorAll(".banner-card").forEach(opcao => {
    opcao.addEventListener("click", () => {
        corBannerAtual = opcao.dataset.banner;
        perfilBanner.className = `perfil-banner ${corBannerAtual}`;
        localStorage.setItem("corBanner", corBannerAtual);
        modalBanner.classList.remove("active");
    }); 
});

// ==========================
// BOTÃO VOLTAR
// ==========================

btnVoltar?.addEventListener("click", () => {

    if (window.history.length > 1) {

        window.history.back();

    } else {

        window.location.href =
        "./home.html";

    }

});
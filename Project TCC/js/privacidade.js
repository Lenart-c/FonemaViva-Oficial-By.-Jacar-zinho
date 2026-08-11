/**
 * =========================================================
 * PRIVACIDADE / SEGURANÇA
 * FonemaViva
 *
 * Alteração:
 * - Email
 * - Telefone
 * - Senha
 *
 * Banco:
 * Supabase REST API
 * Tabela: usuarios
 * =========================================================
 */


// ==============================
// CONFIGURAÇÃO SUPABASE
// ==============================


const SUPABASE_URL =
"https://mnfryxvtogpiwacpyhgo.supabase.co";


const SUPABASE_KEY =
"sb_publishable_YYMfDfWKaer8F1IEOFVOMQ_acS2xa2G";



// ==============================
// ELEMENTOS
// ==============================


const emailInput =
document.getElementById("novoEmail");

const telefoneInput =
document.getElementById("novoTelefone");


const senhaAtualInput =
document.getElementById("senhaAtual");


const novaSenhaInput =
document.getElementById("novaSenha");


const confirmarSenhaInput =
document.getElementById("confirmarSenha");


const form =
document.getElementById("formPrivacidade");



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



// ==============================
// SESSÃO
// ==============================


const usuarioId = Number(
localStorage.getItem("usuarioId") ||
sessionStorage.getItem("usuarioId")
);



function verificarSessao(){


const id =
localStorage.getItem("usuarioId") ||
sessionStorage.getItem("usuarioId");


if(!id){

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




// ==============================
// LOADING
// ==============================


function abrirLoading(texto){


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
texto;


}




function sucesso(texto){


loader.style.display =
"none";


successIcon.style.display =
"flex";


statusText.textContent =
texto;


}



function erro(texto, icone = "!"){

    loader.style.display = "none";

    successIcon.style.display = "none";

    errorIcon.style.display = "flex";

    errorIcon.textContent = icone;

    statusText.textContent = texto;

}


// ==============================
// CARREGAR USUÁRIO
// ==============================


let dadosOriginais = {};


async function carregarPrivacidade(){

try{

console.log("ID do usuário:", usuarioId);

const resposta =
await fetch(

`${SUPABASE_URL}/rest/v1/usuarios?id=eq.${usuarioId}`,

{

method:"GET",

headers:{

"apikey":SUPABASE_KEY,

"Authorization":
`Bearer ${SUPABASE_KEY}`,

"Content-Type":
"application/json"

}

}

);

console.log("Status:", resposta.status);
console.log("Status Text:", resposta.statusText);

if(!resposta.ok)
throw new Error();

const dados =
await resposta.json();

console.log("Dados recebidos:", dados);


if(!dados.length){

alert(
"Usuário não encontrado."
);

return;

}



const usuario = dados[0];

console.log(usuario);

console.log("Email:", usuario.email);
console.log("Telefone:", usuario.telefone);
console.log("Senha:", usuario.senha);

console.log("emailInput:", emailInput);
console.log("telefoneInput:", telefoneInput);



emailInput.value =
usuario.email || "";


telefoneInput.value =
usuario.telefone || "";



dadosOriginais = {

email: usuario.email || "",

telefone: usuario.telefone || "",

senha: usuario.senha || ""

};

// Fecha o loading inicial
document
.getElementById("loadingInicial")
.classList.remove("active");

}

catch(e){

console.error("Erro:", e);

// Fecha o loading caso aconteça erro
document
.getElementById("loadingInicial")
.classList.remove("active");

alert("Erro: " + e.message);

}

}
carregarPrivacidade();

// ==============================
// SALVAR ALTERAÇÕES
// ==============================


form?.addEventListener(
"submit",
async(e)=>{


e.preventDefault();



const senhaAtual =
senhaAtualInput.value.trim();



const novaSenha =
novaSenhaInput.value.trim();



const confirmarSenha =
confirmarSenhaInput.value.trim();





// verificar senha atual


if(
senhaAtual &&
senhaAtual !== dadosOriginais.senha
){


abrirLoading(
"Verificando senha..."
);


erro(
"Senha atual incorreta."
);


setTimeout(()=>{

loadingScreen.classList.remove(
"active"
);

},2000);


return;

}




// verificar confirmação


if(
novaSenha &&
novaSenha !== confirmarSenha
){


abrirLoading(
"Validando senha..."
);


erro(
"As senhas não coincidem."
);



setTimeout(()=>{

loadingScreen.classList.remove(
"active"
);

},2000);



return;


}




// senha mínima


if(
novaSenha &&
novaSenha.length < 6
){


abrirLoading(
"Validando senha..."
);


erro(
"A senha deve ter pelo menos 6 caracteres."
);



setTimeout(()=>{

loadingScreen.classList.remove(
"active"
);

},2000);



return;

}

const emailNovo =
emailInput.value.trim();

const telefoneNovo =
telefoneInput.value.trim();

const senhaAlterada =
novaSenha !== "";

const nadaAlterado =

emailNovo === dadosOriginais.email &&

telefoneNovo === dadosOriginais.telefone &&

!senhaAlterada;

if(nadaAlterado){

    abrirLoading("Verificando alterações...");

setTimeout(()=>{

    erro("Nenhuma alteração foi realizada.");

},300);

setTimeout(()=>{

    loadingScreen.classList.remove("active");

},2000);

return;

}


const atualizacao={

email:
emailNovo,

telefone:
telefoneNovo

};


// somente altera senha se digitada


if(novaSenha){

atualizacao.senha =
novaSenha;

}




abrirLoading(
"Salvando alterações..."
);




try{


const resposta =
await fetch(

`${SUPABASE_URL}/rest/v1/usuarios?id=eq.${usuarioId}`,

{

method:"PATCH",

headers:{

"apikey":SUPABASE_KEY,

"Authorization":
`Bearer ${SUPABASE_KEY}`,

"Content-Type":
"application/json",

"Prefer":
"return=representation"

},


body:
JSON.stringify(atualizacao)


}

);



if(!resposta.ok)
throw new Error();




sucesso(
"Dados atualizados!"
);



setTimeout(()=>{


window.location.replace(
"./home.html"
);


},1500);



}

catch(e){


console.error(e);


erro(
"Erro ao atualizar dados."
);



setTimeout(()=>{


loadingScreen.classList.remove(
"active"
);


},2000);



}



});





// ==============================
// BOTÃO VOLTAR
// ==============================


btnVoltar?.addEventListener(
"click",
()=>{


if(
window.history.length > 1
){

window.history.back();


}

else{


window.location.href =
"./home.html";


}


});
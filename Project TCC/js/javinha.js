const form = document.getElementById("formCadastro");
const telefoneInput = document.getElementById("telefone");
const lembrarCheckbox = document.getElementById("lembrar");
const emailInput = document.getElementById("email");

//Essa porra aqui: "/\D/"" remove tudo que é texto. Usei o "g" (/\D/g) porque ele engloba
//e remove tudo que encontrar de letra.

// "^" começo de string
// (\d{2}) Ele pega os 2 primeiros números do que usamos como (DDD), ou sejá, (19)
// Desgraça de código. Tenho que arrumar.
//Lembrete pessoal. Pedir ajuda do Kaynan com essa parte.

telefoneInput.addEventListener("input", function (e) {
    let valor = e.target.value;

    valor = valor.replace(/\D/g, "");
    valor = valor.replace(/^(\d{2})(\d)/g, "($1) $2"); // (1$) = (19)
    valor = valor.replace(/(\d{5})(\d)/, "$1-$2");  // (\d{5}) Vai pegar os 5 primeiros números do usúario(De telefone)
    valor = valor.substring(0, 15); // Ele vai limitar o texto até 15 caracteres no máximo
    e.target.value = valor; //De uma maneira porca e errada, ele vai dar um print, ou sejá, ele vai atualizar o
    //campo com a formatação correta.
});


//merda de Script.
//DICIONÁRIO SCRIPT:
//Pog (Deu bom)
//Clovis (Essa merda de vírgula/ponto)
//Ex (Me faz sofrer iguazinho minha ex namorada)
//Baino (Vou dormir e deixar pra fazer isso depois)
//Coringão /da massa (Se for só coringão vou me tacar da janela. Se for da massa ta tranquilo "POR ENQUANTO")
//67 (O pedro ou o enrico vai morrer)
//--- (Pânico em massa)
// XXX (Ou eu faço uma bomba Núclear, ou viro um técnico da Tim)
// ... (...)






window.addEventListener("load", function () {           //Ele Inicia quando a página carrega
    const emailSalvo = localStorage.getItem("email");   //Vai pegar o email salvo no navegador

    if (emailSalvo) {                                   //Se tiver algum email salvo no navegador
        emailInput.value = emailSalvo;                  //Como eu falei, se tiver email salvo no navegador, ele vai preencher automaticamente
    }
});


form.addEventListener("submit", function(e) {
    e.preventDefault();                                 //O "e.preventDefault" vai evitar que o form recarregue a página

    const senha = document.getElementById("senha").value; 
    //Clovis do carai viu
    const confirmarSenha = document.getElementById("confirmarSenha").value;
    //Esses dois códigos pegam a senha

    //Que validação de merda pqpppppppppppppp. nem precisava.
    if (senha.length !== 8) {                            //Vai limitar os caractéries permitindo somente 8, (Igual o maxlength ou o minlength do HTML)
        alert("A senha deve ter exatamente 8 caracteres!"); // Se colocar menos de 8 caractéries ele manda um aviso
        return;
    }

    
    if (senha !== confirmarSenha) {                      //Depois que o usúario digitar a senha, isso vai fazer com que a confirmação e a senha tenham que ser iguais.
        alert("A senha não está correta!");              //Se elas não forem iguais, vai mostrar um alerta de erro     //EX - Nota oficial essa porra de alerta não muda por nada.    //Nota pessoal, Ajuda nóis ai kaynan
        return;
    }


    if (lembrarCheckbox.checked) {                       //Quando ativo, ele vai salvar a conta
        localStorage.setItem("email", emailInput.value); //Ele guarda o cadastro de cada usúario no navegador.
    } else {
        localStorage.removeItem("email");                //Se o usúario não marcar pra lembrar, ele simplesmente não vai salvar
    }

    
   alert("Cadastro realizado com sucesso!");            //Pog de mais


window.location.href = "http://127.0.0.1:5500/index.html"; //Após as verificações que o lenart vai fazer no SupaBase a proxima pagina carregada vai ser a do home
});


function toggleSenha(id, elemento) {                   // 67676767676767676767676767
    const input = document.getElementById(id);

    if (input.type === "password") {                   //Isso aqui é pra esconder e proteger a senha
        input.type = "text";                           //No caso desse, ele vai mostrar a senha
        elemento.textContent = "visibility_off";       //vai trocar o icone do olho para o olho fechado
    } else {
        input.type = "password";                       //Ele vai esconder DNOVO
        elemento.textContent = "visibility";           //Olho aberto
    }
}


// •Fontes                   - https://pt.stackoverflow.com/questions/189187/express%C3%A3o-regular-em-javascript-para-telefone-com-ddi
//                           - https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide/Regular_expressions
//                           - https://www.w3schools.com/jsref/jsref_regexp_digit_non.asp









//Isso aqui é pra esconder e proteger a senha
//No caso desse, ele vai mostrar a senha
//vai trocar o icone do olho para o olho fechado
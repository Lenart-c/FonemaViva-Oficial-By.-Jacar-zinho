const desafios = [
  {
    frase: 'Bia bate bola na varanda.',
    palavrasChave: ['bia', 'bate', 'bola', 'varanda']
  },
  {
    frase: 'Pipo põe pipoca na panela.',
    palavrasChave: ['pipo', 'pipoca', 'panela']
  },
  {
    frase: 'O tatu Tobias toca tambor.',
    palavrasChave: ['tatu', 'tobias', 'toca', 'tambor']
  },
  {
    frase: 'Três tigres tristes trituram trufas.',
    palavrasChave: ['tres', 'tigres', 'tristes', 'trituram', 'trufas']
  },
  {
    frase: 'Priscila prepara pratos pretos para o príncipe.',
    palavrasChave: ['priscila', 'prepara', 'pratos', 'pretos', 'principe']
  },
  {
    frase: 'O dragão Dário dança dentro da doceria dourada.',
    palavrasChave: ['dragao', 'dario', 'danca', 'doceria', 'dourada']
  }
];

const TOTAL_BATIDAS = 4;
const INTERVALO_MINIMO_MS = 180;
const INTERVALO_MAXIMO_MS = 2000;
const CHAVE_PROGRESSO = 'lingua-maluca';
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

let index = 0;
let concluidos = new Array(desafios.length).fill(false);
let reconhecimentoAtivo = false;
let falaConcluida = false;
let batidasConcluidas = false;
let totalBatidas = 0;
let horarioUltimaBatida = 0;
let reconhecimento = null;

const elNivel = document.getElementById('nivel');
const elFrase = document.getElementById('frase');
const elInstrucao = document.getElementById('instrucao');
const elResultado = document.getElementById('resultado');
const elFeedback = document.getElementById('feedback');
const elVozAjuda = document.getElementById('voz-ajuda');
const elBatidasTexto = document.getElementById('batidas-texto');
const elBatidaContagem = document.getElementById('batida-contagem');
const btnOuvir = document.getElementById('btn-ouvir');
const btnFalar = document.getElementById('btn-falar');
const btnConfirmarFala = document.getElementById('btn-confirmar-fala');
const btnBatida = document.getElementById('btn-batida');
const btnReiniciarBatidas = document.getElementById('btn-reiniciar-batidas');
const btnProximo = document.getElementById('btn-proximo');
const btnReiniciar = document.getElementById('btn-reiniciar');
const elProgresso = document.getElementById('progresso');
const elProgressoTexto = document.getElementById('progresso-texto');
const elProgressoBarra = document.querySelector('.progress-bar');

const elementosObrigatorios = [
  elNivel,
  elFrase,
  elInstrucao,
  elResultado,
  elFeedback,
  elVozAjuda,
  elBatidasTexto,
  elBatidaContagem,
  btnOuvir,
  btnFalar,
  btnConfirmarFala,
  btnBatida,
  btnReiniciarBatidas,
  btnProximo,
  btnReiniciar,
  elProgresso,
  elProgressoTexto,
  elProgressoBarra
];

if (elementosObrigatorios.some((elemento) => !elemento)) {
  throw new Error('Não foi possível carregar todos os elementos do desafio Língua Maluca.');
}

function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function mostrarFeedback(texto, tipo = 'info') {
  elFeedback.textContent = texto;
  elFeedback.className = `feedback ${tipo}`;
}

function atualizarProgresso() {
  const concluidosCount = concluidos.filter(Boolean).length;
  const porcentagem = Math.round((concluidosCount / desafios.length) * 100);
  elProgresso.style.width = `${porcentagem}%`;
  elProgressoTexto.textContent = `${concluidosCount} de ${desafios.length}`;
  elProgressoBarra.setAttribute('aria-valuenow', String(concluidosCount));
}

function salvarProgresso() {
  try {
    localStorage.setItem(CHAVE_PROGRESSO, JSON.stringify({ index, concluidos }));
  } catch (erro) {
    console.error('Não foi possível salvar o progresso de Língua Maluca:', erro);
    mostrarFeedback('O progresso não pôde ser salvo neste navegador.', 'error');
  }
}

function carregarProgresso() {
  try {
    const salvo = localStorage.getItem(CHAVE_PROGRESSO);
    if (!salvo) return;

    const dados = JSON.parse(salvo);
    if (!dados || !Array.isArray(dados.concluidos)) return;

    concluidos = desafios.map((_, desafioIndex) => dados.concluidos[desafioIndex] === true);
    const indiceSalvo = Number(dados.index);
    if (Number.isInteger(indiceSalvo) && indiceSalvo >= 0 && indiceSalvo < desafios.length) {
      index = indiceSalvo;
    }
  } catch (erro) {
    console.error('Não foi possível carregar o progresso de Língua Maluca:', erro);
    mostrarFeedback('Não foi possível carregar o progresso salvo. Você pode começar novamente.', 'error');
  }
}

function atualizarBotaoProximo() {
  const tentativaConcluida = falaConcluida && batidasConcluidas;
  btnProximo.disabled = !tentativaConcluida;
}

function reiniciarTentativa() {
  falaConcluida = false;
  batidasConcluidas = false;
  totalBatidas = 0;
  horarioUltimaBatida = 0;
  btnBatida.disabled = true;
  btnBatida.classList.remove('complete');
  btnReiniciarBatidas.hidden = true;
  elBatidaContagem.textContent = `Toque ${TOTAL_BATIDAS} vezes`;
  elBatidasTexto.textContent = 'Fale a frase para liberar as batidas.';
  atualizarBotaoProximo();
}

function renderizarDesafio() {
  atualizarProgresso();

  if (concluidos.every(Boolean)) {
    elNivel.textContent = 'Desafio completo';
    elFrase.textContent = 'Você venceu a Língua Maluca!';
    elInstrucao.textContent = 'Você falou as frases e marcou o ritmo. Quer brincar mais uma vez?';
    elResultado.textContent = 'Todos os desafios concluídos.';
    elBatidasTexto.textContent = 'Parabéns pelo esforço!';
    elBatidaContagem.textContent = 'Desafio completo';
    btnOuvir.disabled = true;
    btnFalar.disabled = true;
    btnConfirmarFala.hidden = true;
    btnBatida.disabled = true;
    btnReiniciarBatidas.hidden = true;
    btnProximo.disabled = true;
    btnProximo.textContent = 'Tudo concluído!';
    mostrarFeedback('Muito bem! Cada pessoa aprende e fala no seu próprio ritmo.', 'success');
    return;
  }

  const desafio = desafios[index];
  elNivel.textContent = `Desafio ${index + 1} de ${desafios.length}`;
  elFrase.textContent = desafio.frase;
  elInstrucao.textContent = 'Fale a frase com calma. Depois, marque quatro batidas regulares no ritmo das palavras.';
  elResultado.textContent = '...';
  elVozAjuda.textContent = SpeechRecognition
    ? 'A fala é analisada pelo reconhecimento de voz do navegador.'
    : 'O reconhecimento de voz não está disponível; você pode avaliar a fala e marcar quando terminar.';
  btnOuvir.disabled = false;
  btnFalar.disabled = !SpeechRecognition;
  btnConfirmarFala.hidden = Boolean(SpeechRecognition);
  btnBatida.disabled = true;
  btnProximo.textContent = 'Próximo desafio';
  btnProximo.disabled = true;
  reiniciarTentativa();
  mostrarFeedback('');
  atualizarProgresso();
}

function avaliarFala(texto) {
  const palavrasFaladas = new Set(normalizar(texto).split(' '));
  const palavrasReconhecidas = desafios[index].palavrasChave
    .filter((palavra) => palavrasFaladas.has(normalizar(palavra))).length;
  const minimo = Math.ceil(desafios[index].palavrasChave.length * 0.65);
  return palavrasReconhecidas >= minimo;
}

function concluirFala(texto, autoavaliada = false) {
  falaConcluida = true;
  elResultado.textContent = texto || 'Frase repetida.';
  btnBatida.disabled = false;
  elBatidasTexto.textContent = 'Enquanto repete a frase, toque quatro vezes em um ritmo confortável.';
  mostrarFeedback(
    autoavaliada
      ? 'Fala marcada por autoavaliação. Agora pratique as batidas.'
      : 'Boa tentativa! Agora pratique as batidas no ritmo da frase.',
    'success'
  );
  atualizarBotaoProximo();
}

function reproduzirExemplo() {
  if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
    mostrarFeedback('A voz de exemplo não está disponível neste navegador. Leia a frase em voz alta.', 'error');
    return;
  }

  window.speechSynthesis.cancel();
  const exemplo = new SpeechSynthesisUtterance(desafios[index].frase);
  exemplo.lang = 'pt-BR';
  exemplo.rate = 0.8;
  exemplo.pitch = 1.15;
  window.speechSynthesis.speak(exemplo);
  mostrarFeedback('Ouça o exemplo e repita a frase com calma.');
}

function iniciarReconhecimento() {
  if (reconhecimentoAtivo || !reconhecimento) return;
  reiniciarTentativa();
  elResultado.textContent = 'Ouvindo...';
  mostrarFeedback('Fale a frase inteira, sem pressa.');

  try {
    reconhecimento.start();
  } catch (erro) {
    console.error('Não foi possível iniciar o reconhecimento de voz:', erro);
    elResultado.textContent = 'Microfone não iniciado.';
    mostrarFeedback('Não foi possível iniciar o microfone. Verifique as permissões e tente novamente.', 'error');
  }
}

function marcarBatida() {
  const agora = performance.now();

  if (horarioUltimaBatida) {
    const intervalo = agora - horarioUltimaBatida;
    if (intervalo < INTERVALO_MINIMO_MS) {
      mostrarFeedback('Espere um pouquinho entre cada batida.', 'info');
      return;
    }
    if (intervalo > INTERVALO_MAXIMO_MS) {
      totalBatidas = 0;
      mostrarFeedback('Vamos recomeçar as batidas e manter um ritmo tranquilo.', 'info');
    }
  }

  horarioUltimaBatida = agora;
  totalBatidas++;

  if (totalBatidas >= TOTAL_BATIDAS) {
    totalBatidas = TOTAL_BATIDAS;
    batidasConcluidas = true;
    btnBatida.disabled = true;
    btnBatida.classList.add('complete');
    btnReiniciarBatidas.hidden = true;
    elBatidaContagem.textContent = 'Ritmo concluído!';
    elBatidasTexto.textContent = 'Quatro batidas no ritmo. Muito bem!';
    mostrarFeedback('Fala e ritmo concluídos! Pode avançar.', 'success');
    atualizarBotaoProximo();
    return;
  }

  btnBatida.classList.add('tapped');
  window.setTimeout(() => btnBatida.classList.remove('tapped'), 160);
  elBatidaContagem.textContent = `Mais ${TOTAL_BATIDAS - totalBatidas} batida${TOTAL_BATIDAS - totalBatidas === 1 ? '' : 's'}`;
  btnReiniciarBatidas.hidden = false;
}

function reiniciarExercicio() {
  if (reconhecimentoAtivo && reconhecimento) reconhecimento.abort();
  window.speechSynthesis?.cancel();
  index = 0;
  concluidos = new Array(desafios.length).fill(false);
  try {
    localStorage.removeItem(CHAVE_PROGRESSO);
  } catch (erro) {
    console.error('Não foi possível limpar o progresso de Língua Maluca:', erro);
    mostrarFeedback('O progresso salvo não pôde ser apagado.', 'error');
  }
  renderizarDesafio();
  mostrarFeedback('Vamos começar de novo. Fale com calma e divirta-se!');
}

btnOuvir.addEventListener('click', reproduzirExemplo);
btnFalar.addEventListener('click', iniciarReconhecimento);
btnConfirmarFala.addEventListener('click', () => concluirFala('Fala marcada por você.', true));
btnBatida.addEventListener('click', marcarBatida);
btnReiniciarBatidas.addEventListener('click', () => {
  totalBatidas = 0;
  horarioUltimaBatida = 0;
  batidasConcluidas = false;
  btnBatida.disabled = false;
  btnBatida.classList.remove('complete');
  btnReiniciarBatidas.hidden = true;
  elBatidaContagem.textContent = `Toque ${TOTAL_BATIDAS} vezes`;
  elBatidasTexto.textContent = 'Tente novamente, com batidas regulares.';
  atualizarBotaoProximo();
});

btnProximo.addEventListener('click', () => {
  if (btnProximo.disabled) return;
  concluidos[index] = true;

  if (index < desafios.length - 1) {
    index++;
  }

  salvarProgresso();
  renderizarDesafio();
});

btnReiniciar.addEventListener('click', reiniciarExercicio);

if (SpeechRecognition) {
  reconhecimento = new SpeechRecognition();
  reconhecimento.lang = 'pt-BR';
  reconhecimento.continuous = false;
  reconhecimento.interimResults = false;
  reconhecimento.maxAlternatives = 1;

  reconhecimento.onstart = () => {
    reconhecimentoAtivo = true;
    btnFalar.disabled = true;
    btnFalar.innerHTML = '<i class="fa-solid fa-ear-listen" aria-hidden="true"></i> Ouvindo...';
  };

  reconhecimento.onresult = (evento) => {
    const texto = Array.from(evento.results)
      .map((resultado) => resultado[0].transcript)
      .join(' ');

    elResultado.textContent = texto.trim() || 'Não reconheci a frase.';
    if (avaliarFala(texto)) {
      concluirFala(texto.trim());
    } else {
      falaConcluida = false;
      btnBatida.disabled = true;
      elBatidasTexto.textContent = 'Repita a frase para liberar as batidas.';
      mostrarFeedback('Não reconheci palavras suficientes desta vez. Tente novamente, sem pressa.', 'info');
      atualizarBotaoProximo();
    }
  };

  reconhecimento.onerror = (evento) => {
    if (evento.error === 'aborted') return;

    console.error('Erro no reconhecimento de voz:', evento.error);
    btnConfirmarFala.hidden = false;
    elVozAjuda.textContent = 'O reconhecimento de voz falhou. Você pode tentar novamente ou marcar a fala por autoavaliação.';
    mostrarFeedback('Não foi possível reconhecer a fala. Verifique a permissão do microfone e tente novamente.', 'error');
  };

  reconhecimento.onend = () => {
    reconhecimentoAtivo = false;
    btnFalar.disabled = false;
    btnFalar.innerHTML = '<i class="fa-solid fa-microphone" aria-hidden="true"></i> Falar frase';
  };
}

carregarProgresso();
renderizarDesafio();

const totalEtapas = 8;
const tamanhosSequencia = [3, 3, 4, 4, 5, 5, 6, 6];
const velocidades = [0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4, 1.5];
const bancoPalavras = [
  'casa',
  'ponte',
  'chave',
  'janela',
  'livro',
  'praia',
  'nuvem',
  'relógio',
  'jardim',
  'cidade',
  'folha',
  'estrada',
  'telefone',
  'montanha',
  'caderno',
  'sapato',
];

let etapaAtual = 0;
let acertosPrimeiraTentativa = 0;
let tentativas = 0;
let desafio;
let reproduzindo = false;
let avisoArmazenamento = false;
let opcoesTentadas = new Set();

const elProgresso = document.getElementById('progresso');
const elTrilhaProgresso = document.getElementById('progress-track');
const elTextoProgresso = document.getElementById('progress-text');
const elEtapa = document.getElementById('round-label');
const elVelocidade = document.getElementById('speed-label');
const elOpcoes = document.getElementById('choices');
const elAreaOpcoes = document.getElementById('choices-area');
const elFeedback = document.getElementById('feedback');
const elExercicio = document.querySelector('.exercise-card');
const elConclusao = document.getElementById('completion-card');
const elNotaFinal = document.getElementById('final-score');
const btnOuvir = document.getElementById('listen-button');
const btnRepetir = document.getElementById('replay-button');
const btnProxima = document.getElementById('next-button');
const btnRecomecar = document.getElementById('restart-button');

function criarSequencia(tamanho) {
  const palavras = [];

  while (palavras.length < tamanho) {
    const palavra = bancoPalavras[Math.floor(Math.random() * bancoPalavras.length)];
    if (palavras[palavras.length - 1] !== palavra) {
      palavras.push(palavra);
    }
  }

  return palavras;
}

function chaveSequencia(sequencia) {
  return sequencia.join('|');
}

function embaralhar(itens) {
  const resultado = [...itens];

  for (let indice = resultado.length - 1; indice > 0; indice--) {
    const aleatorio = Math.floor(Math.random() * (indice + 1));
    [resultado[indice], resultado[aleatorio]] = [resultado[aleatorio], resultado[indice]];
  }

  return resultado;
}

function gerarDesafio() {
  const sequenciaAlvo = criarSequencia(tamanhosSequencia[etapaAtual]);
  const opcoes = [sequenciaAlvo];
  const chaves = new Set([chaveSequencia(sequenciaAlvo)]);

  while (opcoes.length < 4) {
    const opcao = criarSequencia(sequenciaAlvo.length);
    const chave = chaveSequencia(opcao);

    if (!chaves.has(chave)) {
      chaves.add(chave);
      opcoes.push(opcao);
    }
  }

  return {
    sequenciaAlvo,
    opcoes: embaralhar(opcoes),
  };
}

function atualizarProgresso(etapasConcluidas) {
  const porcentagem = Math.round((etapasConcluidas / totalEtapas) * 100);
  elProgresso.style.width = `${porcentagem}%`;
  elTextoProgresso.textContent = `${etapasConcluidas} de ${totalEtapas} etapas`;
  elTrilhaProgresso.setAttribute('aria-valuenow', String(etapasConcluidas));

  try {
    localStorage.setItem('desafio-auditivo-progress', String(porcentagem));
  } catch (erro) {
    avisoArmazenamento = true;
    console.error('Não foi possível salvar o progresso do desafio auditivo:', erro);
  }
}

function definirFeedback(mensagem, tipo = '') {
  elFeedback.textContent = avisoArmazenamento
    ? `${mensagem} O progresso não pôde ser salvo neste navegador.`
    : mensagem;
  elFeedback.className = `feedback${tipo ? ` ${tipo}` : ''}`;
}

function atualizarEtapa() {
  desafio = gerarDesafio();
  tentativas = 0;
  opcoesTentadas = new Set();
  elEtapa.textContent = `ETAPA ${etapaAtual + 1} DE ${totalEtapas}`;
  elVelocidade.textContent = `${velocidades[etapaAtual].toFixed(1).replace('.', ',')}x`;
  elAreaOpcoes.hidden = true;
  elOpcoes.replaceChildren();
  btnOuvir.disabled = false;
  btnOuvir.querySelector('span').textContent = 'Ouvir palavras';
  btnRepetir.disabled = true;
  btnProxima.disabled = true;
  definirFeedback('Quando estiver pronto, escute a sequência de palavras.');
}

function textoDaSequencia(sequencia) {
  return sequencia.join(' · ');
}

function mostrarOpcoes() {
  elOpcoes.replaceChildren();

  desafio.opcoes.forEach((sequencia) => {
    const botao = document.createElement('button');
    botao.type = 'button';
    botao.className = 'choice-button';
    botao.textContent = textoDaSequencia(sequencia);
    botao.setAttribute('aria-label', `Sequência: ${sequencia.join(', ')}`);
    botao.dataset.sequence = chaveSequencia(sequencia);
    botao.addEventListener('click', () => selecionarOpcao(botao));
    elOpcoes.appendChild(botao);
  });

  elAreaOpcoes.hidden = false;
}

function falarSequencia() {
  if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
    throw new Error('A leitura de palavras em voz alta não é compatível com este navegador. Tente usar outro navegador atualizado.');
  }

  window.speechSynthesis.cancel();
  const fala = new SpeechSynthesisUtterance(desafio.sequenciaAlvo.join(', '));
  fala.lang = 'pt-BR';
  fala.rate = velocidades[etapaAtual];
  fala.pitch = 1;
  fala.volume = 1;

  return new Promise((resolve, reject) => {
    fala.onend = resolve;
    fala.onerror = (evento) => {
      if (evento.error === 'canceled' || evento.error === 'interrupted') {
        resolve();
        return;
      }
      reject(new Error('Não foi possível reproduzir as palavras. Verifique o áudio do dispositivo e tente novamente.'));
    };
    window.speechSynthesis.speak(fala);
  });
}

async function reproduzirEstimulos() {
  if (reproduzindo) {
    return;
  }

  reproduzindo = true;
  btnOuvir.disabled = true;
  btnRepetir.disabled = true;
  document.querySelectorAll('.choice-button').forEach((botao) => {
    botao.disabled = true;
  });
  definirFeedback('Escute atentamente a sequência de palavras.');

  try {
    await falarSequencia();

    if (tentativas === 0) {
      mostrarOpcoes();
    }

    document.querySelectorAll('.choice-button').forEach((botao) => {
      botao.disabled = opcoesTentadas.has(botao.dataset.sequence);
    });
    btnOuvir.disabled = true;
    btnRepetir.disabled = false;
    definirFeedback('Agora escolha as palavras na mesma ordem em que ouviu.');
  } catch (erro) {
    console.error('Falha ao reproduzir a sequência de palavras:', erro);
    definirFeedback(erro instanceof Error ? erro.message : 'Não foi possível reproduzir as palavras. Verifique o áudio e tente novamente.', 'error');
    document.querySelectorAll('.choice-button').forEach((botao) => {
      botao.disabled = opcoesTentadas.has(botao.dataset.sequence);
    });
    btnOuvir.disabled = false;
    btnRepetir.disabled = !elAreaOpcoes.hidden;
  } finally {
    reproduzindo = false;
  }
}

function selecionarOpcao(botaoSelecionado) {
  const respostaCorreta = chaveSequencia(desafio.sequenciaAlvo);
  const acertou = botaoSelecionado.dataset.sequence === respostaCorreta;
  tentativas++;

  if (acertou) {
    if (tentativas === 1) {
      acertosPrimeiraTentativa++;
    }

    document.querySelectorAll('.choice-button').forEach((botao) => {
      botao.disabled = true;
      if (botao.dataset.sequence === respostaCorreta) {
        botao.classList.add('correct');
      }
    });

    atualizarProgresso(etapaAtual + 1);
    definirFeedback(
      tentativas === 1
        ? 'Correto! Você identificou a sequência de palavras.'
        : 'Isso mesmo! Você encontrou a sequência correta.',
      'success',
    );
    btnRepetir.disabled = true;
    btnProxima.disabled = false;
    return;
  }

  opcoesTentadas.add(botaoSelecionado.dataset.sequence);
  botaoSelecionado.disabled = true;
  botaoSelecionado.classList.add('incorrect');
  definirFeedback('Essa não é a ordem correta. Ouça novamente e tente outra opção.', 'error');
}

function concluirDesafio() {
  const porcentagem = Math.round((acertosPrimeiraTentativa / totalEtapas) * 100);
  elNotaFinal.textContent = `Você acertou ${acertosPrimeiraTentativa} de ${totalEtapas} etapas na primeira tentativa (${porcentagem}%).`;
  elExercicio.hidden = true;
  elConclusao.hidden = false;
}

function avancarEtapa() {
  etapaAtual++;

  if (etapaAtual === totalEtapas) {
    concluirDesafio();
    return;
  }

  atualizarEtapa();
}

function reiniciarDesafio() {
  etapaAtual = 0;
  acertosPrimeiraTentativa = 0;
  avisoArmazenamento = false;
  atualizarProgresso(0);
  elConclusao.hidden = true;
  elExercicio.hidden = false;
  atualizarEtapa();
}

btnOuvir.addEventListener('click', reproduzirEstimulos);
btnRepetir.addEventListener('click', reproduzirEstimulos);
btnProxima.addEventListener('click', avancarEtapa);
btnRecomecar.addEventListener('click', reiniciarDesafio);

atualizarProgresso(0);
atualizarEtapa();

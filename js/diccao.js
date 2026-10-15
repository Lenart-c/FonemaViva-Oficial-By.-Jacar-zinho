const exercicios = [
  {
    nivel: 'Nível 1 · Palavras',
    foco: 'Comece por uma palavra com encontro consonantal.',
    alvo: 'Problema',
    dica: 'Diga “pro-ble-ma” devagar. Repita três vezes, fazendo uma pausa entre cada tentativa.',
  },
  {
    nivel: 'Nível 1 · Palavras',
    foco: 'Pratique o encontro de P e R no início da palavra.',
    alvo: 'Próprio',
    dica: 'Comece pelo som “pr”. Articule o final com calma: “pró-pri-o”.',
  },
  {
    nivel: 'Nível 1 · Palavras',
    foco: 'Passe por quatro sílabas sem apressar o final.',
    alvo: 'Extraordinário',
    dica: 'Separe em partes: “ex-tra-or-di-ná-rio”. Faça uma pausa curta se precisar.',
  },
  {
    nivel: 'Nível 2 · Palavras',
    foco: 'Enfrente um encontro consonantal no meio da palavra.',
    alvo: 'Infraestrutura',
    dica: 'Pratique em blocos: “in-fra-es-tru-tu-ra”. Mantenha cada sílaba clara.',
  },
  {
    nivel: 'Nível 2 · Palavras',
    foco: 'Treine uma palavra longa, mantendo o ritmo até o fim.',
    alvo: 'Paralelepípedo',
    dica: 'Divida em partes: “pa-ra-le-le-pí-pe-do”. Não precisa falar rápido.',
  },
  {
    nivel: 'Nível 2 · Palavras',
    foco: 'Pratique encontros consonantais e a sequência de sílabas.',
    alvo: 'Característica',
    dica: 'Experimente “ca-rac-te-rís-ti-ca”. Dê atenção ao “r” e ao “ct”.',
  },
  {
    nivel: 'Nível 2 · Palavras',
    foco: 'Treine uma palavra comprida com sons próximos.',
    alvo: 'Imprescindível',
    dica: 'Separe em “im-pres-cin-dí-vel”. Articule o “s” sem prender a respiração.',
  },
  {
    nivel: 'Nível 2 · Palavras',
    foco: 'Mantenha a clareza em uma palavra longa com sons de S e Z.',
    alvo: 'Desestabilização',
    dica: 'Pratique por partes: “de-ses-ta-bi-li-za-ção”. Evite acelerar no meio.',
  },
  {
    nivel: 'Nível 3 · Frases',
    foco: 'Leve a palavra difícil para uma frase curta.',
    alvo: 'A infraestrutura precisa de melhorias.',
    dica: 'Diga em dois trechos: “A infraestrutura” / “precisa de melhorias”.',
  },
  {
    nivel: 'Nível 3 · Frases',
    foco: 'Pratique sons de R e encontros consonantais em sequência.',
    alvo: 'O próprio pesquisador preparou o relatório.',
    dica: 'Faça uma pausa depois de “pesquisador”. Mantenha um ritmo confortável.',
  },
  {
    nivel: 'Nível 3 · Desafio',
    foco: 'Agora, combine palavras com encontros consonantais variados.',
    alvo: 'Três pratos de trigo para três tigres tristes.',
    dica: 'Comece devagar, palavra por palavra. A velocidade não é o objetivo.',
  },
  {
    nivel: 'Nível 3 · Desafio',
    foco: 'Desafio final: articule uma frase longa com tranquilidade.',
    alvo: 'O extraordinário projeto de infraestrutura trouxe novas possibilidades.',
    dica: 'Divida em blocos e respire naturalmente entre eles. Você pode repetir quantas vezes quiser.',
  },
];

let indiceAtual = 0;
let etapasPraticadas = new Set();
let falando = false;
let reconhecendo = false;
let avisoArmazenamento = false;
let reconhecimentoDisponivel = false;
let reconhecimento = null;
const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

const elProgresso = document.getElementById('progress-fill');
const elTrilhaProgresso = document.getElementById('progress-track');
const elTextoProgresso = document.getElementById('progress-text');
const elNivel = document.getElementById('level-badge');
const elEtapa = document.getElementById('step-count');
const elTituloExercicio = document.getElementById('exercise-title');
const elFoco = document.getElementById('exercise-focus');
const elAlvo = document.getElementById('exercise-target');
const elDica = document.getElementById('exercise-tip');
const elTranscricao = document.getElementById('recognized-text');
const elVelocidade = document.getElementById('pace-value');
const elFeedback = document.getElementById('feedback');
const elCartaoExercicio = document.getElementById('exercise-card');
const elCartaoConclusao = document.getElementById('completion-card');
const btnOuvir = document.getElementById('listen-button');
const btnPraticado = document.getElementById('practice-button');
const btnProximo = document.getElementById('next-button');
const btnRecomecar = document.getElementById('restart-button');
const controleVelocidade = document.getElementById('pace-slider');

function definirFeedback(mensagem, erro = false) {
  elFeedback.textContent = avisoArmazenamento
    ? `${mensagem} O progresso não pôde ser salvo neste navegador.`
    : mensagem;
  elFeedback.className = `feedback${erro ? ' error' : ''}`;
}

function atualizarProgresso() {
  const concluidas = etapasPraticadas.size;
  const porcentagem = Math.round((concluidas / exercicios.length) * 100);
  elProgresso.style.width = `${porcentagem}%`;
  elTextoProgresso.textContent = `${concluidas} de ${exercicios.length}`;
  elTrilhaProgresso.setAttribute('aria-valuemax', String(exercicios.length));
  elTrilhaProgresso.setAttribute('aria-valuenow', String(concluidas));

  try {
    localStorage.setItem('diccao-progress', String(porcentagem));
  } catch (erro) {
    avisoArmazenamento = true;
    console.error('Não foi possível salvar o progresso do desafio de dicção:', erro);
  }
}

function atualizarVelocidade() {
  const velocidade = Number(controleVelocidade.value);
  elVelocidade.textContent = `${velocidade.toFixed(2).replace('.', ',')}x`;
}

function mostrarExercicio() {
  const exercicio = exercicios[indiceAtual];
  elNivel.textContent = exercicio.nivel;
  elEtapa.textContent = `ETAPA ${indiceAtual + 1} DE ${exercicios.length}`;
  elTituloExercicio.textContent = 'Sua vez de praticar';
  elFoco.textContent = exercicio.foco;
  elAlvo.textContent = exercicio.alvo;
  elDica.textContent = exercicio.dica;

  const praticado = etapasPraticadas.has(indiceAtual);
  btnPraticado.disabled = praticado || !reconhecimentoDisponivel || reconhecendo;
  btnPraticado.innerHTML = praticado
    ? '<i class="fa-solid fa-check" aria-hidden="true"></i> Etapa correta'
    : '<i class="fa-solid fa-microphone" aria-hidden="true"></i> Falar para verificar';
  btnProximo.disabled = !praticado;
  btnOuvir.disabled = false;
  elTranscricao.textContent = '';
  definirFeedback(
    praticado
      ? 'Esta etapa já foi praticada. Você pode repeti-la ou avançar.'
      : reconhecimentoDisponivel
        ? 'Fale a palavra ou frase ao microfone. A próxima etapa será liberada quando a transcrição corresponder ao modelo.'
        : 'O reconhecimento de voz não está disponível neste navegador. Use um navegador compatível para verificar a fala.',
    !reconhecimentoDisponivel,
  );
}

function normalizarTexto(texto) {
  return texto
    .toLocaleLowerCase('pt-BR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function verificarTranscricao(transcricao) {
  const esperado = exercicios[indiceAtual].alvo;
  elTranscricao.textContent = `Reconhecido: “${transcricao}”`;

  if (normalizarTexto(transcricao) === normalizarTexto(esperado)) {
    etapasPraticadas.add(indiceAtual);
    atualizarProgresso();
    btnPraticado.disabled = true;
    btnPraticado.innerHTML = '<i class="fa-solid fa-check" aria-hidden="true"></i> Etapa correta';
    btnProximo.disabled = false;
    definirFeedback('Correto! A transcrição corresponde ao modelo. Você já pode avançar.');
    return;
  }

  definirFeedback('A transcrição não corresponde ao texto esperado. Tente novamente, falando devagar e com clareza.', true);
}

function configurarReconhecimento() {
  if (!SpeechRecognitionAPI) {
    btnPraticado.disabled = true;
    return;
  }

  try {
    reconhecimento = new SpeechRecognitionAPI();
    reconhecimento.lang = 'pt-BR';
    reconhecimento.continuous = false;
    reconhecimento.interimResults = true;
    reconhecimento.maxAlternatives = 1;
    reconhecimentoDisponivel = true;

    reconhecimento.onstart = () => {
      reconhecendo = true;
      btnPraticado.disabled = true;
      btnOuvir.disabled = true;
      elTranscricao.textContent = '';
      definirFeedback('Ouvindo... fale o texto mostrado.');
    };

    reconhecimento.onresult = (evento) => {
      let transcricaoFinal = '';
      let transcricaoParcial = '';

      for (let i = evento.resultIndex; i < evento.results.length; i += 1) {
        const resultado = evento.results[i];
        if (resultado.isFinal) {
          transcricaoFinal += resultado[0].transcript;
        } else {
          transcricaoParcial += resultado[0].transcript;
        }
      }

      if (transcricaoFinal.trim()) {
        verificarTranscricao(transcricaoFinal.trim());
      } else if (transcricaoParcial.trim()) {
        elTranscricao.textContent = `Ouvindo: “${transcricaoParcial.trim()}”`;
      }
    };

    reconhecimento.onerror = (evento) => {
      const mensagens = {
        'not-allowed': 'Permita o acesso ao microfone nas configurações do navegador e tente novamente.',
        'service-not-allowed': 'O serviço de reconhecimento de voz não permitiu o acesso. Tente novamente mais tarde.',
        'audio-capture': 'Nenhum microfone foi encontrado. Conecte ou habilite um microfone e tente novamente.',
        'network': 'Não foi possível conectar ao serviço de reconhecimento de voz. Verifique sua conexão e tente novamente.',
        'no-speech': 'Nenhuma fala foi detectada. Tente novamente quando estiver pronto.',
        'language-not-supported': 'O reconhecimento em português do Brasil não está disponível neste navegador.',
        'aborted': 'A verificação de voz foi interrompida.',
      };
      const mensagem = mensagens[evento.error] || 'Ocorreu um erro ao reconhecer a fala. Tente novamente.';
      if (evento.error !== 'no-speech' && evento.error !== 'aborted') {
        console.error('Erro no reconhecimento de voz:', evento.error);
      }
      definirFeedback(mensagem, evento.error !== 'aborted');
    };

    reconhecimento.onend = () => {
      reconhecendo = false;
      btnOuvir.disabled = false;
      btnPraticado.disabled = etapasPraticadas.has(indiceAtual);
    };
  } catch (erro) {
    console.error('Não foi possível configurar o reconhecimento de voz:', erro);
    reconhecimentoDisponivel = false;
    btnPraticado.disabled = true;
    definirFeedback('Não foi possível iniciar o reconhecimento de voz neste navegador.', true);
  }
}

function iniciarVerificacao() {
  if (!reconhecimentoDisponivel || reconhecendo || etapasPraticadas.has(indiceAtual)) {
    return;
  }

  try {
    reconhecimento.start();
  } catch (erro) {
    console.error('Não foi possível iniciar a captura de voz:', erro);
    definirFeedback('Não foi possível iniciar o microfone. Verifique as permissões do navegador e tente novamente.', true);
  }
}

function obterVozPortuguesa() {
  const vozes = window.speechSynthesis.getVoices();
  return vozes.find((voz) => voz.lang.toLowerCase() === 'pt-br')
    || vozes.find((voz) => voz.lang.toLowerCase().startsWith('pt'))
    || null;
}

function falarModelo() {
  if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
    return Promise.reject(new Error('A reprodução de voz não é compatível com este navegador. Você ainda pode praticar lendo a sequência na tela.'));
  }

  window.speechSynthesis.cancel();
  const fala = new SpeechSynthesisUtterance(exercicios[indiceAtual].alvo);
  fala.lang = 'pt-BR';
  fala.rate = Number(controleVelocidade.value);
  fala.pitch = 1;
  fala.volume = 1;

  const voz = obterVozPortuguesa();
  if (voz) {
    fala.voice = voz;
  }

  return new Promise((resolve, reject) => {
    fala.onend = resolve;
    fala.onerror = (evento) => {
      if (evento.error === 'canceled' || evento.error === 'interrupted') {
        resolve();
        return;
      }
      reject(new Error('Não foi possível reproduzir o modelo. Verifique o áudio do dispositivo ou pratique lendo a sequência.'));
    };
    window.speechSynthesis.speak(fala);
  });
}

async function reproduzirModelo() {
  if (falando) {
    return;
  }

  falando = true;
  btnOuvir.disabled = true;
  definirFeedback('Reproduzindo o modelo. Escute e repita quando terminar.');

  try {
    await falarModelo();
    definirFeedback('Agora fale a palavra ou frase ao microfone para verificar.');
  } catch (erro) {
    console.error('Falha ao reproduzir o modelo de dicção:', erro);
    definirFeedback(erro instanceof Error ? erro.message : 'Falha ao reproduzir o modelo.', true);
  } finally {
    falando = false;
    btnOuvir.disabled = false;
  }
}

function avancarEtapa() {
  if (!etapasPraticadas.has(indiceAtual)) {
    return;
  }

  if (indiceAtual < exercicios.length - 1) {
    indiceAtual++;
    mostrarExercicio();
    return;
  }

  elCartaoExercicio.hidden = true;
  elCartaoConclusao.hidden = false;
}

function reiniciarPratica() {
  if (reconhecendo) {
    reconhecimento.stop();
  }
  indiceAtual = 0;
  etapasPraticadas = new Set();
  avisoArmazenamento = false;
  atualizarProgresso();
  elCartaoExercicio.hidden = false;
  elCartaoConclusao.hidden = true;
  mostrarExercicio();
}

controleVelocidade.addEventListener('input', atualizarVelocidade);
btnOuvir.addEventListener('click', reproduzirModelo);
btnPraticado.addEventListener('click', iniciarVerificacao);
btnProximo.addEventListener('click', avancarEtapa);
btnRecomecar.addEventListener('click', reiniciarPratica);

atualizarVelocidade();
atualizarProgresso();
configurarReconhecimento();
mostrarExercicio();

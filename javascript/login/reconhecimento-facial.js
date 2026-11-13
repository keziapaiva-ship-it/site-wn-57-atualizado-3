import {
  FaceDetector,
  FilesetResolver
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14";
 
const $ = (id) => document.getElementById(id);
 
const video = $("video");
const iniciar = $("iniciar");
const capturar = $("capturar");
const status = $("status");
const guia = $("guia");
const canvas = $("canvas");
const consentir = $("consentir");
const previa = $("previa");
const resultadoFoto = $("resultado-foto");
const refazer = $("refazer");
const verificar = $("verificar");
 
/* ---------- Ajustes ---------- */
const PROXIMA_PAGINA = "confirmacao-informacoes.html";
const LIMITE_VIRAR = 0.16;       // quanto o nariz sai do centro dos olhos ao virar
const LIMITE_FRENTE = 0.07;      // tolerância para "olhando de frente"
const FRAMES_CONFIRMACAO = 8;    // frames seguidos na pose certa
const TEMPO_MAX_PASSO = 12000;   // ms para cumprir cada passo
const LUZ_MINIMA = 60;           // 0-255
 
const TEXTO_PASSO = {
  esquerda: "Vire o rosto devagar para o seu lado esquerdo.",
  direita: "Vire o rosto devagar para o seu lado direito.",
  frente: "Agora olhe de frente para a câmera e fique parado."
};
 
/* ---------- Estado ---------- */
let stream = null;
let detector = null;
let executando = false;
let rostoCentralizado = false;
let ambienteClaro = true;
let fotoBlob = null;
let framesVivacidade = [];
let ultimaDeteccao = 0;
let ultimaMedicaoLuz = 0;
let solicitacao = 0;
let bloqueado = false;
 
// desafio de prova de vida
let emDesafio = false;
let desafio = null;
let passos = [];
let indicePasso = 0;
let confirmacoes = 0;
let inicioPasso = 0;
let capturandoPasso = false;
let framesDesafio = [];
 
const canvasLuz = document.createElement("canvas");
canvasLuz.width = 32;
canvasLuz.height = 24;
 
function atualizarStatus(mensagem) {
  status.textContent = mensagem;
}
 
function atualizarBotaoCaptura() {
  capturar.disabled = !(
    executando &&
    rostoCentralizado &&
    ambienteClaro &&
    consentir.checked &&
    !fotoBlob &&
    !emDesafio &&
    !bloqueado
  );
}
 
/* ---------- Detector / câmera ---------- */
async function prepararDetector() {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
  );
 
  return FaceDetector.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite"
    },
    runningMode: "VIDEO",
    minDetectionConfidence: 0.6
  });
}
 
function pararCamera() {
  executando = false;
  rostoCentralizado = false;
  cancelarDesafio();
 
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
    stream = null;
  }
 
  video.srcObject = null;
  video.style.display = "none";
  guia.style.display = "none";
  iniciar.style.display = "flex";
  iniciar.disabled = false;
  capturar.hidden = true;
  capturar.disabled = true;
}
 
async function iniciarCamera() {
  // Consentimento ANTES de ligar a câmera.
  if (!consentir.checked) {
    atualizarStatus(
      "Marque a autorização de uso da imagem para ativar a câmera."
    );
    consentir.focus();
    return;
  }
 
  if (!window.isSecureContext ||
      !navigator.mediaDevices?.getUserMedia) {
    atualizarStatus(
      "A câmera exige HTTPS ou localhost e um navegador compatível."
    );
    return;
  }
 
  const idAtual = ++solicitacao;
  iniciar.disabled = true;
  atualizarStatus("Preparando a câmera e a detecção facial...");
 
  try {
    if (!detector) {
      detector = await prepararDetector();
    }
 
    if (idAtual !== solicitacao) return;
 
    const novoStream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: "user",
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }
    });
 
    if (idAtual !== solicitacao) {
      novoStream.getTracks().forEach((track) => track.stop());
      return;
    }
 
    stream = novoStream;
    video.srcObject = stream;
    await video.play();
 
    if (idAtual !== solicitacao) {
      pararCamera();
      return;
    }
 
    video.style.display = "block";
    iniciar.style.display = "none";
    guia.style.display = "block";
    capturar.hidden = false;
 
    executando = true;
    atualizarStatus("Posicione apenas um rosto no centro da câmera.");
    atualizarBotaoCaptura();
 
    requestAnimationFrame(verificarRosto);
  } catch (erro) {
    console.error("Falha ao iniciar a câmera:", erro);
 
    if (idAtual === solicitacao) {
      pararCamera();
      iniciar.disabled = false;
 
      if (erro.name === "NotAllowedError") {
        atualizarStatus(
          "Permissão negada. Autorize o acesso à câmera nas configurações do navegador."
        );
      } else if (erro.name === "NotFoundError") {
        atualizarStatus("Nenhuma câmera compatível foi encontrada.");
      } else if (erro.name === "NotReadableError") {
        atualizarStatus(
          "A câmera está ocupada por outro aplicativo ou não pode ser acessada."
        );
      } else {
        atualizarStatus(
          "Não foi possível iniciar a câmera. Confira as permissões e tente novamente."
        );
      }
    }
  }
}
 
/* ---------- Medidas do rosto ---------- */
function medirLuz() {
  const ctx = canvasLuz.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(video, 0, 0, canvasLuz.width, canvasLuz.height);
  const dados = ctx.getImageData(0, 0, canvasLuz.width, canvasLuz.height).data;
  let soma = 0;
 
  for (let i = 0; i < dados.length; i += 4) {
    soma += 0.2126 * dados[i] + 0.7152 * dados[i + 1] + 0.0722 * dados[i + 2];
  }
 
  return soma / (dados.length / 4);
}
 
// Giro da cabeça pela posição do nariz em relação aos olhos.
// Positivo = rosto virado para o lado ESQUERDO da pessoa; negativo = direito.
function calcularGiro(rosto) {
  const [olhoA, olhoB, nariz] = rosto.keypoints || [];
  if (!olhoA || !olhoB || !nariz) return null;
 
  const distancia = Math.abs(olhoA.x - olhoB.x);
  if (distancia < 0.02) return null;
 
  return (nariz.x - (olhoA.x + olhoB.x) / 2) / distancia;
}
 
function estaCentralizado(rosto) {
  const caixa = rosto.boundingBox;
  const largura = caixa.width / video.videoWidth;
  const centroX = (caixa.originX + caixa.width / 2) / video.videoWidth;
  const centroY = (caixa.originY + caixa.height / 2) / video.videoHeight;
 
  return (
    centroX >= 0.32 && centroX <= 0.68 &&
    centroY >= 0.25 && centroY <= 0.75 &&
    largura >= 0.12 && largura <= 0.75
  );
}
 
/* ---------- Loop de detecção ---------- */
function verificarRosto() {
  if (!executando) return;
 
  if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
    requestAnimationFrame(verificarRosto);
    return;
  }
 
  // Evita detectar o mesmo frame repetidamente.
  if (video.currentTime !== ultimaDeteccao) {
    ultimaDeteccao = video.currentTime;
 
    try {
      const agora = performance.now();
 
      if (agora - ultimaMedicaoLuz > 500) {
        ultimaMedicaoLuz = agora;
        ambienteClaro = medirLuz() >= LUZ_MINIMA;
      }
 
      const resultado = detector.detectForVideo(video, agora);
      const rostos = resultado.detections || [];
 
      if (emDesafio) {
        avaliarPasso(rostos);
      } else {
        avaliarPosicao(rostos);
      }
    } catch (erro) {
      console.error("Erro na detecção facial:", erro);
      atualizarStatus("Falha na detecção facial. Tente reiniciar a câmera.");
    }
  }
 
  requestAnimationFrame(verificarRosto);
}
 
function avaliarPosicao(rostos) {
  rostoCentralizado = false;
 
  if (fotoBlob) {
    // foto já capturada: só aguarda a decisão da pessoa
  } else if (!ambienteClaro) {
    atualizarStatus("Ambiente muito escuro. Vá para um local mais iluminado.");
  } else if (rostos.length === 0) {
    atualizarStatus("Nenhum rosto detectado. Olhe para a câmera.");
  } else if (rostos.length > 1) {
    atualizarStatus(
      "Mais de um rosto detectado. Deixe apenas uma pessoa na imagem."
    );
  } else {
    rostoCentralizado = estaCentralizado(rostos[0]);
 
    atualizarStatus(
      rostoCentralizado
        ? "Rosto centralizado. Toque em \"Capturar foto\" para iniciar a verificação de segurança."
        : "Ajuste a distância e posicione o rosto no centro."
    );
  }
 
  guia.classList.toggle("centralizado", rostoCentralizado);
  atualizarBotaoCaptura();
}
 
/* ---------- Prova de vida (desafio de movimento) ---------- */
function cancelarDesafio() {
  emDesafio = false;
  desafio = null;
  passos = [];
  indicePasso = 0;
  confirmacoes = 0;
  capturandoPasso = false;
  framesDesafio = [];
}
 
function falharDesafio(mensagem) {
  cancelarDesafio();
  atualizarStatus(mensagem);
  atualizarBotaoCaptura();
}
 
function avaliarPasso(rostos) {
  if (capturandoPasso) return;
 
  if (Date.now() - inicioPasso > TEMPO_MAX_PASSO) {
    falharDesafio("Tempo esgotado. Toque em \"Capturar foto\" para tentar de novo.");
    return;
  }
 
  if (rostos.length !== 1) {
    confirmacoes = 0;
    atualizarStatus(
      rostos.length > 1
        ? "Mais de um rosto detectado. Deixe apenas uma pessoa na imagem."
        : "Rosto não detectado. Volte para o centro da câmera."
    );
    return;
  }
 
  const passo = passos[indicePasso];
  const giro = calcularGiro(rostos[0]);
 
  let correto = false;
  if (giro !== null) {
    if (passo === "esquerda") correto = giro > LIMITE_VIRAR;
    else if (passo === "direita") correto = giro < -LIMITE_VIRAR;
    else correto = Math.abs(giro) < LIMITE_FRENTE && estaCentralizado(rostos[0]);
  }
 
  confirmacoes = correto ? confirmacoes + 1 : 0;
  atualizarStatus(TEXTO_PASSO[passo]);
 
  if (confirmacoes >= FRAMES_CONFIRMACAO) {
    concluirPasso(passo);
  }
}
 
async function concluirPasso(passo) {
  capturandoPasso = true;
 
  try {
    const blob = await capturarFrame();
    if (!emDesafio) return;
 
    framesDesafio.push({ passo, blob });
    indicePasso++;
    confirmacoes = 0;
    inicioPasso = Date.now();
 
    if (indicePasso >= passos.length) {
      finalizarDesafio();
    } else {
      atualizarStatus(TEXTO_PASSO[passos[indicePasso]]);
    }
  } catch (erro) {
    falharDesafio(erro.message || "Não foi possível capturar a imagem.");
  } finally {
    capturandoPasso = false;
  }
}
 
function finalizarDesafio() {
  const ultimo = framesDesafio[framesDesafio.length - 1];
 
  fotoBlob = ultimo.blob;
  framesVivacidade = framesDesafio.slice(0, -1);
  emDesafio = false;
 
  previa.src = URL.createObjectURL(fotoBlob);
  previa.style.transform = "scaleX(-1)"; // prévia espelhada; o arquivo enviado não é
  resultadoFoto.hidden = false;
  capturar.hidden = true;
  verificar.disabled = false;
 
  atualizarStatus(
    "Foto capturada. Confira a prévia antes de verificar sua identidade."
  );
}
 
function capturarFrame() {
  return new Promise((resolve, reject) => {
    if (!video.videoWidth || !video.videoHeight) {
      reject(new Error("A câmera ainda não está pronta para capturar."));
      return;
    }
 
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
 
    const contexto = canvas.getContext("2d");
    if (!contexto) {
      reject(new Error("Não foi possível preparar a imagem."));
      return;
    }
 
    // Imagem SEM espelhamento: é a que o servidor compara com o documento.
    contexto.drawImage(video, 0, 0, canvas.width, canvas.height);
 
    canvas.toBlob(
      (blob) => blob
        ? resolve(blob)
        : reject(new Error("Não foi possível gerar a foto. Tente novamente.")),
      "image/jpeg",
      0.92
    );
  });
}
 
function limparFoto() {
  if (previa.src.startsWith("blob:")) {
    URL.revokeObjectURL(previa.src);
  }
 
  previa.removeAttribute("src");
  fotoBlob = null;
  framesVivacidade = [];
  desafio = null; // cada tentativa exige um desafio novo
  resultadoFoto.hidden = true;
  verificar.disabled = true;
  capturar.hidden = !executando;
  atualizarBotaoCaptura();
}
 
/* ---------- Eventos ---------- */
iniciar.addEventListener("click", iniciarCamera);
 
consentir.addEventListener("change", () => {
  if (!consentir.checked) {
    pararCamera();
    limparFoto();
    atualizarStatus(
      "Consentimento retirado. Autorize novamente para continuar."
    );
  } else {
    atualizarStatus("Toque no ícone da câmera para começar.");
  }
 
  atualizarBotaoCaptura();
});
 
capturar.addEventListener("click", async () => {
  if (capturar.disabled || !stream) return;
 
  capturar.disabled = true;
  atualizarStatus("Preparando a verificação de segurança...");
 
  try {
    if (!window.WN57) throw new Error("Módulo de cadastro não carregado.");
 
    const novo = await window.WN57.desafio(); // { token, passos: [...] }
    if (!executando || !consentir.checked) return;
 
    const validos = (novo.passos || []).filter(
      (p) => p === "esquerda" || p === "direita"
    );
    if (validos.length === 0) throw new Error("Desafio inválido. Tente novamente.");
 
    desafio = novo;
    passos = [...validos, "frente"]; // a foto final é sempre de frente
    indicePasso = 0;
    confirmacoes = 0;
    framesDesafio = [];
    inicioPasso = Date.now();
    emDesafio = true;
    atualizarStatus(TEXTO_PASSO[passos[0]]);
  } catch (erro) {
    console.error("Falha ao iniciar o desafio:", erro);
    atualizarStatus(erro.message || "Não foi possível iniciar a verificação.");
    atualizarBotaoCaptura();
  }
});
 
refazer.addEventListener("click", () => {
  limparFoto();
  atualizarStatus("Posicione o rosto no centro para tirar outra foto.");
});
 
verificar.addEventListener("click", async () => {
  if (!fotoBlob || !desafio || !consentir.checked || bloqueado) {
    atualizarStatus("A captura e o consentimento são necessários.");
    return;
  }
 
  verificar.disabled = true;
  refazer.disabled = true;
  atualizarStatus("Enviando a foto para verificação segura...");
 
  try {
    // A comparação com o documento acontece no SERVIDOR.
    const resposta = await window.WN57.enviarSelfie({
      selfie: fotoBlob,
      frames: framesVivacidade,
      token: desafio.token
    });
 
    tratarResultado(resposta);
  } catch (erro) {
    console.error("Erro na verificação:", erro);
    atualizarStatus(
      erro.message || "Erro de comunicação. Tente novamente."
    );
  } finally {
    refazer.disabled = false;
    verificar.disabled = !fotoBlob || !consentir.checked || bloqueado;
  }
});
 
function tratarResultado(resposta) {
  const resultado = resposta.resultado || resposta.status;
 
  if (resultado === "aprovada" || resultado === "verified") {
    bloqueado = true;
    atualizarStatus("Identidade verificada com sucesso. Redirecionando...");
    pararCamera();
    limparFoto();
    setTimeout(() => { window.location.href = PROXIMA_PAGINA; }, 1500);
    return;
  }
 
  if (resultado === "revisao_manual" || resultado === "review") {
    bloqueado = true;
    atualizarStatus(
      "Sua verificação está em análise. Você será avisada quando for concluída."
    );
    pararCamera();
    limparFoto();
    return;
  }
 
  // reprovada
  const restantes = Number(resposta.tentativas_restantes);
 
  if (restantes === 0) {
    bloqueado = true;
    atualizarStatus(
      "Não foi possível confirmar sua identidade e o limite de tentativas foi atingido. Entre em contato com o suporte."
    );
    pararCamera();
    limparFoto();
    return;
  }
 
  limparFoto();
  atualizarStatus(
    Number.isFinite(restantes)
      ? `A identidade não pôde ser confirmada. Você tem ${restantes} tentativa(s) restante(s). Confira a iluminação e tente de novo.`
      : "A identidade não pôde ser confirmada. Confira a iluminação e tente de novo."
  );
}
 
window.addEventListener("pagehide", () => {
  solicitacao++;
  pararCamera();
 
  if (detector) {
    detector.close();
    detector = null;
  }
 
  limparFoto();
});
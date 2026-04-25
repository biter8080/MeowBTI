import { QUESTIONS, RESULTS, AUXILIARY_COPY } from "./data/content.js";
import { getResultImagePath } from "./data/resultAssets.js";
import {
  resolveAuxiliaryCode,
  resolveResultByType,
  resolveTypeCode
} from "./core/engine.js";
import { startBackground } from "./ui/background.js";
import {
  answerQuestion,
  clearSession,
  createInitialState,
  goBackOneQuestion,
  loadLastResult,
  loadSession,
  saveLastResult,
  saveSession
} from "./core/state.js";
import {
  renderHomeView,
  renderCommunityOverlay,
  renderErrorView,
  renderQuizView,
  renderResultView,
  renderShareOverlay
} from "./ui/templates.js";
import { buildShareCardModel, drawShareCard } from "./ui/shareCard.js";

let mode = "home";
let quizState = loadSession(window.localStorage);
let finalViewModel = null;
let shareImageUrl = "";
let cachedLastResult = loadLastResult(window.localStorage);
const hiddenResultImages = new Set();

const app = document.querySelector("#app");
const bgCanvas = document.querySelector("#bg-canvas");
const shareCanvas = document.querySelector("#share-canvas");

startBackground(bgCanvas);

function buildResultImage(result) {
  const src = getResultImagePath(result);
  if (!src || hiddenResultImages.has(result?.id)) {
    return null;
  }

  return {
    src,
    alt: `${result.name} meme 图`
  };
}

function computeResultViewModel() {
  if (
    quizState.currentQuestionIndex === 0 &&
    cachedLastResult?.result &&
    cachedLastResult?.auxiliaryCode
  ) {
    return {
      result: cachedLastResult.result,
      typeCode: cachedLastResult.typeCode,
      auxiliaryCode: cachedLastResult.auxiliaryCode,
      auxiliaryText: AUXILIARY_COPY[cachedLastResult.auxiliaryCode] ?? "",
      resultImage: buildResultImage(cachedLastResult.result)
    };
  }

  const typeCode = resolveTypeCode(quizState.scores);
  const auxiliaryCode = resolveAuxiliaryCode(quizState.scores);
  const result = resolveResultByType(RESULTS, typeCode) ?? RESULTS[0];

  return {
    result,
    typeCode,
    auxiliaryCode,
    auxiliaryText: AUXILIARY_COPY[auxiliaryCode] ?? "",
    resultImage: buildResultImage(result)
  };
}

function determineInitialMode() {
  if (quizState.currentQuestionIndex > 0 && quizState.currentQuestionIndex < QUESTIONS.length) {
    return "quiz";
  }

  if (quizState.currentQuestionIndex >= QUESTIONS.length) {
    return "result";
  }

  return cachedLastResult ? "result" : "home";
}

function render() {
  if (!app) {
    return;
  }

  if (mode === "home") {
    app.innerHTML = renderHomeView({ completedCount: RESULTS.length });
    return;
  }

  if (mode === "quiz") {
    const safeIndex = Math.min(
      quizState.currentQuestionIndex,
      QUESTIONS.length - 1
    );
    app.innerHTML = renderQuizView({
      index: safeIndex,
      total: QUESTIONS.length,
      question: QUESTIONS[safeIndex]
    });
    return;
  }

  finalViewModel = computeResultViewModel();
  cachedLastResult = {
    typeCode: finalViewModel.typeCode,
    auxiliaryCode: finalViewModel.auxiliaryCode,
    result: finalViewModel.result
  };
  saveLastResult(window.localStorage, cachedLastResult);
  app.innerHTML = renderResultView(finalViewModel);
}

function renderError(message) {
  if (!app) {
    return;
  }

  app.innerHTML = renderErrorView(message);
}

function closeShareOverlay() {
  const overlay = document.querySelector(".overlay-backdrop[data-action='close-share']");
  if (overlay) {
    overlay.remove();
  }
}

function closeCommunityOverlay() {
  const overlay = document.querySelector(".overlay-backdrop[data-action='close-community']");
  if (overlay) {
    overlay.remove();
  }
}

function triggerDownload(fileName, href) {
  const link = document.createElement("a");
  link.download = fileName;
  link.href = href;
  link.click();
}

function openShare() {
  if (!finalViewModel || !shareCanvas) {
    return;
  }

  const ctx = shareCanvas.getContext("2d");
  if (!ctx) {
    return;
  }

  const model = buildShareCardModel(finalViewModel);
  const image = new Image();

  const finish = (iconImage) => {
    drawShareCard(ctx, model, iconImage);
    shareImageUrl = shareCanvas.toDataURL("image/png");
    closeCommunityOverlay();
    closeShareOverlay();
    document.body.insertAdjacentHTML(
      "beforeend",
      renderShareOverlay({ resultName: model.title })
    );
    const preview = document.querySelector("#share-preview-image");
    if (preview) {
      preview.src = shareImageUrl;
    }
  };

  image.onload = () => finish(image);
  image.onerror = () => finish(null);
  image.src = "./icon.png";
}

document.addEventListener("click", (event) => {
  const target = event.target.closest("[data-action], [data-option-key]");
  if (!target) {
    return;
  }

  if (target.dataset.action === "start-quiz") {
    quizState = createInitialState();
    saveSession(window.localStorage, quizState);
    cachedLastResult = null;
    shareImageUrl = "";
    mode = "quiz";
    render();
    return;
  }

  if (target.dataset.optionKey) {
    const question = QUESTIONS[quizState.currentQuestionIndex];
    if (!question) {
      return;
    }

    quizState = answerQuestion(
      quizState,
      QUESTIONS,
      question.id,
      target.dataset.optionKey
    );
    saveSession(window.localStorage, quizState);
    mode = quizState.currentQuestionIndex >= QUESTIONS.length ? "result" : "quiz";
    render();
    return;
  }

  if (target.dataset.action === "go-back") {
    quizState = goBackOneQuestion(quizState, QUESTIONS);
    saveSession(window.localStorage, quizState);
    render();
    return;
  }

  if (target.dataset.action === "restart-quiz") {
    quizState = createInitialState();
    clearSession(window.localStorage);
    closeCommunityOverlay();
    closeShareOverlay();
    shareImageUrl = "";
    mode = "home";
    render();
    return;
  }

  if (target.dataset.action === "open-share") {
    openShare();
    return;
  }

  if (target.dataset.action === "open-community") {
    closeShareOverlay();
    closeCommunityOverlay();
    document.body.insertAdjacentHTML("beforeend", renderCommunityOverlay());
    return;
  }

  if (target.dataset.action === "download-share" && shareImageUrl) {
    const fileName = `maobti-${finalViewModel?.result.name ?? "share"}.png`;
    triggerDownload(fileName, shareImageUrl);
    return;
  }

  if (target.dataset.action === "close-share") {
    closeShareOverlay();
    return;
  }

  if (target.dataset.action === "close-community") {
    closeCommunityOverlay();
    return;
  }

  if (target.dataset.action === "reload-app") {
    window.location.reload();
  }
});

document.addEventListener(
  "error",
  (event) => {
    const target = event.target;
    if (
      !(target instanceof HTMLImageElement) ||
      !target.classList.contains("result-image")
    ) {
      return;
    }

    const resultId = target.dataset.resultId;
    if (resultId && !hiddenResultImages.has(resultId)) {
      hiddenResultImages.add(resultId);
      if (mode === "result") {
        render();
      }
    }
  },
  true
);

mode = determineInitialMode();

try {
  render();
} catch (error) {
  console.error(error);
  renderError("哎呀，出错了，请重启试试吧~");
}

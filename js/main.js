(function (global) {
const {
  AUXILIARY_COPY,
  QUESTIONS,
  RESULTS,
  answerQuestion,
  buildShareCardModel,
  clearSession,
  createInitialState,
  drawShareCard,
  getResultImagePath,
  goBackOneQuestion,
  loadCollection,
  loadLastResult,
  loadSession,
  renderCollectionDetailOverlay,
  renderCollectionLockedOverlay,
  renderCollectionView,
  renderCommunityOverlay,
  renderCommunityView,
  renderErrorView,
  renderGameView,
  renderHomeView,
  renderQuizView,
  renderResultView,
  renderShareOverlay,
  renderTestsView,
  resolveAuxiliaryCode,
  resolveResultByType,
  resolveTypeCode,
  saveCollection,
  saveLastResult,
  saveSession,
  startBackground,
  unlockResult
} = global.MaoBTI;

function createMemoryStorage() {
  const values = new Map();

  return {
    getItem: (key) => values.get(key) ?? null,
    removeItem: (key) => {
      values.delete(key);
    },
    setItem: (key, value) => {
      values.set(key, String(value));
    }
  };
}

function getStorage() {
  try {
    const storage = global.localStorage;
    const testKey = "maobti.storage-test";
    storage.setItem(testKey, testKey);
    storage.removeItem(testKey);
    return storage;
  } catch {
    return createMemoryStorage();
  }
}

const appStorage = getStorage();
let mode = "home";
let quizState = loadSession(appStorage);
let finalViewModel = null;
let shareImageUrl = "";
let cachedLastResult = loadLastResult(appStorage);
let collectionState = loadCollection(appStorage);
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

function buildCollectionItems() {
  return RESULTS.map((result) => ({
    id: result.id,
    name: result.name,
    unlocked: collectionState.unlockedResultIds.includes(result.id),
    image: buildResultImage(result)
  }));
}

function ensureResultUnlocked(result) {
  const nextCollection = unlockResult(collectionState, result?.id);
  if (nextCollection !== collectionState) {
    collectionState = nextCollection;
    saveCollection(appStorage, collectionState);
  }
}

function render() {
  if (!app) {
    return;
  }

  if (mode === "home") {
    app.innerHTML = renderHomeView({
      completedCount: RESULTS.length,
      unlockedCount: collectionState.unlockedResultIds.length
    });
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

  if (mode === "collection") {
    app.innerHTML = renderCollectionView({
      unlockedCount: collectionState.unlockedResultIds.length,
      totalCount: RESULTS.length,
      items: buildCollectionItems()
    });
    return;
  }

  if (mode === "tests") {
    app.innerHTML = renderTestsView();
    return;
  }

  if (mode === "community") {
    app.innerHTML = renderCommunityView();
    return;
  }

  if (mode === "game") {
    app.innerHTML = renderGameView();
    return;
  }

  finalViewModel = computeResultViewModel();
  ensureResultUnlocked(finalViewModel.result);
  cachedLastResult = {
    typeCode: finalViewModel.typeCode,
    auxiliaryCode: finalViewModel.auxiliaryCode,
    result: finalViewModel.result
  };
  saveLastResult(appStorage, cachedLastResult);
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

function closeCollectionDetailOverlay() {
  const overlay = document.querySelector(
    ".overlay-backdrop[data-action='close-collection-detail']"
  );
  if (overlay) {
    overlay.remove();
  }
}

function closeCollectionLockedOverlay() {
  const overlay = document.querySelector(
    ".overlay-backdrop[data-action='close-collection-locked']"
  );
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
    saveSession(appStorage, quizState);
    cachedLastResult = null;
    shareImageUrl = "";
    mode = "quiz";
    render();
    return;
  }

  if (target.dataset.action === "open-collection") {
    closeShareOverlay();
    closeCommunityOverlay();
    closeCollectionDetailOverlay();
    closeCollectionLockedOverlay();
    mode = "collection";
    render();
    return;
  }

  if (target.dataset.action === "open-tests") {
    closeShareOverlay();
    closeCommunityOverlay();
    closeCollectionDetailOverlay();
    closeCollectionLockedOverlay();
    mode = "tests";
    render();
    return;
  }

  if (target.dataset.action === "open-game") {
    closeShareOverlay();
    closeCommunityOverlay();
    closeCollectionDetailOverlay();
    closeCollectionLockedOverlay();
    mode = "game";
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
    saveSession(appStorage, quizState);
    mode = quizState.currentQuestionIndex >= QUESTIONS.length ? "result" : "quiz";
    render();
    return;
  }

  if (target.dataset.action === "go-back") {
    quizState = goBackOneQuestion(quizState, QUESTIONS);
    saveSession(appStorage, quizState);
    render();
    return;
  }

  if (target.dataset.action === "restart-quiz") {
    quizState = createInitialState();
    clearSession(appStorage);
    closeCommunityOverlay();
    closeShareOverlay();
    shareImageUrl = "";
    mode = "home";
    render();
    return;
  }

  if (target.dataset.action === "go-home") {
    closeShareOverlay();
    closeCommunityOverlay();
    closeCollectionDetailOverlay();
    closeCollectionLockedOverlay();
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
    closeCollectionDetailOverlay();
    closeCollectionLockedOverlay();
    mode = "community";
    render();
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

  if (target.dataset.collectionId) {
    const resultId = target.dataset.collectionId;
    const result = RESULTS.find((item) => item.id === resultId);
    const isUnlocked = collectionState.unlockedResultIds.includes(resultId);

    closeCollectionDetailOverlay();
    closeCollectionLockedOverlay();

    if (!result || !isUnlocked) {
      document.body.insertAdjacentHTML("beforeend", renderCollectionLockedOverlay());
      return;
    }

    document.body.insertAdjacentHTML(
      "beforeend",
      renderCollectionDetailOverlay({
        result,
        resultImage: buildResultImage(result)
      })
    );
    return;
  }

  if (target.dataset.action === "close-collection-detail") {
    closeCollectionDetailOverlay();
    return;
  }

  if (target.dataset.action === "close-collection-locked") {
    closeCollectionLockedOverlay();
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
      (!target.classList.contains("result-image") &&
        !target.classList.contains("collection-entry-image"))
    ) {
      return;
    }

    const resultId = target.dataset.resultId;
    if (resultId && !hiddenResultImages.has(resultId)) {
      hiddenResultImages.add(resultId);
      if (mode === "result" || mode === "collection") {
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
})(globalThis);

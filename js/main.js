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
  renderCommunityPostView,
  renderCommunityView,
  renderErrorView,
  renderGameDetailView,
  renderGameLeaderboardView,
  renderGamePlayView,
  renderGameView,
  renderHomeView,
  renderInviteView,
  renderProfileView,
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
let communityPostId = "cat-meme";
let communityImageIndex = 0;
const hiddenResultImages = new Set();

const app = document.querySelector("#app");
const bgCanvas = document.querySelector("#bg-canvas");
const shareCanvas = document.querySelector("#share-canvas");

startBackground(bgCanvas);

let lastRenderedMode = "";

const MODE_ORDER = [
  "home",
  "tests",
  "quiz",
  "result",
  "collection",
  "community",
  "community-post",
  "game",
  "game-detail",
  "game-play",
  "game-leaderboard",
  "profile",
  "invite"
];

function getRenderDirection(nextMode) {
  if (!lastRenderedMode || lastRenderedMode === nextMode) {
    return "refresh";
  }

  const previousIndex = MODE_ORDER.indexOf(lastRenderedMode);
  const nextIndex = MODE_ORDER.indexOf(nextMode);

  if (previousIndex === -1 || nextIndex === -1) {
    return "forward";
  }

  return nextIndex >= previousIndex ? "forward" : "back";
}

function renderApp(html) {
  const direction = getRenderDirection(mode);

  if (app.dataset) {
    app.dataset.mode = mode;
    app.dataset.transition = direction;
  } else if (typeof app.setAttribute === "function") {
    app.setAttribute("data-mode", mode);
    app.setAttribute("data-transition", direction);
  }

  app.innerHTML = html;
  lastRenderedMode = mode;
}

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
    renderApp(renderHomeView({
      completedCount: RESULTS.length,
      unlockedCount: collectionState.unlockedResultIds.length
    }));
    return;
  }

  if (mode === "quiz") {
    const safeIndex = Math.min(
      quizState.currentQuestionIndex,
      QUESTIONS.length - 1
    );
    renderApp(renderQuizView({
      index: safeIndex,
      total: QUESTIONS.length,
      question: QUESTIONS[safeIndex]
    }));
    return;
  }

  if (mode === "collection") {
    renderApp(renderCollectionView({
      unlockedCount: collectionState.unlockedResultIds.length,
      totalCount: RESULTS.length,
      items: buildCollectionItems()
    }));
    return;
  }

  if (mode === "tests") {
    renderApp(renderTestsView());
    return;
  }

  if (mode === "community") {
    renderApp(renderCommunityView());
    return;
  }

  if (mode === "community-post") {
    renderApp(renderCommunityPostView({
      postId: communityPostId,
      imageIndex: communityImageIndex
    }));
    return;
  }

  if (mode === "game") {
    renderApp(renderGameView());
    return;
  }

  if (mode === "game-detail") {
    renderApp(renderGameDetailView());
    return;
  }

  if (mode === "game-play") {
    renderApp(renderGamePlayView());
    return;
  }

  if (mode === "game-leaderboard") {
    renderApp(renderGameLeaderboardView());
    return;
  }

  if (mode === "profile") {
    renderApp(renderProfileView());
    return;
  }

  if (mode === "invite") {
    renderApp(renderInviteView());
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
  renderApp(renderResultView(finalViewModel));
}

function renderError(message) {
  if (!app) {
    return;
  }

  renderApp(renderErrorView(message));
}

function shouldReduceMotion() {
  return (
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function removeOverlay(selector) {
  const overlay = document.querySelector(selector);
  if (!overlay) {
    return;
  }

  if (shouldReduceMotion()) {
    overlay.remove();
    return;
  }

  overlay.classList.add("is-closing");
  window.setTimeout(() => overlay.remove(), 160);
}

function closeShareOverlay() {
  removeOverlay(".overlay-backdrop[data-action='close-share']");
}

function closeCommunityOverlay() {
  removeOverlay(".overlay-backdrop[data-action='close-community']");
}

function closeCollectionDetailOverlay() {
  removeOverlay(".overlay-backdrop[data-action='close-collection-detail']");
}

function closeCollectionLockedOverlay() {
  removeOverlay(".overlay-backdrop[data-action='close-collection-locked']");
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

function scrollCommunityGallery(direction) {
  const gallery = document.querySelector("[data-community-gallery]");
  if (!gallery) {
    return;
  }

  gallery.scrollBy({
    left: direction * gallery.clientWidth,
    behavior: "smooth"
  });
}

document.addEventListener("pointerdown", (event) => {
  const target = event.target.closest("button, [data-action], [data-collection-id]");
  if (!target || target.classList.contains("is-pressing")) {
    return;
  }

  target.classList.add("is-pressing");
});

document.addEventListener("pointerup", () => {
  document.querySelectorAll(".is-pressing").forEach((item) => {
    item.classList.remove("is-pressing");
  });
});

document.addEventListener("pointercancel", () => {
  document.querySelectorAll(".is-pressing").forEach((item) => {
    item.classList.remove("is-pressing");
  });
});

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

  if (target.dataset.action === "open-game-detail") {
    closeShareOverlay();
    closeCommunityOverlay();
    closeCollectionDetailOverlay();
    closeCollectionLockedOverlay();
    mode = "game-detail";
    render();
    return;
  }

  if (target.dataset.action === "open-game-play") {
    closeShareOverlay();
    closeCommunityOverlay();
    closeCollectionDetailOverlay();
    closeCollectionLockedOverlay();
    mode = "game-play";
    render();
    return;
  }

  if (target.dataset.action === "open-game-leaderboard") {
    closeShareOverlay();
    closeCommunityOverlay();
    closeCollectionDetailOverlay();
    closeCollectionLockedOverlay();
    mode = "game-leaderboard";
    render();
    return;
  }

  if (target.dataset.action === "open-profile") {
    closeShareOverlay();
    closeCommunityOverlay();
    closeCollectionDetailOverlay();
    closeCollectionLockedOverlay();
    mode = "profile";
    render();
    return;
  }

  if (target.dataset.action === "open-invite") {
    closeShareOverlay();
    closeCommunityOverlay();
    closeCollectionDetailOverlay();
    closeCollectionLockedOverlay();
    mode = "invite";
    render();
    return;
  }

  if (target.dataset.action === "open-community-post") {
    closeShareOverlay();
    closeCommunityOverlay();
    closeCollectionDetailOverlay();
    closeCollectionLockedOverlay();
    communityPostId = target.dataset.postId || "cat-meme";
    communityImageIndex = 0;
    mode = "community-post";
    render();
    return;
  }

  if (target.dataset.action === "prev-community-image") {
    scrollCommunityGallery(-1);
    return;
  }

  if (target.dataset.action === "next-community-image") {
    scrollCommunityGallery(1);
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

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
  renderBottomTabbar,
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

const SHARE_CAT_ICON_DATA_URI = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ffe9c8"/>
      <stop offset="100%" stop-color="#ffd29e"/>
    </linearGradient>
  </defs>
  <rect width="320" height="320" rx="44" fill="url(#bg)"/>
  <circle cx="160" cy="184" r="96" fill="#ffe1bf"/>
  <path d="M84 124 126 72l22 62z" fill="#f3b98a"/>
  <path d="M236 124 194 72l-22 62z" fill="#f3b98a"/>
  <circle cx="122" cy="184" r="12" fill="#2f1f12"/>
  <circle cx="198" cy="184" r="12" fill="#2f1f12"/>
  <path d="M160 205 148 220h24z" fill="#f08ca0"/>
  <path d="M122 222c18 16 58 16 76 0" stroke="#2f1f12" stroke-width="8" stroke-linecap="round" fill="none"/>
  <circle cx="74" cy="84" r="16" fill="#ffffff" fill-opacity="0.22"/>
  <circle cx="258" cy="72" r="12" fill="#ffffff" fill-opacity="0.2"/>
</svg>
`)}`;

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
  const dockConfig = resolveDockConfig(mode);
  const dockHtml = renderBottomTabbar(
    dockConfig.activeTab,
    dockConfig.testAction,
    dockConfig.label
  );
  const cleanedHtml = html.replace(/<nav class="bottom-tabbar"[\s\S]*?<\/nav>/g, "");
  const direction = getRenderDirection(mode);

  if (app.dataset) {
    app.dataset.mode = mode;
    app.dataset.transition = direction;
  } else if (typeof app.setAttribute === "function") {
    app.setAttribute("data-mode", mode);
    app.setAttribute("data-transition", direction);
  }

  app.innerHTML = `${cleanedHtml}${dockHtml}`;
  lastRenderedMode = mode;
}

function resolveDockConfig(currentMode) {
  if (currentMode === "home") {
    return { activeTab: "home", testAction: "start-quiz", label: "首页导航" };
  }

  if (currentMode === "collection") {
    return { activeTab: "collection", testAction: "open-tests", label: "图鉴导航" };
  }

  if (currentMode === "tests" || currentMode === "quiz" || currentMode === "result") {
    return { activeTab: "test", testAction: "open-tests", label: "测试导航" };
  }

  if (currentMode === "community" || currentMode === "community-post") {
    return { activeTab: "community", testAction: "open-tests", label: "社区导航" };
  }

  if (
    currentMode === "profile" ||
    currentMode === "invite" ||
    currentMode === "game" ||
    currentMode === "game-detail" ||
    currentMode === "game-play" ||
    currentMode === "game-leaderboard"
  ) {
    return { activeTab: "profile", testAction: "open-tests", label: "个人导航" };
  }

  return { activeTab: "home", testAction: "open-tests", label: "底部导航" };
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
  quizState = createInitialState();
  clearSession(appStorage);

  return "home";
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

function openShare() {
  if (!shareCanvas) {
    return;
  }

  if (!finalViewModel) {
    finalViewModel = computeResultViewModel();
  }

  if (!finalViewModel?.result) {
    return;
  }

  const model = buildShareCardModel(finalViewModel);
  const logoImage = new Image();
  const resultImage = new Image();
  const memeImage = new Image();
  const fallbackImage = new Image();
  const resourceImageSrc = getResultImagePath(finalViewModel.result);
  const memeImageSrc = "./resources/今日猫meme/猫meme分享_1_露露凯蒂_来自小红书网页版.jpg";
  const isFileProtocol =
    typeof window !== "undefined" && window.location?.protocol === "file:";

  function renderAndExport(images) {
    const ctx = shareCanvas.getContext("2d");
    if (!ctx) {
      throw new Error("share canvas context unavailable");
    }

    drawShareCard(ctx, model, images);
    return shareCanvas.toDataURL("image/png");
  }

  const finish = (images) => {
    try {
      try {
        shareImageUrl = renderAndExport(images);
      } catch (exportError) {
        if (images?.logoImage || images?.resultImage || images?.memeImage) {
          shareCanvas.width = shareCanvas.width;
          shareCanvas.height = shareCanvas.height;
          shareImageUrl = renderAndExport({});
        } else {
          throw exportError;
        }
      }
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
    } catch (error) {
      console.error(error);
    }
  };

  function loadImage(image, src) {
    return new Promise((resolve) => {
      if (!src) {
        resolve(null);
        return;
      }

      image.onload = () => resolve(image);
      image.onerror = () => resolve(null);
      image.src = src;
    });
  }

  async function prepareAndFinish() {
    const [loadedResultImage, loadedLogoImage, loadedMemeImage] = await Promise.all([
      loadImage(resultImage, resourceImageSrc),
      loadImage(logoImage, "./icon.png"),
      loadImage(memeImage, memeImageSrc)
    ]);

    finish({
      resultImage: loadedResultImage,
      logoImage: loadedLogoImage,
      memeImage: loadedMemeImage
    });
  }

  if (isFileProtocol) {
    fallbackImage.onload = () => finish({ logoImage: fallbackImage });
    fallbackImage.onerror = () => finish({});
    fallbackImage.src = SHARE_CAT_ICON_DATA_URI;
    return;
  }

  prepareAndFinish().catch(() => finish({}));
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
  const target = event.target.closest("[data-action], [data-option-key], [data-collection-id]");
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
    saveSession(appStorage, quizState);
    closeCommunityOverlay();
    closeShareOverlay();
    shareImageUrl = "";
    mode = "quiz";
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

  if (target.dataset.action === "unlock-all-collection") {
    collectionState = {
      unlockedResultIds: RESULTS.map((result) => result.id)
    };
    saveCollection(appStorage, collectionState);
    closeCollectionDetailOverlay();
    closeCollectionLockedOverlay();
    mode = "collection";
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

    cachedLastResult = {
      typeCode: result.typeCode,
      auxiliaryCode: resolveAuxiliaryCode(createInitialState().scores),
      result
    };
    saveLastResult(appStorage, cachedLastResult);
    mode = "result";
    render();
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

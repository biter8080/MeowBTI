# 猫BTI 图鉴解锁功能 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为现有离线单页 `猫BTI` 增加自动解锁图鉴、首页入口、图鉴页和详情弹层。

**Architecture:** 延续现有 `localStorage + 单页状态机 + HTML 模板 + 事件代理` 架构。图鉴数据与答题会话分离，新增独立 `collection` 视图状态，结果页完成计算后自动写入图鉴，再由首页和图鉴页读取同一份本地收藏数据。

**Tech Stack:** HTML, CSS, JavaScript ES modules, Node `--test`, esbuild

---

### Task 1: 图鉴状态存储

**Files:**
- Modify: `d:\Develop\Project\work_hks\js\core\state.js`
- Test: `d:\Develop\Project\work_hks\tests\state.test.mjs`

- [ ] **Step 1: 先写图鉴状态测试**

```javascript
test("loadCollection returns an empty catalog when storage is missing", () => {
  const storage = { getItem: () => null };
  const collection = loadCollection(storage);

  assert.deepEqual(collection, { unlockedResultIds: [] });
});

test("unlockResult stores a new result id only once", () => {
  const collection = unlockResult({ unlockedResultIds: ["02"] }, "06");
  const duplicate = unlockResult(collection, "06");

  assert.deepEqual(collection.unlockedResultIds, ["02", "06"]);
  assert.deepEqual(duplicate.unlockedResultIds, ["02", "06"]);
});

test("saveCollection and loadCollection round-trip catalog data", () => {
  let storedValue = "";
  const storage = {
    setItem: (_key, value) => {
      storedValue = value;
    },
    getItem: () => storedValue
  };

  saveCollection(storage, { unlockedResultIds: ["01", "12"] });
  const collection = loadCollection(storage);

  assert.deepEqual(collection.unlockedResultIds, ["01", "12"]);
});
```

- [ ] **Step 2: 运行状态测试并确认新增用例先失败**

Run: `node --test tests/state.test.mjs`
Expected: FAIL with `loadCollection is not defined` and `unlockResult is not defined`

- [ ] **Step 3: 在 `state.js` 中补齐图鉴存储实现**

```javascript
const COLLECTION_KEY = "maobti.collection";

export function createEmptyCollection() {
  return {
    unlockedResultIds: []
  };
}

export function loadCollection(storage) {
  try {
    const raw = storage.getItem(COLLECTION_KEY);
    if (!raw) {
      return createEmptyCollection();
    }

    const parsed = JSON.parse(raw);
    const ids = Array.isArray(parsed?.unlockedResultIds)
      ? parsed.unlockedResultIds.filter((value) => typeof value === "string")
      : [];

    return {
      unlockedResultIds: [...new Set(ids)]
    };
  } catch {
    return createEmptyCollection();
  }
}

export function saveCollection(storage, collection) {
  try {
    storage.setItem(COLLECTION_KEY, JSON.stringify(collection));
  } catch {
    // Ignore storage failures and keep the main flow usable.
  }
}

export function unlockResult(collection, resultId) {
  if (!resultId || collection.unlockedResultIds.includes(resultId)) {
    return collection;
  }

  return {
    unlockedResultIds: [...collection.unlockedResultIds, resultId]
  };
}
```

- [ ] **Step 4: 重新运行状态测试**

Run: `node --test tests/state.test.mjs`
Expected: PASS with the new catalog tests included

- [ ] **Step 5: 提交状态层改动**

```bash
git add tests/state.test.mjs js/core/state.js
git commit -m "feat: add catalog storage helpers"
```

### Task 2: 首页与图鉴模板

**Files:**
- Modify: `d:\Develop\Project\work_hks\js\ui\templates.js`
- Test: `d:\Develop\Project\work_hks\tests\templates.test.mjs`

- [ ] **Step 1: 先补模板测试**

```javascript
test("renderHomeView shows my catalog entry and unlocked progress", () => {
  const html = renderHomeView({ completedCount: 16, unlockedCount: 3 });

  assert.match(html, /我的图鉴/);
  assert.match(html, /已解锁\s*3\s*\/\s*16/);
});

test("renderCollectionView renders all catalog cards", () => {
  const html = renderCollectionView({
    unlockedCount: 1,
    totalCount: 2,
    items: [
      {
        id: "01",
        name: "命苦猫",
        unlocked: false,
        image: null
      },
      {
        id: "02",
        name: "打工猫",
        unlocked: true,
        image: {
          src: "./resources/personalities-main/02 打工猫.png",
          alt: "打工猫 meme 图"
        }
      }
    ]
  });

  assert.match(html, /我的图鉴/);
  assert.equal((html.match(/data-collection-id=/g) || []).length, 2);
  assert.match(html, /\?\?\?/);
  assert.match(html, /打工猫/);
});

test("renderCollectionDetailOverlay prints unlocked result details", () => {
  const html = renderCollectionDetailOverlay({
    result: {
      id: "02",
      name: "打工猫",
      tagline: "嘴上想辞职，行动上最能扛",
      description: "你是那种一边喊累，一边把活默默做完的人。"
    },
    resultImage: {
      src: "./resources/personalities-main/02 打工猫.png",
      alt: "打工猫 meme 图"
    }
  });

  assert.match(html, /打工猫/);
  assert.match(html, /嘴上想辞职/);
  assert.match(html, /data-action="close-collection-detail"/);
});
```

- [ ] **Step 2: 运行模板测试并确认新增用例先失败**

Run: `node --test tests/templates.test.mjs`
Expected: FAIL with `renderCollectionView is not defined`

- [ ] **Step 3: 扩展模板实现**

```javascript
export function renderHomeView({ completedCount, unlockedCount }) {
  return `
    <section class="panel home-card">
      <img class="brand-icon" src="./icon.png" alt="猫BTI" />
      <p class="eyebrow">离线猫格测试</p>
      <h1>测一测你是哪种猫猫人格</h1>
      <p class="subtitle">24题轻测试，结果仅供娱乐，但很适合截图发朋友。</p>
      <p class="meta">当前已整理 ${completedCount} 种猫格结果卡，已解锁 ${unlockedCount} / ${completedCount}。</p>
      <div class="home-actions">
        <button type="button" data-action="start-quiz">开始测试</button>
        <button type="button" class="ghost-button" data-action="open-collection">我的图鉴</button>
      </div>
      <p class="footnote">结果仅供娱乐，请按心情吸猫。</p>
    </section>
  `;
}

export function renderCollectionView({ unlockedCount, totalCount, items }) {
  const cardsMarkup = items
    .map(
      (item) => `
        <button
          type="button"
          class="collection-card ${item.unlocked ? "is-unlocked" : "is-locked"}"
          data-collection-id="${item.id}"
        >
          ${
            item.unlocked && item.image
              ? `<img class="collection-card-image" src="${item.image.src}" alt="${item.image.alt}" />`
              : `<span class="collection-card-placeholder">?</span>`
          }
          <span class="collection-card-name">${item.unlocked ? item.name : "???"}</span>
        </button>
      `
    )
    .join("");

  return `
    <section class="panel collection-card-shell">
      <div class="progress-meta">
        <span>我的图鉴</span>
        <button type="button" class="link-button" data-action="go-home">返回首页</button>
      </div>
      <p class="meta">已解锁 ${unlockedCount} / ${totalCount}</p>
      <div class="collection-grid">${cardsMarkup}</div>
    </section>
  `;
}

export function renderCollectionDetailOverlay({ result, resultImage }) {
  const imageMarkup = resultImage
    ? `<figure class="result-image-card"><img class="result-image" src="${resultImage.src}" alt="${resultImage.alt}" /></figure>`
    : "";

  return `
    <div class="overlay-backdrop" data-action="close-collection-detail">
      <section class="panel share-overlay" aria-label="图鉴详情">
        <p class="eyebrow">图鉴详情</p>
        ${imageMarkup}
        <h2>${result.name}</h2>
        <p class="tagline">${result.tagline}</p>
        <p class="description">${result.description}</p>
        <div class="result-actions">
          <button type="button" data-action="close-collection-detail">关闭</button>
        </div>
      </section>
    </div>
  `;
}
```

- [ ] **Step 4: 重新运行模板测试**

Run: `node --test tests/templates.test.mjs`
Expected: PASS with home, collection and overlay assertions

- [ ] **Step 5: 提交模板层改动**

```bash
git add tests/templates.test.mjs js/ui/templates.js
git commit -m "feat: add catalog templates"
```

### Task 3: 主流程接入自动解锁和图鉴页

**Files:**
- Modify: `d:\Develop\Project\work_hks\js\main.js`
- Modify: `d:\Develop\Project\work_hks\tests\templates.test.mjs`

- [ ] **Step 1: 先补一个结果页已收录提示断言**

```javascript
test("renderResultView includes catalog saved hint", () => {
  const html = renderResultView({
    result: {
      id: "02",
      name: "打工猫",
      tagline: "嘴上想辞职，行动上最能扛",
      description: "你是那种一边喊累，一边把活默默做完的人。",
      shareText: "很合理。"
    },
    auxiliaryText: "你看起来很稳，其实很多东西都被你默默扛住了。",
    resultImage: null
  });

  assert.match(html, /已收录进你的图鉴/);
});
```

- [ ] **Step 2: 运行模板测试确认提示断言先失败**

Run: `node --test tests/templates.test.mjs`
Expected: FAIL because the result template does not include the saved hint yet

- [ ] **Step 3: 在 `main.js` 中接入图鉴状态和新视图**

```javascript
let mode = "home";
let collectionState = loadCollection(window.localStorage);

function buildCollectionItems() {
  return RESULTS.map((result) => ({
    ...result,
    unlocked: collectionState.unlockedResultIds.includes(result.id),
    image: buildResultImage(result)
  }));
}

function ensureResultUnlocked(result) {
  const nextCollection = unlockResult(collectionState, result.id);
  if (nextCollection !== collectionState) {
    collectionState = nextCollection;
    saveCollection(window.localStorage, collectionState);
  }
}

function render() {
  if (mode === "home") {
    app.innerHTML = renderHomeView({
      completedCount: RESULTS.length,
      unlockedCount: collectionState.unlockedResultIds.length
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

  finalViewModel = computeResultViewModel();
  ensureResultUnlocked(finalViewModel.result);
  app.innerHTML = renderResultView(finalViewModel);
}
```

- [ ] **Step 4: 扩展点击事件处理**

```javascript
if (target.dataset.action === "open-collection") {
  closeShareOverlay();
  closeCommunityOverlay();
  mode = "collection";
  render();
  return;
}

if (target.dataset.action === "go-home") {
  closeShareOverlay();
  closeCommunityOverlay();
  mode = "home";
  render();
  return;
}

if (target.dataset.collectionId) {
  const result = RESULTS.find((item) => item.id === target.dataset.collectionId);
  const unlocked = collectionState.unlockedResultIds.includes(target.dataset.collectionId);

  if (!result || !unlocked) {
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
```

- [ ] **Step 5: 结果模板补上已收录提示并跑全量测试**

```javascript
<div class="result-copy-body">
  <p class="description">${result.description}</p>
  <p class="auxiliary">${auxiliaryText}</p>
  <p class="meta result-saved-note">已收录进你的图鉴</p>
</div>
```

Run: `node --test`
Expected: PASS for all content, state and template tests

- [ ] **Step 6: 提交主流程改动**

```bash
git add js/main.js js/ui/templates.js tests/templates.test.mjs
git commit -m "feat: wire catalog unlock flow"
```

### Task 4: 图鉴样式、诊断与产物

**Files:**
- Modify: `d:\Develop\Project\work_hks\css\style.css`
- Modify: `d:\Develop\Project\work_hks\js/app.bundle.js`

- [ ] **Step 1: 为首页双按钮和图鉴网格补样式**

```css
.home-actions {
  display: grid;
  gap: 12px;
}

.collection-card-shell {
  padding: clamp(14px, 2.6vw, 26px);
}

.collection-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 16px;
}

.collection-card {
  display: grid;
  gap: 10px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.82);
  text-align: center;
}

.collection-card-image,
.collection-card-placeholder {
  width: 100%;
  aspect-ratio: 4 / 5;
  border-radius: 18px;
}

.collection-card-placeholder {
  display: grid;
  place-items: center;
  background: rgba(62, 43, 31, 0.08);
  font-size: clamp(2rem, 9vw, 3rem);
  font-weight: 800;
}

.collection-card-name {
  overflow-wrap: anywhere;
  word-break: break-word;
}
```

- [ ] **Step 2: 运行诊断检查最近修改文件**

Run tools: diagnostics for `js/main.js`, `js/ui/templates.js`, `js/core/state.js`, `css/style.css`, `tests/state.test.mjs`, `tests/templates.test.mjs`
Expected: no new diagnostics

- [ ] **Step 3: 构建 bundle 并跑回归**

Run: `node --test`
Expected: PASS

Run: `npm run build:bundle`
Expected: PASS

- [ ] **Step 4: 提交样式与构建产物**

```bash
git add css/style.css js/app.bundle.js
git commit -m "feat: style catalog collection view"
```

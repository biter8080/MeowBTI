# 猫BTI 响应式适配与结果页 Meme 图接入 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将当前猫BTI核心版升级为更灵活的流式响应式布局，并把 `resources/personalities-main/` 的 16 张 meme 图接入结果页主视觉，同时保持双入口与离线能力稳定。

**Architecture:** 继续沿用现有单页状态机与模板渲染结构，不改变判题逻辑。实现上把图片映射单独收敛到结果资源模块，把结果页模板与主控制器做最小范围扩展，把样式系统从固定窄屏卡片升级为流式单列 + 宽屏增强，再通过测试和 bundle 回归保证 `index.html`、`index.dev.html` 与离线分发能力不退化。

**Tech Stack:** HTML, CSS, JavaScript ES Modules, Node `--test`, esbuild

---

## 文件结构与职责

- Modify: `d:\Develop\Project\work_hks\js\ui\templates.js`
  - 扩展结果页模板，插入 meme 图片卡并调整文案顺序
- Create: `d:\Develop\Project\work_hks\js\data\resultAssets.js`
  - 提供 `16` 型结果到 `resources/personalities-main/` 图片路径的显式映射
- Modify: `d:\Develop\Project\work_hks\js\main.js`
  - 在结果页渲染时注入图片路径与加载失败降级状态
- Modify: `d:\Develop\Project\work_hks\css\style.css`
  - 将固定窄屏样式升级为流式尺寸系统，并增强 `iPad` 竖屏表现
- Modify: `d:\Develop\Project\work_hks\tests\templates.test.mjs`
  - 覆盖结果页图片节点、文案顺序与操作区输出
- Create: `d:\Develop\Project\work_hks\tests\resultAssets.test.mjs`
  - 校验 `16` 型结果都能解析出图片路径
- Modify: `d:\Develop\Project\work_hks\docs\superpowers\specs\2026-04-25-maobti-responsive-meme-design.md`
  - 若实现中发现字段命名需要更明确，可小幅同步说明
- Modify: `d:\Develop\Project\work_hks\index.html`
  - 如壳层确需为布局语义新增包裹节点，必须同步修改
- Modify: `d:\Develop\Project\work_hks\index.dev.html`
  - 与 `index.html` 保持同一壳层结构
- Modify: `d:\Develop\Project\work_hks\tests\entryFiles.test.mjs`
  - 如入口壳层出现新节点，更新一致性断言

## Task 1: 结果图资源映射

**Files:**
- Create: `d:\Develop\Project\work_hks\js\data\resultAssets.js`
- Create: `d:\Develop\Project\work_hks\tests\resultAssets.test.mjs`
- Test: `d:\Develop\Project\work_hks\tests\content.test.mjs`

- [ ] **Step 1: 写失败测试，锁定 16 型结果都有图片路径**

```javascript
import test from "node:test";
import assert from "node:assert/strict";
import { RESULTS } from "../js/data/content.js";
import { getResultImagePath } from "../js/data/resultAssets.js";

test("every result resolves to a local meme image path", () => {
  const paths = RESULTS.map((item) => getResultImagePath(item));

  assert.equal(paths.length, 16);
  assert.ok(paths.every((value) => value.startsWith("./resources/personalities-main/")));
  assert.equal(new Set(paths).size, 16);
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `node --test tests/resultAssets.test.mjs`
Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `../js/data/resultAssets.js`

- [ ] **Step 3: 写最小实现，建立显式映射表**

```javascript
const RESULT_IMAGE_MAP = {
  "01": "./resources/personalities-main/11 权威猫.png",
  "02": "./resources/personalities-main/05 打工猫.png",
  "03": "./resources/personalities-main/14 土豪猫.png",
  "04": "./resources/personalities-main/08 巴拿拿猫.png",
  "05": "./resources/personalities-main/06 超级无敌宇宙大美猫.png",
  "06": "./resources/personalities-main/04 学习猫.png",
  "07": "./resources/personalities-main/03 我说我是猫.png",
  "08": "./resources/personalities-main/16 可爱喵.png",
  "09": "./resources/personalities-main/02 邪恶银渐层.png",
  "10": "./resources/personalities-main/12 哈气猫.png",
  "11": "./resources/personalities-main/13 嘲讽猫.png",
  "12": "./resources/personalities-main/10 命苦猫.png",
  "13": "./resources/personalities-main/01 西格玛猫.png",
  "14": "./resources/personalities-main/07 念念叨叨气猫猫.png",
  "15": "./resources/personalities-main/09 huh 猫.png",
  "16": "./resources/personalities-main/15 落汤喵.png"
};

export function getResultImagePath(result) {
  return RESULT_IMAGE_MAP[result.id] ?? "";
}
```

- [ ] **Step 4: 运行测试确认通过**

Run: `node --test tests/resultAssets.test.mjs tests/content.test.mjs`
Expected: PASS with `4` tests passed

- [ ] **Step 5: 提交**

```bash
git add js/data/resultAssets.js tests/resultAssets.test.mjs
git commit -m "feat: map meme images to result cards"
```

## Task 2: 结果页模板接入 meme 图并支持降级

**Files:**
- Modify: `d:\Develop\Project\work_hks\js\ui\templates.js`
- Modify: `d:\Develop\Project\work_hks\tests\templates.test.mjs`

- [ ] **Step 1: 先扩展模板测试，要求结果页输出图片节点与新顺序**

```javascript
test("renderResultView places meme image before result title", () => {
  const html = renderResultView({
    result: {
      name: "学习猫",
      tagline: "认真生长、稳定进步的自律小猫",
      description: "你做事不一定最快，但通常很稳。",
      shareText: "测出学习猫，合理，我的人生主线果然是默默升级。"
    },
    auxiliaryText: "你看起来很稳，其实很多东西都被你默默扛住了。",
    resultImage: {
      src: "./resources/personalities-main/04 学习猫.png",
      alt: "学习猫 meme 图"
    }
  });

  assert.match(html, /你的猫BTI结果是/);
  assert.match(html, /<img[^>]*学习猫 meme 图/);
  assert.ok(html.indexOf("学习猫 meme 图") < html.indexOf("<h1>学习猫<\/h1>"));
});

test("renderResultView omits image card when result image is unavailable", () => {
  const html = renderResultView({
    result: {
      name: "学习猫",
      tagline: "认真生长、稳定进步的自律小猫",
      description: "你做事不一定最快，但通常很稳。",
      shareText: "测出学习猫，合理，我的人生主线果然是默默升级。"
    },
    auxiliaryText: "你看起来很稳，其实很多东西都被你默默扛住了。",
    resultImage: null
  });

  assert.doesNotMatch(html, /result-image-card/);
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `node --test tests/templates.test.mjs`
Expected: FAIL because `renderResultView()` does not render `resultImage`

- [ ] **Step 3: 写最小模板实现**

```javascript
export function renderResultView({ result, auxiliaryText, resultImage }) {
  const imageMarkup = resultImage
    ? `
      <figure class="result-image-card">
        <img class="result-image" src="${resultImage.src}" alt="${resultImage.alt}" />
      </figure>
    `
    : "";

  return `
    <section class="panel result-card">
      <p class="eyebrow">你的猫BTI结果是</p>
      ${imageMarkup}
      <h1>${result.name}</h1>
      <p class="tagline">${result.tagline}</p>
      <div class="result-hero">
        <div class="result-chip">${result.name}</div>
        <p class="share-line">${result.shareText}</p>
      </div>
      <p class="description">${result.description}</p>
      <p class="auxiliary">${auxiliaryText}</p>
      <div class="result-actions">
        <button type="button" data-action="open-share">生成分享图</button>
        <button type="button" class="ghost-button" data-action="restart-quiz">重新测试</button>
      </div>
    </section>
  `;
}
```

- [ ] **Step 4: 运行测试确认通过**

Run: `node --test tests/templates.test.mjs`
Expected: PASS with updated template assertions

- [ ] **Step 5: 提交**

```bash
git add js/ui/templates.js tests/templates.test.mjs
git commit -m "feat: render meme image in result view"
```

## Task 3: 主控制器接入图片路径与加载失败降级

**Files:**
- Modify: `d:\Develop\Project\work_hks\js\main.js`
- Modify: `d:\Develop\Project\work_hks\tests\templates.test.mjs`
- Test: `d:\Develop\Project\work_hks\tests\resultAssets.test.mjs`

- [ ] **Step 1: 先写针对 view model 的失败测试或最小断言**

在 `tests/templates.test.mjs` 追加一条针对 `resultImage` 结构的模板输入断言：

```javascript
test("renderResultView accepts a local image descriptor", () => {
  const html = renderResultView({
    result: {
      name: "权威猫",
      tagline: "地盘感很强的控场型大猫",
      description: "你身上有一种天然的别吵我来定气场。",
      shareText: "测出权威猫的我，连空气都得先过来汇报工作。"
    },
    auxiliaryText: "你不是没脾气，你只是平时懒得随便亮爪。",
    resultImage: {
      src: "./resources/personalities-main/11 权威猫.png",
      alt: "权威猫 meme 图"
    }
  });

  assert.match(html, /11 权威猫\.png/);
});
```

- [ ] **Step 2: 运行测试确认当前主流程还没把图片喂给模板**

Run: `node --test tests/templates.test.mjs tests/resultAssets.test.mjs`
Expected: PASS on template-level assertions only, then inspect `js/main.js` and confirm no `resultImage` is passed to `renderResultView()`

- [ ] **Step 3: 在主控制器中接入图片路径和图片错误降级状态**

```javascript
import { getResultImagePath } from "./data/resultAssets.js";

let hiddenResultImages = new Set();

function buildResultImage(result) {
  const src = getResultImagePath(result);
  if (!src || hiddenResultImages.has(result.id)) {
    return null;
  }

  return {
    src,
    alt: `${result.name} meme 图`
  };
}

function computeResultViewModel() {
  // keep current result logic...
  return {
    result,
    typeCode,
    auxiliaryCode,
    auxiliaryText: AUXILIARY_COPY[auxiliaryCode] ?? "",
    resultImage: buildResultImage(result)
  };
}

document.addEventListener("error", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLImageElement) || !target.classList.contains("result-image")) {
    return;
  }

  const resultId = target.dataset.resultId;
  if (resultId) {
    hiddenResultImages.add(resultId);
    render();
  }
}, true);
```

并确保模板中的图片节点带上 `data-result-id="${result.id}"`。

- [ ] **Step 4: 运行回归测试**

Run: `node --test tests/templates.test.mjs tests/resultAssets.test.mjs tests/state.test.mjs`
Expected: PASS

- [ ] **Step 5: 提交**

```bash
git add js/main.js js/ui/templates.js tests/templates.test.mjs tests/resultAssets.test.mjs
git commit -m "feat: connect result meme images to app state"
```

## Task 4: 流式响应式样式重构

**Files:**
- Modify: `d:\Develop\Project\work_hks\css\style.css`
- Modify: `d:\Develop\Project\work_hks\js\ui\templates.js`

- [ ] **Step 1: 明确要改的结构钩子**

如果样式需要新的布局节点，先在模板中加清晰类名，例如：

```javascript
<section class="panel result-card result-card-flow">
  <p class="eyebrow">你的猫BTI结果是</p>
  ${imageMarkup}
  <header class="result-copy-head">
    <h1>${result.name}</h1>
    <p class="tagline">${result.tagline}</p>
  </header>
  <div class="result-hero">
    <div class="result-chip">${result.name}</div>
    <p class="share-line">${result.shareText}</p>
  </div>
  <div class="result-copy-body">
    <p class="description">${result.description}</p>
    <p class="auxiliary">${auxiliaryText}</p>
  </div>
</section>
```

- [ ] **Step 2: 先调整 CSS，替换固定窄屏尺寸为流式尺寸**

```css
.app {
  width: min(100% - 24px, 42rem);
  min-height: 100dvh;
  margin: 0 auto;
  padding: clamp(16px, 3vw, 32px) clamp(12px, 3vw, 28px) clamp(24px, 4vw, 40px);
}

.panel {
  border-radius: clamp(20px, 2.6vw, 28px);
}

h1 {
  font-size: clamp(1.9rem, 4vw, 2.8rem);
}

h2 {
  font-size: clamp(1.35rem, 3vw, 2rem);
}

button {
  min-height: clamp(52px, 7vw, 62px);
}

.result-image-card {
  margin: clamp(14px, 2.5vw, 24px) 0;
  border-radius: clamp(18px, 2.5vw, 28px);
  overflow: hidden;
  background: rgba(255, 255, 255, 0.78);
  border: 1px solid rgba(62, 43, 31, 0.08);
}

.result-image {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: contain;
  background: #fff7ea;
}

@media (min-width: 700px) {
  .app {
    width: min(100% - 48px, 52rem);
  }

  .result-actions {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .share-overlay {
    width: min(100%, 640px);
  }
}
```

- [ ] **Step 3: 补充首页和答题页的流式尺寸**

```css
.home-card,
.quiz-card,
.result-card,
.error-card,
.share-overlay {
  padding: clamp(18px, 3vw, 30px);
}

.brand-icon {
  width: min(62vw, 320px);
}

.option-button {
  padding: clamp(14px, 2.2vw, 18px) clamp(14px, 2.4vw, 20px);
}
```

- [ ] **Step 4: 运行测试并做 bundle 回归**

Run: `node --test && npm run build:bundle`
Expected: PASS, bundle rebuild succeeds

- [ ] **Step 5: 提交**

```bash
git add css/style.css js/ui/templates.js
git commit -m "feat: improve responsive layout for phones and ipad portrait"
```

## Task 5: 双入口与最终回归

**Files:**
- Modify: `d:\Develop\Project\work_hks\index.html`
- Modify: `d:\Develop\Project\work_hks\index.dev.html`
- Modify: `d:\Develop\Project\work_hks\tests\entryFiles.test.mjs`
- Modify: `d:\Develop\Project\work_hks\package.json`

- [ ] **Step 1: 若新增壳层节点，先更新双入口文件**

确保两份入口 HTML 保持同一结构，只允许脚本标签不同，例如：

```html
<body>
  <div class="app-shell">
    <canvas id="bg-canvas" aria-hidden="true"></canvas>
    <main id="app" class="app" aria-live="polite"></main>
    <canvas
      id="share-canvas"
      class="hidden-canvas"
      width="1080"
      height="1920"
    ></canvas>
  </div>
  <script type="module" src="./js/main.js"></script>
</body>
```

```html
<body>
  <div class="app-shell">
    <canvas id="bg-canvas" aria-hidden="true"></canvas>
    <main id="app" class="app" aria-live="polite"></main>
    <canvas
      id="share-canvas"
      class="hidden-canvas"
      width="1080"
      height="1920"
    ></canvas>
  </div>
  <script src="./js/app.bundle.js"></script>
</body>
```

- [ ] **Step 2: 如有新增壳层节点，更新一致性测试**

```javascript
function normalizeIndexHtml(source) {
  return source
    .replace(/<script[^>]*><\/script>/, "<script></script>")
    .replace(/\r\n/g, "\n")
    .trim();
}
```

若新增包裹节点，不要放宽断言范围，只同步 fixture。

- [ ] **Step 3: 跑完整回归**

Run: `node --test`
Expected: PASS with all tests green

Run: `npm run build:bundle`
Expected: bundle generated at `js/app.bundle.js`

Run: `Start-Process .\index.dev.html`
Expected: offline bundle entry opens without `file://` module CORS error

- [ ] **Step 4: 手动验收清单**

在浏览器中至少检查以下尺寸：

```text
360 x 780
390 x 844
430 x 932
768 x 1024
```

验收点：

- 无横向滚动
- 结果图完整显示
- 标题、tagline、正文和按钮不互相挤压
- `生成分享图` 和 `重新测试` 在较宽设备上布局自然
- 图片缺失时结果页仍能渲染

- [ ] **Step 5: 提交**

```bash
git add index.html index.dev.html tests/entryFiles.test.mjs js/app.bundle.js
git commit -m "test: verify responsive meme result entry flow"
```

## 自检

- 已覆盖 spec 中的两大目标：流式适配与结果页 meme 图接入
- 已为图片映射、模板接图、主控制器、样式、双入口回归分别设任务
- 计划中没有 `TODO`、`TBD`、`类似上一步` 这类占位描述
- 所有步骤都给出了明确文件、命令或代码片段

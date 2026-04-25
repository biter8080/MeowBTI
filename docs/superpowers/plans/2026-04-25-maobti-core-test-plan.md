# 猫BTI 核心测试版 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个纯离线、移动端优先的 `猫BTI` 核心测试版，支持 `24` 题答题、`16` 型结果判定、`E/P` 副文案、本地进度恢复和离线分享图导出。

**Architecture:** 采用单页应用结构，使用原生 ES Modules 组织代码。把题库、判题、状态流转、分享图布局拆成可在 Node 中测试的纯函数模块，再用 `js/main.js` 负责 DOM 挂载、事件绑定和本地存储接线，Canvas 仅承担背景氛围和分享图渲染。

**Tech Stack:** HTML5, CSS3, Vanilla JavaScript ES Modules, Canvas 2D, `localStorage`, Node built-in `node:test`

---

## File Map

- Create: `package.json`
- Create: `index.html`
- Create: `css/style.css`
- Create: `js/data/content.js`
- Create: `js/core/engine.js`
- Create: `js/core/state.js`
- Create: `js/ui/templates.js`
- Create: `js/ui/background.js`
- Create: `js/ui/shareCard.js`
- Create: `js/main.js`
- Create: `tests/content.test.mjs`
- Create: `tests/engine.test.mjs`
- Create: `tests/state.test.mjs`
- Create: `tests/templates.test.mjs`
- Create: `tests/shareCard.test.mjs`

## Task 1: 建立离线壳层与首页模板

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `css/style.css`
- Create: `js/ui/templates.js`
- Create: `js/main.js`
- Test: `tests/templates.test.mjs`

- [ ] **Step 1: 写首页模板的失败测试**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { renderHomeView } from "../js/ui/templates.js";

test("renderHomeView renders CTA and disclaimer copy", () => {
  const html = renderHomeView({ completedCount: 16 });
  assert.match(html, /开始测试/);
  assert.match(html, /结果仅供娱乐/);
  assert.match(html, /16种猫格/);
});
```

- [ ] **Step 2: 运行测试，确认当前失败**

Run:

```bash
node --test tests/templates.test.mjs
```

Expected: FAIL with `Cannot find module '../js/ui/templates.js'` or equivalent import error.

- [ ] **Step 3: 写最小实现，建立项目壳层**

`package.json`

```json
{
  "name": "maobti-core-test",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "node --test"
  }
}
```

`index.html`

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width,initial-scale=1,viewport-fit=cover"
    />
    <title>猫BTI</title>
    <link rel="stylesheet" href="./css/style.css" />
  </head>
  <body>
    <div class="app-shell">
      <canvas id="bg-canvas" aria-hidden="true"></canvas>
      <main id="app" class="app" aria-live="polite"></main>
      <canvas id="share-canvas" class="hidden-canvas" width="1080" height="1920"></canvas>
    </div>
    <script type="module" src="./js/main.js"></script>
  </body>
</html>
```

`css/style.css`

```css
:root {
  --bg: #fff8ec;
  --panel: rgba(255, 255, 255, 0.88);
  --ink: #3e2b1f;
  --accent: #ffcf45;
  --accent-deep: #ff9f1c;
  --pink: #ffa7b6;
  --shadow: 0 18px 40px rgba(94, 61, 25, 0.14);
}

* { box-sizing: border-box; }
html, body { margin: 0; min-height: 100%; background: var(--bg); color: var(--ink); }
body { font-family: "Segoe UI", "PingFang SC", sans-serif; overflow-x: hidden; }
.app-shell { position: relative; min-height: 100dvh; }
#bg-canvas { position: fixed; inset: 0; width: 100%; height: 100%; z-index: 0; }
.app {
  position: relative;
  z-index: 1;
  width: min(100vw, 480px);
  min-height: 100dvh;
  margin: 0 auto;
  padding: 20px 16px 32px;
}
.panel {
  background: var(--panel);
  border-radius: 24px;
  box-shadow: var(--shadow);
  backdrop-filter: blur(10px);
}
.hidden-canvas { position: absolute; width: 0; height: 0; opacity: 0; pointer-events: none; }
```

`js/ui/templates.js`

```js
export function renderHomeView({ completedCount }) {
  return `
    <section class="panel home-card">
      <img class="brand-icon" src="./icon.png" alt="猫BTI" />
      <p class="eyebrow">离线猫格测试</p>
      <h1>测一测你是哪种猫猫人格</h1>
      <p class="subtitle">24题轻测试，结果仅供娱乐，但很适合截图发朋友。</p>
      <p class="meta">当前已整理 ${completedCount} 种猫格结果卡。</p>
      <button type="button" data-action="start-quiz">开始测试</button>
      <p class="footnote">结果仅供娱乐，请按心情吸猫。</p>
    </section>
  `;
}
```

`js/main.js`

```js
import { renderHomeView } from "./ui/templates.js";

function mountHome() {
  const app = document.querySelector("#app");
  app.innerHTML = renderHomeView({ completedCount: 16 });
}

mountHome();
```

- [ ] **Step 4: 重新运行模板测试，确认通过**

Run:

```bash
node --test tests/templates.test.mjs
```

Expected: PASS with `1 test` passed.

- [ ] **Step 5: 手动打开页面，确认首页可离线显示**

Run:

```bash
Start-Process .\index.html
```

Expected: 浏览器直接打开本地 `index.html`，看到 `icon.png`、标题、CTA 按钮和免责声明。

- [ ] **Step 6: 提交这一小步**

```bash
git add package.json index.html css/style.css js/ui/templates.js js/main.js tests/templates.test.mjs
git commit -m "feat: scaffold maobti offline shell"
```

## Task 2: 编码题库、结果文案和辅助副文案配置

**Files:**
- Create: `js/data/content.js`
- Create: `tests/content.test.mjs`

- [ ] **Step 1: 写配置完整性的失败测试**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { QUESTIONS, RESULTS, AUXILIARY_COPY } from "../js/data/content.js";

test("QUESTIONS contains 24 prompts with unique ids", () => {
  assert.equal(QUESTIONS.length, 24);
  assert.equal(new Set(QUESTIONS.map((item) => item.id)).size, 24);
  assert.ok(QUESTIONS.every((item) => item.options.length === 4));
});

test("RESULTS contains 16 type definitions with unique type codes", () => {
  assert.equal(RESULTS.length, 16);
  assert.equal(new Set(RESULTS.map((item) => item.typeCode)).size, 16);
});

test("AUXILIARY_COPY exposes all four E/P combinations", () => {
  assert.deepEqual(Object.keys(AUXILIARY_COPY).sort(), [
    "E+P+",
    "E+P-",
    "E-P+",
    "E-P-"
  ]);
});
```

- [ ] **Step 2: 运行测试，确认当前失败**

Run:

```bash
node --test tests/content.test.mjs
```

Expected: FAIL with missing module error for `js/data/content.js`.

- [ ] **Step 3: 写最小实现，录入全部配置**

`js/data/content.js`

```js
const DEFAULT_SCORE_MAP = { A: 2, B: 1, C: -1, D: -2 };

export const QUESTIONS = [
  {
    id: "Q1",
    dimension: "S",
    prompt: "进到一个半生不熟的局，你一般是立刻巡视领地，还是先找地方窝着？",
    options: [
      { key: "A", text: "直接融进去，哪里热闹往哪里去" },
      { key: "B", text: "先和一两个人聊，熟了就自然放开" },
      { key: "C", text: "先观察气氛，确认舒服再慢慢加入" },
      { key: "D", text: "先找个安全角落，没必要不会主动营业" }
    ],
    scoreMap: DEFAULT_SCORE_MAP,
    themeTag: "social"
  }
];

export const RESULTS = [
  {
    id: "01",
    typeCode: "S+A+O+D+",
    name: "权威猫",
    tagline: "地盘感很强的控场型大猫",
    description: "你身上有一种天然的“别吵，我来定”的气场。",
    shareText: "测出权威猫的我，连空气都得先过来汇报工作。",
    catnipText: "属于你的猫薄荷，是那种看别人一顿乱忙，最后还得你出来收场的内容。",
    collectionText: "你已解锁权威猫，今日地盘巡逻权归你所有。",
    memeKey: "authority-cat",
    accentColor: "#ffb300",
    cardStyle: "leader"
  }
];

export const AUXILIARY_COPY = {
  "E+P+": "你不是没脾气，你只是平时懒得随便亮爪。",
  "E+P-": "你的情绪都写在脸上，累了也只想先躲起来缓缓。",
  "E-P+": "你看起来很稳，其实很多东西都被你默默扛住了。",
  "E-P-": "你习惯把情绪收好，等回到自己的窝里再慢慢处理。"
};
```

在这一编辑里，把 `Q2` 到 `Q24` 的题目对象和剩余 `15` 个结果对象一并写入同一个文件，顺序、文案和 `typeCode` 全部以 [2026-04-25-maobti-design.md](file:///d:/Develop/Project/work_hks/docs/superpowers/specs/2026-04-25-maobti-design.md) 为准，不要在实际文件中保留任何省略写法。

- [ ] **Step 4: 运行配置测试，确认通过**

Run:

```bash
node --test tests/content.test.mjs
```

Expected: PASS with `3 tests` passed.

- [ ] **Step 5: 提交配置数据**

```bash
git add js/data/content.js tests/content.test.mjs
git commit -m "feat: add maobti content configuration"
```

## Task 3: 实现六维计分和结果解析引擎

**Files:**
- Create: `js/core/engine.js`
- Create: `tests/engine.test.mjs`

- [ ] **Step 1: 写判题引擎的失败测试**

```js
import test from "node:test";
import assert from "node:assert/strict";
import {
  createEmptyScores,
  applyAnswer,
  resolveTypeCode,
  resolveAuxiliaryCode
} from "../js/core/engine.js";

test("applyAnswer adds score to the targeted dimension", () => {
  const next = applyAnswer(createEmptyScores(), {
    dimension: "S",
    optionKey: "A",
    scoreMap: { A: 2, B: 1, C: -1, D: -2 }
  });

  assert.equal(next.S, 2);
  assert.equal(next.E, 0);
});

test("resolveTypeCode treats zero as positive", () => {
  const typeCode = resolveTypeCode({
    S: 0,
    A: -2,
    O: 3,
    D: -1,
    E: 0,
    P: 0
  });

  assert.equal(typeCode, "S+A-O+D-");
});

test("resolveAuxiliaryCode builds the expected E/P suffix", () => {
  const code = resolveAuxiliaryCode({
    S: 0,
    A: 0,
    O: 0,
    D: 0,
    E: -1,
    P: 5
  });

  assert.equal(code, "E-P+");
});
```

- [ ] **Step 2: 运行测试，确认当前失败**

Run:

```bash
node --test tests/engine.test.mjs
```

Expected: FAIL with missing module error for `js/core/engine.js`.

- [ ] **Step 3: 写最小实现，让判题规则落地**

`js/core/engine.js`

```js
const DIMENSIONS = ["S", "E", "A", "O", "D", "P"];

export function createEmptyScores() {
  return Object.fromEntries(DIMENSIONS.map((key) => [key, 0]));
}

export function applyAnswer(scores, question) {
  const next = { ...scores };
  next[question.dimension] += question.scoreMap[question.optionKey];
  return next;
}

function axisSuffix(value) {
  return value >= 0 ? "+" : "-";
}

export function resolveTypeCode(scores) {
  return [
    `S${axisSuffix(scores.S)}`,
    `A${axisSuffix(scores.A)}`,
    `O${axisSuffix(scores.O)}`,
    `D${axisSuffix(scores.D)}`
  ].join("");
}

export function resolveAuxiliaryCode(scores) {
  return `E${axisSuffix(scores.E)}P${axisSuffix(scores.P)}`;
}

export function resolveResultByType(results, typeCode) {
  return results.find((item) => item.typeCode === typeCode) ?? null;
}
```

- [ ] **Step 4: 运行判题测试，并顺带回归配置测试**

Run:

```bash
node --test tests/engine.test.mjs tests/content.test.mjs
```

Expected: PASS with all engine and content tests green.

- [ ] **Step 5: 提交引擎模块**

```bash
git add js/core/engine.js tests/engine.test.mjs
git commit -m "feat: add maobti scoring engine"
```

## Task 4: 实现答题状态机和本地存储恢复

**Files:**
- Create: `js/core/state.js`
- Create: `tests/state.test.mjs`

- [ ] **Step 1: 写状态流转的失败测试**

```js
import test from "node:test";
import assert from "node:assert/strict";
import {
  createInitialState,
  answerQuestion,
  goBackOneQuestion,
  loadSession
} from "../js/core/state.js";

const questions = [
  { id: "Q1", dimension: "S", scoreMap: { A: 2, B: 1, C: -1, D: -2 } },
  { id: "Q2", dimension: "E", scoreMap: { A: 2, B: 1, C: -1, D: -2 } }
];

test("answerQuestion records answer, updates score and advances index", () => {
  const state = createInitialState();
  const next = answerQuestion(state, questions, "Q1", "B");

  assert.equal(next.currentQuestionIndex, 1);
  assert.equal(next.answers.Q1, "B");
  assert.equal(next.scores.S, 1);
});

test("goBackOneQuestion reverses the last score contribution", () => {
  const first = answerQuestion(createInitialState(), questions, "Q1", "A");
  const previous = goBackOneQuestion(first, questions);

  assert.equal(previous.currentQuestionIndex, 0);
  assert.equal(previous.answers.Q1, undefined);
  assert.equal(previous.scores.S, 0);
});

test("loadSession returns a safe fallback for broken JSON", () => {
  const storage = { getItem: () => "{broken" };
  const state = loadSession(storage);
  assert.equal(state.currentQuestionIndex, 0);
});
```

- [ ] **Step 2: 运行测试，确认当前失败**

Run:

```bash
node --test tests/state.test.mjs
```

Expected: FAIL with missing module error for `js/core/state.js`.

- [ ] **Step 3: 写最小实现，封装状态和持久化**

`js/core/state.js`

```js
import { applyAnswer, createEmptyScores } from "./engine.js";

const STORAGE_KEY = "maobti.session";

export function createInitialState() {
  return {
    currentQuestionIndex: 0,
    answers: {},
    scores: createEmptyScores()
  };
}

function getQuestionById(questions, questionId) {
  return questions.find((item) => item.id === questionId);
}

export function answerQuestion(state, questions, questionId, optionKey) {
  const question = getQuestionById(questions, questionId);
  const nextScores = applyAnswer(state.scores, {
    dimension: question.dimension,
    optionKey,
    scoreMap: question.scoreMap
  });

  return {
    currentQuestionIndex: state.currentQuestionIndex + 1,
    answers: { ...state.answers, [questionId]: optionKey },
    scores: nextScores
  };
}

export function goBackOneQuestion(state, questions) {
  const previousIndex = Math.max(0, state.currentQuestionIndex - 1);
  const previousQuestion = questions[previousIndex];
  const previousOptionKey = state.answers[previousQuestion.id];

  if (!previousOptionKey) {
    return { ...state, currentQuestionIndex: previousIndex };
  }

  const revertedScores = {
    ...state.scores,
    [previousQuestion.dimension]:
      state.scores[previousQuestion.dimension] -
      previousQuestion.scoreMap[previousOptionKey]
  };

  const nextAnswers = { ...state.answers };
  delete nextAnswers[previousQuestion.id];

  return {
    currentQuestionIndex: previousIndex,
    answers: nextAnswers,
    scores: revertedScores
  };
}

export function saveSession(storage, state) {
  storage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function loadSession(storage) {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : createInitialState();
  } catch {
    return createInitialState();
  }
}

export function clearSession(storage) {
  storage.removeItem(STORAGE_KEY);
}
```

- [ ] **Step 4: 运行状态测试和全部纯函数测试**

Run:

```bash
node --test tests/state.test.mjs tests/engine.test.mjs tests/content.test.mjs
```

Expected: PASS with all pure-logic tests green.

- [ ] **Step 5: 提交状态管理模块**

```bash
git add js/core/state.js tests/state.test.mjs
git commit -m "feat: add quiz state and persistence helpers"
```

## Task 5: 扩展模板和主控制器，打通首页、答题页、结果页

**Files:**
- Modify: `js/ui/templates.js`
- Modify: `js/main.js`
- Modify: `css/style.css`
- Modify: `index.html`
- Modify: `tests/templates.test.mjs`

- [ ] **Step 1: 写答题页和结果页模板的失败测试**

```js
import test from "node:test";
import assert from "node:assert/strict";
import {
  renderQuizView,
  renderResultView
} from "../js/ui/templates.js";

test("renderQuizView includes question progress and four choices", () => {
  const html = renderQuizView({
    index: 0,
    total: 24,
    question: {
      prompt: "今天状态特别好时，你更像会主动去窗边晒自己，还是默默觉得自己真不错？",
      options: [
        { key: "A", text: "会主动展示" },
        { key: "B", text: "有人注意到也挺开心" },
        { key: "C", text: "自己知道就够了" },
        { key: "D", text: "我更想低调点" }
      ]
    }
  });

  assert.match(html, /1 \/ 24/);
  assert.equal((html.match(/data-option-key=/g) || []).length, 4);
});

test("renderResultView includes result title, auxiliary copy and actions", () => {
  const html = renderResultView({
    result: {
      name: "打工猫",
      tagline: "嘴上想辞职，行动上最能扛",
      description: "你是那种一边喊累，一边把活默默做完的人。",
      shareText: "测出来是打工猫，很合理。"
    },
    auxiliaryText: "你看起来很稳，其实很多东西都被你默默扛住了。"
  });

  assert.match(html, /打工猫/);
  assert.match(html, /生成分享图/);
  assert.match(html, /重新测试/);
});
```

- [ ] **Step 2: 运行模板测试，确认当前失败**

Run:

```bash
node --test tests/templates.test.mjs
```

Expected: FAIL because `renderQuizView` and `renderResultView` are not exported yet.

- [ ] **Step 3: 扩展模板模块和主控制器**

`js/ui/templates.js`

```js
export function renderQuizView({ index, total, question }) {
  const options = question.options
    .map(
      (option) => `
        <button type="button" class="option-button" data-option-key="${option.key}">
          <span class="option-key">${option.key}</span>
          <span>${option.text}</span>
        </button>
      `
    )
    .join("");

  return `
    <section class="panel quiz-card">
      <div class="progress-meta">
        <span>${index + 1} / ${total}</span>
        <button type="button" data-action="go-back">上一题</button>
      </div>
      <div class="progress-bar"><i style="width:${((index + 1) / total) * 100}%"></i></div>
      <h2>${question.prompt}</h2>
      <div class="option-list">${options}</div>
    </section>
  `;
}

export function renderResultView({ result, auxiliaryText }) {
  return `
    <section class="panel result-card">
      <p class="eyebrow">你的猫BTI结果是</p>
      <h1>${result.name}</h1>
      <p class="tagline">${result.tagline}</p>
      <div class="result-hero">
        <div class="badge">${result.name}</div>
        <p>${result.shareText}</p>
      </div>
      <p class="description">${result.description}</p>
      <p class="auxiliary">${auxiliaryText}</p>
      <div class="result-actions">
        <button type="button" data-action="open-share">生成分享图</button>
        <button type="button" data-action="restart-quiz" class="ghost">重新测试</button>
      </div>
    </section>
  `;
}
```

`js/main.js`

```js
import { QUESTIONS, RESULTS, AUXILIARY_COPY } from "./data/content.js";
import { resolveAuxiliaryCode, resolveResultByType, resolveTypeCode } from "./core/engine.js";
import { answerQuestion, clearSession, createInitialState, goBackOneQuestion, loadSession, saveSession } from "./core/state.js";
import { renderHomeView, renderQuizView, renderResultView } from "./ui/templates.js";

let mode = "home";
let quizState = loadSession(window.localStorage);
let finalViewModel = null;

function computeResultViewModel() {
  const typeCode = resolveTypeCode(quizState.scores);
  const auxiliaryCode = resolveAuxiliaryCode(quizState.scores);
  return {
    result: resolveResultByType(RESULTS, typeCode),
    auxiliaryText: AUXILIARY_COPY[auxiliaryCode]
  };
}

function render() {
  const app = document.querySelector("#app");

  if (mode === "home") {
    app.innerHTML = renderHomeView({ completedCount: RESULTS.length });
    return;
  }

  if (mode === "quiz") {
    app.innerHTML = renderQuizView({
      index: quizState.currentQuestionIndex,
      total: QUESTIONS.length,
      question: QUESTIONS[quizState.currentQuestionIndex]
    });
    return;
  }

  finalViewModel = computeResultViewModel();
  app.innerHTML = renderResultView(finalViewModel);
}

document.addEventListener("click", (event) => {
  const target = event.target.closest("[data-action], [data-option-key]");
  if (!target) return;

  if (target.dataset.action === "start-quiz") {
    mode = "quiz";
    quizState = createInitialState();
    saveSession(window.localStorage, quizState);
    render();
    return;
  }

  if (target.dataset.optionKey) {
    const question = QUESTIONS[quizState.currentQuestionIndex];
    quizState = answerQuestion(quizState, QUESTIONS, question.id, target.dataset.optionKey);
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
    mode = "home";
    render();
  }
});

render();
```

- [ ] **Step 4: 运行模板测试和纯函数测试**

Run:

```bash
node --test tests/templates.test.mjs tests/content.test.mjs tests/engine.test.mjs tests/state.test.mjs
```

Expected: PASS with all tests green.

- [ ] **Step 5: 手动跑完整链路**

Run:

```bash
Start-Process .\index.html
```

Expected:

- 首页点击 `开始测试` 可以进入题目
- 选择任一选项后自动前进
- `上一题` 可以撤回最近一题
- 答完第 `24` 题后进入结果页

- [ ] **Step 6: 提交主流程**

```bash
git add index.html css/style.css js/ui/templates.js js/main.js tests/templates.test.mjs
git commit -m "feat: wire quiz flow and result rendering"
```

## Task 6: 实现 Canvas 背景和分享图模型

**Files:**
- Create: `js/ui/background.js`
- Create: `js/ui/shareCard.js`
- Create: `tests/shareCard.test.mjs`
- Modify: `js/main.js`

- [ ] **Step 1: 写分享图布局模型的失败测试**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { buildShareCardModel } from "../js/ui/shareCard.js";

test("buildShareCardModel returns share-safe lines and theme", () => {
  const model = buildShareCardModel({
    result: {
      name: "学习猫",
      tagline: "认真生长、稳定进步的自律小猫",
      shareText: "测出学习猫，合理，我的人生主线果然是默默升级。",
      accentColor: "#ffd54a"
    },
    auxiliaryText: "你看起来很稳，其实很多东西都被你默默扛住了。"
  });

  assert.equal(model.title, "学习猫");
  assert.equal(model.theme.accent, "#ffd54a");
  assert.ok(model.lines.length >= 3);
});
```

- [ ] **Step 2: 运行测试，确认当前失败**

Run:

```bash
node --test tests/shareCard.test.mjs
```

Expected: FAIL with missing module error for `js/ui/shareCard.js`.

- [ ] **Step 3: 写分享图模型和绘制器，再接入背景动画**

`js/ui/shareCard.js`

```js
export function buildShareCardModel({ result, auxiliaryText }) {
  return {
    title: result.name,
    subtitle: result.tagline,
    lines: [
      "你的猫BTI结果是：",
      result.name,
      result.shareText,
      auxiliaryText
    ],
    theme: {
      accent: result.accentColor,
      ink: "#3e2b1f",
      panel: "#fffaf0"
    }
  };
}

export function drawShareCard(ctx, model, iconImage) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.fillStyle = "#fff4df";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.fillStyle = model.theme.panel;
  ctx.fillRoundRect?.(64, 180, 952, 1440, 48);
  ctx.fillStyle = model.theme.ink;
  ctx.font = "bold 82px sans-serif";
  ctx.fillText(model.title, 96, 420);
  ctx.font = "42px sans-serif";
  model.lines.forEach((line, index) => {
    ctx.fillText(line, 96, 560 + index * 96);
  });

  if (iconImage) {
    ctx.drawImage(iconImage, 740, 240, 220, 220);
  }
}
```

`js/ui/background.js`

```js
export function startBackground(canvas) {
  const ctx = canvas.getContext("2d");
  const particles = Array.from({ length: 16 }, (_, index) => ({
    x: (index + 1) * 24,
    y: (index + 1) * 32,
    size: 8 + (index % 4) * 4
  }));

  function resize() {
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
    ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
  }

  function frame() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.fillStyle = "rgba(255, 207, 69, 0.18)";
    for (const particle of particles) {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      particle.y += 0.35;
      if (particle.y > window.innerHeight + 24) particle.y = -24;
    }
    requestAnimationFrame(frame);
  }

  resize();
  window.addEventListener("resize", resize);
  requestAnimationFrame(frame);
}
```

Update `js/main.js` to:

```js
import { startBackground } from "./ui/background.js";
import { buildShareCardModel, drawShareCard } from "./ui/shareCard.js";

const bgCanvas = document.querySelector("#bg-canvas");
const shareCanvas = document.querySelector("#share-canvas");
startBackground(bgCanvas);

function openShare() {
  const model = buildShareCardModel(finalViewModel);
  const ctx = shareCanvas.getContext("2d");
  const image = new Image();

  image.onload = () => {
    drawShareCard(ctx, model, image);
    const link = document.createElement("a");
    link.download = `maobti-${model.title}.png`;
    link.href = shareCanvas.toDataURL("image/png");
    link.click();
  };

  image.onerror = () => {
    drawShareCard(ctx, model, null);
  };

  image.src = "./icon.png";
}
```

- [ ] **Step 4: 运行分享图模型测试和全部测试**

Run:

```bash
node --test tests/shareCard.test.mjs tests/templates.test.mjs tests/content.test.mjs tests/engine.test.mjs tests/state.test.mjs
```

Expected: PASS with all tests green.

- [ ] **Step 5: 手动验证背景和图片导出**

Run:

```bash
Start-Process .\index.html
```

Expected:

- 首页和结果页看到轻量背景动效
- 结果页点击 `生成分享图` 后成功下载一张 `.png`
- 即使 `icon.png` 加载失败，分享图仍可导出纯文字版本

- [ ] **Step 6: 提交 Canvas 能力**

```bash
git add js/ui/background.js js/ui/shareCard.js js/main.js tests/shareCard.test.mjs
git commit -m "feat: add canvas background and share export"
```

## Task 7: 补齐错误兜底、恢复策略和响应式收尾

**Files:**
- Modify: `js/ui/templates.js`
- Modify: `js/main.js`
- Modify: `css/style.css`
- Modify: `tests/templates.test.mjs`

- [ ] **Step 1: 写错误视图模板的失败测试**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { renderErrorView } from "../js/ui/templates.js";

test("renderErrorView prints the approved friendly fallback copy", () => {
  const html = renderErrorView("哎呀，出错了，请重启试试吧~");
  assert.match(html, /哎呀，出错了，请重启试试吧~/);
});
```

- [ ] **Step 2: 运行测试，确认当前失败**

Run:

```bash
node --test tests/templates.test.mjs
```

Expected: FAIL because `renderErrorView` is not exported yet.

- [ ] **Step 3: 写最小实现，收口异常和响应式细节**

Update `js/ui/templates.js`:

```js
export function renderErrorView(message) {
  return `
    <section class="panel error-card">
      <p class="eyebrow">猫爪打滑了</p>
      <h1>${message}</h1>
      <button type="button" data-action="reload-app">重新打开</button>
    </section>
  `;
}
```

Update `js/main.js`:

```js
import { renderErrorView } from "./ui/templates.js";

function renderError(message) {
  document.querySelector("#app").innerHTML = renderErrorView(message);
}

document.addEventListener("click", (event) => {
  const target = event.target.closest("[data-action='reload-app']");
  if (target) {
    window.location.reload();
  }
});

try {
  render();
} catch (error) {
  console.error(error);
  renderError("哎呀，出错了，请重启试试吧~");
}
```

Update `css/style.css`:

```css
.home-card,
.quiz-card,
.result-card,
.error-card {
  padding: 24px 20px;
}

.progress-bar {
  height: 10px;
  background: rgba(62, 43, 31, 0.08);
  border-radius: 999px;
  overflow: hidden;
}

.progress-bar i {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, var(--accent), var(--accent-deep));
  border-radius: inherit;
}

.option-list {
  display: grid;
  gap: 12px;
}

.option-button,
button {
  width: 100%;
  min-height: 52px;
  border: 0;
  border-radius: 16px;
  background: #fff;
  color: var(--ink);
}

@media (max-width: 375px) {
  .app { padding-inline: 12px; }
  h1 { font-size: 30px; }
  h2 { font-size: 22px; }
}
```

- [ ] **Step 4: 运行全量测试**

Run:

```bash
node --test
```

Expected: PASS with all `tests/*.mjs` green.

- [ ] **Step 5: 做最终手动验收**

Run:

```bash
Start-Process .\index.html
```

Check:

- `360px` 到 `430px` 宽度下无横向滚动
- 刷新页面后答题进度能恢复
- 重新测试能回到首页并清空旧结果
- 任何异常都会回落到 `哎呀，出错了，请重启试试吧~`
- 全程无网络请求

- [ ] **Step 6: 提交收尾改动**

```bash
git add css/style.css js/ui/templates.js js/main.js tests/templates.test.mjs
git commit -m "feat: finalize maobti offline experience"
```

## Self-Review

### Spec coverage

- 首页、答题页、结果页、分享层：Task 1, Task 5, Task 6
- `24` 题和 `16` 型数据配置：Task 2
- 六维计分、平局归正、`E/P` 副文案：Task 3
- 本地存储恢复和回退上一题：Task 4
- Canvas 背景与分享图：Task 6
- 错误兜底、移动端适配、离线运行：Task 1, Task 7

没有发现规格文档未覆盖的实现项。

### Placeholder scan

- 已检查计划正文，未保留 `TBD`、`TODO`、`implement later` 之类占位词。
- 所有任务都给出了明确文件路径、命令和预期结果。

### Type consistency

- 统一使用 `QUESTIONS`、`RESULTS`、`AUXILIARY_COPY`
- 统一使用 `createInitialState()`、`answerQuestion()`、`goBackOneQuestion()`
- 统一使用 `resolveTypeCode()`、`resolveAuxiliaryCode()`、`resolveResultByType()`
- 统一使用 `renderHomeView()`、`renderQuizView()`、`renderResultView()`、`renderErrorView()`

这些命名在各任务间保持一致，可以直接串起来实现。

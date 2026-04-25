# 猫BTI 手机宽度收口与结果图缩放 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 修正手机端左右溢出风险，并将结果图缩放到用户确认的 B 档中等占比。

**Architecture:** 不改业务逻辑，只收敛结果页与基础排版样式。通过更严格的容器宽度、文本换行保护和图片限宽策略，确保手机端只需要纵向滚动。

**Tech Stack:** HTML, CSS, JavaScript, Node `--test`, esbuild

---

### Task 1: 收紧手机端宽度规则

**Files:**
- Modify: `d:\Develop\Project\work_hks\css\style.css`

- [ ] **Step 1: 缩小手机端容器与卡片内边距**
- [ ] **Step 2: 为标题、正文、按钮和进度区补充换行保护**
- [ ] **Step 3: 保持宽屏增强规则不影响手机优先布局**

### Task 2: 将结果图缩放到 B 档

**Files:**
- Modify: `d:\Develop\Project\work_hks\css\style.css`

- [ ] **Step 1: 让结果图卡居中且不再占满整卡**
- [ ] **Step 2: 用手机优先 `max-width` 控制图片约为当前的 40% 档位**
- [ ] **Step 3: 保持图片完整显示，不裁切，不拉伸**

### Task 3: 回归验证

**Files:**
- Modify: `d:\Develop\Project\work_hks\js/app.bundle.js`

- [ ] **Step 1: 运行 `node --test`**
- [ ] **Step 2: 运行 `npm run build:bundle`**
- [ ] **Step 3: 用诊断检查已修改文件无新问题**

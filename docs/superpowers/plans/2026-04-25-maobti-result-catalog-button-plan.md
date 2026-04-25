# 猫BTI 结果页图鉴按钮调整 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在结果页加入 `我的图鉴` 按钮，并将四个操作按钮调整为指定顺序。

**Architecture:** 复用现有结果页 `result-actions` 按钮区和已接好的 `open-collection` 事件，不新增状态、不改图鉴数据结构。实现只落在模板输出和模板测试上，保证改动最小、回归风险最低。

**Tech Stack:** HTML template strings, JavaScript ES modules, Node `--test`

---

### Task 1: 结果页按钮顺序与入口

**Files:**
- Modify: `d:\Develop\Project\work_hks\js\ui\templates.js`
- Test: `d:\Develop\Project\work_hks\tests\templates.test.mjs`

- [ ] **Step 1: 先补按钮顺序测试**

```javascript
test("renderResultView keeps the requested action order", () => {
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

  assert.match(html, /我的图鉴/);
  assert.ok(html.indexOf("生成分享图") < html.indexOf("我的图鉴"));
  assert.ok(html.indexOf("我的图鉴") < html.indexOf("重新测试"));
  assert.ok(html.indexOf("重新测试") < html.indexOf("猫薄荷社区"));
});
```

- [ ] **Step 2: 运行模板测试并确认新用例先失败**

Run: `node --test tests/templates.test.mjs`
Expected: FAIL because result template still lacks `我的图鉴` and uses the old order

- [ ] **Step 3: 在结果页模板中插入图鉴按钮并重排顺序**

```javascript
<div class="result-actions">
  <button type="button" data-action="open-share">生成分享图</button>
  <button type="button" class="ghost-button" data-action="open-collection">我的图鉴</button>
  <button type="button" class="ghost-button" data-action="restart-quiz">重新测试</button>
  <button type="button" class="ghost-button" data-action="open-community">猫薄荷社区</button>
</div>
```

- [ ] **Step 4: 重新运行模板测试**

Run: `node --test tests/templates.test.mjs`
Expected: PASS and include the new order assertion

- [ ] **Step 5: 跑全量测试确认无回归**

Run: `node --test`
Expected: PASS

- [ ] **Step 6: 提交这次模板改动**

```bash
git add tests/templates.test.mjs js/ui/templates.js
git commit -m "feat: add catalog entry to result actions"
```

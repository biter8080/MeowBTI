import test from "node:test";
import assert from "node:assert/strict";
import {
  renderHomeView,
  renderErrorView,
  renderQuizView,
  renderResultView,
  renderShareOverlay
} from "../js/ui/templates.js";

test("renderHomeView renders CTA and disclaimer copy", () => {
  const html = renderHomeView({ completedCount: 16 });
  assert.match(html, /开始测试/);
  assert.match(html, /结果仅供娱乐/);
  assert.match(html, /16\s*种猫格/);
});

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

test("renderShareOverlay includes preview and download actions", () => {
  const html = renderShareOverlay({ resultName: "学习猫" });
  assert.match(html, /分享图预览/);
  assert.match(html, /保存图片/);
  assert.match(html, /关闭/);
});

test("renderErrorView prints the approved friendly fallback copy", () => {
  const html = renderErrorView("哎呀，出错了，请重启试试吧~");
  assert.match(html, /哎呀，出错了，请重启试试吧~/);
});

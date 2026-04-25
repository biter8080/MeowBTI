import test from "node:test";
import assert from "node:assert/strict";
import { loadAppScripts } from "./helpers/loadAppScripts.mjs";

const {
  renderCollectionDetailOverlay,
  renderCollectionLockedOverlay,
  renderCollectionView,
  renderCommunityView,
  renderHomeView,
  renderErrorView,
  renderGameView,
  renderQuizView,
  renderResultView,
  renderCommunityOverlay,
  renderShareOverlay,
  renderTestsView
} = await loadAppScripts();

test("renderHomeView renders CTA and disclaimer copy", () => {
  const html = renderHomeView({ completedCount: 16, unlockedCount: 3 });
  assert.match(html, /测测今天的喵BTI/);
  assert.match(html, /喵BTI图鉴/);
  assert.match(html, /已解锁\s*3\s*\/\s*16/);
  assert.match(html, /猫薄荷社区/);
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
      id: "02",
      name: "打工猫",
      tagline: "嘴上想辞职，行动上最能扛",
      description: "你是那种一边喊累，一边把活默默做完的人。",
      shareText: "很合理。"
    },
    auxiliaryText: "你看起来很稳，其实很多东西都被你默默扛住了。",
    resultImage: null
  });

  assert.match(html, /打工猫/);
  assert.match(html, /生成分享图/);
  assert.match(html, /我的图鉴/);
  assert.match(html, /猫薄荷社区/);
  assert.match(html, /重新测试/);
  assert.match(html, /已收录进你的图鉴/);
});

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

  assert.ok(html.indexOf("生成分享图") < html.indexOf("我的图鉴"));
  assert.ok(html.indexOf("我的图鉴") < html.indexOf("重新测试"));
  assert.ok(html.indexOf("重新测试") < html.indexOf("猫薄荷社区"));
});

test("renderResultView places meme image before result title", () => {
  const html = renderResultView({
    result: {
      id: "06",
      name: "学习猫",
      tagline: "认真生长、稳定进步的自律小猫",
      description: "你做事不一定最快，但通常很稳。",
      shareText: "合理，我的人生主线果然是默默升级。"
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
      id: "06",
      name: "学习猫",
      tagline: "认真生长、稳定进步的自律小猫",
      description: "你做事不一定最快，但通常很稳。",
      shareText: "合理，我的人生主线果然是默默升级。"
    },
    auxiliaryText: "你看起来很稳，其实很多东西都被你默默扛住了。",
    resultImage: null
  });

  assert.doesNotMatch(html, /result-image-card/);
});

test("renderCommunityOverlay explains the placeholder status", () => {
  const html = renderCommunityOverlay();
  assert.match(html, /猫薄荷社区/);
  assert.match(html, /demo 阶段此功能尚未开发/);
  assert.match(html, /我知道了/);
});

test("renderCollectionView renders locked and unlocked catalog cards", () => {
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
          src: "./resources/personalities-main/05 打工猫.png",
          alt: "打工猫 meme 图"
        }
      }
    ]
  });

  assert.match(html, /喵BTI图鉴/);
  assert.match(html, /已解锁\s*1\s*\/\s*2/);
  assert.equal((html.match(/data-collection-id=/g) || []).length, 2);
  assert.match(html, /\?\?\?/);
  assert.match(html, /打工猫/);
});

test("renderTestsView renders demo test cards", () => {
  const html = renderTestsView();

  assert.match(html, /其他测试/);
  assert.match(html, /你是哪种恋爱猫/);
  assert.match(html, /开始测试/);
  assert.match(html, /data-action="start-quiz"/);
});

test("renderCommunityView renders community placeholder page", () => {
  const html = renderCommunityView();

  assert.match(html, /猫薄荷社区/);
  assert.match(html, /分享你的猫薄荷/);
  assert.match(html, /同类推荐/);
});

test("renderGameView renders game placeholder page", () => {
  const html = renderGameView();

  assert.match(html, /游戏广场/);
  assert.match(html, /小游戏入口占位/);
  assert.match(html, /先去测一测/);
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
      src: "./resources/personalities-main/05 打工猫.png",
      alt: "打工猫 meme 图"
    }
  });

  assert.match(html, /图鉴详情/);
  assert.match(html, /打工猫/);
  assert.match(html, /嘴上想辞职/);
  assert.match(html, /data-action="close-collection-detail"/);
});

test("renderCollectionLockedOverlay explains the locked state", () => {
  const html = renderCollectionLockedOverlay();

  assert.match(html, /还没解锁/);
  assert.match(html, /这只猫还没解锁/);
  assert.match(html, /data-action="close-collection-locked"/);
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

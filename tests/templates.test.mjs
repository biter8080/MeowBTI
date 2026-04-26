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
  renderTestsView,
  renderGameDetailView,
  renderGameLeaderboardView,
  renderGamePlayView,
  renderInviteView,
  renderProfileView,
  renderCommunityPostView
} = await loadAppScripts();

test("renderHomeView renders CTA and disclaimer copy", () => {
  const html = renderHomeView({ completedCount: 16, unlockedCount: 3 });
  assert.match(html, /测测今天的喵BTI/);
  assert.match(html, /喵BTI图鉴/);
  assert.match(html, /已解锁\s*3\s*\/\s*16/);
  assert.match(html, /猫薄荷社区/);
  assert.match(html, /16\s*种猫格/);
});

test("renderQuizView includes question progress, four choices and option images", () => {
  const html = renderQuizView({
    index: 0,
    total: 25,
    question: {
      prompt: "喵喵喵喵喵喵喵喵？",
      options: [
        { key: "A", text: "喵喵喵喵，喵呜", image: "./resources/quiz-options/q01/a.png" },
        { key: "B", text: "喵呜，喵喵喵喵", image: "./resources/quiz-options/q01/b.png" },
        { key: "C", text: "喵呜", image: "./resources/quiz-options/q01/c.png" },
        { key: "D", text: "喵喵呜", image: "./resources/quiz-options/q01/d.png" }
      ]
    }
  });

  assert.match(html, /1 \/ 25/);
  assert.equal((html.match(/data-option-key=/g) || []).length, 4);
  assert.equal((html.match(/class="option-image"/g) || []).length, 4);
  assert.match(html, /resources\/quiz-options\/q01\/a\.png/);
  assert.match(html, /resources\/quiz-options\/q01\/d\.png/);
});

test("renderQuizView keeps text-only questions image-free", () => {
  const html = renderQuizView({
    index: 1,
    total: 25,
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

  assert.match(html, /2 \/ 25/);
  assert.equal((html.match(/data-option-key=/g) || []).length, 4);
  assert.doesNotMatch(html, /class="option-image"/);
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
  assert.match(html, /返回首页/);
  assert.match(html, /重新测试/);
  assert.match(html, /已收录进你的图鉴/);
  assert.doesNotMatch(html, /result-hero/);
  assert.doesNotMatch(html, /result-chip/);
  assert.doesNotMatch(html, /share-line/);
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
  assert.ok(html.indexOf("重新测试") < html.indexOf("返回首页"));
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

  assert.match(html, /我的图鉴/);
  assert.match(html, /一键解锁/);
  assert.match(html, /已解锁\s*1\s*\/\s*2/);
  assert.equal((html.match(/data-collection-id=/g) || []).length, 2);
  assert.match(html, /data-collection-id="02"/);
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

test("renderCommunityView renders community post cards", () => {
  const html = renderCommunityView();

  assert.match(html, /猫薄荷广场/);
  assert.match(html, /今日猫meme/);
  assert.match(html, /当家里的小咪有了手机/);
  assert.equal((html.match(/community-post-card/g) || []).length, 2);
  assert.match(html, /data-action="open-community-post"/);
});

test("renderCommunityPostView renders gallery and demo comments", () => {
  const html = renderCommunityPostView({
    postId: "phone-cat",
    imageIndex: 2
  });

  assert.match(html, /当家里的小咪有了手机/);
  assert.match(html, /6 张/);
  assert.equal((html.match(/community-gallery-slide/g) || []).length, 6);
  assert.match(html, /data-action="prev-community-image"/);
  assert.match(html, /data-action="next-community-image"/);
  assert.match(html, /评论/);
  assert.match(html, /太像我家那位了/);
});

test("renderGameView renders game placeholder page", () => {
  const html = renderGameView();

  assert.match(html, /游戏广场/);
  assert.match(html, /猫猫接食物/);
  assert.match(html, /开始游戏/);
  assert.match(html, /data-action="open-game-detail"/);
});

test("renderGameDetailView renders game detail placeholder", () => {
  const html = renderGameDetailView();

  assert.match(html, /游戏详情页/);
  assert.match(html, /游戏介绍/);
  assert.match(html, /data-action="open-game-play"/);
});

test("renderGamePlayView renders gameplay placeholder", () => {
  const html = renderGamePlayView();

  assert.match(html, /游戏进行页/);
  assert.match(html, /得分/);
  assert.match(html, /游戏主体先占位/);
});

test("renderGameLeaderboardView renders leaderboard page", () => {
  const html = renderGameLeaderboardView();

  assert.match(html, /排行榜/);
  assert.match(html, /全球榜/);
  assert.match(html, /奶盖不加糖/);
});

test("renderProfileView renders profile page", () => {
  const html = renderProfileView();

  assert.match(html, /我的个人中心页/);
  assert.match(html, /常用功能/);
  assert.match(html, /data-action="open-invite"/);
});

test("renderInviteView renders invite page", () => {
  const html = renderInviteView();

  assert.match(html, /邀请好友一起测喵BTI/);
  assert.match(html, /立即邀请/);
  assert.match(html, /复制链接/);
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

(function (global) {
const MaoBTI = global.MaoBTI || (global.MaoBTI = {});

const DOCK_ICONS = {
  home: `
    <path d="m3 10 9-7 9 7" />
    <path d="M5 10v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V10" />
    <path d="M9 21v-6a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6" />
  `,
  collection: `
    <path d="M12 7v14" />
    <path d="M3 18a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3z" />
    <path d="M21 18a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-5a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3z" />
  `,
  test: `
    <circle cx="11" cy="4" r="2" />
    <circle cx="18" cy="8" r="2" />
    <circle cx="20" cy="16" r="2" />
    <circle cx="4" cy="8" r="2" />
    <circle cx="2" cy="16" r="2" />
    <path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-7 0V15a5 5 0 0 1 2-5Z" />
  `,
  community: `
    <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
    <path d="M8 10h8" />
    <path d="M8 14h5" />
  `,
  profile: `
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="10" r="3" />
    <path d="M7 20.7a6 6 0 0 1 10 0" />
  `
};

function renderDockIcon(name) {
  return `
    <svg
      class="dock-icon lucide"
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2.35"
      stroke-linecap="round"
      stroke-linejoin="round"
    >${DOCK_ICONS[name]}</svg>
  `;
}

function renderDockButton({ active, action, icon, label, className = "" }) {
  return `
    <button type="button" class="${className} ${active ? "is-active" : ""}" data-action="${action}">
      <span class="dock-icon-wrap">${renderDockIcon(icon)}</span>
      <span class="dock-label">${label}</span>
    </button>
  `;
}

function renderDockNav({ activeTab, testAction = "open-tests", label = "底部导航" }) {
  return `
    <nav class="bottom-tabbar" aria-label="${label}">
      ${renderDockButton({ active: activeTab === "home", action: "go-home", icon: "home", label: "首页" })}
      ${renderDockButton({ active: activeTab === "collection", action: "open-collection", icon: "collection", label: "图鉴" })}
      ${renderDockButton({ active: activeTab === "test", action: testAction, icon: "test", label: "测一测", className: "test-tab" })}
      ${renderDockButton({ active: activeTab === "community", action: "open-community", icon: "community", label: "社区" })}
      ${renderDockButton({ active: activeTab === "profile", action: "open-profile", icon: "profile", label: "我的" })}
    </nav>
  `;
}

function renderHomeView({ completedCount, unlockedCount }) {
  return `
    <section class="home-screen" aria-label="喵BTI首页">
      <header class="home-topbar">
        <div class="brand-mark" aria-label="喵BTI">
          <span class="brand-word">喵BTI</span>
          <span class="brand-paw" aria-hidden="true"> paw </span>
        </div>
        <div class="top-actions" aria-hidden="true">
          <span class="round-icon">✓</span>
          <span class="round-icon cat-face">
            <img src="./icon.png" alt="" />
          </span>
        </div>
      </header>

      <section class="panel hero-card">
        <div class="hero-copy">
          <p class="eyebrow">离线猫格测试</p>
          <h1>测测今天的<br /><span>喵BTI</span></h1>
          <p class="subtitle">24题轻松测试，发现你的猫猫人格！</p>
          <div class="trait-row" aria-label="测试特点">
            <span>有趣</span>
            <span>治愈</span>
            <span>准到喵叫</span>
          </div>
          <button type="button" class="primary-cta" data-action="start-quiz">
            测测今天的喵BTI <span aria-hidden="true">›</span>
          </button>
        </div>
        <div class="hero-art" aria-hidden="true">
          <div class="speech-bubble">今天<br />你是什么<br />猫猫呢？</div>
          <img src="./resources/personalities-main/16 可爱喵.png" alt="" />
        </div>
      </section>

      <div class="home-feature-grid">
        <button type="button" class="feature-card feature-yellow" data-action="open-collection">
          <span class="feature-copy">
            <strong>喵BTI图鉴</strong>
            <small>${completedCount} 种猫格图鉴<br />已解锁 ${unlockedCount} / ${completedCount}</small>
            <i aria-hidden="true">›</i>
          </span>
          <img src="./resources/personalities-main/05 打工猫.png" alt="" />
        </button>

        <button type="button" class="feature-card feature-peach" data-action="open-tests">
          <span class="feature-copy">
            <strong>其他测试</strong>
            <small>更多有趣测试<br />等你来探索</small>
            <i aria-hidden="true">›</i>
          </span>
          <img src="./resources/personalities-main/04 学习猫.png" alt="" />
        </button>

        <button type="button" class="feature-card feature-mint" data-action="open-community">
          <span class="feature-copy">
            <strong>猫薄荷社区</strong>
            <small>分享你的猫薄荷<br />发现同类的快乐</small>
            <i aria-hidden="true">›</i>
          </span>
          <img src="./resources/personalities-main/16 可爱喵.png" alt="" />
        </button>

        <button type="button" class="feature-card feature-lilac" data-action="open-game">
          <span class="feature-copy">
            <strong>游戏广场</strong>
            <small>玩小游戏<br />收获喵喵快乐</small>
            <i aria-hidden="true">›</i>
          </span>
          <img src="./resources/personalities-main/03 我说我是猫.png" alt="" />
        </button>
      </div>

      <section class="invite-card">
        <div>
          <h2>邀请好友一起测</h2>
          <p>看看你和好友的猫猫人格合拍度吧！</p>
          <button type="button" data-action="open-invite">去邀请 <span aria-hidden="true">›</span></button>
        </div>
        <img src="./resources/personalities-main/11 权威猫.png" alt="" />
      </section>

      ${renderDockNav({ activeTab: "home", testAction: "start-quiz", label: "首页导航" })}
    </section>
  `;
}

function renderQuizView({ index, total, question }) {
  const optionsMarkup = question.options
    .map(
      (option) => `
        <button type="button" class="option-button" data-option-key="${option.key}">
          <span class="option-key">${option.key}</span>
          <span class="option-copy">${option.text}</span>
        </button>
      `
    )
    .join("");

  return `
    <section class="panel quiz-card">
      <div class="progress-meta">
        <span>${index + 1} / ${total}</span>
        <button type="button" class="link-button" data-action="go-back">上一题</button>
      </div>
      <div class="progress-bar"><i style="width:${((index + 1) / total) * 100}%"></i></div>
      <h2>${question.prompt}</h2>
      <div class="option-list">${optionsMarkup}</div>
    </section>
  `;
}

function renderBottomTabbar(activeTab) {
  return renderDockNav({ activeTab });
}

function renderResultView({ result, auxiliaryText, resultImage }) {
  const imageMarkup = resultImage
    ? `
      <figure class="result-image-card">
        <img
          class="result-image"
          data-result-id="${result.id}"
          src="${resultImage.src}"
          alt="${resultImage.alt}"
        />
      </figure>
    `
    : "";

  return `
    <section class="panel result-card result-card-flow">
      <p class="eyebrow">你的猫BTI结果是</p>
      ${imageMarkup}
      <header class="result-copy-head">
        <h1>${result.name}</h1>
        <p class="tagline">${result.tagline}</p>
      </header>
      <div class="result-copy-body">
        <p class="description">${result.description}</p>
        <p class="auxiliary">${auxiliaryText}</p>
        <p class="meta result-saved-note">已收录进你的图鉴</p>
      </div>
      <div class="result-actions">
        <button type="button" data-action="open-share">生成分享图</button>
        <button type="button" class="ghost-button" data-action="open-collection">我的图鉴</button>
        <button type="button" class="ghost-button" data-action="restart-quiz">重新测试</button>
        <button type="button" class="ghost-button" data-action="open-community">猫薄荷社区</button>
      </div>
    </section>
  `;
}

function renderCollectionView({ unlockedCount, totalCount, items }) {
  const cardsMarkup = items
    .map(
      (item) => `
        <button
          type="button"
          class="collection-entry ${item.unlocked ? "is-unlocked" : "is-locked"}"
          data-collection-id="${item.id}"
        >
          ${
            item.unlocked && item.image
              ? `
                <span class="collection-entry-media">
                  <img
                    class="collection-entry-image"
                    data-result-id="${item.id}"
                    src="${item.image.src}"
                    alt="${item.image.alt}"
                  />
                </span>
              `
              : `
                <span class="collection-entry-media collection-entry-placeholder" aria-hidden="true">
                  ?
                </span>
              `
          }
          <span class="collection-entry-name">${item.unlocked ? item.name : "???"}</span>
        </button>
      `
    )
    .join("");

  return `
    <section class="panel collection-card">
      <div class="progress-meta">
        <span>我的图鉴</span>
        <button type="button" class="link-button" data-action="go-home">返回首页</button>
      </div>
      <p class="meta">已解锁 ${unlockedCount} / ${totalCount}</p>
      <div class="collection-grid">${cardsMarkup}</div>
    </section>
  `;
}

function renderCollectionDetailOverlay({ result, resultImage }) {
  const imageMarkup = resultImage
    ? `
      <figure class="result-image-card">
        <img
          class="result-image"
          data-result-id="${result.id}"
          src="${resultImage.src}"
          alt="${resultImage.alt}"
        />
      </figure>
    `
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

function renderCollectionLockedOverlay() {
  return `
    <div class="overlay-backdrop" data-action="close-collection-locked">
      <section class="panel share-overlay" aria-label="图鉴未解锁提示">
        <p class="eyebrow">还没解锁</p>
        <h2>这只猫还没解锁</h2>
        <p class="subtitle">再多测几次，把新的猫格收进你的图鉴里吧。</p>
        <div class="result-actions">
          <button type="button" data-action="close-collection-locked">我知道了</button>
        </div>
      </section>
    </div>
  `;
}

function renderCommunityOverlay() {
  return `
    <div class="overlay-backdrop" data-action="close-community">
      <section class="panel share-overlay" aria-label="猫薄荷社区说明">
        <p class="eyebrow">猫薄荷社区</p>
        <h2>猫格同类出没区</h2>
        <p class="subtitle">这里原本会放猫格梗图、碎碎念和同类出没现场。</p>
        <p class="auxiliary">demo 阶段此功能尚未开发。</p>
        <div class="result-actions">
          <button type="button" data-action="close-community">我知道了</button>
        </div>
      </section>
    </div>
  `;
}

function renderTestsView() {
  const tests = [
    ["恋爱", "10题", "热度 9.8w", "你是哪种恋爱猫？", "测测你在恋爱中的真实状态", "./resources/personalities-main/16 可爱喵.png"],
    ["性格", "15题", "热度 8.7w", "你的性格像哪种猫？", "发现你独特的猫系性格", "./resources/personalities-main/04 学习猫.png"],
    ["职场", "12题", "热度 7.2w", "你是职场中的哪种猫？", "揭秘你在职场中的生存方式", "./resources/personalities-main/11 权威猫.png"],
    ["生活", "8题", "热度 6.1w", "你有多佛系？", "测测你的佛系指数", "./resources/personalities-main/15 落汤喵.png"],
    ["趣味", "10题", "热度 5.4w", "你是哪种干饭猫？", "看看你的干饭隐藏人格", "./resources/personalities-main/08 巴拿拿猫.png"]
  ];

  return `
    <section class="page-screen tests-screen" aria-label="其他测试">
      <header class="page-header">
        <button type="button" class="icon-link" data-action="go-home" aria-label="返回首页">‹</button>
        <h1>其他测试</h1>
        <div class="header-actions" aria-label="更多操作">
          <button type="button" class="icon-link" data-action="open-community" aria-label="更多">⋯</button>
          <button type="button" class="icon-link" data-action="go-home" aria-label="返回首页">⊙</button>
        </div>
      </header>
      <div class="category-pills" aria-label="测试分类">
        <span class="is-active">推荐</span>
        <span>性格</span>
        <span>恋爱</span>
        <span>生活</span>
        <span>奇趣</span>
      </div>
      <div class="test-list">
        ${tests.map(([tag, count, heat, title, copy, image]) => `
          <article class="test-list-card">
            <div class="test-card-copy">
              <h2>${title}</h2>
              <p>${copy}</p>
              <div class="test-meta">
                <span class="mini-tag">${tag}</span>
                <span>${count}</span>
                <span>🔥 ${heat}</span>
              </div>
              <button type="button" data-action="start-quiz">开始测试</button>
            </div>
            <img src="${image}" alt="" />
          </article>
        `).join("")}
      </div>
      <section class="page-placeholder">
        <h2>其他测试</h2>
        <p>更多趣味测试，探索不同维度的自己<br />多种分类，持续更新</p>
      </section>
      ${renderBottomTabbar("test")}
    </section>
  `;
}

function renderCommunityView() {
  const posts = [
    {
      id: "cat-meme",
      title: "今日猫meme",
      images: [
        "猫meme分享_1_露露凯蒂_来自小红书网页版.jpg",
        "猫meme分享_2_露露凯蒂_来自小红书网页版.jpg",
        "猫meme分享_3_露露凯蒂_来自小红书网页版.jpg",
        "猫meme分享_4_露露凯蒂_来自小红书网页版.jpg",
        "猫meme分享_5_露露凯蒂_来自小红书网页版.jpg",
        "猫meme分享_6_露露凯蒂_来自小红书网页版.jpg"
      ].map((fileName) => `./resources/今日猫meme/${fileName}`)
    },
    {
      id: "phone-cat",
      title: "当家里的小咪有了手机",
      images: [
        "当家里的小咪有了手机1️⃣_1_为什么小狗不用上学_来自小红书网页版.jpg",
        "当家里的小咪有了手机1️⃣_2_为什么小狗不用上学_来自小红书网页版.jpg",
        "当家里的小咪有了手机1️⃣_3_为什么小狗不用上学_来自小红书网页版.jpg",
        "当家里的小咪有了手机1️⃣_4_为什么小狗不用上学_来自小红书网页版.jpg",
        "当家里的小咪有了手机1️⃣_5_为什么小狗不用上学_来自小红书网页版.jpg",
        "当家里的小咪有了手机1️⃣_6_为什么小狗不用上学_来自小红书网页版.jpg"
      ].map((fileName) => `./resources/当家里的小咪有了手机/${fileName}`)
    }
  ];

  return `
    <section class="page-screen community-screen" aria-label="猫薄荷广场">
      <header class="page-header">
        <button type="button" class="icon-link" data-action="go-home" aria-label="返回首页">‹</button>
        <h1>猫薄荷广场</h1>
        <button type="button" class="icon-link" data-action="open-profile" aria-label="我的">♙</button>
      </header>
      <div class="category-pills" aria-label="猫薄荷分类">
        <span class="is-active">推荐</span>
        <span>关注</span>
        <span>猫meme</span>
        <span>小咪日常</span>
        <span>最新</span>
      </div>
      <div class="community-feed">
        ${posts.map(({ id, title, images }, index) => `
          <article class="community-post-card" data-action="open-community-post" data-post-id="${id}">
            <img src="${images[0]}" alt="${title}" loading="lazy" />
            <div class="community-post-copy">
              <h2>${title}</h2>
              <p>${title}</p>
              <div class="post-meta">
                <span>${images.length} 张图片</span>
                <strong>♡ ${index === 0 ? "1.2k" : "986"}</strong>
              </div>
            </div>
          </article>
        `).join("")}
      </div>
      ${renderBottomTabbar("community")}
    </section>
  `;
}

function getCommunityPost(postId) {
  const posts = {
    "cat-meme": {
      id: "cat-meme",
      title: "今日猫meme",
      author: "露露凯蒂",
      likes: "1.2k",
      images: [
        "猫meme分享_1_露露凯蒂_来自小红书网页版.jpg",
        "猫meme分享_2_露露凯蒂_来自小红书网页版.jpg",
        "猫meme分享_3_露露凯蒂_来自小红书网页版.jpg",
        "猫meme分享_4_露露凯蒂_来自小红书网页版.jpg",
        "猫meme分享_5_露露凯蒂_来自小红书网页版.jpg",
        "猫meme分享_6_露露凯蒂_来自小红书网页版.jpg"
      ].map((fileName) => `./resources/今日猫meme/${fileName}`)
    },
    "phone-cat": {
      id: "phone-cat",
      title: "当家里的小咪有了手机",
      author: "为什么小狗不用上学",
      likes: "986",
      images: [
        "当家里的小咪有了手机1️⃣_1_为什么小狗不用上学_来自小红书网页版.jpg",
        "当家里的小咪有了手机1️⃣_2_为什么小狗不用上学_来自小红书网页版.jpg",
        "当家里的小咪有了手机1️⃣_3_为什么小狗不用上学_来自小红书网页版.jpg",
        "当家里的小咪有了手机1️⃣_4_为什么小狗不用上学_来自小红书网页版.jpg",
        "当家里的小咪有了手机1️⃣_5_为什么小狗不用上学_来自小红书网页版.jpg",
        "当家里的小咪有了手机1️⃣_6_为什么小狗不用上学_来自小红书网页版.jpg"
      ].map((fileName) => `./resources/当家里的小咪有了手机/${fileName}`)
    }
  };

  return posts[postId] ?? posts["cat-meme"];
}

function renderCommunityPostView({ postId = "cat-meme", imageIndex = 0 } = {}) {
  const post = getCommunityPost(postId);
  const comments = [
    ["奶盖不加糖", "太像我家那位了，已经开始代入。"],
    ["打工基本喵", "这个系列请继续更，今天的快乐有了。"],
    ["喵喵小可爱", "第几张最适合拿去发朋友圈？"],
    ["橘子的猫", "表情和动作都很有猫味。"]
  ];

  return `
    <section class="page-screen community-detail-screen" aria-label="${post.title}">
      <header class="page-header">
        <button type="button" class="icon-link" data-action="open-community" aria-label="返回猫薄荷广场">‹</button>
        <h1>${post.title}</h1>
        <button type="button" class="icon-link" data-action="open-profile" aria-label="我的">♙</button>
      </header>
      <article class="community-detail-card">
        <div class="community-gallery">
          <button type="button" data-action="prev-community-image" aria-label="上一张">‹</button>
          <div class="community-gallery-track" data-community-gallery>
            ${post.images.map((image, index) => `
              <figure class="community-gallery-slide">
                <img src="${image}" alt="${post.title} ${index + 1}" loading="${index === 0 ? "eager" : "lazy"}" />
              </figure>
            `).join("")}
          </div>
          <button type="button" data-action="next-community-image" aria-label="下一张">›</button>
          <span>${post.images.length} 张</span>
        </div>
        <div class="community-detail-copy">
          <h2>${post.title}</h2>
          <p>${post.title}</p>
          <div class="post-meta">
            <span>${post.author}</span>
            <strong>♡ ${post.likes}</strong>
          </div>
        </div>
      </article>
      <section class="comment-list" aria-label="评论">
        <h2>评论</h2>
        ${comments.map(([name, text]) => `
          <article class="comment-card">
            <span>${name.slice(0, 1)}</span>
            <div>
              <strong>${name}</strong>
              <p>${text}</p>
            </div>
          </article>
        `).join("")}
      </section>
    </section>
  `;
}

function renderGameView() {
  const games = [
    ["猫猫接食物", "接住更多食物，喂饱猫猫！", "23.5w人在玩", "./resources/personalities-main/16 可爱喵.png", "open-game-detail"],
    ["跳一跳猫猫", "看看你能跳多远！", "18.7w人在玩", "./resources/personalities-main/08 巴拿拿猫.png", "open-game-leaderboard"],
    ["抓鱼高手", "成为捕鱼达人！", "14.2w人在玩", "./resources/personalities-main/03 我说我是猫.png", "open-game-detail"],
    ["喵喵消消乐", "消除猫猫，解锁奖励", "9.8w人在玩", "./resources/personalities-main/04 学习猫.png", "open-game-detail"]
  ];

  return `
    <section class="page-screen game-hub-screen" aria-label="游戏广场">
      <header class="page-header">
        <button type="button" class="icon-link" data-action="go-home" aria-label="返回首页">‹</button>
        <h1>游戏广场</h1>
        <button type="button" class="icon-link" data-action="open-game-leaderboard" aria-label="排行榜">↗</button>
      </header>
      <div class="category-pills" aria-label="游戏分类">
        <span class="is-active">推荐</span>
        <span>热门</span>
        <span>益智</span>
        <span>动作</span>
        <span>排行榜</span>
      </div>
      <div class="game-list">
        ${games.map(([title, copy, plays, image, action]) => `
          <article class="game-row-card">
            <img src="${image}" alt="" />
            <div>
              <h2>${title}</h2>
              <p>${copy}</p>
              <small>🔥 ${plays}</small>
            </div>
            <button type="button" data-action="${action}">开始游戏</button>
          </article>
        `).join("")}
      </div>
      ${renderBottomTabbar("profile")}
    </section>
  `;
}

function renderGameDetailView() {
  return `
    <section class="page-screen game-detail-screen" aria-label="游戏详情页">
      <header class="page-header">
        <button type="button" class="icon-link" data-action="open-game" aria-label="返回游戏广场">‹</button>
        <h1>游戏详情页</h1>
        <button type="button" class="icon-link" data-action="open-game-leaderboard" aria-label="排行榜">↗</button>
      </header>
      <section class="game-detail-hero">
        <div class="game-sky">
          <span class="game-heart">❤</span>
          <img src="./resources/personalities-main/16 可爱喵.png" alt="" />
        </div>
        <h2>猫猫接食物</h2>
        <p>操控猫猫接住食物，接住掉落的食物，躲避绿色危险物品。</p>
        <div class="avatar-row" aria-label="参与玩家">
          <span><img src="./resources/personalities-main/01 西格玛猫.png" alt="" /></span>
          <span><img src="./resources/personalities-main/05 打工猫.png" alt="" /></span>
          <span><img src="./resources/personalities-main/11 权威猫.png" alt="" /></span>
          <small>23.5w人在玩</small>
        </div>
      </section>
      <section class="game-info-card">
        <h3>游戏介绍</h3>
        <p>控制猫猫左右移动，接住掉落的食物，挑战你的反应速度。</p>
        <h3>排行榜</h3>
        <ol class="mini-rank-list">
          <li><span>奶盖不加糖</span><strong>12560</strong></li>
          <li><span>喵喵小可爱</span><strong>9860</strong></li>
          <li><span>橘子的猫</span><strong>8730</strong></li>
        </ol>
        <button type="button" data-action="open-game-play">开始游戏</button>
      </section>
    </section>
  `;
}

function renderGamePlayView() {
  return `
    <section class="page-screen game-play-screen" aria-label="游戏进行页">
      <header class="game-play-top">
        <button type="button" class="icon-link" data-action="open-game-detail" aria-label="暂停">Ⅱ</button>
        <div>
          <small>得分</small>
          <strong>680</strong>
        </div>
        <span aria-label="生命值">❤ ❤ ❤</span>
      </header>
      <section class="game-stage-placeholder">
        <span class="falling-item item-a">🍩</span>
        <span class="falling-item item-b">🐟</span>
        <span class="falling-item item-c">🥕</span>
        <img src="./resources/personalities-main/16 可爱喵.png" alt="" />
        <p>游戏主体先占位，后续接入实际玩法。</p>
      </section>
      <div class="game-controls">
        <button type="button" aria-label="向左">‹</button>
        <button type="button" aria-label="向右">›</button>
      </div>
    </section>
  `;
}

function renderGameLeaderboardView() {
  const rows = [
    ["奶盖不加糖", "26890", "./resources/personalities-main/16 可爱喵.png"],
    ["喵喵小可爱", "23340", "./resources/personalities-main/04 学习猫.png"],
    ["打工基本喵", "19870", "./resources/personalities-main/05 打工猫.png"],
    ["治愈小猫咪", "17650", "./resources/personalities-main/15 落汤喵.png"],
    ["喵星人不熬夜", "15320", "./resources/personalities-main/12 哈气猫.png"]
  ];

  return `
    <section class="page-screen leaderboard-screen" aria-label="游戏排行榜页">
      <header class="page-header">
        <button type="button" class="icon-link" data-action="open-game" aria-label="返回游戏广场">‹</button>
        <h1>跳一跳猫猫<br /><span>排行榜</span></h1>
        <button type="button" class="icon-link" data-action="open-game-detail" aria-label="游戏详情">↗</button>
      </header>
      <div class="category-pills compact-pills" aria-label="排行榜分类">
        <span class="is-active">全球榜</span>
        <span>好友榜</span>
        <span>地区榜</span>
      </div>
      <section class="podium">
        <div><img src="./resources/personalities-main/01 西格玛猫.png" alt="" /><span>橘子的猫</span><strong>25680</strong><i>2</i></div>
        <div class="winner"><img src="./resources/personalities-main/16 可爱喵.png" alt="" /><span>奶盖不加糖</span><strong>26890</strong><i>1</i></div>
        <div><img src="./resources/personalities-main/04 学习猫.png" alt="" /><span>喵喵小可爱</span><strong>23340</strong><i>3</i></div>
      </section>
      <ol class="rank-list">
        ${rows.map(([name, score, image], index) => `
          <li>
            <span>${index + 4}</span>
            <img src="${image}" alt="" />
            <strong>${name}</strong>
            <em>${score}</em>
          </li>
        `).join("")}
      </ol>
    </section>
  `;
}

function renderProfileView() {
  return `
    <section class="page-screen profile-screen" aria-label="我的个人中心页">
      <h1 class="visually-hidden">我的个人中心页</h1>
      <section class="profile-card">
        <div class="profile-head">
          <img src="./resources/personalities-main/16 可爱喵.png" alt="" />
          <div>
            <h2>奶盖不加糖</h2>
            <p>ID: 12345678</p>
          </div>
        </div>
        <div class="profile-stats">
          <span><strong>16</strong>我的图鉴</span>
          <span><strong>5</strong>我的测试</span>
          <span><strong>128</strong>喵龄(天)</span>
        </div>
        <div class="member-banner">
          <div><strong>开通喵BTI会员</strong><span>解锁更多猫星特权</span></div>
          <button type="button">去开通</button>
        </div>
      </section>
      <section class="profile-section">
        <h2>常用功能</h2>
        <div class="profile-shortcuts">
          <button type="button">◷<span>历史记录</span></button>
          <button type="button">♡<span>我的收藏</span></button>
          <button type="button">▤<span>我的发布</span></button>
          <button type="button" data-action="open-invite">♧<span>邀请好友</span></button>
        </div>
      </section>
      <section class="settings-list">
        <button type="button">设置 <span>›</span></button>
        <button type="button">帮助与反馈 <span>›</span></button>
        <button type="button">关于喵BTI <span>›</span></button>
      </section>
      ${renderBottomTabbar("profile")}
    </section>
  `;
}

function renderInviteView() {
  return `
    <section class="page-screen invite-screen" aria-label="邀请好友页">
      <header class="invite-close">
        <button type="button" class="icon-link" data-action="open-profile" aria-label="关闭">×</button>
      </header>
      <section class="invite-hero">
        <h1>邀请好友一起测喵BTI</h1>
        <p>发现有趣的猫猫人格</p>
        <img src="./resources/personalities-main/16 可爱喵.png" alt="" />
      </section>
      <section class="invite-options">
        <div><strong>邀请1位好友</strong><span>解锁3个图鉴碎片</span></div>
        <div><strong>邀请5位好友</strong><span>解锁稀有图鉴 + 专属头像框</span></div>
      </section>
      <button type="button" class="invite-primary" data-action="open-profile">立即邀请</button>
      <nav class="share-channels" aria-label="分享渠道">
        <button type="button">☘<span>微信好友</span></button>
        <button type="button">✺<span>朋友圈</span></button>
        <button type="button">↗<span>复制链接</span></button>
        <button type="button">⋯<span>更多</span></button>
      </nav>
    </section>
  `;
}

function renderShareOverlay({ resultName }) {
  return `
    <div class="overlay-backdrop" data-action="close-share">
      <section class="panel share-overlay" aria-label="分享图预览">
        <p class="eyebrow">分享图已生成</p>
        <h2>${resultName}</h2>
        <p class="subtitle">长按或点击保存，把你的猫格发给朋友看看。</p>
        <div class="share-preview">
          <img id="share-preview-image" alt="${resultName} 分享图预览" />
        </div>
        <div class="result-actions">
          <button type="button" data-action="download-share">保存图片</button>
          <button type="button" class="ghost-button" data-action="close-share">关闭</button>
        </div>
      </section>
    </div>
  `;
}

function renderErrorView(message) {
  return `
    <section class="panel error-card">
      <p class="eyebrow">猫爪打滑了</p>
      <h1>${message}</h1>
      <button type="button" data-action="reload-app">重新打开</button>
    </section>
  `;
}

Object.assign(MaoBTI, {
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
  renderTestsView
});
})(globalThis);

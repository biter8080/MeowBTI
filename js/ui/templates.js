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
          <img class="brand-logo" src="./icon.png" alt="喵BTI" />
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
          <p class="subtitle">25题轻松测试，发现你的猫猫人格！</p>
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
    .map((option) => {
      const imageMarkup = option.image
        ? `
          <span class="option-figure" aria-hidden="true">
            <img class="option-image" src="${option.image}" alt="" />
          </span>
        `
        : "";

      return `
        <button type="button" class="option-button" data-option-key="${option.key}">
          <span class="option-content">
            <span class="option-key">${option.key}</span>
            <span class="option-copy">${option.text}</span>
          </span>
          ${imageMarkup}
        </button>
      `;
    })
    .join("");

  return `
    <section class="panel quiz-card">
      <div class="progress-meta">
        <span>${index + 1} / ${total}</span>
        <div class="quiz-actions" aria-label="测试导航操作">
          <button type="button" class="link-button" data-action="go-home">返回首页</button>
          <button type="button" class="link-button" data-action="go-back">上一题</button>
        </div>
      </div>
      <div class="progress-bar"><i style="width:${((index + 1) / total) * 100}%"></i></div>
      <h2>${question.prompt}</h2>
      <div class="option-list">${optionsMarkup}</div>
    </section>
  `;
}

function renderBottomTabbar(activeTab, testAction = "open-tests", label = "底部导航") {
  return renderDockNav({ activeTab, testAction, label });
}

function splitNarrativeParagraphs(text) {
  const normalized = String(text ?? "")
    .replace(/\s+/g, " ")
    .trim();

  if (!normalized) {
    return [];
  }

  const sentences = normalized.match(/[^。！？!?]+[。！？!?]?/g) || [normalized];
  const paragraphs = [];
  let current = "";

  sentences.forEach((sentence) => {
    const nextSentence = sentence.trim();
    if (!nextSentence) {
      return;
    }

    if (!current) {
      current = nextSentence;
      return;
    }

    if (current.length >= 72 || current.length + nextSentence.length > 96) {
      paragraphs.push(current);
      current = nextSentence;
      return;
    }

    current += nextSentence;
  });

  if (current) {
    paragraphs.push(current);
  }

  while (paragraphs.length > 4) {
    const last = paragraphs.pop();
    paragraphs[paragraphs.length - 1] += last;
  }

  return paragraphs;
}

function renderNarrativeParagraphs(text, className) {
  const paragraphs = splitNarrativeParagraphs(text);
  const safeParagraphs = paragraphs.length ? paragraphs : [String(text ?? "").trim()].filter(Boolean);

  return safeParagraphs
    .map((paragraph) => `<p class="${className}">${paragraph}</p>`)
    .join("");
}

function renderResultView({ result, auxiliaryText, resultImage }) {
  const idSeed = Number(result.id) || 1;
  const keywordPool = [
    "责任感强",
    "情绪稳定",
    "独立自主",
    "执行在线",
    "反差萌",
    "社交有梗",
    "内心细腻",
    "恢复力高"
  ];
  const keywords = Array.from({ length: 5 }, (_, index) => keywordPool[(idSeed + index * 2) % keywordPool.length]);
  const energy = {
    social: 45 + (idSeed * 7) % 45,
    action: 52 + (idSeed * 9) % 40,
    emotion: 40 + (idSeed * 11) % 45,
    stability: 46 + (idSeed * 13) % 42,
    creativity: 44 + (idSeed * 15) % 44
  };
  const similarCats = [
    { name: "摆烂猫", score: 90 - (idSeed % 8), image: "./resources/personalities-main/10 命苦猫.png" },
    { name: "学习猫", score: 86 - (idSeed % 6), image: "./resources/personalities-main/04 学习猫.png" },
    { name: "社恐猫", score: 72 - (idSeed % 10), image: "./resources/personalities-main/15 落汤喵.png" }
  ];

  const catnipPosts = [
    {
      id: "cat-meme",
      title: "今日猫meme",
      copy: "今日份猫猫快乐，拿捏情绪值。",
      image: "./resources/今日猫meme/猫meme分享_1_露露凯蒂_来自小红书网页版.jpg"
    },
    {
      id: "phone-cat",
      title: "当家里的小咪有了手机",
      copy: "小咪上网冲浪实录，笑点密集。",
      image: "./resources/当家里的小咪有了手机/当家里的小咪有了手机1️⃣_1_为什么小狗不用上学_来自小红书网页版.jpg"
    }
  ];

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

  const posterImageMarkup = resultImage
    ? `
      <figure class="result-poster-hero">
        <img
          class="result-poster-hero-image"
          data-result-id="${result.id}"
          src="${resultImage.src}"
          alt="${resultImage.alt}"
        />
      </figure>
    `
    : `
      <figure class="result-poster-hero">
        <img class="result-poster-hero-image" src="./resources/personalities-main/16 可爱喵.png" alt="猫格海报图" />
      </figure>
    `;
  const descriptionMarkup = renderNarrativeParagraphs(result.description, "description");

  return `
    <section class="panel result-card result-card-flow result-poster-card">
      <div class="result-report-layout">
        <section class="result-report-main" aria-label="海报主视觉">
          <section class="result-main-poster" aria-label="猫格海报">
            <div class="result-main-title">
              <p class="eyebrow">喵BTI 测试报告</p>
              <h2>我的猫猫人格是</h2>
              <strong>${result.name}</strong>
              <p>${result.tagline}</p>
            </div>
            ${posterImageMarkup}
            <div class="result-main-stickers" aria-hidden="true">
              <span>周一靠咖啡<br />周五靠信念</span>
              <span>只要钱给够<br />周末还能上线</span>
            </div>
          </section>

          <div class="result-copy-body">
            ${descriptionMarkup}
            <p class="auxiliary">${auxiliaryText}</p>
            <p class="meta result-saved-note">已收录进你的图鉴</p>
          </div>
        </section>

        <aside class="result-report-side" aria-label="报告信息">
          <section class="result-side-card">
            <h2>人格关键词</h2>
            <div class="result-keywords">
              ${keywords.map((keyword) => `<span>${keyword}</span>`).join("")}
            </div>
          </section>

          <section class="result-side-card">
            <h2>能量分布</h2>
            <div class="result-meters" aria-label="能量指标">
              <p><span>社交能量</span><strong>${energy.social}%</strong></p>
              <i style="width:${energy.social}%"></i>
              <p><span>执行力</span><strong>${energy.action}%</strong></p>
              <i style="width:${energy.action}%"></i>
              <p><span>情绪复原</span><strong>${energy.emotion}%</strong></p>
              <i style="width:${energy.emotion}%"></i>
              <p><span>稳定指数</span><strong>${energy.stability}%</strong></p>
              <i style="width:${energy.stability}%"></i>
              <p><span>创意指数</span><strong>${energy.creativity}%</strong></p>
              <i style="width:${energy.creativity}%"></i>
            </div>
          </section>

          <section class="result-side-card">
            <h2>与你相似的猫猫</h2>
            <div class="result-similar-list">
              ${similarCats
                .map(
                  (item, index) => `
                    <div>
                      <span>${index + 1}</span>
                      <img src="${item.image}" alt="${item.name}" loading="lazy" />
                      <strong>${item.name}</strong>
                      <em>${item.score}%</em>
                    </div>
                  `
                )
                .join("")}
            </div>
          </section>
        </aside>
      </div>

      <div class="result-actions">
        <button type="button" data-action="open-share">生成分享图</button>
        <button type="button" class="ghost-button" data-action="open-collection">我的图鉴</button>
        <button type="button" class="ghost-button" data-action="restart-quiz">重新测试</button>
        <button type="button" class="ghost-button" data-action="go-home">返回首页</button>
      </div>

      <section class="result-catnip" aria-label="适合你的猫薄荷">
        <h2>适合你的猫薄荷</h2>
        <div class="result-catnip-grid">
          ${catnipPosts
            .map(
              (post) => `
                <article
                  class="community-post-card result-catnip-card"
                  data-action="open-community-post"
                  data-post-id="${post.id}"
                  role="button"
                  tabindex="0"
                >
                  <img src="${post.image}" alt="${post.title}" loading="lazy" />
                  <div class="community-post-copy">
                    <h2>${post.title}</h2>
                    <p>${post.copy}</p>
                    <div class="post-meta">
                      <span>精选推荐</span>
                      <strong>去看看</strong>
                    </div>
                  </div>
                </article>
              `
            )
            .join("")}
        </div>
        <button type="button" class="ghost-button" data-action="open-community">进猫薄荷社区逛逛</button>
      </section>
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
        <div class="collection-actions" aria-label="图鉴操作">
          <button type="button" class="link-button" data-action="unlock-all-collection">一键解锁</button>
          <button type="button" class="link-button" data-action="go-home">返回首页</button>
        </div>
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
        ${renderNarrativeParagraphs(result.description, "description")}
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
      <section class="panel share-overlay share-overlay-poster" aria-label="分享图预览">
        <p class="eyebrow">分享图已生成</p>
        <h2>${resultName}</h2>
        <p class="subtitle">就在这里直接截图保存，手机里看更方便。</p>
        <div class="share-preview">
          <iframe
            id="share-preview-frame"
            title="${resultName} 分享图预览"
            loading="lazy"
            referrerpolicy="no-referrer"
          ></iframe>
        </div>
        <div class="share-note-row" aria-label="截图提示">
          <img src="./resources/quiz-options/q01/a.png" alt="" />
          <p>上下滑动看完整张图，停在喜欢的位置直接截图就行。</p>
          <img src="./resources/quiz-options/q01/d.png" alt="" />
        </div>
        <div class="result-actions">
          <button type="button" class="ghost-button" data-action="close-share">关闭</button>
        </div>
      </section>
    </div>
  `;
}

function escapeShareHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderShareWindowDocument({
  result,
  auxiliaryText = "",
  resultImage,
  iconSrc = "./icon.png",
  baseHref = "./",
  dateText = ""
}) {
  const idSeed = Number(result?.id) || 1;
  const safeResultName = escapeShareHtml(result?.name || "猫猫人格");
  const safeTagline = escapeShareHtml(result?.tagline || "");
  const safeDescription = escapeShareHtml(result?.description || "");
  const safeAuxiliary = escapeShareHtml(auxiliaryText || "");
  const safeIconSrc = escapeShareHtml(iconSrc);
  const safeBaseHref = escapeShareHtml(baseHref);
  const safeDateText = escapeShareHtml(dateText || "");
  const heroImageSrc = escapeShareHtml(resultImage?.src || "./resources/personalities-main/16 可爱喵.png");
  const heroImageAlt = escapeShareHtml(resultImage?.alt || `${safeResultName} 形象图`);
  const safeDescriptionMarkup = splitNarrativeParagraphs(result?.description)
    .map((paragraph) => `<p>${escapeShareHtml(paragraph)}</p>`)
    .join("");

  const keywordPool = [
    "责任感强",
    "情绪稳定",
    "独立自主",
    "执行在线",
    "反差萌",
    "社交有梗",
    "内心细腻",
    "恢复力高"
  ];
  const keywords = Array.from(
    { length: 5 },
    (_, index) => keywordPool[(idSeed + index * 2) % keywordPool.length]
  );

  const metrics = [
    ["社交能量", 45 + (idSeed * 7) % 45],
    ["执行力", 52 + (idSeed * 9) % 40],
    ["情绪复原", 40 + (idSeed * 11) % 45],
    ["稳定指数", 46 + (idSeed * 13) % 42],
    ["创意指数", 44 + (idSeed * 15) % 44]
  ];

  const similarCats = [
    ["摆烂猫", 92 - (idSeed % 8), "./resources/personalities-main/10 命苦猫.png"],
    ["学习猫", 85 - (idSeed % 6), "./resources/personalities-main/04 学习猫.png"],
    ["社恐猫", 65 - (idSeed % 10), "./resources/personalities-main/15 落汤喵.png"]
  ];

  const catnipCards = [
    ["打工人下班后的治愈时刻", "12.3w", "./resources/今日猫meme/猫meme分享_1_露露凯蒂_来自小红书网页版.jpg"],
    ["当代打工人真实写照", "8.7w", "./resources/当家里的小咪有了手机/当家里的小咪有了手机1️⃣_2_为什么小狗不用上学_来自小红书网页版.jpg"],
    ["摸鱼的100种方式", "6.9w", "./resources/今日猫meme/猫meme分享_3_露露凯蒂_来自小红书网页版.jpg"]
  ];

  const keywordMarkup = keywords
    .map((keyword) => `<span class="share-pill">${escapeShareHtml(keyword)}</span>`)
    .join("");

  const metricMarkup = metrics
    .map(
      ([label, value]) => `
        <div class="share-metric-row">
          <div class="share-metric-label">
            <span>${escapeShareHtml(label)}</span>
            <strong>${value}%</strong>
          </div>
          <div class="share-metric-track"><i style="width:${value}%"></i></div>
        </div>
      `
    )
    .join("");

  const similarMarkup = similarCats
    .map(
      ([name, score, image], index) => `
        <div class="share-similar-item">
          <span class="share-rank">${index + 1}</span>
          <img src="${escapeShareHtml(image)}" alt="${escapeShareHtml(name)}" />
          <strong>${escapeShareHtml(name)}</strong>
          <em>${score}%</em>
        </div>
      `
    )
    .join("");

  const catnipMarkup = catnipCards
    .map(
      ([title, heat, image]) => `
        <article class="share-video-card">
          <div class="share-video-cover">
            <img src="${escapeShareHtml(image)}" alt="${escapeShareHtml(title)}" />
            <span class="share-play">▶</span>
          </div>
          <h4>${escapeShareHtml(title)}</h4>
          <p>♡ ${escapeShareHtml(heat)}</p>
        </article>
      `
    )
    .join("");

  return `
    <!doctype html>
    <html lang="zh-CN">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <base href="${safeBaseHref}" />
        <title>${safeResultName} | 喵BTI 分享图</title>
        <style>
          :root {
            --bg: #f6dfaa;
            --paper: #fffaf1;
            --panel: #fffdf8;
            --line: rgba(181, 142, 68, 0.18);
            --ink: #5b3416;
            --subtle: #8f6840;
            --accent: #f3a437;
            --accent-soft: #ffe7aa;
            --shadow: 0 24px 60px rgba(123, 84, 28, 0.16);
          }

          * { box-sizing: border-box; }
          html, body { margin: 0; min-height: 100%; }
          body {
            font-family: "Segoe UI", "PingFang SC", sans-serif;
            background:
              radial-gradient(circle at top left, rgba(255, 243, 205, 0.95), transparent 28rem),
              linear-gradient(180deg, #f5dfae 0%, #f8e8c7 100%);
            color: var(--ink);
          }

          .share-page {
            max-width: 1260px;
            margin: 0 auto;
            padding: 20px;
          }

          .share-shell {
            display: grid;
            grid-template-columns: minmax(0, 1.55fr) minmax(290px, 0.82fr);
            gap: 18px;
            align-items: start;
          }

          .share-col {
            background: rgba(255, 250, 241, 0.96);
            border: 1px solid rgba(214, 183, 128, 0.48);
            border-radius: 26px;
            box-shadow: var(--shadow);
            padding: 16px;
          }

          .share-main-hero {
            position: relative;
            overflow: hidden;
            border-radius: 24px;
            background:
              radial-gradient(circle at 14% 16%, rgba(255, 243, 208, 0.95), transparent 10rem),
              radial-gradient(circle at 92% 8%, rgba(255, 233, 180, 0.8), transparent 8rem),
              linear-gradient(180deg, #fffdf8 0%, #fff6df 100%);
            border: 1px solid var(--line);
            padding: 22px 22px 18px;
          }

          .share-brand {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
          }

          .share-brand-left {
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .share-brand-left img,
          .share-footer-brand img {
            width: 56px;
            height: 56px;
            object-fit: cover;
            border-radius: 18px;
          }

          .share-brand-copy strong {
            display: block;
            font-size: 17px;
            font-weight: 900;
          }

          .share-brand-copy span,
          .share-stamp span {
            color: var(--subtle);
            font-size: 12px;
            font-weight: 700;
          }

          .share-stamp {
            width: 92px;
            height: 92px;
            border: 3px solid rgba(214, 147, 52, 0.55);
            border-radius: 50%;
            display: grid;
            place-items: center;
            transform: rotate(-10deg);
            text-align: center;
            color: #cf8d30;
            background: rgba(255, 252, 246, 0.84);
          }

          .share-stamp strong {
            display: block;
            font-size: 20px;
            font-weight: 900;
          }

          .share-hero-tagline {
            margin: 14px 0 0;
            color: #8a6237;
            font-size: 26px;
            line-height: 1.5;
            font-weight: 900;
          }

          .share-illustration {
            position: relative;
            margin-top: 16px;
            padding: 18px;
            border-radius: 28px;
            background:
              radial-gradient(circle at 80% 12%, rgba(255, 255, 255, 0.75), transparent 7rem),
              linear-gradient(180deg, #fff1c8 0%, #ffe9bc 100%);
            min-height: 520px;
            display: grid;
            grid-template-columns: minmax(0, 1fr) 190px;
            gap: 12px;
            align-items: end;
          }

          .share-sticky-notes {
            position: absolute;
            left: 18px;
            top: 22px;
            display: grid;
            gap: 10px;
          }

          .share-note {
            width: 126px;
            padding: 12px 10px;
            border-radius: 8px;
            font-size: 12px;
            line-height: 1.5;
            font-weight: 800;
            color: #72512c;
            box-shadow: 0 10px 24px rgba(155, 117, 62, 0.12);
          }

          .share-note.green { background: #dfeea8; transform: rotate(-7deg); }
          .share-note.pink { background: #ffd8d7; transform: rotate(-9deg); margin-left: 14px; }

          .share-cat-wrap {
            display: flex;
            align-items: end;
            justify-content: center;
            min-height: 100%;
            padding-top: 64px;
          }

          .share-cat-wrap img {
            width: 100%;
            max-width: 440px;
            object-fit: contain;
            filter: drop-shadow(0 24px 36px rgba(95, 67, 27, 0.12));
          }

          .share-bubbles {
            display: grid;
            gap: 12px;
            align-self: start;
            padding-top: 96px;
          }

          .share-bubble {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 999px;
            padding: 16px 18px;
            font-size: 16px;
            line-height: 1.45;
            font-weight: 800;
            text-align: center;
            color: #6b4a2a;
            box-shadow: 0 12px 22px rgba(123, 85, 31, 0.1);
          }

          .share-analysis {
            margin-top: 14px;
            background: var(--panel);
            border: 1px solid var(--line);
            border-radius: 18px;
            padding: 18px;
          }

          .share-analysis h3,
          .share-catnip h3,
          .share-side-card h3 {
            margin: 0 0 8px;
            font-size: 32px;
            font-weight: 900;
          }

          .share-analysis p,
          .share-catnip-subtitle,
          .share-suggestion-list p {
            margin: 0;
            color: #68492b;
            font-size: 18px;
            line-height: 1.75;
            font-weight: 700;
          }

          .share-catnip {
            margin-top: 14px;
            background: var(--panel);
            border: 1px solid var(--line);
            border-radius: 18px;
            padding: 18px;
          }

          .share-videos {
            margin-top: 16px;
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 14px;
          }

          .share-video-card h4,
          .share-video-card p {
            margin: 10px 0 0;
          }

          .share-video-card h4 {
            font-size: 16px;
            line-height: 1.4;
          }

          .share-video-card p {
            color: #8f6840;
            font-size: 14px;
            font-weight: 800;
          }

          .share-video-cover {
            position: relative;
            overflow: hidden;
            border-radius: 14px;
            aspect-ratio: 1.52;
            background: #f6ebcf;
          }

          .share-video-cover img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
          }

          .share-play {
            position: absolute;
            inset: 50% auto auto 50%;
            transform: translate(-50%, -50%);
            width: 42px;
            height: 42px;
            border-radius: 50%;
            display: grid;
            place-items: center;
            background: rgba(36, 24, 13, 0.6);
            color: #fff;
            font-size: 16px;
          }

          .share-footer-cta {
            margin-top: 14px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 18px;
            background: rgba(255, 251, 244, 0.96);
            border: 1px dashed rgba(225, 177, 91, 0.7);
            border-radius: 18px;
            padding: 18px;
          }

          .share-footer-brand {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .share-footer-brand strong {
            display: block;
            font-size: 18px;
          }

          .share-footer-brand p,
          .share-footer-qr p {
            margin: 2px 0 0;
            color: #8b6740;
            font-size: 14px;
            font-weight: 700;
          }

          .share-footer-qr {
            display: flex;
            align-items: center;
            gap: 12px;
            text-align: left;
          }

          .share-footer-qr-box {
            width: 88px;
            height: 88px;
            border-radius: 16px;
            padding: 10px;
            background: linear-gradient(180deg, #fff, #fff7e9);
            border: 1px solid rgba(224, 188, 118, 0.65);
            display: grid;
            place-items: center;
          }

          .share-footer-qr-box img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 12px;
          }

          .share-side-card {
            background: var(--panel);
            border: 1px solid var(--line);
            border-radius: 20px;
            padding: 18px;
          }

          .share-side-stack {
            display: grid;
            gap: 14px;
          }

          .share-side-meta {
            color: #8a6237;
            font-size: 14px;
            font-weight: 800;
          }

          .share-pill-row {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 12px;
          }

          .share-pill {
            padding: 9px 14px;
            border-radius: 999px;
            background: linear-gradient(180deg, #fff4d7, #fff0cd);
            color: #77522e;
            font-size: 15px;
            font-weight: 900;
            border: 1px solid rgba(236, 191, 111, 0.52);
          }

          .share-metric-stack {
            margin-top: 8px;
            display: grid;
            gap: 12px;
          }

          .share-metric-label {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            color: #704a25;
            font-size: 15px;
            font-weight: 800;
          }

          .share-metric-track {
            margin-top: 6px;
            width: 100%;
            height: 10px;
            border-radius: 999px;
            overflow: hidden;
            background: #f7e7c6;
          }

          .share-metric-track i {
            display: block;
            height: 100%;
            border-radius: inherit;
            background: linear-gradient(90deg, #f4c156, #e8a142);
          }

          .share-similar-list {
            display: grid;
            gap: 12px;
          }

          .share-similar-item {
            display: grid;
            grid-template-columns: 26px 42px minmax(0, 1fr) auto;
            align-items: center;
            gap: 10px;
            color: #704a25;
            font-size: 16px;
            font-weight: 800;
          }

          .share-similar-item img {
            width: 42px;
            height: 42px;
            border-radius: 50%;
            object-fit: cover;
            background: #fff3d6;
          }

          .share-rank {
            width: 26px;
            height: 26px;
            border-radius: 50%;
            display: grid;
            place-items: center;
            background: #ffe5a4;
            font-size: 14px;
          }

          .share-similar-item em {
            font-style: normal;
            color: #8f6840;
          }

          .share-suggestion-list {
            display: grid;
            gap: 14px;
          }

          .share-suggestion-item {
            display: grid;
            grid-template-columns: 28px minmax(0, 1fr);
            gap: 10px;
            align-items: start;
          }

          .share-suggestion-icon {
            width: 28px;
            height: 28px;
            display: grid;
            place-items: center;
            border-radius: 50%;
            background: #fff1cf;
            font-size: 16px;
          }

          .share-side-mascot {
            position: relative;
            overflow: hidden;
            min-height: 212px;
            display: flex;
            align-items: end;
            justify-content: center;
            background:
              radial-gradient(circle at 78% 18%, rgba(255, 233, 174, 0.75), transparent 8rem),
              linear-gradient(180deg, #fff8e8 0%, #ffe9be 100%);
          }

          .share-side-mascot img {
            width: min(88%, 220px);
            object-fit: contain;
          }

          @media (max-width: 980px) {
            .share-shell {
              grid-template-columns: 1fr;
            }

            .share-illustration {
              grid-template-columns: 1fr;
              min-height: auto;
            }

            .share-bubbles {
              padding-top: 0;
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }
          }

          @media (max-width: 720px) {
            .share-page { padding: 12px; }
            .share-col { padding: 12px; border-radius: 20px; }
            .share-main-hero { padding: 16px; }
            .share-brand { align-items: start; }
            .share-stamp { width: 74px; height: 74px; }
            .share-hero-tagline { font-size: 18px; }
            .share-videos { grid-template-columns: 1fr; }
            .share-bubbles { grid-template-columns: 1fr; }
            .share-footer-cta { flex-direction: column; align-items: flex-start; }
            .share-footer-qr { width: 100%; }
          }
        </style>
      </head>
      <body>
        <main class="share-page">
          <div class="share-shell">
            <section class="share-col">
              <section class="share-main-hero">
                <div class="share-brand">
                  <div class="share-brand-left">
                    <img src="${safeIconSrc}" alt="喵BTI" />
                    <div class="share-brand-copy">
                      <strong>喵BTI</strong>
                      <span>我的猫猫人格分享图</span>
                    </div>
                  </div>
                  <div class="share-stamp">
                    <div>
                      <strong>喵BTI</strong>
                      <span>测试报告</span>
                    </div>
                  </div>
                </div>
                <p class="share-hero-tagline">${safeTagline}</p>
                <section class="share-illustration">
                  <div class="share-sticky-notes" aria-hidden="true">
                    <div class="share-note green">早睡早起<br />不如早起打工</div>
                    <div class="share-note pink">只要钱给够<br />周末还能上线</div>
                  </div>
                  <div class="share-cat-wrap">
                    <img src="${heroImageSrc}" alt="${heroImageAlt}" />
                  </div>
                  <div class="share-bubbles">
                    <div class="share-bubble">周一靠咖啡<br />周五靠信念</div>
                    <div class="share-bubble">喵言喵语里<br />都写着真实人格</div>
                  </div>
                </section>
              </section>

              <section class="share-analysis">
                <h3>人格解析</h3>
                ${safeDescriptionMarkup}
                <p>${safeAuxiliary}</p>
              </section>

              <section class="share-catnip">
                <h3>你的猫薄荷</h3>
                <p class="share-catnip-subtitle">这些内容最能让你快乐充电。</p>
                <div class="share-videos">${catnipMarkup}</div>
              </section>

              <section class="share-footer-cta">
                <div class="share-footer-brand">
                  <img src="${safeIconSrc}" alt="喵BTI" />
                  <div>
                    <strong>快来测测你的猫猫人格吧！</strong>
                    <p>16 种猫猫人格等你解锁</p>
                  </div>
                </div>
                <div class="share-footer-qr">
                  <div class="share-footer-qr-box">
                    <img src="${safeIconSrc}" alt="喵BTI 图标" />
                  </div>
                  <div>
                    <strong>长按识别应用图标</strong>
                    <p>搜索“喵BTI”继续测测看</p>
                  </div>
                </div>
              </section>
            </section>

            <aside class="share-col share-side-stack">
              <section class="share-side-card">
                <h3>喵BTI报告</h3>
                <p class="share-side-meta">测试时间：${safeDateText}</p>
              </section>

              <section class="share-side-card">
                <h3>人格关键词</h3>
                <div class="share-pill-row">${keywordMarkup}</div>
              </section>

              <section class="share-side-card">
                <h3>能量分布</h3>
                <div class="share-metric-stack">${metricMarkup}</div>
              </section>

              <section class="share-side-card">
                <h3>与你相似的猫猫</h3>
                <div class="share-similar-list">${similarMarkup}</div>
              </section>

              <section class="share-side-card">
                <h3>喵生建议</h3>
                <div class="share-suggestion-list">
                  <div class="share-suggestion-item">
                    <span class="share-suggestion-icon">☕</span>
                    <p>咖啡可以续命，休息才能充电，记得给自己放个假。</p>
                  </div>
                  <div class="share-suggestion-item">
                    <span class="share-suggestion-icon">🌿</span>
                    <p>你已经很棒啦，别给自己太大压力，稳定比逞强更重要。</p>
                  </div>
                  <div class="share-suggestion-item">
                    <span class="share-suggestion-icon">💗</span>
                    <p>生活不止眼前的工位，还有小鱼干和猫薄荷等你回血。</p>
                  </div>
                </div>
              </section>

              <section class="share-side-card share-side-mascot">
                <img src="./resources/personalities-main/16 可爱喵.png" alt="可爱喵" />
              </section>
            </aside>
          </div>
        </main>
      </body>
    </html>
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
  renderBottomTabbar,
  renderResultView,
  renderShareOverlay,
  renderShareWindowDocument,
  renderTestsView
});
})(globalThis);

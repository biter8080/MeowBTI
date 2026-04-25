(function (global) {
const MaoBTI = global.MaoBTI || (global.MaoBTI = {});

function renderHomeView({ completedCount, unlockedCount }) {
  return `
    <section class="home-screen" aria-label="猫BTI首页">
      <header class="home-topbar">
        <div class="brand-mark" aria-label="猫BTI">
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

        <button type="button" class="feature-card feature-peach" data-action="open-community">
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

        <button type="button" class="feature-card feature-lilac" data-action="open-community">
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
          <button type="button" data-action="open-community">去邀请 <span aria-hidden="true">›</span></button>
        </div>
        <img src="./resources/personalities-main/11 权威猫.png" alt="" />
      </section>

      <nav class="bottom-tabbar" aria-label="首页导航">
        <button type="button" class="is-active" data-action="go-home"><span>⌂</span>首页</button>
        <button type="button" data-action="open-collection"><span>♡</span>图鉴</button>
        <button type="button" class="test-tab" data-action="start-quiz"><span>●</span>测一测</button>
        <button type="button" data-action="open-community"><span>♧</span>社区</button>
        <button type="button" data-action="open-community"><span>♢</span>游戏</button>
      </nav>
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
      <div class="result-hero">
        <div class="result-chip">${result.name}</div>
        <p class="share-line">${result.shareText}</p>
      </div>
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
  renderErrorView,
  renderHomeView,
  renderQuizView,
  renderResultView,
  renderShareOverlay
});
})(globalThis);

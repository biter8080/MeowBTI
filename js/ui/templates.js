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

export function renderQuizView({ index, total, question }) {
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

export function renderResultView({ result, auxiliaryText, resultImage }) {
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
      </div>
      <div class="result-actions">
        <button type="button" data-action="open-share">生成分享图</button>
        <button type="button" class="ghost-button" data-action="restart-quiz">重新测试</button>
      </div>
    </section>
  `;
}

export function renderShareOverlay({ resultName }) {
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

export function renderErrorView(message) {
  return `
    <section class="panel error-card">
      <p class="eyebrow">猫爪打滑了</p>
      <h1>${message}</h1>
      <button type="button" data-action="reload-app">重新打开</button>
    </section>
  `;
}

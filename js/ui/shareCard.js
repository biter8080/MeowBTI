(function (global) {
const MaoBTI = global.MaoBTI || (global.MaoBTI = {});

function wrapText(text, maxCharsPerLine = 14) {
  const result = [];
  let start = 0;

  while (start < text.length) {
    result.push(text.slice(start, start + maxCharsPerLine));
    start += maxCharsPerLine;
  }

  return result;
}

function buildShareCardModel({ result, auxiliaryText }) {
  return {
    title: result.name,
    subtitle: result.tagline,
    lines: [
      "你的猫BTI结果是：",
      result.name,
      ...wrapText(result.shareText, 13),
      ...wrapText(auxiliaryText, 13)
    ],
    theme: {
      accent: result.accentColor,
      ink: "#3e2b1f",
      panel: "#fffaf0",
      soft: "#fff1cc"
    }
  };
}

function roundRectPath(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function fillRoundRect(ctx, x, y, width, height, radius) {
  roundRectPath(ctx, x, y, width, height, radius);
  ctx.fill();
}

function drawShareCard(ctx, model, iconImage) {
  const { width, height } = ctx.canvas;

  ctx.clearRect(0, 0, width, height);

  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#fff7e8");
  gradient.addColorStop(1, "#ffe7dd");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = model.theme.soft;
  fillRoundRect(ctx, 54, 54, width - 108, height - 108, 52);

  ctx.fillStyle = model.theme.panel;
  fillRoundRect(ctx, 84, 200, width - 168, height - 360, 56);

  ctx.fillStyle = model.theme.accent;
  fillRoundRect(ctx, 120, 240, 260, 84, 28);
  ctx.fillStyle = model.theme.ink;
  ctx.font = "bold 42px sans-serif";
  ctx.fillText("喵BTI", 170, 295);

  if (iconImage) {
    ctx.drawImage(iconImage, width - 380, 210, 220, 220);
  }

  ctx.fillStyle = model.theme.ink;
  ctx.font = "bold 88px sans-serif";
  ctx.fillText(model.title, 120, 480);

  ctx.font = "38px sans-serif";
  ctx.fillStyle = "#8a5d2f";
  ctx.fillText(model.subtitle, 120, 550);

  ctx.fillStyle = model.theme.ink;
  ctx.font = "42px sans-serif";
  model.lines.forEach((line, index) => {
    ctx.fillText(line, 120, 690 + index * 78);
  });

  ctx.fillStyle = "rgba(62, 43, 31, 0.12)";
  ctx.font = "32px sans-serif";
  ctx.fillText("结果仅供娱乐，欢迎截图分享给朋友。", 120, height - 210);
}

Object.assign(MaoBTI, { buildShareCardModel, drawShareCard });
})(globalThis);

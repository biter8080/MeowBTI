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
  const seed = Number(result.id) || 1;
  const shareLines = [
    ...wrapText(result.shareText || "", 15),
    ...wrapText(auxiliaryText || "", 15)
  ]
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 8);

  return {
    title: result.name,
    subtitle: result.tagline,
    lines: shareLines,
    keywords: [
      "责任感强",
      "执行在线",
      "内心细腻",
      "稳定发挥",
      "反差萌"
    ],
    metrics: {
      social: 45 + (seed * 7) % 45,
      action: 52 + (seed * 9) % 40,
      emotion: 40 + (seed * 11) % 45,
      stability: 46 + (seed * 13) % 42,
      creativity: 44 + (seed * 15) % 44
    },
    theme: {
      accent: result.accentColor || "#f3a433",
      ink: "#3e2b1f",
      panel: "#fffcf5",
      soft: "#fff3d1"
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

function drawPawMark(ctx, x, y, size, color) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y + size * 0.26, size * 0.2, 0, Math.PI * 2);
  ctx.arc(x - size * 0.28, y - size * 0.1, size * 0.11, 0, Math.PI * 2);
  ctx.arc(x, y - size * 0.2, size * 0.11, 0, Math.PI * 2);
  ctx.arc(x + size * 0.28, y - size * 0.1, size * 0.11, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawRoundedImage(ctx, image, x, y, width, height, radius) {
  ctx.save();
  roundRectPath(ctx, x, y, width, height, radius);
  ctx.clip();
  ctx.drawImage(image, x, y, width, height);
  ctx.restore();
}

function drawFallbackCatFace(ctx, x, y, size) {
  ctx.save();
  const centerX = x + size / 2;
  const centerY = y + size / 2;
  ctx.fillStyle = "#ffe7c4";
  ctx.beginPath();
  ctx.arc(centerX, centerY + 14, size * 0.34, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#f3c999";
  ctx.beginPath();
  ctx.moveTo(centerX - size * 0.24, centerY - size * 0.04);
  ctx.lineTo(centerX - size * 0.08, centerY - size * 0.3);
  ctx.lineTo(centerX + size * 0.01, centerY - size * 0.06);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(centerX + size * 0.24, centerY - size * 0.04);
  ctx.lineTo(centerX + size * 0.08, centerY - size * 0.3);
  ctx.lineTo(centerX - size * 0.01, centerY - size * 0.06);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#2f1f12";
  ctx.beginPath();
  ctx.arc(centerX - size * 0.12, centerY + size * 0.02, size * 0.03, 0, Math.PI * 2);
  ctx.arc(centerX + size * 0.12, centerY + size * 0.02, size * 0.03, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#f08ca0";
  ctx.beginPath();
  ctx.moveTo(centerX, centerY + size * 0.08);
  ctx.lineTo(centerX - size * 0.04, centerY + size * 0.12);
  ctx.lineTo(centerX + size * 0.04, centerY + size * 0.12);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawStamp(ctx, x, y) {
  ctx.save();
  ctx.strokeStyle = "rgba(209, 129, 53, 0.72)";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(x, y, 74, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x, y, 62, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "rgba(209, 129, 53, 0.88)";
  ctx.font = "700 28px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("喵BTI", x, y - 4);
  ctx.font = "600 20px sans-serif";
  ctx.fillText("测试报告", x, y + 28);
  ctx.restore();
}

function drawMetricRow(ctx, x, y, label, value) {
  ctx.fillStyle = "#5d3f22";
  ctx.font = "600 20px sans-serif";
  ctx.fillText(label, x, y);
  ctx.textAlign = "right";
  ctx.fillStyle = "#8a5d2f";
  ctx.fillText(`${value}%`, x + 258, y);
  ctx.textAlign = "left";
  ctx.fillStyle = "rgba(243, 164, 51, 0.2)";
  fillRoundRect(ctx, x, y + 12, 258, 10, 999);
  ctx.fillStyle = "#f1a541";
  fillRoundRect(ctx, x, y + 12, Math.max(32, value * 2.58), 10, 999);
}

function drawShareCard(ctx, model, images = {}) {
  const { width, height } = ctx.canvas;
  const logoImage = images.logoImage || null;
  const resultImage = images.resultImage || null;
  const sideCatImages = images.sideCatImages || [];
  const sideNames = ["摆烂猫", "学习猫", "社恐猫"];
  const quoteOne = model.lines[0] || "责任MAX，靠谱又能扛";
  const quoteTwo = model.lines[1] || "嘴上想躺，行动却最稳";

  const leftX = 36;
  const leftW = 642;
  const rightX = 696;
  const rightW = 348;

  ctx.clearRect(0, 0, width, height);

  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#fff3d3");
  gradient.addColorStop(0.55, "#fff1d7");
  gradient.addColorStop(1, "#ffebc7");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#fffdf5";
  fillRoundRect(ctx, 20, 20, width - 40, height - 40, 30);
  ctx.strokeStyle = "rgba(218, 168, 87, 0.38)";
  ctx.lineWidth = 2;
  roundRectPath(ctx, 20, 20, width - 40, height - 40, 30);
  ctx.stroke();

  drawPawMark(ctx, 124, 126, 94, "rgba(255, 193, 84, 0.24)");
  drawPawMark(ctx, rightX + rightW - 72, 160, 80, "rgba(255, 193, 84, 0.22)");
  drawPawMark(ctx, rightX + rightW - 96, 1738, 92, "rgba(255, 193, 84, 0.2)");

  ctx.fillStyle = "rgba(255, 255, 255, 0.94)";
  fillRoundRect(ctx, leftX, 36, leftW, height - 72, 28);
  fillRoundRect(ctx, rightX, 36, rightW, height - 72, 28);

  ctx.fillStyle = model.theme.soft;
  fillRoundRect(ctx, leftX + 18, 58, leftW - 36, 242, 24);

  if (logoImage) {
    drawRoundedImage(ctx, logoImage, leftX + 30, 84, 108, 108, 20);
  } else {
    drawFallbackCatFace(ctx, leftX + 30, 84, 108);
  }

  drawStamp(ctx, leftX + leftW - 92, 142);

  ctx.fillStyle = model.theme.ink;
  ctx.font = "700 42px sans-serif";
  ctx.fillText("我的猫猫人格是", leftX + 162, 138);

  ctx.fillStyle = model.theme.accent;
  ctx.font = "900 118px sans-serif";
  ctx.fillText(model.title, leftX + 160, 252);

  ctx.fillStyle = model.theme.ink;
  ctx.font = "600 28px sans-serif";
  const subtitleLines = wrapText(model.subtitle || "", 17).slice(0, 2);
  subtitleLines.forEach((line, index) => {
    ctx.fillText(line, leftX + 160, 286 + index * 32);
  });

  ctx.fillStyle = "rgba(255, 245, 224, 0.92)";
  fillRoundRect(ctx, leftX + 18, 324, leftW - 36, 980, 22);

  if (resultImage) {
    drawRoundedImage(ctx, resultImage, leftX + 44, 380, leftW - 88, 570, 24);
  } else if (logoImage) {
    drawRoundedImage(ctx, logoImage, leftX + 44, 380, leftW - 88, 570, 24);
  } else {
    drawFallbackCatFace(ctx, leftX + 138, 472, 360);
  }

  ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
  fillRoundRect(ctx, leftX + 34, 986, leftW - 68, 120, 18);
  ctx.fillStyle = "#6f4b2b";
  ctx.font = "700 26px sans-serif";
  ctx.fillText(quoteOne, leftX + 58, 1040);
  ctx.font = "600 24px sans-serif";
  ctx.fillText(quoteTwo, leftX + 58, 1080);

  ctx.fillStyle = model.theme.ink;
  ctx.font = "700 34px sans-serif";
  ctx.fillText("人格解析", leftX + 34, 1158);

  ctx.fillStyle = "#6a4a2a";
  ctx.font = "500 28px sans-serif";
  model.lines.slice(0, 4).forEach((line, index) => {
    ctx.fillText(line, leftX + 34, 1208 + index * 42);
  });

  ctx.fillStyle = "rgba(255, 255, 255, 0.94)";
  fillRoundRect(ctx, leftX + 24, 1426, leftW - 48, 228, 20);
  ctx.fillStyle = model.theme.ink;
  ctx.font = "700 32px sans-serif";
  ctx.fillText("与你相似的猫猫", leftX + 40, 1480);

  sideCatImages.slice(0, 3).forEach((item, index) => {
    const rowY = 1522 + index * 58;
    if (item) {
      drawRoundedImage(ctx, item, leftX + 44, rowY - 26, 44, 44, 22);
    }
    ctx.fillStyle = "#5f4225";
    ctx.font = "700 24px sans-serif";
    ctx.fillText(sideNames[index], leftX + 104, rowY + 6);
    ctx.textAlign = "right";
    ctx.fillStyle = "#8a5d2f";
    ctx.fillText(`${92 - index * 9}%`, leftX + leftW - 44, rowY + 6);
    ctx.textAlign = "left";
  });

  ctx.fillStyle = "rgba(255, 245, 224, 0.92)";
  fillRoundRect(ctx, rightX + 14, 58, rightW - 28, 120, 18);
  ctx.fillStyle = model.theme.ink;
  ctx.font = "700 36px sans-serif";
  ctx.fillText("喵BTI报告", rightX + 34, 114);
  ctx.font = "500 20px sans-serif";
  ctx.fillStyle = "#7a5634";
  ctx.fillText("测试时间：2026.04.26", rightX + 34, 150);

  ctx.fillStyle = "rgba(255, 245, 224, 0.92)";
  fillRoundRect(ctx, rightX + 14, 198, rightW - 28, 284, 18);
  ctx.fillStyle = model.theme.ink;
  ctx.font = "700 30px sans-serif";
  ctx.fillText("人格关键词", rightX + 34, 242);
  const keywordColors = ["#ffe6bf", "#e4f2d8", "#dfedf9", "#efe4f8", "#ffe9d8"];
  model.keywords.slice(0, 5).forEach((keyword, index) => {
    const chipY = 268 + index * 40;
    ctx.fillStyle = keywordColors[index % keywordColors.length];
    fillRoundRect(ctx, rightX + 30, chipY, rightW - 60, 28, 999);
    ctx.fillStyle = "#5f4225";
    ctx.font = "700 18px sans-serif";
    ctx.fillText(keyword, rightX + 46, chipY + 21);
  });

  ctx.fillStyle = "rgba(255, 245, 224, 0.92)";
  fillRoundRect(ctx, rightX + 14, 500, rightW - 28, 462, 18);
  ctx.fillStyle = model.theme.ink;
  ctx.font = "700 30px sans-serif";
  ctx.fillText("能量分布", rightX + 34, 544);

  drawMetricRow(ctx, rightX + 34, 588, "社交能量", model.metrics.social);
  drawMetricRow(ctx, rightX + 34, 656, "执行力", model.metrics.action);
  drawMetricRow(ctx, rightX + 34, 724, "情绪复原", model.metrics.emotion);
  drawMetricRow(ctx, rightX + 34, 792, "稳定指数", model.metrics.stability);
  drawMetricRow(ctx, rightX + 34, 860, "创意指数", model.metrics.creativity);

  ctx.fillStyle = "rgba(255, 245, 224, 0.92)";
  fillRoundRect(ctx, rightX + 14, 982, rightW - 28, 670, 18);
  ctx.fillStyle = model.theme.ink;
  ctx.font = "700 30px sans-serif";
  ctx.fillText("喵生建议", rightX + 34, 1026);
  ctx.font = "600 22px sans-serif";
  ctx.fillStyle = "#6a4a2a";
  ctx.fillText("咖啡可以续命，休息才能充电", rightX + 34, 1080);
  ctx.fillText("你已经很棒啦，别给自己太大压力", rightX + 34, 1128);
  ctx.fillText("生活不止眼前的工位", rightX + 34, 1176);
  ctx.fillText("还有小鱼干和猫薄荷", rightX + 34, 1224);

  if (sideCatImages[2]) {
    drawRoundedImage(ctx, sideCatImages[2], rightX + 66, 1276, rightW - 132, 284, 24);
  } else if (logoImage) {
    drawRoundedImage(ctx, logoImage, rightX + 66, 1276, rightW - 132, 284, 24);
  }

  ctx.fillStyle = "rgba(255, 255, 255, 0.86)";
  fillRoundRect(ctx, leftX + 20, height - 190, rightX + rightW - leftX - 40, 134, 18);

  ctx.fillStyle = "#6a4a2a";
  ctx.font = "700 36px sans-serif";
  ctx.fillText("快来测测你的猫猫人格吧", leftX + 42, height - 126);

  ctx.font = "600 24px sans-serif";
  ctx.fillText("结果仅供娱乐，欢迎截图分享给朋友", leftX + 42, height - 86);

  ctx.textAlign = "right";
  ctx.fillStyle = "#d6881f";
  ctx.font = "700 30px sans-serif";
  ctx.fillText("喵BTI", rightX + rightW - 38, height - 84);
  ctx.textAlign = "left";
}

Object.assign(MaoBTI, { buildShareCardModel, drawShareCard });
})(globalThis);

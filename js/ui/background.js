export function startBackground(canvas) {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return () => {};
  }

  const particles = Array.from({ length: 14 }, (_, index) => ({
    x: 36 + (index % 4) * 88,
    y: index * 56,
    size: 10 + (index % 3) * 6,
    speed: 0.18 + (index % 4) * 0.05
  }));

  let rafId = 0;

  function resize() {
    const ratio = Math.max(1, window.devicePixelRatio || 1);
    canvas.width = Math.floor(window.innerWidth * ratio);
    canvas.height = Math.floor(window.innerHeight * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function drawPaw(x, y, size, alpha) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = `rgba(255, 207, 69, ${alpha})`;

    ctx.beginPath();
    ctx.arc(0, size * 0.45, size * 0.45, 0, Math.PI * 2);
    ctx.fill();

    const toeRadius = size * 0.18;
    const toeOffset = size * 0.32;
    [
      [-toeOffset, -toeOffset],
      [0, -size * 0.5],
      [toeOffset, -toeOffset]
    ].forEach(([dx, dy]) => {
      ctx.beginPath();
      ctx.arc(dx, dy, toeRadius, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  }

  function frame() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    particles.forEach((particle, index) => {
      drawPaw(
        particle.x,
        particle.y,
        particle.size,
        0.12 + (index % 3) * 0.04
      );

      particle.y += particle.speed;
      particle.x += Math.sin((particle.y + index * 18) / 55) * 0.12;

      if (particle.y > window.innerHeight + 40) {
        particle.y = -20;
      }
    });

    rafId = window.requestAnimationFrame(frame);
  }

  resize();
  window.addEventListener("resize", resize);
  rafId = window.requestAnimationFrame(frame);

  return () => {
    window.cancelAnimationFrame(rafId);
    window.removeEventListener("resize", resize);
  };
}


(function () {
  const MAX_SPARKLES = 300;
  const SPARKLE_LIFETIME = 50;
  const SPARKLE_DISTANCE = 8;

  const COLORS = ["#cff4fa", "#e1defc", "#fce6f7"];

  let canvas, ctx, docW, docH;
  let isInitialized = false;
  let animationRunning = false;
  const sparkles = [];

  for (let i = 0; i < MAX_SPARKLES; i++) {
    sparkles.push({ active: false, x: 0, y: 0, size: 0, life: 0, alpha: 0, color: "" });
  }

  function initCanvas() {
    canvas = document.createElement("canvas");
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "999";
    document.body.appendChild(canvas);
    ctx = canvas.getContext("2d");
    resize();
    window.addEventListener("resize", resize);
    document.addEventListener("mousemove", spawn);
    animationRunning = true;
    requestAnimationFrame(animate);
  }

  function resize() {
    docW = canvas.width = window.innerWidth;
    docH = canvas.height = window.innerHeight;
  }

  function spawn(e) {
    for (let i = 0; i < sparkles.length; i++) {
      if (!sparkles[i].active) {
        sparkles[i].active = true;
        sparkles[i].x = e.clientX;
        sparkles[i].y = e.clientY;
        sparkles[i].size = Math.random() * 2 + 1.5;
        sparkles[i].life = SPARKLE_LIFETIME;
        sparkles[i].alpha = 1;
        sparkles[i].color = COLORS[Math.floor(Math.random() * COLORS.length)];
        break;
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, docW, docH);
    for (let i = 0; i < sparkles.length; i++) {
      const s = sparkles[i];
      if (!s.active) continue;
      s.y -= 0.3;
      s.alpha -= 0.02;
      s.life--;
      if (s.life <= 0 || s.alpha <= 0) {
        s.active = false;
        continue;
      }
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fillStyle = `${s.color.slice(0, -1)}, ${s.alpha})`.replace("rgb", "rgba");
      ctx.fill();
    }
    if (animationRunning) requestAnimationFrame(animate);
  }

  if (!isInitialized) {
    isInitialized = true;
    document.addEventListener("DOMContentLoaded", initCanvas);
  }
})();

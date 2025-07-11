
(function () {
    const MAX_SPARKLES = 1000;
    const SPARKLE_LIFETIME = 30;
    const SPARKLE_DISTANCE = 8;

    let canvas, ctx, docW, docH;
    let isInitialized = false;
    let sparklesEnabled = true;
    let animationRunning = false;
    let lastSpawnTime = 0;

    const stars = [];
    const tinnies = [];
    for (let i = 0; i < MAX_SPARKLES; i++) {
        stars.push({active: false, x: 0, y: 0, ticksLeft: 0, color: ""});
        tinnies.push({active: false, x: 0, y: 0, ticksLeft: 0, color: ""});
    }

    const COLOR_POOL = [];
    (function buildColorPool() {
        for (let i = 0; i < 512; i++) {
            const c1 = 255;
            const c2 = Math.floor(Math.random() * 256);
            const c3 = Math.floor(Math.random() * (256 - c2 / 2));
            const arr = [c1, c2, c3];
            arr.sort(() => 0.5 - Math.random());
            COLOR_POOL.push(`rgb(${arr[0]}, ${arr[1]}, ${arr[2]})`);
        }
    })();

    function initialize() {
        if (isInitialized) return;
        isInitialized = true;

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

        handleResize();
        window.addEventListener("resize", handleResize);
        document.addEventListener("mousemove", onMouseMove);

        if (sparklesEnabled && !animationRunning) {
            animationRunning = true;
            requestAnimationFrame(animate);
        }
    }

    function handleResize() {
        if (!canvas) return;
        docW = window.innerWidth;
        docH = window.innerHeight;
        canvas.width = docW;
        canvas.height = docH;
    }

    function spawnStar(x, y) {
        if (x < 0 || y < 0 || x + 5 >= docW || y + 5 >= docH) return;

        let chosenIdx = -1;
        let minTicks = SPARKLE_LIFETIME * 2 + 1;
        for (let i = 0; i < MAX_SPARKLES; i++) {
            const s = stars[i];
            if (!s.active) {
                chosenIdx = i;
                minTicks = null;
                break;
            } else if (s.ticksLeft < minTicks) {
                minTicks = s.ticksLeft;
                chosenIdx = i;
            }
        }

        if (minTicks !== null) {
            const oldStar = stars[chosenIdx];
            tinnies[chosenIdx].active = true;
            tinnies[chosenIdx].x = oldStar.x;
            tinnies[chosenIdx].y = oldStar.y;
            tinnies[chosenIdx].ticksLeft = SPARKLE_LIFETIME * 2;
            tinnies[chosenIdx].color = oldStar.color;
        }

        const newStar = stars[chosenIdx];
        const col = COLOR_POOL[Math.floor(Math.random() * COLOR_POOL.length)];
        newStar.active = true;
        newStar.x = x;
        newStar.y = y;
        newStar.ticksLeft = SPARKLE_LIFETIME * 2;
        newStar.color = col;
    }

    function animate() {
        ctx.clearRect(0, 0, docW, docH);
        let anyAlive = false;

        for (let i = 0; i < MAX_SPARKLES; i++) {
            const s = stars[i];
            if (!s.active) continue;

            s.ticksLeft--;
            if (s.ticksLeft <= 0) {
                tinnies[i].active = true;
                tinnies[i].x = s.x;
                tinnies[i].y = s.y;
                tinnies[i].ticksLeft = SPARKLE_LIFETIME * 2;
                tinnies[i].color = s.color;
                s.active = false;
                anyAlive = true;
                continue;
            }

            s.y += 1 + 2 * Math.random();
            s.x += (i % 5 - 2) / 6;

            if (Math.random() < 0.3) {
                ctx.strokeStyle = s.color;
                ctx.beginPath();
                ctx.moveTo(s.x - 2, s.y);
                ctx.lineTo(s.x + 2, s.y);
                ctx.moveTo(s.x, s.y - 2);
                ctx.lineTo(s.x, s.y + 2);
                ctx.stroke();
            } else {
                ctx.fillStyle = s.color;
                ctx.fillRect(s.x, s.y, 2, 2);
            }
            anyAlive = true;
        }

        for (let i = 0; i < MAX_SPARKLES; i++) {
            const t = tinnies[i];
            if (!t.active) continue;

            t.ticksLeft--;
            if (t.ticksLeft <= 0) {
                t.active = false;
                continue;
            }

            t.y += 1 + 1.5 * Math.random();
            t.x += (i % 4 - 2) / 4;

            ctx.fillStyle = t.color;
            ctx.fillRect(t.x, t.y, 1.5, 1.5);
            anyAlive = true;
        }

        if (anyAlive || sparklesEnabled) {
            animationRunning = true;
            requestAnimationFrame(animate);
        } else {
            animationRunning = false;
            ctx.clearRect(0, 0, docW, docH);
        }
    }

    function onMouseMove(e) {
        if (!sparklesEnabled) return;

        const now = performance.now();
        if (now - lastSpawnTime < 16) return;
        lastSpawnTime = now;

        const dx = e.movementX;
        const dy = e.movementY;
        const dist = Math.hypot(dx, dy);
        if (dist < 0.5) return;

        let mx = e.clientX;
        let my = e.clientY;

        const prob = dist / SPARKLE_DISTANCE;
        let cum = 0;
        const stepX = (dx * SPARKLE_DISTANCE * 2) / dist;
        const stepY = (dy * SPARKLE_DISTANCE * 2) / dist;

        while (Math.abs(cum) < Math.abs(dx)) {
            if (Math.random() < prob) {
                spawnStar(mx, my);
            }
            const frac = Math.random();
            mx -= stepX * frac;
            my -= stepY * frac;
            cum += stepX * frac;
        }

        if (!animationRunning && isInitialized) {
            animationRunning = true;
            requestAnimationFrame(animate);
        }
    }

    window.sparkle = function (enable = null) {
        if (enable === null) {
            sparklesEnabled = !sparklesEnabled;
        } else {
            sparklesEnabled = !!enable;
        }

        if (!sparklesEnabled && isInitialized) {
            for (let i = 0; i < MAX_SPARKLES; i++) {
                stars[i].active = false;
                tinnies[i].active = false;
            }
        }

        if (sparklesEnabled && isInitialized && !animationRunning) {
            animationRunning = true;
            requestAnimationFrame(animate);
        }
    };

    if (document.readyState === "complete" || document.readyState === "interactive") {
        initialize();
    } else {
        document.addEventListener("DOMContentLoaded", initialize);
    }

})();

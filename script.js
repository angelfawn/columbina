function countdown(targetDate, elementId) {
  const update = () => {
    const now = new Date();
    const diff = new Date(targetDate) - now;
    const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    document.getElementById("days").textContent = days;
    document.getElementById("hours").textContent = String(hours).padStart(2, '0');
    document.getElementById("minutes").textContent = String(minutes).padStart(2, '0');
    document.getElementById("seconds").textContent = String(seconds).padStart(2, '0');
  };
  update();
  setInterval(update, 1000);
}

countdown('2026-01-14T05:00:00', 'countdown');

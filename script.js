function countdown(targetDate, elementId) {
  const update = () => {
    const now = new Date();
    const diff = new Date(targetDate) - now;
    const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
    document.getElementById(elementId).textContent = `${days} days`;
  };
  update();
  setInterval(update, 1000 * 60 * 60); // update every hour
}

// estimated 6.3 release = jan 14, 2026
countdown('2026-01-14T00:00:00', 'countdown');

// set the release date: jan 14, 2026 at 5:00 am
const releaseDate = new Date('2026-01-14T05:00:00');

function updateCountdown() {
  const now = new Date();
  const diff = releaseDate - now;

  const totalSeconds = Math.max(0, Math.floor(diff / 1000));
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const segments = document.querySelectorAll('.count');
  if (segments.length === 4) {
    segments[0].textContent = days;
    segments[1].textContent = hours.toString().padStart(2, '0');
    segments[2].textContent = minutes.toString().padStart(2, '0');
    segments[3].textContent = seconds.toString().padStart(2, '0');
  }
}

updateCountdown();
setInterval(updateCountdown, 1000);

document.addEventListener('DOMContentLoaded', async () => {
  await initializeWords();
  initializeGame();
  loadGame();
  document.getElementById('skip-btn').innerHTML = `Skip<span>${skipCost}</span>`;
  document.getElementById('reveal-btn').innerHTML = `Reveal<span>${revealCost}</span>`;
  document.getElementById('skip-btn').addEventListener('click', skipWord);
  document.getElementById('reveal-btn').addEventListener('click', revealLetter);
  document.getElementById('reset-btn').addEventListener('click', resetGame);
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js');
  }
  adjustScale();
  window.addEventListener('resize', adjustScale);
});

function adjustScale() {
  const gameContainer = document.getElementById('game-container');
  const windowWidth = window.innerWidth;
  const baseWidth = 480;
  const scale = Math.min(windowWidth / baseWidth, 1);
  gameContainer.style.setProperty('--scale-factor', scale);
}
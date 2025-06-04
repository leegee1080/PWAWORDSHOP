document.addEventListener('DOMContentLoaded', async () => {
  await initializeWords();
  initializeGame();
  loadGame();
  const skipBtn = document.getElementById('skip-btn');
  const revealBtn = document.getElementById('reveal-btn');
  const resetBtn = document.getElementById('reset-btn');
  skipBtn.addEventListener('click', skipWord);
  revealBtn.addEventListener('click', revealLetter);
  resetBtn.addEventListener('click', resetGame);
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
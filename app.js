document.addEventListener('DOMContentLoaded', async () => {
  await initializeWords();
  initializeGame();
  loadGame();
  document.getElementById('skip-btn').addEventListener('click', newWord);
  document.getElementById('reset-btn').addEventListener('click', resetGame);
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js');
  }
});
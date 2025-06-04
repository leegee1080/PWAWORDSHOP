let currentWord = '';
let revealedIndices = [];
let playerScore = 200;
let wordsSolved = 0;
let selectedLetter = null;
let letterData = {};
let revealTimes = 0;
let skipTimes = 0;
const initialRevealPercentage = 0.5;
const revealCost = 100;
const skipCost = 50;

function initializeGame() {
  loadJSON('jshelpers/letterData.json').then(data => {
    letterData = data;
    setupAlphabet();
    resetGame();
    setInterval(saveGame, 60000);
  });
}

function setupAlphabet() {
  const alphabetDiv = document.getElementById('alphabet');
  const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
  letters.forEach(letter => {
    const btn = document.createElement('button');
    btn.className = 'letter-btn';
    btn.innerHTML = `${letter}<span>${letterData[letter].price}</span>`;
    btn.addEventListener('click', () => selectLetter(letter, btn));
    alphabetDiv.appendChild(btn);
  });
}

function displayWord() {
  const wordDisplay = document.getElementById('word-display');
  wordDisplay.innerHTML = '';
  currentWord.split('').forEach((letter, index) => {
    const box = document.createElement('div');
    box.className = 'letter-box';
    if (revealedIndices.includes(index)) {
      box.textContent = letter;
      box.classList.add('revealed');
      box.style.pointerEvents = 'none';
    } else {
      box.addEventListener('click', () => handleBoxClick(index));
    }
    wordDisplay.appendChild(box);
  });
}

function selectLetter(letter, button) {
  const buttons = document.querySelectorAll('.letter-btn');
  buttons.forEach(btn => btn.classList.remove('selected'));
  button.classList.add('selected');
  selectedLetter = letter;
}

function handleBoxClick(index) {
  if (selectedLetter === null) return;
  const letterCost = letterData[selectedLetter].price;
  if (playerScore < letterCost) {
    const scoreElement = document.getElementById('score');
    scoreElement.classList.add('incorrect');
    scoreElement.classList.remove('correct');
    setTimeout(() => scoreElement.classList.remove('incorrect'), 1000);
    return;
  }
  const boxes = document.querySelectorAll('.letter-box');
  playerScore -= letterCost;
  const scoreElement = document.getElementById('score');
  scoreElement.classList.add('correct');
  setTimeout(() => scoreElement.classList.remove('correct'), 400);
  updateScore();
  if (selectedLetter.toLowerCase() === currentWord[index].toLowerCase()) {
    revealedIndices.push(index);
    boxes[index].textContent = selectedLetter;
    boxes[index].classList.add('revealed');
    boxes[index].style.pointerEvents = 'none';
    if (revealedIndices.length === currentWord.length) {
      completeWord();
    }
  } else {
    boxes[index].classList.add('incorrect');
    setTimeout(() => boxes[index].classList.remove('incorrect'), 1000);
  }
}

function revealLetter() {
  const currentRevealCost = revealCost * (revealTimes + 1);
  const unrevealedIndices = [];
  currentWord.split('').forEach((_, index) => {
    if (!revealedIndices.includes(index)) {
      unrevealedIndices.push(index);
    }
  });
  if (unrevealedIndices.length === 0 || playerScore < currentRevealCost) {
    if (playerScore < currentRevealCost) {
      const scoreElement = document.getElementById('score');
      scoreElement.classList.add('incorrect');
      scoreElement.classList.remove('correct');
      setTimeout(() => scoreElement.classList.remove('incorrect'), 1000);
    }
    return;
  }
  const randomIndex = unrevealedIndices[Math.floor(Math.random() * unrevealedIndices.length)];
  playerScore -= currentRevealCost;
  revealTimes++;
  document.getElementById('reveal-cost-value').textContent = revealCost * (revealTimes + 1);
  const scoreElement = document.getElementById('score');
  scoreElement.classList.add('correct');
  setTimeout(() => scoreElement.classList.remove('correct'), 400);
  revealedIndices.push(randomIndex);
  updateScore();
  displayWord();
  if (revealedIndices.length === currentWord.length) {
    completeWord();
  }
}

function skipWord() {
  const currentSkipCost = skipCost * (skipTimes + 1);
  if (playerScore < currentSkipCost) {
    const scoreElement = document.getElementById('score');
    scoreElement.classList.add('incorrect');
    scoreElement.classList.remove('correct');
    setTimeout(() => scoreElement.classList.remove('incorrect'), 1000);
    return;
  }
  playerScore -= currentSkipCost;
  skipTimes++;
  document.getElementById('skip-cost-value').textContent = skipCost * (skipTimes + 1);
  const scoreElement = document.getElementById('score');
  scoreElement.classList.add('correct');
  setTimeout(() => scoreElement.classList.remove('correct'), 400);
  updateScore();
  newWord();
}

function completeWord() {
  const wordDisplay = document.getElementById('word-display');
  wordDisplay.classList.add('revealed');
  let blinks = 0;
  const interval = setInterval(() => {
    wordDisplay.style.opacity = wordDisplay.style.opacity === '0.5' ? '1' : '0.5';
    blinks++;
    if (blinks >= 10) {
      clearInterval(interval);
      wordDisplay.style.opacity = '1';
      wordDisplay.classList.remove('revealed');
      const score = currentWord.split('').reduce((sum, letter) => sum + letterData[letter].worth, 0);
      playerScore += score;
      wordsSolved += 1;
      updateScore();
      newWord();
    }
  }, 200);
}

function newWord() {
  currentWord = getRandomWord();
  const revealCount = Math.floor(currentWord.length * initialRevealPercentage);
  revealedIndices = [];
  for (let i = 0; i < revealCount; i++) {
    let index;
    do {
      index = Math.floor(Math.random() * currentWord.length);
    } while (revealedIndices.includes(index));
    revealedIndices.push(index);
  }
  displayWord();
}

function updateScore() {
  document.getElementById('score-value').textContent = playerScore;
  document.getElementById('words-solved-value').textContent = wordsSolved;
}

function resetGame() {
  playerScore = 200;
  wordsSolved = 0;
  revealTimes = 0;
  skipTimes = 0;
  currentWord = '';
  revealedIndices = [];
  selectedLetter = null;
  document.getElementById('reveal-cost-value').textContent = revealCost;
  document.getElementById('skip-cost-value').textContent = skipCost;
  updateScore();
  const buttons = document.querySelectorAll('.letter-btn');
  buttons.forEach(btn => btn.classList.remove('selected'));
  newWord();
  saveGame();
}

function saveGame() {
  localStorage.setItem('wordShop', JSON.stringify({
    score: playerScore,
    word: currentWord,
    revealed: revealedIndices,
    wordsSolved: wordsSolved,
    revealTimes: revealTimes,
    skipTimes: skipTimes
  }));
}

function loadGame() {
  const saved = localStorage.getItem('wordShop');
  if (saved) {
    const data = JSON.parse(saved);
    playerScore = data.score;
    currentWord = data.word;
    revealedIndices = data.revealed;
    wordsSolved = data.wordsSolved || 0;
    revealTimes = data.revealTimes || 0;
    skipTimes = data.skipTimes || 0;
    document.getElementById('reveal-cost-value').textContent = revealCost * (revealTimes + 1);
    document.getElementById('skip-cost-value').textContent = skipCost * (skipTimes + 1);
    updateScore();
    displayWord();
  } else {
    newWord();
  }
}
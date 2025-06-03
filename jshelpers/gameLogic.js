let currentWord = '';
let revealedIndices = [];
let playerScore = 200;
let selectedLetter = null;
let letterData = {};
const initialRevealPercentage = 0.6;
const revealCostMultiplier = 10;

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
  const boxes = document.querySelectorAll('.letter-box');
  playerScore -= letterData[selectedLetter].price;
  updateScore();
  if (selectedLetter.toLowerCase() === currentWord[index].toLowerCase()) {
    revealedIndices.push(index);
    boxes[index].textContent = selectedLetter;
    boxes[index].classList.add('revealed');
    if (revealedIndices.length === currentWord.length) {
      completeWord();
    }
  } else {
    boxes[index].classList.add('incorrect');
    setTimeout(() => boxes[index].classList.remove('incorrect'), 1000);
  }
}

function revealLetter() {
  const unrevealedIndices = [];
  currentWord.split('').forEach((_, index) => {
    if (!revealedIndices.includes(index)) {
      unrevealedIndices.push(index);
    }
  });
  if (unrevealedIndices.length === 0) return;
  const randomIndex = unrevealedIndices[Math.floor(Math.random() * unrevealedIndices.length)];
  const letter = currentWord[randomIndex];
  const revealCost = letterData[letter].price * revealCostMultiplier;
  if (playerScore >= revealCost) {
    playerScore -= revealCost;
    revealedIndices.push(randomIndex);
    updateScore();
    displayWord();
    if (revealedIndices.length === currentWord.length) {
      completeWord();
    }
  }
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
      const score = currentWord.split('').reduce((sum, letter) => sum + letterData[letter].worth, 0);
      playerScore += score;
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
}

function resetGame() {
  playerScore = 200;
  updateScore();
  newWord();
  const buttons = document.querySelectorAll('.letter-btn');
  buttons.forEach(btn => btn.classList.remove('selected'));
  selectedLetter = null;
}

function saveGame() {
  localStorage.setItem('wordShop', JSON.stringify({
    score: playerScore,
    word: currentWord,
    revealed: revealedIndices
  }));
}

function loadGame() {
  const saved = localStorage.getItem('wordShop');
  if (saved) {
    const data = JSON.parse(saved);
    playerScore = data.score;
    currentWord = data.word;
    revealedIndices = data.revealed;
    updateScore();
    displayWord();
  } else {
    newWord();
  }
}
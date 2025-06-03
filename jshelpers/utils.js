async function loadJSON(url) {
  const response = await fetch(url);
  return response.json();
}

async function loadWords() {
  const response = await fetch('jshelpers/words.txt');
  const text = await response.text();
  return text.split(',').filter(word => word.length >= 2 && word.length <= 12);
}

let words = [];

async function initializeWords() {
  words = await loadWords();
}

function getRandomWord() {
  if (words.length === 0) {
    console.error('No words loaded');
    return 'default';
  }
  return words[Math.floor(Math.random() * words.length)];
}
Array.prototype.shuffle = function() {
  var i = this.length, j, temp;
  if (i == 0) return this;
  while (--i) {
    j = Math.floor(Math.random() * (i + 1));
    temp = this[i];
    this[i] = this[j];
    this[j] = temp;
  }
  return this;
}

export function shuffle() {
  let i = this.length;
  let j;
  let temp;
  if (i === 0) return this;
  while (i > 0) {
    j = Math.floor(Math.random() * (i + 1));
    temp = this[i];
    this[i] = this[j];
    this[j] = temp;
    i -= 1;
  }
  return this;
}

export function convertScore(str) {
  let value = 0;
  switch (str.substring(1)) {
    case 'j':
      value = 10;
      break;
    case 'q':
      value = 10;
      break;
    case 'k':
      value = 10;
      break;
    case 'a':
      value = 11;
      break;
    default:
      value = parseInt(str.substring(1), 10);
  }
  return value;
}

export function getScore(hand) {
  let score = 0;
  let i = 0;
  while (i < hand.length) {
    score += convertScore(hand[i]);
    i += 1;
  }
  if (hand.includes('sa') && score > 21) {
    score -= 10;
  }
  if (hand.includes('ca') && score > 21) {
    score -= 10;
  }
  if (hand.includes('ha') && score > 21) {
    score -= 10;
  }
  if (hand.includes('da') && score > 21) {
    score -= 10;
  }
  return score;
}

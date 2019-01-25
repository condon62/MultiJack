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

convertScore = (str) => {
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
      value = parseInt(str.substring(1));
  }
  return value;
}

getScore = (hand) => {
  let score = 0;
  let i = 0;
  while (i < hand.length) {
    score += this.convertScore(hand[i]);
    i++;
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

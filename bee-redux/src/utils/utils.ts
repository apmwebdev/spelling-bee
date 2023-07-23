export const calculateScore = (words: string[]) => {
  return words.reduce((score, word) => {
    if (word.length === 4) {
      return score + 1;
    }
    let wordScore = word.length;
    let uniqueLetters = "";
    for (const letter of word) {
      if (!uniqueLetters.includes(letter)) {
        uniqueLetters += letter;
      }
    }
    if (uniqueLetters.length === 7) {
      wordScore += 7;
    }
    return score + wordScore;
  }, 0);
};

export const calculateWordScore = (word: string) => {
  return calculateScore([word]);
};

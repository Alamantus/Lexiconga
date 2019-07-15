export function getHomonymnIndexes(word) {
  const { currentDictionary } = window;
  const { caseSensitive } = currentDictionary.settings;
  const foundIndexes = [];
  currentDictionary.words.forEach((existingWord, index) => {
    if (existingWord.wordId !== word.wordId
      && (caseSensitive ? existingWord.name === word.name : existingWord.name.toLowerCase() === word.name.toLowerCase())) {
        foundIndexes.push(index);
      }
  });
  return foundIndexes;
}

export function getHomonymnNumber(word) {
  const homonyms = getHomonymnIndexes(word);
  if (homonyms.length > 0) {
    const index = window.currentDictionary.words.findIndex(w => w.wordId === word.wordId);
    let number = 1;

    for (let i = 0; i < homonyms.length; i++) {
      if (index < homonyms[i]) break;
      number++;
    }

    return number;
  }
  return 0;
}

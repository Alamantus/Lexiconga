import { cloneObject } from '../helpers';

export function getWordsStats() {
  const {words, partsOfSpeech} = window.currentDictionary;
  const {caseSensitive} = window.currentDictionary.settings;
  
  const wordStats = {
    numberOfWords: [
      {
        name: 'Total',
        value: words.length,
      },
    ],
    wordLength: {
      shortest: 0,
      longest: 0,
      average: 0,
    },
    letterDistribution: [
      /* {
        letter: '',
        number: 0,
        percentage: 0.00,
      } */
    ],
    totalLetters: 0,
  };

  partsOfSpeech.forEach(partOfSpeech => {
    const wordsWithPartOfSpeech = words.filter(word => word.partOfSpeech === partOfSpeech);
    wordStats.numberOfWords.push({
      name: partOfSpeech,
      value: wordsWithPartOfSpeech.length,
    });
  });

  wordStats.numberOfWords.push({
    name: 'Unclassified',
    value: words.filter(word => !partsOfSpeech.includes(word.partOfSpeech)).length,
  });

  let totalLetters = 0;
  const numberOfLetters = {};

  words.forEach(word => {
    const shortestWord = wordStats.wordLength.shortest;
    const longestWord = wordStats.wordLength.longest;
    const wordLetters = word.name.split('');
    const lettersInWord = wordLetters.length;

    totalLetters += lettersInWord;

    if (shortestWord === 0 || lettersInWord < shortestWord) {
      wordStats.wordLength.shortest = lettersInWord;
    }

    if (longestWord === 0 || lettersInWord > longestWord) {
      wordStats.wordLength.longest = lettersInWord;
    }

    wordLetters.forEach(letter => {
      const letterToUse = caseSensitive ? letter : letter.toLowerCase();
      if (!numberOfLetters.hasOwnProperty(letterToUse)) {
        numberOfLetters[letterToUse] = 1;
      } else {
        numberOfLetters[letterToUse]++;
      }
    });
  });

  wordStats.totalLetters = totalLetters;
  wordStats.wordLength.average = words.length > 0 ? totalLetters / words.length : 0;

  for (const letter in numberOfLetters) {
    if (numberOfLetters.hasOwnProperty(letter)) {
      const number = numberOfLetters[letter];
      wordStats.letterDistribution.push({
        letter,
        number,
        percentage: number / totalLetters,
      });
    }
  }

  wordStats.letterDistribution.sort((a, b) => {
    if (a.percentage === b.percentage) return 0;
    return (a.percentage > b.percentage) ? -1 : 1;
  });

  return wordStats;
}

export function wordExists(word, returnId = false) {
  const { currentDictionary } = window;
  const { caseSensitive } = currentDictionary.settings;
  const foundWord = currentDictionary.words.find(existingWord => {
    return caseSensitive ? existingWord.name === word : existingWord.name.toLowerCase() === word.toLowerCase();
  });
  return foundWord ? (returnId ? foundWord.wordId : true) : false;
}

export function getSearchTerm() {
  return document.getElementById('searchButton').value;
}

export function getMatchingSearchWords() {
  const searchTerm = getSearchTerm();
  const matchingWords = window.currentDictionary.words.slice().filter(word => {
    const isInName = new RegExp(searchTerm, 'g').test(word.name);
    const isInDefinition = new RegExp(searchTerm, 'g').test(word.simpleDefinition);
    const isInDetails = new RegExp(searchTerm, 'g').test(word.longDefinition);
    return isInName || isInDefinition || isInDetails;
  });
  return matchingWords;
}

export function highlightSearchTerm(word) {
  const searchTerm = getSearchTerm();
  const markedUpWord = cloneObject(word);
  if (searchTerm) {
    markedUpWord.name = markedUpWord.name.replace(new RegExp(searchTerm, 'g'), `<mark>${searchTerm}</mark>`);
    markedUpWord.simpleDefinition = markedUpWord.simpleDefinition.replace(new RegExp(searchTerm, 'g'), `<mark>${searchTerm}</mark>`);
    markedUpWord.longDefinition = markedUpWord.longDefinition.replace(new RegExp(searchTerm, 'g'), `<mark>${searchTerm}</mark>`);
  }
  console.log('markedUpWord', markedUpWord);
  return markedUpWord;
}
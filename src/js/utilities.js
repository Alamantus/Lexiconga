import { addWord } from './wordManagement';
import { getCookie } from './StackOverflow/cookie';

export function getNextId() {
  const lastId = window.currentDictionary.words.reduce((highestId, word) => {
    return (word.wordId && word.wordId) > highestId ? word.wordId : highestId;
  }, 0);
  return lastId + 1;
}

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
  wordStats.wordLength.average = words.length > 0 ? Math.round(totalLetters / words.length) : 0;

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

export function generateRandomWords(numberOfWords) {
  console.log('Generating', numberOfWords, 'words...');
  const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
  letters.forEach(letter => letters.push(letter.toUpperCase()));
  const words = [];
  while (words.length < numberOfWords) {
    let word = '';
    while (word === '' || words.includes(word)) {
      word += letters[Math.floor(Math.random() * letters.length)];
    }
    words.push(word);
  }
  words.forEach((word, index) => {
    addWord({
      name: word,
      pronunciation: '/' + word + '/',
      partOfSpeech: Math.random() > 0.5 ? 'Noun' : 'Verb',
      definition: word,
      details: word + (index > 0 ? '\n\nRef: {{' + words[index - 1] + '}}' : ''),
      wordId: getNextId(),
    }, false);
  });
  console.log('done');
}

export function addMessage(messageText, time = 5000, extraClass = false) {
  const messagingSection = document.getElementById('messagingSection');
  const element = document.createElement('div');
  element.classList.add('message');
  if (extraClass !== false) {
    element.classList.add(extraClass);
  }
  element.innerHTML = '<a class="close-button">&times;&#xFE0E;</a>' + messageText;
  messagingSection.appendChild(element);

  const closeButton = element.querySelector('.close-button');
  const closeMessage = () => {
    closeButton.removeEventListener('click', closeMessage);
    messagingSection.removeChild(element);
  };
  closeButton.addEventListener('click', closeMessage);

  setTimeout(closeMessage, time);
}

export function hasToken() {
  return getCookie('token') !== '';
}

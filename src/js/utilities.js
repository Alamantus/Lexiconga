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

export function addMessage(messageText, time = 5000, extraClass = false) {
  const messagingSection = document.getElementById('messagingSection');
  const element = document.createElement('div');
  element.classList.add('message');
  if (extraClass !== false) {
    element.classList.add(extraClass);
  }
  element.innerHTML = `<a class="close-button" style="animation-duration: ${time / 1000}s;">&times;&#xFE0E;</a>` + messageText;
  messagingSection.appendChild(element);

  const closeButton = element.querySelector('.close-button');
  const closeMessage = () => {
    closeButton.removeEventListener('click', closeMessage);
    fadeOutElement(element);
  };
  closeButton.addEventListener('click', closeMessage);

  if (time > 0) {
    setTimeout(closeMessage, time);
  }
}

export function fadeOutElement(element) {
  element.classList.add('fadeout');
  setTimeout(() => {
    element.parentElement.removeChild(element);
  }, 300);
}

export function hideAllModals() {
  const permanentModals = ['#searchModal', '#settingsModal', '#editModal'];
  const hideModals = document.querySelectorAll(permanentModals.join(',')),
    removeModals = document.querySelectorAll('.modal:not(' + permanentModals.join('):not(') + ')');
  Array.from(hideModals).forEach(modal => modal.style.display = 'none');
  Array.from(removeModals).forEach(modal => modal.parentElement.removeChild(modal));
}

export function hasToken() {
  return window.isOffline !== true && getCookie('token') !== '';
}

export function objectValuesAreDifferent(newObject, oldObject) {
  let valuesAreDifferent = false;
  for (let property in newObject) {
    if (!oldObject.hasOwnProperty(property) || JSON.stringify(newObject[property]) !== JSON.stringify(oldObject[property])) {
      valuesAreDifferent = true;
    }
    if (typeof newObject[property] === 'object' && !Array.isArray(newObject[property])) {
      valuesAreDifferent = objectValuesAreDifferent(newObject[property], oldObject[property]);
    }
    
    if (valuesAreDifferent) break;
  }
  
  return valuesAreDifferent;
}

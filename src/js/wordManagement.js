import { renderWords } from "./render";
import { wordExists } from "./utilities";

export function validateWord(word, wordId = false) {
  const errorElementId = wordId === false ? 'wordErrorMessage' : 'wordErrorMessage_' + wordId,
    errorElement = document.getElementById(errorElementId);
  let errorMessage = '';
  
  if (word.name === '') {
    errorMessage += '<p class="bold red">Word field must not be blank.</p>';
  }
  if (word.simpleDefinition === '' && word.longDefinition === '') {
    errorMessage += '<p class="bold red">You must enter Definition or Details.</p>';
  }

  const { allowDuplicates, caseSensitive } = window.currentDictionary.settings;
  if (!allowDuplicates) {
    const foundDuplicate = wordExists(word.name, true);
    if (foundDuplicate !== false) {
      errorMessage += `<p class="bold red">"<a href="#${foundDuplicate}">${word.name}</a>" already exists, and "Allow Duplicates" is turned off.${!caseSensitive ? ' <em>(Case sensitivity is turned also off)</em>' : ''}</p>`;
    }
  }

  errorElement.innerHTML = errorMessage;
  return errorMessage === '';
}

export function addWord(word) {
  const { sortByDefinition } = window.currentDictionary.settings;
  const sortBy = sortByDefinition ? 'simpleDefinition' : 'name';

  window.currentDictionary.words.push(word);
  window.currentDictionary.words.sort((wordA, wordB) => {
    if (wordA[sortBy] === wordB[sortBy]) return 0;
    return wordA[sortBy] > wordB[sortBy] ? 1 : -1;
  });

  renderWords();
}

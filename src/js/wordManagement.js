import { renderWords } from "./render";
import { wordExists, addMessage, getNextId } from "./utilities";
import removeDiacritics from "./StackOverflow/removeDiacritics";
import { removeTags } from "../helpers";
import { saveDictionary } from "./dictionaryManagement";

export function validateWord(word, wordId = false) {
  const errorElementId = wordId === false ? 'wordErrorMessage' : 'wordErrorMessage_' + wordId,
    errorElement = document.getElementById(errorElementId);
  let errorMessage = '';
  
  if (word.name === '') {
    errorMessage += '<p class="bold red">Word field must not be blank.</p>';
  }
  if (word.definition === '' && word.details === '') {
    errorMessage += '<p class="bold red">You must enter Definition or Details.</p>';
  }

  const { allowDuplicates, caseSensitive } = window.currentDictionary.settings;
  if (!allowDuplicates) {
    const foundDuplicate = wordExists(word.name, true);
    if (foundDuplicate !== false) {
      if (wordId !== false && foundDuplicate !== wordId) {
        errorMessage += `<p class="bold red">"<a href="#${foundDuplicate}">${word.name}</a>" already exists, and "Prevent Duplicate Words" is turned on.${!caseSensitive ? ' <em>(Case sensitivity is turned off)</em>' : ''}</p>`;
      }
    }
  }

  errorElement.innerHTML = errorMessage;
  return errorMessage === '';
}

export function sortWords(render) {
  const { sortByDefinition } = window.currentDictionary.settings;
  const sortBy = sortByDefinition ? 'definition' : 'name';

  window.currentDictionary.words.sort((wordA, wordB) => {
    if (removeDiacritics(wordA[sortBy]).toLowerCase() === removeDiacritics(wordB[sortBy]).toLowerCase()) return 0;
    return removeDiacritics(wordA[sortBy]).toLowerCase() > removeDiacritics(wordB[sortBy]).toLowerCase() ? 1 : -1;
  });
  
  saveDictionary();

  if (render) {
    renderWords();
  }
}

export function submitWordForm() {
  const name = document.getElementById('wordName').value,
    pronunciation = document.getElementById('wordPronunciation').value,
    partOfSpeech = document.getElementById('wordPartOfSpeech').value,
    definition = document.getElementById('wordDefinition').value,
    details = document.getElementById('wordDetails').value;

  const word = {
    name: removeTags(name).trim(),
    pronunciation: removeTags(pronunciation).trim(),
    partOfSpeech: removeTags(partOfSpeech).trim(),
    definition: removeTags(definition).trim(),
    details: removeTags(details).trim(),
    wordId: getNextId(),
  };

  if (validateWord(word)) {
    addWord(word);
    clearWordForm();
  }
}

export function clearWordForm() {
  document.getElementById('wordName').value = '';
  document.getElementById('wordPronunciation').value = '';
  document.getElementById('wordPartOfSpeech').value = '';
  document.getElementById('wordDefinition').value = '';
  document.getElementById('wordDetails').value = '';

  document.getElementById('wordName').focus();
}

export function addWord(word, render = true, message = true) {
  window.currentDictionary.words.push(word);
  if (message) {
    addMessage(`<a href="#${word.wordId}">${word.name}</a> Created Successfully`, 10000);
  }
  sortWords(render);
}

export function deleteWord(wordId) {
  const wordIndex = window.currentDictionary.words.findIndex(word => word.wordId === wordId);
  if (wordIndex < 0) {
    console.error('Could not find word to delete');
  } else {
    window.currentDictionary.words.splice(wordIndex, 1);
    addMessage('Word Deleted Successfully');
    sortWords(true);
  }
}

export function updateWord(word, wordId) {
  const wordIndex = window.currentDictionary.words.findIndex(word => word.wordId === wordId);

  if (wordIndex < 0) {
    console.error('Could not find word to update');
  } else {
    window.currentDictionary.words[wordIndex] = word;
    addMessage('Word Updated Successfully');
    sortWords(true);
  }
}

export function confirmEditWord(id) {
  const wordId = typeof id.target !== 'undefined' ? parseInt(this.id.replace('editWordButton_', '')) : id;
  console.log(wordId);
  const name = document.getElementById('wordName_' + wordId).value,
    pronunciation = document.getElementById('wordPronunciation_' + wordId).value,
    partOfSpeech = document.getElementById('wordPartOfSpeech_' + wordId).value,
    definition = document.getElementById('wordDefinition_' + wordId).value,
    details = document.getElementById('wordDetails_' + wordId).value;

  const word = {
    name: removeTags(name).trim(),
    pronunciation: removeTags(pronunciation).trim(),
    partOfSpeech: removeTags(partOfSpeech).trim(),
    definition: removeTags(definition).trim(),
    details: removeTags(details).trim(),
    wordId,
  };

  if (validateWord(word, wordId)) {
    if (confirm(`Are you sure you want to save changes to "${word.name}"?`)) {
      document.getElementById('editForm_' + wordId).classList.add('done');
      updateWord(word, wordId);
    }
  }
}

export function cancelEditWord() {
  const wordId = parseInt(this.parentElement.id.replace('editForm_', ''));
  if (confirm(`Are you sure you want to cancel?\n(Any changes will be lost!)`)) {
    document.getElementById('editForm_' + wordId).classList.add('done');
    renderWords();
  }
}

export function confirmDeleteWord(wordId) {
  wordId = typeof wordId.target === 'undefined' ? wordId : parseInt(wordId.target.id.replace('delete_', ''));
  const word = window.currentDictionary.words.find(w => w.wordId === wordId);

  if (!word) {
    console.error('Something went wrong! Couldn\'t find word with id of ' + wordId);
  } else {
    if (confirm(`Are you sure you want to delete "${word.name}"?`)) {
      if (confirm(`Just to double-check:\nDo you really want to delete "${word.name}"?\n\nYou won't be able to undo it!`)) {
        deleteWord(wordId);
      }
    }
  }
}

export function getOpenEditForms() {
  const openEditForms = document.getElementsByClassName('edit-form');
  const formsToReopen = [];
  Array.from(openEditForms).forEach(form => {
    if (!form.classList.contains('done')) {
      formsToReopen.push(parseInt(form.id.replace('editForm_', '')));
    }
  });

  return formsToReopen;
}

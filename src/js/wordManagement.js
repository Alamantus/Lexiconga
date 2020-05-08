import { renderWords } from "./render/words";
import { wordExists, addMessage, getNextId, hasToken, getHomonymnIndexes } from "./utilities";
import removeDiacritics from "./StackOverflow/removeDiacritics";
import { removeTags, getTimestampInSeconds } from "../helpers";
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
  const { alphabeticalOrder } = window.currentDictionary;
  const sortBy = sortByDefinition ? 'definition' : 'name';

  window.currentDictionary.words.sort((wordA, wordB) => {
    // Sort normally first
    return wordA[sortBy].localeCompare(wordB[sortBy], 'en', { sensitivity: 'base' }); // This is the smart way to do the below!
    // if (removeDiacritics(wordA[sortBy]).toLowerCase() === removeDiacritics(wordB[sortBy]).toLowerCase()) return 0;
    // return removeDiacritics(wordA[sortBy]).toLowerCase() > removeDiacritics(wordB[sortBy]).toLowerCase() ? 1 : -1;
  });

  if (alphabeticalOrder.length > 0) {
    // If there's an alphabetical order specified, sort by that after! Any letters not in the alphabet will be unsorted, keeping them in ASCII order
    const ordering = {}; // map for efficient lookup of sortIndex
    for (let i = 0; i < alphabeticalOrder.length; i++) {
      ordering[alphabeticalOrder[i]] = i + 1; // Add 1 to prevent 0 from resolving to false
    }
    
    window.currentDictionary.words.sort((wordA, wordB) => {
      // console.log(alphabeticalOrder, ordering);
      // console.log('comparing:', wordA[sortBy], wordB[sortBy]);
      if (wordA[sortBy] === wordB[sortBy]) return 0;

      const aLetters = wordA[sortBy].split('');
      const bLetters = wordB[sortBy].split('');
      
      for (let i = 0; i < aLetters.length; i++) {
        const a = aLetters[i];
        const b = bLetters[i];
        // console.log('comparing letters', a, b);
        if (!b) {
          // console.log('no b, ', wordA[sortBy], 'is longer than', wordB[sortBy]);
          return 1;
        }
        if (!ordering[a] && !ordering[b]) {
          // console.log('a and b not in dictionary:', a, b, 'continuing to the next letter');
          continue;
        }
        if (!ordering[a]) {
          // console.log('a is not in dictionary:', a, 'moving back:', wordA[sortBy]);
          return 1;
        }
        if (!ordering[b]) {
          // console.log('b is not in dictionary:', b, 'moving forward:', wordA[sortBy]);
          return -1;
        }
        if (ordering[a] === ordering[b]) {
          // console.log('letters are the same order:', a, b);
          if (aLetters.length < bLetters.length && i === aLetters.length - 1) {
            // console.log(a, 'is shorter than', b);
            return -1;
          }
          // console.log(a, 'is the same as', b, 'continuing to the next letter');
          continue;
        }
        // console.log('comparing order:', a, b, 'result:', ordering[a] - ordering[b]);
        return ordering[a] - ordering[b];
      }

      // console.log('all of the letters were dumb, no sort');
      return 0;
    });
  }
  
  saveDictionary(false);

  if (render) {
    renderWords();
  }
}

export function translateOrthography(word) {
  window.currentDictionary.details.orthography.translations.forEach(translation => {
    translation = translation.split('=').map(value => value.trim());
    if (translation.length > 1 && translation[0] !== '' && translation[1] !== '') {
      word = word.replace(new RegExp(translation[0], 'g'), translation[1]);
    }
  });
  return word;
}

export function parseReferences(detailsMarkdown) {
  const references = detailsMarkdown.match(/\{\{.+?\}\}/g);
  if (references && Array.isArray(references)) {
    new Set(references).forEach(reference => {
      const wordMarkdownLink = getWordReferenceMarkdown(reference);
      if (wordMarkdownLink !== reference) {
        detailsMarkdown = detailsMarkdown.replace(new RegExp(reference, 'g'), wordMarkdownLink);
      }
    });
  }
  return detailsMarkdown;
}

export function getWordReferenceMarkdown(reference) {
  const wordToFind = reference.replace(/\{\{|\}\}/g, '');
  let homonymn = 0;

  if (wordToFind.includes(':')) {
    const separator = wordToFind.indexOf(':');
    homonymn = wordToFind.substr(separator + 1);
    wordToFind = wordToFind.substring(0, separator);
    if (homonymn && homonymn.trim()
      && !isNaN(parseInt(homonymn.trim())) && parseInt(homonymn.trim()) > 0) {
      homonymn = parseInt(homonymn.trim());
    } else {
      homonymn = false;
    }
  }

  let existingWordId = false;
  const homonymnIndexes = getHomonymnIndexes({ name: wordToFind, wordId: -1 });

  if (homonymn !== false && homonymn > 0) {
    if (typeof homonymnIndexes[homonymn - 1] !== 'undefined') {
      existingWordId = window.currentDictionary.words[homonymnIndexes[homonymn - 1]].wordId;
    }
  } else if (homonymn !== false) {
    existingWordId = wordExists(wordToFind, true);
  }

  if (existingWordId !== false) {
    if (homonymn < 1 && homonymnIndexes.length > 0) {
      homonymn = 1;
    }
    const homonymnSubHTML = homonymnIndexes.length > 1 && homonymn - 1 >= 0 ? '<sub>' + homonymn.toString() + '</sub>' : '';
    return `<span class="word-reference">[<span class="orthographic-translation">${translateOrthography(wordToFind)}</span>${homonymnSubHTML}](#${existingWordId})</span>`;
  }

  return reference;
}

export function expandAdvancedForm(id = false) {
  const wordId = typeof id.target !== 'undefined' ? this.id.replace('expandAdvancedForm', '') : id;
  const button = typeof id.target !== 'undefined' ? this : document.getElementById('expandAdvancedForm' + (!wordId ? '' : wordId)),
    form = document.getElementById('advancedForm' + (!wordId ? '' : wordId));
  if (form.style.display !== 'block') {
    button.innerText = 'Hide Advanced Fields';
    form.style.display = 'block';
  } else {
    button.innerText = 'Show Advanced Fields';
    form.style.display = 'none';
  }
}

export function submitWordForm() {
  const name = document.getElementById('wordName').value,
    pronunciation = document.getElementById('wordPronunciation').value,
    partOfSpeech = document.getElementById('wordPartOfSpeech').value,
    definition = document.getElementById('wordDefinition').value,
    details = document.getElementById('wordDetails').value,
    etymology = document.getElementById('wordEtymology').value,
    related = document.getElementById('wordRelated').value,
    principalParts = document.getElementById('wordPrincipalParts').value;

  const word = {
    name: removeTags(name).trim(),
    pronunciation: removeTags(pronunciation).trim(),
    partOfSpeech: removeTags(partOfSpeech).trim(),
    definition: removeTags(definition).trim(),
    details: removeTags(details).trim(),
    wordId: getNextId(),
  };

  if (removeTags(etymology).trim() !== '') {
    word.etymology = removeTags(etymology).split(',').map(w => w.trim()).filter(w => w.length > 0);
  }

  if (removeTags(related).trim() !== '') {
    word.related = removeTags(related).split(',').map(w => w.trim()).filter(w => w.length > 0);
  }

  if (removeTags(principalParts).trim() !== '') {
    word.principalParts = removeTags(principalParts).split(',').map(w => w.trim()).filter(w => w.length > 0);
  }

  if (validateWord(word)) {
    addWord(word);
    sortWords(true);

    if (hasToken()) {
      import('./account/index.js').then(account => {
        account.uploadWord(word);
      });
    }

    clearWordForm();
  }
}

export function clearWordForm() {
  document.getElementById('wordName').value = '';
  document.getElementById('wordPronunciation').value = '';
  document.getElementById('wordPartOfSpeech').value = '';
  document.getElementById('wordDefinition').value = '';
  document.getElementById('wordDetails').value = '';
  document.getElementById('wordEtymology').value = '';

  document.getElementById('wordName').focus();
}

export function addWord(word, message = true) {
  const timestamp = getTimestampInSeconds();
  word.lastUpdated = timestamp;
  word.createdOn = timestamp;
  window.currentDictionary.words.push(word);
  if (message) {
    addMessage(`<a href="#${word.wordId}">${word.name}</a> Created Successfully`, 30000);
  }

  return word;
}

export function deleteWord(wordId) {
  const wordIndex = window.currentDictionary.words.findIndex(word => word.wordId === wordId);
  if (wordIndex < 0) {
    console.error('Could not find word to delete');
    addMessage('Could not find word to delete. Please refresh your browser and try again.', 10000, 'error');
  } else {
    window.currentDictionary.words.splice(wordIndex, 1);
    addMessage('Word Deleted Successfully');
    sortWords(true);

    if (hasToken()) {
      import('./account/index.js').then(account => {
        account.deleteWord(wordId);
      });
    }
  }
}

export function updateWord(word, wordId) {
  const wordIndex = window.currentDictionary.words.findIndex(word => word.wordId === wordId);

  if (wordIndex < 0) {
    console.error('Could not find word to update');
    addMessage('Could not find word to update. Please refresh your browser and try again.', 10000, 'error');
  } else {
    word.lastUpdated = getTimestampInSeconds();
    word.createdOn = window.currentDictionary.words[wordIndex].createdOn;
    window.currentDictionary.words[wordIndex] = word;
    addMessage('Word Updated Successfully');
    sortWords(true);

    if (hasToken()) {
      import('./account/index.js').then(account => {
        account.uploadWord(word);
      });
    }
  }
}

export function confirmEditWord(id) {
  const wordId = typeof id.target !== 'undefined' ? parseInt(this.id.replace('editWordButton_', '')) : id;
  const name = document.getElementById('wordName_' + wordId).value,
    pronunciation = document.getElementById('wordPronunciation_' + wordId).value,
    partOfSpeech = document.getElementById('wordPartOfSpeech_' + wordId).value,
    definition = document.getElementById('wordDefinition_' + wordId).value,
    details = document.getElementById('wordDetails_' + wordId).value,
    etymology = document.getElementById('wordEtymology_' + wordId).value,
    related = document.getElementById('wordRelated_' + wordId).value,
    principalParts = document.getElementById('wordPrincipalParts_' + wordId).value;

  const word = {
    name: removeTags(name).trim(),
    pronunciation: removeTags(pronunciation).trim(),
    partOfSpeech: removeTags(partOfSpeech).trim(),
    definition: removeTags(definition).trim(),
    details: removeTags(details).trim(),
    wordId,
  };

  if (removeTags(etymology).trim() !== '') {
    word.etymology = removeTags(etymology).split(',').map(w => w.trim()).filter(w => w.length > 0);
  }

  if (removeTags(related).trim() !== '') {
    word.related = removeTags(related).split(',').map(w => w.trim()).filter(w => w.length > 0);
  }

  if (removeTags(principalParts).trim() !== '') {
    word.principalParts = removeTags(principalParts).split(',').map(w => w.trim()).filter(w => w.length > 0);
  }

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
    addMessage('Could not find word to delete. Please refresh your browser and try again.', 10000, 'error');
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

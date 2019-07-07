import { wordExists, getHomonymnIndexes } from "./utilities";
import removeDiacritics from "../StackOverflow/removeDiacritics";

export function sortWords() {
  const { sortByDefinition } = window.currentDictionary.settings;
  const sortBy = sortByDefinition ? 'definition' : 'name';

  window.currentDictionary.words.sort((wordA, wordB) => {
    if (removeDiacritics(wordA[sortBy]).toLowerCase() === removeDiacritics(wordB[sortBy]).toLowerCase()) return 0;
    return removeDiacritics(wordA[sortBy]).toLowerCase() > removeDiacritics(wordB[sortBy]).toLowerCase() ? 1 : -1;
  });
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
      let wordToFind = reference.replace(/\{\{|\}\}/g, '');
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
        const homonymnSubHTML = homonymn > 0 ? '<sub>' + homonymn.toString() + '</sub>' : '';
        const wordMarkdownLink = `<span class="word-reference">[<span class="orthographic-translation">${translateOrthography(wordToFind)}</span>${homonymnSubHTML}](#${existingWordId})</span>`;
        detailsMarkdown = detailsMarkdown.replace(new RegExp(reference, 'g'), wordMarkdownLink);
      }
    });
  }
  return detailsMarkdown;
}

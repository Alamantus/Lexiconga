import { cloneObject, getIndicesOf } from "../../helpers";
import removeDiacritics from "../StackOverflow/removeDiacritics";
import { renderWords } from "./render";

export function showSearchModal() {
  document.getElementById('searchModal').style.display = 'block';
  document.getElementById('searchBox').focus();
}

export function clearSearchText() {
  document.getElementById('searchBox').value = '';
  document.getElementById('openSearchModal').value = '';
  renderWords();
}

export function getSearchTerm() {
  return document.getElementById('searchBox').value;
}

export function getSearchFilters() {
  const filters = {
    caseSensitive: document.getElementById('searchCaseSensitive').checked,
    ignoreDiacritics: document.getElementById('searchIgnoreDiacritics').checked,
    exact: document.getElementById('searchExactWords').checked,
    // orthography is removed my default because it is already rendered on the backend.
    name: document.getElementById('searchIncludeName').checked,
    definition: document.getElementById('searchIncludeDefinition').checked,
    details: document.getElementById('searchIncludeDetails').checked,
    partsOfSpeech: {},
  };
  const partsOfSpeech = document.querySelectorAll('#searchPartsOfSpeech input[type="checkbox"]');
  let checkedBoxes = 0;
  Array.from(partsOfSpeech).forEach(partOfSpeech => {
    const partOfSpeechLabel = partOfSpeech.parentElement.innerText.trim();
    filters.partsOfSpeech[partOfSpeechLabel] = partOfSpeech.checked;
    if (partOfSpeech.checked) checkedBoxes++;
  });

  filters.allPartsOfSpeechChecked = checkedBoxes === partsOfSpeech.length;

  return filters;
}

export function getMatchingSearchWords() {
  let searchTerm = getSearchTerm();
  const filters = getSearchFilters();
  if (searchTerm !== '' || !filters.allPartsOfSpeechChecked) {
    const matchingWords = window.currentDictionary.words.slice().filter(word => {
      if (!filters.allPartsOfSpeechChecked) {
        const partOfSpeech = word.partOfSpeech === '' ? 'Unclassified' : word.partOfSpeech;
        return filters.partsOfSpeech.hasOwnProperty(partOfSpeech) && filters.partsOfSpeech[partOfSpeech];
      }
      return true;
    }).filter(word => {
      searchTerm = filters.ignoreDiacritics ? removeDiacritics(searchTerm) : searchTerm;
      searchTerm = filters.caseSensitive ? searchTerm : searchTerm.toLowerCase();
      let name = filters.ignoreDiacritics ? removeDiacritics(word.name) : word.name;
      name = filters.caseSensitive ? name : name.toLowerCase();
      let definition = filters.ignoreDiacritics ? removeDiacritics(word.definition) : word.definition;
      definition = filters.caseSensitive ? definition : definition.toLowerCase();
      let details = filters.ignoreDiacritics ? removeDiacritics(word.details) : word.details;
      details = filters.caseSensitive ? details : details.toLowerCase();
      let principalParts = typeof word.principalParts === 'undefined' ? [] : word.principalParts;
      principalParts = filters.ignoreDiacritics ? principalParts.map(part => removeDiacritics(part)) : principalParts;
      principalParts = filters.caseSensitive ? principalParts : principalParts.map(part => part.toLowerCase());

      const isInName = filters.name && (filters.exact
        ? searchTerm == name
        : new RegExp(searchTerm, 'g').test(name)
      );
      const isInDefinition = filters.definition && (filters.exact
        ? searchTerm == definition
        : new RegExp(searchTerm, 'g').test(definition)
      );
      const isInDetails = filters.details && new RegExp(searchTerm, 'g').test(details);
      const isInPrincipalParts = filters.name && (filters.exact
        ? principalParts.includes(searchTerm)
        : principalParts.some(part => new RegExp(searchTerm, 'g').test(part))
      );
      return searchTerm === '' || isInName || isInDefinition || isInDetails || isInPrincipalParts;
    });
    return matchingWords;
  }
  
  return window.currentDictionary.words
}

export function highlightSearchTerm(word) {
  let searchTerm = getSearchTerm();
  if (searchTerm) {
    const filters = getSearchFilters();
    const markedUpWord = cloneObject(word);
    if (filters.ignoreDiacritics) {
      const searchTermLength = searchTerm.length;
      searchTerm = removeDiacritics(searchTerm);
      if (filters.name) {
        const nameMatches = getIndicesOf(searchTerm, removeDiacritics(markedUpWord.name), filters.caseSensitive);
        nameMatches.forEach((wordIndex, i) => {
            wordIndex += '<mark></mark>'.length * i;
          markedUpWord.name = markedUpWord.name.substring(0, wordIndex)
            + '<mark>' + markedUpWord.name.substr(wordIndex, searchTermLength) + '</mark>'
            + markedUpWord.name.substr(wordIndex + searchTermLength);
        });

        if (markedUpWord.principalParts !== null) {
          const part = getIndicesOf(searchTerm, removeDiacritics(markedUpWord.principalParts), filters.caseSensitive);
          part.forEach((wordIndex, i) => {
            wordIndex += '<mark></mark>'.length * i;
            markedUpWord.principalParts = markedUpWord.principalParts.substring(0, wordIndex)
              + '<mark>' + markedUpWord.principalParts.substr(wordIndex, searchTermLength) + '</mark>'
              + markedUpWord.principalParts.substr(wordIndex + searchTermLength);
          });
        }
      }
      if (filters.definition) {
        const definitionMatches = getIndicesOf(searchTerm, removeDiacritics(markedUpWord.definition), filters.caseSensitive);
        definitionMatches.forEach((wordIndex, i) => {
          wordIndex += '<mark></mark>'.length * i;
          markedUpWord.definition = markedUpWord.definition.substring(0, wordIndex)
            + '<mark>' + markedUpWord.definition.substr(wordIndex, searchTermLength) + '</mark>'
            + markedUpWord.definition.substr(wordIndex + searchTermLength);
        });
      }
      if (filters.details) {
        const detailsMatches = getIndicesOf(searchTerm, removeDiacritics(markedUpWord.details), filters.caseSensitive);
        detailsMatches.forEach((wordIndex, i) => {
          wordIndex += '<mark></mark>'.length * i;
          markedUpWord.details = markedUpWord.details.substring(0, wordIndex)
            + '<mark>' + markedUpWord.details.substr(wordIndex, searchTermLength) + '</mark>'
            + markedUpWord.details.substr(wordIndex + searchTermLength);
        });
      }
    } else {
      const regexMethod = 'g' + (filters.caseSensitive ? '' : 'i');
      if (filters.name) {
        markedUpWord.name = markedUpWord.name.replace(new RegExp(`(${searchTerm})`, regexMethod), `<mark>$1</mark>`);
        
        if (markedUpWord.principalParts !== null) {
          markedUpWord.principalParts = markedUpWord.principalParts.replace(new RegExp(`(${searchTerm})`, regexMethod), `<mark>$1</mark>`);
        }
      }
      if (filters.definition) {
        markedUpWord.definition = markedUpWord.definition.replace(new RegExp(`(${searchTerm})`, regexMethod), `<mark>$1</mark>`);
      }
      if (filters.details) {
        markedUpWord.details = markedUpWord.details.replace(new RegExp(`(${searchTerm})`, regexMethod), `<mark>$1</mark>`);
      }
    }
    return markedUpWord;
  }
  return word;
}

export function checkAllPartsOfSpeechFilters() {
  const searchFilters = document.querySelectorAll('#searchPartsOfSpeech input[type="checkbox"]');
  Array.from(searchFilters).forEach(filter => {
    filter.checked = true;
  });
  renderWords();
}

export function uncheckAllPartsOfSpeechFilters() {
  const searchFilters = document.querySelectorAll('#searchPartsOfSpeech input[type="checkbox"]');
  Array.from(searchFilters).forEach(filter => {
    filter.checked = false;
  });
  renderWords();
}
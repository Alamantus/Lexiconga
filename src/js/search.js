import { cloneObject, getIndicesOf } from "../helpers";
import removeDiacritics from "./StackOverflow/removeDiacritics";

export function getSearchTerm() {
  return document.getElementById('searchBox').value;
}

export function getSearchFilters() {
  const filters = {
    caseSensitive: document.getElementById('searchCaseSensitive').checked,
    ignoreDiacritics: document.getElementById('searchIgnoreDiacritics').checked,
    exact: document.getElementById('searchExactWords').checked,
    name: document.getElementById('searchIncludeName').checked,
    definition: document.getElementById('searchIncludeDefinition').checked,
    details: document.getElementById('searchIncludeDetails').checked,
    partsOfSpeech: {},
  };
  const partsOfSpeech = document.querySelectorAll('#searchPartsOfSpeech input[type="checkbox"]');
  let checkedBoxes = 0;
  Array.from(partsOfSpeech).forEach(partOfSpeech => {
    // console.log('partOfSpeech Inner Text:', partOfSpeech.parentElement.innerText);
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
        console.log('partOfSpeech', partOfSpeech);
        return filters.partsOfSpeech.hasOwnProperty(partOfSpeech) && filters.partsOfSpeech[partOfSpeech];
      }
      return true;
    }).filter(word => {
      searchTerm = filters.ignoreDiacritics ? removeDiacritics(searchTerm) : searchTerm;
      searchTerm = filters.caseSensitive ? searchTerm : searchTerm.toLowerCase();
      let name = filters.ignoreDiacritics ? removeDiacritics(word.name) : word.name;
      name = filters.caseSensitive ? name : name.toLowerCase();
      let simpleDefinition = filters.ignoreDiacritics ? removeDiacritics(word.simpleDefinition) : word.simpleDefinition;
      simpleDefinition = filters.caseSensitive ? simpleDefinition : simpleDefinition.toLowerCase();
      let longDefinition = filters.ignoreDiacritics ? removeDiacritics(word.longDefinition) : word.longDefinition;
      longDefinition = filters.caseSensitive ? longDefinition : longDefinition.toLowerCase();

      const isInName = filters.name && (filters.exact
          ? searchTerm == name
          : new RegExp(searchTerm, 'g').test(name));
      const isInDefinition = filters.definition && (filters.exact
          ? searchTerm == simpleDefinition
          : new RegExp(searchTerm, 'g').test(simpleDefinition));
      const isInDetails = filters.details && new RegExp(searchTerm, 'g').test(longDefinition);
      return searchTerm === '' || isInName || isInDefinition || isInDetails;
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
      }
      if (filters.definition) {
        const simpleDefinitionMatches = getIndicesOf(searchTerm, removeDiacritics(markedUpWord.simpleDefinition), filters.caseSensitive);
        simpleDefinitionMatches.forEach((wordIndex, i) => {
          wordIndex += '<mark></mark>'.length * i;
          markedUpWord.simpleDefinition = markedUpWord.simpleDefinition.substring(0, wordIndex)
            + '<mark>' + markedUpWord.simpleDefinition.substr(wordIndex, searchTermLength) + '</mark>'
            + markedUpWord.simpleDefinition.substr(wordIndex + searchTermLength);
        });
      }
      if (filters.details) {
        const longDefinitionMatches = getIndicesOf(searchTerm, removeDiacritics(markedUpWord.longDefinition), filters.caseSensitive);
        longDefinitionMatches.forEach((wordIndex, i) => {
          wordIndex += '<mark></mark>'.length * i;
          markedUpWord.longDefinition = markedUpWord.longDefinition.substring(0, wordIndex)
            + '<mark>' + markedUpWord.longDefinition.substr(wordIndex, searchTermLength) + '</mark>'
            + markedUpWord.longDefinition.substr(wordIndex + searchTermLength);
        });
      }
    } else {
      const regexMethod = 'g' + (filters.caseSensitive ? '' : 'i');
      if (filters.name) {
        markedUpWord.name = markedUpWord.name.replace(new RegExp(`(${searchTerm})`, regexMethod), `<mark>$1</mark>`);
      }
      if (filters.definition) {
        markedUpWord.simpleDefinition = markedUpWord.simpleDefinition.replace(new RegExp(`(${searchTerm})`, regexMethod), `<mark>$1</mark>`);
      }
      if (filters.details) {
        markedUpWord.longDefinition = markedUpWord.longDefinition.replace(new RegExp(`(${searchTerm})`, regexMethod), `<mark>$1</mark>`);
      }
    }
    return markedUpWord;
  }
  return word;
}
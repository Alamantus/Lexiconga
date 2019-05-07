import { cloneObject } from "../helpers";

export function getSearchTerm() {
  return document.getElementById('searchBox').value;
}

export function getSearchFilters() {
  const filters = {
    caseSensitive: document.getElementById('searchCaseSensitive').checked,
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
      searchTerm = filters.caseSensitive ? searchTerm : searchTerm.toLowerCase();
      const name = filters.caseSensitive ? word.name : word.name.toLowerCase();
      const simpleDefinition = filters.caseSensitive ? word.simpleDefinition : word.simpleDefinition.toLowerCase();
      const longDefinition = filters.caseSensitive ? word.longDefinition : word.longDefinition.toLowerCase();

      const isInName = filters.name
        && (filters.exact
          ? searchTerm == name
          : new RegExp(searchTerm, 'g').test(name));
      const isInDefinition = filters.definition
        && (filters.exact
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
  const searchTerm = getSearchTerm();
  if (searchTerm) {
    const filters = getSearchFilters();
    const regexMethod = 'g' + (filters.caseSensitive ? '' : 'i');
    const markedUpWord = cloneObject(word);
    markedUpWord.name = markedUpWord.name.replace(new RegExp(`(${searchTerm})`, regexMethod), `<mark>$1</mark>`);
    markedUpWord.simpleDefinition = markedUpWord.simpleDefinition.replace(new RegExp(`(${searchTerm})`, regexMethod), `<mark>$1</mark>`);
    markedUpWord.longDefinition = markedUpWord.longDefinition.replace(new RegExp(`(${searchTerm})`, regexMethod), `<mark>$1</mark>`);
    return markedUpWord;
  }
  return word;
}
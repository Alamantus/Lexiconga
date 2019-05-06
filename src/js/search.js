import { cloneObject } from "../helpers";

export function getSearchTerm() {
  return document.getElementById('searchBox').value;
}

export function getSearchFilters() {
  const filters = {
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
  const searchTerm = getSearchTerm();
  const filters = getSearchFilters();
  const matchingWords = window.currentDictionary.words.slice().filter(word => {
    if (!filters.allPartsOfSpeechChecked) {
      const partOfSpeech = word.partOfSpeech === '' ? 'Unclassified' : word.partOfSpeech;
      console.log('partOfSpeech', partOfSpeech);
      return filters.partsOfSpeech.hasOwnProperty(partOfSpeech) && filters.partsOfSpeech[partOfSpeech];
    }
    return true;
  }).filter(word => {
    const isInName = filters.name && new RegExp(searchTerm, 'g').test(word.name);
    const isInDefinition = filters.definition && new RegExp(searchTerm, 'g').test(word.simpleDefinition);
    const isInDetails = filters.details && new RegExp(searchTerm, 'g').test(word.longDefinition);
    return searchTerm === '' || isInName || isInDefinition || isInDetails;
  });
  return matchingWords;
}

export function highlightSearchTerm(word) {
  const searchTerm = getSearchTerm();
  if (searchTerm) {
    const markedUpWord = cloneObject(word);
    markedUpWord.name = markedUpWord.name.replace(new RegExp(searchTerm, 'g'), `<mark>${searchTerm}</mark>`);
    markedUpWord.simpleDefinition = markedUpWord.simpleDefinition.replace(new RegExp(searchTerm, 'g'), `<mark>${searchTerm}</mark>`);
    markedUpWord.longDefinition = markedUpWord.longDefinition.replace(new RegExp(searchTerm, 'g'), `<mark>${searchTerm}</mark>`);
    return markedUpWord;
  }
  return word;
}
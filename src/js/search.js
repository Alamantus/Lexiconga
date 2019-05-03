import { cloneObject } from "../helpers";

export function getSearchTerm() {
  return document.getElementById('searchBox').value;
}

export function getMatchingSearchWords() {
  const searchTerm = getSearchTerm();
  const matchingWords = window.currentDictionary.words.slice().filter(word => {
    const isInName = new RegExp(searchTerm, 'g').test(word.name);
    const isInDefinition = new RegExp(searchTerm, 'g').test(word.simpleDefinition);
    const isInDetails = new RegExp(searchTerm, 'g').test(word.longDefinition);
    return isInName || isInDefinition || isInDetails;
  });
  return matchingWords;
}

export function highlightSearchTerm(word) {
  const searchTerm = getSearchTerm();
  const markedUpWord = cloneObject(word);
  if (searchTerm) {
    markedUpWord.name = markedUpWord.name.replace(new RegExp(searchTerm, 'g'), `<mark>${searchTerm}</mark>`);
    markedUpWord.simpleDefinition = markedUpWord.simpleDefinition.replace(new RegExp(searchTerm, 'g'), `<mark>${searchTerm}</mark>`);
    markedUpWord.longDefinition = markedUpWord.longDefinition.replace(new RegExp(searchTerm, 'g'), `<mark>${searchTerm}</mark>`);
  }
  return markedUpWord;
}
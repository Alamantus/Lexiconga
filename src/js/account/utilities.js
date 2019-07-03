import { setCookie } from "../StackOverflow/cookie";
import { DELETED_WORDS_LOCALSTORAGE_KEY } from "./constants";
import { getTimestampInSeconds, cloneObject } from "../../helpers";
import { DEFAULT_DICTIONARY } from "../../constants";

export function saveToken(token) {
  setCookie('token', token, 30);
}

export function dictionaryIsDefault() {
  const defaultDictionary = cloneObject(DEFAULT_DICTIONARY);
  delete defaultDictionary.settings.theme;
  delete defaultDictionary.lastUpdated;
  delete defaultDictionary.createdOn;
  delete defaultDictionary.version;
  const currentDictionary = cloneObject(window.currentDictionary);
  delete currentDictionary.settings.theme;
  delete currentDictionary.lastUpdated;
  delete currentDictionary.createdOn;
  delete currentDictionary.version;
  return JSON.stringify(defaultDictionary) === JSON.stringify(currentDictionary);
}

export function getPublicLink() {
  const { externalID } = window.currentDictionary;
  let path;
  if (externalID) {
    path = window.location.pathname.match(new RegExp(externalID + '$'))
      ? window.location.pathname
      : (window.location.pathname.indexOf(externalID) > -1
        ? window.location.pathname.substring(0, window.location.pathname.indexOf(externalID)) + externalID
        : window.location.pathname + externalID
      );
  } else {
    path = '';
  }
  return 'https://' + document.domain + path;
}

export function saveDeletedWordsLocally(wordIds) {
  let storedDeletedWords = getLocalDeletedWords();
  wordIds.forEach(wordId => {
    if (storedDeletedWords.findIndex(stored => stored.id === wordId) < 0) {
      storedDeletedWords.push({
        id: wordId,
        deletedOn: getTimestampInSeconds(),
      });
    }
  });
  window.localStorage.setItem(DELETED_WORDS_LOCALSTORAGE_KEY, JSON.stringify(storedDeletedWords));
}

export function saveDeletedWordLocally(wordId) {
  saveDeletedWordsLocally([wordId]);
}

export function getLocalDeletedWords() {
  let storedDeletedWords = window.localStorage.getItem(DELETED_WORDS_LOCALSTORAGE_KEY);
  if (!storedDeletedWords) {
    storedDeletedWords = [];
  } else {
    storedDeletedWords = JSON.parse(storedDeletedWords);
  }
  return storedDeletedWords;
}

export function clearLocalDeletedWords() {
  window.localStorage.removeItem(DELETED_WORDS_LOCALSTORAGE_KEY);
}

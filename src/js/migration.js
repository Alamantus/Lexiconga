import { LOCAL_STORAGE_KEY, DEFAULT_DICTIONARY, MIGRATE_VERSION } from "../constants";
import { saveDictionary } from "./dictionaryManagement";

export default function migrate() {
  if (window.location.pathname === '/') {
    if (isNotSecure()) {
      sendDictionaryToHTTPS();
    } else {
      checkForReceived();
    }
  }
}

function isNotSecure() {
  return window.location.host !== 'localhost' && window.location.protocol !== 'https:';
}

function sendDictionaryToHTTPS() {
  const storedDictionary = window.localStorage.getItem(LOCAL_STORAGE_KEY);
  const httpsURL = 'https://' + window.location.host;
  if (storedDictionary) {
    if (!dictionaryIsOldDefault(storedDictionary)) {
      const form = document.createElement('form');
      form.action = httpsURL;
      form.method = 'POST';
      form.hidden = true;
      const field = document.createElement('input');
      field.name = 'oldDictionaryFromHTTP';
      field.value = storedDictionary;
      form.appendChild(field);
      const blackoutShield = document.createElement('div');
      blackoutShield.classList.add('modal-background');
      document.body.appendChild(form);
      document.body.appendChild(blackoutShield);
      alert('You are about to be redirected to the secure https version of Lexiconga. Please update your bookmarks.')
      form.submit();
      return;
    }
  }
  window.location = httpsURL;
}

function dictionaryIsOldDefault(dictionaryJSON) {
  const defaultDictionary = {
    name: "New",
    description: "A new dictionary.",
    // createdBy: publicName,
    words: [],
    nextWordId: 1,
    settings: {
      allowDuplicates: false,
      caseSensitive: false,
      partsOfSpeech: "Noun,Adjective,Verb,Adverb,Preposition,Pronoun,Conjunction",
      sortByEquivalent: false,
      isComplete: false,
      isPublic: false
    },
    externalID: 0
  }
  const dictionary = JSON.parse(dictionaryJSON);
  delete dictionary.createdBy;
  
  return JSON.stringify(defaultDictionary) === JSON.stringify(dictionary);
}

function checkForReceived() {
  if (window.hasOwnProperty('dictionaryImportedFromHTTP')) {
    let saveOld = true;
    const storedDictionary = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedDictionary) {
      saveOld = confirm('You have an old local dictionary to import. Would you like to overwrite your current local dictionary?');
    }
    if (saveOld) {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, window.dictionaryImportedFromHTTP);
      delete window.dictionaryImportedFromHTTP;
    }
  }
}

export function migrateDictionary() {
  let migrated = false;
  if (!window.currentDictionary.hasOwnProperty('version')) {
    const fixStupidOldNonsense = string => string.replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&#92;/g, '\\').replace(/<br>/g, '\n');
    window.currentDictionary.description = fixStupidOldNonsense(window.currentDictionary.description);
    const timestamp = getTimestampInSeconds();
    window.currentDictionary.words = window.currentDictionary.words.map(word => {
      word.definition = word.simpleDefinition;
      delete word.simpleDefinition;
      word.details = fixStupidOldNonsense(word.longDefinition);
      delete word.longDefinition;
      word.lastUpdated = timestamp;
      word.createdOn = timestamp;
      return word;
    });
    window.currentDictionary = Object.assign({}, DEFAULT_DICTIONARY, window.currentDictionary);
    window.currentDictionary.partsOfSpeech = window.currentDictionary.settings.partsOfSpeech.split(',').map(val => val.trim()).filter(val => val !== '');
    delete window.currentDictionary.settings.partsOfSpeech;
    delete window.currentDictionary.nextWordId;
    window.currentDictionary.settings.sortByDefinition = window.currentDictionary.settings.sortByEquivalent;
    delete window.currentDictionary.settings.sortByEquivalent;
    window.currentDictionary.settings.theme = 'default';
    delete window.currentDictionary.settings.isComplete;

    migrated = true;
  } else if (window.currentDictionary.version !== MIGRATE_VERSION) {
    switch (window.currentDictionary.version) {
      default: console.error('Unknown version'); break;
      case '2.0.0': {
        window.currentDictionary.details.phonotactics = Object.assign({}, window.currentDictionary.details.phonology.phonotactics);
        delete window.currentDictionary.details.phonology.phonotactics;
        window.currentDictionary.details.phonotactics.notes = window.currentDictionary.details.phonotactics.exceptions;
        delete window.currentDictionary.details.phonotactics.exceptions;
        // Add window.currentDictionary.details.orthography.translations = [];
        // Add window.currentDictionary.custom.css = '';
        window.currentDictionary = Object.assign({}, DEFAULT_DICTIONARY, window.currentDictionary);
        window.currentDictionary.version = MIGRATE_VERSION;
        migrated = true;
        // break; By skipping the break, all migrations can happen in sequence.
      }
    }
  }

  if (migrated) {
    saveDictionary();
  }
}
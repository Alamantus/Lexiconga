import { LOCAL_STORAGE_KEY } from "../constants";

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
  return window.location.host !== 'localhost' && window.location.protocol !== 'https';
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
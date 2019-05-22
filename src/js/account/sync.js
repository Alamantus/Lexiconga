import { addMessage } from "../utilities";
import { saveDictionary } from "../dictionaryManagement";
import { request, saveToken } from "./helpers";

/* Outline for syncing
login
-> check local dictionary id
  (DONE!) ? no id
    -> upload dictionary
    -> make new dictionary current
  ? mismatched id
    -> sync local dictionary (see 'same id' below)
      -> if no matching remote id, ignore (assume deleted)
    -> clear local dictionary
    -> insert downloaded dictionary
  ? same id
    -> compare detail last updated timestamp
      ? downloaded details are newer
        -> replace local details
      ? local details are newer
        -> flag to upload details
    -> filter deleted words from current words
      -- check id and compare deletedOn with createdOn
    -> compare each word and by lastUpdated/createdOn
      ? downloaded word is newer
        -> update local word
      ? local word is newer
        -> put word in an array to upload
    -> upload anything that needs update
 */

export function syncDictionary() {
  if (!window.currentDictionary.hasOwnProperty('externalId')) {
    uploadWholeDictionary(true);
  } else {
    addMessage('Syncing...');
    request({
      action: 'get-current-dictionary',
    }, remote => {
      console.log(remote);
      const detailsSynced = syncDetails(remote.details);
      
      if (detailsSynced === false) {
        addMessage('Could not sync');
      } else {
        detailsSynced.then(success => {
          if (success) {
            console.log('Do a word comparison!');
          }
        });
      }
    }, error => {
      console.error(error);
    }).catch(err => console.error(err));
  }
}

export function uploadWholeDictionary(asNew = false) {
  let promise;
  if (asNew) {
    promise = request({
      action: 'create-new-dictionary',
    }, successData => {
      saveToken(successData.token);
    }, errorData => {
      console.error(errorData);
    });
  } else {
    promise = Promise.resolve();
  }
  const dictionary = {
    details: Object.assign({}, window.currentDictionary),
    words: window.currentDictionary.words,
  };
  delete dictionary.details.words;  // Ugly way to easily get the data I need.
  promise.then(() => {
    request({
      action: 'set-whole-current-dictionary',
      dictionary,
    }, remoteId => {
      window.currentDictionary.externalId = remoteId;
      saveDictionary();
      addMessage('Dictionary Uploaded Successfully');
    }, errorData => {
      console.error(errorData);
      addMessage(errorData);
    })
    .catch(err => console.error('set-whole-current-dictionary: ', err));
  })
  .catch(err => console.error('create-new-dictionary: ', err));
}

export function syncDetails(remoteDetails = false) {
  if (remoteDetails === false || remoteDetails.lastUpdated < window.currentDictionary.lastUpdated) {
    const details = Object.assign({}, window.currentDictionary);
    delete details.words;
    return request({
      action: 'set-dictionary-details',
      details,
    }, successful => {
      addMessage('Saved Details to Server');
      return successful;
    }, error => {
      console.error(error);
      addMessage('Could not sync dictionary');
      return false;
    });
  } else if (remoteDetails.lastUpdated > window.currentDictionary.lastUpdated) {
    window.currentDictionary = Object.assign(window.currentDictionary, remoteDetails);
    saveDictionary();
  }
  addMessage('Dictionary details synchronized');
  return Promise.resolve();
}

export function syncWords(remoteWords, deletedWords) {
  const words = window.currentDictionary.words.filter(word => {
    const deleted = deletedWords.find(deletedWord => deletedWord.id === word.wordId);
    if (deleted) {
      return deleted.deletedOn < word.createdOn;
    }
    return true;
  });
  const newLocalWords = words.filter(word => {
    const remote = remoteWords.find(remoteWord => remoteWord.id === word.wordId);
    return typeof remote === 'undefined';
  });
  remoteWords.forEach(remoteWord => {
    const localWord = words.find(word => word.wordId === remoteWord.wordId);
    if (localWord) {

    }
  });
}
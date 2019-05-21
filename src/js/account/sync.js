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
    console.log('Do a sync comparison!');
    // request({
    //   action: 'get-current-dictionary',
    // }, remote => {
    //   console.log(remote);
    //   syncDetails(remote.details).then(success => {
    //     if (success) {

    //     }
    //   });
    // }, error => {
    //   console.error(error);
    // }).catch(err => console.error(err));
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

export function syncDetails(remoteDetails) {
  if (remoteDetails.hasOwnProperty('lastUpdated') && remoteDetails.lastUpdated > window.currentDictionary.lastUpdated) {
    
  }
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
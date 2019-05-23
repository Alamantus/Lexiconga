import { addMessage } from "../utilities";
import { saveDictionary, clearDictionary } from "../dictionaryManagement";
import { request } from "./helpers";
import { saveToken } from "./utilities";
import { renderAll } from "../render";
import { sortWords } from "../wordManagement";

/* Outline for syncing
login
-> check local dictionary id
  (DONE!) ? no id
    -> upload dictionary
    -> make new dictionary current
  (Canceled) ? mismatched id
    -> sync local dictionary (see 'same id' below)
      -> if no matching remote id, ignore (assume deleted)
    -> clear local dictionary
    -> insert downloaded dictionary
  (DONE!) ? same id
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
      // console.log(remote);
      if (remote.details.externalId !== window.currentDictionary.externalId) {
        clearDictionary();
      }
      const detailsSynced = syncDetails(remote.details);
      
      if (detailsSynced === false) {
        addMessage('Could not sync');
      } else {
        detailsSynced.then(success => {
          renderAll();
          if (success) {
            syncWords(remote.words, remote.deletedWords).then(success => {
              if (success) {
                renderAll();
              } else {
                console.error('word sync failed');
              }
            });
          } else {
            console.error('details sync failed');
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
  let direction;  // This is if/else if tree the only way I can think to correctly prioritize this when to upload vs download.
  if (remoteDetails === false) {
    direction = 'up';
  } else if (!window.currentDictionary.hasOwnProperty('externalId')) { // If mismatched id, dictionary will be cleared, allowing it to be overwritten
    direction = 'down';
  } else if (remoteDetails.lastUpdated < window.currentDictionary.lastUpdated) {
    direction = 'up';
  } else if (remoteDetails.lastUpdated > window.currentDictionary.lastUpdated) {
    direction = 'down';
  }
  if (direction === 'up') {
    return uploadDetails();
  } else if (direction === 'down') {
    window.currentDictionary = Object.assign(window.currentDictionary, remoteDetails);
    saveDictionary();
  }
  addMessage('Dictionary details synchronized');
  return Promise.resolve(true);
}

export function uploadDetails() {
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
}

export function syncWords(remoteWords, deletedWords) {
  const words = window.currentDictionary.words.filter(word => {
    const deleted = deletedWords.find(deletedWord => deletedWord.id === word.wordId);
    if (deleted) {
      return deleted.deletedOn < word.createdOn;
    }
    return true;
  });
  const localWordsToUpload = words.filter(word => {
    // Find words that don't exist in remote words after clearing deleted words
    const remote = remoteWords.find(remoteWord => remoteWord.id === word.wordId);
    return typeof remote === 'undefined';
  });
  
  remoteWords.forEach(remoteWord => {
    const localWord = words.find(word => word.wordId === remoteWord.wordId);
    if (localWord) {
      if (localWord.lastUpdated < remoteWord.lastUpdated) {
        localWord = remoteWord;
      } else if (localWord.lastUpdated > remoteWord.lastUpdated) {
        // Add more-recently-updated words to upload
        localWordsToUpload.push(localWord);
      }
    } else {
      // If word not found, add it to words
      words.push(remoteWord);
    }
  });

  window.currentDictionary.words = words;
  sortWords();
  saveDictionary();

  if (localWordsToUpload.length > 0) {
    return uploadWords(words);
  }

  addMessage('Words synchronized');
  return Promise.resolve(true);
}

export function uploadWords(words) {
  return request({
    action: 'set-dictionary-words',
    words,
  }, successful => {
    addMessage('Saved Words to Server');
    return successful;
  }, error => {
    console.error(error);
    addMessage('Could not upload words');
    return false;
  });
}
import { addMessage } from "../utilities";
import { saveDictionary, clearDictionary } from "../dictionaryManagement";
import { request } from "./helpers";
import { saveToken, dictionaryIsDefault, getPublicLink } from "./utilities";
import { renderAll } from "../render";
import { sortWords } from "../wordManagement";
import { getLocalDeletedWords, clearLocalDeletedWords, saveDeletedWordsLocally } from "./utilities";
import { renderChangeDictionaryOptions } from "./render";

export function syncDictionary(uploadAsNewIfNoExternalID = true) {
  if (!window.currentDictionary.hasOwnProperty('externalID') && !dictionaryIsDefault()) {
    uploadWholeDictionary(uploadAsNewIfNoExternalID);
  } else {
    addMessage('Syncing...');
    request({
      action: 'get-current-dictionary',
    }, remote => {
      performSync(remote);
    }, error => {
      console.error(error);
    }).catch(err => console.error(err));
  }
}

export function performSync(remoteDictionary) {
  if (remoteDictionary.details.externalID !== window.currentDictionary.externalID) {
    clearDictionary();
  }
  const detailsSynced = syncDetails(remoteDictionary.details);

  if (detailsSynced === false) {
    addMessage('Could not sync', 10000, 'error');
  } else {
    detailsSynced.then(success => {
      renderAll();
      if (success) {
        syncWords(remoteDictionary.words, remoteDictionary.deletedWords).then(success => {
          if (success) {
            renderAll();
            
            document.getElementById('accountSettingsChangeDictionary').value = window.currentDictionary.externalID;
            if (document.getElementById('publicLink')) {
              document.getElementById('publicLink').value = getPublicLink();
            }
            if (document.getElementById('publicLinkDisplay')) {
              document.getElementById('publicLinkDisplay').style.display = window.currentDictionary.settings.isPublic ? '' : 'none';
            }
          } else {
            console.error('word sync failed');
          }
        });
      } else {
        console.error('details sync failed');
      }
    });
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
      window.currentDictionary.externalID = remoteId;
      if (document.getElementById('publicLink')) {
        document.getElementById('publicLink').value = getPublicLink();
      }
      saveDictionary(false);
      addMessage('Dictionary Uploaded Successfully');
      renderChangeDictionaryOptions();
    }, errorData => {
      console.error(errorData);
      addMessage(errorData, 10000, 'error');
    })
    .catch(err => console.error('set-whole-current-dictionary: ', err));
  })
  .catch(err => console.error('create-new-dictionary: ', err));
}

export function syncDetails(remoteDetails = false) {
  let direction;  // This is if/else if tree the only way I can think to correctly prioritize this when to upload vs download.
  if (remoteDetails === false) {
    direction = 'up';
  } else if (!window.currentDictionary.hasOwnProperty('externalID')) { // If mismatched id, dictionary will be cleared, allowing it to be overwritten
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
    saveDictionary(false);
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
    addMessage('Could not sync dictionary', 10000, 'undefined');
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
    const remote = remoteWords.find(remoteWord => remoteWord.wordId === word.wordId);
    return typeof remote === 'undefined';
  });

  const localDeletedWords = getLocalDeletedWords();
  if (localDeletedWords.length > 0) {
    const deletedWordIds = [];
    remoteWords = remoteWords.filter(remoteWord => {
      const deleted = deletedWords.find(deletedWord => deletedWord.id === remoteWord.wordId);
      if (deleted) {
        if (deleted.deletedOn > remoteWord.createdOn) {
          deletedWordIds.push(deleted.id);
          return false;
        }
      }
      return true;
    });

    let deletePromise;
    if (deletedWordIds.length > 0) {
      deletePromise = deleteWords(deletedWordIds);
    } else {
      deletePromise = Promise.resolve(true);
    }
    deletePromise.then(success => {
      if (success) {
        clearLocalDeletedWords();
      }
    });
  }
  
  remoteWords.forEach(remoteWord => {
    const localWordIndex = words.findIndex(word => word.wordId === remoteWord.wordId);
    const localWord = words[localWordIndex];
    if (localWord) {
      if (localWord.lastUpdated < remoteWord.lastUpdated) {
        words[localWordIndex] = remoteWord;
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
  saveDictionary(false);

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
    addMessage('Could not upload words', 10000, 'error');
    return false;
  });
}

export function deleteWords(wordIds) {
  return request({
    action: 'delete-words',
    wordIds,
  }, successful => {
    addMessage('Deleted from Server');
    return successful;
  }, error => {
    console.error(error);
    addMessage('Could not delete words', 10000, 'error');
    saveDeletedWordsLocally(wordIds);
    return false;
  });
}
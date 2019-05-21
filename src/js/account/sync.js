import { addMessage } from "../utilities";
import { saveDictionary } from "../dictionaryManagement";
import { request } from "./helpers";

export function syncDictionary() {
  if (!window.currentDictionary.hasOwnProperty('externalId')) {
    uploadWholeDictionaryAsNew();
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

export function uploadWholeDictionaryAsNew() {
  const dictionary = {
    details: Object.assign({}, window.currentDictionary),
    words: window.currentDictionary.words,
  };
  delete dictionary.details.words;  // Ugly way to easily get the data I need.
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
  .catch(err => console.error(err));
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
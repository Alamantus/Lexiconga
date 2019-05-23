import '../../scss/Account/main.scss';

import { renderLoginForm } from "./render";
import { validateToken } from './login';
import {
  uploadWords,
  uploadDetails,
  uploadWholeDictionary,
  deleteWords
} from './sync';
import { saveDeletedWordLocally } from './utilities';
import { addMessage } from '../utilities';
import { updateCurrentChangeDictionaryOption } from './dictionaryManagement';

export function showLoginForm() {
  renderLoginForm();
}

export function loginWithToken() {
  validateToken();
}

export function syncImportedDictionary() {
  uploadWholeDictionary(true);
}

export function uploadDetailsDirect() {
  uploadDetails().catch(err => {
    console.error(err);
    addMessage('Could not connect to account. Trying again in 10 seconds.', undefined, 'error');
    setTimeout(() => {
      uploadDetails();
    }, 10000);
  });
}

export function uploadWord(word) {
  uploadWords([word]).catch(err => {
    console.error(err);
    addMessage('Could not connect to account. Trying again in 10 seconds.', undefined, 'error');
    setTimeout(() => {
      uploadWord(word);
    }, 10000);
  });
}

export function syncImportedWords(words) {
  uploadWords(words);
}

export function deleteWord(wordId) {
  deleteWords([wordId]).catch(err => {
    console.error(err);
    saveDeletedWordLocally(wordId);
    addMessage('Could not connect to account. Trying again in 10 seconds.', undefined, 'error');
    setTimeout(() => {
      deleteWord(wordId);
    }, 10000);
  });
}

export function updateChangeDictionaryOption() {
  updateCurrentChangeDictionaryOption();
}
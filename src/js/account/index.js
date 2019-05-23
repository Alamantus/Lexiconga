import '../../scss/Account/main.scss';

import { renderLoginForm } from "./render";
import { triggerLoginChanges } from './login';
import {
  syncDictionary,
  uploadWords,
  uploadDetails,
  uploadWholeDictionary,
  deleteWords
} from './sync';
import { saveDeletedWordLocally } from './utilities';
import { addMessage } from '../utilities';

export function showLoginForm() {
  renderLoginForm();
}

export function loginWithToken() {
  triggerLoginChanges();
  syncDictionary();
}

export function syncImportedDictionary() {
  uploadWholeDictionary(true);
}

export function uploadDetailsDirect() {
  uploadDetails();
}

export function uploadWord(word) {
  uploadWords([word]);
}

export function syncImportedWords(words) {
  uploadWords(words);
}

export function deleteWord(wordId) {
  deleteWords([wordId]).catch(err => {
    console.error(err);
    saveDeletedWordLocally(wordId);
    addMessage('Could not connect. Trying again in 10 seconds.');
    setTimeout(() => {
      deleteWord(wordId);
    }, 10000);
  });
}
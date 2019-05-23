import '../../scss/Account/main.scss';

import { renderLoginForm } from "./render";
import { triggerLoginChanges } from './login';
import { syncDictionary, uploadWords, uploadDetails, uploadWholeDictionary } from './sync';

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
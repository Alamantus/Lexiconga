import './main.scss';

import setupListeners from './js/setupListeners';
import { renderAll } from './js/render';
import { generateRandomWords, addMessage, hasToken } from './js/utilities';
import { loadDictionary } from './js/dictionaryManagement';
import { loadSettings } from './js/settings';

function initialize() {
  addMessage('Loading...');
  if (hasToken()) {
    import('./js/account/index.js').then(account => {
      account.loginWithToken();
    });
  }
  loadDictionary();
  loadSettings();
  // generateRandomWords(100);
  setupListeners();
  renderAll();
  addMessage('Done Loading!');
  // console.log('Rendered!');
}

window.onload = (function (oldLoad) {
  return function () {
    oldLoad && oldLoad();
    initialize();
  }
})(window.onload);
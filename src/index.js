import './main.scss';

import setupListeners from './js/setupListeners';
import { renderAll } from './js/render';
import { hasToken } from './js/utilities';
import { loadDictionary } from './js/dictionaryManagement';
import { loadSettings } from './js/settings';

function initialize() {
  loadDictionary();
  loadSettings();
  setupListeners();

  if (hasToken()) {
    import('./js/account/index.js').then(account => {
      account.loginWithToken();
    });
  }
  
  renderAll();
}

window.onload = (function (oldLoad) {
  return function () {
    oldLoad && oldLoad();
    initialize();
  }
})(window.onload);
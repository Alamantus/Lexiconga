import migrate from './js/migration';
import setupListeners from './js/setupListeners';
import { renderAll } from './js/render';
import { hasToken, addMessage } from './js/utilities';
import { loadDictionary } from './js/dictionaryManagement';
import { loadSettings } from './js/settings';

function initialize() {
  if (window.isOffline) {
    addMessage('<strong>You are using the Offline version of Lexiconga.</strong><br>Refresh the page while connected to the internet to enable using accounts.', 0);
  }

  migrate();

  loadSettings();
  loadDictionary();
  setupListeners();

  if (hasToken()) {
    import('./js/account/index.js').then(account => {
      account.loginWithToken();
    });
  }

  renderAll();
}

window.onload = (function (oldLoad) {
  oldLoad && oldLoad();
  initialize();
})(window.onload);
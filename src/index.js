import setupListeners from './js/setupListeners';
import { renderAll } from './js/render';
import { hasToken, addMessage } from './js/utilities';
import { loadDictionary } from './js/dictionaryManagement';
import { loadSettings } from './js/settings';
import { setupAds } from './js/ads';

function initialize() {
  if (window.isOffline) {
    addMessage('<strong>You are using the Offline version of Lexiconga.</strong><br>Refresh the page while connected to the internet to enable using accounts.', 0);
  }

  loadSettings();
  loadDictionary();
  setupListeners();

  if (hasToken()) {
    import('./js/account/index.js').then(account => {
      account.loginWithToken();
    });
  }

  setupAds();
  renderAll();
}

window.onload = (function (oldLoad) {
  oldLoad && oldLoad();
  initialize();
})(window.onload);
import setupListeners from './js/setupListeners';
import { renderAll } from './js/render';
import { hasToken } from './js/utilities';
import { loadDictionary } from './js/dictionaryManagement';
import { loadSettings } from './js/settings';
import { setupAds } from './js/ads';

function initialize() {
  loadSettings();
  loadDictionary();
  setupListeners();

  if (hasToken()) {
    import('./js/account/index.js').then(account => {
      account.loginWithToken();
    });
  }

  setupAds().then(() => renderAll());
}

window.onload = (function (oldLoad) {
  return function () {
    oldLoad && oldLoad();
    initialize();
  }
})(window.onload);
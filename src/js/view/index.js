import { renderAll } from './render';
import setupListeners from './setupListeners';
import { setupAds } from '../ads';

// import setupListeners, { setupSearchFilters } from './js/setupListeners';
// import { renderAll } from './js/render';
// import { hasToken } from './js/utilities';
// import { loadDictionary } from './js/dictionaryManagement';
// import { loadSettings } from './js/settings';

function initialize() {
  setupAds().then(() => renderAll());
  setupListeners();
}

window.onload = (function (oldLoad) {
  return function () {
    oldLoad && oldLoad();
    initialize();
  }
})(window.onload);
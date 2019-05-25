import '../../main.scss';
import { getDictionary } from './dictionaryManagement';

// import setupListeners, { setupSearchFilters } from './js/setupListeners';
// import { renderAll } from './js/render';
// import { hasToken } from './js/utilities';
// import { loadDictionary } from './js/dictionaryManagement';
// import { loadSettings } from './js/settings';

function initialize() {
  getDictionary();
  // setupSearchFilters();
}

window.onload = (function (oldLoad) {
  return function () {
    oldLoad && oldLoad();
    initialize();
  }
})(window.onload);
import './main.scss';

import setupListeners from './js/setupListeners';
import { renderAll } from './js/render';
import { generateRandomWords } from './js/utilities';
import { loadDictionary } from './js/dictionaryManagement';

function initialize() {
  console.log('initializing');
  loadDictionary();
  // generateRandomWords(100);
  setupListeners();
  renderAll();
  // console.log('Rendered!');
}

window.onload = (function (oldLoad) {
  return function () {
    oldLoad && oldLoad();
    initialize();
  }
})(window.onload);
import './main.scss';

import setupListeners from './js/setupListeners';
import { renderAll } from './js/render';
import { generateRandomWords, addMessage } from './js/utilities';
import { loadDictionary } from './js/dictionaryManagement';

function initialize() {
  addMessage('Loading!');
  loadDictionary();
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
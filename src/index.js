import './main.scss';

import { DEFAULT_DICTIONARY } from './constants';
import setupListeners from './js/setupListeners';
import { renderAll } from './js/render';
import { cloneObject } from './helpers';
import { generateRandomWords } from './js/utilities';

function initialize() {
  console.log('initializing');
  window.currentDictionary = cloneObject(DEFAULT_DICTIONARY);
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
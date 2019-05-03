import './main.scss';

import { DEFAULT_DICTIONARY } from './constants';
import setupListeners from './js/setupListeners';
import { renderAll } from './js/render';
import { cloneObject } from './helpers';

function initialize() {
  console.log('initializing');
  window.currentDictionary = cloneObject(DEFAULT_DICTIONARY);
  setupListeners();
  renderAll();
}

window.onload = (function (oldLoad) {
  return function () {
    oldLoad && oldLoad();
    initialize();
  }
})(window.onload);
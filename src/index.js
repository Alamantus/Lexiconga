import './main.scss';

import { DEFAULT_DICTIONARY } from './constants';
import setupListeners from './js/setupListeners';
import { renderAll } from './js/render';

function initialize() {
  console.log('initializing');
  window.currentDictionary = JSON.parse(JSON.stringify(DEFAULT_DICTIONARY));
  setupListeners();
  renderAll();
}

window.onload = (function (oldLoad) {
  return function () {
    oldLoad && oldLoad();
    initialize();
  }
})(window.onload);
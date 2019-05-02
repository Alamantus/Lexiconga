import './main.scss';

import { DEFAULT_DICTIONARY } from './constants';
import setupListeners from './js/setupListeners';

function initialize() {
  console.log('initializing');
  window.currentDictionary = JSON.parse(JSON.stringify(DEFAULT_DICTIONARY));
  setupListeners();
}

window.onload = (function (oldLoad) {
  return function () {
    oldLoad && oldLoad();
    initialize();
  }
})(window.onload);
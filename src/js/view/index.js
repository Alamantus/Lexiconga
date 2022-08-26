import { renderAll } from './render';
import setupListeners from './setupListeners';

function initialize() {
  renderAll();
  setupListeners();
}

window.onload = (function (oldLoad) {
  oldLoad && oldLoad();
  initialize();
})(window.onload);
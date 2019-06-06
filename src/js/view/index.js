import { renderAll } from './render';
import setupListeners from './setupListeners';
import { setupAds } from '../ads';

function initialize() {
  setupAds();
  renderAll();
  setupListeners();
}

window.onload = (function (oldLoad) {
  oldLoad && oldLoad();
  initialize();
})(window.onload);
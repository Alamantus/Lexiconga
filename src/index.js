import './main.scss';

function initialize() {
  console.log('initializing');
}

window.onload = (function (oldLoad) {
  return function () {
    oldLoad && oldLoad();
    initialize();
  }
})(window.onload);
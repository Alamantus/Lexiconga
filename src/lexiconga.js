const { render } = require('uhtml');
const header = require('./elements/body/header');
const main = require('./elements/body/main');
const footer = require('./elements/body/footer');

(() => {
  class App {
    constructor() {
      this.state = {};
      this.views = {
        header,
        main,
        footer,
      };
    }
  
    setState(valuesObj, updateElements = undefined) {
      this.state = { ...this.state, ...valuesObj };
      this.updateView(updateElements);
    }
  
    updateView(elements = ['header', 'main', 'footer']) {
      if (!Array.isArray(elements)) {
        elements = [elements];
      }
      elements.forEach(element => {
        render(document.querySelector(`body>${element}`), this.views[element](this));
      });
    }
  }
  
  if (window?.isOffline) {
    // addMessage('<strong>You are using the Offline version of Lexiconga.</strong><br>Refresh the page while connected to the internet to enable using accounts.', 0);
  }
  // Migrate Old Dictionaries

  (new App()).render();
})();

import helper from '../Helper';

export class Updater {
  constructor (appWithDictionaryState, dictionary) {
    this.app = appWithDictionaryState;
    this.dictionary = dictionary;
  }

  setDictionaryName (newName) {
    this.app.setState({
      name: newName,
    }, () => {
      this.dictionary.name = newName;
    });
  }

  setDictionarySpecification (newSpecification) {
    this.app.setState({
      specification: newSpecification,
    }, () => {
      this.dictionary.specification = newSpecification;
    });
  }

  updateDictionaryDetails (dicitonaryDetails = {}) {
    return new Promise((resolve, reject) => {
      const updatedDetails = {};

      if (dicitonaryDetails.name) {
        updatedDetails['name'] = dicitonaryDetails.name;
        this.dictionary.name = dicitonaryDetails.name;
      }

      if (dicitonaryDetails.specification) {
        updatedDetails['specification'] = dicitonaryDetails.specification;
        this.dicitonary.specification = dicitonaryDetails.specification;
      }

      if (dicitonaryDetails.description) {
        updatedDetails['description'] = dicitonaryDetails.description;
        this.dictionary.description = dicitonaryDetails.description;
      }

      if (dicitonaryDetails.partsOfSpeech) {
        updatedDetails['partsOfSpeech'] = dicitonaryDetails.partsOfSpeech;
        this.dictionary.partsOfSpeech = dicitonaryDetails.partsOfSpeech;
      }

      if (helper.objectIsEmpty(updatedDetails)) {
        reject('No dictionary details have changed.');
      } else {
        this.app.setState(updatedDetails, () => {
          resolve();
        });
      }
    });
  }
}
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

  updateDictionaryDetails (dictionaryDetails = {}) {
    return new Promise((resolve, reject) => {
      const updatedDetails = {};

      const detailKeys = ['consonants', 'vowels', 'blends', 'onset', 'nucleus', 'coda', 'exceptions'];

      for (const key in dictionaryDetails) {
        this.dictionary[key] = dictionaryDetails[key];

        if (!detailKeys.includes(key)) {
          updatedDetails[key] = dictionaryDetails[key];
        }
      }

      if (Object.keys(dictionaryDetails).some(key => { return detailKeys.includes(key) })) {
        updatedDetails['details'] = this.dictionary.details;
      }

      console.log(updatedDetails);

      if (updatedDetails.isEmpty()) {
        reject('No dictionary details have changed.');
      } else {
        this.app.setState(updatedDetails, () => {
          resolve();
        });
      }
    });
  }
}
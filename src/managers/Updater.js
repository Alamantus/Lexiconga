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

      const detailKeys = [
        'consonants',
        'vowels',
        'blends',
        'onset',
        'nucleus',
        'coda',
        'exceptions',
        'orthographyNotes',
      ];
      const settingKeys = [
        'allowDuplicates',
        'caseSensitive',
        'sortByDefinition',
        'isComplete',
        'isPublic',
      ];

      for (const key in dictionaryDetails) {
        this.dictionary[key] = dictionaryDetails[key];

        if (!detailKeys.includes(key) && !settingKeys.includes(key)) {
          updatedDetails[key] = dictionaryDetails[key];
        }
      }

      if (Object.keys(dictionaryDetails).some(key => detailKeys.includes(key))) {
        updatedDetails['details'] = this.dictionary.details;
      }

      if (Object.keys(dictionaryDetails).some(key => settingKeys.includes(key))) {
        updatedDetails['settings'] = this.dictionary.settings;
      }

      // console.log(updatedDetails);

      if (updatedDetails.isEmpty()) {
        reject('No dictionary details have changed.');
      } else {
        this.app.setState(updatedDetails, () => {
          if (updatedDetails.hasOwnProperty('settings')) {
            this.app.updateDisplayedWords();
          }
          resolve();
        });
      }
    });
  }
}
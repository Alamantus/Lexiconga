import { timestampInSeconds } from "../Helpers";

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
        'grammarNotes',
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
        this.dictionary.lastUpdated = timestampInSeconds();
        updatedDetails.lastUpdated = this.dictionary.lastUpdated;
        this.app.setState(updatedDetails, () => {
          // if (updatedDetails.hasOwnProperty('settings')) {
          //   this.app.updateDisplayedWords();
          // }
          this.sendDictionaryDetails(this.dictionary.storedData).then(() => {
            resolve();
          })
          .catch(reason => {
            reject(reason);
          });
        });
      }
    });
  }

  sendDictionaryDetails (dictionaryDetails) {
    const request = new Request('./api/', {
      method: 'POST',
      mode: 'cors',
      redirect: 'follow',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        action: 'set-dictionary-details',
        token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MTUxLCJpc01lbWJlciI6ZmFsc2UsImRpY3Rpb25hcnkiOjM1M30.4HRuWY8arkjjYLgQ0Cq4a6v-eXwLTD24oENL8E4I5o0',
        details: dictionaryDetails,
      }),
    });
    return fetch(request).then(response => response.json()).then(responseJSON => {
      console.log(responseJSON);
    });
  }

  sendWords (words) {
    const request = new Request('./api/', {
      method: 'POST',
      mode: 'cors',
      redirect: 'follow',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        action: 'set-dictionary-words',
        token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MTUxLCJpc01lbWJlciI6ZmFsc2UsImRpY3Rpb25hcnkiOjM1M30.4HRuWY8arkjjYLgQ0Cq4a6v-eXwLTD24oENL8E4I5o0',
        words: words,
      }),
    });
    return fetch(request).then(response => response.json()).then(responseJSON => {
      console.log(responseJSON);
    });
  }
}
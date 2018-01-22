import store from 'store';

import { timestampInSeconds, request } from "../Helpers";

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
    return request('set-dictionary-details', {
      token: store.get('LexicongaToken'),
      details: dictionaryDetails,
    }, response => console.log(response));
  }

  sendWords (words) {
    return request('set-dictionary-words', {
      token: store.get('LexicongaToken'),
      words,
    }, response => console.log(response));
  }

  sync () {
    return request('get-current-dictionary', {
      token: store.get('LexicongaToken'),
    }, response => {
      const { data, error } = response;
      if (error) {
        console.error(data);
      } else {
        this.compareDetails(data.details);
        this.compareWords(data.words);
      }
    });
  }

  compareDetails (externalDetails) {
    console.log('external details', externalDetails);
    if (!externalDetails.lastUpdated
      || externalDetails.lastUpdated < this.dictionary.storedData.lastUpdated) {
      this.sendDictionaryDetails(this.dictionary.storedData);
    } else if (externalDetails.lastUpdated
      && externalDetails.lastUpdated > this.dictionary.storedData.lastUpdated) {
      this.app.setState(externalDetails, () => {
        this.dictionary.storedData = externalDetails;
        console.log('updated local');
      });
    }
  }

  compareWords (externalWords) {
    const wordsToSend = [];
    const wordsToAdd = [];
    const wordsToUpdate = [];
    const localWordsPromise = this.dictionary.wordsPromise.then(localWords => {
      externalWords.forEach(externalWord => {
        if (externalWord.lastUpdated) {
          const matchingWord = localWords.find(word => word.id === externalWord.id);
          if (matchingWord) {
            if (externalWord.lastUpdated > matchingWord.lastUpdated) {
              wordsToUpdate.push(externalWord);
            } else if (externalWord.lastUpdated < matchingWord.lastUpdated) {
              wordsToSend.push(matchingWord);
            }
          } else {
            wordsToAdd.push(externalWord);
          }
        }
      });
      // Find words not in external database and add them to send.
      localWords.forEach(localWord => {
        if (localWord.lastUpdated) {
          const wordAlreadyChecked = externalWords.some(word => word.id === localWord.id);
          if (!wordAlreadyChecked) {
            wordsToSend.push(localWord);
          }
        }
      });

      wordsToAdd.forEach(newWord => {
        new Word(newWord).create();
      });
      wordsToUpdate.forEach(updatedWord => {
        new Word(updatedWord).update();
      });
      if (wordsToSend.length > 0) {
        this.sendWords(wordsToSend);
      }
    }).then(() => {
      this.app.updateDisplayedWords(() => console.log('synced words'));
    });
  }
}
import assert from 'assert';
import store from 'store';
import wordDb from './WordDatabase';

const defaultDictionary = {
  name: 'New'
, specification: 'Dictionary'
, description: 'A new dictionary.'
, partsOfSpeech: ['Noun', 'Adjective', 'Verb']
}

export class Word {
  constructor ({name = '', pronunciation = '', partOfSpeech = '', definition = '', details = ''}) {
    this.name = name;
    this.pronunciation = pronunciation;
    this.partOfSpeech = partOfSpeech;
    this.definition = definition;
    this.details = details;
  }

  create () {
    const timestampInSeconds = Math.round(Date.now() / 1000);
    this.createdTime = timestampInSeconds;
    this.modifiedTime = null;

    return wordDb.words.add(this)
    .then(id => {
      this.id = id;
      console.log('Word added successfully');
    })
    .catch(error => {
      console.error(error);
    });
  }

  update (wordObject, wordId) {
    const timestampInSeconds = Math.round(Date.now() / 1000);
    this.modifiedTime = timestampInSeconds;

    wordDb.words.put(wordObject, wordId)
    .catch(error => {

    });
  }
}

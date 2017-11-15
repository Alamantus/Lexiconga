import assert from 'assert';
import store from 'store';
import wordDb from './WordDatabase';

export class Word {
  constructor ({ name = '', pronunciation = '', partOfSpeech = '', definition = '', details = '' }) {
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
    .then((id) => {
      this.id = id;
      console.log('Word added successfully');
    })
    .catch(error => {
      console.error(error);
    });
  }

  update (wordId) {
    const timestampInSeconds = Math.round(Date.now() / 1000);
    this.modifiedTime = timestampInSeconds;

    return wordDb.words.put(this, wordId)
    .then((id) => {
      console.log('Word modified successfully');
    })
    .catch(error => {
      console.error(error);
    });
  }

  delete (wordId) {
    return wordDb.words.delete(wordId)
    .then(() => {
      console.log('Word deleted successfully');
    })
    .catch(error => {
      console.error(error);
    });
  }
}

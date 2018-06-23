import PropTypes from 'prop-types';
import store from 'store';
import wordDb from './WordDatabase';
import { timestampInSeconds, request } from '../Helpers';

export class Word {
  constructor (values = {}) {
    PropTypes.checkPropTypes({
      id: PropTypes.number,
      name: PropTypes.string,
      pronunciation: PropTypes.string,
      partOfSpeech: PropTypes.string,
      definition: PropTypes.string,
      details: PropTypes.string,
      createdOn: PropTypes.number,
      lastUpdated: PropTypes.number,
    }, values, 'value', 'Word');
    
    const {
      id = false,
      name = '',
      pronunciation = '',
      partOfSpeech = '',
      definition = '',
      details = '',
      createdOn = null,
      lastUpdated = null,
    } = values;

    this.name = name;
    this.pronunciation = pronunciation;
    this.partOfSpeech = partOfSpeech;
    this.definition = definition;
    this.details = details;
    this.createdOn = createdOn;
    this.lastUpdated = lastUpdated;

    // Only create an id property if an ID exists.
    if (id) this.id = id;
  }

  create () {
    this.createdOn = this.createdOn ? this.createdOn : timestampInSeconds();

    let addPromise;
    // Delete id if it exists to allow creation of new word.
    if (this.hasOwnProperty('id')) {
      addPromise = wordDb.words.put(this);
    } else {
      addPromise = wordDb.words.add(this);
    }

    return addPromise
    .then((id) => {
      this.id = id;
      console.log('Word added successfully');
      this.send();
    })
    .catch(error => {
      console.error(error);
    });
  }

  update () {
    this.lastUpdated = this.lastUpdated ? this.lastUpdated : timestampInSeconds();

    return wordDb.words.put(this)
    .then((id) => {
      console.log('Word modified successfully');
      this.send();
    })
    .catch(error => {
      console.error(error);
    });
  }

  delete (wordId, skipSend = false) {
    return wordDb.words.delete(wordId)
    .then(() => {
      console.log('Word deleted successfully');
      if (!skipSend) {
        request('delete-word', {
          token: store.get('LexicongaToken'),
          word: wordId,
        }, response => console.log(response));
      }
      wordDb.deletedWords.add({
        id: wordId,
        deletedOn: timestampInSeconds(),
      })
      .then(() => {
        console.log('Word added to deleted list');
      })
      .catch(error => {
        console.error(error);
      });
    })
    .catch(error => {
      console.error(error);
    });
  }

  send () {
    const token = store.get('LexicongaToken');
    if (token) {
      return request('set-dictionary-words', {
        token: store.get('LexicongaToken'),
        words: [this],
      }, response => console.log(response));
    }
  }
}

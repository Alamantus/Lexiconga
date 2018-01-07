import PropTypes from 'prop-types';
import store from 'store';
import wordDb from './WordDatabase';
import {timestampInSeconds} from '../Helpers';

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
    this.createdOn = timestampInSeconds();

    // Delete id if it exists to allow creation of new word.
    if (this.hasOwnProperty('id')) delete this.id;

    return wordDb.words.add(this)
    .then((id) => {
      this.id = id;
      console.log('Word added successfully');
    })
    .catch(error => {
      console.error(error);
    });
  }

  update () {
    this.lastUpdated = timestampInSeconds();

    return wordDb.words.put(this)
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

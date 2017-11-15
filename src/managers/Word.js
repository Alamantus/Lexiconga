import PropTypes from 'prop-types';
import store from 'store';
import wordDb from './WordDatabase';

export class Word {
  constructor (values = {}) {
    PropTypes.checkPropTypes({
      id: PropTypes.number,
      name: PropTypes.string,
      pronunciation: PropTypes.string,
      partOfSpeech: PropTypes.string,
      definition: PropTypes.string,
      details: PropTypes.string,
      createdTime: PropTypes.number,
      modifiedTime: PropTypes.number,
    }, values, 'value', 'Word');
    
    const {
      id = false,
      name = '',
      pronunciation = '',
      partOfSpeech = '',
      definition = '',
      details = '',
      createdTime = null,
      modifiedTime = null,
    } = values;

    this.name = name;
    this.pronunciation = pronunciation;
    this.partOfSpeech = partOfSpeech;
    this.definition = definition;
    this.details = details;
    this.createdTime = createdTime;
    this.modifiedTime = modifiedTime;

    // Only create an id property if an ID exists.
    if (id) this.id = id;
  }

  create () {
    const timestampInSeconds = Math.round(Date.now() / 1000);
    this.createdTime = timestampInSeconds;

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
    const timestampInSeconds = Math.round(Date.now() / 1000);
    this.modifiedTime = timestampInSeconds;

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

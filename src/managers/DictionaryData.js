import assert from 'assert';
import store from 'store';
import wordDb from './WordDatabase';
import idManager from './IDManager';

const defaultDictionary = {
  name: 'New'
, specification: 'Dictionary'
, description: 'A new dictionary.'
, partsOfSpeech: ['Noun', 'Adjective', 'Verb']
}

class DictionaryData {
  constructor () {
    if (['emptydb', 'donotsave'].includes(process.env.NODE_ENV)) {
      store.remove('Lexiconga');
    }

    if (!store.get('Lexiconga')) {
      store.set('Lexiconga', defaultDictionary);
    } else {
      const largestId = wordDb.words
        .orderBy('id').reverse()
        .first((word) => {
          return word.id;
        });

      idManager.setId('word', ++largestId);
      console.log('First word ID: ' + idManager.next('word').toString());
    }
  }

  get name () {
    return store.get('Lexiconga').name
      || defaultDictionary.name;
  }

  set name (value) {
    assert(typeof value === 'string', 'Name must be passed as a string.');
    return store.set('Lexiconga', { name: value });
  }

  get specification () {
    return store.get('Lexiconga').specification
      || defaultDictionary.specification;
  }

  set specification (value) {
    assert(typeof value === 'string', 'Specification must be passed as a string.');
    return store.set('Lexiconga', { specification: value });
  }

  get description () {
    return store.get('Lexiconga').description
      || defaultDictionary.description;
  }

  set description (value) {
    assert(typeof value === 'string', 'Description must be passed as a string.');
    return store.set('Lexiconga', { description: value });
  }

  get partsOfSpeech () {
    return store.get('Lexiconga').partsOfSpeech
      || defaultDictionary.partsOfSpeech;
  }

  set partsOfSpeech (array) {
    assert(Array.isArray(array), 'Parts of Speech must be passed as an array');
    return store.set('Lexiconga', { partsOfSpeech: array });
  }

  get words () {
    return wordDb.words.toArray();
  }

  wordsWithPartOfSpeech (partOfSpeech) {
    let words = wordDb.words.where('partOfSpeech');

    if (Array.isArray(partOfSpeech)) {
      words = words.anyOf(partOfSpeech);
    } else {
      assert(typeof partOfSpeech === 'string'
        , 'You must use either a string or an array when searching for words with a particular part of speech');
      
      words = words.equals(partOfSpeech);
    }

    return words.toArray();
  }

  wordsFromSearchConfig (searchConfig) {
    /* TODO:
      Configure search based on these qualifications:
      - Starts With
      - Equals
      - Contains
      
      With these specifications:
      - Match Case
      - Ignore Diacritics

      Contains will need to be searched through Array.filter() because Dexie can only search indexes.
      As such, searches on `details` will only allow "contains".
    */
  }
}

export default new DictionaryData;
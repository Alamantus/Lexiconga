import assert from 'assert';
import store from 'store';
import wordDb from './WordDatabase';
import idManager from './IDManager';

const defaultDictionary = {
  name: 'New',
  specification: 'Dictionary',
  description: 'A new dictionary.',
  partsOfSpeech: ['Noun', 'Adjective', 'Verb'],
  alphabeticalOrder: [],
  details: {
    phonology: {
      consonants: [],
      vowels: [],
      blends: [],
      phonotactics: {
        onset: [],
        nucleus: [],
        coda: [],
        exceptions: '',
      },
    },
    orthography: {
      notes: '',
    },
    grammar: {
      content: '',
    },
    custom: [
      {
        name: 'Example Tab',
        content: `This is an _example_ tab to show how **tabs** work with [Markdown](${ MARKDOWN_LINK })!`,
      }
    ],
  },
};

class DictionaryData {
  constructor () {
    this.default = defaultDictionary;

    if (['emptydetails', 'donotsave'].includes(process.env.NODE_ENV)) {
      store.remove('Lexiconga');
    }

    if (!store.get('Lexiconga')) {
      store.set('Lexiconga', defaultDictionary);
    } else {
      wordDb.words
      .orderBy('id').reverse()
      .first((word) => {
        return parseInt(word.id);
      })
      .then(largestId => {
        idManager.setId('word', ++largestId);
        console.log('First word ID: ' + idManager.next('word').toString());
      });
    }
  }

  get name () {
    return store.get('Lexiconga').name
      || defaultDictionary.name;
  }

  set name (value) {
    assert(typeof value === 'string', 'Name must be passed as a string.');
    const updatedValues = store.get('Lexiconga');
    updatedValues.name = value.trim();
    return store.set('Lexiconga', updatedValues);
  }

  get specification () {
    return store.get('Lexiconga').specification
      || defaultDictionary.specification;
  }

  set specification (value) {
    assert(typeof value === 'string', 'Specification must be passed as a string.');
    const updatedValues = store.get('Lexiconga');
    updatedValues.specification = value.trim();
    return store.set('Lexiconga', updatedValues);
  }

  get description () {
    return store.get('Lexiconga').description
      || defaultDictionary.description;
  }

  set description (value) {
    assert(typeof value === 'string', 'Description must be passed as a string.');
    const updatedValues = store.get('Lexiconga');
    updatedValues.description = value.trim();
    return store.set('Lexiconga', updatedValues);
  }

  get partsOfSpeech () {
    return store.get('Lexiconga').partsOfSpeech
      || defaultDictionary.partsOfSpeech;
  }

  set partsOfSpeech (array) {
    assert(Array.isArray(array), 'Parts of Speech must be passed as an array');
    const updatedValues = store.get('Lexiconga');
    updatedValues.partsOfSpeech = array
      .filter((value) => { return value !== '' })
      .map((value) => { return value.trim() });
    return store.set('Lexiconga', updatedValues);
  }

  get details () {
    return store.get('Lexiconga').details
      || defaultDictionary.details;
  }

  get consonants () {
    return store.get('Lexiconga').details.phonology.consonants
      || defaultDictionary.details.phonology.consonants;
  }

  set consonants (array) {
    assert(Array.isArray(array), 'Consonants must be passed as an array');
    const updatedValues = store.get('Lexiconga');
    updatedValues.details.phonology.consonants = array
      .filter((value) => { return value !== '' })
      .map((value) => { return value.trim() });
    return store.set('Lexiconga', updatedValues);
  }

  get vowels () {
    return store.get('Lexiconga').details.phonology.vowels
      || defaultDictionary.details.phonology.vowels;
  }

  set vowels (array) {
    assert(Array.isArray(array), 'Vowels must be passed as an array');
    const updatedValues = store.get('Lexiconga');
    updatedValues.details.phonology.vowels = array
      .filter((value) => { return value !== '' })
      .map((value) => { return value.trim() });
    return store.set('Lexiconga', updatedValues);
  }

  get blends () {
    return store.get('Lexiconga').details.phonology.blends
      || defaultDictionary.details.phonology.blends;
  }

  set blends (array) {
    assert(Array.isArray(array), 'Blends must be passed as an array');
    const updatedValues = store.get('Lexiconga');
    updatedValues.details.phonology.blends = array
      .filter((value) => { return value !== '' })
      .map((value) => { return value.trim() });
    return store.set('Lexiconga', updatedValues);
  }

  get onset () {
    return store.get('Lexiconga').details.phonology.phonotactics.onset
      || defaultDictionary.details.phonology.phonotactics.onset;
  }

  set onset (array) {
    assert(Array.isArray(array), 'Onset must be passed as an array');
    const updatedValues = store.get('Lexiconga');
    updatedValues.details.phonology.phonotactics.onset = array
      .filter((value) => { return value !== '' })
      .map((value) => { return value.trim() });
    return store.set('Lexiconga', updatedValues);
  }

  get nucleus () {
    return store.get('Lexiconga').details.phonology.phonotactics.nucleus
      || defaultDictionary.details.phonology.phonotactics.nucleus;
  }

  set nucleus (array) {
    assert(Array.isArray(array), 'Nucleus must be passed as an array');
    const updatedValues = store.get('Lexiconga');
    updatedValues.details.phonology.phonotactics.nucleus = array
      .filter((value) => { return value !== '' })
      .map((value) => { return value.trim() });
    return store.set('Lexiconga', updatedValues);
  }

  get coda () {
    return store.get('Lexiconga').details.phonology.phonotactics.coda
      || defaultDictionary.details.phonology.phonotactics.coda;
  }

  set coda (array) {
    assert(Array.isArray(array), 'Coda must be passed as an array');
    const updatedValues = store.get('Lexiconga');
    updatedValues.details.phonology.phonotactics.coda = array
      .filter((value) => { return value !== '' })
      .map((value) => { return value.trim() });
    return store.set('Lexiconga', updatedValues);
  }

  get exceptions () {
    return store.get('Lexiconga').details.phonology.phonotactics.exceptions
      || defaultDictionary.details.phonology.phonotactics.exceptions;
  }

  set exceptions (value) {
    assert(typeof value === 'string', 'Exceptions must be passed as a string.');
    const updatedValues = store.get('Lexiconga');
    updatedValues.details.phonology.phonotactics.exceptions = value.trim();
    return store.set('Lexiconga', updatedValues);
  }

  get orthographyNotes () {
    return store.get('Lexiconga').details.orthography.notes
      || defaultDictionary.details.orthography.notes;
  }

  set orthographyNotes (value) {
    assert(typeof value === 'string', 'Orthography Notes must be passed as a string.');
    const updatedValues = store.get('Lexiconga');
    updatedValues.details.orthography.notes = value.trim();
    return store.set('Lexiconga', updatedValues);
  }

  get alphabeticalOrder () {
    return store.get('Lexiconga').alphabeticalOrder
      || defaultDictionary.alphabeticalOrder;
  }

  set alphabeticalOrder (array) {
    assert(Array.isArray(array), 'Alphabetical Order must be passed as an array');
    const updatedValues = store.get('Lexiconga');
    updatedValues.alphabeticalOrder = array
      .filter((value) => { return value !== '' })
      .map((value) => { return value.trim() });
    return store.set('Lexiconga', updatedValues);
  }

  get wordsPromise () {
    return wordDb.words.toArray();
  }

  wordsWithPartOfSpeech (partOfSpeech) {
    let words = wordDb.words.where('partOfSpeech');

    if (Array.isArray(partOfSpeech)) {
      words = words.anyOf(partOfSpeech);
    } else {
      assert(typeof partOfSpeech === 'string',
        'You must use either a string or an array when searching for words with a particular part of speech');
      
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
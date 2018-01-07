import assert from 'assert';
import store from 'store';
import wordDb from './WordDatabase';
import idManager from './IDManager';
import { timestampInSeconds } from '../Helpers';

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
      notes: '',
    },
    // custom: [
    //   // {
    //   //   name: 'Example Tab',
    //   //   content: `This is an _example_ tab to show how **tabs** work with [Markdown](${ MARKDOWN_LINK })!`,
    //   // }
    // ],
  },
  settings: {
    allowDuplicates: false,
    caseSensitive: false,
    sortByDefinition: false,
    isComplete: false,
    isPublic: false,
  },
  lastUpdated: null,
  createdOn: timestampInSeconds(),
};

class DictionaryData {
  constructor () {
    this.default = defaultDictionary;

    if (['emptydetails', 'donotsave'].includes(process.env.NODE_ENV)) {
      store.remove('Lexiconga');
    }

    if (!store.get('Lexiconga')) {
      this.storedData = defaultDictionary;
    } else {
      wordDb.words
      .orderBy('id').reverse()
      .first((word) => {
        return parseInt(word.id);
      })
      .then(largestId => {
        // Set next word id to biggest id + 1
        idManager.setId('word', ++largestId);
      })
      .catch(e => {
        // No words, so set next id to 1
        idManager.setId('word', 1);
      });
    }
  }

  get storedData () {
    return store.get('Lexiconga');
  }

  set storedData (updatedValues) {
    store.set('Lexiconga', updatedValues);
  }

  get name () {
    return this.storedData.name
      || defaultDictionary.name;
  }

  set name (value) {
    assert(typeof value === 'string', 'Name must be passed as a string.');
    const updatedValues = this.storedData;
    updatedValues.name = value.trim();
    this.storedData = updatedValues;
  }

  get specification () {
    return this.storedData.specification
      || defaultDictionary.specification;
  }

  set specification (value) {
    assert(typeof value === 'string', 'Specification must be passed as a string.');
    const updatedValues = this.storedData;
    updatedValues.specification = value.trim();
    this.storedData = updatedValues;
  }

  get description () {
    return this.storedData.description
      || defaultDictionary.description;
  }

  set description (value) {
    assert(typeof value === 'string', 'Description must be passed as a string.');
    const updatedValues = this.storedData;
    updatedValues.description = value.trim();
    this.storedData = updatedValues;
  }

  get partsOfSpeech () {
    return this.storedData.partsOfSpeech
      || defaultDictionary.partsOfSpeech;
  }

  set partsOfSpeech (array) {
    assert(Array.isArray(array), 'Parts of Speech must be passed as an array');
    const updatedValues = this.storedData;
    updatedValues.partsOfSpeech = array
      .filter((value) => { return value !== '' })
      .map((value) => { return value.trim() });
    this.storedData = updatedValues;
  }

  get details () {
    return this.storedData.details
      || defaultDictionary.details;
  }

  get consonants () {
    return this.storedData.details.phonology.consonants
      || defaultDictionary.details.phonology.consonants;
  }

  set consonants (array) {
    assert(Array.isArray(array), 'Consonants must be passed as an array');
    const updatedValues = this.storedData;
    updatedValues.details.phonology.consonants = array
      .filter((value) => { return value !== '' })
      .map((value) => { return value.trim() });
    this.storedData = updatedValues;
  }

  get vowels () {
    return this.storedData.details.phonology.vowels
      || defaultDictionary.details.phonology.vowels;
  }

  set vowels (array) {
    assert(Array.isArray(array), 'Vowels must be passed as an array');
    const updatedValues = this.storedData;
    updatedValues.details.phonology.vowels = array
      .filter((value) => { return value !== '' })
      .map((value) => { return value.trim() });
    this.storedData = updatedValues;
  }

  get blends () {
    return this.storedData.details.phonology.blends
      || defaultDictionary.details.phonology.blends;
  }

  set blends (array) {
    assert(Array.isArray(array), 'Blends must be passed as an array');
    const updatedValues = this.storedData;
    updatedValues.details.phonology.blends = array
      .filter((value) => { return value !== '' })
      .map((value) => { return value.trim() });
    this.storedData = updatedValues;
  }

  get onset () {
    return this.storedData.details.phonology.phonotactics.onset
      || defaultDictionary.details.phonology.phonotactics.onset;
  }

  set onset (array) {
    assert(Array.isArray(array), 'Onset must be passed as an array');
    const updatedValues = this.storedData;
    updatedValues.details.phonology.phonotactics.onset = array
      .filter((value) => { return value !== '' })
      .map((value) => { return value.trim() });
    this.storedData = updatedValues;
  }

  get nucleus () {
    return this.storedData.details.phonology.phonotactics.nucleus
      || defaultDictionary.details.phonology.phonotactics.nucleus;
  }

  set nucleus (array) {
    assert(Array.isArray(array), 'Nucleus must be passed as an array');
    const updatedValues = this.storedData;
    updatedValues.details.phonology.phonotactics.nucleus = array
      .filter((value) => { return value !== '' })
      .map((value) => { return value.trim() });
    this.storedData = updatedValues;
  }

  get coda () {
    return this.storedData.details.phonology.phonotactics.coda
      || defaultDictionary.details.phonology.phonotactics.coda;
  }

  set coda (array) {
    assert(Array.isArray(array), 'Coda must be passed as an array');
    const updatedValues = this.storedData;
    updatedValues.details.phonology.phonotactics.coda = array
      .filter((value) => { return value !== '' })
      .map((value) => { return value.trim() });
    this.storedData = updatedValues;
  }

  get exceptions () {
    return this.storedData.details.phonology.phonotactics.exceptions
      || defaultDictionary.details.phonology.phonotactics.exceptions;
  }

  set exceptions (value) {
    assert(typeof value === 'string', 'Exceptions must be passed as a string.');
    const updatedValues = this.storedData;
    updatedValues.details.phonology.phonotactics.exceptions = value.trim();
    this.storedData = updatedValues;
  }

  get orthographyNotes () {
    return this.storedData.details.orthography.notes
      || defaultDictionary.details.orthography.notes;
  }

  set orthographyNotes (value) {
    assert(typeof value === 'string', 'Orthography Notes must be passed as a string.');
    const updatedValues = this.storedData;
    updatedValues.details.orthography.notes = value.trim();
    this.storedData = updatedValues;
  }

  get grammarNotes () {
    return this.storedData.details.grammar.notes
      || defaultDictionary.details.grammar.notes;
  }

  set grammarNotes (value) {
    assert(typeof value === 'string', 'Grammar Notes must be passed as a string.');
    const updatedValues = this.storedData;
    updatedValues.details.grammar.notes = value.trim();
    this.storedData = updatedValues;
  }

  get alphabeticalOrder () {
    return this.storedData.alphabeticalOrder
      || defaultDictionary.alphabeticalOrder;
  }

  set alphabeticalOrder (array) {
    assert(Array.isArray(array), 'Alphabetical Order must be passed as an array');
    const updatedValues = this.storedData;
    updatedValues.alphabeticalOrder = array
      .filter((value) => { return value !== '' })
      .map((value) => { return value.trim() });
    this.storedData = updatedValues;
  }

  get settings () {
    return this.storedData.settings
      || defaultDictionary.settings;
  }

  get allowDuplicates () {
    return this.storedData.settings.allowDuplicates
      || defaultDictionary.settings.allowDuplicates;
  }

  set allowDuplicates (value) {
    assert(typeof value === 'boolean', 'allowDuplicates must be passed as a boolean.');
    const updatedValues = this.storedData;
    updatedValues.settings.allowDuplicates = value;
    this.storedData = updatedValues;
  }

  get caseSensitive () {
    return this.storedData.settings.caseSensitive
      || defaultDictionary.settings.caseSensitive;
  }

  set caseSensitive (value) {
    assert(typeof value === 'boolean', 'caseSensitive must be passed as a boolean.');
    const updatedValues = this.storedData;
    updatedValues.settings.caseSensitive = value;
    this.storedData = updatedValues;
  }

  get sortByDefinition () {
    return this.storedData.settings.sortByDefinition
      || defaultDictionary.settings.sortByDefinition;
  }

  set sortByDefinition (value) {
    assert(typeof value === 'boolean', 'sortByDefinition must be passed as a boolean.');
    const updatedValues = this.storedData;
    updatedValues.settings.sortByDefinition = value;
    this.storedData = updatedValues;
  }

  get isComplete () {
    return this.storedData.settings.isComplete
      || defaultDictionary.settings.isComplete;
  }

  set isComplete (value) {
    assert(typeof value === 'boolean', 'isComplete must be passed as a boolean.');
    const updatedValues = this.storedData;
    updatedValues.settings.isComplete = value;
    this.storedData = updatedValues;
  }

  get isPublic () {
    return this.storedData.settings.isPublic
      || defaultDictionary.settings.isPublic;
  }

  set isPublic (value) {
    assert(typeof value === 'boolean', 'isPublic must be passed as a boolean.');
    const updatedValues = this.storedData;
    updatedValues.settings.isPublic = value;
    this.storedData = updatedValues;
  }

  get lastUpdated () {
    return this.storedData.lastUpdated
      || defaultDictionary.lastUpdated;
  }

  set lastUpdated (value) {
    assert(typeof value === 'number', 'lastUpdated must be passed as a number.');
    const updatedValues = this.storedData;
    updatedValues.lastUpdated = value;
    this.storedData = updatedValues;
  }

  get wordsPromise () {
    if (this.sortByDefinition) {
      return wordDb.words.toCollection().sortBy('definition');
    }
    return wordDb.words.orderBy('name').toArray();
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
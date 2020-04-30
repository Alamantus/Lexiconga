import { getTimestampInSeconds } from "./helpers";

export const MIGRATE_VERSION = '2.1.0';
export const DEFAULT_DICTIONARY = {
  name: 'New',
  specification: 'Dictionary',
  description: 'A new dictionary.',
  partsOfSpeech: ['Noun', 'Adjective', 'Verb', 'Adverb', 'Preposition', 'Pronoun', 'Conjunction'],
  alphabeticalOrder: [],
  details: {
    phonology: {
      consonants: [],
      vowels: [],
      blends: [],
      notes: '',
    },
    phonotactics: {
      onset: [],
      nucleus: [],
      coda: [],
      notes: '',
    },
    orthography: {
      translations: [],
      notes: '',
    },
    grammar: {
      notes: '',
    },
  },
  words: [
    /* {
      name: '',
      pronunciation: '',
      partOfSpeech: '',
      definition: '',
      details: '',
      etymology: [],
      wordId: 0
    }, */
  ],
  settings: {
    allowDuplicates: false,
    caseSensitive: false,
    sortByDefinition: false,
    theme: 'default',
    customCSS: '',
    isPublic: false,
  },
  lastUpdated: getTimestampInSeconds(),
  createdOn: getTimestampInSeconds(),
  version: MIGRATE_VERSION,
};

export const DEFAULT_SETTINGS = {
  useIPAPronunciationField: true,
  useHotkeys: true,
  defaultTheme: 'default',
};

export const DISPLAY_AD_EVERY = 10;

export const DEFAULT_PAGE_SIZE = 50;

export const LOCAL_STORAGE_KEY = 'dictionary';
export const SETTINGS_KEY = 'settings';

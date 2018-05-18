import { timestampInSeconds } from './Helpers';

export const DEFAULT_USER_DATA = {
  email: '',
  username: '',
  publicName: '',
  allowEmails: true,
  useIPAPronunciation: true,
  itemsPerPage: 30,
};

export const DEFAULT_DICTIONARY = {
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
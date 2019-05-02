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
  words: [
    /* {
      name: '',
      pronunciation: '',
      partOfSpeech: '',
      simpleDefinition: '',
      longDefinition: '',
      wordId: 0
    }, */
  ],
  settings: {
    allowDuplicates: false,
    caseSensitive: false,
    sortByDefinition: false,
    isComplete: false,
    isPublic: false,
  },
  lastUpdated: null,
  createdOn: 0,
};
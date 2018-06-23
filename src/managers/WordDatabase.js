import Dexie from 'dexie';

import {Word} from './Word';

const db = new Dexie('Lexiconga');
db.version(1).stores({
  words: '++id, name, partOfSpeech, createdOn, lastUpdated',
});
db.version(2).stores({
  words: '++id, name, partOfSpeech, createdOn, lastUpdated',
  deletedWords: 'id',
});

if (['emptydb', 'donotsave'].includes(process.env.NODE_ENV)) {
  db.words.clear();
}

db.words.mapToClass(Word);

export default db;

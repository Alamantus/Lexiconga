import Dexie from 'dexie';

const db = new Dexie('Lexiconga');
db.version(1).stores({
  words: '++id, name, partOfSpeech'
});

if (['emptydb', 'donotsave'].includes(process.env.NODE_ENV)) {
  db.words.clear();
}

export default db;

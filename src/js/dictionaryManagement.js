import { renderDictionaryDetails, renderPartsOfSpeech, renderAll } from "./render";
import { removeTags, cloneObject, getTimestampInSeconds, download, slugify } from "../helpers";
import { LOCAL_STORAGE_KEY, DEFAULT_DICTIONARY, MIGRATE_VERSION } from "../constants";
import { addMessage, getNextId } from "./utilities";
import { addWord } from "./wordManagement";

export function updateDictionary () {

  renderDictionaryDetails();
}

export function openEditModal() {
  const { name, specification, description, partsOfSpeech } = window.currentDictionary;
  const { consonants, vowels, blends, phonotactics } = window.currentDictionary.details.phonology;
  const { orthography, grammar } = window.currentDictionary.details;
  const { allowDuplicates, caseSensitive, sortByDefinition, isComplete, isPublic } = window.currentDictionary.settings;
  
  document.getElementById('editName').value = name;
  document.getElementById('editSpecification').value = specification;
  document.getElementById('editDescription').value = description;
  document.getElementById('editPartsOfSpeech').value = partsOfSpeech.join(',');

  document.getElementById('editConsonants').value = consonants.join(' ');
  document.getElementById('editVowels').value = vowels.join(' ');
  document.getElementById('editBlends').value = blends.join(' ');
  document.getElementById('editOnset').value = phonotactics.onset.join(',');
  document.getElementById('editNucleus').value = phonotactics.nucleus.join(',');
  document.getElementById('editCoda').value = phonotactics.coda.join(',');
  document.getElementById('editExceptions').value = phonotactics.exceptions;

  document.getElementById('editOrthography').value = orthography.notes;
  document.getElementById('editGrammar').value = grammar.notes;

  document.getElementById('editPreventDuplicates').checked = !allowDuplicates;
  document.getElementById('editCaseSensitive').checked = caseSensitive;
  if (allowDuplicates) document.getElementById('editCaseSensitive').disabled = true;
  document.getElementById('editSortByDefinition').checked = sortByDefinition;
  document.getElementById('editIsComplete').checked = isComplete;
  document.getElementById('editIsPublic').checked = isPublic;

  document.getElementById('editModal').style.display = '';
}

export function saveEditModal() {
  window.currentDictionary.name = removeTags(document.getElementById('editName').value.trim());
  window.currentDictionary.specification = removeTags(document.getElementById('editSpecification').value.trim());
  window.currentDictionary.description = removeTags(document.getElementById('editDescription').value.trim());
  window.currentDictionary.partsOfSpeech = document.getElementById('editPartsOfSpeech').value.split(',').map(val => val.trim()).filter(val => val !== '');

  window.currentDictionary.details.phonology.consonants = document.getElementById('editConsonants').value.split(' ').map(val => val.trim()).filter(val => val !== '');
  window.currentDictionary.details.phonology.vowels = document.getElementById('editVowels').value.split(' ').map(val => val.trim()).filter(val => val !== '');
  window.currentDictionary.details.phonology.blends = document.getElementById('editBlends').value.split(' ').map(val => val.trim()).filter(val => val !== '');
  window.currentDictionary.details.phonology.phonotactics.onset = document.getElementById('editOnset').value.split(',').map(val => val.trim()).filter(val => val !== '');
  window.currentDictionary.details.phonology.phonotactics.nucleus = document.getElementById('editNucleus').value.split(',').map(val => val.trim()).filter(val => val !== '');
  window.currentDictionary.details.phonology.phonotactics.coda = document.getElementById('editCoda').value.split(',').map(val => val.trim()).filter(val => val !== '');
  window.currentDictionary.details.phonology.phonotactics.exceptions = removeTags(document.getElementById('editExceptions').value.trim());

  window.currentDictionary.details.orthography.notes = removeTags(document.getElementById('editOrthography').value.trim());
  window.currentDictionary.details.grammar.notes = removeTags(document.getElementById('editGrammar').value.trim());

  window.currentDictionary.settings.allowDuplicates = !document.getElementById('editPreventDuplicates').checked;
  window.currentDictionary.settings.caseSensitive = document.getElementById('editCaseSensitive').checked;
  window.currentDictionary.settings.sortByDefinition = document.getElementById('editSortByDefinition').checked;
  window.currentDictionary.settings.isComplete = document.getElementById('editIsComplete').checked;
  window.currentDictionary.settings.isPublic = document.getElementById('editIsPublic').checked;

  addMessage('Saved ' + window.currentDictionary.specification + ' Successfully');
  saveDictionary();
  renderDictionaryDetails();
  renderPartsOfSpeech();
}

export function saveAndCloseEditModal() {
  saveEditModal();
  document.getElementById('editModal').style.display = 'none';
}

export function saveDictionary() {
  window.currentDictionary.lastUpdated = getTimestampInSeconds();
  window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(window.currentDictionary));
}

export function loadDictionary() {
  const storedDictionary = window.localStorage.getItem(LOCAL_STORAGE_KEY);
  if (storedDictionary) {
    window.currentDictionary = JSON.parse(storedDictionary);
    migrateDictionary();
  } else {
    clearDictionary();
  }
}

export function clearDictionary() {
  window.currentDictionary = cloneObject(DEFAULT_DICTIONARY);
}

export function importDictionary() {
  const importDictionaryField = document.getElementById('importDictionaryFile');
  
  if (importDictionaryField.files.length === 1) {
    if (confirm('Importing a dicitonary file will overwrite and replace your current dictionary!\nDo you want to continue?')) {
      addMessage('Importing Dictionary...');
      const fileReader = new FileReader();
      fileReader.onload = function (fileLoadedEvent) {
        const textFromFileLoaded = fileLoadedEvent.target.result;
        const importedDictionary = JSON.parse(textFromFileLoaded);
        if (importedDictionary && importedDictionary.hasOwnProperty('words')) {
          window.currentDictionary = importedDictionary;
          saveDictionary();
          renderAll();
          importDictionaryField.value = '';
          document.getElementById('editModal').style.display = 'none';
          addMessage('Dictionary Imported Successfully');
        } else {
          addMessage('Dictionary could not be imported', 10000);
        }
      };

      fileReader.readAsText(importDictionaryField.files[0], "UTF-8");
    }
  }
}

export function importWords() {
  const importWordsField = document.getElementById('importWordsCSV');
  
  if (importWordsField.files.length === 1) {
    if (confirm('Importing a CSV file with words will add all of the words in the file to your dictionary regardless of duplication!\nDo you want to continue?')) {
      addMessage('Importing words...');
      import('papaparse').then(papa => {
        let wordsImported = 0;
        papa.parse(importWordsField.files[0], {
          header: true,
          encoding: "utf-8",
          step: results => {
            if (results.errors.length > 0) {
              results.errors.forEach(err => {
                addMessage('Error Importing Word: ' + err);
                console.error('Error Importing Word: ', err)
              });
            } else {
              const row = results.data[0];
              addWord({
                name: removeTags(row.word).trim(),
                pronunciation: removeTags(row.pronunciation).trim(),
                partOfSpeech: removeTags(row['part of speech']).trim(),
                definition: removeTags(row.definition).trim(),
                details: removeTags(row.explanation).trim(),
                wordId: getNextId(),
              }, false, false);
              wordsImported++;
            }
          },
          complete: () => {
            saveDictionary();
            renderAll();
            importWordsField.value = '';
            document.getElementById('editModal').style.display = 'none';
            addMessage(`Done Importing ${wordsImported} Words`);
          },
          error: err => {
            addMessage('Error Importing Words: ' + err);
            console.error('Error Importing Words: ', err);
          },
          skipEmptyLines: true,
        });
      });
    }
  }
}

export function exportDictionary() {
  addMessage('Exporting JSON...');

  setTimeout(() => {
    const file = JSON.stringify(window.currentDictionary),
      { name, specification } = window.currentDictionary;

    const fileName = slugify(name + '_' + specification) + '.json';

    download(file, fileName, 'application/json;charset=utf-8');
  }, 1);
}

export function exportWords() {
  addMessage('Exporting Words...');

  setTimeout(() => {
    import('papaparse').then(papa => {
      const { name, specification } = window.currentDictionary;
      
      const fileName = slugify(name + '_' + specification) + '_words.csv';
      
      const words = window.currentDictionary.words.map(word => {
        return {
          word: word.name,
          pronunciation: word.pronunciation,
          'part of speech': word.partOfSpeech,
          definition: word.definition,
          explanation: word.details,
        }
      });
      const csv = papa.unparse(words, { quotes: true });
      download(csv, fileName, 'text/csv;charset=utf-8');
    });
  }, 1);
}

export function migrateDictionary() {
  let migrated = false;
  if (!window.currentDictionary.hasOwnProperty('version')) {
    const fixStupidOldNonsense = string => string.replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&#92;/g, '\\').replace(/<br>/g, '\n');
    window.currentDictionary.description = fixStupidOldNonsense(window.currentDictionary.description);
    window.currentDictionary.words = window.currentDictionary.words.map(word => {
      word.definition = word.simpleDefinition;
      delete word.simpleDefinition;
      word.details = fixStupidOldNonsense(word.longDefinition);
      delete word.longDefinition;
      return word;
    });
    window.currentDictionary = Object.assign({}, DEFAULT_DICTIONARY, window.currentDictionary);
    window.currentDictionary.partsOfSpeech = window.currentDictionary.settings.partsOfSpeech.split(',').map(val => val.trim()).filter(val => val !== '');
    delete window.currentDictionary.settings.partsOfSpeech;
    window.currentDictionary.settings.sortByDefinition = window.currentDictionary.settings.sortByEquivalent;
    delete window.currentDictionary.settings.sortByEquivalent;
    
    migrated = true;
  } else if (window.currentDictionary.version !== MIGRATE_VERSION) {
    switch (window.currentDictionary.version) {
      default: console.error('Unknown version'); break;
    }
  }

  if (migrated) {
    saveDictionary();
  }
}

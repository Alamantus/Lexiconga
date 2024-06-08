import papa from 'papaparse';
import { renderDictionaryDetails, renderPartsOfSpeech } from "./render/details";
import { renderAll, renderTheme, renderCustomCSS } from "./render";
import { removeTags, cloneObject, getTimestampInSeconds, download, slugify } from "../helpers";
import { LOCAL_STORAGE_KEY, DEFAULT_DICTIONARY } from "../constants";
import { addMessage, getNextId, hasToken, objectValuesAreDifferent } from "./utilities";
import { addWord, sortWords } from "./wordManagement";
import { migrateDictionary } from './migration';

export function updateDictionary () {
  renderDictionaryDetails();
}

export function openEditModal() {
  const { name, specification, description, partsOfSpeech, alphabeticalOrder } = window.currentDictionary;
  const { phonology, phonotactics, orthography, grammar } = window.currentDictionary.details;
  const { consonants, vowels, blends } = phonology;
  const { allowDuplicates, caseSensitive, sortByDefinition, theme, customCSS, isPublic } = window.currentDictionary.settings;
  
  document.getElementById('editName').value = name;
  document.getElementById('editSpecification').value = specification;
  document.getElementById('editDescription').value = description;
  document.getElementById('editPartsOfSpeech').value = partsOfSpeech.join(',');
  document.getElementById('editAlphabeticalOrder').value = alphabeticalOrder.join(' ');

  document.getElementById('editConsonants').value = consonants.join(' ');
  document.getElementById('editVowels').value = vowels.join(' ');
  document.getElementById('editBlends').value = blends.join(' ');
  document.getElementById('editPhonologyNotes').value = phonology.notes;

  document.getElementById('editOnset').value = phonotactics.onset.join(',');
  document.getElementById('editNucleus').value = phonotactics.nucleus.join(',');
  document.getElementById('editCoda').value = phonotactics.coda.join(',');
  document.getElementById('editPhonotacticsNotes').value = phonotactics.notes;

  document.getElementById('editTranslations').value = orthography.translations.join('\n');
  document.getElementById('editOrthography').value = orthography.notes;
  document.getElementById('editGrammar').value = grammar.notes;

  document.getElementById('editPreventDuplicates').checked = !allowDuplicates;
  document.getElementById('editCaseSensitive').checked = caseSensitive;
  if (allowDuplicates) document.getElementById('editCaseSensitive').disabled = true;
  document.getElementById('editSortByDefinition').checked = sortByDefinition;
  document.getElementById('editTheme').value = theme;
  document.getElementById('editCustomCSS').value = customCSS;
  if (hasToken()) {
    document.getElementById('editIsPublic').checked = isPublic;
  }

  document.getElementById('editModal').style.display = '';
  Array.from(document.querySelectorAll('#editModal .modal-content section')).forEach(section => section.scrollTop = 0);
}

export function saveEditModal() {
  const updatedDictionary = cloneObject(window.currentDictionary);
  delete updatedDictionary.words;
  updatedDictionary.name = removeTags(document.getElementById('editName').value.trim());
  if (updatedDictionary.name.length < 1) {
    updatedDictionary.name = window.currentDictionary.name;
  }
  updatedDictionary.specification = removeTags(document.getElementById('editSpecification').value.trim());
    if (updatedDictionary.specification.length < 1) {
      updatedDictionary.specification = window.currentDictionary.specification;
    }
  updatedDictionary.description = removeTags(document.getElementById('editDescription').value.trim());
  updatedDictionary.partsOfSpeech = document.getElementById('editPartsOfSpeech').value.split(',').map(val => val.trim()).filter(val => val !== '');
  updatedDictionary.alphabeticalOrder = document.getElementById('editAlphabeticalOrder').value.split(' ').map(val => val.trim()).filter(val => val !== '');

  updatedDictionary.details.phonology.consonants = document.getElementById('editConsonants').value.split(' ').map(val => val.trim()).filter(val => val !== '');
  updatedDictionary.details.phonology.vowels = document.getElementById('editVowels').value.split(' ').map(val => val.trim()).filter(val => val !== '');
  updatedDictionary.details.phonology.blends = document.getElementById('editBlends').value.split(' ').map(val => val.trim()).filter(val => val !== '');
  updatedDictionary.details.phonology.notes = removeTags(document.getElementById('editPhonologyNotes').value.trim());

  updatedDictionary.details.phonotactics.onset = document.getElementById('editOnset').value.split(',').map(val => val.trim()).filter(val => val !== '');
  updatedDictionary.details.phonotactics.nucleus = document.getElementById('editNucleus').value.split(',').map(val => val.trim()).filter(val => val !== '');
  updatedDictionary.details.phonotactics.coda = document.getElementById('editCoda').value.split(',').map(val => val.trim()).filter(val => val !== '');
  updatedDictionary.details.phonotactics.notes = removeTags(document.getElementById('editPhonotacticsNotes').value.trim());

  updatedDictionary.details.orthography.translations = document.getElementById('editTranslations').value.split('\n').map(val => val.trim()).filter(val => val !== '');
  updatedDictionary.details.orthography.notes = removeTags(document.getElementById('editOrthography').value.trim());
  updatedDictionary.details.grammar.notes = removeTags(document.getElementById('editGrammar').value.trim());

  updatedDictionary.settings.allowDuplicates = !document.getElementById('editPreventDuplicates').checked;
  updatedDictionary.settings.caseSensitive = document.getElementById('editCaseSensitive').checked;
  updatedDictionary.settings.sortByDefinition = document.getElementById('editSortByDefinition').checked;
  updatedDictionary.settings.theme = document.getElementById('editTheme').value;
  updatedDictionary.settings.customCSS = removeTags(document.getElementById('editCustomCSS').value.trim());

  if (hasToken()) {
    updatedDictionary.settings.isPublic = document.getElementById('editIsPublic').checked;
  } else {
    updatedDictionary.settings.isPublic = false;
  }

  if (objectValuesAreDifferent(updatedDictionary, window.currentDictionary)) {
    window.currentDictionary = Object.assign(window.currentDictionary, updatedDictionary);

    renderTheme();
    renderCustomCSS();
    renderDictionaryDetails();
    renderPartsOfSpeech();
    sortWords(true);

    addMessage('Saved ' + window.currentDictionary.specification + ' Successfully');
    saveDictionary();

    if (hasToken()) {
      import('./account/index.js').then(account => {
        account.uploadDetailsDirect();
        account.updateChangeDictionaryOption();
      })
    }
  } else {
    addMessage('No changes made to Dictionary Settings.');
  }
}

export function saveAndCloseEditModal() {
  saveEditModal();
  document.getElementById('editModal').style.display = 'none';
}

export function saveDictionary(triggerLastUpdated = true) {
  if (triggerLastUpdated) {
    window.currentDictionary.lastUpdated = getTimestampInSeconds();
  }
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
  window.currentDictionary.settings.theme = window.settings.defaultTheme;
}

export function deleteDictionary() {
  const deletedId = window.currentDictionary.externalID;
  clearDictionary();
  saveDictionary();
  addMessage('Dictionary Deleted!');
  renderAll();

  if (hasToken()) {
    import('./account/index.js').then(account => {
      account.deleteCurrentDictionary(deletedId);
    });
  }
}

export function confirmDeleteDictionary() {
  if (confirm(`Are you sure you want to delete your ${window.currentDictionary.name} ${window.currentDictionary.specification}?\n\nThis cannot be undone!`)) {
    const input = prompt(`If you really want to delete your ${window.currentDictionary.name} ${window.currentDictionary.specification} please type DELETE in the text box.\n\nAfter you confirm, cour dicitonary will be PERMANENTLY AND IRRETRIEVABLY DESTROYED!`);
    
    if (input === 'DELETE') {
      deleteDictionary();
      document.getElementById('editModal').style.display = 'none';
    } else {
      alert('Your dictionary was NOT deleted');
    }
  }
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
          const timestamp = getTimestampInSeconds();
          if (!importedDictionary.hasOwnProperty('createdOn')) {
            importedDictionary.createdOn = timestamp;
          }
          if (importedDictionary.words.some(word => !word.hasOwnProperty('createdOn'))) {
            importedDictionary.words.forEach(word => {
              if (!word.hasOwnProperty('createdOn')) {
                word.createdOn = timestamp;
              }
              if (!word.hasOwnProperty('lastUpdated')) {
                word.lastUpdated = timestamp;
              }
            });
          }
          if (importedDictionary.hasOwnProperty('externalID')) {
            delete importedDictionary.externalID;
          }

          window.currentDictionary = importedDictionary;
          saveDictionary();
          renderAll();
          importDictionaryField.value = '';
          document.getElementById('editModal').style.display = 'none';
          addMessage('Dictionary Imported Successfully');

          if (hasToken()) {
            import('./account/index.js').then(account => {
              account.syncImportedDictionary();
            });
          }
        } else {
          addMessage('Dictionary could not be imported', 10000, 'error');
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
      const importedWords = [];
      papa.parse(importWordsField.files[0], {
        header: true,
        encoding: "utf-8",
        step: results => {
          if (results.errors.length > 0) {
            results.errors.forEach(err => {
              addMessage('Error Importing Word: ' + err, undefined, 'error');
              console.error('Error Importing Word: ', err)
            });
          } else {
            const row = results.data;
            const wordToImport = {
              name: removeTags(row.word).trim(),
              pronunciation: removeTags(row.pronunciation).trim(),
              partOfSpeech: removeTags(row['part of speech']).trim(),
              definition: removeTags(row.definition).trim(),
              details: removeTags(row.explanation).trim(),
              wordId: getNextId(),
            };
            if (typeof row['etymology'] !== 'undefined') {
              const etymology = removeTags(row['etymology']).trim().split(',').filter(etymology => etymology.trim() !== '');
              if (etymology.length > 0) {
                wordToImport.etymology = etymology;
              }
            }
            if (typeof row['etymology (comma-separated)'] !== 'undefined') {
              const etymology = removeTags(row['etymology (comma-separated)']).trim().split(',').filter(etymology => etymology.trim() !== '');
              if (etymology.length > 0) {
                wordToImport.etymology = etymology;
              }
            }
            if (typeof row['related words'] !== 'undefined') {
              const related = removeTags(row['related words']).trim().split(',').filter(related => related.trim() !== '');
              if (related.length > 0) {
                wordToImport.related = related;
              }
            }
            if (typeof row['related words (comma-separated)'] !== 'undefined') {
              const related = removeTags(row['related words (comma-separated)']).trim().split(',').filter(related => related.trim() !== '');
              if (related.length > 0) {
                wordToImport.related = related;
              }
            }
            if (typeof row['principal parts'] !== 'undefined') {
              const principalParts = removeTags(row['principal parts']).trim().split(',').filter(principalParts => principalParts.trim() !== '');
              if (principalParts.length > 0) {
                wordToImport.principalParts = principalParts;
              }
            }
            if (typeof row['principal parts (comma-separated)'] !== 'undefined') {
              const principalParts = removeTags(row['principal parts (comma-separated)']).trim().split(',').filter(principalParts => principalParts.trim() !== '');
              if (principalParts.length > 0) {
                wordToImport.principalParts = principalParts;
              }
            }
            const importedWord = addWord(wordToImport, false);

            importedWords.push(importedWord);

            // Sort and save every 500 words, just in case something goes wrong on large imports
            if (importedWords.length % 500 == 499) {
              sortWords(false);
            }
          }
        },
        complete: () => {
          sortWords(false);
          renderAll();
          importWordsField.value = '';
          document.getElementById('editModal').style.display = 'none';
          addMessage(`Done Importing ${importedWords.length} Words`);

          if (hasToken()) {
            import('./account/index.js').then(account => {
              account.syncImportedWords(importedWords);
            });
          }
        },
        error: err => {
          addMessage('Error Importing Words: ' + err, undefined, 'error');
          console.error('Error Importing Words: ', err);
        },
        skipEmptyLines: true,
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
    const { name, specification } = window.currentDictionary;
    
    const fileName = slugify(name + '_' + specification) + '_words.csv';
    
    const words = window.currentDictionary.words.map(word => {
      return {
        word: word.name,
        pronunciation: word.pronunciation,
        'part of speech': word.partOfSpeech,
        definition: word.definition,
        explanation: word.details,
        'etymology (comma-separated)': typeof word.etymology !== 'undefined' ? word.etymology.join(',') : '',
        'related words (comma-separated)': typeof word.related !== 'undefined' ? word.related.join(',') : '',
        'principal parts (comma-separated)': typeof word.principalParts !== 'undefined' ? word.principalParts.join(',') : '',
      }
    });
    const csv = papa.unparse(words, { quotes: true });
    download(csv, fileName, 'text/csv;charset=utf-8');
  }, 1);
}

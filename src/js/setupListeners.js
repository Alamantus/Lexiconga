import {showSection} from './displayToggles';
import { renderWords } from './render';
import { validateWord, addWord } from './wordManagement';
import { removeTags } from '../helpers';
import { getNextId } from './utilities';
import { openEditModal, save, saveAndClose } from './dictionaryManagement';

export default function setupListeners() {
  setupDetailsTabs();
  setupSearchBar();
  setupWordForm();
}

function setupDetailsTabs() {
  const tabs = document.querySelectorAll('#detailsSection nav li');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const section = tab.innerText.toLowerCase();
      if (section === 'edit') {
        openEditModal();
        // import('../test.js').then(function (test) {
        //   // Render page
        //   test.aaa();
        // });
      } else {
        const isActive = tab.classList.contains('active');
        tabs.forEach(t => t.classList.remove('active'));
        if (isActive) {
          document.getElementById('detailsPanel').style.display = 'none';
        } else {
          tab.classList.add('active');
          showSection(section);
        }
      }
    });
  });
  setupEditFormTabs();
  setupEditFormButtons();
}

function setupEditFormTabs() {
  const tabs = document.querySelectorAll('#editModal nav li');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('active');
        document.getElementById('edit' + t.innerText + 'Tab').style.display = 'none';
      });
      tab.classList.add('active');
      document.getElementById('edit' + tab.innerText + 'Tab').style.display = '';
    });
  });
}

function setupEditFormButtons() {
  document.getElementById('editSave').addEventListener('click', () => save());
  document.getElementById('editSaveAndClose').addEventListener('click', () => saveAndClose());
}

function setupSearchBar() {
  const searchBox = document.getElementById('searchBox'),
    clearSearchButton = document.getElementById('clearSearchButton'),
    openSearchModal = document.getElementById('openSearchModal');
  searchBox.addEventListener('change', () => {
    renderWords();
  });
  searchBox.addEventListener('input', event => {
    openSearchModal.value = event.target.value;
  });
  clearSearchButton.addEventListener('click', event => {
    searchBox.value = '';
    openSearchModal.value = '';
    renderWords();
  });
  openSearchModal.addEventListener('click', () => {
    document.getElementById('searchModal').style.display = 'block';
  });
}

function setupWordForm() {
  const wordForm = document.getElementById('wordForm'),
    addWordButton = document.getElementById('addWordButton');
  wordForm.addEventListener('submit', event => {
    // Allow semantic form and prevent it from getting submitted
    event.preventDefault();
    return false;
  });
  addWordButton.addEventListener('click', () => {
    const name = document.getElementById('wordName').value,
      pronunciation = document.getElementById('wordPronunciation').value,
      partOfSpeech = document.getElementById('wordPartOfSpeech').value,
      definition = document.getElementById('wordDefinition').value,
      details = document.getElementById('wordDetails').value;

    const word = {
      name: removeTags(name).trim(),
      pronunciation: removeTags(pronunciation).trim(),
      partOfSpeech: removeTags(partOfSpeech).trim(),
      simpleDefinition: removeTags(definition).trim(),
      longDefinition: removeTags(details).trim(),
      wordId: getNextId(),
    };

    if (validateWord(word)) {
      addWord(word);
    }
  });
}
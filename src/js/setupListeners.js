import {showSection} from './displayToggles';
import { renderWords, renderWordOptions, destroyWordOptions, renderEditForm } from './render';
import { validateWord, addWord } from './wordManagement';
import { removeTags } from '../helpers';
import { getNextId } from './utilities';
import { openEditModal, save, saveAndClose } from './dictionaryManagement';
import { goToNextPage, goToPreviousPage, goToPage } from './pagination';

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
  setupEditFormInteractions();
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

function setupEditFormInteractions() {
  const preventDuplicatesBox = document.getElementById('editPreventDuplicates');
  preventDuplicatesBox.addEventListener('change', () => {
    console.log('changed');
    const caseSensitiveBox = document.getElementById('editCaseSensitive');
    if (preventDuplicatesBox.checked) {
      console.log('checked');
      caseSensitiveBox.disabled = false;
    } else {
      console.log('unchecked');
      caseSensitiveBox.disabled = true;
      caseSensitiveBox.checked = false;
    }
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

export function setupSearchFilters() {
  const searchFilters = document.querySelectorAll('#searchOptions input[type="checkbox"]');
  Array.from(searchFilters).concat([searchBox]).forEach(filter => {
    filter.removeEventListener('change', renderWords);
    filter.addEventListener('change', renderWords);
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

export function setupWordOptionButtons() {
  const wordOptionButtons = document.getElementsByClassName('word-option-button');
  const showWordOptions = function() {
    this.parentElement.querySelector('.word-option-list').style.display = '';
  }
  const hideWordOptions = function(e) {
    if (!e.target.classList.contains('word-option-button')) {
      const allWordOptions = document.querySelectorAll('.word-option-list');
      Array.from(allWordOptions).forEach(wordOptionList => {
        wordOptionList.style.display = 'none';
      });
    }
  }

  Array.from(wordOptionButtons).forEach(button => {
    button.removeEventListener('click', showWordOptions);
    button.addEventListener('click', showWordOptions);
  });

  document.removeEventListener('click', hideWordOptions);
  document.addEventListener('click', hideWordOptions);

}

export function setupWordOptionSelections() {
  const wordOptions = document.getElementsByClassName('word-option');
  Array.from(wordOptions).forEach(option => {
    switch (option.innerText) {
      case 'Edit': {
        option.removeEventListener('click', renderEditForm);
        option.addEventListener('click', renderEditForm);
        break;
      }
      case 'Delete': {
        break;
      }
    }
  });
}

export function setupEditFormButtons() {
  const saveChangesButtons = document.getElementsByClassName('edit-save-changes');
  const cancelChangesButtons = document.getElementsByClassName('edit-cancel');
  Array.from(saveChangesButtons).forEach(button => {
    button.removeEventListener('click', renderEditForm);
    button.addEventListener('click', renderEditForm);
  });
  Array.from(cancelChangesButtons).forEach(button => {
    button.removeEventListener('click', renderWords);
    button.addEventListener('click', renderWords);
  });
}

export function setupPagination() {
  const nextButtons = document.getElementsByClassName('next-button'),
    prevButtons = document.getElementsByClassName('prev-button'),
    pageSelectors = document.getElementsByClassName('page-selector');
  
  Array.from(nextButtons).forEach(nextButton => {
    nextButton.removeEventListener('click', goToNextPage);
    nextButton.addEventListener('click', goToNextPage);
  });
  Array.from(prevButtons).forEach(prevButton => {
    prevButton.removeEventListener('click', goToPreviousPage);
    prevButton.addEventListener('click', goToPreviousPage);
  });
  
  Array.from(pageSelectors).forEach(pageSelector => {
    pageSelector.removeEventListener('change', goToPage);
    pageSelector.addEventListener('change', goToPage);
  });
}

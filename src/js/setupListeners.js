import {showSection} from './displayToggles';
import { renderWords, renderEditForm, renderMaximizedTextbox, renderInfoModal, renderIPATable } from './render';
import { validateWord, addWord, confirmEditWord, cancelEditWord, confirmDeleteWord } from './wordManagement';
import { removeTags } from '../helpers';
import { getNextId } from './utilities';
import { openEditModal, saveEditModal, saveAndCloseEditModal } from './dictionaryManagement';
import { goToNextPage, goToPreviousPage, goToPage } from './pagination';
import { insertAtCursor } from './StackOverflow/inputCursorManagement';

export default function setupListeners() {
  setupDetailsTabs();
  setupSearchBar();
  setupSettingsModal();
  setupWordForm();
  setupMobileWordFormButton();
  setupInfoButtons();
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
  document.getElementById('editSave').addEventListener('click', () => saveEditModal());
  document.getElementById('editSaveAndClose').addEventListener('click', () => saveAndCloseEditModal());

  setupMaximizeButtons();
}

function setupSearchBar() {
  const searchBox = document.getElementById('searchBox'),
    clearSearchButton = document.getElementById('clearSearchButton'),
    openSearchModal = document.getElementById('openSearchModal'),
    searchIgnoreDiacritics = document.getElementById('searchIgnoreDiacritics'),
    searchExactWords = document.getElementById('searchExactWords'),
    searchIncludeDetails = document.getElementById('searchIncludeDetails');
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
    searchBox.focus();
  });

  const toggleDetailsCheck = function() {
    if (searchExactWords.checked) {
      searchIncludeDetails.checked = false;
      searchIncludeDetails.disabled = true;
    } else {
      searchIncludeDetails.disabled = false;
      searchIncludeDetails.checked = true;
    }
  }

  searchIgnoreDiacritics.addEventListener('change', () => {
    if (searchIgnoreDiacritics.checked) {
      searchExactWords.checked = false;
      searchExactWords.disabled = true;
    } else {
      searchExactWords.disabled = false;
    }
    toggleDetailsCheck();
  });

  searchExactWords.addEventListener('change', () => toggleDetailsCheck());
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

  setupIPAButtons();
  setupMaximizeButtons();
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
        option.removeEventListener('click', confirmDeleteWord);
        option.addEventListener('click', confirmDeleteWord);
        break;
      }
    }
  });
}

export function setupSettingsModal() {
  document.getElementById('settingsButton').addEventListener('click', () => {
    document.getElementById('settingsModal').style.display = '';
  });
}

export function setupWordEditFormButtons() {
  const saveChangesButtons = document.getElementsByClassName('edit-save-changes');
  const cancelChangesButtons = document.getElementsByClassName('edit-cancel');
  Array.from(saveChangesButtons).forEach(button => {
    button.removeEventListener('click', confirmEditWord);
    button.addEventListener('click', confirmEditWord);
  });
  Array.from(cancelChangesButtons).forEach(button => {
    button.removeEventListener('click', cancelEditWord);
    button.addEventListener('click', cancelEditWord);
  });

  setupIPAButtons();
  setupMaximizeButtons();
}

export function setupMobileWordFormButton() {
  const mobileButton = document.getElementById('mobileWordFormShow'),
    wordForm = document.getElementById('wordForm');
  
  mobileButton.addEventListener('click', () => {
    if (mobileButton.innerText === '+') {
      wordForm.style.display = 'block';
      mobileButton.innerHTML = '&times;&#xFE0E;';
    } else {
      wordForm.style.display = '';
      mobileButton.innerHTML = '+';
    }
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

export function setupIPAButtons() {
  const ipaTableButtons = document.getElementsByClassName('ipa-table-button'),
    ipaFieldHelpButtons = document.getElementsByClassName('ipa-field-help-button');

  Array.from(ipaTableButtons).forEach(button => {
    button.removeEventListener('click', renderIPATable);
    button.addEventListener('click', renderIPATable);
  });

  const renderIPAHelp = () => {
    import('./KeyboardFire/phondue/usage.html').then(html => {
      renderInfoModal(html);
    });
  }
  Array.from(ipaFieldHelpButtons).forEach(button => {
    button.removeEventListener('click', renderIPAHelp);
    button.addEventListener('click', renderIPAHelp);
  });
}

export function setupIPATable(modal, textBox) {
  const closeElements = modal.querySelectorAll('.modal-background, .close-button, .done-button'),
    headerTextBox = modal.querySelector('header input'),
    ipaButtons = modal.querySelectorAll('.td-btn button');
  Array.from(closeElements).forEach(close => {
    close.addEventListener('click', () => {
      modal.parentElement.removeChild(modal);
    });
  });

  headerTextBox.addEventListener('change', () => {
    textBox.value = headerTextBox.value;
  });
  
  Array.from(ipaButtons).forEach(button => {
    button.addEventListener('click', () => {
      console.log(button);
      insertAtCursor(headerTextBox, button.innerText);
      textBox.value = headerTextBox.value;
    });
  });

  setTimeout(() => {
    headerTextBox.focus();
  }, 1);
}

export function setupMaximizeButtons() {
  const maximizeButtons = document.getElementsByClassName('maximize-button');
  Array.from(maximizeButtons).forEach(button => {
    button.removeEventListener('click', renderMaximizedTextbox);
    button.addEventListener('click', renderMaximizedTextbox);
  });
}

export function setupMaximizeModal(modal, textBox) {
  const closeElements = modal.querySelectorAll('.modal-background, .close-button, .done-button'),
    maximizedTextBox = modal.querySelector('textarea');
  Array.from(closeElements).forEach(close => {
    close.addEventListener('click', () => {
      modal.parentElement.removeChild(modal);
    });
  });

  maximizedTextBox.addEventListener('change', () => {
    textBox.value = maximizedTextBox.value;
  })

  setTimeout(() => {
    modal.querySelector('textarea').focus();
  }, 1);
}

export function setupInfoButtons() {
  document.getElementById('helpInfoButton').addEventListener('click', () => {
    import('../markdown/help.md').then(html => {
      renderInfoModal(html);
    });
  });
  document.getElementById('termsInfoButton').addEventListener('click', () => {
    import('../markdown/terms.md').then(html => {
      renderInfoModal(html);
    });
  });
  document.getElementById('privacyInfoButton').addEventListener('click', () => {
    import('../markdown/privacy.md').then(html => {
      renderInfoModal(html);
    });
  });
}

export function setupInfoModal(modal) {
  const closeElements = modal.querySelectorAll('.modal-background, .close-button');
  Array.from(closeElements).forEach(close => {
    close.addEventListener('click', () => {
      modal.parentElement.removeChild(modal);
    });
  });
}

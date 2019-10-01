import { renderEditForm } from '../render/words';
import { confirmEditWord, cancelEditWord, confirmDeleteWord, expandAdvancedForm, submitWordForm } from '../wordManagement';
import { goToNextPage, goToPreviousPage, goToPage } from '../pagination';
import { setupMaximizeButtons } from './buttons';
import { setupIPAFields } from '.';

export function setupWordForm() {
  const wordForm = document.getElementById('wordForm'),
    expandAdvancedFormButton = document.getElementById('expandAdvancedForm'),
    addWordButton = document.getElementById('addWordButton');
  wordForm.addEventListener('submit', event => {
    // Allow semantic form and prevent it from getting submitted
    event.preventDefault();
    return false;
  });
  expandAdvancedFormButton.addEventListener('click', expandAdvancedForm);
  addWordButton.addEventListener('click', submitWordForm);

  setupIPAFields();
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

export function setupWordEditFormButtons() {
  const expandAdvancedFormButtons = document.getElementsByClassName('expand-advanced-form'),
    saveChangesButtons = document.getElementsByClassName('edit-save-changes'),
    cancelChangesButtons = document.getElementsByClassName('edit-cancel');
  Array.from(expandAdvancedFormButtons).forEach(button => {
    button.removeEventListener('click', expandAdvancedForm);
    button.addEventListener('click', expandAdvancedForm);
  });
  Array.from(saveChangesButtons).forEach(button => {
    button.removeEventListener('click', confirmEditWord);
    button.addEventListener('click', confirmEditWord);
  });
  Array.from(cancelChangesButtons).forEach(button => {
    button.removeEventListener('click', cancelEditWord);
    button.addEventListener('click', cancelEditWord);
  });

  setupIPAFields();
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
import {showSection, hideDetailsPanel} from './displayToggles';
import { showSearchModal, clearSearchText, checkAllPartsOfSpeechFilters, uncheckAllPartsOfSpeechFilters } from '../search';
import { renderWords, renderInfoModal } from './render';

export default function setupListeners() {
  setupDetailsTabs();
  setupSearchBar();
  setupInfoButtons();
}

function setupDetailsTabs() {
  const tabs = document.querySelectorAll('#detailsSection nav li');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const section = tab.innerText.toLowerCase();
      const isActive = tab.classList.contains('active');
      tabs.forEach(t => t.classList.remove('active'));
      if (isActive) {
        hideDetailsPanel();
      } else {
        tab.classList.add('active');
        showSection(section);
      }
    });
  });
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
  clearSearchButton.addEventListener('click', clearSearchText);
  openSearchModal.addEventListener('click', showSearchModal);

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
  const searchFilters = document.querySelectorAll('#searchOptions input[type="checkbox"]'),
    searchBox = document.getElementById('searchBox');
  Array.from(searchFilters).concat([searchBox]).forEach(filter => {
    filter.removeEventListener('change', renderWords);
    filter.addEventListener('change', renderWords);
  });
  document.getElementById('checkAllFilters').removeEventListener('click', checkAllPartsOfSpeechFilters);
  document.getElementById('checkAllFilters').addEventListener('click', checkAllPartsOfSpeechFilters);
  document.getElementById('uncheckAllFilters').removeEventListener('click', uncheckAllPartsOfSpeechFilters);
  document.getElementById('uncheckAllFilters').addEventListener('click', uncheckAllPartsOfSpeechFilters);
}

export function setupInfoButtons() {
  document.getElementById('helpInfoButton').addEventListener('click', () => {
    import('../../markdown/help.md').then(html => {
      renderInfoModal(html);
    });
  });
  document.getElementById('termsInfoButton').addEventListener('click', () => {
    import('../../markdown/terms.md').then(html => {
      renderInfoModal(html);
    });
  });
  document.getElementById('privacyInfoButton').addEventListener('click', () => {
    import('../../markdown/privacy.md').then(html => {
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

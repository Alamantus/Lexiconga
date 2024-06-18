import { renderWords } from '../render/words';
import { showSearchModal, clearSearchText, checkAllPartsOfSpeechFilters, uncheckAllPartsOfSpeechFilters } from '../search';

/**
 * Identify selector strings and handlers
 * @param {Function} when Passed from setupListeners, which listens to clicks on document.body
 */
export function handleSearchClickEvents(when) {
  when('#clearSearchButton', clearSearchText);
  when('#openSearchModal', showSearchModal);

  when('#checkAllFilters', checkAllPartsOfSpeechFilters);
  when('#uncheckAllFilters', uncheckAllPartsOfSpeechFilters);
}

export function setupSearchBarEvents() {
  const searchBox = document.getElementById('searchBox'),
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
}

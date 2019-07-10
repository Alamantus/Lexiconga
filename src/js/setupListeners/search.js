import { renderWords } from '../render/words';
import { showSearchModal, clearSearchText, checkAllPartsOfSpeechFilters, uncheckAllPartsOfSpeechFilters } from '../search';

export function setupSearchBar() {
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
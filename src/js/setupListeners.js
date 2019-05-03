import {showSection} from './displayToggles';
import { renderWords } from './render';

export default function setupListeners() {
  setupDetailsTabs();
  setupSearchBar();
}

function setupDetailsTabs() {
  const tabs = document.querySelectorAll('#detailsSection nav li');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const section = tab.innerText.toLowerCase();
      const isActive = tab.classList.contains('active');
      tabs.forEach(t => t.classList.remove('active'));
      if (isActive) {
        document.getElementById('detailsPanel').style.display = 'none';
      } else {
        tab.classList.add('active');
        showSection(section);
      }
    });
  })
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
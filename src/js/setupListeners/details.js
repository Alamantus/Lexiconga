import { showSection, hideDetailsPanel } from '../displayToggles';
import { openEditModal, saveEditModal, saveAndCloseEditModal, exportDictionary, exportWords, importDictionary, importWords, confirmDeleteDictionary } from '../dictionaryManagement';
import { setupMaximizeButtons } from './buttons';

export function setupDetailsTabs() {
  const tabs = document.querySelectorAll('#detailsSection nav li');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const section = tab.innerText.toLowerCase();
      if (section === 'edit') {
        openEditModal();
      } else {
        const isActive = tab.classList.contains('active');
        tabs.forEach(t => t.classList.remove('active'));
        if (isActive) {
          hideDetailsPanel();
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
    const caseSensitiveBox = document.getElementById('editCaseSensitive');
    if (preventDuplicatesBox.checked) {
      caseSensitiveBox.disabled = false;
    } else {
      caseSensitiveBox.disabled = true;
      caseSensitiveBox.checked = false;
    }
  });
}

function setupEditFormButtons() {
  document.getElementById('editSave').addEventListener('click', saveEditModal);
  document.getElementById('editSaveAndClose').addEventListener('click', saveAndCloseEditModal);
  document.getElementById('importDictionaryFile').addEventListener('change', importDictionary);
  document.getElementById('importWordsCSV').addEventListener('change', importWords);
  document.getElementById('exportDictionaryButton').addEventListener('click', exportDictionary);
  document.getElementById('exportWordsButton').addEventListener('click', exportWords);
  document.getElementById('deleteDictionaryButton').addEventListener('click', confirmDeleteDictionary);

  setupMaximizeButtons();
}
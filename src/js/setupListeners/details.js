import { showSection, hideDetailsPanel } from '../displayToggles';
import { openEditModal, saveEditModal, saveAndCloseEditModal, exportDictionary, exportWords, importDictionary, importWords, confirmDeleteDictionary } from '../dictionaryManagement';

/**
 * Identify selector strings and handlers
 * @param {Function} when Passed from setupListeners, which listens to clicks on document.body
 */
export function handleDetailClicks(when) {
  // Details Tabs
  when('#detailsSection nav li', handleClickTab);
  // Edit Form Tabs
  when('#editModal nav li', handleClickEditFormTab);
  // Edit Form Buttons
  when('#editSave', saveEditModal);
  when('#editSaveAndClose', saveAndCloseEditModal);
  when('#importDictionaryFile', importDictionary);
  when('#importWordsCSV', importWords);
  when('#exportDictionaryButton', exportDictionary);
  when('#exportWordsButton', exportWords);
  when('#deleteDictionaryButton', confirmDeleteDictionary);
}

function handleClickTab(tabElement) {
  const section = tabElement.innerText.toLowerCase();
  if (section === 'edit') {
    openEditModal();
  } else {
    const isActive = tabElement.classList.contains('active');
    document.querySelectorAll('#detailsSection nav li')
      .forEach(t => t.classList.remove('active'));
    if (isActive) {
      hideDetailsPanel();
    } else {
      tabElement.classList.add('active');
      showSection(section);
    }
  }
}

function handleClickEditFormTab(tabElement) {
  document.querySelectorAll('#editModal nav li').forEach(t => {
    t.classList.remove('active');
    document.getElementById('edit' + t.innerText + 'Tab').style.display = 'none';
  });
  tabElement.classList.add('active');
  const tabSection = document.getElementById('edit' + tabElement.innerText + 'Tab');
  tabSection.style.display = '';
  tabSection.scrollTop = 0;
}

export function setupEditFormInteractions() {
  const preventDuplicatesBox = document.getElementById('editPreventDuplicates');
  preventDuplicatesBox.removeEventListener('change', handlePreventDuplicatesBoxChange);
  preventDuplicatesBox.addEventListener('change', handlePreventDuplicatesBoxChange);
}

function handlePreventDuplicatesBoxChange(event) {
  const caseSensitiveBox = document.getElementById('editCaseSensitive');
  if (event.target.checked) {
    caseSensitiveBox.disabled = false;
  } else {
    caseSensitiveBox.disabled = true;
    caseSensitiveBox.checked = false;
  }
}

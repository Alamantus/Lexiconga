import { confirmEditWord, submitWordForm } from "./wordManagement";
import { showSection, getIsDetailsPanelDisplayed, hideDetailsPanel } from "./displayToggles";
import { renderInfoModal, renderMaximizedTextbox } from "./render";
import { showSearchModal, clearSearchText } from "./search";
import { saveAndCloseSettingsModal, openSettingsModal, saveSettings } from "./settings";
import { saveAndCloseEditModal, openEditModal } from "./dictionaryManagement";
import { addMessage } from "./utilities";

export function enableHotKeys() {
  document.addEventListener('keydown', hotKeyActions);
}

export function disableHotKeys() {
  document.removeEventListener('keydown', hotKeyActions);
}

export function hotKeyActions(event) {
  if (typeof event.key === 'undefined' || typeof event.ctrlKey === 'undefined' || typeof event.altKey === 'undefined') {
    addMessage('Hotkeys disabled');
    console.warn('Browser does not have required event properties for hotkeys.');
    window.settings.useHotkeys = false;
    saveSettings();
    disableHotKeys();
    return false;
  }

  switch (event.key) {
    case 'Escape': hideAllModals(); break;
    case 'Return':
    case 'Enter': {
      if (event.ctrlKey) {
        if (document.getElementById('settingsModal').style.display !== 'none') {
          saveAndCloseSettingsModal();
        } else if (document.getElementById('editModal').style.display !== 'none') {
          saveAndCloseEditModal();
        } else {
          submitWord();
        }
      } break;
    }
    case 'd': if (event.ctrlKey) {event.preventDefault(); toggleDetailsDisplay();} break;
    case 'e': if (event.ctrlKey) {event.preventDefault(); hideAllModals(); openEditModal();} break;
    case 'h': if (event.ctrlKey) {event.preventDefault(); hideAllModals(); showHelpModal();} break;
    case 'm': if (event.ctrlKey) {event.preventDefault(); maximizeTextarea();} break;
    case 's': {
      if (event.ctrlKey) {
        event.preventDefault();
        hideAllModals();
        if (event.shiftKey) { // This is a failsafe in case the 'S' case below doesn't work for certain browsers
          openSettingsModal();
        } else {
          showSearchModal();
        }
      }
      break;
    }
    case 'S': if (event.ctrlKey) {event.preventDefault(); hideAllModals(); openSettingsModal();} break;
    case 'x': if (event.ctrlKey) {event.preventDefault(); clearSearchText();} break;
  }
}

function hideAllModals() {
  const permanentModals = ['#searchModal', '#settingsModal', '#editModal'];
  const hideModals = document.querySelectorAll(permanentModals.join(',')),
    removeModals = document.querySelectorAll('.modal:not(' + permanentModals.join('):not(') + ')');
  Array.from(hideModals).forEach(modal => modal.style.display = 'none');
  Array.from(removeModals).forEach(modal => modal.parentElement.removeChild(modal));
}

function toggleDetailsDisplay() {
  const activeTab = document.querySelector('#detailsSection nav li.active');
  console.log(activeTab);
  Array.from(document.querySelectorAll('#detailsSection nav li')).forEach(li => li.classList.remove('active'));
  if (activeTab) {
    switch(activeTab.innerText.trim().toLowerCase()) {
      case 'description': {
        document.querySelector('#detailsSection nav li:nth-child(2)').classList.add('active');
        showSection('details');
        break;
      }
      case 'details': {
        document.querySelector('#detailsSection nav li:nth-child(3)').classList.add('active');
        showSection('stats');
        break;
      }
      case 'stats': {
        hideDetailsPanel();
        break;
      }
    }
  } else {
    document.querySelector('#detailsSection nav li:nth-child(1)').classList.add('active');
    showSection('description');
  }
}

function submitWord() {
  const focused = document.activeElement;
  if (focused && focused.id) {
    const isSubmittableField = focused.id.includes('wordName') || focused.id.includes('wordDefinition') || focused.id.includes('wordDetails');
    if (isSubmittableField) {
      if (focused.parentElement.parentElement.classList.contains('edit-form')) {
        const wordId = parseInt(focused.parentElement.parentElement.id.replace('editForm_', ''));
        confirmEditWord(wordId);
      } else {
        submitWordForm();
      }
    }
  }
}

function showHelpModal() {
  import('../markdown/help.md').then(html => {
    renderInfoModal(html);
  });
}

function maximizeTextarea() {
  const focused = document.activeElement;
  if (focused) {
    const maximizeButton = focused.parentElement.querySelector('.maximize-button');
    console.log(maximizeButton);
    console.log(maximizeButton.parentElement);
    if (maximizeButton) {
      renderMaximizedTextbox(maximizeButton);
    }
  }
}

import { SETTINGS_KEY, DEFAULT_SETTINGS } from "../constants";
import { cloneObject } from "../helpers";
import { usePhondueDigraphs } from "./KeyboardFire/phondue/ipaField";
import { renderWords } from "./render";
import { addMessage } from "./utilities";

export function loadSettings() {
  const storedSettings = window.localStorage.getItem(SETTINGS_KEY);
  window.settings = storedSettings ? JSON.parse(storedSettings) : cloneObject(DEFAULT_SETTINGS);
  toggleIPAPronunciationFields();
}

export function saveSettings() {
  window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(window.settings));
  addMessage('Settings Saved!');
}

export function openSettingsModal() {
  const { useIPAPronunciationField } = window.settings;

  document.getElementById('settingsUseIPA').checked = useIPAPronunciationField;

  document.getElementById('settingsModal').style.display = '';
}

export function saveSettingsModal() {
  window.settings.useIPAPronunciationField = document.getElementById('settingsUseIPA').checked;

  saveSettings();
  toggleIPAPronunciationFields();
}

export function saveAndCloseSettingsModal() {
  saveSettingsModal();
  document.getElementById('settingsModal').style.display = 'none';
}

export function toggleIPAPronunciationFields() {
  const ipaButtons = document.querySelectorAll('.ipa-table-button, .ipa-field-help-button'),
    ipaFields = document.querySelectorAll('.ipa-field');
  if (!window.settings.useIPAPronunciationField) {
    Array.from(ipaButtons).forEach(button => {
      button.style.display = 'none';
    });
    Array.from(ipaFields).forEach(field => {
      field.removeEventListener('keypress', usePhondueDigraphs);
    });
  } else {
    Array.from(ipaButtons).forEach(button => {
      button.style.display = '';
    });
    Array.from(ipaFields).forEach(field => {
      field.addEventListener('keypress', usePhondueDigraphs);
    });
  }
  renderWords();
}

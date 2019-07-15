import { SETTINGS_KEY, DEFAULT_SETTINGS } from "../constants";
import { cloneObject, removeTags } from "../helpers";
import { usePhondueDigraphs } from "./KeyboardFire/phondue/ipaField";
import { renderWords } from "./render/words";
import { addMessage, hasToken, objectValuesAreDifferent } from "./utilities";
import { enableHotKeys, disableHotKeys } from "./hotkeys";

export function loadSettings() {
  const storedSettings = window.localStorage.getItem(SETTINGS_KEY);
  window.settings = storedSettings ? JSON.parse(storedSettings) : cloneObject(DEFAULT_SETTINGS);
  toggleIPAPronunciationFields(false);
}

export function saveSettings() {
  window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(window.settings));
  addMessage('Settings Saved!');
}

export function openSettingsModal() {
  const { useIPAPronunciationField, useHotkeys, defaultTheme } = window.settings;

  document.getElementById('settingsUseIPA').checked = useIPAPronunciationField;
  document.getElementById('settingsUseHotkeys').checked = useHotkeys;
  document.getElementById('settingsDefaultTheme').value = defaultTheme;

  document.getElementById('settingsModal').style.display = '';
}

export function saveSettingsModal() {
  const updatedSettings = cloneObject(window.settings);
  updatedSettings.useIPAPronunciationField = document.getElementById('settingsUseIPA').checked;
  updatedSettings.useHotkeys = document.getElementById('settingsUseHotkeys').checked;
  updatedSettings.defaultTheme = document.getElementById('settingsDefaultTheme').value;

  if (hasToken()) {
    import('./account/index.js').then(account => {
      const emailField = document.getElementById('accountSettingsEmail');
      let email = removeTags(emailField.value).trim();
      const publicName = document.getElementById('accountSettingsPublicName');
      if (!/.+@.+\..+/.test(email)) {
        email = window.account.email;
        emailField.value = email;
      }
      const updatedAccount = cloneObject(window.account);
      updatedAccount.email = email;
      updatedAccount.publicName = removeTags(publicName.value).trim();
      updatedAccount.allowEmails = document.getElementById('accountSettingsAllowEmails').checked;

      const newPassword = document.getElementById('accountSettingsNewPassword').value;

      if (objectValuesAreDifferent(updatedAccount, window.account)) {
        window.account = Object.assign(window.account, updatedAccount);
        account.editAccount(Object.assign({ newPassword }, window.account));
      } else {
        addMessage('No changes made to Account.');
      }
    });
  }

  if (objectValuesAreDifferent(updatedSettings, window.settings)) {
    window.settings = Object.assign(window.settings, updatedSettings);
    saveSettings();
    toggleHotkeysEnabled();
    toggleIPAPronunciationFields();
  } else {
    addMessage('No changes made to Settings.');
  }
}

export function saveAndCloseSettingsModal() {
  saveSettingsModal();
  document.getElementById('settingsModal').style.display = 'none';
}

export function toggleHotkeysEnabled() {
  disableHotKeys();
  if (window.settings.useHotkeys) {
    enableHotKeys();
  }
}

export function toggleIPAPronunciationFields(render = true) {
  const ipaButtons = document.querySelectorAll('.ipa-field-help-button'),
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
  if (render) {
    renderWords();
  }
}

import { renderMaximizedTextbox, renderInfoModal, renderIPATable, renderIPAHelp } from '../render/modals';
import helpFile from '../../markdown/help.md';
import termsFile from '../../markdown/terms.md';
import privacyFile from '../../markdown/privacy.md';
import { handleSearchClickEvents } from './search';
import { handleSettingsModalClicks } from './settings';

/**
 * Identify selector strings and handlers
 * @param {Function} when Passed from setupListeners, which listens to clicks on document.body
 */
export function handleHeaderButtonClicks(when) {
  handleSearchClickEvents(when);
  handleSettingsModalClicks(when);
  when('#loginCreateAccountButton', () => loadAccountScript('showLoginForm'));
}

// TODO: Set this up correctly
function loadAccountScript(accountScriptMethod) {
  let script = document.getElementById('accountScript');
  if (script) {
    Account[accountScriptMethod]();
  } else {
    script = document.createElement('script');
    document.body.appendChild(script);
    script.onload = () => {
      Account[accountScriptMethod]();
    }
    script.src = './account.js';
  }
}

/**
 * Identify selector strings and handlers
 * @param {Function} when Passed from setupListeners, which listens to clicks on document.body
 */
export function handleIPAButtonClicks(when) {
  when('.ipa-table-button', renderIPATable);
  when('.ipa-field-help-button', renderIPAHelp);
}

/**
 * Identify selector strings and handlers
 * @param {Function} when Passed from setupListeners, which listens to clicks on document.body
 */
export function handleMaximizeButtonClicks(when) {
  when('.maximize-button', renderMaximizedTextbox);
}

export function setupInfoButtons() {
  document.getElementById('helpInfoButton').addEventListener('click', () => {
    renderInfoModal(helpFile);
  });
  document.getElementById('termsInfoButton').addEventListener('click', () => {
    renderInfoModal(termsFile);
  });
  document.getElementById('privacyInfoButton').addEventListener('click', () => {
    renderInfoModal(privacyFile);
  });
}

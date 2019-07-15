import { renderMaximizedTextbox, renderInfoModal, renderIPATable, renderIPAHelp } from '../render/modals';
import helpFile from '../../markdown/help.md';
import termsFile from '../../markdown/terms.md';
import privacyFile from '../../markdown/privacy.md';
import { setupSearchBar } from './search';
import { setupSettingsModal } from './modals';

export function setupHeaderButtons() {
  setupSearchBar();
  setupSettingsModal();

  document.getElementById('loginCreateAccountButton').addEventListener('click', () => {
    import('../account/index.js').then(account => {
      account.showLoginForm();
    });
  });
}

export function setupIPAButtons() {
  const ipaTableButtons = document.getElementsByClassName('ipa-table-button'),
    ipaFieldHelpButtons = document.getElementsByClassName('ipa-field-help-button');

  Array.from(ipaTableButtons).forEach(button => {
    button.removeEventListener('click', renderIPATable);
    button.addEventListener('click', renderIPATable);
  });

  Array.from(ipaFieldHelpButtons).forEach(button => {
    button.removeEventListener('click', renderIPAHelp);
    button.addEventListener('click', renderIPAHelp);
  });
}

export function setupMaximizeButtons() {
  const maximizeButtons = document.getElementsByClassName('maximize-button');
  Array.from(maximizeButtons).forEach(button => {
    button.removeEventListener('click', renderMaximizedTextbox);
    button.addEventListener('click', renderMaximizedTextbox);
  });
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
import { logIn, createAccount } from "./login";
import { setCookie } from "../StackOverflow/cookie";
import { changeDictionary, createNewDictionary } from "./dictionaryManagement";
import { addMessage } from "../utilities";
import { renderForgotPasswordForm } from "./passwordReset";

export function setupLoginModal(modal) {
  const closeElements = modal.querySelectorAll('.modal-background, .close-button');
  Array.from(closeElements).forEach(close => {
    close.addEventListener('click', () => {
      modal.parentElement.removeChild(modal);
    });
  });

  [
    document.getElementById('loginEmail'),
    document.getElementById('loginPassword'),
  ].forEach(field => {
    field.addEventListener('keydown', event => {
      if (['Enter', 'Return'].includes(event.key)) {
        logIn();
      }
    });
  });

  [
    document.getElementById('createNewEmail'),
    document.getElementById('createNewPassword'),
    document.getElementById('createNewConfirm'),
    document.getElementById('createNewPublicName'),
  ].forEach(field => {
    field.addEventListener('keydown', event => {
      if (['Enter', 'Return'].includes(event.key)) {
        createAccount();
      }
    });
  });

  document.getElementById('loginSubmit').addEventListener('click', logIn);
  document.getElementById('forgotPasswordButton').addEventListener('click', renderForgotPasswordForm);
  document.getElementById('createAccountSubmit').addEventListener('click', createAccount);
}

export function setupLogoutButton(logoutButton) {
  logoutButton.addEventListener('click', () => {
    setCookie('token', '', -1);
    window.location.reload();
  });
}

export function setupChangeDictionary() {
  document.getElementById('accountSettingsChangeDictionary').addEventListener('change', changeDictionary);
}

export function setupCreateNewDictionary() {
  document.getElementById('accountSettingsCreateNewDictionary').addEventListener('click', createNewDictionary);
}

export function setupDeletedDictionaryChangeModal() {
  const selectDictionaryToLoad = document.getElementById('selectDictionaryToLoad')
  if (selectDictionaryToLoad) {
    selectDictionaryToLoad.addEventListener('change', changeDictionary);
  }
  document.getElementById('createNewDictionaryAfterDelete').addEventListener('click', createNewDictionary);
}

export function setupMakePublic() {
  document.getElementById('editIsPublic').addEventListener('change', function(event) {
    document.getElementById('publicLinkDisplay').style.display = event.target.checked ? '' : 'none';
  });
  document.getElementById('publicLinkCopy').addEventListener('click', function() {
    document.getElementById('publicLink').select();
    document.execCommand('copy');
    addMessage('Copied public link to clipboard', 3000);
  });
}

import { logIn, createAccount } from "./login";
import { saveEditModal, saveAndCloseEditModal } from "../dictionaryManagement";
import { saveEditModalAndSync, saveAndCloseEditModalAndSync } from "./dictionaryManagement";
import { setCookie } from "../StackOverflow/cookie";

export function setupLoginModal(modal) {
  const closeElements = modal.querySelectorAll('.modal-background, .close-button');
  Array.from(closeElements).forEach(close => {
    close.addEventListener('click', () => {
      modal.parentElement.removeChild(modal);
    });
  });

  document.getElementById('loginSubmit').addEventListener('click', logIn);
  document.getElementById('createAccountSubmit').addEventListener('click', createAccount);
}

export function setupLogoutButton(logoutButton) {
  logoutButton.addEventListener('click', () => {
    setCookie('token', '', -1);
    window.location.reload();
  });
}

export function setupEditFormButtonOverrides() {
  document.getElementById('editSave').removeEventListener('click', saveEditModal);
  document.getElementById('editSave').addEventListener('click', saveEditModalAndSync);
  document.getElementById('editSaveAndClose').removeEventListener('click', saveAndCloseEditModal);
  document.getElementById('editSaveAndClose').addEventListener('click', saveAndCloseEditModalAndSync);

  // document.getElementById('importDictionaryFile').addEventListener('change', importDictionary);
  // document.getElementById('importWordsCSV').addEventListener('change', importWords);
  // document.getElementById('exportDictionaryButton').addEventListener('click', exportDictionary);
  // document.getElementById('exportWordsButton').addEventListener('click', exportWords);
  // document.getElementById('deleteDictionaryButton').addEventListener('click', confirmDeleteDictionary);

  // setupMaximizeButtons();
}

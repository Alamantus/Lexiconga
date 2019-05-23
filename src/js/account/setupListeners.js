import { logIn, createAccount } from "./login";
import { setCookie } from "../StackOverflow/cookie";
import { changeDictionary } from "./dictionaryManagement";

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

export function setupChangeDictionary() {
  document.getElementById('accountSettingsChangeDictionary').addEventListener('change', changeDictionary);
}

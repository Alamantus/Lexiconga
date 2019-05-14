import { logIn, createAccount } from "./login";

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
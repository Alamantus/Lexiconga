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

export function setupLogoutButton(logoutButton) {
  logoutButton.addEventListener('click', () => {
    const expire = new Date("November 1, 2015"),
      path = window.location.pathname;
    document.cookie = 'token=;expires=' + expire.toGMTString() + ';domain=' + document.domain + ';path=' + path; // + in front of `new Date` converts to a number
    window.location.reload();
  });
}
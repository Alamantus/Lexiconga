import { request } from "./helpers";

export function logIn() {
  const email = document.getElementById('loginEmail').value.trim(),
    password = document.getElementById('loginPassword').value.trim();
  const loginErrorMessages = document.getElementById('loginErrorMessages');
  let errorHTML = '';
  
  if (email === '') {
    errorHTML += '<p class="bold red">Please enter your email address.</p>';
  }
  if (password === '') {
    errorHTML += '<p class="bold red">Please enter your password.</p>';
  }

  loginErrorMessages.innerHTML = errorHTML;

  if (errorHTML !== '') {
    request({
      action: 'login',
      email,
      password,
    });
  }
}
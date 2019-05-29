import { request } from "./helpers";
import { saveToken } from "./utilities";
import { addMessage } from "../utilities";
import { setupLogoutButton } from "./setupListeners";
import { renderAccountSettings, renderAccountActions, renderMakePublic } from "./render";
import { uploadWholeDictionary, syncDictionary } from "./sync";
import { setCookie } from "../StackOverflow/cookie";

export function logIn() {
  const email = document.getElementById('loginEmail').value.trim(),
    password = document.getElementById('loginPassword').value;
  const loginErrorMessages = document.getElementById('loginErrorMessages');
  let errorHTML = '';
  
  if (email === '') {
    errorHTML += '<p class="bold red">Please enter your email address.</p>';
  }
  if (password === '') {
    errorHTML += '<p class="bold red">Please enter your password.</p>';
  }

  loginErrorMessages.innerHTML = errorHTML;

  if (errorHTML === '') {
    request({
      action: 'login',
      email,
      password,
    }, successData => {
      saveToken(successData.token);
      window.account = successData.user;
    }, errorData => {
      errorHTML += '<p class="bold red">' + errorData + '</p>';
    }).then(() => {
      loginErrorMessages.innerHTML = errorHTML;
      if (errorHTML === '') {
        const loginModal = document.getElementById('loginModal');
        loginModal.parentElement.removeChild(loginModal);
        triggerLoginChanges();
        addMessage(`Welcome${window.account.publicName !== '' ? ', ' + window.account.publicName : ''}! You are logged in.`, 0);
        syncDictionary();
      }
    }).catch(err => console.error(err));
  }
}

export function createAccount() {
  const email = document.getElementById('createNewEmail').value.trim(),
    password = document.getElementById('createNewPassword').value,
    confirm = document.getElementById('createNewConfirm').value.trim(),
    publicName = document.getElementById('createNewPublicName').value.trim(),
    allowEmail = document.getElementById('createNewAllowEmails').checked;
  const createAccountErrorMessages = document.getElementById('createAccountErrorMessages');
  let errorHTML = '';

  if (email === '') {
    errorHTML += '<p class="bold red">Please enter an email address.</p>';
  } else if (!/.+@.+\..+/.test(email)) {
    errorHTML += '<p class="bold red">Please double-check your email address.</p>';
  }
  if (password === '') {
    errorHTML += '<p class="bold red">Please enter a password.</p>';
  } else if (confirm !== password) {
    errorHTML += '<p class="bold red">The password you entered to confirm did not match the password you entered.</p>';
  }
  
  createAccountErrorMessages.innerHTML = errorHTML;
  if (errorHTML === '') {
    request({
      action: 'check-email',
      email,
    }, emailExists => {
      if (emailExists) {
        errorHTML += '<p class="bold red">The email address you entered already exists.</p>';
      }
    }, errorData => {
      console.error(errorData);
      errorHTML += `<p class="bold red">${errorData}</p>`;
    }).then(() => {
      createAccountErrorMessages.innerHTML = errorHTML;
      if (errorHTML === '') {
        console.log('creating account');
        request({
          action: 'create-account',
          email,
          password,
          userData: {
            publicName,
            allowEmail,
          },
        }, responseData => {
          saveToken(responseData.token);
          window.account = responseData.user;
          if (responseData.hasOwnProperty('dictionary')) {
            uploadWholeDictionary(); // Saves external id
          }
          return responseData;
        }, errorData => {
          errorHTML += `<p class="bold red">${errorData}</p>`;        
          return errorData;
        }).then(responseData => {
          console.log(responseData);
          createAccountErrorMessages.innerHTML = errorHTML;
          if (errorHTML === '') {
            const loginModal = document.getElementById('loginModal');
            loginModal.parentElement.removeChild(loginModal);
            triggerLoginChanges();
            addMessage('Account Created Successfully!');
            addMessage(`Welcome${publicName !== '' ? ', ' + publicName : ''}! You are logged in.`, 0);
            if (window.currentDictionary.hasOwnProperty('externalID')) {
              // Ensure dictionary uploads to overwrite the auto-created default dictionary
              delete window.currentDictionary.externalID;
            }
            syncDictionary(false);
          }
        });
      }
    }).catch(err => console.error(err));
  }
}

export function validateToken() {
  request({
    action: 'validate-token',
  }, userData => {
    window.account = userData;
    triggerLoginChanges();
    addMessage(`Welcome${window.account.publicName !== '' ? ', ' + window.account.publicName : ''}! You are logged in.`, 0);
    syncDictionary();
  }, error => {
    addMessage(error + '. Logging Out.', undefined, 'error');
    setCookie('token', '', -1);
  });
}

export function triggerLoginChanges() {
  const loginButton = document.getElementById('loginCreateAccountButton');
  const logoutButton = document.createElement('a');
  logoutButton.classList.add('button');
  logoutButton.id = 'logoutButton';
  logoutButton.innerHTML = 'Log Out';
  loginButton.parentElement.appendChild(logoutButton);
  loginButton.parentElement.removeChild(loginButton);
  setupLogoutButton(logoutButton);

  renderMakePublic();
  renderAccountSettings();
  renderAccountActions();
}

export function updateAccountData(userData) {
  request({
    action: 'set-user-data',
    userData,
  }, successData => {
    document.getElementById('accountSettingsNewPassword').value = '';
    addMessage('Successfully Updated Account Data');
  }, error => {
    addMessage(error, undefined, 'error');
  });
}

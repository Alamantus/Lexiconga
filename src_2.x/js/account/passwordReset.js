import { request } from "./helpers";

export function renderForgotPasswordForm() {
  const modal = document.createElement('section');
  modal.classList.add('modal');
  modal.innerHTML = `<div class="modal-background"></div>
  <div class="modal-content">
    <a class="close-button">&times;&#xFE0E;</a>
    <section class="info-modal" id="forgotPasswordForm">
      <h2>Forgot Password</h2>
      <p>Enter the email address associated with your Lexiconga account to initiate a password reset.</p>
      <label>Email<br>
        <input type="email" id="forgotPasswordEmailField" style="max-width:250px;" maxlength="100">
      </label>
      <section id="forgotPasswordErrorMessages"></section>
      <button class="button" id="forgotPasswordSubmit">Email Password Reset Key</button>
    </section>
  </div>`;

  document.body.appendChild(modal);

  setupStartResetForm();
  setupInfoModal(modal);
}

function setupInfoModal(modal) {
  const closeElements = modal.querySelectorAll('.modal-background, .close-button');
  Array.from(closeElements).forEach(close => {
    close.addEventListener('click', () => {
      modal.parentElement.removeChild(modal);
    });
  });
}

function setupStartResetForm() {
  document.getElementById('forgotPasswordSubmit').addEventListener('click', startPasswordReset);
}

function startPasswordReset() {
  const email = document.getElementById('forgotPasswordEmailField').value.trim();
  const errorMessageElement = document.getElementById('forgotPasswordErrorMessages');
  let errorMessage = '';
  
  if (email === '') {
    errorMessage += '<p class="red bold">Please enter an email address.</p>';
  }

  errorMessageElement.innerHTML = errorMessage;

  if (errorMessage === '') {
    request({
      action: 'initiate-password-reset',
      email,
    }, success => {
      console.log(success);
    }, error => {
      errorMessage += '<p class="red bold">' + error + '</p>';
    }).then(() => {
      errorMessageElement.innerHTML = errorMessage;
      if (errorMessage === '') {
        document.getElementById('forgotPasswordForm').innerHTML = `<h2>Password Reset Key Sent</h2>
        <p>Go check your email for the password reset link.</p>
        <p><em>Note that it may be sent to your spam/junk folder by mistake.</em></p>`;
      }
    });
  }
}

function setupPasswordResetForm() {
  const submitButton = document.getElementById('newPasswordSubmit');
  if (submitButton) {
    submitButton.addEventListener('click', submitPasswordReset);
  }
}

function submitPasswordReset() {
  const password = document.getElementById('newPassword').value;
  const confirm = document.getElementById('newConfirm').value;
  const account = document.getElementById('account').value;
  const errorMessageElement = document.getElementById('newPasswordErrorMessages');
  let errorMessage = '';
  
  if (password === '') {
    errorMessage += '<p class="red bold">Please enter a password.</p>';
  } else if (password !== confirm) {
    errorMessage += '<p class="red bold">The passwords do not match.</p>';
  }

  errorMessageElement.innerHTML = errorMessage;

  if (errorMessage === '') {
    request({
      action: 'password-reset',
      account,
      password,
    }, success => {
      console.log(success);
    }, error => {
      errorMessage += '<p class="red bold">' + error + '</p>';
    }).then(() => {
      errorMessageElement.innerHTML = errorMessage;
      if (errorMessage === '') {
        document.getElementById('detailsPanel').innerHTML = `<h3>Your password has been reset</h3>
        <p>You can now <a href="/">Return to Lexiconga</a> and log in using your new password.</p>`;
      }
    });
  }
}

window.onload = (function (oldLoad) {
  oldLoad && oldLoad();
  setTimeout(setupPasswordResetForm, 1000);
})(window.onload);
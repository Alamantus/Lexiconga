import { setupLoginModal } from "./setupListeners";

export function renderLoginForm() {
  const loginModal = document.createElement('section');
  loginModal.classList.add('modal');
  loginModal.id = 'loginModal';
  loginModal.innerHTML = `<div class="modal-background"></div>
  <div class="modal-content"><a class="close-button">&times;&#xFE0E;</a>
    <section>
      <div class="split two">
        <div>
          <h2>Log In</h2>
          <label>Email<br>
            <input type="email" required id="loginEmail" maxlength="100">
          </label>
          <label>Password<br>
            <input type="password" required id="loginPassword" maxlength="100">
          </label>
          <section id="loginErrorMessages"></section>
          <a id="loginSubmit" class="button">Log In</a><br>
          <a id="forgotPasswordButton" class="small button">Forgot Password?</a>
        </div>
        <div>
          <h2>Create a New Account</h2>
          <p>Creating an account allows you to save and switch between as many dictionaries as you need and access them from any device for free! If you have a dictionary you've been working on loaded already, it will automatically be uploaded to your account when you log in for the first time.</p>
          <p>Plus if you allow us to send you emails, we'll make sure that you're the first to hear about any new features that get added or if any of our policies change for any reason. We'll never spam you or sell your information.</p>
          <p>By creating an account, you are indicating that you agree to the Terms of Service and that you understand Lexiconga's Privacy Policy.</p>
          <label>Email<br>
            <input type="email" id="createNewEmail" maxlength="100">
          </label>
          <label>Password<br>
            <input type="password" id="createNewPassword" maxlength="100">
          </label>
          <label>Confirm Password<br>
            <input type="password" id="createNewConfirm" maxlength="100">
          </label>
          <label>Public Name<br>
            <input type="text" id="createNewPublicName" maxlength="50">
          </label>
          <label>Allow Emails
            <input type="checkbox" id="createNewAllowEmails">
          </label>
          <section id="createAccountErrorMessages"></section>
          <a id="createAccountSubmit" class="button">Create Account</a>
        </div>
      </div>
    </section>
  </div>`;

  document.body.appendChild(loginModal);

  setupLoginModal(loginModal);
}
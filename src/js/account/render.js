import { setupLoginModal, setupChangeDictionary } from "./setupListeners";
import { request } from "./helpers";

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

export function renderAccountSettings() {
  const accountSettingsColumn = document.getElementById('accountSettings');
  const accountSettingsHTML = `<h3>Account Settings</h3>
  <label>Email Address<br><input id="accountSettingsEmail" required maxlength="100" value="${window.account.email}"></label>
  <label>Public Name<br><input id="accountSettingsPublicName" placeholder="Someone" maxlength="50" value="${window.account.publicName}"></label>
  <label>Allow Emails <input type="checkbox" id="accountSettingsAllowEmails"${window.account.allowEmails ? ' checked' : ''}></label>`;
  accountSettingsColumn.innerHTML = accountSettingsHTML;
}

export function renderAccountActions() {
  const accountActionsColumn = document.getElementById('accountActions');
  const accountActionsHTML = `<h3>Account Actions</h3>
  <label>Change Dictionary<br><select id="accountSettingsChangeDictionary"></select></label>
  <h4>Request Your Data</h4>
  <p>
    Per your <a href="https://www.eugdpr.org/" target="_blank">GDPR</a> rights in Articles 13–15 and 20, we allow you to request any and all data we have stored about you. The only data we have about you personally is your email address and your Public Name, if you decided to set one. All other data (your Dictionary data) is visible and accessible via the Export button under your Dictionary's Settings. Send an email to help@lexicon.ga to request your information.
  </p>

  <h4>Delete Your Account</h4>
  <p>
    Per your <a href="https://www.eugdpr.org/" target="_blank">GDPR</a> rights in Articles 17, if you wish for your account to be deleted, please contact us at help@lexicon.ga, and we will delete your account and all associated dictionaries and words as quickly as possible. Note that you can delete dictionaries yourself via your Dictionary's Settings.
  </p>
  <p>
    Anything that is deleted from our system is permanently and irretrievably removed from our system and cannot be restored, though search engines or internet archives may retain a cached version of your content (there is nothing we can do about this, and you will need to seek out removal of that information by directly contacting the services that are caching your data).
  </p>
  `;
  accountActionsColumn.innerHTML = accountActionsHTML;

  renderChangeDictionaryOptions();
}

export function renderChangeDictionaryOptions() {
  request({
    action: 'get-all-dictionary-names',
  }, dictionaries => {
    const changeDictionarySelect = document.getElementById('accountSettingsChangeDictionary');
    const optionsHTML = dictionaries.map(dictionary => `<option value="${dictionary.id}">${dictionary.name}</option>`).join('');
    changeDictionarySelect.innerHTML = optionsHTML;
    changeDictionarySelect.value = window.currentDictionary.externalID;
    setupChangeDictionary();
  }, error => console.error(error));
}
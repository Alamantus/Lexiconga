import Inferno from 'inferno';
import { Component } from 'inferno';
import PropTypes from 'prop-types';
import marked from 'marked';
import store from 'store';

import { Modal } from '../../structure/Modal';
import { SearchBox } from '../../management/SearchBox';

import { request } from '../../../Helpers';

export class LoginForm extends Component {
  constructor (props) {
    super(props);

    PropTypes.checkPropTypes({
      logIn: PropTypes.func.isRequired,
      signUp: PropTypes.func.isRequired,
    }, props, 'prop', 'LoginForm');

    this.state = {
      visibleTab: 'login',
      loginEmail: '',
      loginPassword: '',
      loginEmailError: '',
      loginPasswordError: '',
      loginFormIsValid: true,
      signupEmail: '',
      signupUsername: '',
      signupPublicName: '',
      signupPassword: '',
      signupConfirm: '',
      signupAllowEmail: true,
      signupEmailError: '',
      signupUsernameError: '',
      signupPasswordError: '',
      signupConfirmError: '',
      signupEmailChecking: false,
      signupUsernameChecking: false,
      signupEmailIsUnique: true,
      signupUsernameIsUnique: true,
      signupFormIsValid: true,
    };
  }

  get loginFormIsValid () {
    const {
      loginEmailError,
      loginPasswordError,
    } = this.state;
    return loginEmailError === '' && loginPasswordError === '';
  }

  get signupFormIsValid () {
    const {
      signupEmailError,
      signupEmailChecking,
      signupEmailIsUnique,
      signupUsernameError,
      signupUsernameChecking,
      signupUsernameIsUnique,
      signupPasswordError,
      signupConfirmError,
    } = this.state;
    return !signupEmailChecking && !signupUsernameChecking
      && signupEmailIsUnique && signupUsernameIsUnique
      && signupEmailError === '' && signupUsernameError === ''
      && signupPasswordError === '' && signupConfirmError === '';
  }

  changeTab (tab) {
    this.setState({ visibleTab: tab });
  }

  updateField (field, event) {
    const {value, checked} = event.target;
    const fieldUpdate = {};
    const fieldErrors = this.validateField(field, value);
    fieldUpdate[field] = (field === 'signupAllowEmail') ? checked : value;
    this.setState(Object.assign(fieldUpdate, fieldErrors));
  }

  validateField (field, value) {
    const fieldErrors = {};
    const errorFieldName = `${field}Error`;
    let isValid = true;
    const requiredFields = ['loginEmail', 'loginPassword', 'signupEmail', 'signupPassword', 'signupConfirm'];
    if (requiredFields.includes(field)) {
      if (value === '') {
        isValid = false;
        fieldErrors[errorFieldName] = 'This field must not be blank';
      } else if (field === 'signupEmail' && !/.+@.+/g.test(value)) {
        isValid = false;
        fieldErrors[errorFieldName] = 'The email address you entered looks wrong';
      } else if (field === 'signupPassword' && value.length < 6) {
        isValid = false;
        fieldErrors[errorFieldName] = 'Please make your password at least 6 characters long';
      } else if (field === 'signupConfirm' && value !== this.state.signupPassword) {
        isValid = false;
        fieldErrors[errorFieldName] = 'Your passwords must match';
      }
    }

    if (field === 'signupUsername') {
      if (value !== '' && /[^a-zA-Z0-9]+/g.test(value)) {
        isValid = false;
        fieldErrors[errorFieldName] = 'Please use only letters and numbers';
      }
    }

    if (isValid) {
      fieldErrors[errorFieldName] = '';
    }
    return fieldErrors;
  }

  validateSignupForm (callback) {
    const fields = ['signupEmail', 'signupUsername', 'signupPassword', 'signupConfirm'];
    let errors = {};
    fields.forEach(field => {
      const fieldErrors = this.validateField(field, this.state[field]);
      errors = Object.assign(errors, fieldErrors);
    });
    errors.signupFormIsValid = !signupEmailChecking && !signupUsernameChecking
      && signupEmailIsUnique && signupUsernameIsUnique
      && Object.keys(errors).every(field => errors[field] === '');
    this.setState(errors, callback);
  }

  validateLoginForm (callback) {
    const fields = ['loginEmail','loginPassword'];
    let errors = {};
    fields.forEach(field => {
      errors = Object.assign(errors, this.validateField(field, this.state[field]));
    });
    errors.loginFormIsValid = Object.keys(errors).every(field => {
      return errors[field] === '';
    });
    this.setState(errors, callback);
  }

  checkFieldUnique (field, event) {
    const {value} = event.target;
    const fieldUpdate = {};
    const errorFieldName = `${field}Error`;
    if (field === 'signupEmail') {
      this.setState({ signupEmailChecking: true }, () => {
        request('check-email', { email: value }, (response) => {
          const { data, error } = response;
          fieldUpdate['signupEmailChecking'] = false;
          if (error) {
            console.error(data);
          } else {
            fieldUpdate['signupEmailIsUnique'] = !data;
          }
        }).then(() => {
          this.setState(fieldUpdate);
        });
      });
    } else if (field === 'signupUsername') {
      this.setState({ signupUsernameChecking: true }, () => {
        request('check-username', { username: value }, (response) => {
          const { data, error } = response;
          fieldUpdate['signupUsernameChecking'] = false;
          if (error) {
            console.error(data);
          } else {
            fieldUpdate['signupUsernameIsUnique'] = !data;
          }
        }).then(() => {
          this.setState(fieldUpdate);
        });
      });
    }
  }

  logIn () {
    this.validateLoginForm(() => {
      if (this.loginFormIsValid) {
        const { loginEmail, loginPassword } = this.state;
        this.props.logIn(loginEmail, loginPassword);
      }
    });
  }

  createAccount () {
    this.validateSignupForm(() => {
      if (this.signupFormIsValid) {
        const {
          signupEmail,
          signupUsername,
          signupPublicName,
          signupPassword,
          signupAllowEmail
        } = this.state;
        this.props.signUp(signupEmail, signupPassword, {
          username: signupUsername,
          publicName: signupPublicName,
          allowEmail: signupAllowEmail,
        });
      }
    });
  }

  render () {
    return (
      <div className='columns'>
        <div className='column'>
          <div className='tabs is-boxed'>
            <ul>
              <li className={this.state.visibleTab === 'login' ? 'is-active' : null}>
                <a onClick={() => this.changeTab('login')}>
                  Log In
                </a>
              </li>
              <li className={this.state.visibleTab === 'signup' ? 'is-active' : null}>
                <a onClick={() => this.changeTab('signup')}>
                  Sign Up
                </a>
              </li>
            </ul>
          </div>
          {this.state.visibleTab === 'login'
            ? (
              <div className="has-text-left">
                <h3 className='title is-3'>
                  Log In
                </h3>
                <div className='field'>
                  <label className='label'>
                    Email/Username
                  </label>
                  <div className='control'>
                    <input className={`input ${this.state.loginEmailError !== '' && 'is-danger'}`}
                      type='email' onInput={(event) => this.updateField('loginEmail', event)} />
                    {
                      this.state.loginEmailError !== ''
                        ? (
                          <div className='help is-danger'>
                            {this.state.loginEmailError}
                          </div>
                        ) : null
                    }
                  </div>
                </div>
                <div className='field'>
                  <label className='label'>
                    Password
                  </label>
                  <div className='control'>
                    <input className={`input ${this.state.loginPasswordError !== '' && 'is-danger'}`}
                      type='password' onInput={(event) => this.updateField('loginPassword', event)}
                      onChange={this.validateLoginForm.bind(this)} />
                    {
                      this.state.loginPasswordError !== ''
                        ? (
                          <div className='help is-danger'>
                            {this.state.loginPasswordError}
                          </div>
                        ) : null
                    }
                  </div>
                </div>
                <div className='field'>
                  <a className='button is-success'
                    onClick={this.logIn.bind(this)}>
                    Log In
                  </a>
                </div>
              </div>
            ) : (
              <div className="has-text-left">
                <h3 className='title is-3'>
                  Create a New Account
                </h3>
                <div className='columns'>
                  <div className='column'>
                    <div className='content'>
                      <p>
                        Creating an account allows you to save and switch between as many dictionaries as you need
                        and access them from any device for free! If you have a dictionary you've been working on
                        loaded already, it will automatically be uploaded to your account when you log in for the
                        first time.
                      </p>
                      <p>
                        Plus if you allow us to send you emails, we'll make sure that you're the first to hear
                        about any new features that get added or if any of our policies change for any reason.
                        We'll never spam you or sell your information.
                      </p>
                      <p>
                        By creating an account, you are indicating that you agree to the <a>Terms of Service</a> and
                        that you understand Lexiconga's <a>Privacy Policy</a>.
                      </p>
                    </div>
                  </div>
                  <div className='column'>
                    <div className='field'>
                      <label className='label'>
                        Email Address<sup>*</sup>
                      </label>
                      <div className={`control ${this.state.signupEmailChecking && 'is-loading'}`}>
                        <input className={`input ${(this.state.signupEmailError !== '' || !this.state.signupEmailIsUnique) && 'is-danger'}`}
                          type='email' value={this.state.signupEmail}
                          onInput={(event) => this.updateField('signupEmail', event)}
                          onBlur={(event) => this.checkFieldUnique('signupEmail', event)} />
                        {
                          (this.state.signupEmailError !== '' || !this.state.signupEmailIsUnique)
                          ? (
                            <div className='help is-danger'>
                              {!this.state.signupEmailIsUnique && <p>This email address is already in use</p>}
                              {this.state.signupEmailError}
                            </div>
                          ) : null
                        }
                      </div>
                    </div>
                    <div className='field'>
                      <label className='label'>
                        Username
                      </label>
                      <div className='help'>
                        This is your unique identifier that appears in the URL if you ever decide to share your dictionaries publicly.
                      </div>
                      <div className={`control ${this.state.signupUsernameChecking && 'is-loading'}`}>
                        <input className={`input ${!this.state.signupUsernameIsUnique && 'is-danger'}`}
                          type='text' value={this.state.signupUsername}
                          onInput={(event) => this.updateField('signupUsername', event)}
                          onBlur={(event) => this.checkFieldUnique('signupUsername', event)} />
                        {
                          (this.state.signupUsernameError !== '' || !this.state.signupUsernameIsUnique)
                            ? (
                              <div className='help is-danger'>
                                {!this.state.signupUsernameIsUnique && <p>This username address is already in use</p>}
                                {this.state.signupUsernameError}
                              </div>
                            ) : null
                        }
                      </div>
                    </div>
                    <div className='field'>
                      <label className='label'>
                        Public Name
                      </label>
                      <div className='help'>
                        This is the name we greet you with and what we display if you ever decide to share your dictionaries publicly.
                      </div>
                      <div className='control'>
                        <input className='input'
                          type='text' value={this.state.signupPublicName}
                          onInput={(event) => this.updateField('signupPublicName', event)} />
                      </div>
                    </div>
                    <div className='field'>
                      <label className='label'>
                        Password<sup>*</sup>
                      </label>
                      <div className='control'>
                        <input className={`input ${this.state.signupPasswordError !== '' && 'is-danger'}`}
                          type='password' value={this.state.signupPassword}
                          onInput={(event) => this.updateField('signupPassword', event)} />
                        {
                          this.state.signupPasswordError !== ''
                            ? (
                              <div className='help is-danger'>
                                {this.state.signupPasswordError}
                              </div>
                            ) : null
                        }
                      </div>
                    </div>
                    <div className='field'>
                      <label className='label'>
                        Confirm Password<sup>*</sup>
                      </label>
                      <div className='control'>
                        <input className={`input ${this.state.signupConfirmError !== '' && 'is-danger'}`}
                          type='password' value={this.state.signupConfirm}
                          onInput={(event) => this.updateField('signupConfirm', event)} />
                        {
                          this.state.signupConfirmError !== ''
                            ? (
                              <div className='help is-danger'>
                                {this.state.signupConfirmError}
                              </div>
                            ) : null
                        }
                      </div>
                    </div>
                    <div className='field'>
                      <div className='control'>
                        <input className='is-checkradio' id='signupAllowEmail' type='checkbox'
                          checked={this.state.signupAllowEmail}
                          onClick={(event) => this.updateField('signupAllowEmail', event)} />
                        <label htmlFor='signupAllowEmail'>
                          Allow Emails
                        </label>
                        <div className='help'>
                          We only send occasional emails about updates to Lexiconga
                        </div>
                      </div>
                    </div>
                    <div className='field'>
                      <div className='control'>
                        <a className='button is-success'
                          onClick={this.createAccount.bind(this)}>
                          Create Account
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          }
        </div>
      </div>
    );
  }
}

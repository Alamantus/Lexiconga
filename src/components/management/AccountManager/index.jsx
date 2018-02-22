import Inferno from 'inferno';
import { Component } from 'inferno';
import PropTypes from 'prop-types';
import marked from 'marked';
import store from 'store';

import { Modal } from '../../structure/Modal';
import { LoginForm } from './LoginForm';

import { request } from '../../../Helpers';

export class AccountManager extends Component {
  constructor (props) {
    super(props);

    PropTypes.checkPropTypes({
      updater: PropTypes.object.isRequired,
    }, props, 'prop', 'AccountManager');

    this.state = {
      isLoggedIn: false,
    };
  }

  logIn (email, password) {
    return request('login', { email, password }, this.handleResponse.bind(this));
  }

  logOut () {
    store.remove('LexicongaToken');
    this.setState({ isLoggedIn: false });
  }

  signUp (email, password, userData) {
    request('create-account', {
      email,
      password,
      userData,
    }, this.handleResponse.bind(this));
  }

  handleResponse (response) {
    const { data, error } = response;
    if (error) {
      console.error(data);
    } else {
      store.set('LexicongaToken', data);
      this.setState({ isLoggedIn: true }, () => {
        this.props.updater.sync();
      });
    }
  }

  render () {
    const token = store.get('LexicongaToken');
    
    if (token) {
      return (
        <div>
          <Modal buttonText='Account' title='My Account'>
            <div className='content has-text-left'>
              <p>Hello My Account!</p>
            </div>
          </Modal>
          <a className='button' onClick={this.logOut.bind(this)}>
            Log Out
          </a>
        </div>
      );
    }
    return (
      <Modal buttonText='Log In/Sign Up' title='Log In/Sign Up'>
        <LoginForm logIn={this.logIn.bind(this)} signUp={this.signUp.bind(this)} />
      </Modal>
    );
  }
}

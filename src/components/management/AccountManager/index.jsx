import Inferno from 'inferno';
import { Component } from 'inferno';
import PropTypes from 'prop-types';
import marked from 'marked';
import store from 'store';

import { Modal } from '../../structure/Modal';
import { LoginForm } from './LoginForm';
import { MyAccount } from './MyAccount';

import { request } from '../../../Helpers';

const defaultUserData = {
  email: '',
  username: '',
  publicName: '',
  allowEmails: true,
  useIPAPronunciation: true,
};

export class AccountManager extends Component {
  constructor (props) {
    super(props);

    PropTypes.checkPropTypes({
      updater: PropTypes.object.isRequired,
    }, props, 'prop', 'AccountManager');

    const userData = store.get('LexicongaUserData');
    
    this.state = {
      isLoggedIn: false,
      userData: {
        email: userData ? userData.email : defaultUserData.email,
        username: userData ? userData.username : defaultUserData.username,
        publicName: userData ? userData.publicName : defaultUserData.publicName,
        allowEmails: userData ? userData.allowEmails : defaultUserData.allowEmails,
        useIPAPronunciation: userData ? userData.useIPAPronunciation : defaultUserData.useIPAPronunciation,
      },
      userDictionaries: [],
    };

    this.getDictionaryNames();
  }

  logIn (email, password) {
    return request('login', { email, password }, this.handleResponse.bind(this));
  }

  logOut () {
    store.remove('LexicongaToken');
    store.remove('LexicongaUserData');
    this.setState({
      isLoggedIn: false,
      userData: Object.assign({}, defaultUserData),
      userDictionaries: [],
    });
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
      store.set('LexicongaToken', data.token);
      store.set('LexicongaUserData', data.user);
      this.setState({
        isLoggedIn: true,
        userData: data.user,
      }, () => {
        this.getDictionaryNames();
        this.props.updater.sync();
      });
    }
  }

  updateUserData (newUserData) {
    const token = store.get('LexicongaToken');

    if (token) {
      store.set('LexicongaUserData', newUserData);
      this.setState({ userData: newUserData }, () => {
        request('set-user-data', { token, userData: newUserData }, (response) => {
          const {data, error} = response;
          if (error) {
            console.error(data);
          } else {
            console.log(data);
          }
        })
      });
    }
  }

  getDictionaryNames () {
    const token = store.get('LexicongaToken');

    if (token) {
      return request('get-all-dictionary-names', { token }, (response) => {
        const {data, error} = response;
        if (error) {
          console.error(data);
        } else {
          this.setState({ userDictionaries: data });
        }
      });
    }
  }

  render () {
    const token = store.get('LexicongaToken');
    
    if (token) {
      const { userData } = this.state;

      return (
        <div>
          <Modal buttonText='Account' title='My Account' onShow={ this.getDictionaryNames.bind(this) }>
            <MyAccount
              email={ userData.email }
              username={ userData.username }
              publicName={ userData.publicName }
              allowEmails={ userData.allowEmails }
              useIPAPronunciation={ userData.useIPAPronunciation }
              userDictionaries={ this.state.userDictionaries }
              updateUserData={ this.updateUserData.bind(this) }
              changeDictionary={ () => {} } />
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

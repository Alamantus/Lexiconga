import Inferno from 'inferno';
import { Component } from 'inferno';
import PropTypes from 'prop-types';
import marked from 'marked';
import store from 'store';
import swal from 'sweetalert2';

import { Modal } from '../../structure/Modal';
import { LoginForm } from './LoginForm';
import { MyAccount } from './MyAccount';

import { DEFAULT_USER_DATA } from '../../../Constants';
import { request } from '../../../Helpers';

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
        email: userData && userData.hasOwnProperty('email') ? userData.email : DEFAULT_USER_DATA.email,
        publicName: userData && userData.hasOwnProperty('publicName') ? userData.publicName : DEFAULT_USER_DATA.publicName,
        allowEmails: userData && userData.hasOwnProperty('allowEmails') ? userData.allowEmails : DEFAULT_USER_DATA.allowEmails,
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
      userData: Object.assign({}, DEFAULT_USER_DATA),
      userDictionaries: [],
    }, () => {
      swal({
        title: 'Logged Out',
        text: 'You have been logged out. Your work will not be synced to your account until you log in again.',
        type: 'success',
        confirmButtonClass: 'button',
        buttonsStyling: false,
      });
    });
  }

  signUp (email, password, userData) {
    request('create-account', {
      email,
      password,
      userData,
    }, this.handleResponse.bind(this));
  }

  updateUserData (token, userData, callback = () => {}) {
    store.set('LexicongaToken', token);
    store.set('LexicongaUserData', userData);
    this.setState({
      isLoggedIn: true,
      userData,
    }, () => {
      callback();
    });
  }

  handleResponse (response) {
    const { data, error } = response;
    if (error) {
      console.error(data);
    } else {
      this.updateUserData(data.token, data.user, () => {
        this.getDictionaryNames();
        this.props.updater.sync();
      });
    }
  }

  sendUserData (newUserData, callback = () => {}) {
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
            this.updateUserData(data.token, data.userData, callback);
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
              // username={ userData.username }
              publicName={ userData.publicName }
              allowEmails={ userData.allowEmails }
              userDictionaries={ this.state.userDictionaries }
              sendUserData={ this.sendUserData.bind(this) }
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

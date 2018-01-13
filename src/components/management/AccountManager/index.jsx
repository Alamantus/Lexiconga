import Inferno from 'inferno';
import Component from 'inferno-component';
import PropTypes from 'prop-types';
import marked from 'marked';
import store from 'store';

import { Modal } from '../../structure/Modal';
import { LoginForm } from './LoginForm';

import helpMarkdown from '../../../assets/text/help.md';

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
    const request = new Request('./api/', {
      method: 'POST',
      mode: 'cors',
      redirect: 'follow',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        action: 'login',
        email,
        password,
      }),
    });
    return fetch(request).then(response => response.json()).then(responseJSON => {
      const {data, error} = responseJSON;
      if (error) {
        console.error(data);
      } else {
        store.set('LexicongaToken', data);
        this.setState({ isLoggedIn: true }, () => {
          this.props.updater.sync();
        });
      }
    });
  }

  logOut () {
    store.remove('LexicongaToken');
    this.setState({ isLoggedIn: false });
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
        <LoginForm logIn={this.logIn.bind(this)} signUp={() => {}} />
      </Modal>
    );
  }
}

import Inferno from 'inferno';
import { Component } from 'inferno';
import PropTypes from 'prop-types';

export class LoginForm extends Component {
  constructor(props) {
    super(props);

    PropTypes.checkPropTypes({
      email: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
      publicName: PropTypes.string.isRequired,
      allowEmails: PropTypes.bool.isRequired,
      useIPAPronunciation: PropTypes.bool.isRequired,
      userDictionaries: PropTypes.array.isRequired,
      updateUserData: PropTypes.func,
      changeDictionary: PropTypes.func,
    }, props, 'prop', 'LoginForm');

    this.state = {
      email: this.props.email,
      username: this.props.username,
      publicName: this.props.publicName,
      allowEmails: this.props.allowEmails,
      useIPAPronunciation: this.props.useIPAPronunciation,
      userDictionaries: this.props.userDictionaries,
    };
  }
  
  render() {
    return (
      <div className='content has-text-left'>
        <p>Hello My Account!</p>
      </div>
    );
  }
}
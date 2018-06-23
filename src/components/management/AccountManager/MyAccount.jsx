import Inferno from 'inferno';
import { Component } from 'inferno';
import PropTypes from 'prop-types';

export class MyAccount extends Component {
  constructor(props) {
    super(props);

    PropTypes.checkPropTypes({
      email: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
      publicName: PropTypes.string.isRequired,
      allowEmails: PropTypes.bool.isRequired,
      userDictionaries: PropTypes.array.isRequired,
      updateUserData: PropTypes.func,
      changeDictionary: PropTypes.func,
    }, props, 'prop', 'LoginForm');

    this.state = {
      email: this.props.email,
      username: this.props.username,
      publicName: this.props.publicName,
      allowEmails: this.props.allowEmails,
      userDictionaries: this.props.userDictionaries,
    };
  }
  
  render() {
    return (
      <div>
        <div className='columns'>
        
          <div className='column'>
            <h2 className='title'>Account Details</h2>
            <div className='control'>
              <strong>Email:</strong> <span>{this.state.email}</span>
            </div>
            <div className='control'>
              <strong>Username:</strong> <span>{this.state.username}</span>
            </div>
            <div className='field'>
              <label className='label'>
                <span>Public Name:</span>
              </label>
              <div className='control'>
                <input className='input' type='text' value={this.state.publicName}
                  onInput={(event) => {this.setState({publicName: event.target.value})}} />
              </div>
            </div>
            <div className='field'>
              <div className='control'>
                <input className='is-checkradio is-rtl' type='checkbox' id='allowEmails'
                  checked={this.state.allowEmails ? 'checked' : false}
                  onChange={(event) => { this.setState({ allowEmails: !this.state.allowEmails }) }} />
                <label className='label is-unselectable' htmlFor='allowEmails'>
                  Allow Emails
                </label>
              </div>
            </div>
          </div>
          
          <div className='column'>
            <h2 className='title'>Account Actions</h2>
            <div className='field'>
              <label className='label is-unselectable'>
                <span>Change Dictionary</span>
              </label>
              <div className='control'>
                <div className='select'>
                  <select>
                    {this.props.userDictionaries.map(item => {
                      return <option value={item.id}>{item.name}</option>;
                    })}
                  </select>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    );
  }
}
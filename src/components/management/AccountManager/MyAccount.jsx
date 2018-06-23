import Inferno from 'inferno';
import { Component } from 'inferno';
import PropTypes from 'prop-types';

export class MyAccount extends Component {
  constructor(props) {
    super(props);

    PropTypes.checkPropTypes({
      email: PropTypes.string.isRequired,
      // username: PropTypes.string.isRequired,
      publicName: PropTypes.string.isRequired,
      allowEmails: PropTypes.bool.isRequired,
      userDictionaries: PropTypes.array.isRequired,
      updateUserData: PropTypes.func,
      changeDictionary: PropTypes.func,
    }, props, 'prop', 'MyAccount');

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
            <div className='field'>
              <label className='label'>
                <span>Email:</span>
              </label>
              <div className='control'>
                <input className='input' type='text' value={this.state.email}
                  onInput={(event) => { this.setState({ email: event.target.value }) }} />
                <div className='help'>
                  <strong>Note:</strong> If you change your email address, you will need to use your new email address to log in.
                </div>
              </div>
            </div>
            <div className='field'>
              <label className='label'>
                <span>Public Name:</span>
              </label>
              <div className='control'>
                <input className='input' type='text' value={this.state.publicName}
                  onInput={(event) => {this.setState({publicName: event.target.value})}} />
                <div className='help'>
                  This is the name we greet you with. It's also the name displayed if you ever decide to share 
                  any of your dictionaries.
                </div>
                <div className='help'>
                  <strong>Note:</strong> This is <em>not a username</em>, and is therefore not guaranteed to be unique.
                  Use something people will recognize you as to differentiate from other people who might use the same name!
                </div>
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
                <div className='help'>
                  We'll make sure that you're the first to hear about any new features that get added or if any of our policies
                  change for any reason. We'll never spam you or sell your information, but you may need to mark emails from
                  lexicon.ga as not spam to receive them.
                </div>
                <div className='help'>
                  <strong>Note:</strong> Password reset emails will be sent regardless of your choice here.
                </div>
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

            <div className='field'>
              <label className='label is-unselectable'>
                <span>Reset Your Password</span>
              </label>
              <div className='help'>
                Click the button below to reload the page and show the Reset Password form. Filling out this
                form will instantly change your password, and you will need to log in using the new password
                from that point forward.
              </div>
              <div className='control'>
                <a className='button'>Reset Password</a>
              </div>
            </div>

            <div className='content is-small'>
              <h4><strong>Request Your Data</strong></h4>
              <p>
                Per your <a href='https://www.eugdpr.org/' target='_blank'>GDPR</a> rights in Articles 13–15 and 20,
                we allow you to request any and all data we have stored about you. The only data we have about
                you personally is your email address and your Public Name, if you decided to set one. All other
                data (your Dictionary data) is visible and accessible via the Export button under your Dictionary's
                Settings. Send an email to help@lexicon.ga to request your information.
              </p>
            </div>

            <div className='content is-small'>
              <h4><strong>Delete Your Account</strong></h4>
              <p>
                Per your <a href='https://www.eugdpr.org/' target='_blank'>GDPR</a> rights in Article 17, if you wish
                for your account to be deleted, please contact us at help@lexicon.ga, and we will delete your account
                and all associated dictionaries and words as quickly as possible. Note that you can delete dictionaries
                yourself via your Dictionary's Settings.
              </p>
              <p>
                Anything that is deleted from our system is permanently and irretrievably removed from our system and
                cannot be restored, though search engines or internet archives may retain a cached version of your content
                (there is nothing we can do about this, and you will need to seek out removal of that information by directly
                  contacting the services that are caching your data).
              </p>
            </div>
          </div>
          
        </div>
      </div>
    );
  }
}
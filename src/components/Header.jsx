import React from 'react';
import marked from 'marked';

import {Button} from './Button';
import {FixedPage} from './FixedPage';

export class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: false,
      lockedOut: false
    }

    this.aboutText = '# About  \nGet this later.';
  }

  logUserIn() {
    this.setState({
      loggedIn: true
    });
  }

  logUserOut() {
    this.setState({
      loggedIn: false
    });
  }

  lockUserOut() {
    this.setState({
      loggedIn: false,
      lockedOut: true
    });
  }

  unlockUser() {
    this.setState({
      lockedOut: false
    });
  }

  showAccountButtons() {
    var buttons;

    if (this.state.loggedIn) {
      buttons = [
        <Button key='accountbutton1'
          id='accountSettings'
          action={() => this.lockUserOut()}
          label='Account Settings' />,
        <Button key='accountbutton2'
          id='logoutLink'
          action={() => this.logUserOut()}
          label='Log Out' />
      ];
    } else if (this.state.lockedOut) {
      buttons = [
        <Button key='accountbutton3'
          id='logoutLink'
          action={() => this.unlockUser()}
          label='Can&apos;t Log In' />
      ];
    } else {
      buttons = [
        <Button key='accountbutton4'
          id='loginLink'
          action={() => this.logUserIn()}
          label='Log In/Create Account' />
      ];
    }

    return <div className='button-group'>{buttons}</div>;
  }

  render() {
    return (
      <header>

        <div id="headerPadder">

          <a href="/" id="siteLogo">Lexiconga Dictionary Builder</a>

          <div className='button-group'>
            
            <FixedPage id='aboutButton' buttonText='About Lexiconga'>
              <div dangerouslySetInnerHTML={{__html: marked(this.aboutText)}} />
            </FixedPage>

          </div>

          {this.showAccountButtons()}

        </div>

      </header>
    );
  }
}
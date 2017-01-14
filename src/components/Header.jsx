// import React from 'react';
import Inferno from 'inferno';
import Component from 'inferno-component';
import marked from 'marked';

import {Button} from './Button';
import {FixedPage} from './FixedPage';

// A component for the site header
// export class Header extends React.Component {
export class Header extends Component {
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
          classes='level-item'
          action={() => this.lockUserOut()}
          label='Account Settings' />,
        <Button key='accountbutton2'
          id='logoutLink'
          classes='level-item'
          action={() => this.logUserOut()}
          label='Log Out' />
      ];
    } else if (this.state.lockedOut) {
      buttons = [
        <Button key='accountbutton3'
          id='logoutLink'
          classes='level-item'
          action={() => this.unlockUser()}
          label='Can&apos;t Log In' />
      ];
    } else {
      buttons = [
        <Button key='accountbutton4'
          id='loginLink'
          classes='level-item'
          action={() => this.logUserIn()}
          label='Log In/Create Account' />
      ];
    }

    return buttons;
  }

  render() {
    return (
      <header className='header'>
        <div className='hero'>
          <nav className='level' id="headerPadder">

            <div className='level-left'>
              <a className='level-item' href="/" id="siteLogo">
                Lexiconga Dictionary Builder
              </a>
            </div>

            <div className='level-right'>

              {this.showAccountButtons()}

              <div className='level-item'>
                <FixedPage id='aboutButton' buttonText='About Lexiconga'>
                  <div dangerouslySetInnerHTML={{__html: marked(this.aboutText)}} />
                </FixedPage>
              </div>

            </div>

          </nav>
        </div>
      </header>
    );
  }
}
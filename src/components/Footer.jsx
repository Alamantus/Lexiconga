import React from 'react';
import marked from 'marked';

import {FixedPage} from './FixedPage';

export class Footer extends React.Component {
  constructor(props) {
    super(props);

    this.termsText = '# Terms  \nTesting the terms';
    this.privacyText = '# Privacy  \nTesting the privacy';
  }

  render() {
    return (
      <footer>

        <div id="footer-content">
          Dictionary Builder only guaranteed to work with most up-to-date HTML5 browsers.

          <a href="/issues" className="clickable inline-button" target="_blank">
            Issues
          </a>

          <a href="/updates" className="clickable inline-button" target="_blank">
            Updates
          </a>

          &nbsp;|&nbsp;

          <FixedPage buttonClasses='inline-button' buttonText='Terms'>
            <div dangerouslySetInnerHTML={{__html: marked(this.termsText)}} />
          </FixedPage>

          <FixedPage buttonClasses='inline-button' buttonText='Privacy'>
            <div dangerouslySetInnerHTML={{__html: marked(this.privacyText)}} />
          </FixedPage>

        </div>

      </footer>
    );
  }
}
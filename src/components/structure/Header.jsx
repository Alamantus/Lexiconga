import Inferno from 'inferno';
import { Component } from 'inferno';
import PropTypes from 'prop-types';
import marked from 'marked';

import { Modal } from './Modal';
import { SearchBox } from '../management/SearchBox';
import { AccountManager } from '../management/AccountManager';

import helpMarkdown from '../../assets/text/help.md';

export class Header extends Component {
  constructor (props) {
    super(props);

    PropTypes.checkPropTypes({
      partsOfSpeech: PropTypes.array.isRequired,
      search: PropTypes.func.isRequired,
      updater: PropTypes.object.isRequired,
    }, props, 'prop', 'Header');

    this.state = {
      displayNavMenu: false,
    }
  }

  render () {
    return (
      <nav className='navbar'>
        <div className='navbar-brand'>
          <a href='/' className='navbar-item'>
            <img src={ `./logo.${ (typeof SVGRect !== 'undefined') ? 'svg' : 'png' }` } alt='Lexiconga Logo' />
          </a>

          <div className='navbar-item'>
            <SearchBox
              partsOfSpeech={ this.props.partsOfSpeech }
              search={ this.props.search } />
          </div>

          <a className={`button navbar-burger${this.state.displayNavMenu ? ' is-active' : ''}`}
            onClick={ () => this.setState({ displayNavMenu: !this.state.displayNavMenu }) }>
            <span></span>
            <span></span>
            <span></span>
          </a>
        </div>

        <div className={`navbar-menu${ this.state.displayNavMenu ? ' is-active' : '' }`}>
          <div className='navbar-end'>
            <span className='navbar-item has-text-right-touch'>
              <AccountManager updater={ this.props.updater } />
            </span>
            <span className='navbar-item has-text-right-touch'>
              <Modal buttonText='Help' title='Lexiconga Help'>
                <div className='content has-text-left'>
                  <div dangerouslySetInnerHTML={{
                    __html: marked(helpMarkdown.replace(/(MARKDOWN_LINK)/g, MARKDOWN_LINK))
                  }} />
                </div>
              </Modal>
            </span>
          </div>
        </div>
      </nav>
    );
  }
}

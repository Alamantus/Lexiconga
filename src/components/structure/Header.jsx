import Inferno from 'inferno';
import Component from 'inferno-component';
import marked from 'marked';

import { Modal } from './Modal';
import { SearchBox } from '../management/SearchBox';

import helpMarkdown from '../../assets/text/help.md';

export class Header extends Component {
  constructor (props) {
    super(props);

    this.state = {
      displayNavMenu: false,
    }
  }

  render () {
    return (
      <nav className='nav'>
        <div className='nav-left'>
          <a href='/' className='nav-item image'>
            <img src={ `./logo.${ (typeof SVGRect !== 'undefined') ? 'svg' : 'png' }` } alt='Lexiconga Logo' />
          </a>
        </div>

        <div className='nav-center'>
          <div className='nav-item'>
            <SearchBox
              partsOfSpeech={ this.props.partsOfSpeech }
              search={ (searchConfig) => this.props.search(searchConfig) } />
          </div>
        </div>

        <span className={`nav-toggle${this.state.displayNavMenu ? ' is-active' : ''}`}
          onClick={ () => this.setState({ displayNavMenu: !this.state.displayNavMenu }) }>
          <span></span>
          <span></span>
          <span></span>
        </span>

        <div className={ `nav-right nav-menu${ this.state.displayNavMenu ? ' is-active' : '' }` }>
          <span className='nav-item'>
            <a className='button'>
              Login
            </a>
          </span>
          <span className='nav-item'>
            <Modal buttonText='Help' title='Lexiconga Help'>
              <div className='content has-text-left'>
                <div dangerouslySetInnerHTML={{
                  __html: marked(helpMarkdown.replace(/(MARKDOWN_LINK)/g, MARKDOWN_LINK))
                }} />
              </div>
            </Modal>
          </span>
        </div>
      </nav>
    );
  }
}

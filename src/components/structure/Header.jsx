import Inferno from 'inferno';
import Component from 'inferno-component';

import {SearchBox} from '../management/SearchBox';

export class Header extends Component {
  constructor (props) {
    super(props);

    this.state = {
      displayNavMenu: false
    }
  }

  render () {
    return (
      <nav className='nav'>
        <div className='nav-left'>
          <a href='/' className='nav-item image'>
            <img src={`./logo.${(typeof SVGRect !== 'undefined') ? 'svg' : 'png'}`} alt='Lexiconga Logo' />
          </a>
        </div>

        <div className='nav-center'>
          <div className='nav-item'>
            <SearchBox
              search={searchConfig => this.props.search(searchConfig)} />
          </div>
        </div>

        <span className={`nav-toggle${this.state.displayNavMenu ? ' is-active' : ''}`}
          onClick={() => this.setState({ displayNavMenu: !this.state.displayNavMenu })}>
          <span></span>
          <span></span>
          <span></span>
        </span>

        <div className={`nav-right nav-menu${this.state.displayNavMenu ? ' is-active' : ''}`}>
          <span className='nav-item'>
            <a className='button'>
              Login
            </a>
          </span>
          <span className='nav-item'>
            <a className='button'>
              About
            </a>
          </span>
        </div>
      </nav>
    );
  }
}

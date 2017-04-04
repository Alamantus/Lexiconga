import Inferno from 'inferno';
import Component from 'inferno-component';

export class Footer extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <footer className='footer'>
        <div className='container'>
          <div className='level'>
            <div className='level-left'>
              <div className='content'>
                <p>
                  Lexiconga is only guaranteed to work with the most
                  up-to-date <a href='https://whatbrowser.org/' target='_blank'>HTML5 browsers</a>.
                </p>
              </div>
            </div>

            <div className='level-right'>
              <span className='level-item'>
                <a className='button'>
                  Issues
                </a>
              </span>
              <span className='level-item'>
                <a className='button'>
                  Updates
                </a>
              </span>
              <span className='level-item'>
                <a className='button'>
                  Terms
                </a>
              </span>
              <span className='level-item'>
                <a className='button'>
                  Privacy
                </a>
              </span>
            </div>
          </div>
        </div>
      </footer>
    );
  }
}

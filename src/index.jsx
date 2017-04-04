import './sass/main.scss';

import Inferno from 'inferno';
import Component from 'inferno-component';

class App extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <div>
        <nav className='nav'>
          <div className='nav-left'>
            <a href='/' className='nav-item'>
              <img src='images/logo.svg' alt='Lexiconga' />
            </a>
          </div>
          <div className='nav-right'>
            <a href='/' className='nav-item'>
              Login
            </a>
            <a href='/' className='nav-item'>
              About
            </a>
          </div>
        </nav>

        <section className='section'>
          <div className='container'>
            <div className='columns'>
              <div className='column is-one-quarter'>
                <div className='box'>
                  <div className='field'>
                    <label className='label'>Word</label>
                    <p className='control'>
                      <input className='input' type='text' placeholder='Text input' />
                    </p>
                  </div>
                  <div className='field'>
                    <label className='label'>Pronunciation</label>
                    <p className='control'>
                      <input className='input' type='text' placeholder='Text input' />
                    </p>
                  </div>
                  <div className='field'>
                    <label className='label'>Part of Speech</label>
                    <p className='control'>
                      <span className='select'>
                        <select>
                          <option>Select dropdown</option>
                          <option>With options</option>
                        </select>
                      </span>
                    </p>
                  </div>
                  <div className='field'>
                    <label className='label'>Definition / Equivalent Word(s)</label>
                    <p className='control'>
                      <input className='input' type='text' placeholder='Text input' />
                    </p>
                  </div>
                  <div className='field'>
                    <label className='label'>Explanation / Long Definition</label>
                    <p className='control'>
                      <textarea className='textarea' placeholder='Textarea' />
                    </p>
                  </div>
                </div>
              </div>

              <div className='column is-half'>
                <div className='card'>
                  <header className='card-header'>
                    <p className='card-header-title'>
                      Dictionary Name
                    </p>
                    <a className='card-header-icon button'>
                      Edit Dictionary
                    </a>
                  </header>
                  <div className='card-content'>
                    <div className='content'>
                      Hello
                    </div>
                  </div>
                  <footer className='card-footer'>
                    <a className='card-footer-item'>Save</a>
                    <a className='card-footer-item'>Edit</a>
                    <a className='card-footer-item'>Delete</a>
                  </footer>
                </div>
              </div>

              <div className='column is-one-quarter'>

              </div>
            </div>
          </div>
        </section>

      </div>
    );
  }
}

Inferno.render(<App />, document.getElementById('site'));

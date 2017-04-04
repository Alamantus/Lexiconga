import './sass/main.scss';

import Inferno from 'inferno';
import Component from 'inferno-component';

if (process.env.NODE_ENV !== 'production') {
  require('inferno-devtools');
}

import {Header} from './components/structure/Header';
import {Lexiconga} from './components/Lexiconga';
import {Footer} from './components/structure/Footer';

class App extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <div>
        <Header />

        <Lexiconga />

        <Footer />
      </div>
    );
  }
}

Inferno.render(<App />, document.getElementById('site'));

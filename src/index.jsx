import './index.html';
import './sass/styles.scss';

import React from 'react';
import ReactDOM from 'react-dom';

import {NewWordForm} from './components/NewWordForm';

class Lexiconga extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <NewWordForm />
    );
  }
}

ReactDOM.render(<Lexiconga />, document.getElementById('site'));
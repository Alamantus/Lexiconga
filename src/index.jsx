import './index.html';
import './sass/main.scss';

import React from 'react';
import ReactDOM from 'react-dom';

import {Header} from './components/Header';
import {NewWordForm} from './components/NewWordForm';
import {Dictionary} from './components/Dictionary';

class Lexiconga extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      scroll: {
        x: 0,
        y: 0
      }
    }

    // this.defaultDictionaryJSON = JSON.stringify(this.state.dictionaryDetails);  //Saves a stringifyed default dictionary.
    this.previousDictionary = {};

    // this.addTestWord();
  }

  render() {
    return (
      <div>
        <Header />
        <NewWordForm />
        <Dictionary />
      </div>
    );
  }
}

ReactDOM.render(<Lexiconga />, document.getElementById('site'));
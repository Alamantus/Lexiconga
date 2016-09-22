import './index.html';
import './sass/main.scss';

import React from 'react';
import ReactDOM from 'react-dom';

import {Header} from './components/Header';
import {NewWordForm} from './components/NewWordForm';
import {Button} from './components/Button';
import {Dictionary} from './components/Dictionary';

class Lexiconga extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      scroll: {
        x: 0,
        y: 0
      },

      currentDictionary: {
        name: "New",
        description: "A new dictionary.",
        createdBy: 'Someone',
        words: [],
        settings: {
          allowDuplicates: false,
          caseSensitive: false,
          partsOfSpeech: "Noun,Adjective,Verb,Adverb,Preposition,Pronoun,Conjunction",
          sortByEquivalent: false,
          isComplete: false,
          isPublic: false
        },
        nextWordId: 1,
        externalID: 0
      }
    };

    this.defaultDictionaryJSON = JSON.stringify(this.state.dictionaryDetails);  //Saves a stringifyed default dictionary.
    this.previousDictionary = {};

    // this.addTestWord();
  }

  changeDictionaryName() {
    // To change elements within the dictionary object, you can set it to
    // a variable, manipulate the variable, then use setState() to set
    // the object equal to the changed variable.
    let updateDictionary = this.state.currentDictionary;
    updateDictionary.name = 'something else'
    this.setState({
      currentDictionary: updateDictionary
    })
  }

  render() {
    return (
      <div>
        <Header />
        <NewWordForm reference={this.state.currentDictionary} />
        <Button
          action={() => this.changeDictionaryName()}
          label='change name' />
        <Dictionary reference={this.state.currentDictionary} />
      </div>
    );
  }
}

ReactDOM.render(<Lexiconga />, document.getElementById('site'));
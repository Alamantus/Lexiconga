import React from 'react';

import {Word} from './Word';
import {Button} from './Button';

export class Dictionary extends React.Component {
  constructor(props) {
    super(props);
  }

  showWords() {
    let words = this.props.words.map((word, index) => {
      return <Word key={'dictionaryEntry' + index.toString()} isEditing={true}
        name={word.name}
        pronunciation={word.pronunciation}
        partOfSpeech={word.partOfSpeech}
        simpleDefinition={word.simpleDefinition}
        longDefinition={word.longDefinition}
        wordId={word.wordId}
        index={index}
        passWordAndUpdate={(index, wordObject) => this.passWordAndUpdate(index, wordObject)} />;
    });

    if (this.showConsoleMessages) {
      console.log('Showing these words:');
      console.log(words);
    }

    return <div>{words}</div>;
  }

  passWordAndUpdate(index, wordObject) {
    console.log('Passing edited up: ' + wordObject.name);
    this.props.updateWord(index, wordObject);
  }

  render() {
    return (
      <div>
        <h1 id="dictionaryName">
          {this.props.details.name}
        </h1>
        
        <h4 id="dictionaryBy">
          {this.props.details.createdBy}
        </h4>
        <div id="incompleteNotice">
          Dictionary is complete: {this.props.settings.isComplete.toString()}
        </div>

        <div id="theDictionary">
          {this.showWords()}
        </div>
      </div>
    );
  }
}
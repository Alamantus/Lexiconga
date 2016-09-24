import React from 'react';

import {Word} from './Word';
import {Button} from './Button';

export class Dictionary extends React.Component {
  constructor(props) {
    super(props);
  }

  showWords() {
    let words = this.props.words.map((word) => {
      return <Word key={'dictionaryEntry' + word.wordId.toString()} isEditing={true}
        name={word.name}
        pronunciation={word.pronunciation}
        partOfSpeech={word.partOfSpeech}
        simpleDefinition={word.simpleDefinition}
        longDefinition={word.longDefinition}
        wordId={word.wordId}
        updateWord={(wordId, wordObject) => this.props.updateWord(wordId, wordObject)} />;
    });

    return <div>{words}</div>;
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
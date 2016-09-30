import React from 'react';

import {Word} from './Word';
import {Button} from './Button';

export class Dictionary extends React.Component {
  constructor(props) {
    super(props);
  }

  showWords() {
    if (this.props.words.length > 0) {
      let words = this.props.words.map((word) => {
        return <Word key={'d:' + this.props.details.name + this.props.details.externalID.toString() + 'w:' + word.wordId.toString()} isEditing={true}
          name={word.name}
          pronunciation={word.pronunciation}
          partOfSpeech={word.partOfSpeech}
          simpleDefinition={word.simpleDefinition}
          longDefinition={word.longDefinition}
          wordId={word.wordId}
          updateWord={(wordId, wordObject) => this.props.updateWord(wordId, wordObject)} />;
      });

      return <div>{words}</div>;
    } else {
      return <h3>No words yet!</h3>;
    }
  }

  render() {
    return (
      <div id="theDictionary">
        {this.showWords()}
      </div>
    );
  }
}
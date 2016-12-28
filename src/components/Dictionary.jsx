import React from 'react';

import {Word} from './Word';

// A component for showing just the list of words provided to it as a prop.
export class Dictionary extends React.Component {
  constructor(props) {
    super(props);
  }

  // Take the word list, given as a component prop, map its values to a Word component, and return it in a div tag.
  showWords() {
    if (this.props.words.length > 0) {
      let words = this.props.words.map((word) => {
        return (
          <Word key={'d:' + this.props.details.name + this.props.details.externalID.toString() + 'w:' + word.wordId.toString()} isEditing={true}
            name={word.name}
            pronunciation={word.pronunciation}
            partOfSpeech={word.partOfSpeech}
            simpleDefinition={word.simpleDefinition}
            longDefinition={word.longDefinition}
            wordId={word.wordId}
            dictionary={this}
            updateWord={(wordId, wordObject) => this.props.updateWord(wordId, wordObject)} />
        );
      });

      return <div>{words}</div>;
    } else {
      return <h3 className='title is-3'>No words yet!</h3>;
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
import React from 'react';

import {Word} from './Word';
import {Button} from './Button';

export class Dictionary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: this.props.reference.name,
      description: this.props.reference.description,
      createdBy: this.props.reference.createdBy,
      words: this.props.reference.words,
      nextWordId: this.props.reference.nextWordId,
      externalID: this.props.reference.externalID,
      allowDuplicates: this.props.reference.settings.allowDuplicates,
      caseSensitive: this.props.reference.settings.caseSensitive,
      partsOfSpeech: this.props.reference.settings.partOfSpeech,
      sortByEquivalent: this.props.reference.settings.sortByEquivalent,
      isComplete: this.props.reference.settings.isComplete,
      isPublic: this.props.reference.settings.isPublic
    }

    // this.addTestWord();
  }

  showWords() {
    let words = this.state.words.map((word, index) => {
      return <Word key={'dictionaryEntry' + index.toString()}
        reference={word}
        initialPosition={index} />;
      // return <Word key={'dictionaryEntry' + index.toString()}
      //   name={word.name}
      //   wordId={word.wordId}
      //   pronunciation={word.pronunciation}
      //   partOfSpeech={word.partOfSpeech}
      //   simpleDefinition={word.simpleDefinition}
      //   longDefinition={word.longDefinition}
      //   initialPosition={index} />;
    });

    return <div>{words}</div>;
  }

  addTestWord() {
    this.setState({
      words: this.state.words.concat([{
        name: 'word',
        pronunciation: 'pronunciation',
        partOfSpeech: 'partOfSpeech',
        simpleDefinition: 'simpleDefinition',
        longDefinition: 'longDefinition',
        wordId: 'wordId'
      }])
    }, () => console.log(this.state.words));
  }

  changeTestWord() {
    this.setState(
      words[0].name: 'cool'
    );
  }

  render() {
    return (
      <div>
        <h1 id="dictionaryName">
          {this.state.name}
        </h1>
        
        <h4 id="dictionaryBy">
          {this.state.createdBy}
        </h4>
        <div id="incompleteNotice">
          Dictionary is complete: {this.state.isComplete.toString()}
        </div>

        <div id="theDictionary">
          {this.showWords()}
        </div>

        <Button
          action={() => this.addTestWord()}
          label='Add a Test Word' />

        <Button
          action={() => {
            this.setState({isComplete: !this.state.isComplete})
          }}
          label='Toggle State' />
      </div>
    );
  }
}
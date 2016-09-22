import React from 'react';

import {Word} from './Word';
import {Button} from './Button';

export class Dictionary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "New",
      description: "A new dictionary.",
      createdBy: 'Someone',
      words: [],
      nextWordId: 1,
      externalID: 0,
      allowDuplicates: false,
      caseSensitive: false,
      partsOfSpeech: "Noun,Adjective,Verb,Adverb,Preposition,Pronoun,Conjunction",
      sortByEquivalent: false,
      isComplete: false,
      isPublic: false
    }

    // this.addTestWord();
  }

  showWords() {
    let words = this.state.words.map((word, index) => {
      return <Word key={'dictionaryEntry' + index.toString()}
        name={word.name}
        wordId={word.wordId}
        pronunciation={word.pronunciation}
        partOfSpeech={word.partOfSpeech}
        simpleDefinition={word.simpleDefinition}
        longDefinition={word.longDefinition}
        initialPosition={index} />
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
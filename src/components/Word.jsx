import React from 'react';

import {Button} from './Button';

export class Word extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: this.props.name,
      pronunciation: this.props.pronunciation,
      partOfSpeech: ((this.props.partOfSpeech.length > 0) ? this.props.partOfSpeech : " "),
      simpleDefinition: this.props.simpleDefinition,
      longDefinition: this.props.longDefinition
    }
  }

  /*
  {
    name: word,
    pronunciation: pronunciation,
    partOfSpeech: ((partOfSpeech.length > 0) ? partOfSpeech : " "),
    simpleDefinition: simpleDefinition,
    longDefinition: longDefinition,
    wordId: currentDictionary.nextWordId++
  }
  */

  showPronunciation() {
    if (this.state.pronunciation !== '') {
      return <div className='pronunciation'>{this.state.pronunciation}</div>;
    }
  }

  showPartOfSpeech() {
    if (this.state.partOfSpeech !== '') {
      return <div className='part-of-speech'>{this.state.partOfSpeech}</div>;
    }
  }

  showSimpleDefinition() {
    if (this.state.simpleDefinition !== '') {
      return <div className='simple-definition'>{this.state.simpleDefinition}</div>;
    }
  }

  showLongDefinition() {
    if (this.state.longDefinition !== '') {
      return <div className='long-definition'>{this.state.longDefinition}</div>;
    }
  }

  showManagementArea() {
    if (this.props.isEditing) {
      return (
        <Button
          action={() => this.updateWord()}
          label='Save Edits' />
      );
    }
  }

  updateWord() {
    this.setState({
      name: 'this.state.name',
      pronunciation: 'this.state.pronunciation',
      partOfSpeech: 'this.state.partOfSpeech',
      simpleDefinition: 'this.state.simpleDefinition',
      longDefinition: 'this.state.longDefinition'
    }, () => {
      this.props.updateWord(this.props.index, {
        name: this.state.name,
        pronunciation: this.state.pronunciation,
        partOfSpeech: this.state.partOfSpeech,
        simpleDefinition: this.state.simpleDefinition,
        longDefinition: this.state.longDefinition
      });
    });
  }

  render() {
    return (
      <div id={'entry' + this.props.index} className='word'>
        <a name={'entry' + this.props.wordId}></a>
        <div className='name'>
          {this.state.name}
        </div>
        {this.showPronunciation()}

        {this.showPartOfSpeech()}

        <br />

        {this.showSimpleDefinition()}
        {this.showLongDefinition()}

        {this.showManagementArea()}
      </div>
    );
  }
}

Word.defaultProps = {
  isEditing: false
}
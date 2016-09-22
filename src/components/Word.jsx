import React from 'react';

export class Word extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      word: this.props.reference,
      // name: this.props.name,
      // wordId: this.props.wordId,
      // pronunciation: this.props.pronunciation || '',
      // partOfSpeech: this.props.partOfSpeech || '',
      // simpleDefinition: this.props.simpleDefinition || '',
      // longDefinition: this.props.longDefinition || '',
      sortPosition: this.props.initialPosition
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
    if (this.state.word.pronunciation !== '') {
      return <div className='pronunciation'>{this.state.word.pronunciation}</div>;
    }
  }

  showPartOfSpeech() {
    if (this.state.word.partOfSpeech !== '') {
      return <div className='part-of-speech'>{this.state.word.partOfSpeech}</div>;
    }
  }

  showSimpleDefinition() {
    if (this.state.word.simpleDefinition !== '') {
      return <div className='simple-definition'>{this.state.word.simpleDefinition}</div>;
    }
  }

  showLongDefinition() {
    if (this.state.word.longDefinition !== '') {
      return <div className='long-definition'>{this.state.word.longDefinition}</div>;
    }
  }

  render() {
    return (
      <div id={'entry' + this.state.sortPosition} className='word'>
        <a name={'entry' + this.state.word.wordId}></a>
        <div className='name'>
          {this.state.word.name}
        </div>
        {this.showPronunciation()}

        {this.showPartOfSpeech()}

        <br />

        {this.showSimpleDefinition()}
        {this.showLongDefinition()}
      </div>
    );
  }
}
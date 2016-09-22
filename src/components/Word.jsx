import React from 'react';

export class Word extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: this.props.name,
      wordId: this.props.wordId,
      pronunciation: this.props.pronunciation || '',
      partOfSpeech: this.props.partOfSpeech || '',
      simpleDefinition: this.props.simpleDefinition || '',
      longDefinition: this.props.longDefinition || '',
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

  render() {
    return (
      <div id={'entry' + this.state.sortPosition} className='word'>
        <a name={'entry' + this.state.wordId}></a>
        <div className='name'>
          {this.state.name}
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
import React from 'react';
import marked from 'marked';

import {WordForm} from './WordForm';
import {Button} from './Button';

const saveIcon = <i>&#128190;</i>;
const editIcon = <i>&#128393;</i>;

export class Word extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editWord: false,
      editName: false,
      editPronunciation: false,
      editPartOfSpeech: false,
      editSimpleDefinition: false,
      editLongDefinition: false
    };
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

  showName() {
    return (
      <div className='name'>
        {this.props.name}
      </div>
    );
  }

  showPronunciation() {
    if (this.props.pronunciation !== '') {
      return (
        <div className='pronunciation'>
          {this.props.pronunciation}
        </div>
      );
    }
  }

  showPartOfSpeech() {
    if (this.props.partOfSpeech !== '') {
      return (
        <div className='part-of-speech'>
          {this.props.partOfSpeech}
        </div>
      );
    }
  }

  showSimpleDefinition() {
    if (this.props.simpleDefinition !== '') {
      return (
        <div className='simple-definition'>
          {this.props.simpleDefinition}
        </div>
      );
    }
  }

  showLongDefinition() {
    if (this.props.longDefinition !== '') {
      return (
        <div className='long-definition' dangerouslySetInnerHTML={{__html: marked(this.props.longDefinition)}} />
      );
    }
  }

  showWordOrEdit() {
    if (this.state.editWord) {
      return (
        <WordForm
          updateWord={(wordObject) => this.updateWord(wordObject)}
          wordValues={this.packageThisWordIntoObject()}
          submitLabel='Update' />
      );
    } else {
      return (
        <div>
          {this.showName()}

          {this.showPronunciation()}

          {this.showPartOfSpeech()}

          <br />

          {this.showSimpleDefinition()}

          {this.showLongDefinition()}
        </div>
      );
    }
  }

  showManagementArea() {
    if (this.props.isEditing) {
      if (this.state.editWord) {
        return (
          <Button
            action={() => this.setState({editWord: false})}
            label='Cancel' />
        );
      } else {
        return (
          <Button
            action={() => this.setState({editWord: true})}
            label='Edit Word' />
        );
      }
    }
  }

  updateWord(wordObject) {
    this.props.updateWord(this.props.wordId, {
      name: wordObject.name || this.props.name,
      pronunciation: wordObject.pronunciation || this.props.pronunciation,
      partOfSpeech: wordObject.partOfSpeech || this.props.partOfSpeech,
      simpleDefinition: wordObject.simpleDefinition || this.props.simpleDefinition,
      longDefinition: wordObject.longDefinition || this.props.longDefinition
    });

    this.setState({editWord: false});
  }

  packageThisWordIntoObject() {
    return {
      name: this.props.name,
      pronunciation: this.props.pronunciation,
      partOfSpeech: this.props.partOfSpeech,
      simpleDefinition: this.props.simpleDefinition,
      longDefinition: this.props.longDefinition
    };
  }

  render() {
    return (
      <div id={'entry' + this.props.wordId} className='word'>

        {this.showWordOrEdit()}

        <div className='management'>
          {this.showManagementArea()}
        </div>

      </div>
    );
  }
}

Word.defaultProps = {
  isEditing: false
}
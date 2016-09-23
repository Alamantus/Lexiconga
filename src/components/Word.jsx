import React from 'react';

import {Input} from './Input';
import {TextArea} from './TextArea';
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
    let editButton;
    if (this.state.editWord) {
      return (
        <div>
          <Input value={this.props.name} ref={(inputComponent) => this.nameField = inputComponent} />
        </div>
      );
    } else {
      return (
        <div className='name'>
          {this.props.name}
        </div>
      );
    }
  }

  showPronunciation() {
    if (this.state.editWord) {
      return (
        <div>
          <Input value={this.props.pronunciation} ref={(inputComponent) => this.pronunciationField = inputComponent} />
        </div>
      );
    } else {
      if (this.props.pronunciation !== '') {
        return (
          <div className='pronunciation'>
            {this.props.pronunciation}
          </div>
        );
      }
    }
  }

  showPartOfSpeech() {
    if (this.state.editWord) {
      return (
        <div>
          <Input value={this.props.partOfSpeech} ref={(inputComponent) => this.partOfSpeechField = inputComponent} />
        </div>
      );
    } else {
      if (this.props.partOfSpeech !== '') {
        return (
          <div className='part-of-speech'>
            {this.props.partOfSpeech}
          </div>
        );
      }
    }
  }

  showSimpleDefinition() {
    if (this.state.editWord) {
      return (
        <div>
          <Input value={this.props.simpleDefinition} ref={(inputComponent) => this.simpleDefinitionField = inputComponent} />
        </div>
      );
    } else {
      if (this.props.simpleDefinition !== '') {
        return (
          <div className='simple-definition'>
            {this.props.simpleDefinition}
          </div>
        );
      }
    }
  }

  showLongDefinition() {
    if (this.state.editWord) {
      return (
        <div>
          <Input value={this.props.longDefinition} ref={(inputComponent) => this.longDefinitionField = inputComponent} />
        </div>
      );
    } else {
      if (this.props.longDefinition !== '') {
        return (
          <div className='long-definition'>
            {this.props.longDefinition}
          </div>
        );
      }
    }
  }

  showManagementArea() {
    if (this.props.isEditing) {
      if (this.state.editWord) {
        return (
          <div>
            <Button
              action={() => {
                let values = {
                  name: this.nameField.state.value,
                  pronunciation: this.pronunciationField.state.value,
                  partOfSpeech: this.partOfSpeechField.state.value,
                  simpleDefinition: this.simpleDefinitionField.state.value,
                  longDefinition: this.longDefinitionField.state.value
                }
                this.setState({editWord: false}, () => this.updateWord(values));
              }}
              label='Save' />
            <Button
              action={() => this.setState({editWord: false})}
              label='Cancel' />
          </div>
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
    this.props.passWordAndUpdate(this.props.index, {
      name: wordObject.name || this.props.name,
      pronunciation: wordObject.pronunciation || this.props.pronunciation,
      partOfSpeech: wordObject.partOfSpeech || this.props.partOfSpeech,
      simpleDefinition: wordObject.simpleDefinition || this.props.simpleDefinition,
      longDefinition: wordObject.longDefinition || this.props.longDefinition
    });
  }

  editProperty(property) {

  }

  render() {
    return (
      <div id={'entry' + this.props.index} className='word'>

        <a name={'entry' + this.props.wordId}></a>

        {this.showName()}

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
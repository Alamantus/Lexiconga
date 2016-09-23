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
    if (this.state.editName) {
      if (this.state.editWord) {
        editButton = (
          <Button
            action={() => {
              let value = this.nameField.state.value;
              this.setState({editName: false}, () => {
                this.updateWord({name: value});
              });
            }}
            label={saveIcon} />
        );
      }
      return (
        <div>
          <Input value={this.props.name} ref={(inputComponent) => this.nameField = inputComponent} />
          {editButton}
        </div>
      );
    } else {
      if (this.state.editWord) {
        <Button
          action={() => {
            this.setState({editName: true});
          }}
          label={editIcon} />
      }
      return (
        <div className='name'>
          {this.props.name}
          {editButton}
        </div>
      );
    }
  }

  showPronunciation() {
    if (this.state.editPronunciation) {
      return (
        <div>
          <Input value={this.props.pronunciation} ref={(inputComponent) => this.pronunciationField = inputComponent} />
          <Button
            action={() => {
              let value = this.pronunciationField.state.value;
              this.setState({editPronunciation: false}, () => {
                this.updateWord({pronunciation: value});
              });
            }}
            label={saveIcon} />
        </div>
      );
    } else {
      if (this.props.pronunciation !== '') {
        return (
          <div className='pronunciation'>
            {this.props.pronunciation}
            <Button
              action={() => {
                this.setState({editPronunciation: true});
              }}
              label={editIcon} />
          </div>
        );
      }
    }
  }

  showPartOfSpeech() {
    if (this.state.editPartOfSpeech) {
      return (
        <div>
          <Input value={this.props.partOfSpeech} ref={(inputComponent) => this.partOfSpeechField = inputComponent} />
          <Button
            action={() => {
              let value = this.partOfSpeechField.state.value;
              this.setState({editPartOfSpeech: false}, () => {
                this.updateWord({partOfSpeech: value});
              });
            }}
            label={saveIcon} />
        </div>
      );
    } else {
      if (this.props.partOfSpeech !== '') {
        return (
          <div className='part-of-speech'>
            {this.props.partOfSpeech}
            <Button
              action={() => {
                this.setState({editPartOfSpeech: true});
              }}
              label={editIcon} />
          </div>
        );
      }
    }
  }

  showSimpleDefinition() {
    if (this.state.editSimpleDefinition) {
      return (
        <div>
          <Input value={this.props.simpleDefinition} ref={(inputComponent) => this.simpleDefinitionField = inputComponent} />
          <Button
            action={() => {
              let value = this.simpleDefinitionField.state.value;
              this.setState({editSimpleDefinition: false}, () => {
                this.updateWord({simpleDefinition: value});
              });
            }}
            label={saveIcon} />
        </div>
      );
    } else {
      if (this.props.simpleDefinition !== '') {
        return (
          <div className='simple-definition'>
            {this.props.simpleDefinition}
            <Button
              action={() => {
                this.setState({editSimpleDefinition: true});
              }}
              label={editIcon} />
          </div>
        );
      }
    }
  }

  showLongDefinition() {
    if (this.state.editLongDefinition) {
      return (
        <div>
          <Input value={this.props.longDefinition} ref={(inputComponent) => this.longDefinitionField = inputComponent} />
          <Button
            action={() => {
              let value = this.longDefinitionField.state.value;
              this.setState({editLongDefinition: false}, () => {
                this.updateWord({longDefinition: value});
              });
            }}
            label={saveIcon} />
        </div>
      );
    } else {
      if (this.props.longDefinition !== '') {
        return (
          <div className='long-definition'>
            {this.props.longDefinition}
            <Button
              action={() => {
                this.setState({editLongDefinition: true});
              }}
              label={editIcon} />
          </div>
        );
      }
    }
  }

  showManagementArea() {
    if (this.props.isEditing) {
      if (this.state.editWord) {
        return (
          <Button
            action={() => {
              this.setState({editWord: false});
            }}
            label='Stop Editing' />
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
// import React from 'react';
import Inferno from 'inferno';
import Component from 'inferno-component';

import {keyCodeFor} from '../../js/helpers'

import {Input} from '../input/Input';
import {Dropdown} from '../input/Dropdown';
import {TextArea} from '../input/TextArea';
import {Button} from '../input/Button';

// export class WordForm extends React.Component {
export class WordForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errorMessage: '',
      updateConflictMessage: ''
    };

    // Declare local variables as null until mounted.
    this.wordField = null;
    this.pronunciationField = null;
    this.partOfSpeechField = null;
    this.simpleDefinitionField = null;
    this.longDefinitionField = null;
  }

  submitWordOnCtrlEnter(event) {
    var keyCode = (event.which ? event.which : event.keyCode);

    //Windows and Linux Chrome accept ctrl+enter as keyCode 10.
    if (keyCode === keyCodeFor('ctrlEnter') || (keyCode == keyCodeFor('enter') && event.ctrlKey)) {
      event.preventDefault();

      this.handleSubmit();
    }
  }

  handleSubmit() {
    if (this.formIsValid()) {
      let word = {
        name: this.wordField.state.value,
        pronunciation: this.pronunciationField.state.value,
        partOfSpeech: this.partOfSpeechField.state.value,
        simpleDefinition: this.simpleDefinitionField.state.value,
        longDefinition: this.longDefinitionField.state.value
      };

      if (this.props.updateWord) {
        this.props.updateWord(word);
      } else {
        this.props.addWord(word);
      }

      this.clearForm();
    }
  }

  formIsValid() {
    let errorMessage = '';

    if (this.wordField.state.value.length <= 0) {
      errorMessage += 'The word field cannot be blank';
    }

    if (this.simpleDefinitionField.state.value.length <= 0
        && this.longDefinitionField.state.value.length <= 0) {
      errorMessage += ((errorMessage.length > 0) ? ', and there' : 'There')
                      + ' must be a value in at least one of the definition fields';
    }

    if (errorMessage.length > 0) {
      errorMessage += '!';
    }

    this.setState({errorMessage: errorMessage});

    return (errorMessage <= 0);
  }

  clearForm() {
    this.wordField.clearField();
    this.pronunciationField.clearField();
    this.partOfSpeechField.clearField();
    this.simpleDefinitionField.clearField();
    this.longDefinitionField.clearField();
  }

  render() {
    let nameDefaultValue = (this.props.wordValues) ? this.props.wordValues.name : '';
    let pronunciationDefaultValue = (this.props.wordValues) ? this.props.wordValues.pronunciation : '';
    let partOfSpeechDefaultValue = (this.props.wordValues) ? this.props.wordValues.partOfSpeech : ' ';
    let simpleDefinitionDefaultValue = (this.props.wordValues) ? this.props.wordValues.simpleDefinition : '';
    let longDefinitionDefaultValue = (this.props.wordValues) ? this.props.wordValues.longDefinition : '';

    return (
      <div className='form'>
        <Input name='Word'
          value={nameDefaultValue}
          onKeyDown={(event) => this.submitWordOnCtrlEnter(event)}
          ref={(inputComponent) => this.wordField = inputComponent} />

        <Input name='Pronunciation'
          helperLink={{
            url: "http://r12a.github.io/pickers/ipa/",
            label: "IPA Characters",
            hover: "IPA Character Picker located at http://r12a.github.io/pickers/ipa/"
          }}
          value={pronunciationDefaultValue}
          onKeyDown={(event) => this.submitWordOnCtrlEnter(event)}
          ref={(inputComponent) => this.pronunciationField = inputComponent} />

        <Dropdown name='Part of Speech'
          optionsList={this.props.partsOfSpeech}
          value={partOfSpeechDefaultValue}
          ref={(inputComponent) => this.partOfSpeechField = inputComponent} />

        <Input name={<div style={{display: 'inline'}}>Definition/<wbr /><b className="wbr"></b>Equivalent Word(s)</div>}
          value={simpleDefinitionDefaultValue}
          onKeyDown={(event) => this.submitWordOnCtrlEnter(event)}
          ref={(inputComponent) => this.simpleDefinitionField = inputComponent} />

        <TextArea id='newWordForm'
          name={<div style={{display: 'inline'}}>Explanation/<wbr /><b className="wbr"></b>Long Definition</div>}
          value={longDefinitionDefaultValue}
          onKeyDown={(event) => this.submitWordOnCtrlEnter(event)}
          ref={(inputComponent) => this.longDefinitionField = inputComponent} />

        <span id="errorMessage">{this.state.errorMessage}</span>
        
        <Button classes={(this.props.updateWord) ? 'edit-button' : 'add-button'} action={() => this.handleSubmit()} label={this.props.submitLabel} />

        <div id="updateConflict">{this.state.updateConflictMessage}</div>
      </div>
    );
  }
}
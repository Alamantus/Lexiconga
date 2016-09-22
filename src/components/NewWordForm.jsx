import React from 'react';

import {Input} from './Input';
import {TextArea} from './TextArea';
import {Button} from './Button';

export class NewWordForm extends React.Component {
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

  submitWordOnCtrlEnter() {
    var keyCode = (event.which ? event.which : event.keyCode);

    //Windows and Linux Chrome accept ctrl+enter as keyCode 10.
    if (keyCode === keyCodeFor('ctrlEnter') || (keyCode == keyCodeFor('enter') && event.ctrlKey)) {
      event.preventDefault();

      this.handleSubmit();
    }
  }

  handleSubmit() {
    if (this.formIsValid()) {
      this.props.addWord({
        name: this.wordField.state.value,
        pronunciation: this.pronunciationField.state.value,
        partOfSpeech: this.partOfSpeechField.state.value,
        simpleDefinition: this.simpleDefinitionField.state.value,
        longDefinition: this.longDefinitionField.state.value
      });

      this.clearForm()
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
    return (
      <form>
        <Input name='Word' ref={(inputComponent) => this.wordField = inputComponent} />

        <Input name='Pronunciation'
          helperLink={{
            url: "http://r12a.github.io/pickers/ipa/",
            label: "IPA Characters",
            hover: "IPA Character Picker located at http://r12a.github.io/pickers/ipa/"
          }}
          ref={(inputComponent) => this.pronunciationField = inputComponent} />

        <Input name='Part of Speech' ref={(inputComponent) => this.partOfSpeechField = inputComponent} />

        <Input name={<div style={{display: 'inline'}}>Definition/<wbr /><b className="wbr"></b>Equivalent Word(s)</div>}
          ref={(inputComponent) => this.simpleDefinitionField = inputComponent} />

        <TextArea id='newWordForm'
          name={<div style={{display: 'inline'}}>Explanation/<wbr /><b className="wbr"></b>Long Definition</div>}
          ref={(inputComponent) => this.longDefinitionField = inputComponent} />

        <span id="errorMessage">{this.state.errorMessage}</span>
        
        <Button action={() => this.handleSubmit()} label='Add Word' />

        <div id="updateConflict">{this.state.updateConflictMessage}</div>
      </form>
    );
  }
}
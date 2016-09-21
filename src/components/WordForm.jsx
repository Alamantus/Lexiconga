import React from 'react';

import {Input} from './Input';
import {TextArea} from './TextArea';
import {keyCodeFor} from '../js/helpers';

export class WordForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      errorMessage: '',
      updateConflictMessage: ''
    };
    
    this.isNewWord = (this.props.action == 'new');
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
    if (this.validate()) {

    }
  }

  validate() {
    
    return true;
  }

  confirmArea() {
    if (this.isNewWord) {
      return <button type="button" onClick={this.handleSubmit}>Add Word</button>;
    }
    return (
        <div id="editWordButtonArea">
          <button type="button" onClick={this.handleSubmit}>Edit Word</button>
          <button type="button" onClick={this.clearForm}>Cancel</button>
        </div>
    );
  }

  clearForm() {
    this.props.children.forEach((field) => {
      field.state.value = '';
    })
  }

  render() {
    return (
      <form>
        {this.props.children}
        <span id="errorMessage">{this.state.errorMessage}</span>
        {this.confirmArea}
        <div id="updateConflict">{this.state.updateConflictMessage}</div>
      </form>
    );
  }
}
import React from 'react';

import {Input} from './Input';
import {TextArea} from './TextArea';
import {Checkbox} from './Checkbox';
import {Button} from './Button';
import {FixedPage} from './FixedPage';

export class EditDictionaryForm extends React.Component {
  constructor(props) {
    super(props);

    // Declare local variables as null until mounted.
    this.nameField = null;
    this.descriptionField = null;
    this.partsOfSpeechField = null;
    this.allowDuplicatesField = null;
    this.caseSensitiveField = null;
    this.sortByEquivalentField = null;
    this.isCompleteField = null;
    this.isPublicField = null;
  }

  saveOnClose() {
    this.props.saveChanges({
      name: this.nameField.state.value,
      listTypeName: this.listTypeNameField.state.value,
      description: this.descriptionField.state.value,
      partsOfSpeech: this.partsOfSpeechField.state.value,
      allowDuplicates: this.allowDuplicatesField.state.value,
      caseSensitive: this.caseSensitiveField.state.value,
      sortByEquivalent: this.sortByEquivalentField.state.value,
      isComplete: this.isCompleteField.state.value,
      isPublic: this.isPublicField.state.value
    });
  }

  render() {
    return (
      <FixedPage buttonClasses='right' buttonText='Edit Dictionary' onHide={() => this.saveOnClose()}>
        
        <h2>Edit Dictionary</h2>

        <div className='settings-column'>

          <Input name='Dictionary Name'
            value={this.props.details.name}
            ref={(inputComponent) => this.nameField = inputComponent} />

          <TextArea name='Dictionary Details'
            value={this.props.details.description}
            ref={(inputComponent) => this.descriptionField = inputComponent} />

          <Input name='Parts of Speech'
            value={this.props.settings.partsOfSpeech}
            ref={(inputComponent) => this.partsOfSpeechField = inputComponent} />

          <Input name='Classification'
            value={this.props.details.listTypeName}
            helperLink={{
              action: () => alert('The word used to describe the list of words represented by this dictionary. By default, it is "Dictionary", but it could be "Lexicon" or some other classification.')
            }}
            ref={(inputComponent) => this.listTypeNameField = inputComponent} />

          <Checkbox name='Allow Duplicates'
            value={this.props.settings.allowDuplicates}
            ref={(inputComponent) => this.allowDuplicatesField = inputComponent} />

          <Checkbox name='Case-Sensitive'
            value={this.props.settings.caseSensitive}
            ref={(inputComponent) => this.caseSensitiveField = inputComponent} />

          <Checkbox name='Sort by Definition'
            value={this.props.settings.sortByEquivalent}
            ref={(inputComponent) => this.sortByEquivalentField = inputComponent} />

          <Checkbox name='Dictionary Is Complete'
            value={this.props.settings.isComplete}
            ref={(inputComponent) => this.isCompleteField = inputComponent} />

          <Checkbox name='Dictionary Is Public'
            value={this.props.settings.isPublic}
            ref={(inputComponent) => this.isPublicField = inputComponent} />

        </div>

      </FixedPage>
    );
  }
}
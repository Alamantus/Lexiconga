import React from 'react';

import {Button} from './Button';

export class Dictionary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // name: this.props.reference.name,
      // description: this.props.reference.description,
      // createdBy: this.props.reference.createdBy,
      // nextWordId: this.props.reference.nextWordId,
      // externalID: this.props.reference.externalID,
      // allowDuplicates: this.props.reference.settings.allowDuplicates,
      // caseSensitive: this.props.reference.settings.caseSensitive,
      // partsOfSpeech: this.props.reference.settings.partOfSpeech,
      // sortByEquivalent: this.props.reference.settings.sortByEquivalent,
      // isComplete: this.props.reference.settings.isComplete,
      // isPublic: this.props.reference.settings.isPublic
      dictionary: this.props.parent.state.details,
      settings: this.props.parent.state.settings
    }
  }

  render() {
    return (
      <div>
        <h1 id="dictionaryName">
          {this.state.dictionary.name}
        </h1>
        
        <h4 id="dictionaryBy">
          {this.state.dictionary.createdBy}
        </h4>
        <div id="incompleteNotice">
          Dictionary is complete: {this.state.settings.isComplete.toString()}
        </div>

        <div id="theDictionary">
          {this.props.children}
        </div>

        <Button
          action={() => {
            let tempSettings = this.state.settings;
            tempSettings.isComplete = !tempSettings.isComplete;
            this.setState({settings: tempSettings})
          }}
          label='Toggle State' />
      </div>
    );
  }
}
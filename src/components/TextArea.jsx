import React from 'react';
import {Input} from './Input';

import {getInputSelection, setSelectionRange} from '../js/helpers';

export class TextArea extends Input {
  constructor(props) {
    super(props);

    // Bind listeners
    this.handleMaximizeClick = this.handleMaximizeClick.bind(this);
  }

  handleMaximizeClick(event) {
    this.showFullScreenTextbox();
  }

  showFullScreenTextbox() {
    var sourceTextboxElement = document.getElementById(this.props.id);
    var targetTextboxElement = document.getElementById("fullScreenTextbox");
    document.getElementById("fullScreenTextboxLabel").innerHTML = this.props.name;
    var selection = getInputSelection(sourceTextboxElement);

    document.getElementById("expandedTextboxId").innerHTML = this.props.id;
    targetTextboxElement.value = sourceTextboxElement.value;
    document.getElementById("fullScreenTextboxScreen").style.display = "block";

    targetTextboxElement.focus();
    setSelectionRange(targetTextboxElement, selection.start, selection.end);
  }

  render() {
    return (
      <label>
        <span>
          {this.props.name}
          <span className="clickable inline-button" onClick={this.handleMaximizeClick}>Maximize</span>
        </span>
        <textarea id={this.props.id} onChange={this.handleOnChange} value={this.state.value} />
      </label>
    );
  }
}
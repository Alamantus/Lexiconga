import React from 'react';
import {Input} from './Input';

import {getInputSelection, setSelectionRange} from '../js/helpers';
import {Button} from './Button';
import {FixedPage} from './FixedPage';

export class TextArea extends Input {
  constructor(props) {
    super(props);

    // Bind listeners
    this.handleMaximizeClick = this.handleMaximizeClick.bind(this);
  }

  handleMaximizeClick() {
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

          <FixedPage id={this.props.id + '_textbox'} contentClass='no-scroll' buttonClasses='inline-button' buttonText='Maximize'>
            <label><span>{this.props.name}</span></label>

            <textarea id={this.props.id} className='fullscreen-textbox' onChange={this.handleOnChange} onKeyDown={this.handleOnKeyDown} value={this.state.value} />
          </FixedPage>

        </span>

        <textarea id={this.props.id} onChange={this.handleOnChange} onKeyDown={this.handleOnKeyDown} disabled={(this.state.isDisabled) ? 'disabled' : null} value={this.state.value} />

      </label>
    );
  }
}
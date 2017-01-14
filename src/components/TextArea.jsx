// import React from 'react';
import Inferno, {linkEvent} from 'inferno';
import {Input} from './Input';

import {getInputSelection, setSelectionRange} from '../js/helpers';
import {Button} from './Button';
import {FixedPage} from './FixedPage';

export class TextArea extends Input {
  constructor(props) {
    super(props);

    this.mainTextarea = null;
    this.maximizedTextarea = null;
  }

  handleMaximizedTextboxClose (instance, event) {
    instance.mainTextarea.value = event.currentTarget.value;
  }

  handleMaximizedTextboxOpen (instance, event) {
    instance.maximizedTextarea.value = event.currentTarget.value;
  }

  // Use a FixedPage for TextArea's fullscreen mode.
  render() {
    return (
      <div className='control'>
        <div className='level'>
          <div className='level-item'>
            <label className='label' for={this.generatedId}>
                {this.props.name}
            </label>
          </div>

          <div className='level-item'>
              <FixedPage id={this.generatedId + '_textbox'} contentClass='no-scroll' buttonClasses='maximize-button' buttonText='Maximize'>
                <label><span>{this.props.name}</span></label>

                <textarea id={this.generatedId} className='fullscreen-textbox'
                  onChange={linkEvent(this, this.handleMaximizedTextboxClose)}
                  onKeyDown={linkEvent(this, this.handleOnKeyDown)}
                  ref={(textarea) => {this.maximizedTextarea = textarea}} />
              </FixedPage>
          </div>

        </div>

        <textarea className='textarea' id={this.generatedId}
          onInput={linkEvent(this, this.handleOnChange)}
          onChange={linkEvent(this, this.handleMaximizedTextboxOpen)}
          onKeyDown={linkEvent(this, this.handleOnChange)} disabled={(this.state.isDisabled) ? 'disabled' : null}
          ref={(textarea) => {this.mainTextarea = textarea}} />

      </div>
    );
  }
}

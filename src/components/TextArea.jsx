import React from 'react';
import {Input} from './Input';

import {getInputSelection, setSelectionRange} from '../js/helpers';
import {Button} from './Button';
import {FixedPage} from './FixedPage';

export class TextArea extends Input {
  constructor(props) {
    super(props);
  }

  // Use a FixedPage for TextArea's fullscreen mode.
  render() {
    return (
      <label>
        <span>
          {this.props.name}

          <FixedPage id={this.props.id + '_textbox'} contentClass='no-scroll' buttonClasses='maximize-button' buttonText='Maximize'>
            <label><span>{this.props.name}</span></label>

            <textarea id={this.props.id} className='fullscreen-textbox' onChange={this.handleOnChange} onKeyDown={this.handleOnKeyDown} value={this.state.value} />
          </FixedPage>

        </span>

        <textarea id={this.props.id} onChange={this.handleOnChange} onKeyDown={this.handleOnKeyDown} disabled={(this.state.isDisabled) ? 'disabled' : null} value={this.state.value} />

      </label>
    );
  }
}

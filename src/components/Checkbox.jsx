// import React from 'react';
import Inferno from 'inferno';
import {Input} from './Input';

export class Checkbox extends Input {
  constructor(props) {
    super(props);

    this.state = {
      value: props.value || false
    , isDisabled: props.isDisabled || false
    };
  }
  
  // Whenever the input changes, update the value state of this component
  handleOnChange(event) {
    this.setState({
      value: event.target.checked
    });
  }

  render() {
    return (
      <label>
        <span>
          {this.props.name}
          {this.showHelperLink()}
        </span>
        <input type="checkbox" onInput={this.handleOnChange} checked={(this.state.value) ? 'checked' : null} disabled={(this.state.isDisabled) ? 'disabled' : null} />
      </label>
    );
  }
}

Checkbox.defaultProps = {
  doValidate: false
};
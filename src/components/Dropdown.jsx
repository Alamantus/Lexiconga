import React from 'react';
import {Input} from './Input';

export class Dropdown extends Input {
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

  parseOptions (optionsString) {
    let results = [];
    let options = optionsString.split(',');

    options.forEach((option) => {
      results.push(
        <option>
          {option.trim()}
        </option>
      );
    });

    return results;
  }

  render() {
    return (
      <label>
        <span>
          {this.props.name}
          {this.showHelperLink()}
        </span>
        <select onChange={this.handleOnChange} disabled={(this.state.isDisabled) ? 'disabled' : null}>
          {this.parseOptions(this.props.optionsList)}
        </select>
      </label>
    );
  }
}

Dropdown.defaultProps = {
  doValidate: false
};
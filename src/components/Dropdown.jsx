// import React from 'react';
import Inferno from 'inferno';
import {Input} from './Input';

import {htmlEntities} from '../js/helpers';

export class Dropdown extends Input {
  constructor(props) {
    super(props);

    this.state = {
      value: props.value || ' '
    , isDisabled: props.isDisabled || false
    };
  }
  
  // Whenever the input changes, update the value state of this component
  handleOnChange(event) {
    this.setState({
      value: event.currentTarget.value
    });
  }

  parseOptions (optionsString) {
    let results = [];
    let options = optionsString.split(',');

    options.forEach((option, index) => {
      let optionValue = htmlEntities(option.trim());

      results.push(
        <option key={`o:${index}v:${optionValue}`} value={optionValue}>
          {option.trim()}
        </option>
      );
    });

    return results;
  }

  render() {
    return (
      <label className='control'>
        <div className='level'>
          <span className='label level-item'>
            {this.props.name}
          </span>
          <span className='level-item'>
            {this.showHelperLink()}
          </span>
        </div>
        <select value={this.state.value} onChange={this.handleOnChange} disabled={(this.state.isDisabled) ? 'disabled' : null}>
          <option value=" "></option>
          {this.parseOptions(this.props.optionsList)}
        </select>
      </label>
    );
  }
}

Dropdown.defaultProps = {
  doValidate: false
};
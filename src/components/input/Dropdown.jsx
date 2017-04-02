// import React from 'react';
import Inferno from 'inferno';
import {Input} from './Input';

import {htmlEntities} from '../../js/helpers';

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
      <div className='control'>

        <div className='level is-marginless'>

          <div className='level-item'>
            <label className='label' for={this.generatedId}>
              {this.props.name}
            </label>
          </div>

          <div className='level-item'>
            {this.showHelperLink()}
          </div>

        </div>

        <p className='control'>
          <span className='select'>
            <select value=' ' onChange={this.handleOnChange} disabled={(this.state.isDisabled) ? 'disabled' : null}>
              <option value=' '></option>
              {this.parseOptions(this.props.optionsList)}
            </select>
          </span>
        </p>
      </div>
    );
  }
}

Dropdown.defaultProps = {
  doValidate: false
};
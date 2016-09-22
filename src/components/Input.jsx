import React from 'react';

import {Button} from './Button';

export class Input extends React.Component {
  constructor(props) {
    super(props);

    // this.defaultProps = {
    //   name: props.name || 'Field',
    //   helperLink: props.helperLink || {url: '#', label: '', hover: ''},
    //   doValidate: props.doValidate || true
    // };

    this.state = {
      value: props.value || ''
    };

    // Bind listeners
    this.handleOnChange = this.handleOnChange.bind(this);
  }

  handleOnChange(event) {
    this.setValue(event);
  }
  
  // Whenever the input changes we update the value state of this component
  setValue(event) {
    this.setState({
      isValid: !(this.props.doValidate && event.currentTarget.value === ''),
      value: event.currentTarget.value
    });
  }

  showHelperLink() {
    if (this.props.helperLink) {
      return (
        <a className='clickable inline-button' href={this.props.helperLink.url} target='_blank' title={this.props.helperLink.hover}>
          {this.props.helperLink.label}
        </a>
      );
    }
  }

  render() {
    return (
      <label>
        <span>
          {this.props.name}
          {this.showHelperLink()}
        </span>
        <input type="text" onChange={this.handleOnChange} value={this.state.value} />
      </label>
    );
  }
}

Input.defaultProps = {
  name: 'Field',
  doValidate: true
};
// import React from 'react';
import Inferno, {linkEvent} from 'inferno';
import Component from 'inferno-component';

import {Button} from './Button';

function handleOnChange(instance, event) {
  console.log('changing');
  instance.setState({
    isValid: !(instance.props.doValidate && event.currentTarget.value === ''),
    value: event.currentTarget.value
  });
}

// export class Input extends React.Component {
export class Input extends Component {
  constructor(props) {
    super(props);

    // this.defaultProps = {
    //   name: props.name || 'Field',
    //   helperLink: props.helperLink || {url: '#', label: '', hover: ''},
    //   doValidate: props.doValidate || true
    // };

    this.generatedId = 'input' + props.idManager.nextStr;

    this.state = {
      value: props.value || '',
      isDisabled: props.isDisabled || false
    };

    // Bind listeners
    // this.handleOnChange = this.handleOnChange.bind(this);
    this.handleOnKeyDown = this.handleOnKeyDown.bind(this);
  }
  
  // Whenever the input changes we update the value state of this component
  handleOnChange(instance, event) {
    instance.setState({
      isValid: !(instance.props.doValidate && event.currentTarget.value === ''),
      value: event.currentTarget.value
    });
  }

  handleOnKeyDown(instance, event) {
    if (instance.props.onKeyDown) {
      instance.props.onKeyDown(event);
    }
  }

  showHelperLink() {
    if (this.props.helperLink) {
      if (this.props.helperLink.url) {
        return (
          <a className='button is-small inline-button' href={this.props.helperLink.url} target='_blank' title={this.props.helperLink.hover}>
            {this.props.helperLink.label}
          </a>
        );
      } else {
        return (
            <Button classes='inline-button'
              action={this.props.helperLink.action}
              label={this.props.helperLink.label || '?'} />
        );
      }
    }
  }

  clearField() {
    this.setState({value: ''});
  }

  toggleFieldEnabled() {
    this.setState({
      isDisabled: !this.state.isDisabled
    })
  }

  render() {
    return (
      <div>

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
            <input
              className='input'
              id={this.generatedId}
              type="text"
              onInput={linkEvent(this, this.handleOnChange)}
              onKeyDown={linkEvent(this, this.handleOnKeyDown)}
              disabled={(this.state.isDisabled) ? 'disabled' : null} />
          </p>

      </div>
    );
  }
}

Input.defaultProps = {
  name: '',
  doValidate: false
};
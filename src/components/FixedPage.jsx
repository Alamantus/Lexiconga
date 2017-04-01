// import React from 'react';
import Inferno from 'inferno';
import Component from 'inferno-component';

import {Button} from './Button';

// Creates a page that floats above other elements when a connected button is clicked.
// export class FixedPage extends React.Component {
export class FixedPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      display: false
    };

    // Bind each instance to its own show/hide watchers.
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
  }

  conditionalDisplay() {
    if (this.state.display) {
      let contentClass = 'modal-content fixed-page-content';

      if (this.props.contentClass) {
        contentClass += ' ' + this.props.contentClass;
      }

      return (
        <div id={this.props.id} className='modal is-active'>

          <div className='modal-background' onClick={this.hide}></div>

          <div className={contentClass}>
            <div className='box'>
            
              <Button classes='modal-close'
                action={this.hide}
                label='Close' />

              {this.props.children}

            </div>
          </div>

        </div>
      );
    } else {
      return (
        <Button classes={this.props.buttonClasses}
          action={this.show}
          label={this.props.buttonText} />
      );
    }
  }

  show() {
    this.setState({
      display: true
    });
  }

  hide() {
    if (this.props.onHide) {
      this.props.onHide();
    }

    this.setState({
      display: false
    });
  }

  render() {
    return (
      <div className='inline'>
        {this.conditionalDisplay()}
      </div>
    );
  }
}
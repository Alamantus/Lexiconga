import React from 'react';

import {Button} from './Button';

export class FixedPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      display: false
    };

    this.hide = this.hide.bind(this);
  }

  conditionalDisplay() {
    if (this.state.display) {
      let contentClass = 'fixed-page-content';

      if (this.props.contentClass) {
        contentClass += ' ' + this.props.contentClass;
      }

      return (
        <div id={this.props.id} className='fixed-page-container'>

          <div className='fixed-page-background-fade' onClick={this.hide}></div>

          <div className={contentClass}>
            
            <Button classes='right-button'
              action={this.hide}
              label='Close' />

            {this.props.children}

          </div>

        </div>
      );
    } else {
      return (
        <Button classes={this.props.buttonClasses}
          action={() => this.show()}
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
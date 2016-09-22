import React from 'react';

export class Button extends React.Component {
  constructor(props) {
    super(props);
  }

  processClasses() {
    var classes = 'clickable';

    if (this.props.classes) {
      classes += ' ' + this.props.classes;
    }

    return classes;
  }

  render() {
    return (
      <span
        id={this.props.id}
        className={this.processClasses()}
        onClick={this.props.action}>
        {this.props.label}
      </span>
    );
  }
}

Button.defaultProps = {
  action: () => console.log('no action bound to button')
}
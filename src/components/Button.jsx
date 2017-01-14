// import React from 'react';
import Inferno from 'inferno';
import Component from 'inferno-component';

// Creates a clickable <span> tag with an onclick action.
// export class Button extends React.Component {
export class Button extends Component {
  constructor(props) {
    super(props);
  }

  // Always give the Button a 'clickable' class and then add any others.
  processClasses() {
    var classes = 'button is-small';

    if (this.props.classes) {
      classes += ' ' + this.props.classes;
    }

    return classes;
  }

  render() {
    return (
      <a
        id={this.props.id}
        className={this.processClasses()}
        onClick={this.props.action}>
        {this.props.label}
      </a>
    );
  }
}

Button.defaultProps = {
  action: () => console.log('no action bound to button')
}
import React from 'react';
import marked from 'marked';

import {WordForm} from './WordForm';
import {Button} from './Button';

const saveIcon = <i>&#128190;</i>;
const editIcon = <i>&#128393;</i>;

// A component to show dictionary information in a tabbed interface.
export class InfoDisplay extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isDisplayed: props.startDisplayed || false,
      tabDisplay: 0
    };
  }

  showTabbedInterface() {
    if (this.state.isDisplayed) {
      return (
        <div className='dictionary-info'>

          <Button classes={'inline-button' + ((this.state.tabDisplay === 0) ? ' selected-tab' : '')}
            action={() => this.changeTab(0)}
            label='Description' />
          
          <Button classes={'inline-button' + ((this.state.tabDisplay === 1) ? ' selected-tab' : '')}
            action={() => this.changeTab(1)}
            label='Details' />

          <div className='tabbed-interface'>
            {this.displaySelectedTab()}
          </div>

        </div>
      );
    }
  }

  toggleDisplay() {
    this.setState({
      isDisplayed: !this.state.isDisplayed
    });
  }

  displaySelectedTab() {
    switch(this.state.tabDisplay) {
      case 1: {
        return (
          <div>
            {this.showDetails()}
          </div>
        );
        break;
      }
      default: {
        return (
          <div>
            {this.showDescription()}
          </div>
        );
        break;
      }
    }
  }

  showDescription() {
    return (
      <div dangerouslySetInnerHTML={{__html: marked(this.props.details.description)}} />
    );
  }

  showDetails() {
    return (
      <div>
      
        <h4 className='created-by'>
          Created By {this.props.details.createdBy}
        </h4>

        <h5 className='total-words'>
          {this.props.numberOfWords} Total Word{(this.props.numberOfWords !== 1) ? 's' : ''}
        </h5>

        <h5 className='incopmlete-notice'>
          {(!this.props.isComplete) ? 'Note: This dictionary is not yet complete and is likely to change.' : ''}
        </h5>

      </div>
    );
  }

  changeTab(tabNumber) {
    this.setState({
      tabDisplay: tabNumber
    });
  }

  render() {
    return (
      <div>
        <Button
          action={() => this.toggleDisplay()}
          label={((this.state.isDisplayed) ? 'Hide' : 'Show') + ' Info'} />

        {this.showTabbedInterface()}

      </div>
    );
  }
}

InfoDisplay.defaultProps = {
  isEditing: false
}
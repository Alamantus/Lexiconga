import Inferno from 'inferno';
import Component from 'inferno-component';
import marked from 'marked';

import helper from '../../../Helper';

import { Modal } from '../../structure/Modal';

import { EditDictionaryForm } from './EditDictionaryForm';
import { EditLinguisticsForm } from './EditLinguisticsForm';

const DISPLAY = {
  DETAILS: 1,
  LINGUISTICS: 2,
  SETTINGS: 3,
}

export class EditDictionaryModal extends Component {
  constructor (props) {
    super(props);

    this.state = {
      currentDisplay: DISPLAY.DETAILS,

      name: props.name,
      specification: props.specification,
      description: props.description,
      partsOfSpeech: props.partsOfSpeech.join('\n'),

      hasChanged: false,
    }
  }

  hasChanged () {
    return (
      this.state.name != this.props.name
      || this.state.specification != this.props.specification
      || this.state.description != this.props.description
      || this.state.partsOfSpeech != this.props.partsOfSpeech.join('\n')
    );
  }

  toggleDisplay (display) {
    this.setState({
      currentDisplay: display,
    });
  }

  displaySection () {
    let displayJSX;

    switch(this.state.currentDisplay) {
      case DISPLAY.DETAILS : {
        displayJSX = (
          <EditDictionaryForm
            editDictionaryModal={ this }
            name={ this.state.name }
            specification={ this.state.specification }
            description={ this.state.description }
          />
        );
        break;
      }

      case DISPLAY.LINGUISTICS : {
        displayJSX = (
          <EditLinguisticsForm
            editDictionaryModal={ this }
            partsOfSpeech={ this.state.partsOfSpeech }
          />
        );
        break;
      }

      case DISPLAY.SETTINGS : {
        displayJSX = (
          <div className='content'>
            <p>Settings!</p>
          </div>
        );
        break;
      }
    }

    return (
      <div className='box'>
        { displayJSX }
      </div>
    );
  }

  save () {
    const updatedDetails = {};

    if (this.state.name !== this.props.name) {
      updatedDetails['name'] = this.state.name;
    }

    if (this.state.specification !== this.props.specification) {
      updatedDetails['specification'] = this.state.specification;
    }

    if (this.state.description !== this.props.description) {
      updatedDetails['description'] = this.state.description;
    }

    if (this.state.partsOfSpeech !== this.props.partsOfSpeech.join('\n')) {
      updatedDetails['partsOfSpeech'] = this.state.partsOfSpeech.split('\n')
        .filter((value) => { return value !== '' })
        .map((value) => { return value.trim() });
    }

    console.log(updatedDetails);

    this.props.updater.updateDictionaryDetails(updatedDetails)
      .then(() => {
        this.setState({ hasChanged: false });
      })
      .catch(errorMessage => {
        console.error(errorMessage);
      });
  }

  render () {
    const { currentDisplay, hasChanged } = this.state;

    return (
      <Modal title={ `Edit ${ this.props.specification }` }
        buttonText={ `Edit ${ this.props.specification }` }
        footerAlign='right'
        footerContent={
          (
            <div>
              <button className='button is-success'
                disabled={ !hasChanged }
                onClick={ this.save.bind(this) }
              >
                Save
              </button>
            </div>
          )
        }
      >

        <div className='tabs'>
          <ul>
            <li className={ (currentDisplay === DISPLAY.DETAILS) ? 'is-active' : null }>
              <a onClick={ this.toggleDisplay.bind(this, DISPLAY.DETAILS) }>
                Details
              </a>
            </li>
            <li className={ (currentDisplay === DISPLAY.LINGUISTICS) ? 'is-active' : null }>
              <a onClick={ this.toggleDisplay.bind(this, DISPLAY.LINGUISTICS) }>
                Linguistics
              </a>
            </li>
            <li className={ (currentDisplay === DISPLAY.SETTINGS) ? 'is-active' : null }>
              <a onClick={ this.toggleDisplay.bind(this, DISPLAY.SETTINGS) }>
                Settings
              </a>
            </li>
          </ul>
        </div>

        { this.displaySection() }

      </Modal>
    );
  }
}

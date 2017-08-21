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
      alphabeticalOrder: props.alphabeticalOrder.join('\n'),
      partsOfSpeech: props.partsOfSpeech.join('\n'),
      consonants: props.details.phonology.consonants.join(' '),
      vowels: props.details.phonology.vowels.join(' '),
      blends: props.details.phonology.blends.join(' '),
      onset: props.details.phonology.phonotactics.onset.join(' '),
      nucleus: props.details.phonology.phonotactics.nucleus.join(' '),
      coda: props.details.phonology.phonotactics.coda.join(' '),
      exceptions: props.details.phonology.phonotactics.exceptions,

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
            alphabeticalOrder={ this.state.alphabeticalOrder }
          />
        );
        break;
      }

      case DISPLAY.LINGUISTICS : {
        displayJSX = (
          <EditLinguisticsForm
            editDictionaryModal={ this }
            partsOfSpeech={ this.state.partsOfSpeech }
            consonants={ this.state.consonants }
            vowels={ this.state.vowels }
            blends={ this.state.blends }
            onset={ this.state.onset }
            nucleus={ this.state.nucleus }
            coda={ this.state.coda }
            exceptions={ this.state.exceptions }
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
      updatedDetails['name'] = this.state.name.trim();
    }

    if (this.state.specification !== this.props.specification) {
      updatedDetails['specification'] = this.state.specification.trim();
    }

    if (this.state.description !== this.props.description) {
      updatedDetails['description'] = this.state.description;
    }

    if (this.state.alphabeticalOrder !== this.props.alphabeticalOrder.join('\n')) {
      updatedDetails['alphabeticalOrder'] = this.state.alphabeticalOrder.split('\n')
        .filter((value) => { return value !== '' })
        .map((value) => { return value.trim() });
    }

    if (this.state.partsOfSpeech !== this.props.partsOfSpeech.join('\n')) {
      updatedDetails['partsOfSpeech'] = this.state.partsOfSpeech.split('\n')
        .filter((value) => { return value !== '' })
        .map((value) => { return value.trim() });
    }

    if (this.state.alphabeticalOrder !== this.props.alphabeticalOrder.join('\n')) {
      updatedDetails['alphabeticalOrder'] = this.state.alphabeticalOrder.split('\n')
        .filter((value) => { return value !== '' })
        .map((value) => { return value.trim() });
    }

    if (this.state.consonants !== this.props.details.phonology.consonants.join(' ')) {
      updatedDetails['consonants'] = this.state.consonants.split(' ')
        .filter((value) => { return value !== '' })
        .map((value) => { return value.trim() });
    }

    if (this.state.vowels !== this.props.details.phonology.vowels.join(' ')) {
      updatedDetails['vowels'] = this.state.vowels.split(' ')
        .filter((value) => { return value !== '' })
        .map((value) => { return value.trim() });
    }

    if (this.state.blends !== this.props.details.phonology.blends.join(' ')) {
      updatedDetails['blends'] = this.state.blends.split(' ')
        .filter((value) => { return value !== '' })
        .map((value) => { return value.trim() });
    }

    if (this.state.onset !== this.props.details.phonology.phonotactics.onset.join(' ')) {
      updatedDetails['onset'] = this.state.onset.split(' ')
        .filter((value) => { return value !== '' })
        .map((value) => { return value.trim() });
    }

    if (this.state.nucleus !== this.props.details.phonology.phonotactics.nucleus.join(' ')) {
      updatedDetails['nucleus'] = this.state.nucleus.split(' ')
        .filter((value) => { return value !== '' })
        .map((value) => { return value.trim() });
    }

    if (this.state.coda !== this.props.details.phonology.phonotactics.coda.join(' ')) {
      updatedDetails['coda'] = this.state.coda.split(' ')
        .filter((value) => { return value !== '' })
        .map((value) => { return value.trim() });
    }

    if (this.state.exceptions !== this.props.details.phonology.phonotactics.exceptions) {
      updatedDetails['exceptions'] = this.state.exceptions;
    }

    // console.log(updatedDetails);

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

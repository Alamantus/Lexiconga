import Inferno from 'inferno';
import Component from 'inferno-component';
import PropTypes from 'prop-types';
import marked from 'marked';

import { Modal } from '../../structure/Modal';

import { EditDictionaryForm } from './EditDictionaryForm';
import { EditLinguisticsForm } from './EditLinguisticsForm';
import { EditSettingsForm } from './EditSettingsForm';

const DISPLAY = {
  DETAILS: 1,
  LINGUISTICS: 2,
  SETTINGS: 3,
}

export class EditDictionaryModal extends Component {
  constructor (props) {
    super(props);

    PropTypes.checkPropTypes({
      name: PropTypes.string,
      specification: PropTypes.string,
      description: PropTypes.string,
      alphabeticalOrder: PropTypes.array,
      partsOfSpeech: PropTypes.array,
      details: PropTypes.object,
      settings: PropTypes.object,
      isLoggedIn: PropTypes.bool,
    }, props, 'prop', 'EditDictionaryModal');

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
      onset: props.details.phonology.phonotactics.onset.join('\n'),
      nucleus: props.details.phonology.phonotactics.nucleus.join('\n'),
      coda: props.details.phonology.phonotactics.coda.join('\n'),
      exceptions: props.details.phonology.phonotactics.exceptions,
      orthographyNotes: props.details.orthography.notes,

      allowDuplicates: props.settings.allowDuplicates,
      caseSensitive: props.settings.caseSensitive,
      sortByDefinition: props.settings.sortByDefinition,
      isComplete: props.settings.isComplete,
      isPublic: props.settings.isPublic,

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
            orthographyNotes={ this.state.orthographyNotes }
          />
        );
        break;
      }

      case DISPLAY.SETTINGS : {
        displayJSX = (
          <EditSettingsForm
            editDictionaryModal={ this }
            allowDuplicates={ this.state.allowDuplicates }
            caseSensitive={ this.state.caseSensitive }
            sortByDefinition={ this.state.sortByDefinition }
            isComplete={ this.state.isComplete }
            specification={ this.state.specification }
            isLoggedIn={ this.props.isLoggedIn }
            isPublic={ this.state.isPublic }
          />
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

    if (this.state.onset !== this.props.details.phonology.phonotactics.onset.join('\n')) {
      updatedDetails['onset'] = this.state.onset.split('\n')
        .filter((value) => { return value !== '' })
        .map((value) => { return value.trim() });
    }

    if (this.state.nucleus !== this.props.details.phonology.phonotactics.nucleus.join('\n')) {
      updatedDetails['nucleus'] = this.state.nucleus.split('\n')
        .filter((value) => { return value !== '' })
        .map((value) => { return value.trim() });
    }

    if (this.state.coda !== this.props.details.phonology.phonotactics.coda.join('\n')) {
      updatedDetails['coda'] = this.state.coda.split('\n')
        .filter((value) => { return value !== '' })
        .map((value) => { return value.trim() });
    }

    if (this.state.exceptions !== this.props.details.phonology.phonotactics.exceptions) {
      updatedDetails['exceptions'] = this.state.exceptions;
    }

    if (this.state.orthographyNotes !== this.props.details.orthography.notes) {
      updatedDetails['orthographyNotes'] = this.state.orthographyNotes;
    }

    if (this.state.allowDuplicates !== this.props.settings.allowDuplicates) {
      updatedDetails['allowDuplicates'] = this.state.allowDuplicates;
    }

    if (this.state.caseSensitive !== this.props.settings.caseSensitive) {
      updatedDetails['caseSensitive'] = this.state.caseSensitive;
    }

    if (this.state.sortByDefinition !== this.props.settings.sortByDefinition) {
      updatedDetails['sortByDefinition'] = this.state.sortByDefinition;
    }

    if (this.state.isComplete !== this.props.settings.isComplete) {
      updatedDetails['isComplete'] = this.state.isComplete;
    }

    if (this.state.isPublic !== this.props.settings.isPublic) {
      updatedDetails['isPublic'] = this.state.isPublic;
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
    const { specification, settings, isLoggedIn } = this.props;

    return (
      <Modal title={ `Edit ${ specification }` }
        buttonText={ `Edit ${ specification }` }
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

        {!settings.isComplete
          ? [(
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
            ),
            this.displaySection(),
          ] : (
            <div className='columns'>

              <div className='column has-text-centered'>
                { specification } marked complete<br />
                <a className='button is-warning is-small'
                  onClick={() => {
                    this.setState({ isComplete: false, currentDisplay: DISPLAY.SETTINGS }, () => {
                      this.save();
                    })
                  }}>
                  Mark it incomplete
                </a>
              </div>

              {isLoggedIn
               && (
                  <div className='column has-text-centered'>
                    Your dictionary is <strong>{ settings.isPublic ? 'Public' : 'Private'}</strong>
                    {settings.isPublic
                      && (
                        [
                          ' You can view it at',
                          <br />,
                          <a className='button is-text is-small'
                            onClick={() => console.log('set up copying to clipboard')}>
                            PUBLIC_LINK
                          </a>,
                        ]
                      )}
                    <br />
                    <a className='button is-small'
                      onClick={() => {
                        this.setState({ isPublic: !settings.isPublic }, () => {
                          this.save();
                        })
                      }}>
                      Mark it { settings.isPublic ? 'Private' : 'Public'}
                    </a>
                  </div>
                )}

            </div>
          )
        }
      </Modal>
    );
  }
}

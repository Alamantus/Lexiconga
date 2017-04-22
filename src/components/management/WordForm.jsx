import Inferno from 'inferno';
import Component from 'inferno-component';

import {IPAField} from './IPAField';
import {Word} from '../../managers/Word';

export class WordForm extends Component {
  constructor (props) {
    super(props);

    this.state = {
      wordName: this.props.name || ''
    , wordPronunciation: this.props.pronunciation || ''
    , wordPartOfSpeech: this.props.partOfSpeech || ''
    , wordDefinition: this.props.definition || ''
    , wordDetails: this.props.details || ''

    , nameIsValid: true
    , pronunciationIsValid: true
    , partOfSpeechIsValid: true
    , definitionIsValid: true
    , detailsIsValid: true
    }
  }

  isValidWord () {
    let nameIsValid = true
    , definitionIsValid = true
    , detailsIsValid = true;
    
    if (this.state.wordName === '') {
      nameIsValid = false;
    }

    if (this.state.wordPartOfSpeech === '') {
      // popup(?) confirming no part of speech.
    }

    if (this.state.wordDefinition === ''
        && this.state.wordDetails === '') {
      definitionIsValid = false;
      detailsIsValid = false;
    }

    this.setState({
      nameIsValid
    , definitionIsValid
    , detailsIsValid
    });

    return nameIsValid == true && definitionIsValid == true && detailsIsValid == true;
  }

  createWord () {
    const word = new Word({
      name: this.state.wordName
    , pronunciation: this.state.wordPronunciation
    , partOfSpeech: this.state.wordPartOfSpeech
    , definition: this.state.wordDefinition
    , details: this.state.wordDetails
    });


    if (this.isValidWord()) {
      word.create()
      .then(() => {
        this.clearForm();
      });
    }
  }

  clearForm () {
    this.setState({
      wordName: ''
    , wordPronunciation: ''
    , wordPartOfSpeech: ''
    , wordDefinition: ''
    , wordDetails: ''
    });
  }

  render () {
    return (
      <div className='box'>
        <div className='field'>
          <label className='label'>Word</label>
          <p className='control'>
            <input className={`input${(!this.state.nameIsValid) ? ' is-danger' : ''}`}
              type='text' placeholder='Required'
              value={this.state.wordName}
              onChange={(event) => {
                this.setState({ wordName: event.target.value });
              }} />
              {(!this.state.nameIsValid)
                ? (
                  <span className='help is-danger'>You must specify the word.</span>
                ) : null}
          </p>
        </div>

        <IPAField
          onChange={newValue => this.setState({ wordPronunciation: newValue })} />

        <div className='field'>
          <label className='label'>Part of Speech</label>
          <p className='control'>
            <span className='select'>
              <select value={this.state.wordPartOfSpeech}
                onChange={event => {
                  this.setState({ wordPartOfSpeech: event.target.value });
                }}>
                <option value=''></option>
                {this.props.partsOfSpeech.map((partOfSpeech) => {
                  return (
                    <option value={partOfSpeech}>{partOfSpeech}</option>
                  );
                })}
              </select>
            </span>
          </p>
        </div>

        <div className='field'>
          <label className='label'>Definition</label>
          <p className='control'>
            <input className={`input${(!this.state.definitionIsValid) ? ' is-danger' : ''}`}
              type='text' placeholder='Equivalent word(s)'
              value={this.state.wordDefinition}
              onChange={(event) => {
                this.setState({ wordDefinition: event.target.value })
              }} />
              {(!this.state.definitionIsValid)
                ? (
                  <span className='help is-danger'>
                    You must at least enter a Definition if excluding Details.
                  </span>
                ) : null}
          </p>
        </div>
        
        <div className='field'>
          <label className='label'>Details</label>
          <p className='control'>
            <textarea className={`textarea${(!this.state.detailsIsValid) ? ' is-danger' : ''}`}
              placeholder='Explanation of word (Markdown enabled)'
              onChange={(event) => {
                this.setState({ wordDetails: event.target.value });
              }}>
              {this.state.wordDetails}
            </textarea>
              {(!this.state.detailsIsValid)
                ? (
                  <span className='help is-danger'>
                    You must at least enter Details if excluding a Definition.
                  </span>
                ) : null}
          </p>
        </div>

        <div className='field'>
          <p className='control'>
            <a className='button is-primary'
              onClick={() => {
                this.createWord();
              }}>
              Create
            </a>
          </p>
        </div>
      </div>
    );
  }
}

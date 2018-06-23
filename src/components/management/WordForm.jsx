import Inferno from 'inferno';
import { Component } from 'inferno';
import PropTypes from 'prop-types';
import store from 'store';

import dictionaryData from '../../managers/DictionaryData';
import { DEFAULT_USER_DATA } from '../../Constants';
import { IPAField } from './IPAField';
import { LargeTextArea } from './LargeTextArea';
import { Word } from '../../managers/Word';

export class WordForm extends Component {
  constructor (props) {
    super(props);

    PropTypes.checkPropTypes({
      word: PropTypes.object,
      callback: PropTypes.func,
      updateDisplay: PropTypes.func,
    }, props, 'prop', 'WordForm');

    this.state = {
      wordName: props.word ? props.word.name : '',
      wordPronunciation: props.word ? props.word.pronunciation : '',
      wordPartOfSpeech: props.word ? props.word.partOfSpeech : '',
      wordDefinition: props.word ? props.word.definition : '',
      wordDetails: props.word ? props.word.details : '',

      nameIsValid: true,
      pronunciationIsValid: true,
      partOfSpeechIsValid: true,
      definitionIsValid: true,
      detailsIsValid: true,
    }
  }

  isValidWord () {
    let nameIsValid = true,
    definitionIsValid = true,
    detailsIsValid = true;
    
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
      nameIsValid,
      definitionIsValid,
      detailsIsValid,
    });

    return nameIsValid == true && definitionIsValid == true && detailsIsValid == true;
  }

  submitWord () {
    const word = new Word(Object.assign((this.props.word ? this.props.word : {}), {
      name: this.state.wordName,
      pronunciation: this.state.wordPronunciation,
      partOfSpeech: this.state.wordPartOfSpeech,
      definition: this.state.wordDefinition,
      details: this.state.wordDetails,
    }));

    if (this.isValidWord()) {
      // Need to trigger a WordsList re-render after success.
      let wordAction;
      if (this.props.word) {
        wordAction = word.update()
        .then(() => {
          this.props.callback();
        })
      } else {
        wordAction = word.create()
        .then(() => {
          this.clearForm();
        });
      }

      wordAction.then(() => {
        this.props.updateDisplay();
      })
    }
  }

  clearForm () {
    this.setState({
      wordName: '',
      wordPronunciation: '',
      wordPartOfSpeech: '',
      wordDefinition: '',
      wordDetails: '',
    });
  }

  render () {
    return (
      <div className='box'>
        <div className='field'>
          <label className='label'>Word</label>
          <div className='control'>
            <input className={ `input${(!this.state.nameIsValid) ? ' is-danger' : ''}` }
              type='text' placeholder='Required'
              value={ this.state.wordName }
              onInput={(event) => {
                this.setState({ wordName: event.target.value });
              }} />
              {(!this.state.nameIsValid)
                ? (
                  <span className='help is-danger'>You must specify the word.</span>
                ) : null}
          </div>
        </div>

        <IPAField value={ this.state.wordPronunciation }
          useIPASetting={ true }
          onChange={ (newValue) => this.setState({ wordPronunciation: newValue }) } />

        <div className='field'>
          <label className='label'>Part of Speech</label>
          <div className='control'>
            <span className='select'>
              <select value={ this.state.wordPartOfSpeech }
                onChange={(event) => {
                  this.setState({ wordPartOfSpeech: event.target.value });
                }}>
                <option value=''></option>
                {dictionaryData.partsOfSpeech.map((partOfSpeech) => {
                  return (
                    <option value={ partOfSpeech }>
                      { partOfSpeech }
                    </option>
                  );
                })}
              </select>
            </span>
          </div>
        </div>

        <div className='field'>
          <label className='label'>Definition</label>
          <div className='control'>
            <input className={ `input${(!this.state.definitionIsValid) ? ' is-danger' : ''}` }
              type='text' placeholder='Equivalent word(s)'
              value={ this.state.wordDefinition }
              onInput={(event) => {
                this.setState({ wordDefinition: event.target.value })
              }} />
              {(!this.state.definitionIsValid)
                ? (
                  <span className='help is-danger'>
                    You must at least enter a Definition if excluding Details.
                  </span>
                ) : null}
          </div>
        </div>
        
        <LargeTextArea
          label='Details'
          value={ this.state.wordDetails }
          placeholder='Explanation of word (Markdown enabled)'
          isValid={ this.state.detailsIsValid }
          invalidText='You must at least enter Details if excluding a Definition.'
          onChange={(event) => {
            this.setState({ wordDetails: event.target.value });
          }} />

        {this.props.word
          ? (
            <div className='field is-grouped'>
              <div className='control'>
                <a className='button is-text'
                  onClick={() => {
                    this.props.callback();
                  }}>
                  Cancel
                </a>
              </div>
              <div className='control'>
                <a className='button is-primary'
                  onClick={() => {
                    this.submitWord();
                  }}>
                  Update
                </a>
              </div>
            </div>
          ) : (
            <div className='field'>
              <div className='control'>
                <a className='button is-primary'
                  onClick={() => {
                    this.submitWord();
                  }}>
                  Create
                </a>
              </div>
            </div>
          )
        }
      </div>
    );
  }
}

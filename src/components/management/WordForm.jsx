import Inferno from 'inferno';
import Component from 'inferno-component';
import PropTypes from 'prop-types';

import dictionaryData from '../../managers/DictionaryData';
import { IPAField } from './IPAField';
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
          <p className='control'>
            <input className={ `input${(!this.state.nameIsValid) ? ' is-danger' : ''}` }
              type='text' placeholder='Required'
              value={ this.state.wordName }
              onChange={(event) => {
                this.setState({ wordName: event.target.value });
              }} />
              {(!this.state.nameIsValid)
                ? (
                  <span className='help is-danger'>You must specify the word.</span>
                ) : null}
          </p>
        </div>

        <IPAField value={ this.state.wordPronunciation }
          onChange={ (newValue) => this.setState({ wordPronunciation: newValue }) } />

        <div className='field'>
          <label className='label'>Part of Speech</label>
          <p className='control'>
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
          </p>
        </div>

        <div className='field'>
          <label className='label'>Definition</label>
          <p className='control'>
            <input className={ `input${(!this.state.definitionIsValid) ? ' is-danger' : ''}` }
              type='text' placeholder='Equivalent word(s)'
              value={ this.state.wordDefinition }
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
            <textarea className={ `textarea${(!this.state.detailsIsValid) ? ' is-danger' : ''}` }
              placeholder='Explanation of word (Markdown enabled)'
              value={ this.state.wordDetails }
              onChange={(event) => {
                this.setState({ wordDetails: event.target.value });
              }} />
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
                this.submitWord();
              }}>
              Create
            </a>
          </p>
        </div>
      </div>
    );
  }
}

import Inferno from 'inferno';
import Component from 'inferno-component';

import Helper from '../../Helper';

export class IPAField extends Component {
  constructor (props) {
    super(props);

    this.field = null;

    this.letterPossibilities = {
      'a': ['\u00E6', '\u0276', '\u0250', '\u0251', '\u0252']
    , 'e': ['\u025B', '\u0258', '\u0259', '\u025C', '\u0153']
    , 'i': ['\u026A', '\u0268']
    , 'o': ['\u0153', '\u00F8', '\u0275', '\u0254']
    , 'u': ['\u0289', '\u028C', '\u028A', '\u026F']
    , 'y': ['\u028F', '\u006A', '\u028E', '\u026F']
    }

    this.state = {
      value: ''
    , isFocused: false
    , shouldDisplay: false
    }
  }

  get lastLetter () {
    return this.state.value.substr(this.state.value.length - 1, 1);
  }

  get lastLetterIsUppercase () {
    return Helper.characterIsUppercase(this.lastLetter);
  }

  get lastLetterHasSuggestions () {
    return this.letterPossibilities.hasOwnProperty(this.lastLetter.toLowerCase());
  }

  get lastLetterPossibilities () {
    return this.lastLetterHasSuggestions ? this.letterPossibilities[this.lastLetter.toLowerCase()] : [];
  }

  checkDisplay () {
    this.setState({
      shouldDisplay: this.state.isFocused && this.lastLetterHasSuggestions
    });
  }

  listSuggestions () {
    if (this.state.shouldDisplay) {
      return (
        <div className='ipa-suggest'
          onClick={() => this.setState({ isFocused: true }, this.checkDisplay)}>
          {this.lastLetterHasSuggestions
            ? this.lastLetterPossibilities.map(letter => {
                return (
                  <a className='button is-small is-link'
                    onClick={() => this.replaceLastCharacter(letter)}>
                    {this.lastLetterIsUppercase ? letter.toUpperCase() : letter}
                  </a>
                );
              })
            : ''}
        </div>
      );
    }
  }

  replaceLastCharacter (character) {
    let updatedValue = this.state.value;
    updatedValue = updatedValue.replaceAt(updatedValue.length - 1, (this.lastLetterIsUppercase) ? character.toUpperCase() : character);

    this.setState({ value: updatedValue }, () => {
      this.field.focus();
    });
  }

  render () {
    return (
      <div className='field'>
        <label className='label'>Pronunciation</label>
        <p className='control'>
          <input className='input' type='text' placeholder='[prə.ˌnʌn.si.ˈeɪ.ʃən]'
            ref={input => this.field = input}
            value={this.state.value}
            onFocus={() => {
              setTimeout(() => {
                this.setState({ isFocused: true }, this.checkDisplay)
              }, 250);
            }}
            onBlur={() => {
              setTimeout(() => {
                this.setState({ isFocused: false }, this.checkDisplay)
              }, 250);
            }}
            onInput={event => {
              this.setState({ value: event.target.value }, this.checkDisplay);
            }}
            onChange={() => this.props.onChange(this.state.value)} />

          {this.listSuggestions()}
        </p>
      </div>
    );
  }
}

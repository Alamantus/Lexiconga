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

  get valueAtCursor () {
    const startPosition = this.field.selectionStart
    , endPosition = this.field.selectionEnd;

    // Get the character left of the farthest forward selection position.
    let index = (startPosition === endPosition ? startPosition - 1 : (endPosition < startPosition ? startPosition : endPosition) - 1)
    if (!index && index !== 0) {
      index = -1;
    }
    const character = this.state.value.charAt(index) || '';
    
    return {
      character: character
    , position: index
    };
  }

  get valueAtCursorIsUpperCase () {
    return Helper.characterIsUppercase(this.valueAtCursor.character);
  }

  get valueAtCursorHasSuggestions () {
    return this.letterPossibilities.hasOwnProperty(this.valueAtCursor.character.toLowerCase());
  }

  get valueAtCursorPossibilities () {
    return this.valueAtCursorHasSuggestions
      ? this.letterPossibilities[this.valueAtCursor.character.toLowerCase()]
      : [];
  }

  checkDisplay () {
    console.log(this.valueAtCursor);
    this.setState({
      valueAtCursorHasSuggestions: this.valueAtCursorHasSuggestions
    });
  }

  listSuggestions () {
    if (this.state.isFocused && this.state.valueAtCursorHasSuggestions) {
      return (
        <div className='ipa-suggest'
          onClick={() => this.setState({ isFocused: true }, this.checkDisplay)}>
          {this.valueAtCursorHasSuggestions
            ? this.valueAtCursorPossibilities.map(letter => {
                return (
                  <a className='button is-small is-link'
                    onClick={() => this.replaceValueAtCursor(letter)}>
                    {this.valueAtCursorIsUpperCase ? letter.toUpperCase() : letter}
                  </a>
                );
              })
            : ''}
        </div>
      );
    }
  }

  replaceValueAtCursor (character) {
    const valueAtCursor = this.valueAtCursor;
    let updatedValue = this.state.value;
    updatedValue = updatedValue.replaceAt(valueAtCursor.position, (this.valueAtCursorIsUpperCase) ? character.toUpperCase() : character);

    this.setState({ value: updatedValue }, () => {
      this.field.focus();
      this.field.startPosition = valueAtCursor.index + 1;
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

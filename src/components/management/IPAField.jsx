import Inferno from 'inferno';
import Component from 'inferno-component';

import Helper from '../../Helper';

export class IPAField extends Component {
  constructor (props) {
    super(props);

    this.letterPossibilities = {
      "a": ['aaa', 'wow']
    }

    this.state = {
      value: ''
    , isFocused: false
    , shouldDisplay: false
    }
  }

  checkDisplay () {
    const lastLetter = Helper.getLastLetter(this.state.value).toLowerCase();
    const letterHasSuggestions = this.letterPossibilities.hasOwnProperty(lastLetter);

    this.setState({
      shouldDisplay: this.state.isFocused && letterHasSuggestions
    });
  }

  listSuggestions () {
    if (this.state.shouldDisplay) {
      return (
        <div className='ipa-suggest' >
          {this.letterPossibilities[this.props.lastTypedLetter].map(letter => {
            return (
              <a className='button is-small is-link'
                onClick={() => this.props.replaceCharacter(letter)}>
                {letter}
              </a>
            );
          })}
        </div>
      );
    }
  }

  render () {
    return (
      <div className='field'>
        <label className='label'>Pronunciation</label>
        <p className='control'>
          <input className='input' type='text' placeholder='[prəˌnʌnsiˈeɪʃən]'
            value={this.state.wordPronunciation}
            onFocus={() => this.setState({ isFocused: true })}
            onBlur={() => this.setState({ isFocused: false })}
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

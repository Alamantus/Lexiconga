import Inferno from 'inferno';
import Component from 'inferno-component';

const phondueUsage = require('../../../vendor/KeyboardFire/phondue/usage.html');
const digraphsHexes = require('../../../vendor/KeyboardFire/phondue/digraphs.txt');

import Helper from '../../Helper';

import {IPATable} from './IPATable';

export class IPAField extends Component {
/*
  Modified from KeyboardFire's Phondue project (https://github.com/KeyboardFire/phondue)
  to fit React/Inferno and Lexiconga
*/
  constructor (props) {
    super(props);

    this.state = {
      value: props.value || ''
    , doShowHelp: false
    , doShowTable: false
    }

    this.field = null;
    this.digraphs = {};
  }

  componentDidMount () {
    // Decode digraph hexes.
    digraphsHexes.split('\n').forEach(digraph => {
      let chunks = digraph.match(/\S{8}/g);
      if (!chunks || chunks.length != 3) return;  // failsafe
      chunks = chunks.map(hex => {
        return String.fromCharCode(parseInt(hex, 16));
      });
      this.digraphs[chunks[0] + chunks[1]] = chunks[2];
    });
  }

  showHelp () {
    if (this.state.doShowHelp) {
      return (
        <div className='modal is-active'>
          <div className='modal-background'
            onClick={() => this.setState({ doShowHelp: false })} />
          <div className='modal-card'>
            <div className='modal-card-body'>

              <div className='content'
                dangerouslySetInnerHTML={{__html: phondueUsage}} />

            </div>
          </div>
        </div>
      );
    }
  }

  showTable () {
    if (this.state.doShowTable) {
      return (
        <div className='modal is-active'>
          <div className='modal-background'
            onClick={() => this.setState({ doShowTable: false })} />
          <div className='modal-card'><div className='modal-card-body'>
            <IPATable
              value={this.state.value}
              update={newValue => this.setState({ value: newValue }, this.field.focus())} />
          </div></div>
        </div>
      );
    }
  }

  showButtons () {
    if (!this.props.isDisplayOnly) {
      return (
        <div>
          <div className='help'>
            <a className='button is-small'
              onClick={() => this.setState({ doShowHelp: true })}>
              Field Help
            </a>
            &nbsp;
            <a className='button is-small'
              onClick={() => this.setState({ doShowTable: true })}>
              Show IPA Table
            </a>
          </div>
          {this.showHelp()} {this.showTable()}
        </div>
      );
    }
  }

  onInput (event) {
    let val = event.target.value
    , pos = this.field.selectionStart || val.length;

    if (event.key) {
      const key = event.key
      , digraph = this.digraphs[val.substr(pos - 1, 1) + key];

      if (digraph) {
        event.preventDefault();
        val = val.slice(0, pos - 1) + digraph + val.slice(pos);
      }
    }

    if (val !== this.state.value) {
      this.setState({ value: val }, () => {
        this.field.focus();
        this.field.setSelectionRange(pos, pos);
      });
    }
  }

  render () {
    return (
      <div className='field'>
        <label className='label'>Pronunciation</label>
        <p className='control'>
          <input className='input' type='text' disabled={!!this.props.isDisplayOnly} placeholder='[prə.ˌnʌn.si.ˈeɪ.ʃən]'
            ref={input => this.field = input}
            value={this.state.value}
            onInput={event => this.onInput(event)}
            onKeyDown={event => this.onInput(event)}
            onChange={() => this.props.onChange(this.state.value)} />
        </p>
        {this.showButtons()}
      </div>
    );
  }
}

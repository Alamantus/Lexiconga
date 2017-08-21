import Inferno from 'inferno';
import Component from 'inferno-component';

const phondueUsage = require('../../../vendor/KeyboardFire/phondue/usage.html');
const digraphs = require('../../../vendor/KeyboardFire/phondue/digraphs.json');

import { IPATable } from './IPATable';

export class IPAField extends Component {
/*
  Modified from KeyboardFire's Phondue project (https://github.com/KeyboardFire/phondue)
  to fit React/Inferno and Lexiconga
*/
  constructor (props) {
    super(props);

    this.state = {
      value: props.value || '',
      doShowHelp: false,
      doShowTable: false,
    }

    this.field = null;
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      value: nextProps.value,
    });
  }

  showHelp () {
    if (this.state.doShowHelp) {
      return (
        <div className='modal is-active'>
          <div className='modal-background'
            onClick={ () => this.setState({ doShowHelp: false }) } />
          <div className='modal-card'>
            <header className='modal-card-head'>
              <h3 className='modal-card-title'>
                IPA Shortcuts
              </h3>
              <button className='delete'
                onClick={ () => this.setState({ doShowHelp: false }) } />
            </header>
            <section className='modal-card-body'>

              <div className='content'
                dangerouslySetInnerHTML={{
                  __html: phondueUsage,
                }} />

            </section>
          </div>
        </div>
      );
    }
  }

  showTable () {
    if (this.state.doShowTable) {
      return (
        <IPATable
          value={ this.state.value }
          close={ () => this.setState({ doShowTable: false }) }
          update={ (newValue) => this.setState({ value: newValue }, this.field.focus()) } />
      );
    }
  }

  showButtons () {
    if (!this.props.isDisplayOnly) {
      return (
        <div>
          <div className='help'>
            <a className='button is-small'
              onClick={ () => this.setState({ doShowHelp: true }) }>
              Field Help
            </a>
            &nbsp;
            <a className='button is-small'
              onClick={ () => this.setState({ doShowTable: true }) }>
              Show IPA Table
            </a>
          </div>
          { this.showHelp() } { this.showTable() }
        </div>
      );
    }
  }

  onInput (event) {
    let val = event.target.value,
    pos = this.field.selectionStart || val.length;

    if (event.key) {
      const key = event.key,
        digraph = digraphs[val.substr(pos - 1, 1) + key];

      if (digraph) {
        event.preventDefault();
        val = val.slice(0, pos - 1) + digraph + val.slice(pos);
      }
    }

    if (val !== this.state.value) {
      this.setState({ value: val }, () => {
        this.field.focus();
        this.field.setSelectionRange(pos, pos);

        if (this.props.onInput) {
          this.props.onInput(this.state.value);
        }
      });
    }
  }

  onChange () {
    if (this.props.onChange) {
      this.props.onChange(this.state.value);
    }
  }

  render () {
    return (
      <div className='field'>
        <label className='label' htmlFor={ this.props.id || null }>
          { this.props.label || 'Pronunciation' }
        </label>
        {
          this.props.helpText
          && (
            <p className='help'>
              { this.props.helpText }
            </p>
          )
        }
        <div className='control'>
          <input className='input' id={ this.props.id || null } type='text'
            placeholder={ this.props.placeholder || '[prə.ˌnʌn.si.ˈeɪ.ʃən]' }
            disabled={ !!this.props.isDisplayOnly }
            ref={ (input) => this.field = input }
            value={ this.state.value }
            onInput={ (event) => this.onInput(event) }
            onKeyDown={ (event) => this.onInput(event) }
            onChange={ () => this.onChange() } />
        </div>
        { this.showButtons() }
      </div>
    );
  }
}

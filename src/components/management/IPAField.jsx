import Inferno from 'inferno';
import { Component } from 'inferno';
import PropTypes from 'prop-types';
import store from 'store';

import { DEFAULT_USER_DATA } from '../../Constants';

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

    PropTypes.checkPropTypes({
      value: PropTypes.string.isRequired,
      id: PropTypes.string,
      label: PropTypes.string,
      helpText: PropTypes.string,
      placeholder: PropTypes.string,
      isDisplayOnly: PropTypes.bool,
      useIPASetting: PropTypes.bool,
      onInput: PropTypes.func,
      onChange: PropTypes.func,
    }, props, 'prop', 'IPAField');

    this.state = {
      value: props.value || '',
      doShowHelp: false,
      doShowTable: false,
      useIPA: this.useIPA,
    }

    this.field = null;
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      value: nextProps.value,
    });
  }

  get useIPA() {
    if (this.props.useIPASetting) {
      const userData = store.get('LexicongaUserData');
      return userData && userData.hasOwnProperty('useIPAPronunciation')
        ? userData.useIPAPronunciation : DEFAULT_USER_DATA.useIPAPronunciation;
    }
    return true;
  }

  toggleIPA () {
    const userData = store.get('LexicongaUserData');
    userData.useIPAPronunciation = !this.useIPA;
    this.setState({ useIPA: userData.useIPAPronunciation }, () => {
      store.set('LexicongaUserData', userData);
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
          close={ () => this.setState({ doShowTable: false }, () => this.field.focus()) }
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
    let val = event.target.value;
    let pos;
    if (this.state.useIPA) {
      pos = this.field.selectionStart || val.length;

      if (event.key) {
        const key = event.key,
          digraph = digraphs[val.substr(pos - 1, 1) + key];

        if (digraph) {
          event.preventDefault();
          val = val.slice(0, pos - 1) + digraph + val.slice(pos);
        }
      }
    }

    if (val !== this.state.value) {
      this.setState({ value: val }, () => {
        if (this.state.useIPA) {
          this.field.focus();
          this.field.setSelectionRange(pos, pos);
        }

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
          { this.props.useIPASetting && 
            <a className='button is-small is-pulled-right is-inline'
              title='Toggle IPA'
              aria-label={`Toggle IPA`}
              onClick={this.toggleIPA.bind(this)}>
              <span className='icon'>
                <i className={`fa fa-${this.state.useIPA ? 'ban' : 'check-circle-o'}`} />
              </span>
              <span className='is-hidden-touch'>
                {this.state.useIPA ? 'Dis' : 'En' }able IPA
              </span>
            </a>
          }
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
            placeholder={ this.props.placeholder || (this.state.useIPA ? '[prə.ˌnʌn.si.ˈeɪ.ʃən]' : 'pronunciation') }
            disabled={ !!this.props.isDisplayOnly }
            ref={ (input) => this.field = input }
            value={ this.state.value }
            onInput={ (event) => this.onInput(event) }
            onKeyDown={ (event) => this.onInput(event) }
            onChange={ () => this.onChange() } />
        </div>
        { this.state.useIPA && this.showButtons() }
      </div>
    );
  }
}

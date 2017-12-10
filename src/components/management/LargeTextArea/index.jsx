import Inferno from 'inferno';
import Component from 'inferno-component';
import PropTypes from 'prop-types';

import './styles.scss';

export class LargeTextArea extends Component {
	constructor (props) {
		super(props);

    PropTypes.checkPropTypes({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      placeholder: PropTypes.string,
      isValid: PropTypes.bool,
      invalidText: PropTypes.string,
      onInput: PropTypes.func,
      onChange: PropTypes.func,
    }, props, 'prop', 'LargeTextArea');

    this.state = {
      isMaximized: false,
      value: props.value || '',
    };

    this.textarea = null;
	}

  componentWillReceiveProps (nextProps) {
    this.setState({
      value: nextProps.value,
    });
  }

  maximize () {
    this.setState({ isMaximized: true }, () => {
      this.textarea.focus();
    });
  }

  minimize () {
    this.setState({ isMaximized: false }, () => {
      this.textarea.focus();
    });
  }

  onInput (event) {
    const val = event.currentTarget.value;

    if (val !== this.state.value) {
      this.setState({ value: val }, () => {
        if (this.props.onInput) {
          this.props.onInput(this.state.value);
        }
      });
    }
  }

  renderTextarea () {
    const { placeholder, isValid, onChange } = this.props;
    return (
      <textarea className={ `textarea ${(!isValid) ? 'is-danger' : ''}` }
        placeholder={ placeholder || '' }
        value={ this.state.value || '' }
        onInput={ event => this.onInput(event) }
        onKeyDown={ event => this.onInput(event) }
        onChange={ onChange }
        ref={ textarea => this.textarea = textarea }
      />
    );
  }

  render () {
    const { label, isValid, invalidText } = this.props;

    // if (this.state.isMaximized) {
    //   return (
    //     <div className='large-modal is-active'>
    //       <div className='modal-background' onClick={ this.minimize.bind(this) } />
    //       <div className='large-modal-card'>
    //         <header className='modal-card-head'>
    //           <span className='modal-card-title'>
    //             { label }
    //           </span>
    //           <button className='delete'
    //             aria-label='close'
    //             onClick={ this.minimize.bind(this) }
    //           />
    //         </header>
    //         { this.renderTextarea() }
    //         <footer className='modal-card-foot is-small' />
    //       </div>
    //     </div>
    //   );
    // }

    return (
      <div className='field'>
        <label className='label'>
          { label }
          <a className='button is-small is-pulled-right is-inline' onClick={ this.maximize.bind(this) }>
            <span className='icon'><i className='fa fa-expand' /></span>
          </a>
        </label>
        <div className='control'>
          { this.renderTextarea() }
          {(!isValid)
            ? (
              <span className='help is-danger'>
                { invalidText }
              </span>
            ) : null}
        </div>
        {this.state.isMaximized
          && (
          <div className='large-modal is-active'>
            <div className='modal-background' onClick={ this.minimize.bind(this) } />
            <div className='large-modal-card'>
              <header className='modal-card-head'>
                <span className='modal-card-title'>
                  { label }
                </span>
                <button className='delete'
                  aria-label='close'
                  onClick={ this.minimize.bind(this) }
                />
              </header>
              { this.renderTextarea() }
              <footer className='modal-card-foot is-small' />
            </div>
          </div>
        )}
      </div>
    );
  }
}
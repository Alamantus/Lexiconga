import Inferno from 'inferno';
import { Component } from 'inferno';
import PropTypes from 'prop-types';

export class Modal extends Component {
  constructor (props) {
    super(props);

  PropTypes.checkPropTypes({
    noButton: PropTypes.bool,
    buttonText: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    title: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    footerAlign: PropTypes.string,
    footerContent: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    onShow: PropTypes.func,
    onHide: PropTypes.func,
  }, props, 'prop', 'Modal');

    this.state = {
      isVisible: false,
    }
  }

  show () {
    this.setState({
      isVisible: true,
    }, () => {
      if (this.props.onShow) {
        this.props.onShow();
      }
    });
  }

  hide () {
    this.setState({
      isVisible: false,
    }, () => {
      if (this.props.onHide) {
        this.props.onHide();
      }
    });
  }

  render () {
    const {
      noButton,
      buttonText,
      title,
      children,
      footerAlign = 'left',
      footerContent,
    } = this.props;

    return (
      <div className='is-inline'>
        <a className={!noButton ? 'button' : null}
          onClick={ this.show.bind(this) }>
          { buttonText || 'Show' }
        </a>

        <div className={ `modal ${(this.state.isVisible) ? 'is-active' : ''}` }>

          <div className='modal-background' onClick={ this.hide.bind(this) } />

          <div className='modal-card'>
            <header className='modal-card-head has-text-left'>
              <h3 className='modal-card-title'>
                { title || 'Modal' }
              </h3>
              <button className='delete' aria-label='close'
                onClick={ this.hide.bind(this) }
              />
            </header>
            
            <section className='modal-card-body'>
              
              { children }

            </section>

            <footer className={ `modal-card-foot ${ (footerAlign === 'right') ? 'has-text-right is-pulled-right' : '' }` }>
              
              { footerContent }

            </footer>
          </div>
        </div>
      </div>
    );
  }
}

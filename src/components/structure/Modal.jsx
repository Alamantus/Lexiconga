import Inferno from 'inferno';
import Component from 'inferno-component';

export class Modal extends Component {
  constructor (props) {
    super(props);

    this.state = {
      isVisible: false,
    }
  }

  show () {
    this.setState({
      isVisible: true,
    });
  }

  hide () {
    this.setState({
      isVisible: false,
    });
  }

  render () {
    const {
      buttonText,
      title,
      children,
      footerAlign = 'left',
      footerContent,
    } = this.props;

    return (
      <div className='is-inline'>
        <a className={!this.props.noButton ? 'button' : null}
          onClick={ this.show.bind(this) }>
          { buttonText || 'Show' }
        </a>

        <div className={ `modal ${(this.state.isVisible) ? 'is-active' : ''}` }>

          <div className='modal-background' onClick={ this.hide.bind(this) } />

          <div className='modal-card'>
            <header className='modal-card-head'>
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

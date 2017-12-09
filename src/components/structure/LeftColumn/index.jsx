import Inferno from 'inferno';
import PropTypes from 'prop-types';

import { Modal } from '../Modal';

import './styles.scss';

export const LeftColumn = (props) => {
  PropTypes.checkPropTypes({
    isMobile: PropTypes.bool.isRequired,
    displayForm: PropTypes.bool.isRequired,
    openWordForm: PropTypes.func.isRequired,
    closeWordForm: PropTypes.func.isRequired,
    children: PropTypes.object,
  }, props, 'prop', 'LeftColumn');

  const { isMobile, displayForm, openWordForm, closeWordForm } = props;

  return (
    <div className={ `left-column-${ displayForm ? 'open' : 'closed' }` } >
      {isMobile
        ? (
          <div className='floating-word-button'>
            <Modal title='New Word'
              buttonText={<span className='icon'><i className='fa fa-plus' /></span>}
            >
              { props.children }
            </Modal>
          </div>
        ) : (
          <div>
            {displayForm
              ? (
                <div className='floating-word-form'>
                  <a className='button is-pulled-right'
                    onClick={ closeWordForm }
                  >
                    <span className='icon'><i className='fa fa-close' /></span>
                  </a>
                  { props.children }
                </div>
              ) : (
                <div className='floating-word-button'>
                  <a className='button' onClick={ openWordForm }>
                    <span className='icon'><i className='fa fa-plus' /></span>
                  </a>
                </div>
              )
            }
          </div>
        )
      }
    </div>
  );
}

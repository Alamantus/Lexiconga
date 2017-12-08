import Inferno from 'inferno';
import Component from 'inferno-component';

import { Modal } from '../Modal';

import './styles.scss';

export class LeftColumn extends Component {
  constructor (props) {
    super(props);

    this.isMobile = window.innerWidth < 769;
  }

  render () {
    return (
      <div className='left-column'>
        {this.isMobile
          ? (
            <div className='floating-word-button'>
              <Modal title='New Word'
                buttonText={<span className='icon'><i className='fa fa-plus' /></span>}
              >
                { this.props.children }
              </Modal>
            </div>
          ) : this.props.children
        }
      </div>
    );
  }
}

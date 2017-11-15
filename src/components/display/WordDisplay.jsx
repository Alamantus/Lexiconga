import Inferno from 'inferno';
import Component from 'inferno-component';
import marked from 'marked';
import swal from 'sweetalert2';

import './WordDisplay.scss';

import idManager from '../../managers/IDManager';
import { Word } from '../../managers/Word';

import { WordForm } from '../management/WordForm';

export class WordDisplay extends Component {
  constructor (props) {
    super(props);

    this.state = {
      menuIsOpen: false,
      isEditing: false,
    }

    this.wordDetailsHTML = marked(props.word.details);
  }

  componentWillUpdate (nextProps, nextState) {
    if (this.props.word.details !== nextProps.word.details) {
      this.wordDetailsHTML = marked(nextProps.word.details);
    }
  }

  edit () {
    this.setState({
      menuIsOpen: false,
      isEditing: true,
    });
  }

  delete () {
    const { word } = this.props;
    swal({
      title: `Delete "${ word.name }"?`,
      text: `It will be gone forever and cannot be restored!`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      confirmButtonClass: 'button is-danger',
      cancelButtonClass: 'button',
      buttonsStyling: false
    }).then(() => {
      word.delete(word.id)
      .then(() => {
        this.props.updateDisplay();
      }).then(() => {
        this.setState({ menuIsOpen: false }, () => {
          swal(
            'Deleted!',
            `"${ word.name }" has been deleted.`,
            'success'
          );
        });
      });
    }, dismiss => {
      console.log('Word not deleted');
    });
  }

  render () {
    const { menuIsOpen, isEditing } = this.state;
    const { word } = this.props;

    if (isEditing) {
      return (
        <WordForm
          name={word.name}
          pronunciation={word.pronunciation}
          partOfSpeech={word.partOfSpeech}
          definition={word.definition}
          details={word.details}
        />
      );
    }
    return (
      <div className='card'>

        <header className='card-header'>
          <div className='word-card-header-title'>
            <span className='word-name'>
              { word.name }
            </span>
            {
              (word.pronunciation || word.partOfSpeech)
              && (
                <span className='word-classification'>
                  {
                    (word.pronunciation)
                    && (
                      <span className='word-pronunciation'>
                      { word.pronunciation }
                      </span>
                    )
                  }

                  {
                    (word.partOfSpeech)
                    && (
                      <span className='word-part-of-speech'>
                      { word.partOfSpeech }
                      </span>
                    )
                  }
                </span>
              )
            }
          </div>
          <div aria-label='options'
            className={`card-header-icon dropdown is-right ${ menuIsOpen ? 'is-active' : '' }`}
          >
            <span className='icon dropdown-trigger'
              onClick={ () => this.setState({ menuIsOpen: !menuIsOpen }) }
            >
              <i className={`fa fa-angle-${ menuIsOpen ? 'up' : 'down' }`} aria-hidden='true'></i>
            </span>
            <div className='dropdown-menu' id='dropdown-menu' role='menu'>
              <div className='dropdown-content'>
                <a className='dropdown-item' onClick={ this.edit.bind(this) }>
                  Edit
                </a>
                <a onClick={ this.delete.bind(this) } className='dropdown-item is-danger'>
                  Delete
                </a>
              </div>
            </div>
          </div>
        </header>

        <section className='card-content'>
          <div className='content'>
            {
              (word.definition)
              && (
                <p className='word-definition'>
                  { word.definition }
                </p>
              )
            }

            {
              (word.details)
              && (
                <p className='word-details'
                  dangerouslySetInnerHTML={{__html: this.wordDetailsHTML}} />
              )
            }
          </div>
        </section>

      </div>
    );
  }
}

import Inferno from 'inferno';
import { Component } from 'inferno';
import PropTypes from 'prop-types';
import marked from 'marked';
import swal from 'sweetalert2';

import './styles.scss';

import idManager from '../../../managers/IDManager';
import { Word } from '../../../managers/Word';

import { WordForm } from '../../management/WordForm';

export class WordDisplay extends Component {
  constructor (props) {
    super(props);

    PropTypes.checkPropTypes({
      word: PropTypes.object.isRequired,
      useIpaFieldOnEdit: PropTypes.bool,
      updateDisplay: PropTypes.func.isRequired,
    }, props, 'prop', 'WordDisplay');

    this.state = {
      menuIsOpen: false,
      isEditing: false,
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
    const { word, useIpaFieldOnEdit, updateDisplay } = this.props;

    if (isEditing) {
      return (
        <WordForm
          word={word}
          useIpaField={ useIpaFieldOnEdit }
          updateDisplay={updateDisplay}
          callback={() => {
            this.setState({
              menuIsOpen: false,
              isEditing: false,
            })
          }}
        />
      );
    }
    return (
      <div className='word-card'>

        <header className='word-card-header'>
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

        <section className='word-card-content'>
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
                  dangerouslySetInnerHTML={{__html: marked(word.details)}} />
              )
            }
          </div>
        </section>

      </div>
    );
  }
}

import Inferno from 'inferno';
import Component from 'inferno-component';
import marked from 'marked';

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

  render () {
    const { menuIsOpen, isEditing } = this.state;

    if (isEditing) {
      return (
        <WordForm
          name={this.props.word.name}
          pronunciation={this.props.word.pronunciation}
          partOfSpeech={this.props.word.partOfSpeech}
          definition={this.props.word.definition}
          details={this.props.word.details}
        />
      );
    }
    return (
      <div className='card'>

        <header className='card-header'>
          <div className='word-card-header-title'>
            <span className='word-name'>
              { this.props.word.name }
            </span>
            {
              (this.props.word.pronunciation || this.props.word.partOfSpeech)
              && (
                <span className='word-classification'>
                  {
                    (this.props.word.pronunciation)
                    && (
                      <span className='word-pronunciation'>
                      { this.props.word.pronunciation }
                      </span>
                    )
                  }

                  {
                    (this.props.word.partOfSpeech)
                    && (
                      <span className='word-part-of-speech'>
                      { this.props.word.partOfSpeech }
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
                <a className='dropdown-item is-danger'>
                  Delete
                </a>
              </div>
            </div>
          </div>
        </header>

        <section className='card-content'>
          <div className='content'>
            {
              (this.props.word.definition)
              && (
                <p className='word-definition'>
                  { this.props.word.definition }
                </p>
              )
            }

            {
              (this.props.word.details)
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

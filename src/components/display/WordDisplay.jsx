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
      isEditing: false,
    }

    this.wordDetailsHTML = marked(props.word.details);
  }

  componentWillUpdate (nextProps, nextState) {
    if (this.props.word.details !== nextProps.word.details) {
      this.wordDetailsHTML = marked(nextProps.word.details);
    }
  }

  render () {
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
          <a className='card-header-icon' aria-label='more options'>
            <span className='icon'>
              <i className='fa fa-angle-down' aria-hidden='true'></i>
            </span>
          </a>
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

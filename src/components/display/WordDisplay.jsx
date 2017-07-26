import Inferno from 'inferno';
import Component from 'inferno-component';
import marked from 'marked';

import idManager from '../../managers/IDManager';
import { Word } from '../../managers/Word';

import { WordForm } from '../management/WordForm';

export class WordDisplay extends Component {
  constructor (props) {
    super(props);

    this.state = {
      isEditing: false,
    }
  }

  render () {
    return (
      <div className='card'>

        <header className='card-header'>
          <h3 className='card-header-title'>
            { this.props.word.name }
          </h3>
        </header>

        <section className='card-content'>
          <div className='content'>
            {(this.props.word.pronunciation || this.props.word.partOfSpeech)
              && (<p>
                    {(this.props.word.partOfSpeech)
                      ? (<small>this.props.word.partOfSpeech</small>)
                      : ''}
                  
                    {(this.props.word.partOfSpeech && this.props.word.pronunciation)
                      ? ' | '
                      : ''}
                  
                    {(this.props.word.pronunciation)
                      ? (<small>this.props.word.pronunciation</small>)
                      : ''}
                  </p>
                )}

            {(this.props.word.definition)
              && (
                <p>
                  { this.props.word.definition }
                </p>
                )}

            {(this.props.word.details)
              && (
                <p>
                  { this.props.word.details }
                </p>
                )}
          </div>
        </section>

      </div>
    );
  }
}

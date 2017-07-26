import Inferno from 'inferno';
import Component from 'inferno-component';
import marked from 'marked';

import idManager from '../../managers/IDManager';

import { WordDisplay } from './WordDisplay';

export class WordsList extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <div className='box'>

        {this.props.words
          && this.props.words.map(word => {
            return (
              <WordDisplay key={ `word_${word.id}` }
                word={ word } />
            );
          })
        }

      </div>
    );
  }
}

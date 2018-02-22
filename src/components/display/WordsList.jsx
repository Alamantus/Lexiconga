import Inferno from 'inferno';
import { Component } from 'inferno';
import PropTypes from 'prop-types';
import marked from 'marked';

import idManager from '../../managers/IDManager';

import { Ad } from './Ad';
import { WordDisplay } from './WordDisplay';

export class WordsList extends Component {
  constructor (props) {
    super(props);

    PropTypes.checkPropTypes({
      adsEveryXWords: PropTypes.number,
      words: PropTypes.array,
      updateDisplay: PropTypes.func.isRequired,
    }, props, 'prop', 'WordList');
  }

  render () {
    const adsEveryXWords = this.props.adsEveryXWords || 10;

    return (
      <div className='box'>

        {this.props.words
          && this.props.words.map((word, index) => {
            return (
              <div key={ `word_${word.id}` }>
                {index % adsEveryXWords == 1
                  && <Ad key={ index } />
                }
                
                <WordDisplay word={ word }
                  updateDisplay={ this.props.updateDisplay } />
              </div>
            );
          })
        }

      </div>
    );
  }
}

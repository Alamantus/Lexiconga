import Inferno from 'inferno';
import Component from 'inferno-component';
import PropTypes from 'prop-types';
import marked from 'marked';

// npm lazyload-inferno-component uses outdated inferno dependencies, so just using the script.
import LazyLoader from '../../../vendor/LGabAnnell/lazyload-inferno-component/lazyload-component';

import idManager from '../../managers/IDManager';

import { WordDisplay } from './WordDisplay';

const loadAd = (callback, { props, router }) => {
  require.ensure([], (require) => {
    const component = require("./Ad").Ad;
    callback(component);
  });
};

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
              <div>
                {index % adsEveryXWords == 0
                  && <LazyLoader lazyLoad={ loadAd } />
                }
                
                <WordDisplay key={ `word_${word.id}` }
                  word={ word }
                  updateDisplay={ this.props.updateDisplay } />
              </div>
            );
          })
        }

      </div>
    );
  }
}

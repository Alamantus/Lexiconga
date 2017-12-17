import Inferno from 'inferno';
import PropTypes from 'prop-types';

export const StatsSection = (props) => {
  PropTypes.checkPropTypes({
    stats: PropTypes.object.isRequired,
  }, props, 'prop', 'StatsSection');

  const {
    numberOfWords,
    wordLength,
    letterDistribution,
    totalLetters
  } = props.stats;

  return (
    <div>
      <div className='columns'>
        <div className='column'>
          <strong>Number of Words</strong>
          <div className='field is-grouped is-grouped-multiline'>
            {numberOfWords.map(stat => {
              return (
                <div className='control'>
                  <div className='tags has-addons'>
                    <span className='tag'>
                      { stat.name }
                    </span>
                    <span className='tag is-white'>
                      { stat.value }
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className='columns'>
        <div className='column'>
          <strong>Word Length</strong>
          <div className='field is-grouped is-grouped-multiline'>

            <div className='control'>
              <div className='tags has-addons'>
                <span className='tag'>
                  Shortest
                </span>
                <span className='tag is-white'>
                  { wordLength.shortest }
                </span>
              </div>
            </div>

            <div className='control'>
              <div className='tags has-addons'>
                <span className='tag'>
                  Longest
                </span>
                <span className='tag is-white'>
                  { wordLength.longest }
                </span>
              </div>
            </div>

            <div className='control'>
              <div className='tags has-addons'>
                <span className='tag'>
                  Average
                </span>
                <span className='tag is-white'>
                  { wordLength.average }
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className='columns'>
        <div className='column'>
          <strong>Letter Distribution</strong>
          <div className='field is-grouped is-grouped-multiline'>
            {letterDistribution.map(stat => {
              return (
                <div className='control'>
                  <div className='tags has-addons' title={ `${ stat.number } ${ stat.letter }'s total` }>
                    <span className='tag'>
                      { stat.letter }
                    </span>
                    <span className='tag is-white'>
                      { stat.percentage.toFixed(2) }
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <span>{ totalLetters } Total Letters</span>
        </div>
      </div>

    </div>
  );
}

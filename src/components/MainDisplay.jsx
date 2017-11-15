import Inferno from 'inferno';
import PropTypes from 'prop-types';

import { LeftColumn } from './structure/LeftColumn';
import { RightColumn } from './structure/RightColumn';

import { WordForm } from './management/WordForm';
import { DictionaryDetails } from './display/DictionaryDetails';
import { WordsList } from './display/WordsList';

export const MainDisplay = (props) => {
  PropTypes.checkPropTypes({
    dictionaryInfo: PropTypes.object.isRequired,
    wordsToDisplay: PropTypes.array.isRequired,
    updateDisplay: PropTypes.func.isRequired,
    updater: PropTypes.object.isRequired,
  }, props, 'prop', 'MainDisplay');

  const { dictionaryInfo, wordsToDisplay, updateDisplay, updater } = props;

  return (
    <section className='section'>
      <div className='container'>
        <div className='columns'>
          
          <LeftColumn>
            <WordForm
              updateDisplay={ updateDisplay }
            />
          </LeftColumn>

          <RightColumn>
            <DictionaryDetails
              updater={ updater }
              name={ dictionaryInfo.name }
              specification={ dictionaryInfo.specification }
              description={ dictionaryInfo.description }
              partsOfSpeech={ dictionaryInfo.partsOfSpeech }
              details={ dictionaryInfo.details }
              alphabeticalOrder={ dictionaryInfo.alphabeticalOrder }
            />

            <WordsList
              words={ wordsToDisplay }
              adsEveryXWords={ 10 }
              updateDisplay={ updateDisplay } />
          </RightColumn>
          
        </div>
      </div>
    </section>
  );
}

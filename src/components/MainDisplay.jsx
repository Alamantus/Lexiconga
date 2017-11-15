import Inferno from 'inferno';

import { LeftColumn } from './structure/LeftColumn';
import { RightColumn } from './structure/RightColumn';

import { WordForm } from './management/WordForm';
import { DictionaryDetails } from './display/DictionaryDetails';
import { WordsList } from './display/WordsList';

export const MainDisplay = ({ dictionaryInfo, wordsToDisplay, updateDisplay, updater, lastRender }) => {
  return (
    <section className='section'>
      <div className='container'>
        <div className='columns'>
          
          <LeftColumn>
            <WordForm
              updateDisplay={ () => updateDisplay() }
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
              lastRender={ lastRender }
              words={ wordsToDisplay }
              adsEveryXWords={ 10 }
              updateDisplay={ updateDisplay } />
          </RightColumn>
          
        </div>
      </div>
    </section>
  );
}

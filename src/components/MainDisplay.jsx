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
              partsOfSpeech={ dictionaryInfo.partsOfSpeech }
            />
          </LeftColumn>

          <RightColumn>
            <DictionaryDetails
            updater={ updater }
              name={ dictionaryInfo.name }
              specification={ dictionaryInfo.specification }
              description={ dictionaryInfo.description }
              partsOfSpeech={ dictionaryInfo.partsOfSpeech }
              alphabeticalOrder={['b', 'p', 't', 'd', 'a', 'o', 'j', 'e']}
              details={{
                phonology: {
                  consonants: ['b', 'p', 'd', 't', 'j'],
                  vowels: ['a', 'o', 'e'],
                  blends: ['ae', 'oe', 'tj', 'dy'],
                  phonotactics: {
                    onset: ['b', 'p', 'j'],
                    nucleus: ['a', 'o', 'e'],
                    coda: ['any'],
                    exceptions: 'There are no exceptions',
                  },
                },
                grammar: {
                  content: 'The rules of the language are simple: just follow them!'
                },
                custom: [
                  {
                    name: 'Test Tab',
                    content: 'This is a test tab to test how custom tabs work!',
                  }
                ],
              }}
            />

            <WordsList
              lastRender={ lastRender }
              words={ wordsToDisplay } />
          </RightColumn>
          
        </div>
      </div>
    </section>
  );
}

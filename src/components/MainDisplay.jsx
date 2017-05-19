import Inferno from 'inferno';

import {LeftColumn} from './structure/LeftColumn';
import {RightColumn} from './structure/RightColumn';

import {WordForm} from './management/WordForm';
import {DictionaryDetails} from './display/DictionaryDetails';
import {WordsList} from './display/WordsList';

export const MainDisplay = ({dictionaryInfo, wordsToDisplayPromise}) => {
  return (
    <section className='section'>
      <div className='container'>
        <div className='columns'>
          
          <LeftColumn>
            <WordForm
              partsOfSpeech={dictionaryInfo.partsOfSpeech}
            />
          </LeftColumn>

          <RightColumn>
            <DictionaryDetails
              name={dictionaryInfo.name}
              specification={dictionaryInfo.specification}
              description={dictionaryInfo.description}
              details={{
                custom: [
                  {
                    name: 'Test Tab'
                  }
                ]
              }}
            />

            <WordsList
              wordsPromise={wordsToDisplayPromise} />
          </RightColumn>
          
        </div>
      </div>
    </section>
  );
}

import Inferno from 'inferno';

import {LeftColumn} from './structure/LeftColumn';
import {RightColumn} from './structure/RightColumn';

import {WordForm} from './management/WordForm';
import {DictionaryDetails} from './display/DictionaryDetails';

export const MainDisplay = ({dictionaryInfo}) => {
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
          </RightColumn>
          
        </div>
      </div>
    </section>
  );
}

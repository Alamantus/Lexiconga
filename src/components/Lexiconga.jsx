import Inferno from 'inferno';
import Component from 'inferno-component';

import {LeftColumn} from './structure/LeftColumn';
import {RightColumn} from './structure/RightColumn';

import {WordForm} from './management/WordForm';
import {DictionaryDetails} from './display/DictionaryDetails';

export class Lexiconga extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <section className='section'>
        <div className='container'>
          <div className='columns'>
            
            <LeftColumn>
              <WordForm
                partsOfSpeech={['Noun','Adjective','Verb']}
              />
            </LeftColumn>

            <RightColumn>
              <DictionaryDetails
                description='Test Description'
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
}

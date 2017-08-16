import Inferno from 'inferno';
import Component from 'inferno-component';

import dictionary from '../../../../managers/DictionaryData';

export const EditLinguisticsForm = ({
  editDictionaryModal,
  partsOfSpeech,
}) => {
  return (
    <div className='form'>
      <div className='field'>
        <label className='label' htmlFor='dictionaryDescription'>Parts of Speech</label>
        <div className='control'>
          <textarea className='textarea' id='partsOfSpeech'
            placeholder={ `Put each part of speech on a separate line` }
            value={ partsOfSpeech }
            onInput={ (event) => {
              editDictionaryModal.setState({
                partsOfSpeech: event.target.value,
                hasChanged: event.target.value != editDictionaryModal.props.partsOfSpeech.join('\n'),
              });
            }}
          />
        </div>
      </div>
    </div>
  );
}

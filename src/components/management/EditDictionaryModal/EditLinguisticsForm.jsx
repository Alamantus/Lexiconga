import Inferno from 'inferno';
import Component from 'inferno-component';

import { IPAField } from '../IPAField';

export const EditLinguisticsForm = ({
  editDictionaryModal,
  partsOfSpeech,
  consonants,
  vowels,
  blends,
}) => {
  return (
    <div className='form'>
      <div className='field'>
        <label className='label' htmlFor='editPartsOfSpeech'>
          Parts of Speech
        </label>
        <p className='help'>
          Put each part of speech on a separate line
        </p>
        <div className='control'>
          <textarea className='textarea' id='editPartsOfSpeech'
            placeholder={ `Noun\nAdjective\nVerb` }
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

      <h4 className='title as-4'>
        Phonology
      </h4>

      <div className='columns'>

        <div className='column'>
          <IPAField label='Consonants' id='editConsonants'
            helpText='Separate phonemes with a space'
            placeholder='b p ɱ ʃ ʁ'
            value={ consonants }
            onInput={ (newValue) => {
              editDictionaryModal.setState({
                consonants: newValue,
                hasChanged: newValue != editDictionaryModal.props.details.phonology.consonants.join(' '),
              });
            }} />
        </div>

        <div className='column'>
          <IPAField label='Vowels' id='editVowels'
            helpText='Separate phonemes with a space'
            placeholder='a o e'
            value={ vowels }
            onInput={ (newValue) => {
              editDictionaryModal.setState({
                vowels: newValue,
                hasChanged: newValue != editDictionaryModal.props.details.phonology.vowels.join(' '),
              });
            }} />
        </div>

      </div>

      <div className='columns'>

        <div className='column'>
          <IPAField label={`Polyphthongs${'\u200B'}/${'\u200B'}Blends`} id='editBlends'
            helpText='Separate each with a space'
            placeholder='ae oe ɱʃ pʁ'
            value={ blends }
            onInput={ (newValue) => {
              editDictionaryModal.setState({
                blends: newValue,
                hasChanged: newValue != editDictionaryModal.props.details.phonology.blends.join(' '),
              });
            }} />
        </div>

      </div>
    </div>
  );
}

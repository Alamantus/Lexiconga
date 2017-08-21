import Inferno from 'inferno';
import Component from 'inferno-component';

import { IPAField } from '../IPAField';

export const EditLinguisticsForm = ({
  editDictionaryModal,
  partsOfSpeech,
  consonants,
  vowels,
  blends,
  onset,
  nucleus,
  coda,
  exceptions,
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

      <div className='columns'>

        <h4 className='title as-4'>
          Phonology
        </h4>

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

      <div className='columns'>

        <h5 className='title as-5'>
          Phonotactics
        </h5>
        <h6 className='subtitle as-6'>
          The makeup of a syllable
        </h6>

        <div className='column'>
          <IPAField label='Onset' id='editOnset'
            helpText='Separate phonemes/groups with a space'
            placeholder='consonants blends'
            value={ onset }
            onInput={ (newValue) => {
              editDictionaryModal.setState({
                onset: newValue,
                hasChanged: newValue != editDictionaryModal.props.details.phonology.phonotactics.onset.join(' '),
              });
            }} />
        </div>

        <div className='column'>
          <IPAField label='Nucleus' id='editNucleus'
            helpText='Separate phonemes/groups with a space'
            placeholder='vowels'
            value={ nucleus }
            onInput={ (newValue) => {
              editDictionaryModal.setState({
                nucleus: newValue,
                hasChanged: newValue != editDictionaryModal.props.details.phonology.phonotactics.nucleus.join(' '),
              });
            }} />
        </div>

        <div className='column'>
          <IPAField label='Coda' id='editCoda'
            helpText='Separate phonemes/groups with a space'
            placeholder='any'
            value={ coda }
            onInput={ (newValue) => {
              editDictionaryModal.setState({
                coda: newValue,
                hasChanged: newValue != editDictionaryModal.props.details.phonology.phonotactics.coda.join(' '),
              });
            }} />
        </div>

      </div>

      <div className='columns'>
        <div className='column'>

          <div className='field'>
            <label className='label' htmlFor='editExceptions'>
              Exceptions
            </label>
            <p className='help'>
              Any exceptions for your phonotactics rules, <a href='MARKDOWN_LINK' target='_blank'>Markdown</a> enabled
            </p>
            <div className='control'>
              <textarea className='textarea' id='editExceptions'
                placeholder='Vowel blends are not allowed in the onset, and [e], including blends with [e] comprising it, is not allowed in the coda.'
                value={ exceptions }
                onInput={ (newValue) => {
                  editDictionaryModal.setState({
                    exceptions: newValue,
                    hasChanged: newValue != editDictionaryModal.props.details.phonology.exceptions.join(' '),
                  });
                }}
              />
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}

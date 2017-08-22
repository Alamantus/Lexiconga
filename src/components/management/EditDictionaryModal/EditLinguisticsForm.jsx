import Inferno from 'inferno';

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

      <h4 className='subtitle as-4'>
        Phonotactics
      </h4>

      <div className='columns'>

        <div className='column'>
          <div className='field'>
            <label className='label' htmlFor='editOnset'>
              Onset
            </label>
            <p className='help'>
              Put each phoneme or group on a separate line
            </p>
            <div className='control'>
              <textarea className='textarea' id='editOnset'
                placeholder={ `none\nconsonant blends\n...` }
                value={ onset }
                onInput={ (event) => {
                  editDictionaryModal.setState({
                    onset: event.target.value,
                    hasChanged: event.target.value != editDictionaryModal.props.details.phonology.phonotactics.onset.join('\n'),
                  });
                }}
              />
            </div>
          </div>
        </div>

        <div className='column'>
        <div className='field'>
            <label className='label' htmlFor='editNucleus'>
              Nucleus
            </label>
            <p className='help'>
              Put each phoneme or group on a separate line
            </p>
            <div className='control'>
              <textarea className='textarea' id='editNucleus'
                placeholder={ `vowels\nvowel blends\n...` }
                value={ nucleus }
                onInput={ (event) => {
                  editDictionaryModal.setState({
                    nucleus: event.target.value,
                    hasChanged: event.target.value != editDictionaryModal.props.details.phonology.phonotactics.nucleus.join('\n'),
                  });
                }}
              />
            </div>
          </div>
        </div>

        <div className='column'>
        <div className='field'>
            <label className='label' htmlFor='editCoda'>
              Coda
            </label>
            <p className='help'>
              Put each phoneme or group on a separate line
            </p>
            <div className='control'>
              <textarea className='textarea' id='editCoda'
                placeholder={ `consonants\nconsonant blends\n...` }
                value={ coda }
                onInput={ (event) => {
                  editDictionaryModal.setState({
                    coda: event.target.value,
                    hasChanged: event.target.value != editDictionaryModal.props.details.phonology.phonotactics.coda.join('\n'),
                  });
                }}
              />
            </div>
          </div>
        </div>

      </div>

      <div className='columns'>
        <div className='column'>

          <div className='field'>
            <label className='label' htmlFor='editExceptions'>
              Exceptions
            </label>
            <p className='help'>
              Any exceptions for your phonotactics rules, <a href={ MARKDOWN_LINK } target='_blank'>Markdown</a> enabled
            </p>
            <div className='control'>
              <textarea className='textarea' id='editExceptions'
                placeholder='Vowel blends are not allowed in the onset, and [e], including blends with [e] comprising it, is not allowed in the coda.'
                value={ exceptions }
                onInput={ (event) => {
                  editDictionaryModal.setState({
                    exceptions: event.target.value,
                    hasChanged: event.target.value != editDictionaryModal.props.details.phonology.phonotactics.exceptions,
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

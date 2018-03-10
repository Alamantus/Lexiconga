import Inferno from 'inferno';
import PropTypes from 'prop-types';

import { LargeTextArea } from '../LargeTextArea';

export const EditSettingsForm = (props) => {
  PropTypes.checkPropTypes({
    editDictionaryModal: PropTypes.object.isRequired,
    allowDuplicates: PropTypes.bool.isRequired,
    caseSensitive: PropTypes.bool.isRequired,
    sortByDefinition: PropTypes.bool.isRequired,
    isComplete: PropTypes.bool.isRequired,
    specification: PropTypes.string.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    isPublic: PropTypes.bool.isRequired,
  }, props, 'prop', 'EditSettingsForm');

  const {
    editDictionaryModal,
    allowDuplicates,
    caseSensitive,
    sortByDefinition,
    isComplete,
    specification,
    isLoggedIn,
    isPublic,
  } = props;
  return (
    <div className='form'>
    
      <div className='field'>
        <div className='control'>
          <input className='is-checkradio is-rtl' type='checkbox' id='allowDuplicates'
            defaultChecked={ allowDuplicates }
            onChange={ (event) => {
              editDictionaryModal.setState({
                allowDuplicates: event.target.checked,
                hasChanged: event.target.checked != editDictionaryModal.props.allowDuplicates,
              });
            }} />
          <label class='label is-unselectable' htmlFor='allowDuplicates'>
            Allow Duplicate Words
          </label>
          <div className='help'>
            Checking this box will allow any number of the exact same spelling of a word to be added
          </div>
        </div>
      </div>
    
      <div className='field'>
        <div className='control'>
          <input className='is-checkradio is-rtl' type='checkbox' id='caseSensitive'
            defaultChecked={ caseSensitive }
            disabled={ allowDuplicates }
            onChange={ (event) => {
              editDictionaryModal.setState({
                caseSensitive: event.target.checked,
                hasChanged: event.target.checked != editDictionaryModal.props.caseSensitive,
              });
            }} />
          <label className='label is-unselectable' htmlFor='caseSensitive'
            Disabled={allowDuplicates ? 'disabled' : null}
            title={allowDuplicates ? 'Disabled because allowing duplicates makes this unnecessary' : null}>
            Words are Case-Sensitive
          </label>
          <div className='help'>
            Checking this box will allow any words spelled the same but with different capitalization to be added.
          </div>
        </div>
      </div>
    
      <div className='field'>
        <div className='control'>
          <input className='is-checkradio is-rtl' type='checkbox' id='sortByDefinition'
            defaultChecked={ sortByDefinition }
            onChange={ (event) => {
              editDictionaryModal.setState({
                sortByDefinition: event.target.checked,
                hasChanged: event.target.checked != editDictionaryModal.props.sortByDefinition,
              });
            }} />
          <label className='label is-unselectable' htmlFor='sortByDefinition'>
            Sort by Definition
          </label>
          <div className='help'>
            Checking this box will sort the words in alphabetical order based on the Definition instead of the Word.
          </div>
        </div>
      </div>
    
      <div className='field'>
        <div className='control'>
          <input className='is-checkradio is-rtl' type='checkbox' id='isComplete'
            defaultChecked={ isComplete }
            onChange={ (event) => {
              editDictionaryModal.setState({
                isComplete: event.target.checked,
                hasChanged: event.target.checked != editDictionaryModal.props.isComplete,
              });
            }} />
          <label className='label is-unselectable' htmlFor='isComplete'>
            Mark Complete
          </label>
          <div className='help'>
            Checking this box will mark your { specification } as 'complete' and prevent any changes from being made.
          </div>
        </div>
      </div>
    
      {isLoggedIn
        && (
          <div className='field'>
            <div className='control'>
              <input className='is-checkradio is-rtl' type='checkbox' id='isPublic'
                defaultChecked={ isPublic }
                onChange={ (event) => {
                  editDictionaryModal.setState({
                    isPublic: event.target.checked,
                    hasChanged: event.target.checked != editDictionaryModal.props.isPublic,
                  });
                }} />
              <label className='label is-unselectable' htmlFor='isPublic'>
                Make Public
              </label>
              <div className='help'>
                Checking this box will make your { specification } as public.
                {
                  isPublic
                  ? [<br />, 'Use this link to share it: PUBLIC_LINK']
                  : ' You will receive a public link that you can share with others.'
                }
              </div>
            </div>
          </div>
        )
      }

    </div>
  );
}

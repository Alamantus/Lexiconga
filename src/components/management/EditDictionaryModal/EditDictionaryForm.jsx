import Inferno from 'inferno';
import PropTypes from 'prop-types';

import { LargeTextArea } from '../LargeTextArea';

export const EditDictionaryForm = (props) => {
  PropTypes.checkPropTypes({
    editDictionaryModal: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    specification: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }, props, 'prop', 'EditDictionaryForm');

  const {
    editDictionaryModal,
    name,
    specification,
    description,
  } = props;
  return (
    <div className='form'>
      <div className='field'>
        <label className='label' htmlFor='editName'>
          Name
        </label>
        <div className='control'>
          <input className='input' id='editName' type='text'
            placeholder={ `${ specification || 'Dictionary' } Name` }
            value={ name }
            onInput={ (event) => {
              editDictionaryModal.setState({
                name: event.target.value,
                hasChanged: event.target.value != editDictionaryModal.props.name,
              });
            }}
          />
        </div>
      </div>

      <div className='field'>
        <label className='label' htmlFor='editSpecification'>
          Specification
        </label>
        <div className='help'>
          What this collection of words should be referred to as, i.e. "Dictionary," "Word List", etc.
        </div>
        <div className='control'>
          <input className='input' id='editSpecification' type='text'
            placeholder='Dictionary'
            value={ specification }
            onInput={ (event) => {
              editDictionaryModal.setState({
                specification: event.target.value,
                hasChanged: event.target.value != editDictionaryModal.props.specification,
              });
            }}
          />
        </div>
      </div>

      <LargeTextArea
        label='Description'
        helpText={[
          'A description of your dictionary, ',
          <a href={ MARKDOWN_LINK } target='_blank'>Markdown</a>,
          ' enabled'
        ]}
        value={ description }
        placeholder='Explanation of word (Markdown enabled)'
        onInput={ (event) => {
          editDictionaryModal.setState({
            description: event.target.value,
            hasChanged: event.target.value != editDictionaryModal.props.description,
          });
        }} />

      {/* Custom alphabetical order is restricted to paid. */}

    </div>
  );
}

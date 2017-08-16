import Inferno from 'inferno';
import Component from 'inferno-component';

import dictionary from '../../../../managers/DictionaryData';

export const EditDictionaryForm = ({
  editDictionaryModal,
  name,
  specification,
  description,
}) => {
  return (
    <div className='form'>
      <div className='field'>
        <label className='label'>Name</label>
        <div className='control'>
          <input className='input' type='text'
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
        <label className='label'>Specification</label>
        <div className='control'>
          <input className='input' type='text'
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

      <div className='field'>
        <label className='label' htmlFor='dictionaryDescription'>Description</label>
        <div className='control'>
          <textarea className='textarea' id='dictionaryDescription'
            placeholder={ `A description of your ${ specification }` }
            value={ description }
            onInput={ (event) => {
              editDictionaryModal.setState({
                description: event.target.value,
                hasChanged: event.target.value != editDictionaryModal.props.description,
              });
            }}
          />
        </div>
      </div>
    </div>
  );
}

import Inferno from 'inferno';
import Component from 'inferno-component';

export const EditDictionaryForm = ({
  editDictionaryModal,
  name,
  specification,
  description,
}) => {
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
        <p className='help'>
          What this collection of words should be referred to as, i.e. "Dictionary," "Word List", etc.
        </p>
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

      <div className='field'>
        <label className='label' htmlFor='editDescription'>
          Description
        </label>
        <p className='help'>
          A description of your dictionary, <a href='MARKDOWN_LINK' target='_blank'>Markdown</a> enabled
        </p>
        <div className='control'>
          <textarea className='textarea' id='editDescription'
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

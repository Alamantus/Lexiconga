import Inferno from 'inferno';
import Component from 'inferno-component';

export class WordForm extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <div className='box'>
        <div className='field'>
          <label className='label'>Word</label>
          <p className='control'>
            <input className='input' type='text' placeholder='Required' />
          </p>
        </div>

        <div className='field'>
          <label className='label'>Pronunciation</label>
          <p className='control'>
            <input className='input' type='text' placeholder='[prəˌnʌnsiˈeɪʃən]' />
          </p>
        </div>

        <div className='field'>
          <label className='label'>Part of Speech</label>
          <p className='control'>
            <span className='select'>
              <select>
                <option></option>
                {this.props.partsOfSpeech.map((partOfSpeech) => {
                  return (
                    <option value={partOfSpeech}>{partOfSpeech}</option>
                  );
                })}
              </select>
            </span>
          </p>
        </div>

        <div className='field'>
          <label className='label'>Definition</label>
          <p className='control'>
            <input className='input' type='text' placeholder='Text input' />
          </p>
        </div>
        
        <div className='field'>
          <label className='label'>Details</label>
          <p className='control'>
            <textarea className='textarea' placeholder='Textarea' />
          </p>
        </div>
      </div>
    );
  }
}

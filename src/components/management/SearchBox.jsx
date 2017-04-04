import Inferno from 'inferno';
import Component from 'inferno-component';

export class SearchBox extends Component {
  constructor (props) {
    super(props);
  }

  showFilterOptions () {
    if (this.props.hasOwnProperty('partsOfSpeech')
        && this.props.partsOfSpeech.length > 0) {
      let filterOptionsJSX = this.props.partsOfSpeech.map((partOfSpeech) => {
        return (
          <label key={'filterPartOfSpeech' + Date.now()}
            className='checkbox'>
            <input type='checkbox' />
            {partOfSpeech}
          </label>
        );
      });

      return (
        <div className='field'>
          <label>Filter</label>
          <p className='control'>
            {filterOptionsJSX}
          </p>
        </div>
      );
    }
  }

  render () {
    return (
      <div className='message'>
        <div class="message-header">
          <span>
            Search
          </span>
          <button class="delete"></button>
        </div>
        <div class="message-body">
          <div className='field'>
            <div className='control'>
              <input className='input' type='text' placeholder='Search Term' />
            </div>
          </div>
          
          <div className='field is-horizontal'>
            <div className='field-label'>
              <label className='label'>
                Search In
              </label>
            </div>
            <div className='field-body'>
              <div className='field is-narrow'>
                <div className='control'>
                  <label className='radio'>
                    <input type='radio' name='member' value='Word' checked />
                    Word
                  </label>
                  <label className='radio'>
                    <input type='radio' name='member' />
                    Definition
                  </label>
                  <label className='radio'>
                    <input type='radio' name='member' />
                    Details
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {this.showFilterOptions()}

      </div>
    );
  }
}

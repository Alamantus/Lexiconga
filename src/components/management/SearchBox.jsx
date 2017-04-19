import Inferno from 'inferno';
import Component from 'inferno-component';

export class SearchBox extends Component {
  constructor (props) {
    super(props);

    this.state = {
      searchingIn: 'name'
    , searchTerm: ''
    , showHeader: false
    , showAdvanced: false
    };
  }

  displaySearchHeader () {
    if (this.state.showHeader) {
      return (
        <header className='search-bar is-small'>
          <div className='search-body'>
            <div className='search-background'
              onClick={() => this.hideHeader()} />

            <div className='container'>
              <div className='box'>
                <div className='columns is-mobile'>

                  <div className='column'>
                    <div className='field has-addons'>
                      <p className='control'>
                        <span className='select'>
                          <select value={this.state.searchingIn}
                            onChange={event => {
                              console.log(event);
                              this.setState({searchingIn: event.target.value});
                            }}>
                            <option value='name'>Word</option>
                            <option value='definition'>Definition</option>
                            <option value='details'>Details</option>
                          </select>
                        </span>
                      </p>
                      <p className='control is-expanded'>
                        <input className='input' type='text' placeholder='Search Term'
                          value={this.state.searchTerm}
                          onChange={event => {
                            console.log(event);
                            this.setState({searchTerm: event.target.value});
                          }} />
                      </p>
                    </div>

                    {this.showFilterOptions()}
                    
                  </div>

                  <div className='column is-narrow'>
                    <div className='field has-addons'>
                      <a className='delete'
                        onClick={() => this.hideHeader()} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
      );
    }
  }

  showFilterOptions () {
    if (this.props.hasOwnProperty('partsOfSpeech')
        && this.props.partsOfSpeech.length > 0) {
      let filterSectionJSX = (
        <div className='field is-horizontal'>
          <div className='field-label is-normal'>
            <label className='label'>Filter</label>
          </div>
          <div className='field-body'>
            <div className='field is-grouped'>
            {this.props.partsOfSpeech.map((partOfSpeech) => {
              return (
                <p className='control'>
                  <label key={'filterPartOfSpeech' + Date.now()}
                    className='checkbox'>
                    <input type='checkbox' checked={true} />
                    {partOfSpeech}
                  </label>
                </p>
              );
            })}
            </div>
          </div>
        </div>
      );

      let advancedSectionJSX = (
        <div className='column'>
          <div className='box'>
            {filterSectionJSX}
          </div>
        </div>
      );

      return (
        <div class='columns'>
          <div class='column is-narrow'>
            <div className='field'>
              <p className='control'>
                <a className='button is-link is-small'
                  onClick={() => this.setState({showAdvanced: !this.state.showAdvanced})}>
                  Advanced
                </a>
              </p>
            </div>
          </div>
          {this.state.showAdvanced ? advancedSectionJSX : null}
        </div>
      );
    }
  }

  showHeader () {
    this.setState({
      showHeader: true
    });
  }

  hideHeader () {
    this.setState({
      showHeader: false
    });
  }

  render () {
    return (
      <div>
        <div className='field has-addons is-hidden-touch'>
          <p className='control'>
            <input className='input' type='text' readonly={true}
              value={this.state.searchTerm}
              onClick={() => this.showHeader()} />
          </p>
          <p className='control'>
            <a className='button is-link'
              onClick={() => this.showHeader()}>
              Search
            </a>
          </p>
        </div>

        <a className='button is-hidden-desktop'
          onClick={() => this.showHeader()}>
          S
        </a>

        {this.displaySearchHeader()}
      </div>
    );
  }
}

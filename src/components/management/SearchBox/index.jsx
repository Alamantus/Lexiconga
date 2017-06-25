import Inferno from 'inferno';
import Component from 'inferno-component';

import Helper from '../../../Helper';

import dictionary from '../../../managers/DictionaryData';

import METHOD from './SearchMethod.js';

export class SearchBox extends Component {
  constructor (props) {
    super(props);

    this.state = {
      searchingIn: 'name',
      searchMethod: METHOD.contains,
      searchTerm: '',
      filteredPartsOfSpeech: [],
      showHeader: false,
      showAdvanced: false,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.showHeader && this.searchBox) {
      this.searchBox.focus();
    }
  }

  search () {
    const {searchingIn, searchMethod, searchTerm, filteredPartsOfSpeech} = this.state;
    const searchConfig = {
      searchingIn,
      searchMethod,
      searchTerm,
      filteredPartsOfSpeech,
    };

    this.props.search(searchConfig);
  }

  displaySearchHeader () {
    if (this.state.showHeader) {
      return (
        <header className='search-bar is-small'>
          <div className='search-body'>
            <div className='search-background'
              onClick={ this.hideHeader.bind(this) } />

            <div className='container'>
              <div className='box'>
                <div className='columns is-mobile'>

                  <div className='column'>
                    <div className='field has-addons'>
                      <p className='control'>
                        <span className='select'>
                          <select value={ this.state.searchingIn }
                            onChange={event => {
                              this.setState({ searchingIn: event.target.value });
                            }}>
                            <option value='name'>Word</option>
                            <option value='definition'>Definition</option>
                            <option value='details'>Details</option>
                          </select>
                        </span>
                      </p>
                      <p className='control is-expanded'>
                        <input className='input' type='text' placeholder='Search Term'
                          ref={input => {
                            this.searchBox = input;
                          }}
                          value={ this.state.searchTerm }
                          onChange={event => {
                            console.log(event);
                            this.setState({ searchTerm: event.target.value });
                          }} />
                      </p>
                    </div>

                    { this.showFilterOptions() }
                    
                  </div>

                  <div className='column is-narrow'>
                    <div className='field has-addons'>
                      <a className='delete'
                        onClick={ this.hideHeader.bind(this) }
                      />
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
    if (this.props.partsOfSpeech.length > 0) {
      const searchMethodSectionJSX = this.state.searchingIn !== 'details'
        ? (
          <div className='field is-horizontal'>
            <div className='field-label is-normal'>
              <label className='label'>Search Method</label>
            </div>
            <div className='field-body'>
              <div className='field'>
                <p className='control'>
                  <label className='radio'
                    title={ `Search term is anywhere within the ${ this.state.searchingIn.capitalize() }` }
                  >
                    <input type='radio' name='searchmethod'
                      value={ METHOD.contains }
                      checked={ this.state.searchMethod === METHOD.contains }
                      onClick={event => {
                        if (event.currentTarget.checked) {
                          this.setState({
                            searchMethod: event.currentTarget.value,
                          });
                        }
                      }}
                    />
                    Contains
                  </label>
                  <label className='radio'
                    title={ `The ${ this.state.searchingIn.capitalize() } begins with the search term` }
                  >
                    <input type='radio' name='searchmethod'
                      value={ METHOD.startsWith }
                      checked={ this.state.searchMethod === METHOD.startsWith }
                      onClick={event => {
                        if (event.currentTarget.checked) {
                          this.setState({
                            searchMethod: event.currentTarget.value,
                          });
                        }
                      }}
                    />
                    Starts With
                  </label>
                  <label className='radio'
                    title={ `The ${ this.state.searchingIn.capitalize() } ends with the search term` }
                  >
                    <input type='radio' name='searchmethod'
                      value={ METHOD.endsWith }
                      checked={ this.state.searchMethod === METHOD.endsWith }
                      onClick={event => {
                        if (event.currentTarget.checked) {
                          this.setState({
                            searchMethod: event.currentTarget.value,
                          });
                        }
                      }}
                    />
                    Ends With
                  </label>
                  <label className='radio'
                    title={ `Search term matches the ${ this.state.searchingIn.capitalize() } exactly` }
                  >
                    <input type='radio' name='searchmethod'
                      value={ METHOD.isExactly }
                      checked={ this.state.searchMethod === METHOD.isExactly }
                      onClick={event => {
                        if (event.currentTarget.checked) {
                          this.setState({
                            searchMethod: event.currentTarget.value,
                          });
                        }
                      }}
                    />
                    Exact
                  </label>
                </p>
              </div>
            </div>
          </div>
        )
        : null;

      const filterSectionJSX = (
        <div className='field is-horizontal'>
          <div className='field-label is-normal'>
            <label className='label'>Filter</label>
          </div>
          <div className='field-body'>
            <div className='field is-grouped'>
            {
              this.props.partsOfSpeech.map(partOfSpeech => {
                return (
                  <p className='control'>
                    <label key={ 'filterPartOfSpeech' + Date.now() }
                      className='checkbox'>
                      <input type='checkbox' checked={ true } />
                      { partOfSpeech }
                    </label>
                  </p>
                );
              })
            }
            </div>
          </div>
        </div>
      );

      const advancedSectionJSX = (
        <div className='column'>
          <div className='box'>
            { searchMethodSectionJSX }
            { filterSectionJSX }
          </div>
        </div>
      );

      return (
        <div class='columns'>
          <div class='column is-narrow'>
            <div className='field'>
              <p className='control'>
                <a className={ `button is-link is-small${ this.state.showAdvanced ? ' is-active' : '' }` }
                  onClick={ () => this.setState({ showAdvanced: !this.state.showAdvanced }) }>
                  Advanced
                </a>
              </p>
            </div>
          </div>
          { this.state.showAdvanced ? advancedSectionJSX : null }
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
            <input className='input' type='text' readonly={ true }
              value={ this.state.searchTerm }
              onClick={ this.showHeader.bind(this) } />
          </p>
          <p className='control'>
            <a className='button is-link'
              onClick={ this.showHeader.bind(this) }>
              Search
            </a>
          </p>
        </div>

        <a className='button is-hidden-desktop'
          onClick={ this.showHeader.bind(this) }>
          <span className='icon'>
            <i className='fa fa-search' />
          </span>
        </a>

        { this.displaySearchHeader() }
      </div>
    );
  }
}

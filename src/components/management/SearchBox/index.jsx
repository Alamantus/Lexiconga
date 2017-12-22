import Inferno from 'inferno';
import Component from 'inferno-component';
import PropTypes from 'prop-types';

import './styles.scss';

import dictionary from '../../../managers/DictionaryData';

import METHOD from './SearchMethod.js';

export class SearchBox extends Component {
  constructor (props) {
    super(props);

    PropTypes.checkPropTypes({
      partsOfSpeech: PropTypes.array,
      search: PropTypes.func.isRequired,
    }, props, 'prop', 'SearchBox');

    this.state = {
      searchingIn: 'name',
      searchMethod: METHOD.contains,
      searchTerm: '',
      caseSensitive: false,
      ignoreDiacritics: false,
      filteredPartsOfSpeech: [...props.partsOfSpeech, 'Uncategorized'],
      showHeader: false,
      showAdvanced: false,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.showHeader && this.searchBox) {
      this.searchBox.focus();
    }
  }

  get partsOfSpeechForFilter () {
    return [...this.props.partsOfSpeech, 'Uncategorized'];
  }

  search () {
    const {
      searchingIn,
      searchMethod,
      searchTerm,
      caseSensitive,
      ignoreDiacritics,
      filteredPartsOfSpeech,
    } = this.state;

    const searchConfig = {
      searchingIn,
      searchMethod,
      searchTerm,
      caseSensitive,
      ignoreDiacritics,
      filteredPartsOfSpeech,
    };

    this.props.search(searchConfig);
  }

  togglePartOfSpeech (event) {
    const uniquePartsOfSpeech = new Set(this.partsOfSpeechForFilter);
    if (event.target.checked) {
      uniquePartsOfSpeech.add(event.target.value);
    } else {
      uniquePartsOfSpeech.delete(event.target.value);
    }
    this.setState({ filteredPartsOfSpeech: [...uniquePartsOfSpeech] }, () => this.search());
  }

  toggleCaseSensitive (event) {
    this.setState({ caseSensitive: event.target.checked }, () => this.search());
  }

  toggleIgnoreDiacritics (event) {
    this.setState({ ignoreDiacritics: event.target.checked }, () => this.search());
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
                      <div className='control'>
                        <span className='select'>
                          <select value={ this.state.searchingIn }
                            onChange={(event) => {
                              this.setState({ searchingIn: event.target.value }, () => this.search());
                            }}>
                            <option value='name'>Word</option>
                            <option value='definition'>Definition</option>
                            <option value='details'>Details</option>
                          </select>
                        </span>
                      </div>
                      <div className='control is-expanded has-icons-left'>
                        <input className='input' type='text' placeholder='Search Term'
                          ref={(input) => {
                            this.searchBox = input;
                          }}
                          value={ this.state.searchTerm }
                          onChange={(event) => {
                            this.setState({ searchTerm: event.target.value.trim() }, () => this.search());
                          }} />
                          <span className='icon is-small is-left'>
                            <i className='fa fa-search' />
                          </span>
                      </div>
                      <div className='control'>
                        <a className='button' onClick={() => this.setState({ searchTerm: '' }, () => this.search())}>
                          Clear
                        </a>
                      </div>
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
                <div className='control'>
                  <label className='radio'
                    title={ `Search term is anywhere within the ${ this.state.searchingIn.capitalize() }` }
                  >
                    <input type='radio' name='searchmethod'
                      value={ METHOD.contains }
                      checked={ this.state.searchMethod === METHOD.contains }
                      onClick={(event) => {
                        if (event.currentTarget.checked) {
                          this.setState({
                            searchMethod: event.currentTarget.value,
                          }, () => this.search());
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
                      onClick={(event) => {
                        if (event.currentTarget.checked) {
                          this.setState({
                            searchMethod: event.currentTarget.value,
                          }, () => this.search());
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
                      onClick={(event) => {
                        if (event.currentTarget.checked) {
                          this.setState({
                            searchMethod: event.currentTarget.value,
                          }, () => this.search());
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
                      onClick={(event) => {
                        if (event.currentTarget.checked) {
                          this.setState({
                            searchMethod: event.currentTarget.value,
                          }, () => this.search());
                        }
                      }}
                    />
                    Is Exactly
                  </label>
                </div>
              </div>
            </div>
          </div>
        )
        : null;

      const optionsSectionJSX = (
        <div className='field is-horizontal'>
          <div className='field-label is-normal'>
            <label className='label'>Search Options</label>
          </div>
          <div className='field-body'>
            <div className='field is-grouped'>
              <div className='control'>
                <label className='checkbox'>
                  Search Case-Sensitive{ ' ' }
                  <input type='checkbox' defaultChecked={ this.state.caseSensitive }
                    onChange={ this.toggleCaseSensitive.bind(this) }
                  />
                </label>
              </div>
              <div className='control'>
                <label className='checkbox'>
                  Ignore Diacritics{ ' ' }
                  <input type='checkbox' defaultChecked={ this.state.ignoreDiacritics }
                    onChange={ this.toggleIgnoreDiacritics.bind(this) }
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      );

      const filterSectionJSX = (
        <div className='field is-horizontal'>
          <div className='field-label is-normal'>
            <label className='label'>Filter</label>
          </div>
          <div className='field-body'>
            <div className='field is-grouped'>
            {
              this.partsOfSpeechForFilter.map(partOfSpeech => {
                return (
                  <div className='control'>
                    <label key={ 'filterPartOfSpeech' + Date.now() }
                      className='checkbox'>
                      <input type='checkbox' value={ partOfSpeech }
                        defaultChecked={ this.state.filteredPartsOfSpeech.includes(partOfSpeech) }
                        onChange={this.togglePartOfSpeech.bind(this)}
                      />
                      { partOfSpeech }
                    </label>
                  </div>
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
            { optionsSectionJSX }
            { filterSectionJSX }
          </div>
        </div>
      );

      return (
        <div class='columns'>
          <div class='column is-narrow'>
            <div className='field'>
              <div className='control'>
                <a className={ `button is-link is-small${ this.state.showAdvanced ? ' is-active' : '' }` }
                  onClick={ () => this.setState({ showAdvanced: !this.state.showAdvanced }) }>
                  Advanced
                </a>
              </div>
            </div>
          </div>
          { this.state.showAdvanced ? advancedSectionJSX : null }
        </div>
      );
    }
  }

  showHeader () {
    this.setState({
      showHeader: true,
    });
  }

  hideHeader () {
    this.setState({
      showHeader: false,
    });
  }

  render () {
    return (
      <div>
        <div className='field has-addons is-hidden-touch'>
          <div className='control'>
            <input className='open-search-input' type='text' readonly={ true }
              value={ this.state.searchTerm }
              onClick={ this.showHeader.bind(this) } />
          </div>
          <div className='control'>
            <a className='button is-link'
              onClick={ this.showHeader.bind(this) }>
              Search
            </a>
          </div>
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

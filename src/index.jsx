// import 'font-awesome/scss/font-awesome.scss';
import './sass/main.scss';

import Inferno from 'inferno';
import { Component, render } from 'inferno';
import store from 'store';

import removeDiacritics from '../vendor/StackOverflow/removeDiacritics';
import { DEFAULT_PREFERENCES } from './Constants';
import { addHelpfulPrototypes, getWordsStats } from './Helpers';
addHelpfulPrototypes();

import dictionary from './managers/DictionaryData';
import { Updater } from './managers/Updater';
import SEARCH_METHOD from './components/management/SearchBox/SearchMethod';

if (process.env.NODE_ENV !== 'production') {
  require('inferno-devtools');
}

import { Header } from './components/structure/Header';
import { MainDisplay } from './components/MainDisplay';
import { Footer } from './components/structure/Footer';

class App extends Component {
  constructor (props) {
    super(props);

    this.state = {
      name: dictionary.name,
      specification: dictionary.specification,
      description: dictionary.description,
      partsOfSpeech: dictionary.partsOfSpeech,
      details: dictionary.details,
      settings: dictionary.settings,
      stats: {},
      alphabeticalOrder: dictionary.alphabeticalOrder,

      displayedWords: [],
      currentPage: 0,
      searchConfig: {
        searchingIn: 'name',
        searchMethod: SEARCH_METHOD.contains,
        searchTerm: '',
        caseSensitive: false,
        ignoreDiacritics: false,
        filteredPartsOfSpeech: [...dictionary.partsOfSpeech, 'Uncategorized'],
      },
      isLoadingWords: true,
      wordsInCurrentList: null,
    }

    this.updater = new Updater(this, dictionary);

    this.updateDisplayedWords(() => {
      if (store.get('LexicongaToken')) this.updater.sync();
    });
  }

  get dictionaryInfo () {
    const {
      name,
      specification,
      description,
      partsOfSpeech,
      details,
      settings,
      stats,
      alphabeticalOrder,
    } = this.state;

    return {
      name,
      specification,
      description,
      partsOfSpeech,
      details,
      settings,
      stats,
      alphabeticalOrder,
    };
  }

  get isUsingFilter () {
    const partsOfSpeechForFilter = [...this.state.partsOfSpeech, 'Uncategorized'];
    return this.state.searchConfig.searchTerm !== ''
        || partsOfSpeechForFilter.length !== this.state.searchConfig.filteredPartsOfSpeech.length;
  }

  updatePartsOfSpeech () {
    this.setState({
      partsOfSpeech: dictionary.partsOfSpeech,
    });
  }

  updateDisplayedWords (callback = () => {}) {
    dictionary.wordsPromise.then(words => {
      const preferences = store.get('LexicongaPreferences');
      const itemsPerPage = preferences && preferences.hasOwnProperty('itemsPerPage') ? preferences.itemsPerPage : DEFAULT_PREFERENCES.itemsPerPage;
      const { searchConfig, partsOfSpeech, currentPage } = this.state;
      const partsOfSpeechForFilter = [...partsOfSpeech, 'Uncategorized'];
      const pageStart = currentPage * itemsPerPage;
      const pageEnd = pageStart + itemsPerPage;
      let displayedWords = words;
      if (this.isUsingFilter) {
        const {
          searchingIn,
          searchTerm,
          searchMethod,
          caseSensitive,
          ignoreDiacritics,
          filteredPartsOfSpeech
        } = searchConfig;

        displayedWords = displayedWords.filter((word, index) => {
          const wordPartOfSpeech = word.partOfSpeech === '' ? 'Uncategorized' : word.partOfSpeech;
          if (!filteredPartsOfSpeech.includes(wordPartOfSpeech)) {
            return false;
          }
          if (searchingIn === 'details') {
            let term = searchTerm;
            let wordsOnly = word.details
              .replace(/[\*_\|]|(\s*[\*-]\s)|-+/g, '')  // Common Markdown
              .replace(/\[\[(.+)\]\]/g, '$&')           // Double brackets
              .replace(/\!?\[(.+)\]\(.*\)/g, '$&');     // Links/images

            if (ignoreDiacritics) {
              wordsOnly = removeDiacritics(wordsOnly);
              term = removeDiacritics(term);
            }
            if (!caseSensitive) {
              wordsOnly = wordsOnly.toLowerCase();
              term = term.toLowerCase();
            }

            console.log(wordsOnly);

            return wordsOnly.includes(term);
          } else {
            let wordPart = word[searchingIn];
            let term = searchTerm;
            if (ignoreDiacritics) {
              wordPart = removeDiacritics(wordPart);
              term = removeDiacritics(term);
            }
            if (!caseSensitive) {
              wordPart = wordPart.toLowerCase();
              term = term.toLowerCase();
            }
            switch (searchMethod) {
              case 'contains':
              default: {
                return wordPart.includes(term);
                break;
              }
              case 'start': {
                return wordPart.startsWith(term);
                break;
              }
              case 'end': {
                return wordPart.endsWith(term);
                break;
              }
              case 'exact': {
                return wordPart === term;
                break;
              }
            }
          }
        });
      }

      const wordsInCurrentList = displayedWords.length;

      displayedWords = displayedWords.filter((word, index) => {
        if (index < pageStart || index >= pageEnd) {
          return false;
        }
        return true;
      });

      this.setState({
        displayedWords,
        stats: getWordsStats(words, partsOfSpeech, this.state.settings.caseSensitive),
        wordsInCurrentList,
        isLoadingWords: false,
      }, () => callback());
    });
  }

  search (searchConfig) {
    this.setState({
      isLoadingWords: true,
      searchConfig: searchConfig,
    }, () => this.updateDisplayedWords());
  }

  setPage (newPage) {
    this.setState({
      isLoadingWords: true,
      currentPage: newPage,
    }, () => this.updateDisplayedWords());
  }

  render () {
    return (
      <div>
        <Header
          partsOfSpeech={ this.state.partsOfSpeech }
          search={ (searchConfig) => this.search(searchConfig) }
          updater={ this.updater }
          dictionary={ dictionary }
        />

        <MainDisplay
          dictionaryInfo={ this.dictionaryInfo }
          isLoadingWords={ this.state.isLoadingWords }
          wordsToDisplay={ this.state.displayedWords }
          wordsAreFiltered={ this.isUsingFilter }
          wordsInCurrentList={ this.state.wordsInCurrentList }
          currentPage={ this.state.currentPage }
          stats={ this.state.stats }
          setPage={ this.setPage.bind(this) }
          updateDisplay={ this.updateDisplayedWords.bind(this) }
          updater={ this.updater }
        />

        <Footer />
      </div>
    );
  }
}

render(<App />, document.getElementById('site'));

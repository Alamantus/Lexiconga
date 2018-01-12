// import 'font-awesome/scss/font-awesome.scss';
import './sass/main.scss';

import Inferno from 'inferno';
import Component from 'inferno-component';

import removeDiacritics from '../vendor/StackOverflow/removeDiacritics';
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
      searchConfig: {
        searchingIn: 'name',
        searchMethod: SEARCH_METHOD.contains,
        searchTerm: '',
        caseSensitive: false,
        ignoreDiacritics: false,
        filteredPartsOfSpeech: [...dictionary.partsOfSpeech, 'Uncategorized'],
      },
    }

    this.updater = new Updater(this, dictionary);

    this.updateDisplayedWords();
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
      const { searchConfig, partsOfSpeech } = this.state;
      const partsOfSpeechForFilter = [...partsOfSpeech, 'Uncategorized'];
      let displayedWords;
      if (this.isUsingFilter) {
        const {
          searchingIn,
          searchTerm,
          searchMethod,
          caseSensitive,
          ignoreDiacritics,
          filteredPartsOfSpeech
        } = searchConfig;

        displayedWords = words.filter((word) => {
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
      } else {
       displayedWords = words;
      }

      this.setState({
        displayedWords,
        stats: getWordsStats(words, partsOfSpeech, this.state.settings.caseSensitive),
      }, () => callback());
    });
  }

  search (searchConfig) {
    this.setState({
      searchConfig: searchConfig,
    }, () => this.updateDisplayedWords());
  }

  render () {
    return (
      <div>
        <Header
          partsOfSpeech={ this.state.partsOfSpeech }
          search={ (searchConfig) => this.search(searchConfig) }
          updater={ this.updater }
        />

        <MainDisplay
          dictionaryInfo={ this.dictionaryInfo }
          wordsToDisplay={ this.state.displayedWords }
          wordsAreFiltered={ this.isUsingFilter }
          updateDisplay={ this.updateDisplayedWords.bind(this) }
          updater={ this.updater }
        />

        <Footer />
      </div>
    );
  }
}

Inferno.render(<App />, document.getElementById('site'));

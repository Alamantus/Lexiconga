// import 'font-awesome/scss/font-awesome.scss';
import './sass/main.scss';

import Inferno from 'inferno';
import Component from 'inferno-component';

import { addHelpfulPrototypes, getWordsStats } from './Helpers';
addHelpfulPrototypes();

import dictionary from './managers/DictionaryData';
import { Updater } from './managers/Updater';

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
      searchConfig: null,
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

  updatePartsOfSpeech () {
    this.setState({
      partsOfSpeech: dictionary.partsOfSpeech,
    });
  }

  updateDisplayedWords (callback = () => {}) {
    // const {searchIn, searchTerm, filteredPartsOfSpeech} = this.state.searchConfig;

    // TODO: Sort out searching to remove this temporary solution.
    dictionary.wordsPromise.then(words => {
      this.setState({
        displayedWords: words,
        stats: getWordsStats(words, this.state.partsOfSpeech, this.state.settings.caseSensitive),
      }, () => callback());
    });
  }

  search (searchConfig) {
    this.setState({
      searchConfig: searchConfig,
    });
  }

  render () {
    return (
      <div>
        <Header
          partsOfSpeech={ this.state.partsOfSpeech }
          search={ (searchConfig) => this.search(searchConfig) }
        />

        <MainDisplay
          dictionaryInfo={ this.dictionaryInfo }
          wordsToDisplay={ this.state.displayedWords }
          updateDisplay={ this.updateDisplayedWords.bind(this) }
          updater={ this.updater }
        />

        <Footer />
      </div>
    );
  }
}

Inferno.render(<App />, document.getElementById('site'));

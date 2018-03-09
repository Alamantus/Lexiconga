import Inferno from 'inferno';
import { Component } from 'inferno';
import PropTypes from 'prop-types';

import { LeftColumn } from './structure/LeftColumn';
import { RightColumn } from './structure/RightColumn';
import { Pagination } from './structure/Pagination';

import { WordForm } from './management/WordForm';
import { DictionaryDetails } from './display/DictionaryDetails';
import { WordsList } from './display/WordsList';

export class MainDisplay extends Component {
  constructor (props) {
    super(props);

    PropTypes.checkPropTypes({
      dictionaryInfo: PropTypes.object.isRequired,
      wordsToDisplay: PropTypes.array.isRequired,
      wordsAreFiltered: PropTypes.bool,
      wordsInCurrentList: PropTypes.number,
      currentPage: PropTypes.number,
      itemsPerPage: PropTypes.number,
      stats: PropTypes.object.isRequired,
      setPage: PropTypes.func.isRequired,
      updateDisplay: PropTypes.func.isRequired,
      updater: PropTypes.object.isRequired,
    }, props, 'prop', 'MainDisplay');

    this.state = {
      isMobile: false,
      wordFormIsOpen: true,
    };
  }

  openWordForm () {
    this.setState({ wordFormIsOpen: true });
  }

  closeWordForm () {
    this.setState({ wordFormIsOpen: false });
  }

  checkIsMobile () {
    this.setState({ isMobile: window.innerWidth < 769 });
  }

  componentDidMount () {
    window.addEventListener('resize', this.checkIsMobile.bind(this));
  }

  componentWillUnmount () {
    window.removeEventListener('resize');
  }

  render () {
    const {
      dictionaryInfo,
      wordsToDisplay,
      wordsAreFiltered,
      wordsInCurrentList,
      currentPage,
      itemsPerPage,
      stats,
      setPage,
      updateDisplay,
      updater,
    } = this.props;
    const { isMobile, wordFormIsOpen } = this.state;
    const wordFormIsDisabled = dictionaryInfo.settings.isComplete;

    return (
      <section className='section'>
        <div className='container'>
          <div className='columns'>
            
            <LeftColumn
              isDisabled={ wordFormIsDisabled }
              isMobile={ isMobile }
              displayForm={ wordFormIsOpen }
              openWordForm={ this.openWordForm.bind(this) }
              closeWordForm={ this.closeWordForm.bind(this) }
            >
              <WordForm
                updateDisplay={ updateDisplay }
              />
            </LeftColumn>

            <RightColumn formIsDisplayed={ !wordFormIsDisabled && wordFormIsOpen }>
              <DictionaryDetails
                updater={ updater }
                name={ dictionaryInfo.name }
                specification={ dictionaryInfo.specification }
                description={ dictionaryInfo.description }
                partsOfSpeech={ dictionaryInfo.partsOfSpeech }
                details={ dictionaryInfo.details }
                settings={ dictionaryInfo.settings }
                stats={ dictionaryInfo.stats }
                alphabeticalOrder={ dictionaryInfo.alphabeticalOrder }
                updateDisplay={ updateDisplay }
              />

              {wordsAreFiltered
                && (
                  <div className='notification'>
                    Words are filtered&mdash;displaying {wordsToDisplay.length} word{wordsToDisplay.length !== 1 && 's'}
                  </div>
                )}

              <Pagination
                currentPage={ currentPage }
                itemsPerPage={ itemsPerPage }
                stats={ stats }
                setPage={ setPage }
                wordsInCurrentList={ wordsInCurrentList }
                isTop />

              <WordsList
                words={ wordsToDisplay }
                adsEveryXWords={ 10 }
                updateDisplay={ updateDisplay } />
              
              <Pagination
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                stats={stats}
                setPage={setPage}
                wordsInCurrentList={wordsInCurrentList} />
            </RightColumn>
            
          </div>
        </div>
      </section>
    );
  }
}

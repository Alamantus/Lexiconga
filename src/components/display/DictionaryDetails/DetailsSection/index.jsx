import Inferno from 'inferno';
import { Component } from 'inferno';
import PropTypes from 'prop-types';
import marked from 'marked';
import sanitizeHtml from 'sanitize-html';

import './styles.scss';

import { GeneralDisplay } from './GeneralDisplay';
import { PhonologyDisplay } from './PhonologyDisplay';
import { OrthographyDisplay } from './OrthographyDisplay';
import { GrammarDisplay } from './GrammarDisplay';

export class DetailsSection extends Component {
  constructor (props) {
    super(props);

    PropTypes.checkPropTypes({
      details: PropTypes.object.isRequired,
      partsOfSpeech: PropTypes.array.isRequired,
      alphabeticalOrder: PropTypes.array.isRequired,
    }, props, 'prop', 'DetailsSection');

    this.defaultMenuItems = [
      'General',
      'Phonology',
      'Orthography',
      'Grammar',
    ];

    this.state = {
      currentDisplay: 0,
    }
  }

  displayMenu () {
    const { details } = this.props;

    let additionalMenu = null
    if (details.hasOwnProperty('custom') && details.custom.length > 0) {
      additionalMenu = (
        <div>
          <p className='menu-label'>
            Additional
          </p>
          <ul className='menu-list'>
            {
              details.custom.map((tab, index) => {
                const tabId = index + this.defaultMenuItems.length;
                return (
                  <li key={ `customTab_${ tabId }_${ Date.now().toString() }` }>
                    <a className={(this.state.currentDisplay === tabId) ? 'is-active' : null}
                      onClick={ () => this.setState({ currentDisplay: tabId }) }
                    >
                      { tab.name }
                    </a>
                  </li>
                );
              })
            }
          </ul>
        </div>
      );
    }

    return (
      <div className='details-menu'>
        <p className='menu-label'>
          Linguistics
        </p>
        <ul className='menu-list'>
          {
            this.defaultMenuItems.map((tab, index) => {
              return (
                <li key={ `${ tab }_${ index }_${ Date.now().toString() }` }>
                  <a className={(this.state.currentDisplay === index) ? 'is-active' : null}
                    onClick={ () => this.setState({ currentDisplay: index }) }
                  >
                    { tab.capitalize() }
                  </a>
                </li>
              );
            })
          }
        </ul>

        { additionalMenu }

      </div>
    );
  }

  displayDetails () {
    const { currentDisplay } = this.state;
    const {
      partsOfSpeech,
      alphabeticalOrder,
      details,
    } = this.props;
    const defaultMenuLength = this.defaultMenuItems.length;

    let detailsDisplay = '';

    if (currentDisplay < defaultMenuLength) {
      switch (this.defaultMenuItems[currentDisplay]) {
        case 'General': {
          detailsDisplay = (
            <GeneralDisplay
              partsOfSpeech={ partsOfSpeech }
              alphabeticalOrder={ alphabeticalOrder } />
          );
          break;
        }
        case 'Phonology': {
          detailsDisplay = (
            <PhonologyDisplay
              phonologyContent={ details.phonology } />
          );
          break;
        }
        case 'Orthography': {
          detailsDisplay = (
            <OrthographyDisplay
              orthographyContent={ details.orthography } />
          );
          break;
        }
        case 'Grammar': {
          detailsDisplay = (
            <GrammarDisplay
              grammarContent={ details.grammar } />
          );
          break;
        }
      }
    } else {
      const sanitizedCustomTabContent = sanitizeHtml(details.custom[currentDisplay - defaultMenuLength].content);
      detailsDisplay = (
        <div className='content'>
          <div dangerouslySetInnerHTML={{
            __html: marked(sanitizedCustomTabContent),
          }} />
        </div>
      );
    }

    return (
      <div className='details-display'>
        { detailsDisplay }
      </div>
    );
  }

  render () {
    return (
      <div className='columns'>
        <aside className='column is-one-quarter'>
          { this.displayMenu() }
        </aside>
        <div className='column'>
          { this.displayDetails() }
        </div>
      </div>
    );
  }
}

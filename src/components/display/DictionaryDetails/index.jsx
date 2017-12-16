import Inferno from 'inferno';
import Component from 'inferno-component';
import PropTypes from 'prop-types';
import marked from 'marked';
import sanitizeHtml from 'sanitize-html';

import './styles.scss';

import { EditDictionaryModal } from '../../management/EditDictionaryModal';
import { DetailsSection } from './DetailsSection';

const DISPLAY = {
  NONE: false,
  DESCRIPTION: 1,
  DETAILS: 2,
  STATS: 3,
}

export class DictionaryDetails extends Component {
  constructor (props) {
    super(props);

    PropTypes.checkPropTypes({
      name: PropTypes.string,
      specification: PropTypes.string,
      description: PropTypes.string,
      partsOfSpeech: PropTypes.array,
      alphabeticalOrder: PropTypes.array,
      details: PropTypes.object,
      settings: PropTypes.object,
      stats: PropTypes.array,
      updater: PropTypes.object,
      updateDisplay: PropTypes.func,
    }, props, 'prop', 'DictionaryDetails');

    this.state = {
      currentDisplay: DISPLAY.NONE,
    }

    this._descriptionHTML = marked(sanitizeHtml(props.description, { allowedTags: [], allowedAttributes: [], }));
  }

  componentWillReceiveProps (nextProps) {
    const currentDescription = this.props.description,
      nextDescription = nextProps.description;

    if (currentDescription !== nextDescription) {
      this._descriptionHTML = marked(sanitizeHtml(nextProps.description, { allowedTags: [], allowedAttributes: [], }));
    }
  }

  toggleDisplay (display) {
    display = (this.state.currentDisplay !== display) ? display : DISPLAY.NONE;

    this.setState({
      currentDisplay: display,
    });
  }

  displayInfo () {
    if (this.state.currentDisplay !== DISPLAY.NONE) {
      let displayJSX;

      switch(this.state.currentDisplay) {
        case DISPLAY.DESCRIPTION : {
          // Not sure why, but the dangerouslySet div needs to be wrapped in another div or else
          // the HTML content sticks around for some reason.
          displayJSX = (
            <div>
              <div className="content"
                dangerouslySetInnerHTML={{
                  __html: this._descriptionHTML,
                }} />
            </div>
          );
          break;
        }

        case DISPLAY.DETAILS : {
          displayJSX = (
            <DetailsSection
              partsOfSpeech={ this.props.partsOfSpeech }
              alphabeticalOrder={ this.props.alphabeticalOrder }
              details={ this.props.details } />
          );
          break;
        }

        case DISPLAY.STATS : {
          displayJSX = (
            <div className='columns'>
              <div className='column'>
                <strong>Number of Words</strong>
                <div className='field is-grouped is-grouped-multiline'>
                  {this.props.stats.numberOfWords.map(stat => {
                    return (
                      <div className='control'>
                        <div className='tags has-addons'>
                          <span className='tag'>
                            { stat.name }
                          </span>
                          <span className='tag is-white'>
                            { stat.value }
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
          break;
        }
      }

      return (
        <div className='details-box'>
          { displayJSX }
        </div>
      )
    }
  }

  render () {
    const { currentDisplay } = this.state;
    return (
      <div className='box'>

        <div className='level'>
          <div className='level-left'>
            <div className='level-item'>
              <h2 className='title is-2'>
                { this.props.name } { this.props.specification }
              </h2>
            </div>
          </div>

          <div className='level-right'>
            <div className='level-item'>

              <EditDictionaryModal
                updater={ this.props.updater }
                isLoggedIn={ true }
                name={ this.props.name }
                specification={ this.props.specification }
                description={ this.props.description }
                partsOfSpeech={ this.props.partsOfSpeech }
                alphabeticalOrder={ this.props.alphabeticalOrder }
                details={ this.props.details }
                settings={ this.props.settings }
                updateDisplay={ this.props.updateDisplay }
              />

            </div>
          </div>
        </div>

        <div className='tabs is-toggle'>
          <ul>
            <li className={ (currentDisplay === DISPLAY.DESCRIPTION) ? 'is-active' : null }>
              <a onClick={ this.toggleDisplay.bind(this, DISPLAY.DESCRIPTION) }>
                <span>Description</span>
              </a>
            </li>
            <li className={ (currentDisplay === DISPLAY.DETAILS) ? 'is-active' : null }>
              <a onClick={ this.toggleDisplay.bind(this, DISPLAY.DETAILS) }>
                <span>Details</span>
              </a>
            </li>
            <li className={ (currentDisplay === DISPLAY.STATS) ? 'is-active' : null }>
              <a onClick={ this.toggleDisplay.bind(this, DISPLAY.STATS) }>
                <span>Stats</span>
              </a>
            </li>
          </ul>
        </div>

        { this.displayInfo() }

      </div>
    );
  }
}

import Inferno from 'inferno';
import Component from 'inferno-component';
import marked from 'marked';

import {SearchBox} from '../management/SearchBox';

const DISPLAY = {
  NONE: false
, DESCRIPTION: 1
, DETAILS: 2
, STATS: 3
, SEARCH: 4
}

export class DictionaryDetails extends Component {
  constructor (props) {
    super(props);

    this.state = {
      currentDisplay: DISPLAY.NONE
    }

    this._descriptionHTML = marked(props.description);
  }

  componentWillReceiveProps (nextProps) {
    const currentDescription = this.props.description
    ,     nextDescription = nextProps.description;

    if (currentDescription !== nextDescription) {
      this._descriptionHTML = marked(nextProps.description);
    }
  }

  toggleDisplay (display) {
    display = (this.state.currentDisplay !== display) ? display : DISPLAY.NONE;

    this.setState({
      currentDisplay: display
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
                  __html: this._descriptionHTML
                }} />
            </div>
          );
          break;
        }

        case DISPLAY.DETAILS : {
          let additionalMenu;
          if (this.props.details.hasOwnProperty('custom')) {
            let customTabsJSX = this.props.details.custom.map((tab) => {
              return (
                <li key={'customTab' + Date.now().toString()}>
                  <a>
                    {tab.name}
                  </a>
                </li>
              );
            });

            additionalMenu = (
              <div>
                <p className="menu-label">
                  Additional
                </p>
                <ul className="menu-list">
                  {customTabsJSX}
                </ul>
              </div>
            );
          }

          const menu = (
            <aside className="column is-one-quarter menu">
              <p className="menu-label">
                Linguistics
              </p>
              <ul className="menu-list">
                <li><a className="is-active">Phonology</a></li>
                <li><a>Grammar</a></li>
              </ul>

              {additionalMenu}

            </aside>
          );

          let content = (
            <div className='column'>
              <p>
                Details Content!
              </p>
            </div>
          );

          displayJSX = (
            <div className='columns'>
              {menu}
              {content}
            </div>
          );
          break;
        }

        case DISPLAY.STATS : {
          displayJSX = (
            <div className="content">
              <p>Stats!</p>
            </div>
          );
          break;
        }

        case DISPLAY.SEARCH : {
          displayJSX = <SearchBox />;
          break;
        }
      }

      return (
        <div className='box'>
          {displayJSX}
        </div>
      )
    }
  }

  render () {
    return (
      <div className='box'>

        <div className='level'>
          <div className='level-left'>
            <div className='level-item'>
              <h2 className='title is-2'>
                Dictionary Name
              </h2>
            </div>
          </div>

          <div className='level-right'>
            <div className='level-item'>
              <div className='field is-grouped'>
                <div className='control'>
                  <a className='button' onClick={this.toggleDisplay.bind(this, DISPLAY.SEARCH)}>
                    Search
                  </a>
                </div>
                <div className='control'>
                  <a className='button'>
                    Edit Dictionary
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='level'>
          <div className='level-left'>
            <div className='level-item'>
              <div className='tabs is-toggle'>
                <ul>
                  <li className={(this.state.currentDisplay === DISPLAY.DESCRIPTION) ? 'is-active' : null}>
                    <a onClick={this.toggleDisplay.bind(this, DISPLAY.DESCRIPTION)}>
                      <span>Description</span>
                    </a>
                  </li>
                  <li className={(this.state.currentDisplay === DISPLAY.DETAILS) ? 'is-active' : null}>
                    <a onClick={this.toggleDisplay.bind(this, DISPLAY.DETAILS)}>
                      <span>Details</span>
                    </a>
                  </li>
                  <li className={(this.state.currentDisplay === DISPLAY.STATS) ? 'is-active' : null}>
                    <a onClick={this.toggleDisplay.bind(this, DISPLAY.STATS)}>
                      <span>Stats</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {this.displayInfo()}

      </div>
    );
  }
}

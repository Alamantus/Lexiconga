import Inferno from 'inferno';
import Component from 'inferno-component';
import marked from 'marked';

import { PhonologyDisplay } from './PhonologyDisplay';

const DISPLAY = {
  NONE: false,
  DESCRIPTION: 1,
  DETAILS: 2,
  STATS: 3,
}

export class DetailsSection extends Component {
  constructor (props) {
    super(props);

    this.defaultMenuItems = [
      'Phonology',
      'Grammar',
    ];

    this.state = {
      currentDisplay: 0,
    }
  }

  mapCustomMenuItems (customTabs) {
    return customTabs.map(tab => {
      return tab.name;
    });
  }

  displayDetails () {
    const { currentDisplay } = this.state;
    const { details } = this.props;
    const defaultMenuLength = this.defaultMenuItems.length;

    if (currentDisplay < defaultMenuLength) {
      switch (this.defaultMenuItems[currentDisplay]) {
        case 'Phonology': {
          return <PhonologyDisplay phonologyContent={details.phonology} />
          break;
        }
        case 'Grammar': {
          return 'Grammar content!';
          break;
        }
      }
    } else {
      return (
        <div className='content'>
          <div dangerouslySetInnerHTML={{
            __html: marked(details.custom[currentDisplay - defaultMenuLength].content),
          }} />
        </div>
      );
    }
  }

  render () {
    const { details } = this.props;

    let additionalMenu = (
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

    const menu = (
      <div className='menu'>
        <p className='menu-label'>
          Linguistics
        </p>
        <ul className='menu-list'>
          {this.defaultMenuItems.map((tab, index) => {
            return (
              <li key={ `${ tab }_${ index }_${ Date.now().toString() }` }>
                <a className={(this.state.currentDisplay === index) ? 'is-active' : null}
                  onClick={ () => this.setState({ currentDisplay: index }) }
                >
                  { tab.capitalize() }
                </a>
              </li>
            );
          })}
        </ul>

        { additionalMenu }

      </div>
    );

    return (
      <div className='columns'>
        <aside className='column is-one-quarter'>
          { menu }
        </aside>
        <div className='column'>
          { this.displayDetails() }
        </div>
      </div>
    );
  }
}

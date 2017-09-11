import Inferno from 'inferno';
import Component from 'inferno-component';

export class Ad extends Component {
  constructor (props) {
    super(props);
  }

  componentDidMount() {
    // Insert ad initialization here
  }

  render () {
    return (
      <div className='notification'>

        <div className='content'>
          Want a feature-packed tool for building your conlang with an active community and inter-linked word definitions?
          <br />
          Check out <a href='http://conworkshop.info/' target='_blank'>ConWorkShop</a>!
        </div>

      </div>
    );
  }
}

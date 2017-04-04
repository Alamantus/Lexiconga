import Inferno from 'inferno';
import Component from 'inferno-component';

export class LeftColumn extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <div className='column is-one-third'>
        {this.props.children}
      </div>
    );
  }
}

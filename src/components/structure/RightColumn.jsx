import Inferno from 'inferno';
import Component from 'inferno-component';

export class RightColumn extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <div className='column is-two-thirds'>
        {this.props.children}
      </div>
    );
  }
}

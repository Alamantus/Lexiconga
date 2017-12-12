import Inferno from 'inferno';
import PropTypes from 'prop-types';

export const RightColumn = (props) => {
  PropTypes.checkPropTypes({
    formIsDisplayed: PropTypes.bool.isRequired,
    children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  }, props, 'prop', 'RightColumn');

  const { formIsDisplayed } = props;

  return (
    <div className={ `column ${ formIsDisplayed ? 'is-two-thirds' : '' }` }>
      { props.children }
    </div>
  );
}

import Inferno from 'inferno';
import PropTypes from 'prop-types';
import marked from 'marked';
import sanitizeHtml from 'sanitize-html';

export const OrthographyDisplay = (props) => {
  PropTypes.checkPropTypes({
    orthographyContent: PropTypes.object.isRequired,
  }, props, 'prop', 'OrthographyDisplay');

  const { orthographyContent } = props
  return (
    <div>
      <div className='columns'>

        <div className='column'>
          <strong>Notes:</strong>
          <div className='content'>
            <div dangerouslySetInnerHTML={{
              __html: marked(sanitizeHtml(orthographyContent.notes, { allowedTags: [], allowedAttributes: [], })),
            }} />
          </div>
        </div>

      </div>

    </div>
  );
}

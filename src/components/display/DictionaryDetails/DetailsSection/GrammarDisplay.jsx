import Inferno from 'inferno';
import PropTypes from 'prop-types';
import marked from 'marked';
import sanitizeHtml from 'sanitize-html';

export const GrammarDisplay = (props) => {
  PropTypes.checkPropTypes({
    grammarContent: PropTypes.object.isRequired,
  }, props, 'prop', 'GrammarDisplay');

  const { grammarContent } = props
  return (
    <div>
      <div className='columns'>

        <div className='column'>
          <strong>Notes:</strong>
          <div className='content'>
            <div dangerouslySetInnerHTML={{
              __html: marked(sanitizeHtml(grammarContent.notes, { allowedTags: [], allowedAttributes: [], })),
            }} />
          </div>
        </div>

      </div>

    </div>
  );
}

import Inferno from 'inferno';
import marked from 'marked';
import sanitizeHtml from 'sanitize-html';

export const OrthographyDisplay = ({
    orthographyContent,
}) => {
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

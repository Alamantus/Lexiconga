import Inferno from 'inferno';
import Component from 'inferno-component';
import marked from 'marked';
import sanitizeHtml from 'sanitize-html';

export const PhonologyDisplay = ({ phonologyContent }) => {
  return (
    <div>
      <h4 className='title is-4'>
        Phonemes
      </h4>

      <div className='columns'>

        <div className='column is-half'>
          <strong>Consonants:</strong>
          <div className='tags'>
            {phonologyContent.consonants.map(consonant => {
              return (
                <span key={`consonant_${ consonant }_${ Date.now().toString() }`}
                  className='tag'>
                  { consonant }
                </span>
              );
            })}
          </div>
        </div>

        <div className='column is-half'>
          <strong>Vowels:</strong>
          <div className='tags'>
            {phonologyContent.vowels.map(vowel => {
              return (
                <span key={`vowel_${ vowel }_${ Date.now().toString() }`}
                  className='tag'>
                  { vowel }
                </span>
              );
            })}
          </div>
        </div>

      </div>

      {
        phonologyContent.blends.length > 0
        && (
          <div className='columns'>

            <div className='column'>
              <strong>Polyphthongs{'\u200B'}/{'\u200B'}Blends:</strong>
              <div className='tags'>
                {phonologyContent.blends.map(blend => {
                  return (
                    <span key={`blend_${ blend }_${ Date.now().toString() }`}
                      className='tag'>
                      { blend }
                    </span>
                  );
                })}
              </div>
            </div>

          </div>
        )
      }

      {
        (phonologyContent.phonotactics.onset.length > 0
          || phonologyContent.phonotactics.nucleus.length > 0
          || phonologyContent.phonotactics.coda.length > 0)
        && (
          <div>
            <h4 className='title is-4'>
              Phonotactics
            </h4>

            <div className='columns'>

              <div className='column is-one-third'>
                <strong>Onset:</strong>
                <div className='tags'>
                  {phonologyContent.phonotactics.onset.map(onset => {
                    return (
                      <span key={`onset_${ onset }_${ Date.now().toString() }`}
                        className='tag'>
                        { onset }
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className='column is-one-third'>
                <strong>Nucleus:</strong>
                <div className='tags'>
                  {phonologyContent.phonotactics.nucleus.map(nucleus => {
                    return (
                      <span key={`onset_${ nucleus }_${ Date.now().toString() }`}
                        className='tag'>
                        { nucleus }
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className='column is-one-third'>
                <strong>Coda:</strong>
                <div className='tags'>
                  {phonologyContent.phonotactics.coda.map(coda => {
                    return (
                      <span key={`onset_${ coda }_${ Date.now().toString() }`}
                        className='tag'>
                        { coda }
                      </span>
                    );
                  })}
                </div>
              </div>

            </div>

            {
              phonologyContent.phonotactics.exceptions.trim() !== ''
              && (
                <div className='columns'>
                  <div className='column'>
                    <strong>Exceptions:</strong>
                    <div className="content"
                      dangerouslySetInnerHTML={{
                        __html: marked(sanitizeHtml(phonologyContent.phonotactics.exceptions, { allowedTags: [], allowedAttributes: [], })),
                      }} />
                  </div>
                </div>
              )
            }
          </div>
        )
      }

    </div>
  );
}

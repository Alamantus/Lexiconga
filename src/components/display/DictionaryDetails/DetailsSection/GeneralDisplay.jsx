import Inferno from 'inferno';

export const GeneralDisplay = ({
    partsOfSpeech,
    alphabeticalOrder,
}) => {
  return (
    <div>
      <div className='columns'>

        <div className='column'>
          <strong>Parts of Speech:</strong>
          <div className='tags'>
            {
              partsOfSpeech.map(consonant => {
                return (
                  <span key={`partOfSpeech_${ consonant }_${ Date.now().toString() }`}
                    className='tag'>
                    { consonant }
                  </span>
                );
              })
            }
          </div>
        </div>

      </div>

      <div className='columns'>

        <div className='column'>
          <strong>Alphabetical Order:</strong>
          <div className='tags'>
            {
              (alphabeticalOrder.length > 0)
              ? alphabeticalOrder.map(vowel => {
                return (
                  <span key={`vowel_${ vowel }_${ Date.now().toString() }`}
                    className='tag'>
                    { vowel }
                  </span>
                );
              })
              : (
                <span className='tag'>
                  English Alphabet
                </span>
              )
            }
          </div>
        </div>

      </div>

    </div>
  );
}

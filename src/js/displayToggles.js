import md from 'snarkdown';
import {removeTags} from '../helpers';

export function showSection(sectionName) {
  switch (sectionName) {
    case 'description': showDescription(); break;
    case 'details': showDetails(); break;
    case 'stats': showStats(); break;
  }
}

function showDescription() {
  const detailsPanel = document.getElementById('detailsPanel');
  detailsPanel.style.display = 'block';
  const {description} = window.currentDictionary;
  const descriptionHTML = md(removeTags(description));

  detailsPanel.innerHTML = descriptionHTML;
}

function showDetails() {
  const detailsPanel = document.getElementById('detailsPanel');
  detailsPanel.style.display = 'block';
  const {partsOfSpeech, alphabeticalOrder} = window.currentDictionary;
  const {phonology, orthography, grammar} = window.currentDictionary.details;
  const partsOfSpeechHTML = `<p><strong>Parts of Speech:</strong> ${partsOfSpeech.map(partOfSpeech => '<span class="tag">' + partOfSpeech + '</span>').join(' ')}</p>`;
  const alphabeticalOrderHTML = `<p><strong>Alphabetical Order:</strong> ${
    (alphabeticalOrder.length > 0 ? alphabeticalOrder : ['English Alphabet']).map(letter => `<span class="tag">${letter}</span>`).join(' ')
  }</p>`;
  const generalHTML = `<h3>General</h3>${partsOfSpeechHTML}${alphabeticalOrderHTML}`;

  const {consonants, vowels, blends, phonotactics} = phonology
  const consonantHTML = `<p><strong>Consonants:</strong> ${consonants.map(letter => `<span class="tag">${letter}</span>`).join(' ')}</p>`;
  const vowelHTML = `<p><strong>Vowels:</strong> ${vowels.map(letter => `<span class="tag">${letter}</span>`).join(' ')}</p>`;
  const blendHTML = blends.length > 0 ? `<p><strong>Polyphthongs&nbsp;/&nbsp;Blends:</strong> ${blends.map(letter => `<span class="tag">${letter}</span>`).join(' ')}</p>` : '';
  const phonologyHTML = `<h3>Phonology</h3>
  <div class="split two">
    <div>${consonantHTML}</div>
    <div>${vowelHTML}</div>
  </div>
  ${blendHTML}`;

  const {onset, nucleus, coda, exceptions} = phonotactics;
  const onsetHTML = `<p><strong>Onset:</strong> ${onset.map(letter => `<span class="tag">${letter}</span>`).join(' ')}</p>`;
  const nucleusHTML = `<p><strong>Nucleus:</strong> ${nucleus.map(letter => `<span class="tag">${letter}</span>`).join(' ')}</p>`;
  const codaHTML = `<p><strong>Coda:</strong> ${coda.map(letter => `<span class="tag">${letter}</span>`).join(' ')}</p>`;
  const exceptionsHTML = exceptions.trim().length > 0 ?  '<p><strong>Exceptions:</strong></p><div>' + md(removeTags(exceptions)) + '</div>' : '';
  const phonotacticsHTML = `<h3>Phonotactics</h3>
  <div class="split three">
  <div>${onsetHTML}</div>
  <div>${nucleusHTML}</div>
  <div>${codaHTML}</div>
  </div>
  ${exceptionsHTML}`;

  const orthographyHTML = '<h3>Orthography</h3><p><strong>Notes:</strong></p><div>' + md(removeTags(orthography.notes)) + '</div>';
  const grammarHTML = '<h3>Grammar</h3><p><strong>Notes:</strong></p><div>' + md(removeTags(grammar.notes)) + '</div>';

  detailsPanel.innerHTML = generalHTML + phonologyHTML + phonotacticsHTML + orthographyHTML + grammarHTML;
}

function showStats() {
  const detailsPanel = document.getElementById('detailsPanel');
  detailsPanel.style.display = 'block';
  const wordStats = getWordsStats();
  const numberOfWordsHTML = `<p><strong>Number of Words</strong><br>${wordStats.numberOfWords.map(stat => `<span><span class="tag">${stat.name}</span><span class="tag">${stat.value}</span></span>`).join(' ')}</p>`;
  const wordLengthHTML = `<p><strong>Word Length</strong><br><span><span class="tag">Shortest</span><span class="tag">${wordStats.wordLength.shortest}</span></span>
  <span><span class="tag">Longest</span><span class="tag">${wordStats.wordLength.longest}</span></span>
  <span><span class="tag">Average</span><span class="tag">${wordStats.wordLength.average}</span></span></p>`;
  const letterDistributionHTML = `<p><strong>Letter Distribution</strong><br>${wordStats.letterDistribution.map(stat => `<span title="${stat.number} ${stat.letter}'s total"><span class="tag">${stat.letter}</span><span class="tag">${stat.percentage.toFixed(2)}</span></span>`).join(' ')}</p>`;
  const totalLettersHTML = `<p><strong>${wordStats.totalLetters} Total Letters</strong></p>`;
  
  detailsPanel.innerHTML = numberOfWordsHTML + wordLengthHTML + letterDistributionHTML + totalLettersHTML;
}

function getWordsStats() {
  const {words, partsOfSpeech} = window.currentDictionary;
  const {caseSensitive} = window.currentDictionary.settings;
  
  const wordStats = {
    numberOfWords: [
      {
        name: 'Total',
        value: words.length,
      },
    ],
    wordLength: {
      shortest: 0,
      longest: 0,
      average: 0,
    },
    letterDistribution: [
      /* {
        letter: '',
        number: 0,
        percentage: 0.00,
      } */
    ],
    totalLetters: 0,
  };

  partsOfSpeech.forEach(partOfSpeech => {
    const wordsWithPartOfSpeech = words.filter(word => word.partOfSpeech === partOfSpeech);
    wordStats.numberOfWords.push({
      name: partOfSpeech,
      value: wordsWithPartOfSpeech.length,
    });
  });

  wordStats.numberOfWords.push({
    name: 'Unclassified',
    value: words.filter(word => !partsOfSpeech.includes(word.partOfSpeech)).length,
  });

  let totalLetters = 0;
  const numberOfLetters = {};

  words.forEach(word => {
    const shortestWord = wordStats.wordLength.shortest;
    const longestWord = wordStats.wordLength.longest;
    const wordLetters = word.name.split('');
    const lettersInWord = wordLetters.length;

    totalLetters += lettersInWord;

    if (shortestWord === 0 || lettersInWord < shortestWord) {
      wordStats.wordLength.shortest = lettersInWord;
    }

    if (longestWord === 0 || lettersInWord > longestWord) {
      wordStats.wordLength.longest = lettersInWord;
    }

    wordLetters.forEach(letter => {
      const letterToUse = caseSensitive ? letter : letter.toLowerCase();
      if (!numberOfLetters.hasOwnProperty(letterToUse)) {
        numberOfLetters[letterToUse] = 1;
      } else {
        numberOfLetters[letterToUse]++;
      }
    });
  });

  wordStats.totalLetters = totalLetters;
  wordStats.wordLength.average = words.length > 0 ? totalLetters / words.length : 0;

  for (const letter in numberOfLetters) {
    if (numberOfLetters.hasOwnProperty(letter)) {
      const number = numberOfLetters[letter];
      wordStats.letterDistribution.push({
        letter,
        number,
        percentage: number / totalLetters,
      });
    }
  }

  wordStats.letterDistribution.sort((a, b) => {
    if (a.percentage === b.percentage) return 0;
    return (a.percentage > b.percentage) ? -1 : 1;
  });

  return wordStats;
}
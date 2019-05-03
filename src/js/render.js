import md from 'snarkdown';
import { removeTags } from '../helpers';
import { getWordsStats, wordExists } from './utilities';
import { showSection } from './displayToggles';

export function renderAll() {
  renderDictionaryDetails();
  renderPartsOfSpeechSelect();
  renderWords();
}

export function renderDictionaryDetails() {
  renderName();

  const tabs = document.querySelectorAll('#detailsSection nav li');
  const shownTab = Array.from(tabs).find(tab => tab.classList.contains('active'));
  if (shownTab) {
    const tabName = shownTab.innerText.toLowerCase();
    showSection(tabName);
  }
}

export function renderName() {
  const dictionaryName = removeTags(window.currentDictionary.name) + ' ' + removeTags(window.currentDictionary.specification);
  document.getElementById('dictionaryName').innerHTML = dictionaryName;
}

export function renderDescription() {
  const descriptionHTML = md(removeTags(window.currentDictionary.description));

  detailsPanel.innerHTML = descriptionHTML;
}

export function renderDetails() {
  const { partsOfSpeech, alphabeticalOrder } = window.currentDictionary;
  const { phonology, orthography, grammar } = window.currentDictionary.details;
  const partsOfSpeechHTML = `<p><strong>Parts of Speech:</strong> ${partsOfSpeech.map(partOfSpeech => '<span class="tag">' + partOfSpeech + '</span>').join(' ')}</p>`;
  const alphabeticalOrderHTML = `<p><strong>Alphabetical Order:</strong> ${
    (alphabeticalOrder.length > 0 ? alphabeticalOrder : ['English Alphabet']).map(letter => `<span class="tag">${letter}</span>`).join(' ')
    }</p>`;
  const generalHTML = `<h3>General</h3>${partsOfSpeechHTML}${alphabeticalOrderHTML}`;

  const { consonants, vowels, blends, phonotactics } = phonology
  const consonantHTML = `<p><strong>Consonants:</strong> ${consonants.map(letter => `<span class="tag">${letter}</span>`).join(' ')}</p>`;
  const vowelHTML = `<p><strong>Vowels:</strong> ${vowels.map(letter => `<span class="tag">${letter}</span>`).join(' ')}</p>`;
  const blendHTML = blends.length > 0 ? `<p><strong>Polyphthongs&nbsp;/&nbsp;Blends:</strong> ${blends.map(letter => `<span class="tag">${letter}</span>`).join(' ')}</p>` : '';
  const phonologyHTML = `<h3>Phonology</h3>
  <div class="split two">
    <div>${consonantHTML}</div>
    <div>${vowelHTML}</div>
  </div>
  ${blendHTML}`;

  const { onset, nucleus, coda, exceptions } = phonotactics;
  const onsetHTML = `<p><strong>Onset:</strong> ${onset.map(letter => `<span class="tag">${letter}</span>`).join(' ')}</p>`;
  const nucleusHTML = `<p><strong>Nucleus:</strong> ${nucleus.map(letter => `<span class="tag">${letter}</span>`).join(' ')}</p>`;
  const codaHTML = `<p><strong>Coda:</strong> ${coda.map(letter => `<span class="tag">${letter}</span>`).join(' ')}</p>`;
  const exceptionsHTML = exceptions.trim().length > 0 ? '<p><strong>Exceptions:</strong></p><div>' + md(removeTags(exceptions)) + '</div>' : '';
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

export function renderStats() {
  const wordStats = getWordsStats();
  const numberOfWordsHTML = `<p><strong>Number of Words</strong><br>${wordStats.numberOfWords.map(stat => `<span><span class="tag">${stat.name}</span><span class="tag">${stat.value}</span></span>`).join(' ')}</p>`;
  const wordLengthHTML = `<p><strong>Word Length</strong><br><span><span class="tag">Shortest</span><span class="tag">${wordStats.wordLength.shortest}</span></span>
  <span><span class="tag">Longest</span><span class="tag">${wordStats.wordLength.longest}</span></span>
  <span><span class="tag">Average</span><span class="tag">${wordStats.wordLength.average}</span></span></p>`;
  const letterDistributionHTML = `<p><strong>Letter Distribution</strong><br>${wordStats.letterDistribution.map(stat => `<span title="${stat.number} ${stat.letter}'s total"><span class="tag">${stat.letter}</span><span class="tag">${stat.percentage.toFixed(2)}</span></span>`).join(' ')}</p>`;
  const totalLettersHTML = `<p><strong>${wordStats.totalLetters} Total Letters</strong></p>`;

  detailsPanel.innerHTML = numberOfWordsHTML + wordLengthHTML + letterDistributionHTML + totalLettersHTML;
}

export function renderPartsOfSpeechSelect() {
  let optionsHTML = '<option value=""></option>';
  window.currentDictionary.partsOfSpeech.forEach(partOfSpeech => {
    partOfSpeech = removeTags(partOfSpeech);
    optionsHTML += `<option value="${partOfSpeech}">${partOfSpeech}</option>`;
  });
  Array.from(document.getElementsByClassName('part-of-speech-select')).forEach(select => select.innerHTML = optionsHTML);
}

export function renderWords() {
  const { words } = window.currentDictionary;
  let wordsHTML = '';
  words.forEach(word => {
    let detailsMarkdown = removeTags(word.longDefinition);
    const references = detailsMarkdown.match(/\{\{.+?\}\}/g);
    if (references && Array.isArray(references)) {
      new Set(references).forEach(reference => {
        console.log(reference);
        const wordToFind = reference.replace(/\{\{|\}\}/g, '');
        const existingWordId = wordExists(wordToFind, true);
        if (existingWordId !== false) {
          const wordMarkdownLink = `[${wordToFind}](#${existingWordId})`;
          console.log(wordMarkdownLink);
          detailsMarkdown = detailsMarkdown.replace(new RegExp(reference, 'g'), wordMarkdownLink);
        }
      });
    }
    console.log(detailsMarkdown);
    wordsHTML += `<article class="entry" id="${word.wordId}">
      <header>
        <h4 class="word">${removeTags(word.name)}</h4>
        <span class="pronunciation">${removeTags(word.pronunciation)}</span>
        <span class="part-of-speech">${removeTags(word.partOfSpeech)}</span>
      </header>
      <dl>
        <dt class="definition">${removeTags(word.simpleDefinition)}</dt>
        <dd class="details">
          ${md(detailsMarkdown)}
        </dd>
      </dl>
    </article>`;
  });

  document.getElementById('entries').innerHTML = wordsHTML;
}
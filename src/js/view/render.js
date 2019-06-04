import md from 'marked';
import { removeTags, slugify } from '../../helpers';
import { getWordsStats, wordExists } from '../utilities';
import { getMatchingSearchWords, highlightSearchTerm, getSearchFilters, getSearchTerm } from '../search';
import { showSection } from '../displayToggles';
import { setupSearchFilters, setupInfoModal } from './setupListeners';
import { parseReferences } from '../wordManagement';
import { renderTheme } from '../render';
import { renderAd } from '../ads';

export function renderAll() {
  renderTheme();
  renderDictionaryDetails();
  renderPartsOfSpeech();
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
  const shareLink = window.location.pathname.match(new RegExp(window.currentDictionary.externalID + '$')) ? window.location.pathname
    : window.location.pathname.substring(0, window.location.pathname.indexOf(window.currentDictionary.externalID)) + window.currentDictionary.externalID;
  document.getElementById('dictionaryShare').href = shareLink;
}

export function renderDescription() {
  const descriptionHTML = md(removeTags(window.currentDictionary.description));

  document.getElementById('detailsPanel').innerHTML = '<div class="content">' + descriptionHTML + '</div>';
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

export function renderPartsOfSpeech(onlyOptions = false) {
  let optionsHTML = '<option value=""></option>',
    searchHTML = '<label>Unclassified <input type="checkbox" checked id="searchPartOfSpeech__None"></label>';
  window.currentDictionary.partsOfSpeech.forEach(partOfSpeech => {
    partOfSpeech = removeTags(partOfSpeech);
    optionsHTML += `<option value="${partOfSpeech}">${partOfSpeech}</option>`;
    searchHTML += `<label>${partOfSpeech} <input type="checkbox" checked id="searchPartOfSpeech_${slugify(partOfSpeech)}"></label>`;
  });
  searchHTML += `<a class="small button" id="checkAllFilters">Check All</a> <a class="small button" id="uncheckAllFilters">Uncheck All</a>`;

  Array.from(document.getElementsByClassName('part-of-speech-select')).forEach(select => {
    const selectedValue = select.value;
    select.innerHTML = optionsHTML;
    select.value = selectedValue;
  });
  if (!onlyOptions) {
    document.getElementById('searchPartsOfSpeech').innerHTML = searchHTML;
  }

  setupSearchFilters();
}

export function renderWords() {
  let wordsHTML = '';
  let words = false;

  if (window.currentDictionary.words.length === 0) {
    wordsHTML = `<article class="entry">
      <header>
        <h4 class="word">No Words Found</h4>
      </header>
      <dl>
        <dt class="definition">Either this dictionary has not yet been started, or something prevented words from downloading.</dt>
      </dl>
    </article>`;
  } else {
    words = getMatchingSearchWords();

    if (words.length === 0) {
      wordsHTML = `<article class="entry">
        <header>
          <h4 class="word">No Search Results</h4>
        </header>
        <dl>
          <dt class="definition">Edit your search or filter to show words.</dt>
        </dl>
      </article>`;
    }

    words.forEach((originalWord, displayIndex) => {
      const word = highlightSearchTerm({
        name: removeTags(originalWord.name),
        pronunciation: removeTags(originalWord.pronunciation),
        partOfSpeech: removeTags(originalWord.partOfSpeech),
        definition: removeTags(originalWord.definition),
        details: parseReferences(removeTags(originalWord.details)),
        wordId: originalWord.wordId,
      });
      const shareLink = window.location.pathname + (window.location.pathname.match(new RegExp(word.wordId + '$')) ? '' : '/' + word.wordId);

      wordsHTML += renderAd(displayIndex);

      wordsHTML += `<article class="entry" id="${word.wordId}">
        <header>
          <h4 class="word">${word.name}</h4>
          <span class="pronunciation">${word.pronunciation}</span>
          <span class="part-of-speech">${word.partOfSpeech}</span>
          <a href="${shareLink}" target="_blank" class="small button word-option-button" title="Link to Word">&#10150;</a>
        </header>
        <dl>
          <dt class="definition">${word.definition}</dt>
          <dd class="details">
            ${md(word.details)}
          </dd>
        </dl>
      </article>`;
    });
  }

  document.getElementById('entries').innerHTML = wordsHTML;

  // Show Search Results
  const searchTerm = getSearchTerm();
  const filters = getSearchFilters();
  let resultsText = searchTerm !== '' || !filters.allPartsOfSpeechChecked ? (words ? words.length : 0).toString() + ' Results' : '';
  resultsText += !filters.allPartsOfSpeechChecked ? ' (Filtered)' : '';
  document.getElementById('searchResults').innerHTML = resultsText;
}

export function renderInfoModal(content) {
  const modalElement = document.createElement('section');
  modalElement.classList.add('modal', 'info-modal');
  modalElement.innerHTML = `<div class="modal-background"></div>
  <div class="modal-content">
    <a class="close-button">&times;&#xFE0E;</a>
    <section class="info-modal">
      <div class="content">
        ${content}
      </div>
    </section>
  </div>`;

  document.body.appendChild(modalElement);

  setupInfoModal(modalElement);
}

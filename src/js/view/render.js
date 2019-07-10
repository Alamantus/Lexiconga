import md from 'marked';
import { removeTags, slugify } from '../../helpers';
import { getWordsStats, getHomonymnNumber } from './utilities';
import { getMatchingSearchWords, highlightSearchTerm, getSearchFilters, getSearchTerm } from './search';
import { showSection } from './displayToggles';
import { renderAd } from '../ads';
import { sortWords } from './wordManagement';
import { setupInfoModal } from '../setupListeners/modals';
import { setupSearchFilters } from '../setupListeners/search';

export function renderAll() {
  renderTheme();
  renderCustomCSS();
  renderDictionaryDetails();
  renderPartsOfSpeech();
  sortWords();
  renderWords();
}

export function renderTheme() {
  const { theme } = window.currentDictionary.settings;
  document.body.id = theme + 'Theme';
}

export function renderCustomCSS() {
  const { customCSS } = window.currentDictionary.settings;
  const stylingId = 'customCSS';
  const stylingElement = document.getElementById(stylingId);
  if (!stylingElement) {
    const styling = document.createElement('style');
    styling.id = stylingId;
    styling.innerHTML = customCSS;
    document.body.appendChild(styling);
  } else {
    stylingElement.innerHTML = customCSS;
  }
}

export function renderDictionaryDetails() {
  renderName();
  showSection('description');
}

export function renderName() {
  const dictionaryName = removeTags(window.currentDictionary.name) + ' ' + removeTags(window.currentDictionary.specification);
  document.getElementById('dictionaryName').innerHTML = dictionaryName;
  const shareLink = window.location.pathname.match(new RegExp(window.currentDictionary.externalID + '$')) ? window.location.pathname
    : window.location.pathname.substring(0, window.location.pathname.indexOf(window.currentDictionary.externalID)) + window.currentDictionary.externalID;
  document.getElementById('dictionaryShare').href = shareLink;
}

export function renderDescription() {
  const descriptionHTML = md(window.currentDictionary.description);

  document.getElementById('detailsPanel').innerHTML = '<div class="content">' + descriptionHTML + '</div>';
}

export function renderDetails() {
  const { partsOfSpeech, alphabeticalOrder } = window.currentDictionary;
  const { phonology, phonotactics, orthography, grammar } = window.currentDictionary.details;
  const partsOfSpeechHTML = `<p><strong>Parts of Speech</strong><br>${partsOfSpeech.map(partOfSpeech => '<span class="tag">' + partOfSpeech + '</span>').join(' ')}</div>`;
  const alphabeticalOrderHTML = `<p><strong>Alphabetical Order</strong><br>${
    (alphabeticalOrder.length > 0 ? alphabeticalOrder : ['English Alphabet']).map(letter => `<span class="tag">${letter}</span>`).join(' ')
    }</div>`;
  const generalHTML = `<h3>General</h3>${partsOfSpeechHTML}${alphabeticalOrderHTML}`;

  const { consonants, vowels, blends } = phonology
  const consonantHTML = `<p><strong>Consonants</strong><br>${consonants.map(letter => `<span class="tag">${letter}</span>`).join(' ')}</p>`;
  const vowelHTML = `<p><strong>Vowels</strong><br>${vowels.map(letter => `<span class="tag">${letter}</span>`).join(' ')}</p>`;
  const blendHTML = blends.length > 0 ? `<p><strong>Polyphthongs&nbsp;/&nbsp;Blends</strong><br>${blends.map(letter => `<span class="tag">${letter}</span>`).join(' ')}</p>` : '';
  const phonologyNotesHTML = phonology.notes.trim().length > 0 ? '<p><strong>Notes</strong></p><div>' + md(removeTags(phonology.notes)) + '</div>' : '';
  const phonologyHTML = `<h3>Phonology</h3>
  <div class="split two">
    <div>${consonantHTML}</div>
    <div>${vowelHTML}</div>
  </div>
  ${blendHTML}
  ${phonologyNotesHTML}`;

  const { onset, nucleus, coda } = phonotactics;
  const onsetHTML = `<p><strong>Onset</strong><br>${onset.map(letter => `<span class="tag">${letter}</span>`).join(' ')}</p>`;
  const nucleusHTML = `<p><strong>Nucleus</strong><br>${nucleus.map(letter => `<span class="tag">${letter}</span>`).join(' ')}</p>`;
  const codaHTML = `<p><strong>Coda</strong><br>${coda.map(letter => `<span class="tag">${letter}</span>`).join(' ')}</p>`;
  const phonotacticsNotesHTML = phonotactics.notes.trim().length > 0 ? '<p><strong>Notes</strong></p><div>' + md(removeTags(phonotactics.notes)) + '</div>' : '';
  const phonotacticsHTML = onset.length + nucleus.length + coda.length + phonotacticsNotesHTML.length > 0
    ? `<h3>Phonotactics</h3>
  ${onset.length > 0 || nucleus.length > 0 || coda.length > 0
    ? `<div class="split three">
    <div>${onsetHTML}</div>
    <div>${nucleusHTML}</div>
    <div>${codaHTML}</div>
  </div>` : ''}
  ${phonotacticsNotesHTML}`
    : '';

  const { translations } = orthography;
  const translationsHTML = translations.length > 0 ? `<p><strong>Translations</strong><br>${translations.map(translation => {
    translation = translation.split('=').map(value => value.trim());
    if (translation.length > 1 && translation[0] !== '' && translation[1] !== '') {
      return `<span><span class="tag">${translation[0]}</span><span class="tag orthographic-translation">${translation[1]}</span></span>`;
    }
    return false;
  }).filter(html => html !== false).join(' ')}</p>` : '';
  const orthographyNotesHTML = orthography.notes.trim().length > 0 ? '<p><strong>Notes</strong><br>' + md(removeTags(orthography.notes)) + '</div>' : '';
  const orthographyHTML = translations.length + orthographyNotesHTML.length > 0
    ? `<h3>Orthography</h3>
  ${translationsHTML}
  ${orthographyNotesHTML}`
    : '';
  const grammarHTML = grammar.notes.trim().length > 0 ? '<h3>Grammar</h3><div>'
    + (grammar.notes.trim().length > 0 ? md(removeTags(grammar.notes)) : '')
  + '</div>' : '';

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
        details: originalWord.details,
        wordId: originalWord.wordId,
      });

      const homonymnNumber = getHomonymnNumber(originalWord);
      const shareLink = window.location.pathname + (window.location.pathname.match(new RegExp(word.wordId + '$')) ? '' : '/' + word.wordId);

      wordsHTML += renderAd(displayIndex);

      wordsHTML += `<article class="entry" id="${word.wordId}">
        <header>
          <h4 class="word"><span class="orthographic-translation">${word.name}</span>${homonymnNumber > 0 ? ' <sub>' + homonymnNumber.toString() + '</sub>' : ''}</h4>
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

import md from 'marked';
import { removeTags, slugify } from '../../helpers';
import { getWordsStats, hasToken } from '../utilities';
import { showSection } from '../displayToggles';
import { setupSearchFilters } from '../setupListeners/search';
import { parseReferences } from '../wordManagement';
import { getPublicLink } from '../account/utilities';

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
  const name = document.getElementById('dictionaryName');
  name.innerHTML = dictionaryName;
  const isPublic = hasToken() && window.currentDictionary.settings.isPublic;
  const shareLinkElement = document.getElementById('dictionaryShare');

  if (isPublic && !shareLinkElement) {
    const shareLink = document.createElement('a');
    shareLink.id = 'dictionaryShare';
    shareLink.classList.add('button');
    shareLink.style.float = 'right';
    shareLink.href = getPublicLink();
    shareLink.target = '_blank';
    shareLink.title = 'Public Link to Dictionary';
    shareLink.innerHTML = '&#10150;';
    name.parentElement.insertBefore(shareLink, name);
  } else if (isPublic && shareLinkElement) {
    shareLinkElement.href = getPublicLink();
  } else if (!isPublic && shareLinkElement) {
    shareLinkElement.parentElement.removeChild(shareLinkElement);
  }
}

export function renderDescription() {
  const descriptionHTML = md(parseReferences(removeTags(window.currentDictionary.description)));

  document.getElementById('detailsPanel').innerHTML = '<div class="content">' + descriptionHTML + '</div>';
}

export function renderDetails() {
  const { partsOfSpeech, alphabeticalOrder } = window.currentDictionary;
  const { phonology, phonotactics, orthography, grammar } = window.currentDictionary.details;
  const partsOfSpeechHTML = `<p><strong>Parts of Speech</strong><br>${partsOfSpeech.map(partOfSpeech => '<span class="tag">' + partOfSpeech + '</span>').join(' ')}</div>`;
  const alphabeticalOrderHTML = `<p><strong>Alphabetical Order</strong><br>${
    (alphabeticalOrder.length > 0 ? alphabeticalOrder : ['English Alphabet']).map(letter => `<span class="tag">${letter}</span>`).join(' ')
    }</div>`;
  const generalHTML = `<h2>General</h2>${partsOfSpeechHTML}${alphabeticalOrderHTML}`;

  const { consonants, vowels, blends } = phonology
  const consonantHTML = `<p><strong>Consonants</strong><br>${consonants.map(letter => `<span class="tag">${letter}</span>`).join(' ')}</p>`;
  const vowelHTML = `<p><strong>Vowels</strong><br>${vowels.map(letter => `<span class="tag">${letter}</span>`).join(' ')}</p>`;
  const blendHTML = blends.length > 0 ? `<p><strong>Polyphthongs&nbsp;/&nbsp;Blends</strong><br>${blends.map(letter => `<span class="tag">${letter}</span>`).join(' ')}</p>` : '';
  const phonologyNotesHTML = phonology.notes.trim().length > 0 ? '<p><strong>Notes</strong></p><div>' + md(removeTags(phonology.notes)) + '</div>' : '';
  const phonologyHTML = `<h2>Phonology</h2>
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
    ? `<h2>Phonotactics</h2>
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
    ? `<h2>Orthography</h2>
  ${translationsHTML}
  ${orthographyNotesHTML}`
    : '';
  const grammarHTML = grammar.notes.trim().length > 0 ? '<h2>Grammar</h2><div>'
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
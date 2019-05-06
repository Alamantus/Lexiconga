import md from 'snarkdown';
import { removeTags, slugify } from '../helpers';
import { getWordsStats, wordExists } from './utilities';
import { getMatchingSearchWords, highlightSearchTerm, getSearchFilters, getSearchTerm } from './search';
import { showSection } from './displayToggles';
import { setupSearchFilters, setupWordOptionButtons } from './setupListeners';

export function renderAll() {
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

export function renderPartsOfSpeech() {
  let optionsHTML = '<option value=""></option>',
    searchHTML = '<label>Unclassified <input type="checkbox" checked id="searchPartOfSpeech__None"></label>';
  window.currentDictionary.partsOfSpeech.forEach(partOfSpeech => {
    partOfSpeech = removeTags(partOfSpeech);
    optionsHTML += `<option value="${partOfSpeech}">${partOfSpeech}</option>`;
    searchHTML += `<label>${partOfSpeech} <input type="checkbox" checked id="searchPartOfSpeech_${slugify(partOfSpeech)}"></label>`;
  });
  
  Array.from(document.getElementsByClassName('part-of-speech-select')).forEach(select => {
    const selectedValue = select.value;
    select.innerHTML = optionsHTML;
    select.value = selectedValue;
  });
  document.getElementById('searchPartsOfSpeech').innerHTML = searchHTML;

  setupSearchFilters();
}

export function renderWords() {
  const words = getMatchingSearchWords();
  let wordsHTML = '';
  words.forEach(originalWord => {
    let detailsMarkdown = removeTags(originalWord.longDefinition);
    const references = detailsMarkdown.match(/\{\{.+?\}\}/g);
    if (references && Array.isArray(references)) {
      new Set(references).forEach(reference => {
        const wordToFind = reference.replace(/\{\{|\}\}/g, '');
        const existingWordId = wordExists(wordToFind, true);
        if (existingWordId !== false) {
          const wordMarkdownLink = `[${wordToFind}](#${existingWordId})`;
          detailsMarkdown = detailsMarkdown.replace(new RegExp(reference, 'g'), wordMarkdownLink);
        }
      });
    }
    const word = highlightSearchTerm({
      name: removeTags(originalWord.name),
      pronunciation: removeTags(originalWord.pronunciation),
      partOfSpeech: removeTags(originalWord.partOfSpeech),
      simpleDefinition: removeTags(originalWord.simpleDefinition),
      longDefinition: detailsMarkdown,
      wordId: originalWord.wordId,
    });
    wordsHTML += `<article class="entry" id="${word.wordId}">
      <header>
        <h4 class="word">${word.name}</h4>
        <span class="pronunciation">${word.pronunciation}</span>
        <span class="part-of-speech">${word.partOfSpeech}</span>
        <span class="small button word-option-button">Options</span>
        <div class="word-option-list" style="display:none;">
          <div class="word-option" id="edit_${word.wordId}">Edit</div>
          <div class="word-option" id="delete_${word.wordId}">Delete</div>
        </div>
      </header>
      <dl>
        <dt class="definition">${word.simpleDefinition}</dt>
        <dd class="details">
          ${md(word.longDefinition)}
        </dd>
      </dl>
    </article>`;
  });

  document.getElementById('entries').innerHTML = wordsHTML;
  setupWordOptionButtons();
  
  // Show Search Results
  const searchTerm = getSearchTerm();
  const filters = getSearchFilters();
  let resultsText = searchTerm !== '' || !filters.allPartsOfSpeechChecked ? words.length.toString() + ' Results' : '';
  resultsText += !filters.allPartsOfSpeechChecked ? ' (Filtered)' : '';
  document.getElementById('searchResults').innerHTML = resultsText;
}

export function renderEditForm() {
  const wordId = parseInt(this.id.replace('edit_', ''));
  const word = window.currentDictionary.words.find(w => w.wordId === wordId);
  if (wordToEdit) {
    const editForm = `<form id="editForm_${wordId}" class="edit-form">
      <label>Word<span class="red">*</span><br>
        <input id="wordName_${wordId}" value="${word.name}">
      </label>
      <label>Pronunciation<a class="label-button">IPA Chart</a><br>
        <input id="wordPronunciation_${wordId}" value="${word.pronunciation}">
      </label>
      <label>Part of Speech<br>
        <select id="wordPartOfSpeech_${wordId}" class="part-of-speech-select">
          <option value="${word.partOfSpeech}" selected>${word.partOfSpeech}</option>
        </select>
      </label>
      <label>Definition<span class="red">*</span><br>
        <input id="wordDefinition_${wordId}" value="${word.simpleDefinition}" placeholder="Equivalent words">
      </label>
      <label>Details<span class="red">*</span><a class="label-button">Maximize</a><br>
        <textarea id="wordDetails_${wordId}" placeholder="Markdown formatting allowed">${word.longDefinition}</textarea>
      </label>
      <div id="wordErrorMessage_${wordId}"></div>
      <a class="button" id="editWordButton_${wordId}">Save Changes</a>
      <a class="button cancel-edit">Cancel Edit</a>
    </form>`;
  }
}
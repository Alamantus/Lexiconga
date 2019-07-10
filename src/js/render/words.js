import md from 'marked';
import { removeTags } from '../../helpers';
import { getHomonymnNumber, hasToken } from '../utilities';
import { getMatchingSearchWords, highlightSearchTerm, getSearchFilters, getSearchTerm } from '../search';
import {
  setupWordOptionButtons,
  setupPagination,
  setupWordOptionSelections,
  setupWordEditFormButtons,
} from '../setupListeners/words';
import { getPaginationData } from '../pagination';
import { getOpenEditForms, translateOrthography, parseReferences } from '../wordManagement';
import { renderAd } from '../ads';
import { getPublicLink } from '../account/utilities';
import { renderPartsOfSpeech } from './details';

export function renderWords() {
  let wordsHTML = '';
  let openEditForms = getOpenEditForms();
  let words = false;
  const isPublic = hasToken() && window.currentDictionary.settings.isPublic;

  if (window.currentDictionary.words.length === 0) {
    wordsHTML = `<article class="entry">
      <header>
        <h4 class="word">No Words Created</h4>
      </header>
      <dl>
        <dt class="definition">Use the Word Form to create words or click the Help button below!</dt>
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

    if (openEditForms.length > 0) {
      // Clone the dom nodes
      openEditForms.forEach((wordFormId, index) => {
        openEditForms[index] = document.getElementById(wordFormId.toString()).cloneNode(true);
      });
    }

    // const { pageStart, pageEnd } = getPaginationData(words);

    // words.slice(pageStart, pageEnd).forEach(originalWord => {
    words.forEach((originalWord, displayIndex) => {
      const word = highlightSearchTerm({
        name: removeTags(originalWord.name),
        pronunciation: removeTags(originalWord.pronunciation),
        partOfSpeech: removeTags(originalWord.partOfSpeech),
        definition: removeTags(originalWord.definition),
        details: parseReferences(removeTags(originalWord.details)),
        wordId: originalWord.wordId,
      });
      const homonymnNumber = getHomonymnNumber(originalWord);
      const shareLink = window.currentDictionary.hasOwnProperty('externalID') ? getPublicLink() + '/' + word.wordId : '';

      wordsHTML += renderAd(displayIndex);

      let wordNameDisplay = translateOrthography(word.name);

      wordsHTML += `<article class="entry" id="${word.wordId}">
        <header>
          <h4 class="word"><span class="orthographic-translation">${wordNameDisplay}</span>${homonymnNumber > 0 ? ' <sub>' + homonymnNumber.toString() + '</sub>' : ''}</h4>
          <span class="pronunciation">${word.pronunciation}</span>
          <span class="part-of-speech">${word.partOfSpeech}</span>
          ${isPublic ? `<a class="small button share-link" href="${shareLink}" target="_blank" title="Public Link to Word">&#10150;</a>` : ''}
          <span class="small button word-option-button">Options</span>
          <div class="word-option-list" style="display:none;">
            <div class="word-option" id="edit_${word.wordId}">Edit</div>
            <div class="word-option" id="delete_${word.wordId}">Delete</div>
          </div>
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

  if (openEditForms.length > 0) {
    // Clone the dom nodes
    openEditForms.forEach(editForm => {
      const entryElement = document.getElementById(editForm.id);
      entryElement.parentNode.replaceChild(editForm, entryElement);
    });
    setupWordEditFormButtons();
  }

  setupWordOptionButtons();
  setupWordOptionSelections();

  // Show Search Results
  const searchTerm = getSearchTerm();
  const filters = getSearchFilters();
  let resultsText = searchTerm !== '' || !filters.allPartsOfSpeechChecked ? (words ? words.length : 0).toString() + ' Results' : '';
  resultsText += !filters.allPartsOfSpeechChecked ? ' (Filtered)' : '';
  document.getElementById('searchResults').innerHTML = resultsText;

  // renderPagination(words);
}

export function renderPagination(filteredWords) {
  const paginationData = getPaginationData(filteredWords);

  if (paginationData.pages > 0) {
    let paginationHTML = (paginationData.currentPage > 0 ? '<span class="button prev-button">&laquo; Previous</span>' : '')
      + '<select class="page-selector">';
    for (let i = 0; i < paginationData.pages; i++) {
      paginationHTML += `<option value="${i}"${paginationData.currentPage === i ? ' selected' : ''}>Page ${i + 1}</option>`;
    }
    paginationHTML += '</select>'
      + (paginationData.currentPage < paginationData.pages - 1 ? '<span class="button next-button">Next &raquo;</span>' : '');

    Array.from(document.getElementsByClassName('pagination')).forEach(pagination => {
      pagination.innerHTML = paginationHTML;
    });

    setupPagination();
  }
}

export function renderEditForm(wordId = false) {
  wordId = typeof wordId.target === 'undefined' ? wordId : parseInt(this.id.replace('edit_', ''));
  const word = window.currentDictionary.words.find(w => w.wordId === wordId);
  if (word) {
    const ipaPronunciationField = `<input id="wordPronunciation_${wordId}" class="ipa-field" maxlength="200" value="${word.pronunciation}"><br>
      <a class="label-help-button ipa-field-help-button">Field Help</a>`;
    const plainPronunciationField = `<input id="wordPronunciation_${wordId}" maxlength="200" value="${word.pronunciation}">`;
    const editForm = `<form id="editForm_${wordId}" class="edit-form">
      <label>Word<span class="red">*</span><br>
        <input id="wordName_${wordId}" maxlength="200" value="${word.name}">
      </label>
      <label>Pronunciation<a class="label-button ipa-table-button">IPA Chart</a><br>
        ${window.settings.useIPAPronunciationField ? ipaPronunciationField : plainPronunciationField}
      </label>
      <label>Part of Speech<br>
        <select id="wordPartOfSpeech_${wordId}" class="part-of-speech-select">
          <option value="${word.partOfSpeech}" selected>${word.partOfSpeech}</option>
        </select>
      </label>
      <label>Definition<span class="red">*</span><br>
        <input id="wordDefinition_${wordId}" maxlength="2500" value="${word.definition}" placeholder="Equivalent words">
      </label>
      <label>Details<span class="red">*</span><a class="label-button maximize-button">Maximize</a><br>
        <textarea id="wordDetails_${wordId}" placeholder="Markdown formatting allowed">${word.details}</textarea>
      </label>
      <div id="wordErrorMessage_${wordId}"></div>
      <a class="button edit-save-changes" id="editWordButton_${wordId}">Save Changes</a>
      <a class="button edit-cancel">Cancel Edit</a>
    </form>`;

    document.getElementById(wordId.toString()).innerHTML = editForm;
    setupWordEditFormButtons();
    renderPartsOfSpeech(true);
  }
}

import { renderDictionaryDetails, renderPartsOfSpeech } from './details';
import { renderWords } from './words';
import { renderTemplateSelectOptions } from './settings';

export function renderAll() {
  renderTheme();
  renderCustomCSS();
  renderDictionaryDetails();
  renderPartsOfSpeech();
  renderTemplateSelectOptions();
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

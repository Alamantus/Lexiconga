import { renderDictionaryDetails, renderPartsOfSpeech } from './details';
import { renderWords } from './words';

export function renderAll() {
  renderTheme();
  renderDictionaryDetails();
  renderPartsOfSpeech();
  renderWords();
}

export function renderTheme() {
  const { theme } = window.currentDictionary.settings;
  document.body.id = theme + 'Theme';
}

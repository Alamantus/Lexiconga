import { clearDictionary, saveDictionary } from "../dictionaryManagement";
import { uploadWholeDictionary, performSync } from "./sync";
import { request } from "./helpers";
import { saveToken } from "./utilities";
import { addMessage } from "../utilities";
import { renderAll } from "../render";

export function createNewDictionary() {
  clearDictionary();
  saveDictionary();
  renderAll();
  uploadWholeDictionary(true);
  document.getElementById('settingsModal').style.display = 'none';
  addMessage('New Dictionary Created!');
}

export function changeDictionary(dictionary) {
  dictionary = typeof dictionary.target !== 'undefined' ? dictionary.target.value : dictionary;
  if (dictionary !== window.currentDictionary.externalID) {
    request({
      action: 'change-dictionary',
      dictionary,
    }, successData => {
      saveToken(successData.token);
      performSync(successData.dictionary);
      document.getElementById('settingsModal').style.display = 'none';
    }, error => {
      console.error(error);
      addMessage(error, undefined, 'error');
    });
  }
}

export function updateCurrentChangeDictionaryOption() {
  const label = window.currentDictionary.name + ' ' + window.currentDictionary.specification;
  document.getElementById('accountSettingsChangeDictionary')
    .querySelector(`option[value=${window.currentDictionary.externalID}]`).innerText = label;
}

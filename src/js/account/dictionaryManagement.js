import { clearDictionary, saveDictionary } from "../dictionaryManagement";
import { uploadWholeDictionary, performSync } from "./sync";
import { request } from "./helpers";
import { saveToken } from "./utilities";
import { addMessage, hideAllModals } from "../utilities";
import { renderAll } from "../render";
import { renderDeletedDictionaryChangeModal, renderChangeDictionaryOptions } from "./render";

export function createNewDictionary() {
  clearDictionary();
  saveDictionary();
  renderAll();
  uploadWholeDictionary(true);
  hideAllModals();
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
      hideAllModals();
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

export function deleteDictionary(deletedId) {
  request({
    action: 'delete-current-dictionary',
  }, successful => {
    if (successful) {
      renderChangeDictionaryOptions();
      renderDeletedDictionaryChangeModal(deletedId);
    }
  })
}

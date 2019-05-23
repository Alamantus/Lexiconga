import { performSync } from "./sync";
import { request } from "./helpers";
import { saveToken } from "./utilities";
import { addMessage } from "../utilities";

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

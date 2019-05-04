import { renderDictionaryDetails } from "./render";

export function updateDictionary () {

  renderDictionaryDetails();
}

export function openEditModal() {
  const { name, specification, description, partsOfSpeech } = window.currentDictionary;
  const { consonants, vowels, blends, phonotactics } = window.currentDictionary.details.phonology;
  const { orthography, grammar } = window.currentDictionary.details;
  
  document.getElementById('editName').value = name;
  document.getElementById('editSpecification').value = specification;
  document.getElementById('editDescription').value = description;
  document.getElementById('editPartsOfSpeech').value = partsOfSpeech.join(',');

  document.getElementById('editConsonants').value = consonants.join(',');
  document.getElementById('editVowels').value = vowels.join(',');
  document.getElementById('editBlends').value = blends.join(',');
  document.getElementById('editOnset').value = phonotactics.onset.join(',');
  document.getElementById('editNucleus').value = phonotactics.nucleus.join(',');
  document.getElementById('editCoda').value = phonotactics.coda.join(',');
  document.getElementById('editExceptions').value = phonotactics.exceptions;

  document.getElementById('editOrthography').value = orthography.notes;
  document.getElementById('editGrammar').value = grammar.notes;

  document.getElementById('editModal').style.display = 'block';
}

export function updateGeneralDetails() {

}
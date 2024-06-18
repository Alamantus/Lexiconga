import {
  createTemplate,
  saveTemplate,
  editSavedTemplate,
  deleteSelectedTemplate,
  openSettingsModal,
  saveSettingsModal,
  saveAndCloseSettingsModal
} from "../settings";

/**
 * Identify selector strings and handlers
 * @param {Function} when Passed from setupListeners, which listens to clicks on document.body
 */
export function handleSettingsModalClicks(when) {
  when('#createTemplateButton', createTemplate);
  when('#saveTemplateButton', saveTemplate);
  when('#deleteTemplateButton', deleteSelectedTemplate);

  when('#settingsButton', openSettingsModal);
  when('#settingsSave', saveSettingsModal);
  when('#settingsSaveAndClose', saveAndCloseSettingsModal);
}

export function setupTemplateChangeEvents() {
  const savedTemplatesSelect = document.getElementById('savedDetailsTemplates');
  savedTemplatesSelect.removeEventListener('change', editSavedTemplate);
  savedTemplatesSelect.addEventListener('change', editSavedTemplate);

  setupTemplateSelectOptions();
}

export function setupTemplateSelectOptions() {
  Array.from(document.getElementsByClassName('template-select')).forEach(select => {
    if (select.id !== 'savedDetailsTemplates') {
      select.removeEventListener('change', fillDetailsWithTemplate);
      select.addEventListener('change', fillDetailsWithTemplate);
    }
  });
}

function fillDetailsWithTemplate (event) {
  const { target } = event;
  if (target.value !== '') {
    const template = window.settings.templates[parseInt(target.value)];
    let detailsId = 'wordDetails' + target.id.replace('templateSelect', '');
    document.getElementById(detailsId).value = template.template;
  }
}

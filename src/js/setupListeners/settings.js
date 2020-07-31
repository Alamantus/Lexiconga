import { createTemplate, saveTemplate, editSavedTemplate, deleteSelectedTemplate } from "../settings";

export function setupTemplateForm() {
  document.getElementById('createTemplateButton').addEventListener('click', createTemplate);
  document.getElementById('saveTemplateButton').addEventListener('click', saveTemplate);
  document.getElementById('deleteTemplateButton').addEventListener('click', deleteSelectedTemplate);
  setupSavedTemplatesSelect();
}

export function setupSavedTemplatesSelect() {
  const savedTemplatesSelect = document.getElementById('savedDetailsTemplates');

  savedTemplatesSelect.removeEventListener('change', editSavedTemplate);
  savedTemplatesSelect.addEventListener('change', editSavedTemplate);
}

export function setupTemplateSelectOptions() {
  const fillDetailsWithTemplate = function (e) {
    if (e.target.value !== '') {
      const template = window.settings.templates[parseInt(e.target.value)];
      let detailsId = 'wordDetails' + e.target.id.replace('templateSelect', '');
      document.getElementById(detailsId).value = template.template;
    }
  }
  Array.from(document.getElementsByClassName('template-select')).forEach(select => {
    if (select.id !== 'savedDetailsTemplates') {
      select.removeEventListener('change', fillDetailsWithTemplate);
      select.addEventListener('change', fillDetailsWithTemplate);
    }
  });
}
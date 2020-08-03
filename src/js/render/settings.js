import { setupTemplateSelectOptions } from "../setupListeners/settings";

export function renderTemplateSelectOptions() {
  const { templates } = window.settings;

  if (typeof templates !== 'undefined') {
    const templatesOptionsHTML = templates.map((template, index) => {
      return `<option value="${index.toString()}">${template.name}</options>`;
    }).join('');

    Array.from(document.getElementsByClassName('template-select')).forEach(select => {
      if (select.id !== 'savedDetailsTemplates' && templates.length < 1) {
        return select.parentElement.style.display = 'none';
      } else {
        select.parentElement.style.display = '';
      }
      select.innerHTML = '<option value="" selected="selected">None Selected</option>' + templatesOptionsHTML;
    });

    setupTemplateSelectOptions();
  }
}

export function showTemplateEditor(show = true) {
  document.getElementById('templateFields').style.display = show ? '' : 'none';
  if (show) {
    document.getElementById('templateTextarea').focus();
  } else {
    clearTemplateEditor();
  }
}

export function showSelectedTemplate(template, index) {
  const nameField = document.getElementById('templateNameField');
  nameField.value = template.name;
  nameField.setAttribute('template', index.toString());
  document.getElementById('templateTextarea').value = template.template;
  showTemplateEditor(true);
}

export function clearTemplateEditor() {
  document.getElementById('savedDetailsTemplates').value = '';
  document.getElementById('templateNameField').value = '';
  document.getElementById('templateTextarea').value = '';
}
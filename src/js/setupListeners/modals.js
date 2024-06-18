import { insertAtCursor, getInputSelection, setSelectionRange } from '../StackOverflow/inputCursorManagement';

export function setupIPATable(modal, textBox) {
  const closeElements = modal.querySelectorAll('.modal-background, .close-button, .done-button'),
    headerTextBox = modal.querySelector('header input'),
    ipaButtons = modal.querySelectorAll('.td-btn button');
  Array.from(closeElements).forEach(close => {
    close.addEventListener('click', () => {
      textBox.focus();
      const endOfTextbox = textBox.value.length;
      setSelectionRange(textBox, endOfTextbox, endOfTextbox);
      modal.parentElement.removeChild(modal);
    });
  });

  headerTextBox.addEventListener('change', () => {
    textBox.value = headerTextBox.value;
  });

  Array.from(ipaButtons).forEach(button => {
    button.addEventListener('click', () => {
      insertAtCursor(headerTextBox, button.innerText);
      textBox.value = headerTextBox.value;
    });
  });

  setTimeout(() => {
    headerTextBox.focus();
    const endOfTextbox = headerTextBox.value.length;
    setSelectionRange(headerTextBox, endOfTextbox, endOfTextbox);
  }, 1);
}

export function setupMaximizeModal(modal, textBox) {
  const closeElements = modal.querySelectorAll('.modal-background, .close-button, .done-button'),
    maximizedTextBox = modal.querySelector('textarea');
  Array.from(closeElements).forEach(close => {
    close.addEventListener('click', () => {
      const selection = getInputSelection(maximizedTextBox);
      textBox.focus();
      setSelectionRange(textBox, selection.start, selection.end);
      modal.parentElement.removeChild(modal);
    });
  });

  maximizedTextBox.addEventListener('change', () => {
    textBox.value = maximizedTextBox.value;
  })

  setTimeout(() => {
    const selection = getInputSelection(textBox);
    maximizedTextBox.focus();
    setSelectionRange(maximizedTextBox, selection.start, selection.end);
  }, 1);
}

export function setupInfoModal(modal) {
  const closeElements = modal.querySelectorAll('.modal-background, .close-button');
  Array.from(closeElements).forEach(close => {
    close.addEventListener('click', () => {
      modal.parentElement.removeChild(modal);
    });
  });
}

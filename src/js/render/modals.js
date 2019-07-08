import {
  setupMaximizeModal,
  setupInfoModal,
  setupIPATable,
  setupIPAFields
} from '../setupListeners';
import ipaTableFile from '../KeyboardFire/phondue/ipa-table.html';

export function renderIPAHelp() {
  import('../KeyboardFire/phondue/usage.html').then(html => {
    renderInfoModal(html);
  });
}

export function renderIPATable(ipaTableButton) {
  ipaTableButton = typeof ipaTableButton.target === 'undefined' || ipaTableButton.target === '' ? ipaTableButton : ipaTableButton.target;
  const label = ipaTableButton.parentElement.innerText.replace(/(Field Help|IPA Chart)/g, '').trim();
  const textBox = ipaTableButton.parentElement.querySelector('input');
  const modalElement = document.createElement('section');
  modalElement.classList.add('modal', 'ipa-table-modal');
  modalElement.innerHTML = `<div class="modal-background"></div>
  <div class="modal-content">
    <a class="close-button">&times;&#xFE0E;</a>
    <header><label>${label} <input value="${textBox.value}" class="ipa-field"></label></header>
    <section>
      ${ipaTableFile}
    </section>
    <footer><a class="button done-button">Done</a></footer>
  </div>`;

  document.body.appendChild(modalElement);

  setupIPAFields();
  setupIPATable(modalElement, textBox);
}

export function renderMaximizedTextbox(maximizeButton) {
  maximizeButton = typeof maximizeButton.target === 'undefined' || maximizeButton.target === '' ? maximizeButton : maximizeButton.target;
  const label = maximizeButton.parentElement.innerText.replace(/(\*|Maximize)/g, '').trim();
  const textBox = maximizeButton.parentElement.querySelector('textarea');
  const modalElement = document.createElement('section');
  modalElement.classList.add('modal', 'maximize-modal');
  modalElement.innerHTML = `<div class="modal-background"></div>
  <div class="modal-content">
    <a class="close-button">&times;&#xFE0E;</a>
    <header><h3>${label}</h3></header>
    <section>
      <textarea>${textBox.value}</textarea>
    </section>
    <footer><a class="button done-button">Done</a></footer>
  </div>`;

  document.body.appendChild(modalElement);

  setupMaximizeModal(modalElement, textBox);
}

export function renderInfoModal(content) {
  const modalElement = document.createElement('section');
  modalElement.classList.add('modal', 'info-modal');
  modalElement.innerHTML = `<div class="modal-background"></div>
  <div class="modal-content">
    <a class="close-button">&times;&#xFE0E;</a>
    <section class="info-modal">
      <div class="content">
        ${content}
      </div>
    </section>
  </div>`;

  document.body.appendChild(modalElement);

  setupInfoModal(modalElement);
}

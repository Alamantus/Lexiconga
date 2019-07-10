import { usePhondueDigraphs } from '../KeyboardFire/phondue/ipaField';
import { enableHotKeys } from '../hotkeys';
import { dismiss, isDismissed } from '../announcements';
import { fadeOutElement } from '../utilities';
import { setupDetailsTabs } from './details';
import { setupWordForm, setupMobileWordFormButton } from './words';
import { setupIPAButtons, setupHeaderButtons, setupInfoButtons } from './buttons';

export default function setupListeners() {
  setupAnnouncements();
  setupDetailsTabs();
  setupHeaderButtons();
  setupWordForm();
  setupMobileWordFormButton();
  setupInfoButtons();
  if (window.settings.useHotkeys) {
    enableHotKeys();
  }
}

function setupAnnouncements() {
  const announcements = document.querySelectorAll('.announcement');
  Array.from(announcements).forEach(announcement => {
    if (announcement.id && isDismissed(announcement.id)) {
      fadeOutElement(announcement);
    } else {
      announcement.querySelector('.close-button').addEventListener('click', () => dismiss(announcement));
    }
  });
}

export function setupIPAFields() {
  if (window.settings.useIPAPronunciationField) {
    const ipaFields = document.getElementsByClassName('ipa-field');
    Array.from(ipaFields).forEach(field => {
      field.removeEventListener('keypress', usePhondueDigraphs);
      field.addEventListener('keypress', usePhondueDigraphs);
    });
  }

  setupIPAButtons();
}

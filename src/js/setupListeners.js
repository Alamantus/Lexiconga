import {showSection} from './displayToggles';

export default function setupListeners() {
  setupDetailsTabs();
}

function setupDetailsTabs () {
  let tabs = document.querySelectorAll('#detailsSection nav li');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const section = tab.innerText.toLowerCase();
      const isActive = tab.classList.contains('active');
      tabs.forEach(t => t.classList.remove('active'));
      if (isActive) {
        document.getElementById('detailsPanel').style.display = 'none';
      } else {
        tab.classList.add('active');
        showSection(section);
      }
    });
  })
}
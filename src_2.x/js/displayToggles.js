import { renderDescription, renderDetails, renderStats } from './render/details';

export function showSection(sectionName) {
  switch (sectionName) {
    case 'description': showDescription(); break;
    case 'details': showDetails(); break;
    case 'stats': showStats(); break;
  }
}

export function hideDetailsPanel() {
  document.getElementById('detailsPanel').style.display = 'none';
}

export function getIsDetailsPanelDisplayed() {
  return document.getElementById('detailsPanel').style.display !== 'none';
}

function showDescription() {
  const detailsPanel = document.getElementById('detailsPanel');
  detailsPanel.style.display = 'block';

  renderDescription();
}

function showDetails() {
  const detailsPanel = document.getElementById('detailsPanel');
  detailsPanel.style.display = 'block';
  renderDetails();
}

function showStats() {
  const detailsPanel = document.getElementById('detailsPanel');
  detailsPanel.style.display = 'block';
  renderStats();
}

import { DISPLAY_AD_EVERY } from '../constants.js';
import ads from '../../ads.json';

export function setupAds() {
  const shuffle = (a, b) => Math.random() > 0.5 ? 1 : -1;
  const priority = ads.filter(ad => isActive(ad) && ad.isPriority).sort(shuffle);
  const regular = ads.filter(ad => isActive(ad) && !ad.isPriority).sort(shuffle);
  window.ads = [...priority, ...regular];
}

function isActive(ad) {
  const date = new Date();
  return date >= new Date(ad.start) && date < new Date(ad.end);
}

export function renderAd(wordPosition) {
  if (window.hasOwnProperty('ads') && window.ads) {
    if (wordPosition % DISPLAY_AD_EVERY === 3) {
      const adIndex = Math.floor(wordPosition / DISPLAY_AD_EVERY) % window.ads.length;
      const ad = window.ads[adIndex];
      return `<article class="entry">
        <header>
          <h4 class="word">${ad.header}</h4>
        </header>
        <dl>
          <dt class="definition">${ad.body}</dt>
          <dd class="details">
            <a href="${ad.link}" target="_blank" class="button">${ad.cta}</a>
          </dd>
        </dl>
      </article>`;
    }
  }

  return '';
}
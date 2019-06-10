import { DEFAULT_PAGE_SIZE } from '../constants';
import { renderWords } from "./render";

export function getPaginationData(words) {
  const numWords = words.length;
  const pageSize = window.localStorage.getItem('pageSize') ? parseInt(window.localStorage.getItem('pageSize')) : DEFAULT_PAGE_SIZE;
  const pages = Math.floor(numWords / pageSize);
  const currentPage = window.hasOwnProperty('currentPage') ? window.currentPage : 0;
  const pageStart = currentPage * pageSize;
  const pageEnd = typeof words[pageStart + pageSize] !== 'undefined'
    ? pageStart + pageSize : words.length - 1;

  return { numWords, pageSize, pages, currentPage, pageStart, pageEnd, };
}

export function goToPage(page) {
  if (typeof page.target !== 'undefined') {
    page = page.target.value;
  }
  window.currentPage = parseFloat(page);

  Array.from(document.getElementsByClassName('pagination')).forEach(pagination => {
    pagination.innerHTML = `<span class="loader">Loading Page ${window.currentPage + 1}...</span>`;
  });

  setTimeout(renderWords, 1);
  // renderWords();
}

export function goToNextPage() {
  goToPage((window.hasOwnProperty('currentPage') ? window.currentPage : 0) + 1);
}

export function goToPreviousPage() {
  goToPage((window.hasOwnProperty('currentPage') ? window.currentPage : 1) - 1);
}

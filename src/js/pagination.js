import { renderWords } from "./render";

export function goToPage(page) {
  if (typeof page.target !== 'undefined') {
    page = page.target.value;
  }
  window.currentPage = parseFloat(page);

  Array.from(document.getElementsByClassName('pagination')).forEach(pagination => {
    console.log('setting loader');
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

import removeDiacritics from "./js/StackOverflow/removeDiacritics";

export function cloneObject(object) {
  return JSON.parse(JSON.stringify(object));
}

export function getIndicesOf(searchStr, findIn, caseSensitive) {
  // https://stackoverflow.com/a/3410557
  const searchStrLen = searchStr.length;
  if (searchStrLen == 0) {
    return [];
  }
  let startIndex = 0, index, indices = [];
  if (!caseSensitive) {
    findIn = findIn.toLowerCase();
    searchStr = searchStr.toLowerCase();
  }
  while ((index = findIn.indexOf(searchStr, startIndex)) > -1) {
    indices.push(index);
    startIndex = index + searchStrLen;
  }
  return indices;
}

export function getTimestampInSeconds() {
  return Math.round(Date.now() / 1000);
}

export function removeTags(html) {
  if (html) {
    var tagBody = '(?:[^"\'>]|"[^"]*"|\'[^\']*\')*';
    var tagOrComment = new RegExp(
      '<(?:'
      // Comment body.
      + '!--(?:(?:-*[^->])*--+|-?)'
      // Special "raw text" elements whose content should be elided.
      + '|script\\b' + tagBody + '>[\\s\\S]*?</script\\s*'
      + '|style\\b' + tagBody + '>[\\s\\S]*?</style\\s*'
      // Regular name
      + '|/?[a-z]'
      + tagBody
      + ')>',
      'gi');
    var oldHtml;
    do {
      oldHtml = html;
      html = html.replace(tagOrComment, '');
    } while (html !== oldHtml);
    return html.replace(/</g, '&lt;');
  }
  return html;
}

export function slugify(string) {
  return removeDiacritics(string).replace(/[!a-zA-Z0-9-_]/g, '-');
}

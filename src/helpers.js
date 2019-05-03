export function cloneObject(object) {
  return JSON.parse(JSON.stringify(object));
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

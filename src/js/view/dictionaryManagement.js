export function getDictionary() {
  const url = window.location.href.replace(/\#.*$/gi, '');
  console.log(url);
  let dict = url.substr(url.lastIndexOf('?'));
  console.log(dict);
  if (dict === url) {
    dict = dict.substr(dict.lastIndexOf('/'));
    console.log(dict);
  }
  dict = dict.replace(/[\?\/]/g, '');
  console.log(dict);
}
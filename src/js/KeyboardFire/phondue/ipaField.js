import digraphs from './digraphs.json';
import { setSelectionRange, insertAtCursor } from '../../StackOverflow/inputCursorManagement.js';

export function usePhondueDigraphs(event) {
  let val = event.target.value;
  let pos = event.target.selectionStart || val.length;

  const key = typeof event.which !== "undefined" ? event.which : event.keyCode,
    digraph = digraphs[val.substr(pos - 1, 1) + String.fromCharCode(key)];

  if (digraph) {
    event.preventDefault();
    insertAtCursor(event.target, digraph, -1);
  }
}
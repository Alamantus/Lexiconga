export function insertAtCursor(myField, myValue) {
  // http://stackoverflow.com/questions/11076975/insert-text-into-textarea-at-cursor-position-javascript
  // IE support
  if (document.selection) {
    myField.focus();
    sel = document.selection.createRange();
    sel.text = myValue;
  }
  // MOZILLA and others
  else if (myField.selectionStart || myField.selectionStart == '0') {
    const selection = getInputSelection(myField);
    myField.value = myField.value.substring(0, selection.start)
      + myValue
      + myField.value.substring(selection.end, myField.value.length);
    myField.selectionStart = selection.start + myValue.length;
    myField.selectionEnd = selection.start + myValue.length;
  } else {
    myField.value += myValue;
  }
  setSelectionRange(myField, myField.selectionEnd, myField.selectionEnd);
}

export function getInputSelection(el) {
  // Retrieved from http://stackoverflow.com/a/4207763
  var start = 0, end = 0, normalizedValue, range,
    textInputRange, len, endRange;
  el.focus();
  if (typeof el.selectionStart == "number" && typeof el.selectionEnd == "number") {
    start = el.selectionStart;
    end = el.selectionEnd;
  } else {
    range = document.selection.createRange();

    if (range && range.parentElement() == el) {
      len = el.value.length;
      normalizedValue = el.value.replace(/\r\n/g, "\n");

      // Create a working TextRange that lives only in the input
      textInputRange = el.createTextRange();
      textInputRange.moveToBookmark(range.getBookmark());

      // Check if the start and end of the selection are at the very end
      // of the input, since moveStart/moveEnd doesn't return what we want
      // in those cases
      endRange = el.createTextRange();
      endRange.collapse(false);

      if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
        start = end = len;
      } else {
        start = -textInputRange.moveStart("character", -len);
        start += normalizedValue.slice(0, start).split("\n").length - 1;

        if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
          end = len;
        } else {
          end = -textInputRange.moveEnd("character", -len);
          end += normalizedValue.slice(0, end).split("\n").length - 1;
        }
      }
    }
  }

  return { start, end };
}

export function setSelectionRange(input, selectionStart, selectionEnd) {
  // Retrieved from http://stackoverflow.com/a/17858641/3508346
  if (input.setSelectionRange) {
    input.focus();
    input.setSelectionRange(selectionStart, selectionEnd);
  }
  else if (input.createTextRange) {
    var range = input.createTextRange();
    range.collapse(true);
    range.moveEnd('character', selectionEnd);
    range.moveStart('character', selectionStart);
    range.select();
  }
}

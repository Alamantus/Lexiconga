function ready(fn) {
    if (document.readyState != 'loading'){
        fn();
    } else {
       document.addEventListener('DOMContentLoaded', fn);
    }
}

function getInputSelection(el) {
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

    return {
        start: start,
        end: end
    };
}

function setSelectionRange(input, selectionStart, selectionEnd) {
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

function SaveScroll() {
    var doc = document.documentElement;
    var left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
    var top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);

    savedScroll.x = left;
    savedScroll.y = top;
}

function htmlEntities(string) {
    return String(string).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;').replace(/\\/g, '&#92;').replace(/\n/g, '<br>');
}

function htmlEntitiesParse(string) {
    return String(string).replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&#92;/g, '\\').replace(/<br>/g, '\n');
}

function stripHtmlEntities(string) {
    // This is for the export name.
    return String(string).replace(/&amp;/g, '').replace(/&lt;/g, '').replace(/&gt;/g, '').replace(/&quot;/g, '').replace(/&apos;/g, "").replace(/&#92;/g, '').replace(/<br>/g, '');
}

function htmlEntitiesParseForSearchEntry(string) {
    return String(string).replace(/"/g, '%%%%').replace(/'/g, "````");
}

function htmlEntitiesParseForSearch(string) {
    return String(string).replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '%%%%').replace(/&apos;/g, "````");
}

function regexParseForSearch(string) {
    return String(string).replace(/([\[\\\^\$\.\|\?\*\+\(\)\{\}\]])/g, "\\$1");
}

function dynamicSort(propertiesArray) {
	/* Retrieved from http://stackoverflow.com/a/30446887/3508346
	   Usage: theArray.sort(dynamicSort(['propertyAscending', '-propertyDescending']));*/
    return function (a, b) {
        return propertiesArray
            .map(function (o) {
                var dir = 1;
                if (o[0] === '-') {
                   dir = -1;
                   o=o.substring(1);
                }
                if (removeDiacritics(a[o]) > removeDiacritics(b[o])) return dir;
                if (removeDiacritics(a[o]) < removeDiacritics(b[o])) return -(dir);
                return 0;
            })
            .reduce(function firstNonZeroValue (p,n) {
                return p ? p : n;
            }, 0);
    };
}

function download(filename, text) {
    /* Retrieved from http://stackoverflow.com/a/18197341/3508346
       Usage: download('test.txt', 'Hello world!');*/
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}
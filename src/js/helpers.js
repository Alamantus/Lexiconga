// function ready(fn) {
//     if (document.readyState != 'loading'){
//         fn();
//     } else {
//        document.addEventListener('DOMContentLoaded', fn);
//     }
// }

// Set Marked.js settings
// marked.setOptions({
//     gfm: true,
//     tables: true,
//     breaks: true,
//     sanitize: true
// });

// Get Keycode based on key name
export function keyCodeFor(keyName) {
    if (keyName == "backspace") return 8;
    else if (keyName == "tab") return 9;
    else if (keyName == "ctrlEnter") return 10;
    else if (keyName == "enter") return 13;
    else if (keyName == "shift") return 16;
    else if (keyName == "ctrl") return 17;
    else if (keyName == "alt") return 18;
    else if (keyName == "pausebreak") return 19;
    else if (keyName == "capslock") return 20;
    else if (keyName == "escape") return 27;
    else if (keyName == "space") return 32;
    else if (keyName == "pageup") return 33;
    else if (keyName == "pagedown") return 34;
    else if (keyName == "end") return 35;
    else if (keyName == "home") return 36;
    else if (keyName == "left") return 37;
    else if (keyName == "up") return 38;
    else if (keyName == "right") return 39;
    else if (keyName == "down") return 40;
    else if (keyName == "insert") return 45;
    else if (keyName == "del") return 46;
    else if (keyName == "zero") return 48;
    else if (keyName == "one") return 49;
    else if (keyName == "two") return 50;
    else if (keyName == "three") return 51;
    else if (keyName == "four") return 52;
    else if (keyName == "five") return 53;
    else if (keyName == "six") return 54;
    else if (keyName == "seven") return 55;
    else if (keyName == "eight") return 56;
    else if (keyName == "nine") return 57;
    else if (keyName == "a") return 65;
    else if (keyName == "b") return 66;
    else if (keyName == "c") return 67;
    else if (keyName == "d") return 68;
    else if (keyName == "e") return 69;
    else if (keyName == "f") return 70;
    else if (keyName == "g") return 71;
    else if (keyName == "h") return 72;
    else if (keyName == "i") return 73;
    else if (keyName == "j") return 74;
    else if (keyName == "k") return 75;
    else if (keyName == "l") return 76;
    else if (keyName == "m") return 77;
    else if (keyName == "n") return 78;
    else if (keyName == "o") return 79;
    else if (keyName == "p") return 80;
    else if (keyName == "q") return 81;
    else if (keyName == "r") return 82;
    else if (keyName == "s") return 83;
    else if (keyName == "t") return 84;
    else if (keyName == "u") return 85;
    else if (keyName == "v") return 86;
    else if (keyName == "w") return 87;
    else if (keyName == "x") return 88;
    else if (keyName == "y") return 89;
    else if (keyName == "z") return 90;
    else if (keyName == "leftwinkey") return 91;
    else if (keyName == "rightwinkey") return 92;
    else if (keyName == "selectkey") return 93;
    else if (keyName == "numpad_0") return 96;
    else if (keyName == "numpad_1") return 97;
    else if (keyName == "numpad_2") return 98;
    else if (keyName == "numpad_3") return 99;
    else if (keyName == "numpad_4") return 100;
    else if (keyName == "numpad_5") return 101;
    else if (keyName == "numpad_6") return 102;
    else if (keyName == "numpad_7") return 103;
    else if (keyName == "numpad_8") return 104;
    else if (keyName == "numpad_9") return 105;
    else if (keyName == "numpad_asterisk") return 106;
    else if (keyName == "numpad_plus") return 107;
    else if (keyName == "numpad_dash") return 109;
    else if (keyName == "numpad_period") return 110;
    else if (keyName == "numpad_slash") return 111;
    else if (keyName == "f1") return 112;
    else if (keyName == "f2") return 113;
    else if (keyName == "f3") return 114;
    else if (keyName == "f4") return 115;
    else if (keyName == "f5") return 116;
    else if (keyName == "f6") return 117;
    else if (keyName == "f7") return 118;
    else if (keyName == "f8") return 119;
    else if (keyName == "f9") return 120;
    else if (keyName == "f10") return 121;
    else if (keyName == "f11") return 122;
    else if (keyName == "f12") return 123;
    else if (keyName == "numlock") return 144;
    else if (keyName == "scrolllock") return 145;
    else if (keyName == "semicolon") return 186;
    else if (keyName == "equal") return 187;
    else if (keyName == "comma") return 188;
    else if (keyName == "dash") return 189;
    else if (keyName == "period") return 190;
    else if (keyName == "slash") return 191;
    else if (keyName == "grave") return 192;
    else if (keyName == "openbracket") return 219;
    else if (keyName == "backslash") return 220;
    else if (keyName == "closebraket") return 221;
    else if (keyName == "quote") return 222;
    else return false;
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

    return {
        start: start,
        end: end
    };
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

export function SaveScroll() {
    var doc = document.documentElement;
    var left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
    var top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);

    savedScroll.x = left;
    savedScroll.y = top;
}

export function htmlEntities(string) {
    return String(string).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;').replace(/\\/g, '&#92;').replace(/\n/g, '<br>');
}

export function htmlEntitiesParse(string) {
    return String(string).replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&#92;/g, '\\').replace(/<br>/g, '\n');
}

export function htmlEntitiesParseForMarkdown(string) {
    return String(string).replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&#92;/g, '\\').replace(/<br>/g, '\n');
}

export function stripHtmlEntities(string) {
    // This is for the export name.
    return String(string).replace(/&amp;/g, '').replace(/&lt;/g, '').replace(/&gt;/g, '').replace(/&quot;/g, '').replace(/&apos;/g, "").replace(/&#92;/g, '').replace(/<br>/g, '');
}

export function htmlEntitiesParseForSearchEntry(string) {
    return String(string).replace(/"/g, '%%%%').replace(/'/g, "````");
}

export function htmlEntitiesParseForSearch(string) {
    return String(string).replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '%%%%').replace(/&apos;/g, "````");
}

export function regexParseForSearch(string) {
    return String(string).replace(/([\[\\\^\$\.\|\?\*\+\(\)\{\}\]])/g, "\\$1");
}

export function dynamicSort(propertiesArray) {
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
                if (removeDiacritics(a[o]).toLowerCase() > removeDiacritics(b[o]).toLowerCase()) return dir;
                if (removeDiacritics(a[o]).toLowerCase() < removeDiacritics(b[o]).toLowerCase()) return -(dir);
                return 0;
            })
            .reduce(function firstNonZeroValue (p,n) {
                return p ? p : n;
            }, 0);
    };
}

export function download(filename, text) {
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
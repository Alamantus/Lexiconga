function ready(e){"loading"!=document.readyState?e():document.addEventListener("DOMContentLoaded",e)}function keyCodeFor(e){return"backspace"==e?8:"tab"==e?9:"ctrlEnter"==e?10:"enter"==e?13:"shift"==e?16:"ctrl"==e?17:"alt"==e?18:"pausebreak"==e?19:"capslock"==e?20:"escape"==e?27:"space"==e?32:"pageup"==e?33:"pagedown"==e?34:"end"==e?35:"home"==e?36:"left"==e?37:"up"==e?38:"right"==e?39:"down"==e?40:"insert"==e?45:"del"==e?46:"zero"==e?48:"one"==e?49:"two"==e?50:"three"==e?51:"four"==e?52:"five"==e?53:"six"==e?54:"seven"==e?55:"eight"==e?56:"nine"==e?57:"a"==e?65:"b"==e?66:"c"==e?67:"d"==e?68:"e"==e?69:"f"==e?70:"g"==e?71:"h"==e?72:"i"==e?73:"j"==e?74:"k"==e?75:"l"==e?76:"m"==e?77:"n"==e?78:"o"==e?79:"p"==e?80:"q"==e?81:"r"==e?82:"s"==e?83:"t"==e?84:"u"==e?85:"v"==e?86:"w"==e?87:"x"==e?88:"y"==e?89:"z"==e?90:"leftwinkey"==e?91:"rightwinkey"==e?92:"selectkey"==e?93:"numpad_0"==e?96:"numpad_1"==e?97:"numpad_2"==e?98:"numpad_3"==e?99:"numpad_4"==e?100:"numpad_5"==e?101:"numpad_6"==e?102:"numpad_7"==e?103:"numpad_8"==e?104:"numpad_9"==e?105:"numpad_asterisk"==e?106:"numpad_plus"==e?107:"numpad_dash"==e?109:"numpad_period"==e?110:"numpad_slash"==e?111:"f1"==e?112:"f2"==e?113:"f3"==e?114:"f4"==e?115:"f5"==e?116:"f6"==e?117:"f7"==e?118:"f8"==e?119:"f9"==e?120:"f10"==e?121:"f11"==e?122:"f12"==e?123:"numlock"==e?144:"scrolllock"==e?145:"semicolon"==e?186:"equal"==e?187:"comma"==e?188:"dash"==e?189:"period"==e?190:"slash"==e?191:"grave"==e?192:"openbracket"==e?219:"backslash"==e?220:"closebraket"==e?221:"quote"==e?222:!1}function getInputSelection(e){var t,r,n,a,c,o=0,l=0;return e.focus(),"number"==typeof e.selectionStart&&"number"==typeof e.selectionEnd?(o=e.selectionStart,l=e.selectionEnd):(r=document.selection.createRange(),r&&r.parentElement()==e&&(a=e.value.length,t=e.value.replace(/\r\n/g,"\n"),n=e.createTextRange(),n.moveToBookmark(r.getBookmark()),c=e.createTextRange(),c.collapse(!1),n.compareEndPoints("StartToEnd",c)>-1?o=l=a:(o=-n.moveStart("character",-a),o+=t.slice(0,o).split("\n").length-1,n.compareEndPoints("EndToEnd",c)>-1?l=a:(l=-n.moveEnd("character",-a),l+=t.slice(0,l).split("\n").length-1)))),{start:o,end:l}}function setSelectionRange(e,t,r){if(e.setSelectionRange)e.focus(),e.setSelectionRange(t,r);else if(e.createTextRange){var n=e.createTextRange();n.collapse(!0),n.moveEnd("character",r),n.moveStart("character",t),n.select()}}function SaveScroll(){var e=document.documentElement,t=(window.pageXOffset||e.scrollLeft)-(e.clientLeft||0),r=(window.pageYOffset||e.scrollTop)-(e.clientTop||0);savedScroll.x=t,savedScroll.y=r}function htmlEntities(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;").replace(/\\/g,"&#92;").replace(/\n/g,"<br>")}function htmlEntitiesParse(e){return String(e).replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&apos;/g,"'").replace(/&#92;/g,"\\").replace(/<br>/g,"\n")}function htmlEntitiesParseForMarkdown(e){return String(e).replace(/&quot;/g,'"').replace(/&apos;/g,"'").replace(/&#92;/g,"\\").replace(/<br>/g,"\n")}function stripHtmlEntities(e){return String(e).replace(/&amp;/g,"").replace(/&lt;/g,"").replace(/&gt;/g,"").replace(/&quot;/g,"").replace(/&apos;/g,"").replace(/&#92;/g,"").replace(/<br>/g,"")}function htmlEntitiesParseForSearchEntry(e){return String(e).replace(/"/g,"%%%%").replace(/'/g,"````")}function htmlEntitiesParseForSearch(e){return String(e).replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,"%%%%").replace(/&apos;/g,"````")}function regexParseForSearch(e){return String(e).replace(/([\[\\\^\$\.\|\?\*\+\(\)\{\}\]])/g,"\\$1")}function dynamicSort(e){return function(t,r){return e.map(function(e){var n=1;return"-"===e[0]&&(n=-1,e=e.substring(1)),removeDiacritics(t[e]).toLowerCase()>removeDiacritics(r[e]).toLowerCase()?n:removeDiacritics(t[e]).toLowerCase()<removeDiacritics(r[e]).toLowerCase()?-n:0}).reduce(function(e,t){return e?e:t},0)}}function download(e,t){var r=document.createElement("a");r.setAttribute("href","data:text/plain;charset=utf-8,"+encodeURIComponent(t)),r.setAttribute("download",e),r.style.display="none",document.body.appendChild(r),r.click(),document.body.removeChild(r)}marked.setOptions({gfm:!0,tables:!0,breaks:!0,sanitize:!0});
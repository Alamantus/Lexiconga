var currentDictionary = {
    name: "Current Dictionary",
    //index: 0,
    words: [],
    settings: {
        caseSensitive: false,
        preferUpperCase: false
    }
}

window.onload = function () {
    LoadDictionary();
}

var Word = function (word, simpleDefinition, longDefinition, partOfSpeech) {
    //this.index = currentDictionary.index++;
    this.name = word;
    this.simpleDefinition = simpleDefinition;
    this.longDefinition = longDefinition;
    this.partOfSpeech = partOfSpeech;
}

function AddWord() {
    var word = document.getElementById("word").value;
    var simpleDefinition = document.getElementById("simpleDefinition").value;
    var longDefinition = document.getElementById("longDefinition").value;
    var partOfSpeech = document.getElementById("partOfSpeech").value;

    if (word != "" && (simpleDefinition != "" || longDefinition != "")) {
        if (!currentDictionary.settings.caseSensitive) {
            if (currentDictionary.settings.preferUpperCase) {
                word = word.toUpperCase();
            } else {
                word = word.toLowerCase();
            }
        }

        var wordIndex = WordIndex(word);
        if (wordIndex >= 0) {
            if (confirm("\"" + word + "\" is already in the dictionary. Click OK if you want to update it.")) {
                UpdateWord(wordIndex, simpleDefinition, longDefinition, partOfSpeech);
            }
        } else {
            currentDictionary.words.push(new Word(word, simpleDefinition, longDefinition, partOfSpeech));
        }

        currentDictionary.words.sort(dynamicSort("name"));

        ShowDictionary();
        SaveDictionary();
    } else {
        var alertMessage = "";
        if (word == "") {
            alertMessage += "Word cannot be blank";
            if (simpleDefinition == "" && longDefinition == "") {
                alertMessage += " and you need at least one definition.";
            } else {
                alertMessage += ".";
            }
        } else if (simpleDefinition == "" && longDefinition == "") {
            alertMessage += "You need at least one definition."
        }
    }
}

function UpdateWord(wordIndex, simpleDefinition, longDefinition, partOfSpeech) {
    currentDictionary.words[wordIndex].simpleDefinition = simpleDefinition;
    currentDictionary.words[wordIndex].longDefinition = longDefinition;
    currentDictionary.words[wordIndex].partOfSpeech = partOfSpeech;
}

function ShowDictionary() {
    var dictionaryArea = document.getElementById("theDictionary");
    var dictionaryText = "";

    for (var i = 0; i < currentDictionary.words.length; i++) {
        dictionaryText += "<entry>";

        dictionaryText += "<word>" + currentDictionary.words[i].name + "</word>";

        if (currentDictionary.words[i].partOfSpeech != "") {
            dictionaryText += " <partofspeech>" + currentDictionary.words[i].partOfSpeech + "</partofspeech>";
        }

        if (currentDictionary.words[i].simpleDefinition != "") {
            dictionaryText += "<br><simpledefinition> ==> " + currentDictionary.words[i].simpleDefinition + "</simpledefinition>";
        }

        if (currentDictionary.words[i].longDefinition != "") {
            dictionaryText += "<br><longdefinition>" + currentDictionary.words[i].longDefinition + "</longdefinition>";
        }

        dictionaryText += "</entry>";
    }

    dictionaryArea.innerHTML = dictionaryText;
}

function dynamicSort(property) {
    /* Retrieved from http://stackoverflow.com/a/4760279
       Usage: theArray.sort(dynamicSort("objectProperty"));*/
    var sortOrder = 1;
    if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a, b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

function SaveDictionary() {
    localStorage.setItem('dictionary', JSON.stringify(currentDictionary));
}

function LoadDictionary() {
    if (localStorage.getItem('dictionary')) {
        currentDictionary = JSON.parse(localStorage.getItem('dictionary'));
    }
    ShowDictionary();
}

function WordIndex(word) {
    for (var i = 0; i < currentDictionary.words.length; i++)
    {
        if (currentDictionary.words[i] == word) {
            return i;
        }
    }
    return -1;
}
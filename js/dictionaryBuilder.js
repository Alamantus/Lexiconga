﻿var currentVersion = 0.2;

var currentDictionary = {
    name: "New",
    words: [],
    settings: {
        caseSensitive: false,
        preferUpperCase: false,
        partsOfSpeech: "Noun,Adjective,Verb,Adverb,Preposition,Pronoun,Conjunction",
        isComplete: false
    },
    dictionaryImportVersion: currentVersion     // This needs to always be last.
}

var defaultDictionaryJSON = JSON.stringify(currentDictionary);  //Saves a stringifyed default dictionary.
//document.write(defaultDictionaryJSON);

var savedScroll = {
    x: 0,
    y: 0
}

window.onload = function () {
    LoadDictionary();
    ClearForm();
}

var Word = function (word, simpleDefinition, longDefinition, partOfSpeech) {
    //this.index = currentDictionary.index++;
    this.name = word;
    this.simpleDefinition = simpleDefinition;
    this.longDefinition = longDefinition;
    this.partOfSpeech = partOfSpeech;
}

function AddWord() {
    var word = htmlEntities(document.getElementById("word").value);
    var simpleDefinition = htmlEntities(document.getElementById("simpleDefinition").value);
    var longDefinition = htmlEntities(document.getElementById("longDefinition").value);
    var partOfSpeech = htmlEntities(document.getElementById("partOfSpeech").value);
    var editIndex = htmlEntities(document.getElementById("editIndex").value);
    var errorMessageArea = document.getElementById("errorMessage");
    var errorMessage = "";
    var updateConflictArea = document.getElementById("updateConflict");
    
    if (word != "" && (simpleDefinition != "" || longDefinition != "")) {
        var wordIndex = WordIndex(word);

        if (editIndex != "") {
            if (WordAtIndexWasChanged(editIndex, word, simpleDefinition, longDefinition, partOfSpeech)) {
                updateConflictArea.style.display = "block";
                updateConflictArea.innerHTML = "<span id='updateConflictMessage'>Do you really want to change the word \"" + currentDictionary.words[parseInt(editIndex)].name + "\" to what you have set above?</span>";
                updateConflictArea.innerHTML += '<button type="button" id="updateConfirmButton" onclick="UpdateWord(' + editIndex + ', \'' +
                                                                                                                    htmlEntities(word) + '\', \'' +
                                                                                                                    htmlEntities(simpleDefinition) + '\', \'' +
                                                                                                                    htmlEntities(longDefinition) + '\', \'' +
                                                                                                                    htmlEntities(partOfSpeech) + '\'); return false;">Yes, Update it</button>';
                updateConflictArea.innerHTML += '<button type="button" id="updateCancelButton" onclick="CloseUpdateConflictArea(); return false;">No, Leave it</button>';
            } else {
                errorMessage = "No change has been made to \"" + word + "\"";
                if (currentDictionary.words[parseInt(editIndex)].name != word) {
                    errorMessage += ". (Your dictionary is currently set to ignore case.)"
                }
            }
        } else if (wordIndex >= 0) {
            if (currentDictionary.words[wordIndex].simpleDefinition != simpleDefinition || currentDictionary.words[wordIndex].longDefinition != longDefinition || currentDictionary.words[wordIndex].partOfSpeech != partOfSpeech) {
                updateConflictArea.style.display = "block";
                
                var updateConflictText = "<span id='updateConflictMessage'>\"" + word + "\" is already in the dictionary";
                if (currentDictionary.words[wordIndex].name != word) {
                    updateConflictText += " as \"" + currentDictionary.words[wordIndex].name + "\", and your dictionary is set to ignore case.";
                } else {
                    updateConflictText += "."
                }
                updateConflictText += "<br>Do you want to update it to what you have set above?</span>";
                updateConflictText += '<button type="button" id="updateConfirmButton" onclick="UpdateWord(' + wordIndex + ', \'' +
                                                                                                            htmlEntities(word) + '\', \'' +
                                                                                                            htmlEntities(simpleDefinition) + '\', \'' +
                                                                                                            htmlEntities(longDefinition) + '\', \'' +
                                                                                                            htmlEntities(partOfSpeech) + '\'); return false;">Yes, Update it</button>';
                updateConflictText += ' <button type="button" id="updateCancelButton" onclick="CloseUpdateConflictArea(); return false;">No, Leave it</button>';
                
                updateConflictArea.innerHTML = updateConflictText;
            } else {
                errorMessage = "\"" + word + "\" is already in the dictionary exactly as it is written above";
                if (currentDictionary.words[wordIndex].name != word) {
                    errorMessage += ". (Your dictionary is currently set to ignore case.)"
                }
            }
        } else {
            currentDictionary.words.push(new Word(word, simpleDefinition, longDefinition, partOfSpeech));
            ClearForm();
        }
        
        /*  This will help simplify this function if I can figure out how to do it right. Not sure if it's even necessary, though.
        errorMessage += ValidateWord();
        if (errorMessage != "") {
            currentDictionary.words.push(new Word(word, simpleDefinition, longDefinition, partOfSpeech));
            ClearForm();
        }*/

        currentDictionary.words.sort(dynamicSort("name"));
        errorMessageArea.innerHTML = "";

        ShowDictionary();
        SaveDictionary();
    } else {
        if (word == "") {
            errorMessage += "Word cannot be blank";
            if (simpleDefinition == "" && longDefinition == "") {
                errorMessage += " and you need at least one definition.";
            } else {
                errorMessage += ".";
            }
        } else if (simpleDefinition == "" && longDefinition == "") {
            errorMessage += "You need at least one definition."
        }
        
        
    }
    
    errorMessageArea.innerHTML = errorMessage;
}

function ValidateWord(editIndex, word, simpleDefinition, longDefinition, partOfSpeech) {
    var errorMessage = "";
    var updateConflictArea = document.getElementById("updateConflict");
    
    var wordIndex = WordIndex(word);

    if (editIndex != "") {
        if (WordAtIndexWasChanged(editIndex, word, simpleDefinition, longDefinition, partOfSpeech)) {
            updateConflictArea.style.display = "block";
            updateConflictArea.innerHTML = "<span id='updateConflictMessage'>Do you really want to change the word \"" + currentDictionary.words[parseInt(editIndex)].name + "\" to what you have set above?</span>";
            updateConflictArea.innerHTML += '<button type="button" id="updateConfirmButton" onclick="UpdateWord(' + editIndex + ', \'' +
                                                                                                                htmlEntities(word) + '\', \'' +
                                                                                                                htmlEntities(simpleDefinition) + '\', \'' +
                                                                                                                htmlEntities(longDefinition) + '\', \'' +
                                                                                                                htmlEntities(partOfSpeech) + '\'); return false;">Yes, Update it</button>';
            updateConflictArea.innerHTML += '<button type="button" id="updateCancelButton" onclick="CloseUpdateConflictArea(); return false;">No, Leave it</button>';
        } else {
            errorMessage = "No change has been made to \"" + word + "\"";
            if (currentDictionary.words[parseInt(editIndex)].name != word) {
                errorMessage += ". (Your dictionary is currently set to ignore case.)"
            }
        }
    } else if (wordIndex >= 0) {
        if (currentDictionary.words[wordIndex].simpleDefinition != simpleDefinition || currentDictionary.words[wordIndex].longDefinition != longDefinition || currentDictionary.words[wordIndex].partOfSpeech != partOfSpeech) {
            updateConflictArea.style.display = "block";
            
            var updateConflictText = "<span id='updateConflictMessage'>\"" + word + "\" is already in the dictionary";
            if (currentDictionary.words[wordIndex].name != word) {
                updateConflictText += " as \"" + currentDictionary.words[wordIndex].name + "\", and your dictionary is set to ignore case.";
            } else {
                updateConflictText += "."
            }
            updateConflictText += "<br>Do you want to update it to what you have set above?</span>";
            updateConflictText += '<button type="button" id="updateConfirmButton" onclick="UpdateWord(' + wordIndex + ', \'' +
                                                                                                        htmlEntities(word) + '\', \'' +
                                                                                                        htmlEntities(simpleDefinition) + '\', \'' +
                                                                                                        htmlEntities(longDefinition) + '\', \'' +
                                                                                                        htmlEntities(partOfSpeech) + '\'); return false;">Yes, Update it</button>';
            updateConflictText += ' <button type="button" id="updateCancelButton" onclick="CloseUpdateConflictArea(); return false;">No, Leave it</button>';
            
            updateConflictArea.innerHTML = updateConflictText;
        } else {
            errorMessage = "\"" + word + "\" is already in the dictionary exactly as it is written above";
            if (currentDictionary.words[wordIndex].name != word) {
                errorMessage += ". (Your dictionary is currently set to ignore case.)"
            }
        }
    }
    
    return errorMessage;
}

function WordAtIndexWasChanged(indexString, word, simpleDefinition, longDefinition, partOfSpeech) {
     return (!currentDictionary.settings.caseSensitive && currentDictionary.words[parseInt(indexString)].name.toLowerCase() != word.toLowerCase()) ||
            (currentDictionary.settings.caseSensitive && currentDictionary.words[parseInt(indexString)].name != word) ||
            currentDictionary.words[parseInt(indexString)].simpleDefinition != simpleDefinition ||
            currentDictionary.words[parseInt(indexString)].longDefinition != longDefinition ||
            currentDictionary.words[parseInt(indexString)].partOfSpeech != partOfSpeech;
}

function SaveScroll() {
    var doc = document.documentElement;
    var left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
    var top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);

    savedScroll.x = left;
    savedScroll.y = top;
}

function EditWord(index) {
    SaveScroll();
    window.scroll(0, 0);

    ClearForm();

    document.getElementById("editIndex").value = index.toString();
    document.getElementById("word").value = htmlEntitiesParse(currentDictionary.words[index].name);
    document.getElementById("simpleDefinition").value = htmlEntitiesParse(currentDictionary.words[index].simpleDefinition);
    document.getElementById("longDefinition").value = htmlEntitiesParse(currentDictionary.words[index].longDefinition);
    document.getElementById("partOfSpeech").value = htmlEntitiesParse(currentDictionary.words[index].partOfSpeech);

    document.getElementById("newWordButtonArea").style.display = "none";
    document.getElementById("editWordButtonArea").style.display = "block";
}

function UpdateWord(wordIndex, word, simpleDefinition, longDefinition, partOfSpeech) {
    currentDictionary.words[wordIndex].name = word;
    currentDictionary.words[wordIndex].simpleDefinition = simpleDefinition;
    currentDictionary.words[wordIndex].longDefinition = longDefinition;
    currentDictionary.words[wordIndex].partOfSpeech = partOfSpeech;
    ShowDictionary();
    SaveDictionary();
    ClearForm();
    CloseUpdateConflictArea();

    window.scroll(savedScroll.x, savedScroll.y);
}

function DeleteWord(index) {
    if (document.getElementById("editIndex").value != "")
        ClearForm();

    currentDictionary.words.splice(index, 1);
    ShowDictionary();
    SaveDictionary();
    CloseUpdateConflictArea();

}

function CloseUpdateConflictArea() {
    document.getElementById("updateConflict").style.display = "none";
}

function ClearForm() {
    document.getElementById("word").value = "";
    document.getElementById("simpleDefinition").value = "";
    document.getElementById("longDefinition").value = "";
    document.getElementById("partOfSpeech").value = "";
    document.getElementById("editIndex").value = "";
    
    document.getElementById("newWordButtonArea").style.display = "block";
    document.getElementById("editWordButtonArea").style.display = "none";
    document.getElementById("errorMessage").innerHTML = "";
    document.getElementById("updateConflict").style.display = "none";
}

function ShowDictionary() {
    var dictionaryNameArea = document.getElementById("dictionaryName");
    dictionaryNameArea.innerHTML = htmlEntitiesParse(currentDictionary.name) + " Dictionary";

    var dictionaryArea = document.getElementById("theDictionary");
    var dictionaryText = "";

    if (currentDictionary.words.length > 0) {
        for (var i = 0; i < currentDictionary.words.length; i++) {
            dictionaryText += DictionaryEntry(i);
        }
    } else {
        dictionaryText = "There are no entries in the dictionary."
    }

    dictionaryArea.innerHTML = dictionaryText;
}

function DictionaryEntry(itemIndex) {
    var entryText = "<entry>";

    entryText += "<word>" + currentDictionary.words[itemIndex].name + "</word>";

    if (currentDictionary.words[itemIndex].partOfSpeech != "") {
        entryText += " <partofspeech>" + currentDictionary.words[itemIndex].partOfSpeech + "</partofspeech>";
    }

    entryText += "<br>";

    if (currentDictionary.words[itemIndex].simpleDefinition != "") {
        entryText += "<simpledefinition> ==> " + currentDictionary.words[itemIndex].simpleDefinition + "</simpledefinition>";
    }

    if (currentDictionary.words[itemIndex].longDefinition != "") {
        entryText += "<longdefinition>" + currentDictionary.words[itemIndex].longDefinition + "</longdefinition>";
    }

    entryText += ManagementArea(itemIndex);

    entryText += "</entry>";

    return entryText;
}

function ManagementArea(itemIndex) {
    var managementHTML = "<div class='management'>";

    managementHTML += "<span class='editButton' onclick='EditWord(" + itemIndex + ")'>Edit</span>";
    managementHTML += "<span class='deleteButton' onclick='document.getElementById(\"delete" + itemIndex + "Confirm\").style.display = \"block\";'>Delete</span>";

    managementHTML += "<div class='deleteConfirm' id='delete" + itemIndex + "Confirm' style='display:none;'>Are you sure you want to delete this entry?<br>";
    managementHTML += "<span class='deleteCancelButton' onclick='document.getElementById(\"delete" + itemIndex + "Confirm\").style.display = \"none\";'>No</span>";
    managementHTML += "<span class='deleteConfirmButton' onclick='DeleteWord(" + itemIndex + ")'>Yes</span>";
    managementHTML += "</div>";

    managementHTML += "</div>";

    return managementHTML;
}

function ShowSettings() {
    document.getElementById("settingsScreen").style.display = "block";
    document.getElementById("dictionaryNameEdit").value = htmlEntitiesParse(currentDictionary.name);
    document.getElementById("dictionaryPartsOfSpeechEdit").value = htmlEntitiesParse(currentDictionary.settings.partsOfSpeech);
    document.getElementById("dictionaryIsComplete").checked = currentDictionary.settings.isComplete;
}

function SaveSettings() {
    if (htmlEntities(document.getElementById("dictionaryNameEdit").value) != "") {
        currentDictionary.name = htmlEntities(document.getElementById("dictionaryNameEdit").value);
    }
    
    CheckForPartsOfSpeechChange();
    
    currentDictionary.settings.isComplete = document.getElementById("dictionaryIsComplete").checked;
    
    ShowDictionary();
    SaveDictionary();
}

function CheckForPartsOfSpeechChange () {
    if (htmlEntities(document.getElementById("dictionaryPartsOfSpeechEdit").value) != currentDictionary.settings.partsOfSpeech) {
        if (htmlEntities(document.getElementById("dictionaryPartsOfSpeechEdit").value) != "") {
            currentDictionary.settings.partsOfSpeech = htmlEntities(document.getElementById("dictionaryPartsOfSpeechEdit").value);
            SetPartsOfSpeech();
        }
    }
}

function SetPartsOfSpeech () {
    var partsOfSpeechSelect = document.getElementById("partOfSpeech");
    if (partsOfSpeechSelect.options.length > 0) {
        for (var i = partsOfSpeechSelect.options.length - 1; i >= 0; i--) {
            partsOfSpeechSelect.removeChild(partsOfSpeechSelect.options[i]);
        }
    }
    var newPartsOfSpeech = htmlEntitiesParse(currentDictionary.settings.partsOfSpeech).trim().split(",");
    for (var j = 0; j < newPartsOfSpeech.length; j++) {
        var partOfSpeechOption = document.createElement('option');
        partOfSpeechOption.appendChild(document.createTextNode(newPartsOfSpeech[j].trim()));
        partOfSpeechOption.value = newPartsOfSpeech[j].trim();
        partsOfSpeechSelect.appendChild(partOfSpeechOption);
    }
}

function HideSettings() {
    document.getElementById("settingsScreen").style.display = "none";
    document.getElementById("wordEntryForm").style.display = (currentDictionary.settings.isComplete) ? "none" : "block";
}

function EmptyWholeDictionary() {
    if (confirm("This will delete the entire current dictionary. If you do not have a backed up export, you will lose it forever!\n\nDo you still want to delete?")) {
        currentDictionary = JSON.parse(defaultDictionaryJSON);
        ShowDictionary();
        SaveDictionary();
        HideSettings();
    }
}

function SaveDictionary() {
    localStorage.setItem('dictionary', JSON.stringify(currentDictionary));
}

function LoadDictionary() {
    if (localStorage.getItem('dictionary')) {
        var tmpDictionary = JSON.parse(localStorage.getItem('dictionary'));
        if (tmpDictionary.words.length > 0) {
            currentDictionary = JSON.parse(localStorage.getItem('dictionary'));
        }
        tmpDictionary = null;
    }
    ShowDictionary();
    
    SetPartsOfSpeech();
    
    if (currentDictionary.settings.isComplete) {
        document.getElementById("wordEntryForm").style.display = "none";
    }
}

function ExportDictionary() {
    var downloadName = currentDictionary.name.replace(/\W/g, '');
    if (downloadName == "") {
        downloadName = "export";
    }
    download(downloadName + ".dict", localStorage.getItem('dictionary'));
}

function ImportDictionary() {
    if (!window.FileReader) {
        alert('Your browser is not supported');
        return false;
    }

    var reader = new FileReader();
    if (document.getElementById("importFile").files.length > 0) {
        var file = document.getElementById("importFile").files[0];
        // Read the file
        reader.readAsText(file);
        // When it's loaded, process it
        reader.onloadend = function () {
            if (reader.result && reader.result.length) {
                if (reader.result.substr(reader.result.length - 30) == '"dictionaryImportVersion":' + currentVersion + '}') {
                    localStorage.setItem('dictionary', reader.result);
                    document.getElementById("importFile").value = "";
                    LoadDictionary();
                    HideSettings();
                } else {
                    alert("Uploaded file is not compatible.");
                }
            } else {
                alert("Upload Failed");
            }
            reader = null;
        }
    } else {
        alert("You must add a file to import.");
    }
}

function WordIndex(word) {
    for (var i = 0; i < currentDictionary.words.length; i++)
    {
        if ((!currentDictionary.settings.caseSensitive && currentDictionary.words[i].name.toLowerCase() == word.toLowerCase()) ||
            (currentDictionary.settings.caseSensitive && currentDictionary.words[i].name == word)) {
            return i;
        }
    }
    return -1;
}

function htmlEntities(string) {
    return String(string).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;').replace(/\n/g, '<br>');
}

function htmlEntitiesParse(string) {
    return String(string).replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/<br>/g, '\n');
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
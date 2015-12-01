/* global markdown */
/* global Defiant */

var currentUser = 0;
var publicName = "Someone";

var currentDictionary = {
    name: "New",
    description: "A new dictionary.",
    createdBy: publicName,
    words: [],
    nextWordId: 1,
    settings: {
        allowDuplicates: false,
        caseSensitive: false,
        partsOfSpeech: "Noun,Adjective,Verb,Adverb,Preposition,Pronoun,Conjunction",
        sortByEquivalent: false,
        isComplete: false
    },
    externalID: 0
}

var defaultDictionaryJSON = JSON.stringify(currentDictionary);  //Saves a stringifyed default dictionary.
var previousDictionary = {};

var savedScroll = {
    x: 0,
    y: 0
}

function AddWord() {
    var word = htmlEntities(document.getElementById("word").value).trim();
    var pronunciation = htmlEntities(document.getElementById("pronunciation").value).trim();
    var partOfSpeech = htmlEntities(document.getElementById("partOfSpeech").value).trim();
    var simpleDefinition = htmlEntities(document.getElementById("simpleDefinition").value).trim();
    var longDefinition = htmlEntities(document.getElementById("longDefinition").value);
    var editIndex = htmlEntities(document.getElementById("editIndex").value);
    var errorMessageArea = document.getElementById("errorMessage");
    var errorMessage = "";
    var updateConflictArea = document.getElementById("updateConflict");
    
    if (word != "" && (simpleDefinition != "" || longDefinition != "")) {
        var wordIndex = (!currentDictionary.settings.allowDuplicates) ? WordIndex(word) : -1;

        if (editIndex != "") {
            if (WordAtIndexWasChanged(editIndex, word, pronunciation, partOfSpeech, simpleDefinition, longDefinition)) {
                updateConflictArea.style.display = "block";
                updateConflictArea.innerHTML = "<span id='updateConflictMessage'>Do you really want to change the word \"" + currentDictionary.words[parseInt(editIndex)].name + "\" to what you have set above?</span>";
                updateConflictArea.innerHTML += '<button type="button" id="updateConfirmButton" \
                                                  onclick="UpdateWord(' + editIndex + ', \'' + htmlEntities(word) + '\', \'' + htmlEntities(pronunciation) + '\', \'' + htmlEntities(partOfSpeech) + '\', \'' + htmlEntities(simpleDefinition) + '\', \'' + htmlEntities(longDefinition) + '\'); \
                                                  return false;">Yes, Update it</button>';
                updateConflictArea.innerHTML += '<button type="button" id="updateCancelButton" onclick="CloseUpdateConflictArea(); return false;">No, Leave it</button>';
            } else {
                errorMessage = "No change has been made to \"" + word + "\"";
                if (currentDictionary.words[parseInt(editIndex)].name != word) {
                    errorMessage += ". (Your dictionary is currently set to ignore case.)"
                }
            }
        } else if (wordIndex >= 0) {
            if (WordAtIndexWasChanged(wordIndex, word, pronunciation, partOfSpeech, simpleDefinition, longDefinition)) {
                updateConflictArea.style.display = "block";
                
                var updateConflictText = "<span id='updateConflictMessage'>\"" + word + "\" is already in the dictionary";
                if (currentDictionary.words[wordIndex].name != word) {
                    updateConflictText += " as \"" + currentDictionary.words[wordIndex].name + "\", and your dictionary is set to ignore case.";
                } else {
                    updateConflictText += "."
                }
                updateConflictText += "<br>Do you want to update it to what you have set above?</span>";
                updateConflictText += '<button type="button" id="updateConfirmButton" \
                                                  onclick="UpdateWord(' + wordIndex + ', \'' + htmlEntities(word) + '\', \'' + htmlEntities(pronunciation) + '\', \'' + htmlEntities(partOfSpeech) + '\', \'' + htmlEntities(simpleDefinition) + '\', \'' + htmlEntities(longDefinition) + '\'); \
                                                  return false;">Yes, Update it</button>';
                updateConflictText += ' <button type="button" id="updateCancelButton" onclick="CloseUpdateConflictArea(); return false;">No, Leave it</button>';
                
                updateConflictArea.innerHTML = updateConflictText;
            } else {
                errorMessage = "\"" + word + "\" is already in the dictionary exactly as it is written above";
                if (currentDictionary.words[wordIndex].name != word) {
                    errorMessage += ". (Your dictionary is currently set to ignore case.)"
                }
            }
        } else {
            currentDictionary.words.push({name: word, pronunciation: pronunciation, partOfSpeech: partOfSpeech, simpleDefinition: simpleDefinition, longDefinition: longDefinition, wordId: currentDictionary.nextWordId++});
            FocusAfterAddingNewWord();
            NewWordNotification(word);
            SaveAndUpdateDictionary(false);
        }

        errorMessageArea.innerHTML = "";
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

function WordAtIndexWasChanged(indexString, word, pronunciation, partOfSpeech, simpleDefinition, longDefinition) {
     return (!currentDictionary.settings.caseSensitive && currentDictionary.words[parseInt(indexString)].name.toLowerCase() != word.toLowerCase()) ||
            (currentDictionary.settings.caseSensitive && currentDictionary.words[parseInt(indexString)].name != word) ||
            currentDictionary.words[parseInt(indexString)].pronunciation != pronunciation ||
            currentDictionary.words[parseInt(indexString)].partOfSpeech != partOfSpeech ||
            currentDictionary.words[parseInt(indexString)].simpleDefinition != simpleDefinition ||
            currentDictionary.words[parseInt(indexString)].longDefinition != longDefinition;
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
    document.getElementById("pronunciation").value = htmlEntitiesParse(currentDictionary.words[index].pronunciation);
    document.getElementById("partOfSpeech").value = htmlEntitiesParse(currentDictionary.words[index].partOfSpeech);
    document.getElementById("simpleDefinition").value = htmlEntitiesParse(currentDictionary.words[index].simpleDefinition);
    document.getElementById("longDefinition").value = htmlEntitiesParse(currentDictionary.words[index].longDefinition);

    document.getElementById("newWordButtonArea").style.display = "none";
    document.getElementById("editWordButtonArea").style.display = "block";
}

function SaveAndUpdateDictionary(keepFormContents) {
    if (!currentDictionary.settings.sortByEquivalent) {
        currentDictionary.words.sort(dynamicSort("name"));
    } else {
        currentDictionary.words.sort(dynamicSort("simpleDefinition"));
    }
    SaveDictionary(true, true);
    ShowDictionary();
    if (!keepFormContents) {
        ClearForm();
    }
    CloseUpdateConflictArea();
}

function UpdateWord(wordIndex, word, pronunciation, partOfSpeech, simpleDefinition, longDefinition) {
    currentDictionary.words[wordIndex].name = word;
    currentDictionary.words[wordIndex].pronunciation = pronunciation;
    currentDictionary.words[wordIndex].partOfSpeech = partOfSpeech;
    currentDictionary.words[wordIndex].simpleDefinition = simpleDefinition;
    currentDictionary.words[wordIndex].longDefinition = longDefinition;
    
    SaveAndUpdateDictionary();

    window.scroll(savedScroll.x, savedScroll.y);
}

function DeleteWord(index) {
    if (document.getElementById("editIndex").value != "")
        ClearForm();

    currentDictionary.words.splice(index, 1);
    
    SaveAndUpdateDictionary(true);
}

function UpdateFilter() {
    ShowDictionary();
}

function ShowDictionary() {
    var filter = document.getElementById("wordFilter").value;
    
    var searchResults = [];
    var search = htmlEntities(document.getElementById("searchBox").value);
    if (search != "") {
        var xpath = [];
        if (document.getElementById("searchOptionWord").checked) {
            xpath.push('contains(name, "'+ search +'")');
        }
        if (document.getElementById("searchOptionSimple").checked) {
            xpath.push('contains(simpleDefinition, "'+ search +'")');
        }
        if (document.getElementById("searchOptionLong").checked) {
            xpath.push('contains(longDefinition, "'+ search +'")');
        }
        searchResults = JSON.search(currentDictionary, '//words['+ xpath.join(' or ') +']/name');
    }
    
    var dictionaryNameArea = document.getElementById("dictionaryName");
    dictionaryNameArea.innerHTML = htmlEntitiesParse(currentDictionary.name) + " Dictionary";
    
    var dictionaryDescriptionArea = document.getElementById("dictionaryDescription");
    dictionaryDescriptionArea.innerHTML = marked(htmlEntitiesParse(currentDictionary.description));
    
    var dictionaryArea = document.getElementById("theDictionary");
    var dictionaryText = "";

    if (currentDictionary.words.length > 0) {
        for (var i = 0; i < currentDictionary.words.length; i++) {
            if (filter == "" || (filter != "" && currentDictionary.words[i].partOfSpeech == filter)) {
                if (search == "" || (search != "" && searchResults.indexOf(htmlEntities(currentDictionary.words[i].name)) >= 0)) {
                    if (!currentDictionary.words[i].hasOwnProperty("pronunciation")) {
                        currentDictionary.words[i].pronunciation = "";  //Account for new property
                    }
                    if (!currentDictionary.words[i].hasOwnProperty("wordId")) {
                        currentDictionary.words[i].wordId = i + 1;  //Account for new property
                    }
                    dictionaryText += DictionaryEntry(i);
                }
            }
        }
    } else {
        dictionaryText = "There are no entries in the dictionary."
    }

    dictionaryArea.innerHTML = dictionaryText;
}

function DictionaryEntry(itemIndex) {
    var entryText = "<entry><a name='" + currentDictionary.words[itemIndex].wordId + "'></a><a href='#" + currentDictionary.words[itemIndex].wordId + "' class='wordLink clickable'>&#x1f517;</a>";
    
    var searchTerm = htmlEntities(document.getElementById("searchBox").value);
    var searchRegEx = new RegExp(searchTerm, "gi");

    entryText += "<word>" + ((searchTerm != "" && document.getElementById("searchOptionWord").checked) ? currentDictionary.words[itemIndex].name.replace(searchRegEx, "<searchTerm>" + searchTerm + "</searchterm>") : currentDictionary.words[itemIndex].name) + "</word>";
    
    if (currentDictionary.words[itemIndex].pronunciation != "") {
        entryText += "<pronunciation>" + marked(htmlEntitiesParse(currentDictionary.words[itemIndex].pronunciation)).replace("<p>","").replace("</p>","") + "</pronunciation>";
    }
    
    if (currentDictionary.words[itemIndex].partOfSpeech != "") {
        entryText += "<partofspeech>" + currentDictionary.words[itemIndex].partOfSpeech + "</partofspeech>";
    }

    entryText += "<br>";

    if (currentDictionary.words[itemIndex].simpleDefinition != "") {
        entryText += "<simpledefinition>" + ((searchTerm != "" && document.getElementById("searchOptionSimple").checked) ? currentDictionary.words[itemIndex].simpleDefinition.replace(searchRegEx, "<searchTerm>" + searchTerm + "</searchterm>") : currentDictionary.words[itemIndex].simpleDefinition) + "</simpledefinition>";
    }

    if (currentDictionary.words[itemIndex].longDefinition != "") {
        entryText += "<longdefinition>" + ((searchTerm != "" && document.getElementById("searchOptionLong").checked) ? marked(htmlEntitiesParse(currentDictionary.words[itemIndex].longDefinition)).replace(searchRegEx, "<searchTerm>" + searchTerm + "</searchterm>") : marked(htmlEntitiesParse(currentDictionary.words[itemIndex].longDefinition))) + "</longdefinition>";
    }

    if (!currentDictionary.settings.isComplete) {
        entryText += ManagementArea(itemIndex);
    }

    entryText += "</entry>";

    return entryText;
}

function ManagementArea(itemIndex) {
    var managementHTML = "<div class='management'>";

    managementHTML += "<span class='clickable editButton' onclick='EditWord(" + itemIndex + ")'>Edit</span>";
    managementHTML += "<span class='clickable deleteButton' onclick='document.getElementById(\"delete" + itemIndex + "Confirm\").style.display = \"block\";'>Delete</span>";

    managementHTML += "<div class='deleteConfirm' id='delete" + itemIndex + "Confirm' style='display:none;'>Are you sure you want to delete this entry?<br><br>";
    managementHTML += "<span class='clickable deleteCancelButton' onclick='document.getElementById(\"delete" + itemIndex + "Confirm\").style.display = \"none\";'>No</span>";
    managementHTML += "<span class='clickable deleteConfirmButton' onclick='DeleteWord(" + itemIndex + ")'>Yes</span>";
    managementHTML += "</div>";

    managementHTML += "</div>";

    return managementHTML;
}

function SaveSettings() {
    if (htmlEntities(document.getElementById("dictionaryNameEdit").value) != "") {
        currentDictionary.name = htmlEntities(document.getElementById("dictionaryNameEdit").value);
    }
    
    currentDictionary.description = htmlEntities(document.getElementById("dictionaryDescriptionEdit").value);
    
    CheckForPartsOfSpeechChange();
    
    currentDictionary.settings.allowDuplicates = document.getElementById("dictionaryAllowDuplicates").checked;
    currentDictionary.settings.caseSensitive = document.getElementById("dictionaryCaseSensitive").checked;
    
    currentDictionary.settings.sortByEquivalent = document.getElementById("dictionarySortByEquivalent").checked;
    
    currentDictionary.settings.isComplete = document.getElementById("dictionaryIsComplete").checked;
    
    HideSettingsWhenComplete();
    
    SaveAndUpdateDictionary(true);
    LoadUserDictionaries();
}

function CheckForPartsOfSpeechChange() {
    if (htmlEntities(document.getElementById("dictionaryPartsOfSpeechEdit").value) != currentDictionary.settings.partsOfSpeech) {
        if (htmlEntities(document.getElementById("dictionaryPartsOfSpeechEdit").value) != "") {
            currentDictionary.settings.partsOfSpeech = htmlEntities(document.getElementById("dictionaryPartsOfSpeechEdit").value);
            SetPartsOfSpeech();
        }
    }
}

function EmptyWholeDictionary() {
    if (confirm("This will delete the entire current dictionary. If you do not have a backed up export, you will lose it forever!\n\nDo you still want to delete?")) {
        CreateNewDictionary();
    }
}

function CreateNewDictionary() {
    ResetDictionaryToDefault();
    SaveAndUpdateDictionary(false);
    SetPartsOfSpeech();
    HideSettings();
}

function DeleteCurrentDictionary() {
    if (confirm("This will delete the current dictionary from the database. If you do not have a backed up export, you will lose it forever!\n\nDo you still want to delete?")) {
        ResetDictionaryToDefault();
        
        var deleteDictionary = new XMLHttpRequest();
        deleteDictionary.open('POST', "php/ajax_dictionarymanagement.php?action=delete");
        deleteDictionary.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        deleteDictionary.onreadystatechange = function() {
            if (deleteDictionary.readyState == 4 && deleteDictionary.status == 200) {
                if (deleteDictionary.responseText.length < 31) {
                    console.log(deleteDictionary.responseText);
                    CreateNewDictionary();
                } else {
                    HideSettings();
                    ShowDictionaryDeleteMenu();

                    if (document.getElementById("loadAfterDelete").options.length == 0) {
                        document.getElementById('loadAfterDeleteScreen').style.display = 'none';
                        CreateNewDictionary();
                    }
                }
                return true;
            } else {
                return false;
            }
        }
        deleteDictionary.send();
    }
}


function ResetDictionaryToDefault() {
    currentDictionary = JSON.parse(defaultDictionaryJSON);
}

function SaveDictionary(sendToDatabase, sendWords) {
    localStorage.setItem('dictionary', JSON.stringify(currentDictionary));
    
    //Always save local copy of current dictionary, but if logged in also send to database.
    if (sendToDatabase) {
        sendWords = (typeof sendWords !== 'undefined') ? sendWords : false;
        SendDictionary(sendWords);
    }
    
    SavePreviousDictionary();
}

function SendDictionary(sendWords) {
    sendWords = (typeof sendWords !== 'undefined') ? sendWords : false;
    var action = "";
    var postString = "";
    if (currentDictionary.externalID > 0) {
        action = "update";
        postString = DataToSend(sendWords);
    } else {
        action = "new";
        postString = DataToSend(true, true);
    }

    var sendDictionary = new XMLHttpRequest();
    sendDictionary.open('POST', "php/ajax_dictionarymanagement.php?action=" + action);
    sendDictionary.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    sendDictionary.onreadystatechange = function() {
        if (sendDictionary.readyState == 4 && sendDictionary.status == 200) {
            if (sendDictionary.responseText == "updated successfully") {
                console.log(sendDictionary.responseText);
                LoadUserDictionaries();
                ProcessLoad();
            } else if (isNaN(parseInt(sendDictionary.responseText))) {
                console.log(sendDictionary.responseText);
            } else {    // It will only be a number if it is a new dictionary.
                currentDictionary.externalID = parseInt(sendDictionary.responseText);
                LoadUserDictionaries();
                ProcessLoad();
                console.log("saved successfully");
            }
            return true;
        } else {
            return false;
        }
    }
    sendDictionary.send(postString);
}

function DataToSend(doSendWords, sendAll) {
    sendAll = (typeof sendAll !== 'undefined' && sendAll != null) ? sendAll : false;
    var data = "";
    if (currentDictionary.externalID == 0) {
        data = "name=" + encodeURIComponent(currentDictionary.name) + "&description=" + encodeURIComponent(currentDictionary.description) + "&words=" + encodeURIComponent(JSON.stringify(currentDictionary.words));
        data += "&nextwordid=" + currentDictionary.nextWordId + "&allowduplicates=" + ((currentDictionary.settings.allowDuplicates) ? "1" : "0") + "&casesensitive=" + ((currentDictionary.settings.caseSensitive) ? "1" : "0");
        data += "&partsofspeech=" + encodeURIComponent(currentDictionary.settings.partsOfSpeech) + "&sortbyequivalent=" + ((currentDictionary.settings.sortByEquivalent) ? "1" : "0") + "&iscomplete=" + ((currentDictionary.settings.isComplete) ? "1" : "0") + "&ispublic=0";
    } else {
        if (sendAll || currentDictionary.name != previousDictionary.name) {
            data += "name=" + encodeURIComponent(currentDictionary.name);
        }
        if (sendAll || currentDictionary.description != previousDictionary.description) {
            data += ((data=="") ? "" : "&") + "description=" + encodeURIComponent(currentDictionary.description);
        }
        if (sendAll || doSendWords) {
            data += ((data=="") ? "" : "&") + "words=" + encodeURIComponent(JSON.stringify(currentDictionary.words));
        }
        if (sendAll || currentDictionary.nextWordId != previousDictionary.nextWordId) {
            data += ((data=="") ? "" : "&") + "nextwordid=" + currentDictionary.nextWordId;
        }
        if (sendAll || currentDictionary.settings.allowDuplicates != previousDictionary.allowDuplicates) {
            data += ((data=="") ? "" : "&") + "allowduplicates=" + ((currentDictionary.settings.allowDuplicates) ? "1" : "0");
        }
        if (sendAll || currentDictionary.settings.caseSensitive != previousDictionary.caseSensitive) {
            data += ((data=="") ? "" : "&") + "casesensitive=" + ((currentDictionary.settings.caseSensitive) ? "1" : "0");
        }
        if (sendAll || currentDictionary.settings.partsOfSpeech != previousDictionary.partsOfSpeech) {
            data += ((data=="") ? "" : "&") + "partsofspeech=" + encodeURIComponent(currentDictionary.settings.partsOfSpeech);
        }
        if (sendAll || currentDictionary.settings.sortByEquivalent != previousDictionary.sortByEquivalent) {
            data += ((data=="") ? "" : "&") + "sortbyequivalent=" + ((currentDictionary.settings.sortByEquivalent) ? "1" : "0");
        }
        if (sendAll || currentDictionary.settings.isComplete != previousDictionary.isComplete) {
            data += ((data=="") ? "" : "&") + "iscomplete=" + ((currentDictionary.settings.isComplete) ? "1" : "0");
        }
        data += ((data=="") ? "" : "&") + "ispublic=0";
    }
    return data;
}

function LoadDictionary() {
    LoadLocalDictionary();
    var loadDictionary = new XMLHttpRequest();
    loadDictionary.open('GET', "php/ajax_dictionarymanagement.php?action=load");
    loadDictionary.onreadystatechange = function() {
        if (loadDictionary.readyState == 4 && loadDictionary.status == 200) {
            if (loadDictionary.responseText == "no dictionaries") {
                // If there are no dictionaries in the database and there's one in memory, remove the id and send it as a new one.
                currentDictionary.externalID = 0;
                SendDictionary(true);
            } else if (loadDictionary.responseText.length < 60) {
                console.log(loadDictionary.responseText);
            } else {
                currentDictionary = JSON.parse(loadDictionary.responseText);
                SaveDictionary(false, false);
            }
        }
        ProcessLoad();
    }
    loadDictionary.send();
}

function ChangeDictionary(userDictionariesSelect) {
    userDictionariesSelect = (typeof userDictionariesSelect !== 'undefined' && userDictionariesSelect != null) ? userDictionariesSelect : document.getElementById("userDictionaries");
    if (currentDictionary.externalID != userDictionariesSelect.value && userDictionariesSelect.options.length > 0) {
        var changeDictionaryRequest = new XMLHttpRequest();
        changeDictionaryRequest.open('POST', "php/ajax_dictionarymanagement.php?action=switch");
        changeDictionaryRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        var postString = "newdictionaryid=" + userDictionariesSelect.value.toString();
        changeDictionaryRequest.onreadystatechange = function() {
            if (changeDictionaryRequest.readyState == 4 && changeDictionaryRequest.status == 200) {
                if (changeDictionaryRequest.responseText == "no dictionaries") {
                    console.log(changeDictionaryRequest.responseText);
                    SendDictionary(false);
                } else if (changeDictionaryRequest.responseText.length < 60) {
                    console.log(changeDictionaryRequest.responseText);
                } else {
                    currentDictionary = JSON.parse(changeDictionaryRequest.responseText);
                    SaveDictionary(false, false);
                    ProcessLoad();
                    LoadUserDictionaries();
                    HideSettings();
                }
            }
        }
        changeDictionaryRequest.send(postString);
    }
}

function LoadLocalDictionary() {
    if (localStorage.getItem('dictionary')) {
        var tmpDictionary = JSON.parse(localStorage.getItem('dictionary'));
        if (tmpDictionary.words.length > 0 || tmpDictionary.description != "A new dictionary." || tmpDictionary.name != "New") {
            currentDictionary = JSON.parse(localStorage.getItem('dictionary'));
        }
        tmpDictionary = null;
    }
}

function ProcessLoad() {
    if (!currentDictionary.hasOwnProperty("nextWordId")) {
        currentDictionary.nextWordId = currentDictionary.words.length + 1;
    }

    HideSettingsWhenComplete();
    
    ShowDictionary();
    
    SetPartsOfSpeech();
    
    if (currentDictionary.settings.isComplete) {
        document.getElementById("wordEntryForm").style.display = "none";
    }
    
    SavePreviousDictionary();
}

function SavePreviousDictionary () {
    // Save non-word data to check if anything has changed (words can identify themselves if changed).
    // Used to minimize data pushed to database.
    previousDictionary = {
        name: currentDictionary.name,
        description: currentDictionary.description,
        nextWordId: currentDictionary.nextWordId,
        allowDuplicates: currentDictionary.settings.allowDuplicates,
        caseSensitive: currentDictionary.settings.caseSensitive,
        partsOfSpeech: currentDictionary.settings.partsOfSpeech,
        sortByEquivalent: currentDictionary.settings.sortByEquivalent,
        isComplete: currentDictionary.settings.isComplete
    };
}

function ExportDictionary() {
    var downloadName = stripHtmlEntities(currentDictionary.name).replace(/\W/g, '');
    if (downloadName == "") {
        downloadName = "export";
    }
    download(downloadName + ".dict", localStorage.getItem('dictionary'));
}

function ImportDictionary() {
    if (currentDictionary.externalID > 0 || confirm("Importing this dictionary will overwrite your current one, making it impossible to retrieve if you have not already exported it! Do you still want to import?")) {
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
                    var tmpDicitonary = JSON.parse(reader.result);
                    
                    if (tmpDicitonary.hasOwnProperty("name") && tmpDicitonary.hasOwnProperty("description") &&
                        tmpDicitonary.hasOwnProperty("words") && tmpDicitonary.hasOwnProperty("settings"))
                    {
                        currentDictionary = JSON.parse(reader.result);
                        currentDictionary.externalID = 0;   // Reset external id for imported dictionary.
                        SaveDictionary(true, true);
                        ProcessLoad();
                        HideSettings();
                        document.getElementById("importFile").value = "";
                    } else {
                        var errorString = "File is missing:";
                        if (!tmpDicitonary.hasOwnProperty("name"))
                            errorString += " name";
                        if (!tmpDicitonary.hasOwnProperty("description"))
                            errorString += " description";
                        if (!tmpDicitonary.hasOwnProperty("words"))
                            errorString += " words";
                        if (!tmpDicitonary.hasOwnProperty("settings"))
                            errorString += " settings";
                        alert("Uploaded file is not compatible.\n\n" + errorString);
                    }
                    
                    tmpDicitonary = null;
                } else {
                    alert("Upload Failed");
                }
                reader = null;
            }
        } else {
            alert("You must add a file to import.");
        }
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

function stripHtmlEntities(string) {
    // This is for the export name.
    return String(string).replace(/&amp;/g, '').replace(/&lt;/g, '').replace(/&gt;/g, '').replace(/&quot;/g, '').replace(/&apos;/g, "").replace(/<br>/g, '');
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
        var result = (a[property].toLowerCase() < b[property].toLowerCase()) ? -1 : (a[property].toLowerCase() > b[property].toLowerCase()) ? 1 : 0;
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
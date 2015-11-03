/* global markdown */
/* global Defiant */

var currentVersion = 0.2;

var currentDictionary = {
    name: "New",
    description: "A new dictionary.",
    words: [],
    settings: {
        allowDuplicates: false,
        caseSensitive: false,
        partsOfSpeech: "Noun,Adjective,Verb,Adverb,Preposition,Pronoun,Conjunction",
        isComplete: false
    },
    dictionaryImportVersion: currentVersion     // This needs to always be last.
}

var defaultDictionaryJSON = JSON.stringify(currentDictionary);  //Saves a stringifyed default dictionary.

var savedScroll = {
    x: 0,
    y: 0
}

window.onload = function () {
    LoadDictionary();
    ClearForm();
    
    GetTextFile("README.md");
    GetTextFile("TERMS.md");
    GetTextFile("PRIVACY.md");
}

var aboutText, termsText, privacyText, loginForm, createAccountForm;

loginForm = '<div class="settingsCol"><form id="loginForm" method="post" action="?login"> \
                 <h2>Log In</h2> \
                 <label><span>Email</span> \
                     <input type="email" id="loginEmailField" name="email" /> \
                 </label> \
                 <label><span>Password</span> \
                     <input type="password" id="loginPasswordField" name="password" /> \
                 </label> \
                 <div id="loginError" style="font-weight:bold;color:red;"></div> \
                 <button type="submit" id="loginSubmitButton" onclick="ValidateLogin(); return false;">Log In</button> \
             </form></div> \
             <div class="settingsCol"><form id="createAccountForm" method="post" action="?createaccount"> \
                 <h2>Create a New Account</h2> \
                 <p>Creating an account allows you to save and switch between up to 10 dictionaries and access them from any device for free! Plus if you allow us to send you emails, you\'ll be the first to hear about any new features that get added or if any of our policies change for any  reason.</p> \
                 <label><span>Email</span> \
                     <input type="email" id="createAccountEmailField" name="email" /> \
                 </label> \
                 <label><span>Password</span> \
                     <input type="password" id="createAccountPasswordField" name="password" /> \
                 </label> \
                 <label><span>Confirm Password</span> \
                     <input type="password" id="createAccountPasswordConfirmField" name="confirmpassword" /> \
                 </label> \
                 <label><b>Allow Emails</b> \
                     <input type="checkbox" id="createAccountAllowEmailsField" name="allowemails" checked="checked" /> \
                 </label> \
                 <div id="createAccountError" style="font-weight:bold;color:red;"></div> \
                 <button type="submit" id="createAccountSubmitButton" onclick="ValidateCreateAccount(); return false;">Create Account</button> \
             </form></div>';

function ValidateLogin() {
    var errorMessage = document.getElementById("loginError");
    var emailValue = document.getElementById("loginEmailField").value;
    var passwordValue = document.getElementById("loginPasswordField").value;
      
    if (emailValue == "") {
        errorMessage.innerHTML = "Email cannot be blank!";
        return false;
    } else if (!(/[^\s@]+@[^\s@]+\.[^\s@]+/.test(emailValue))) {
        errorMessage.innerHTML = "Your email address looks fake. Email addresses look like this: name@email.com."
        return false;
    } else if (passwordValue == "") {
        errorMessage.innerHTML = "Password cannot be blank!";
        return false;
    } else {
        document.getElementById("loginForm").submit();
    }
}

function ValidateCreateAccount() {
    var errorMessage = document.getElementById("createAccountError");
    var emailValue = document.getElementById("createAccountEmailField").value;
    var passwordValue = document.getElementById("createAccountPasswordField").value;
    var passwordConfirmValue = document.getElementById("createAccountPasswordConfirmField").value;
      
    if (emailValue == "") {
        errorMessage.innerHTML = "Email cannot be blank!";
        return false;
    } else if (!(/[^\s@]+@[^\s@]+\.[^\s@]+/.test(emailValue))) {
        errorMessage.innerHTML = "Your email address looks fake. Email addresses look like this: name@email.com."
        return false;
    } else if (passwordValue == "") {
        errorMessage.innerHTML = "Password cannot be blank!";
        return false;
    } else if (passwordValue != passwordConfirmValue) {
        errorMessage.innerHTML = "Passwords do not match!";
        return false;
    } else {
        var emailCheck = new XMLHttpRequest();
        emailCheck.open('GET', "php/ajax_createaccountemailcheck.php?email=" + emailValue);
        emailCheck.onreadystatechange = function() {
            if (emailCheck.readyState == 4 && emailCheck.status == 200) {
                if (emailCheck.responseText != "ok") {
                    errorMessage.innerHTML = "The email address entered is already being used. Try logging in or using a different email address instead.";
                    return false;
                } else {
                    document.getElementById("createAccountForm").submit();
                }
            }
        }
        emailCheck.send();
    }
}

function GetTextFile(filename) {
    var readmeFileRequest = new XMLHttpRequest();
    readmeFileRequest.open('GET', filename);
    readmeFileRequest.onreadystatechange = function() {
        if (readmeFileRequest.readyState == 4 && readmeFileRequest.status == 200) {
            if (filename == "TERMS.md") {
                termsText = markdown.toHTML(readmeFileRequest.responseText);
            } else if (filename == "PRIVACY.md") {
                privacyText = markdown.toHTML(readmeFileRequest.responseText);
            } else {
                aboutText = markdown.toHTML(readmeFileRequest.responseText);
            }
        }
    }
    readmeFileRequest.send();
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
        var wordIndex = (!currentDictionary.settings.allowDuplicates) ? WordIndex(word) : -1;

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
            currentDictionary.words.push({name: word, simpleDefinition: simpleDefinition, longDefinition: longDefinition, partOfSpeech: partOfSpeech});
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

function SaveAndUpdateDictionary(keepFormContents) {
    currentDictionary.words.sort(dynamicSort("name"));
    SaveDictionary();
    ShowDictionary();
    if (!keepFormContents) {
        ClearForm();
    }
    CloseUpdateConflictArea();
}

function UpdateWord(wordIndex, word, simpleDefinition, longDefinition, partOfSpeech) {
    currentDictionary.words[wordIndex].name = word;
    currentDictionary.words[wordIndex].simpleDefinition = simpleDefinition;
    currentDictionary.words[wordIndex].longDefinition = longDefinition;
    currentDictionary.words[wordIndex].partOfSpeech = partOfSpeech;
    
    SaveAndUpdateDictionary();

    window.scroll(savedScroll.x, savedScroll.y);
}

function DeleteWord(index) {
    if (document.getElementById("editIndex").value != "")
        ClearForm();

    currentDictionary.words.splice(index, 1);
    
    SaveAndUpdateDictionary(true);
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

function UpdateFilter() {
    ShowDictionary();
}

function ShowDictionary() {
    var filter = document.getElementById("wordFilter").value;
    
    var searchResults = [];
    var search = htmlEntities(document.getElementById("searchBox").value);
    if (search != "") {
        if (document.getElementById("searchOptionWord").checked) {
            var wordNameSearch = JSON.search(currentDictionary, '//words[contains(name, "' + search + '")]/name');
            for (var i = 0; i < wordNameSearch.length; i++) {
                searchResults.push(wordNameSearch[i]);
            }
        }
        if (document.getElementById("searchOptionSimple").checked) {
            var simpleDefinitionSearch = JSON.search(currentDictionary, '//words[contains(simpleDefinition, "' + search + '")]/name');
            for (var i = 0; i < simpleDefinitionSearch.length; i++) {
                if (searchResults.indexOf(simpleDefinitionSearch[i]) < 0) {
                    searchResults.push(simpleDefinitionSearch[i]);
                }
            }
        }
        if (document.getElementById("searchOptionLong").checked) {
            var longDefinitionSearch = JSON.search(currentDictionary, '//words[contains(longDefinition, "' + search + '")]/name');
            for (var i = 0; i < longDefinitionSearch.length; i++) {
                if (searchResults.indexOf(longDefinitionSearch[i]) < 0) {
                    searchResults.push(longDefinitionSearch[i]);
                }
            }
        }
    }
    
    var dictionaryNameArea = document.getElementById("dictionaryName");
    dictionaryNameArea.innerHTML = htmlEntitiesParse(currentDictionary.name) + " Dictionary";
    
    var dictionaryDescriptionArea = document.getElementById("dictionaryDescription");
    dictionaryDescriptionArea.innerHTML = markdown.toHTML(htmlEntitiesParse(currentDictionary.description));
    
    var dictionaryArea = document.getElementById("theDictionary");
    var dictionaryText = "";

    if (currentDictionary.words.length > 0) {
        for (var i = 0; i < currentDictionary.words.length; i++) {
            if (filter == "" || (filter != "" && currentDictionary.words[i].partOfSpeech == filter)) {
                if (search == "" || (search != "" && searchResults.indexOf(currentDictionary.words[i].name) >= 0)) {
                    dictionaryText += DictionaryEntry(i);
                }
            }
        }
    } else {
        dictionaryText = "There are no entries in the dictionary."
    }

    dictionaryArea.innerHTML = dictionaryText;
}

function ToggleDescription() {
    var descriptionToggle = document.getElementById("descriptionToggle");
    var descriptionArea = document.getElementById("dictionaryDescription");
    
    if (descriptionArea.style.display == "none") {
        descriptionArea.style.display = "block";
        descriptionToggle.innerHTML = "Hide Description";
    } else {
        descriptionArea.style.display = "none";
        descriptionToggle.innerHTML = "Show Description";
    }
}

function DictionaryEntry(itemIndex) {
    var entryText = "<entry>";
    
    var searchTerm = htmlEntities(document.getElementById("searchBox").value);
    var searchRegEx = new RegExp(searchTerm, "gi");

    entryText += "<word>" + ((searchTerm != "" && document.getElementById("searchOptionWord").checked) ? currentDictionary.words[itemIndex].name.replace(searchRegEx, "<searchTerm>" + searchTerm + "</searchterm>") : currentDictionary.words[itemIndex].name) + "</word>";

    if (currentDictionary.words[itemIndex].partOfSpeech != "") {
        entryText += " <partofspeech>" + currentDictionary.words[itemIndex].partOfSpeech + "</partofspeech>";
    }

    entryText += "<br>";

    if (currentDictionary.words[itemIndex].simpleDefinition != "") {
        entryText += "<simpledefinition>" + ((searchTerm != "" && document.getElementById("searchOptionSimple").checked) ? currentDictionary.words[itemIndex].simpleDefinition.replace(searchRegEx, "<searchTerm>" + searchTerm + "</searchterm>") : currentDictionary.words[itemIndex].simpleDefinition) + "</simpledefinition>";
    }

    if (currentDictionary.words[itemIndex].longDefinition != "") {
        entryText += "<longdefinition>" + ((searchTerm != "" && document.getElementById("searchOptionLong").checked) ? markdown.toHTML(htmlEntitiesParse(currentDictionary.words[itemIndex].longDefinition)).replace(searchRegEx, "<searchTerm>" + searchTerm + "</searchterm>") : markdown.toHTML(htmlEntitiesParse(currentDictionary.words[itemIndex].longDefinition))) + "</longdefinition>";
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

function ShowInfo(text) {
    if (text == "terms") {
        document.getElementById("infoText").innerHTML = termsText;
    } else if (text == "privacy") {
        document.getElementById("infoText").innerHTML = privacyText;
    } else if (text == "login" || text == "create") {
        document.getElementById("infoText").innerHTML = loginForm;
    } else {
        document.getElementById("infoText").innerHTML = aboutText;
    }
    document.getElementById("infoPage").scrollTop = 0;
    document.getElementById("infoScreen").style.display = "block";
}

function HideInfo() {
    document.getElementById("infoScreen").style.display = "none";
}

function ToggleCaseSensitiveOption() {
    if (document.getElementById("dictionaryAllowDuplicates").checked) {
        document.getElementById("dictionaryCaseSensitive").disabled = true;
    } else {
        document.getElementById("dictionaryCaseSensitive").disabled = false;
    }
}

function ShowSettings() {
    document.getElementById("settingsScreen").style.display = "block";
    document.getElementById("dictionaryNameEdit").value = htmlEntitiesParse(currentDictionary.name);
    document.getElementById("dictionaryDescriptionEdit").value = htmlEntitiesParse(currentDictionary.description);
    document.getElementById("dictionaryPartsOfSpeechEdit").value = htmlEntitiesParse(currentDictionary.settings.partsOfSpeech);
    document.getElementById("dictionaryAllowDuplicates").checked = currentDictionary.settings.allowDuplicates;
    document.getElementById("dictionaryCaseSensitive").checked = currentDictionary.settings.caseSensitive;
    document.getElementById("dictionaryIsComplete").checked = currentDictionary.settings.isComplete;
    document.getElementById("numberOfWordsInDictionary").innerHTML = currentDictionary.words.length.toString();
}

function SaveSettings() {
    if (htmlEntities(document.getElementById("dictionaryNameEdit").value) != "") {
        currentDictionary.name = htmlEntities(document.getElementById("dictionaryNameEdit").value);
    }
    
    currentDictionary.description = htmlEntities(document.getElementById("dictionaryDescriptionEdit").value);
    
    CheckForPartsOfSpeechChange();
    
    currentDictionary.settings.allowDuplicates = document.getElementById("dictionaryAllowDuplicates").checked;
    currentDictionary.settings.caseSensitive = document.getElementById("dictionaryCaseSensitive").checked;
    
    currentDictionary.settings.isComplete = document.getElementById("dictionaryIsComplete").checked;
    
    HideSettingsWhenComplete();
    
    SaveAndUpdateDictionary(true);
}

function HideSettingsWhenComplete() {
    if (currentDictionary.settings.isComplete) {
        document.getElementById("hideIfComplete").style.display = "none";
    } else {
        document.getElementById("hideIfComplete").style.display = "block";
    }
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
    var wordFilterSelect = document.getElementById("wordFilter");
    if (partsOfSpeechSelect.options.length > 0) {
        for (var i = partsOfSpeechSelect.options.length - 1; i >= 0; i--) {
            partsOfSpeechSelect.removeChild(partsOfSpeechSelect.options[i]);
            wordFilterSelect.removeChild(wordFilterSelect.options[i + 1]);
        }
    }
    var newPartsOfSpeech = htmlEntitiesParse(currentDictionary.settings.partsOfSpeech).trim().split(",");
    for (var j = 0; j < newPartsOfSpeech.length; j++) {
        var partOfSpeechOption = document.createElement('option');
        partOfSpeechOption.appendChild(document.createTextNode(newPartsOfSpeech[j].trim()));
        partOfSpeechOption.value = newPartsOfSpeech[j].trim();
        partsOfSpeechSelect.appendChild(partOfSpeechOption);
        
        var wordFilterOption = document.createElement('option');
        wordFilterOption.appendChild(document.createTextNode(newPartsOfSpeech[j].trim()));
        wordFilterOption.value = newPartsOfSpeech[j].trim();
        wordFilterSelect.appendChild(wordFilterOption);
    }
}

function HideSettings() {
    document.getElementById("settingsScreen").style.display = "none";
    document.getElementById("wordEntryForm").style.display = (currentDictionary.settings.isComplete) ? "none" : "block";
}

function EmptyWholeDictionary() {
    if (confirm("This will delete the entire current dictionary. If you do not have a backed up export, you will lose it forever!\n\nDo you still want to delete?")) {
        currentDictionary = JSON.parse(defaultDictionaryJSON);
        SaveAndUpdateDictionary(false);
        SetPartsOfSpeech();
        HideSettings();
    }
}

function SaveDictionary() {
    localStorage.setItem('dictionary', JSON.stringify(currentDictionary));
    //location.reload();
}

function LoadDictionary() {
    if (localStorage.getItem('dictionary')) {
        var tmpDictionary = JSON.parse(localStorage.getItem('dictionary'));
        if (tmpDictionary.words.length > 0) {
            currentDictionary = JSON.parse(localStorage.getItem('dictionary'));
        }
        tmpDictionary = null;
    }
    
    HideSettingsWhenComplete();
    
    ShowDictionary("");
    
    SetPartsOfSpeech();
    
    if (currentDictionary.settings.isComplete) {
        document.getElementById("wordEntryForm").style.display = "none";
    }
    
    // Update search snapshot
    //dictionarySearchSnapshot = Defiant.getSnapshot(currentDictionary);
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
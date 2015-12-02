function CloseUpdateConflictArea() {
    document.getElementById("updateConflict").style.display = "none";
}

function ClearForm() {
    document.getElementById("word").value = "";
    document.getElementById("pronunciation").value = "";
    document.getElementById("partOfSpeech").value = "";
    document.getElementById("simpleDefinition").value = "";
    document.getElementById("longDefinition").value = "";
    document.getElementById("editIndex").value = "";
    
    document.getElementById("newWordButtonArea").style.display = "block";
    document.getElementById("editWordButtonArea").style.display = "none";
    document.getElementById("errorMessage").innerHTML = "";
    document.getElementById("updateConflict").style.display = "none";
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

function ToggleSearchFilter() {
    var searchFilterToggle = document.getElementById("searchFilterToggle");
    var searchFilterArea = document.getElementById("searchFilterArea");
    
    if (searchFilterArea.style.display == "none") {
        searchFilterArea.style.display = "block";
        searchFilterToggle.innerHTML = "Hide Search/Filter Options";
    } else {
        searchFilterArea.style.display = "none";
        searchFilterToggle.innerHTML = "Search/Filter Options";
    }
}

function ShowInfo(text) {
    if (text == "terms") {
        document.getElementById("infoText").innerHTML = termsText;
    } else if (text == "privacy") {
        document.getElementById("infoText").innerHTML = privacyText;
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
    document.getElementById("dictionarySortByEquivalent").checked = currentDictionary.settings.sortByEquivalent;
    document.getElementById("dictionaryIsComplete").checked = currentDictionary.settings.isComplete;
    document.getElementById("numberOfWordsInDictionary").innerHTML = currentDictionary.words.length.toString();
}

function HideSettingsWhenComplete() {
    if (currentDictionary.settings.isComplete) {
        document.getElementById("hideIfComplete").style.display = "none";
    } else {
        document.getElementById("hideIfComplete").style.display = "block";
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

function NewWordNotification(word) {
    var notificationArea = document.getElementById("notificationArea");
    var notificationMessage = document.getElementById("notificationMessage");
    var wordId = currentDictionary.nextWordId - 1;
    notificationArea.style.display = "block";
    notificationMessage.innerHTML = "New Word Added: <a href='#" + wordId.toString() + "'>" + word + "</a>";
}

function FocusAfterAddingNewWord() {
    document.getElementById("word").focus();
}
var aboutText, termsText, privacyText, loginForm, createAccountForm;

window.onload = function () {
    LoadDictionary();
    ClearForm();
    LoadUserDictionaries();
    
    GetTextFile("README.md");
    GetTextFile("TERMS.md");
    GetTextFile("PRIVACY.md");
    GetTextFile("LOGIN.form");
}

function LoadUserDictionaries() {
    var getDictionariesRequest = new XMLHttpRequest();
    var userDictionariesSelect = document.getElementById("userDictionaries");
    if (userDictionariesSelect != null) {
        getDictionariesRequest.open('GET', "php/ajax_dictionarymanagement.php?action=getall");
        getDictionariesRequest.onreadystatechange = function() {
            if (getDictionariesRequest.readyState == 4 && getDictionariesRequest.status == 200) {
                ParseUserDictionariesIntoSelect(userDictionariesSelect, getDictionariesRequest.responseText);
            }
        }
        getDictionariesRequest.send();
    }
}

function ParseUserDictionariesIntoSelect(selectToPopulate, dicitonaryList) {
    if (selectToPopulate.options.length > 0) {
        for (var i = selectToPopulate.options.length - 1; i >= 0; i--) {
            selectToPopulate.removeChild(selectToPopulate.options[i]);
        }
    }
    
    var dictionaries = dicitonaryList.split("_DICTIONARYSEPARATOR_");
    for (var j = 0; j < dictionaries.length - 1; j++) {
        var dictionaryOption = document.createElement('option');
        var dictionaryValues = dictionaries[j].split("_IDNAMESEPARATOR_");
        dictionaryOption.appendChild(document.createTextNode(htmlEntitiesParse(dictionaryValues[1])));
        dictionaryOption.value = dictionaryValues[0];
        selectToPopulate.appendChild(dictionaryOption);
    }
    selectToPopulate.value = (currentDictionary.externalID > 0) ? currentDictionary.externalID : "";
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
            } else if (filename == "LOGIN.form") {
                loginForm = readmeFileRequest.responseText;
            } else {
                aboutText = markdown.toHTML(readmeFileRequest.responseText);
            }
        }
    }
    readmeFileRequest.send();
}

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
    var publicNameValue = document.getElementById("createAccountPublicNameField").value;
      
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
    } else if (publicNameValue == "") {
        errorMessage.innerHTML = "Public Name cannot be blank!";
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

function ExplainPublicName() {
    alert("This is the name we greet you with. It's also the name displayed if you ever decide to share any of your dictionaries.\n\nNote: this is not a username, and as such is not guaranteed to be unique. Use something people will recognize you as to differentiate from other people who might use the same name!");
}

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

function ShowInfo(text) {
    if (text == "terms") {
        document.getElementById("infoText").innerHTML = termsText;
    } else if (text == "privacy") {
        document.getElementById("infoText").innerHTML = privacyText;
    } else if (text == "login") {
        document.getElementById("infoText").innerHTML = loginForm;
        if (currentDictionary.words.length > 0 || currentDictionary.name != "New" || currentDictionary.description != "A new dictionary.") {
            document.getElementById("dictionaryWarn").innerHTML = "If your current dictionary is not already saved to your account, be sure to <span class='exportWarnText' onclick='ExportDictionary()'>export it before logging in</span> so you don't lose anything!";
        }
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
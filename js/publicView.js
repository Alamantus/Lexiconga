function IsValidPublicDicitonary() {
    return typeof publicDictionary !== 'string';
}

function ShowPublicDictionary() {
    if (IsValidPublicDicitonary()) {
        var filter = document.getElementById("wordFilter").value;
        
        var searchResults = [];
        var search = htmlEntitiesParseForSearchEntry(document.getElementById("searchBox").value);
        var searchByWord = document.getElementById("searchOptionWord").checked;
        var searchBySimple = document.getElementById("searchOptionSimple").checked;
        var searchByLong = document.getElementById("searchOptionLong").checked;
        var searchIgnoreCase = !document.getElementById("searchCaseSensitive").checked; //It's easier to negate case here instead of negating it every use since ignore case is default.
        var searchIgnoreDiacritics = document.getElementById("searchIgnoreDiacritics").checked;
        if (search != "" && (searchByWord || searchBySimple || searchByLong)) {
            var xpath = [];
            var searchDictionaryJSON = htmlEntitiesParseForSearch(JSON.stringify(publicDictionary));
            if (searchIgnoreCase) {
                search = search.toLowerCase();
                //searchDictionaryJSON = searchDictionaryJSON.toLowerCase();
            }
            if (searchIgnoreDiacritics) {
                search = removeDiacritics(search);
                searchDictionaryJSON = removeDiacritics(searchDictionaryJSON);
            }
            if (searchByWord) {
                xpath.push('contains('+ ((searchIgnoreCase) ? 'name' : 'translate(name, "", "")') +', "'+ search +'")');
            }
            if (searchBySimple) {
                xpath.push('contains('+ ((searchIgnoreCase) ? 'simpleDefinition' : 'translate(simpleDefinition, "", "")') +', "'+ search +'")');
            }
            if (searchByLong) {
                xpath.push('contains('+ ((searchIgnoreCase) ? 'longDefinition' : 'translate(longDefinition, "", "")') +', "'+ search +'")');
            }
            var searchDictionary = JSON.parse(searchDictionaryJSON);
            searchResults = JSON.search(searchDictionary, '//words['+ xpath.join(' or ') +']/wordId');
        }
        
        var dictionaryNameArea = document.getElementById("dictionaryName");
        dictionaryNameArea.innerHTML = htmlEntitiesParse(publicDictionary.name) + " Dictionary";

        var dictionaryByArea = document.getElementById("dictionaryBy");
        dictionaryByArea.innerHTML = "created by " + htmlEntitiesParse(publicDictionary.createdBy);

        var dictionaryIncompleteArea = document.getElementById("incompleteNotice");
        if (!publicDictionary.settings.isComplete) {
            dictionaryIncompleteArea.innerHTML = "<em>Note: This dictionary is not yet complete and is likely to change.</em>";
        }
        
        var dictionaryDescriptionArea = document.getElementById("dictionaryDescription");
        dictionaryDescriptionArea.innerHTML = marked(htmlEntitiesParse(publicDictionary.description));
        
        var dictionaryArea = document.getElementById("theDictionary");
        var dictionaryText = "";

        if (publicDictionary.words.length > 0) {
            for (var i = 0; i < publicDictionary.words.length; i++) {
                if (filter == "" || (filter != "" && publicDictionary.words[i].partOfSpeech == filter)) {
                    if (search == "" || (search != "" && (searchByWord || searchBySimple || searchByLong) && searchResults.indexOf(publicDictionary.words[i].wordId) >= 0)) {
                        if (!publicDictionary.words[i].hasOwnProperty("pronunciation")) {
                            publicDictionary.words[i].pronunciation = "";  //Account for new property
                        }
                        if (!publicDictionary.words[i].hasOwnProperty("wordId")) {
                            publicDictionary.words[i].wordId = i + 1;  //Account for new property
                        }
                        dictionaryText += PublicDictionaryEntry(i);
                    }
                }
            }
        } else {
            dictionaryText = "There are no entries in the dictionary."
        }
        dictionaryArea.innerHTML = dictionaryText;
    } else {
        document.getElementById("dictionaryContainer").innerHTML = publicDictionary;
    }
}

function PublicDictionaryEntry(itemIndex) {
    var entryText = "<entry><a name='" + publicDictionary.words[itemIndex].wordId + "'></a><a href='#" + publicDictionary.words[itemIndex].wordId + "' class='wordLink clickable'>&#x1f517;</a>";
    
    var searchTerm = document.getElementById("searchBox").value;
    var searchByWord = document.getElementById("searchOptionWord").checked;
    var searchBySimple = document.getElementById("searchOptionSimple").checked;
    var searchByLong = document.getElementById("searchOptionLong").checked;
    var searchIgnoreCase = !document.getElementById("searchCaseSensitive").checked; //It's easier to negate case here instead of negating it every use since ignore case is default.
    var searchIgnoreDiacritics = document.getElementById("searchIgnoreDiacritics").checked;
    
    var searchRegEx = new RegExp("(" + ((searchIgnoreDiacritics) ? removeDiacritics(searchTerm) + "|" + searchTerm : searchTerm) + ")", "g" + ((searchIgnoreCase) ? "i" : ""));

    entryText += "<word>";

    if (searchTerm != "" && searchByWord) {
        entryText += htmlEntitiesParse(publicDictionary.words[itemIndex].name).replace(searchRegEx, "<searchTerm>$1</searchterm>");
    } else {
        entryText += publicDictionary.words[itemIndex].name;
    }
    
    entryText += "</word>";
    
    if (publicDictionary.words[itemIndex].pronunciation != "") {
        entryText += "<pronunciation>";
        entryText += marked(htmlEntitiesParse(publicDictionary.words[itemIndex].pronunciation)).replace("<p>","").replace("</p>","");
        entryText += "</pronunciation>";
    }
    
    if (publicDictionary.words[itemIndex].partOfSpeech != "") {
        entryText += "<partofspeech>";
        entryText += publicDictionary.words[itemIndex].partOfSpeech;
        entryText += "</partofspeech>";
    }

    entryText += "<br>";

    if (publicDictionary.words[itemIndex].simpleDefinition != "") {
        entryText += "<simpledefinition>";
        
        if (searchTerm != "" && searchBySimple) {
            entryText += htmlEntitiesParse(publicDictionary.words[itemIndex].simpleDefinition).replace(searchRegEx, "<searchTerm>$1</searchterm>");
        } else {
            entryText += publicDictionary.words[itemIndex].simpleDefinition;
        }

        entryText += "</simpledefinition>";
    }

    if (publicDictionary.words[itemIndex].longDefinition != "") {
        entryText += "<longdefinition>";

        if (searchTerm != "" && searchByLong) {
            entryText += marked(htmlEntitiesParse(publicDictionary.words[itemIndex].longDefinition).replace(searchRegEx, "<searchTerm>$1</searchterm>"));
        } else {
            entryText += marked(htmlEntitiesParse(publicDictionary.words[itemIndex].longDefinition));
        }

        entryText += "</longdefinition>";
    }

    entryText += "</entry>";

    return entryText;
}

function SetPublicPartsOfSpeech () {
    var wordFilterSelect = document.getElementById("wordFilter");

    var newPartsOfSpeech = htmlEntitiesParse(publicDictionary.settings.partsOfSpeech).trim().split(",");
    for (var j = 0; j < newPartsOfSpeech.length; j++) {
        var wordFilterOption = document.createElement('option');
        wordFilterOption.appendChild(document.createTextNode(newPartsOfSpeech[j].trim()));
        wordFilterOption.value = newPartsOfSpeech[j].trim();
        wordFilterSelect.appendChild(wordFilterOption);
    }
}
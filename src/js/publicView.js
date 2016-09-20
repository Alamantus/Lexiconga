function IsValidPublicDicitonary() {
    return typeof publicDictionary !== 'string';
}

function ShowPublicDictionary(ignoreFilters) {
    ignoreFilters = (typeof ignoreFilters !== 'undefined') ? ignoreFilters : false;

    if (IsValidPublicDicitonary()) {
        var filters = (ignoreFilters) ? [] : GetSelectedFilters();
        
        var searchResults = [];
        var search = (ignoreFilters) ? "" : htmlEntitiesParseForSearchEntry(document.getElementById("searchBox").value);
        var searchByWord = (ignoreFilters) ? null : document.getElementById("searchOptionWord").checked;
        var searchBySimple = (ignoreFilters) ? null : document.getElementById("searchOptionSimple").checked;
        var searchByLong = (ignoreFilters) ? null : document.getElementById("searchOptionLong").checked;
        var searchIgnoreCase = (ignoreFilters) ? null : !document.getElementById("searchCaseSensitive").checked; //It's easier to negate case here instead of negating it every use since ignore case is default.
        var searchIgnoreDiacritics = (ignoreFilters) ? null : document.getElementById("searchIgnoreDiacritics").checked;
        if (!ignoreFilters && search != "" && (searchByWord || searchBySimple || searchByLong)) {
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
        dictionaryNameArea.innerHTML = publicDictionary.name + " Dictionary";

        var dictionaryByArea = document.getElementById("dictionaryBy");
        dictionaryByArea.innerHTML = "created by " + publicDictionary.createdBy;

        var dictionaryIncompleteArea = document.getElementById("incompleteNotice");
        if (!publicDictionary.settings.isComplete) {
            dictionaryIncompleteArea.innerHTML = "<em>Note: This dictionary is not yet complete and is likely to change.</em>";
        }
        
        var dictionaryDescriptionArea = document.getElementById("dictionaryDescription");
        dictionaryDescriptionArea.innerHTML = marked(htmlEntitiesParseForMarkdown(publicDictionary.description));
        
        var dictionaryArea = document.getElementById("theDictionary");
        var dictionaryText = "";
        var numberOfWordsDisplayed = 0;

        if (publicDictionary.words.length > 0) {
            for (var i = 0; i < publicDictionary.words.length; i++) {
                if (filters.length == 0 || (filters.length > 0 && filters.indexOf(publicDictionary.words[i].partOfSpeech) > -1)) {
                    if (search == "" || (search != "" && (searchByWord || searchBySimple || searchByLong) && searchResults.indexOf(publicDictionary.words[i].wordId) >= 0)) {
                        if (!publicDictionary.words[i].hasOwnProperty("pronunciation")) {
                            publicDictionary.words[i].pronunciation = "";  //Account for new property
                        }
                        if (!publicDictionary.words[i].hasOwnProperty("wordId")) {
                            publicDictionary.words[i].wordId = i + 1;  //Account for new property
                        }
                        dictionaryText += PublicDictionaryEntry(i, ignoreFilters);
                        numberOfWordsDisplayed++;
                    }
                }
            }
        } else {
            dictionaryText = "There are no entries in the dictionary."
        }
        dictionaryArea.innerHTML = dictionaryText;
        if (!ignoreFilters) {
            ShowFilterWordCount(numberOfWordsDisplayed);
        }
    } else {
        document.getElementById("dictionaryContent").innerHTML = publicDictionary;
    }
}

function PublicDictionaryEntry(itemIndex, ignoreFilters) {
    var searchTerm = (ignoreFilters) ? "" : regexParseForSearch(document.getElementById("searchBox").value);
    var searchByWord = (ignoreFilters) ? false : document.getElementById("searchOptionWord").checked;
    var searchBySimple = (ignoreFilters) ? false : document.getElementById("searchOptionSimple").checked;
    var searchByLong = (ignoreFilters) ? false : document.getElementById("searchOptionLong").checked;
    var searchIgnoreCase = (ignoreFilters) ? false : !document.getElementById("searchCaseSensitive").checked; //It's easier to negate case here instead of negating it every use since ignore case is default.
    var searchIgnoreDiacritics = (ignoreFilters) ? false : document.getElementById("searchIgnoreDiacritics").checked;
    
    var searchRegEx = new RegExp("(" + ((searchIgnoreDiacritics) ? removeDiacritics(searchTerm) + "|" + searchTerm : searchTerm) + ")", "g" + ((searchIgnoreCase) ? "i" : ""));

    var wordName = wordPronunciation = wordPartOfSpeech = wordSimpleDefinition = wordLongDefinition = "";

    if (searchTerm != "" && searchByWord) {
        wordName += htmlEntities(htmlEntitiesParse(publicDictionary.words[itemIndex].name).replace(searchRegEx, "<searchterm>$1</searchterm>")).replace(/&lt;(\/?)searchterm&gt;/g, '<$1searchterm>');
    } else {
        wordName += publicDictionary.words[itemIndex].name.toString(); // Use toString() to prevent using a reference instead of the value.
    }
    
    if (publicDictionary.words[itemIndex].pronunciation != "") {
        wordPronunciation += marked(htmlEntitiesParseForMarkdown(publicDictionary.words[itemIndex].pronunciation)).replace(/<\/?p>/g,"");
    }
    
    if (publicDictionary.words[itemIndex].partOfSpeech != " " && publicDictionary.words[itemIndex].partOfSpeech != "") {
        wordPartOfSpeech += publicDictionary.words[itemIndex].partOfSpeech.toString();
    }

    if (publicDictionary.words[itemIndex].simpleDefinition != "") {        
        if (searchTerm != "" && searchBySimple) {
            wordSimpleDefinition += htmlEntities(htmlEntitiesParse(publicDictionary.words[itemIndex].simpleDefinition).replace(searchRegEx, "<searchterm>$1</searchterm>")).replace(/&lt;(\/?)searchterm&gt;/g, '<$1searchterm>');
        } else {
            wordSimpleDefinition += publicDictionary.words[itemIndex].simpleDefinition.toString();
        }
    }

    if (publicDictionary.words[itemIndex].longDefinition != "") {
        if (searchTerm != "" && searchByLong) {
            wordLongDefinition += marked(htmlEntitiesParseForMarkdown(htmlEntities(htmlEntitiesParse(publicDictionary.words[itemIndex].longDefinition).replace(searchRegEx, "<searchterm>$1</searchterm>")))).replace(/&lt;(\/?)searchterm&gt\;/g, '<$1searchterm>');
        } else {
            wordLongDefinition += marked(htmlEntitiesParseForMarkdown(publicDictionary.words[itemIndex].longDefinition));
        }
    }

    return PublicDictionaryEntryTemplate({
        name : wordName,
        pronunciation : wordPronunciation,
        partOfSpeech : wordPartOfSpeech,
        simpleDefinition : wordSimpleDefinition,
        longDefinition : wordLongDefinition,
        wordId : publicDictionary.words[itemIndex].wordId.toString()
    }, false);
}

function PublicDictionaryEntryTemplate(wordObject, managementIndex) {
    managementIndex = (typeof managementIndex !== 'undefined') ? managementIndex : false;
    var entryText = "<entry id='entry";
    if (managementIndex !== false) {
        // If there's a managementIndex, append index number to the element id.
        entryText += managementIndex.toString();
    }
    entryText += "'><a href='/" + publicDictionary.id + "/" + wordObject.wordId + "' class='wordLink clickable' title='Share Word'>&#10150;</a>";
    
    entryText += "<word>" + wordObject.name + "</word>";
    
    if (wordObject.pronunciation != "") {
        entryText += "<pronunciation>" + wordObject.pronunciation + "</pronunciation>";
    }
    
    if (wordObject.partOfSpeech != "") {
        entryText += "<partofspeech>" + wordObject.partOfSpeech + "</partofspeech>";
    }

    entryText += "<br>";

    if (wordObject.simpleDefinition != "") {
        entryText += "<simpledefinition>" + wordObject.simpleDefinition + "</simpledefinition>";
    }

    if (wordObject.longDefinition != "") {
        entryText += "<longdefinition>" + wordObject.longDefinition + "</longdefinition>";
    }

    if (managementIndex !== false) {
        entryText += ManagementArea(managementIndex);
    }

    entryText += "</entry>";

    return entryText;
}

function SetPublicPartsOfSpeech () {
    var wordFilterOptions = document.getElementById("filterOptions");

    var newPartsOfSpeech = htmlEntitiesParse(publicDictionary.settings.partsOfSpeech).trim().split(",");
    for (var j = 0; j < newPartsOfSpeech.length; j++) {
        var thePartOfSpeech = newPartsOfSpeech[j].trim();

        var wordFilterLabel = document.createElement('label');
        wordFilterLabel.appendChild(document.createTextNode(thePartOfSpeech + " "));
        wordFilterLabel['part-of-speech'] = thePartOfSpeech;
        wordFilterLabel.className = 'filterOption';
        var wordFilterCheckbox = document.createElement('input');
        wordFilterCheckbox.type = 'checkbox';
        wordFilterCheckbox.onchange = function(){ShowPublicDictionary()};
        wordFilterLabel.appendChild(wordFilterCheckbox);
        wordFilterOptions.appendChild(wordFilterLabel);
    }
}
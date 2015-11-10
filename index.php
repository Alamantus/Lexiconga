<?php
$notificationMessage = get_include_contents('notification.php');

if ($_GET['adminoverride'] == 'dictionarytotext') {
    echo '<script>document.write(localStorage.getItem("dictionary"));</script>';
} else {
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    
    <title>Lexiconga Dictionary Builder</title>

    <link href="css/styles.css" rel="stylesheet" />
    <link href="css/lexiconga.css" rel="stylesheet" />
</head>
<body>
    <header>
        <div id="headerPadder">
            <a href="/" id="siteLogo">Lexiconga Dictionary Builder</a>
            <div style="float:right;margin: 16px 8px;font-size:12px;">
                <span id="aboutButton" class="clickable" onclick="ShowInfo('about')">About Lexiconga</span>
            </div>
        </div>
    </header>
    <contents>
    <div id="notificationArea" style="display:<?php echo (($notificationMessage) ? "block" : "none"); ?>;">
        <span id="notificationCloseButton" class="clickable" onclick="document.getElementById('notificationArea').style.display='none';">Close</span>
        <div id="notificationMessage"><?php echo $notificationMessage; ?></div>
    </div>
    <div id="leftColumn">
    <form id="wordEntryForm">
        <label><span>Word</span>
            <input type="text" id="word" />
        </label>
        <label><span>Pronunciation <a class="helperlink" href="./ipa_character_picker/" target="_blank" title="IPA Character Picker backed up from http://r12a.github.io/pickers/ipa/">IPA Characters</a></span>
            <input type="text" id="pronunciation" />
        </label>
        <label><span>Part of Speech</span>
            <select id="partOfSpeech"></select>
        </label>
        <label><span>Equivalent Word(s)</span>
            <input type="text" id="simpleDefinition" />
        </label>
        <label><span>Explanation/Long Definition</span>
            <textarea id="longDefinition"></textarea>
        </label>
        <input type="hidden" id="editIndex" />
        <span id="errorMessage"></span>
        <div id="newWordButtonArea" style="display: block;">
            <button type="button" onclick="AddWord(); return false;">Add Word</button>
        </div>
        <div id="editWordButtonArea" style="display: none;">
            <button type="button" onclick="AddWord(); return false;">Edit Word</button> <button type="button" onclick="ClearForm(); window.scroll(savedScroll.x, savedScroll.y); return false;">Cancel</button>
        </div>
        <div id="updateConflict" style="display: none;"></div>
    </form>
    
    </div>

    <div id="dictionaryContainer">
        <span id="settingsButton" class="clickable" onclick="ShowSettings()">Settings</span>
        
        <h1 id="dictionaryName"></h1>
        
        <span id="descriptionToggle" class="clickable" onclick="ToggleDescription();">Show Description</span>
        <div id="dictionaryDescription" style="display:none;"></div>
        
        <div id="searchArea" style="display:block;">
            <label style="margin-top:10px;">
                <span>Search</span>
                <div style="display:block;">
                    <input type="text" id="searchBox" onclick="this.select();" onchange="ShowDictionary()" style="display:inline;" />&nbsp;
                    <span style="display:inline;cursor:pointer;font-size:10px;font-weight:bold;" onclick="document.getElementById('searchBox').value='';ShowDictionary();">Clear Search</span>
                </div>
                <div id="searchOptions" style="font-size:12px;">
                    <label style="display:inline;margin:0;">Word <input type="checkbox" id="searchOptionWord" checked="checked" onchange="ShowDictionary()" /></label>&nbsp;&nbsp;
                    <label style="display:inline;margin:0;">Equivalent <input type="checkbox" id="searchOptionSimple" checked="checked" onchange="ShowDictionary()" /></label>&nbsp;&nbsp;
                    <label style="display:inline;margin:0;">Explanation <input type="checkbox" id="searchOptionLong" checked="checked" onchange="ShowDictionary()" /></label>
                </div>
            </label>
        </div>
        
        <label style="display:block;"><b>Filter Words </b><select id="wordFilter" onchange="ShowDictionary()">
            <option value="">All</option>
        </select>
        </label>
            
        <div id="theDictionary"></div>
    </div>
    
    <div id="rightColumn" class="googleads" style="float:right;width:20%;max-width:300px;min-width:200px;overflow:hidden;">
        <?php if ($_GET['adminoverride'] != "noadsortracking") { include_once("php/google/adsense.php"); } ?>
    </div>

    <div id="settingsScreen" style="display:none;">
        <div id="settingsBackgroundFade" onclick="HideSettings()"></div>
        <div id="settingsOptions">
            <span id="settingsScreenCloseButton" class="clickable" onclick="HideSettings()">Close</span>
            <h2>Dictionary Settings</h2>
            <form id="settingsForm">
                <div class="settingsCol">
                    <div id="hideIfComplete">
                    <label>
                        <span>Dictionary Name</span>
                        <input type="text" id="dictionaryNameEdit" />
                    </label>
                    <label><span>Dictionary Description/Rules</span>
                        <textarea id="dictionaryDescriptionEdit"></textarea>
                    </label>
                    <label>
                        <span>Parts of Speech</span>
                        <input type="text" id="dictionaryPartsOfSpeechEdit" />
                    </label>
                    <label>
                        <span class="checkboxlabel">Allow Duplicates</span>
                        <input type="checkbox" id="dictionaryAllowDuplicates" onchange="ToggleCaseSensitiveOption()" />
                        <label>
                            <span class="checkboxlabel">Case-Sensitive</span>
                            <input type="checkbox" id="dictionaryCaseSensitive" />
                        </label>
                    </label>
                    <label class="inline">
                        <span class="checkboxlabel">Sort by Equivalent Word</span>
                        <input type="checkbox" id="dictionarySortByEquivalent" />
                    </label> <span class="helperlink clickable" onclick='alert("By default, your dictionary is organized alphabetically by word. Checking this box will organize it by the \"Equivalent Word\" field instead");'>?</span>
                    </div>
                    <br>
                    <label>
                        <span class="checkboxlabel">Dictionary is Complete</span>
                        <input type="checkbox" id="dictionaryIsComplete" />
                    </label>
                </div>
                <div class="settingsCol">
                    <label>
                        <b>Total Entries:</b> <i id="numberOfWordsInDictionary"></i>
                    </label>
                    <label><button type="button" onclick="ExportDictionary()" style="cursor:pointer;">Export Current Dictionary</button></label>
                    <label>
                        <span>Import Dictionary</span>
                        <input type="file" id="importFile" />
                        <button type="button" onclick="ImportDictionary(); return false;">Import</button>
                    </label>
                    <label><button type="button" onclick="EmptyWholeDictionary()" style="cursor:pointer;">Empty Current Dictionary</button></label>
                </div>
                <div id="settingsSaveButtons">
                    <span id="settingsErrorMessage"></span><br>
                    <button type="button" onclick="SaveSettings(); HideSettings(); return false;">Save and Close</button>
                    <button type="button" onclick="SaveSettings(); return false;">Save</button>
                </div>
            </form>
        </div>
    </div>
    
    <div id="infoScreen" style="display:none;">
        <div id="infoBackgroundFade" onclick="HideInfo()"></div>
        <div id="infoPage">
            <span id="infoScreenCloseButton" class="clickable" onclick="HideInfo()">Close</span>
            <div id="infoText"></div>
        </div>
    </div>
    </contents>
    <footer>
        Dictionary Builder only guaranteed to work with most up-to-date HTML5 browsers. <a href="https://github.com/Alamantus/DictionaryBuilder/issues" target="_blank">Report a Problem</a> | <span class="clickable" onclick="ShowInfo('terms')" style="font-size:12px;">Terms</span> <span class="clickable" onclick="ShowInfo('privacy')" style="font-size:12px;">Privacy</span>
    </footer>
    
    <!-- Markdown Parser -->
    <script src="js/markdown-js/markdown.min.js"></script>
    <!-- JSON Search -->
    <script src="js/defiant-js/defiant-latest.min.js"></script>
    <!-- Main Script -->
    <script src="js/dictionaryBuilder.js"></script>
    <script src="js/ui.js"></script>
    <?php if ($_GET['adminoverride'] != "noadsortracking") { include_once("php/google/analytics.php"); } ?>
</body>
</html>
<?php
}

function get_include_contents($filename) {
    if (is_file($filename)) {
        ob_start();
        include $filename;
        return ob_get_clean();
    }
    return false;
}
?>
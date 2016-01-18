<?php
require_once('required.php');

session_start();
$current_user = isset($_SESSION['user']) ? $_SESSION['user'] : 0;

$announcement = get_include_contents(SITE_LOCATION . '/announcement.php');
$notificationMessage = "";

if ($current_user > 0 || !isset($_SESSION['loginfailures']) || (isset($_SESSION['loginlockouttime']) && time() - $_SESSION['loginlockouttime'] >= 3600)) {
    // If logged in, never failed, or more than 1 hour has passed, reset login failures.
    $_SESSION['loginfailures'] = 0;
} else {
    $alertlockoutmessage = "You failed logging in 10 times. To prevent request flooding and hacking attempts, you may not log in or create an account for 1 hour.\\n\\nThe last time this page was loaded, you had been locked out for " . time_elapsed(time() - $_SESSION['loginlockouttime']) . "\\n\\nRefresh the page once the hour has passed.";
    $hoverlockoutmessage = str_replace("\\n", "\n", $alertlockoutmessage);
}

require_once(SITE_LOCATION . '/php/notificationconditiontree.php');

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
            <a href="./" id="siteLogo">Lexiconga Dictionary Builder</a>
            <div style="float:right;margin: 16px 8px;font-size:12px;">
                <span id="aboutButton" class="clickable" onclick="ShowInfo('aboutText')">About Lexiconga</span>
            </div>
            <div id="loginoutArea" style="font-size:12px;">
                <?php if ($current_user > 0) {  //If logged in, show the log out button. ?>
                    <span id="accountSettings" class="clickable" onclick="ShowAccountSettings()">Account Settings</span> <a href="?logout" id="logoutLink" class="clickable">Log Out</a>
                <?php } elseif (!isset($_SESSION['loginfailures']) || (isset($_SESSION['loginfailures']) && $_SESSION['loginfailures'] < 10)) { ?>
                    <span id="loginLink" class="clickable" onclick="ShowInfo('loginForm')">Log In/Create Account</span>
                <?php } else { ?>
                    <span id="loginLink" class="clickable" title="<?php echo $hoverlockoutmessage; ?>" onclick="alert('<?php echo $alertlockoutmessage; ?>');">Can't Login</span>
                <?php } ?>
            </div>
        </div>
    </header>
    <contents>
    <div id="announcementArea" style="display:<?php echo (($announcement) ? "block" : "none"); ?>;margin-bottom:10px;">
        <span id="announcementCloseButton" class="clickable" onclick="document.getElementById('announcementArea').style.display='none';">Close</span>
        <div id="announcement"><?php echo $announcement; ?></div>
    </div>
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
        
        <span id="searchFilterToggle" class="clickable" onclick="ToggleSearchFilter();">Search/Filter Options</span>
        <div id="searchFilterArea" style="display:none;">
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
                        <br />
                        <label style="display:inline;margin:0;">Search Case-Sensitive <input type="checkbox" id="searchCaseSensitive" onchange="ShowDictionary()" /></label>
                        <label style="display:inline;margin:0;" title="Note: Matching diacritics will appear but may not highlight.">Ignore Diacritics/Accents <input type="checkbox" id="searchIgnoreDiacritics" onchange="ShowDictionary()" /></label>
                    </div>
                </label>
            </div>
            
            <label style="display:block;"><b>Filter Words </b><select id="wordFilter" onchange="ShowDictionary()">
                <option value="">All</option>
            </select>
            </label>
        </div>
        <div id="filterWordCount"></div>
            
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
                    <?php if ($current_user > 0) {  //If logged in, show the log out button. ?>
                        <label class="inline">
                            <span class="checkboxlabel">Dictionary is Public</span>
                            <input type="checkbox" id="dictionaryIsPublic" onchange="TogglePublicLink()" />
                        </label> <span class="helperlink clickable" onclick='alert("If you save your settings with this checked, your dictionary will be viewable by anyone if they have the public link.");'>?</span>
                        <div id="publicLink"></div>
                    <?php } ?>
                </div>
                <div class="settingsCol">
                    <label>
                        <b>Total Entries:</b> <i id="numberOfWordsInDictionary"></i>
                    </label>
                    <label><button type="button" onclick="ExportDictionary()" style="cursor:pointer;">Export Current Dictionary</button></label>
                    <?php if ($current_user > 0) {  //If logged in, show the special options. ?>
                        <label><span>Change Dictionaries</span>
                            <select id="userDictionaries" onchange="ChangeDictionary();"></select>
                        </label>
                        <label><button type="button" onclick="CreateNewDictionary()" style="cursor:pointer;">Create a New Dictionary</button></label>
                    <?php } ?>
                    <label>
                        <span>Import Dictionary</span>
                        <input type="file" id="importFile" />
                        <button type="button" onclick="ImportDictionary(); return false;">Import</button>
                    </label>
                    <?php if ($current_user > 0) {  //If logged in, show the log out button. ?>
                        <label><button type="button" onclick="DeleteCurrentDictionary()" style="cursor:pointer;">Delete Current Dictionary</button></label>
                    <?php } else {  //If logged in, show the log out button. ?>
                        <label><button type="button" onclick="EmptyWholeDictionary()" style="cursor:pointer;">Empty Current Dictionary</button></label>
                    <?php } ?>
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

    <?php if ($current_user > 0) {
        $user_email = Get_User_Email($current_user);
    ?>
    <div id="accountSettingsScreen" style="display:none;">
        <div id="accountSettingsBackgroundFade" onclick="HideAccountSettings()"></div>
        <div id="accountSettingsPage">
            <span id="accountSettingsScreenCloseButton" class="clickable" onclick="HideAccountSettings()">Close</span>
            <div class="settingsCol"><form id="accountSettingsForm" method="post" action="?accountsettings">
                <h2>Account Settings</h2>
                <label><span>Email</span>
                    <input type="email" id="accountSettingsEmailField" name="email" value="<?php echo $user_email; ?>" onchange="WarnEmailChange()" />
                    <input type="hidden" id="accountSettingsPreviousEmailField" name="previousemail" value="<?php echo $user_email; ?>" />
                </label>
                <div id="accountSettingsEmailChangeWarning" style="display:none;font-weight:bold;color:#dd5500;font-size:11px;margin-bottom:10px;">If you change your email address, please note that you will no longer be able to log in with your old email address, <?php echo $user_email; ?>.<br>Change it back unless you are completely sure that you want to change your email address!</div>
                <label><span>Public Name <span class="clickable" onclick="ExplainPublicName()" style="font-size:11px;vertical-align:top;background:#e0c19c;padding:4px 7px;">?</span></span>
                    <input type="text" id="accountSettingsPublicNameField" name="publicname" value="<?php echo Get_Public_Name_By_Id($current_user); ?>" />
                </label>
                <label style="display:inline;"><b>Allow Emails</b>
			        <input type="checkbox" id="createAccountAllowEmailsField" name="allowemails" checked="checked" />
			    </label> <span class="clickable" onclick="ExplainAllowEmails()" style="font-size:11px;vertical-align:top;background:#e0c19c;padding:4px 7px;">?</span>
                <div id="accountSettingsError" style="font-weight:bold;color:red;"></div>
                <button type="submit" id="accountSettingsSubmitButton" onclick="ValidateAccountSettings(); return false;">Save Settings</button>
                <br><br>
                <h2>Reset Your Password</h2>
                <p style="font-size: 12px;">Click the button below to reload the page and show the Reset Password form. Filling out this form will instantly change your password, and you will need to log in using the new password from that point forward.</p>
                <span id="resetPassword" class="clickable" onclick="this.innerHTML='Loading...';LoggedInResetPassword();" style="margin-top:20px;">Reset Password</span>
            </form></div>
        </div>
    </div>
    <?php
        }
    ?>

    <div id="loadAfterDeleteScreen" style="display:none;">
        <div id="loadAfterDeleteFade"></div>
        <div id="loadAfterDeletePage">
            <div class="settingsCol">
                <h1>Dictionary Deleted</h1>
                <label>Select dictionary to load:<br />
                    <select id="loadAfterDelete" onchange="ChangeDictionary(this);document.getElementById('loadAfterDeleteScreen').style.display = 'none';"></select>
                </label>
                <p>Or</p>
                <label><button type="button" onclick="CreateNewDictionary();document.getElementById('loadAfterDeleteScreen').style.display = 'none';" style="cursor:pointer;">Create a New Dictionary</button></label>
            </div>
        </div>
    </div>

    </contents>
    <footer>
        Dictionary Builder only guaranteed to work with most up-to-date HTML5 browsers. <a href="https://github.com/Alamantus/DictionaryBuilder/issues" target="_blank">Report a Problem</a> | <span class="clickable" onclick="ShowInfo('termsText')" style="font-size:12px;">Terms</span> <span class="clickable" onclick="ShowInfo('privacyText')" style="font-size:12px;">Privacy</span>
    </footer>
    
    <!-- Markdown Parser -->
    <script src="js/marked.js"></script>
    <!-- JSON Search -->
    <script src="js/defiant-js/defiant-latest.js"></script>
    <!-- Diacritics Removal for Exports -->
    <script src="js/removeDiacritics.js"></script>
    <!-- Main Script -->
    <script src="js/dictionaryBuilder.js"></script>
    <script src="js/ui.js"></script>
    <?php if ($_GET['adminoverride'] != "noadsortracking") { include_once("php/google/analytics.php"); } ?>
    <script>
    var aboutText = termsText = privacyText = loginForm = forgotForm = "Loading...";
    window.onload = function () {
        LoadDictionary();
        ClearForm();
        LoadUserDictionaries();
        
        GetTextFile("README.md", "aboutText", true);
        GetTextFile("TERMS.md", "termsText", true);
        GetTextFile("PRIVACY.md", "privacyText", true);
        GetTextFile("LOGIN.form", "loginForm", false);
        GetTextFile("FORGOT.form", "forgotForm", false);
    }
    </script>
</body>
</html>
<?php

function get_include_contents($filename) {
    if (is_file($filename)) {
        ob_start();
        include $filename;
        return ob_get_clean();
    }
    return false;
}
?>
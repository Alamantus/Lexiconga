<?php
require_once('required.php');

session_start();
$current_user = isset($_SESSION['user']) ? $_SESSION['user'] : 0;

$dictionary_to_load = (isset($_GET['dict'])) ? intval($_GET['dict']) : 0;
$the_public_dictionary = '"That dictionary doesn\'t exist."';
$dictionary_name = 'ERROR';
$dictionary_creator = 'nobody';
$is_viewing = $dictionary_to_load > 0;

$word_to_load = (isset($_GET['word'])) ? intval($_GET['word']) : 0;
$the_public_word = '"That word doesn\'t exist."';
$word_name = 'ERROR';

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

if ($is_viewing) {
    $query = "SELECT `d`.`id`, `d`.`name`, `d`.`description`, `u`.`public_name`, `d`.`words`, `d`.`parts_of_speech`, `d`.`is_complete` ";
    $query .= "FROM `dictionaries` AS `d` LEFT JOIN `users` AS `u` ON `d`.`user`=`u`.`id` WHERE `d`.`is_public`=1 AND `d`.`id`=" . $dictionary_to_load . ";";

    $dbconnection = new PDO('mysql:host=' . DATABASE_SERVERNAME . ';dbname=' . DATABASE_NAME . ';charset=utf8', DATABASE_USERNAME, DATABASE_PASSWORD);
    $dbconnection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $dbconnection->setAttribute(PDO::ATTR_EMULATE_PREPARES, true);
    $dbconnection->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    try {
        $queryResults = $dbconnection->prepare($query);
        $queryResults->execute();
        if ($queryResults) {
            if (num_rows($queryResults) === 1) {
                while ($dict = fetch($queryResults)) {
                    $dictionary_name = $dict['name'];
                    $dictionary_creator = $dict['public_name'];
                    $the_public_dictionary = '{"name":"' . $dict['name'] . '",';
                    $the_public_dictionary .= '"description":"' . $dict['description'] . '",';
                    $the_public_dictionary .= '"createdBy":"' . $dict['public_name'] . '",';
                    $the_public_dictionary .= '"words":' . $dict['words'] . ',';
                    $the_public_dictionary .= '"settings":{';
                    $the_public_dictionary .= '"partsOfSpeech":"' . $dict['parts_of_speech'] . '",';
                    $the_public_dictionary .= '"isComplete":' . (($dict['is_complete'] == 1) ? 'true' : 'false') . '},';
                    $the_public_dictionary .= '}';
                }
            }
        }
    }
    catch (PDOException $ex) {}
}

?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    
    <?php if ($is_viewing) { ?>
        <title><?php echo $dictionary_name; ?> Dictionary on Lexiconga</title>
        <meta property="og:url" content="http://lexicon.ga/view/?dict=<?php echo $dictionary_to_load; ?>" />
        <meta property="og:type" content="article" />
        <meta property="og:title" content="<?php echo $dictionary_name; ?> Dictionary" />
        <meta property="og:description" content="A Lexiconga dictionary by <?php echo $dictionary_creator; ?>" />
        <meta property="og:image" content="http://lexicon.ga/images/logo.svg" />
        <script>var publicDictionary = <?php echo $the_public_dictionary; ?></script>
    <?php } else { ?>
        <title>Lexiconga Dictionary Builder</title>
    <?php } ?>

    <link href="css/styles.css" rel="stylesheet" />
    <link href="css/lexiconga.css" rel="stylesheet" />
</head>
<body>
    <header>
        <div id="headerPadder">
            <a href="/" id="siteLogo">Lexiconga Dictionary Builder</a>
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
    <?php if (!$is_viewing) { ?>
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
            <div id="formLockButton" class="clickable" onclick="ToggleWordFormLock()" title="Lock/unlock form from the top of the page">&#128274;</div>
            <label><span>Word</span>
                <input type="text" id="word" onkeydown="SubmitWordOnCtrlEnter(this)" />
            </label>
            <label><span>Pronunciation <a class="clickable inline-button" href="/ipa_character_picker/" target="_blank" title="IPA Character Picker backed up from http://r12a.github.io/pickers/ipa/">IPA Characters</a></span>
                <input type="text" id="pronunciation" onkeydown="SubmitWordOnCtrlEnter(this)" />
            </label>
            <label><span>Part of Speech</span>
                <select id="partOfSpeech" onkeydown="SubmitWordOnCtrlEnter(this)"></select>
            </label>
            <label><span>Equivalent Word(s)</span>
                <input type="text" id="simpleDefinition" onkeydown="SubmitWordOnCtrlEnter(this)" />
            </label>
            <label><span>Explanation/Long Definition <span id="showFullScreenTextbox" class="clickable inline-button" onclick="ShowFullScreenTextbox('longDefinition', 'Explanation/Long Definition')">Maximize</span></span>
                <textarea id="longDefinition" onkeydown="SubmitWordOnCtrlEnter(this)"></textarea>
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
    <?php } ?>

    <div id="dictionaryContainer">
        <?php if (!$is_viewing) { ?>
        <span id="settingsButton" class="clickable" onclick="ShowSettings()">Settings</span>
        <?php } ?>
        <h1 id="dictionaryName"></h1>

        <?php if ($is_viewing) { ?>
        <h4 id="dictionaryBy"></h4>
        <div id="incompleteNotice"></div>
        <?php } ?>
        
        <span id="descriptionToggle" class="clickable" onclick="ToggleDescription();"><?php if ($is_viewing) { ?>Hide<?php } else { ?>Show<?php } ?> Description</span>
        <div id="dictionaryDescription" style="display:<?php if ($is_viewing) { ?>block<?php } else { ?>none<?php } ?>;"></div>
        
        <span id="searchFilterToggle" class="clickable" onclick="ToggleSearchFilter();"><?php if ($is_viewing) { ?>Hide <?php } ?>Search/Filter Options</span>
        <div id="searchFilterArea" style="display:<?php if ($is_viewing) { ?>block<?php } else { ?>none<?php } ?>;">
            <div id="searchArea" style="display:block;">
                <label style="margin-top:10px;">
                    <span>Search</span>
                    <div style="display:block;">
                        <input type="text" id="searchBox" onclick="this.select();" onchange="<?php Show_Dictionary_Function($is_viewing) ?>" style="display:inline;" />&nbsp;
                        <span class="clickable inline-button" onclick="document.getElementById('searchBox').value='';<?php Show_Dictionary_Function($is_viewing) ?>;">Clear Search</span>
                    </div>
                    <div id="searchOptions">
                        <label class="searchOption">Word <input type="checkbox" id="searchOptionWord" checked="checked" onchange="<?php Show_Dictionary_Function($is_viewing) ?>" /></label>
                        <label class="searchOption">Equivalent <input type="checkbox" id="searchOptionSimple" checked="checked" onchange="<?php Show_Dictionary_Function($is_viewing) ?>" /></label>
                        <label class="searchOption">Explanation <input type="checkbox" id="searchOptionLong" checked="checked" onchange="<?php Show_Dictionary_Function($is_viewing) ?>" /></label>
                        <br />
                        <label class="searchOption">Search Case-Sensitive <input type="checkbox" id="searchCaseSensitive" onchange="<?php Show_Dictionary_Function($is_viewing) ?>" /></label>
                        <label class="searchOption" title="Note: Matching diacritics will appear but may not highlight.">Ignore Diacritics/Accents <input type="checkbox" id="searchIgnoreDiacritics" onchange="<?php Show_Dictionary_Function($is_viewing) ?>" /></label>
                    </div>
                </label>
            </div>
            
            <label style="display:block;margin-bottom:0;"><b>Filter Words</b></label>
            <div id="filterOptions" style="display:block"></div>
            <div style="display:block;">
                <span  class="clickable inline-button" onclick="ToggleAllFilters(true);<?php Show_Dictionary_Function($is_viewing) ?>;">
                    Check All
                </span>
                &nbsp;
                <span  class="clickable inline-button" onclick="ToggleAllFilters(false);<?php Show_Dictionary_Function($is_viewing) ?>;">
                    Uncheck All
                </span>
            </div>
        </div>
        <div id="filterWordCount"></div>
            
        <div id="theDictionary"></div>
    </div>
    
    <div id="rightColumn" class="googleads" style="float:right;width:20%;max-width:300px;min-width:200px;overflow:hidden;">
        <?php if ($_GET['adminoverride'] != "noadsortracking") { include_once("php/google/adsense.php"); } ?>
    </div>

    <?php if (!$is_viewing) { ?>

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
                    <label><span>Dictionary Details <span id="showFullScreenTextbox" class="clickable inline-button" onclick="ShowFullScreenTextbox('dictionaryDescriptionEdit', 'Dictionary Details')">Maximize</span></span>
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
                    </label> <span class="clickable inline-button" onclick='alert("By default, your dictionary is organized alphabetically by word. Checking this box will organize it by the \"Equivalent Word\" field instead");'>?</span>
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
                        </label> <span class="clickable inline-button" onclick='alert("If you save your settings with this checked, your dictionary will be viewable by anyone if they have the public link.");'>?</span>
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
    
    <div id="fullScreenTextboxScreen" style="display:none;">
        <div id="fullScreenTextboxBackgroundFade" onclick="HideFullScreenTextbox()"></div>
        <div id="expandedTextboxId" style="display:none;width:0px;height:0px;"></div>
        <div id="fullScreenTextboxPage">
            <span id="fullScreenTextboxScreenCloseButton" class="clickable" onclick="HideFullScreenTextbox()">Minimize</span>
            <label><span id="fullScreenTextboxLabel"></span></label>
            <textarea id="fullScreenTextbox"></textarea>
        </div>
    </div>

    <?php } ?>
    
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

    <?php if (!$is_viewing) { ?>
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
    <?php } ?>

    </contents>
    <footer>
        Dictionary Builder only guaranteed to work with most up-to-date HTML5 browsers. <a href="https://github.com/Alamantus/DictionaryBuilder/issues" target="_blank">Report a Problem</a> | <span class="clickable" onclick="ShowInfo('termsText')" style="font-size:12px;">Terms</span> <span class="clickable" onclick="ShowInfo('privacyText')" style="font-size:12px;">Privacy</span>
    </footer>
    
    <!-- Markdown Parser -->
    <script src="js/marked.js"></script>
    <!-- JSON Search -->
    <script src="js/defiant.js"></script>
    <!-- Diacritics Removal for Exports -->
    <script src="js/removeDiacritics.js"></script>
    <!-- Helper Functions -->
    <script src="js/helpers.js"></script>
    <!-- Main Functions -->
    <script src="js/dictionaryBuilder.js"></script>
    <!-- UI Functions -->
    <script src="js/ui.js"></script>
    <?php if ($is_viewing) { ?>
    <!-- Public View Functions -->
    <script src="js/publicView.js"></script>
    <?php } ?>
    <?php if ($_GET['adminoverride'] != "noadsortracking") { include_once("php/google/analytics.php"); } ?>
    <script>
    var aboutText = termsText = privacyText = loginForm = forgotForm = "Loading...";
    <?php if ($is_viewing) { ?>
    window.onload = function () {
        ShowPublicDictionary();
        SetPublicPartsOfSpeech();
        
        GetTextFile("README.md", "aboutText", true);
        GetTextFile("TERMS.md", "termsText", true);
        GetTextFile("PRIVACY.md", "privacyText", true);
        GetTextFile("LOGIN.form", "loginForm", false);
        GetTextFile("FORGOT.form", "forgotForm", false);
    }
    <?php } else { ?>
    ready(function() {
        Initialize();
    });    
    <?php } ?>
    </script>
</body>
</html>

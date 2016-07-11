<?php
require_once('required.php');

session_start();
$current_user = isset($_SESSION['user']) ? $_SESSION['user'] : 0;

$dictionary_to_load = (isset($_GET['dict'])) ? intval($_GET['dict']) : 0;
$the_public_dictionary = '"That dictionary doesn\'t exist."';
$dictionary_name = 'ERROR';
$dictionary_creator = 'nobody';

$word_to_load = (isset($_GET['word'])) ? intval($_GET['word']) : 0;
$the_public_word = '"That word doesn\'t exist."';
$word_name = 'ERROR';

$is_owner = false;

$display_mode = ($dictionary_to_load > 0) ? (($word_to_load > 0) ? "word" : "view") : "build";

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

if ($display_mode != "build") {
    $dbconnection = new PDO('mysql:host=' . DATABASE_SERVERNAME . ';dbname=' . DATABASE_NAME . ';charset=utf8', DATABASE_USERNAME, DATABASE_PASSWORD);
    $dbconnection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $dbconnection->setAttribute(PDO::ATTR_EMULATE_PREPARES, true);
    $dbconnection->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

    $dictionary_query = "SELECT `d`.`id`, `d`.`user`, `d`.`name`, `d`.`description`, `u`.`public_name`, `d`.`parts_of_speech`, `d`.`is_complete` ";
    $dictionary_query .= "FROM `dictionaries` AS `d` LEFT JOIN `users` AS `u` ON `d`.`user`=`u`.`id`";
    $dictionary_query .= "WHERE `d`.`is_public`=1 AND `d`.`id`=" . $dictionary_to_load . ";";

    $word_query = "SELECT `w`.`word_id`, `w`.`name`, `w`.`pronunciation`, `w`.`part_of_speech`, `w`.`simple_definition`, `w`.`long_definition` ";
    $word_query .= "FROM `words` AS `w` LEFT JOIN `dictionaries` AS `d` ON `w`.`dictionary`=`d`.`id` ";
    $word_query .= "WHERE `d`.`is_public`=1 AND `w`.`dictionary`=" . $dictionary_to_load . (($display_mode == "word") ? " AND `w`.`word_id`=" . $word_to_load : "") . " ";
    $word_query .= "ORDER BY IF(`d`.`sort_by_equivalent`, `w`.`simple_definition`, `w`.`name`) COLLATE utf8_unicode_ci;";

    try {
        $dictionary_results = $dbconnection->prepare($dictionary_query);
        $dictionary_results->execute();
        if ($dictionary_results) {
            $word_results = $dbconnection->prepare($word_query);
            $word_results->execute();
            $dictionary_words = "[";
            if ($word_results) {
                $words_counted = 0;
                $words_total = num_rows($word_results);
                while ($word = fetch($word_results)) {
                    $words_counted++;
                    $word_name = $word['name'];
                    $dictionary_words .= '{"name":"' . $word['name'] . '",';
                    $dictionary_words .= '"pronunciation":"' . $word['pronunciation'] . '",';
                    $dictionary_words .= '"partOfSpeech":"' . $word['part_of_speech'] . '",';
                    $dictionary_words .= '"simpleDefinition":"' . $word['simple_definition'] . '",';
                    $dictionary_words .= '"longDefinition":"' . $word['long_definition'] . '",';
                    $dictionary_words .= '"wordId":"' . $word['word_id'] . '"';
                    $dictionary_words .= '}';

                    if ($words_counted < $words_total) {
                        $dictionary_words .= ',';
                    }
                }
            }
            $dictionary_words .= "]";

            if (num_rows($dictionary_results) === 1) {
                while ($dict = fetch($dictionary_results)) {
                    $dictionary_name = $dict['name'];
                    $dictionary_creator = $dict['public_name'];
                    $is_owner = $current_user == $dict['user'];
                    $the_public_dictionary = '{"name":"' . $dict['name'] . '",';
                    $the_public_dictionary .= '"description":"' . $dict['description'] . '",';
                    $the_public_dictionary .= '"createdBy":"' . $dict['public_name'] . '",';
                    $the_public_dictionary .= '"words":' . $dictionary_words . ',';
                    $the_public_dictionary .= '"settings":{';
                    $the_public_dictionary .= '"partsOfSpeech":"' . $dict['parts_of_speech'] . '",';
                    $the_public_dictionary .= '"isComplete":' . (($dict['is_complete'] == 1) ? 'true' : 'false') . '},';
                    $the_public_dictionary .= '"id":"' . $dictionary_to_load . '"';
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

    <?php if ($display_mode != "build") { ?>
        <title><?php echo (($display_mode == "word") ? ($word_name . " | ") : "") . $dictionary_name; ?> Dictionary on Lexiconga</title>
        <meta property="og:url" content="http://lexicon.ga/<?php echo $dictionary_to_load . (($display_mode == "word") ? ("/" . $word_to_load) : ""); ?>" />
        <meta property="og:type" content="article" />
        <meta property="og:title" content="<?php echo (($display_mode == "word") ? ("\"" . $word_name . "\" in the ") : "") . $dictionary_name; ?> Dictionary" />
        <meta property="og:description" content="A Lexiconga dictionary by <?php echo $dictionary_creator; ?>" />
        <meta property="og:image" content="http://lexicon.ga/images/logo.svg" />
        <script>var publicDictionary = <?php echo $the_public_dictionary; ?></script>
    <?php } else { ?>
        <title>Lexiconga Dictionary Builder</title>
        <meta property="og:url" content="http://lexicon.ga" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Lexiconga Dictionary Builder" />
        <meta property="og:description" content="Build lexicons for contructed languages or anything that you can think of!" />
        <meta property="og:image" content="http://lexicon.ga/images/logo.svg" />
    <?php } ?>

    <link href="/css/styles.css" rel="stylesheet" />
    <link href="/css/lexiconga.css" rel="stylesheet" />
    <link href="/css/mobile.css" rel="stylesheet" />
</head>
<body>
    <header>
        <div id="headerPadder">
            <a href="/" id="siteLogo">Lexiconga Dictionary Builder</a>
            <div style="float:right;margin: 16px 8px;font-size:12px;">
                <span id="aboutButton" class="clickable" onclick="ShowInfo('aboutText')">About Lexiconga</span>
            </div>
            <div id="loginoutArea" style="font-size:12px;">
            <?php if ($display_mode == "build") { ?>
                <?php if ($current_user > 0) {  //If logged in, show the log out button. ?>
                    <span id="accountSettings" class="clickable" onclick="ShowAccountSettings()">Account Settings</span> <a href="?logout" id="logoutLink" class="clickable">Log Out</a>
                <?php } elseif (!isset($_SESSION['loginfailures']) || (isset($_SESSION['loginfailures']) && $_SESSION['loginfailures'] < 10)) { ?>
                    <span id="loginLink" class="clickable" onclick="ShowInfo('loginForm')">Log In/Create Account</span>
                <?php } else { ?>
                    <span id="loginLink" class="clickable" title="<?php echo $hoverlockoutmessage; ?>" onclick="alert('<?php echo $alertlockoutmessage; ?>');">Can't Login</span>
                <?php }
            } else { ?>
                <h3 style="display:inline; margin:0 5px;">Viewing</h3>
                <?php if ($is_owner) { ?>
                <span class="clickable" onclick="ChangeDictionaryToId(<?php echo $dictionary_to_load; ?>, function(response) {if (response.length >= 60) window.location.href = '/';});">&laquo; Edit Dictionary</span>
                <?php } else { ?>
                <a class="clickable" href="/">&laquo; Go Home to Lexiconga</a>
                <?php }?>
            <?php } ?>
            </div>
        </div>
    </header>
    <contents>
    <?php if ($display_mode == "build") { ?>
    <div id="announcementArea" style="display:<?php echo (($announcement) ? "block" : "none"); ?>;">
        <span id="announcementCloseButton" class="clickable rightButton" onclick="document.getElementById('announcementArea').style.display='none';">Close</span>
        <div id="announcement"><?php echo $announcement; ?></div>
    </div>
    <div id="notificationArea" style="display:<?php echo (($notificationMessage) ? "block" : "none"); ?>;">
        <span id="notificationCloseButton" class="clickable rightButton" onclick="document.getElementById('notificationArea').style.display='none';">Close</span>
        <div id="notificationMessage"><?php echo $notificationMessage; ?></div>
    </div>
    <div id="leftColumn">

        <form id="wordEntryForm">
            <div id="formLockButton" class="clickable" onclick="ToggleWordFormLock()" title="Lock/unlock form from the top of the page">&#128274;</div>
            <label><span>Word</span>
                <input type="text" id="word" onkeydown="SubmitWordOnCtrlEnter(this)" />
            </label>
            <label><span>Pronunciation <a class="clickable inline-button" href="http://r12a.github.io/pickers/ipa/" target="_blank" title="IPA Character Picker located at http://r12a.github.io/pickers/ipa/">IPA Characters</a></span>
                <input type="text" id="pronunciation" onkeydown="SubmitWordOnCtrlEnter(this)" />
            </label>
            <label><span>Part of Speech</span>
                <select id="partOfSpeech" onkeydown="SubmitWordOnCtrlEnter(this)"></select>
            </label>
            <label><span>Definition/<wbr><b class=wbr></b>Equivalent Word(s)</span>
                <input type="text" id="simpleDefinition" onkeydown="SubmitWordOnCtrlEnter(this)" />
            </label>
            <label><span>Explanation/<wbr><b class=wbr></b>Long Definition <span id="showFullScreenTextbox" class="clickable inline-button" onclick="ShowFullScreenTextbox('longDefinition', 'Explanation/Long Definition')">Maximize</span></span>
                <textarea id="longDefinition" class="longDefinition" onkeydown="SubmitWordOnCtrlEnter(this)"></textarea>
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

    <div id="mobileWordFormPullout" onclick="MobileToggleWordForm();" style="display:none;">+</div>
    <?php } ?>

    <div id="dictionaryColumn"><div id="dictionaryContent">
        <?php if ($display_mode == "build") { ?>
        <span id="settingsButton" class="clickable rightButton" onclick="ShowSettings()">Settings</span>
        <?php } ?>
        <h1 id="dictionaryName"></h1>

        <?php if ($display_mode != "build") { ?>
        <h4 id="dictionaryBy"></h4>
        <div id="incompleteNotice"></div>
        <?php } ?>

        <?php if ($display_mode == "word") { ?>
        <a class="clickable toggleButton" href="/<?php echo $dictionary_to_load; ?>">View Full Dictionary</a>
        <?php } ?>
        <span id="descriptionToggle" class="clickable toggleButton" onclick="ToggleDescription();"><?php if ($display_mode == "view") { ?>Hide<?php } else { ?>Show<?php } ?> Description</span>
        <div id="dictionaryDescription" style="display:<?php if ($display_mode == "view") { ?>block<?php } else { ?>none<?php } ?>;"></div>

        <?php if ($display_mode != "word") { ?>
        <span id="searchFilterToggle" class="clickable toggleButton" onclick="ToggleSearchFilter();"><?php if ($display_mode == "view") { ?>Hide <?php } ?>Search/Filter Options</span>
        <div id="searchFilterArea" style="display:<?php if ($display_mode == "view") { ?>block<?php } else { ?>none<?php } ?>;">
            <div id="searchArea" style="display:block;">
                <label style="margin-top:10px;">
                    <span>Search</span>
                    <div style="display:block;">
                        <input type="text" id="searchBox" onclick="this.select();" onchange="<?php Show_Dictionary_Function($display_mode == "view") ?>" style="display:inline;" />&nbsp;
                        <span class="clickable inline-button" onclick="document.getElementById('searchBox').value='';<?php Show_Dictionary_Function($display_mode == "view") ?>;">Clear Search</span>
                    </div>
                    <div id="searchOptions">
                        <label class="searchOption">Word <input type="checkbox" id="searchOptionWord" checked="checked" onchange="<?php Show_Dictionary_Function($display_mode == "view") ?>" /></label>
                        <label class="searchOption">Definition <input type="checkbox" id="searchOptionSimple" checked="checked" onchange="<?php Show_Dictionary_Function($display_mode == "view") ?>" /></label>
                        <label class="searchOption">Explanation <input type="checkbox" id="searchOptionLong" checked="checked" onchange="<?php Show_Dictionary_Function($display_mode == "view") ?>" /></label>
                        <br />
                        <label class="searchOption">Search Case-Sensitive <input type="checkbox" id="searchCaseSensitive" onchange="<?php Show_Dictionary_Function($display_mode == "view") ?>" /></label>
                        <label class="searchOption" title="Note: Matching diacritics will appear but may not highlight.">Ignore Diacritics/Accents <input type="checkbox" id="searchIgnoreDiacritics" onchange="<?php Show_Dictionary_Function($display_mode == "view") ?>" /></label>
                    </div>
                </label>
            </div>

            <label style="display:block;margin-bottom:0;"><b>Filter Words</b></label>
            <div id="filterOptions" style="display:block"></div>
            <div style="display:block;">
                <span  class="clickable inline-button" onclick="ToggleAllFilters(true);<?php Show_Dictionary_Function($display_mode == "view") ?>;">
                    Check All
                </span>
                &nbsp;
                <span  class="clickable inline-button" onclick="ToggleAllFilters(false);<?php Show_Dictionary_Function($display_mode == "view") ?>;">
                    Uncheck All
                </span>
            </div>
        </div>
        <div id="filterWordCount"></div>
        <?php } ?>

        <div id="theDictionary"></div>
    </div></div>

    <div id="rightColumn" class="googleads" style="float:right;width:20%;max-width:300px;min-width:200px;overflow:hidden;">
        <?php if ($_GET['adminoverride'] != "noadsortracking") { include_once("php/google/adsense.php"); } ?>
    </div>

    <?php if ($display_mode == "build") { ?>

    <div id="settingsScreen" style="display:none;">
        <div id="settingsBackgroundFade" class="fixedFade" onclick="HideSettings()"></div>
        <div id="settingsOptions" class="fixedPage">
            <span id="settingsScreenCloseButton" class="clickable rightButton" onclick="HideSettings()">Close</span>
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
                        <span class="checkboxlabel">Sort by Definition/Equivalent Word</span>
                        <input type="checkbox" id="dictionarySortByEquivalent" />
                    </label> <span class="clickable inline-button" onclick='alert("By default, your dictionary is organized alphabetically by word. Checking this box will organize it by the \"Definition/Equivalent Word\" field instead");'>?</span>
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
                    <br>
                    <?php if ($current_user > 0) {  //If logged in, show the special options. ?>
                        <label><span>Change Dictionaries</span>
                            <select id="userDictionaries" onchange="ChangeDictionary();"></select>
                        </label>
                        <br>
                        <label><button type="button" onclick="CreateNewDictionary()" style="cursor:pointer;">Create a New Dictionary</button></label>
                    <?php } ?>
                    <label style="display:inline-block;margin-right:8px;"><button type="button" onclick="ShowInfo('exportForm')">Export...</button></label>
                    <label style="display:inline-block;"><button type="button" onclick="ShowInfo('importForm')">Import...</button></label>
                    <br><br>
                    <?php if ($current_user > 0) {  //If logged in, show the log out button. ?>
                        <label><button type="button" onclick="DeleteCurrentDictionary()" style="cursor:pointer;">Delete Current Dictionary</button></label>
                    <?php } else {  //If logged in, show the log out button. ?>
                        <label><button type="button" onclick="EmptyWholeDictionary()" style="cursor:pointer;">Empty Current Dictionary</button></label>
                    <?php } ?>
                </div>
                <div id="settingsSaveButtons">
                    <span id="settingsErrorMessage"></span><br>
                    <button type="button" class="rightButton" onclick="SaveSettings(); HideSettings(); return false;">Save and Close</button>
                    <button type="button" class="rightButton" onclick="SaveSettings(); return false;" style="margin-right:2px;">Save</button>
                </div>
            </form>
        </div>
    </div>

    <div id="fullScreenTextboxScreen" style="display:none;">
        <div id="fullScreenTextboxBackgroundFade" class="fixedFade" onclick="HideFullScreenTextbox()"></div>
        <div id="expandedTextboxId" style="display:none;width:0px;height:0px;"></div>
        <div id="fullScreenTextboxPage" class="fixedPage">
            <span id="fullScreenTextboxScreenCloseButton" class="clickable rightButton" onclick="HideFullScreenTextbox()">Minimize</span>
            <label><span id="fullScreenTextboxLabel"></span></label>
            <textarea id="fullScreenTextbox"></textarea>
        </div>
    </div>

    <?php } ?>

    <div id="infoScreen" style="display:none;">
        <div id="infoBackgroundFade" class="fixedFade" onclick="HideInfo()"></div>
        <div id="infoPage" class="fixedPage">
            <span id="infoScreenCloseButton" class="clickable rightButton" onclick="HideInfo()">Close</span>
            <div id="infoText"></div>
        </div>
    </div>

    <?php if ($current_user > 0) {
        $user_email = Get_User_Email($current_user);
    ?>
    <div id="accountSettingsScreen" style="display:none;">
        <div id="accountSettingsBackgroundFade" class="fixedFade" onclick="HideAccountSettings()"></div>
        <div id="accountSettingsPage" class="fixedPage">
            <span id="accountSettingsScreenCloseButton" class="clickable rightButton" onclick="HideAccountSettings()">Close</span>
            <div class="settingsCol"><form id="accountSettingsForm" method="post" action="?accountsettings">
                <h2>Account Settings</h2>
                <label><span>Email</span>
                    <input type="email" id="accountSettingsEmailField" name="email" value="<?php echo $user_email; ?>" onchange="WarnEmailChange()" />
                    <input type="hidden" id="accountSettingsPreviousEmailField" name="previousemail" value="<?php echo $user_email; ?>" />
                </label>
                <div id="accountSettingsEmailChangeWarning" style="display:none;font-weight:bold;color:#dd5500;font-size:11px;margin-bottom:10px;">If you change your email address, please note that you will no longer be able to log in with your old email address, <?php echo $user_email; ?>.<br>Change it back unless you are completely sure that you want to change your email address!</div>
                <label><span>Public Name <span class="clickable inline-button" onclick="ExplainPublicName()">?</span></span>
                    <input type="text" id="accountSettingsPublicNameField" name="publicname" value="<?php echo Get_Public_Name_By_Id($current_user); ?>" />
                </label>
                <label style="display:inline;"><b>Allow Emails</b>
			        <input type="checkbox" id="createAccountAllowEmailsField" name="allowemails" checked="checked" />
			    </label> <span class="clickable inline-button" onclick="ExplainAllowEmails()">?</span>
                <div id="accountSettingsError" style="font-weight:bold;color:red;"></div>
                <button type="submit" id="accountSettingsSubmitButton" onclick="ValidateAccountSettings(); return false;">Save Settings</button>
                <br>
            </form></div>
            <div class="settingsCol">
                <br>
                <h2>Reset Your Password</h2>
                <p style="font-size: 12px;">Click the button below to reload the page and show the Reset Password form. Filling out this form will instantly change your password, and you will need to log in using the new password from that point forward.</p>
                <span id="resetPassword" class="clickable" onclick="this.innerHTML='Loading...';LoggedInResetPassword();" style="margin-top:20px;">Reset Password</span>
            </div>
        </div>
    </div>
    <?php
        }
    ?>

    <?php if ($display_mode == "build") { ?>
    <div id="loadAfterDeleteScreen" style="display:none;">
        <div id="loadAfterDeleteFade" class="fixedFade"></div>
        <div id="loadAfterDeletePage" class="fixedPage">
            <div class="settingsCol">
                <h1>Dictionary Deleted</h1>
                <label>Select dictionary to load:<br />
                    <select id="loadAfterDelete" onchange="ChangeDictionary(this);document.getElementById('loadAfterDeleteScreen').style.display = 'none';"></select>
                </label>
                <p>Or</p>
                <label><button type="button" onclick="CreateNewDictionary();document.getElementById('loadAfterDeleteScreen').style.display = 'none';">Create a New Dictionary</button></label>
            </div>
        </div>
    </div>
    <?php } ?>

    </contents>
    <footer>
        <div id="footer-content">
        Dictionary Builder only guaranteed to work with most up-to-date HTML5 browsers. <a href="/issues" class="clickable inline-button" target="_blank">Issues</a> <a href="/updates" class="clickable inline-button" target="_blank">Updates</a> | <span class="clickable inline-button" onclick="ShowInfo('termsText')" style="font-size:12px;">Terms</span> <span class="clickable inline-button" onclick="ShowInfo('privacyText')" style="font-size:12px;">Privacy</span>
        </div>
    </footer>

    <!-- Markdown Parser -->
    <script src="/js/marked.js"></script>
    <!-- CSV Parser -->
    <script src="/js/papaparse.js"></script>
    <!-- JSON Search -->
    <script src="/js/defiant.js"></script>
    <!-- Diacritics Removal for Exports -->
    <script src="/js/removeDiacritics.js"></script>
    <!-- Helper Functions -->
    <script src="/js/helpers.js"></script>
    <!-- Main Functions -->
    <script src="/js/dictionaryBuilder.js"></script>
    <!-- UI Functions -->
    <script src="/js/ui.js"></script>
    <?php if ($display_mode != "build") { ?>
    <!-- Public View Functions -->
    <script src="/js/publicView.js"></script>
    <?php } ?>
    <?php if ($_GET['adminoverride'] != "noadsortracking") { include_once("php/google/analytics.php"); } ?>
    <script>
    var aboutText = termsText = privacyText = loginForm = forgotForm = exportForm = importForm = "Loading...";
    <?php if ($display_mode != "build") { ?>
    window.onload = function () {
        ShowPublicDictionary(<?php if ($display_mode == "word") echo "true"; ?>);
        <?php
        if ($display_mode != "word") {    // don't try to set the filters
            echo "SetPublicPartsOfSpeech()";
        } ?>

        GetTextFile("/README.md", "aboutText", true);
        GetTextFile("/TERMS.md", "termsText", true);
        GetTextFile("/PRIVACY.md", "privacyText", true);
        GetTextFile("/LOGIN.form", "loginForm", false);
        GetTextFile("/FORGOT.form", "forgotForm", false);
        GetTextFile("/EXPORT.form", "exportForm", false);
        GetTextFile("/IMPORT.form", "importForm", false);
    }
    <?php } else { ?>
    ready(function() {
        Initialize();
    });
    <?php } ?>
    var loggedIn = <?php echo ($current_user > 0) ? "true" : "false"; ?>;
    </script>
</body>
</html>

<?php
//require_once('../required.php');
require_once('../php/config.php');
require_once(SITE_LOCATION . '/php/functions.php');

session_start();
$current_user = isset($_SESSION['user']) ? $_SESSION['user'] : 0;

$dictionary_to_load = (isset($_GET['dict'])) ? intval($_GET['dict']) : 0;
$the_public_dictionary = '"That dictionary doesn\'t exist."';

if ($current_user > 0 || !isset($_SESSION['loginfailures']) || (isset($_SESSION['loginlockouttime']) && time() - $_SESSION['loginlockouttime'] >= 3600)) {
    // If logged in, never failed, or more than 1 hour has passed, reset login failures.
    $_SESSION['loginfailures'] = 0;
} else {
    $alertlockoutmessage = "You failed logging in 10 times. To prevent request flooding and hacking attempts, you may not log in or create an account for 1 hour.\\n\\nThe last time this page was loaded, you had been locked out for " . time_elapsed(time() - $_SESSION['loginlockouttime']) . "\\n\\nRefresh the page once the hour has passed.";
    $hoverlockoutmessage = str_replace("\\n", "\n", $alertlockoutmessage);
}

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

?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    
    <title>Lexiconga Dictionary Builder</title>

    <link href="../css/styles.css" rel="stylesheet" />
    <link href="../css/lexiconga.css" rel="stylesheet" />
    <script>var publicDictionary = <?php echo $the_public_dictionary; ?></script>
</head>
<body>
    <header>
        <div id="headerPadder">
            <a href="./" id="siteLogo">Lexiconga Dictionary Builder</a>
            <div style="float:right;margin: 16px 8px;font-size:12px;">
                <span id="aboutButton" class="clickable" onclick="ShowInfo('aboutText')">About Lexiconga</span>
            </div>
            <div id="loginoutArea" style="font-size:12px;">
                <a id="loginLink" class="clickable" href="../" title="Go home to log in or create an account.">Go Home</a>
            </div>
        </div>
    </header>
    <contents>
    <div id="dictionaryContainer">
        <h1 id="dictionaryName"></h1>
        <h4 id="dictionaryBy"></h4>
        
        <span id="descriptionToggle" class="clickable" onclick="ToggleDescription();">Hide Description</span>
        <div id="dictionaryDescription" style="display:block;"></div>
        
        <span id="searchFilterToggle" class="clickable" onclick="ToggleSearchFilter();">Hide Search/Filter Options</span>
        <div id="searchFilterArea" style="display:block;">
            <div id="searchArea" style="display:block;">
                <label style="margin-top:10px;">
                    <span>Search</span>
                    <div style="display:block;">
                        <input type="text" id="searchBox" onclick="this.select();" onchange="ShowPublicDictionary()" style="display:inline;" />&nbsp;
                        <span style="display:inline;cursor:pointer;font-size:10px;font-weight:bold;" onclick="document.getElementById('searchBox').value='';ShowPublicDictionary();">Clear Search</span>
                    </div>
                    <div id="searchOptions" style="font-size:12px;">
                        <label style="display:inline;margin:0;">Word <input type="checkbox" id="searchOptionWord" checked="checked" onchange="ShowPublicDictionary()" /></label>&nbsp;&nbsp;
                        <label style="display:inline;margin:0;">Equivalent <input type="checkbox" id="searchOptionSimple" checked="checked" onchange="ShowPublicDictionary()" /></label>&nbsp;&nbsp;
                        <label style="display:inline;margin:0;">Explanation <input type="checkbox" id="searchOptionLong" checked="checked" onchange="ShowPublicDictionary()" /></label>
                        <br />
                        <label style="display:inline;margin:0;">Search Case-Sensitive <input type="checkbox" id="searchCaseSensitive" onchange="ShowPublicDictionary()" /></label>
                        <label style="display:inline;margin:0;" title="Note: Matching diacritics will appear but may not highlight.">Ignore Diacritics/Accents <input type="checkbox" id="searchIgnoreDiacritics" onchange="ShowPublicDictionary()" /></label>
                    </div>
                </label>
            </div>
            
            <label style="display:block;"><b>Filter Words </b><select id="wordFilter" onchange="ShowPublicDictionary()">
                <option value="">All</option>
            </select>
            </label>
        </div>
            
        <div id="theDictionary"></div>
    </div>
    
    <div id="rightColumn" class="googleads" style="float:right;width:20%;max-width:300px;min-width:200px;overflow:hidden;">
        <?php if ($_GET['adminoverride'] != "noadsortracking") { include_once("../php/google/adsense.php"); } ?>
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
        Dictionary Builder only guaranteed to work with most up-to-date HTML5 browsers. <a href="https://github.com/Alamantus/DictionaryBuilder/issues" target="_blank">Report a Problem</a> | <span class="clickable" onclick="ShowInfo('termsText')" style="font-size:12px;">Terms</span> <span class="clickable" onclick="ShowInfo('privacyText')" style="font-size:12px;">Privacy</span>
    </footer>
    
    <!-- Markdown Parser -->
    <script src="../js/marked.js"></script>
    <!-- JSON Search -->
    <script src="../js/defiant-js/defiant-latest.js"></script>
    <!-- Diacritics Removal for Exports -->
    <script src="../js/removeDiacritics.js"></script>
    <!-- Main Script -->
    <script src="../js/dictionaryBuilder.js"></script>
    <script src="../js/ui.js"></script>
    <script src="../js/publicView.js"></script>
    <?php if ($_GET['adminoverride'] != "noadsortracking") { include_once("../php/google/analytics.php"); } ?>
    <script>
    var aboutText = termsText = privacyText = loginForm = forgotForm = "Loading...";
    window.onload = function () {
        ShowPublicDictionary();
        SetPublicPartsOfSpeech();
        
        GetTextFile("../README.md", "aboutText", true);
        GetTextFile("../TERMS.md", "termsText", true);
        GetTextFile("../PRIVACY.md", "privacyText", true);
        GetTextFile("../LOGIN.form", "loginForm", false);
        GetTextFile("../FORGOT.form", "forgotForm", false);
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
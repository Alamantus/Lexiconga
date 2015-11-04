<?php
require_once('required.php');

session_start();
$current_user = isset($_SESSION['user']) ? $_SESSION['user'] : 0;

$notificationMessage = "";

if (isset($_GET['logout']) && $current_user > 0) {
    session_destroy();
    header('Location: ./index2.php?loggedout');
}
elseif (isset($_GET['login'])) {
    if (isset($_POST['email']) && isset($_POST['password'])) {
        if (filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
            if (EmailExists($_POST['email'])) {
                if (Validate_Login($_POST['email'], $_POST['password'])) {
                    $_SESSION['user'] = Get_User_Id($_POST['email']);
                    header('Location: ./index2.php');
                } else {
                    header('Location: ./index2.php?error=loginfailed');
                }
            } else {
                header('Location: ./index2.php?error=emaildoesnotexist');
            }
        } else {
            header('Location: ./index2.php?error=emailinvalid');
        }
    } else {
        header('Location: ./index2.php?error=loginemailorpasswordblank');
    }
}
elseif (isset($_GET['createaccount'])) {
    if (isset($_POST['email']) && isset($_POST['password'])) {
        if (filter_var($_POST['email'], FILTER_VALIDATE_EMAIL) && !EmailExists($_POST['email'])) {
            if (query("INSERT INTO users (email, password, public_name, allow_email) VALUES ('" . $_POST['email'] . "','" . crypt($_POST['password'], $_POST['email']) . "','" . htmlspecialchars($_POST['publicname'], ENT_QUOTES) . "'," . (($_POST['allowemails'] != "on") ? 0 : 1) . ")")) {
                header('Location: ./index2.php?success');
            } else {
                header('Location: ./index2.php?error=couldnotcreate');
            }
        } else {
            header('Location: ./index2.php?error=emailcreateinvalid');
        }
    } else {
        header('Location: ./index2.php?error=createemailorpasswordblank');
    }
}
elseif (isset($_GET['error'])) {
    if ($_GET['error'] == "couldnotcreate") {
        $notificationMessage = "Could not create account.<br>Please try again later.";
    } elseif ($_GET['error'] == "emailcreateinvalid") {
        $notificationMessage = "The email address used to create your account didn't work.<br>Please try another.";
    } elseif ($_GET['error'] == "createemailorpasswordblank") {
        $notificationMessage = "The create account form somehow got submitted without some essential information.<br>Please try filling it out again.";
    } elseif ($_GET['error'] == "loginfailed") {
        $notificationMessage = "We couldn't log you in because your email or password was incorrect.<br>";
        if (!isset($_SESSION['loginfailures']) || (isset($_SESSION['loginlockouttime']) && time() - $_SESSION['loginlockouttime'] > 3600)) {
            // If never failed or more than 1 hour has passed, reset login failures.
            $_SESSION['loginfailures'] = 0;
        }
        $_SESSION['loginfailures'] += 1;
        if ($_SESSION['loginfailures'] < 10) {
            $notificationMessage .= "This is your " . $_SESSION['loginfailures'] . " time. Please try again.";
        } else {
            $_SESSION['loginlockouttime'] = time();
            $notificationMessage .= "Since you failed to log in successfully 10 times, you may not try again for about an hour.";
        }
    } elseif ($_GET['error'] == "emaildoesnotexist") {
        $notificationMessage = "The email address you entered doesn't have an account.<br>Would you like to <span class='clickable' onclick='ShowInfo(\"create\")'>create an account</span>?";
    } elseif ($_GET['error'] == "emailinvalid") {
        $notificationMessage = "The email address you entered didn't work.<br>Please try another.";
    } else {
        $notificationMessage = "Something seems to have gone wrong, but I don't know what.<br>Please try again.";
    }
}
elseif (isset($_GET['success'])) {
    $notificationMessage = "Your account was created successfully!<br>Please log in using the email address and password you used to create it and you can start accessing your dictionaries anywhere!";
}
elseif (isset($_GET['loggedout'])) {
    $notificationMessage = "You have been successfully logged out.<br>You will only be able to use the dictionary saved to your browser.";
}
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
            <div id="loginoutArea" style="font-size:12px;">
                <?php if ($current_user > 0) {  //If logged in, show the log out button. ?>
                    <a href="?logout" id="logoutLink" class="clickable">Log Out</a>
                <?php } elseif (!isset($_SESSION['loginfailures']) || (isset($_SESSION['loginfailures']) && $_SESSION['loginfailures'] < 10) || (isset($_SESSION['loginlockouttime']) && time() - $_SESSION['loginlockouttime'] > 3600)) { ?>
                    <span id="loginLink" class="clickable" onclick="ShowInfo('login')">Log In/Create Account</span>
                <?php } else { ?>
                    <span id="loginLink" class="clickable" onclick="alert('You failed logging in 10 times. To prevent request flooding and hacking attempts, you may not log in or create an account for a while.');">Can't Login</span>
                <?php } ?>
            </div>
        </div>
    </header>
    <contents>
    <?php if ($notificationMessage != "") { ?>
        <div id="notificationArea" style="text-align:center;background:#c0c088;padding:10px;border-radius:5px;margin:0 auto;width:50%;min-width:200px;">
            <?php echo $notificationMessage; ?>
        </div>
    <?php } ?>
    <div id="leftColumn">
    <form id="wordEntryForm">
        <label><span>Word</span>
            <input type="text" id="word" />
        </label>
        <label><span>Equivalent Word</span>
            <input type="text" id="simpleDefinition" />
        </label>
        <label><span>Explanation</span>
            <textarea id="longDefinition"></textarea>
        </label>
        <label><span>Part of Speech</span>
            <select id="partOfSpeech"></select>
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
        <?php //include_once("php/google/adsense.php"); ?>
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
                    </div>
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
        <?php if (isset($_GET['login'])) echo 'cool '; ?>
        Dictionary Builder only guaranteed to work with most up-to-date HTML5 browsers. <span class="clickable" onclick="ShowInfo('terms')" style="font-size:12px;">Terms</span> <span class="clickable" onclick="ShowInfo('privacy')" style="font-size:12px;">Privacy</span>
    </footer>
    
    <!-- Markdown Parser -->
    <script src="js/markdown-js/markdown.min.js"></script>
    <!-- JSON Search -->
    <script src="js/defiant-js/defiant-latest.min.js"></script>
    <!-- Main Script -->
    <script src="js/dictionaryBuilder.js"></script>
    <script>
    currentUser = <?php echo $current_user; ?>;
    publicName = <?php echo Get_Public_Name($current_user); ?>;
    </script>
    <?php include_once("php/google/analytics.php"); ?>
</body>
</html>

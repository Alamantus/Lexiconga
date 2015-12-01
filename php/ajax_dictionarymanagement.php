<?php
// require_once("../required.php");
require_once('config.php');
require_once(SITE_LOCATION . '/php/functions.php');

session_start();

if ($_GET['action'] == 'getall') {
    Get_Dictionaries(true);
}
elseif ($_GET['action'] == 'load') {
    Load_Current_Dictionary();
}
elseif ($_GET['action'] == 'new') {
    Save_Current_DictionaryAsNew();
}
elseif ($_GET['action'] == 'update') {
    Update_Current_Dictionary();
}
elseif ($_GET['action'] == 'switch') {
    Switch_Current_Dictionary($_POST['newdictionaryid'], true);
}
elseif ($_GET['action'] == 'delete') {
    Delete_Current_Dictionary();
}

function Get_Dictionaries($return_list = true) {
    if ($_SESSION['user'] > 0) {
        $query = "SELECT `id`, `name` FROM `dictionaries` WHERE `user`=" . $_SESSION['user'] . " ORDER BY `name` ASC;";
        $dictionaries = query($query);
        
        if ($dictionaries) {
            if (num_rows($dictionaries) > 0) {
                if ($return_list) {
                    $list = "";
                    $_SESSION['dictionaries'] = [];
                    while ($dict = fetch($dictionaries)) {
                        $_SESSION['dictionaries'][] = $dict['id'];  // Save a list of all dictionaries user has.
                        //list for the switch dictionaries dropdown.
                        $list .= $dict['id'] . '_IDNAMESEPARATOR_' . $dict['name'] . '_DICTIONARYSEPARATOR_';
                    }
                    echo $list;
                }
                return true;
            } else {
                echo "no dictionaries";
            }
        } else {
            echo "could not load";
        }
    } else {
        echo "not signed in";
    }
    return false;
}

function Load_Current_Dictionary() {
    if ($_SESSION['user'] > 0) {
        $query = "SELECT `d`.`id`, `d`.`name`, `d`.`description`, `u`.`public_name`, `d`.`words`, `d`.`next_word_id`, `d`.`allow_duplicates`, `d`.`case_sensitive`, `d`.`parts_of_speech`, `d`.`sort_by_equivalent`, `d`.`is_complete` ";
        $query .= "FROM `dictionaries` AS `d` LEFT JOIN `users` AS `u` ON `user`=`u`.`id` WHERE `is_current`=1 AND `user`=" . $_SESSION['user'] . ";";
        $dictionary = query($query);
        
        if ($dictionary) {
            if (num_rows($dictionary) > 0) {
                if (num_rows($dictionary) === 1) {
                    while ($dict = fetch($dictionary)) {
                        $_SESSION['dictionary'] = $dict['id'];
                        $json = '{"name":"' . $dict['name'] . '",';
                        $json .= '"description":"' . $dict['description'] . '",';
                        $json .= '"createdBy":"' . $dict['public_name'] . '",';
                        $json .= '"words":' . $dict['words'] . ',';
                        $json .= '"nextWordId":' . $dict['next_word_id'] . ',';
                        $json .= '"settings":{';
                        $json .= '"allowDuplicates":' . (($dict['allow_duplicates'] == 1) ? 'true' : 'false') . ',';
                        $json .= '"caseSensitive":' . (($dict['case_sensitive'] == 1) ? 'true' : 'false') . ',';
                        $json .= '"partsOfSpeech":"' . $dict['parts_of_speech'] . '",';
                        $json .= '"sortByEquivalent":' . (($dict['sort_by_equivalent'] == 1) ? 'true' : 'false') . ',';
                        $json .= '"isComplete":' . (($dict['is_complete'] == 1) ? 'true' : 'false') . '},';
                        $json .= '"externalID":' . $dict['id'] . '}';
                        echo $json;
                        return true;
                    }
                } else {
                    echo "more than 1 returned";
                }
            } else {
                echo "no dictionaries";
            }
        } else {
            echo "could not load";
        }
    } else {
        echo "not logged in";
    }
    return false;
}

function Save_Current_DictionaryAsNew() {
    if ($_SESSION['user'] > 0) {
        $dbconnection = new PDO('mysql:host=' . DATABASE_SERVERNAME . ';dbname=' . DATABASE_NAME . ';charset=utf8', DATABASE_USERNAME, DATABASE_PASSWORD);
        $dbconnection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $dbconnection->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
        $dbconnection->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

        $query = "INSERT INTO `dictionaries`(`user`, `is_current`, `name`, `description`, `words`, `next_word_id`, `allow_duplicates`, `case_sensitive`, `parts_of_speech`, `sort_by_equivalent`, `is_complete`, `is_public`) ";
        $query .= "VALUES (" . $_SESSION['user'] . ",0,'" . $_POST['name'] . "','" . $_POST['description'] . "','" . $_POST['words'] . "'," . $_POST['nextwordid'] . "," . $_POST['allowduplicates'] . "," . $_POST['casesensitive'] . ",'" . $_POST['partsofspeech'] . "'," . $_POST['sortbyequivalent'] . "," . $_POST['iscomplete'] . "," . $_POST['ispublic'] . ")";
        
        try {
            $update = $dbconnection->prepare($query);
            $update->execute();
            $_SESSION['dictionary'] = $dbconnection->lastInsertId();
            $_SESSION['dictionaries'][] = $_SESSION['dictionary'];  //Add new id to valid dictionaries. 
            echo $_SESSION['dictionary'];
            Switch_Current_Dictionary($_SESSION['dictionary'], false);
            return true;
        }
        catch (PDOException $ex) {
            $errorMessage = $dbconnection->errorInfo();
            echo "could not update:\n" . $errorMessage[2] . "\n" . $query;
        }
    } else {
        echo "not logged in";
    }
    return false;
}

function Update_Current_Dictionary() {
    if ($_SESSION['user'] > 0) {
        if (isset($_SESSION['dictionary'])) {
            $query = "UPDATE `dictionaries` SET ";
            
            if (isset($_POST['name'])) {
                $query .= "`name`='" . $_POST['name'] . "', ";
            }
            if (isset($_POST['description'])) {
                $query .= "`description`='" . $_POST['description'] . "', ";
            }
            if (isset($_POST['words'])) {
                $query .= "`words`='" . $_POST['words'] . "', ";
            }
            if (isset($_POST['nextwordid'])) {
                $query .= "`next_word_id`=" . $_POST['nextwordid'] . ", ";
            }
            if (isset($_POST['allowDuplicates'])) {
                $query .= "`allow_duplicates`=" . $_POST['allowduplicates'] . ", ";
            }
            if (isset($_POST['casesensitive'])) {
                $query .= "`case_sensitive`=" . $_POST['casesensitive'] . ", ";
            }
            if (isset($_POST['partsofspeech'])) {
                $query .= "`parts_of_speech`='" . $_POST['partsofspeech'] . "', ";
            }
            if (isset($_POST['sortbyequivalent'])) {
                $query .= "`sort_by_equivalent`='" . $_POST['sortbyequivalent'] . "', ";
            }
            if (isset($_POST['iscomplete'])) {
                $query .= "`is_complete`=" . $_POST['iscomplete'] . ", ";
            }
            if (isset($_POST['ispublic'])) {
                $query .= "`is_public`=" . $_POST['ispublic'] . ", ";
            }
            
            $query .= "`last_updated`='" . date("Y-m-d H:i:s") . "'";
            $query .= " WHERE `id`=" . $_SESSION['dictionary'] . " AND `user`=" . $_SESSION['user'] . ";";
            $update = query($query);
            
            if ($update) {
                echo "updated successfully";
                return true;
            } else {
                echo "could not update";
            }
        } else {
            Save_Current_DictionaryAsNew();
        }
    } else {
        echo "not logged in";
    }
    return false;
}

function Switch_Current_Dictionary($newdictionaryid, $returndictionary = true) {
    if ($_SESSION['user'] > 0) {
        if (isset($newdictionaryid)) {
            if (in_array($newdictionaryid, $_SESSION['dictionaries'])) {
                //Clear is_current from all user's dictionaries and then update the one they chose, only if the chosen dictionary is valid.
                $query = "UPDATE `dictionaries` SET `is_current`=0 WHERE `user`=" . $_SESSION['user'] . ";";
                $query .= "UPDATE `dictionaries` SET `is_current`=1 WHERE `id`=" . $newdictionaryid . " AND `user`=" . $_SESSION['user'] . ";";
                $update = query($query);
                
                if ($update) {
                    if ($returndictionary) {
                        Load_Current_Dictionary();
                    } else {
                        echo "dictionary switched";
                    }
                    // return true;
                } else {
                    echo "could not update";
                }
            } else {
                echo "invalid dictionary";
            }
        } else {
            echo "no info provided";
        }
    } else {
        echo "not logged in";
    }
    return false;
}

function Delete_Current_Dictionary() {
    if ($_SESSION['user'] > 0) {
        if (isset($_SESSION['dictionary'])) {
            if (in_array($_SESSION['dictionary'], $_SESSION['dictionaries'])) {
                //Clear is_current from all user's dictionaries and then update the one they chose, only if the chosen dictionary is valid.
                $query = "DELETE FROM `dictionaries` WHERE `id`=" . $_SESSION['dictionary'] . " AND `user`=" . $_SESSION['user'] . ";";
                $update = query($query);
                
                if ($update) {
                    Get_Dictionaries(true);
                } else {
                    echo "could not delete";
                }
            } else {
                echo "invalid dictionary";
            }
        } else {
            echo "no current dictionary";
        }
    } else {
        echo "not logged in";
    }
    return false;
}
?>

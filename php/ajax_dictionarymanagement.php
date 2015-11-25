<?php
require_once("../required.php");

session_start();

if ($_GET['action'] == 'getall') {
    Get_Dictionaries();
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
    Switch_Current_Dictionary();
}

function Get_Dictionaries() {
    if (isset($_SESSION['user'])) {
        if ($_SESSION['user'] > 0) {
            $query = "SELECT `id`, `name` FROM `dictionaries` WHERE `user`=" . $_SESSION['user'] . " ORDER BY `name` ASC;";
            $dictionaries = query($query);
            
            if ($dictionaries) {
                if (num_rows($dictionaries) > 0) {
                    $list = "";
                    $_SESSION['dictionaries'] = [];
                    while ($dict = fetch($dictionaries)) {
                        $_SESSION['dictionaries'][] = $dict['id'];  // Save a list of all dictionaries user has.
                        //list for the switch dictionaries dropdown.
                        $list .= $dict['id'] . '_IDNAMESEPARATOR_' . $dict['name'] . '_DICTIONARYSEPARATOR_';
                    }
                    echo $list;
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
    } else {
        echo "no info provided";
    }
    return false;
}

function Load_Current_Dictionary() {
    if (isset($_SESSION['user'])) {
        $query = "SELECT `d`.`id`, `d`.`name`, `d`.`description`, `u`.`public_name`, `d`.`words`, `d`.`allow_duplicates`, `d`.`case_sensitive`, `d`.`parts_of_speech`, `d`.`is_complete` ";
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
        echo "no info provided";
    }
    return false;
}

function Save_Current_DictionaryAsNew() {
    if (isset($_SESSION['user'])) {
        $dbconnection = new PDO('mysql:host=' . DATABASE_SERVERNAME . ';dbname=' . DATABASE_NAME . ';charset=utf8', DATABASE_USERNAME, DATABASE_PASSWORD);
        $dbconnection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $dbconnection->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
        $dbconnection->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

        $query = "INSERT INTO `dictionaries`(`user`, `is_current`, `name`, `description`, `words`, `allow_duplicates`, `case_sensitive`, `parts_of_speech`, `sort_by_equivalent`, `is_complete`, `is_public`) ";
        $query .= "VALUES (" . $_SESSION['user'] . ",1,'" . $_POST['name'] . "','" . $_POST['description'] . "','" . $_POST['words'] . "'," . $_POST['allowduplicates'] . "," . $_POST['casesensitive'] . ",'" . $_POST['partsofspeech'] . "'," . $_POST['sortbyequivalent'] . "," . $_POST['iscomplete'] . "," . $_POST['ispublic'] . ")";
        
        try {
            $update = $dbconnection->prepare($query);
            $update->execute();
            $_SESSION['dictionary'] = $conn->lastInsertId;
            $_SESSION['dictionaries'][] = $_SESSION['dictionary'];  //Add new id to valid dictionaries. 
            echo $_SESSION['dictionary'];
            return true;
        }
        catch (PDOException $ex) {
            $errorMessage = $dbconnection->errorInfo();
            echo "could not update:\n" . $errorMessage[2] . "\n" . $query;
        }
    } else {
        echo "no info provided";
    }
    return false;
}

function Update_Current_Dictionary() {
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
        echo "no info provided";
    }
    return false;
}

function Switch_Current_Dictionary() {
    if (isset($_POST['newdictionaryid']) && isset($_SESSION['user'])) {
        if (in_array($_POST['newdictionaryid'], $_SESSION['dictionaries'])) {
            //Clear is_current from all user's dictionaries and then update the one they chose, only if the chosen dictionary is valid.
            $query = "UPDATE `dictionaries` SET `is_current`=0 WHERE `user`=" . $_SESSION['user'] . ";";
            $query .= "UPDATE `dictionaries` SET `is_current`=1 WHERE `id`=" . $_POST['newdictionaryid'] . " AND `user`=" . $_SESSION['user'] . ";";
            $update = query($query);
            
            if ($update) {
                Load_Current_Dictionary();
                return true;
            } else {
                echo "could not update";
            }
        } else {
            echo "invalid dictionary";
        }
    } else {
        echo "no info provided";
    }
    return false;
}
?>

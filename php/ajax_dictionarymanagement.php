<?php
// require_once("../required.php");
require_once('config.php');
require_once(SITE_LOCATION . '/php/functions.php');

session_start();
if ($_SESSION['user'] > 0) {
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
    elseif ($_GET['action'] == 'wordall') {
        Save_New_Word(true);
    }
    elseif ($_GET['action'] == 'wordnew') {
        Save_New_Word(false);
    }
    elseif ($_GET['action'] == 'wordupdate') {
        Update_Word();
    }
    elseif ($_GET['action'] == 'switch') {
        Switch_Current_Dictionary($_POST['newdictionaryid'], true);
    }
    elseif ($_GET['action'] == 'delete') {
        Delete_Current_Dictionary();
    }
    elseif ($_GET['action'] == 'worddelete') {
        Delete_Word();
    }
} else {
    echo "not signed in";
}

function Get_Dictionaries($return_list = true) {
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
    return false;
}

function Load_Current_Dictionary() {
    $query = "SELECT `d`.`id`, `d`.`name`, `d`.`description`, `u`.`public_name`, `d`.`words`, `d`.`next_word_id`, `d`.`allow_duplicates`, `d`.`case_sensitive`, `d`.`parts_of_speech`, `d`.`sort_by_equivalent`, `d`.`is_complete`, `d`.`is_public` ";
    $query .= "FROM `dictionaries` AS `d` LEFT JOIN `users` AS `u` ON `user`=`u`.`id` WHERE `d`.`id`=`u`.`current_dictionary` AND `user`=" . $_SESSION['user'] . ";";
    $dictionary = query($query);
    
    if ($dictionary) {
        if (num_rows($dictionary) > 0) {
            if (num_rows($dictionary) === 1) {
                while ($dict = fetch($dictionary)) {
                    $_SESSION['dictionary'] = $dict['id'];
                    $json = '{"name":"' . $dict['name'] . '",';
                    $json .= '"description":"' . $dict['description'] . '",';
                    $json .= '"createdBy":"' . $dict['public_name'] . '",';
                    $json .= '"words":[' . Get_Dictionary_Words($_SESSION['dictionary']) . '],';
                    $json .= '"nextWordId":' . $dict['next_word_id'] . ',';
                    $json .= '"settings":{';
                    $json .= '"allowDuplicates":' . (($dict['allow_duplicates'] == 1) ? 'true' : 'false') . ',';
                    $json .= '"caseSensitive":' . (($dict['case_sensitive'] == 1) ? 'true' : 'false') . ',';
                    $json .= '"partsOfSpeech":"' . $dict['parts_of_speech'] . '",';
                    $json .= '"sortByEquivalent":' . (($dict['sort_by_equivalent'] == 1) ? 'true' : 'false') . ',';
                    $json .= '"isComplete":' . (($dict['is_complete'] == 1) ? 'true' : 'false') . ',';
                    $json .= '"isPublic":' . (($dict['is_public'] == 1) ? 'true' : 'false') . '},';
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
    return false;
}

function Get_Dictionary_Words($dictionary) {
    $query = "SELECT `w`.`word_id`, `w`.`name`, `w`.`pronunciation`, `w`.`part_of_speech`, `w`.`simple_definition`, `w`.`long_definition` ";
    $query .= "FROM `words` AS `w` LEFT JOIN `dictionaries` AS `d` ON `w`.`dictionary`=`d`.`id` WHERE `w`.`dictionary`=" . $dictionary . " ";
    $query .= "ORDER BY IF(`d`.`sort_by_equivalent`, `w`.`simple_definition`, `w`.`name`) COLLATE utf8_unicode_ci;";
    $words = query($query);

    $results = "";
    $processed = 0;
    
    if ($words) {
        if (num_rows($words) > 0) {
            while ($word = fetch($words)) {
                $results .= '{"name":"' . $word['name'] . '",';
                $results .= '"pronunciation":"' . $word['pronunciation'] . '",';
                $results .= '"partOfSpeech":"' . $word['part_of_speech'] . '",';
                $results .= '"simpleDefinition":"' . $word['simple_definition'] . '",';
                $results .= '"longDefinition":"' . $word['long_definition'] . '",';
                $results .= '"wordId":' . $word['word_id'] . '}';

                // If it's the last one, then don't add a comma.
                if (++$processed < num_rows($words)) {
                    $results .= ",";
                }
            }
        }
    }

    return $results;
}

function Save_Current_DictionaryAsNew() {
    $dbconnection = new PDO('mysql:host=' . DATABASE_SERVERNAME . ';dbname=' . DATABASE_NAME . ';charset=utf8', DATABASE_USERNAME, DATABASE_PASSWORD);
    $dbconnection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $dbconnection->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
    $dbconnection->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

    $query = "INSERT INTO `dictionaries`(`user`, `name`, `description`, `next_word_id`, `allow_duplicates`, `case_sensitive`, `parts_of_speech`, `sort_by_equivalent`, `is_complete`, `is_public`) ";
    $query .= "VALUES (" . $_SESSION['user'] . ",'" . $_POST['name'] . "','" . $_POST['description'] . "'," . $_POST['nextwordid'] . "," . $_POST['allowduplicates'] . "," . $_POST['casesensitive'] . ",'" . $_POST['partsofspeech'] . "'," . $_POST['sortbyequivalent'] . "," . $_POST['iscomplete'] . "," . $_POST['ispublic'] . ")";
    
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
        if (isset($_POST['nextwordid'])) {
            $query .= "`next_word_id`=" . $_POST['nextwordid'] . ", ";
        }
        if (isset($_POST['allowduplicates'])) {
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
    return false;
}

function Save_New_Word($multiple = false) {
    if (in_array($_GET['dict'], $_SESSION['dictionaries'])) {   // Make sure that the given dictionary is valid before using it in the query.
        // Allows users to update previously open dictionaries if they accidentally change dictionaries while in another window and go back.
        $worddata = json_decode(file_get_contents("php://input"), true);

        $dbconnection = new PDO('mysql:host=' . DATABASE_SERVERNAME . ';dbname=' . DATABASE_NAME . ';charset=utf8', DATABASE_USERNAME, DATABASE_PASSWORD);
        $dbconnection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $dbconnection->setAttribute(PDO::ATTR_EMULATE_PREPARES, true);
        $dbconnection->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

        $query = "UPDATE `dictionaries` SET `next_word_id`=" . $_GET['nextwordid'] . ", `last_updated`='" . date("Y-m-d H:i:s") . "' WHERE `id`=" . $_GET['dict'] . "; ";
        $query .= "INSERT IGNORE INTO `words`(`dictionary`, `word_id`, `name`, `pronunciation`, `part_of_speech`, `simple_definition`, `long_definition`) ";
        $query .= "VALUES ";
        if ($multiple) {
            for ($i = 0; $i < count($worddata); $i++) {
                if ($i > 0) {
                    $query .= ", ";
                }
                $query .= "(" . $_GET['dict'] . "," . $worddata[$i]['wordId'] . ",'" . $worddata[$i]['name'] . "','" . $worddata[$i]['pronunciation'] . "','" . $worddata[$i]['partOfSpeech'] . "','" . $worddata[$i]['simpleDefinition'] . "','" . $worddata[$i]['longDefinition'] . "')";
            }
        } else {
            $query .= "(" . $_GET['dict'] . "," . $worddata['wordId'] . ",'" . $worddata['name'] . "','" . $worddata['pronunciation'] . "','" . $worddata['partOfSpeech'] . "','" . $worddata['simpleDefinition'] . "','" . $worddata['longDefinition'] . "')";
        }
        $query .= ";";
        
        try {
            $update = $dbconnection->prepare($query);
            $update->execute();
            echo "added successfully";
            return true;
        }
        catch (PDOException $ex) {
            echo "could not update:\n" . $ex->getMessage() . "\n" . $query;
        }
    } else {
        echo "specified dictionary is not owned by user";
    }
    return false;
}

function Update_Word() {
    if (in_array($_GET['dict'], $_SESSION['dictionaries'])) {   // Make sure that the given dictionary is valid before using it in the query.
        // Allows users to update previously open dictionaries if they accidentally change dictionaries while in another window and go back.
        $worddata = json_decode(file_get_contents("php://input"), true);

        $query = "UPDATE `words` SET ";
        
        $query .= "`name`='" . $worddata['name'] . "', ";
        $query .= "`pronunciation`='" . $worddata['pronunciation'] . "', ";
        $query .= "`part_of_speech`='" . $worddata['partOfSpeech'] . "', ";
        $query .= "`simple_definition`='" . $worddata['simpleDefinition'] . "', ";
        $query .= "`long_definition`='" . $worddata['longDefinition'] . "', ";
        $query .= "`last_updated`='" . date("Y-m-d H:i:s") . "'";
        $query .= " WHERE `dictionary`=" . $_GET['dict'] . " AND `word_id`=" . $worddata['wordId'] . ";";
        $update = query($query);
        
        if ($update) {
            echo "updated successfully";
            return true;
        } else {
            echo "could not update";
        }
    } else {
        echo "specified dictionary is not owned by user";
    }
    return false;
}

function Switch_Current_Dictionary($newdictionaryid, $returndictionary = true) {
    if (isset($newdictionaryid)) {
        if (in_array($newdictionaryid, $_SESSION['dictionaries'])) {
            //Clear is_current from all user's dictionaries and then update the one they chose, only if the chosen dictionary is valid.
            $query .= "UPDATE `users` SET `current_dictionary`=" . $newdictionaryid . " WHERE `id`=" . $_SESSION['user'] . ";";
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
    return false;
}

function Delete_Current_Dictionary() {
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
    return false;
}

function Delete_Word() {
    if (isset($_SESSION['dictionary'])) {
        if (in_array($_POST['dict'], $_SESSION['dictionaries'])) {   // Make sure that the given dictionary is valid before using it in the query.
        // Allows users to update previously open dictionaries if they accidentally change dictionaries while in another window and go back.
            //Clear is_current from all user's dictionaries and then update the one they chose, only if the chosen dictionary is valid.
            $query = "DELETE FROM `words` WHERE `dictionary`=" . $_POST['dict'] . " AND `word_id`=" . $_POST['word'] . ";";
            $update = query($query);
            
            if ($update) {
                echo "deleted successfully";
            } else {
                echo "could not delete: " . $_POST['dict'] . "-" . $_POST['word'] . " caused a problem";
            }
        } else {
            echo "invalid dictionary";
        }
    } else {
        echo "no current dictionary";
    }
    return false;
}
?>

<?php
// Simplified PHP functions
function query ($query_string) {
    $dbconnection = new PDO('mysql:host=' . DATABASE_SERVERNAME . ';dbname=' . DATABASE_NAME . ';charset=utf8', DATABASE_USERNAME, DATABASE_PASSWORD);
	$dbconnection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	$dbconnection->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
	$dbconnection->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    try {
        $queryResults = $dbconnection->prepare($query_string);
        $queryResults->execute();
        return $queryResults;
    }
    catch (PDOException $ex) {
        return false;
    }
}
function num_rows ($query_results) {
    try {
        $rowcount = $query_results->rowcount();
        return $rowcount;
    }
    catch (PDOException $ex) {
        return false;
    }
}
function fetch ($query_results) {
    try {
        $fetchassoc = $query_results->fetch();
        return $fetchassoc;
    }
    catch (PDOException $ex) {
        return false;
    }
}
?>
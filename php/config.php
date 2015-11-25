<?php

define("ROOT", $_SERVER["DOCUMENT_ROOT"]);
define("SITE_NAME", "Lexiconga");
define("SITE_LOCATION", ROOT . "/.Lexiconga");    // For absolute file paths: SITE_LOCATION . "/whatever.php"
define("DATABASE_TYPE", "mysql");   //sqlite, mysql, pgsql

define("DATABASE_SERVERNAME", "host");
define("DATABASE_USERNAME", "username");
define("DATABASE_PASSWORD", "password");
define("DATABASE_NAME", "databasename");

$dbconnection = new PDO('mysql:host=' . DATABASE_SERVERNAME . ';dbname=' . DATABASE_NAME . ';charset=utf8', DATABASE_USERNAME, DATABASE_PASSWORD);
$dbconnection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$dbconnection->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
$dbconnection->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

define("DATABASE_CONNECTION", $dbconnection);

/*function connection() {
    // Fill this with relevant data.
    $servername = "host";
    $username = "username";
    $password = "password";
    $dbname = "database_name";

    $conn = new PDO('mysql:host=' . DATABASE_SERVERNAME . ';dbname=' . DATABASE_NAME . ';charset=utf8', DATABASE_USERNAME, DATABASE_PASSWORD);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
    $conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

    // Create connection
    // $conn = mysqli_connect($servername, $username, $password, $dbname);
    // Check connection
    // if (!$conn) {
    //     die("Connection failed: " . mysqli_connect_error());
    // }
    
    return $conn;
}*/
?>
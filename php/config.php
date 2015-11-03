<?php

define("ROOT", $_SERVER["DOCUMENT_ROOT"]);
define("SITE_NAME", "PHP Project");
define("SITE_LOCATION", ROOT . "");    // For absolute file paths: SITE_LOCATION . "/whatever.php"
define("DATABASE_TYPE", "mysql");   //sqlite, mysql, pgsql

function connection() {
    // Fill this with relevant data.
    $servername = "host";
    $username = "username";
    $password = "password";
    $dbname = "database_name";

    // Create connection
    $conn = mysqli_connect($servername, $username, $password, $dbname);
    // Check connection
    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }
    
    return $conn;
}
?>
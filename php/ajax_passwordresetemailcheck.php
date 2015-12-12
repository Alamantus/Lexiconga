<?php
// require_once("../required.php");
require_once('config.php');
require_once(SITE_LOCATION . '/php/functions.php');

$email = htmlspecialchars($_GET['email']);

if (EmailExists($email)) {
    echo "email exists";
} else {
    echo "bad email";
}
?>
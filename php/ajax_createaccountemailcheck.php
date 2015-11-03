<?php
require_once("../required.php");

$email = htmlspecialchars($_GET['email']);

if (EmailExists($email)) {
	echo "email exists";
} else {
	echo "ok";
}
?>
<?php
function Set_Password_Reset($email) {
    $date = date("Y-m-d H:i:s");
    $reset_code = random_string(20);
    $query = "UPDATE `users` SET `password_reset_code`=" . $reset_code . ", `password_reset_date`='" . $date . "' WHERE `email`='" . $email . ";";
    $reset = query($query);
    
    if ($reset) {
        return true;
    } else {
        return false;
    }
}

function Check_Password_Reset($email, $code) {
    $date = date("Y-m-d");
    $daterange = "'" . $date . " 00:00:00' AND '" . $date . " 23:59:59'";
    $query = "SELECT * FROM `users` WHERE `email`='" . $email . "' AND `password_reset_code`='" . $code . "' AND `password_reset_date` BETWEEN " . $daterange . ";";
    $users = query($query);
    
    if ($users && num_rows($users) === 1) {
        return true;
    } else {
        return false;
    }
}

function Reset_Password($password, $email) {
    $query = "UPDATE `users` SET `password`=" . crypt($password, $email) . ", `password_reset_date`='0000-00-00 00:00:00' WHERE `email`='" . $email . ";";
    $reset = query($query);
    
    if ($reset) {
        return true;
    } else {
        return false;
    }
}
?>
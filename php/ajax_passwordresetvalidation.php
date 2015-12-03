<?php
function Set_Password_Reset($email) {
    $date = date("Y-m-d H:i:s");
    $reset_code = random_string(20);
    $query = "UPDATE `users` SET `password_reset_code`=" . $reset_code . ", `password_reset_date`='" . $date . "' WHERE `email`='" . $email . ";";
    $reset = query($query);
    
    if ($reset) {
        $to = $email;
        $subject = "Here's your Lexiconga password reset link";
        $message = "Hello " . Get_Public_Name(Get_User_Id($email)) . "\n\nSomeone has requested a password reset link for your Lexiconga account. If it was you, you can reset your password by going to the link below and entering a new password for yourself:\n";
        $message .= "http://lexicon.ga/?action=passwordreset&code=" . $reset_code . "\n\n";
        $message .= "If it wasn't you who requested the link, you can ignore this email since it was only sent to you, but you might want to consider changing your password when you have a chance.\n\n";
        $message .= "The password link will only be valid for today until you use it.\n\n";
        $message .= "Thanks!\nThe Lexiconga Admins";
        $header = "From: help@lexicon.ga\r\n";

        if (mail($to, $subject, $message, $header)) {
            return true;
        } else {
            return "could not send";
        }
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
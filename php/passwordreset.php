<?php
function Set_Password_Reset($email) {
    $date = date("Y-m-d H:i:s");
    $reset_code = random_string(20);
    $query = "UPDATE `users` SET `password_reset_code`='" . $reset_code . "', `password_reset_date`='" . $date . "' WHERE `email`='" . $email . "';";
    $reset = query($query);
    
    if ($reset) {
        $to = $email;
        $subject = "Here's your Lexiconga password reset link";
        $message = "Hello " . Get_Public_Name_By_Email($email) . "\r\n\r\nSomeone has requested a password reset link for your Lexiconga account. If it was you, you can reset your password by going to the link below and entering a new password for yourself:\r\n";
        $message .= "http://lexicon.ga/?passwordreset&account=" . Get_User_Id($email) . "&code=" . $reset_code . "\r\n\r\n";
        $message .= "If it wasn't you who requested the link, you can ignore this email since it was only sent to you, but you might want to consider changing your password when you have a chance.\r\n\r\n";
        $message .= "The password link will only be valid for today until you use it.\r\n\r\n";
        $message .= "Thanks!\r\nThe Lexiconga Admins";
        $header = "From: Lexiconga Password Reset <donotreply@lexicon.ga>\r\n" .
                  "Reply-To: help@lexicon.ga\r\n" .
                  "X-Mailer: PHP/" . phpversion();

        if (mail($to, $subject, $message, $header)) {
            return true;
        } else {
            return "could not send";
        }
    } else {
        return false;
    }
}

function Check_Password_Reset($id, $code) {
    $date = date("Y-m-d");
    $daterange = "'" . $date . " 00:00:00' AND '" . $date . " 23:59:59'";
    $query = "SELECT * FROM `users` WHERE `id`='" . $id . "' AND `password_reset_code`='" . $code . "' AND `password_reset_date` BETWEEN " . $daterange . ";";
    $users = query($query);
    
    if ($users && num_rows($users) === 1) {
        return true;
    } else {
        return false;
    }
}

function Reset_Password($password, $email) {
    $query = "UPDATE `users` SET `password`='" . crypt($password, $email) . "', `password_reset_date`='0000-00-00 00:00:00' WHERE `email`='" . $email . "';";
    $reset = query($query);
    
    if ($reset) {
        return true;
    } else {
        return false;
    }
}
?>
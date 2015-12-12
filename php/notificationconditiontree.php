<?php
// Notification messages based on status.
if (isset($_SESSION['current_status']) && $_SESSION['current_status'] != "") {
    switch ($_SESSION['current_status']) {
        case "couldnotcreate":
            $notificationMessage = "Could not create account.<br>Please try again later.";
            break;
        case "emailcreateinvalid":
            $notificationMessage = "The email address used to create your account didn't work.<br>Please try another.";
            break;
        case "createemailorpasswordblank":
            $notificationMessage = "The create account form somehow got submitted without some essential information.<br>Please try filling it out again.";
            break;
        case "couldnotsendresetemail":
            $notificationMessage = "For some reason, the reset email could not be sent.<br>Please try again later.";
            break;
        case "couldnotsetresetlink":
            $notificationMessage = "The email address specified for password reset does not have an account.";
            break;
        case "emailresetinvalid":
            $notificationMessage = "The email address specified for password reset didn't work.<br>Please try again.";
            break;
        case "resetemailblank":
            $notificationMessage = "The password reset form somehow got submitted without some essential information.<br>Please try filling it out again.";
            break;
        case "loginfailed":
            $notificationMessage = "We couldn't log you in because your email or password was incorrect.<br>";
            
            $_SESSION['loginfailures'] += 1;
            if ($_SESSION['loginfailures'] < 10) {
                $notificationMessage .= "This is your <strong>" . ordinal($_SESSION['loginfailures']) . "</strong> failed attempt.<br>After 10 failures, you will not be able to log in for 1 hour.<br>Please try again.";
            } else {
                $_SESSION['loginlockouttime'] = time();
                $notificationMessage .= "Since you failed to log in successfully 10 times, you may not try again for 1 hour.";
            }
            break;
        case "emaildoesnotexist":
            $notificationMessage = "The email address you entered doesn't have an account.<br>Would you like to <span class='clickable' onclick='ShowInfo(\"loginForm\")'>create an account</span>?";
            break;
        case "emailinvalid":
            $notificationMessage = "The email address you entered didn't work.<br>Please try another.";
            break;
        case "resetlinkfailed":
            $notificationMessage = "The reset link used is not valid. Please make sure you have copied it correctly.";
            break;
        case "resetlinkinvalid":
            $notificationMessage = "The reset link used is not valid. Please make sure you have copied it correctly.";
            break;
        case "couldnotresetpassword":
            $notificationMessage = "Your password could not be reset at this time. Please try again later.<br>If you remember your old password, you may still use it to log in.";
            break;
        case "passwordresetinvalid":
            $notificationMessage = "Something went wrong in the password reset process. Please try again.";
            break;
        case "newpasswordblank":
            $notificationMessage = "All the necessary information did not make it through for your password reset. Please try again.";
            break;
        case "couldnotupdatesettings":
            $notificationMessage = "Could not update your account settings. Please try again.";
            break;
        case "accountsettingsinvalid":
            $notificationMessage = "The email address you entered was either not valid or is already in use by another user. Please choose a different email address if you want to update your account email.";
            break;
        case "createdaccountsuccessfully":
            $notificationMessage = "Your account was created successfully!<br>Please log in using the email address and password you used to create it and you can start accessing your dictionaries anywhere!";
            break;
        case "resetemailsent":
            $notificationMessage = "The password reset link has been sent to the email you specified.<br>If you do not see it in your inbox, please check your junk mail box just in case!<br>Be sure to use the link before the end of today or else you will need to request a new one.";
            break;
        case "showresetform":
            $notificationMessage = '<script>document.getElementById("notificationCloseButton").style.display = "none";</script>
<form id="resetPasswordForm" method="post" action="?resetpassword" style="text-align:left;">
    <h2 style="margin-top: 3px;">Reset Your Password</h2>
    <label><span>New Password</span>
        <input type="password" id="newPasswordField" name="password" />
    </label>
    <label><span>Confirm Password</span>
        <input type="password" id="newPasswordConfirmField" name="confirmpassword" />
    </label>
    <input type="hidden" name="account" value="' . Get_User_Email($_SESSION['reset_account']) . '" />
    <div id="resetPasswordError" style="font-weight:bold;color:red;"></div>
    <button type="submit" id="createAccountSubmitButton" onclick="ValidateResetPassword(); return false;">Set New Password</button>
</form>';
            break;
        case "passwordresetsuccessfully":
            $notificationMessage = "Your password has been successfully reset. You may now log in using your new password.";
            break;
        case "accountsettingsupdated":
            $notificationMessage = "Your settings have been updated.";
            break;
    }

    $_SESSION['current_status'] = "";
}

if (isset($_GET['logout']) && $current_user > 0) {
    session_destroy();
    header('Location: ./?loggedout');
}
elseif (isset($_GET['login']) && $current_user <= 0) {
    if (isset($_POST['email']) && isset($_POST['password'])) {
        if (filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
            if (EmailExists($_POST['email'])) {
                if (Validate_Login($_POST['email'], $_POST['password'])) {
                    $_SESSION['user'] = Get_User_Id($_POST['email']);
                } else {
                    $_SESSION['current_status'] = "loginfailed";
                }
            } else {
                $_SESSION['current_status'] = "emaildoesnotexist";
            }
        } else {
            $_SESSION['current_status'] = "emailinvalid";
        }
    } else {
        $_SESSION['current_status'] = "loginemailorpasswordblank";
    }
    header('Location: ./');
}
elseif (isset($_GET['createaccount'])) {
    if (isset($_POST['email']) && isset($_POST['password'])) {
        if (filter_var($_POST['email'], FILTER_VALIDATE_EMAIL) && !EmailExists($_POST['email'])) {
            if (query("INSERT INTO users (email, password, public_name, allow_email) VALUES ('" . $_POST['email'] . "','" . crypt($_POST['password'], $_POST['email']) . "','" . htmlspecialchars($_POST['publicname'], ENT_QUOTES) . "'," . (($_POST['allowemails'] != "on") ? 0 : 1) . ")")) {
                $_SESSION['current_status'] = "createdaccountsuccessfully";
            } else {
                $_SESSION['current_status'] = "couldnotcreate";
            }
        } else {
            $_SESSION['current_status'] = "emailcreateinvalid";
        }
    } else {
        $_SESSION['current_status'] = "createemailorpasswordblank";
    }
    header('Location: ./');
}
elseif (isset($_GET['forgot'])) {
    if (isset($_POST['email'])) {
        if (filter_var($_POST['email'], FILTER_VALIDATE_EMAIL) && EmailExists($_POST['email'])) {
            $reset_email = Set_Password_Reset($_POST['email']);
            if ($reset_email === true) {
                $_SESSION['current_status'] = "resetemailsent";
            } elseif ($reset_email === "could not send") {
                $_SESSION['current_status'] = "couldnotsendresetemail";
            } else {
                $_SESSION['current_status'] = "couldnotsetresetlink";
            }
        } else {
            $_SESSION['current_status'] = "emailresetinvalid";
        }
    } else {
        $_SESSION['current_status'] = "resetemailblank";
    }
    header('Location: ./');
}
elseif (isset($_GET['passwordreset'])) {
    if (isset($_GET['account']) && isset($_GET['code'])) {
        $reset_email = Check_Password_Reset($_GET['account'], $_GET['code']);
        if ($reset_email == true) {
            $_SESSION['current_status'] = "showresetform";
            $_SESSION['reset_account'] = $_GET['account'];
        } else {
            $_SESSION['current_status'] = "resetlinkfailed";
        }
    } else {
        $_SESSION['current_status'] = "resetlinkinvalid";
    }
    header('Location: ./');
}
elseif (isset($_GET['resetpassword'])) {
    if (isset($_POST['account']) && isset($_POST['password'])) {
        if (filter_var($_POST['account'], FILTER_VALIDATE_EMAIL) && EmailExists($_POST['account'])) {
            $reset_password_success = Reset_Password($_POST['password'], $_POST['account']);
            if ($reset_password_success == true) {
                $_SESSION['current_status'] = "passwordresetsuccessfully";
            } else {
                $_SESSION['current_status'] = "couldnotresetpassword";
            }
        } else {
            $_SESSION['current_status'] = "passwordresetinvalid";
        }
    } else {
        $_SESSION['current_status'] = "newpasswordblank";
    }
    header('Location: ./');
}
elseif (isset($_GET['accountsettings'])) {
    if (filter_var($_POST['email'], FILTER_VALIDATE_EMAIL) &&
        ($_POST['email'] == Get_User_Email($current_user) || !EmailExists($_POST['email'])))
    {
        $public_name = (isset($_POST['publicname']) && $_POST['publicname'] != "") ? $_POST['publicname'] : "Someone";
        if (query("UPDATE `users` SET `email`='" . $_POST['email'] . "', `public_name`='" . htmlspecialchars($public_name, ENT_QUOTES) . "', `allow_email`=" . (($_POST['allowemails'] != "on") ? 0 : 1) . " WHERE `id`=" . $current_user . ";")) {
            $_SESSION['current_status'] = "accountsettingsupdated";
        } else {
            $_SESSION['current_status'] = "couldnotupdatesettings";
        }
    } else {
        $_SESSION['current_status'] = "accountsettingsinvalid";
    }
    header('Location: ./');
}
elseif (isset($_GET['loggedout']) && $current_user <= 0) {
    $notificationMessage = "You have been successfully logged out.<br>You will only be able to use the dictionary saved to your browser.";
} elseif ($current_user > 0) {
    if ($notificationMessage != "") {
        $notificationMessage = "Welcome back, " . Get_Public_Name_By_Id($current_user) . "!<br>" . $notificationMessage;
    }  else {
        $notificationMessage = "Welcome back, " . Get_Public_Name_By_Id($current_user) . "!";
    }
}
?>
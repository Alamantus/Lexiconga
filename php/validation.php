<?php
function EmailExists($email) {
    $query = "SELECT * FROM `users` WHERE `email`='" . $email . "'";
    $users = query($query);
    
    if ($users && num_rows($users) > 0) {
        return true;
    } else {
        return false;
    }
}

function Validate_Login($email, $password) {
    $hashed_pw = crypt($password, $email);
    $query = "SELECT * FROM `users` WHERE `email`='" . $email . "' AND `password`='" . $hashed_pw . "'";
    $users = query($query);
    
    if ($users && num_rows($users) === 1) {
        return true;
    } else {
        return false;
    }
}

function Get_User_Id($email) {
    $query = "SELECT `id` FROM `users` WHERE `email`='" . $email . "'";
    $users = query($query);
    
    if ($users && num_rows($users) > 0) {
        if (num_rows($users) === 1) {
            $user = fetch($users);
            return $user["id"];
        } else {
            return "More than one user id returned!";
        }
    } else {
        return "No User";
    }
}

function Get_User_Email($id) {
    $query = "SELECT `email` FROM `users` WHERE `id`='" . $id . "'";
    $users = query($query);
    
    if ($users && num_rows($users) > 0) {
        if (num_rows($users) === 1) {
            $user = fetch($users);
            return $user["email"];
        } else {
            return "More than one user id returned!";
        }
    } else {
        return "No User";
    }
}

function Get_Public_Name_By_Id($id) {
    $query = "SELECT `public_name` FROM `users` WHERE `id`=" . $id . ";";
    $users = query($query);
    
    if ($users && num_rows($users) > 0) {
        if (num_rows($users) === 1) {
            $user = fetch($users);
            return $user["public_name"];
        } else {
            return "More than one public name returned!";
        }
    } else {
        return "No User";
    }
}

function Get_Public_Name_By_Email($email) {
    $query = "SELECT `public_name` FROM `users` WHERE `email`='" . $email . "';";
    $users = query($query);
    
    if ($users && num_rows($users) > 0) {
        if (num_rows($users) === 1) {
            $user = fetch($users);
            return $user["public_name"];
        } else {
            return "More than one public name returned!";
        }
    } else {
        return "No User";
    }
}

function Get_Allow_Email_By_Id($id) {
    $query = "SELECT `allow_email` FROM `users` WHERE `id`=" . $id . ";";
    $users = query($query);
    
    if ($users && num_rows($users) > 0) {
        if (num_rows($users) === 1) {
            $user = fetch($users);
            return $user["allow_email"];
        } else {
            return "More than one user returned!";
        }
    } else {
        return "No User";
    }
}
?>
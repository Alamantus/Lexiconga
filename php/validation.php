<?php
function EmailExists($email) {
    $query = "SELECT * FROM users WHERE email='" . $email . "'";
    $users = query($query);
    
    if ($users && num_rows($users) > 0) {
        return true;
    } else {
        return false;
    }
}

function Validate_Login($email, $password) {
    $hashed_pw = crypt($password, $email);
    $query = "SELECT * FROM users WHERE email='" . $email . "' AND password='" . $hashed_pw . "'";
    $users = query($query);
    
    if ($users && num_rows($users) === 1) {
        return true;
    } else {
        return false;
    }
}

function Get_User_Id($email) {
    $query = "SELECT id FROM users WHERE email='" . $email . "'";
    $users = query($query);
    
    if ($users && num_rows($users) > 0) {
        if (num_rows($users) === 1) {
            while($user = fetch_assoc($users)) {
                return $user["id"];
            }
        } else {
            return "More than one user id returned!";
        }
    } else {
        return "No User";
    }
}

function Get_Public_Name($id) {
    $query = "SELECT public_name FROM users WHERE id=" . $id;
    $users = query($query);
    
    if ($users && num_rows($users) > 0) {
        if (num_rows($users) === 1) {
            while($user = fetch_assoc($users)) {
                return $user["public_name"];
            }
        } else {
            return "More than one public name returned!";
        }
    } else {
        return "No User";
    }
}
?>
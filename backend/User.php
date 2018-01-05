<?php
require_once('./Db.php');
require_once('./Token.php');
require_once('./Dictionary.php');

class User {
  private $db;
  private $token;
  function __construct () {
    $this->db = new Db();
    $this->token = new Token();
    $this->dictionary = new Dictionary();
  }

  public function logIn ($email, $password) {
    $query = 'SELECT * FROM users WHERE email=?';
    $user = $this->db->query($query, array($email))->fetch();
    if ($user) {
      if ($user['old_password'] !== null) {
        if ($user['old_password'] === crypt($password, $email)) {
          if ($this->upgradePassword($password)) {
            return $this->logIn($email, $password);
          }
        }
      } else if (password_verify($password, $user['password'])) {
        $user_data = array(
          'id' => $user['id'],
          'isMember' => $this->hasMembership($user['id']),
          'dictionary' => $user['current_dictionary'],
        );
        return $this->token->encode($user_data);
      }
    }
    return false;
  }

  public function emailExists ($email) {
    $query = 'SELECT * FROM users WHERE email=?';
    $user = $this->db->query($query, array($email));
    return $user->rowCount() > 0;
  }

  public function create ($email, $password) {
    $insert_user_query = 'INSERT INTO users (email, password) VALUES (?, ?)';
    $password_hash = password_hash($password, PASSWORD_DEFAULT);

    $insert_user = $this->db->execute($insert_user_query, array($email, $password_hash));
    if ($insert_user === true) {
      $new_user_id = $this->db->lastInsertId();

      $token = $this->dictionary->create($new_user_id);

      if ($token !== false) {
        return $token;
      }
    }

    return false;
  }

  public function createNewDictionary ($token) {
    $user_data = $this->token->decode($token);
    if ($user_data !== false) {
      $id = $user_data->id;
      return $this->dictionary->create($id);
    }
    return false;
  }

  public function changeCurrentDictionary ($user, $dictionary) {
    $update_query = 'UPDATE users SET current_dictionary=? WHERE id=?';
    $update = $this->db->query($update_query, array($dictionary, $user));
    if ($update->rowCount() > 0) {
      return true;
    }
    return false;
  }

  public function listAllDictionaryNames ($token) {
    $user_data = $this->token->decode($token);
    if ($user_data !== false) {
      $id = $user_data->id;
      return $this->dictionary->getAllNames($id);
    }
    return false;
  }

  private function hasMembership ($id) {
    $current_membership = "SELECT * FROM memberships WHERE user=$id AND start_date>=CURRENT_TIMESTAMP AND CURRENT_TIMESTAMP<expire_date";
    return $this->db->query($current_membership)->rowCount() > 0;
  }

  private function upgradePassword ($password) {
    $new_password = password_hash($password, PASSWORD_DEFAULT);
    $update_query = 'UPDATE users SET old_password=NULL, password=? WHERE id=' . $user['id'];
    $stmt = $this->db->query($update_query, array($new_password));
    return $stmt->rowCount() === 1;
  }
}
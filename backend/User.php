<?php
require_once('./Db.php');
require_once('./Token.php');

class User {
  private $db;
  private $token;
  function __construct () {
    $this->db = new Db();
    $this->token = new Token();
  }

  public function logIn ($email, $password) {
    $query = 'SELECT * FROM users WHERE email=?';
    $user = $this->db->query($query, array($email))->fetch();
    if ($user) {
      if ($user['old_password'] !== 'NULL') {
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

      $token = $this->createDictionary($new_user_id);

      if ($token !== false) {
        return $token;
      }
    }

    return false;
  }

  public function createDictionary ($user) {
    $insert_dictionary_query = "INSERT INTO dictionaries (user) VALUES ($user)";
    $insert_dictionary = $this->db->execute($insert_dictionary_query);

    if ($insert_dictionary === true) {
      $new_dictionary_id = $this->db->lastInsertId();

      $insert_linguistics_query = "INSERT INTO dictionary_linguistics (dictionary) VALUES ($new_dictionary_id)";
      $insert_linguistics = $this->db->execute($insert_linguistics_query);

      if ($insert_linguistics === true) {
        if ($this->changeCurrentDictionary($user, $new_dictionary_id)) {
          $user_data = array(
            'id' => $user,
            'isMember' => $this->hasMembership($user),
            'dictionary' => $new_dictionary_id,
          );
          return $this->token->encode($user_data);
        }
      }
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

  private function hasMembership ($id) {
    $current_membership = "SELECT * FROM memberships WHERE user=$id AND start_date>=CURRENT_TIMESTAMP AND CURRENT_TIMESTAMP<expire_date";
    $stmt = $this->db->query($current_membership)->rowCount() > 0;
  }

  private function upgradePassword ($password) {
    $new_password = password_hash($password, PASSWORD_DEFAULT);
    $update_query = 'UPDATE users SET old_password=NULL, password=? WHERE id=' . $user['id'];
    $stmt = $this->db->query($update_query, array($new_password));
    return $stmt->rowCount() === 1;
  }
}
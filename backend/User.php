<?php
require_once('./Db');
require_once('./Token');

class User {
  private $db;
  private $token;
  function _construct () {
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

  public function hasMembership ($id) {
    $current_membership = "SELECT * FROM memberships WHERE user=$id AND start_date>=CURRENT_TIMESTAMP AND CURRENT_TIMESTAMP<expire_date";
    $stmt = $this->db->query($current_membership)->rowCount() > 0;
  }

  public function upgradePassword ($password) {
    $new_password = password_hash($password, PASSWORD_DEFAULT);
    $update_query = 'UPDATE users SET old_password=NULL, password=? WHERE id=' . $user['id'];
    $stmt = $this->db->query($update_query, array($new_password));
    return $stmt->rowCount() === 1;
  }
}
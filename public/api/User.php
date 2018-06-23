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
    $query = 'SELECT * FROM users WHERE email=:email OR username=:email';
    $user = $this->db->query($query, array(':email' => $email))->fetch();
    if ($user) {
      if ($user['old_password'] !== null) {
        if ($user['old_password'] === crypt($password, $email)) {
          if ($this->upgradePassword($password)) {
            return $this->logIn($email, $password);
          }
        }
      } else if (password_verify($password, $user['password'])) {
        $this->db->execute('UPDATE users SET last_login=' . time() . ' WHERE id=' . $user['id']);
        return array(
          'token' => $this->generateUserToken($user['id'], $user['current_dictionary']),
          'user' => $this->getUserData($user['id']),
        );
      }
    }
    return false;
  }

  public function emailExists ($email) {
    $query = 'SELECT * FROM users WHERE email=?';
    $user = $this->db->query($query, array($email));
    return $user->rowCount() > 0;
  }

  public function usernameExists ($username) {
    $query = 'SELECT * FROM users WHERE username=?';
    $user = $this->db->query($query, array($username));
    return $user->rowCount() > 0;
  }

  public function create ($email, $password, $user_data) {
    $insert_user_query = 'INSERT INTO users (email, password, public_name, username, allow_email, created_on)
VALUES (?, ?, ?, ?, ?, ?)';
    $password_hash = password_hash($password, PASSWORD_DEFAULT);

    $insert_user = $this->db->execute($insert_user_query, array(
      $email,
      $password_hash,
      $user_data['publicName'] !== '' ? $user_data['publicName'] : null,
      $user_data['username'] !== '' ? $user_data['username'] : null,
      $user_data['allowEmail'] ? 1 : 0,
      time(),
    ));
    if ($insert_user === true) {
      $new_user_id = $this->db->lastInsertId();

      $new_dictionary = $this->dictionary->create($new_user_id);

      if (isset($new_dictionary['error'])) {
        return $new_dictionary;
      } else {
        return array(
          'token' => $this->generateUserToken($new_user_id, $new_dictionary),
          'user' => $this->getUserData($new_user_id),
        );
      }
    }

    return array(
      'error' => '"INSERT INTO users" failed: ' . $this->db->last_error_info[2],
    );
  }

  public function setUserData ($token, $user_data) {
    $token_data = $this->token->decode($token);
    if ($token_data !== false) {
      $query = 'UPDATE users SET email=?, public_name=?, username=?, allow_email=? WHERE id=?';
      $properties = array(
        $user_data['email'],
        $user_data['publicName'],
        $user_data['username'],
        $user_data['allowEmail'],
        $user_id,
      );
      $update_success = $this->db->execute($query, $properties);
      if ($update_success) {
        return array(
          'token' => $token,
          'userData' => $user_data,
        );
      }
    }

    return false;
  }

  public function getUserData ($user_id) {
    $query = 'SELECT * FROM users WHERE id=?';
    $stmt = $this->db->query($query, array($user_id));
    $user = $stmt->fetch();
    if ($stmt && $user) {
      return array(
        'email' => $user['email'],
        'username' => $user['username'],
        'publicName' => $user['public_name'],
        'allowEmails' => $user['allow_email'] == 1 ? true : false,
      );
    }

    return false;
  }

  public function createNewDictionary ($token) {
    $user_data = $this->token->decode($token);
    if ($user_data !== false) {
      $id = $user_data->id;
      $new_dictionary = $this->dictionary->create($id);
      if (!isset($new_dictionary['error'])) {
        return array(
            'token' => $this->generateUserToken($id, $new_dictionary),
            'dictionary' => $this->getCurrentDictionary($token),
          );
      } else {
        return $new_dictionary;
      }
    }
    return array(
      'error' => 'invalid token',
    );
  }

  public function changeCurrentDictionary ($token, $dictionary_hash) {
    $user_data = $this->token->decode($token);
    if ($user_data !== false) {
      $id = $user_data->id;
      $dictionary_id = $this->token->unhash($dictionary_hash);
      if ($dictionary_id !== false) {
        $changed_dictionary = $this->dictionary->changeCurrent($id, $dictionary_id);
        if ($changed_dictionary !== false) {
          return array(
            'token' => $this->generateUserToken($id, $changed_dictionary),
            'dictionary' => $this->getCurrentDictionary($token),
          );
        }
      }
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

  public function getCurrentDictionary ($token) {
    $user_data = $this->token->decode($token);
    if ($user_data !== false) {
      $user = $user_data->id;
      $dictionary = $user_data->dictionary;
      return array(
        'details' => $this->dictionary->getDetails($user, $dictionary),
        'words' => $this->dictionary->getWords($user, $dictionary),
      );
    }
    return false;
  }

  public function saveWholeCurrentDictionary ($token, $dictionary_data) {
    $user_data = $this->token->decode($token);
    if ($user_data !== false) {
      $user = $user_data->id;
      $dictionary = $user_data->dictionary;
      $details_updated = $this->dictionary->setDetails($user, $dictionary, $dictionary_data['details']);
      $words_updated = $this->dictionary->setWords($dictionary, $dictionary_data['words']);
      return $details_updated && $words_updated;
    }
    return false;
  }

  public function updateCurrentDictionaryDetails ($token, $dictionary_details) {
    $user_data = $this->token->decode($token);
    if ($user_data !== false) {
      $user = $user_data->id;
      $dictionary = $user_data->dictionary;
      return $this->dictionary->setDetails($user, $dictionary, $dictionary_details);
    }
    return false;
  }

  public function updateOrAddWordsToCurrentDictionary ($token, $words) {
    // Useful even for just one word
    $user_data = $this->token->decode($token);
    if ($user_data !== false) {
      $dictionary = $user_data->dictionary;
      $updated_words = $this->dictionary->setWords($dictionary, $words);
      if ($updated_words > 0) {
        return true;
      }
    }
    return false;
  }

  private function generateUserToken ($user_id, $dictionary_id) {
    $user_data = array(
      'id' => intval($user_id),
      'isMember' => $this->hasMembership($user_id),
      'dictionary' => intval($dictionary_id),
    );
    return $this->token->encode($user_data);
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
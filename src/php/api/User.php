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
    $query = 'SELECT * FROM users WHERE email=:email';
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
        $token = $this->generateUserToken($user['id'], $user['current_dictionary']);
        return array(
          'token' => $token,
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

  public function create ($email, $password, $user_data) {
    $insert_user_query = 'INSERT INTO users (email, password, public_name, allow_email, created_on)
VALUES (?, ?, ?, ?, ?)';
    $password_hash = password_hash($password, PASSWORD_DEFAULT);

    $insert_user = $this->db->execute($insert_user_query, array(
      $email,
      $password_hash,
      $user_data['publicName'] !== '' ? $user_data['publicName'] : null,
      $user_data['allowEmail'] ? 1 : 0,
      time(),
    ));
    if ($insert_user === true) {
      $new_user_id = $this->db->lastInsertId();

      $new_dictionary = $this->dictionary->create($new_user_id);

      if (isset($new_dictionary['error'])) {
        return $new_dictionary;
      } else {
        $token = $this->generateUserToken($new_user_id, $new_dictionary);
        return array(
          'token' => $token,
          'user' => $this->getUserData($new_user_id),
        );
      }
    }

    return array(
      'error' => '"INSERT INTO users" failed: ' . $this->db->last_error_info[2],
    );
  }

  public function validateToken ($token) {
    $token_data = $this->token->decode($token);
    if ($token_data !== false) {
      if (isset($token_data->id)) {
        return $this->getUserData($token_data->id);
      }
    }
    return false;
  }

  public function setUserData ($token, $user_data) {
    $token_data = $this->token->decode($token);
    if ($token_data !== false) {
      $user_id = $token_data->id;
      $query = 'UPDATE users SET email=?, public_name=?, allow_email=?';
      $properties = array(
        $user_data['email'],
        $user_data['publicName'],
        $user_data['allowEmails'],
      );
      if (isset($user_data['newPassword']) && $user_data['newPassword'] !== '') {
        $query .= ', password=?';
        $properties[] = password_hash($user_data['newPassword'], PASSWORD_DEFAULT);
      }
      $query .= ' WHERE id=?';
      $properties[] = $user_id;
      $update_success = $this->db->execute($query, $properties);
      if ($update_success) {
        return true;
      }
      return array(
        'error' => $this->db->last_error_info,
      );
    }

    return false;
  }

  public function getUserData ($user_id) {
    $query = 'SELECT email, public_name, allow_email FROM users WHERE id=?';
    $stmt = $this->db->query($query, array($user_id));
    $user = $stmt->fetch();
    if ($stmt && $user) {
      return array(
        'email' => $user['email'],
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
        $new_token = $this->generateUserToken($id, $new_dictionary);
        return array(
            'token' => $new_token,
            'dictionary' => $this->getCurrentDictionary($new_token),
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
          $new_token = $this->generateUserToken($id, $changed_dictionary);
          return array(
            'token' => $new_token,
            'dictionary' => $this->getCurrentDictionary($new_token),
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
        'deletedWords' => $this->dictionary->getDeletedWords($user, $dictionary),
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
      if ($details_updated === true && $words_updated === true) {
        return $this->token->hash($dictionary);
      }
      return array(
        'error' => ($details_updated !== true ? $details_updated . ' ' : '') . ($words_updated !== true ? $words_updated : ''),
      );
    }
    return false;
  }

  public function deleteCurrentDictionary ($token) {
    $user_data = $this->token->decode($token);
    if ($user_data !== false) {
      $user = $user_data->id;
      $dictionary = $user_data->dictionary;
      $deleted = $this->dictionary->deleteDictionary($user, $dictionary);
      if ($deleted) {
        return true;
      }
    }
    return false;
  }

  public function updateCurrentDictionaryDetails ($token, $dictionary_details) {
    $user_data = $this->token->decode($token);
    if ($user_data !== false) {
      $user = $user_data->id;
      $dictionary = $user_data->dictionary;
      $details_updated = $this->dictionary->setDetails($user, $dictionary, $dictionary_details);
      if ($details_updated === true) {
        return true;
      }
      return array(
        'error' => $details_updated,
      );
    }
    return false;
  }

  public function updateOrAddWordsToCurrentDictionary ($token, $words) {
    // Useful even for just one word
    $user_data = $this->token->decode($token);
    if ($user_data !== false) {
      $dictionary = $user_data->dictionary;
      $user = $user_data->id;
      $updated_words = $this->dictionary->setWords($user, $dictionary, $words);
      if ($updated_words === true) {
        return true;
      }
      return array(
        'error' => $updated_words,
      );
    }
    return false;
  }

  public function deleteWordsFromCurrentDictionary ($token, $word_ids) {
    // Useful even for just one word
    $user_data = $this->token->decode($token);
    if ($user_data !== false) {
      $dictionary = $user_data->dictionary;
      $user = $user_data->id;
      $deleted_words = $this->dictionary->deleteWords($dictionary, $word_ids);
      if ($deleted_words === true) {
        return $deleted_words;
      }
      return array(
        'error' => $deleted_words,
      );
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
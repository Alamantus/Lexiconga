<?php
require_once('./Db.php');
require_once('./Token.php');

class Dictionary {
  private $db;
  private $token;
  function __construct () {
    $this->db = new Db();
    $this->token = new Token();
  }

  public function create ($user) {
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

  public function changeCurrent ($user, $dictionary) {
    $update_query = 'UPDATE users SET current_dictionary=? WHERE id=?';
    $update = $this->db->query($update_query, array($dictionary, $user));
    if ($update->rowCount() > 0) {
      return true;
    }
    return false;
  }

  public function getAllNames ($user) {
    $query = "SELECT id, name, specification FROM dictionaries WHERE user=$user";
    $results = $this->db->query($query)->fetchAll();
    if ($results) {
      return array_map(function($result) {
        return array(
          'id' => $this->token->hash($result['id']),
          'name' => $result['name'] . ' ' . $result['specification'],
        );
      }, $results);
    }
    return array();
  }
}
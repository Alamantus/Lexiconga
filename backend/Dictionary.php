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
        return $this->changeCurrent($user, $new_dictionary_id);
      }
    }

    return false;
  }

  public function changeCurrent ($user, $dictionary) {
    $update_query = 'UPDATE users SET current_dictionary=? WHERE id=?';
    $update = $this->db->query($update_query, array($dictionary, $user));
    if ($update->rowCount() > 0) {
      return $dictionary;
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

  public function getDetails ($user, $dictionary) {
    $query = "SELECT * FROM dictionaries JOIN dictionary_linguistics ON dictionary = id WHERE user=$user AND id=$dictionary";
    $result = $this->db->query($query)->fetch();
    if ($result) {
      return array(
        'id' => $this->token->hash($result['id']),
        'name' => $result['name'],
        'specification' => $result['specification'],
        'description' => $result['description'],
        'partsOfSpeech' => json_decode($result['parts_of_speech']),
        'details' => array(
          'phonology' => json_decode($result['phonology']),
          'orthography' => array(
            'notes' => $result['orthography_notes'],
          ),
          'grammar' => array(
            'notes' => $result['grammar_notes'],
          ),
        ),
        'settings' => array(
          'allowDuplicates' => $result['allow_duplicates'] === '1' ? true : false,
          'caseSensitive' => $result['case_sensitive'] === '1' ? true : false,
          'sortByDefinition' => $result['sort_by_definition'] === '1' ? true : false,
          'isComplete' => $result['is_complete'] === '1' ? true : false,
          'isPublic' => $result['is_public'] === '1' ? true : false,
        ),
        'lastUpdated' => $result['last_updated'],
        'createdOn' => $result['created_on'],
      );
    }
    return false;
  }

  public function getWords ($user, $dictionary) {
    $query = "SELECT words.* FROM words JOIN dictionaries ON id = dictionary WHERE dictionary=$dictionary AND user=$user";
    $results = $this->db->query($query)->fetchAll();
    if ($results) {
      return array_map(function ($row) {
        return array(
          'id' => $result['word_id'],
          'name' => $result['name'],
          'pronunciation' => $result['pronunciation'],
          'partOfSpeech' => $result['part_of_speech'],
          'definition' => $result['definition'],
          'details' => $result['details'],
          'lastUpdated' => $result['last_updated'],
          'createdOn' => $result['created_on'],
        );
      }, $results);
    }
    return false;
  }
}
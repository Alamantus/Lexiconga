<?php
require_once('./Db.php');
require_once('./Token.php');

class Dictionary {
  private $db;
  private $token;
  private $defaults;
  function __construct () {
    $this->db = new Db();
    $this->token = new Token();

    $this->defaults = array(
      'partsOfSpeech' => array("Noun","Adjective","Verb"),
      'phonology'=> array(
        'consonants' => array(),
        'vowels' => array(),
        'blends' => array(),
        'phonotactics' => array(
          'onset' => array(),
          'nucleus' => array(),
          'coda' => array(),
          'exceptions' => '',
        ),
      ),
    );
  }

  public function create ($user) {
    $insert_dictionary_query = "INSERT INTO dictionaries (user, created_on) VALUES ($user, " . time() . ")";
    $insert_dictionary = $this->db->execute($insert_dictionary_query);

    if ($insert_dictionary === true) {
      $new_dictionary_id = $this->db->lastInsertId();

      $insert_linguistics_query = "INSERT INTO dictionary_linguistics (dictionary, parts_of_speech, phonology)
VALUES ($new_dictionary_id, ?, ?)";
      $insert_linguistics = $this->db->execute($insert_linguistics_query, array(
        json_encode($this->defaults['partsOfSpeech']),
        json_encode($this->defaults['phonology']),
      ));

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
      // Default json values in case they are somehow not created by front end first
      $partsOfSpeech = $result['parts_of_speech'] !== '' ? json_decode($result['parts_of_speech']) : $this->defaults['partsOfSpeech'];
      $phonology = $result['phonology'] !== '' ? json_decode($result['phonology']) : $this->defaults['phonology'];

      return array(
        'id' => $this->token->hash($result['id']),
        'name' => $result['name'],
        'specification' => $result['specification'],
        'description' => $result['description'],
        'partsOfSpeech' => $partsOfSpeech,
        'details' => array(
          'phonology' => $phonology,
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
        'lastUpdated' => is_null($result['last_updated']) ? null : $result['last_updated'],
        'createdOn' => $result['created_on'],
      );
    }
    return false;
  }

  public function setDetails ($user, $dictionary, $dictionary_object) {
    $query1 = "UPDATE dictionaries
SET name=:name,
  specification=:specification,
  description=:description,
  allow_duplicates=:allow_duplicates,
  case_sensitive=:case_sensitive,
  sort_by_definition=:sort_by_definition,
  is_complete=:is_complete,
  is_public=:is_public,
  last_updated=:last_updated,
  created_on=:created_on
WHERE user=$user AND id=$dictionary";

    // $result1 = $this->db->query($query1, array(
    $result1 = $this->db->execute($query1, array(
      ':name' => $dictionary_object['name'],
      ':specification' => $dictionary_object['specification'],
      ':description' => $dictionary_object['description'],
      ':allow_duplicates' => $dictionary_object['settings']['allowDuplicates'],
      ':case_sensitive' => $dictionary_object['settings']['caseSensitive'],
      ':sort_by_definition' => $dictionary_object['settings']['sortByDefinition'],
      ':is_complete' => $dictionary_object['settings']['isComplete'],
      ':is_public' => $dictionary_object['settings']['isPublic'],
      ':last_updated' => $dictionary_object['lastUpdated'],
      ':created_on' => $dictionary_object['createdOn'],
    ));
    // if ($result1->rowCount() > 0) {
    if ($result1 === true) {
      $linguistics = $dictionary_object['details'];
      $query2 = "UPDATE dictionary_linguistics
SET parts_of_speech=:parts_of_speech,
  phonology=:phonology,
  orthography_notes=:orthography_notes,
  grammar_notes=:grammar_notes
WHERE dictionary=$dictionary";

      // $result2 = $this->db->query($query2, array(
      $result2 = $this->db->execute($query2, array(
        ':parts_of_speech' => json_encode($dictionary_object['partsOfSpeech']),
        ':phonology' => json_encode($linguistics['phonology']),
        ':orthography_notes' => $linguistics['orthography']['notes'],
        ':grammar_notes' => $linguistics['grammar']['notes'],
      ));

      // if ($result2->rowCount() > 0) {
      if ($result2 === true) {
        return true;
      }
      // return $result2->errorInfo();
    }
    // return $result1->errorInfo();
    return false;
  }

  public function getWords ($user, $dictionary) {
    $query = "SELECT words.* FROM words JOIN dictionaries ON id = dictionary WHERE dictionary=$dictionary AND user=$user";
    $results = $this->db->query($query)->fetchAll();
    if ($results) {
      return array_map(function ($row) {
        return array(
          'id' => intval($row['word_id']),
          'name' => $row['name'],
          'pronunciation' => $row['pronunciation'],
          'partOfSpeech' => $row['part_of_speech'],
          'definition' => $row['definition'],
          'details' => $row['details'],
          'lastUpdated' => is_null($row['last_updated']) ? null : intval($row['last_updated']),
          'createdOn' => intval($row['created_on']),
        );
      }, $results);
    }
    return array();
  }

  public function setWords ($dictionary, $words = array()) {
    $query = 'INSERT INTO words (dictionary, word_id, name, pronunciation, part_of_speech, definition, details, last_updated, created_on) VALUES ';
    $params = array();
    foreach($words as $word) {
      $query .= "(?, ?, ?, ?, ?, ?, ?, ?, ?), ";
      $params[] = $dictionary;
      $params[] = $word['id'];
      $params[] = $word['name'];
      $params[] = $word['pronunciation'];
      $params[] = $word['partOfSpeech'];
      $params[] = $word['definition'];
      $params[] = $word['details'];
      $params[] = is_null($word['lastUpdated']) ? $word['createdOn'] : $word['lastUpdated'];
      $params[] = $word['createdOn'];
    }
    $query = trim($query, ', ') . ' ON DUPLICATE KEY UPDATE
name=VALUES(name),
pronunciation=VALUES(pronunciation),
part_of_speech=VALUES(part_of_speech),
definition=VALUES(definition),
details=VALUES(details),
last_updated=VALUES(last_updated)';
    
    $results = $this->db->execute($query, $params);
    return $results;
  }
}
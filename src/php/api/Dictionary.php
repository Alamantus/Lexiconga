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
      'partsOfSpeech' => 'Noun,Adjective,Verb',
    );
  }

  private function checkIfIdExists ($id) {
    $query = "SELECT id FROM dictionaries WHERE id=?";
    $results = $this->db->query($query, array($id))->fetchAll();
    return count($results) > 0;
  }

  public function create ($user) {
    $new_id = mt_rand(1000, 999999999);
    $id_exists = $this->checkIfIdExists($new_id);
    while ($id_exists) {
      $new_id = mt_rand(1000, 999999999);
      $id_exists = $this->checkIfIdExists($new_id);
    }

    $insert_dictionary_query = "INSERT INTO dictionaries (id, user, description, created_on) VALUES (?, ?, ?, ?)";
    $insert_dictionary = $this->db->execute($insert_dictionary_query, array($new_id, $user, 'A new dictionary.', time()));

    if ($insert_dictionary === true) {
      $insert_linguistics_query = "INSERT INTO dictionary_linguistics (dictionary, parts_of_speech, exceptions, orthography_notes, grammar_notes)
VALUES ($new_id, ?, ?, ?, ?)";
      $insert_linguistics = $this->db->execute($insert_linguistics_query, array(
        $this->defaults['partsOfSpeech'],
        '',
        '',
        '',
      ));

      if ($insert_linguistics === true) {
        return $this->changeCurrent($user, $new_id);
      } else {
        return array(
          'error' => '"INSERT INTO dictionary_linguistics" failed: ' . $this->db->last_error_info[2],
        );
      }
    }

    return array(
      'error' => '"INSERT INTO dictionaries" failed: ' . $this->db->last_error_info[2],
    );
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
        'id' => $result['id'],
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

  public function getDeletedWords ($user, $dictionary) {
    $query = "SELECT deleted_words.* FROM deleted_words JOIN dictionaries ON id = dictionary WHERE dictionary=$dictionary AND user=$user";
    $results = $this->db->query($query)->fetchAll();
    if ($results) {
      return array_map(function ($row) {
        return array(
          'id' => intval($row['word_id']),
          'deletedOn' => intval($row['deleted_on']),
        );
      }, $results);
    }
    return array();
  }

  public function setWords ($user, $dictionary, $words = array()) {
    $query = 'INSERT INTO words (dictionary, word_id, name, pronunciation, part_of_speech, definition, details, last_updated, created_on) VALUES ';
    $params = array();
    $word_ids = array();
    $most_recent_word_update = 0;
    foreach($words as $word) {
      $last_updated = is_null($word['lastUpdated']) ? $word['createdOn'] : $word['lastUpdated'];
      if ($most_recent_word_update < $last_updated) {
        $most_recent_word_update = $last_updated;
      }
      $word_ids[] = $word['id'];
      $query .= "(?, ?, ?, ?, ?, ?, ?, ?, ?), ";
      $params[] = $dictionary;
      $params[] = $word['id'];
      $params[] = $word['name'];
      $params[] = $word['pronunciation'];
      $params[] = $word['partOfSpeech'];
      $params[] = $word['definition'];
      $params[] = $word['details'];
      $params[] = $last_updated;
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

    // if ($results) {
    //   $database_words = $this->getWords($user, $dictionary);
    //   $database_ids = array_map(function($database_word) { return $database_word['id']; }, $database_words);
    //   $words_to_delete = array_filter($database_ids, function($database_id) use($word_ids) { return !in_array($database_id, $word_ids); });
    //   if ($words_to_delete) {
    //     $delete_results = $this->deleteWords($dictionary, $words_to_delete);
    //     return $delete_results;
    //   }
    // }

    return $results;
  }

  public function deleteWords ($dictionary, $word_ids) {
    $insert_query = 'INSERT INTO deleted_words (dictionary, word_id, deleted_on) VALUES ';
    $insert_params = array();
    $delete_query = 'DELETE FROM words WHERE dictionary=? AND word_id IN (';
    $delete_params = array($dictionary);
    foreach($word_ids as $word_id) {
      $insert_query .= "(?, ?, ?), ";
      $insert_params[] = $dictionary;
      $insert_params[] = $word_id;
      $insert_params[] = time();

      $delete_query .= '?, ';
      $delete_params[] = $word_id;
    }

    $insert_query = trim($insert_query, ', ') . ' ON DUPLICATE KEY UPDATE deleted_on=VALUES(deleted_on)';
    $delete_query = trim($delete_query, ', ') . ')';
    
    $insert_results = $this->db->execute($insert_query, $insert_params);
    if ($insert_results) {
      $delete_results = $this->db->execute($delete_query, $delete_params);
      return $delete_results;
    }
    return $insert_results;
  }
}
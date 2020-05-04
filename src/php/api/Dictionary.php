<?php
require_once(realpath(dirname(__FILE__) . '/./Db.php'));
require_once(realpath(dirname(__FILE__) . '/./Token.php'));

class Dictionary {
  private $db;
  private $token;
  private $defaults;
  function __construct () {
    $this->db = new Db();
    $this->token = new Token();

    $this->defaults = array(
      'partsOfSpeech' => 'Noun,Adjective,Verb,Adverb,Preposition,Pronoun,Conjunction',
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
      $insert_linguistics_query = "INSERT INTO dictionary_linguistics (dictionary, parts_of_speech, phonology_notes, phonotactics_notes, translations, orthography_notes, grammar_notes)
VALUES ($new_id, ?, ?, ?, ?, ?, ?)";
      $insert_linguistics = $this->db->execute($insert_linguistics_query, array(
        $this->defaults['partsOfSpeech'],
        '',
        '',
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
    if (trim($this->db->last_error_info[2]) == '') {
      return $dictionary;
    }
    return false;
  }

  public function deleteDictionary ($user, $dictionary) {
    $update_query = 'DELETE FROM dictionaries WHERE id=? AND user=?';
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
          'id' => $result['id'],
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
      $partsOfSpeech = isset($result['parts_of_speech']) && $result['parts_of_speech'] !== '' ? $result['parts_of_speech'] : $this->defaults['partsOfSpeech'];

      return array(
        'externalID' => $result['id'],
        'name' => $result['name'],
        'specification' => $result['specification'],
        'description' => $result['description'],
        'partsOfSpeech' => explode(',', $partsOfSpeech),
        'alphabeticalOrder' => $result['alphabetical_order'] !== '' ? explode(' ', $result['alphabetical_order']) : array(),
        'details' => array(
          'phonology' => array(
            'consonants' => $result['consonants'] !== '' ? explode(' ', $result['consonants']) : array(),
            'vowels' => $result['vowels'] !== '' ? explode(' ', $result['vowels']) : array(),
            'blends' => $result['blends'] !== '' ? explode(' ', $result['blends']) : array(),
            'notes' => $result['phonology_notes'],
          ),
          'phonotactics' => array(
            'onset' => $result['onset'] !== '' ? explode(',', $result['onset']) : array(),
            'nucleus' => $result['nucleus'] !== '' ? explode(',', $result['nucleus']) : array(),
            'coda' => $result['coda'] !== '' ? explode(',', $result['coda']) : array(),
            'notes' => $result['phonotactics_notes'],
          ),
          'orthography' => array(
            'translations' => $result['translations'] !== '' ? explode(PHP_EOL, $result['translations']) : array(),
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
          'theme' => $result['theme'],
          'customCSS' => $result['custom_css'],
          'isPublic' => $result['is_public'] === '1' ? true : false,
        ),
        'lastUpdated' => is_null($result['last_updated']) ? $result['created_on'] : $result['last_updated'],
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
  theme=:theme,
  custom_css=:custom_css,
  is_public=:is_public,
  last_updated=:last_updated,
  created_on=:created_on
WHERE user=$user AND id=$dictionary";

    // $result1 = $this->db->query($query1, array(
    $result1 = $this->db->execute($query1, array(
      ':name' => $dictionary_object['name'],
      ':specification' => $dictionary_object['specification'],
      ':description' => $dictionary_object['description'],
      ':allow_duplicates' => $dictionary_object['settings']['allowDuplicates'] ? 1 : 0,
      ':case_sensitive' => $dictionary_object['settings']['caseSensitive'] ? 1 : 0,
      ':sort_by_definition' => $dictionary_object['settings']['sortByDefinition'] ? 1 : 0,
      ':theme' => $dictionary_object['settings']['theme'],
      ':custom_css' => $dictionary_object['settings']['customCSS'],
      ':is_public' => $dictionary_object['settings']['isPublic'] ? 1 : 0,
      ':last_updated' => $dictionary_object['lastUpdated'],
      ':created_on' => $dictionary_object['createdOn'],
    ));
    // if ($result1->rowCount() > 0) {
    if ($result1 === true) {
      $linguistics = $dictionary_object['details'];
      $query2 = "UPDATE dictionary_linguistics
SET parts_of_speech=:parts_of_speech,
  alphabetical_order=:alphabetical_order,
  consonants=:consonants,
  vowels=:vowels,
  blends=:blends,
  phonology_notes=:phonology_notes,
  onset=:onset,
  nucleus=:nucleus,
  coda=:coda,
  phonotactics_notes=:phonotactics_notes,
  translations=:translations,
  orthography_notes=:orthography_notes,
  grammar_notes=:grammar_notes
WHERE dictionary=$dictionary";

      // $result2 = $this->db->query($query2, array(
      $result2 = $this->db->execute($query2, array(
        ':parts_of_speech' => implode(',', $dictionary_object['partsOfSpeech']),
        ':alphabetical_order' => implode(' ', $dictionary_object['alphabeticalOrder']),
        ':consonants' => implode(' ', $linguistics['phonology']['consonants']),
        ':vowels' => implode(' ', $linguistics['phonology']['vowels']),
        ':blends' => implode(' ', $linguistics['phonology']['blends']),
        ':phonology_notes' => $linguistics['phonology']['notes'],
        ':onset' => implode(',', $linguistics['phonotactics']['onset']),
        ':nucleus' => implode(',', $linguistics['phonotactics']['nucleus']),
        ':coda' => implode(',', $linguistics['phonotactics']['coda']),
        ':phonotactics_notes' => $linguistics['phonotactics']['notes'],
        ':translations' => implode(PHP_EOL, $linguistics['orthography']['translations']),
        ':orthography_notes' => $linguistics['orthography']['notes'],
        ':grammar_notes' => $linguistics['grammar']['notes'],
      ));

      // if ($result2->rowCount() > 0) {
      if ($result2 === true) {
        return true;
      }
    }
    return $this->db->last_error_info;
    // return false;
  }

  public function getWords ($user, $dictionary) {
    $query = "SELECT words.*, words_advanced.etymology, words_advanced.related FROM words
LEFT JOIN words_advanced ON words_advanced.dictionary = words.dictionary AND words_advanced.word_id = words.word_id
JOIN dictionaries ON dictionaries.id = words.dictionary
WHERE words.dictionary=$dictionary AND dictionaries.user=$user";
    $results = $this->db->query($query)->fetchAll();
    if ($results) {
      return array_map(function ($row) {
        $word = array(
          'name' => $row['name'],
          'pronunciation' => $row['pronunciation'],
          'partOfSpeech' => $row['part_of_speech'],
          'definition' => $row['definition'],
          'details' => $row['details'],
          'lastUpdated' => is_null($row['last_updated']) ? intval($row['created_on']) : intval($row['last_updated']),
          'createdOn' => intval($row['created_on']),
          'wordId' => intval($row['word_id']),
        );

        if (!is_null($row['etymology']) && $row['etymology'] !== '') {
          $word['etymology'] = explode(',', $row['etymology']);
        }

        if (!is_null($row['related']) && $row['related'] !== '') {
          $word['related'] = explode(',', $row['related']);
        }

        return $word;
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
    if (count($words) < 1) {
      return true;
    }

    $query1 = 'INSERT INTO words (dictionary, word_id, name, pronunciation, part_of_speech, definition, details, last_updated, created_on) VALUES ';
    $query2 = 'INSERT INTO words_advanced (dictionary, word_id, etymology, related) VALUES ';
    $params1 = array();
    $params2 = array();
    $word_ids = array();
    $most_recent_word_update = 0;
    foreach($words as $word) {
      $last_updated = isset($word['lastUpdated']) ? $word['lastUpdated'] : $word['createdOn'];
      if ($most_recent_word_update < $last_updated) {
        $most_recent_word_update = $last_updated;
      }
      $word_ids[] = $word['wordId'];
      $query1 .= "(?, ?, ?, ?, ?, ?, ?, ?, ?), ";
      $params1[] = $dictionary;
      $params1[] = $word['wordId'];
      $params1[] = $word['name'];
      $params1[] = $word['pronunciation'];
      $params1[] = $word['partOfSpeech'];
      $params1[] = $word['definition'];
      $params1[] = $word['details'];
      $params1[] = $last_updated;
      $params1[] = $word['createdOn'];

      $query2 .= "(?, ?, ?, ?), ";
      $params2[] = $dictionary;
      $params2[] = $word['wordId'];
      $params2[] = isset($word['etymology']) ? implode(',', $word['etymology']) : '';
      $params2[] = isset($word['related']) ? implode(',', $word['related']) : '';
    }
    $query1 = trim($query1, ', ') . ' ON DUPLICATE KEY UPDATE
name=VALUES(name),
pronunciation=VALUES(pronunciation),
part_of_speech=VALUES(part_of_speech),
definition=VALUES(definition),
details=VALUES(details),
last_updated=VALUES(last_updated),
created_on=VALUES(created_on)';
    $query2 = trim($query2, ', ') . ' ON DUPLICATE KEY UPDATE
etymology=VALUES(etymology),
related=VALUES(related)';
    
    $results1 = $this->db->execute($query1, $params1);

    // if ($results1) {
    //   $database_words = $this->getWords($user, $dictionary);
    //   $database_ids = array_map(function($database_word) { return $database_word['id']; }, $database_words);
    //   $words_to_delete = array_filter($database_ids, function($database_id) use($word_ids) { return !in_array($database_id, $word_ids); });
    //   if ($words_to_delete) {
    //     $delete_results = $this->deleteWords($dictionary, $words_to_delete);
    //     return $delete_results;
    //   }
    // }

    if ($results1 === true) {
      $results2 = $this->db->execute($query2, $params2);
      if ($results2 === true) {
        return $results1 && $results2;
      }
    }
    return array(
      'error' => $this->db->last_error_info,
    );
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
      if ($delete_results) {
        return $delete_results;
      }
    }
    return $this->db->last_error_info;
  }
}
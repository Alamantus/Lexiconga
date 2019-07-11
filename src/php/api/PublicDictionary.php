<?php
require_once(realpath(dirname(__FILE__) . '/./Db.php'));
require_once(realpath(dirname(__FILE__) . '/./Token.php'));

class PublicDictionary {
  private $db;
  private $token;
  private $defaults;
  public $details;
  public $words;
  function __construct ($dictionary_id, $details_only = false) {
    $this->db = new Db();
    $this->token = new Token();

    $this->defaults = array(
      'partsOfSpeech' => 'Noun,Adjective,Verb',
    );

    $this->details = $this->getPublicDictionaryDetails($dictionary_id);
    if (!$details_only) {
      $this->words = $this->getPublicDictionaryWords($dictionary_id);
    }
  }

  public function getPublicDictionaryDetails ($dictionary) {
    if (is_numeric($dictionary)) {
      $query = "SELECT d.*, dl.*, u.public_name FROM dictionaries d JOIN dictionary_linguistics dl ON dl.dictionary = d.id JOIN users u ON u.id = d.user WHERE d.id=? AND d.is_public=1";
      $result = $this->db->query($query, array($dictionary))->fetch();
      if ($result) {
        // Default json values in case they are somehow not created by front end first
        $partsOfSpeech = $result['parts_of_speech'] !== '' ? $result['parts_of_speech'] : $this->defaults['partsOfSpeech'];

        return array(
          'externalID' => $result['id'],
          'name' => $result['name'],
          'specification' => $result['specification'],
          'description' => $this->parseReferences(strip_tags($result['description']), $result['id']),
          'createdBy' => $result['public_name'],
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
    }
    return false;
  }

  public function getPublicDictionaryWords ($dictionary) {
    if (is_numeric($dictionary)) {
      $query = "SELECT words.* FROM words JOIN dictionaries ON id = dictionary WHERE dictionary=? AND is_public=1";
      $results = $this->db->query($query, array($dictionary))->fetchAll();
      if ($results) {
        return array_map(function ($row) use ($dictionary) {
          return array(
            'name' => $this->translateOrthography($row['name'], $dictionary),
            'pronunciation' => $row['pronunciation'],
            'partOfSpeech' => $row['part_of_speech'],
            'definition' => $row['definition'],
            'details' => $this->parseReferences(strip_tags($row['details']), $dictionary),
            'lastUpdated' => is_null($row['last_updated']) ? intval($row['created_on']) : intval($row['last_updated']),
            'createdOn' => intval($row['created_on']),
            'wordId' => intval($row['word_id']),
          );
        }, $this->sortWords($results));
      }
    }
    return array();
  }

  public function getSpecificPublicDictionaryWord ($dictionary, $word) {
    if (is_numeric($dictionary) && is_numeric($word)) {
      $query = "SELECT words.* FROM words JOIN dictionaries ON id = dictionary WHERE dictionary=? AND word_id=? AND is_public=1";
      $result = $this->db->query($query, array($dictionary, $word))->fetch();
      if ($result) {
        return array(
          'name' => $this->translateOrthography($result['name'], $dictionary),
          'pronunciation' => $result['pronunciation'],
          'partOfSpeech' => $result['part_of_speech'],
          'definition' => $result['definition'],
          'details' => $this->parseReferences(strip_tags($result['details']), $dictionary),
          'lastUpdated' => is_null($result['last_updated']) ? intval($result['created_on']) : intval($result['last_updated']),
          'createdOn' => intval($result['created_on']),
          'wordId' => intval($result['word_id']),
        );
      }
    }
    return false;
  }

  private function sortWords($words) {
    $this->details['original_order'] = $words;
    $sort_by = isset($this->details['settings']) && isset($this->details['settings']['sortByDefinition']) && $this->details['settings']['sortByDefinition'] === true
      ? 'definition' : 'name';
    // Transliterator settings from https://stackoverflow.com/a/35178027
    $transliterator = Transliterator::createFromRules(':: Latin-ASCII; :: NFD; :: [:Nonspacing Mark:] Remove; :: Lower(); :: NFC;', Transliterator::FORWARD);
    usort($words, function($a, $b) use($transliterator, $sort_by) {
      $word_a = $transliterator->transliterate($a[$sort_by]);
      $word_b = $transliterator->transliterate($b[$sort_by]);
      return strcasecmp($word_a, $word_b);
    });

    if (isset($this->details['alphabeticalOrder']) && count($this->details['alphabeticalOrder']) > 0) {
      $ordering = array();
      for ($i = 0; $i < count($this->details['alphabeticalOrder']); $i++) {
        $ordering[$this->details['alphabeticalOrder'][$i]] = $i + 1;
      }
      usort($words, function($word_a, $word_b) use($sort_by, $ordering) {
        if ($word_a[$sort_by] === $word_b[$sort_by]) return 0;

        $a_letters = str_split($word_a[$sort_by]);
        $b_letters = str_split($word_b[$sort_by]);
        
        for ($i = 0; $i < count($a_letters); $i++) {
          $a = $a_letters[$i];
          if (!isset($b_letters[$i])) {
            return 1;
          }
          $b = $b_letters[$i];
          if (!isset($ordering[$a]) && !isset($ordering[$b])) {
            continue;
          }
          if (!isset($ordering[$a])) {
            return 1;
          }
          if (!isset($ordering[$b])) {
            return -1;
          }
          if ($ordering[$a] === $ordering[$b]) {
            if (count($a_letters) < count($b_letters) && $i === count($a_letters) - 1) {
              return -1;
            }
            continue;
          }
          return $ordering[$a] - $ordering[$b];
        }

        return 0;
      });
    }

    return $words;
  }

  private function parseReferences($details, $dictionary_id) {
    $details = strip_tags($details);
    if (preg_match_all('/\{\{.+?\}\}/', $details, $references) !== false) {
      $references = array_unique($references[0]);
      foreach($references as $reference) {
        $word_to_find = preg_replace('/\{\{|\}\}/', '', $reference);
        $homonymn = 0;
      
        if (strpos($word_to_find, ':') !== false) {
          $separator = strpos($word_to_find, ':');
          $homonymn = substr($word_to_find, $separator + 1);
          $word_to_find = substr($word_to_find, 0, $separator);
          if ($homonymn && trim($homonymn) && intval(trim($homonymn)) > 0) {
            $homonymn = intval(trim($homonymn));
          } else {
            $homonymn = false;
          }
        }

        $target_id = false;
        $reference_ids = $this->getWordIdsWithName($dictionary_id, $word_to_find);

        if (count($reference_ids) > 0) {
          if ($homonymn !== false && $homonymn > 0) {
            if (isset($reference_ids[$homonymn - 1])) {
              $target_id = $reference_ids[$homonymn - 1];
            }
          } else if ($homonymn !== false) {
            $target_id = $reference_ids[0];
          }

          if ($target_id !== false) {
            if ($homonymn < 1) {
              $homonymn = 1;
            }
            $homonymn_sub_html = count($reference_ids) > 1 && $homonymn - 1 >= 0 ? '<sub>' . $homonymn . '</sub>' : '';
            $site_root = substr($_SERVER['REQUEST_URI'], 0, strpos($_SERVER['REQUEST_URI'], $dictionary_id));
            $markdown_link = '<span class="word-reference"><a href="' . $site_root . $dictionary_id . '/' . $target_id .'" target="_blank" title="Link to Reference">'
              . '<span class="orthographic-translation">' . $this->translateOrthography($word_to_find, $dictionary_id) . '</span>' . $homonymn_sub_html
            . '</a></span>';
            $details = str_replace($reference, $markdown_link, $details);
          }
        }
      }
    }

    return $details;
  }

  private function getWordIdsWithName($dictionary, $word_name) {
    if (is_numeric($dictionary)) {
      $query = "SELECT word_id FROM words WHERE dictionary=? AND name=?";
      $results = $this->db->query($query, array($dictionary, $word_name))->fetchAll();
      if ($results) {
        return array_map(function ($row) {
          return intval($row['word_id']);
        }, $results);
      }
    }
    return array();
  }

  private function translateOrthography($word, $dictionary) {
    if (!isset($this->translations)) {
      $this->translations = $this->getTranslations($dictionary);
    }
    foreach($this->translations as $translation) {
      $translation = array_map('trim', explode('=', $translation));
      if (count($translation) > 1 && $translation[0] !== '' && $translation[1] !== '') {
        $word = str_replace($translation[0], $translation[1], $word);
      }
    };
    return $word;
  }

  private function getTranslations($dictionary) {
    if (is_numeric($dictionary)) {
      $query = "SELECT translations FROM dictionary_linguistics WHERE dictionary=?";
      $result = $this->db->query($query, array($dictionary))->fetch();
      if ($result) {
        return explode(PHP_EOL, $result['translations']);
      }
    }
    return array();
  }
}
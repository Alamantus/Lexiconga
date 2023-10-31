<?php
require_once(realpath(dirname(__FILE__) . '/./Db.php'));
require_once(realpath(dirname(__FILE__) . '/./Token.php'));

class PublicDictionary {
  private $db;
  private $token;
  private $defaults;
  private $original_words;
  public $details;
  public $words;

  function __construct ($dictionary_id, $details_only = false) {
    $this->db = new Db();
    $this->token = new Token();

    $this->defaults = array(
      'partsOfSpeech' => 'Noun,Adjective,Verb',
    );

    $this->details = $this->getPublicDictionaryDetails($dictionary_id);
    $this->words = $details_only ? [] : $this->getPublicDictionaryWords($dictionary_id);
    if ($this->details !== false) {
      $this->details['wordStats'] = $this->getWordStats();
    }
  }

  public function getPublicDictionaryDetails ($dictionary) {
    if (is_numeric($dictionary)) {
      $query = "SELECT d.*, dl.*, u.public_name FROM dictionaries d JOIN dictionary_linguistics dl ON dl.dictionary = d.id JOIN users u ON u.id = d.user WHERE d.id=? AND d.is_public=1";
      $result = $this->db->query($query, array($dictionary))->fetch();
      if ($result) {
        // Default json values in case they are somehow not created by front end first
        $partsOfSpeech = isset($result['parts_of_speech']) && $result['parts_of_speech'] !== '' ? $result['parts_of_speech'] : $this->defaults['partsOfSpeech'];

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
              'notes' => $this->parseReferences(strip_tags($result['phonology_notes']), $result['id']),
            ),
            'phonotactics' => array(
              'onset' => $result['onset'] !== '' ? explode(',', $result['onset']) : array(),
              'nucleus' => $result['nucleus'] !== '' ? explode(',', $result['nucleus']) : array(),
              'coda' => $result['coda'] !== '' ? explode(',', $result['coda']) : array(),
              'notes' => $this->parseReferences(strip_tags($result['phonotactics_notes']), $result['id']),
            ),
            'orthography' => array(
              'translations' => $result['translations'] !== '' ? explode(PHP_EOL, $result['translations']) : array(),
              'notes' => $this->parseReferences(strip_tags($result['orthography_notes']), $result['id']),
            ),
            'grammar' => array(
              'notes' => $this->parseReferences(strip_tags($result['grammar_notes']), $result['id']),
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
      $words = $this->getWordsAsEntered();
      if ($words) {
        return array_map(function ($row) use ($dictionary) {
          $word = array(
            'name' => $this->translateOrthography($row['name'], $dictionary),
            'pronunciation' => $row['pronunciation'],
            'partOfSpeech' => $row['part_of_speech'],
            'definition' => $row['definition'],
            'details' => $this->parseReferences(strip_tags($row['details']), $dictionary, false),
            'lastUpdated' => is_null($row['last_updated']) ? intval($row['created_on']) : intval($row['last_updated']),
            'createdOn' => intval($row['created_on']),
            'wordId' => intval($row['word_id']),
          );

          if (!is_null($row['etymology'])) {
            if (strlen($row['etymology']) > 0) {
              $word['etymology'] = array_map(function ($root) use($dictionary) {
                return $this->getWordReferenceHTML(strip_tags($root), $dictionary, false);
              }, explode(',', $row['etymology']));
            }
          }

          if (!is_null($row['related'])) {
            if (strlen($row['related']) > 0) {
              $word['related'] = array_map(function ($root) use($dictionary) {
                return $this->getWordReferenceHTML(strip_tags($root), $dictionary, false);
              }, explode(',', $row['related']));
            }
          }

          if (!is_null($row['principal_parts'])) {
            if (strlen($row['principal_parts']) > 0) {
              $word['principalParts'] = explode(',', $row['principal_parts']);
            }
          }
          
          return $word;
        }, $this->sortWords($words));
      }
    }
    return array();
  }

  public function getSpecificPublicDictionaryWord ($dictionary, $word_id) {
    if (is_numeric($dictionary) && is_numeric($word_id)) {
      $results = array_filter($this->getWordsAsEntered(), fn ($row) => $row['word_id'] == $word_id);
      $result = array_values($results)[0] ?? null;
      if ($result) {
        $word = array(
          'name' => $this->translateOrthography($result['name'], $dictionary),
          'pronunciation' => $result['pronunciation'],
          'partOfSpeech' => $result['part_of_speech'],
          'definition' => $result['definition'],
          'details' => $this->parseReferences(strip_tags($result['details']), $dictionary),
          'lastUpdated' => is_null($result['last_updated']) ? intval($result['created_on']) : intval($result['last_updated']),
          'createdOn' => intval($result['created_on']),
          'wordId' => intval($result['word_id']),
        );

        if (!is_null($result['etymology'])) {
          if (strlen($result['etymology']) > 0) {
            $word['etymology'] = array_map(function ($root) use($dictionary) {
              return $this->getWordReferenceHTML(strip_tags($root), $dictionary);
            }, explode(',', $result['etymology']));
          }
        }

        if (!is_null($result['related'])) {
          if (strlen($result['related']) > 0) {
            $word['related'] = array_map(function ($root) use($dictionary) {
              return $this->getWordReferenceHTML(strip_tags($root), $dictionary);
            }, explode(',', $result['related']));
          }
        }

        if (!is_null($result['principal_parts'])) {
          if (strlen($result['principal_parts']) > 0) {
            $word['principalParts'] = explode(',', $result['principal_parts']);
          }
        }

        return $word;
      }
    }
    return false;
  }

  private function getWordsAsEntered() {
    if (!isset($this->original_words)) {
      $query = "SELECT words.*, wa.etymology, wa.related, wa.principal_parts FROM words
LEFT JOIN words_advanced wa ON wa.dictionary = words.dictionary AND wa.word_id = words.word_id
JOIN dictionaries ON dictionaries.id = words.dictionary
WHERE words.dictionary=? AND is_public=1";
      $this->original_words = $this->db->query($query, array($this->details['externalID']))->fetchAll();
    }
    return $this->original_words;
  }

  private function sortWords($words) {
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
        $reference_link = $this->getWordReferenceHTML($reference, $dictionary_id);
        if ($reference_link !== $reference) {
          $details = str_replace($reference, $reference_link, $details);
        }
      }
    }

    return $details;
  }

  private function getWordReferenceHTML($reference, $dictionary_id, $direct_link = true) {
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
    $reference_ids = $this->getWordIdsFromName($word_to_find);

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
        return '<span class="word-reference"><a href="'
          . ($direct_link ? $site_root . $dictionary_id . '/' : '#') . $target_id .'" '
          . ($direct_link ? 'target="_blank" ' : '') . 'title="Link to Reference">'
          . '<span class="orthographic-translation">' . $this->translateOrthography($word_to_find, $dictionary_id) . '</span>' . $homonymn_sub_html
        . '</a></span>';
      }
    }

    return $reference;
  }

  private function getWordIdsFromName($word_name) {
    $results = array_filter($this->getWordsAsEntered(), fn ($row) => $row['name'] == $word_name);
    $results = array_values($results);
    if ($results) {
      return array_map(function ($row) {
        return intval($row['word_id']);
      }, $results);
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

  private function getWordStats() {
    $words = $this->getWordsAsEntered();
    $word_stats = array(
      'numberOfWords' => array(
        array(
          'name' => 'Total',
          'value' => count($words),
        ),
      ),
      'wordLength' => array(
        'shortest' => 0,
        'longest' => 0,
        'average' => 0,
      ),
      'letterDistribution' => array(
        /* array(
          'letter' => '',
          'number' => 0,
          'percentage' => 0.00,
        ) */
      ),
      'totalLetters' => 0,
    );

    foreach($this->details['partsOfSpeech'] as $part_of_speech) {
      $words_with_part_of_speech = array_filter($words, function ($word) use($part_of_speech) {
        return $word['part_of_speech'] === $part_of_speech;
      });
      $word_stats['numberOfWords'][] = array(
        'name' => $part_of_speech,
        'value' => count($words_with_part_of_speech),
      );
    };

    $word_stats['numberOfWords'][] = array(
      'name' => 'Unclassified',
      'value' => count(array_filter($words, function ($word) {
        return !in_array($word['part_of_speech'], $this->details['partsOfSpeech']);
      })),
    );

    $total_letters = 0;
    $number_of_letters = array();

    foreach($words as $word) {
      $shortest_word = $word_stats['wordLength']['shortest'];
      $longest_word = $word_stats['wordLength']['longest'];
      $word_letters = str_split($word['name']);
      $letters_in_word = count($word_letters);

      $total_letters += $letters_in_word;

      if ($shortest_word === 0 || $letters_in_word < $shortest_word) {
        $word_stats['wordLength']['shortest'] = $letters_in_word;
      }

      if ($longest_word === 0 || $letters_in_word > $longest_word) {
        $word_stats['wordLength']['longest'] = $letters_in_word;
      }

      foreach($word_letters as $letter) {
        $letterToUse = $this->details['settings']['caseSensitive'] ? $letter : strtolower($letter);
        if (!isset($number_of_letters[$letterToUse])) {
          $number_of_letters[$letterToUse] = 1;
        } else {
          $number_of_letters[$letterToUse]++;
        }
      };
    };

    $word_stats['totalLetters'] = $total_letters;
    $word_stats['wordLength']['average'] = count($words) > 0 ? round($total_letters / count($words)) : 0;

    foreach ($number_of_letters as $letter => $number) {
      if (isset($number_of_letters[$letter])) {
        $word_stats['letterDistribution'][] = array(
          'letter' => $letter,
          'number' => $number,
          'percentage' => $number / $total_letters,
        );
      }
    }

    usort($word_stats['letterDistribution'], function ($a, $b) {
      if ($a['percentage'] === $b['percentage']) return 0;
      return ($a['percentage'] > $b['percentage']) ? -1 : 1;
    });

    return $word_stats;
  }
}
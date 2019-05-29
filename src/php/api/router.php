<?php
$view = isset($_GET['view']) ? $_GET['view'] : false;

switch ($view) {
  case 'publicview': {
    $html = file_get_contents('../view.html');
    $dict = isset($_GET['dict']) ? $_GET['dict'] : false;
    if ($dict !== false) {
      require_once('./Dictionary.php');
      $dictionary = new Dictionary();
      $dictionary_data = $dictionary->getPublicDictionaryDetails($dict);
      if ($dictionary_data !== false) {
        $dictionary_data['words'] = $dictionary->getPublicDictionaryWords($dict);
        $html = str_replace('{{dict}}', $dict, $html);
        $html = str_replace('{{dict_name}}', $dictionary_data['name'] . ' ' . $dictionary_data['specification'], $html);
        $html = str_replace('{{public_name}}', $dictionary_data['createdBy'], $html);
        $dictionary_json = json_encode($dictionary_data);
        $html = str_replace('{{dict_json}}', addslashes($dictionary_json), $html);
      } else {
        $html = str_replace('{{dict}}', 'error', $html);
        $html = str_replace('{{dict_name}}', 'Error: Dictionary Not Found', $html);
        $html = str_replace('{{public_name}}', 'Error', $html);
        $html = str_replace('{{dict_json}}', '{"name": "Error:", "specification": "Dictionary Not Found", "words": []}', $html);
      }
      echo $html;
    }
    break;
  }
}
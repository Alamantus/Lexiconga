<?php
require_once(realpath(dirname(__FILE__) . '/./api/Response.php'));
$view = isset($_GET['view']) ? $_GET['view'] : false;

switch ($view) {
  case 'dictionary': {
    $html = file_get_contents(realpath(dirname(__FILE__) . '/./template-view.html'));
    $dict = isset($_GET['dict']) ? $_GET['dict'] : false;
    if ($dict !== false) {
      require_once(realpath(dirname(__FILE__) . '/./api/Dictionary.php'));
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
      return Response::html($html);
    }
    break;
  }
  case 'word': {
    $html = file_get_contents(realpath(dirname(__FILE__) . '/./template-view.html'));
    $dict = isset($_GET['dict']) ? $_GET['dict'] : false;
    $word = isset($_GET['word']) ? $_GET['word'] : false;
    if ($dict !== false && $word !== false) {
      require_once(realpath(dirname(__FILE__) . '/./api/Dictionary.php'));
      $dictionary = new Dictionary();
      $dictionary_data = $dictionary->getPublicDictionaryDetails($dict);
      if ($dictionary_data !== false) {
        $dictionary_name = $dictionary_data['name'] . ' ' . $dictionary_data['specification'];
        $word_data = $dictionary->getSpecificPublicDictionaryWord($dict, $word);
        if ($word_data === false) {
          $word_data = array(
            'name' => 'Error: Word Not Found',
            'pronunciation' => '',
            'partOfSpeech' => '',
            'definition' => 'No word with the id ' . $word . ' was found in the ' . $dictionary_name,
            'details' => '',
            'lastUpdated' => null,
            'createdOn' => null,
            'wordId' => null,
          );
        }
        $dictionary_data['words'] = array($word_data);
        $html = str_replace('{{dict}}', $dict, $html);
        $html = str_replace('{{dict_name}}', $word_data['name'] . ' in the ' . $dictionary_name, $html);
        $html = str_replace('{{public_name}}', $dictionary_data['createdBy'], $html);
        $dictionary_json = json_encode($dictionary_data);
        $html = str_replace('{{dict_json}}', addslashes($dictionary_json), $html);
      } else {
        $html = str_replace('{{dict}}', 'error', $html);
        $html = str_replace('{{dict_name}}', 'Error: Dictionary Not Found', $html);
        $html = str_replace('{{public_name}}', 'Error', $html);
        $html = str_replace('{{dict_json}}', '{"name": "Error:", "specification": "Dictionary Not Found", "words": []}', $html);
      }
      return Response::html($html);
    }
    break;
  }

  default: {
    $html = file_get_contents(realpath(dirname(__FILE__) . '/./template-index.html'));
    $announcements = file_get_contents(realpath(dirname(__FILE__) . '/./announcements.json'));
    $announcements = json_decode($announcements, true);
    $announcements_html = '';
    foreach ($announcements as $announcement) {
      $expire = strtotime($announcement['expire']);
      if (time() < $expire) {
        $announcements_html .= '<article class="announcement"' . (isset($announcement['dismissId']) ? ' id="announcement-' . $announcement['dismissId'] . '"' : '') . '>
        <a class="close-button" title="Dismiss Announcement">&times;&#xFE0E;</a>
        <h4>' . $announcement['header'] . '</h4>
        ' . $announcement['body'] . '
      </article>';
      }
    }
    $html = str_replace('{{announcements}}', $announcements_html, $html);

    $upup_files = array(
      'src.js',
      'main.css',
      'help.html',
      'privacy.html',
      'terms.html',
      'usage.html',
      'ipa-table.html',
      'favicon.png',
    );
    $files = array_map(function($file_name) use($upup_files) {
      foreach($upup_files as $index => $upup_file) {
        $file_pieces = explode('.', $upup_file);
        if (substr($file_name, 0, strlen($file_pieces[0])) === $file_pieces[0]
          && substr($file_name, -strlen($file_pieces[1])) === $file_pieces[1]) {
          return str_replace('\\', '/', $file_name);
        }
      }
      return false;
    }, scandir('.'));
    $files = array_filter($files);

    $upup_insert = "<script src=\"upup.min.js\"></script>
    <script>
    window.onload = (function (oldLoad) {
      oldLoad && oldLoad();
      if (UpUp) {
        UpUp.start({
          'cache-version': '2.0.0',
          'content-url': 'offline.html',
          'assets': [
            \"" . implode('","', $files) . "\"
          ],
        });
      }
    })(window.onload);
    </script>";
    
    $html = str_replace('{{upup_insert}}', $upup_insert, $html);

    return Response::html($html);
    break;
  }
}
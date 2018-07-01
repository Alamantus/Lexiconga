<?php
$page_title = 'Lexiconga';
$domain = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]";
$sub_path = $_SERVER['HTTP_HOST'] == 'localhost' ? '/lexiconga' : '';
$actual_url = "$domain$_SERVER[REQUEST_URI]";

$dictionary_id = isset($_GET['dict']) ? $_GET['dict'] : false;
$word_id = isset($_GET['word']) ? $_GET['word'] : false;

if ($dictionary_id !== false) {
  // Get dictionary details if public.
  $page_title = 'Public Dictionary' . ' | ' . $page_title;
  
  if ($word_id !== false) {
    // Get specific word if public.
  }
}
?>
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title><?php echo $page_title; ?></title>
  <meta property="og:url" content="<?php echo $actual_url; ?>">
  <meta property="og:type" content="website">
  <meta property="og:title" content="<?php echo $page_title; ?>">
  <meta property="og:description" content="Quickly build lexicons, dictionaries, or word lists for contructed languages or anything that you can think of!">
  <meta property="og:image" content="<?php echo $domain . $sub_path; ?>/images/logo.svg">
  <meta property="Content-Security-Policy"
    content="default-src 'self';
      base-uri 'self';
      sandbox 'self';
      script-src 'self';
      child-src 'none';
      object-src 'none';
      plugin-types 'none';
      connect-src 'none';
      font-src *;
      img-src *;
      media-src *;
      style-src 'self';
      worker-src 'self';
      form-action 'none'">

  <link rel="shortcut icon" href="<?php echo $domain . $sub_path; ?>/favicon.ico" />
</head>
<body>
<div id="site"></div>
<script src="lexiconga.js"></script>
</body>
</html>
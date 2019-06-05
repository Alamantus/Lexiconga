<?php
require_once(realpath(dirname(__FILE__) . '/./api/config.php'));
require_once(realpath(dirname(__FILE__) . '/./api/Db.php'));
require_once(realpath(dirname(__FILE__) . '/./api/User.php'));
require_once(realpath(dirname(__FILE__) . '/./api/Response.php'));

$html = file_get_contents('./template-passwordreset.html');
$content = '<p>Sorry, this password reset link is not valid.</p>';

if (isset($_GET['account']) && isset($_GET['code'])) {
  $user = new User();
  if ($user->checkPasswordReset($_GET['account'], $_GET['code'])) {
    $content = '<label>New Password<br>
      <input type="password" id="newPassword" maxlength="100">
    </label>
    <label>Confirm Password<br>
      <input type="password" id="newConfirm" maxlength="100">
    </label>
    <input type="hidden" id="account" value="' . $_GET['account'] . '">
    <section id="newPasswordErrorMessages"></section>
    <button id="newPasswordSubmit" class="button">Update Password</button>';
  }
}

$html = str_replace('{{content}}', $content, $html);
return Response::html($html);

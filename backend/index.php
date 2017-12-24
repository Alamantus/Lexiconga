<?php
require_once('./Response.php');
require_once('./User.php');

$action = $_POST['action'];
$token = $_POST['token'];

switch ($action) {
  case 'login': {
    if ($_POST['email'] && $_POST['password']) {
      $user = new User();
      $token = $user->logIn($_POST['email'], $_POST['password']);
      if ($token !== false) {
        return Response::out(array(
          'data' => $token,
          'error' => false,
        ), 200);
      }
      return Response::out(array(
        'data' => 'Could not log in: incorrect data',
        'error' => true,
      ), 400);
    }
    return Response::out(array(
      'data' => 'Could not log in: required information missing',
      'error' => true,
    ), 500);
  }
  case 'create-account': {
    if ($_POST['email'] && $_POST['password']) {
      $user = new User();
      $token = $user->create($_POST['email'], $_POST['password']);
      if ($token !== false) {
        return Response::out(array(
          'data' => $token,
          'error' => false,
        ), 200);
      }
      return Response::out(array(
        'data' => 'Could not create account: incorrect data',
        'error' => true,
      ), 400);
    }
    return Response::out(array(
      'data' => 'Could not create account: required information missing',
      'error' => true,
    ), 500);
  }
}
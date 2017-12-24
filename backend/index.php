<?php
require_once('./Response.php');
require_once('./User.php');

$inputJSON = file_get_contents('php://input');
$request= json_decode($inputJSON, true);

$action = isset($request['action']) ? $request['action'] : '';
$token = isset($request['token']) ? $request['token'] : '';

switch ($action) {
  case 'login': {
    if (isset($request['email']) && isset($request['password'])) {
      $user = new User();
      $token = $user->logIn($request['email'], $request['password']);
      if ($token !== false) {
        return Response::json(array(
          'data' => $token,
          'error' => false,
        ), 200);
      }
      return Response::json(array(
        'data' => 'Could not log in: incorrect data',
        'error' => true,
      ), 401);
    }
    return Response::json(array(
      'data' => 'Could not log in: required information missing',
      'error' => true,
    ), 400);
  }
  case 'create-account': {
    if (isset($request['email']) && isset($request['password'])) {
      $user = new User();
      if (!$user->emailExists($request['email'])) {
        $token = $user->create($request['email'], $request['password']);
        if ($token !== false) {
          return Response::json(array(
            'data' => $token,
            'error' => false,
          ), 201);
        }
        return Response::json(array(
          'data' => 'Could not create account: database error',
          'error' => true,
        ), 500);
      }
      return Response::json(array(
        'data' => 'Could not create account: duplicate email',
        'error' => true,
      ), 403);
    }
    return Response::json(array(
      'data' => 'Could not create account: required information missing',
      'error' => true,
    ), 400);
  }

  default: {
    return Response::html('Hi!');
  }
}
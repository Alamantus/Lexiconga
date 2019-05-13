<?php
require_once('./Response.php');
require_once('./Token.php');

$inputJSON = file_get_contents('php://input');
$request= json_decode($inputJSON, true);

$action = isset($request['action']) ? $request['action'] : '';

switch ($action) {
  case 'login': {
    if (isset($request['email']) && isset($request['password'])) {
      $token = new Token();
      $token = $token->encode([
        'email' => $request['email'],
        'password' => $request['password'],
      ]);
      setcookie('token', $token);
      return Response::json([
        'data' => 'cookie saved',
        'error' => false,
      ], 200);
    }
    break;
  }
}

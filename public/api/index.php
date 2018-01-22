<?php
require_once('./Response.php');
require_once('./User.php');

$inputJSON = file_get_contents('php://input');
$request= json_decode($inputJSON, true);

$action = isset($request['action']) ? $request['action'] : '';
$token = isset($request['token']) ? $request['token'] : false;

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
        $token = $user->create($request['email'], $request['password'], $request['userData']);
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
  case 'check-email': {
    if (isset($request['email'])) {
      $user = new User();
      $email_exists = $user->emailExists($request['email']);
      return Response::json(array(
        'data' => $email_exists,
        'error' => false,
      ), 200);
    }
    return Response::json(array(
      'data' => 'Could not check: required information missing',
      'error' => true,
    ), 400);
  }
  case 'check-username': {
    if (isset($request['username'])) {
      $user = new User();
      $username_exists = $user->usernameExists($request['username']);
      return Response::json(array(
        'data' => $username_exists,
        'error' => false,
      ), 200);
    }
    return Response::json(array(
      'data' => 'Could not check: required information missing',
      'error' => true,
    ), 400);
  }
  case 'get-all-dictionary-names': {
    if ($token !== false) {
      $user = new User();
      $all_dictionaries = $user->listAllDictionaryNames($token);
      if ($all_dictionaries !== false) {
        return Response::json(array(
          'data' => $all_dictionaries,
          'error' => false,
        ), 200);
      }
      return Response::json(array(
        'data' => 'Could not get dictionaries: invalid token',
        'error' => true,
      ), 400);
    }
    return Response::json(array(
      'data' => 'Could not get dictionaries: no token provided',
      'error' => true,
    ), 403);
  }
  case 'create-new-dictionary': {
    if ($token !== false) {
      $user = new User();
      $new_data = $user->createNewDictionary($token);
      if ($new_data !== false) {
        return Response::json(array(
          'data' => $new_data,
          'error' => false,
        ), 200);
      }
      return Response::json(array(
        'data' => 'Could not create dictionary: incorrect data',
        'error' => true,
      ), 401);
    }
    return Response::json(array(
      'data' => 'Could not create dictionary: no token provided',
      'error' => true,
    ), 400);
  }
  case 'change-dictionary': {
    if ($token !== false && isset($request['dictionary'])) {
      $user = new User();
      $new_data = $user->changeCurrentDictionary($token, $request['dictionary']);
      if ($new_data !== false) {
        return Response::json(array(
          'data' => $new_data,
          'error' => false,
        ), 200);
      }
      return Response::json(array(
        'data' => 'Could not create dictionary: incorrect data',
        'error' => true,
      ), 401);
    }
    return Response::json(array(
      'data' => 'Could not create dictionary: no token provided',
      'error' => true,
    ), 400);
  }
  case 'get-current-dictionary': {
    if ($token !== false) {
      $user = new User();
      $dictionary_data = $user->getCurrentDictionary($token);
      if ($dictionary_data !== false) {
        return Response::json(array(
          'data' => $dictionary_data,
          'error' => false,
        ), 200);
      }
      return Response::json(array(
        'data' => 'Could not get dictionary: invalid token',
        'error' => true,
      ), 401);
    }
    return Response::json(array(
      'data' => 'Could not get dictionary: no token provided',
      'error' => true,
    ), 400);
  }
  case 'set-whole-current-dictionary': {
    if ($token !== false && isset($request['dictionary'])) {
      $user = new User();
      $dictionary_data = $user->saveWholeCurrentDictionary($token, $request['dictionary']);
      if ($dictionary_data !== false) {
        return Response::json(array(
          'data' => 'Updated successfully',
          'error' => false,
        ), 200);
      }
      return Response::json(array(
        'data' => 'Could not set dictionary: invalid token',
        'error' => true,
      ), 401);
    }
    return Response::json(array(
      'data' => 'Could not set dictionary: required data missing',
      'error' => true,
    ), 400);
  }
  case 'set-dictionary-details': {
    if ($token !== false && isset($request['details'])) {
      $user = new User();
      $update_details_success = $user->updateCurrentDictionaryDetails($token, $request['details']);
      if ($update_details_success !== false) {
        return Response::json(array(
          // 'data' => 'Updated successfully',
          'data' => $update_details_success,
          'error' => false,
        ), 200);
      }
      return Response::json(array(
        'data' => 'Could not set dictionary: invalid token',
        'error' => true,
      ), 401);
    }
    return Response::json(array(
      'data' => 'Could not set dictionary: required data missing',
      'error' => true,
    ), 400);
  }
  case 'set-dictionary-words': {
    if ($token !== false && isset($request['words'])) {
      $user = new User();
      $update_words_success = $user->updateOrAddWordsToCurrentDictionary($token, $request['words']);
      if ($update_words_success !== false) {
        return Response::json(array(
          'data' => 'Updated successfully',
          'error' => false,
        ), 200);
      }
      return Response::json(array(
        'data' => 'Could not set words: invalid token',
        'error' => true,
      ), 401);
    }
    return Response::json(array(
      'data' => 'Could not set words: required data missing',
      'error' => true,
    ), 400);
  }

  default: {
    return Response::html('Hi!');
  }
}
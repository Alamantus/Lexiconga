<?php
require_once(realpath(dirname(__FILE__) . '/./Response.php'));
require_once(realpath(dirname(__FILE__) . '/./User.php'));

$inputJSON = file_get_contents('php://input');
$inputJSON = strip_tags($inputJSON);
$request= json_decode($inputJSON, true);

if (!$request) {
  // If malformed/unparseable JSON, fail.
  return Response::json(array(
    'data' => 'Malformed request data',
    'error' => true,
  ), 400);
}

$action = isset($request['action']) ? $request['action'] : '';
$token = isset($_COOKIE['token']) ? $_COOKIE['token'] : false;

switch ($action) {
  case 'validate-token': {
    if ($token !== false) {
      $user = new User();
      $user_data = $user->validateToken($token);
      if ($user_data !== false) {
        return Response::json(array(
          'data' => $user_data,
          'error' => false,
        ), 200);
      }
      return Response::json(array(
        'data' => 'Could not validate token: incorrect data',
        'error' => true,
      ), 401);
    }
    return Response::json(array(
      'data' => 'Could not validate token: required information missing',
      'error' => true,
    ), 400);
  }
  case 'login': {
    session_start();
    if (isset($_SESSION['unlock'])) {
      if (time() < $_SESSION['unlock']) {
        $seconds_left = ($_SESSION['unlock'] - time());
        $minutes_left = floor($seconds_left / 60);
        $seconds_left = $seconds_left % 60;
        return Response::json(array(
          'data' => 'Too many failed login attempts. You must wait another '
            . ($minutes_left > 0 ? $minutes_left . ' minutes ' : '')
            . ($minutes_left > 0 && $seconds_left > 0 ? 'and ' : '')
            . ($seconds_left > 0 ? $seconds_left . ' seconds ' : '')
            . 'until you can log in again.',
          'error' => true,
        ), 403);
      } else {
        unset($_SESSION['failures']);
        unset($_SESSION['unlock']);
      }
    }

    if (isset($request['email']) && isset($request['password'])) {
      $user = new User();
      $user_data = $user->logIn($request['email'], $request['password']);
      if ($user_data !== false) {
        return Response::json(array(
          'data' => $user_data,
          'error' => false,
        ), 200);
      }

      if (!isset($_SESSION['failures'])) {
        $_SESSION['failures'] = 0;
      }
      $_SESSION['failures']++;

      if ($_SESSION['failures'] >= LOGIN_FAILURES_ALLOWED) {
        $_SESSION['unlock'] = time() + (LOGIN_FAILURES_LOCKOUT_MINUTES * 60);
        return Response::json(array(
          'data' => 'Too many failed login attempts. You must wait ' . LOGIN_FAILURES_LOCKOUT_MINUTES . ' minutes until you can log in again.',
          'error' => true,
        ), 403);
      }

      return Response::json(array(
        'data' => 'Incorrect email or password.<br>After ' . (LOGIN_FAILURES_ALLOWED - $_SESSION['failures']) . ' more failures, you will be locked out for ' . LOGIN_FAILURES_LOCKOUT_MINUTES . ' minutes.',
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
        $user_data = $user->create($request['email'], $request['password'], $request['userData']);
        if (!isset($user_data['error'])) {
          return Response::json(array(
            'data' => $user_data,
            'error' => false,
          ), 201);
        }
        return Response::json(array(
          'data' => 'Could not create account: ' . $user_data['error'],
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
  case 'set-user-data': {
    if ($token !== false && isset($request['userData'])) {
      $user = new User();
      $updated_user = $user->setUserData($token, $request['userData']);
      if ($updated_user === true) {
        return Response::json(array(
          'data' => $updated_user,
          'error' => false,
        ), 200);
      }
      if (isset($updated_user['error'])) {
        return Response::json(array(
          'data' => $updated_user['error'],
          'error' => false,
        ), 500);
      }
      return Response::json(array(
        'data' => 'Could not set user data: missing data',
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
      if (!isset($new_data['error'])) {
        return Response::json(array(
          'data' => $new_data,
          'error' => false,
        ), 200);
      }
      return Response::json(array(
        'data' => 'Could not create dictionary: ' . $new_data['error'],
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
        'data' => 'Could not change dictionary: incorrect data',
        'error' => true,
      ), 401);
    }
    return Response::json(array(
      'data' => 'Could not change dictionary: no token provided',
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
  case 'get-public-dictionary': {
    if (isset($request['dictionary'])) {
      $dictionary = new Dictionary();
      $dictionary_data = $dictionary->getPublicDictionaryDetails($request['dictionary']);
      if ($dictionary_data !== false) {
        $dictionary_data['words'] = $dictionary->getPublicDictionaryWords($request['dictionary']);
        return Response::json(array(
          'data' => $dictionary_data,
          'error' => false,
        ), 200);
      }
      return Response::json(array(
        'data' => 'Could not get dictionary: invalid id',
        'error' => true,
      ), 401);
    }
    return Response::json(array(
      'data' => 'Could not get dictionary: no id provided',
      'error' => true,
    ), 400);
  }
  case 'set-whole-current-dictionary': {
    if ($token !== false && isset($request['dictionary'])) {
      $user = new User();
      $dictionary_data = $user->saveWholeCurrentDictionary($token, $request['dictionary']);
      if ($dictionary_data !== false && !isset($dictionary_data['error'])) {
        return Response::json(array(
          'data' => $dictionary_data,
          'error' => false,
        ), 200);
      }
      if (isset($dictionary_data['error'])) {
        return Response::json(array(
          'data' => $dictionary_data['message'],
          'error' => true,
        ), 500);
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
  case 'delete-current-dictionary': {
    if ($token !== false) {
      $user = new User();
      $dictionary_deleted = $user->deleteCurrentDictionary($token);
      if ($dictionary_deleted !== false) {
        return Response::json(array(
          'data' => $dictionary_deleted,
          'error' => false,
        ), 200);
      }
      return Response::json(array(
        'data' => 'Could not delete dictionary: invalid token',
        'error' => true,
      ), 401);
    }
    return Response::json(array(
      'data' => 'Could not delete dictionary: no token provided',
      'error' => true,
    ), 400);
  }
  case 'set-dictionary-details': {
    if ($token !== false && isset($request['details'])) {
      $user = new User();
      $update_details_success = $user->updateCurrentDictionaryDetails($token, $request['details']);
      if ($update_details_success === true) {
        return Response::json(array(
          // 'data' => 'Updated successfully',
          'data' => $update_details_success,
          'error' => false,
        ), 200);
      }
      if (isset($update_details_success['error'])) {
        return Response::json(array(
          'data' => $update_details_success['error'],
          'error' => true,
        ), 500);
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
      if ($update_words_success === true) {
        return Response::json(array(
          'data' => $update_words_success,
          'error' => false,
        ), 200);
      }
      if (isset($update_words_success['error'])) {
        return Response::json(array(
          'data' => $update_words_success['error'],
          'error' => true,
        ), 500);
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
  case 'delete-word': {
    if ($token !== false && isset($request['word'])) {
      $user = new User();
      $delete_word_success = $user->deleteWordsFromCurrentDictionary($token, array($request['word']));
      if ($delete_word_success !== false) {
        return Response::json(array(
          'data' => 'Deleted successfully',
          'error' => false,
        ), 200);
      }
      return Response::json(array(
        'data' => 'Could not delete word: invalid token',
        'error' => true,
      ), 401);
    }
    return Response::json(array(
      'data' => 'Could not delete word: required data missing',
      'error' => true,
    ), 400);
  }
  case 'delete-words': {
    if ($token !== false && isset($request['wordIds'])) {
      $user = new User();
      $delete_words_success = $user->deleteWordsFromCurrentDictionary($token, $request['wordIds']);
      if ($delete_words_success === true) {
        return Response::json(array(
          'data' => $delete_words_success,
          'error' => false,
        ), 200);
      }
      if (isset($delete_words_success['error'])) {
        return Response::json(array(
          'data' => $delete_words_success['error'],
          'error' => true,
        ), 500);
      }
      return Response::json(array(
        'data' => 'Could not delete words: invalid token',
        'error' => true,
      ), 401);
    }
    return Response::json(array(
      'data' => 'Could not delete words: required data missing',
      'error' => true,
    ), 400);
  }
  case 'initiate-password-reset': {
    if (isset($request['email'])) {
      $user = new User();
      $password_reset = $user->setPasswordReset($request['email']);
      if ($password_reset === true) {
        return Response::json(array(
          'data' => $password_reset,
          'error' => false,
        ), 200);
      }
      if (isset($password_reset['error'])) {
        return Response::json(array(
          'data' => $password_reset['error'],
          'error' => true,
        ), 500);
      }
      return Response::json(array(
        'data' => 'Could not send password reset key: email not found',
        'error' => true,
      ), 401);
    }
    return Response::json(array(
      'data' => 'Could not send password reset key: required data missing',
      'error' => true,
    ), 400);
  }
  case 'password-reset': {
    if (isset($request['code']) && isset($request['password'])) {
      $user = new User();
      $password_reset = $user->setPasswordReset($request['email']);
      if ($password_reset === true) {
        return Response::json(array(
          'data' => $password_reset,
          'error' => false,
        ), 200);
      }
      if (isset($password_reset['error'])) {
        return Response::json(array(
          'data' => $password_reset['error'],
          'error' => true,
        ), 500);
      }
      return Response::json(array(
        'data' => 'Could not send password reset key: email not found',
        'error' => true,
      ), 401);
    }
    return Response::json(array(
      'data' => 'Could not send password reset key: required data missing',
      'error' => true,
    ), 400);
  }

  default: {
    return Response::html('Hi!');
  }
}
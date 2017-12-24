<?php
require_once('./vendor/firebase/php-jwt/src/JWT.php');
use \Firebase\JWT\JWT;

class Token {
  private $key;
  function __construct() {
    $this->key = 'ˈkɑːn.læŋ.ɪŋ_4eva';
  }

  public function encode ($data) {
    return JWT::encode($data, $this->key);
  }

  public function decode ($token) {
    return JWT::decode($token, $this->key, array('HS256'));
  }
}
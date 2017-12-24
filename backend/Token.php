<?php
require_once('./vendor/firebase/php-jwt/src/JWT.php');
require_once('./vendor/firebase/php-jwt/src/BeforeValidException.php');
require_once('./vendor/firebase/php-jwt/src/ExpiredException.php');
require_once('./vendor/firebase/php-jwt/src/SignatureInvalidException.php');
require_once('./vendor/hashids/hashids/lib/Hashids/HashGenerator.php');
require_once('./vendor/hashids/hashids/lib/Hashids/Hashids.php');

use \Firebase\JWT\JWT;
use \Hashids\Hashids;


class Token {
  private $key;
  private $hashids;
  function __construct() {
    $this->key = 'ˈkɑːn.læŋ.ɪŋ_4eva';
    $this->hashids = new Hashids($this->key, 10);
  }

  public function encode ($data) {
    return JWT::encode($data, $this->key);
  }

  public function decode ($token) {
    try {
      return JWT::decode($token, $this->key, array('HS256'));
    } catch (Exception $ex) {
      return false;
    }
  }

  public function hash ($id) {
    return $this->hashids->encode($id);
  }

  public function unhash ($hash) {
    return $this->hashids->decode($hash);
  }
}
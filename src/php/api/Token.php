<?php
require_once(realpath(dirname(__FILE__) . '/../vendor/autoload.php'));

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
    $unhashed = $this->hashids->decode($hash);
    if (count($unhashed) > 0) {
      return $unhashed[0];
    }
    return false;
  }
}
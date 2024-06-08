<?php
require_once(realpath(dirname(__FILE__) . '/./config.php'));

class Db {
  private $dbh;
  public $last_error_info;
  function __construct() {
    $this->dbh = new PDO('mysql:host=localhost;dbname=' . DB_NAME . ';charset=utf8', DB_USER, DB_PASSWORD);
    $this->dbh->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    $this->last_error_info = null;
  }

  public function execute ($query, $params = array()) {
    // Run a query that doesn't require a result to be returned
    $stmt = $this->dbh->prepare($query);
    if ($stmt->execute($params)) {
      $this->last_error_info = null;
      return true;
    }
    $this->last_error_info = $stmt->errorInfo();
    return false;
  }
  
  public function query ($query, $params = array()) {
    // Run a query that returns results
    $stmt = $this->dbh->prepare($query);
    $stmt->execute($params);
    $this->last_error_info = $stmt->errorInfo();
    return $stmt;
  }

  public function lastInsertId () {
    return $this->dbh->lastInsertId();
  }

  public function errorInfo () {
    return $this->dbh->errorInfo();
  }
}
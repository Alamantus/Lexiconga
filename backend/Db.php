<?php
class Db {
  private $dbh;
  function __construct() {
    $this->dbh = new PDO('mysql:host=localhost;dbname=lexiconga;charset=utf8', 'root', 'password');
    $this->dbh->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
  }

  public function execute ($query, $params = array()) {
    $stmt = $this->dbh->prepare($query);
    return $stmt->execute($params);
  }

  public function query ($query, $params = array()) {
    $stmt = $this->dbh->prepare($query);
    $stmt->execute($params);
    return $stmt;
  }

  public function lastInsertId () {
    return $this->dbh->lastInsertId();
  }
}
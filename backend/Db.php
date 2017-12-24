<?php
class Db {
  private $dbh;
  function _construct() {
    $this->dbh = new PDO('mysql:host=localhost;dbname=lexiconga;charset=utf8', 'root', 'password');
    $this->dbh->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
  }

  public function query ($query, $params = array()) {
    $stmt = $this->dbh->prepare($query);
    $stmt->execute($params);
    return $stmt;
  }
}
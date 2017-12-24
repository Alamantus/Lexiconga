<?php
class Response {
  public static function json ($data, $http_code = 200) {
    header('Content-Type: application/json; charset=utf-8');
    http_response_code($http_code);
    echo json_encode($data);
  }

  public static function html ($html, $http_code = 200) {
    header('Content-Type: text/html; charset=utf-8');
    http_response_code($http_code);
    echo $html;
	}
}
<?php
class Response {
  private static function defaultHeaders () {
    header('Expires: Sun, 01 Nov 2015 22:46:51 GMT');
    header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
    header("Cache-Control: post-check=0, pre-check=0", false);
    header("Pragma: no-cache");
  }
  
  public static function json ($data, $http_code = 200) {
    header('Content-Type: application/json; charset=utf-8');
    Response::defaultHeaders();
    http_response_code($http_code);
    echo json_encode($data);
  }
  
  public static function html ($html, $http_code = 200) {
    header('Content-Type: text/html; charset=utf-8');
    Response::defaultHeaders();
    http_response_code($http_code);
    echo $html;
	}
}
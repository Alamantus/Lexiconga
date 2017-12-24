<?php
class Response {
  public static function out ($data, $http_code) {
    header('Content-Type: application/json');
    http_response_code($http_code);
    echo json_encode($data);
	}
}
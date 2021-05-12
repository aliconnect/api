<?php
require_once ('aim.php');
if (is_file($fname = __DIR__."/".explode("/",$url)[1].".php")) require_once ($fname);
//die(a);

// if ($if = is_file($fname = $_SERVER[DOCUMENT_ROOT]."$url$url.php")) require_once ($fname);
// if ($if = is_file($fname = $_SERVER[DOCUMENT_ROOT].$_SERVER[REQUEST_URI].".php")) require_once ($fname);
// die($fname);
//
// die($fname);
// die($_SERVER[DOCUMENT_ROOT]."$url$url.php");

//die($url);
//if (!class_exists($className = str_replace('/','\\',$url))) $className = aim;

//die(aaa.$className);
$aim = new aim();//$className();

$response = $aim->request ([method => $method = $_SERVER[REQUEST_METHOD], url => str_replace("/api","",$_SERVER[REQUEST_URI]), headers => getallheaders(), body => json_decode(file_get_contents('php://input'))]);
//echo json_encode($response[body]);
//exit;
//http_response_code($response[status]);
//die (is_string ($response[body]) ? $response[body] : (utf8_encode(json_encode($response[body] ?: $response))));

if ($response[status] && method_exists(item,$method)) http_response_code($response[status]);
//debug ($response[body],$response[status],$method,method_exists(item,$method));
//die(a.$response[status].method_exists(item,$method));

//die('STATUS '.$response[status]);
//http_response_code(200);
//if ($response[status] != 200) http_response_code($response[status]);
//die(json_encode($response));
// if (is_null($response)) http_response_code($response[status]);
die (is_string ($response[body]) ? $response[body] : (json_encode($response[body] ?: $response,JSON_PRETTY_PRINT)));

// http_response_code($response->status ?: (!isset($response->body) ? 404 : !$response->body ? 202 : 200));
// die (json_encode($response->body));
// die(http_response_code(404));

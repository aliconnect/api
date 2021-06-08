<?php
// header('Access-Control-Allow-Origin: ' . ( array_key_exists('HTTP_REFERER',$_SERVER) ? implode('/',array_slice(explode('/',$_SERVER['HTTP_REFERER']),0,3)) : '*') );
// header('Access-Control-Allow-Origin: *');
// header('Access-Control-Allow-Methods: GET,HEAD,POST,PUT,DELETE,OPTIONS,PATCH');
// header('Access-Control-Allow-Headers: Authorization, Origin, X-Requested-With, Content-Type, Accept, Accept-Charset, Accept-Language, If-Match, If-None-Match, Isolation, Prefer, OData-Version, OData-MaxVersion, X-API-Key, Apikey, Api-Key, Api_Key');
// header('Access-Control-Expose-Headers: OData-Version');
// header('Access-Control-Allow-Credentials: true');
// die('a');
// header('Access-Control-Allow-Origin: ' . ( array_key_exists('HTTP_REFERER',$_SERVER) ? implode('/',array_slice(explode('/',$_SERVER['HTTP_REFERER']),0,3)) : '*') );
// header('Access-Control-Allow-Methods: GET,HEAD,POST,PUT,DELETE,OPTIONS,PATCH');
// header('Access-Control-Allow-Headers: Authorization, Origin, X-Requested-With, Content-Type, Accept, Accept-Charset, Accept-Language, If-Match, If-None-Match, Isolation, Prefer, OData-Version, OData-MaxVersion, X-API-Key, Apikey, Api-Key, Api_Key');
// header('Access-Control-Expose-Headers: OData-Version');
// header('Access-Control-Allow-Credentials: true');
// die('v1-api'.json_encode($_GET));
/** Set error reporting */
// die('INDEX');


// die('test '. $_GET['par']);


// display_errors must on, otherwise cors error will occure
ini_set('display_startup_errors', 1);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
error_reporting(E_ALL);
//error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING & ~E_STRICT & ~E_DEPRECATED);
// if (strstr($_SERVER['REQUEST_URI'],'/api/js/')) require_once ('../js/index.php');
// die('v1beta1api');

// header('Access-Control-Allow-Methods: GET, HEAD, POST, PUT, DELETE, OPTIONS, PATCH');
// header('Access-Control-Allow-Headers: Authorization, Origin, X-Requested-With, Content-Type, Accept, Accept-Charset, Accept-Language, If-Match, If-None-Match, Isolation, Prefer, OData-Version, OData-MaxVersion, X-API-Key, Apikey, Api-Key, Api_Key');
// header('Access-Control-Expose-Headers: OData-Version');
// header('Access-Control-Allow-Credentials: true');
//
// header('Access-Control-Allow-Origin: ' . ( array_key_exists('HTTP_REFERER',$_SERVER) ? implode('/',array_slice(explode('/',$_SERVER['HTTP_REFERER']),0,3)) : '*') );
// die('test '. $_GET['par']);
//
// header("Cache-Control: no-store");
require_once ('../dms/php/aim.php');
// header('Location: /');


// aim()->server()->init();
// (^[v][0-9].*?)\/(|.*\/)(lib|docs|omb|om)(.*)

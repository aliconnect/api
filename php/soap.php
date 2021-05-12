<?php
require_once ('aim.php');
ini_set( "soap.wsdl_cache_enabled", 0 );
ini_set( 'soap.wsdl_cache_ttl', 0 );
$server = new SoapServer(NULL, [
	'uri' => 'http://localhost/api/v1/soap.php'
]);
$server->setClass(aim);
$server->handle();

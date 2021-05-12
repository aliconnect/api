<?php
// die('DOCS'.$_GET['fn']);
header('Access-Control-Allow-Origin: '.(array_key_exists('HTTP_REFERER',$_SERVER) ? implode('/',array_slice(explode('/',$_SERVER['HTTP_REFERER']),0,3)) : '*'));
header('Access-Control-Allow-Methods: GET,HEAD,POST,PUT,DELETE,OPTIONS,PATCH');
header('Access-Control-Allow-Headers: Authorization, Origin, X-Requested-With, Content-Type, Accept, Accept-Charset, Accept-Language, If-Match, If-None-Match, Isolation, Prefer, OData-Version, OData-MaxVersion, X-API-Key');
header('Access-Control-Expose-Headers: OData-Version');
$headers = getallheaders();
$hrefpre = '/docs/Web/';
if (isset($_GET['name'])) {
  header('Content-Type: application/json');
  die(json_encode(yaml_parse_file(__DIR__.'/'.$_GET['name'].'.yaml')));
}
if (strstr($headers['Accept'],'text/html')) {
  readfile(__DIR__.'/index.html');
}
else {
  readfile(__DIR__.str_replace('/docs','',$_SERVER['REQUEST_URI']));
}

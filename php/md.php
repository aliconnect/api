<?php
// header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: no-store");
$headers = array_change_key_case(getallheaders());
$fname = $_GET['url'];
// die($fname.$_GET['filename']);

if (strstr($headers['accept'], 'md')) {
  readfile($_GET['filename']);
} else {
  readfile(__DIR__.'/md.html');
  echo "<script>$(document.body).append($('section').class('main-content row').load('$fname'));</script>";
}

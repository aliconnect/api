<?php
// die($_SERVER['REQUEST_URI']);
// header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
// echo $_GET['url'];
header("Cache-Control: no-store");
$headers = array_change_key_case(getallheaders());
$fname = $_GET['url'];
// die($fname.$_GET['filename']);

if (strstr($headers['accept'], 'markdown')) {
  readfile($_SERVER['DOCUMENT_ROOT'].$fname);
} else {
  // readfile(__DIR__.'/md.html');
  readfile($_SERVER['DOCUMENT_ROOT'].'/index.html');
  // echo "<script>$(document.body).append($('section').class('main-content row').append($('h1').text('$fname')).load('$fname'));</script>";
  // echo "<script>$().on('load',e=>$('list').load('$fname.md'));</script>";

}

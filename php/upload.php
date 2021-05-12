<?php
$content = file_get_contents('php://input');
$name = $_SERVER['DOCUMENT_ROOT'].'/shared/upload/'.date('YmdhIs').'.xml';
file_put_contents($name, $content);
die($name);

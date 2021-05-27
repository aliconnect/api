<?php
// $uri = $_SERVER['REQUEST_URI'];
// $uri = preg_replace('/\/shared\/(.*?)\//','https://fs1.aliconnect.nl/shared/',$uri);
// die($uri);
header('Location: https://fs1.aliconnect.nl'.$_SERVER['REQUEST_URI']);

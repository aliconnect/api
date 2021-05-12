<?php
  die(json_encode(yaml_parse_file($_SERVER['DOCUMENT_ROOT'].$_GET['filename']))); 
?>

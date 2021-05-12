<?php
/**
* @todo
* @author Max van Kampen 
*/
ini_set('display_errors', 1);
error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING & ~E_STRICT & ~E_DEPRECATED);

$items=[];
function readDirs($path){
  global $items;
  $dirHandle = opendir($path);
  $dirs=[];
  while($item = readdir($dirHandle)) {
    $newPath = $path."/".$item;
    if ($item === '.' || $item === '..' || strstr($item, 'secret')) continue;
    if ($item[0] === '_') continue;
    // if (is_numeric($first)) $title = trim(ltrim($title, $first));

    // $title = ucfirst(str_replace(['_','-'],' ',$title));
    $src = $path.'/'.$item;
    if (is_dir($newPath)) {
      if ($dir = readDirs($newPath)) {
        // die($newPath);
        // $items[$title] = $dir;
      }
    } else {
      $items[] = [
        'src'=> $src,
        'dirname'=> $dirname = str_replace('..','',pathinfo(strstr($src,'../'), PATHINFO_DIRNAME)),
        'basename'=> $basename = pathinfo($src, PATHINFO_BASENAME),
        'name'=> $dirname . '/' . $basename,
        'filename'=> pathinfo($src, PATHINFO_FILENAME),
        'ext'=> pathinfo($src, PATHINFO_EXTENSION),
        'lastModifiedDateTime'=> date("Y-m-d H:i:s", filemtime($src)),
      ];
    }
  }
  // return $items;//array_merge($items,$dirs);
}
readDirs(__DIR__.'/..');
foreach($items as $i => $file) {
  // die($file['src']);
  $filecontent = file_get_contents($file['src']);
  preg_match_all('/\/\*\*(?=\r| )(.*?)\*\/\r\n([^\r\n]*)/s', $filecontent, $blocks);
  foreach ($blocks[1] as $i => $content) {
    $nextline = ltrim($blocks[2][$i]);
    foreach (explode("\n", ltrim($content)) as $line) {
      $line = str_replace("\r","",ltrim(ltrim($line), '* '));
      if (preg_match('/@(\w+)(.*)/', $line, $matches)) {
        $line = ltrim($matches[2]);
        if (preg_match_all('/\*(\w+)\*/', $line, $args)) {
          $line = ltrim(str_replace($args[0], '', $line));
          $param = array_merge($param, array_fill_keys($args[1], 1));
        }
        if ($matches[1] === 'class') {
          $objname = $line;
        } else if ($matches[1] === 'property') {
          $objname = strtok($line,' ');
        } else if ($matches[1] === 'function') {
          $objname = $line;
        } else if ($matches[1] === 'event') {
          $objname = $line;
        } else if ($matches[1] === 'todo') {
          $todo[$file['name']][$objname][] = $line;
        }
      }
    }
  }
  // $items[$i] = $file;
}

foreach ($todo as $filename => $objects) {
  $body[] = "# $filename";
  foreach ($objects as $objectname => $todos) {
    $body[] = "## $objectname";
    foreach ($todos as $todo) {
      $body[] = "1. $todo";
    }
  }
}
$body = implode($body,PHP_EOL);
file_put_contents($_SERVER['DOCUMENT_ROOT']."/sites/aliconnect/docs/index/1-Explore/3-What'sNew/5-ToDo.md", $body);
die($body);

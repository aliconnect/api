<?php
ini_set('display_errors', 1);
error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING & ~E_STRICT & ~E_DEPRECATED);
$package = json_decode(file_get_contents('../package.json'));
// die(json_encode($package));
// require_once('icon.php');

function compress_code ($content) {
  global  $no_space_chars;
  $content = implode(' ', array_filter( array_map( function($content){
    $content = trim($content);
    // $content = preg_replace('/\t/', '', $content);
    $content = preg_replace('/,\}/', '}', $content);
    return $content;
  }, explode("\n", $content) ), function($val){return trim($val)==='' ? false : true;}) );
  // $content = implode(' ', array_filter(explode(' ',$content), function($val){return trim($val)==='' ? false : true;}));
  $content = preg_replace("/ ($no_space_chars)/", "$1", $content);
  $content = preg_replace("/($no_space_chars) /", "$1", $content);
  $content = preg_replace("/,\}/", "}", $content);
  $content = preg_replace("/,\]/", "]", $content);
  return $content;
}
function compress_js($content) {
  $chars = str_split($content);
  $code = $s = '';
  for ($x = 0; $x <= count($chars); $x++) {
    if ($chars[$x] === '/') {
      if ($chars[$x+1] === '/' && $chars[$x-1] !== '\\') {
        for ($x; $x <= count($chars); $x++) {
          if ($chars[$x+1] === "\n") {
            break;
          }
        }
        continue;
      }
      if ($chars[$x+1] === '*') {
        for ($x; $x <= count($chars); $x++) {
          if ($chars[$x] === '/' && $chars[$x-1] === '*') {
            break;
          }
        }
        continue;
      }
      if ($chars[$x-1] === '(') {
        $s .= compress_code(trim($code));
        $code = '';
        // $code .= '<<<';
        $s .= $chars[$x];
        for ($x++; $x <= count($chars); $x++) {
          $s .= $chars[$x];
          if ($chars[$x] === '/' && ( $chars[$x-1] !== '\\' || ( $chars[$x-1] === '\\' && $chars[$x-2] === '\\' ))) {
            // $code .= '>>>';
            break;
          }
        }
        continue;
      }
    }
    if (in_array($chars[$x], ['"','`',"'"])) {
      $s .= compress_code(trim($code));
      $code = '';
      // $s .= '<<<';
      $s .= $chars[$x];
      $b = $chars[$x];
      for ($x++; $x <= count($chars); $x++) {
        $s .= $chars[$x];
        if ($chars[$x] === $b && ($chars[$x-1] !== '\\' || $chars[$x-2] === '\\') ) {
          // $s .= '>>>';
          break;
        }
      }
      continue;
    }
    $code .= $chars[$x];
  }
  $s .= compress_code($code);
  $s = preg_replace("/console.debug\(.*?\);/", "", $s);
  $s = preg_replace("/console.log\(.*?\);/", "", $s);
  // $s = preg_replace("/console.log(.*?)/", "", $s);
  $s = preg_replace("/;\}/", "}", $s);
  $s = preg_replace("/,\)/", ")", $s);
  $s = preg_replace("/,\)/", ")", $s);
  // die($s);
  return $s;
}
function compress_css($content) {
  $content = preg_replace('/  /', ' ', $content);
  $content = compress_js($content, ':|;|\{|\}');
  $content = str_replace("{ ", "{", $content
  );
  $content = preg_replace('/; /', ';', $content);
  // $content = str_replace("}","}\r\n", $content);
  return $content;
}
$no_space_chars_config = [
  'css'=> '\{|\}',
  'js'=> ';|>|<|\*|\?|\+|\-|\&|:|,|!|=|\)|\(|\{|\}|\/|\|',
];
$params = [
  'js'=> [
    // 'web'=> ['aim','markdown','qrcode','qrscan','web'],
    'aim'=> [
      'js/aim',
    ],
    // 'web'=> [
    //   'js/aim',
    //   'js/web',
    // ],
    // 'node'=> [
    //   'js/node',
    // ],
    // 'om'=> [
    //   'js/aim',
    //   'js/web',
    //   'js/auth',
    //   'js/signaturepad',
    //   'js/three',
    //   'js/charts',
    //   'js/go',
    //   'js/notification',
    //   'js/calendar',
    //   'js/ganth',
    //   'js/qrcode',
    //   'js/qrscan',
    //   'js/treeview',
    //   'js/listview',
    //   'js/navleft',
    //   'js/om',
    // ],
    // 'om-aliconnect'=> [
    //   'js/om-aliconnect',
    // ],
    // 'full'=> [
    //   'aim-beta',
    //   'web-beta',
    //   'qrcode-beta',
    //   'qrscan-beta',
    //   // 'lib/three/three.min',
    //   // 'lib/three/OrbitControls',
    //   'lib/go/release/go',
    //   // 'lib/amcharts4/core',
    //   // 'lib/amcharts4/charts',
    //   // 'lib/amcharts4/animated',
    // ],
    // // 'test'=> ['web-beta'],
    // 'node'=> [
    //   'node-beta',
    // ],
    // 'web'=> [
    //   'aim-beta',
    //   'web-beta',
    //   'qrcode-beta',
    //   'qrscan-beta',
    // ],
    // 'login'=> [
    //   'aim-beta',
    //   'qrcode-beta',
    //   'qrscan-beta',
    //   'web-beta',
    //   'login-beta',
    // ],
    // 'om'=> [
    //   'aim-beta',
    //   'web-beta',
    //   'qrcode-beta',
    //   'qrscan-beta',
    //   'om-beta',
    // ],
    // // 'full'=> ['aim','web','three/three.min','three/OrbitControls','three/OrbitControls'],
  ],
  'css'=> [
    'web'=> [
      'css/web',
      // 'css/icon',
    ],
    // 'login'=> [
    //   'css/web',
    //   'css/icon',
    //   'css/login',
    // ],
    // 'web'=> ['web-beta', 'icon-beta'],
    // 'login'=> ['web-beta', 'icon-beta', 'login-beta'],
  ],
];


$params = (object)[
  'js'=> [
    'aim',
    'web',
    'qrcode',
    'qrscan',
    'node',
    'om',
    'login',
    'cam',

    // 'auth',
    // 'signaturepad',
    // 'three',
    // 'charts',
    // 'go',
    // 'notification',
    // 'calendar',
    // 'ganth',
    // 'treeview',
    // 'listview',
    // 'navleft',
    // 'upload',
    // 'client',
    // 'docs',
    // 'index',
    // 'cam',
    // 'xlsx',
    // 'jszip',
  ],
  'css'=> [
    'web',
    'icon',
    'login',
    'calendar',
    'ganth',
    // 'ganth',
    // 'login',
    // 'client',
  ],
];

$compressed_file = [];
function file_put($sourcename, $destname, $content) {
  global $package;
  // $sdkpath = realpath("../../../sdk/api/release");
  // $releasepath = realpath("../release");
  // die($releasepath);
  // echo $package->version;
  // $basename = explode('/', $fname);
  // $basename = array_pop($basename);
  // $content = "/** $basename\n * @version $package->version\n * @released ".date('d-m-Y H:i:s')."\n * copywright (C) 1991 Alicon -- https://alicon.aliconnect.nl \n */\n".$content;
  // die(realpath("..") . $fname);
  // die(realpath("../../../sdk/api") . $fname);
  // $destname = $path . $fname;
  echo "$sourcename > $destname<br>";
  return;
  file_put_contents($destname, $content);
  // die($destname. realpath($destname));
  // file_put_contents("../../../sdk/api" . $fname, $content);
  // die('done');
}
// die($releasepath);
// die('aaa');
foreach ($params as $ext => $dest_arr) {
  $no_space_chars = $no_space_chars_config[$ext];
  $func_name = "compress_$ext";
  foreach ($dest_arr as $dest_name) {
    if ($sourcename = realpath(__DIR__."/../$ext/".$dest_name."_debug.$ext")) {
      $content = file_get_contents($sourcename);
      $content = $func_name($content);
      // die(realpath("../../api"));
      $destname = realpath(__DIR__."/../$ext")."/".$dest_name.".$ext";
      // die($destname);
      // echo "$sourcename > $destname<br>";
      // file_put($sourcename, $content, realpath("../../api")."/$ext/$dest_name.$ext");
      // continue;
      file_put_contents($destname, $content);
      // file_put("/$ext/$dest_name.$ext", $content, "../../sdk/api");
    }
    // if (is_file("../dapi/css/$dest_name.css")) {
    //   $params->css[] = $dest_name;
    // }
  }
}
// echo $_SERVER['SERVER_NAME'].' publish | version '.$package->version.' | '.date('Y-m-d H:i:s');

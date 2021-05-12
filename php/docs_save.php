<?php
header('Access-Control-Allow-Methods: GET, HEAD, POST, PUT, DELETE, OPTIONS, PATCH');
header('Access-Control-Allow-Headers: Authorization, Origin, X-Requested-With, Content-Type, Accept, Accept-Charset, Accept-Language, If-Match, If-None-Match, Isolation, Prefer, OData-Version, OData-MaxVersion, X-API-Key, Apikey, Api-Key, Api_Key');
header('Access-Control-Expose-Headers: OData-Version');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Origin: *');
$input = file_get_contents('php://input');

if ($_GET['doc']) {
  file_put_contents('docs.html', $input);
  die();
}



$docs = yaml_parse_file('docs_src.yaml');
$docs = array_replace_recursive($docs ?: [],json_decode($input, true));
yaml_emit_file('docs.yaml', $docs);

$root = $_SERVER[DOCUMENT_ROOT].'/sites/aliconnect/docs/index/Develop/Javascript/';

function recursive ($docs, $root) {
  foreach ($docs as $name => $descriptor) {
    // echo $root."$name.md";
    $fname = $root."$name.md";
    if ($descriptor['value'] && is_array($descriptor['value'])) {
      $path = $root.$name;
      if (!file_exists($path)) {
        mkdir($path, 0777, true);
      }
      foreach ($descriptor['value'] as $key => $value) {
        $types[$value['type']][$key] = $value;
        if ($value['code']) {
          $content = ["# $key"];
          $fname = "$path/$key.md";
          if ($value['prototype']) {
            foreach ($value['prototype'] as $protoName => $proto) {
              $content[] = "- $protoName";
            }
            recursive($value['prototype'], "$path/$key/");
            $fname = "$path/$key/README.md";
          }
          $oldcontent = file_get_contents($fname);

          if (preg_match('/(<\!-- sample -->.*<\!-- sample -->)/s', $oldcontent, $match) == 1) {
              $content[] = $match[1];
          }
          $content[] = "## Javascript";
          $content[] = "```js";
          $content[] = $value['code'];
          $content[] = "```";
          file_put_contents($fname, implode("\n",$content));
        }
      }
      $content = ["# $name"];
      foreach ($types as $type => $list) {
        $content[] = "## $type";
        foreach ($list as $key => $value) {
          $content[] = "- $key";
        }
      }
      $fname = "$path/README.md";
      $content = implode("\n",$content);
      file_put_contents($fname, $content);
      // return;
    }
    // $oldcontent = file_get_contents($fname);
    // if (strcmp($oldcontent,$content) !== 0) {
      // echo $fname;
    // }
  }
}
recursive($docs, $root);



// echo "JA".json_decode(file_get_contents('php://input'));


// echo $input;

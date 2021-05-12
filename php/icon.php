<link href="../css/icon.css" rel="stylesheet" />
<link href="../css/web.css" rel="stylesheet" />
<style>
.row.top.sample {
  line-height: 30px;flex-wrap: wrap;
}
.sample .abtn {
  border:solid 1px #ccc;
  flex-basis: 160px;
}
</style>
<?php
$content = "
@font-face {
  font-family: 'AliconnectIcon';
  src: url('/api/fonts/aliconnecticon.eot') format('embedded-opentype'), url('/api/fonts/aliconnecticon.woff') format('woff'), url('/api/fonts/aliconnecticon.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}";
$data = json_decode(file_get_contents(__DIR__."/icon.json"));

for ($x = 61440; $x <= 62853; $x++) {
  $symbols[dechex($x)]="";
}

echo "<h1>By category</h1>";
foreach ($data as $groupname => $icons) {
  echo "<h2>$groupname</h2><div class='row top sample'>";
  foreach ($icons as $iconName => $symbol){
    $symbols[$symbol] = $iconName;
    $IconName=ucfirst($iconName);
    $content .= "\n.abtn.$iconName::before {content:'\\$symbol';}.icn.$iconName::before {content:'\\$symbol';}";
    echo "<button class='abtn $iconName' label='$iconName \\$symbol'></button></span>";
  }
  echo "</div>";
}

file_put_contents(__DIR__."/../css/icon.css", $content);

echo "<h1>By symbol number</h1><div class='row top sample'>";
foreach ($symbols as $symbol => $iconName){
  $IconName=ucfirst($iconName);
  echo "<button class='abtn' label='\\$symbol $iconName'><i>&#x$symbol;</i></button>";
}
echo "</div>";

echo "<h1>How to use</h1><div><pre><code>".htmlentities('
<link href="/api/css/icon.css" rel="stylesheet" />
<link href="/api/css/web.css" rel="stylesheet" />
<nav><button class="abtn {name}"></button></nav>
<nav><button class="abtn"><i>&#xe000;</i></button></nav>
')."</code></pre></div>";

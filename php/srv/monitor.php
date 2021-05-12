<style>
td{padding:5px,10px;}
</style>
<?php
require_once (__DIR__."/../connect.php");

$res=db(aim)->query("
SET NOCOUNT ON
DECLARE @T TABLE (LogDate DATETIME,ProcessInfo VARCHAR(100), Text TEXT)
INSERT @T
EXEC sp_readerrorlog 0, 1, 'Login failed'
SELECT SUBSTRING(Text,CHARINDEX('[',Text)+9,CHARINDEX(']',Text)-CHARINDEX('[',Text)-9) AS ip FROM @T GROUP BY  SUBSTRING(Text,CHARINDEX('[',Text)+9,CHARINDEX(']',Text)-CHARINDEX('[',Text)-9) ORDER BY MAX (logdate) DESC
SELECT SUBSTRING(Text,CHARINDEX('[',Text)+9,CHARINDEX(']',Text)-CHARINDEX('[',Text)-9) AS ip,* FROM @T ORDER BY logdate DESC
");
while ($row = db(aim)->fetch_object($res)) {
    foreach ($row as $key=>$value) echo "$value<br>";
}
db(aim)->next_result ( $res );
echo "<table>";
while ($row = db(aim)->fetch_object($res)) {
    echo "<tr>";
    foreach ($row as $key=>$value) echo "<td>$value</td>";
    echo "</tr>";
}
echo "</table>";

?>

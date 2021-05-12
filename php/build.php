<?php
//$get=(object)$_GET;
/*
	1 genereer database fiels
	2 genereer db code (views, stored procedures, triggers, functions)
	3 creer xml/json data files
*/

//function clean($row){
//    unset($row->config);
//    foreach($row as $key=>$value){
//        if($value=="")unset($row->$key);
//        elseif (is_numeric($value))$row->$key=floatval($value);
//        //$row->$key=intval($value);
//    }
//    return $row;
//}

if (isset($_GET[setup])){
	//die(json_encode($config));
	// oplossen host enz, geen index.php gestart!!!
	global $aim;
	$aim->host=$_GET[host];
	//die(json_encode($config));
	//err($aim);

	//if($_SERVER[SERVER_NAME]=="aliconnect.nl")die("SETUP ON SERVER aliconnect.nl NOT ALLOWED");
	echo "
		<h1>SETUP AIM</h1>
		<div>SERVER=localhost,HOST=$aim->host</div>
		<form method='post' enctype='multipart/form-data'>
			Geef database gebruiker<br>
			<input type='text' name='username' value='aim' required><br>
			Geef database wachtwoord<br>
			<input type='password' name='password' required value=qwertyuiop><br>
			<input type=submit value='Import' name='submit'>
		</form>";

	if($_POST[submit]){
		if (!file_exists($fdest=__DIR__."/config.json"))copy(__DIR__."/config.template.json",$fdest);
		$config=json_decode(file_get_contents($fdest));
		$config->dbs->user=$_POST[username];
		$config->dbs->password=$_POST[password];
		$config->dbs->server='localhost';
		file_put_contents($fdest,stripslashes(json_encode($config,JSON_PRETTY_PRINT)));
		require_once (__DIR__."/connect.php");
		$sql=file_get_contents("sql/aim.create.sql");
		//$sql=str_replace("TEXT (16)","TEXT",$sql);
		//die($sql);
		$arr=explode("\r\nGO",$sql);
		foreach($arr as $sql) query($sql,true);
		query("USE aim");
		query("
			DELETE FROM om.freeID;
			DELETE FROM om.items;
			DELETE FROM om.attributes;
			DBCC CHECKIDENT ('om.items', RESEED, 10000) WITH NO_INFOMSGS;
			DBCC CHECKIDENT ('om.attributes', RESEED, 10000) WITH NO_INFOMSGS;
		");

		$fdest=$_SERVER[DOCUMENT_ROOT]."/Web.config";
		if (!file_exists($fdest=$_SERVER[DOCUMENT_ROOT]."/Web.config"))copy($_SERVER[DOCUMENT_ROOT]."/Web.template.config",$fdest);

		if (file_exists($fdest=$_SERVER[DOCUMENT_ROOT]."/sites/$aim->host/api/v1/sql/$aim->host.create.sql")){
			$row=fetch_object(query("SELECT * FROM sys.databases WHERE name = N'dms'"));
			if(!$row){
				echo "Uitvoeren sql".PHP_EOL;
				$sql=file_get_contents($fdest);
				querysql($sql);
			}
			else {
				echo"Database $aim->host exists<br>";
			}
		}
		die("<br>AIM Setup done");
	}
	die();
}


// require_once (__DIR__."/connect.php");

if (isset($_GET[getAccount])){
	$row=fetch_object(query($q="EXEC api.getAccount @hostId='$aim->hostID', @userId='$aim->userID',@select=1"));
	//$row->q=$q;
	header('Content-type: application/json');
	if (isset($_GET[download])) {
    header("Content-disposition: attachment; filename=aliconnectAccount$row->accountId$row->accountName".date("Ymd_hi").".json");
  }
	die(json_encode($row));
}

if (isset($_GET[setAccount])){
	$dbs=$config->dbs;
	if($_SERVER[SERVER_NAME]=="aliconnect.nl" || $dbs->server=="aliconnect.nl")die("User CREATE ON SERVER aliconnect.nl NOT ALLOWED");
	echo "
	<style>span{display:inline-block;</style>
	<div>SERVER=$dbs->server</div>
	<form method='post' enctype='multipart/form-data'>
		Select aliconnect export JSON to import
		<input type='file' name='fileImport'><br>
		Password<br>
		<input name='password' type='password' required></input><br>
	    <input type=submit value='Import' name='submit'>
	</form>";
	if($_POST[submit]){
		$post=(object)$_POST;
		$put=json_decode(file_get_contents($_FILES["fileImport"]["tmp_name"]));
		//die(json_encode($put));
		query($q="EXEC api.setAccount @password='$post->password',".params($put));
		die($q);
	}
	die();
}

function array_values_sql($values){
	return array_map(function($val){return is_null($val)?"NULL":"'".str_replace("'","''",$val)."'";},array_values((array)$values));
}

if (isset($_GET[import])){
	$dbs=$config->dbs;
	if($dbs->server!='localhost')die("Setup on $dbs->server not allowed. Only on localhost");

	//if($_SERVER[SERVER_NAME]=="aliconnect.nl" || $dbs->server=="aliconnect.nl")die("IMPORT ON SERVER aliconnect.nl NOT ALLOWED");
	$aim->host=$_GET[host];
	echo "
	<div>SERVER=$dbs->server,HOST=$aim->host</div>
	<form method='post' enctype='multipart/form-data'>
		Select aliconnect export JSON to import
		<input type='file' name='fileImport'>
	    <input type=submit value='Import' name='submit'>
	</form>";
	if($_POST[submit]){
		$content=json_decode(file_get_contents($_FILES["fileImport"]["tmp_name"]));
		query("USE aim");
		$path=$_SERVER[DOCUMENT_ROOT]."/sites/$aim->host/app/v1";
		$config=json_decode(file_get_contents($configFilename="$path/config.json"));
		$config->client->system->id=$content->rootID;
		$config->client->system->uid=$content->items->{$content->rootID}->uid;
		foreach($content->items as $id=>$item){
			if($item->masterID==$content->rootID && $item->classID==1008) {
				$config->client->device->id=$id;
				$config->client->device->uid=$item->uid;
				break;
			}
		}
		file_put_contents($configFilename,stripslashes(json_encode($config,JSON_PRETTY_PRINT)));
		file_put_contents("$path/config.bat",'SET id='.$config->client->system->id.PHP_EOL.'SET uid='.$config->client->system->uid.PHP_EOL.'SET root="\aim\www"');

		echo "<div>Host: <b>".$aim->host."</b> <b>".$content->hostID."</b></div>";
		echo "<div>System: <b>".$config->client->system->id."</b>, <b>".$config->client->system->uid."</b></div>";
		echo "<div>Device: <b>".$config->client->device->id."</b>, <b>".$config->client->device->uid."</b></div>";

		echo "<br><a href='/$aim->host/app/auth/?redirect_uri=/$aim->host/app/oml/' target='oml'>Aanmelden</a>";
		//die($quser);

		query($sql.="DISABLE TRIGGER ALL ON om.items;DISABLE TRIGGER ALL ON om.attributes;");

		$q.="SET DATEFORMAT YMD;DELETE om.attributes;DELETE om.freeid;DELETE om.items;DELETE om.attributeName;";

		$q.="SET IDENTITY_INSERT om.items OFF;SET IDENTITY_INSERT om.attributeName OFF;SET IDENTITY_INSERT om.attributeName ON;";
		foreach($content->attributeName as $id=>$value)$q.="\r\nIF NOT EXISTS(SELECT 0 FROM om.attributeName WHERE id=$id)INSERT om.attributeName(id,name)VALUES($id,'$value');";
		$q.="SET IDENTITY_INSERT om.attributeName OFF;";

		$q.="SET IDENTITY_INSERT om.items ON;";
		foreach($content->class as $id=>$value)$q.="IF NOT EXISTS(SELECT 0 FROM om.items WHERE id=$id)INSERT om.items(id,classID,hostID,masterID,srcID,name)VALUES($id,0,0,0,0,'$value');";
		$q.="SET IDENTITY_INSERT om.items OFF;";


		if($content->items){
			//foreach($content->items as $id=>$item) $q.="DELETE om.attributes WHERE id=$id;DELETE om.freeid WHERE id=$id;DELETE om.items WHERE id=$id;";
			foreach($content->items as $id=>$item){
				unset($item->PrimaryKey,$item->ChildIndex,$item->CreatedDateTime,$item->StartDateTime,$item->EndDateTime,$item->FinishDateTime,$item->LastModifiedDateTime,$item->UniqueKey);
				//$qa.="\r\nDELETE om.attributes WHERE id=$id;";
				//if($item->classID==4133)
				foreach($item->values as $attributeName=>$attribute){
					//err($attribute);


					foreach($attribute as $key=>$value)if(is_object($value))$attribute->$key=json_encode($value);

					//$attribute=(array)$attribute;
					//array_walk($attribute,function(&$row){ $row=str_replace("'","''",$row);});
					//$qa.="INSERT om.attributes(".implode(",",array_keys($attribute)).")VALUES('".  implode("','",array_values($attribute))   ."');";



					//unset($attribute->values,$attribute->activeCnt);
					//$attribute=(array)$attribute;
					//err($attribute);


					$qa.="INSERT om.attributes(".implode(",",array_keys((array)$attribute)).")VALUES(".implode(",",array_values_sql($attribute)).");";


					//die($qa);
				}
				unset($item->values,$item->itemID,$item->indexDT,$item->itemConfig,$item->location);


				//foreach($item as $key=>$value)$item->$key=str_replace("'","''",is_object($value)?json_encode($value):$value);

				//err($item);


				if(count((array)$item))$qi.="\r\nINSERT om.items(id,".implode(",",array_keys((array)$item)).")VALUES($id,".implode(",",array_values_sql($item)).");";

				//die($qi);

				//if(count((array)$item))$qi.="\r\nINSERT om.items(id,".implode(",",array_keys((array)$item)).")VALUES($id,".implode(",",function($val){return is_null($val)?"NULL":"'$val'";},array_values((array)$item))).");";
			}
			$q.="SET IDENTITY_INSERT om.attributes OFF;SET IDENTITY_INSERT om.items OFF;SET IDENTITY_INSERT om.items ON;$qi;SET IDENTITY_INSERT om.items OFF;SET IDENTITY_INSERT om.attributes OFF;SET IDENTITY_INSERT om.attributes ON;$qa;SET IDENTITY_INSERT om.attributes OFF;";
		}
		query($sql.="ENABLE TRIGGER ALL ON om.items;ENABLE TRIGGER ALL ON om.attributes;");
		$q=str_replace(";",";\r\n",$q);
		$q=str_replace("\r\n\r\n","\r\n",$q);
		$q=str_replace("0000Z","Z",$q);
		file_put_contents(__DIR__."/sql/aim.import.sql","USE aim\r\nGO\r\n".$q);


		//$row=fetch_object(query("EXEC api.getAccount @select=1, @hostName='$aim->host', @email='$aim->host@aliconnect.nl'"));
		//if (!$row->userId){
		//    $password=getPassword();
		//    $password="Welkom1234!";
		//    //EXEC api.setAccount @select=1, @hostName='dms', @email='dms@aliconnect.nl', @password='dynniq', @userName='DMS Admin', @groupName='Admin', @userId=265090, @hostId=3562718, @accountId=3564660, @groupId=3564659
		//    //query($sql.="EXEC api.setAccount @select=1, @hostName='$aim->host', @email='$aim->host@aliconnect.nl', @password='$password', @userName='$aim->host Admin', @groupName='Admin', @hostID=$content->hostID, @userID=900;");
		//    query($quser="EXEC api.setAccount @select=1, @hostName='$aim->host', @email='$aim->host@aliconnect.nl', @password='$password', @userName='$aim->host Admin', @groupName='Admin', @hostID=$content->hostID, @userID=800, @accountID=801, @groupID=802, @userUID='718e9b30-72e7-4bcd-a35f-3c3a2c3b247e';");
		//    //echo "<br>$q<br>";
		//    echo"<div>AccountName: <b>$aim->host@aliconnect.nl</b><br>AccountPassword: <b>$password</b></div><br>";
		//}

		$password="Welkom1234!";
		$q.="EXEC api.setAccount @select=1, @hostName='$aim->host', @email='$aim->host@aliconnect.nl', @password='$password', @userName='$aim->host Admin', @groupName='Admin', @userID=800, @accountID=801, @groupID=802, @userUID='718e9b30-72e7-4bcd-a35f-3c3a2c3b247e';";
		echo"<div>AccountName: <b>$aim->host@aliconnect.nl</b><br>AccountPassword: <b>$password</b></div><br>";

		$q.="delete om.attributes where fieldid in (1738,2007,2006,2004,1921,1920,1919,1918,1917,1916,1915,1914,1890,1891,1898)";

		querysql($q);
		echo "<div>Total Items: <b>".$row=fetch_object($res=query("SELECT COUNT(0) AS cnt FROM om.items"))->cnt."</b></div>";
		echo "<div>Total Attributes: <b>".$row=fetch_object($res=query("SELECT COUNT(0) AS cnt FROM om.attributes"))->cnt."</b></div>";





		die();
	}
	die();
}
if (isset($_GET[loadimport])){
	$dbs=$config->dbs;
	if($_SERVER[SERVER_NAME]=="aliconnect.nl" || $dbs->server=="aliconnect.nl")die("IMPORT ON SERVER aliconnect.nl NOT ALLOWED");
	$sql=file_get_contents(__DIR__."/sql/aim.import.sql");
	querysql($sql);
	die("<plaintext>".$sql);
}

if (strtolower($_SERVER[REQUEST_METHOD])==put) {
	$put=json_decode(file_get_contents('php://input'));
	die("Data uploaded".json_encode($put->class));
}

if (isset($_GET[phplibs])) {
	$files = array_filter(scandir(__DIR__."/"),function($var){return preg_match('/(^\.|^_| Copy| kopie|test|pdfdoc)/',$var)!=1 && preg_match('/(.php)/',$var);});
	die(json_encode(array_values($files)));
}

if (isset($_GET[phpsource])) {
    die(highlight_file(__DIR__."/".$_GET[phpsource].".php"));
}

if (isset($_GET[phplib])) {
	$classes=get_declared_classes();
	require(__DIR__."/".$_GET[phplib]);
	$classes=array_slice(get_declared_classes(),count($classes));
	foreach ($classes as $className){
		$methods=get_class_methods($className);

		foreach($methods as $methodName) {
			$func = new ReflectionMethod( $className, $methodName );
			//$func = new ReflectionFunction("test::myfunction");
			$filename = $func->getFileName();
			$start_line = $func->getStartLine() - 1; // it's actually - 1, otherwise you wont get the function() block
			$end_line = $func->getEndLine();
			$length = $end_line - $start_line;
			$source = file($filename);
			$body = implode("", array_slice($source, $start_line, $length));
			//$data->$className->$methodName="";
			$data->$className->$methodName=$body;
		}
	}
	die(json_encode($data));
}

if (isset($_GET[php])) {
	$files = array_filter(scandir(__DIR__."/"),function($var){return preg_match('/(^\.|^_| Copy| kopie|test|pdfdoc)/',$var)!=1 && preg_match('/(.php)/',$var);});
	//$files=array('build.php');
	//$files=explode(',','aim-mse.php,aim-pdfdoc.php,ana.php,api.php,build.php,company.php,compress.php,connect.php,contact.php,content.php,definitions.php,doctree.php,icon.php,index.php,lf.php,lib.php,mail.php,maildoc.php,mse.php,rc.php,setup.php,shop.php,site.php,sms_send.php,soap.php,system.php,task.php,threed.php,uploadbank.php,uploadfile.php');
	//$files=explode(',','aim-mse.php,aim-pdfdoc.php,ana.php,api.php,build.php,company.php,compress.php,connect.php,contact.php,content.php,definitions.php,doctree.php,icon.php,index.php,lf.php,lib.php,mail.php,maildoc.php,mse.php,rc.php,setup.php');
	//$files=explode(',','aim-mse.php,aim-pdfdoc.php,ana.php,api.php,build.php,company.php,compress.php,connect.php,contact.php,content.php,definitions.php,doctree.php,icon.php,index.php,lf.php,lib.php,mail.php,maildoc.php,mse.php,rc.php,setup.php,shop.php,site.php,sms_send.php,soap.php,system.php,task.php,threed.php,uploadbank.php,uploadfile.php');
	//die(implode(',',$files));
	//$data->files=$files;
	foreach($files as $fname)if(is_file($filename=__DIR__."/".$fname))$data->$fname=show_source($filename,true);
	die(json_encode($data));
}

if (isset($_GET[tables])){
	$res=query("DECLARE @T TABLE (object_id INT, schema_id INT, name VARCHAR(500))
		INSERT @T
		SELECT object_id,schema_id,name FROM sys.tables WHERE name not like '[_]%'

		SELECT T.object_id,S.name [schema],TB.name--,*
		FROM @T T
		INNER JOIN sys.tables TB ON TB.object_id=T.object_id
		INNER JOIN sys.schemas S ON S.schema_id=TB.schema_id
		ORDER BY s.name

		SELECT T.object_id,C.name,TP.name [type] FROM sys.columns C INNER JOIN @T T ON T.object_id=C.object_id INNER JOIN sys.types TP ON TP.system_type_id=C.system_type_id
	");
	while ($row=fetch_object($res)) {
		$data->tables->{"$row->schema.$row->name"}=$tables->{$row->object_id}=$row;
		unset($row->object_id);
	}
	next_result($res);
	while ($row=fetch_object($res)) {
		$tables->{$row->object_id}->columns->{$row->name}=$row;
		unset($row->object_id,$row->name);
	}
	die (json_encode($data->tables));
}

if (isset($_GET[lib])){
	function compress($content){
		$content = preg_replace('/\/\*[^\/]*\*\/|\t|\r\n/', '', $content);
		$content = preg_replace('/((\'[^\']*\')(*SKIP)(*FAIL)|(        |       |      |     |    |   |  ))/', " ", $content);
		//$content = preg_replace('/(("[^"]*"|\'[^\']*\')(*SKIP)(*FAIL)|(        |       |      |     |    |   |  ))/', " ", $content);
		$content = preg_replace('/((replace[^\)]*\))(*SKIP)(*FAIL)|(} | } | }))/', "}", $content);
		$content = preg_replace('/((replace[^\)]*\))(*SKIP)(*FAIL)|({ | { | {))/', "{", $content);
		$content = preg_replace('/((replace[^\)]*\))(*SKIP)(*FAIL)|(= | = | =))/', "=", $content);
		$content = preg_replace('/((replace[^\)]*\))(*SKIP)(*FAIL)|(&& | && | &&))/', "&&", $content);
		$content = preg_replace('/((replace[^\)]*\))(*SKIP)(*FAIL)|(\|\| | \|\| | \|\|))/', "||", $content);
		$content = preg_replace('/((replace[^\)]*\))(*SKIP)(*FAIL)|(, | , | ,))/', ",", $content);
		$content = preg_replace('/((replace[^\)]*\))(*SKIP)(*FAIL)|(: | : | :))/', ":", $content);
		$content = preg_replace('/((replace[^\)]*\))(*SKIP)(*FAIL)|(; | ; | ;))/', ";", $content);
		$content = preg_replace('/((replace[^\)]*\))(*SKIP)(*FAIL)|(- | - | -))/', "-", $content);
		$content = preg_replace('/((replace[^\)]*\))(*SKIP)(*FAIL)|(< | < | <))/', "<", $content);
		$content = preg_replace('/((replace[^\)]*\))(*SKIP)(*FAIL)|(> | > | >))/', ">", $content);
		$content = preg_replace('/((replace[^\)]*\))(*SKIP)(*FAIL)|(\* | \* | \*))/', "*", $content);
		$content = preg_replace('/((replace[^\)]*\))(*SKIP)(*FAIL)|(\+ | \+ | \+))/', "+", $content);
		$content = preg_replace('/((replace[^\)]*\))(*SKIP)(*FAIL)|(\? | \? | \?))/', "?", $content);
		$content = preg_replace('/((replace[^\)]*\))(*SKIP)(*FAIL)|(\/ | \/ | \/))/', "||", $content);
		return $content;
	}
	function compress_js($content){
		$content = preg_replace('/\t/', '', $content);
		$content = preg_replace('/(("[^"]*"|\'[^\']*\')(*SKIP)(*FAIL)|\/\/[\s\S]+?)\r\n/', "", $content);
		$content = compress($content);
		$content = preg_replace('/\) | \) | \)/', ")", $content);
		$content = preg_replace('/\( | \( | \(/', "(", $content);
		return $content;
	}
	function compress_css($content){
		$content = compress($content);
		return $content;
	}

	$files = array_filter(scandir(__DIR__."/../lib/js"),function($var){return preg_match('/(^\.|^_| Copy| kopie|test)/',$var)!=1 && preg_match('/(.js)/',$var);});
	foreach($files as $fname){
		$content=compress_js(file_get_contents('../lib/js/'.$fname));
		file_put_contents('../lib/js/min/'.str_replace(".js","-min.js",$fname),$content);
	}

	$files = array_filter(scandir(__DIR__."/../lib/css"),function($var){return preg_match('/(^\.|^_| Copy| kopie|test)/',$var)!=1 && preg_match('/(.css)/',$var);});
	foreach($files as $fname){
		$content=compress_js(file_get_contents('../lib/css/'.$fname));
		file_put_contents('../lib/css/min/'.str_replace(".css","-min.css",$fname),$content);
	}
	die(done);
	die(json_encode($files));

	//$content=compress_js(file_get_contents('../lib/js/app.js'));file_put_contents('../lib/js/app-min.js',$content);
	//echo $content=compress_js(file_get_contents('../lib/js/om.js'));file_put_contents('../lib/js/om-min.js',$content);
	//$content=compress_css(file_get_contents('../lib/css/page.css'));file_put_contents('../lib/css/page-min.css',$content);
	//$content=compress_css(file_get_contents('../lib/css/om.css'));file_put_contents('../lib/css/om-min.css',$content);
	//$content=compress_css(file_get_contents('../lib/css/app.css'));file_put_contents('../lib/css/app-min.css',$content);
}

if (isset($_GET[sqljson])){
	die(file_get_contents(__DIR__."/sql/sql.json"));
}

if (isset($_GET[sql])){
	$res=query("USE AIM");
	$res=query("
	DECLARE @T TABLE (object_id INT,referenced_major_id INT,name VARCHAR(500),ref VARCHAR(500),ot VARCHAR(500),rt VARCHAR(500))
	INSERT @T
	SELECT DISTINCT P.object_id,referenced_major_id,S1.name+'.'+O1.name AS obj,S2.name+'.'+O2.name AS ref  ,O1.type,O2.type
	FROM sys.sql_dependencies P
	INNER JOIN sys.objects O1 ON O1.object_id=P.object_id AND O1.name NOT LIKE '[_]%' --AND O1.type='V'
	INNER JOIN sys.schemas S1 ON S1.schema_id=O1.schema_id
	INNER JOIN sys.objects O2 ON O2.object_id=P.referenced_major_id AND O2.name NOT LIKE '[_]%' --AND O2.type='V'
	INNER JOIN sys.schemas S2 ON S2.schema_id=O2.schema_id
	WHERE P.object_id<>P.referenced_major_id

	DECLARE @P TABLE(level INT,object_id INT,name VARCHAR(500),ot VARCHAR(500),referenced_major_id INT,ref VARCHAR(500),rt VARCHAR(500))
	DECLARE @level INT
	SET @level=0

	INSERT @P
	SELECT @level,O1.object_id,S1.name+'.'+O1.name AS obj,type,null,null,null
	FROM sys.objects O1
	INNER JOIN sys.schemas S1 ON S1.schema_id=O1.schema_id
	WHERE O1.object_id NOT IN (SELECT object_id FROM @T) AND O1.type NOT IN ('S','D','PK','IT','SQ','UQ') AND O1.name NOT LIKE '[_]%'

	WHILE @level<5
	BEGIN
		SET @level=@level+1
		INSERT @P
		SELECT DISTINCT @level,T.object_id,T.name,T.ot,T.referenced_major_id,T.ref,T.rt
		FROM @T T WHERE object_id NOT IN (
			SELECT DISTINCT object_id FROM @T WHERE referenced_major_id NOT IN (SELECT object_id FROM @P)
		)
		AND T.object_id NOT IN (SELECT DISTINCT object_id FROM @P)
	END

	SET NOCOUNT OFF

	--SELECT TABLE DEF
	SELECT S.name schemaname,T.name,api.getDefinitionTable(t.object_id) definition
	FROM sys.tables t
	INNER JOIN sys.schemas S ON S.schema_id=T.schema_id
	where t.name not like '[_]%' --and o.name='wordAdd'
	order by S.name,T.name

	--SELECT SQL
	SELECT P.level,P.idx,M.object_ID,S.name schemaname,O.name name,O.type,type_desc,M.definition
	FROM sys.sql_modules M
	INNER JOIN (
	SELECT DISTINCT
		level,object_id,name,ot,
		CASE ot WHEN 'U' THEN 0 WHEN 'TR' THEN 3 WHEN 'FN' THEN 11 WHEN 'TF' THEN 12 WHEN 'IF' THEN 13 WHEN 'V' THEN 5 WHEN 'P' THEN 31 ELSE 50 END
		idx
		FROM @P
	) P ON P.object_id = M.object_ID
	INNER JOIN sys.objects O ON O.object_id=M.object_id
	INNER JOIN sys.schemas S ON S.schema_id=O.schema_id
	WHERE o.name NOT LIKE '[_]%'
	ORDER BY P.level,P.idx,S.name,O.name

	");

	$l="\r\n-- ===============================================\r\n";

	$dbname=$_GET[dbname]?:"AIM";
	while($row=fetch_object($res)) {//TABLE DEF
		$schema->{$row->schemaname}=null;
		//$sql.="$l-- TABLE $row->schemaname.$row->name$l";

		$row->definition=str_replace(" (","(",$row->definition);
		$row->definition=str_replace(" (","(",$row->definition);
		$row->definition=str_replace(" (","(",$row->definition);
		$row->definition=str_replace(" (","(",$row->definition);
		$row->definition=str_replace("TEXT(16)","TEXT",$row->definition);
		$sql.=PHP_EOL.str_replace("\r","\r\n",$row->definition);
		//$json->sql->{"$row->schemaname.$row->name"}=str_replace("\r","\r\n",$row->definition);
	}
	next_result($res);
	while($row=fetch_object($res)) {//SQL
		$schema->{$row->schemaname}=null;
		$row->definition=str_replace(array("(","\r\n"),array(" ("," \r\n"),$row->definition);

		$a=explode("CREATE ",$row->definition);
		array_shift($a);
		$row->definition=implode("CREATE ",$a);

		$a=explode(" ",$row->definition);
		$row->definition=array_shift($a);
		array_shift($a);
		$row->definition.=" [$row->schemaname].[$row->name] ".implode(" ",$a);

		$row->definition=str_replace(" (","(",$row->definition);
		$row->definition=str_replace(" (","(",$row->definition);
		$row->definition=str_replace(" (","(",$row->definition);
		$row->definition=str_replace(" (","(",$row->definition);

		//$row->definition=str_replace(" (","(",$row->definition);
		//$row->definition=str_replace(" (","(",$row->definition);
		//$row->definition=str_replace(" (","(",$row->definition);
		//$row->definition=str_replace(" (","(",$row->definition);

		$types=array('FN'=>'FUNCTION','TF'=>'FUNCTION','IF'=>'FUNCTION','P'=>'PROCEDURE','TR'=>'TRIGGER','V'=>'VIEW');
		$type=$types[$row->type];

		//$sqla.="$l-- $row->type_desc $row->schemaname.$row->name $l";
		$sqla.="\r\nALTER $row->definition\r\nGO\r\n";
		//$sql.="$l-- $row->type_desc $row->schemaname.$row->name $l".($s="\r\nIF OBJECT_ID('$row->schemaname.$row->name') IS NOT NULL DROP $type $row->schemaname.$row->name;\r\nGO\r\nCREATE $row->definition\r\nGO\r\n");

		$sql.=($s="\r\nIF OBJECT_ID('$row->schemaname.$row->name') IS NOT NULL DROP $type $row->schemaname.$row->name;\r\nGO\r\nCREATE $row->definition\r\nGO\r\n");

		//$sql.="$l-- $row->type_desc $row->schemaname.$row->name $l".($s="IF OBJECT_ID('$row->schemaname.$row->name') IS NOT NULL DROP $type $row->schemaname.$row->name;\r\nGO\r\nCREATE $row->definition\r\nGO");
		$json->$type->{"$row->schemaname.$row->name"}->code=$s;
	}
	foreach($schema as $schemaname=>$val)$sqlschema.="\r\nIF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = N'$schemaname') EXEC sys.sp_executesql N'CREATE SCHEMA [$schemaname]'\r\nGO";
	file_put_contents(__DIR__."/sql/aim.alter.sql","USE AIM\r\nGO".$sqla);
	file_put_contents(__DIR__."/sql/aim.create.sql",$sql="SET NOCOUNT ON;IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = N'$dbname') CREATE DATABASE [$dbname]\r\nGO\r\nUSE $dbname\r\nGO".$sqlschema.$sql);

	$res=query("DECLARE @T TABLE (object_id INT, schema_id INT, name VARCHAR(500))
		INSERT @T
		SELECT object_id,schema_id,name FROM sys.tables WHERE name not like '[_]%'

		SELECT T.object_id,S.name [schema],TB.name--,*
		FROM @T T
		INNER JOIN sys.tables TB ON TB.object_id=T.object_id
		INNER JOIN sys.schemas S ON S.schema_id=TB.schema_id
		ORDER BY s.name

		SELECT T.object_id,C.name,TP.name [type] FROM sys.columns C INNER JOIN @T T ON T.object_id=C.object_id INNER JOIN sys.types TP ON TP.system_type_id=C.system_type_id
	");
	while ($row=fetch_object($res)) {
		$json->TABLES->{"$row->schema.$row->name"}=$tables->{$row->object_id}=$row;
		unset($row->object_id);
	}
	next_result($res);
	while ($row=fetch_object($res)) {
		$tables->{$row->object_id}->columns->{$row->name}=$row;
		unset($row->object_id,$row->name);
	}
	foreach ($tables as $id => $table) {
		$table->columns=(array)$table->columns;
		ksort($table->columns);
	}
	//die (json_encode($data->tables));

	file_put_contents(__DIR__."/sql/sql.json",json_encode($json));


	die("<plaintext>".$sql);
}


if ($_GET[rootID]){
	/*
		Bouwt complete structuur op aan data gestart op een rootID
	*/
  die('a');

	$json->hostID=$aim->hostID;
	$json->rootID=$_GET[rootID];
	//$json->dataset=array();
	$filename.="_root".$_GET[rootID];
	$res=query("SET NOCOUNT OFF;EXEC api.getBuild @rootID=".$_GET[rootID]);
	while($row=fetch_object($res))$json->class->{$row->id}=$row->name;
	next_result($res);
	while($row=fetch_object($res))$json->attributeName->{$row->id}=$row->name;
	next_result($res);
	while($row=fetch_object($res)){$json->items->{$row->id}=cleanrow($row);unset($row->id);unset($row->obj);}
	next_result($res);
	while($row=fetch_object($res))$json->items->{$row->id}->values->{$row->name}=$row;
	//die (json_encode($json));
}
if ($_GET[hostID]){
	/*
		Maakt JSON met alle data van een domein hostID
	*/
	$json->hostID=$_GET[hostID];
	$filename.="_host".$_GET[hostID];
	//$json->dataset=array();
	$res=query("SET NOCOUNT OFF;EXEC api.getBuild @hostID=".$_GET[hostID]);
	while($row=fetch_object($res))$json->class->{$row->id}=$row->name;
	next_result($res);
	while($row=fetch_object($res))$json->attributeName->{$row->id}=$row->name;
	next_result($res);
	while($row=fetch_object($res))$json->items->{$row->id}=cleanrow($row);
	next_result($res);
	while($row=fetch_object($res))$json->items->{$row->id}->values->{$row->name}=cleanrow($row);
	//die (json_encode($json));
}
//file_put_contents(__DIR__."/sql/construct.json",json_encode($json));
header('Content-type: application/json');
if(isset($_GET[download])) {
  header("Content-disposition: attachment; filename=aliconnect_export_".date("Ymd_hi")."$filename.json");
}
die (json_encode($json,JSON_PRETTY_PRINT));
?>

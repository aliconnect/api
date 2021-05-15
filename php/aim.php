<?php
// die('api1'.__DIR__);
header('Access-Control-Allow-Methods: GET, HEAD, POST, PUT, DELETE, OPTIONS, PATCH');
header('Access-Control-Allow-Headers: Authorization, Origin, X-Requested-With, Content-Type, Accept, Accept-Charset, Accept-Language, If-Match, If-None-Match, Isolation, Prefer, OData-Version, OData-MaxVersion, X-API-Key, Apikey, Api-Key, Api_Key');
header('Access-Control-Expose-Headers: OData-Version');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Origin: ' . ( array_key_exists('HTTP_REFERER',$_SERVER) ? implode('/',array_slice(explode('/',$_SERVER['HTTP_REFERER']),0,3)) : '*') );
header("Cache-Control: no-store");
// if ($_SERVER['REQUEST_METHOD']==='POST') die('JA');
ini_set('default_charset', 'UTF-8');
ini_set('memory_limit', -1);
ini_set('post_max_size', '20M');
ini_set('upload_max_filesize', '20M');
ini_set('session.cookie_samesite', 'Lax');
ini_set('mssql.textlimit', 2147483647);
ini_set('mssql.textsize', 2147483647);
sqlsrv_configure('ClientBufferMaxKBSize', 180240);

define('LOG_MAILTO', 'max@alicon.nl' );
define('MESSAGE_TYPE_ERROR', 0 );
define('MESSAGE_TYPE_MAIL', 1 );
define('MESSAGE_TYPE_WARN', 5 );
define('MESSAGE_TYPE_DEBUG', 6 );
define('startTime', microtime(true) * 1000);
define('__startTime', microtime(true) * 1000);
define('__AIM__', __DIR__);
define('AIM_OAUTH2_URL', 'https://login.aliconnect.nl/api/oauth2');
define('AIM_CONFIG_YAML_NAME_ID', 2096);
define('AIM_API_NAME_ID', 2097);
define('AIM_DIR_LIB', $_SERVER['DOCUMENT_ROOT'].'/lib' );
define('root_dir', dirname($_SERVER['SCRIPT_NAME']) );
define('ACCESS_TOKEN_EXPIRES_IN', 3600);
define('COOKIE_LIFETIME', 365 * 24 * 60 * 60);
define('API_ROOT_URL', 'http'.($_SERVER['SERVER_PORT_SECURE'] ? 's' : '').'://'.$_SERVER['SERVER_NAME'].'/api/' );

define('IdIntersectKeys', ['schema'=>1, 'ID'=>1, 'UID'=>1]);

class url {
  public function __construct ($url) {
    foreach (parse_url($url) as $k => $v) $this->$k = $v;
    foreach (pathinfo($url) as $k => $v) $this->$k = $v;
    // $this->realpath = realpath($this->path);
  }
}

function schemaName($row) {
  $schema = isset($row['schemaPath']) ? $row['schemaPath'] : $row['schema'];
  return current(
    array_filter(
      explode(':',$schema),
      function($val){
        return isset(aim()->api->components->schemas->$val);
      }
    )
  ) ?: 'Item';
}
function itemrow($row){
  // debug ($row);
  $row = (array)$row;
  foreach (['files','Categories', 'filterfields'] as $key) {
    if (isset($row[$key])) $row[$key] = json_decode($row[$key]);
  }
  foreach (['CreatedBy','ModifiedBy','Owner','User','Host','Source','Master'] as $key) {
    if (isset($row[$key])) $row[$key] = ['@id' => API_ROOT_URL.$row[$key]];
  }
  foreach (['LastModifiedDateTime','CreatedDateTime','StartDateTime','EndDateTime','FinishDateTime','IndexedDateTime'] as $key) {
    if (isset($row[$key]) && ($date = date_create($row[$key]))) {
      $row[$key] = $date->format('Y-m-d\TH:i:s.u\Z');
    }
  }
  foreach (['HasChildren','HasAttachements','IsClass','IsSelected','IsRead','IsPublic'] as $key) {
    if (isset($row[$key])) {
      $row[$key] = $row[$key] ? true : false;
    }
  }
  $schemaName = schemaName($row);
  // if (isset($row['header0'])) $row['header0'] = strip_tags($row['header0']);
  // if (isset($row['header1'])) $row['header1'] = strip_tags($row['header1']);
  // if (isset($row['header2'])) $row['header2'] = strip_tags($row['header2']);
  return array_replace(
    [
      '@id' => API_ROOT_URL."$schemaName($row[_ID])",
      'Id' => base64_encode(API_ROOT_URL."$schemaName($row[_ID])"),
      'schema' => $schemaName ?: 'Item',
      // 'schema2' => $schemaName,
      'UID' => empty($row['UID']) ? '' : $row['UID'],
      'ID' => isset($row['ID']) ? $row['ID'] : (isset($row['_ID']) ? $row['_ID'] : $row['id'])
      // 'Id' => base64_encode(json_encode(array_intersect_key($row,$IdIntersectKeys)))
    ],
    array_diff_key($row, IdIntersectKeys, ['_ID' => 0])
  );
}

function id($id){
  return (int)strtok($id,'-');
}
function uid($id){
  return substr($id,strpos($id,'-')+1);
}
function start_session() {
  session_start();
  setcookie(session_name(),session_id(),time() + COOKIE_LIFETIME);
}
function mobile_browser() {
  return preg_match("/(android|avantgo|blackberry|bolt|boost|cricket|docomo|fone|hiptop|mini|mobi|palm|phone|pie|tablet|up\.browser|up\.link|webos|wos)/i", $_SERVER["HTTP_USER_AGENT"]);
}
function array_end($arr) {
	return end($arr);
}
function ordered_list($order,&$rows) {
  foreach (array_reverse(explode(',',$order)) as $orderkey) {
    $orderdir = explode(' ',$orderkey);
    $orderkey = array_shift($orderdir);
    $orderdir = array_shift($orderdir);
    $orderby = [];
    foreach ($rows as $key => $row) {
      $orderby[$key] = is_object($row->$orderkey)
      ? $row->$orderkey->Value
      : $row->$orderkey;
    }
    // $orderarr = array_column($rows, $key);
    array_multisort($orderby, $orderdir == 'DESC' ? SORT_DESC : SORT_ASC, SORT_NATURAL|SORT_FLAG_CASE, $rows);
  }
}
function translate($post) {
  $options = [
    CURLOPT_URL => 'https://translation.googleapis.com/language/translate/v2?key=AIzaSyAKNir6jia2uSgmEoLFvrbcMztx-ao_Oys',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode($post),//http_build_query($post),
    CURLOPT_SSL_VERIFYPEER => false,
    CURLOPT_HTTPHEADER => ["Content-Type: application/json"],
  ];
  // $ch = curl_init('https://translation.googleapis.com/language/translate/v2?key=AIzaSyAKNir6jia2uSgmEoLFvrbcMztx-ao_Oys');
  $curl = curl_init();
  curl_setopt_array($curl, $options);
  $result = curl_exec($curl);
  curl_close($curl);
  // die($result);
  // debug($post,$param,$result);
  // die($result);
  $result = json_decode($result);
  $translate = [];
  if (isset($result->data->translations)) {
    foreach ($result->data->translations as $i => $translation) {
      $translate[] = isset($translation->translatedText) ? $translation->translatedText : $post['q'][$i];
    }
  }
  return $translate;
}
function GetRealUserIp($default = NULL, $filter_options = 12582912) {
  $HTTP_X_FORWARDED_FOR = isset($_SERVER) && isset($_SERVER['HTTP_X_FORWARDED_FOR']) ? $_SERVER['HTTP_X_FORWARDED_FOR'] : getenv('HTTP_X_FORWARDED_FOR');
  $HTTP_CLIENT_IP = isset($_SERVER) && isset($_SERVER['HTTP_CLIENT_IP']) ? $_SERVER['HTTP_CLIENT_IP'] : getenv('HTTP_CLIENT_IP');
  $HTTP_CF_CONNECTING_IP = isset($_SERVER) && isset($_SERVER['HTTP_CF_CONNECTING_IP']) ? $_SERVER['HTTP_CF_CONNECTING_IP'] : getenv('HTTP_CF_CONNECTING_IP');
  $REMOTE_ADDR = isset($_SERVER)?$_SERVER['REMOTE_ADDR']:getenv('REMOTE_ADDR');

  $all_ips = explode(",", "$HTTP_X_FORWARDED_FOR,$HTTP_CLIENT_IP,$HTTP_CF_CONNECTING_IP,$REMOTE_ADDR");
  foreach ($all_ips as $ip) {
    if ($ip = filter_var($ip, FILTER_VALIDATE_IP, $filter_options))
    break;
  }
  return $_SERVER['HTTP_CLIENT_IP'] = $ip?$ip:$default;
}
function is_assoc(array $arr) {
    if (array() === $arr) return false;
    return array_keys($arr) !== range(0, count($arr) - 1);
}
function videorecorder_add () {
  // debug(file_get_contents('php://input'));
  aim()->query(
    "INSERT INTO aimhis.dbo.camfile (camId,startDateTime,duration,filename) VALUES (%s,%s,%s,%s)",
    $_GET['cam_id'],
    $_GET['start'],
    $_GET['duration'],
    $_GET['name']
  );
  $content = base64_decode(explode('base64,',file_get_contents('php://input'))[1]);
  file_put_contents($_SERVER['DOCUMENT_ROOT'].'/shared/videorecorder/'.$_GET['name'], $content);
  die();
  debug(1);
}
function check_postcondition ($arr) {
	foreach ($arr as $key) {
		if (empty($_POST[$key])) throw new Exception('Precondition Failed', 412);
	}
}
function pathname($url) {
	$url = parse_url($url);
	return substr($url['path'],0,strrpos($url['path'],'/'));
}
function sql_build_exec($procname,$param) {
	return 'EXEC '.$procname.' '.implode(',',array_map(function($key, $value) { return "@$key='$value'"; }, array_keys($param), array_values($param)));
}
function json_base64_encode ($obj){
	return str_replace(['+', '/','='], ['-','_',''], base64_encode($obj));
}
function jwt_encode ($payload, $secret = null, $alg = 'sha256') {
	$payload=is_string($payload)?json_decode($payload):(object)$payload;
	$jwt=implode('.',[
		$base64UrlHeader = json_base64_encode(json_encode(['typ'=>'JWT', 'alg'=>$alg])),
		$base64UrlPayload = json_base64_encode(json_encode($payload)),
		$base64UrlSignature = json_base64_encode(hash_hmac($alg, $base64UrlHeader . '.' . $base64UrlPayload, strtolower($secret), true))
	]);
	return $jwt;
}
function jwt_decode ($jwt, $secret = null, $alg = 'sha256') {
	$arr = explode('.', $jwt);
	$base64UrlHeader = $arr[0];
	$base64UrlPayload = $arr[1];
	$signature = $arr[2];
	$result = [
		// 'header'=> json_decode(base64_decode($base64UrlHeader = array_shift($arr))),
		'payload'=> $payload = json_decode(base64_decode($base64UrlPayload)),
		'valid'=> $arr[2] === json_base64_encode(hash_hmac($alg, $base64UrlHeader . '.' . $base64UrlPayload, strtolower($secret), true)),
		'expired'=> $payload->exp < time(),
		// 'signature'=> array_shift($arr)
	];
	return (object)$result;
}
function get_token ($jwt, $secret = null) {
	$arr = explode('.', $jwt);
	$base64UrlHeader = $arr[0];
	$urlHeader = json_decode(base64_decode($base64UrlHeader), true);
	$alg = $urlHeader['alg'];
	if (empty($arr[1])) return;
	// error_log('ARR_1 '.$arr[1]);
	$base64UrlPayload = $arr[1];
	$signature = $arr[2];
	$token_signature = json_base64_encode(hash_hmac($alg, $base64UrlHeader . '.' . $base64UrlPayload, strtolower($secret), true));
	// $token_signature = json_base64_encode(hash_hmac($alg, $base64UrlHeader . '.' . $base64UrlPayload, strtolower($secret), true));
	$payload = json_decode(base64_decode($base64UrlPayload), true);
	// error_log(json_encode([
	// 	$_SERVER['HTTP_HOST'].$secret,
	// 	$signature,
	// 	$token_signature,
	// 	$payload['sct'],
	// 	$payload['exp'] < time() ? "timeout" : "",
	// ]));
	if ($secret && $signature !== $token_signature) {
		// debug($secret, $signature, $token_signature, $payload, $_SERVER['HTTP_HOST']);
		// die(http_response_code(401)); // Unauthorized
		// return;
		// debug('SECRET', $payload);
		// throw new Exception('Unauthorized', 401);
	}
	if (isset($payload['exp']) && $payload['exp'] < time()) {
		// die(http_response_code(401)); // Unauthorized
		// return;
		// debug('EXP', $payload);
		// debug($payload['exp'], time());
		// die(http_response_code(401)); // Unauthorized
		// die(http_response_code(408)); // Request Timeout
		// throw new Exception('Unauthorized', 401);
		// throw new Exception('Request Timeout', 408);
	}
	return $payload;
}
function __() {
	$args = func_get_args();
	$message = array_shift($args);
	$message = isset(AIM_TRANSLATE[$message]) ? AIM_TRANSLATE[$message] : $message;
	if (!empty($args)) {
		$message = sprintf($message, ...$args);
	}
	return $message;
}
function unparse_url($parsed_url) {
	extract($parsed_url);
	if (!empty($hostname)) $host = $hostname;
	if (!empty($protocol)) $scheme = $protocol;
	return
	( empty($scheme) ? '' : trim($scheme,':') . '://' ) .
	( empty($host) ? '' : $host ) .
  ( empty($port) ? '' : ':' . $port ) .
  ( empty($user) ? '' : $user . ( empty($pass) ? '' : ':' . $pass ) . '@' ) .
	( empty($basePath) ? '' : $basePath ) .
	( empty($path) ? '' : $path ) .
  ( empty($query) ? '' : '?' . (is_array($query) ? http_build_query($query) : $query) ) .
  ( empty($fragment) ? '' : '#' . $fragment );
}
function array_change_key_case_recursive($arr, $case=CASE_LOWER) {
	return array_map(function($item)use($case){
		if(is_array($item)) {
			$item = array_change_key_case_recursive($item, $case);
		}
		return $item;
	},array_change_key_case($arr, $case));
}
function hasScope($security, $access_scope) {
	$access_scope_array = explode(' ', trim($access_scope));
	// debug($security,$access_scope_array);
	foreach ($access_scope_array as $access_scope_name) {
		foreach ($security as $security_row) {
			foreach($security_row as $auth_name => $auth_array) {
				foreach ($auth_array as $auth_scope_name) {
					if (strpos($access_scope_name, $auth_scope_name) !== false) {
						return true;
					}
				}
			}
		}
	}
}
function aim_log ($message, $message_type, $data = null) {
	error_log("Exception $message_type, $message");
	if ($message_type === MESSAGE_TYPE_MAIL) {
		aim()->mail([
			'send'=> 1,
			'to'=> LOG_MAILTO,
			'chapters'=> [
				[
					'title' => 'Aliconnect log ' . $message,
					'content'=> json_encode($data, JSON_PRETTY_PRINT),
				],
			],
		]);
	} else if ($message_type >= 100) {
		throw new Exception($message, $message_type);
	}
}
function debug() {
	$t = round(microtime(true)*1000-__startTime);
	$arg_list = func_get_args();
	$bt = debug_backtrace();
	// die(isset($bt[1]));
  if (isset($bt[1])) {
    $bt0 = (object)$bt[0];
    $bt1 = (object)$bt[1];
    $url = new url($bt0->file);
    $class = isset($bt1->class) ? $bt1->class : '';
    $function = isset($bt1->function) ? $bt1->function : '';
    array_unshift ($arg_list, "$url->basename:$bt0->line $function $t ms");
  }
	header('Content-Type: application/json');
	die(json_encode($arg_list,JSON_PRETTY_PRINT,JSON_UNESCAPED_SLASHES));
}
function extract_hostname($httphost) {
	$httphost = str_replace('www.','',$httphost);
	$httphost = str_replace('localhost','aliconnect.nl',$httphost);
	$host_array = array_reverse(explode('.', $httphost));
	if (isset($host_array[2]) && $host_array[0] === 'nl' && $host_array[1] === 'aliconnect') {
		return $host_array[2];
	}
}
function phone_number($phone_number) {
  return is_numeric($phone_number) && $phone_number < 999999999 ? $phone_number = 31000000000 + $phone_number : $phone_number;
}
// function par($selector = null, $context = null) {
//   if (empty($GLOBALS['params'])) {
//     $GLOBALS['params'] = [];
//   }
//   // debug($GLOBALS['params'], $selector, $context);
//   $selector = is_object($selector) ? (array)$selector : $selector;
//   if (is_array($selector)) {
//     foreach ($selector as $key => $value) {
//       if (!is_object($value) && !is_array($value)) {
//         $GLOBALS['params'][$key] = $value;
//       }
//     }
//   } else if ($selector) {
//     if (is_null($context)) {
//       if (isset($GLOBALS['params'][$selector])) {
//         return $GLOBALS['params'][$selector];
//       }
//       if (isset($_GET[$selector])) {
//         return $_GET[$selector];
//       }
//       if (isset($_POST[$selector])) {
//         return $_POST[$selector];
//       }
//       if (isset($_COOKIE[$selector])) {
//         return $_COOKIE[$selector];
//       }
//       if (isset($GLOBALS[$selector])) {
//         return $GLOBALS[$selector];
//       }
//       return null;
//     }
//     return $GLOBALS['params'][$selector] = $context;
//   }
//   return $GLOBALS['params'];
// }

function get($selector, $context = []) {
  foreach ([(array)$context, $_COOKIE, $_GET, $_POST, $_SERVER, $GLOBALS] as $context) {
    if (array_key_exists($selector, $context)) {
      return $context[$selector];
    }
  }
}

function request_type_translate() {
  $fname = __DIR__."/lang/$_GET[lang].yaml";
  header('Content-type: application/json');
  die(json_encode(yaml_parse_file($fname), JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
}

$AccessControlAllowOrigin = '*';
$hostname = isset($_SERVER['HTTP_HOST']) ? extract_hostname($_SERVER['HTTP_HOST']) : null;
if (isset($_GET['script'])) {
	$hostname = $hostname ?: extract_hostname(parse_url($_GET['script'])['host']);
}
if (isset($_GET['origin'])) {
	$origin = $_GET['origin'];
} else if (isset($_SERVER['HTTP_REFERER'])) {
	$origin = $_SERVER['HTTP_REFERER'];
}
if (isset($origin)) {
	$origin = parse_url($origin);
	$hostname = $hostname ?: extract_hostname($origin['host']);
	if ($origin['scheme'] !== 'file' && !strstr($origin['host'],'localhost')) {
		$AccessControlAllowOrigin = $origin['scheme'] . '://' . $origin['host'];
	}
}
$hostname = $hostname ?: 'aliconnect';
header('Access-Control-Allow-Origin: '.$AccessControlAllowOrigin);
define('AIM_DOMAIN', $hostname );
// DEBUG: MKAN ONBEKEND WAAROM DEZE CODE
if (isset($_GET['path'])) {
	$url = parse_url($_GET['path']);
	$items=[];
	function readDirs($path){
		global $items;
		$dirHandle = opendir($_SERVER['DOCUMENT_ROOT'].$path);
		$dirs=[];
		while($item = readdir($dirHandle)) {
			if ($item === '.' || $item === '..') continue;
			if ($item[0] === '_' || strstr($item, 'Copy') || preg_match('/[0-9]\./', $item)) continue;
			$ext = pathinfo($item, PATHINFO_EXTENSION);
			$title = str_replace('.'.$ext,'',pathinfo($item, PATHINFO_BASENAME));
			if (is_dir($_SERVER['DOCUMENT_ROOT']."/$path/$item")) {
				$dirs[] = "/$path/$item";
			} else if (in_array($ext, ['md','html','js','css','php'])) {
				$items[] = [
					'title'=> $title,
					'name'=> $item,
					'ext'=> $ext,
					'src'=> $path."/".$item,
					'content'=> htmlentities(file_get_contents($_SERVER['DOCUMENT_ROOT'].$path."/".$item)),
				];
			}
		}
		foreach ($dirs as $item) {
			readDirs($item);
		}
	}
	if (is_file($_SERVER['DOCUMENT_ROOT'].$url['path'])) $url['path'] = dirname($url['path']);
	readDirs($url['path']);
	header('Content-Type: application/json');
  die(json_encode($items, JSON_PRETTY_PRINT));
}

$arr = explode('?',$_SERVER['REQUEST_URI']);
define('request_url', $url = str_replace(['/api','/v1'],'', '/' . (	trim(str_replace(root_dir,'',$d = array_shift($arr)),'/')?:trim (root_dir,'/') )));


class server {
  public function print($html, $printer_id) {
    aim()->query("INSERT INTO printer.dt (data, printer_id) VALUES ('%s','%s');", $html, $printer_id);
  }
}
class mse {
	private static $authority = 'https://login.microsoftonline.com';
  // private static $authorizeUrl = '/common/oauth2/v2.0/authorize?response_type=code&client_id=%1$s&redirect_uri=%2$s&prompt=login&scope=%3$s&state=%3$s';
  // private static $authorizeUrl = '/common/oauth2/v2.0/authorize?response_type=code&prompt=consent&client_id=%1$s&redirect_uri=%2$s&scope=%3$s';
  private static $authorizeUrl = '/common/oauth2/v2.0/authorize?response_type=code&client_id=%1$s&redirect_uri=%2$s&scope=%3$s';
	private static $tokenUrl = '/common/oauth2/v2.0/token';
	private static $redirect_uri = 'https://login.aliconnect.nl/api/mse';
	private $account_data;

	public static $outlookApiUrl = 'https://outlook.office.com/api/v2.0';
	private static $scopes = [
    'openid',
    'offline_access',
    'profile',
    'email',
    // 'mail.readwrite',
    // 'calendars.readwrite',
    // 'contacts.readwrite',
    // 'people.read',
    'https://outlook.office.com/mail.readwrite',
    'https://outlook.office.com/calendars.readwrite',
    'https://outlook.office.com/contacts.readwrite',
    'https://outlook.office.com/people.read',
  ];

	public function __construct () {
    // debug(1);
    // debug(aim()->secret);
		$this->client_id = aim()->secret['config']['mse']['client_id'];
		$this->client_secret = aim()->secret['config']['mse']['client_secret'];

		aim()->access->sub = 265090;
		//debug(aim()->access);
		// if (!isset(aim()->access['sub'])) throw new Exception('Unauthorized', 401);
    // debug(1);
		$this->userID = aim()->access['sub'];
    if (!empty($_GET['code'])) {
      // debug(base64_decode($_GET['state']));
      $this->getTokenFromAuthCode($_GET['code']);
      header('Location: /');
    } else {
      $this->login();
    }
	}
	public function getLoginUrl() {
		$scopestr = implode(' ', self::$scopes);
		$loginUrl = self::$authority.sprintf(self::$authorizeUrl, $this->client_id, urlencode(self::$redirect_uri), urlencode($scopestr), base64_decode($_SERVER['REQUEST_URI']));
		error_log('Generated login URL: '.$loginUrl);
		return $loginUrl;
	}
	public function setUserData($json_vals) {
		// global $accessToken,$refreshToken,$accountEmail,$accountId;
		$profile = self::getProfile($json_vals['id_token']);
    $access = self::getProfile($json_vals['access_token']);

		// $account_data = isset($this->user_data) ? $this->user_data : (object)[];
		// $account_data->access_token = $json_vals['access_token'];
		// $account_data->refresh_token = $json_vals['refresh_token'];
    // debug($json_vals, $profile, $access);
		// $account_data->preferred_username = $profile['preferred_username'];
		// $account_data->name = $profile['name'];
    $accountname = $profile['email'];
    $ip = GetRealUserIp();
    // debug(3, $ip, $accountname, $json_vals);
    $account = sqlsrv_fetch_object(aim()->query($query = "EXEC [account].[get] @accountname='$accountname', @IP = '$ip'"));
    // debug($accountname, $profile, $access, $account);
    // Als account niet bestaat aanmaken en email sturen
    if (empty($account->accountId)) {
      // $this->log("account_created");
      $account = sqlsrv_fetch_object(aim()->query("INSERT INTO item.dt (hostID,classID,title) VALUES (1,1004,'$accountname');
      DECLARE @id INT;
      SET @id=scope_identity();
      EXEC item.attr @ItemID=@id, @NameID=30, @value='$accountname'
      ".$query));
    }
    foreach (['email','name','preferred_username'] as $attributeName) {
      if (empty($profile[$attributeName])) continue;
      $value = str_replace("'","''",$profile[$attributeName]);
      $q .= "EXEC item.attr @ItemID=$account->accountId, @AttributeName='$attributeName', @value='$value', @hostID=1;";
    }
    foreach (['family_name','given_name','name','unique_name'] as $attributeName) {
      if (empty($access[$attributeName])) continue;
      $value = str_replace("'","''",$access[$attributeName]);
      $q .= "EXEC item.attr @ItemID=$account->accountId, @AttributeName='$attributeName', @value='$value', @hostID=1;";
    }
    $q .= "EXEC item.attr @itemID=$account->accountId, @Name='mse_access_token', @Value='$json_vals[access_token]';";
    $q .= "EXEC item.attr @itemID=$account->accountId, @Name='mse_refresh_token', @Value='$json_vals[refresh_token]';";
    aim()->query($q);
    // die($q);
    OAuth2::login($account);
	}
	public function getUserData() {
    if (empty($this->userID)) return;
    $res = aim()->query("SELECT Value
      FROM attribute.dv
      WHERE ItemID=$this->userID AND AttributeName='mse_refresh_token'"
    );
    $row = sqlsrv_fetch_object($res);
    // debug($row);
    $this->refresh_token = sqlsrv_fetch_object($res)->Value;
		$this->user_data->client_id = $this->client_id;
		$this->user_data->login_url = $this->getLoginUrl();
		// return $this->user_data;
		return $this->getRefreshToken();
	}
	public function getTokenFromAuthCode($authCode) {
		// Build the form data to post to the OAuth2 token endpoint
		$token_request_data = array(
			'grant_type' => 'authorization_code',
			'code' => $authCode,
			'redirect_uri' => self::$redirect_uri,
			'scope' => implode(' ', self::$scopes),
			'client_id' => aim()->secret['config']['mse']['client_id'],
			'client_secret' => aim()->secret['config']['mse']['client_secret'],
		);
		$token_request_body = http_build_query($token_request_data);
		error_log('Request body: '.$token_request_body);
		$curl = curl_init(self::$authority.self::$tokenUrl);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($curl, CURLOPT_POST, true);
		curl_setopt($curl, CURLOPT_POSTFIELDS, $token_request_body);
		curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
		$response = curl_exec($curl);
    // echo $response;
    // debug($response);
		error_log('curl_exec done.');
		$httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
		error_log('Request returned status '.$httpCode);
		if ($httpCode >= 400) {
      return array('errorNumber' => $httpCode, 'error' => 'Token request returned HTTP error '.$httpCode);
    }
		// Check error
		$curl_errno = curl_errno($curl);
		$curl_err = curl_error($curl);
		if ($curl_errno) {
			$msg = $curl_errno.': '.$curl_err;
			error_log('CURL returned an error: '.$msg);
			return array('errorNumber' => $curl_errno,'error' => $msg);
		}
		curl_close($curl);
		$json_vals = json_decode($response, true);
		error_log("TOKEN RESPONSE:");
		foreach ($json_vals as $key=>$value) {
			error_log("  $key: $value");
		}
		if ($json_vals['access_token']) {
			self::setUserData($json_vals);
      debug(2, $json_vals);
			// Redirect back to home page
      $url = base64_decode($_GET['state']);
      // debug($state);
			header('Location: '.$url);
      die();
		}
    debug(1, $json_vals);
		return $json_vals;
	}
	/* get token form refresh_token */
	public function getRefreshToken() {
		global $accessToken,$refreshToken,$accountEmail,$accountId;
		$accessToken = null;
		$token_request_data = array(
			'grant_type' => 'refresh_token',
			'refresh_token'=> $this->user_data->refresh_token,
			'redirect_uri' => self::$redirect_uri,
			'client_id' => $this->client_id,
			'client_secret' => $this->client_secret,
		);
		// Calling http_build_query is important to get the data formatted as expected.
		$token_request_body = http_build_query($token_request_data);
		error_log('Request body: '.$token_request_body);
		$curl = curl_init(self::$authority.self::$tokenUrl);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($curl, CURLOPT_POST, true);
		curl_setopt($curl, CURLOPT_POSTFIELDS, $token_request_body);
		curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
		$response = curl_exec($curl);
		error_log('curl_exec done.');
		$httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
		error_log('Request returned status '.$httpCode);
		if ($httpCode >= 400) {return array('errorNumber' => $httpCode, 'error' => 'Token request returned HTTP error '.$httpCode);}
		// Check error
		$curl_errno = curl_errno($curl);
		$curl_err = curl_error($curl);
		if ($curl_errno) {
			$msg = $curl_errno.': '.$curl_err;
			error_log('CURL returned an error: '.$msg);
			return array('errorNumber' => $curl_errno,'error' => $msg);
		}
		curl_close($curl);
		// The response is a JSON payload, so decode it into an array.
		$json_vals = json_decode($response, true);
		error_log('TOKEN RESPONSE:');
		foreach ($json_vals as $key=>$value) error_log('  '.$key.': '.$value);
		if ($json_vals['access_token']) self::setUserData($json_vals);
		return $this->user_data;
	}
	public static function getProfile($idToken) {
		$token_parts = explode('.', $idToken);
		$token = strtr($token_parts[1], '-_', '+/');
		$jwt = base64_decode($token);
		$json_token = json_decode($jwt, true);
		return $json_token;
	}
	// This function generates a random GUID.
	public static function makeGuid() {
		if (function_exists('com_create_guid')) {
			error_log("Using 'com_create_guid'.");
			return strtolower(trim(com_create_guid(), '{}'));
		}
		else {
			error_log('Using custom GUID code.');
			$charid = strtolower(md5(uniqid(rand(), true)));
			$hyphen = chr(45);
			$uuid = substr($charid, 0, 8).$hyphen.substr($charid, 8, 4).$hyphen.substr($charid, 12, 4).$hyphen.substr($charid, 16, 4).$hyphen.substr($charid, 20, 12);
			return $uuid;
		}
	}
  public function getUserToken() {
    if (empty($this->userID)) return;
    $res = aim()->query("SELECT AttributeName,Value
      FROM attribute.dv
      WHERE ItemID=$this->userID AND AttributeName IN ('mse_access_token','preferred_username','mse_refresh_token')"
    );
    while ($row = sqlsrv_fetch_object($res)) {
      $this->{str_replace('mse_','',$row->AttributeName)} = $row->Value;
    }
		// $this->access_token = $row->mse_access_token;
		// $this->refresh_token = $row->mse_refresh_token;
		// $this->preferred_username = $row->mse_email;
	}
	public function makeApiCall($method, $url, $payload = NULL) {
		//global $accessToken,$refreshToken,$accountEmail,$accountId;
		// Generate the list of headers to always send.
		//echo $accessToken;
		$headers = array(
			"User-Agent: php-tutorial/1.0",						// Sending a User-Agent header is a best practice.
			"Authorization: Bearer ".$this->access_token, // Always need our auth token!
			"Accept: application/json",							// Always accept JSON response.
			"client-request-id: ".self::makeGuid(),             // Stamp each new request with a new GUID.
			"return-client-request-id: true",                   // Tell the server to include our request-id GUID in the response.
			"X-AnchorMailbox: ".$this->preferred_username		// Provider user's email to optimize routing of API call
		);
    // debug($url, $headers);
		$curl = curl_init($url);
		switch(strtoupper($method)) {
			case "GET":
			// Nothing to do, GET is the default and needs no
			// extra headers.
			error_log("Doing GET");
			break;
			case "POST":
			error_log("Doing POST");
			// Add a Content-Type header (IMPORTANT!)
			$headers[] = "Content-Type: application/json";
			curl_setopt($curl, CURLOPT_POST, true);
			curl_setopt($curl, CURLOPT_POSTFIELDS, $payload);
			break;
			case "PATCH":
			error_log("Doing PATCH");
			// Add a Content-Type header (IMPORTANT!)
			$headers[] = "Content-Type: application/json";
			curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "PATCH");
			curl_setopt($curl, CURLOPT_POSTFIELDS, $payload);
			break;
			case "DELETE":
			error_log("Doing DELETE");
			curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "DELETE");
			break;
			default:
			error_log("INVALID METHOD: ".$method);
			exit;
		}
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
		curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
		//curl_setopt($curl, CURLOPT_CAINFO, $_SERVER['DOCUMENT_ROOT'] . "/../cert/aliconnectnl.pem");
		$response = curl_exec($curl);
    // debug($response);
		error_log("curl_exec done.");
		$httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
		error_log("Request returned status ".$httpCode);
		if ($httpCode === 401) {
			self::getRefreshToken();
			if ($accessToken) self::makeApiCall($method, $url, $payload);
			return ;
		}
		else if ($httpCode >= 400) { return array('errorNumber' => $httpCode, 'error' => 'Request returned HTTP error '.$httpCode); }
		$curl_errno = curl_errno($curl);
		$curl_err = curl_error($curl);
		if ($curl_errno) {
			$msg = $curl_errno.": ".$curl_err;
			error_log("CURL returned an error: ".$msg);
			curl_close($curl);
			return array('errorNumber' => $curl_errno, 'error' => $msg);
		}
		else {
			error_log("Response: ".$response);
			curl_close($curl);
			return json_decode($response);
		}
	}
	public function getFolder($folder, $Parameters) {
		foreach ($Parameters as $key => $value) {
      if (in_array($key,array("startDateTime","endDateTime"))) {
        $aimMessagesParameters[$key]=$value;
      } else {
        $aimMessagesParameters["\$".$key]=$value;
      }
    }
		//foreach ($Parameters as $key => $value) $aimMessagesParameters[$key]=utf8_decode($value);
		$aimMessagesUrl = self::$outlookApiUrl."/me/$folder?".http_build_query($aimMessagesParameters);
		// debug(urldecode ($aimMessagesUrl));
		return $this->makeApiCall("GET", $aimMessagesUrl);
	}
	public static function getMsg($folder, $msg) {
		$aimMessagesUrl = self::$outlookApiUrl."/me/$msg";
		//echo "<PLAINTEXT>".$aimMessagesUrl.PHP_EOL;
		return self::makeApiCall("GET", $aimMessagesUrl);
	}
	public static function getFolderPeople($Parameters) {
		foreach ($Parameters as $key => $value) $aimMessagesParameters["\$".$key]=$value;
		$aimMessagesUrl = "https://outlook.office.com/api/beta/me/people?".http_build_query($aimMessagesParameters);
		return self::makeApiCall("GET", $aimMessagesUrl);
	}
	public static function getObject($folder,$id) {
		$aimMessagesUrl = self::$outlookApiUrl."/me/$folder/$id";
		return self::makeApiCall("GET", $aimMessagesUrl);
	}
	public static function getAttachement($id,$fileId) {
		$aimMessagesUrl = self::$outlookApiUrl."/me/messages/$id/attachments/$fileId";
		return self::makeApiCall("GET", $aimMessagesUrl);
	}
	public static function getAttachements($id,$Parameters) {
		foreach ($Parameters as $key => $value) $aimMessagesParameters["\$".$key]=$value;
		$aimMessagesUrl = self::$outlookApiUrl."/me/messages/$id/attachments?".http_build_query($aimMessagesParameters);
		//echo "<PLAINTEXT>".$aimMessagesUrl.PHP_EOL;
		return self::makeApiCall("GET", $aimMessagesUrl);
	}
	public static function setObject($folder,$id,$json_data) {
		$aimMessagesUrl = self::$outlookApiUrl."/me/$folder/$id";
		return self::makeApiCall("PATCH", $aimMessagesUrl, json_encode($json_data));
	}
	public static function insertObject($folder,$json_data) {
		$aimMessagesUrl = self::$outlookApiUrl."/me/$folder";
		$data = json_encode($json_data);
		return self::makeApiCall("POST", $aimMessagesUrl, $data);
	}
	public static function deleteObject($folder,$id) {
		$aimMessagesUrl = self::$outlookApiUrl."/me/$folder/$id";
		return self::makeApiCall("DELETE", $aimMessagesUrl, $data);//'{"GivenName": "Pavel","Surname": "Bansky","EmailAddresses": [{"Address": "pavelb@a830edad9050849NDA1.onmicrosoft.com","Name": "Pavel Bansky"}],"BusinessPhones": ["+1 732 555 0102"]}');
	}
	public static function subscribe($authCode) {
		global $accessToken,$refreshToken,$accountEmail,$accountId;
		$data = [
			"@odata.type"=>"#Microsoft.OutlookServices.PushSubscription",
			"Resource"=>"https://outlook.office.com/api/v2.0/me/events",
			"NotificationURL"=>$GLOBALS[MSE]->redirectUri,
			"ChangeType"=>"Created",
			"ClientState"=>"c75831bd-fad3-4191-9a66-280a48528679"
		];
		$data_string = json_encode($data);
		// Calling http_build_query is important to get the data formatted as expected.
		//$data_string = json_encode($data);
		$body = http_build_query($data);
		error_log("Request body: ".$body);
		//$curl = curl_init(self::$authority.self::$tokenUrl);
		$curl = curl_init("https://outlook.office.com/api/v2.0/me/subscriptions");
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($curl, CURLOPT_POST, true);
		curl_setopt($curl, CURLOPT_POSTFIELDS, $body);
		curl_setopt($curl , CURLOPT_HTTPHEADER, [
			'Content-Type: application/json',
			'Content-Length: ' . strlen($data_string)
		]);
		curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
		$response = curl_exec($curl);
		echo $response;
		error_log("curl_exec done.");
		$httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
		error_log("Request returned status ".$httpCode);
		if ($httpCode >= 400) return array('errorNumber' => $httpCode, 'error' => 'Token request returned HTTP error '.$httpCode);
		// Check error
		$curl_errno = curl_errno($curl);
		$curl_err = curl_error($curl);
		if ($curl_errno) {
			$msg = $curl_errno.": ".$curl_err;
			error_log("CURL returned an error: ".$msg);
			return array('errorNumber' => $curl_errno,'error' => $msg);
		}
		curl_close($curl);
		echo array('errorNumber' => $curl_errno,'error' => $msg);
		echo "KLAAR";
		return $json_vals;
	}
	public static function subscribe1() {
		global $accessToken,$refreshToken,$accountEmail,$accountId;
		// Build the form data to post to the OAuth2 token endpoint
		$token_request_data = array(
			"@odata.type"=>"#Microsoft.OutlookServices.PushSubscription",
			"Resource"=>"https://outlook.office.com/api/v2.0/me/events",
			"NotificationURL"=>$GLOBALS[MSE]->redirectUri,
			"ChangeType"=>"Created",
			"ClientState"=>"c75831bd-fad3-4191-9a66-280a48528679"
		);
		$token_request_data = array(
			"grant_type" => "authorization_code",
			"code" => $authCode,
			"redirect_uri" => $GLOBALS[MSE]->redirectUri,
			"scope" => implode(" ", self::$scopes),
			"client_id" => $GLOBALS[MSE]->clientId,
			"client_secret" => $GLOBALS[MSE]->clientSecret
		);
		// Calling http_build_query is important to get the data formatted as expected.
		$token_request_body = http_build_query($token_request_data);
		error_log("Request body: ".$token_request_body);
		$curl = curl_init(self::$authority."/api/v2.0/me/subscriptions");
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($curl, CURLOPT_POST, true);
		curl_setopt($curl, CURLOPT_POSTFIELDS, $token_request_body);
		//curl_setopt($curl, CURLOPT_CAINFO, $_SERVER['DOCUMENT_ROOT'] . "/../cert/aliconnect_nl/aliconnect_nl.pfx");
		curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
		$response = curl_exec($curl);
		echo $response;
		echo "KLAAR";
	}
	public static function validationtoken($token) {
		global $accessToken,$refreshToken,$accountEmail,$accountId;
		$q="UPDATE om.mse SET mse_validation_token = '$token'";
		aim()->query($q);
		// Build the form data to post to the OAuth2 token endpoint
		$token_request_data = array(
			"@odata.context"=>"https://outlook.office.com/api/v2.0/$metadata#Me/Subscriptions/$entity",
			"@odata.type"=>"#Microsoft.OutlookServices.PushSubscription",
			"@odata.id"=>"https://outlook.office.com/api/v2.0/Users('ddfcd489-628b-7d04-b48b-20075df800e5@1717622f-1d94-c0d4-9d74-f907ad6677b4')/Subscriptions('Mjk3QNERDQQ==')",
			"Id"=>"Mjk3QNERDQQ==",
			"Resource"=>"https://outlook.office.com/api/v2.0/me/events",
			"ChangeType"=>"Created, Missed",
			"ClientState"=>"c75831bd-fad3-4191-9a66-280a48528679",
			"NotificationURL"=>$GLOBALS[MSE]->redirectUri,
			"SubscriptionExpirationDateTime"=>"2016-03-05T22:00:00.0000000Z"
		);
		// Calling http_build_query is important to get the data formatted as expected.
		$token_request_body = http_build_query($token_request_data);
		error_log("Request body: ".$token_request_body);
		$curl = curl_init(self::$authority."/api/v2.0/me/subscriptions");
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($curl, CURLOPT_POST, true);
		curl_setopt($curl, CURLOPT_POSTFIELDS, $token_request_body);
		curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
		$response = curl_exec($curl);
		echo $response;
		echo "KLAAR";
	}
  public function login() {
    $loginurl = $this->getLoginUrl() . '&state=' . base64_encode($_SERVER['HTTP_REFERER']);
    // debug($loginurl);
    header('Location: '.$loginurl);
    die();
    // debug($loginurl);
  }
  public function get() {
    if (!empty($_GET['code'])) {
      // debug(base64_decode($_GET['state']));
      $this->getTokenFromAuthCode($_GET['code']);
      header('Location: /');
    }
    $path = explode('/mse',$_SERVER['REQUEST_URI'])[1];
    $this->getUserToken();

    $result = $this->makeApiCall("GET", self::$outlookApiUrl."/me/".$path);
    // debug($path,$result);

		// $result = $this->getFolder("calendarview",[
    //   "startDateTime"=>'2017-01-01T01:00:00',
    //   "endDateTime"=>'2020-03-31T23:00:00',
    //   "select"=>'Id,Subject,BodyPreview,HasAttachments',
    //   "top"=>100
    // ]);
    // debug($result);
		// $result = $mse->getFolder("contacts",array("select"=>'*',"top"=>10,"order"=>'LastModifiedDateTime DESC'));
		// if (!$result) die("<a href='$loginurl'>$loginurl</a>");
		return $result;

  }
}
class pdf {
  public function __construct () {
    require_once(__DIR__.'/dompdf/dompdf_config.inc.php');
    $this->dompdf = new DOMPDF();
  }
  public function output($html) {
    $this->dompdf->load_html($html);
    // $this->dompdf->set_base_path('');
    $this->dompdf->set_paper('A4', 'portrait');
    $this->dompdf->render();
    $this->dompdf->stream('document.pdf', array("Attachment" => false));
    // >output();
  }
}
class item {
 	public function __construct ($schemaname = null, $id = null) {
    $this->ATTRIBUTE_PROPERTIES = "A.ItemID,A.AttributeID,A.AttributeName,A.Value,A.LastModifiedDateTime,A.ID,A.[schema],A.Scope,A.Data,A.LinkID";
    $this->method = $_SERVER['REQUEST_METHOD'];
    $this->uri = $_SERVER['REQUEST_URI'];
    // $this->LastModifiedDateTime = date('Y-m-d h:i:s');
    $this->schemaname = $schemaname;
    $this->id = $id;
    if (isset($this->id) && !is_numeric($this->id)) {
      // echo ">>>>>>>>$this->id";
      $this->id = sqlsrv_fetch_object(aim()->query("SELECT id FROM item.dt WHERE uid='$this->id'"))->id;
    }

    $this->root_url = 'http'.($_SERVER['SERVER_PORT_SECURE'] ? 's' : '').'://'.$_SERVER['SERVER_NAME'].'/api/';
    // $this->client_id = isset(aim()->api->config->aim->aud) ? aim()->api->config->aim->aud : 1;
    // debug(aim()->config->aim->client_id);
    // $this->client_id = uid(aim()->config->aim->client_id);
    $this->client_id = uid(aim()->config->aim->client_id);
    //isset(aim()->access['client_id']) ? aim()->access['client_id'] : AIM_CLIENT_ID; //$this->req["headers"]["aud"];
    // debug(aim()->access);
    // $this->client_id = 2347321;
    $this->sub = isset(aim()->access['sub']) ? aim()->access['sub'] : aim()->config->aim->client_id;//AIM_CLIENT_ID; //$this->req["headers"]["aud"];

    $this->schema = (isset(aim()->api->components->schemas->{$this->schemaname})) ? aim()->api->components->schemas->{$this->schemaname} : null;
    $this->filter = '';
    $this->search_query = '';
    foreach ($_GET as $key => $value) {
      $key = ltrim($key,'$');
      $this->$key = $_GET[$key] = urldecode($value);
    }
    $filterReplace = [
      '/schema/'=> '[schema]',
      ' and '=> ') AND (',
      ' or '=> ') OR (',
      '"'=> "'",
      '*'=> '%',
      ' IS '=> ' IS ',
      ' eq NULL'=> ' IS NULL',
      ' ne NULL'=> ' IS NOT NULL',
      ' eq ('=> ' IN (',
      ' eq '=> ' = ',
      ' ne '=> ' <> ',
      ' gt '=> ' > ',
      ' ge '=> ' >= ',
      ' lt '=> ' < ',
      ' le '=> ' <= ',
    ];
    if (!empty($this->filter)) {
      // preg_match_all("/\((.*)\)/",$this->filter,$matches,PREG_PATTERN_ORDER);
      $this->filter = 'AND '.'(('.str_replace(array_keys($filterReplace),array_values($filterReplace),$this->filter).'))';
      $this->filter = preg_replace('/\b(schema)\b/','[$1]',$this->filter);
      // debug ($this->filter);
    }
    // debug($this);
    $this->top = isset($this->top) ? $this->top : 10;

    $this->defaultItemProperties = [
      'schema','schemaPath','filterfields','files','InheritedID',
      'header0','header1','header2','name','Tagname',
      'State','Categories','Title','Subject','Summary',
      'KeyID','Scope','Tag','Keyname','Name','HasChildren','HasAttachements','IsClass','IsPublic','IsSelected','MessageCount','Location',
      'CreatedBy','LastModifiedBy','CreatedDateTime','LastModifiedDateTime','StartDateTime','EndDateTime','FinishDateTime',//'LastIndexDateTime'
      'CreatedByTitle',
    ];
    $this->itemProperties = array_merge($this->defaultItemProperties,[
      'ID','UID','HostID','ItemID','ClassID','SrcID','DetailID','OwnerID','UserID','CreatedByID','LastModifiedByID','InheritedID',//'MasterID'
    ]);
    $this->defaultProperties = array_merge($this->defaultItemProperties,[
      'Host','Source','Owner','User','Inherited'//,'Master',
    ]);
    $this->arrselect = isset($this->select) ? explode(',',$this->select) : $this->defaultProperties;
    $this->hide_properties = array_flip(array_diff(['schema','id','ID','UID'],$this->arrselect));
    $this->properties = array_values(array_unique(array_merge(['schema','ID','UID'],array_intersect($this->arrselect,$this->itemProperties))));
    $this->properties = '['.implode('],[',$this->properties).']';
    $this->attributes = array_values(array_diff($this->arrselect,$this->itemProperties));
    if (isset($this->search)) {
      $this->search = trim(str_replace('*','%',urldecode($this->search)));
      $or = [];
      function explodeq($sep,$aq){
        $aq = explode($sep,$aq);
        foreach ($aq as $i => $q) $aq[$i] = strpos($q,'%') ? $q : "$q";
        return $aq;
      }
      $qword = "id IN (SELECT ItemID FROM item.word WI INNER JOIN word.dt W ON W.id = WI.WordID AND W.word LIKE '";
      $this->search_query = "AND (
        (
          ($qword".implode("'))
          AND
          ($qword",explode(' ',$this->search))."'))
        )
        OR
        (
          (Title+Subject LIKE '%".implode("%')
          AND
          (Title+Subject LIKE '%",explode(' ',$this->search))."%')
        )
      )
      ";
    }

    // $this->sub = 265090;

    $this->sql_request = "
    SET TEXTSIZE -1;
    DECLARE @ClientId BIGINT, @UserId BIGINT, @Id BIGINT
    SELECT @ClientId = item.getId('$this->client_id'), @UserID = item.getId('$this->sub')".(empty($this->id) ? "" : ", @ID = item.getId('$this->id')")."
    INSERT aimhis.his.req(client_id,sub,id,method,url)VALUES(@ClientId,@UserID,@ID,'$this->method','$this->uri')
    ";
    $this->sql = $this->sql_request."
    DECLARE @T TABLE (_ID BIGINT,Path VARCHAR(MAX));
    ";
 	}
 	private function row($row) {
 		$schema = $this->schema;
 		$row->schema = $this->schemaname;
 		$this->odata_prefix = '@';
 		$id = $row->ID = isset($row->ID) ? $row->ID : $row->{$this->table->idname};
 		if ($schema->header) {
      foreach (['header0','header1','header2'] as $i => $key) {
        if (!isset($this->array_select_param) || in_array($key,$this->array_select_param)) {
          $row->$key = implode(' ',array_intersect_key((array)$row,array_flip($schema->header[$i])));
        }
      }
    }
 		foreach ($row as $key=>$value)if($value && $value[0]=='{')$row->$key=json_decode($value);
 		return array_replace([
 			$this->odata_prefix.'context' => 'https://'.$_SERVER['SERVER_NAME'].'/api/v1/$metadata#'.$this->schemaname.'/$entity',
 			$this->odata_prefix.'id' => 'https://'.$_SERVER['SERVER_NAME']."/api/$this->schemaname($id)",
 			'Id' => base64_encode(json_encode(array_intersect_key((array)$row,$this->IdPropertyNames))),
 		],isset($this->array_select_param_flip)?array_intersect_key((array)$row,$this->array_select_param_flip):(array)$row);
 	}
 	private function table () {
 		$this->IdPropertyNames = array_flip(['schema','ID','UID','header','State']);
 		$schema = $this->schema;
		$table = $this->table = $this->schema->table;
 		$schema->path = '/'.$this->schemaname;
    $idname = empty($this->table->idname) ? 'ID' : $this->table->idname;
 		// $headerProperties = [$table->idname = isset($table->idname) ? $table->idname : 'ID'];
    $table->filter = isset($table->filter) ? $table->filter : [];

    if (empty($this->select) || $this->select === '*') {
      $this->array_select_param = array_keys((array)$schema->properties);
      // debug($schema->properties, $this->array_select_param);
      $select = '*';
    } else {
      $this->array_select_param = isset($this->select) ? explode(',',$this->select) : (isset($this->id) ? array_keys((array)$this->schema->properties) : []);
      if (in_array('header0', $this->array_select_param )) {
        $headerProperties = array_merge($schema->header[0], $headerProperties?:[]);
      }
      if (in_array('header1', $this->array_select_param )) {
        $headerProperties = array_merge($schema->header[1], $headerProperties?:[]);
      }
      if (in_array('header2', $this->array_select_param )) {
        $headerProperties = array_merge($schema->header[2], $headerProperties?:[]);
      }
      // debug(1,$select,$headerProperties);
      // $this->select = array_merge($this->select, ['ID']);
      // debug ($this->select);
      // debug($headerProperties, $schema->header);
      $this->array_select = array_diff($this->array_select_param,['header0','header1','header2']);
      $this->array_select = array_merge($this->array_select,[$idname]);
      $this->array_select_param_flip = array_flip(array_merge($this->array_select_param,$table->filter));
      $select = '['.implode('],[',array_values(array_filter(array_unique(array_merge($this->array_select,$headerProperties?:[],$table->filter?:[]))))).']';
      // debug(1,$select,$this->array_select);
    }
    if (isset($table->idname)) {
      $select.=",$table->idname AS ID";
    }
    // debug($this->array_select_param, $schema->header);
    // $select = str_replace('[*]','*',$select);
 		if (isset($this->id)) {

 			$q = "SELECT '$this->schemaname'[schema],$select FROM $table->name WHERE [$idname]=$this->id;";
      // debug($q);
 			$row = sqlsrv_fetch_object($res = aim()->query($q));
 			header('OData-Version: 4.0');
 			return $this->row($row);
 		}
 		$this->top = isset($this->top) ? $this->top : 5000;
 		$q = "SELECT TOP ".$this->top." '$this->schemaname'[schema],$select FROM $table->name";
 		if (!empty($this->search)) {
 			$search = explode(' ',$this->search);
 			foreach($search as $value) {
 				$or=[];
 				foreach($table->search as $key) {
          $or[] = "[$key]LIKE'%$value%'";
        }
 				$where[] = implode('OR',$or);
 			}
 		}
 		if (!empty($this->filter)) $where[] = $this->filter;
 		if (!empty($where)) $q.=' WHERE('.implode(')AND(',$where).')';
 		if (!empty($this->order)) $q.=" ORDER BY $this->order";
    // die($q);
		$res = aim()->query($q);
 		$result['value'] = [];
 		while($row = sqlsrv_fetch_object($res)) {
      array_push($result['value'],$this->row($row));
    }
 		header('OData-Version: 4.0');
 		return $result;
 	}
 	public function linkadd () {
 		extract($parameters);
 		$q.=";EXEC item.attr @ItemID=$id,@LinkID='$requestBody->itemID'";
 		aim()->query($q);
 		return;
 	}
 	public function link ($attributeName, $method) {
    $id = $this->id;
    // debug(1);

    // $this->subschemaname = $attributeName;
    if ($method === 'delete') {
      $pathParam = preg_match_all('/\(([^\)]+)\)/', $_SERVER['REQUEST_URI'], $matches, PREG_PATTERN_ORDER);
      aim()->query('DELETE attribute.dt WHERE ItemID=%1$d AND LinkID=%2$d AND NameID IN (SELECT id FROM attribute.name WHERE name=\'%3$s\')', $matches[1][0], $matches[1][1], $attributeName);
      return;
    }
    if ($method === 'get') {
      $this->sql = "
      SET TEXTSIZE -1;
      DECLARE @ClientId BIGINT, @UserId BIGINT, @Id BIGINT
      SELECT @ClientId = item.getId('$this->client_id'), @UserID = item.getId('$this->sub')

      SELECT ID _ID, ID, UID, [schema] FROM item.vw WHERE ID = $this->id
      DECLARE @T TABLE (Level TINYINT, ItemID BIGINT, _ID BIGINT, AttributeName VARCHAR(250), Data VARCHAR(MAX),Path VARCHAR(MAX))
      INSERT @T
      SELECT TOP $this->top 0,$this->id,LinkID,'$attributeName',Data,''
      FROM attribute.dv
      WHERE ItemID = $this->id
      AND NameID IN (Select ID FROM attribute.name WHERE name='$attributeName')
      AND LinkID IN (SELECT ID FROM item.vw);
      ";
      // die($this->sql);
      $this->sql_add_attributes ();
      $items = $this->build_response ();
      array_shift($items['value']);
      return $items;
    }
    $this->add = true;
    $this->requestBody = $_POST;
    // debug($this->schema->properties->{$attributeName}->schema);


    $this->schemaname = $this->schema->properties->{$attributeName}->schema;
    $item = $this->update(1);
    // debug($item);

    // debug(1, "EXEC item.attr @ItemID=$this->id, @Name='Message', @LinkID=$item->ID, @max=9999");
    aim()->query(
      "EXEC item.attr @ItemID=%s, @Name=%s, @LinkID=%d, @max=9999",
      $id,
      $attributeName,
      $item['ID']
    );

    // debug(
    //   $id,
    //   $attributeName,
    //   $item->ID,
    // );
    //


 		return $item;
 	}
  public function file ($method=null, $ofile=null) {
    $hostid = aim()->access['aud'];
    $item = sqlsrv_fetch_object(aim()->query("INSERT INTO item.dt (hostid,classid) VALUES ($hostid,3);SELECT id,uid FROM item.dt WHERE id=SCOPE_IDENTITY();"));
    $_GET['LinkID'] = $item->id;
    $path = implode('/',[
      "/shared",
      $hostid,
      date('Y/m/d'),
      $item->uid,
      // empty($_GET['uid']) ? uniqid() : $_GET['uid'],
    ]);
    if (!is_dir($_SERVER['DOCUMENT_ROOT'].$path)) {
      mkdir($_SERVER['DOCUMENT_ROOT'].$path,0777,true);
    }
    $filename = pathinfo($_GET['name'], PATHINFO_FILENAME);
    $ext = pathinfo($_GET['name'], PATHINFO_EXTENSION);
    $i=0;
    while (is_file($fname = $_SERVER['DOCUMENT_ROOT'].( $_GET['src'] = $path."/".$filename.($i?$i:'').".$ext" ))) {
      $i++;
    }
    if (strstr($_GET['type'],'openxmlformats')) {
      $content = file_get_contents('php://input');
      file_put_contents($fname, $content);

      // Create new ZIP archive
      $zip = new ZipArchive;
      // Open received archive file
      $dataFile = "word/document.xml";
      if (true === $zip->open($fname)) {
        // If done, search for the data file in the archive
        if (($index = $zip->locateName($dataFile)) !== false) {
          // If found, read it to the string
          $data = $zip->getFromIndex($index);
          // Close archive file
          $zip->close();
          // debug(3, $fname);
          // Load XML from a string
          // Skip errors and warnings
          $xml = new DOMDocument();
          $xml->loadXML($data, LIBXML_NOENT | LIBXML_XINCLUDE | LIBXML_NOERROR | LIBXML_NOWARNING);
          // Return data without XML formatting tags
          $xmltext = $xml->saveXML();
          // file_put_contents(str_replace('.docx','.xml',$fname), $xmltext);
          $text = strip_tags($xmltext, '<w:p>');
          // file_put_contents(str_replace('.docx','1.txt',$fname), $text);
          $text = preg_replace('/<w:p.*?>/i','',$text);
          $text = preg_replace('/<\\/w:p>/i',"\r\n",$text);

          // $xmltext = str_replace('w:p','p',$xmltext);

          file_put_contents(str_replace('.docx','.txt',$fname), $text);
        }
        // debug(2, $fname);
        $zip->close();
      } else {
        // debug(1, $fname);
      }

    } else {
      file_put_contents($fname, file_get_contents('php://input'));
    }
    return $_GET;


    $ofile = (array)($ofile ?: $_GET);
    $content = null;
    $fieldnames = 'name,ext,title,alt,type,size,lastmodifieddate,host,src';
    $url = '';

    // debug($ofile, $this->id);
    if (!empty($ofile['data'])) {
      $content = $ofile['data'];
      unset($ofile['data']);
    }
    if (!empty($ofile['url'])) {
      $row = sqlsrv_fetch_object(aim()->query("SELECT $fieldnames FROM item.attachement WHERE url='$ofile[url]';"));
      if (!empty($row)) return $row;
      $content = $content ?: file_get_contents($ofile['url']);
      $arr = explode('/',(explode('?', $ofile['url'])[0]));
      $ofile['name'] = empty($ofile['name']) ? array_pop($arr) : $ofile['name'] ;
    } else {
      $content = file_get_contents('php://input');
    }
    if (strstr($content,'base64')) {
      $content = base64_decode(explode('base64,',$content)[1]);
    }
    $ext = strtolower(pathinfo($ofile['name'], PATHINFO_EXTENSION));
    $document_root = str_replace('\\','/',$_SERVER['DOCUMENT_ROOT']);
    // debug(aim()->access);
    $src = '/'.implode('/',['shared',aim()->access['aud'],date('Y/m/d'),uniqid().'.'.$ext]);
    $path = pathinfo($source = $document_root.$src, PATHINFO_DIRNAME);
    if (!is_dir($path)) {
      mkdir($path,0777,true);
    }
    file_put_contents($source,$content);
    $ofile = array_replace([
      'itemid'=> $this->id,
      'hostid'=> aim()->access['aud'],
      'userid'=> aim()->access['sub'],
      'name'=> $ofile['name'],
      'ext'=> $ext,
      'type'=> '',
      'title'=> '',
      'alt'=> '',
      'size'=> filesize($source),
      'lastmodifieddate'=> '',
      'host'=> 'https://aliconnect.nl',
      'src'=> $src,
      'url'=> $url,
    ],array_change_key_case($ofile, CASE_LOWER));
    // debug($document_root, $path, $source, $src, $method, $ofile, strstr($content,'base64') ? 1 : 0);
    $fields = implode('],[',array_keys($ofile));
    $values = implode("','",array_values($ofile));
    $q = "INSERT INTO item.attachement ([$fields])VALUES('$values');
    SELECT $fieldnames FROM item.attachement WHERE ID=@@IDENTITY;";
    // die($q);
    $row = sqlsrv_fetch_object(aim()->query($q));
    return $row;
 	}
 	public function find () {
 		// if (empty($_GET['search'])) throw new Exception('Precondition failed', 412);
 		return $this->get ();
 	}
  public function children () {
    if (empty($this->level)) {
      $this->level=1;
    }
    $this->filter=(empty($this->filter) ? "" : $this->filter) . " AND level<$this->level";
    // debug($this->filter);
 		$this->sql = $this->sql_request."SET @ID=$this->id; "."SELECT ID _ID,ID,UID,[schema],schemaPath FROM item.vw WHERE ID = @ID;
    DECLARE @T TABLE (Level TINYINT, ItemID BIGINT, _ID BIGINT, AttributeName VARCHAR(250),ChildIndex INT);
    WITH P(level,ItemID,_ID,AttributeName,ChildIndex) AS (
      SELECT 0,@ID,@ID,'Children',CONVERT(INT,0)
      UNION ALL
      SELECT Level+1,I.MasterID,I.ID,'Children',I.idx
      FROM P
      INNER JOIN item.children I ON I.MasterID = P._ID AND I.id IN (SELECT id FROM item.vw WHERE I.HostID = @ClientId $this->filter)
      --INNER JOIN item.vw I ON I.MasterID = P._ID AND I.HostID = @ClientId $this->filter
    )
    INSERT @T SELECT * FROM P WHERE Level>0
    ";
 		// if (isset($this->filter)) $this->sql .= "\n".$this->filter;
 		// if (isset($this->search)) $this->sql .= "\n".$this->search_query;
 		$this->sql_add_attributes ();

    $retvalue = $this->build_response();
    // debug($retvalue);

 		return $retvalue;
 	}
  public function references () {
    if (empty($this->level)) $this->level=1;
    $referenceList = [];
    $this->sql = "SET TEXTSIZE -1;";
    foreach ($this->schema->properties as $attributeName => $attribute) {
      if (isset($attribute->schema) && isset($attribute->attributeName)) {
        $referenceList[] = $attribute;
        $this->sql .= "SELECT ID _ID, ID, UID, [schema],schemaPath FROM item.vw WHERE ID = $this->id;
        DECLARE @T TABLE (Level TINYINT, ItemID BIGINT, _ID BIGINT, AttributeName VARCHAR(250),ChildIndex VARCHAR(MAX),Path VARCHAR(MAX));
        WITH P(level,ItemID,_ID,AttributeName,ChildIndex,Path) AS (
          SELECT 1,A.ID,A.ItemID,'$attributeName',A.Data,''
          FROM (SELECT ID,ItemID,Data,NameID FROM attribute.dv WHERE NameID IN (SELECT id FROM attribute.name WHERE Name = '$attribute->attributeName')) A
          INNER JOIN item.vw I ON I.ID = A.ItemID AND I.ClassID=SET @classID=item.getClassIdByName(I.hostId, '$attribute->schema') $this->filter
          WHERE A.ID = $this->id
          UNION ALL
          SELECT Level+1,A.ID,A.ItemID,'$attributeName',A.Data,''
          FROM (SELECT ID,ItemID,Data,NameID FROM attribute.dv WHERE NameID IN (SELECT id FROM attribute.name WHERE Name = '$attribute->attributeName')) A
          INNER JOIN item.vw I ON I.ID=A.ItemID AND I.ClassID = item.getClassIdByName(I.HostId, '$attribute->schema') $this->filter
          INNER JOIN P ON A.ID=P._ID AND level<$this->level
        )
        INSERT @T SELECT * FROM P --ORDER BY Level,ChildIndex
        ";
      }
    }
 		// if (isset($this->filter)) $this->sql .= "\n".$this->filter;
 		// if (isset($this->search)) $this->sql .= "\n".$this->search_query;
 		$this->sql_add_attributes ();
 		return $this->build_response ();
 	}
  private function build(&$b) {
    global $o;
    if (!$b->children) unset($b->children);
    if ($b->geo) {
      $b=(object)array_merge((array)$this->o->geo->{$b->geo},(array)$b);
    }
    foreach ($b->children as $i => $c) $b->children[$i]=$this->build($c);
    return $b;
  }
  public function get () {
    // debug($_SERVER['REQUEST_METHOD']);

		if (isset($this->search) && empty($this->search)) die(http_response_code(202));
 		if ($this->schemaname !== 'Item' && class_exists($this->schemaname) && method_exists($schemaname = $this->schemaname, $method = $this->method)) {
      return (new $schemaname())->$method($parameters);
    }
    // debug($this);
    if (isset($this->schema->table)) {
      return $this->table();
    }
    // debug(1);
 		if (isset($_GET['three'])) {
 			error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING & ~E_STRICT & ~E_DEPRECATED);
 			//global $aim;
 			$this->o = $o = (object)["scale" => 10, "shape" => (object)[], "geo" => (object)[] ];
 			$obj = sqlsrv_fetch_object(aim()->query("SELECT files FROM item.dt WHERE id=$this->id;"));
 			$files = json_decode($obj->files);
 			$o->floorplan->src = $files[0]->src;
      // debug($this->id);
 			$res=aim()->query("EXEC [item].[getTreeModel] @id=$this->id;");
 			while($row = sqlsrv_fetch_object($res)) {
        foreach($row as $key => $value) {
          if (is_null($value)) {
            unset($row->$key);
          }
        }
        // $row = (object)array_filter()
 				$row->children=$row->children ? json_decode($row->children) : [];
 				foreach ($row as $key=>$value) if ($value==='') unset($row->$key); else if (is_numeric($value)) $row->$key=(float)$value;
 				$items->{$row->id}=$row;
 				if (!$root) $root=$items->{$row->id};
 				if ($row->masterID && $items->{$row->masterID}) array_push($items->{$row->masterID}->children,$items->{$row->id});
 			}
 			$o->object = $root;
      $cfg = json_decode(file_get_contents($_SERVER['DOCUMENT_ROOT'].'/sites/'.AIM_DOMAIN.'/app/three/json/objects.json'));
 			foreach ($cfg as $key => $value)$o->{$key} = $value;
 			$cfg = json_decode(file_get_contents($_SERVER['DOCUMENT_ROOT'].'/sites/'.AIM_DOMAIN.'/app/three/json/shapes.json'));
 			foreach ($cfg->shape as $shapename=>$shape)$o->shape->{$shapename} = $shape;
 			foreach ($o->shape as $obj) foreach ($obj->vectors as $i=>$value) $obj->vectors[$i] = round($obj->vectors[$i] * 1000/39.370);
 			//we bouwen nu recursive een boom op van het top object en alle kinderen
      // debug($o->geo);
 			$o->object = $this->build($o->object);
 			// header('Content-Type: application/json');
 			// exit(json_encode($o));
      return $o;
 		}
 		if (!empty($this->id)) {
      // if (!is_numeric($this->id)) {
      //   $row = sqlsrv_fetch_object(aim()->query(
      //     "SELECT id FROM item.dt WHERE uid='%s'",
      //     $this->id,
      //   ));
      //   $this->id = $row->id;
      //   // debug($this->id);
      // }
      // $id = $_GET['id'] = $this->id;
      // if (is_numeric($this->id)) $this->sql .= "INSERT INTO @T VALUES ($this->id,'');";
      // else $this->sql .= "INSERT INTO @T SELECT (id,'') FROM item.dt WHERE uid = '$this->id';";
      $this->sql .= "INSERT INTO @T VALUES(@Id,'');";
 			if (!isset($this->select)) {
        $this->select = '*';
      }
 		}
    else {
      $this->sql .= "INSERT INTO @T
      SELECT TOP $this->top ID,''
      FROM item.dv
      WHERE HostID IN (@ClientId) AND ClassID=item.getClassIdByName(@ClientId, '$this->schemaname')
      $this->filter
      $this->search_query
      ";
    }
 		$this->sql_add_attributes ();
 		return $this->build_response ();
 	}
  public function sql_add_attributes () {
    // $this->sub = 265090;
    // debug($this->properties, $this->select);
    $selectProperties = isset($this->select) && $this->select === '*' ? 'I.*' : $this->properties;
 		$this->sql .= "SELECT T.*, $selectProperties
    FROM @T T
    INNER JOIN account.item(@UserId) I ON I.ID = T._ID
    ";
 		$this->attribute_filter = "";//"AND(HostID IS NULL OR HostID=$this->client_id) AND (UserID IS NULL OR UserID=0$this->sub) AND";

    preg_match('/LastModifiedDateTime >= ([^\)]+)\)/',$this->filter,$match);
    if ($match) {
      $this->attribute_filter = "AND A.LastModifiedDateTime >= '".str_replace('000Z','Z',$match[1])."'";
    }

    if (isset($this->select) || isset($this->unselect) || $this->attributes) {
      // $this->sql .= "SELECT COUNT(0) AS MessageCount, $this->id AS ItemID FROM item.attribute WHERE ItemID=$this->id AND NameID=2016;
      // SELECT A.* --$this->ATTRIBUTE_PROPERTIES
      // FROM account.attribute($this->sub,$this->client_id) A
      // INNER JOIN @T T ON A.ItemID = T._ID $this->attribute_filter;
      // ";
      // debug($this->select,$this->attributes,$this->attributes?1:0);
      // debug ($this->select, $this->attributes);
      if (empty($this->select) || $this->select !== '*') {
        if ($this->attributes) {
          $nameFilter = "AND A.NameID IN(SELECT id FROM attribute.name WHERE name IN('".implode("','",$this->attributes)."'))";
        }
      } else {
        $nameFilter = "";
      }
      // debug($this->select, $nameFilter);
      if (!empty($this->unselect)) {
        $nameFilter .= " AND A.NameID NOT IN(SELECT id FROM attribute.name WHERE name IN('".implode("','",explode(',',$this->unselect))."'))";
      }
      // SELECT COUNT(0) AS MessageCount, $this->id AS ItemID FROM item.attribute WHERE ItemID=$this->id AND NameID=2016;
      if ($this->id) {
        $this->sql .= "SELECT COUNT(0) AS MessageCount, @Id AS ItemID FROM attribute.dv WHERE ItemID=@Id AND NameID=2016;";
      }
      // debug($this->attributes, $this->attribute_filter, $nameFilter);
      if (isset($nameFilter)) {
        // $hostId = AIM_CLIENT_ID;
        $this->sql .= ";WITH P (Level,RootID,SrcId) AS (
            SELECT 0,T._id,T._id
            FROM @T T INNER JOIN account.item(@UserId) I ON I.ID = T._ID
            UNION ALL
            SELECT Level+1,P.RootID,ISNULL(ISNULL(I.InheritedID,I.SrcID),I.ClassID)
            FROM P INNER JOIN Item.VW I ON I.ID = P.SrcID AND level<10 AND P.SrcID<>I.SrcID
        	)
        	SELECT
            AN.Name AS AttributeName
            ,A.Value
            ,P.RootID ItemID
            ,A.ItemID SrcID
            ,A.HostID
            ,A.CreatedDateTime
            ,A.LastModifiedDateTime
            ,A.LastModifiedByID
            ,A.UserID
            ,A.AttributeID
            -- ,A.NameID
            -- ,A.ClassID
            ,A.Scope
            ,A.Data
            ,item.schemaPath(A.LinkID) AS [schema]
            ,item.schemaPath(A.LinkID) AS schemaPath
            ,A.LinkID
            ,A.LinkID AS ID
          FROM
            P
            INNER JOIN Attribute.vw A ON A.ItemID = P.SrcID
            INNER JOIN Attribute.Name AN ON AN.id = A.NameID
        	WHERE
            A.HostID IN (@ClientId,1,0)
            AND ISNULL(A.UserID,A.HostID) IN (@UserId,A.HostID,0)
            AND NameId NOT IN (516,1823,2184)
            $this->attribute_filter
            $nameFilter
          ORDER BY P.level
        ";
      }
    }
 		// else if ($this->attributes) {
    //   $this->sql .= "SELECT A.* --$this->ATTRIBUTE_PROPERTIES
    //   FROM account.attribute($this->sub,$this->client_id) A
    //   INNER JOIN @T T ON A.itemID=T._ID $this->attribute_filter AND NameID IN(SELECT id FROM attribute.name WHERE name IN('".implode("','",$this->attributes)."'));";
    // }
 	}
 	public function build_response () {
    extract($_GET);
    // debug(aim()->api->config);

    // echo $this->sql.PHP_EOL;

    // die();
    if (!$res = aim()->query('SET NOCOUNT ON;' . $this->sql)) {
 			if( ($errors = sqlsrv_errors() ) != null) {
 				foreach( $errors as $error ) {
 					die(json_encode([
 						'SQLSTATE'=>$error['SQLSTATE'],
 						'code'=>$error['code'],
 						'message'=>$error['message'],
 						'query'=>$this->sql,
 					]));
 				}
 			}
 		}
 		// if (empty($res)) throw new Exception("Conflict", 409);
 		$rows = $items = $refItems = [];
    $IdIntersectKeys = ['schema'=>1, 'ID'=>1, 'UID'=>1];
 		while ($res) {
 			while ($row = sqlsrv_fetch_array($res, SQLSRV_FETCH_ASSOC )) {
        // echo json_encode($row['AttributeName']).PHP_EOL;
        // echo json_encode($row).PHP_EOL;

        if (isset($row['MessageCount'])) $this->id = $row['ItemID'];
        unset($row['Path']);
        // debug($row);
        // echo PHP_EOL.json_encode($row);
        // if (!empty($row['_ID'])) $rows[] = $items[$row['_ID']] = $row;
 				if (array_key_exists('@id',$row) && $row['@id'])$row['@id'] = $this->root_url.$row['@id'];

        if (isset($row['schemaPath'])) {
          $row['schema'] = schemaName($row);
        //   $row['schemas'] = json_decode($row['schemas']);
        //   // if (in_array('Verkeersbuis',$row['schemas'])) {
        //   //   debug($row);
        //   // }
        //   foreach ($row['schemas'] as $schemaname) {
        //     if (isset(aim()->api->components->schemas->$schemaname)) {
        //       if ($row['schema'] !== $schemaname) {
        //         $row['Class'] = $row['schema'];
        //         $row['schema'] = $schemaname;
        //       }
        //       break;
        //     }
        //   }
        }
        // unset($row['schemas']);



        if (isset($row['_ID'])) {
          // debug($row);
          // if (isset($row['filterfields'])) {
   				// 	$row = array_replace($row,json_decode($row['filterfields'], true));
   				// 	unset($row['filterfields']);
   				// }
          // if (isset($row['Level'])) debug($row);



   				$rows[] = $items[$row['_ID']] = (object)itemrow($row);
          // if (!empty($row['Title'])) debug($row,$rows);
        }
        if (!empty($row['AttributeName'])) {

          // echo json_encode($row).PHP_EOL;
          // debug(2,$row,$value,$item);



          // $row['AttributeName'] = ucfirst($row['AttributeName']);
          $item = $items[$row['ItemID']] = empty($items[$row['ItemID']])
          ? (object)[]
          : $items[$row['ItemID']];




          // if (isset())
          // if (empty($item->schema)) continue;
          // if (empty(aim()->api->components->schemas->{$item->schema})) continue;
          // if (empty(aim()->api->components->schemas->{$item->schema}->properties)) continue;
          // if (empty(aim()->api->components->schemas->{$item->schema}->properties->{$row['AttributeName']})) continue;
          // $property = aim()->api->components->schemas->{$item->schema}->properties->{$row['AttributeName']};
          // debug($row);
          // debug($row['AttributeName'],aim()->api->components->schemas->{$item->schema}->properties);


          $type = null;
          if (!empty(aim()->api->components->schemas->{$item->schema}->properties->{$row['AttributeName']})) {
            $property = aim()->api->components->schemas->{$item->schema}->properties->{$row['AttributeName']};
            $type = empty($property->type) ? null : $property->type;
          }
          if (!empty($row['schema']) && !empty($row['ID'])) {
            $row['@id'] = API_ROOT_URL.schemaName($row)."($row[ID])";
          }
          $value = array_filter($row,function($val){
            return !is_null($val);
          });
          if (!empty($row['ID']) && !empty($items[$row['ID']])) {
            if ($row['ID'] != $this->id ) {
              if (empty($refItems[$row['ID']])) {
                $value = $refItems[$row['ID']] = $items[$row['ID']];
              }
            }
            unset($value->ItemID,$value->LinkID,$value->AttributeName);
          } else {
            $value = array_diff_key($value,['ID'=>0,'schema'=>0,'ItemID'=>0,'AttributeName'=>0,'_ID'=>0]);
          }
          $value = (object)$value;
          if (isset($value->Value)) {
            $decodeValue = json_decode($value->Value);
            if (!is_null($decodeValue)) {
              $value->Value = $decodeValue;
            }
          }
          // if (!empty($value->SrcID)) {
          //   if ($value->SrcID == $row['ItemID']) {
          //     unset($value->SrcID);
          //   }
          //   else {
          //     if (empty($value->Value)) {
          //       continue;
          //     }
          //     $value->SrcValue = $value->Value;
          //     unset($value->Value);
          //   }
          // }
          if (empty($item->{$row['AttributeName']})) {
            $item->{$row['AttributeName']} = $type === 'array' ? [$value] : $value;
          } else if (is_array($item->{$row['AttributeName']})) {
            $item->{$row['AttributeName']}[] = $value;
          } else if (!is_object($item->{$row['AttributeName']})) {
            $item->{$row['AttributeName']} = $value;
          // } else if (!empty($value->SrcID)) {
          //   if (empty($item->{$row['AttributeName']}->SrcValue)) {
          //     $item->{$row['AttributeName']}->SrcValue = $value->SrcValue;
          //   }
          //   if (empty($item->{$row['AttributeName']}->Value)) {
          //     $item->{$row['AttributeName']}->Value = $value->SrcValue;
          //   }
          } else {
            $item->{$row['AttributeName']} = [ $item->{$row['AttributeName']}, $value ];
          }
          // debug($item);
 				} else if (!empty($row['ItemID']) && isset($items[$this->id])) {
          $id=$row['ItemID'];
          unset($row['ItemID']);
          if(empty($items[$id])) $items[$id] = (object)[];
          foreach ($row as $key=>$value) {
            $items[$id]->{$key} = $value;
          }
        }
 			}
 			if (!sqlsrv_next_result($res)) break;
 		}

    // debug(1);
    header('OData-Version: 4.0');



    if (empty($this->id)) {
      if (!empty($order)) {
        ordered_list($order,$rows);
      }
      // {
      //   foreach (array_reverse(explode(',',$order)) as $orderkey) {
      //     $orderdir = explode(' ',$orderkey);
      //     $orderkey = array_shift($orderdir);
      //     $orderdir = array_shift($orderdir);
      //     $orderby = [];
      //     foreach ($rows as $key => $row) {
      //       $orderby[$key] = is_object($row->$orderkey)
      //       ? $row->$orderkey->Value
      //       : $row->$orderkey;
      //     }
      //     // $orderarr = array_column($rows, $key);
      //     array_multisort($orderby, $orderdir == 'DESC' ? SORT_DESC : SORT_ASC, SORT_NATURAL|SORT_FLAG_CASE, $rows);
      //   }
      // }
      // debug($sort);
      // $volume  = array_column($data, 'volume');
      // $edition = array_column($data, 'edition');
      // // Sort the data with volume descending, edition ascending
      // // Add $data as the last parameter, to sort by the common key
      // array_multisort($volume, SORT_DESC, $edition, SORT_ASC, $data);

      // array_multisort($sort, SORT_ASC, SORT_NATURAL|SORT_FLAG_CASE, $rows);
      // debug(111,$rows);
      return [
        '@context' => $this->root_url."\$metadata#/\$entity",
        'value' => $rows,
      ];
    }

    // function wr($items,$level){
    //   if ($level>5) return;
    //   foreach ($items as $key => $value) {
    //     echo PHP_EOL.str_repeat('  ',$level).$key;
    //     if (is_object($value)) wr($value,$level+1);
    //     else if (is_array($value)) wr($value,$level+1);
    //     // else echo $value;
    //   }
    // }

    if (!empty($items[$this->id])) {
      // wr($items[$this->id],1);
      // // foreach ($items as $key => $value) {
      // //   echo $this->id.'-'.$key.json_encode($value).PHP_EOL;
      // // }
      // // echo json_encode($items[$this->id]).PHP_EOL;
      // // debug($this->id, $items[$this->id]);
      // //
      // //
      // //
      // die();
      // // debug($rows);
      //


      $row = (array)$items[$this->id];
      // if (!empty($order)) {
      //   if (!empty($row['Children'])) ordered_list($order,$row['Children']);
      // }
      return array_merge([
        '@context' => $this->root_url."\$metadata#/$this->schemaname/\$entity"
      ],$row);
    }
  }
 	public function put ($req) {
 		self::PATCH($req);
 	}
 	public function add () {
 		$this->add = true;
    $input = file_get_contents('php://input');
    $this->requestBody = $input ? json_decode($input) : (object)array_map(function($value){return ['Value'=>$value];}, $_POST);
    // $this->requestBody->CreatedByID = $this->sub;


    return $this->update();


    if (empty($_GET)) {
      return $this->update();
    } else {
      $q="SET NOCOUNT ON
      SET DATEFORMAT YMD;
      DECLARE @id BIGINT,@classID BIGINT
      EXEC item.getClassID @ClassID=@ClassID OUTPUT,@schema='$this->schemaname'
      SELECT id FROM item.vw WHERE HostID=$this->client_id AND ClassID=@ClassID AND ".implode('AND',array_map(
        function($key,$val) {
          return "(ID IN (SELECT ItemID FROM attribute.dv WHERE NameID IN (SELECT ID FROM attribute.name WHERE name='$key') AND Value='$val'))";
        },
        array_keys((array)$_GET),
        array_values((array)$_GET)
      ));//.";IF @id IS NULL BEGIN;INSERT INTO item.dt (HostID,ClassID)VALUES($this->client_id,@ClassID);SET @id=scope_identity();END;SELECT @id AS id;"
      $res = aim()->query($q);
      // echo 'JA';
      // debug($q,'JA',empty($res),$this->id );
      if ($row = sqlsrv_fetch_object($res)) {
        while ($row) {
          // echo 'ROW';
          $this->requestBody = json_decode($input);
          $this->requestBody->CreatedByID = $this->sub;
          $this->update($this->id = empty($row) ? null : $row->id);
          $row = sqlsrv_fetch_object($res);
        }
      } else {
        return $this->update();
      }
    }
    // return $this->get();
 	}
  public function patch ($requestBody = null) {
    // debug($requestBody, $this->id);

    $this->requestBody = $requestBody ?: json_decode(file_get_contents('php://input'));
    return $this->update();
  }
  public function post () {
    // return;
    // $input = file_get_contents('php://input');
    // $this->requestBody = $input ? json_decode($input) : (object)array_map(function($value){return ['Value'=>$value];}, $_POST);
    // debug($this->requestBody);
    $headers = getallheaders();
    if (strstr($headers['Content-Type'], 'multipart/form-data')) {
      $schema = aim()->api->components->schemas->{$this->schemaname};
      $item = (object)[];
      $q = '';
      foreach($_POST as $attributeName => $value) {
        // if (empty($schema->properties->$attributeName)) continue;
        // if (!empty($schema->properties->$attributeName)) {
        //   $property = $schema->properties->$attributeName;
        // }
        $value = str_replace("'","''",$value);
        $q .= "EXEC item.attr @ItemID=$this->id, @name='$attributeName', @value='$value';";
        $item->$attributeName = $value;
        // debug($propertyName, $property);
      }
      if (!empty($q)) {
        aim()->query($q);
        if (!empty($_GET['mailto'])) {
          // echo 'sss';debug(getallheaders(),aim()->access);
          $account = sqlsrv_fetch_object(aim()->query(
            "EXEC account.get @AccountId=%d",
            aim()->access['sub']
          ));
          aim()->account_get($item->{$_GET['mailto']}, [
            ['title' => $item->{$_GET['mailto']},'content'=> ''],
            [
              'title' => __('new_data'),
              'content'=> __('new_data_intro', $_GET['uri']),
            ],
          ]);
          aim()->mail([
            'send'=> 1,
            'to'=> $account->email,
            'bcc'=> "max.van.kampen@alicon.nl",
            'chapters'=> [
              ['title' => $account->email,'content'=> ''],
              [
                'title' => __('new_data_send'),
                'content'=> __('new_data_send_intro', $_GET['uri']),
              ]
            ],
          ]);



          // debug($item->{$_GET['mailto']});
        }
        return $item;
      }

      // debug($this, $headers['Content-Type'], getallheaders());
      debug($_POST);
      return;
      http_response_code(201);
    }

    // extract($param = array_merge(empty(aim()->api->components->schemas->{$tag}) ? [] : (array)aim()->api->components->schemas->{$tag}, $_POST));
    //debug('POST', $param);
 		//$aud = $this->req[headers][aud];
 		$path = $this->req['path'];
 		$schema = array_shift(explode('(',trim($path,'/')));
 		$q .= "
    DECLARE @classID INT;SET @classID=item.getClassIdByName($aud,'$schema')
    DECLARE @id INT;INSERT item.dt(classID,hostID,userID)VALUES(@classID,$aud,$sub)
    SET @id = scope_identity()
    ";
 		foreach($requestBody as $attributeName => $value) {
      $q .= "
      EXEC item.attr @ItemID=@id,@name='$attributeName',@value='$value'
      ";
    }
 		sqlsrv_fetch_object(aim()->query($q));
 		http_response_code(201);
 		/* @todo response bevat minimaal gegevens van toegevoegd item */
 		return;
 	}
  public function update ($asRow = 0) {
    // debug(3);
    // $this->parameters($_GET);
    if (empty($this->requestBody)) return;
    $requestBody = $this->requestBody;

    $q = "SET NOCOUNT ON
    SET DATEFORMAT YMD;
    DECLARE @ClientId BIGINT, @UserId BIGINT, @Id BIGINT, @classID BIGINT, @LastModifiedDateTime DATETIME;
    SELECT
    @ClientId = item.getId('$this->client_id'),
    @UserID = item.getId('$this->sub'),
    @LastModifiedDateTime = GETDATE()
    EXEC item.getClassID @schema='$this->schemaname', @ClassID=@ClassID OUTPUT
    ";

    if (empty($this->id) || !empty($this->add) ) {
      $this->id = sqlsrv_fetch_object(aim()->query(
        $q."INSERT INTO item.dt (HostID, ClassID, CreatedByID) VALUES (@ClientId,@ClassID,@UserID);SET @id=scope_identity()
        SELECT @id AS id
        EXEC item.attr @HostID=@ClientId, @ItemID=@id, @Value=@UserID,@AttributeName='CreatedByID'
        "
      ))->id;
      // $requestBody->CreatedByID = $this->sub;
    }
    // debug(1, $this->id, $this->requestBody);
    $q .= ";SET @id=$this->id;";
    // if (isset($requestBody->files)) {
    //   foreach ($requestBody->files as $i => $ofile) {
    //     if (isset($ofile->data)) $requestBody->files[$i] = $this->file('post',$ofile);
    //   }
    //   $q.=";UPDATE item.dt SET files='".json_encode($requestBody->files,JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE)."' WHERE id=@id";
    //   unset($requestBody->files);
    // }
    if (isset($requestBody->schema)) {
      $q.=";SELECT @classID=id FROM item.class WHERE name='$requestBody->schema';UPDATE item.dt SET ClassID=@ClassID WHERE ID=@id";
      unset($requestBody->schema);
    }
    foreach($requestBody as $attributeName => $value) {
      if (is_array($value)) {
        $value = (object)$value;
      } else if (!is_object($value)) {
        $value = (object)['Value' => is_object($value) ? json_encode($value,JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) : $value];
      }
      if (isset($this->schema->properties->{$attributeName}) && !empty($this->schema->properties->{$attributeName}->schema)) {
        $value->schema = $this->schema->properties->{$attributeName}->schema;
      }
      $value->AttributeName = $attributeName;
      // $value->LastModifiedDateTime = $this->LastModifiedDateTime;
      // debug($value);
      // debug($value);
      $q.="\n;EXEC item.attr @HostID=@ClientId, @ItemID=@id, ".implode(',',array_map(
        function($key,$val) {
          return "@$key='".str_replace("'","''",is_object($val) || is_array($val) ? json_encode($val,JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) : $val)."'";
        },
        array_keys((array)$value),
        array_values((array)$value)
      ));
    }
    $q .= "
    ;SET NOCOUNT OFF
    SELECT ID,@LastModifiedDateTime AS LastModifiedDateTime FROM item.vw WHERE ID=@id
    ";
    // echo $q;
    // debug(1);

    $item = sqlsrv_fetch_object(aim()->query($q));
    // return $item;
    $this->LastModifiedDateTime = $item->LastModifiedDateTime;
    // if ($asRow) {
    //   return $item;
    // }
    $this->reindex($this->id = $item->ID);
    $item = (object)[];
    $this->sql = "SELECT UID,ID AS _ID,[schema],'$this->LastModifiedDateTime' AS LastModifiedDateTime
    FROM item.vw
    WHERE ID=$this->id;
    SELECT $this->ATTRIBUTE_PROPERTIES
    FROM attribute.vw AS A
    WHERE ItemID=$this->id
    AND HostID=item.getId('$this->client_id')
    AND LastModifiedDateTime >= '$this->LastModifiedDateTime'";
    // debug($this->sql);

    // $res = aim()->query(";SELECT AttributeName,Value FROM attribute.dv WHERE ItemID=$this->id AND LastModifiedDateTime = '$this->LastModifiedDateTime'");
    // while ($row = sqlsrv_fetch_object($res)) {
    //   $item->{$row->AttributeName} = $row->Value;
    // }
    return $this->build_response();
    // die();
    // return $item;
    //
    // die($q);
    //
    // // debug ($item);
    // // die($q);
    //
    // // return $item;
    //
    //
    // // die(str_replace(';',"\n;",$q));
    // // debug('PATCH',str_replace("\n","",$q));
    //
    // // return $requestBody;
    //
    //
    // return sqlsrv_fetch_object(aim()->query($q));
    //
    // return $q;
    // // if ($input->masterID || $input->finishDT) $q.="
    // // 	DECLARE @T TABLE (id INT,cnt INT,finishDT DATETIME)
    // // 	INSERT @T
    // // 	SELECT M.id,C.cnt,C.finishDT
    // // 	FROM om.itemMasters(@id)M
    // // 	LEFT OUTER JOIN (
    // // 		SELECT masterID,SUM(CASE WHEN finishDT IS NULL THEN 1 ELSE 0 END)cnt,MAX(finishDT)finishDT FROM item.vw GROUP BY masterID
    // // 	)C ON C.masterID=M.id
    // // 	UPDATE item.dt SET finishDT=T.finishDT FROM @T T WHERE item.dt.id=T.id AND cnt=0
    // // 	UPDATE item.dt SET activeCnt=cnt,finishDT=NULL FROM @T T WHERE item.dt.id=T.id AND cnt>0
    // // ";
    // $q .= "
    // SET NOCOUNT OFF
    // SELECT id,[schema],idx,keyname,keyID,name,title,masterID,srcID,hostID,detailID FROM item.vw WHERE id=$id
    // ";
    // //die('<plaintext>'.$q);
    //
    // //die($q);
    //
    //
    // $item = sqlsrv_fetch_object($res = aim()->query($q));
    // if(!$item && sqlsrv_next_result($res)) $item = sqlsrv_fetch_object($res);
    // if(isset($param["reindex"]) && $item->id) item::reindex($item->id);
    // if ($param["select"] == '*'){
    //   $res = aim()->query("SELECT name,value FROM item.attributelist WHERE id=$item->id");
    //   while($row = sqlsrv_fetch_object($res))$item->values->{$row->name}->value=$row->value;
    // }
    //
    // //die(json_encode($req));
    // return ["status" => 200, "body" => $item];
    // //
    // // http_response_code(202); // Accepted
    // // die(json_encode($item));

  }
 	public function delete () {
    if (empty($this->requestBody = json_decode(file_get_contents('php://input')))) {
      aim()->query($q="UPDATE item.dt SET DeletedDateTime=GETDATE() WHERE ID=$this->id;DELETE attribute.dt WHERE linkID=$this->id;");
    } else {
      $q='';
      foreach($this->requestBody as $attributeName => $value) {
        if (empty($value)) $q.="DELETE attribute.dv WHERE ItemID=$this->id AND name='$attributeName';";
        else if ($value->LinkID) $q.="DELETE attribute.dt WHERE ItemID=$this->id AND nameID IN (SELECT id FROM attribute.name WHERE name='$attributeName') AND LinkID='$value->LinkID'";
      }
      aim()->query($q);
      // return $q;
    }
 		return;
 	}
  public function reindex ($id) {
		// if (!$this->id && !empty($_GET['scan'])) {
		// 	$row = fetch_object($res=aim()->query($q="SELECT TOP 1 id FROM api.items WHERE id>10000 AND indexDT IS NULL ORDER BY id DESC"));
		// 	if(!$row->id)die();
		// 	item::reindex($row->id);
		// 	header("Refresh:1");
		// 	die($row->id);
		// }
		// if (!$this->id && $_GET[schemaName]) {
		// 	$aim=(object)$_GET;
		// 	$res=aim()->query($q="SELECT TOP 50 id,title,indexDT FROM api.citems WHERE hostID=$aim->hostID AND class='$aim->schemaName' AND indexDT IS NULL ORDER BY indexDT");
		// 	//die($q);
		// 	//$log=array();
		// 	while($row=fetch_object($res)) {
		// 		$log[$row->id]=$row;
		// 		item::reindex($row->id);
		// 	}
		// 	die(json_encode(array_values($log)));
		// }

		$q = "SELECT Tag,[schema],Keyname,Name,Title FROM item.vw WHERE id=$id
    SELECT AttributeName,Value FROM attribute.vw WHERE HostID=item.getId('$this->client_id') AND ItemID=$id";
		if (empty($item = sqlsrv_fetch_object($res = aim()->query($q)))) return;
    // debug($item);
		$allwords = implode(' ',array_values((array)$item));
		if (sqlsrv_next_result($res)) {
      while ($row = sqlsrv_fetch_object($res)) {
        $item->{$row->AttributeName} = $row->Value;
        $allwords .= ' '.strip_tags(preg_replace('/>/','> ',$row->Value));
      }
    }
    $q=[];
    $schemaname = $item->schema;
    $schema = aim()->api->components->schemas->{$item->schema};
    if (!empty($schema->header)) {
      $headers = $schema->header;
      $headerValues = [[],[],[]];
      $headerNames = ['Title','Subject','Summary'];
      foreach ($headers as $i => $attributeNames) {
        foreach ($attributeNames as $attributeName) {
          if (!empty($item->$attributeName)) {
            $headerValues[$i][] = strip_tags($item->$attributeName);
          }
        }
        $value = $headerValues[$i] = trim(substr(implode(' ',$headerValues[$i]),0,500));
        $key = $headerNames[$i];
        // if ($key === 'Subject') debug($attributeNames,empty($item->$key),$item->$key,empty($value),$value);
        $oldvalue = !empty($item->$key) ? $item->$key : '';
        // if (empty($item->$key) && empty($value)) continue;
        if ($oldvalue == $value) continue;
        // debug($oldvalue,$value);
        $q[]="EXEC item.attr @HostID='$this->client_id',@ItemID=$id,@Name='$key',@Value='".str_replace("'","''",$value)."'";
      }
    }
    if ($q) aim()->query($q=implode(";\n",$q));
    // debug($q);
    //
    //
    // aim()->query("UPDATE item.dt SET ".implode(
    //   ',',
    //   array_map(
    //     function($key,$val) {
    //       return "[$key]='".str_replace("'","''",is_object($val) || is_array($val) ? json_encode($val) : $val)."'";
    //     },
    //     ['Title','Subject','Summary'],
    //     $headerValues
    //   )
    // )." WHERE ID=$id");

		$allwords = array_values(
      array_filter(
        array_unique(
          preg_split(
            '/ /',
            preg_replace(
              '/\[|\]|\(|\)|\+|\-|:|;|\.|,|\'|~|\/|_|=|\?|#|>/',
              ' ',
              strtolower(
                mb_convert_encoding(
                  $allwords,
                  'HTML-ENTITIES',
                  'UTF-8'
                )
              )
            ),
            -1,
            PREG_SPLIT_DELIM_CAPTURE | PREG_SPLIT_NO_EMPTY
          )
        ),
        function($word){
          return !is_numeric($word) && strlen(trim($word))>2 && !in_array($word,['de','het','een','op','in','van','voor','bij','dit','dat','https','html','geen']);
        }
      )
    );
    $q="
    DECLARE @W TABLE (word VARCHAR(500))
    DELETE item.word WHERE itemID=$id
    INSERT @W VALUES('".implode("'),('",$allwords)."')
    INSERT word.dt (word) SELECT word FROM @w WHERE word NOT IN (SELECT word FROM word.dt)
    INSERT item.word (ItemID,WordID) SELECT $id,W.id FROM @W T INNER JOIN word.dt W ON W.word=T.word
    UPDATE item.dt SET LastIndexDateTime=GETDATE() WHERE ID=$id
    SELECT W.AttributeName,W.Value FROM item.word IW
    INNER JOIN word.dt W ON W.ID = IW.WordID AND IW.ItemID=$id AND W.AttributeName IS NOT NULL
    ";
    // die($q);
    $res = aim()->query($q);
    if (!$res) die($q);
    $filterfields = (object)array();
    foreach ($schema->properties as $AttributeName => $property) {
      if (!empty($property->filter) && !empty($item->$AttributeName)) {
        $filterfields->{$AttributeName} = $item->$AttributeName;
      }
    }
    while ($row = sqlsrv_fetch_object($res)) {
      $filterfields->{$row->AttributeName} = $row->Value;
    }
    if (!empty($filterfields)) aim()->query($q="UPDATE item.dt SET filterfields='".str_replace("'","''",json_encode($filterfields))."' WHERE ID=$id;");
    // debug($q);

		//foreach ($wordcnt as $word=>$cnt)$q.=";EXEC api.addItemWord '".toUtf8(dbvalue($word))."',$id,$cnt";
	}
}

class prompt {
  public function __construct () {
    $this->messages = [];
    $this->chapters = [];
    $this->account = new account($aim->access);
	}
  public function send() {
    if (!empty($this->chapters)) {
      $this->add_message("prompt-mail-send");
      aim()->mail([
        // 'Subject'=> $this->subject,
        'to'=> $this->account->preferred_username,
        'bcc'=> 'max.van.kampen@alicon.nl',
        'chapters'=> $this->chapters
      ]);
    } else {
      $this->add_message("prompt-mail-not-send");
    }
    $_POST['msg'] = $this->messages;
    return $_POST;
  }
  public function add_message($message, $args = []) {
    $this->messages[] = $message_title = vsprintf(__($message.'-title'), $args);
    if (isset(AIM_TRANSLATE[$message.'-description'])) {
      $this->chapters[] = [
        'title'=> $message_title,
        'content'=> vsprintf(AIM_TRANSLATE[$message.'-description'], $args),
      ];
    }
  }

  public function share_item() {
    $aim = aim();
    $user = $this->account;
    $account = $this->account = new account($_POST);
    $tag = get('tag');
    preg_match('/(\w+)\((\d+)\)/', $tag, $match);
    $schema_name = strtolower($match[1]);
    $itemId = $match[2];

    if (!$account->accountId) {
      $account->create_account($_POST);
      $this->add_message("prompt-account-created", [
        $account->client_name,
        $user->name,
      ]);
    } else {
      $this->add_message("prompt-account-exists", [
        $account->client_name,
        $user->name,
      ]);
    }

    $accountname = get('accountname');
    if (!$account->contactId) {
      $this->add_message('prompt-contact-created', [
        $account->client_name,
        $user->name,
      ]);
      sqlsrv_fetch_object(aim()->query("SET NOCOUNT ON;".
      $q="INSERT INTO item.dt (hostID,classID,title) VALUES ($account->clientId,1004,'$accountname')
      DECLARE @id INT
      SET @id=scope_identity()
      EXEC item.attr @itemId=@id, @nameID=30, @value='$accountname'
      EXEC item.attr @itemId=@id, @name='Src', @LinkID=$account->accountId, @HostID=$account->clientId
      "));
      $account->get_account();
    } else {
      $this->add_message("prompt-contact-exists", [
        $account->client_name,
        $user->name,
      ]);
    }

    // $scope_granted = explode(' ',get('scope_granted'));
    $scope_granted = explode(' ',$schema_name.".".(get('readonly') ? 'read' : 'readwrite'));
    $account_scope_granted = explode(' ',$account->scope_granted);
    $scope_granted = implode(' ', array_filter(array_unique(array_merge($account_scope_granted, $scope_granted))));
    // debug($scope_granted, $account->scope_granted);
    $attr = [
      $account->client_name,
      $user->name,
      implode('</li><li>',explode(' ',$scope_granted)),
    ];

    if ($account->scope_granted !== $scope_granted) {
      $account->scope_granted = $scope_granted;
      $this->add_message("prompt-scope_granted-changed", $attr);
    } else {
      $this->add_message("prompt-scope_granted-exists", $attr);
    }

    $scope_requested = get('scope_requested');
    $attr = [
      $account->client_name,
      $user->name,
      implode('</li><li>',explode(' ',$scope_requested)),
    ];
    if ($account->scope_requested !== $scope_requested) {
      $account->scope_requested = $scope_requested;
      $this->add_message("prompt-scope_requested-changed", $attr);
    } else {
      $this->add_message("prompt-scope_requested-exists", $attr);
    }

    $attr = sqlsrv_fetch_object($aim->query("SELECT * FROM attribute.vw WHERE hostId=$account->clientId AND itemID=$account->accountId AND attributeName='child' AND linkId=$itemId"));
    if (empty($attr)) {
      $aim->setAttribute([
        'hostId'=>$account->clientId,
        'itemId'=>$account->accountId,
        'linkId'=>$itemId,
        'name'=>'child',
        'max'=>9999,
      ]);
      $this->add_message("prompt-share_item-done", [
        $account->client_name,
        $user->name,
        $tag,
      ]);
    } else {
      $this->add_message("prompt-share_item-exists", [
        $account->client_name,
        $user->name,
        $tag,
      ]);
    }
    return $this->send();
	}
  public function account_delete() {
    $aim = aim();
    $account = new account($aim->access);
    if ($_POST['code']) {
      if ($account->code_ok) {
        $this->add_message("prompt-account_delete-done");
      }
    }
    if ($account->password_ok) {
      $account->set_code($code = rand(10000,99999));
      aim()->sms('+'.$account->phone_number, __('sms_code_content', $code), __('sms_code_subject'));
      return 'code_send';
    }
    return $this->send();
	}
  public function account_delete_domain() {
    $messages = [];
    $chapters = [];
    $aim = aim();
    $account = new account($aim->access);
    if ($_POST['code']) {
      if ($account->code_ok) {
        $this->add_message("prompt-account_delete_domain-done");
      }
    }
    if ($account->password_ok) {
      $account->set_code($code = rand(10000,99999));
      aim()->sms('+'.$account->phone_number, __('sms_code_content', $code), __('sms_code_subject'));
      return 'code_send';
    }
    return $this->send();
	}
  public function account_overview() {
    $res = aim()->query("exec account.overview %d", aim()->access['sub']);
    $items = (object)[];
    while($row = sqlsrv_fetch_object($res)) $items->{$row->ID} = $row;
    sqlsrv_next_result($res);
    while($row = sqlsrv_fetch_object($res)) {
      $items->{$row->ItemID}->{$row->AttributeName} = $items->{$row->ItemID}->{$row->AttributeName} ? (is_array($items->{$row->ItemID}->{$row->AttributeName}) ? $items->{$row->ItemID}->{$row->AttributeName} : [ ['Value' => $items->{$row->ItemID}->{$row->AttributeName}] ]) : [];
      $items->{$row->ItemID}->{$row->AttributeName}[] = $row;
    }
    return $items->{aim()->access['sub']};
	}
}
class account {
  private $data;
  public function __construct ($options = []) {
    $this->get_account($options);
    // $this->data = $options;
    // // debug($this->access);
    // // $this->sub = $this->access['sub'];
    //
    // $this->scope = $this->access['scope'];//explode(' ',$this->access['scope']);
    // // $this->hostname = aim()->hostname;
    // $this->client_secret = aim()->client_secret;
    // $this->messages = [];
    // $this->chapters = [];
    //
    // // $this->data = [
    // //   'client_name'=> aim()->hostname,
    // // ];
    // // $this->access = aim()->access;
    // // $this->data = aim()->access;
    // // $this->data['client_name'] = aim()->hostname;
    // $this->get_account($options);
  }
  public function __set($property, $value) {
    if (property_exists($this->data, $property)) {
      aim()->setAttribute([
        'itemId'=>$this->accountId,
        'hostId'=>$this->clientId,
        'name'=>$property,
        'value'=>$value,
        'LastModifiedById'=>aim()->access['sub'],
      ]);
      $this->get_account();
    }
  }
  public function __get($property){
    // return $this->data;
    return property_exists($this->data, $property) ? $this->data->{$property} : $this->{$property};
  }

  public function set_nonce() {
    if (!get('nonce')) {
      start_session();
      $row = sqlsrv_fetch_object(aim()->query("SELECT newid() AS nonce"));
      setcookie('nonce', $_COOKIE['nonce'] = $row->nonce, [
        'path'=> '/',
        'domain'=> 'login.aliconnect.nl',
        'secure'=> true,
        'httponly'=> false,
        'samesite'=> 'Lax',
        'expires'=> time()+COOKIE_LIFETIME,
      ]);
    }
    // $this->set('nonce', get('nonce'), ['hostId' => 1]);
    // $this->nonce = get('nonce');
    return $this;
  }
  public function get_id_token() {
    return jwt_encode(array_filter([
			'iss' => $_SERVER['SERVER_NAME'],//'login.aliconnect.nl',//aim::$access[iss],//'https://aliconnect.nl', //  Issuer, 'https://aliconnect.nl'
			'sub' => $this->get('account_id'), // Subject, id of user or device
			// 'scrt'=> aim()->secret['config']['aim']['client_secret'],
			// 'azp' => 3666126,//self::$config->clientid, // From config.json
			'client_id'=> $this->get('client_id'),
			'nonce' => get('nonce'), // Value used to associate a Client session with an ID Token, must be verified

			'email' => $this->get('email'),
			'email_verified' => $this->get('email_verified'),
			'phone_number_verified' => $this->get('phone_number_verified'),
			'phone_number' => $this->get('phone_number'),
			'preferred_username' => $this->get('preferred_username'), // Shorthand name by which the End-User wishes to be referred to
			'name' => $this->get('name'), // Fullname
			'nickname' => $this->get('nickname'), // Casual name
			'given_name' => $this->get('given_name'), // Given name(s) or first name(s)
			'middle_name' => $this->get('middle_name'), // Middle name(s)
			'family_name' => $this->get('family_name'), // Surname(s) or last name(s)
			'unique_name' => $this->get('unique_name'), // Not part of JWT

			'auth_time' => time(), // Time when the authentication occurred
			'iat' => time(), // Issued At
			'exp' => time() + 3600,//$response['expires_in'], // Expiration Time
			// 'name' => $account->name ?: $account->AccountName ?: trim($account->given_name . ' ' . $account->family_name) ?: $account->preferred_username ?: $account->unique_name,
		]), $this->client_secret);
  }
  public function get_account($options = []) {
    $options = $this->data = array_merge((array)$this->data, (array)$options);
    $account = $this->data = sqlsrv_fetch_object(aim()->query(
      "EXEC [account].[get]
      @hostname=%s,
      @accountname=%s,
      @phone_number=%s,
      @password=%s,
      @ip=%s,
      @code=%s,
      @redirect_uri=%s,
      @nonce=%s",
      get('client_id', $options) ?: get('aud', $options) ?: get('client_name', $options) ?: aim()->hostname,
      get('sub', $options) ?: get('accountname', $options),
      phone_number(get('phone_number', $options)),
      get('password', $options),
      get('ip', $options),
      get('code', $options),
      get('redirect_uri', $options),
      get('nonce', $options)
		));
    $account->scope = trim("$account->scope_granted $account->scope_accepted");
    // $account->in_scope = empty(array_diff(explode(' ', $this->scope), explode(" ", "$account->scope_granted $account->scope_requested"));
    return $this;
  }
  public function create_account($options = []) {
    $accountname = get('accountname', $options);
    $name = get('name', $options) ?: str_replace(['.','-','_'],' ',strtok($accountname, '@'));
    $names = explode(' ',$name);
    $family_name = ucfirst(array_pop($names));
    $given_name = ucfirst(array_shift($names));
    $middle_name = implode(' ',$names);

    $account = sqlsrv_fetch_object(aim()->query("EXEC account.get @accountname='$accountname'"));
    if ($account && $account->accountId) {
      $this->messages[] = 'Account aanwezig';
    }
    else {
      $this->messages[] = 'Account aangemaakt';
      $this->chapters[] = [
        'title'=> 'Aliconnect account aangemaakt',
  			'content'=> "
        Er is voor U een account aangemaakt op https://aliconnect.nl waarmee u al uw persoonlijke gegevens beheerd.
        ",
      ];
      sqlsrv_fetch_object(aim()->query("SET NOCOUNT ON;".
        "INSERT INTO item.dt (hostID,classID,title) VALUES (1,1004,'$accountname')
  			DECLARE @id INT
  			SET @id=scope_identity()
        EXEC item.attr @itemId=@id, @name='accountname', @value='$accountname'
        EXEC item.attr @itemId=@id, @name='email', @value='$accountname'
  			EXEC item.attr @itemId=@id, @name='preferred_username', @value='$accountname'
  			EXEC item.attr @itemId=@id, @name='name', @value='$name'
  			EXEC item.attr @itemId=@id, @name='unique_name', @value='$accountname'
  			EXEC item.attr @itemId=@id, @name='family_name', @value='$family_name'
  			EXEC item.attr @itemId=@id, @name='given_name', @value='$given_name'
        EXEC item.attr @itemId=@id, @name='nickname', @value='$given_name'
  			EXEC item.attr @itemId=@id, @name='middle_name', @value='$middle_name'
  			"
  		));
    }
    $this->get_account();
    return $this;
  }
  public function account_domain($options = []) {
    $domain_name = $_POST['domain_name'];
    $sub = aim()->access['sub'];
    if ($sub) {
      $account = sqlsrv_fetch_object(aim()->query("EXEC account.get @hostname='$domain_name'"));
      if ($account) {
        return [
          'msg'=> 'domain not available',
        ];
      }
      if (!file_exists($root = $_SERVER['DOCUMENT_ROOT']."/sites/$domain_name")) {
        mkdir($root, 0777, true);
      }
      // if (!file_exists($fname = $root."/config.yaml")) {
        $config = yaml_parse_file($_SERVER['DOCUMENT_ROOT']."/sites/aliconnect/config.local.yaml");
        $config['client'] = [
          'servers'=> [
            [
              'url'=> "https://$domain_name.aliconnect.nl/api"
            ]
          ]
        ];
        yaml_emit_file($root."/config.yaml", $config);
			// }
      // return;

      aim()->query(
        "INSERT INTO item.dt (hostId) VALUES(1)
        DECLARE @id INT
        SET @id=scope_identity()
        EXEC item.attr @itemId=@id, @name='Class', @linkId=1002
        EXEC item.attr @itemId=@id, @name='user', @linkId=$sub
        EXEC item.attr @itemId=@id, @name='keyname', @value='$domain_name'
        EXEC item.attr @itemId=@id, @name='redirect_uri', @value = 'https://$domain_name.aliconnect.nl/'
        EXEC item.attr @itemId=@id, @name='redirect_uri', @value = 'https://$domain_name.aliconnect.nl'
        INSERT INTO item.dt (hostId) VALUES (@id)
        SET @id=scope_identity()
        EXEC item.attr @itemId=@id, @name='Class', @linkId=1004
        EXEC item.attr @itemId=@id, @name='Src', @linkId=$sub
        "
      );
      return [
        'url'=> "https://$domain_name.aliconnect.nl",
        'domain_name'=> $domain_name,
      ];
    }
    // return $sub;
    // debug(aim()->access);
    return [
      'msg'=> 'not logged in',
    ];
  }

  public function get($selector) {
    if (isset($this->data->$selector)) {
      return $this->data->$selector;
    }
  }
  public function set($selector, $context = '', $options = []) {
    aim()->setAttribute(array_replace([
      'itemId'=>$this->get('accountId'),
      // 'hostId'=>1,
      'name'=>$selector,
      'value'=>$context
    ], $options));
    // $this->data->$selector = $context;
    $this->get_account();
    return $this;
  }
  public function add_nonce() {
    $this->set_nonce();
    aim()->setAttribute([
      'hostId'=>1,
      'itemId'=>$this->accountId,
      'userId'=>$this->accountId,
      'name'=>'nonce',
      'value'=>get('nonce'),
      'max'=>9999,
    ]);
    aim()->setAttribute([
      'hostId'=>1,
      'itemId'=>$this->accountId,
      'name'=>'ip',
      'value'=>get('ip'),
      'max'=>9999,
    ]);
    $this->get_account();
    return $this;
  }
  public function set_password($context) {
    $this->set('password', $context, ['encrypt' => 1]);
  }
	public function delete() {
    $client_id = $this->access['client_id'];
    $aud = $this->access['aud'];
    $sub = $this->access['sub'];
    $scope = $this->scope;
    $nonce = $this->nonce;
    $password = $_POST['password'];
    $account = sqlsrv_fetch_object(aim()->query("EXEC account.get @hostname='$client_id', @accountname='$sub', @password='$password'"));
    // debug($sub,$_POST,$account);
    if (!$account->accountId) {
      return [
        'msg'=> "account not available",
        'url'=> 'https://aliconnect.nl',
      ];
      // return "account not available";
    }
    if (!$account->password_ok) {
      return [
        'msg'=> "wrong password",
        // 'url'=> 'https://aliconnect.nl',
      ];
    }
    aim()->query("DELETE item.dt WHERE id = $account->accountId");
    return [
      'msg'=> "delete $account->accountId done",
      'url'=> 'https://aliconnect.nl',
    ];
    // return "delete $account->accountId done";
	}
  public function post() {
		debug(12);
	}
	public function password() {
		debug(331);
	}
	public function phone() {
		debug(331);
	}
	public function email() {
		debug(331);
	}
	// public function get() {
	// 	debug(13);
	// }
}
class message {
	public static function check() {
		return ['messages'=>[]];
	}
}
class aim {
	private $db;
	private $dbconn;

  private function json_build ($object) {
		if (is_object($object)) foreach ($object as $propertyName => $value) {
			if (is_object($value) && property_exists($value,'$ref')) {
				$path = explode('/',$value->{'$ref'});
				$ref = $this->api;
				array_shift($path);
				foreach ($path as $subname) $ref = property_exists($ref,$subname) ? $ref->$subname : $value;
				$object->$propertyName = $ref;
			}
			else $this->json_build($value);
		}
		return $object;
	}
  private function get_secret () {
		$this->hostroot = $this->root = '/sites/'.$this->hostname;
		if (isset($_GET['base_path'])) {
			// echo $this->root;
			$basePath = $_GET['base_path'];
			// debug($this->root);
		} else {
			$request_url = parse_url($_SERVER['REQUEST_URI']);
			$basePath = '';
			// $path = '/';
			foreach (['/v','/api','/docs','/id','/webroot','/om','?'] as $key) {
				$arr = explode($key, $request_url['path']);
				if (!empty($arr[1])) {
					$basePath = $arr[0];
					// $path = rtrim($arr[1],'/');
					break;
				}
			}
		}
		// debug($this->root, $basePath);

		define('AIM_BASEPATH', $basePath);
		$this->root .= $basePath;



		// $this->root = '/sites/'.$this->hostname;
    if (file_exists($_SERVER['DOCUMENT_ROOT'].$this->root.'/webroot')) {
      $this->root = $this->root.'/webroot';
    }
		$this->secret = [];
		$root_array = explode('/', $this->root);
		$this->paths = [];
		while (!empty($root_array)) {
			$this->paths[] = implode('/', $root_array);
			array_pop($root_array);
		}
		$this->paths[] = '/..';
		$this->paths = array_reverse($this->paths);
		foreach ($this->paths as $path) {
			if (is_file($secretfile = $_SERVER['DOCUMENT_ROOT'].$path.'/secret.json')) {
				$this->secret = array_replace_recursive($this->secret, json_decode(file_get_contents($secretfile), true));
			}
		}
		if (isset($this->secret['config']['aim']['client_secret'])) {
			$this->client_secret = $this->secret['config']['aim']['client_secret'];
		}
	}
  private function get_authorization () {
		$this->headers = array_change_key_case(getallheaders(), CASE_LOWER);
		$cookie = [];
		if (!empty($this->headers['cookie'])) {
			parse_str(str_replace('; ','&',$this->headers['cookie']), $cookie);
		}
		define('AIM_KEYS', $keys = array_change_key_case(array_replace($this->headers, $_GET), CASE_LOWER) );
		if (!empty($keys['authorization'])) {
			$keys['access_token'] = trim(strstr($keys['authorization'], ' '));
			// debug($this->access);
		}
		foreach (['access_token', 'x-api-key', 'api-key', 'api_key', 'apikey'] as $key) {
			if (!empty($keys[$key])) {
				$token = $keys[$key];
			}
		}
		if (!empty($token)) {
			$token_arr = explode('.', $token);
			$this->payload = $payload = get_token($token, $this->client_secret);
		}
    else {
			$payload = [
				'iss'=> $_SERVER['SERVER_NAME'],
			];
		}
		$this->access = $payload;
		if (isset($this->access['sub'])) {
			$sub = $this->access['sub'];
		}
    else if (isset($_GET['sub'])) {
			$sub = $_GET['sub'];
		}
		if (isset($sub)) {
			// debug(1);
      $this->root .= '/config/'.$sub;
			$this->paths[] = $this->root;
		}

		if (file_exists(($aim_root = $_SERVER['DOCUMENT_ROOT'].'/sites/'.AIM_DOMAIN).'/secret.json')) {
			define('AIM_ROOT', $aim_root );
		}
    else {
			$this->account = sqlsrv_fetch_object($this->query(
				'EXEC account.get @hostName=%1$s,@accountName=%2$s,@method=%3$s,@url=%4$s',
				AIM_DOMAIN,
				$sub = isset($payload['sub']) ? $payload['sub'] : '',
				$_SERVER['REQUEST_METHOD'],
				$_SERVER['REQUEST_URI']
			));
      // debug(AIM_DOMAIN, $this->account);
			if (!file_exists($aim_root)) {
				if (!isset($this->account->client_id)) {
					// die($aim_root);
          header('Location: https://aliconnect.nl?prompt=account_domain&domain=' . $_SERVER['HTTP_HOST']);
          die();
          die(http_response_code(401));
          debug(2,$this->account);
					return aim_log("Unkown client id", 401, $this->account);
				}
				$aim_root = $_SERVER['DOCUMENT_ROOT'].'/sites/'.$this->account->ClientID;
			}
			define('AIM_ROOT', $aim_root );
			if (!is_file(AIM_ROOT.'/secret.json')) {
				file_put_contents(AIM_ROOT.'/secret.json', json_encode([
					'config' => [
						'aim'=> [
							'client_secret'=>$this->account->client_secret,
						],
					],
				], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
			}
		}
		$this->access = $payload;
	}
  private function build_config($paths) {
		$config = [];
		foreach (array_reverse($paths) as $path) {
			$config_json = $path . '/config.json';
			if (is_file($config_json)) {
				$config = array_replace_recursive($config, json_decode(file_get_contents($config_json), true));
			}
		}
		return $config;
	}
  private function initapi ($config = null) {
		if ($config) {
			if (!file_exists($_SERVER['DOCUMENT_ROOT'].$this->root)) {
				mkdir($_SERVER['DOCUMENT_ROOT'].$this->root, 0777, true);
			}
			file_put_contents($_SERVER['DOCUMENT_ROOT'].$this->root.'/config.yaml', $config);
		}
		$this->api = [];
		$last_modified = 0;
		// debug($this->paths);
		$this->paths = array_values(array_unique($this->paths));
		// debug($this->paths);

		$paths = [];
		$last_ft = 0;
		foreach ($this->paths as $path) {
			$path = $_SERVER['DOCUMENT_ROOT'].$path;
			$paths[] = $path;
			$config_json = $path . '/config.json';
			$api_json = $path . '/api.json';
			if (function_exists('yaml_parse')) {
				$config_yaml = $path . '/config.yaml';
				$config_local_yaml = $path . '/config.local.yaml';
				if (is_file($config_local_yaml)) {
					if (!is_file($config_yaml) || filemtime($config_local_yaml) > filemtime($config_yaml)) {
						file_put_contents($config_yaml, file_get_contents($config_local_yaml));
					}
				}
				if (is_file($config_yaml)) {
					if (!is_file($config_json) || filemtime($config_yaml) > filemtime($config_json)) {
						file_put_contents($config_json, json_encode(yaml_parse_file($config_yaml)));
					}
				}
			}


			if (is_file($config_json)) {
				if (!is_file($api_json) || filemtime($config_json) > filemtime($api_json) || $last_ft > filemtime($api_json)) {
					$config = $this->build_config($paths);
          // debug($config);
					$config['updated'] = date('Y-m-d h:i:s');
					file_put_contents($config_json, json_encode($config));
					$this->config_to_api($path, $config);
				}
				$last_ft = filemtime($config_json);
			}
			if (is_file($api_json)) {
				$apifile = $api_json;
			}
    }



		// debug($apifile);
		$this->api = json_decode(file_get_contents($apifile));
		// $this->api->apifile = $apifile;

		// debug($this->api);
		// $this->api = $this->config_to_api($this->api);





		// if (isset($this->access['sub'])) {
		// 	file_put_contents($this->root.'/api.json', json_encode($this->config_to_api($this->api)));
		// 	// $api = $this->config_to_api($this->api);
		// }

		// if (isset($this->access['sub'])) debug($this->paths);
		// debug(1);
		// $data = file_get_contents($this->apifile);
		// $this->api = json_decode($data);
		// $this->api = $config;

	}
  private function openapi_properties($properties) {
    $openapi_property_properties = ['title'=>0,'format'=>0,'multipleOf'=>0,'maximum'=>0,'exclusiveMaximum'=>0,'minimum'=>0,'exclusiveMinimum'=>0,'maxLength'=>0,'minLength'=>0,'pattern'=>0,'maxItems'=>0,'minItems'=>0,'uniqueItems'=>0,'maxProperties'=>0,'minProperties'=>0,'required'=>0,'enum'=>0];
    foreach ($properties as $propertyName => $property) {
      $property = array_intersect_key((array)$property, $openapi_property_properties);
      if (isset($property['enum'])) {
        if (!$property['enum']) unset ($property['enum']);
        else if (!is_array($property['enum'])) $property['enum'] = explode("|",$property['enum']);
        else if (is_assoc($property['enum'])) $property['enum'] = array_keys($property['enum']);
      }
      $properties[$propertyName] = $property ?: (object)[];
    }
    return $properties ?: (object)[];
  }
  private function config_to_api ($root,$api) {
    $openapi_schema_properties = array_flip(['properties']);
		$openapi_properties = ['info'=>null,'externalDocs'=>null,'servers'=>null,'tags'=>null,'paths'=>null,'components'=>null,'security'=>null];
    // $this->url_project = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http").'://'.$_SERVER['SERVER_NAME'];
    $this->url_project = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http").'://'.AIM_DOMAIN.'.'.str_replace(AIM_DOMAIN.'.','',$_SERVER['SERVER_NAME']);
    // debug($this->url_project);
		$api['config']['hostname'] = AIM_DOMAIN;
    $api['config']['aim']['servers'][] = ['url'=> $this->url_project.'/api'];

    $account = sqlsrv_fetch_object($this->query(
      "EXEC account.get @hostName=%s",
      AIM_DOMAIN
    ));
		if (!$account) {
			return;
		}
		// debug($account);
    $api = array_replace_recursive($api, [
      'aud'=> $account->clientId,
      'lastModifiedDateTime'=> date('Y-m-d H:i:s.999'),
      'config'=> [
        'aim'=> [
          'client_id'=> $account->client_id = strtolower($account->client_id),
        ]
      ]
    ]);
		$api['tags'] = [ 'Authentication' => ['name'=> 'Authentication' ], 'Messages' => ['name'=> 'Messages' ], 'Files' => ['name'=> 'Files' ] ];
		$get_parameters = [
			['in'=> 'query', 'name'=> 'top', 'description'=> 'Maximum number of records', 'schema'=> ['type'=> 'integer', 'format'=> 'int64']],
			['in'=> 'query', 'name'=> 'select', 'description'=> 'List of fieldnames', 'schema'=> ['type' => 'string']],
			['in'=> 'query', 'name'=> 'filter', 'description'=> 'Filter', 'schema'=> ['type'=> 'string']],
			['in'=> 'query', 'name'=> 'search', 'description'=> 'Search words seperated with spaces', 'schema'=> ['type'=> 'string']],
			['in'=> 'query', 'name'=> 'order', 'description'=> 'Sort order fieldnames sperated with a comma', 'schema'=> ['type'=> 'string']],
		];
		$response = [
			'200'=> [
				'description'=> 'Successful operation',
				// 'content'=> (object)[]
			],
			'400'=> [
				'description'=> 'Invalid ID supplied',
				// 'content'=> (object)[]
			],
			'404'=> [
				'description'=> 'Attribute not found',
				// 'content'=> (object)[]
			],
			'405'=> [
				'description'=> 'Invalid input',
				// 'content'=> (object)[]
			],
		];
		$api['paths']['/account'] = [
			'post'=> [
				'tags' => [ 'Authentication' ],
				'operationId'=> 'account.post',
				'requestBody'=> [ 'content'=> [ 'application/x-www-form-urlencoded'=> ['schema'=> ['properties' => [
					'emailaddress'=> ['type'=> 'string','description'=> ''],
					'scope'=> ['type'=> 'string','description'=> ''],
				]]]]],
				'responses'=> ['200'=> ['description'=> 'successful operation']],
				'security'=> [['aim_auth'=> ['admin.readwrite']]]
			],
      'patch'=> [
				'tags' => [ 'Authentication' ],
				'operationId'=> 'account.patch',
				'requestBody'=> [
					'content'=> [
						'application/json'=> [
							'schema'=> [
								'properties'=> [
									'emailaddress'=> ['type'=> 'string','description'=> ''],
									'scope'=> ['type'=> 'string','description'=> ''],
								]
							]
						]
					]
				],
				'responses'=> ['200'=> ['description'=> 'successful operation']],
				'security'=> [['aim_auth'=> ['admin.readwrite']]]
			],
      'delete'=> [
				'tags' => [ 'Authentication' ],
				'operationId'=> 'account.delete',
				'responses'=> ['200'=> ['description'=> 'successful operation']],
				'security'=> [['aim_auth'=> ['admin.readwrite']]]
			],
		];
		$api['paths']['/file({id})'] = [
			'patch'=> [
				'tags' => [ 'Files' ],
				'summary'=> 'Updates a file',
				'operationId'=> 'file_patch',
				'parameters'=> $id_parameter = [ ['name'=> 'id','in'=> 'path','description'=> 'ID of file','required'=> true,'schema'=> ['type'=> 'integer','format'=> 'int64']]],
				'responses'=> $response,
        'security'=> [['aim_auth' => ["file.write"]],]
			],
			'delete'=> [
				'tags' => [ 'Files' ],
				'summary'=> 'Deletes a file',
				'operationId'=> 'file_delete',
				'parameters'=> $id_parameter,
				'responses'=> $response,
				'security'=> [['aim_auth' => ["file.write"]],]
			]
		];
		// echo AIM_DOMAIN;
    if (isset($api['components']) && isset($api['components']['schemas'])) {
      foreach ($api['components']['schemas'] as $schemaName => $schema) {
        // debug(1, $schemaName, isset($schema['properties']), empty($schema['properties']));
        // if (!isset($schema['properties'])) continue;
        $path_schemaname = $schemaName;
        $schemaNameLower = strtolower($schemaName);
        $api['tags'][$schemaName] = array_filter([ 'name'=> $schemaName, 'description'=> empty($schema['description']) ? '' : $schema['description'] ]);
        if (!isset($schema['security'])) {
          $schema['security'] = [
            'read' => [
              ['api_key' => ["$schemaNameLower.read"]],
              ['aim_auth' => ["$schemaNameLower.read"]],
            ],
            'write' => [
              ['api_key' => ["$schemaNameLower.readwrite"]],
              ['aim_auth' => ["$schemaNameLower.readwrite"]],
            ],
          ];
        }
        $path = "/$path_schemaname";
        $api['paths'][$path] = isset($api['paths'][$path]) ? $api['paths'][$path] : [
          'get'=> [
            'tags'=> [ $schemaName ],
            'summary'=> 'Get list of '.$schemaName,
            'operationId'=> "item($schemaName).find",
            'parameters'=> $get_parameters,
            'responses'=> $response,
            'security'=> $schema['security']['read'],
          ],
          'post' => [
            'tags'=> [ $schemaName ],
            'summary'=> 'Add a new '.$schemaName,
            'operationId'=> "Item($schemaName).add",
            'requestBody'=> [ 'description'=> "$schemaName object that needs to be added", 'content'=> [ 'application/json'=> [ 'schema'=> [ '$ref'=> '#/components/schemas/'.$schemaName ]]], 'required'=> true ],
            'responses'=> $response,
            'security'=> $schema['security']['write'],
          ]
        ];
        $id_parameter = [
          ['name'=> 'id','in'=> 'path','description'=> "ID of $schemaName",'required'=> true,'schema'=> ['type'=> 'integer','format'=> 'int64']]
        ];
        $path = "/$path_schemaname({id})";
        if (empty($schema['properties'])) {
          $schema['properties'] = (object)[];
        }
        $api['paths'][$path] = isset($api['paths'][$path]) ? $api['paths'][$path] : [
          'get' => [
            'tags' => [ $schemaName ],
            'summary'=> 'Find '.$schemaName.' by ID',
            'description'=> "Returns a single $schemaName object",
            'operationId'=> "Item($schemaName,id).get",
            'parameters'=> $id_parameter,
            'responses'=> $response,
            'security'=> $schema['security']['read'],
          ],
          'post'=> [
            'tags' => [ $schemaName ],
            'summary'=> 'Updates a '.$schemaName.' with form data',
            'operationId'=> "Item($schemaName,id).post",
            'parameters'=> $id_parameter,
            'requestBody'=> [ 'content'=> [ 'application/x-www-form-urlencoded'=> ['schema'=> ['properties' => $this->openapi_properties($schema['properties']) ]]]],
            'responses'=> $response,
            'security'=> $schema['security']['write'],
          ],
          'patch'=> [
            'tags' => [ $schemaName ],
            'summary'=> 'Updates a '.$schemaName,
            'operationId'=> "Item($schemaName,id).patch",
            'parameters'=> $id_parameter,
            'requestBody'=> [
              'description'=> $schemaName.' object that needs to be updated',
              'content'=> [ 'application/json'=> [ 'schema'=> [ '$ref'=> '#/components/schemas/'.$schemaName ]]],
              'required'=> true
            ],
            'responses'=> $response,
            'security'=> $schema['security']['write'],
          ],
          'delete'=> [
            'tags' => [ $schemaName ],
            'summary'=> 'Deletes a '.$schemaName,
            'operationId'=> "Item($schemaName,id).delete",
            'parameters'=> $id_parameter,
            'responses'=> $response,
            'security'=> $schema['security']['write'],
          ],
        ];
        $api['paths']["/$path_schemaname({id})/file"] = [
          // 'get' => [
          // 	'tags' => [ $schemaName ],
          // 	'summary'=> 'Select all attachements',
          // 	'description'=> 'Returns a list of attachements',
          // 	'operationId'=> "Item($schemaName,id).file(get)",
          // 	'parameters'=> $id_parameter,
          // 	'responses'=> $response,
          // 	'security'=> $schema['security']['read'],
          // ],
          'post'=> [
            'tags' => [ $schemaName ],
            'summary'=> "Adds an attachement to a $schemaName object with form data",
            'operationId'=> "Item($schemaName,id).file(post)",
            'parameters'=> $id_parameter,
            'requestBody'=> [ 'content'=> [ 'multipart/form-data'=> [ 'schema'=> [ 'properties'=> [ 'additionalMetadata'=> [ 'type'=> 'string', 'description'=> 'Additional data to pass to server' ], 'file'=> [ 'type'=> 'string', 'description'=> 'file to upload',  'format'=> 'binary' ]]]]]],
            'responses'=> $response,
            'security'=> [['aim_auth' => ["file.write"]],],
          ],
        ];
        $api['paths']["/$path_schemaname({id})/children"] = [
          'get' => [
            'tags' => [ $schemaName ],
            'summary'=> "Get children of $schemaName object by ID",
            'description'=> "Returns all child objects of a $schemaName object",
            'operationId'=> "Item($schemaName,id).children()",
            'parameters'=> $child_parameters = [
              ['in'=> 'path', 'name'=> 'id', 'description'=> 'ItemID','required'=> true,'schema'=> ['type'=> 'integer','format'=> 'int64']],
              ['in'=> 'query', 'name'=> 'top', 'description'=> 'Maximum number of records', 'schema'=> ['type'=> 'integer', 'format'=> 'int64']],
              ['in'=> 'query', 'name'=> 'select', 'description'=> 'List of fieldnames', 'schema'=> ['type' => 'string']],
              ['in'=> 'query', 'name'=> 'filter', 'description'=> 'Filter', 'schema'=> ['type'=> 'string']],
              ['in'=> 'query', 'name'=> 'search', 'description'=> 'Search words seperated with spaces', 'schema'=> ['type'=> 'string']],
              ['in'=> 'query', 'name'=> 'order', 'description'=> 'Sort order fieldnames sperated with a comma', 'schema'=> ['type'=> 'string']],
            ],
            'responses'=> $response,
            'security'=> $schema['security']['read'],
          ],
        ];
        $api['paths']["/$path_schemaname({id})/references"] = [
          'get' => [
            'tags' => [ $schemaName ],
            'summary'=> "Get children of $schemaName object by ID",
            'description'=> "Returns all child objects of a $schemaName object",
            'operationId'=> "Item($schemaName,id).references()",
            'parameters'=> $child_parameters = [
              ['in'=> 'path', 'name'=> 'id', 'description'=> 'ItemID','required'=> true,'schema'=> ['type'=> 'integer','format'=> 'int64']],
              ['in'=> 'query', 'name'=> 'top', 'description'=> 'Maximum number of records', 'schema'=> ['type'=> 'integer', 'format'=> 'int64']],
              ['in'=> 'query', 'name'=> 'select', 'description'=> 'List of fieldnames', 'schema'=> ['type' => 'string']],
              ['in'=> 'query', 'name'=> 'filter', 'description'=> 'Filter', 'schema'=> ['type'=> 'string']],
              ['in'=> 'query', 'name'=> 'search', 'description'=> 'Search words seperated with spaces', 'schema'=> ['type'=> 'string']],
              ['in'=> 'query', 'name'=> 'order', 'description'=> 'Sort order fieldnames sperated with a comma', 'schema'=> ['type'=> 'string']],
            ],
            'responses'=> $response,
            'security'=> $schema['security']['read'],
          ],
        ];
        if (!empty($schema['properties'])) {
          // $api['components']['schemas'][$schemaName]['properties']['Message'] = ['type'=> 'array', 'schema'=> 'Message'];
          foreach ($schema['properties'] as $propertyName => $property ) {
            $property = (array)$property;
            if (!empty($property['type'])
            && !empty($property['schema'])
            && $property['type'] === 'array'
            && isset($api['components']['schemas'][$property['schema']])) {
              $path = "/$path_schemaname({id})/".$propertyName;
              $api['paths'][$path] = [
                'get' => [
                  'tags' => [ $schemaName, $property['schema'] ],
                  'summary'=> "Find $schemaName by ID and selects all of schema ".$property['schema'],
                  'description'=> "Returns a list of $propertyName",
                  'operationId'=> "Item($schemaName,id).link($propertyName,get)",
                  'parameters'=> $child_parameters,
                  'responses'=> $response,
                  'security'=> $schema['security']['read'],
                ],
                'post'=> [
                  'tags' => [ $schemaName ],
                  'summary'=> "Adds an attachement to a $schemaName object with form data",
                  'operationId'=> "Item($schemaName,id).link($propertyName,post)",
                  'parameters'=> $id_parameter,
                  'requestBody'=> [ 'content'=> [ 'multipart/form-data'=> [ 'schema'=> [ 'properties'=> [ 'additionalMetadata'=> [ 'type'=> 'string', 'description'=> 'Additional data to pass to server' ], 'file'=> [ 'type'=> 'string', 'description'=> 'file to upload',  'format'=> 'binary' ]]]]]],
                  'responses'=> $response,
                  'security'=> $schema['security']['write'],
                ],
              ];
              $path = "/$path_schemaname({id})/$propertyName({linkId})";
              $api['paths'][$path] = [
                'delete' => [
                  'tags' => [ $schemaName, $property['schema'] ],
                  'summary'=> "Find $schemaName by ID and selects all of schema ".$property['schema'],
                  'description'=> "Returns a list of $propertyName",
                  'operationId'=> "Item($schemaName,id).link($propertyName,delete)",
                  'parameters'=> [
                    ['in'=> 'path', 'name'=> 'id', 'description'=> 'ItemID','required'=> true,'schema'=> ['type'=> 'integer','format'=> 'int64']],
                    ['in'=> 'path', 'name'=> 'linkId', 'description'=> 'ItemID','required'=> true,'schema'=> ['type'=> 'integer','format'=> 'int64']],
                    ['in'=> 'query', 'name'=> 'top', 'description'=> 'Maximum number of records', 'schema'=> ['type'=> 'integer', 'format'=> 'int64']],
                    ['in'=> 'query', 'name'=> 'select', 'description'=> 'List of fieldnames', 'schema'=> ['type' => 'string']],
                    ['in'=> 'query', 'name'=> 'filter', 'description'=> 'Filter', 'schema'=> ['type'=> 'string']],
                    ['in'=> 'query', 'name'=> 'search', 'description'=> 'Search words seperated with spaces', 'schema'=> ['type'=> 'string']],
                    ['in'=> 'query', 'name'=> 'order', 'description'=> 'Sort order fieldnames sperated with a comma', 'schema'=> ['type'=> 'string']],
                  ],
                  'responses'=> $response,
                  'security'=> $schema['security']['read'],
                ],
              ];
            }
          }
        }
      }
    }
    $api['tags'] = array_values($api['tags']);

		if (!file_exists($root)) {
			mkdir($root, 0777, true);
		}

		file_put_contents($root.'/api.json', json_encode($api, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
		// return $api;
    $api['paths']['/'] = [
			'get'=> [
				'operationId'=> 'def.get',
				'responses'=> [
					'200'=> ['description'=> 'successful operation']
				]
			],
			'post'=> [
				'operationId'=> 'def.post',
				'responses'=> [
					'200'=> ['description'=> 'successful operation']
				],
				'security'=> [['aim_auth'=> ['admin.readwrite']]]
			]
    ];
		$openapi = array_merge(['openapi'=>'3.0.1'],array_intersect_key($api, $openapi_properties));
    $openapi['security'] = [ [ 'api_key' => [] ] ];
		if (isset($api['components']) && isset($api['components']['schemas'])) {
			foreach ($openapi['components']['schemas'] as $schemaName => $schema) {
			$schema = $schema ?: [];
			$openapi['components']['schemas'][$schemaName] = array_intersect_key($schema,$openapi_schema_properties) ?: (object)[];
			if (isset($schema['properties'])) {
        $openapi['components']['schemas'][$schemaName]['properties'] = $this->openapi_properties($schema['properties']);
      }
		}
		}
		file_put_contents($root.'/openapi.json', str_replace('    ','  ',json_encode($openapi, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT)));
		if (function_exists('yaml_emit')) {
			$yaml = yaml_emit($openapi);
			$yaml = str_replace('!php/object "O:8:\"stdClass\":0:{}"','{}',$yaml);
			// $yaml = str_replace('[]','{}',$yaml);
			file_put_contents($root.'/openapi.yaml', $yaml);
		}
  }

  public static function sms ($recipients='', $body='', $originator='') {
    // DEBUG: Voor testen email gebruiken
    // aim()->mail($a = [
    //   'to'=> 'max.van.kampen@alicon.nl',
    //   // 'bcc'=> 'max.van.kampen@alicon.nl',
    //   'chapters'=> [
    //     [ 'title' => $recipients . ' ' . $originator, 'content'=> $body ],
    //   ],
    // ]);
    // return;
    error_log("AIM.sms send $recipients $body $originator");

		// debug(1);

		require_once ($_SERVER['DOCUMENT_ROOT'].'/lib/messagebird/php-rest-api/autoload.php');
		extract((array)aim()->secret['config']['sms']);
    // error_log("AIM.sms send $recipients $body $originator $client_id");

		$messagebird = new MessageBird\Client($client_id);
		$message = new MessageBird\Objects\Message;
		$message->originator = substr($originator ?: $_GET['originator'] ?: $put->originator ?: 'Aliconnect', 0, 11);
		$message->recipients = explode(';',$recipients ?: $_GET['recipients'] ?: $put->recipients);
		$message->body = $body?:$_GET['body'] ?: $put->body;
		$response = $messagebird->messages->create($message);
		return $response;
	}

  public function __construct () {
		$this->globals = $GLOBALS['globals'];
		$this->request_url = parse_url($_SERVER['REQUEST_URI']);
		$this->hostname = $hostname = AIM_DOMAIN;
		$this->get_secret();
		$this->get_authorization();
		$this->initapi();
		define('AIM_API_SUB_ROOT', empty($this->access['sub']) ? '' : AIM_ROOT . '/api/' . $this->access['sub'] );
		define('AIM_API_ROOT', is_dir(AIM_API_SUB_ROOT) ? AIM_API_SUB_ROOT : AIM_ROOT );
   	// return $this;

	}
	public function mail ($param = []) {
    if (!isset($param['send'])) {
      require_once ('mail.php');
      if (!isset($this->mailer)) {
				$this->mailer = new mailer();
			}
      $this->mailer->send($param);
      return $this->mailer;
    } else if ($param['send'] === 1) {
      unset($param['send']);
      aim()->query(
				"INSERT INTO mail.dt (data) VALUES (%s);",
				json_encode($param)
			);
    } else if ($param['send'] === 0) {
    }
	}
	public function query($query) {
		// debug($this->secret);
		if (!isset($this->dbconn)) {
			if ($dbs = $this->secret['config']['dbs']) {
				$this->dbconn = sqlsrv_connect (
					$dbs['server'],
					[
						'Database' => $dbs['database'],
						'UID' => $dbs['user'],
						'PWD' => $dbs['password'],
						'ReturnDatesAsStrings' => true,
						'CharacterSet' => 'UTF-8'
					]
				);
			}
		}
		$args = func_get_args();
		$query = array_shift($args);
		// $GLOBALS['quote'] = strstr($query,"'") ? "" : "'";
		if (!empty($args)) {

      $args = array_map(function($val){
				if (is_null($val)) return 'NULL';
				if (is_numeric($val)) return $val;
        return "'".str_replace("'","''",$val)."'";
				// return $GLOBALS['quote'] . str_replace("'","''",$val) . $GLOBALS['quote'];
			}, $args);
			$query = vsprintf($query, $args);
		}
		error_log($query.PHP_EOL, 3, $_SERVER['DOCUMENT_ROOT'].'/log/sql.log');
		// error_log($query, 3, 'sql.log');
		try {
			$query = (isset($nopre) ? '' : 'SET TEXTSIZE -1;SET NOCOUNT ON;').$query;
			// echo $query.PHP_EOL;
			$res = sqlsrv_query ( $this->dbconn, $query , null, ['Scrollable' => 'buffered']);
			return $res;
		} catch (Exception $e) {
			echo 'Caught exception: ',  $e->getMessage(), "\n";
			die();
		}
	}
	public function api_string() {
		return $this->data;
	}
	public function delete() { }
  public function setAttribute($options) {
    $this->query($q="EXEC item.attr ".implode(',',array_map(function($key,$val){
      if (is_null($val)) {
        $val = 'NULL';
      } else if (!is_numeric($val)) {
        $val = "'".str_replace("'","''",$val)."'";
      }
      return "@$key=$val";
    },array_keys($options),$options)));
    // echo $q;
  }
	public function init() {

    $paths = [
      '/sites/'.AIM_DOMAIN.$_SERVER['REQUEST_URI'],
      '/sites'.$_SERVER['REQUEST_URI'],
      $_SERVER['REQUEST_URI'],
      str_replace('/aliconnect/','/sites/',$_SERVER['REQUEST_URI']),
      '/../node_modules/@aliconnect'.str_replace(['/sites','/aliconnect','/sdk','/v1'],'',$_SERVER['REQUEST_URI']),
    ];
    // debug(1);
    foreach ($paths as $path) {
      foreach (['','.md','Readme.md','Home.md','Index.md','/Readme.md','/Home.md','/Index.md'] as $filename) {
        // echo $_SERVER['DOCUMENT_ROOT'].$path.$filename.PHP_EOL;
        if (is_file($fname = $_SERVER['DOCUMENT_ROOT'].$path.$filename)) {
          $headers = array_change_key_case(getallheaders());
          if (strstr($headers['accept'], 'markdown')) {
            // die($path.$filename);
            // header("Cache-Control: no-store");
            // header("filename: $filename");
            // header("last-modified: ".filemtime($fname) );
            // readfile($fname);
            // die();
            header('Location: '.$path.$filename);
            // echo "# $filename\n";
            // die();
          }
          // die();
          return;
          // die('mjkmjksadf');
          // return this;
        }
      }
    }

    // echo 'ja';



		// debug(1, $this->apifile, $this->data);
		$this->secret = array_replace_recursive($this->secret,json_decode(file_get_contents(AIM_ROOT.'/secret.json'),true)?:[]);

		$this->query(
			"EXEC account.request_add @method=%s,@url=%s,@host=%s",
			$_SERVER['REQUEST_METHOD'],
			$_SERVER['REQUEST_URI'],
			strtok($_SERVER['SERVER_NAME'],'.')
		);

		foreach (['info', 'config', 'web'] as $key) {
			$this->$key = empty($this->api->$key) ? (object)[] : $this->api->$key;
		}
		$this->client_secret = isset($this->secret['config']['aim']['client_secret']) ? $this->secret['config']['aim']['client_secret'] : [];
		// $this->auth = (object)[
		// 	'id_token'=> empty($_COOKIE['id_token']) ? null : $_COOKIE['id_token'],
		// 	'id'=> empty($_COOKIE['id_token']) ? null : get_token($_COOKIE['id_token'], $this->client_secret),
		// ];
		$this->cookie = $_COOKIE;
		$request_url = parse_url($_SERVER['REQUEST_URI']);
		$basePath = AIM_BASEPATH;
		// $path = '/';
		// foreach (['/api','/docs','/id','/webroot','/om','?'] as $key) {
		// 	$arr = explode($key, $request_url['path']);
		// 	if (!empty($arr[1])) {
		// 		$basePath = $arr[0];
		// 		$path = rtrim($arr[1],'/');
		// 		break;
		// 	}
		// }
		// define('AIM_BASEPATH', $basePath);
		// define('AIM_PATH', $path);
		$scope = empty($this->access['scope']) ? [] : explode(' ',$this->access['scope']);
		$scope[] = 'website.read';
		// $scope[] = 'webpage.read';
		// $scope[] = 'contact(265090).name.read';
		$scope[] = 'name email';
		// $this->access['scope'] = empty($this->access['scope']) ? '' : $this->access['scope'];

		$this->access['scope'] = implode(' ',array_unique($scope));

		$this->json_build($this->api);
		/* determine request langage */
		$arr_lang = [];
		/* check for query parameters in REQUEST_URI or HTTP_REFERER */
		if (!empty($_GET['lang'])) {
			$this->lang = explode(',',$_GET['lang'])[0];
		}
		if (empty($this->lang) && !empty($_SERVER['HTTP_REFERER'])) {
			$url = parse_url($_SERVER['HTTP_REFERER']);
			if (!empty($url['query'])){
				parse_str($url['query'],$query);
				if (!empty($query['lang'])) {
					$this->lang = explode(',',$query['lang'])[0];
				}
			}
		}
		if (empty($this->lang) && !empty($_SERVER['HTTP_ACCEPT_LANGUAGE'])) {
			$this->lang = explode('-',explode(',',$_SERVER['HTTP_ACCEPT_LANGUAGE'])[0])[0];
		}
		if (empty($this->lang)) {
			$this->lang='en';
		}
		$translate = [];
		if (function_exists('yaml_parse_file')) {
			if (is_file($fname = __DIR__.'/lang/'.$this->lang.'.yaml')) {
				$translate = yaml_parse_file($fname);
			} else {
				$translate = yaml_parse_file(__DIR__.'/lang/nl.yaml');
				$arr_values = array_chunk(array_values($translate), 100);
				$arr_keys = array_chunk(array_keys($translate), 100);
				$translate = [];
				foreach ($arr_values as $i => $chuck) {
					$chuck = translate([
				    'q' => $chuck,
						'source' => 'nl',
						'target' => $this->lang,
				  ]);
					$translate = array_merge($translate,array_combine($arr_keys[$i],$chuck));
				}
				yaml_emit_file($fname,$translate);
			}
			// debug(1, $this->lang, __DIR__.'/lang/'.$this->lang.'.yaml', $translate);
		}
		define('AIM_TRANSLATE', $translate);
		// $path_array = preg_split('/\//',ltrim(AIM_PATH,'/'));
		// if (method_exists($this, $method_name = $path_array[0])) {
		// 	return $this->$method_name();
		// }

		// debug($this->data);
    // debug(AIM_ROOT);
		if (is_file($fname = AIM_ROOT.'/api.php')) {
			// die('aaa'.AIM_ROOT.$fname);
			require_once ($fname);
		}
		// debug('aaa');
		if (strpos($_SERVER['REQUEST_URI'],'/api') !== false) {
			try {
				// debug(1, AIM_ROOT);
				$response = $this->request_uri();
        http_response_code(200);
        if ($response) {
          header('Content-Type: application/json');
          echo json_encode($response, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        }
        die();
			} catch (Exception $e) {
				// echo 'a';
				// DEBUG: Check for method_exists is required otherwise for some unkown reason throw new Exception is always executed even if the code bock of the throw is not executed????
				error_log(vsprintf("request_error\nurl:%s %s%s\nRemote addr: %s%s\n%s", [
					$_SERVER['REQUEST_METHOD'],
					$_SERVER['HTTP_HOST'],
					str_replace("&","\n&",$_SERVER['REQUEST_URI']),
					$_SERVER['REMOTE_ADDR'],
					isset($_SERVER['HTTP_REFERER']) ? ', referer:' . $_SERVER['HTTP_REFERER'] : '',
					isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : ''
				]));

				if (method_exists('aim', $_SERVER['REQUEST_METHOD'])) {
					// debug(1);
					// http_response_code(404);
					// return;
					// debug(1, $e->getCode());
					die(http_response_code($e->getCode()));
				}
			}
      // debug(!is_null($response));
			// if (!is_null($response)) {
      //   debug(1);
			// 	header('Content-Type: application/json');
			// 	die(json_encode($response, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
			// }
		} else {
			if (isset($_GET['prompt'])) {
				if (is_file($fname = AIM_ROOT.'/'.$_GET['prompt'].'.html')) {
					readfile($fname);
					die();
				}
			}
		}
		return $this;
		// debug(1);
	}
	public function logout() {
		if (isset($_COOKIE['nonce'])) {
			$this->query("UPDATE auth.nonce SET sub=NULL WHERE nonce='$_COOKIE[nonce]'");
		}
		foreach (['id_token', 'access_token', 'refresh_token'] as $key) {
			setcookie($key, $_COOKIE[$key] = null, ['expires' => null, 'path' => '/', 'domain' => 'login.aliconnect.nl', 'secure' => 1, 'httponly' => 1, 'samesite' => 'Lax' ]);
			setcookie($key, null, 0, '/');
		}
		// if ($_SERVER['SERVER_NAME'] !== 'login.aliconnect.nl') {
		// 	// debug(1);
		// 	// die(header('Location: https://login.aliconnect.nl/api/oauth2?prompt=logout'));
		// 	// debug(getallheaders(), $_SERVER);
		//
		// 	die(header('Location: https://login.aliconnect.nl/api/oauth2?prompt=logout&redirect_uri='.urlencode('https://'.$_SERVER['SERVER_NAME']) ));
		// 	// die(header('Location: https://login.aliconnect.nl/?prompt=logout&redirect_uri='.urlencode('https://'.$_SERVER['SERVER_NAME']) ));
		// } else {
		if (!empty($_GET['redirect_uri'])) {
			header('Location: '.$_GET['redirect_uri'] );
		} else {
			header('Location: /' );
		}
			// die();
		// }
	}
	public function httpRequest($req, $res = null) {
		if (is_string($req)) {
			$req = parse_url($req);
		} else if ($req['url']) {
			$req = array_merge($req, parse_url($req['url']));
			unset($req['url']);
		}
		$options = array_replace([
			'protocol' => empty($req['scheme']) ? ($_SERVER['HTTPS'] === 'on' ? 'https:' : 'http:') : $req['scheme'] . ':',
			'host' => $_SERVER['HTTP_HOST'],
			// 'port' => $_SERVER['HTTPS'] === 'on' ? 443 : 80,
			'basePath' => '',
			'path' => $_SERVER['REQUEST_URI'],
			'method' => 'get',
		], $req);
		// debug($options);

		$options = [
			CURLOPT_URL => unparse_url($req = $options),
			CURLOPT_RETURNTRANSFER => true,
			CURLOPT_SSL_VERIFYPEER => false,
			CURLOPT_HTTPHEADER => empty($req['headers']) ? [] : $req['headers'],
			// CURLOPT_HEADERFUNCTION, function ( $curl, $header_line ) {
			// 	$this->headers[] = $header_line;
			// 	return strlen($header_line);
			// },
			// CURLOPT_POST => true,
			// CURLOPT_POSTFIELDS => json_encode($post),//http_build_query($post),
			// CURLOPT_HTTPHEADER => ["Content-Type: application/json"],
		];
		// debug($options);

		switch (strtoupper($req['method'])) {
			case 'GET':
				error_log('Doing GET');
				break;
			case 'POST':
				error_log('Doing POST');
				// Add a Content-Type header (IMPORTANT!) This differs from a normal post. The data is transfered as file!!!
				$options[CURLOPT_HTTPHEADER][] = 'Content-Type: application/json';
				$options[CURLOPT_POST] = true;
				$options[CURLOPT_POSTFIELDS] = $req['input'];
				break;
			case 'PATCH':
				error_log('Doing PATCH');
				$options[CURLOPT_HTTPHEADER][] = 'Content-Type: application/json';
				$options[CURLOPT_CUSTOMREQUEST] = 'PATCH';
				$options[CURLOPT_POSTFIELDS] = $req['input'];
				break;
			case 'DELETE':
				error_log('Doing DELETE');
				$options[CURLOPT_CUSTOMREQUEST] = 'DELETE';
				break;
			default:
				error_log('INVALID METHOD: '.$req['method']);
				exit;
		}

		// if (!empty(AIM::$config->aim->api_key)) {
		// 	$options[CURLOPT_HTTPHEADER][] = 'X-Api-Key: '.AIM::$config->aim->api_key;
		// }
		// if (!empty(AIM::$config->aim->access_token)) {
		// 	$options[CURLOPT_HTTPHEADER][] = 'Authorization: Bearer '.AIM::$config->aim->access_token;
		// }
		if (!empty($req->headers)) {
			foreach ($req->headers as $key => $value) {
				$options[CURLOPT_HTTPHEADER][] = "$key: $value";
			}
		}
		// debug ($req,$options);
		$curl = curl_init();
	  curl_setopt_array($curl, $options);
		// curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
		// curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
		// curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
		// $this->headers = [];
		// curl_setopt($curl, CURLOPT_HEADERFUNCTION, function ( $curl, $header_line ) {
		// 	$this->headers[] = $header_line;
		// 	return strlen($header_line);
		// });
		$response = curl_exec($curl);
		$httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
		//die($this->authTokenUrl);

		// http_response_code($httpCode);
		// $curl_errno = curl_errno($curl);
		// $curl_err = curl_error($curl);
		// if ($curl_errno) {
		// 	error_log("CURL returned an error: ".($msg = $curl_errno . ": " . $curl_err));
		// 	return ['errorNumber' => $curl_errno, 'error' => $msg];
		// }
		curl_close($curl);
		// die($response);
		try {$object = json_decode($response);} catch (Exception $e) {}
		$result = $object ?: $response;
		// debug($result);
		return isset($res) ? $res($result) : $result;
	}
	public function api_property ($object) {
		if (is_object($object)) foreach ($object as $propertyName => $value) {
			if (is_object($value) && property_exists($value,'$ref')) {
				$path = explode("/",$value->{'$ref'});
				$ref = $this->api;
				array_shift($path);
				foreach ($path as $subname) {
					if (!isset($ref->$subname)) break;//throw new Exception("Failed Dependency", 424);
					$ref = $ref->$subname;
				}
				$object->$propertyName = $ref;
			}
			else $this->api_property($value);
		}
		return $object;
	}
	public function html_add_page_header($html, $page) {
		// $head1.="
		// 	<link rel='apple-touch-icon' href='/sites/$aim->host/img/logo/logo-60.png' />
		// 	<link rel='apple-touch-icon' sizes='76x76' href='/sites/$aim->host/img/logo/logo-76.png' />
		// 	<link rel='apple-touch-icon' sizes='120x120' href='/sites/$aim->host/img/logo/logo-120.png' />
		// 	<link rel='apple-touch-icon' sizes='152x152' href='/sites/$aim->host/img/logo/logo-152.png' />
		// 	<link rel='apple-touch-startup-image' href='/sites/$aim->host/img/logo/logo-startup.png' />
		// ";
		//
		// //$qp= $aim->location->folders[1]?"'$aim->root' AND P.keyname='$aim->filename'":"'webpage' AND P.masterID=S.id AND P.idx=0";
		// if(!$page->pageID){
		// 	$page->title='Page not found';
		// 	$page->subject='This page is not available.';
		// }
		// $page->src=json_decode($page->files);
		// $page->src=$page->src[0]->src;
		// $page->mobile=$page->mobile?:preg_match("/(android|webos|avantgo|iphone|ipad|ipod|blackberry|iemobile|bolt|boost|cricket|docomo|fone|hiptop|mini|opera mini|kitkat|mobi|palm|phone|pie|tablet|up\.browser|up\.link|webos|wos)/i", $_SERVER["HTTP_USER_AGENT"]);
		// $pageBase64=base64_encode("site=".json_encode($page));
		$head = isset($page->title) ? strip_tags($page->title)."</title>\r\n\t<meta property='og:title' name='og:title' content='".str_replace("'","",strip_tags($page->title))."' />": "</title>";
		if (isset($page->subject)) $head .= "\r\n\t<meta property='og:description' name='og:description' content='".str_replace("'","",strip_tags($page->subject))."' />";
		if (isset($page->src)) $head .= "\r\n\t<meta property='og:image' name='og:image' content='".str_replace("'","",strip_tags($page->src))."' />\r\n\t<meta property='og:image:width' content='450'>\r\n\t<meta property='og:image:height' content='300'>";
		$head .= "\r\n\t<meta property='fb:app_id' content='487201118155493'>\r\n\t<meta property='og:type' content='website'>\r\n\t<meta property='og:url' content='".str_replace("'","",strip_tags($_SERVER["REQUEST_URI"]))."' />";
		return str_replace("</title>",$head,$html);
	}

  // public function config () {
  //   debug(1);
  //   return 1;
  // }

	public function request ($req = null, $res = null) {
		// $apipos = strpos($_SERVER['REQUEST_URI'], 'api/');
		// $req = $req ?: [
		// 	'method' => $_SERVER['REQUEST_METHOD'],
		// 	'url' => substr($_SERVER['REQUEST_URI'], $apipos != false ? strpos($_SERVER['REQUEST_URI'], 'api/') + 3 : 0  )
		// ];
		// $this->req = $req;

		extract($req);
		$this->method = $method;
		$headers = isset($headers) ? $headers : getallheaders();
		$path = isset($path) ? $path : $url;


		// debug(AIM::$access);
		$arr = explode('?', $path);
		$path = array_shift($arr);
		parse_str(array_shift($arr),$_GET);
		$path = strtr($path,$_GET);
		preg_match_all('/\(([^\)]*)\)/', $path, $pathmatches);
		$pathmatches = $pathmatches[1];
		$pathId = preg_replace('/(\()(.*?)(\))/', '$1$3', $path);
		$this->param = [];
		// debug($this->api['paths']);
		// debug($req, $pathId, $this->api->paths);
		// debug(1,$this->api->paths);
		// if ($_SERVER['REQUEST_URI'] === '/api/token') debug($this->api->info);
		foreach ($this->api->paths as $path_name => $path_def) {
			// debug($path_name, $pathId);
			if (preg_replace('/(\()(.*?)(\))/', '$1$3', $path_name) === $pathId) {
				if (key_exists($method = strtolower($method), $path_def) || key_exists($method = strtoupper($method), $path_def)) {
					$this->method_def = $method_def = $path_def->{$method};
				} else {
					throw new Exception('Method Not Allowed', 405);
				}
				extract((array)$method_def);



				if (isset($security)) {


					// /* CODE VOOR SECURITY CONTACT DATA */
					// $access_scope_array = explode(' ', trim($this->access['scope']));
					// preg_match('/\/(.+)\((.+)\)/', $path, $components);
					// if ($components) {
					// 	$schemaname = $components[1];
					// 	$id = $components[2];
					// 	if ($schemaname === 'Contact') {
					// 		if (!empty($_GET['$select'])) $select = $_GET['$select'];
					// 		if (!empty($_GET['select'])) $select = $_GET['select'];
					// 		$select = explode(',',$select);
					// 		$contact_scope = array_values(array_filter($access_scope_array, function($val){return !strstr($val, '.');}));
					// 		$outside_scope = array_diff($select, $contact_scope);
					// 		if ($outside_scope) throw new Exception('Unauthorized', 401);
					// 		// debug($id,$select,$access_scope_array,$outside_scope,$contact_scope);
					// 	}
					// }

					// debug($security, $access_scope_array, $path, $components);

					if (!hasScope($security, $this->access['scope'])) {
						// throw new Exception('Unauthorized', 401);
					}
				}
				$operationId = $operationId = empty($operationId) ? $path : $operationId;
				$paramlist = [];
				foreach ($pathmatches as $i => $parameter) {
					if (strstr($parameter,'=')) {
						parse_str(str_replace(',','&',$parameter), $parameter);
						$paramlist[] = $parameter;
					} else {
						array_push($paramlist,...explode(',',$parameter));
					}
				}
				$paramByName = [];
				if (!empty($parameters)) {
          foreach ($parameters as $parameter) {
            if ($parameter->in === 'path') {
              $paramByName[$parameter->name] = array_shift($paramlist);
            }
          }
        }

				// debug($operationId);

				if ($operationId) {
					$obj = $this;
					// $arr = explode('/',ltrim($operationId,'/'));
					$arr = explode('.',$operationId);
					foreach ($arr as $functionName) {
						$param = preg_split('/\(|\)|,/',trim($functionName,')'), NULL);
						$functionName = array_shift($param);
						if ($functionName === 'AIM') {
							continue;
						} else if (!empty($param)) {
							foreach($param as $i => $paramName) {
								if (isset($paramByName[$paramName])) {
									$param[$i] = $paramByName[$paramName];
								}
							}
						}
						if (isset($req['body'])) {
							$param[] = $req['body'];
						}


						// debug($req['body']);
						if (method_exists($obj, $functionName)) {
							// debug($operationId);
							$obj = $obj->$functionName(...$param);
						} else if (class_exists($functionName)) {
							$obj = new $functionName(...$param);
						} else {
							// foreach ($_GET as $key => $value) {
							// 	if (method_exists($obj, $functionName = $key . '_' . $value)) {
							// 		return $obj->$functionName(...$param);
							// 	}
							// }
							// debug($functionName);
							// debug(1);
							throw new Exception('Not Implemented', 501);
						}
					}
					// debug(1,$functionName, $obj);
					// debug(1);
					return $obj;
				}
			}
		}
		// debug(111,$pathId,$this->api->paths);
		throw new \Exception('Not found', 404);
	}
	public function request_uri() {
    // debug($pathinfo, $dirname, $pathname);
    // debug(111);


		$REQUEST_METHOD = $_SERVER['REQUEST_METHOD'];
		$path = explode('/',preg_replace('/.*\/api\//','',$this->request_url['path']));
    $path[] = $REQUEST_METHOD;
    $this->require(array_shift($path), array_shift($path) ?: $REQUEST_METHOD, $response);
    if (!is_null($response)) return $response;
		foreach ($_GET AS $key => $value) {
      $this->require($key, $value, $response);
      if (!is_null($response)) return $response;
      // echo $key.'_'.$value.function_exists($functionName = $key.'_'.$value).PHP_EOL;
			if (function_exists($functionName = $key.'_'.$value)) {
				return $functionName();
			}
		}
		$this->request_url['path'] = strstr($this->request_url['path'],'/api/');

    // $url = parse_url($_SERVER['REQUEST_URI']);
    // $pathinfo = pathinfo($url['path']);
    // $dirname = $pathinfo['dirname'];
    // $pathname = explode('/api',$dirname)[1]?:'/';
    //
    //
    // if (method_exists($this, $REQUEST_METHOD) && ($result = $this->$REQUEST_METHOD())) {
    //   return $result;
    // }
    // debug($dirname, $this->request_url['path']);

    // if ($pathname === '/' && empty($_GET['request_type'])) {
    if ($this->request_url['path'] === '/api/' && empty($_GET['request_type'])) {
			// if ($_SERVER['REQUEST_URI'] === '/api/token') debug(1);
			return $this->$REQUEST_METHOD();
		}

		if ($REQUEST_METHOD === 'POST' && preg_match('/\/\$batch/', $_SERVER['REQUEST_URI'])) {
			$body = json_decode(file_get_contents('php://input'), true);
			// debug(1);
			$response = ['responses' => []];
			if ($body['requests']) {
				foreach ($body['requests'] as $i => $request) {
					$response['responses'][] = [
						'id'=> isset($body['requests'][$i]['id']) ? $body['requests'][$i]['id'] : $i,
						'status' => 200,
						'body' => $this->request($request)
					];
				}
			}
			return $response;
		}
    else {

			$apipos = strpos($_SERVER['REQUEST_URI'], 'api/');
      // debug(2,$apipos);
			return $this->request([
				'method' => $REQUEST_METHOD,
        'url' => substr($_SERVER['REQUEST_URI'], $apipos != false ? strpos($_SERVER['REQUEST_URI'], 'api/') + 3 : 0  ),
        // 'url' => $pathname,
			]);
		}
	}
	public function login($options = []) {//$prompt = 'login') {
		if (empty($this->client_secret)) return;

		if (isset($_GET['prompt']) && $_GET['prompt'] === 'logout') {
	    $this->logout();
	    die(header('Location: /'));
	  } else if (!empty($_GET['code'])) {
		  $this->get_access_token();
			// debug(1666);

			// debug(1111, $_GET, $_COOKIE);

		  unset($_GET['code']);
		  unset($_GET['state']);
		  $request_uri = explode('?', $_SERVER['REQUEST_URI'])[0] . ( empty($_GET) ? '' : '?' . http_build_query($_GET) );
		  die (header('Location: '.$request_uri));
		} else if (!empty($_COOKIE['id_token'])) {
			// debug(1);
			return;
		} else if (empty($options)) {
			// debug(1);
			return;
		}
		// debug(1);

		// if (isset())

		// if (!empty($_COOKIE['access_token'])) {
		// 	return;
		// } else {
		//   // debug(2);
		//
		//   // debug($_COOKIE);
		//   // $access = json_decode(base64_decode(explode('.', $_COOKIE['access_token'])[1]), true);
		//   // $id = json_decode(base64_decode(explode('.', $_COOKIE['id_token'])[1]), true);
		//   // $refresh = json_decode(base64_decode(explode('.', $_COOKIE['refresh_token'])[1]), true);
		//   //
		//   // $access['time_left'] = $access['exp']-time();
		//   // $id['time_left'] = $id['exp']-time();
		//   // $refresh['time_left'] = $refresh['exp']-time();
		//   //
		//   // debug(1, $_COOKIE, $id, $access, $refresh );
		//   //
		//   // $aim->login([
		//   //   'scope' => 'email name phone test',
		//   // ]);
		//
		// }
		// debug(1);
		if (!isset($_GET['state'])) {
			$_GET['state'] = uniqid();
		}
		setcookie('state', $_GET['state'], time() + 300);
		$request_uri = ($_SERVER['HTTPS'] === 'on' ? 'https://' : 'http://').$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'];
		$options = array_replace([
			'client_id' => $this->api->config->aim->client_id,
			'response_type' => 'code',
			// 'redirect_uri' => $_SERVER['HTTP_REFERER'],//($_SERVER['HTTPS']=='on'?'https://':'http://').$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'],
			'redirect_uri' => $request_uri,
			'scope' => implode(' ', $this->api->config->aim->scope),
			// 'state' => isset($_GET['state']) ? $_GET['state'] : '',
			'state' => isset($_GET['state']) ? $_GET['state'] : '',
			'prompt' => isset($_GET['prompt']) ? $_GET['prompt'] : ''
		], $options);

		// debug(AIM_OAUTH2_URL . '?' . http_build_query($options));
		// debug(1, $_COOKIE);

		die(header('Location: ' . AIM_OAUTH2_URL . '?' . http_build_query($options)));
	}
	public function get_access_token() {
		// debug($this->api->config->aim);
		// debug($_GET, $_COOKIE);
		// extract($_GET);
		// if (isset($_COOKIE['state']) && $_COOKIE['state'] != $_GET['state']) return;

		// debug($url, $request_data, $_GET, $_COOKIE, $this->config);
		$request_data = [
			'grant_type' => 'authorization_code',
			'code' => $_GET['code'],
			'client_id' => $this->config->aim->client_id,
			'client_secret' => $this->client_secret,
			'access_type' => 'offline' // only if access to client data is needed when user is not logged in
		];
		// $url = $this->api->config->aim->auth->tokenUrl;
		$url = 'https://login.aliconnect.nl/api/token';


		// debug(1,$_GET);
		// debug(11666, $url, $request_data);
		$curl = curl_init($url);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($curl, CURLOPT_POST, true);
		curl_setopt($curl, CURLOPT_POSTFIELDS, $request_data);
		curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
		$response = curl_exec($curl);




		// die($response);
		$httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
		if ($httpCode >= 400) {
			// debug($httpCode);
			// debug($httpCode,$response);
			die(http_response_code($httpCode));
			// throw new Exception('Fault', $httpCode);
		}
		$curl_errno = curl_errno($curl);
		$curl_error = curl_error($curl);
		curl_close($curl);
		if ($curl_errno) throw new Exception($curl_error, $curl_err);
		$result = json_decode($response);
		// $access = json_decode(base64_decode(explode('.', $result->access_token)[1]), true);

		// debug($access, $result, $_COOKIE);
		// debug($result, json_decode(base64_decode(explode('.',$result->id_token)[1])), json_decode(base64_decode(explode('.',$result->access_token)[1])));
		// debug($result);
		setcookie('id_token', $result->id_token, time() + 30 * 24 * 3600, '/');
		setcookie('access_token', $result->access_token, time() + $result->expires_in * 1000, '/');
		setcookie('refresh_token', $result->refresh_token, time() + 30 * 24 * 3600, '/');
		// setcookie('device_id', uniqid(), time() + 365 * 24 * 3600);
		// debug(1);
		/* @todo opslaan refresh_token per gebruiker */
		// debug($result, $result->access_token, $result->access_token, $_COOKIE);
		// if ($result->refresh_token) {
		// 	$refresh_token = json_decode(base64_decode(explode('.',$result->refresh_token)[1]));
		// 	if (strstr($_SERVER[SERVER_NAME],'localhost')) setcookie('refresh_token', $result->refresh_token, $refresh_token->exp, '/');
		// 	else setcookie('refresh_token', $result->refresh_token, [expires => $refresh_token->exp, path => '/api/', domain => $_SERVER[SERVER_NAME], secure => 1, httponly => 0, 'samesite' => 'Lax']);
		// }

		// debug($_COOKIE);
		return $result;
	}
  public function account_get ($mailto, $chapters = []) {
    $account = sqlsrv_fetch_object(aim()->query(
      "EXEC [account].[get] @accountname=%s",
      $mailto
    ));
    if (!$account->AccountID) {
      $account = sqlsrv_fetch_object(aim()->query(
        "EXEC [account].[get] @accountId=%d",
        aim()->access['sub']
      ));
      $newaccount = sqlsrv_fetch_object(aim()->query("INSERT INTO item.dt (hostID,classID,title) VALUES (1,1004,'$mailto');
      DECLARE @id INT;
      SET @id=scope_identity();
      EXEC item.attr @ItemID=@id, @NameID=30, @value='$mailto'
      "));
      // Maak nieuwe account aan
      $newaccount = sqlsrv_fetch_object(aim()->query(
        "EXEC [account].[get] @accountname=%s",
        $mailto
      ));
      array_unshift($chapters, [
        'title' => __('new_account_title'),
        'content'=> __('new_account_content', $account->AccountName),
      ]);
    }
    if (!empty($chapters)) {
      $this->mail([
        'send'=> 1,
        'to'=> $mailto,
        'bcc'=> "max.van.kampen@alicon.nl",
        // 'Subject'=> __('qr_registratie'),
        'chapters'=> $chapters,
      ]);
    }
  }
  public function getdata ($insert) {
    if (empty($this->hostId)) {
      $this->hostId = sqlsrv_fetch_object($this->query("SELECT id FROM item.dv WHERE hostId=1 AND classID=1002 AND keyname = '$this->hostname'"))->id;
      // debug($this->hostId);
    }
    $res = $this->query($q="SET NOCOUNT ON;DECLARE @itemlist itemlist;$insert;EXECUTE item.data @hostId=$this->hostId, @userId=265090, @itemlist=@itemlist");
    // die($q);
    $items = (object)[];
    while($row = sqlsrv_fetch_object($res)) $items->{$row->ID} = $row;
    sqlsrv_next_result($res);
    while($row = sqlsrv_fetch_object($res)) {
      $items->{$row->ItemID}->{$row->AttributeName} = $items->{$row->ItemID}->{$row->AttributeName} ? (is_array($items->{$row->ItemID}->{$row->AttributeName}) ? $items->{$row->ItemID}->{$row->AttributeName} : [ ['Value' => $items->{$row->ItemID}->{$row->AttributeName}] ]) : [];
      $items->{$row->ItemID}->{$row->AttributeName}[] = $row;
    }
    return $items;
  }
  public function get () {


    // debug(stripcslashes('api\account'), class_exists(addcslashes('api\account')));

    // $url = parse_url($_SERVER['REQUEST_URI']);
    // $pathinfo = pathinfo($url['path']);
    // $dirname = $pathinfo['dirname'];
    // $basename = $pathinfo['basename'];
    // $pathname = explode('/api',$dirname)[1]?:'/';
    //
    // return;
    if (isset(AIM_KEYS['accept']) && strstr(AIM_KEYS['accept'],'yaml')) {
      if (isset($_GET['account'])) {
        $sub = $this->access['sub'];
        // debug(5, $this->access, $_SERVER['DOCUMENT_ROOT'].$this->root."/config/$sub/config.yaml");
        if (is_file($fname = $_SERVER['DOCUMENT_ROOT'].$this->root."/config.yaml")) {
          // echo $_GET['account'].$_SERVER['DOCUMENT_ROOT'].$this->root."/config/$sub/config.yaml";
          readfile($fname);
        }
      } else {
        if (is_file($fname = $_SERVER['DOCUMENT_ROOT'].$this->hostroot.'/config.yaml')) {
          readfile($fname);
        }
      }
    } else {
      $schemaKeys = array_keys((array)$this->api->components->schemas);
      $keys = implode("','",$schemaKeys);
      if (empty($this->hostId)) {
        $this->hostId = sqlsrv_fetch_object($this->query("SELECT id FROM item.dv WHERE hostId=1 AND classID=1002 AND keyname = '$this->hostname'"))->id;
        // debug($this->hostId);
      }
      $res = $this->query("
      SET NOCOUNT ON
      DECLARE @T TABLE (_ID BIGINT)
      INSERT @T SELECT id FROM item.dt WHERE DeletedDateTime IS NULL AND hostId=$this->hostId AND classId=0;
      SELECT id,name FROM item.dt I INNER JOIN @T T ON T._ID = I.id
      SELECT * FROM attribute.vw A INNER JOIN @T T ON T._ID = A.itemId AND hostId = $this->hostId
      ");
      $items = (object)[];
      while($row = sqlsrv_fetch_object($res)) {
        if (isset($this->api->components->schemas->{$row->name})) {
          $items->{$row->id} = $this->api->components->schemas->{$row->name};
          $items->{$row->id}->ID = $row->id;
          $items->{$row->id}->schema = 'Item';
        }
      }
      sqlsrv_next_result($res);
      while($row = sqlsrv_fetch_object($res)) {
        if (isset($items->{$row->_ID})) {
          $items->{$row->_ID}->{$row->AttributeName} = $items->{$row->_ID}->{$row->AttributeName}
          ? (is_array($items->{$row->_ID}->{$row->AttributeName}) ? $items->{$row->_ID}->{$row->AttributeName}
          : [ ['Value' => $items->{$row->_ID}->{$row->AttributeName}] ]) : [];
          $items->{$row->_ID}->{$row->AttributeName}[] = $row;
        }
      }
      // $items = $this->getdata("INSERT INTO @itemlist SELECT id FROM item.dv WHERE hostId=$this->hostId AND classId = 0 AND name in ('$keys')");
      // debug($items);
      // foreach ($items as $id => $item) {
      //   $this->api->components->schemas->{$item->name} = (object)array_merge(array_filter(itemrow($item)),(array)$this->api->components->schemas->{$item->name});
      // }
      // die($q);
      // debug($q,$items);
      foreach($this->api->components->schemas as $schemaname => $schema) {
        if (!$schema->ID) {
          $res = $this->query(
            "SET NOCOUNT ON
            INSERT INTO item.dt (hostID,classID,masterID,srcID,name)
            VALUES ($this->hostId,0,0,0,'$schemaname')
            DECLARE @itemClassId BIGINT
            SET @itemClassId = item.getClassIdByName($this->hostId, 'Item')
            DECLARE @id BIGINT
            SET @id = scope_identity()
            EXEC item.attr @itemId=@id, @name='Master', @linkId=@itemClassId
            EXEC item.attr @itemId=@id, @name='Src', @linkId=@itemClassId
            SELECT id,name FROM item.dt I WHERE id = @id
            SELECT * FROM attribute.vw A WHERE itemID = @id AND hostId = $this->hostId"
          );
          // debug(2, $this->hostId, $schemaname,  $q);
          // die($q);
          while($row = sqlsrv_fetch_object($res)) {
            if (isset($this->api->components->schemas->{$row->name})) {
              $items->{$row->id} = $this->api->components->schemas->{$row->name};
              $items->{$row->id}->ID = $row->id;
              $items->{$row->id}->schema = 'Item';
            }
          }
          sqlsrv_next_result($res);
          while($row = sqlsrv_fetch_object($res)) {
            if (isset($items->{$row->_ID})) {
              $items->{$row->_ID}->{$row->AttributeName} = $items->{$row->_ID}->{$row->AttributeName}
              ? (is_array($items->{$row->_ID}->{$row->AttributeName}) ? $items->{$row->_ID}->{$row->AttributeName}
              : [ ['Value' => $items->{$row->_ID}->{$row->AttributeName}] ]) : [];
              $items->{$row->_ID}->{$row->AttributeName}[] = $row;
            }
          }
        }
      }
      // debug();
      header('Content-Type: application/json');
      die(json_encode($this->api));
		}
		die();
  }
	public function post () {
    // debug(1, $_POST['extend'], $_POST);
    // return;
		if (!function_exists('yaml_parse')) return;
    // $content = file_get_contents('php://input');
    $content = $_POST['config'];
		$content = str_replace("\t","  ",$content);
		// if (isset($_GET['append'])) {
    $this->root = isset($_GET['folder']) ? $_GET['folder'] : $this->root;
		if (isset($_POST['extend'])) {
      // debug(111, $this->root, $_POST);
			if ($content[0]==='{') {
				$content = json_decode($content, true);
			}
      else {
				$content = yaml_parse($content);
			}
			$current_config = is_file($fname = $_SERVER['DOCUMENT_ROOT'].$this->root.'/config.yaml') ? yaml_parse_file($fname) : [];
			$config = array_replace_recursive($current_config ?: [], $content ?: []);
			$content = yaml_emit($config);
			// debug(133, $_GET, $this->root, $config, $content, $current_config);
			// $this->initapi($content);
	    // die("Saved in $this->root $content");
		}
		// debug('POST', $_POST, $_GET, $content);
		// debug('yaml', function_exists('yaml_parse'), file_get_contents('php://input'));
    if (isset($_GET['order'])) {
      $_POST['order'] = json_decode($_POST['order']);
      $KlantID = 'Alicon';
      $KlantRef = 'TestOrder';
      $Remark = 'NIET VERWERKEN, Dit is een test order van Aliconnect';
      $ModifiedBY = 'Webuser';
      $State = 'Besteld';
      $sql = "DECLARE @PakbonID INT
      ERROR
      SET @PakbonID = 202004225
      --SELECT @PakbonID=MAX(PakBonID)+1 FROM abisingen.dbo.Bonnen1 INSERT Bonnen1 (PakbonID) VALUES (@PakbonID)
      UPDATE abisingen.dbo.Bonnen1
      SET
        KlantID= '$KlantID'
        ,Datum = GETDATE()
        ,DatumBesteld = GETDATE()
        ,UwRef = '$KlantRef'
        ,Aanbieding = 0
        ,Verwerkt = 1
        ,FaktuurNR = 0
        ,Status = '$State'
        ,Opmerking = '$Remark'
        ,[User] = '$ModifiedBY'
        ,[ModifiedBy] = '$ModifiedBY'
        ,[TotExcl] = 0
        ,[TotBTW] = 0
        ,[TotIncl] = 0
      WHERE
        PakbonID = @PakbonID
      --DELETE abisingen.dbo.OrderRegels WHERE PakbonID = @PakbonID
      ";
      foreach ($_POST['order']->rows as $row) {
        $sql.="INSERT abisingen.dbo.OrderRegels (PakbonID,FaktuurNR,ProdID,ArtID,Omschrijving,Aantal,Eenheid,Bruto,KlantID,Changed,InkNetto,ArtNR,ModifiedBY)
        SELECT @PakbonID PakbonID,0 FaktuurNR,A.ProdID,A.ArtID,A.Omschrijving,'$row->amount',A.Eenheid,A.Bruto,'$KlantID',GETDATE(),A.InkNetto,A.ArtNR,'$ModifiedBY'
        FROM abisingen.dbo.Artikelen A
        INNER JOIN aim1.item.dt I ON I.ID = $row->ID AND A.ArtID = I.KeyID
        INNER JOIN abisingen.dbo.Producten P ON P.ProdID = A.ProdID
        ";
      }
      die($sql);
      aim()->query($sql);

      return $_POST;
    }
    // debug($this->root);
    $this->initapi($content);
    // debug(1,$content);
    // return $this->get();
    // die("Saved in $this->root $content");
    die("Saved in $this->root");
	}
  public function to_table ($name, $query, $cols) {
    $result = '<!DOCTYPE html><html><head><title>'.$name.'</title><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /></head>
		<body><table><caption>'.$name.'</caption><thead><tr><th>'.implode('</th><th>', $cols).'</th></tr></thead><tbody>';
		$res = aim()->query($query);
		while($row = sqlsrv_fetch_object($res)){
			$result .= "<tr><td>".implode('</td><td>', (array)$row)."</td></tr>";
		}
    $result .= '</tbody></table></body></html>';
    return $result;
  }
  public function require($name, $method = '', &$response = null) {
    $classname = "$name";
    if (empty($this->$name)) {
      if (!class_exists($name)) {
        if (is_file($fname = __DIR__."/$name.php")) {
          require_once($fname);
        }
      }
      if (class_exists($classname)) {
        $this->$name = new $classname();
      }
    }

    // debug($name, $method);
    // $method = 'POST';
    // $_POST=$_GET;
    if ($method && method_exists($classname, $method)) {
      // debug(1,$classname, $method);
      $response = $this->$name->$method();
      // debug(1);
    }
    // debug(1, $name, $method);
    return $this;
  }
}
class request_type {
  public function check_access_token () {
  	if (empty(aim()->access['nonce']) || empty(aim()->access['sub'])) {
  		die(http_response_code(204));
  	}
  	$row = sqlsrv_fetch_object(aim()->query(
  		"SELECT * FROM auth.nonce WHERE nonce=%s AND sub=%d",
  		aim()->access['nonce'],
  		aim()->access['sub']
  	));
  	if (empty($row->SignInDateTime)) {
  		// debug(aim()->access['nonce'], $row, aim()->access);
  		die(http_response_code(204));
  	}
  }
  public function build_doc() {
    // om.js
    ini_set('display_errors', 1);
    error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING & ~E_STRICT & ~E_DEPRECATED);
    // error_reporting(E_ALL & ~E_NOTICE);

    global $recent;

    function readDirs($path){
      global $recent;
      $dirHandle = opendir($_SERVER['DOCUMENT_ROOT'].$path);
      $items=[];
      $dirs=[];
      while($item = readdir($dirHandle)) {
        $newPath = $path."/".$item;
        if ($item === '.' || $item === '..' || strstr($item, 'secret')) continue;
        if ($item[0] === '_') continue;
        $ext = pathinfo($item, PATHINFO_EXTENSION);
        $title = str_replace('.'.$ext,'',pathinfo($item, PATHINFO_BASENAME));
        $first = explode(' ', $title)[0];
        // if (is_numeric($first)) $title = trim(ltrim($title, $first));

        // $title = ucfirst(str_replace(['_','-'],' ',$title));
        $src = $path.'/'.$item;
        if (is_dir($_SERVER['DOCUMENT_ROOT'].$newPath)) {
          if ($dir = readDirs($newPath)) {
            $items[$title] = $dir;
          }
        }
        else if ($ext === 'md') {
          $content = file_get_contents($_SERVER['DOCUMENT_ROOT'].$src);
          $filemtime = date("Y-m-d H:i:s", filemtime($_SERVER['DOCUMENT_ROOT'].$src));
          $wordcount = str_word_count($content);
          if ($item === 'README.md') {
            $items['src']= $src;
            $items['wordcount']= $wordcount;
            $items['lastModifiedDateTime']= $filemtime;
            $recent[$filemtime] = [
              'title'=> $title,
              'src'=> $src,
              'wordcount'=> $wordcount,
              'lastModifiedDateTime'=> $filemtime,
            ];
          }
          else {
            $items[$title] = [
              'src'=> $src,
              'wordcount'=> $wordcount,
              'lastModifiedDateTime'=> $filemtime,
            ];
            $recent[$filemtime] = [
              'title'=> $title,
              'src'=> $src,
              'wordcount'=> $wordcount,
              'lastModifiedDateTime'=> $filemtime,
            ];
          }
        }
        else if ($ext === 'htm') {
          // $content = file_get_contents($_SERVER['DOCUMENT_ROOT'].$src);
          if ($item === 'index.htm') {
            $items['src']= $src;
          }
          else {
            $items[$title] = [
              'src'=>$src,
            ];
          }
        }
        // else if ($ext === 'json') {
        //   $items[$title] = array_merge_recursive(isset($items[$title]) ? $items[$title] : [],json_decode(file_get_contents($_SERVER['DOCUMENT_ROOT'].$src), true));
        //   // if ($title === 'web') debug($title, $items[$title]);
        // }
        else if ($ext === 'yaml') {
          if ($item === 'index.yaml') {
            $items = array_merge_recursive($items ?: [],yaml_parse_file($_SERVER['DOCUMENT_ROOT'].$src));
          }
          else {
            $items[$title] = array_merge_recursive($items[$title] ?: [],yaml_parse_file($_SERVER['DOCUMENT_ROOT'].$src));
          }
          // debug($ext);
        }
      }
      return $items;//array_merge($items,$dirs);
    }
    // $path =  '/docs/index';
    // echo "$path<br>";
    // debug(1);
    // $body = $items = array_replace_recursive(readDirs('/docs/index'), readDirs('/sites/'.AIM_DOMAIN.'/docs/index'));
    $body = $items = array_merge(readDirs('/sites/aliconnect/docs/index'),readDirs('/sites/'.AIM_DOMAIN.'/docs/index'));
    krsort($recent);
    $recent = array_slice($recent,0,20);
    $recent = array_values($recent);
    // debug($recent);
    $body['Recent'] = $recent;
    $config['docs']['index'] = $body;
    return $config;
    // header('Content-Type: application/json');
    // die(json_encode($config));

    // $path = $_SERVER['DOCUMENT_ROOT'].'/sites/aliconnect';
    // $config = yaml_parse_file($fname = $path.'/config.yaml');
    // $config['docs']['index'] = $body;
    // yaml_emit_file($fname, $config);
    // die(json_encode($items));
  }
  public function build_clone_data() {
    // aim.js
    $id = preg_replace('/.*\((\d+)\).*/','$1',$_SERVER['REQUEST_URI']);
    $res = aim()->query("EXEC item.build_clonedata $id");
    // die("EXEC item.clone_data $id");
    $value=[];
    while ($row = sqlsrv_fetch_object($res)) {
      $value[] = $row;
    }
    header('Content-type: application/json');
    die(json_encode($value, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
  }
  public function build_node_data() {
    // gebruikt door node.js, opbouwen data voor node
    ini_set('display_errors', 0);
    ini_set('log_errors', 1);
    if (isset(aim()->access['sub'])) {
      $sub = aim()->access['sub'];
      $res = aim()->query("EXEC [item].[build_node_data] $sub");
      while ($row = sqlsrv_fetch_object($res)) {
        $items->{$row->ID} = $row = (object)itemrow($row);
      }
      sqlsrv_next_result($res);
      while ($row = sqlsrv_fetch_object($res)) {
        $items->{$row->ItemID}->{$row->AttributeName} = $row;
      }
      header('Content-type: application/json');
      die(json_encode([
        'sub'=>$sub,
        'value'=>array_values((array)$items),
      ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
    }
  }
  public function _build_map() {
    // gebruikt door web.js, build_map opbouwen netwerk overzicht
    $id = preg_replace('/.*\((\d+)\).*/','$1',$_SERVER['REQUEST_URI']);
    $res = aim()->query("EXEC [item].[build_map] $id");
    while ($row = sqlsrv_fetch_object($res)) {
      $items->{$row->ID} = $row = (object)itemrow($row);
    }
    sqlsrv_next_result($res);
    while ($row = sqlsrv_fetch_object($res)) {
      $items->{$row->id}->{$row->AttributeName} = $row->Value;
    }
    header('Content-type: application/json');
    die(json_encode(['value'=>array_values((array)$items)]));
  }
  public function build_link_data() {
    // web.js, showLinks
    $id = preg_replace('/.*\((\d+)\).*/','$1',$_SERVER['REQUEST_URI']);
    $res = aim()->query("EXEC [item].[build_link_data] $id");
    $items = [];
    $links = [];
    while ($row = sqlsrv_fetch_object($res)) {
      $items[$row->id] = (array)$row;
    }
    sqlsrv_next_result($res);
    while ($row = sqlsrv_fetch_object($res)) {
      $links[] = $row;
      // if ($row->text === 'parent') $items[$row->fromId]['parent'] = $row->toId;
    }
    header('Content-type: application/json');
    die(json_encode(['items'=>array_values($items),'links'=>$links], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
  }
  public function build_breakdown() {
    // web.js, item breakdown
    $id = preg_replace('/.*\((\d+)\).*/','$1',$_SERVER['REQUEST_URI']);
    $res = aim()->query("EXEC [item].[build_breakdown] $id");
    while ($row = sqlsrv_fetch_object($res)) {
      $items->{$row->ID} = $row = (object)array_filter(itemrow($row),function ($v){return !is_null($v);});
    }
    sqlsrv_next_result($res);
    while ($row = sqlsrv_fetch_object($res)) {
      $items->{$row->ItemID}->{$row->AttributeName}[] = $row;
    }
    header('Content-type: application/json');
    // die(json_encode(['value'=>array_values((array)$items)], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
    die(json_encode(['value'=>array_values((array)$items)]));
  }
  public function build_2to1() {
    // web.js, export json voor aim versie 1
    $id = preg_replace('/.*\((\d+)\).*/','$1',$_SERVER['REQUEST_URI']);
    $json = (object)[
      'hostID' => null,
      'rootID' => $id,
      'class' => null,
      'attributeName' => null,
      'items' => null,
    ];
    $res = aim()->query("EXEC [item].[build_2to1] $id");
    while ($row = sqlsrv_fetch_object($res)) {
      if ($row->classID == 0) {
        $json->class->{$row->PrimaryKey} = $row->name;
      } else {
        $json->items->{$row->PrimaryKey} = $row;
      }
    }
    $name = $json->items->{$id}->name ?: $json->items->{$id}->title;
    $date = date("Ymd-hi");
    $filename = "aliconnect-$id-$name-export1-$date";
    // debug($filename);
    sqlsrv_next_result($res);
    while($row=sqlsrv_fetch_object($res)){
      $json->attributeName->{$row->fieldID} = $row->name;
      if ($json->items->{$row->id}) {
        $json->items->{$row->id}->values->{$row->name}=$row;
      }
    }
    header('Content-type: application/json');
    if(isset($_GET['download'])) {
      header("Content-disposition: attachment; filename=$filename.json");
    }
    die (json_encode($json, JSON_PRETTY_PRINT));
  }
  public function visit() {
    // om.js
    $sub = aim()->access['sub'];
    if (get('id')) {
      aim()->setAttribute([
        'itemId'=>aim()->access['sub'],
        'name'=>'history',
        'max'=>'999999',
        'linkId'=>get('id'),
      ]);
    } else {
      $res = aim()->query("SELECT linkId,lastModifiedDateTime FROM attribute.dt where itemid=$sub AND nameId = 2184");
      while ($row = sqlsrv_fetch_object($res)) {
        $value[$row->linkId] = $row->lastModifiedDateTime;
      }
      header('Content-type: application/json');
      die(json_encode($value, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
    }
    die();
    // debug(aim()->access);
    // @itemId=265090, @name='history', @linkId=3674027, @max=9999
    // debug($_GET);
  }
  public function yamlToJson() {
    // aim.js
  	$content = file_get_contents('php://input');
  	header('Content-Type: application/json');
  	die(json_encode(yaml_parse($content)));
  }
  public function mail() {
    // debug(4);
    // aim.js
		$content = file_get_contents('php://input');
		if (!empty($content)) {
			$mail = aim()->mail(json_decode($content, true));
			die($content);
		}
		$row = sqlsrv_fetch_object(aim()->query(
			"SELECT TOP 1 * FROM mail.dt WHERE sendDateTime IS NULL;"
		));
		if ($row) {
			$mail = aim()->mail(json_decode($row->data, true));
			aim()->query(
				"UPDATE mail.dt SET sendDateTime = GETDATE() WHERE id = %d;",
				$row->id
			);
			// header( "refresh:3" );
			die ($mail->Body);
		}
		die ('last try '.date('Y-m-d h:i:s'));
	}
  public function pdf() {
    // aim.js
		ini_set('display_errors', 0);
		ini_set('log_errors', 1);
		$content = file_get_contents('php://input');
		require_once ($_SERVER['DOCUMENT_ROOT'].'/lib/dompdf/dompdf_config.inc.php');
		$dompdf = new DOMPDF();
		$dompdf->load_html('sdfgsdfgsd');
		$dompdf->set_paper("a4");
		$dompdf->render();
		$attachement['filename'] = '/test.pdf';
		file_put_contents($_SERVER['DOCUMENT_ROOT'].$attachement['filename'], $dompdf->output());
	}
  public function build_data() {
    // zie web.js datainit
    ini_set('display_errors', 1);
    ini_set('log_errors', 1);
    $content = file_get_contents('php://input');

    // if (isset($_GET['sub'])) {
    //   $ID = $_GET['sub'];
    // }
    // else
    if (isset(aim()->access['sub'])) {
      $ID = aim()->access['sub'];
    }
    else if (isset($_GET['id'])) {
      $ID = $_GET['id'];
    }
    else if ($content) {
      $content = json_decode($content, true);
      if (isset($content['mac'])) {
        foreach ($content['mac'] as $mac_address => $mac_ip) {
          $mac_address = str_replace(":","-",$mac_address);
          $row = sqlsrv_fetch_object(aim()->query(
            // DEBUG:
            // "SELECT * FROM auth.mac WHERE address = %s AND ip IS NULL",
            "SELECT * FROM auth.mac WHERE address = %s",
            $mac_address
          ));
          if (isset($row->ID)) {
            aim()->query(
              "UPDATE auth.mac SET ip = %s WHERE ID = %d",
              $mac_ip,
              $row->ID
            );
            $ID = $row->sub;
          }
        }
      }
    }

    // debug(aim()->access);

    // debug(1);
    // debug(1, $ID);
    // debug('api1',__DIR__,$ID);
    // debug(1, aim()->access, $_POST, $ID);
    // debug($ID, aim()->access, getallheaders());
    if (!isset($ID)) {
      // die(http_response_code(401));
      throw new Exception('Unauthorized', 401);
    }
    // die("THIS IS DATA");

    $data = [
      'info'=>isset(aim()->api->info) ? aim()->api->info : '',
      'paths'=> [],
      'components'=> [
        'schemas'=> [],
      ],
      'value'=> [],
      // 'attributes'=> []
    ];
    // debug(111,$data,aim()->secret['config']);
    // debug("EXEC item.getData $ID");
    $res = aim()->query($q = "EXEC item.build_data $ID");
    // die($q);
    $items = (object)[];
    while (	$row = sqlsrv_fetch_object($res)) {
      $row->{'@id'} = "/$row->schema($row->ID)";
      $items->{$row->ID} = $row;
      if (isset(aim()->api->components->schemas->{$row->schema})) {
        $data['components']['schemas'][$row->schema] = aim()->api->components->schemas->{$row->schema};
      }
      // if ($row->MasterID && isset($items->{$row->MasterID})) {
      // 	if (empty($items->{$row->MasterID}->Children)) {
      // 		$items->{$row->MasterID}->Children = [];
      // 	}
      // 	$items->{$row->MasterID}->Children[] = $items->{$row->ID};
      // } else {
      // 	$data['value'][] = $items->{$row->ID};
      // }
      $data['value'][] = $items->{$row->ID};
    }
    // foreach ($data['components']['schemas'] as $schemaName => $schema) {
    //   if (isset($schema->operations)) {
    //     foreach ($schema->operations as $operationName => $operation) {
    //       $data['paths']["/$schemaName(id)/$operationName()"]["post"] = [
    //         "operationId"=> "$schemaName(id).$operationName()",
    //       ];
    //     }
    //   }
    // }
    // $data['paths'] = 'sdfasdfas';

    // debug($data);
    sqlsrv_next_result($res);
    while (	$row = sqlsrv_fetch_object($res)) {
      if (isset($items->{$row->ItemID})) {
        $items->{$row->ItemID}->{$row->AttributeName} = $row;//array_push($data['attributes'],$row);
      }
    }

    // foreach ($items as $item) {
    // 	if (!isset($item->schema)) debug($item);
    // 	if (isset(aim()->api->components->schemas->{$item->schema})) {
    // 		$data['components']['schemas'][$item->schema] = aim()->api->components->schemas->{$item->schema};
    // 	}
    // }
    // $data['value'] = array_values((array)$items);


    $date = date("Ymd-his");
    // header("Content-disposition: attachment; filename=aliconnect-export-$date-$ID-data.json");
    header('Content-type: application/json');
    // die(json_encode($data));
    die(json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
  }
  public function uploadfile() {
    // debug(1);
  	$src = $_SERVER['DOCUMENT_ROOT'].explode('alicon.nl',$_POST['src'])[1];
  	unlink($src);
  	file_put_contents($src,base64_decode($_POST['data']));
  	die();
  }
  public function mselogin() {
    $mse = new mse();
    $mse->login();
  }
  public function msecontact() {
    $mse = new mse();
    $mse->login();
  }

  public function words() {
    $words = json_decode(file_get_contents('php://input'));
    if (preg_match('/\w+\((\d+)\)/', $_SERVER['REQUEST_URI'], $match)) {
      $id = $match[1];
      debug(111, $id);
    }
    return;
  }
  public function share() {
    debug(222);
    return;
  }

  public function personal_dashboard_data() {
    $sub = aim()->access['sub'];
    $client_id = aim()->access['client_id'];
    $aud = aim()->access['aud'];
    function get_dashboard_data ($row) {
      $res = aim()->query("
      SET NOCOUNT ON
      SELECT id,header0,keyname FROM item.dv WHERE id=$row->host
      ");
      $row->host = sqlsrv_fetch_object($res);
      // sqlsrv_next_result($res);
      // $row->host1 = sqlsrv_fetch_object($res);
      return $row;
    }
    $data = [];
    $res = aim()->query("
    SET NOCOUNT ON
    SELECT c.id,c.header0,c.hostId host
    FROM item.dt c
		LEFT OUTER JOIN (SELECT hostId,max(LastModifiedDateTime)LastModifiedDateTime FROM attribute.dt a WHERE itemId = $sub GROUP BY hostId) A ON A.hostId = C.hostId
    WHERE srcId=$sub AND C.hostId IN (SELECT id FROM item.dv)
		ORDER BY A.LastModifiedDateTime DESC
    ");
    while($row = sqlsrv_fetch_object($res)) {
      $data[] = get_dashboard_data($row);
    }
    return $data;
  }
  public function personal_dashboard_data_domain() {
    $sub = aim()->access['sub'];
    $client_id = aim()->access['client_id'];
    $aud = aim()->access['aud'];

    function get_dashboard_data ($row) {
      $res = aim()->query($q = "
      SET NOCOUNT ON
      SELECT TOP 5 i.id,i.header0
      FROM attribute.dt a
      INNER JOIN item.dt i ON a.linkid = i.id
      WHERE a.itemid = $row->itemId AND a.nameid = 2184 AND a.hostid = $row->hostId AND item.schemaPath(i.id) = '$row->schemaPath'
      ORDER BY a.LastModifiedDateTime DESC
      ");
      // die($q);
      $row->items = [];
      while($item = sqlsrv_fetch_object($res)) {
        $row->items[] = $item;
      }
      return $row;
    }
    $res = aim()->query($q = "
    SET NOCOUNT ON
    select distinct item.schemaPath(i.id) schemaPath,$sub as itemId,$aud as hostId
    from attribute.dt a inner join item.dt i on a.linkid = i.id
    where a.itemid = $sub and a.nameid = 2184 and a.hostid = $aud
    ");
    // return [$q];
    $data = [];
    while($row = sqlsrv_fetch_object($res)) {
      $data[] = get_dashboard_data($row);
    }
    return $data;
  }


  // request_tyoe sms ????
  // request_tyoe translate ????

	public function _config_json() {
		$content = [];
		foreach (['item.dt','attribute.dt'] as $tablename) {
			$row = sqlsrv_fetch_object(aim()->query("SELECT api.getDefinitionTable(OBJECT_ID('$tablename')) AS def;"));
			$content['sql'][] = $row->def;
		}
		$res = aim()->query(
			"SELECT type,type_desc,SCHEMA_NAME(schema_id) schemaname,name,object_definition(object_id) as [code]
			FROM sys.objects
			WHERE type IN ('V','P','FN','IF','TR')"
		);
		while ($row = sqlsrv_fetch_object($res)) {
			$typename = array_end(explode('_', $row->type_desc));
			$content['sql'][] = $row->code;
		}
		return $content;
	}
	public function _zip() {
		$uid = sqlsrv_fetch_object(aim()->query("SELECT newid() AS uid;"))->uid;
		$temproot = $_SERVER['DOCUMENT_ROOT'].'/../tmp';
		// $documentroot = $_SERVER['DOCUMENT_ROOT'];
		// $servername = $_SERVER['SERVER_NAME'];
		// $hostname = explode('.',$servername)[0];
		// $folder = "sites/$hostname";
		// die("$documentroot/$folder/temp");
		// if (!file_exists("$documentroot/../tmp")) {
		// 	mkdir("$documentroot/$folder/temp",0777,true);
		// }

		$code = array_merge(aim()->access, [
			"exp" => time() + 3600,
			"iat" => time(),
		]);
		// $secret = [
		// 	'api_key' => jwt_encode($code, aim()->secret["aim"]["client_secret"]),
		// 	// 'code' => $code,
		// ];

		$zip_filename="$temproot/$uid.zip";
		$zip = new ZipArchive;
		if ($zip->open($zip_filename, ZipArchive::CREATE) === TRUE) {
			// $zip->addFile($filename);
			$lines = [];
			foreach (['item.dt','attribute.dt'] as $tablename) {
				$row = sqlsrv_fetch_object(aim()->query("SELECT api.getDefinitionTable(OBJECT_ID('$tablename')) AS def;"));
				$lines[] = $row->def;
			}
			$res = aim()->query(
				"SELECT type,type_desc,SCHEMA_NAME(schema_id) schemaname,name,object_definition(object_id) as [code]
				FROM sys.objects
				WHERE type IN ('V','P','FN','IF','TR')"
			);
			while ($row = sqlsrv_fetch_object($res)) {
				$typename = array_end(explode('_', $row->type_desc));
				$lines[] = "DROP $typename $row->schemaname.$row->name";
				$lines[] = "GO";
				$lines[] = $row->code;
				$lines[] = "GO";
			}




			// $lines[] = 'DISABLE TRIGGER ALL ON DATABASE';
			// $lines[] = 'SET IDENTITY_INSERT item.dt ON';
			// while (	$row = sqlsrv_fetch_array($res, SQLSRV_FETCH_ASSOC )) {
			// 	$lines[] = "INSERT item.dt VALUES ('".implode("','",array_values($row))."')";
			// }
			// $lines[] = 'SET IDENTITY_INSERT item.dt OFF';
			// $lines[] = 'SET IDENTITY_INSERT attribute.dt ON';
			// sqlsrv_next_result($res);
			// while (	$row = sqlsrv_fetch_array($res, SQLSRV_FETCH_ASSOC )) {
			// 	$lines[] = "INSERT attribute.dt VALUES ('".implode("','",array_values($row))."')";
			// }
			// $lines[] = 'SET IDENTITY_INSERT attribute.dt OFF';
			// $lines[] = 'ENABLE TRIGGER ALL ON DATABASE';

			// $zip->addFile('test.pdf', 'demo_folder1/test.pdf');

			$zip->addFromString('aim.sql', implode("\r\n",$lines));
			// $zip->addFromString('data.json', json_encode($items));
			// $zip->addFromString('secret.json', json_encode($secret));
			// $zip->addFromString('api.json', file_get_contents("$documentroot/$folder/api.json") );
			// $zip->addGlob('./sites/tms/test/js/*.{js}', GLOB_BRACE, [
			// 	'add_path' => 'sources/',
			// 	'remove_all_path' => TRUE,
			// ]);
			// $zip->addGlob("./lapi/*.*");

			// die();
			$zip->close();
		}

		$zip = new ZipArchive;
		if ($zip->open($zip_filename) === TRUE) {
		    echo $zip->getFromName('aim.sql');
		    $zip->close();
		} else {
		    echo 'failed';
		}

		die();

		header('Content-type: application/zip');
		header("Content-disposition: attachment; filename=aliconnect_export_".date("Ymd_hi").".zip");
		readfile($zip_filename);
		unlink($zip_filename);
		die();
	}
	public function _secret_json() {
		$_GET['expires_after'] = 30;
		if (isset($_GET['release'])) {
			$_GET['expires_after'] = 30 * 12 * 10;
			unset($_GET['release']);
		}
		$keys = array_merge($_GET,$_POST);
		extract($keys);
		unset($keys['client_secret'], $keys['expires_after'], $keys['request_type']);
		$options = array_replace(aim()->access, array_filter($keys), [
			'iss' => AIM_DOMAIN.".aliconnect.nl",
			// 'aud' => aim()->access['aud'], // Audience, id of host, owner of scope
			// 'azp' => (int)$account->ClientID, // From config.json
			// 'client_id' => (int)$account->ClientID, // Client Identifier // application
			// 'scope' => implode(' ',[$scope, $account->GrantScope]),//trim($scope . (isset($scope) ? ' '.$scope->scope : '' )), // Scope Values
			'exp' => time() + 24 * $expires_after, // Expiration Time
			'iat' => time(), // Issued At
		]);
		$data = [
			"config"=> [
		    "aim"=> [
		      "headers"=> [
		        "Authorization"=> "Bearer ".jwt_encode($options, aim()->client_secret)
		      ]
		    ]
		  ]
		];
		header('Content-type: application/json');
		$ID=$_GET['sub'];
		$date = date("Ymd-his");
		header("Content-disposition: attachment; filename=aliconnect-export-$date-$ID-secret.json");
		die(json_encode($data));
	}
	public function _domain_list() {
		// debug(1);
		extract($_GET);
		$sub = aim()->access['sub'];
		$res = aim()->query("SELECT * FROM item.dt WHERE HostID=1 AND classID=1002 AND keyname IS NOT NULL AND OwnerID=$sub;");
		$rows = [];
		while ($row = sqlsrv_fetch_object($res)) {
			$rows[] = $row;
		}
		return $rows;
	}
	public function _qr() {
		if ($_SERVER['REQUEST_METHOD'] === 'GET') {
			if (!empty($_GET['code'])) {
				$row = sqlsrv_fetch_object(aim()->query(
					"SELECT * FROM aimhis.dbo.qr WHERE code='%s'",
					$_GET['code']
				));
			}
			header('Content-Type: application/json');
			die($row->data);
		}
		if ($_SERVER['REQUEST_METHOD'] === 'POST') {
			if (isset($_POST['method']) && $_POST['method']==='create') {
				// debug(10);
				$row = sqlsrv_fetch_object(aim()->query(
					"DECLARE @code UNIQUEIDENTIFIER
					SET @code = newid()
					INSERT aimhis.dbo.qr (code,email,data) VALUES (@code,'%s','%s')
					SELECT @code AS code",
					$_POST['email'],
					json_encode($_POST)
				));
				die($row->code);
			} else if (!empty($_POST['code'])) {
				$row = sqlsrv_fetch_object(aim()->query(
					"SELECT * FROM aimhis.dbo.qr WHERE code='%s'",
					$_POST['code']
				));
				$row = sqlsrv_fetch_object(aim()->query(
					"INSERT INTO aimhis.corona.reg (code,[date],arrival,preferred_username,email,phone_number,data) VALUES ('%s','%s','%s','%s','%s','%s','%s')
					SELECT @@identity AS id",
					$_POST['code'],
					$_POST['date'],
					$_POST['arrival'],
					$_POST['preferred_username'],
					$_POST['email'],
					$_POST['phone_number'],
					json_encode($_POST)
				));
				header('Content-Type: application/json');
				die(json_encode($row));
			} else if (!empty($_POST['id'])) {
				$departure = date('H:i:s');
				$row = sqlsrv_fetch_object(aim()->query(
					"UPDATE aimhis.corona.reg SET departure = '%s' WHERE id=%d
					SELECT * FROM aimhis.corona.reg WHERE id=%d",
					$departure,
					$_POST['id'],
					$_POST['id']
				));
				$data = json_decode($row->data,true);
				$data['departure'] = $departure;
				$content = implode('<br>', array_filter(array_map(function($key,$value){
					if ($value) return __('label_'.$key).": $value";
				}, array_keys($data), $data )));
				// debug(array_keys($data), $data);
				// debug($row->email, $content);
				$mail = aim()->mail([
					'send'=> 1,
					'to'=> $row->email,
					'bcc'=> "max.van.kampen@alicon.nl",
					// 'Subject'=> __('qr_registratie'),
					'chapters'=> [
						[
							'title' => 'Corona registratie',
							'content'=> __('corona_registratie_intro'),
						],
						[
							'title' => 'Corona app zelf gebruiken',
							'content'=> __('corona_registratie_gebruiken'),
						],
						[
							'title' => 'Registratie gegevens',
							'content'=> __('corona_registratie_content', $content),
						],
					],
				]);
				die(header('Location: /corona/'));
			}
		}
		debug([$_GET,$_POST]);
	}
	public function _print() {
		$content = file_get_contents('php://input');
		if (!empty($content) && !empty($_GET['printer_id'])) {
			server::print($content, $_GET['printer_id']);
			die();
		}
		if (isset($_GET['id'])) {
			$row = sqlsrv_fetch_object(aim()->query(
				"UPDATE FROM aim.auth.appprintqueue SET printDT = GETDATE() WHERE aid=%d;",
				$_GET['id']
			));
		} else {
			$row = sqlsrv_fetch_object(aim()->query(
				// "SELECT TOP 1 * FROM printer.dt WHERE sendDateTime IS NULL AND printer_id='%s';",
				"SELECT TOP 1 * FROM aim.auth.appprintqueue WHERE printDT IS NULL AND uid='%s';",
				$_GET['printer_id']
			));
			if ($row) {
				aim()->query(
					"UPDATE aim.auth.appprintqueue SET printDT = GETDATE() WHERE aid=%d;",
					$row->aid
				);
				die($row->html);
				// $mail = aim()->mail(json_decode($row->data, true));
				// aim()->query($q = "UPDATE printer.dt SET sendDateTime = GETDATE() WHERE id = '%d';", $row->id);
				// aim()->query($q = "UPDATE aim.auth.appprintqueue SET printDt = GETDATE() WHERE aid = %d;", $row->aid);
				// header( "refresh:5" );
				// die ($row->data."<script>window.print();</script>");
			}
			die();
			// header( "refresh:3" );
			// die ('last try '.date('Y-m-d h:i:s'));
		}
	}
	public function _href() {
		$id = json_decode(base64_decode(explode('.', $_COOKIE['id_token'])[1]), true);
		aim()->query(
			"INSERT INTO aimhis.his.link (address,url,userId) VALUES ('%s','%s','%s');",
			$_GET['address'],
			$_GET['redirect_uri'],
			$id['sub']
		);
		die(header("Location: ".$_GET['redirect_uri']));
	}
	public function _track() {
		if (empty($_SERVER['HTTP_REFERER'])) {
			$id = json_decode(base64_decode(explode('.', $_COOKIE['id_token'])[1]), true);
			aim()->query(
				"DECLARE @AccountId BIGINT
				EXEC account.get @accountName='%s', @AccountId = @AccountId OUTPUT
				INSERT INTO aimhis.his.link (address,url,userId) VALUES ('%s','%s',@AccountId);",
				$_GET['address'],
				$_GET['address'],
				$_GET['track'],
				$id['sub']
			);
		}
		die(header("Location: https://aliconnect.nl/image/pixel.png"));
	}
	public function _sitemap() {
		$content = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
		$res = aim()->query(
			"SELECT TOP 50000 H.keyname AS hostname,I.[schema],I.ID,CONVERT(VARCHAR(50),ISNULL(I.LastModifiedDateTime,I.CreatedDateTime),127)LastModifiedDateTime
			FROM item.vw I
			INNER JOIN item.dt H
			ON H.ID = I.HostID
			AND I.IsPublic=1
			AND I.[schema] > ''
			AND H.keyname > ''
			AND I.ClassID IN (1092,2107)"
		);
		while ($row = sqlsrv_fetch_object($res)) {
			$row->hyperlink = "https://$row->hostname.aliconnect.nl/id/".base64_encode("https://$row->hostname.aliconnect.nl/api/$row->schema($row->ID)");
			// $content.="\n<url><loc>$row->hyperlink</loc><lastmod>$row->LastModifiedDateTime+01:00</lastmod><changefreq>weekly</changefreq></url>";
			$content.="<url><loc>$row->hyperlink</loc><lastmod>$row->LastModifiedDateTime+01:00</lastmod></url>";
		}
		$content .= "</urlset>";
		file_put_contents ($_SERVER['DOCUMENT_ROOT'].'/sitemap.xml',$content);
		die('Sitemap saved');
	}

	public function _code_file() {
		$width = 80;
		$res = aim()->query($aim()->query = sprintf("
		SET NOCOUNT ON
		;WITH P (id) AS (
			SELECT id
			FROM item.vw
			WHERE id = %d
			UNION ALL
			SELECT I.id
			FROM P
			INNER JOIN item.vw I ON I.masterID = P.id
			)
			SELECT I.id,[schema],typical,Title FROM p INNER JOIN item.vw I ON I.id=P.id
			",$_GET['build_id']
		));
		// die($aim()->query);
		$rows=[];
		$lines=[];
		function write_st_code($code, $row) {
			$replaces = [
				'%d'=> $row->id,
				' AND ;'=> " AND ",
				' OR ;'=> " OR ",
				"≤"=> "<=",
				"≥"=> ">=",
				"<;"=> "<",
				"  "=> " ",
				"  "=> " ",
				"ELSE IF"=> "ELSIF",
			];
			$identor = [
				// '\('=> '\)',
				'\bIF\b'=> '\bEND_IF\b;',
				'\bFOR\b'=> '\bEND_FOR\b;',
			];
			$outdentor = "\b".
			implode("\b|\b",['AND','DO','OR','THEN','ELSE','ELSIF'])."\b";
			$ident = implode('|',array_keys($identor));
			$outdent = implode('|',array_values($identor));
			$code = str_replace(array_keys($replaces),array_values($replaces),$code);
			$code = preg_replace("/($ident|$outdent|$outdentor)/","\n$1\n",$code);
			$code = explode("\n", $code);
			$level = 0;
			foreach ($code as $i => $line) {
				$line=trim($line);
				if (preg_match("/$outdent/", $line)) $level--;
				$pos = $level;
				if (preg_match("/$outdentor/", $line)) $pos -= 1;
				$code[$i] = $line ? str_repeat('  ',$pos).$line : null;
				if (preg_match("/$ident/", $line)) $level++;
			}
			// $code = implode("\n",array_filter($code));
			$code = implode("\n",array_filter($code));
			return $code;
		}
		if ($_GET['lang']=='st') {
			while ($row = sqlsrv_fetch_object($res)) {
				if ($schema = AIM::$api->components->schemas->{$row->typical}) {
					$lines[] = "/**";//.str_repeat('=',$width);
					$lines[] = " * $row->typical #$row->id";
					// $lines[] = " * ".str_repeat('=',$width);
					$lines[] = " */";
					if ($schema->properties) {
						foreach ($schema->properties as $name => $object) {
							if ($object->rules) {
								$lines[] = "";
								$lines[] = "/** ";//.str_repeat('-',$width);;
								$lines[] = " * $object->stereotype $row->typical[$row->id].$name";
								// $lines[] = " * $row->typical #$row->id";
								$lines[] = wordwrap(str_replace(". ",".\n *   "," * $object->description"),$width,"\n *   ");
								$lines[] = " * $object->bsttiNr";
								$lines[] = " * Regels";
								foreach ($object->rules as $rule) {
									$lines[] = wordwrap(" * - Conditie: $rule->Conditie",$width,"\n *     ");
									$lines[] = wordwrap(" *   Waarde: $rule->Waarde",$width,"\n *     ");
								}
								// $lines[] = ' * '.str_repeat('-',$width).' */';
								$lines[] = " */";
								$lines[] = "";
								if ($object->{'st()'}) {
									$lines[] = write_st_code($object->{'st()'}, $row);
								}
							}
						}
					}
					if ($schema->operations) {
						foreach ($schema->operations as $name => $object) {
							if ($object->rules) {
								$lines[] = "";
								$lines[] = "/** ";//.str_repeat('-',$width);;
								$lines[] = " * $object->stereotype $row->typical[$row->id].$name ";
								$lines[] = wordwrap(" * $object->bsttiNr $object->description */",$width,"\n *   ");
								foreach ($object->rules as $rule) {
									$lines[] = wordwrap(" * Conditie: $rule->Conditie",$width,"\n *   ");
									$lines[] = wordwrap(" * Actie: $rule->Waarde",$width,"\n *   ");
								}
								// $lines[] = " * ".str_repeat('-',$width).' */';
								$lines[] = " */";
								$lines[] = "";
								if ($object->{'st()'}) {
									$lines[] = write_st_code($object->{'st()'}, $row);
								}
							}
						}
					}
					$rows[]=$row;
				}
			}
			$lines = implode(PHP_EOL,$lines);
			echo "/**\n * main program for ... \n */\n\nPROGRAM main\n\n$lines\n\nEND_PROGRAM;";
		}
		die();
	}
	public function _config() {
		$api=['paths'=>null];
		// $api = yaml_parse_file(__DIR__.'/../config.local.yml');

		// debug(__DIR__,AIM_DIR_PROJECT,aim::$domainroot,AIM::$domainroot);


		$data = json_decode(preg_replace('/\xc2\xa0/i'," ",file_get_contents(__ROOT__.'/data.json')),true);
		// die(yaml_emit($data));

		$stereotypes = [
			'Configuratie-elementen'=>'configuratie_element',
			'Variabelen'=>'variabele',
			'Bedieningen'=>'bediening',
			'Besturingen'=>'besturing',
			'Autonome processen'=>'autonoom_proces',
			'Besturing'=>'lfv',
		];
		function toJS ($line) {
			$line = str_replace(['<>'],['!='], $line);
			$line = preg_replace('/(#|\b_)/','this.', $line);
			$line = preg_replace('/([^\. ]+)\[\]\.(.*)\)/','$1.every(function(){return $2;})', $line);
			$line = preg_replace('/([^\. ]+)\[\i\]\.(.*)\)/','$1.some(function(){return $2;})', $line);
			$line = preg_replace('/\.([^\. ]+)\.([^\. ]+)\[\i\] = ([^\s]+)/','.some(function(){return this.$1.$2;})', $line);
			$line = str_replace(['.this'],[''], $line);
			$line = preg_replace('/  /i',";\n", $line);
			$line = preg_replace('/  /i',' ', $line);
			return $line."\n";
		}
		function toST ($line, $name) {
			$line = preg_replace('/([^\. ]+)\[\]\.(.*)\)/','
			result := true;
			FOR count := 0 TO i BY 1 DO
			IF $2 THEN
			result := false;
			EXIT;
			END_IF;
			END_FOR;
			', $line);
			$line = preg_replace('/([^\. ]+)\[\i\]\.(.*)\)/','
			result := false;
			FOR count := 0 TO i BY 1 DO
			IF $2 THEN
			result := true;
			EXIT;
			END_IF;
			END_FOR;
			', $line);
			$line = preg_replace('/\.([^\. ]+)\.([^\. ]+)\[\i\] = ([^\s]+)/','
			result := false;
			FOR count := 0 TO i BY 1 DO
			IF $2 THEN
			result := true;
			EXIT;
			END_IF;
			END_FOR;
			', $line);
			$line = preg_replace('/\s(#|\b_)/'," ".$name."%d_", $line);
			$line = preg_replace('/(\.#|\._)/',"_", $line);
			$line = preg_replace('/(&&)/',' AND ', $line);
			$line = preg_replace('/(\|\|)/',' OR ', $line);
			$line = preg_replace('/\n /i',"\n", $line);
			// $line = preg_replace('/  /i',' ', $line);
			return $line."\n";
		}
		foreach ($data['requirements'] as $id => $req) {
			// if ($id != 'BSTTI#16855') continue;
			// if (!in_array('Verkeerslichten',$req['path'])) continue;

			// if (in_array($key,$req['path']))

			foreach ($stereotypes as $key => $stereotype) {
				if (in_array($key,$req['path'])) {
					// die($stereotype);
					$lines = array_values(array_filter(explode("\n",$req['innerText'])));
					$path = $req['path'];
					array_pop($path);
					$schemaname = str_replace(' ','_',array_pop($path));
					if ($stereotype == 'lfv') {
						break;
						if (!strstr($req['innerText'],'toestandsvariabelen te hebben')) break;
						$req['description']=$req['innerText'];
						unset($req['innerHTML'],$req['innerText']);
						$api['components']['schemas'][$schemaname] = $req;
						break;
					}
					$enum = explode(':',array_shift($lines));
					$methodname = array_shift($enum);
					$enum = trim(array_shift($arr));
					$par = explode('(',$methodname);
					$methodname = array_shift($par);
					$par = rtrim(array_shift($par),')');
					$descr = explode("Conditie:",implode(" ",$lines));
					$init = explode("Init:",trim(array_shift($descr)));
					$description = array_shift($init);
					$init = trim(array_shift($init));
					$row = array_filter([
						'stereotype' => $stereotype,
						'type' => strstr($methodname,'[]') ? 'array' : null,
						'summary' => $methodname,
						'description' => $description,
						'enum' => empty($enum) ? null : array_map(function($val){return trim($val);},explode('|',trim($enum))),
						'bsttiName' => $methodname,
						'bsttiNr' => $req['id'],
						'bsttiInit' => $init,
						'bsttiPath' => $req['path'],
						'init()' => empty($init) ? null : toJS( "return $init\n"),
						'st()' => empty($init) ? null : toST( "IF init = 1 THEN\n$init\nEND_IF;", $schemaname),
					]);
					$methodname = str_replace(['[]','#'],'',$methodname);
					$methodname = $methodname[0]=='_' ? substr($methodname,1) : $methodname;
					$methodname = ucfirst($methodname);
					if (in_array($stereotype,['configuratie_element','variabele'])) {
						$st = [];
						foreach ($descr as $i => $val) {
							$val = explode("Waarde:",$val);
							$row['rules'][] = ['Conditie' => $conditie = trim($val[0]), 'Waarde' => $actie = trim($val[1]) ];
							// $row['logic'] = $row['logic'] ?: [];
							$actie = str_replace("  ",";\n",$actie);
							$st[] = toST( in_array($conditie,['overige situaties','*']) ? "$schemaname%d_$methodname := $actie;" : "IF $conditie THEN\n$schemaname%d_$methodname := $actie;", $schemaname);
							$conditie = str_replace("=","==",$conditie);
							$row['get()'] = (empty($row['get()']) ? '' : $row['get()']) . toJS( in_array($conditie,['overige situaties','*']) ? "return $actie;" : "if ($conditie)\n{\nreturn $actie;\n}" );
						}
						if ($st) {
							$row['st()'] = implode('ELSE ',$st)."END_IF;";
						}
						$api['components']['schemas'][$schemaname]['properties'][$methodname] = $row;
					}
					else {
						$parameters = empty($par) ? [] : array_map(function($val){
							$val = explode(':',$val);
							return [
								'name' => $parNames[] = $parameterName = trim($val[0]),
								'in' => 'aim()->query',
								'description' => $parameterName,
								'required' => true,
								'schema' => !empty($val[1]) && strstr($val[1],'|')
								? [
									'type' => 'array',
									'items' => [
										'type' => 'string',
										'enum' => $enum = array_map(function($val){ return trim($val);}, explode('|',$val[1])),
										'default' => $enum[0],
									]
								]
								: [
									'type' => 'string',
								]
							];
						},explode(',',$par));
						if ($parameters) {
							$methodname .= '('.implode(',',array_map(function($val){ return $val['name'];},$parameters)).')';
						}
						array_unshift($parameters, [
							'name' => 'id',
							'in' => 'aim()->query',
							'description' => "Identifier of $schemaname",
							'required' => true,
							'schema' => [
								'type' => 'number',
							]
						]);
						$row ['parameters'] = $parameters;
						$row['operationId'] = "$schemaname(id).$methodname";
						$st = [];
						$methodname = lcfirst(str_replace('*','',$methodname));
						foreach ($descr as $val) {
							$val = explode("Acties:",$val);
							// $row['rules'] = $row['rules'] ?: [];
							$row['rules'][] = ['Conditie' => $conditie = trim($val[0]), 'Acties' => $actie = trim($val[1]) ];
							$actie = str_replace("  ",";\n",$actie);
							$st[] = toST( in_array($conditie,['overige situaties','*']) ? "$actie;" : "IF $conditie THEN\n$actie;", $schemaname);
							$conditie = str_replace("=","==",$conditie);
							$actie = str_replace(":=","=",$actie);
							$row['js()'] = (empty($row['js()']) ? '' : $row['js()']) . toJS( $conditie=='*' ? $actie : "if ($conditie)\n{\n$actie;\n}");
						}
						if ($st) {
							$row['st()'] = "IF $schemaname%d_$methodname = 1 THEN\n" . implode('ELSE ',$st)."END_IF;\nEND_IF;";
						}

						$api['components']['schemas'][$schemaname]['operations'][$methodname] = $row;
						// $api['paths']["/$schemaname(id)/$methodname"] = [
						//   'post'=> [
						//     'operationId' => "components.schemas.$schemaname.operations.$methodname",
						//     'responses'=> [
						//       '200'=> ['description'=> 'successful operation']], 'security'=> [['aliconnect_auth'=> ['read:web']]
						//     ]
						//   ]
						// ];
						// $api['components']['schemas'][$schemaname]['operations'][$methodname] = $row;
						// $api['paths']['/'.str_replace([' ','-'],'_',strtolower(implode('/',$path)))."/$schemaname(id)/$methodname"]['post'] = $row;

					}
					break;
				}
			}
		}
		// ksort($api['paths']);
		ksort($api['components']['schemas']);

		echo $content = yaml_emit($api);
		die();
		file_put_contents($fname = __DIR__.'/webroot/config.yml', $content);

		die(yaml_emit($api['components']['schemas']));
		readfile($fname);
		die();
	}
	public function _dev_create_docs_yml() {
		$data = json_decode(file_get_contents('php://input'),true);
		die(yaml_emit($data));

		// die(file_get_contents('php://input'));
	}
	public function _html_cleanup() {
		// die($_SERVER['DOCUMENT_ROOT'].$_GET['href']);
		$fname = $_SERVER['DOCUMENT_ROOT'].$_GET['href'];

		$doc = new DOMDocument();

		// load the HTML into the DomDocument object (this would be your source HTML)
		$doc->loadHTML(file_get_contents($fname));

		function removeElementsByTagName($tagName, $document) {
			$nodeList = $document->getElementsByTagName($tagName);
			for ($nodeIdx = $nodeList->length; --$nodeIdx >= 0; ) {
				$node = $nodeList->item($nodeIdx);
				$node->parentNode->removeChild($node);
			}
		}
		removeElementsByTagName('script', $doc);
		removeElementsByTagName('style', $doc);
		removeElementsByTagName('link', $doc);

		foreach (['a','span','p','div','table','tr','td','img','b','br'] as $tagName) {
			$nodeList = $doc->getElementsByTagName($tagName);
			for ($nodeIdx = $nodeList->length; --$nodeIdx >= 0; ) {
				$node = $nodeList->item($nodeIdx);
				$node->removeAttribute('class');
				$node->removeAttribute('style');
			}
		}



		// output cleaned html
		$html = $doc->saveHtml();
		$html = explode('</head>',$html);
		$html = array_pop($html);
		$html = str_replace("<p><span><p>&nbsp;</p></span></p>","",$html);
		$html = str_replace("\r\n\r\n","\r\n",$html);
		$html = str_replace("\r\n\r\n","\r\n",$html);
		$html = str_replace("\r\n\r\n","\r\n",$html);
		$html = str_replace("\r\n\r\n","\r\n",$html);
		$html = str_replace("\r\n\r\n","\r\n",$html);
		$html = str_replace("\r\n\r\n","\r\n",$html);
		$html = str_replace("\r\n\r\n","\r\n",$html);
		$html = str_replace("\r\n\r\n","\r\n",$html);
		file_put_contents($fname = str_replace('.','_clean.',$fname),$html);
		// file_put_contents($fname,$html);
		die($html);
		die($fname);


		$html = str_replace('>',">\n",str_replace(PHP_EOL,'',file_get_contents($fname)));
		// $html = preg_replace('/ style="[^"]+/i',' ',$html);
		$html = preg_replace("/( style=\'[^\']*\')/",'',$html);
		// $html = preg_replace("/ style='[^']*'/",'',$html);



		// $html = preg_replace('/ class="[^"]+"/','',$html);
		// $html = preg_replace("/ class='[^']+'/",'',$html);
		// $html = preg_replace("/ class=[\w]+/",'',$html);
		$remove = [
			'<!--' => '-->',
			// '<![if !vml]>' => '<![endif]>',
		];
		foreach ($remove as $start => $end) {
			$arr = explode($start,$html);
			$html = [array_shift($arr)];
			foreach ($arr as $chap) {
				$html[] = explode($end,$chap)[1];
			}
			$html = implode('',$html);
		}

		// $html = preg_replace("/\r\n/i",'',$html);
		// $html = preg_replace("/<!--([^-->]*)-->/i",'',$html);
		// header('Content-Type: text/html; charset=utf-8');
		// $html = utf8_encode($html);
		// $html = iconv("CP1252", "UTF-8", $html);
		echo $html;
		die();
		die();
		die(iconv("CP1252", "UTF-8", $html));
		die (mb_convert_encoding($html, "HTML-ENTITIES", "UTF-8"));

		// die(file_get_contents('php://input'));
	}
	public function _xml() {
		$content = file_get_contents('php://input');
		$name = $_SERVER['DOCUMENT_ROOT'].'/shared/upload/'.date('YmdhIs').'.xml';
		file_put_contents($name, $content);
		die($name);
	}
	public function _yaml() {
		$content = file_get_contents('php://input');
		// debug($content, $_POST);
		die(yaml_emit(json_decode($content, true)));
	}
	public function _API_key() {
		// debug($_POST, aim()->access);
		$keys = array_merge($_GET,$_POST);
		extract($keys);
		// extract($_GET);
		// extract($_POST);
		// $client_secret = $_POST['client_secret'];
		unset($keys['client_secret'], $keys['expires_after'], $keys['request_type']);
		$options = array_replace(aim()->access, array_filter($keys), [
			'iss' => AIM_DOMAIN.".aliconnect.nl", // Audience, id of host, owner of scope
			// 'aud' => (int)$account->ClientID, // Audience, id of host, owner of scope
			// 'azp' => (int)$account->ClientID, // From config.json
			// 'client_id' => (int)$account->ClientID, // Client Identifier // application
			// 'scope' => implode(' ',[$scope, $account->GrantScope]),//trim($scope . (isset($scope) ? ' '.$scope->scope : '' )), // Scope Values
			'exp' => time() + 24 * $expires_after, // Expiration Time
			'iat' => time(), // Issued At
		]);
		// die($client_secret);0
		// debug(aim()->access, getallheaders());
		// return die(jwt_encode(aim()->access, aim()->client_secret ));
		return [
			'api_key'=> jwt_encode($options, aim()->client_secret),
			'options'=> $options,
		];
			// debug($_POST);
		// $content = file_get_contents('php://input');
		// $name = $_SERVER['DOCUMENT_ROOT'].'/shared/upload/'.date('YmdhIs').'.xml';
		// file_put_contents($name, $content);
		// die($name);
	}

  public function _build() {
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

    if (isset($_GET['setup'])){
    	//die(json_encode($config));
    	// oplossen host enz, geen index.php gestart!!!
    	global $aim;
    	$aim->host=$_GET['host'];
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

    if (isset($_GET['getAccount'])){
    	$row=fetch_object(query($q="EXEC api.getAccount @hostId='$aim->hostID', @userId='$aim->userID',@select=1"));
    	//$row->q=$q;
    	header('Content-type: application/json');
    	if (isset($_GET[download])) {
        header("Content-disposition: attachment; filename=aliconnectAccount$row->accountId$row->accountName".date("Ymd_hi").".json");
      }
    	die(json_encode($row));
    }

    if (isset($_GET['setAccount'])){
    	$dbs=$config->dbs;
    	if($_SERVER['SERVER_NAME']=="aliconnect.nl" || $dbs->server=="aliconnect.nl")die("User CREATE ON SERVER aliconnect.nl NOT ALLOWED");
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

    if (isset($_GET['import'])){
    	$dbs=$config->dbs;
    	if($dbs->server!='localhost')die("Setup on $dbs->server not allowed. Only on localhost");

    	//if($_SERVER[SERVER_NAME]=="aliconnect.nl" || $dbs->server=="aliconnect.nl")die("IMPORT ON SERVER aliconnect.nl NOT ALLOWED");
    	$aim->host=$_GET['host'];
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
    if (isset($_GET['loadimport'])){
    	$dbs=$config->dbs;
    	if($_SERVER['SERVER_NAME']=="aliconnect.nl" || $dbs->server=="aliconnect.nl")die("IMPORT ON SERVER aliconnect.nl NOT ALLOWED");
    	$sql=file_get_contents(__DIR__."/sql/aim.import.sql");
    	querysql($sql);
    	die("<plaintext>".$sql);
    }

    if (strtolower($_SERVER['REQUEST_METHOD'])=='put') {
    	$put=json_decode(file_get_contents('php://input'));
    	die("Data uploaded".json_encode($put->class));
    }

    if (isset($_GET['phplibs'])) {
    	$files = array_filter(scandir(__DIR__."/"),function($var){return preg_match('/(^\.|^_| Copy| kopie|test|pdfdoc)/',$var)!=1 && preg_match('/(.php)/',$var);});
    	die(json_encode(array_values($files)));
    }

    if (isset($_GET['phpsource'])) {
        die(highlight_file(__DIR__."/".$_GET['phpsource'].".php"));
    }

    if (isset($_GET['phplib'])) {
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

    if (isset($_GET['php'])) {
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

    if (isset($_GET['tables'])){
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

    if (isset($_GET['lib'])){
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

    if (isset($_GET['sqljson'])){
    	die(file_get_contents(__DIR__."/sql/sql.json"));
    }

    if (isset($_GET['sql'])){
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


    if ($_GET['rootID']) {
      $json = (object)[
        'hostID' => null,
        'rootID' => $_GET['rootID'],
        'class' => null,
        'attributeName' => null,
        'items' => null,
      ];
    	$filename.="_root".$_GET['rootID'];
    	$res=aim()->query("SET NOCOUNT OFF;EXEC api.getBuild @rootID=".$_GET['rootID']);
      while($row=sqlsrv_fetch_object($res)){
        if ($row->classID == 0) {
          $json->class->{$row->PrimaryKey} = $row->name;
        } else {
          $json->items->{$row->PrimaryKey} = $row;
        }
      }
    	sqlsrv_next_result($res);
    	while($row=sqlsrv_fetch_object($res)){
        $json->attributeName->{$row->fieldID} = $row->name;
        $json->items->{$row->id}->values->{$row->name}=$row;
      }

    	// while($row=fetch_object($res))$json->class->{$row->id}=$row->name;
    	// next_result($res);
    	// while($row=fetch_object($res))$json->attributeName->{$row->id}=$row->name;
    	// next_result($res);
    	// while($row=fetch_object($res)){$json->items->{$row->id}=cleanrow($row);unset($row->id);unset($row->obj);}
    	// next_result($res);
    	// while($row=fetch_object($res))$json->items->{$row->id}->values->{$row->name}=$row;
    	//die (json_encode($json));
    }
    if ($_GET['hostID']){
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
    if(isset($_GET['download'])) {
      header("Content-disposition: attachment; filename=aliconnect_export_".date("Ymd_hi")."$filename.json");
    }
    die (json_encode($json,JSON_PRETTY_PRINT));
	}

  public function _cleanup() {
    if ($_GET['task'] === 'children') {
      aim()->query("
      update item.dt set hasChildren = null where hasChildren = 1 and id not in (select distinct masterid from item.dv)
      update item.dt set hasChildren = 1 where hasChildren is null and id in (select distinct masterid from item.dv)
      ");
    }
    die('DONE');
    // $res = aim()->query("SELECT id FROM item.dv WHERE hasChildren = 1 and id not in (SELECT DISTINCT masterID FROM item.children)");
    // while ($row = sqlsrv_fetch_object($res)) {
    //
    // }
  }

  public function _control_data() {
    ini_set('display_errors', 0);
    // debug(1);
    $aim = aim()->api;
    $sub = aim()->access['sub'];
    // debug(555, AIM::$access, getallheaders());
    // if (!$sub) debug('error');
    // debug(AIM::$api);

    $res = aim()->query($q = "SET NOCOUNT ON
      ;WITH P(level,NameID,ItemID,LinkID)
      AS (SELECT 0,I.NameID,I.ItemID,I.LinkID
      FROM attribute.dt I
      WHERE I.NameID = 980 AND I.ItemID = $sub
      UNION ALL
      SELECT level+1,I.NameID,I.ItemID,I.LinkID
      FROM P
      INNER JOIN attribute.dt I ON I.NameID = 980 AND I.LinkID = P.ItemID and level<10
      )
      SELECT * FROM P
      INNER JOIN item.vw I ON I.id=P.itemid
    ");
    // die($q);
    // debug($sub);
    // die($q);
    // debug($aim);
    while ($row = sqlsrv_fetch_object($res)) {
      // debug($row);
      $row->{'@id'} = "$row->schema($row->ID)";
      // $items[$row->LinkID]->{$row->schema}[] = $items[$row->ID] = $row;
      $items[$row->LinkID]->Children[] = $items[$row->ID] = $row;
      $aim->data->value[] = $row;
      if (isset($aim->components->schemas->{$row->schema})) {
        $schema = $schemas->{$row->schema} = $aim->components->schemas->{$row->schema};
        if (isset($schema->operations)) {
          foreach ($schema->operations as $operationName => $operation) {
            $paths->{'/'.$row->schema.'({id})/'.$operationName}->post = $operation;
          }
        }
      }
    }
    // debug($paths,$schemas);
    unset($aim->om,$aim->css,$aim->Docs);
    $aim->tags = [];
    $aim->paths = $paths;
    $aim->components->schemas = $schemas;
    $aim->value[] = $items[$sub];
    // debug($aim);
    header('Content-type: application/json');
    // header('OData-Version: 4.0');
    die(json_encode($aim, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
    // debug("jaaacontrol_data111",$_GET['id']);
  }
  public function _data() {
    // die("THIS IS DATA");
    $ID = $_GET['id'];
    $res = aim()->query($q = "SET NOCOUNT ON
    DECLARE @ID INT
    SET @ID = $ID
    DECLARE @T TABLE(level INT, NameID INT, ItemID BIGINT, LinkID BIGINT)

    ;WITH P(level,NameID,ItemID,LinkID)
    AS (SELECT -1,I.NameID,I.ItemID,I.LinkID
    FROM attribute.dt I
    WHERE I.NameID = 980 AND I.ItemID = @ID
    UNION ALL
    SELECT level-1,I.NameID,I.ItemID,I.LinkID
    FROM P
    INNER JOIN attribute.dt I ON I.NameID = 980 AND I.ItemID = P.LinkID and level>-10
    )
    INSERT @T SELECT * FROM P

    ;WITH P(level,NameID,ItemID,LinkID)
    AS (SELECT 0,I.NameID,I.ItemID,I.LinkID
    FROM attribute.dt I
    WHERE I.NameID = 980 AND I.ItemID = @ID
    UNION ALL
    SELECT level+1,I.NameID,I.ItemID,I.LinkID
    FROM P
    INNER JOIN attribute.dt I ON I.NameID = 980 AND I.LinkID = P.ItemID and level<10
    )
    INSERT @T SELECT * FROM P

    SELECT [schema],I.ID,UID,Title,Subject,Summary FROM (SELECT DISTINCT ItemID FROM @T) T INNER JOIN item.vw I ON I.id = T.ItemID

    ;WITH P( level,NameID,ItemID,LinkID,RootID)
    AS (SELECT -1,I.NameID,I.ItemID,I.LinkID,I.ItemID
    FROM attribute.dt I
    INNER JOIN @T T ON I.NameID = 1157 AND I.ItemID = T.ItemID
    UNION ALL
    SELECT level-1,I.NameID,I.ItemID,I.LinkID,P.RootID
    FROM P
    INNER JOIN attribute.dt I ON I.NameID = 1157 AND I.LinkID = P.ItemID and level>-10
    )
    SELECT T.RootID ItemID,A.NameID,A.AttributeName,A.Value,A.LinkID FROM P T INNER JOIN attribute.vw A ON A.ItemID = T.RootID
    ");
    // die($q);
    $data = ['items' => [], 'attributes' => [] ];
    while (	$row = sqlsrv_fetch_object($res)) array_push($data['items'],$row);
    sqlsrv_next_result($res);
    while (	$row = sqlsrv_fetch_object($res)) array_push($data['attributes'],$row);
    header('Content-type: application/json');
    // header("Content-disposition: attachment; filename=aim-$ID-".date("Ymdhis").".json");
    die(json_encode($data));
  }
  public function _item_map_v1() {
    $id = preg_replace('/.*\((\d+)\).*/','$1',$_SERVER['REQUEST_URI']);
    // debug($id);
    $res = aim()->query("DECLARE @rootID BIGINT
      SET @rootID = $id
      DECLARE @tree TABLE (level tinyint, id int, masterId int, srcId int)
      ;with tree (level, id, masterId, srcId) AS (
      	SELECT 0, item.id, item.masterId, isnull(item.inheritedId,item.srcId) FROM item.dv item
      	WHERE id = @rootID
      	UNION ALL
      	SELECT level+1, item.id, item.masterId, isnull(item.inheritedId,item.srcId) FROM item.dv item
      	INNER JOIN tree ON item.masterId=tree.id
      )
      insert @tree select * from tree

      select
      	tree.level,
      	item.tagname(item.id) tagname,
      	--item.path(item.id) path,
      	--aim.item.path(item.id) path1,
        item.link(item.id) as connection,
      	substring(item.link1(i1.id),62,999) as connection1,
      	item.schemapath(item.id) as schemaPath,
      	item.getattributevalue(item.id, 'Tag') as tag,
      	item.getattributevalue(item.id, 'Prefix') as prefix,
      	item.getattributevalue(item.id, 'Name') as name,
      	item.header0,
      	item.header1,
      	item.header2,
      	item.id
      from
      	@tree tree
      	inner join item.dv item on item.id = tree.id
      	left outer join aim.item.tbl i1 on i1.masterid = item.masterid and i1.name = item.getattributevalue(item.id, 'Name')

      order by item.tagname(item.id)
      ;with
      src (level, id, srcId) AS (
      	SELECT 1, id, srcId
      	FROM @tree where srcId is not null
      	UNION ALL
      	SELECT level+1, item.id, isnull(item.inheritedId,item.srcId)
      	FROM aim.item.tbl item
      	INNER JOIN src ON item.id=src.srcid
      ),
      name (id, name) as (
      	select id,name from aim.item.attributename
      ),
      attributes (ItemID, NameID, AttributeName, Value, LinkID) as (
      	select a.id, a.fieldId, name.name, isnull(l.title, a.value), a.itemId
      	from aim.item.attribute a
      	inner join name on name.id = a.fieldId
      	left outer join aim.item.tbl l on l.id = a.itemid
      	where a.value is not null or a.itemid is not null
      ),
      itemattr (level, ItemID, NameID, AttributeName, Value, LinkID, isOwnProperty) as (
      	select 0, i.id, NameID, AttributeName, Value, LinkID, 1
      	from attributes a
      	inner join @tree i on a.ItemID = i.id
      ),
      detailattr (level, ItemID, NameID, AttributeName, Value, LinkID, isOwnProperty) as (
      	select 0, i.id, null, 'link', aim.item.path(i.detailid), i.detailid, 0
      	from aim.item.tbl i
      	where detailid in (select id from @tree)
      	union
      	select 0, i.detailid, null, 'link', aim.item.path(i.id), i.id, 0
      	from aim.item.tbl i
      	where detailid in (select id from @tree)
      ),
      derivedattr (level, ItemID, NameID, AttributeName, Value, LinkID, isOwnProperty) as (
      	select s.level, s.id, a.NameID, a.AttributeName, a.Value, a.LinkID, null
      	from attributes a
      	inner join src s on a.ItemID = s.srcid
      	left outer join itemattr ia on ia.itemId = s.id and ia.nameId = a.nameId
      	where ia.itemId is null
      )
      select * from itemattr
      union select * from detailattr
      union select * from derivedattr
      order by level desc
    ");
    while ($row = sqlsrv_fetch_object($res)) {
      $items->{$row->id} = $row = (object)array_filter(itemrow($row),function ($v){return !is_null($v);});
    }
    sqlsrv_next_result($res);
    while ($row = sqlsrv_fetch_object($res)) {
      // $items->{$row->ItemID}->{$row->AttributeName} = $row;
      $items->{$row->ItemID}->{$row->AttributeName} = $row->Value;
    }
    header('Content-type: application/json');
    die(json_encode(['value'=>array_values((array)$items)], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
  }

  public function _camfile () {
  	// debug($_GET);
  	return sqlsrv_fetch_object(aim()->query(
  		"SELECT TOP 1 filename,startDateTime,camId
  		FROM aimhis.dbo.camfile
  		WHERE camId = %d AND startDateTime < %s
  		ORDER BY startDateTime DESC",
  		$_GET['camId'],
  		urldecode($_GET['startDateTime'])
  	));
  	// debug($row);
  }
  /** @function request_type_uploadfile
  * Nodig voor aliconnect upload file
  * url 'http://alicon.nl/v1/api?request_type=uploadfile'
  * @param src url of file
  * @param data base64 encode content of file
  */
  public function _mailtest() {
  	aim()->mail([
  		// 'send'=> 1,
  		'to'=> "max.van.kampen@outlook.com",
  		'bcc'=> "max.van.kampen@alicon.nl",
  		// 'Subject'=> __('qr_registratie'),
  		'chapters'=> [
  			['title'=> 'test']
  		],
  	]);
  	debug (1);
  }

  private function _corona_list ($filter) {
		if (empty(aim()->auth->id)) throw new Exception('Unauthorized', 401);
		$res = aim()->query(
			"SELECT R.email, C.email owner_email, R.data, R.departure FROM aimhis.corona.reg R INNER JOIN aimhis.dbo.qr AS C ON C.code = R.code WHERE C.email = '%s'",
			aim()->auth->id['email']
		);
		$rows=[];
		while ($row = sqlsrv_fetch_object($res)) {
			$data = json_decode($row->data);
			$data->departure = $row->departure;
			$rows[] = $data;
		}
		return $rows;
	}
  public function _my_corona_list () {
		return $this->corona_list("C.email = '%s'");
	}
  public function _my_corona_contact_list () {
		return $this->corona_list("R.email = '%s'");
	}

}
class oauth {
	public function __construct () {
    $_POST['msg'] = '';
    $this->url = parse_url($_SERVER['REQUEST_URI']);
    $this->path = $this->url['path'];
    if ($_SERVER['REQUEST_METHOD'] === 'GET' && $this->path !== '/') {
      die(header('Location: /?'.http_build_query($_GET)));
    }
    $this->time = time();
    $this->redirect_uri = get('redirect_uri') ?: 'https://aliconnect.nl/';
    $this->client_name = 'aliconnect';
    if (isset($_GET['client_id'])) {
      $this->client_name = $_GET['client_id'];
    } else if ($this->redirect_uri) {
      $url = parse_url($this->redirect_uri);
      $this->client_name = explode('.',$url['host'])[0] ?: 'aliconnect';
    }
    $this->client_secret = aim()->client_secret;
    $this->mobile_browser = mobile_browser();
    $_GET['ip'] = $this->ip = GetRealUserIp();
    $this->account = new account($this);
    // debug(get('redirect_uri', (array)$this), $this->account->data);
	}
  private function redirect($get) {
    die(header('Location: ?'.http_build_query(array_replace($_GET,$get))));
  }
  private function response_code() {
		return jwt_encode([
      'expires_in' => ACCESS_TOKEN_EXPIRES_IN,
			'token_type' => 'Bearer',
			'access_type' => 'offline',
			'client_id' => $this->account->get('client_id'),
			'aud' => $this->account->get('clientId'),
			'sub' => $this->account->get('accountId'),
			'scope' => $this->account->get('scope'),
			'nonce' => get('nonce'),
			'exp' => $this->time + 120,
			'iat' => $this->time,
			// 'azp' => (int)$account->ClientID, // From config.json
    ], $this->client_secret);
	}
	public function index() {
		// if (get('prompt') === 'login_qr') {
		// 	// debug(2);
		// 	return;
		// }
		// // debug(1);
		// if (empty($_GET['redirect_uri']) || empty($_GET['response_type']) || empty($_GET['scope'])) {
		// 	die(header('Location: https://aliconnect.nl?prompt=login'));
		// }
		// if (get('prompt') !== 'login') {
    //   die(header('Location: /?'.http_build_query(array_replace($_GET,['prompt'=>'login']))));
    // }
	}
  public function get() {
    // debug(get('nonce'), $this->account->data);
    if (get('prompt') === 'logout' && get('nonce')) {
      aim()->query("UPDATE attribute.dt SET userId=NULL WHERE nameid=2181 AND value=%s", get('nonce'));
    }
    if (!get('client_id')) {
      die(header('Location: https://aliconnect.nl'));
    }
    if ($this->redirect_uri && $this->redirect_uri != $this->account->data->redirect_uri) {
      // debug(1, $this->account->data, get('nonce'));
      die('redirect_uri is invalid');
      // die(http_response_code(412));
    }
    if (get('prompt') === 'login' && get('nonce') && get('response_type') === 'code') {
      $row = sqlsrv_fetch_object(aim()->query("SELECT * FROM attribute.dt WHERE nameid=2181 AND userId IS NOT NULL AND value=%s", get('nonce')));
      if ($row) {
        $this->account->get_account(['sub'=>$row->ItemID]);
        if ($this->account->scope_accepted === get('scope')) {
          die(header("Location: $this->redirect_uri?".http_build_query([
            'code'=> $this->response_code(),
            'state'=> get('state'),
          ])));
        }
      }
    }
    // debug(1);
    // debug(get('response_type'), $this->account->data);
    // debug(2, $this->account->data, get('nonce'));
		// if (!get('prompt')) {
    //   die(header('Location: /?'.http_build_query(array_replace($_GET,['prompt'=>'login']))));
    // }
    // $prompt=get('prompt');
    // if (get('response_type') === 'code') {
    //   if ($prompt !== 'login') {
    //     die(header('Location: /?'.http_build_query(array_replace($_GET,['prompt'=>'login']))));
    //     // die(header("Location: $this->redirect_uri?".http_build_query(['code'=>$this->code])));
    //     // if ($this->inScope) {
    //     //   die(header("Location: $this->redirect_uri?".http_build_query(['code'=>$this->code])));
    //     // }
    //     // if ($this->prompt === 'login') {
    //     //   die(header('Location: /?'.http_build_query(array_replace($_GET,['prompt'=>'accept']))));
    //     // }
    //   }
    // } else if (get('prompt') !== 'login') {
    //   die(header('Location: /?'.http_build_query(array_replace($_GET,['prompt'=>'login']))));
    // }
    // else {
    //   if ($this->prompt !== 'login') {
    //     die(header('Location: /?'.http_build_query(array_replace($_GET,['prompt'=>'login']))));
    //   }
    // }
    // if (!$this->prompt) {
    //   die(header('Location: /?'.http_build_query(array_replace($_GET,['prompt'=>'login']))));
    // }
    //
    //
    //
    // if ($this->id_token) {
    //   if ($this->response_type === 'code') {
    //     if ($this->inScope) {
    //       die(header("Location: $this->redirect_uri?".http_build_query(['code'=>$this->code])));
    //     }
    //     if ($this->prompt === 'login') {
    //       die(header('Location: /?'.http_build_query(array_replace($_GET,['prompt'=>'accept']))));
    //     }
    //   }
    //   else {
    //     if ($this->prompt !== 'login') {
    //       die(header('Location: /?'.http_build_query(array_replace($_GET,['prompt'=>'login']))));
    //     }
    //   }
    //   if (!$this->prompt) {
    //     die(header('Location: /?'.http_build_query(array_replace($_GET,['prompt'=>'login']))));
    //   }
    // }
    // else {
    //   if ($this->prompt !== 'login') {
    //     die(header('Location: /?'.http_build_query(array_replace($_GET,['prompt'=>'login']))));
    //   }
    // }
	}
	public function post() {
    $prompt=get('prompt');
    $_POST['prompt'] = '';
    $account = $this->account;
    $chapters = [];

    if (get('prompt') === 'mobile') {
      $this->account->get_account(aim()->access);
      $account->add_nonce();
      if ($this->account->scope_accepted === get('scope')) {
        return [
          'url'=> "$this->redirect_uri?".http_build_query([
            'code'=> $this->response_code(),
            'state'=> get('state'),
          ]),
        ];
      } else {
        return [
          'reply'=> [
            'prompt'=> 'scope_accept',
            'param'=> $_GET,
          ],
        ];
        // return [
        //   'prompt'=> 'accept',
        // ];
      }
    }

    // controleer of gebruiker is ingelogt
    if (isset($_POST['request_type'])) {
      $this->account = new account(aim()->access);
      if (!$this->account->signin_ok) {
        die(http_response_code(401));
      }
      return [];
    }


    if (get('accountname')) {

      $account->set_nonce();

      if (!$account->get('account_id')) {
        if ($prompt === 'create_account') {
          $this->account->create_account($_POST);
        } else {
          // $a=json_encode($account, JSON_PRETTY_PRINT);
          // debug($account);
          return array_replace($_POST, ["password"=>"", "msg"=>"Account bestaat niet. <a href='#?prompt=create_account'>Maak er een</a>"]);
        }
      }

      if ($prompt === 'email_code' || $prompt === 'set_password') {
				// debug(1, $account->data);
        if (!$account->code_ok) {
          return array_replace($_POST, ['msg'=>'Verkeerde code. <a href="#?prompt=send_email_code">Stuur nieuwe code</a>']);
        }
        $time = strtotime($account->code_ok);
        if ($time-$this->time < -120) {
          return array_replace($_POST, ["msg"=>"code verlopen, vraag nieuwe code aan"]);
        }
				$account->email_verified = $account->accountname;
        $account->add_nonce();
        if ($prompt === 'set_password' && get('password')) {
          $account->set_password(get('password'));
        } else {
          if ($account->password_ok === null) {
            return array_replace($_POST, ["prompt"=>"set_password", "msg"=>"geen wachtwoord, voer in"]);
          }
        }
        $account->code = null;
      }
			if ($account->password_ok === 0) {
        if ($prompt === 'password') {
          return array_replace($_POST, ['msg'=>'Verkeerd wachtwoord']);
        }
        return array_replace($_POST, ['prompt'=>'password']);
      }
      if ($prompt === 'send_email_code') {
        $account->set('code', $code = rand(10000,99999));
        aim()->mail([
          'to'=> get('accountname'),
          'bcc'=> 'max.van.kampen@alicon.nl',
          'chapters'=> [["title"=>"code ".$code]],
        ]);
        return array_replace($_POST, ['prompt'=>'email_code']);
      }
      if (!$account->email_verified || $account->email_verified  !== $account->accountname || $account->password_ok === null) {
				return array_replace($_POST, ['prompt'=>'send_email_code']);
      }
      if ($prompt === 'sms_code') {
        if (!$code_ok = $account->code_ok) {
          return array_replace($_POST, ['msg'=>'verkeerde code']);
        }
        $time = strtotime($code_ok);
        if ($time-$this->time < -1200) {
          return array_replace($_POST, ["msg"=>"code verlopen, vraag nieuwe code aan"]);
        }
        $account->add_nonce();
        $account->code = null;
        if ($account->phone_number_verified != $account->phone_number) {
          $account->phone_number_verified = $account->phone_number;
        }
      } else if ($prompt === 'send_sms_code') {
        $account->set('code', $code = rand(10000,99999));
        aim()->sms('+'.$account->phone_number, __('sms_code_content', $code), __('sms_code_subject'));
        return array_replace($_POST, ['prompt'=>'sms_code']);
      } else if (!$account->nonce) {
        if ($account->phone_number && $account->phone_number_verified) {
          return array_replace($_POST, ['prompt'=>'send_sms_code']);
        } else {
          return array_replace($_POST, ['prompt'=>'send_email_code']);
        }
      }
      if (!$account->phone_number_verified) {
        return array_replace($_POST, ['prompt'=>'send_sms_code']);
      }

      if ($account->ip != $this->ip) {
        $chapters[] = [
          'title'=>"Aliconnect aanmelding op nieuwe locatie",
          'content'=>"Aliconnect aanmelding op nieuwe locatie: $this->ip",
        ];
        // debug(1, $prompt, $account->data);
        aim()->setAttribute([
          'itemId'=>$account->accountId,
          'name'=>'ip',
          'value'=>$this->ip,
          'max'=>9999,
        ]);
      }
      if ($chapters) {
        aim()->mail([
          // 'Subject'=> "Aliconnect aanmelding op nieuw systeem",
          'to'=> $account->email_verified,
          'bcc'=> 'max.van.kampen@alicon.nl',
          'chapters'=> $chapters,
        ]);
      }
      // debug($prompt, $account->data);
			if ($prompt === 'phone_number' && get('phone_number')) {
        $account->phone_number = phone_number(get('phone_number'));
      }
      if (!$account->phone_number) {
        return array_replace($_POST, ["prompt"=>"phone_number", "msg"=>"geen mobiel nummer, voer in"]);
      }
      $account->add_nonce();
    }
    if (!get('accountname') && empty($account->access)) {
      return array_replace($_POST, ['prompt'=>'login', 'a'=>$account]);
    }
    if (get('response_type') === 'code') {
			if ($prompt !== 'consent' && $account->get('scope_accepted') === get('scope')) {
        return array_replace($_POST, [
          'id_token'=>$account->get_id_token(),
          'nonce'=>$account->get('nonce'),
          'socket_id'=>$_GET['socket_id'],
          'url'=>$this->redirect_uri.'?'.http_build_query([
            'code'=> $this->response_code(),
            'state'=> get('state'),
          ])
        ]);
      }
			if ($prompt !== 'accept') {
				return array_replace($_POST, ['prompt'=>'accept']);
			}
    }
    if (get('accept') === 'allow') {
      $scope_accepted = [];
      foreach ($_POST as $key => $value) {
        if ($value === 'on') {
          $scope_accepted[] = $key;
        }
      }
      $scope_accepted = preg_replace(
        '/(_)(read|write|add)/i', '.$2', implode(' ',$scope_accepted)
      );
      $account->set('scope_accepted', $scope_accepted, ['hostId'=>$account->get('clientId')]);
      return array_replace($_POST, [
        'id_token'=>$account->get_id_token(),
        'nonce'=>$account->get('nonce'),
        'socket_id'=>$_GET['socket_id'],
        'url'=>$this->redirect_uri.'?'.http_build_query([
          'code'=> $this->response_code(),
          'state'=> get('state'),
        ])
      ]);
    }
    // return array_replace($_POST, ['url'=>'https://aliconnect.nl?prompt=login']);
    return array_replace($_POST, [
      'id_token'=>$account->get_id_token(),
      'nonce'=>$account->get('nonce'),
      'url'=>'/?prompt=login',
    ]);
	}

	public function log ($line, $par = null, $par2 = null) {
		if (empty($this->chapters)) {
			$this->chapters = [];
		}
		$title = __($line.'_title', $par, $par2);
		// $this->subject = $this->subject ?: $title;
		array_push($this->chapters, [
			'title'=> $title,
			'content'=> __($line.'_content',$par,$par2),
		]);
	}
	public function reply($response = []) {
		// debug($response);

		if (isset($this->chapters)) {
			aim()->mail($a = [
				// 'Subject'=> $this->subject,
				'to'=> $_POST['accountname'],
				'bcc'=> 'max.van.kampen@alicon.nl',
				'chapters'=> $this->chapters,
			]);
		}
		return array_replace($_POST, $response ?: []);
	}
	public function delete_account() {
		if ($this->id['sub']) {
			aim()->query(
				"UPDATE item.dt SET DeletedDateTime=GETDATE() WHERE Id=%d",
				$this->id['sub']
			);
		}
		$this->logout();
		$this->log('delete_account');
		return [
			'url' => '/?prompt=login',
		];
	}
	public function getResponse ($url = '') {

	}
	public function state () {
		if (!isset(aim::$access)) return;
		if (!isset(aim::$access->nonce)) return;
		$nonce = aim::$access->nonce;
		$row = sqlsrv_fetch_object(aim()->query("SELECT * FROM [auth].[nonce] WHERE nonce='$nonce';"));
		if ($row->sub != aim::$access->sub) throw new Exception('Unauthorized', 401);
		return;
	}
	public function api_key () {
		// debug($_POST);
		if (!empty($mac)) {
			$mac = str_replace(":","-",$mac);
			if (empty($sub = sqlsrv_fetch_object(aim()->query($q="SELECT ItemID,ID,HostID FROM item.attribute WHERE NameID=2020 AND Value='$mac' AND UserID IS NULL")))) throw new Exception("Forbidden", 403);
			if (empty($client = sqlsrv_fetch_object(aim()->query("EXEC [account].[get] @HostName='$client_id'")))) throw new Exception("Unauthorized", 401);
			aim()->query("UPDATE item.attribute SET UserID=$sub->ItemID WHERE ID=$sub->ID");
			$api_key = [
				'iss' => $client->ClientName.'.aliconnect.nl', // Audience, id of host, owner of scope
				'client_id' => $client->ClientID,
				'sub' => $sub->ItemID,
				'aud' => $sub->HostID,
				'auth_time' => time(),
				'exp' => time() + 60,
				'iat' => time(),
				// 'client_secret' => $client->client_secret,
			];
		}
		if (empty($api_key)) throw new Exception('Unauthorized', 401);
		return ['api_key' => jwt_encode($api_key, $client->client_secret)];
	}
	private function check_domain_contact () {
		// /*
		// * Controleer of er een contact is aangemaakt op het Domein
		// * Is dit niet het geval maar de gebruiker is de eigenaar dan is de het gebruikers account de contact
		// * Is er geen contact dan foutmelding
		// */
		// if (!$this->account->ContactID) {
		// 	if ($this->account->account_id === $this->account->OwnerID) {
		// 		$this->account->ContactID = $this->account->account_id;
		// 	} else {
		// 		aim()->query(
		// 			"INSERT INTO item.dt (HostId,ClassId,SrcId) VALUES (%d,%d,%d)",
		// 			$this->account->ClientID,
		// 			1004,
		// 			$this->account->account_id,
		// 		);
		// 		$this->account = sqlsrv_fetch_object(aim()->query(
		// 			"EXEC [account].[get] @HostName=%s, @account_id=%s",
		// 			$param['client_id'],
		// 			$this->id['sub'],
		// 		));
		// 		// debug($this->account);
		// 		// throw new Exception('No contact ID on host', 401);
		// 	}
		// }
	}
	private function check_code () {
		/*
		 * Controleer of de scope al is goedegekeurd door de gebruiker.
		 * Ook een scope binnen de geaccordeerde is direct goed.
		 * Zo JA, dan direct doorgaan naar applicatie
		 * Zp NEE, dan scope verifieren via login applicatie
		*/
    // debug($this->account);
		$account = sqlsrv_fetch_object(aim()->query(
			"EXEC [account].[get] @hostName=%s, @account_id=%s",
			$this->account->client_id,//$_GET['client_id'],
			$this->id['sub']
			// aim()->auth->id['sub'],
		));
		$scope_requested = $account->scope_requested ? explode(' ', $account->scope_requested) : [];
		$scope = explode(' ', $this->scope);
		// debug($scope);
    // debug($account, $scope, $scope_requested);
		if (!array_diff($scope, $scope_requested)) {
			return $this->code = $this->get_code(['nonce'=>$_COOKIE['nonce']]);
		}
	}
	public function response_type_socket_id () {
		$id = get_token($_GET['id_token'], $this->client_secret);
		aim()->query(
			"UPDATE auth.nonce SET socket_id=%s,state=%s,LastModifiedDateTime=GETDATE() WHERE nonce=%s AND sub=%d",
			$_GET['socket_id'],
			$_GET['state'],
			$id['nonce'],
			$id['sub']
		);
	}
	public function response_type_socket_id_by_email() {
		// debug(1888);

		$account = sqlsrv_fetch_object(aim()->query(
			"EXEC [account].[get] @accountname=%s",
			$_GET['email']
		));
		$row = sqlsrv_fetch_object(aim()->query(
			"SELECT TOP 1 socket_id,state FROM auth.nonce WHERE sub=%d AND MobileBrowser=1 AND SignInDateTime IS NOT NULL ORDER BY LastModifiedDateTime DESC",
			$account->account_id
		));
		return [
			'sub'=> $account->account_id,
			'socket_id'=> $row->socket_id,
			'state'=> $row->state,
		];
	}
	public function response_type_code () {
		if ($_GET['id_token']) {
			$this->id = get_token($_GET['id_token'], $this->client_secret);
			// debug($this->id, $_GET['id_token'], $this->client_secret);
			$row = sqlsrv_fetch_object(aim()->query(
				"SELECT sub FROM auth.nonce WHERE nonce=%s",
				$this->id['nonce']
			));
			if ($row->sub) {
				$this->account = sqlsrv_fetch_object(aim()->query(
					"EXEC [account].[get] @account_id=%s",
					$row->sub
				));
				$this->set_login();
			}
		}

		// debug(1, $_GET, $_COOKIE, $this->id_token);
    if ($this->id_token) {
      if ($_GET['prompt'] === 'create_account') {
        // debug(1, $this->id);
        if ($_GET['redirect_uri']) {
          $code = $this->get_code(['nonce'=>$_COOKIE['nonce']]);
          // debug(1, $code);
          die(header('Location: '.explode('?',$_GET['redirect_uri'])[0].'?'.http_build_query([
            'code'=> $code,
            'state'=> $_GET['state']
          ])));
        }
      }
      else if ($_GET['prompt'] === 'consent') {
        $_GET['prompt'] = 'accept';
        die(header('Location: ?'.http_build_query($_GET)));
      }
      else if ($code = $this->check_code()) {
        // debug(1, $this->id_token);
        /*
        * Indien socket_id aanwezig is dan communicatie via websocket.
        * Dus wel opstarten applicatie en meegeven code
        */
        // debug(1);
        if (isset($_GET['socket_id'])) {
          $_GET['redirect_uri'] = '/';
          $redirect_uri = $_GET['redirect_uri'].'?'.http_build_query([
            'code'=> $code,
            'state'=> $_GET['state'],
            'socket_id'=> $_GET['socket_id'],
          ]);
        } else {
          $redirect_uri = $this->get_redirect($_GET['redirect_uri'], [
            'code'=> $code,
            'state'=> $_GET['state']
          ]);
        }
        // debug(2,$_GET);
        // debug($_GET, $redirect_uri);
        // debug($redirect_uri);

        die(header('Location: '.$this->redirect_uri));
      }
      else if ($_GET['prompt'] != 'accept') {
        $_GET['prompt'] = 'accept';
        die(header('Location: ?'.http_build_query($_GET)));
      }
      // debug(1, $this->contact_id);
    }

    // debug(1);
		// debug($_GET, $_COOKIE);


		// debug($code, $_GET, $this->id);

		// debug($_GET, $this->account, $this->id);

		// if (
		// 	empty($_GET['response_type'])
		// 	|| empty($_GET['client_id'])
		// 	|| empty($_GET['scope'])
		// 	|| $_GET['prompt'] === 'consent'
		// 	|| empty($id_token = $_COOKIE['id_token'])
		// 	|| empty($this->payload = get_token($_COOKIE['id_token'], $this->client_secret))
		// ) {
		// 	if ($_GET['prompt'] === 'consent') $_GET['prompt'] = 'accept';
		// 	// debug(1,$_COOKIE,$_GET,$this->id);
		//
		// 	die(header('Location: /?'.http_build_query($_GET)));
		// }
		// debug(3,$_GET);
	}

	public function prompt_app_code_blur() {
		// $this->get_account();
		$row = sqlsrv_fetch_object(aim()->query(
			"SELECT TOP 1 socket_id,state FROM auth.nonce WHERE sub=%d AND MobileBrowser=1 AND SignInDateTime IS NOT NULL ORDER BY LastModifiedDateTime DESC",
			$this->account->account_id
		));
		// debug($row);
		if ($row && $row->socket_id) {
			return $this->reply([
				'url'=> '#?prompt=app_code_blur',
				'body'=> [
					'socket_id'=> $row->socket_id,
					'state'=> $row->state,
				],
			]);
		}
	}
	public function prompt_logout () {
		$this->logout();
		// debug($_GET, $_COOKIE);
		if ($_GET['redirect_uri']) {
			die(header('Location: '.$_GET['redirect_uri']));
		}
	}
	public function prompt_login() {
    // debug(1);
		return $this->login();
	}
	public function prompt_password() {
		return $this->login();
	}
	public function prompt_sign_in() {
		if ($this->account) {

		}
	}
	public function prompt_create_account() {
		$invalid = [];
		$account_email = sqlsrv_fetch_object(aim()->query(
			"EXEC [account].[get] @accountname=%s, @password=%s",
			$_POST['email'],
			$_POST['password']
		));
		if ($account_email->email === $_POST['email']) {
			$invalid['email'] = 'Dit email adres is al in gebruik. Ga naar inloggen om u aan te melden.';
		}
		if (empty($_POST['phone_number'])) {
			return ['invalid' => $invalid];
		}
		if (is_numeric($_POST['phone_number']) && $_POST['phone_number'] > 600000000 && $_POST['phone_number'] < 700000000) {
			$_POST['phone_number'] = 31000000000 + $_POST['phone_number'];
		}
		$_POST['phone_number'] = (int)$_POST['phone_number'];
		$account_phone_number = sqlsrv_fetch_object(aim()->query(
			"EXEC [account].[get] @accountname=%s",
			$_POST['phone_number']
		));
		if ($account_phone_number->phone_number === $_POST['phone_number']) {
			$invalid['phone_number'] = 'Dit nummer is al in gebruik.';
		}
		if (empty($_POST['name'])) {
			return ['invalid' => $invalid];
		}

		$arr = explode(' ',$_POST['name']);
		aim()->query(
			"INSERT INTO item.dt (hostID,classID,title) VALUES (1,1004,%s);
			DECLARE @id INT;
			SET @id=scope_identity();
			EXEC item.attr @ItemID=@id, @NameID=30, @value=%s
			EXEC item.attr @ItemID=@id, @NameID=996, @value=%s
			EXEC item.attr @ItemID=@id, @NameID=516, @UserID=@id, @Value=%s, @Encrypt=1;

			EXEC item.attr @ItemID=@id, @Name='preferred_username', @value=%s
			EXEC item.attr @ItemID=@id, @Name='name', @value=%s
			EXEC item.attr @ItemID=@id, @Name='unique_name', @value=%s
			EXEC item.attr @ItemID=@id, @Name='family_name', @value=%s
			EXEC item.attr @ItemID=@id, @Name='given_name', @value=%s
			EXEC item.attr @ItemID=@id, @Name='middle_name', @value=%s
			EXEC item.attr @ItemID=@id, @Name='nickname', @value=%s
			",
			$_POST['name'],
			$this->accountname = $_POST['email'],
			$_POST['phone_number'],
			$_POST['password'],

			$_POST['name'],
			$_POST['name'],
			$_POST['email'],
			$family_name = array_pop($arr),
			$given_name = array_shift($arr),
			$middle_name = implode(' ',$arr),
			$given_name
		);

		$_POST['accountname'] = $_POST['email'];
		return $this->login();
		// 	'EmailVerified'=>'email_verified',
		// 	'Gender'=>'gender',
		// 	'Birthday'=>'birthdate',
		// 	'HomePhones0'=>'phone_number',
		// 	'PhoneVerified'=>'phone_number',
		// 	'PhoneVerified'=>'phone_number_verified',
		// 	'HomeAddress'=>'address',
		// 	'modifiedDT'=>'updated_at'
	}
	public function prompt_email_code() {
		// debug(111,$_POST);
		if (!$_POST['accountname']) throw new Exception('Precondition Failed', 412);
		if (!$_POST['code']) {
			$this->log('email_code', $this->set_code(), $this->accountname);
			return $_POST;
			// return [ 'msg' => __('prompt_get_email_code_description'), ];
		}
		if (!$this->account->IsCodeOk) return $this->reply(['msg' => 'Code incorrect']);
		if (!$this->account->email_verified) {
			aim()->query(
				"UPDATE attribute.dt SET UserId = ItemId WHERE Id=%d",
				$this->account->email_id
			);
		}
		return $this->login();
	}
	public function prompt_sms_code() {
		error_log('prompt_sms_code'.json_encode($_POST));
		// debug(1111,$this->account,$_POST);

		if (!$_POST['code']) {
      // debug(1, $this->account->phone_number);
			aim()->sms('+'.$this->account->phone_number, __('sms_code_content', $this->set_code()), __('sms_code_subject'));
			return $_POST;
		}
		if (!$this->account->IsCodeOk) return $this->reply(['msg' => 'Code incorrect']);
		if (isset($_POST['request_type'])) {
			// debug(1,$_POST);
			$request_type = $_POST['request_type'];
			return $this->$request_type();
			// if ($_POST['request_type']==='delete_account') return $this->delete_account();
		}
		if (!$this->account->phone_number_verified) {
			aim()->query(
				"UPDATE attribute.dt SET UserId = ItemId WHERE Id=%d",
				$this->account->phone_number_id
			);
		}
		return $this->login();
	}
	public function prompt_phone_number() {
    if (isset($_POST['phone_number'])) {
      if (is_numeric($_POST['phone_number']) && $_POST['phone_number'] > 600000000 && $_POST['phone_number'] < 700000000) {
        $_POST['phone_number'] = 31000000000 + $_POST['phone_number'];
      }
    }

		if ($this->account->phone_number_verified) {
			if (isset($_POST['phone_number'])) {
				// debug($_POST, $this->account);
				if ($_POST['phone_number'] != $this->account->phone_number) return $this->reply(['msg' => 'Nummer incorrect']);
				if ($this->account->IsCodeOk) {
					aim()->query(
						"DELETE attribute.dt WHERE Id=%d",
						$this->account->phone_number_id
					);
					return $this->login();
				}
				return $this->reply([
					'url' => '#?prompt=sms_code',
					'request_type' => 'prompt_phone_number',
				]);
			}
		}
		// if (!$this->account->phone_number) {
		if (isset($_POST['phone_number'])) {
			aim()->query(
				"EXEC item.attr @ItemID=%d, @NameID=996, @value=%s",
				$this->account->account_id,
				$_POST['phone_number']
			);
			return $this->login();
			// return $this->reply([
			// 	'url' => '#?prompt=sms_code',
			// 	'request_type' => 'prompt_phone_number',
			// ]);
		}
		if ($this->account->IsCodeOk) {
			aim()->query(
				"UPDATE attribute.dt SET userId=itemId WHERE id=%d",
				$this->account->phone_number_id
			);
			return $this->login();
			// return $this->reply([
			// 	'url' => '#?prompt=login',
			// ]);
		}
	}
	public function prompt_delete_account() {
		return $this->reply([
			'url' => '#?prompt=sms_code',
			'request_type' => 'delete_account',
		]);
	}
	public function prompt_authenticator_id_token() {
		if (!($id_token = get_token($_POST['id_token'], $this->client_secret))) throw new Exception('Unauthorized', 401);
		// debug($_POST, $account_jwt);
		// if (!$account_jwt['valid']) throw new Exception('Unauthorized', 401);
		$this->accountname = $id_token['email'];
		return $this->login('/?prompt=login');
	}
	public function prompt_accept() {
		// debug(1);
		// debug(1, $_POST, getallheaders(), $_SERVER);
		/*
		* Bij geen login afbreken met foutmelding
		*/
		if (empty($this->id)) {
			$redirect_uri = '/';
			$_GET['prompt'] = 'login';
			$query = '?'.http_build_query($_GET);
			// debug($redirect_uri.$query);
			die (header('Location: '.$redirect_uri.$query));
		}
		/*
		* Reply data en stuur mail met log in buffer
		*/


		if (isset($_POST['allow'])) {
			unset($_POST['allow']);
			$this->code = $this->get_code([
				'scope'=> preg_replace('/(_)(read|write|add)/', '.$2', implode(' ',array_keys($_POST))),
				'nonce'=> isset($_GET['redirect_uri']) ? $_COOKIE['nonce'] : null,
			]);
			// $this->reply($this->prompt_accept_method_allow());
		}
		//
		//
		// // debug($_GET, $_POST);
		// $method = 'prompt_accept_method_'.$_GET['submitter'];
		// /*
		// * Reply data en stuur mail met log in buffer
		// */
		// $this->reply($this->$method());
    // debug(111, $_POST, $this->redirect_uri);

		$response = [
			'code'=> $this->code,
			'state'=> $_GET['state'],
		];
		if ($this->redirect_uri) {
      // debug($this->redirect_uri, $this->code);
      return [
        'url' => $this->redirect_uri.'?'.http_build_query($response)
      ];
			// die (header('Location: '.$this->get_redirect($_GET['redirect_uri'], $response)));
		} else {
			return $response;
		}
		// else if (isset($_GET['redirect_uri'])) {
		// 	die (header('Location: '.$this->get_redirect($_GET['redirect_uri'], $response)));
		//
		// } else {
		// 	die("<script>window.parent.postMessage(JSON.stringify({
		// 		auth: {
		// 			id_token: '".$this->id_token."',
		// 			code: '".$this->code."',
		// 		}
		// 	}), '*');</script>");
		// }
	}
	public function prompt_ws_get_id_token() {
		$response = [
			'code'=> $this->get_code(),
			'state'=> $_GET['state'],
			'prompt'=> 'prompt_ws_login_code',
		];
		return $response;
	}
	public function prompt_ws_login_code() {
		if (empty($code = get_token($_GET['code'], $this->client_secret))) {
			throw new Exception('Unauthorized', 401);
		}
		$this->account = sqlsrv_fetch_object(aim()->query(
			"EXEC [account].[get] @account_id=%d",
			$code['sub']
		));

		$this->set_login();
		// debug($_COOKIE,$this->account);


		$url=strtok(urldecode($_GET['redirect_uri']),'?').'?'.http_build_query([
			'code'=> $this->get_code([
				'nonce'=> $_COOKIE['nonce'],
				'scope'=> 'name email',
			]),
			'state'=>$_GET['state'],
		]);

		// debug($url);
		die(header('Location: '.$url));

		// debug($_GET, $code, $this->account);

	}
	public function get_redirect($redirect_uri, $query) {
		$arr = explode('?', $redirect_uri);
		parse_str($arr[1], $arr[1]);
		$arr[1] = http_build_query(array_merge($arr[1], $query));
		return implode('?', $arr);
	}
	public function prompt_requestNewPasswordByEmail() {
		$account = sqlsrv_fetch_object(aim()->query("EXEC [account].[get] @accountname='$accountname'"));
		if (!$account->EmailAttributeID) throw new Exception('Not found', 404);
		return $account;

	}
	public static function redirect_code() {


		// Waar is deze voor ????

		extract($_GET);
		if (!($id_token = $_COOKIE['id_token'])) throw new Exception('No logged in user', 401);
		$client = sqlsrv_fetch_object(aim()->query("EXEC [account].[get] @HostName='$client_id'"));
		if (!($account_jwt = jwt_decode($id_token, $this->client_secret))) throw new Exception('Bad id_token', 400);
		if (!$account_jwt->valid) throw new Exception('Invalid id_token', 404);
		$payload = (array)$account_jwt->payload;
		/* Eerste aanmelder wordt eigenaar. Bijwerken userID van domain indien deze nog niet bestaat */
		if (!$client->userID) aim()->query("UPDATE item.dt SET UserID=".($client->userID = $payload[sub])." WHERE id=$client->id");
		if ($client->userID == $payload['sub']) $_GET['scope'] .=' admin:write';
		aim()->query("EXEC [api].[setAttribute] @id=$payload[sub], @name='Scope', @value='$_GET[scope]', @hostID=$client->id;");
		$scope = sqlsrv_fetch_object(aim()->query($q = "SELECT scope FROM [account].[vw] WHERE userID = $payload[sub] AND hostID = $client->id"));

		$code = array_merge(array_intersect_key($payload, array_flip(array_merge( explode(' ', $_GET['scope']),['iss','sub','nonce','auth_time','name']))),[
			'iss' => $client->name.'.aliconnect.nl', // Audience, id of host, owner of scope
			'aud' => (int)$client->id, // Audience, id of host, owner of scope
			'azp' => (int)$client->id, // From config.json
			'client_id' => (int)$client->id, // Client Identifier // application
			'scope' => trim($_GET['scope'] . (isset($scope) ? ' '.$scope->scope : '' )), // Scope Values
			'exp' => time()+60, // Expiration Time
			'iat' => time(), // Issued At
		]);

		// $code = [
		// 	'sub'=> $payload['sub'],
		// 	'aud' => (int)$client->id, // Audience, id of host, owner of scope
		// 	'scope' => trim($_GET['scope'] . (isset($scope) ? ' '.$scope->scope : '' )), // Scope Values
		// 	'exp' => time()+60, // Expiration Time
		// 	'iat' => time(), // Issued At
		// ];

		// debug($code);
		$code = jwt_encode($code, aim()->secret['config']['aim']['client_secret']);
		$arr = explode('#',urldecode($_GET['redirect_uri']));
		$redirect_hash = isset($arr[1])?[1]:'';
		if (isset($arr[0])) $redirect_search = ($arr = explode('?',$arr[0].'?'))[1];
		switch ($_GET['response_type']) {
			case 'token':
			$location = "$arr[0]#access_token=$code&token_type=Bearer&expires_in=600&state=$_GET[state]".($redirect_search?"&$redirect_search":"").($redirect_hash?"#$redirect_hash":"");
			break;
			case 'code':
			$location = "$arr[0]?code=$code&state=$_GET[state]".($redirect_search?"&$redirect_search":"").($redirect_hash?"#$redirect_hash":"");
			break;
		}
		die(header("Location: $location"));
	}
	public static function authenticator() {
		$html = file_get_contents('../app/authenticator/index.html');
		$data = ['get'=>$_GET,'qr'=>['text'=>'https://aliconnect.nl/?id=312312']];
		echo str_replace("</head","<script src='data:text/javascript;base64,".$dataBase64=base64_encode("data=".json_encode($data))."'></script></head",$html);
		die();
	}
}
class token {
	public function __construct() {
		//header('Access-Control-Allow-Origin: '.implode("/",array_slice(explode("/",$_SERVER["HTTP_REFERER"]),0,3)));
		header('Access-Control-Allow-Origin: *');
		header('Access-Control-Allow-Methods: GET,POST');
		$this->client_secret = aim()->client_secret;
	}
	public function get () {
		if(isset($_GET['id_token'])) {
			$payload = json_decode(base64_decode(explode('.',$_GET['id_token'])[1]));
			$session = sqlsrv_fetch_object(aim()->query("SELECT sub FROM auth.session WHERE id=$payload->nonce"));
			if(!$session->sub || $session->sub != $payload->sub) throw new Exception('Unauthorized', 401);
			return null;
		}
		throw new Exception('Precondition Failed', 412);
	}
	public function refresh_token() {
		// debug(1);
		foreach (['client_id','refresh_token'] as $key) {
			if (empty($_POST[$key])) throw new Exception('Precondition Failed', 412);
		}
		$account = sqlsrv_fetch_object(aim()->query(
			"EXEC [account].[get] @HostName=%s",
			$_POST['client_id']
		));
		if (!$account) throw new Exception('Not Found', 404);
		if (empty($_POST['refresh_token'])) throw new Exception('Unauthorized', 401);
		$refresh_token = get_token($_POST['refresh_token'], $this->client_secret);
		// echo 'ss';debug($refresh_token);
		if (empty($refresh_token)) throw new Exception('Unauthorized', 401);
		$expires_in = ACCESS_TOKEN_EXPIRES_IN;
		return [
			'expires_in'=> $expires_in,
			'access_token'=> jwt_encode(array_replace($refresh_token, [
				'iat'=> time(),
				'exp'=> time() + $expires_in,
			]), $account->client_secret)
		];
	}
	public function authorization_code() {
		if (empty($_POST['client_id'])) throw new Exception('Precondition Failed', 412);
		// DEBUG: Uitgezet voor test
		// if (empty($_POST['client_secret'])) throw new Exception('Precondition Failed', 412);
		$request_client = sqlsrv_fetch_object(aim()->query(
			"EXEC [account].[get] @HostName=%s",
			$_POST['client_id']
		));
		if (empty($request_client)) {
			throw new Exception('Not Found', 404);
		}
		// DEBUG: Uitgezet voor test
		// if ($request_client->client_secret != strtoupper($_POST['client_secret'])) throw new Exception('Precondition Failed', 412);
		if (isset($_POST['refresh_token'])) {
			$_POST['code'] = $_POST['refresh_token'];
		}
		if (empty($_POST['code'])) {
			throw new Exception('Precondition Failed', 412);
		}
		if (empty($code = get_token($_POST['code'], $this->client_secret))) {
			throw new Exception('Unauthorized', 401);
		}
		$account = sqlsrv_fetch_object(aim()->query(
			"EXEC [account].[get] @hostName=%u, @accountName=%u",
			$code['aud'],
			$code['sub']
		));
		$scope_arr = explode(' ',urldecode($code['scope']));
		// $attributes=[
		// 	// 'given_name'=>'given_name',
		// 	// 'family_name'=>'family_name',
		// 	// 'unique_name'=>'unique_name',
		// 	// 'name'=>'name',
		// 	// 'preferred_username'=>'preferred_username',
		// 	// 'email'=>'email',
		// 	// 'Email'=>'email',
		// 	'GivenName'=>'given_name',
		// 	'Surname'=>'family_name',
		// 	'MiddleName'=>'middle_name',
		// 	'NickName'=>'nickname',
		// 	'UserName'=>'preferred_username',
		// 	'EmailVerified'=>'email_verified',
		// 	'Gender'=>'gender',
		// 	'Birthday'=>'birthdate',
		// 	'HomePhones0'=>'phone_number',
		// 	'PhoneVerified'=>'phone_number',
		// 	'PhoneVerified'=>'phone_number_verified',
		// 	'HomeAddress'=>'address',
		// 	'modifiedDT'=>'updated_at'
		// ];
		// $response->id_token = array_fill_keys ($scope_arr, null);
		// DEBUG: Moet expires_in niet in de code, uitzoeken
		$code['expires_in'] = ACCESS_TOKEN_EXPIRES_IN;

		$iat = time();
		$exp_long = $iat + 365 * 24 * 60 * 60;
		$exp = $iat + $code['expires_in'];

		$response = [
			'expires_in'=> ACCESS_TOKEN_EXPIRES_IN,//$payload['expires_in'],
			// 'token_type'=> $payload['token_type'],
			'access_token'=> jwt_encode([
				// 'iss'=> 'login.aliconnect.nl',
				'iss'=> $account->client_name . '.aliconnect.nl',
				'client_id'=> (int)$account->client_id,
				'aud'=> id($account->client_id),
				'sub'=> $code['sub'],
				'scope'=> $code['scope'],
				'iat' => $iat,
				'exp' => $exp,
				'nonce' => $code['nonce']
				// 'sct'=> $account->client_secret,
			], $account->client_secret)
		];

		if (isset($code['nonce'])) {
			$id_token = [
				'iat' => $iat,
				'exp' => $exp_long,
				'iss'=> 'login.aliconnect.nl',
				'sub'=> $code['sub'],
				'nonce' => $code['nonce']
				// 'sct'=> aim()->client_secret,
			];
			foreach ($account as $key => $value) {
				foreach ($scope_arr as $scope) {
					if (strstr($key, $scope)) {
						$id_token[$key] = $value;
					}
				}
			}
			$response['id_token'] = jwt_encode($id_token, aim()->client_secret);
		}

		if (isset($_POST['access_type']) && $_POST['access_type'] === 'offline') {
			$response['refresh_token'] = jwt_encode([
				'iss'=> $account->client_name . '.aliconnect.nl',
				'client_id'=> (int)$account->client_id,
				'aud'=> (int)$account->clientId,
				'sub'=> $code['sub'],
				'scope'=> $code['scope'],
				'iat' => $iat,
				'exp' => $exp_long,
				'nonce' => $code['nonce']
			], $this->client_secret);
		}
    // debug(1);
		header('Content-Type: application/json');
		die (json_encode($response));
	}
	public function post () {
    // return;
		if (isset($_POST['grant_type'])) return $this->{$_POST['grant_type']}();
	}
}
class me {
  function get() {
    // $item = new item('Contact', aim()->access->sub);
    // return aim()->access['sub'];
    $item = new item('Contact',id(aim()->access['sub']));
    return $item->get();
  }
}

$globals = (object)[];
function aim() {
	return $GLOBALS['aim'];
}
$aim = new aim();
$aim->init();

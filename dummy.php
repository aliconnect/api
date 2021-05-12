<?php
// die('api1'.__DIR__);
header('Access-Control-Allow-Methods: GET, HEAD, POST, PUT, DELETE, OPTIONS, PATCH');
header('Access-Control-Allow-Headers: Authorization, Origin, X-Requested-With, Content-Type, Accept, Accept-Charset, Accept-Language, If-Match, If-None-Match, Isolation, Prefer, OData-Version, OData-MaxVersion, X-API-Key, Apikey, Api-Key, Api_Key');
header('Access-Control-Expose-Headers: OData-Version');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Origin: ' . ( array_key_exists('HTTP_REFERER',$_SERVER) ? implode('/',array_slice(explode('/',$_SERVER['HTTP_REFERER']),0,3)) : '*') );
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
    // debug(aim()->secret);
		$this->client_id = aim()->secret['config']['mse']['client_id'];
		$this->client_secret = aim()->secret['config']['mse']['client_secret'];
		// aim()->access->sub = 265090;
		//debug(aim()->access);
		if (!isset(aim()->access['sub'])) throw new Exception('Unauthorized', 401);
		$this->userID = aim()->access['sub'];
    // debug($this);
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
    $account = sqlsrv_fetch_object(aim()->query($aim()->query = "EXEC [account].[get] @accountname='$accountname', @IP = '$ip'"));
    // debug($accountname, $profile, $access, $account);
    // Als account niet bestaat aanmaken en email sturen
    if (empty($account->AccountID)) {
      // $this->log("account_created");
      $account = sqlsrv_fetch_object(aim()->query("INSERT INTO item.dt (hostID,classID,title) VALUES (1,1004,'$accountname');
      DECLARE @id INT;
      SET @id=scope_identity();
      EXEC [item].[setAttribute] @ItemID=@id, @NameID=30, @value='$accountname'
      ".$aim()->query));
    }
    foreach (['email','name','preferred_username'] as $attributeName) {
      if (empty($profile[$attributeName])) continue;
      $value = str_replace("'","''",$profile[$attributeName]);
      $q .= "EXEC item.setAttribute @ItemID=$account->AccountID, @AttributeName='$attributeName', @value='$value', @hostID=1;";
    }
    foreach (['family_name','given_name','name','unique_name'] as $attributeName) {
      if (empty($access[$attributeName])) continue;
      $value = str_replace("'","''",$access[$attributeName]);
      $q .= "EXEC item.setAttribute @ItemID=$account->AccountID, @AttributeName='$attributeName', @value='$value', @hostID=1;";
    }
    $q .= "EXEC item.setAttribute @itemID=$account->AccountID, @Name='mse_access_token', @Value='$json_vals[access_token]'";
    $q .= "EXEC item.setAttribute @itemID=$account->AccountID, @Name='mse_refresh_token', @Value='$json_vals[refresh_token]'";
    aim()->query($q);
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
			// Redirect back to home page
      $url = base64_decode($_GET['state']);
      // debug($state);
			header('Location: '.$url);
      die();
		}
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
      'schema'=> '[schema]',
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
      // debug ($this->filter);
    }
    // debug($this);
    $this->top = isset($this->top) ? $this->top : 10;

    $this->defaultItemProperties = [
      'schema','filterfields','files','InheritedID',
      'header0','header1','header2','schemaPath','name','Tagname',
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

    $this->sub = 265090;

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
      foreach (['Title','Subject','Summary'] as $i => $key) {
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
      if (in_array('Title', $this->array_select_param )) {
        $headerProperties = array_merge($schema->header[0], $headerProperties?:[]);
      }
      if (in_array('Subject', $this->array_select_param )) {
        $headerProperties = array_merge($schema->header[1], $headerProperties?:[]);
      }
      if (in_array('Summary', $this->array_select_param )) {
        $headerProperties = array_merge($schema->header[2], $headerProperties?:[]);
      }
      // $this->select = array_merge($this->select, ['ID']);
      // debug ($this->select);
      // debug($headerProperties, $schema->header);
      $this->array_select = array_diff($this->array_select_param,['Title','Subject','Summary']);
      $this->array_select = array_merge($this->array_select,[$idname]);
      $this->array_select_param_flip = array_flip(array_merge($this->array_select_param,$table->filter));
      $select = '['.implode('],[',array_values(array_filter(array_unique(array_merge($this->array_select,$headerProperties?:[],$table->filter?:[]))))).']';
      // debug(1,$select,$this->array_select);
    }
    if (isset($table->idname)) {
      $select.=",$table->idname AS ID";
    }
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
 		$q.=";EXEC [item].[setAttribute] @ItemID=$id,@LinkID='$requestBody->itemID'";
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

    // debug(1, "EXEC item.setAttribute @ItemID=$this->id, @Name='Message', @LinkID=$item->ID, @max=9999");
    aim()->query(
      "EXEC item.setAttribute @ItemID=%s, @Name=%s, @LinkID=%d, @max=9999",
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
    $path = implode('/',[
      "/shared",
      aim()->access['aud'],
      date('Y/m/d'),
      empty($_GET['uid']) ? uniqid() : $_GET['uid'],
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
    file_put_contents($fname, file_get_contents('php://input'));
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
          INNER JOIN item.vw I ON I.ID = A.ItemID AND I.ClassID=SET @classID=item.classID('$attribute->schema') $this->filter
          WHERE A.ID = $this->id
          UNION ALL
          SELECT Level+1,A.ID,A.ItemID,'$attributeName',A.Data,''
          FROM (SELECT ID,ItemID,Data,NameID FROM attribute.dv WHERE NameID IN (SELECT id FROM attribute.name WHERE Name = '$attribute->attributeName')) A
          INNER JOIN item.vw I ON I.ID=A.ItemID AND I.ClassID = item.classID('$attribute->schema') $this->filter
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
 		if (isset($three)) {
 			error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING & ~E_STRICT & ~E_DEPRECATED);
 			//global $aim;
 			$o = (object)["scale" => 10, "shape" => (object)[], "geo" => (object)[] ];
 			$obj = sqlsrv_fetch_object(aim()->query("SELECT files FROM item.dt WHERE id=$id;"));
 			$files = json_decode($obj->files);
 			$o->floorplan->src = $files[0]->src;
 			$res=aim()->query("EXEC [item].[getTreeModel] @id=$id;");
 			while($row = sqlsrv_fetch_object($res)) {
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
 			function build(&$b) {
 				global $o;
 				if (!$b->children) unset($b->children);
 				if ($b->geo) $b=(object)array_merge((array)$o->geo->{$b->geo},(array)$b);
 				foreach ($b->children as $i => $c) $b->children[$i]=build($c);
 				return $b;
 			}
 			$o->object = build($o->object);
 			header('Content-Type: application/json');
 			exit(json_encode($o));
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
      $this->sql .= "INSERT @T
      SELECT TOP $this->top ID,''
      FROM item.vw
      WHERE
      HostID IN (@ClientId)
      AND ClassID=item.classID('$this->schemaname')
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
            FROM P INNER JOIN Item.VW I ON I.ID = P.SrcID AND level<10
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
        $q .= "EXEC [item].[setAttribute] @ItemID=$this->id, @name='$attributeName', @value='$value';";
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
    DECLARE @classID INT;SET @classID=item.classID('$schema')
    DECLARE @id INT;INSERT item.dt(classID,hostID,userID)VALUES(@classID,$aud,$sub)
    SET @id = scope_identity()
    ";
 		foreach($requestBody as $attributeName => $value) {
      $q .= "
      EXEC [item].[setAttribute] @ItemID=@id,@name='$attributeName',@value='$value'
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
        EXEC [item].[setAttribute] @HostID=@ClientId, @ItemID=@id, @Value=@UserID,@AttributeName='CreatedByID'
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
      $q.="\n;EXEC [item].[setAttribute] @HostID=@ClientId, @ItemID=@id, ".implode(',',array_map(
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
        $q[]="EXEC [item].[setAttribute] @HostID='$this->client_id',@ItemID=$id,@Name='$key',@Value='".str_replace("'","''",$value)."'";
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
class account {
  public function __construct () {
    $this->access = aim()->access;
    // debug($this->access);
    // $this->sub = $this->access['sub'];
    $this->scope = $this->access['scope'];//explode(' ',$this->access['scope']);
    // $this->hostname = aim()->hostname;
    $this->client_secret = aim()->client_secret;
    $this->data = [
      'client_name'=> aim()->hostname,
    ];
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
    $this->set('nonce', get('nonce'), ['hostId' => 1]);
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
      @nonce=%s",
      get('client_name', $options),
      get('accountname', $options),
      phone_number(get('phone_number', $options)),
      get('password', $options),
      get('ip', $options),
      get('code', $options),
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
      $messages[] = 'Account aanwezig';
    }
    else {
      $messages[] = 'Account aangemaakt';
      $chapters[] = [
        'title'=> 'Aliconnect account aangemaakt',
  			'content'=> "
        Er is voor U een account aangemaakt op https://aliconnect.nl waarmee u al uw persoonlijke gegevens beheerd.
        ",
      ];
      sqlsrv_fetch_object(aim()->query("SET NOCOUNT ON;".
        "INSERT INTO item.dt (hostID,classID,title) VALUES (1,1004,'$accountname')
  			DECLARE @id INT
  			SET @id=scope_identity()
        EXEC item.setAttribute @itemId=@id, @name='accountname', @value='$accountname'
        EXEC item.setAttribute @itemId=@id, @name='email', @value='$accountname'
  			EXEC item.setAttribute @itemId=@id, @name='preferred_username', @value='$accountname'
  			EXEC item.setAttribute @itemId=@id, @name='name', @value='$name'
  			EXEC item.setAttribute @itemId=@id, @name='unique_name', @value='$accountname'
  			EXEC item.setAttribute @itemId=@id, @name='family_name', @value='$family_name'
  			EXEC item.setAttribute @itemId=@id, @name='given_name', @value='$given_name'
        EXEC item.setAttribute @itemId=@id, @name='nickname', @value='$given_name'
  			EXEC item.setAttribute @itemId=@id, @name='middle_name', @value='$middle_name'
  			"
  		));
    }
    $this->get_account();
    return $this;
  }
  public function get($selector) {
    if (isset($this->data->$selector)) {
      return $this->data->$selector;
    }
  }
  public function set($selector, $context = '', $options = []) {
    aim()->setAttribute(array_replace([
      'itemId'=>$this->get('accountId'),
      'hostId'=>1,
      'name'=>$selector,
      'value'=>$context
    ], $options));
    $this->data->$selector = $context;
    $this->get_account();
    return $this;
  }
  public function set_password($context) {
    $this->set('password', $context, ['encrypt' => 1]);
  }
  public function set_code($code) {
    $this->set('code', $code, ['encrypt' => 1, 'hostId' => 1]);
  }
	public function create_guest() {
    $aim = aim();
    $access = $aim->access;
    $sub = get('sub', $access);
    if (isset($sub)) {
      $user = sqlsrv_fetch_object(aim()->query("EXEC account.get @accountname='$sub'"));
    }
    $messages = [];
    $chapters = [];
    $this->create_account();
    $account = $this->data;
    // debug('create_guest', $_POST, $this->data);
    // debug(1);
    // $scope_granted = explode(' ',$_POST['scope_granted']);
    // $scope_requested = explode(' ',$_POST['scope_requested']);
    $scope_granted = get('scope_granted');
    $scope_requested = get('scope_requested');
    $accountname = get('accountname');
    // if (!empty(array_diff($this->scope, $scope))) return ["msg"=>'Scope out of range'];
    if (isset($user)) {
      if ($account->contactId) {
        $messages[] = 'Contact aanwezig';
      } else {
        $messages[] = 'Contact aangemaakt';
        $chapters[] = [
          'title'=> 'Contact persoon aangemaakt',
          'content'=> "
          $user->name heeft u als contactpersoon aangemaakt op het domein van <b>$account->client_name</b>.
          U kunt uw $account->client_name gegevens beheren op https://$account->client_name.aliconnect.nl.
          ",
        ];
        sqlsrv_fetch_object(aim()->query("SET NOCOUNT ON;".
        $q="INSERT INTO item.dt (hostID,classID,title) VALUES ($account->clientId,1004,'$accountname')
        DECLARE @id INT
        SET @id=scope_identity()
        EXEC item.setAttribute @itemId=@id, @nameID=30, @value='$accountname'
        EXEC item.setAttribute @itemId=@id, @name='Src', @LinkID=$account->accountId, @HostID=$account->clientId
        "));
        $account = $this->get_account()->data;
      }
      if ($account->scope_granted === $scope_granted) {
        $messages[] = 'Scope granted OK';
      } else {
        $messages[] = 'Scope granted aangepast';
        $chapters[] = [
          'title'=> 'Toegang tot gegevens',
          'content'=> "
          $user->name heeft u toegang gegeven tot gegevens van <b>$account->client_name</b>.
          U beschikt nu over de volgende rechten:
          <ul><li>".implode('</li><li>',explode(' ',$scope_granted))."</li></ul
          ",
        ];
        aim()->setAttribute([
          'itemId'=>$account->accountId,
          'hostId'=>$account->clientId,
          'userId'=>$account->clientId,
          'name'=>'scope_granted',
          'value'=>$scope_granted,
        ]);
        $account = $this->get_account()->data;
      }
    }
    if ($account->scope_requested === $scope_requested) {
      $messages[] = 'Scope request OK';
    } else {
      $messages[] = 'Scope request aangepast';
      $chapters[] = [
        'title'=> 'Toegang tot uw gegevens',
  			'content'=> "
        $user->name vraagt u om toegang te verlenen tot de volgende gegevens van uw profiel:
        <ul><li>".implode('</li><li>',explode(' ',$scope_requested))."</li></ul
        U kunt deze toegang ten aller tijde opheffen of aanpassen.
        U wordt hierom gevraagt wanneer u zich aanmeld op https://$account->client_name.aliconnect.nl.
        ",
      ];
      aim()->setAttribute([
        'itemId'=>$account->accountId,
        'hostId'=>$account->clientId,
        'userId'=>$account->clientId,
        'name'=>'scope_requested',
        'value'=>$scope_requested,
      ]);
      $account = $this->get_account()->data;
    }
    if (get('tag')) {
      $tag = get('tag');
      preg_match('/\((\d+)\)/', $tag, $match);
      $itemId = $match[1];
      $row = sqlsrv_fetch_object(aim()->query("SELECT * FROM attribute.vw WHERE itemID=$itemId AND attributeName='Master' AND linkId=$account->accountId AND hostId=$account->clientId"));
      aim()->setAttribute([
        'itemId'=>$itemId,
        'hostId'=>$account->clientId,
        'name'=>'HasChildren',
      ]);
      if (empty($row)) {
        aim()->setAttribute([
          'itemId'=>$itemId,
          'hostId'=>$account->clientId,
          'name'=>'Master',
          'linkId'=>$account->accountId,
          'max'=>9999,
        ]);
        $chapters[] = [
          'title'=> 'Toegang tot folder',
    			'content'=> "
          $user->name heeft u toegang verleent tot de gegevens folder $tag.
          ",
        ];
      }
      // debug($match[1], get('tag'), $row);
    }





    $_POST['msg'] = $messages;
    if (!empty($chapters)) {
      // array_unshift($chapters, [
      //   'title'=> 'Wijziging in uw account',
  		// 	'content'=> 'U heeft reeds een contact',
      // ]);
      aim()->mail($a = [
        // 'Subject'=> $this->subject,
        'to'=> $accountname,
        'bcc'=> 'max.van.kampen@alicon.nl',
        'chapters'=> $chapters
      ]);
    }
    die();
    return $_POST;
	}
	public function delete() {
		debug(331);
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
		error_log($query."\n", 3, $_SERVER['DOCUMENT_ROOT'].'/log/sql.log');
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
		$this->root = '/sites/'.$this->hostname;
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
				'EXEC account.get @hostName=\'%1$s\',@accountName=\'%2$s\',@method=\'%3$s\',@url=\'%4$s\'',
				AIM_DOMAIN,
				$sub = isset($payload['sub']) ? $payload['sub'] : '',
				$_SERVER['REQUEST_METHOD'],
				$_SERVER['REQUEST_URI']
			));
			if (!file_exists($aim_root)) {
				if (!isset($this->account->ClientID)) {
					// die($aim_root);
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
		foreach ($paths as $path) {
			$config_json = $path . '/config.json';
			if (is_file($config_json)) {
				$config = array_replace_recursive($config, json_decode(file_get_contents($config_json), true));
			}
		}
		return $config;
	}

  public function setAttribute($options) {
    $this->query($q="EXEC item.setAttribute ".implode(',',array_map(function($key,$val){
      if (is_null($val)) {
        $val = 'NULL';
      } else if (!is_numeric($val)) {
        $val = "'".str_replace("'","''",$val)."'";
      }
      return "@$key=$val";
    },array_keys($options),$options)));
    // echo $q;
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
	public function init() {
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
		if (is_file($fname = AIM_ROOT.'/api.php')) {
			// die('aaa'.AIM_ROOT.$fname);
			require_once ($fname);
		}
		// debug('aaa');
		if (strpos($_SERVER['REQUEST_URI'],'/api') !== false) {
			try {
				// debug(1, AIM_ROOT);
				$response = $this->request_uri();
				// debug(1);
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
			if ($response) {
				header('Content-Type: application/json');
				echo json_encode($response, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
			}
		} else {
			if (isset($_GET['prompt'])) {
				if ($_GET['prompt'] === 'logout') {
					$this->logout();
				}
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
			return $this->request([
				'method' => $REQUEST_METHOD,
				'url' => substr($_SERVER['REQUEST_URI'], $apipos != false ? strpos($_SERVER['REQUEST_URI'], 'api/') + 3 : 0  )
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
      EXEC [item].[setAttribute] @ItemID=@id, @NameID=30, @value='$mailto'
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

  public function getdata ($insert) {
    if (empty($this->hostId)) {
      $this->hostId = sqlsrv_fetch_object($this->query("SELECT id FROM item.dv WHERE hostId=1 AND classID=1002 AND keyname = '$this->hostname'"))->id;
      // debug($this->hostId);
    }
    $res = $this->query("SET NOCOUNT ON;DECLARE @itemlist itemlist;$insert;EXECUTE item.data @hostId=$this->hostId, @userId=265090, @itemlist=@itemlist");
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
    if (isset(AIM_KEYS['accept']) && strstr(AIM_KEYS['accept'],'yaml')) {
      if (is_file($fname = $_SERVER['DOCUMENT_ROOT'].$this->root.'/config.yaml')) {
				readfile($fname);
      }
    } else {
      $schemaKeys = array_keys((array)$this->api->components->schemas);
      $keys = implode("','",$schemaKeys);
      $items = $this->getdata("INSERT INTO @itemlist SELECT id FROM item.dv WHERE classId = 0 AND name in ('$keys')");
      // debug($items);
      foreach ($items as $id => $item) {
        $this->api->components->schemas->{$item->name} = (object)array_merge(array_filter(itemrow($item)),(array)$this->api->components->schemas->{$item->name});
      }
      foreach($this->api->components->schemas as $schemaname => $schema) {
        if (!$schema->ID) {
          // debug(2, $this->hostId, $schemaname, $schema);
          $items = $this->getdata($q="INSERT INTO item.dt (hostID,classID,masterID,srcID,name)
            VALUES ($this->hostId,0,0,0,'$schemaname')
            INSERT INTO @itemlist SELECT scope_identity()"
          );
          // die($q);
          foreach ($items as $id => $item) {
            $this->api->components->schemas->{$item->schemaName} = (object)array_merge(array_filter(itemrow($item)),(array)$this->api->components->schemas->{$item->schemaName});
          }
        }
      }
      header('Content-Type: application/json');
      die(json_encode($this->api));
		}
		die();
  }
	public function post () {
    debug(1);
		if (!function_exists('yaml_parse')) return;
		$content = str_replace("\t","  ",file_get_contents('php://input'));
		// if (isset($_GET['append'])) {
    $this->root = isset($_GET['folder']) ? $_GET['folder'] : $this->root;
		if (isset($_GET['extend'])) {
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
    // return $this->get();
    die("Saved in $this->root");
    die("Saved in $this->root $content");
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
    if ($this->redirect_uri) {
      $url = parse_url($this->redirect_uri);
      $this->client_name = explode('.',$url['host'])[0];
    }
    $this->client_secret = aim()->client_secret;
    $this->mobile_browser = mobile_browser();
    $this->ip = GetRealUserIp();
    $this->account = (new account())->get_account($this);
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
		if (get('prompt') !== 'login') {
      die(header('Location: /?'.http_build_query(array_replace($_GET,['prompt'=>'login']))));
    }
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
    if (get('accountname')) {
			$account->set_nonce();
      if (!$account->get('account_id')) {
        if ($prompt === 'create_account') {
          $this->account->create_account($_POST);
        } else {
          return array_replace($_POST, ["password"=>"", "msg"=>"Account bestaat niet. <a href='#?prompt=create_account'>Maak er een</a>"]);
        }
      }
      if ($prompt === 'email_code' || $prompt === 'set_password') {
				// debug(1, $account->data);
        if (!$account->get('code_ok')) {
          return array_replace($_POST, ['msg'=>'Verkeerde code. <a href="#?prompt=send_email_code">Stuur nieuwe code</a>']);
        }
        $time = strtotime($account->get('code_ok'));
        if ($time-$this->time < -1120) {
          return array_replace($_POST, ["msg"=>"code verlopen, vraag nieuwe code aan"]);
        }
				$account->set('email_verified', $account->get('accountname'));
				// $account->set('nonce', get('nonce'));
        if ($prompt === 'set_password' && get('password')) {
          $account->set_password(get('password'));
        } else {
          if ($account->get('password_ok') === null) {
            return array_replace($_POST, ["prompt"=>"set_password", "msg"=>"geen wachtwoord, voer in"]);
          }
        }
        $account->set('code', $_POST['code'] = null);
        $account->set('ip', GetRealUserIp());
      }
			if ($account->get('password_ok') === 0) {
        if ($prompt === 'password') {
          return array_replace($_POST, ['msg'=>'Verkeerd wachtwoord']);
        }
        return array_replace($_POST, ['prompt'=>'password']);
      }
			if ($prompt === 'send_email_code') {
				$account->set_code($code = rand(10000,99999));
        aim()->mail($a = [
          'to'=> $_POST['accountname'],
          'bcc'=> 'max.van.kampen@alicon.nl',
          'chapters'=> [["title"=>"code ".$code]],
        ]);
        return array_replace($_POST, ['prompt'=>'email_code']);
			}
			if (!$account->get('email_verified') || $account->get('password_ok') === null) {
				return array_replace($_POST, ['prompt'=>'send_email_code']);
      }
			if (!$account->get('nonce')) {
				return array_replace($_POST, ['prompt'=>'send_email_code']);
      }

			if ($prompt === 'phone_number' && get('phone_number')) {
        $account->set('phone_number', phone_number(get('phone_number')));
      }
      if (!$account->get('phone_number')) {
        return array_replace($_POST, ["prompt"=>"phone_number", "msg"=>"geen mobiel nummer, voer in"]);
      }
      if ($account->get('phone_number')) {
        if ($prompt === 'sms_code') {
          if (!$code_ok = $account->get('code_ok')) {
            return array_replace($_POST, ['msg'=>'verkeerde code']);
          }
          $time = strtotime($code_ok);
          if ($time-$this->time < -120) {
            return array_replace($_POST, ["msg"=>"code verlopen, vraag nieuwe code aan"]);
          }
          $account->set('phone_number_verified', $account->get('phone_number'));
					$account->set('code', $_POST['code'] = null);
          $account->set('ip', GetRealUserIp());
					// return array_replace($_POST, ['prompt'=>'id_token', 'id_token'=>$account->get_id_token()]);
        }
        if (!$account->get('ip') || !$account->get('phone_number_verified') || $prompt === 'send_sms_code') {
          $account->set_code($code = rand(10000,99999));
          aim()->sms('+'.$account->get('phone_number'), __('sms_code_content', $code), __('sms_code_subject'));
          return array_replace($_POST, ['prompt'=>'sms_code']);
        }
      }
    }
    if (!get('accountname')) {
      return array_replace($_POST, ['prompt'=>'login']);
    }
    if (get('response_type') === 'code') {
			if ($prompt !== 'consent' && $account->get('scope_accepted') === get('scope')) {
				return array_replace($_POST, ['url'=>$this->redirect_uri.'?'.http_build_query([
					'code'=> $this->response_code(),
					'state'=> get('state'),
				])]);
			}
			if ($prompt !== 'accept') {
				return array_replace($_POST, ['prompt'=>'accept']);
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
				return array_replace($_POST, ['url'=>$this->redirect_uri.'?'.http_build_query([
					'code'=> $this->response_code(),
					'state'=> get('state'),
				])]);
      }
    }
    // return array_replace($_POST, ['url'=>'https://aliconnect.nl?prompt=login']);
    return array_replace($_POST, ['url'=>'/?prompt=login', 'id_token'=>$account->get_id_token()]);
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
      debug(1, $this->contact_id);
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

}

die('TTTT '.json_encode([$_GET,$_POST]));
class token {
	public function __construct() {
		//header('Access-Control-Allow-Origin: '.implode("/",array_slice(explode("/",$_SERVER["HTTP_REFERER"]),0,3)));
		header('Access-Control-Allow-Origin: *');
		header('Access-Control-Allow-Methods: GET,POST');
		$this->client_secret = aim()->client_secret;
	}
	public function get () {
		// debug(1);
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
    debug(1);
    // return;
		if (isset($_POST['grant_type'])) return $this->{$_POST['grant_type']}();
	}
}

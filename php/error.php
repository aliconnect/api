<?php
header('Access-Control-Allow-Origin: *');
die(json_encode($_SERVER));
header('Access-Control-Allow-Origin: '.(isset($_SERVER['HTTP_REFERER']) ? implode("/",array_slice(explode("/",$_SERVER["HTTP_REFERER"]),0,3)) : "*"));


$statusCodes = [
	100 => [ 'message' => 'Continue'],
	101 => [ 'message' => 'Switching Protocols'],
	102 => [ 'message' => 'Processing'],
	200 => [ 'message' => 'OK'],
	201 => [ 'message' => 'Created'],
	202 => [ 'message' => 'Accepted'],
	203 => [ 'message' => 'Non-Authoritative Information'],
	204 => [ 'message' => 'No Content'],
	205 => [ 'message' => 'Reset Content'],
	206 => [ 'message' => 'Partial Content'],
	207 => [ 'message' => 'Multi-Status'],
	300 => [ 'message' => 'Multiple Choices'],
	301 => [ 'message' => 'Moved Permanently'],
	302 => [ 'message' => 'Found'],
	303 => [ 'message' => 'See Other'],
	304 => [ 'message' => 'Not Modified'],
	305 => [ 'message' => 'Use Proxy'],
	306 => [ 'message' => '(Unused)'],
	307 => [ 'message' => 'Temporary Redirect'],
	308 => [ 'message' => 'Permanent Redirect'],
	400 => [ 'message' => 'Bad Request', 'title' => 'De url is niet correct opgebouwd ' ], // Invalid ID
	401 => [ 'message' => 'Unauthorized', 'title' => 'U heeft geen voldoende rechten', 'description' => 'Er is een probleem met uw rechten op dit domein. Uw account is niet aanwezig of uw bevoegdheden zijn niet voldoende voor uw aanroep.' ],
	402 => [ 'message' => 'Payment Required'],
	403 => [ 'message' => 'Forbidden'],
	404 => [ 'message' => 'Not Found', 'title' => 'Deze pagina op '.$_SERVER['SERVER_NAME'].' kan niet worden gevonden', 'description' => 'Er is geen webpagina gevonden voor het webadres: '.$_SERVER['REQUEST_URI'] ],
	405 => [ 'message' => 'Method Not Allowed'], // Invalid input, validation error
	406 => [ 'message' => 'Not Acceptable'],
	407 => [ 'message' => 'Proxy Authentication Required'],
	408 => [ 'message' => 'Request Timeout'],
	409 => [ 'message' => 'Conflict'],
	410 => [ 'message' => 'Gone'],
	411 => [ 'message' => 'Length Required'],
	412 => [ 'message' => 'Precondition Failed'],
	413 => [ 'message' => 'Request Entity Too Large'],
	414 => [ 'message' => 'Request-URI Too Long'],
	415 => [ 'message' => 'Unsupported Media Type'],
	416 => [ 'message' => 'Requested Range Not Satisfiable'],
	417 => [ 'message' => 'Expectation Failed'],
	418 => [ 'message' => 'I\'m a teapot'],
	419 => [ 'message' => 'Authentication Timeout'],
	420 => [ 'message' => 'Enhance Your Calm'],
	422 => [ 'message' => 'Unprocessable Entity'],
	423 => [ 'message' => 'Locked'],
	424 => [ 'message' => 'Failed Dependency'], // Unknown in chrome
	//424 => [ 'message' => 'Method Failure'],
	425 => [ 'message' => 'Unordered Collection'],
	426 => [ 'message' => 'Upgrade Required'],
	428 => [ 'message' => 'Precondition Required'],
	429 => [ 'message' => 'Too Many Requests'],
	431 => [ 'message' => 'Request Header Fields Too Large'],
	444 => [ 'message' => 'No Response'],
	449 => [ 'message' => 'Retry With'],
	450 => [ 'message' => 'Blocked by Windows Parental Controls'],
	451 => [ 'message' => 'Unavailable For Legal Reasons'],
	494 => [ 'message' => 'Request Header Too Large'],
	495 => [ 'message' => 'Cert Error'],
	496 => [ 'message' => 'No Cert'],
	497 => [ 'message' => 'HTTP to HTTPS'],
	499 => [ 'message' => 'Client Closed Request'],
	500 => [ 'message' => 'Internal Server Error'],
	501 => [ 'message' => 'Not Implemented'],
	502 => [ 'message' => 'Bad Gateway'],
	503 => [ 'message' => 'Service Unavailable'],
	504 => [ 'message' => 'Gateway Timeout'],
	505 => [ 'message' => 'HTTP Version Not Supported'],
	506 => [ 'message' => 'Variant Also Negotiates'],
	507 => [ 'message' => 'Insufficient Storage'],
	508 => [ 'message' => 'Loop Detected'],
	509 => [ 'message' => 'Bandwidth Limit Exceeded'],
	510 => [ 'message' => 'Not Extended'],
	511 => [ 'message' => 'Network Authentication Required'],
	598 => [ 'message' => 'Network read timeout error'],
	599 => [ 'message' => 'Network connect timeout error']
];
$arr = explode(';',$_SERVER['QUERY_STRING']);
http_response_code($statusCode = array_shift($arr));

$status = array_replace(['message' => 'Network connect timeout error', 'title' => '', 'description' => ''],$statusCodes[$statusCode]);
// $response = (object)array_merge(['method' => $req['method'], 'url' => $req['url'], 'status' => $statusCode], $statusCodes[$statusCode], $req['responses'][$statusCode] ?: []); //status => $statusCode, body=>$errorCode[0], string => $req];
// if(!in_array('text/html',explode(',',getallheaders()['Accept']))) die(json_encode($response)); // die(json_encode([errorNumber => $statusCode, error=>$errorCode[0]]));
$url = parse_url($_SERVER['REQUEST_URI']);
// die(json_encode([$url['path'],$url]));
$request = '';
if (isset($url['query'])) {
	parse_str($url['query'], $query);
	// $query = implode('<br>&', $query);
	$request = $url['path'];
	$request .=  '<br>?'.implode('<br>&',array_map(function($key,$value){return "$key=<span>$value<span>";},array_keys($query),$query));
}

 // implode('<br>&',array_map(function($key,$value){return "$key=$value";},array_keys($_GET),$_GET));

$headers = getallheaders();
// die(json_encode([$headers,$headers['Accept']]));
if (isset($headers['Accept']) && strstr($headers['Accept'],'html')) {
	echo "<html>
	<head>
		<meta name='viewport' content='width=device-width, initial-scale=1, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no' />
		<style>
			body{font-family:'Segoe UI', Tahoma, sans-serif;max-width:600px;padding-top:100px;margin:auto;font-size: 75%;font-size: 1em;}
			h1 {color: var(--heading-color);font-size: 1.6em;font-weight: normal;line-height: 1.25em;margin-bottom: 16px;}
			.error-code {color: var(--error-code-color);font-size: .86667em;text-transform: uppercase;margin-top: 12px;display: block;font-size: .8em;}
			span {word-break: break-all;}
		</style>
	</head>
	<body>
		<small>Aliconnect meldt</small>
		<h1>$status[title]</h1>
		<p>$status[description]</p>
		<p>".(isset($_SERVER['REQUEST_METHOD']) ? $_SERVER['REQUEST_METHOD'] : "")." $request</p>
		<p class='error-code'>HTTP ERROR $statusCode $status[message] </p>
	</body>
	</html>";
} else {
	echo json_encode($status);
}

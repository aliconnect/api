<?php
//die();
require_once (__DIR__."/../connect.php");
echo "<p>Mailer INBOX ".date("c")."</p>";
//ini_set('display_errors',1);
//ini_set('display_startup_errors',1);
//error_reporting(E_ALL);

//$dbusername = "aimWrite";$dbpassword = "Al!c0nWr!te";
//include_once "lib.php";

function nlDate($datum){
    /*
     // AM of PM doen we niet aan
     $parameters = str_replace("A", "", $parameters);
     $parameters = str_replace("a", "", $parameters);

    $datum = date($parameters);
   */
    // Vervang de maand, klein
    $datum = str_replace(array("january","Januari","Jan"),"januari",$datum);
    $datum = str_replace(array("february","February","Jeb"),"februari",$datum);
    $datum = str_replace(array("march","March","Mar"),"maart",$datum);
    $datum = str_replace(array("april","April","Apr"),"april",$datum);
    $datum = str_replace(array("may","May","May"),"mei",$datum);
    $datum = str_replace(array("june","June","Jun"),"juni",$datum);
    $datum = str_replace(array("july","July","Jul"),"juli",$datum);
    $datum = str_replace(array("august","August","Aug"),"augustus",$datum);
    $datum = str_replace(array("september","September","Sep"),"september",$datum);
    $datum = str_replace(array("october","October","Oct"),"oktober",$datum);
    $datum = str_replace(array("november","November","Nov"),"november",$datum);
    $datum = str_replace(array("december","December","Dec"),"december",$datum);

    $datum = str_replace(array("monday","Monday","Mon"),"maandag",$datum);
    $datum = str_replace(array("tuesday","tuesday","Tue"),"dinsdag",$datum);
    $datum = str_replace(array("wednesday","Wednesday","Wed"),"woensdag",$datum);
    $datum = str_replace(array("thursday","Thursday","Thu"),"donderdag",$datum);
    $datum = str_replace(array("friday","Friday","Fri"),"vrijdag",$datum);
    $datum = str_replace(array("saturday","Saturday","Sat"),"zaterdag",$datum);
    $datum = str_replace(array("sunday","Sunday","Sun"),"zondag",$datum);
    return $datum;
}


//$host="{imap.gmail.com:993/imap/ssl}";
//$user="aliconsystems@gmail.com";
//$pass="Koenders0";

//$host="{imap.strato.com:993/imap/ssl}";
//$user="info@aimsite.nl";
//$pass="Mjkmjkmjk0";

//$host="{imap.strato.com:993/imap/ssl}";
//$user="archive@aliconnect.nl";
//$pass="Al!c0nAdm!n";


//$imap = imap_open("{imap.gmail.com:993/imap/ssl}", "aliconsystems@gmail.com", "Koenders0"); //WERKT

//$imap = imap_open("{web12.websiteondemand.nl:993/imap/ssl}", "mail@alicon.eu", "Mjkmjkmjk0"); //WERKT
//$imap = imap_open("{outlook.office365.com:993/imap/ssl}", "max.van.kampen@alicon.nl", "Mjkmjkmjk0"); // WERKT

//$imap = imap_open ("{mail.aimsite.nl:143/novalidate-cert}INBOX", "info@aimsite.nl", "Mjkmjkmjk0"); // WERKT

//$imap = imap_open ("{mail.aimsite.nl:143/novalidate-cert}INBOX", "info@aimsite.nl", "Mjkmjkmjk0"); // WERKT

function imapopen ($host,$login,$pw) {
    if (!$imap = imap_open ($host,$login,$pw)) {
        echo "<br>NIET GELUKT $host , $login , $pw"; $foo = imap_errors(); var_dump($foo);}
    else echo "<br>GELUKT $host , $login , $pw";
    return $imap;
}

//echo date('m/d/Y h:i:s a', time());

//$imap = imapopen("{imap.gmail.com:993/imap/ssl}", "aliconsystems@gmail.com", "Koenders0"); //WERKT
//$imap = imapopen("{web12.websiteondemand.nl:993/imap/ssl}", "mail@alicon.eu", "Mjkmjkmjk0"); //WERKT
//$imap = imapopen("{outlook.office365.com:993/imap/ssl}", "max.van.kampen@alicon.nl", "Mjkmjkmjk0"); // WERKT
//$imap = imapopen ("{mail.aimsite.nl:143/novalidate-cert}INBOX", "info@aimsite.nl", "Mjkmjkmjk0"); // WERKT

//$imap = imapopen ("{imap.strato.de:993}INBOX", "info@aimsite.nl", "Mjkmjkmjk0");
//$imap = imapopen ("{imap.strato.de:993/ssl}INBOX", "info@aimsite.nl", "Mjkmjkmjk0");
//$imap = imapopen ("{imap.strato.de:993/imap/ssl}INBOX", "info@aimsite.nl", "Mjkmjkmjk0");
//$imap = imapopen ("{imap.strato.de:993/ssl/novalidate-cert}INBOX", "info@aimsite.nl", "Mjkmjkmjk0");
//$imap = imapopen ("{imap.strato.de:993/novalidate-cert}INBOX", "info@aimsite.nl", "Mjkmjkmjk0");

//$imap = imapopen ("{imap.strato.de:993 /tls}INBOX", "info@aimsite.nl", "Mjkmjkmjk0");
//$imap = imapopen ("{imap.strato.de:993/tls}INBOX", "info@aimsite.nl", "Mjkmjkmjk0");
//$imap = imapopen ("{imap.strato.de:993/ssl/debug}", "info@aimsite.nl", "Mjkmjkmjk0");




//$imap = imapopen ("{mail.aimsite.nl:143}", "info@aimsite.nl", "Mjkmjkmjk0");
//$imap = imapopen ("{mail.aimsite.nl:143/novalidate-cert}", "info@aimsite.nl", "Mjkmjkmjk0");
//$imap = imapopen ("{mail.aimsite.nl:143}INBOX", "info@aimsite.nl", "Mjkmjkmjk0");
//$imap = imapopen ("{mail.aimsite.nl:143/novalidate-cert}INBOX", "info@aimsite.nl", "Mjkmjkmjk0");
//$imap = imapopen ("{mail.aimsite.nl:143}INBOX", "info@aimsite.nl", "Mjkmjkmjk0");

//$imap = imapopen ("{mail.aimsite.nl:143}", "info@aimsite.nl", "Mjkmjkmjk0");
//$imap = imapopen ("{mail.aimsite.nl:143}", "info@aimsite.nl", "Mjkmjkmjk0");
//$imap = imapopen ("{mail.aimsite.nl:143}", "info@aimsite.nl", "Mjkmjkmjk0");
//$imap = imapopen ("{www.aimsite.nl:143/novalidate-cert}", "info@aimsite.nl", "Mjkmjkmjk0", NULL, 1, array('DISABLE_AUTHENTICATOR' => 'GSSAPI'));
//$imap = imapopen ("{www.aimsite.nl:143/novalidate-cert}", "info@aimsite.nl", "Mjkmjkmjk0");



//$imap = imap_open ("{imap.strato.com:993/imap/ssl/novalidate-cert}INBOX", "info@aimsite.nl", "Mjkmjkmjk0"); // WERKT



//$imap = imap_open("{outlook.office365.com:993/imap/ssl}", "max.van.kampen@hotmail.com", "mjkmjkmjk0");


/*

$1 = imap_open("{imap.strato.de:993}INBOX",  $user, $pass);

$2 = imap_open("{imap.strato.de:993/ssl}INBOX",  $user, $pass);
$3 = imap_open("{imap.strato.de:993/imap/ssl}INBOX", $user, $pass);
$4 = imap_open("{imap.strato.de:993/ssl/novalidate-cert}INBOX", $user, $pass);
$5 = imap_open("{imap.strato.de:993/novalidate-cert}INBOX", $user, $pass);

*/
//$folders = imap_list($imap, $host,"*");
//echo "<ul>";
//foreach ($folders as $folder) {
//    $folder = str_replace($host, "", imap_utf7_decode($folder));
//    echo var_dump($folder);
//    echo '<li><a href="mail.php?folder=' . $folder . '&func=view">' . $folder . '</a></li>';
//}
//echo "</ul>";


//echo "MESSAGES";


function getBody($uid, $imap) {
    $body = get_part($imap, $uid, "TEXT/HTML");
    // if HTML body is empty, try getting text body
    if ($body == "") {
        $body = get_part($imap, $uid, "TEXT/PLAIN");
    }
    return $body;
}

function get_part($imap, $uid, $mimetype, $structure = false, $partNumber = false) {
    if (!$structure) {
           $structure = imap_fetchstructure($imap, $uid, FT_UID);
    }
    if ($structure) {
        if ($mimetype == get_mime_type($structure)) {
            if (!$partNumber) {
                $partNumber = 1;
            }
            $text = imap_fetchbody($imap, $uid, $partNumber, FT_UID);
            switch ($structure->encoding) {
                case 3: return imap_base64($text);
                case 4: return imap_qprint($text);
                default: return $text;
           }
       }

        // multipart
        if ($structure->type == 1) {
            foreach ($structure->parts as $index => $subStruct) {
                $prefix = "";
                if ($partNumber) {
                    $prefix = $partNumber . ".";
                }
                $data = get_part($imap, $uid, $mimetype, $subStruct, $prefix . ($index + 1));
                if ($data) {
                    return $data;
                }
            }
        }
    }
    return false;
}

function get_mime_type($structure) {
    $primaryMimetype = array("TEXT", "MULTIPART", "MESSAGE", "APPLICATION", "AUDIO", "IMAGE", "VIDEO", "OTHER");

    if ($structure->subtype) {
       return $primaryMimetype[(int)$structure->type] . "/" . $structure->subtype;
    }
    return "TEXT/PLAIN";
}

function removeattr($e){
    $attributes = $e->attributes;
    while ($attributes->length) $e->removeAttribute($attributes->item(0)->name);
    $c=$e->childNodes;
    foreach ($c as $i => $e) removeattr($e);
}


$mailservers=array(
    //array("{www.aliconnect.nl:143/novalidate-cert}", "aliconnect@aliconnect.nl", "Al!c0nAdm!n"),
    //array("{www.aliconnect.nl:143/novalidate-cert}", "moba@aliconnect.nl", "Dubbeldooier0"),
    //array("{www.aliconnect.nl:143/novalidate-cert}", "alicon@aliconnect.nl", "eQxm15&5"),
    //array("{www.aliconnect.nl:143/novalidate-cert}", "mailer@aliconnect.nl", "Al!c0nAdm!n")
    //array("{www.aliconnect.nl:143/novalidate-cert}", "mailer@aliconnect.nl", "Al!c0nAdm!n")
    //array("{www.aliconnect.nl:143/novalidate-cert}", "admin@aliconnect.nl", "Al!c0nAdm!n")
    array("{www.aliconnect.nl:143/novalidate-cert}", "upload@aliconnect.nl", "Al!c0nAdm!n")
);

foreach ($mailservers as $mailserver) {
    $imap = imapopen ($mailserver[0],$mailserver[1],$mailserver[2]);//"{www.aliconnect.nl:143/novalidate-cert}", "aliconnect@aliconnect.nl", "Al!c0nAdm!n");
    $numMessages = imap_num_msg($imap);

	        echo "[$numMessages]".PHP_EOL;


    for ($i = $numMessages; $i > $numMessages -10; $i--) {
        $header = imap_header($imap, $i);

        $fromInfo = $header->from[0];
        $replyInfo = $header->reply_to[0];


        //echo var_dump($header);

        foreach ($header->to as $to) {
            if ($to->host=='aliconnect.nl') {
                $email = explode('#',$to->mailbox);
                if ($email[1]) {
                    $to->host=array_pop($email);
                    $to->mailbox=implode('_',$email);
                    //echo var_dump($to);
                }
            }
        }

        $from=$header->from[0]->mailbox."@".$header->from[0]->host;
        //echo var_dump($from);
        //echo var_dump($header);
        //echo var_dump($header->cc);


        if (isset($header->subject)) {



            $uid = imap_uid($imap, $i);
            $subjectid = null;
            $subject = $header->subject.' ';
            $asubject = preg_split('/[\ \n\,]+/', $subject, -1, PREG_SPLIT_DELIM_CAPTURE | PREG_SPLIT_NO_EMPTY);
            foreach ($asubject as $word) { $word=explode('#',$word); $word[1]=str_replace(array(']',')'),'',$word[1]); if ($word[1] && is_numeric($word[1])) { $subjectid = $word[1]; }}

            //echo var_dump($asubject);
                    //echo "DELETEEEE";

            if ($subjectid) {
                echo "<p>Dossier $subjectid mail gevonden </p>";
                $pos=strpos($subjectid,' ');
                $masterId = $subjectid;


                $row=fetch_object(query($q="
					DECLARE @hostID INT,@userID INT
					SELECT @hostID=hostID FROM om.items WHERE id=$masterId
					SELECT @userID=id FROM auth.email WHERE email='$from'
                    SET NOCOUNT OFF
					SELECT @hostID hostID,  @userID userID, $masterId id
				"));
                //var_dump($row);
                //die($q);

                //$details = array(
                //    "fromAddr" => (isset($fromInfo->mailbox) && isset($fromInfo->host))
                //        ? $fromInfo->mailbox . "@" . $fromInfo->host : "",
                //    "fromName" => (isset($fromInfo->personal))
                //        ? $fromInfo->personal : "",
                //    "replyAddr" => (isset($replyInfo->mailbox) && isset($replyInfo->host))
                //        ? $replyInfo->mailbox . "@" . $replyInfo->host : "",
                //    "replyName" => (isset($replyTo->personal))
                //        ? $replyto->personal : "",
                //    "subject" => (isset($subject))
                //        ? $subject : "",
                //    "udate" => (isset($header->udate))
                //        ? $header->udate : ""
                //);

                //$htmlbody = '<div style="border:none;border-top:solid #E1E1E1 1.0pt;padding:3.0pt 0cm 0cm 0cm">';
                //$htmlbody .= '<p class="MsoNormal"><b><span style="mso-fareast-language:NL">Van:</span></b><span style="mso-fareast-language:NL"> <a href="mailto:'.$fromInfo->mailbox . "@" . $fromInfo->host.'?SUBJECT='.$subjectid.'&BCC=info@aimsite.nl ">'.$fromInfo->personal.' &lt;'.$fromInfo->mailbox . "@" . $fromInfo->host.'&gt;</a>;';
                //$htmlbody .= '<br><b>Verzonden:</b> '.nlDate($header->date);
                //$htmlbody .= '<br><b>Aan:</b> ';
                //if (isset($header->to )) {
                //    foreach ($header->to as $to) {
                //    $htmlbody .= ' <a href="mailto:'.$to->mailbox . "@" . $to->host.'?SUBJECT='.$subjectid.'&BCC=info@aimsite.nl ">'.$to->personal.' &lt;'.$to->mailbox . "@" . $to->host.'&gt;</a>;';
                //}}
                //if (isset($header->cc )) {
                //    $htmlbody .= '<br><b>Cc:</b> ';
                //    foreach ($header->cc as $to) {
                //        $htmlbody .= ' <a href="mailto:'.$to->mailbox . "@" . $to->host.'?SUBJECT='.$subjectid.'&BCC=info@aimsite.nl ">'.$to->personal.' &lt;'.$to->mailbox . "@" . $to->host.'&gt;</a>;';
                //}}

                //$htmlbody .= '<br><b>Onderwerp:</b> '.$details["subject"];
                //$htmlbody .= '</span></p></div><p class="MsoNormal"><o:p>&nbsp;</o:p></p>';
                $htmlbody = getBody($uid,$imap);

                $structure = imap_fetchstructure($imap, $i);

                $attachments = array();
                if(isset($structure->parts) && count($structure->parts)) {

                    for($ai = 0; $ai < count($structure->parts); $ai++) {
                        //echo 'JA';

                        $attachments[$ai] = array(
                            'is_attachment' => false,
                            'filename' => '',
                            'name' => '',
                            'attachment' => ''
                        );

                        //echo PHP_EOL.'A===';
                        //echo PHP_EOL;

                        if($structure->parts[$ai]->ifdparameters) {
                            foreach($structure->parts[$ai]->dparameters as $object) {
                                if(strtolower($object->attribute) == 'filename') {
                                    $attachments[$ai]['is_attachment'] = true;
                                    $attachments[$ai]['filename'] = $object->value;
                                    //var_dump($object);
                                }
                            }
                        }


                        if($structure->parts[$ai]->ifparameters) {
                            foreach($structure->parts[$ai]->parameters as $object) {
                                if(strtolower($object->attribute) == 'name') {
                                    $attachments[$ai]['is_attachment'] = true;
                                    $attachments[$ai]['name'] = $object->value;
                                    //var_dump($object);
                                }
                            }
                        }


                        if($attachments[$ai]['is_attachment']) {
                            //echo 'YYYY-';
                            $attachments[$ai]['attachment'] = imap_fetchbody($imap, $i, $ai+1);
                            if($structure->parts[$ai]->encoding == 3) { // 3 = BASE64
                                $attachments[$ai]['attachment'] = base64_decode($attachments[$ai]['attachment']);
                            }
                            elseif($structure->parts[$ai]->encoding == 4) { // 4 = QUOTED-PRINTABLE
                                $attachments[$ai]['attachment'] = quoted_printable_decode($attachments[$ai]['attachment']);
                            }
                        }

                        //echo PHP_EOL.'B===';
                        //var_dump($attachments);
                        //echo PHP_EOL;


                    }
                }

                $host=explode('.',$header->sender[0]->host);
                $host=array_shift($host);


                $oa=array();
                foreach ($attachments as $key => $attachment) {
                    //echo $key;
                    $filename = $attachment['name'];
                    //echo strpos($htmlbody,$filename);
                    //echo strpos($htmlbody,$filename)!== false;
                    if (strpos($htmlbody,$filename)!== false) continue;
                    if ($filename) {
                        $ext = strtolower(pathinfo($filename,PATHINFO_EXTENSION));

						$par = array(userID=>$row->userID,hostID=>$row->hostID,itemID=>$row->id,name=>$filename);
						$ofile = fetch_object(dbexec("api.filepost",$par));



                        //$ofile=(object)array(name=>$filename,path=>"/shared/".$row->hostID."/shared/".date(y)."/".date(m)."/".date(d));

                        //$ofile->src = "$ofile->path/$ofile->name";
                        $attachments[$key][src] = $ofile->src;
                        $content=$attachment['attachment'];
                        $source = $_SERVER['DOCUMENT_ROOT'].$ofile->src;
                        $path = pathinfo($source, PATHINFO_DIRNAME);
                        mkdir($path,0777,true);
                        file_put_contents($source,$content);

                        //mkdir($_SERVER['DOCUMENT_ROOT'].$ofile->path,0777,true);

                        //file_put_contents($_SERVER['DOCUMENT_ROOT'].$ofile->src,$attachment['attachment']);

                        array_push($oa,$ofile);
                    }
                }

                //var_dump($oa);
                //var_dump($attachments);
                //echo $htmlbody;

                //var_dump($attachments[1][src]);
                //exit();
                $doc = new DOMDocument();

                //$htmlbody=iconv("CP1252", "UTF-8",$htmlbody);
                //$htmlbody=iconv("CP1252", "UTF-8",$htmlbody);
                //$htmlbody=iconv("UTF-8", "CP1252",$htmlbody);

                $doc->loadHTML($htmlbody);

                $c = $doc->getElementsByTagName('img');
                foreach ($c as $ai => $node) {
                    $node->setAttribute('src',$attachments[$ai+1][src]);
                }


                $body = $doc->getElementsByTagName('body');

                //foreach ($doc->children as $child) {
                //}

                //echo $htmlbody;
                //echo $doc->savehtml($body);
                //var_dump($body);
                //exit();
                $r=null;
                $idx=0;
                $message='';



                if ( $body && 0<$body->length ) {
                    $body = $body->item(0);
                    $c=$body->childNodes;
                    foreach ($c as $ic => $node) {
                        $c1=$node->childNodes;
                        foreach ($c1 as $i1 => $node1) {
                            removeattr($node1);
                            //$attributes = $node1->attributes;
                            //while ($attributes->length) $node1->removeAttribute($attributes->item(0)->name);
                            //echo ++$msgcount.utf8_decode($doc->savehtml($node1));

                            if ($node1->nodeName=='div') break;



                            $message.=utf8_decode($doc->savehtml($node1));
                            //$c2=$node->childNodes;
                            //foreach ($c2 as $i2 => $node2) {
                            //    if ($node2->nodeValue) $message.=utf8_decode($doc->savehtml($node2));
                            //}
                            //echo $node1->nodeName."===";
                            //if ($node1->nodeName=='div') {
                            //    $idx++;
                            //    $h = $r[$ic][$idx]->hdr=explode(PHP_EOL,str_replace(array(Van,Verzonden,Aan,CC,Onderwerp),array(PHP_EOL.Van,PHP_EOL.Verzonden,PHP_EOL.Aan,PHP_EOL.CC,PHP_EOL.Onderwerp),$node1->nodeValue));
                            //    foreach ($h as $h1 => $hv) {$ha=explode(': ',$hv); $r[$ic][$idx]->hdr[$ha[0]]=$ha[1];}
                            //}
                            //else {
                            //    $r[$ic][$idx]->body.=utf8_decode($doc->savehtml($node1));
                            //    echo utf8_decode($doc->savehtml($node1));
                            //}
                        }
                        if ($node1->nodeName=='div') break;
                    }
                }


                //echo $message;
    //            exit();
    //            //echo $r[1][0]->body;

    //            foreach ($r[1] as $ic => $o) {
    //                $m[$ic]->masterId=$masterId;
    //                $m[$ic]->From=$o->hdr[Van];
    //                $m[$ic]->Date=$o->hdr[Verzonden];
    //                $m[$ic]->Date=str_replace(array(januari,februari,maart,april,mei,juni,juli,autgustus,september,oktober,november,december),array('-01-','-02-','-03-','-04-','-05-','-06-','-07-','-08-','-09-','-10-','-11-','-12-'),$m[$ic]->Verzonden);
    //                $m[$ic]->Date=trim(str_replace(array(maandag,dinsdag,woensdag,donderdag,vrijdag,zaterdag,zondag),'',$m[$ic]->Verzonden));
    //                $m[$ic]->Date=str_replace(array(' -','- '),'-',$m[$ic]->Verzonden);
    //                $m[$ic]->Date=substr(date(DATE_ISO8601  ,strtotime($m[$ic]->Verzonden)),0,19);
    //                $m[$ic]->To=$o->hdr[Aan];
    //                $m[$ic]->CC=$o->hdr[CC];
    //                $m[$ic]->Subject=utf8_encode($o->hdr[Onderwerp]);
    //                //$m[$ic]->Body=iconv("UTF-8", "CP1252",$o->body);
    //                $m[$ic]->Body=$o->body;
    //            }
    //            $m[0]->From=utf8_encode(json_encode($header->from));
    //            $m[0]->To=utf8_encode(json_encode($header->to));
    //            $m[0]->CC=utf8_encode(json_encode($header->cc));
    //            $m[0]->Date=substr(date(DATE_ISO8601  ,strtotime($header->Date)),0,19);
    //            $m[0]->Subject=utf8_encode($header->Subject);
    //            $m[0]->Files=utf8_encode(json_encode($oa));

    //            //{
    ////"date":"Tue, 24 Jan 2017 11:07:32 +0000",
    ////"Date":"Tue, 24 Jan 2017 11:07:32 +0000",
    ////"subject":"Dossier:#2404450 Test voor project JC",
    ////"Subject":"Dossier:#2404450 Test voor project JC",
    ////"message_id":"<VI1PR03MB1582914538F1D93012C1E5C6C1750@VI1PR03MB1582.eurprd03.prod.outlook.com>",
    ////"toaddress":"\"archive@aliconnect.nl\" <archive@aliconnect.nl>",
    ////"to":[{"personal":"archive@aliconnect.nl","mailbox":"archive","host":"aliconnect.nl"}],
    ////"fromaddress":"Max van Kampen <max.van.kampen@alicon.nl>",
    ////"from":[{"personal":"Max van Kampen","mailbox":"max.van.kampen","host":"alicon.nl"}],
    ////"reply_toaddress":"Max van Kampen <max.van.kampen@alicon.nl>",
    ////"reply_to":[{"personal":"Max van Kampen","mailbox":"max.van.kampen","host":"alicon.nl"}],
    ////"senderaddress":"Max van Kampen <max.van.kampen@alicon.nl>",
    ////"sender":[{"personal":"Max van Kampen","mailbox":"max.van.kampen","host":"alicon.nl"}],
    ////"Recent":" ",
    ////"Unseen":" ",
    ////"Flagged":" ",
    ////"Answered":" ",
    ////"Deleted":" ",
    ////"Draft":" ",
    ////"Msgno":"   1",
    ////"MailDate":"24-Jan-2017 12:07:34 +0100",
    ////"Size":"10718",
    ////"udate":1485256054
    ////}

                $q="SET DATEFORMAT YMD;";
    //            foreach ($m as $oi) {

    //                    //$q.="EXEC api.addMail ".params($oi);
    //                                //$oi->Body=iconv("CP1252", "UTF-8",$oi->Body);

    //                                //function ordutf8($string, &$offset) {
    //                                //    $code = ord(substr($string, $offset,1));
    //                                //    if ($code >= 128) {        //otherwise 0xxxxxxx
    //                                //        if ($code < 224) $bytesnumber = 2;                //110xxxxx
    //                                //        else if ($code < 240) $bytesnumber = 3;        //1110xxxx
    //                                //        else if ($code < 248) $bytesnumber = 4;    //11110xxx
    //                                //        $codetemp = $code - 192 - ($bytesnumber > 2 ? 32 : 0) - ($bytesnumber > 3 ? 16 : 0);
    //                                //        for ($i = 2; $i <= $bytesnumber; $i++) {
    //                                //            $offset ++;
    //                                //            $code2 = ord(substr($string, $offset, 1)) - 128;        //10xxxxxx
    //                                //            $codetemp = $codetemp*64 + $code2;
    //                                //        }
    //                                //        $code = $codetemp;
    //                                //    }
    //                                //    $offset += 1;
    //                                //    if ($offset >= strlen($string)) $offset = -1;
    //                                //    return $code;
    //                                //}

    //                                $oi->Body=trim(iconv("UTF-8", "CP1252",$oi->Body));
    //                                $oi->Body=str_replace("\n","",$oi->Body);
    //                                $oi->Body=str_replace("\r","",$oi->Body);

    //                                //$text = $oi->Body;
    //                                //$oi->Body=utf8_decode(urldecode($oi->Body));


    //                                //$b1='<p class="MsoNormal"><span style=\'font-size:10.0pt;font-family:"Segoe UI",sans-serif;color:#1F497D;mso-fareast-language:EN-US\'>GROET<p></p></span></p><p class="MsoNormal"><span style=\'font-size:10.0pt;font-family:"Segoe UI",sans-serif;color:#1F497D;mso-fareast-language:EN-US\'><p>';
    //                                //echo $b1==$oi->Body;

    //                                ////$b1='<p class="MsoNormal"><span style=\'font-size:10.0pt;font-family:"Segoe UI",sans-serif;color:#1F497D;mso-fareast-language:EN-US\'>GROET<p></p></span></p>';
    //                                //echo PHP_EOL.$text.PHP_EOL.$b1.PHP_EOL;
    //                                ////echo PHP_EOL.$text.PHP_EOL.$b1.PHP_EOL;

    //                                //$offset = 0;
    //                                //while ($offset >= 0) {
    //                                //    $i=$offset;
    //                                //    echo $offset.": ".$text[$i]."=".ordutf8($text, $offset);
    //                                //    echo " - ".$b1[$i]."=".ordutf8($b1, $i)."\n";
    //                                //}
    //                                //echo PHP_EOL.$b1;

    //                                $oi->Body=str_replace('"','\"',$oi->Body);
    //                                //$oi->Body=str_replace('"','\"',$b1);


    ////                                $text = $oi->Body;
    ////$offset = 0;
    ////while ($offset >= 0) {
    ////    echo $offset.": ".ordutf8($text, $offset)."\n";
    ////}

    ////                                foreach ($oi->Body as $i => $c) echo '-'.ord($c);
    //                                //$oi->Body=str_replace("\n","",$oi->Body);
    //                                //$oi->Body=str_replace("\r","",$oi->Body);
    //                                //$oi->Body=str_replace(PHP_EOL,"",$oi->Body);

    //                                //if ($oi->Body[0]=='?') $oi->Body[0]='';


    //                                //echo "1".$oi->Body.PHP_EOL;
    //                                ////echo "1".utf8_decode($oi->Body).PHP_EOL;
    //                                //echo "1".iconv("CP1252", "UTF-8",$oi->Body).PHP_EOL;
    //                                //echo "2".iconv("UTF-8", "CP1252",$oi->Body).PHP_EOL;
    //                                echo PHP_EOL.$oi->Body;

    //                $o=array(a=>'send',from=>$from,id=>$subjectid,msg=>json_encode(array(Subject=>$oi->Subject,msgs=>array(array(content=>$oi->Body,files=>$oi->Files)))));
    //                //var_dump($o);
    //                $q.=prepareexec("api.msgGet",$o);
    //                //break;
    //            }
                //echo $message;


                $message=urldecode($message);
                $message=utf8_decode($message);
                $message=iconv("UTF-8", "CP1252",$message);
                $message=str_replace(array("\n","<p>?</p>","<p></p>","<span></span>","<p></p>"),"",$message);
                //$message=trim(iconv("UTF-8", "CP1252",$message));

                //echo $message;


                //$message=str_replace("\r","",$message);

                echo $message;


                $o=array(a=>'send',from=>$from,id=>$subjectid,msg=>json_encode(array(Subject=>$oi->Subject,msgs=>array(array(content=>$message,files=>$oa)))));
                $q.=prepareexec("api.msgGet",$o);

				//die($q);

                //echo PHP_EOL.PHP_EOL.$q.PHP_EOL.PHP_EOL.PHP_EOL;
                //exit();
                query($q);
                //$oi->Body='';
                //echo "=======>>>DELETEEEE";

            }
        }
        //echo "=======>>>DELETEEEE";


        imap_delete ($imap, $i);
    }
    imap_expunge($imap);
    imap_close($imap);
}
//$url1=$_SERVER['REQUEST_URI'];
//header("Refresh: 10;URL=$url1");
?>

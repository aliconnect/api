<?php
require_once (__DIR__."/../connect.php");
//require_once (__DIR__."/../doc.php");
require_once (__DIR__."/../mail.php");
echo "<p>Mailer OUTBOX".date("c")."</p>";

$res=query("EXEC mail.getQueue");
while ($row = fetch_object($res)) {
    $row->write=1;
    $mail->sendrow($row);
}

$res=query("
    SELECT I.id,F.name,F.value FROM mse.contactsync CS INNER JOIN om.items I ON I.id=CS.ItemID INNER JOIN om.fields F ON F.id IN (I.id,I.ToID,I.FromID)
    SELECT I.ItemID,C.UserID,C.MseID FROM mse.contactsync I INNER JOIN mse.contact C ON C.ContactID=I.itemID
");
while ($row=fetch_object($res)) $item[$row->id][$row->name]=$row->value;
next_result($res);
while ($row=fetch_object($res)) {
    require_once(__DIR__."/../aim-mse.php");

    $userId=$row->UserID;
    mse::getUserToken();
    $id=$row->MseID;
    $msecontact=mse::getObject(contacts,$id);
    $setFields=array();
    $fields=$item[$row->ItemID];
    foreach (array(BusinessHomePage,CompanyName,Initials,DisplayName,NickName,GivenName,MiddleName,SpouseName,Surname,Profession,Birthday,Generation,Title,JobTitle,Department,Manager,OfficeLocation,AssistantName,MobilePhone1) as $key)
        if ($value=$fields[$key]) if ($value!=$msecontact[$key]) $setFields[$key]=$value;
    $fields[BusinessAddressStreet].=' '.$fields[BusinessAddressNumber].' '.$fields[BusinessAddressAdd];
    $fields[HomeAddressStreet].=' '.$fields[HomeAddressNumber].' '.$fields[HomeAddressAdd];
    $fields[OtherAddressStreet].=' '.$fields[OtherAddressNumber].' '.$fields[OtherAddressAdd];
    foreach (array(City,CountryOrRegion,PostalCode,State,Street) as $key)
        if ($value=trim($fields[BusinessAddress.$key])) $setFields[BusinessAddress][$key]=$value;
    foreach (array(City,CountryOrRegion,PostalCode,State,Street) as $key)
        if ($value=trim($fields[HomeAddress.$key])) $setFields[HomeAddress][$key]=$value;
    foreach (array(City,CountryOrRegion,PostalCode,State,Street) as $key)
        if ($value=trim($fields[OtherAddress.$key])) $setFields[OtherAddress][$key]=$value;

    $setFields[HomePhones]=array();
    if ($fields[HomePhones0]) array_push($setFields[HomePhones],$fields[HomePhones0]);
    if ($fields[HomePhones1]) array_push($setFields[HomePhones],$fields[HomePhones1]);
    $setFields[BusinessPhones]=array();
    if ($fields[BusinessPhones0]) array_push($setFields[BusinessPhones],$fields[HomePhones0]);
    if ($fields[BusinessPhones1]) array_push($setFields[BusinessPhones],$fields[HomePhones1]);
    $setFields[EmailAddresses]=array();
    if ($fields[EmailAddresses0Address]) array_push($setFields[EmailAddresses],array(Address=>$fields[EmailAddresses0Address]));
    if ($fields[EmailAddresses1Address]) array_push($setFields[EmailAddresses],array(Address=>$fields[EmailAddresses1Address]));
    if ($fields[EmailAddresses2Address]) array_push($setFields[EmailAddresses],array(Address=>$fields[EmailAddresses2Address]));

    $result=mse::setObject(contacts,$id,$setFields);
    if (!$result) $result=mse::setObject(contacts,$id,$setFields);
    echo (json_encode(array(fields=>$setFields,result=>$result)));
    $q.="UPDATE mse.contact SET LastModifiedDateTime='".$result[LastModifiedDateTime]."' WHERE userID=$row->UserID AND MseID='$id' COLLATE SQL_Latin1_General_CP1_CS_AS;DELETE mse.contactsync WHERE itemID=$row->ItemID;";
}
if ($q) query($q);
//echo $q;



//$res=db(aim)->exec("api.notifyMail",array());
//while ($row = db(aim)->fetch_object($res)) {
//    echo "$row->email";
//    $msg=(object)array(
//        mail=>1,
//        FromEmail=>"mailer@aliconnect.nl", FromName=>"Aliconnect",
//        ReplyToEmail=>"mailer@aliconnect.nl", ReplyToName=>"Aliconnect",
//        Basecolor=>"#fafafa",
//        Domain=>"www.aliconnect.nl",
//        Hostname=>"aliconnect",

//        //to => array($mailrow->email),
//        to => array($row->email),
//        //bcc => array('max.van.kampen@alicon.nl'),
//        //to => array('max.van.kampen@alicon.nl','max.van.kampen@moba.nl'),
//        Subject => "Bericht",
//        Summary => "Bericht",
//        mailbody => array(
//            array(content=>"Beste <b>$row->name</b>,"),
//            array(content=>"Nieuwe berichten,")
//        )
//    );
//    mailsend($msg);
//}


/* MVK
mail werkt
juiste host doorgeven, en kleur, log enz
bericht invullen.
sql code afmaken.
daarna opnemen in flow addcontact.sql

*/



//$res=db(aim)->exec("api.mailget",array());
//while ($row = db(aim)->fetch_object($res)) {
//    if ($row->json && $row->ReplyToId!=$row->ToId) {
//        $mail = new AIMMailer(true);
//        $row->ReplyToEmail=str_replace('@','#',$row->ReplyToEmail).'@aliconnect.nl';
//        foreach ($row as $key => $value) $mail->$key = $mail->row->$key = $value;
//        //$mail->toemail=$row->toemail;
//        //$mail->toname=$row->toname;
//        //$mail->hasPassword=$row->hasPassword;
//        //$mail->ReplyToEmail=str_replace('@','#',$row->fromemail).'@aliconnect.nl';
//        //$mail->ReplyToName=$row->fromname;
//        $mail->init();
//        //$mail->host=$row->host;
//        $mail->Subject = $row->subject.($row->refId?" #$row->refId":"");//.' #'.$json->id;
//        $mail->addBcc('max.van.kampen@alicon.nl', 'Max van Kampen');
//        $mail->msg=json_decode($row->json);
//        $mail->sendmsg();
//        echo "<li>$mail->ReplayToName $mail->ReplyToEmail $mail->ToName $mail->ToEmail $mail->Subject</li>$mail->html";
//    }
//    db(aim)->query("UPDATE om.mailer SET verzonden = GETDATE() WHERE id=$row->id;");
//}
?>

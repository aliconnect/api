<?php
//phpinfo();

//Maildoc versie
//require_once (__DIR__."/db.php");
require_once (__DIR__."/mail.php");
foreach ($_GET as $key=>$value) $_POST[$key]=$value;
$post=(object)$_POST;
$signsrc=__DIR__."/doc/handtekeningMax.png";
$style='<style>
    body,table{font-size:9pt;font-family:sans-serif;}
    h0 {font-size:12pt;counter-reset: kop_hoofdstuk;counter-reset: kop_artikel;display:block;font-weight:bold;text-transform: uppercase;}
    h1 {font-size:11pt;margin:10px 0;counter-increment: kop_hoofdstuk;}
    h1:before {content: "HOOFDSTUK " counter(kop_hoofdstuk) " ";}
    h2 {font-size:10pt;margin:10px 0;counter-increment: kop_artikel;}
    h2:before {content: "Artikel " counter(kop_artikel) " ";}
    li>ol {list-style-type: lower-alpha;padding-left:0px;}
    ol>ol {list-style-type: lower-alpha;padding-left:20px;}
    ol{padding-left:20px;}
</style>';
$sign="
    <p>Aldus overeengekomen en getekend,</p><table style='width:100%;border-collapse:collapse;'>
    <tr><td style='width:50%;height:8mm;vertical-align:top;'>Verwerkingsverantwoordelijke</td><td>Verwerker</td></tr>
    <tr><td style='width:50%;height:8mm;vertical-align:top;'><small>Naam:</small><br>[Customer_CEO]</td><td><small>Naam:</small><br>[Verwerker_CEO]</td></tr>
    <tr><td style='width:50%;vertical-align:top;'><small>Handtekening:</small></td><td><small>Handtekening:</small><br><img src='$signsrc' style='width:6cm;'></td></tr>
    <tr><td style='width:50%;height:8mm;vertical-align:top;'><small>Datum:</small></td><td><small>Datum:</small><br>[DATUM]</td></tr>
    </table>
";
function n($value,$dec=2) {if ($value) return is_numeric($value)?number_format($value,$dec,",","."):$value;}
function nv($value,$dec=2) {if ($value) return "&euro; ".number_format($value,$dec,",",".");}
function nva($value,$dec=2) {return "&euro; ".number_format($value,$dec,",",".");}
function make11nr ($inputnr) {
    $weegfactor = array(2,4,8,5,10,9,7,3,6,1,2,4,8,5,10,9);
    $l=ceil(strlen($inputnr)/4)*4;
    $l=strlen($inputnr);
    for ($x = 0; $x < $l ; $x++) {
        $w=$weegfactor[$x];
        $n=substr($inputnr,$l-$x-1,1);
        $t=$w*$n;
        $sum+=$t;
    }
    return 11-($sum % 11).$inputnr;
}
function getchapter($chapterID,$level){
    global $chapters;
    $body="<h$level>".$chapters[$chapterID][name]."</h$level><div>".$chapters[$chapterID][Description]."</div>".$chapters[$chapterID][BodyHTML];
    foreach ($chapters[$chapterID][items] as $id) $body.=getchapter($id,$level+1);
    return $body;
}
function addattachment($name,$html,$items){
    global $attachements;
    require_once ($_SERVER['DOCUMENT_ROOT']."/inc/php/dompdf/dompdf_config.inc.php");
    $dompdf = new DOMPDF();
    $names=array();
    foreach ($items as $itemname => $item) {
        array_push($names,$item->name);
        foreach ($item->fields as $fieldname => $field) $html=str_replace("[$itemname"."_$fieldname]","<b>".($field[value]?$field[value]:"<i>"."[$itemname"."_$fieldname]"."</i>")."</b>",$html);
    }
    $html=str_replace("[DATUM]",date("<b>d-m-Y</b>"),$html);
    echo $html;
    $dompdf->load_html(icp($html));
    $dompdf->set_paper("a4");
    $dompdf->render();
    array_push($names,$name);
    $name=implode("_",$names).".pdf";
    $fname=__DIR__."/doc/pdf/$name";
    unlink($fname);
    file_put_contents($fname, $dompdf->output());
    array_push($attachements,(object)array(filename=>$fname,name=>$name,temp=>1));
}
function writedoc($itemID,$items,$sign){
    global $chapters,$style,$attachements;
    $chapters=null;
    $item=(object)itemGet(array(id=>$itemID,autohostID=>1));
    $fields=(object)$item->fields;
    $chapters[$itemID]=array(items=>array(),name=>$item->name,Description=>$fields->Description[value],BodyHTML=>$fields->BodyHTML[value]);
    foreach ($item->chapters as $chapter) {
        $chapter[items]=array();
        $chapters[$chapter[id]]=$chapter;
        if ($chapters[$chapter[masterID]]) array_push($chapters[$chapter[masterID]][items],$chapter[id]);
    }
    addattachment($item->name,$style.$body.getchapter($itemID,0).$sign,$items);
}
function hdr($doc,$TitleID){
    $h.="<table style='width:18cm'><tr><td class='toaddress' style='width:12cm;padding-top:40mm;'>";
    if (!$doc->Factuurnummer) $h.="<div style='margin-bottom:0.5cm;font-family:barcode;font-size:40px;text-align:left;'>*".$doc->Ordernummer."*</div>";
    if ($to=$doc->To) {
        if ($doc->Factuurnummer && $to->OtherAddressStreet.$to->OtherAddressNumber.$to->OtherAddressAdd.$to->OtherAddressPostalCode.$to->OtherAddressCity.$to->OtherAddressTown.$to->OtherAddressState.$to->OtherAddressCountry) {
            $h.="<p><b>$to->CompanyName</b><br>$to->OtherAddressStreet $to->OtherAddressNumber $to->OtherAddressAdd<br>$to->OtherAddressPostalCode $to->OtherAddressCity<br>$to->OtherAddressTown $to->OtherAddressState $to->OtherAddressCountry</p>";
        }
        else
            $h.="<p><b>$to->CompanyName</b><br>$to->BusinessAddressStreet $to->BusinessAddressNumber $to->BusinessAddressAdd<br>$to->BusinessAddressPostalCode $to->BusinessAddressCity<br>$to->BusinessAddressTown $to->BusinessAddressState $to->BusinessAddressCountry</p>";
    }
    $h.="</td><td><small>";
    if ($company=$doc->From) {
        if ($doc->src) $logo="<div><img src='$doc->src' style='width:5cm;margin-bottom:5mm;object-fit:cover;' /></div>";
        $h.="$logo<p><b>$company->CompanyName</b></p><p>$company->BusinessAddressStreet $company->BusinessAddressNumber $company->BusinessAddressAdd<br>$company->BusinessAddressPostalCode $company->BusinessAddressCity<br>$company->BusinessAddressTown $company->BusinessAddressState $company->BusinessAddressCountry</p>";
        $h.="<p>";
        foreach(array(BusinessPhones0=>"Telefoon",EmailAddresses1Address=>"Email",BusinessHomePage=>"Website")as$key=>$label)if($value=$company->$key)$h.="<div>$label: $value</div>";
        $h.="</p><p>";
        foreach(array(KvKnr=>"KvK",BTWnr=>"BTW",IBAN=>"IBAN",BIC=>"BIC")as$key=>$label)if($value=$company->$key)$h.="<div>$label: $value</div>";
        $h.="</p>";
    }
    $h.="</small></td></tr>";
    $h.="</table><table style='width:18cm'><tr><td style='font-size:20pt;'>".$doc->{"Title$TitleID"}."</td></tr></table>";
    //$h.=json_encode($doc->hdr);
    foreach ($doc->hdr as $row) {
        $hk=$hv="";
        foreach ($row as $fname=>$field) if (($field=(object)$field) && ($value=$field->value) && (!isset($field->TitleID) || $field->TitleID==$TitleID)) { if ($fname) $hk.="<td style='$field->style'>$fname</td>"; $hv.="<td style='$field->style'>$value</td>"; }
        $h.=$hk||$hv?"<table class='hdrow' style='width:18cm;'>".($hk?"<tr class='hdr'>$hk</tr>":"")."<tr>$hv</tr></table>":"";
    }
    return $h;
}
function writepage($doc,$TitleID) {
    $h.=hdr($doc,$TitleID);
    if ($doc->Regels) {
        $h.="<table class='art'>";
        foreach ($doc->Regels as $rgl) {
            $cnt+=ceil(strlen($rgl->Omschrijving)/60);
            if ($cnt>=20) {
                $hdrdone=$cnt=0;
                $h.="<tr><td colspan=99>Einde pagina ".$doc->hdr[0][Pag][value]++.". Zie verder volgende pagina.</td></tr></table><div class='np'></div>".hdr($doc,$TitleID)."<table class='art'>";
            }
            if (!$hdrdone) {
                $hdrdone=true;
                $h.="<tr class='hdr'>";
                foreach ($rgl as $h_name=>$h_value) $h.="<td class='$h_name'>$h_name</td>";
                $h.="</tr>";
            }
            $h.="<tr>";
            foreach ($rgl as $h_name=>$h_value) $h.="<td class='$h_name'>".(in_array($h_name,array(Netto,Totaal))?nv($h_value):mb_convert_encoding($h_value, "HTML-ENTITIES", "UTF-8"))."</td>";
            $h.="</tr>";
        }
        $h.="</table></div>";
        $hk=$hv="";
        foreach ($doc->footer as $fname=>$field) if (($field=(object)$field) && ($value=$field->value) && (isset($field->TitleID)?$field->TitleID==$TitleID:true)) { if ($fname) $hk.="<td style='$field->style'>$fname</td>"; $hv.="<td style='$field->style'>$value</td>"; }
        $h.=$hk||$hv?"<table class='hdrow' style='width:18cm;'><tr class='hdr'><td style='width:100%;'></td>$hk</tr><tr><td></td>$hv</tr></table>":"";
    }
    return $h;
}
function dochtml($doc) {
    foreach ($doc->Regels as $rgl) {
        if ($doc->Factuurnummer) {
            foreach (array(Gewicht,Locatie) as $key) unset($rgl->$key);
            $tot+=$rgl->Totaal=round($rgl->Netto*$rgl->Aantal*100)/100;
        }
        else {
            foreach (array(Netto,Totaal) as $key) unset($rgl->$key);
            $kg+=$rgl->Aantal*$rgl->Gewicht;
        }
    }
    if ($kg) $doc->hdr[0][Gewicht]=array(value=>n($kg));
    if ($doc->Factuurnummer) {
        if ($kort=$doc->Korting) {
            $doc->footer["Netto totaal"]=array(value=>nv($tot),style=>'text-align:right;white-space:nowrap;');
            $doc->footer["Korting $kort%"]=array(value=>nv($kortbedrag=-round($tot*$kort)/100),style=>'text-align:right;white-space:nowrap;');
            $tot+=$kortbedrag;
        }
        if ($VrachtKost=$doc->VrachtKost) {
            $doc->footer[Vrachtkosten]=array(value=>nv($VrachtKost),style=>'text-align:right;white-space:nowrap;');
            $tot+=$VrachtKost;
        }
        if ($btwproc=$doc->To->BtwProc) {
            $doc->footer["Totaal"]=array(value=>nv($tot),style=>'text-align:right;white-space:nowrap;');
            $doc->footer["BTW $btwproc%"]=array(value=>nv($btwbedrag=round($tot*$btwproc)/100),style=>'text-align:right;white-space:nowrap;');
            $tot+=$btwbedrag;
        }
        $totbedrag=$tot;
        if ($doc->voldaanCONTANT) {
            $doc->footer["Totaal factuur"]=array(value=>nv($tot),style=>'text-align:right;white-space:nowrap;');
            $doc->footer["Contant"]=array(value=>nv($doc->voldaanCONTANT),style=>'text-align:right;white-space:nowrap;');
            $tot-=$doc->voldaanCONTANT;
            $keys=array_keys($doc->footer);
            $values=array_values($doc->footer);
        }
        if ($doc->voldaanPIN) {
            $doc->footer["Totaal factuur"]=array(value=>nv($tot),style=>'text-align:right;white-space:nowrap;');
            $doc->footer["PIN"]=array(value=>nv($doc->voldaanPIN),style=>'text-align:right;white-space:nowrap;');
            $tot-=$doc->voldaanPIN;
        }
        if ($doc->voldaanBANK) {
            $doc->footer["Totaal factuur"]=array(value=>nv($tot),style=>'text-align:right;white-space:nowrap;');
            $doc->footer["Bank"]=array(value=>nv($doc->voldaanBANK),style=>'text-align:right;white-space:nowrap;');
            $tot-=$doc->voldaanBANK;
        }
        $tot=round($tot*100)/100;
        //if (($tot=round($tot*100)/100)==0) $doc->hdr[0][Openstaand]=array(value=>"REEDS VOLDAAN",style=>"background:rgb(200,255,200);border:solid 1px green;white-space:nowrap;");
        //$doc->footer["TE BETALEN"]=$doc->hdr[0]["TE BETALEN"]=array(value=>$tot?"$tot":"REEDS VOLDAAN",style=>'border:solid 1px black;text-align:right;white-space:nowrap;padding-left:10mm;'.(!$tot?"background:rgb(200,255,200);border:solid 1px green;":""));
    }
    $doc->hdr[0][Pag]=array(value=>1,style=>'text-align:right;white-space:nowrap;width:100%;');
    if (isset($tot)) $doc->footer["TE BETALEN"]=$doc->hdr[0]["TE BETALEN"]=array(value=>!$tot && $totbedrag?"REEDS VOLDAAN":nva($tot),style=>'border:solid 1px black;text-align:right;white-space:nowrap;padding-left:10mm;'.(!$tot?"background:rgb(200,255,200);border:solid 1px green;":""));

    if ($company=$doc->From) {
        $companyFiles=json_decode($company->files);
        $src=array_shift($companyFiles)->src;
        $doc->src=($src[0]=="/"?"https://aliconnect.nl":"").$src;
    }
    global $aim;
    //err($aim);
    return "<!DOCTYPE html><html xmlns='http://www.w3.org/1999/xhtml'><head>
    <meta http-equiv='Content-Type' content='text/html; charset=UTF-8;' />
    <meta http-equiv='X-UA-Compatible' content='IE=edge' />
    <link href='/aim/v1/lib/css/printpdf.css' rel='stylesheet' />
    <link href='https://aliconnect.nl/sites/$aim->host/app/v1/css/$aim->host.css' rel='stylesheet'></link>
    <style>
        body,table{font-family:sans-serif;}
        .Omschrijving {width:100%;}
        .Aantal,.Netto,.Totaal,.Bedrag {text-align:right;white-space:nowrap;}
        .ArtNr,.Eenheid,.OrderDatum,.FactuurDatum {white-space:nowrap;}
        table.hdrow tr>:last-child{width:100%;}
    </style>
    </head><body class='$doc->className'>".writepage($doc,1).($doc->Title2?"<div class='np'></div>".writepage($doc,2):null)."$remark</body></html>";
    return $h;
}
function mailhtml($doc) {
    function fn($n){return number_format($n,2,',','.');};

    $st="width:50%;border:solid 1px #eee;padding:5px";
    $rgls.="<table style='width:100%;max-width:600px;border-collapse:collapse;border:solid 1px #eee;'>";
    $rgls.="<tr><td style='$st;background:#eee;'><b>Ordernummer:</b></td><td style='$st;background:#eee;'><b>Datum:</b></td></tr>";
    $rgls.="<tr><td style='$st'>$bon->PakbonID</td><td style='$st'>".date("d-m-Y h:m:s",strtotime($bon->Datum))."</td></tr>";

    $rgls.="<tr><td valign=top style='$st;background:#eee;'><b>Verzendinformatie:</b></td><td style='$st;background:#eee;'><b>Factuurgegevens:</b></td></tr>";
    $rgls.="<tr><td valign=top style='$st'>$bon->Firma<div>$bon->Aanhef</div>$bon->Straat<br>$bon->Postcode $bon->Plaats<br>$bon->emailbon</td><td valign=top style='$st;'>$bon->Aanhef2<br>$bon->FactStraat<br>$bon->FactPlaats<br>$bon->emailfactuur</td></tr>";
    $rgls.="<tr><td valign=top style='$st;background:#eee;'><b>Verzendmethode:</b></td><td valign=top style='$st;background:#eee;'><b>Betaalmethode:</b></td></tr>";
    $rgls.="<tr><td valign=top style='$st'>Transport</td><td valign=top style='$st;'>Op rekening</td></tr>";
    $rgls.="</table>";
    $rgls.="<table style='width:100%;max-width:600px;border-collapse:collapse;border:solid 1px #eee;'>";
    $rgls.="<tr style='background:#eee;font-weight:bold;'><td style='padding:5px;'>Omschrijving<br>Artikel</td><td valign=top align=right style='padding:5px;'>Aantal<br>Subtotaal</td></tr>";
    if (next_result ($res)) while ($rgl = fetch_object($res)) {
        foreach ($rgl as $key=>$value) {
            $value=mb_convert_encoding($value, "HTML-ENTITIES", "UTF-8");
            $rgl->$key=$value;
        }
        $tot+=$som=$rgl->Netto*$rgl->Aantal;
        $rgls.=PHP_EOL."<tr style=''><td style='padding:5px;border-bottom:solid 1px #eee;'>$rgl->Omschrijving<br>$rgl->ArtNr</td><td valign=top align=right style='padding:5px;border-bottom:solid 1px #eee;white-space:nowrap'>".($rgl->Aantal?"$rgl->Aantal $rgl->Eenheid<br>&euro; ".fn($som):"")."</td></tr>";
    };
    if ($bon->betkort) {
        $rgls.=PHP_EOL."<tr style=''><td style='padding:5px;border-bottom:solid 1px #eee;'>Betalings korting</td><td valign=top align=right style='padding:5px;border-bottom:solid 1px #eee;white-space:nowrap'>-$bon->betkort %<br>&euro; ".fn($tot*-$bon->betkort/100)."</td></tr>";
        $tot-=$tot*$bon->betkort/100;
    }

    $rgls.="<tr style='line-height:24px;'><td align=right style='padding:5px;'>Subtotaal<br>BTW $bon->btw%<br><b>Eindtotaal</b></td><td align=right style='padding:5px;'>".fn($tot)."<br>".fn($btw=$tot*$bon->btw/100)."<br><b>".fn($btw+$tot)."</b></td></tr>";
    $rgls.="</table>";
}
function msgattach($fname,$html) {
    if ($html) {
        $fname=__DIR__."/doc/pdf/$fname.pdf";
        unlink($fname);
        file_put_contents($fname, docpdf($html)->output());
    }
    return (object)array(filename=>$fname,name=>$name,temp=>1);
}
function msg($msg){
    $attachements=array();
    foreach($msg->attachements as $doc) {
        if ($doc->html) {
            $doc->filename=$_SERVER['DOCUMENT_ROOT']."/shared/temp/".str_replace(array('/'),"",$doc->name);
            unlink($doc->filename);
            file_put_contents($doc->filename, docpdf($doc->html)->output());
        }
    }
    require_once (__DIR__."/mail.php");
    //mail::send($msg);
    mail::add($msg);
}
function doc($doc){
    //$html=dochtml($doc);
    $html=dochtml($doc);
    if ($doc->send) {
        if ($doc->emailaddress) {
            $from=$doc->From;
            //err($doc->emailaddress);
            msg((object)array(
                FromName=>"$from->DisplayName ($from->bedrijf)",
                Subject=>$doc->Subject,
                write=>1,
                fromaddress=>$doc->fromaddress,
                host=>strtolower($from->bedrijf),
                attachements=>array(
                    (object)array(name=>$doc->name.".pdf",html=>$html)
                ),
                to=>$doc->emailaddress,
                cc=>$doc->emailaddresscc,
                bcc=>$doc->emailaddressbcc,
                msgs=>$doc->msgs,//array(array(content=>$doc->msgbody)),
            ));
            //return $html;
        }
        else $doc->print=1;
    }
    if ($doc->print && $doc->printsrvc) {
        //unset($doc->print);
        $server=(object)$_SERVER;
        $aliconnectin=(object)$_GET;
        $aliconnectout=array();
        unset($aliconnectin->printsrvc);
        foreach($aliconnectin as $key=>$value)array_push($aliconnectout,"$key=$value");
        $url=array_shift(explode('/',$server->SERVER_PROTOCOL))."://".$server->SERVER_NAME.$server->SCRIPT_NAME."?".implode('&',$aliconnectout);
        $doc->copy=$doc->copy?$doc->copy:1;
        for ($x = 1; $x <= $doc->copy; $x++) $q.="INSERT aim.auth.appprintqueue (uid,href,documentname,html) VALUES ('$doc->printsrvc','$url','$doc->name','".dbvalue($html)."');";
        query($q);
        //die("Document verzonden naar printer service;";
    }
    else if ($doc->print) { $html=str_replace("</body>","<script>print();</script></body>",$html); }
    //die($doc->pdf);

	//err($doc);

    if ($doc->pdf) {
        //echo docpdf($html);
        docpdf($html)->stream($doc->name.".pdf", array("Attachment" => false));
        die();
    }
    else if($doc->responseType==json)die(json_encode($doc));
	else echo $html;
    return;// $html;
}
function docpdf($html) {
    require_once ($_SERVER['DOCUMENT_ROOT']."/inc/dompdf/dompdf_config.inc.php");
    $dompdf = new DOMPDF();
    if ($_SERVER[HTTP_HOST]!=localhost){
        $html=str_replace(array("src='/","src='https://aliconnect.nl/"),"src='".$_SERVER['DOCUMENT_ROOT']."/",$html);
    }
    $html=str_replace(array("href='/","href='https://aliconnect.nl/"),"href='".$_SERVER['DOCUMENT_ROOT']."/",$html);
    //$html=str_replace("img src=document.location.protocol+'//aliconnect.nl/","img src='".$_SERVER['DOCUMENT_ROOT']."/",$html);
    //err($_SERVER);
    //die($html);
    $dompdf->load_html($html);
    $dompdf->set_paper("a4");
				//die(STOP.":".__CLASS__.".".__FUNCTION__.$html);
    $dompdf->render();
    return $dompdf;
}
?>

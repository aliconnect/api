unit Html;

interface

uses ShDocVw,Classes;

function GetElementIdValue(WebBrowser: TWebBrowser;  TagName, TagId, TagAttrib: string):string;
function GetElementId(WebBrowser: TWebBrowser;  TagId: string):string;
function callfunction(WebBrowser:TWebBrowser;name,par: string):string;
function browserexec(WebBrowser:TWebBrowser;par:string):string;
function uploadData(url,data:string): string;
function uploadfile(filename,url:string): string;
function downloadFile(url,DestFilename:string):boolean;
function getresult(url:string;PostVars: TStringList):string;
//function getresult(url:string):string;
function setinputvalue(WebBrowser:TWebBrowser;id,value:string):boolean;

var
  domainurl,rooturl : string;

implementation

uses
  Windows, Messages, SysUtils, Variants, Graphics, Controls, Forms,
  Dialogs, Menus, StdCtrls, ComCtrls, OleCtrls, MSHTML,ComObj,  IdHTTP,
    IdCustomHTTPServer, IdHTTPServer,
  IdMultipartFormData, IdHeaderList, IdMessageCoder,
  IdMessageCoderMIME, IdMessage,uAlicon
  ,IdCoder, IdCoder3to4, IdCoderMIME;


function getresult(url:string;PostVars: TStringList):string;
//function getresult(url:string):string;
var
  IdHTTP1: TIdHTTP;
  Stream: TStringStream;
  //PostVars : TStringList;
begin
{
  IdHTTP1:= TIdHTTP.Create(nil);
  //PostVars := TStringList.Create;
  Stream := TStringStream.Create('');
  try
    //PostVars.Values['filename'] := 'test';
    Application.ProcessMessages;
    try
      IdHTTP1.Post(url, PostVars, Stream);
    except
    on E: Exception do
      ShowMessage('Error encountered during POST: ' + E.Message);
    end;
  finally
    result:= Stream.DataString;
  end;
  //PostVars.Free;
  Stream.Free;
}
end;

function setinputvalue(WebBrowser:TWebBrowser;id,value:string):boolean;
var
  col: IHTMLElementCollection;
  el: IHTMLInputElement;
begin
  result:=false;
  col := (WebBrowser.Document as IHTMLDocument3).getElementsByName(id);
  if col.length <> 0 then
  begin
    el := col.item(0, 0) as IHTMLInputElement;
    el.value := value;
    result:=true;
  end;
end;

function callfunction(WebBrowser:TWebBrowser;name,par:string):string;
  { Calls JavaScript foo() function }
var
  Doc: IHTMLDocument2;      // current HTML document
  HTMLWindow: IHTMLWindow2; // parent window of current HTML document
  JSFn,pars: string;             // stores JavaScipt function call
  sl:TStringList;
  i:integer;
begin
  Result := '';
  // Get reference to current document
  Doc := WebBrowser.Document as IHTMLDocument2;
  if not Assigned(Doc) then
    Exit;
  // Get parent window of current document
  HTMLWindow := Doc.parentWindow;
  if not Assigned(HTMLWindow) then
    Exit;
  // Run JavaScript
  try
//    JSFn := Format(fname+'("%s",%d)', [S, I]);    // build function call
{
sl:=TStringList.Create;
sl.Delimiter := ',';        // Each list item will be blank separated
sl.QuoteChar := '"';
sl.DelimitedText := par;
for i := 0 to sl.Count-1 do
  begin
    if (pars>'') then pars:=pars+',';
    pars:=pars+sl.Names[i]+':'+quotedStr(sl.ValueFromIndex[i]);
  end;
}

    {
    pars:='';
    for i:=0 to length(par)-1 do
      if (par[i]>'') then
        pars:=pars+par[i];
    pars:=stringreplace(pars,#2,'',[rfReplaceAll]);
    pars:=stringreplace(pars,#3,'',[rfReplaceAll]);
    pars:=stringreplace(pars,#13,'',[rfReplaceAll]);
    pars:=stringreplace(pars,#10,'',[rfReplaceAll]);
    }
    par:=stringreplace(par,#2,'',[rfReplaceAll]);
    par:=stringreplace(par,#3,'',[rfReplaceAll]);
    par:=stringreplace(par,#13,'',[rfReplaceAll]);
    par:=stringreplace(par,#10,'',[rfReplaceAll]);
    //par:=stringreplace(par,'''','"',[rfReplaceAll]);
    par:=stringreplace(par,'''','"',[rfReplaceAll]);
    if (copy(par,0,1)='{') then
      JSFn := 'if("'+name+'"in window)'+name+'('+par+')'    // build function call
    else
      JSFn := 'if("'+name+'"in window)'+name+'("'+par+'")';    // build function call
    //showmessage(jsfn);
    //JSFn := name+'()';    // build function call
    HTMLWindow.execScript(JSFn, 'JavaScript'); // execute function
    // get result
    //Result := GetElementIdValue(WebBrowser, 'input', 'aimBrowserResult', 'value')
  except
    // handle exception in case JavaScript fails to run
  end;
end;

function browserexec(WebBrowser:TWebBrowser;par:string):string;
var
  Doc: IHTMLDocument2;      // current HTML document
  HTMLWindow: IHTMLWindow2; // parent window of current HTML document
  JSFn,pars: string;             // stores JavaScipt function call
  sl:TStringList;
  i:integer;
begin
  Result := '';
  Doc := WebBrowser.Document as IHTMLDocument2;
  if not Assigned(Doc) then
    Exit;
  HTMLWindow := Doc.parentWindow;
  if not Assigned(HTMLWindow) then
    Exit;
  try
    pars:='';
    for i:=0 to length(par) do
      if (par[i]>'') then
        pars:=pars+par[i];
    pars:=stringreplace(pars,#2,'',[rfReplaceAll]);
    pars:=stringreplace(pars,#3,'',[rfReplaceAll]);
    pars:=stringreplace(pars,#13,'',[rfReplaceAll]);
    pars:=stringreplace(pars,#10,'',[rfReplaceAll]);

{
    par:=stringreplace(par,#2,'',[rfReplaceAll]);
    par:=stringreplace(par,#3,'',[rfReplaceAll]);
    par:=stringreplace(par,#13,'',[rfReplaceAll]);
    par:=stringreplace(par,#10,'',[rfReplaceAll]);
}

    JSFn := pars;    // build function call
    //showmessage(jsfn);
    HTMLWindow.execScript(JSFn, 'JavaScript'); // execute function
  except
  end;
end;

function GetElementIdValue(WebBrowser: TWebBrowser;  TagName, TagId, TagAttrib: string):string;
var
  Document: IHTMLDocument2;
  Body: IHTMLElement2;
  Tags: IHTMLElementCollection;
  Tag: IHTMLElement;
  I: Integer;
begin
  Result:='';
  if not Supports(WebBrowser.Document, IHTMLDocument2, Document) then
    raise Exception.Create('Invalid HTML document');
  if not Supports(Document.body, IHTMLElement2, Body) then
    raise Exception.Create('Can''t find <body> element');
  Tags := Body.getElementsByTagName(UpperCase(TagName));
  for I := 0 to Pred(Tags.length) do begin
    Tag:=Tags.item(I, EmptyParam) as IHTMLElement;
    if Tag.id=TagId then Result := Tag.getAttribute(TagAttrib, 0);
  end;
end;

function GetElementId(WebBrowser: TWebBrowser;  TagId: string):string;
var
  Document: IHTMLDocument2;
  Body: IHTMLElement2;
  Tags: IHTMLElementCollection;
  Tag: IHTMLElement;
  I: Integer;
  el: IHTMLElement;
begin
  Result:='';
  el := (WebBrowser.Document as IHTMLDocument3).getElementById(TagId);
  if (assigned(el)) then
    result:=el.innerText;
end;

function uploadData(url,data:string): string;
var
  IdHTTP1: TIdHTTP;
  PostVars: TStringList;
  Stream: TStringStream;
    StringStream: TStringStream;

begin
  IdHTTP1:= TIdHTTP.Create(nil);
  PostVars := TStringList.Create;
  Stream := TStringStream.Create('');
  StringStream := TStringStream.Create(data);
  try
    PostVars.Values['data'] := data;
    Application.ProcessMessages;
    try
      IdHTTP1.HandleRedirects := True;
      IdHTTP1.Post(url, PostVars, Stream);
    except
    on E: Exception do
      ShowMessage('Error encountered during POST: ' + E.Message);
    end;
  finally
    result:=Stream.DataString;
    Stream.Free;
    StringStream.Free;
    PostVars.Free;
  end;
end;

function uploadFile(filename,url:string): string;
var
  IdHTTP1: TIdHTTP;
  Stream: TStringStream;
  StringStream: TStringStream;
  PostVars: TStringList;
  FileStream: TFileStream;
  IdEncoderMIME1: TIdEncoderMIME;
begin
  IdHTTP1:= TIdHTTP.Create(nil);
  IdEncoderMIME1:= TIdEncoderMIME.Create(nil);
  PostVars := TStringList.Create;
  Stream := TStringStream.Create('');
  StringStream := TStringStream.Create('');
  //FileStream := TFileStream.Create(FileName, fmOpenRead or fmShareDenyWrite);
  FileStream := TFileStream.Create(FileName, fmOpenRead or fmShareDenyWrite);
  try
    StringStream.CopyFrom(FileStream, FileStream.Size);
    //PostVars.Values['exec'] := 'uploadfile';
    PostVars.Values['data'] := IdEncoderMIME1.Encode(StringStream.DataString);
    PostVars.Values['src'] := url;
    //PostVars.Values['name'] := name;
    //PostVars.Values['id'] := id;
    Application.ProcessMessages;
    try
      IdHTTP1.HandleRedirects := True;
      //IdHTTP1.Post('http://www.alicon.nl/aim/api/index.php', PostVars, Stream);
      //IdHTTP1.Post('http://www.alicon.nl/api/v1/index.php', PostVars, Stream);
      IdHTTP1.Post('http://alicon.nl/v1/api?request_type=uploadfile', PostVars, Stream);
      //result:=true;
    except
    on E: Exception do
      ShowMessage('Error encountered during POST: ' + E.Message);
    end;
  finally
    //if (Stream.DataString>'') then showmessage(Stream.DataString);
    result:=Stream.DataString;
    Stream.Free;
    StringStream.Free;
    PostVars.Free;
    FileStream.Free;
  end;
end;

//function downloadFile(Host,Path,Name,DestFilename:string):boolean;
function downloadFile(url,DestFilename:string):boolean;
var fs:TFileStream;
 //http: TIdHTTP;
 //stream: TMemoryStream;
  //handler: TIdSSLIOHandlerSocketOpenSSL;
pUrl,pFileName:pAnsiChar;
begin
  //url:='http://www.alicon.nl/sites/moba/E3222A910CE74F72A41B4B279D4C4222_Document_1.docx';
  pUrl:=PChar(url);
  pFileName:=PChar(DestFilename);
  if FileInUse(pFileName) then
    showMessage(pFileName+' is in gebruik. Sluit dit bestand af.')
  else
    begin
    result:=false;
    if (pUrl=nil) or (pFileName=nil) then exit;                     //Check arguments
    if fileAge(pFileName)>-1 then forceDeleteFile(pFileName);       //Delete existing file
             {
http := TIdHTTP.Create(nil);
  try
    stream := TMemoryStream.Create;
    try
      handler := TIdSSLIOHandlerSocketOpenSSL.Create(http);
      http.IOHandler := handler;
      http.HandleRedirects := true;
      http.Get(url, stream);
      stream.SaveToFile(DestFilename); // zum testen
    finally
      stream.Free;
    end;
  finally
    http.Free;
  end;
                         }

    try fs:=TFileStream.Create(pFileName,fmCreate) except exit end; //Create file stream
    with TIdHttp.Create(nil) do begin                               //Create http object
      request.userAgent:=INET_USERAGENT;                             //Define user agent
      redirectMaximum:=INET_REDIRECT_MAX;                            //Redirect maxumum
      handleRedirects:=INET_REDIRECT_MAX<>NONE;                      //Handle redirects
    try
      get(pUrl,fs);
      result:=fs.size>NONE;
    except
      end;              //Do the request
    free                                                           //Free the http object
    end;
     //fs..SaveToFile(DestFilename); // zum testen
    fs.free;                                                    //Free the file stream
  end;
end;


end.

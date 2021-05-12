{$A8,B-,C+,D+,E-,F-,G+,H+,I+,J-,K-,L+,M-,N+,O+,P+,Q-,R-,S-,T-,U-,V+,W-,X+,Y+,Z1}
{$WARN UNSAFE_TYPE OFF}

unit UMyExternal;

interface

uses
  Classes, ComObj, AimBrowser_TLB;

type

  TMyExternal = class(TAutoIntfObject, IMyExternal, IDispatch)
  private
    fData: TStringList; // info from data file
    procedure ShowSBMsg(const Msg: string); // helper method
  protected
    { IMyExternal methods }
    procedure hide; safecall;
    procedure show; safecall;
    procedure printurl(const url: WideString); safecall;

    procedure writefile(const filename,content: WideString); safecall;
    procedure writelnfile(const filename,content: WideString); safecall;
    function readfile(const filename: WideString;rename:integer): WideString; safecall;
    function readfilearray(const filename: WideString): WideString; safecall;
    procedure filedownload(const url: WideString); safecall;

    procedure mailimport(const sessionId,hostId,userId: WideString); safecall;
    procedure contactimport(const sessionId,hostId,userId: WideString); safecall;

    procedure opcConnect(const servername: WideString); safecall;
    procedure opcDisconnect(); safecall;
    procedure opcSetVar(const itemId: WideString); safecall;
    procedure opcSet(const itemId,value: WideString); safecall;

    function SendToApp(const appname,line,par: WideString):WideString; safecall;

    // vervallen

    procedure print(); safecall;
    procedure dataSet(const name,data: WideString); safecall;
    procedure sendVar(const name,value: WideString); safecall;
    procedure setVar(const name,value: WideString); safecall;
    procedure EditFile(const url: WideString); safecall;
    procedure getHtml(); safecall;
    procedure geturl(const url: WideString); safecall;
    procedure ShowURL(const ProgID: WideString); safecall;
    procedure HideURL; safecall;
    function GetPrecis(const ProgID: WideString): WideString; safecall;

  public
    constructor Create;
    destructor Destroy; override;
  end;

implementation

uses
  SysUtils, ActiveX, StdActns, fAimBrowser, Windows, Messages, Dialogs, Forms, Html, uAlicon, fCommService;

{ TMyExternal }

constructor TMyExternal.Create;
var
  TypeLib: ITypeLib;    // type library information
  ExeName: WideString;  // name of our program's exe file
begin
  // Get name of application
  ExeName := ParamStr(0);
  // Load type library from application's resources
  OleCheck(LoadTypeLib(PWideChar(ExeName), TypeLib));
  // Call inherited constructor
  inherited Create(TypeLib, IMyExternal);
  // Create and load string list from file
  //fData := TStringList.Create;
  //fData.LoadFromFile(ChangeFileExt(ExeName, '.dat'));
end;

destructor TMyExternal.Destroy;
begin
  fData.Free;
  inherited;
end;

procedure TMyExternal.hide;
begin
  //if (assigned(fmAIMOPC)) then fmAIMOPC.hide();
  fmMain.Hide;
  html.callfunction(fmMain.Webbrowser, 'reply', 'hide');
end;

procedure TMyExternal.show;
begin
  fmMain.Show;
  html.callfunction(fmMain.Webbrowser, 'reply', 'show');
end;

procedure TMyExternal.printurl(const url: WideString); safecall;
begin
  fmMain.wbGetHtml.Navigate(url);
  html.callfunction(fmMain.Webbrowser, 'reply', 'done');
end;

procedure TMyExternal.print(); safecall;
var
  vaIn, vaOut: OleVariant;
  //print without dialog
begin
  fmMain.WebBrowser.ControlInterface.ExecWB(OLECMDID_PRINT, OLECMDEXECOPT_DONTPROMPTUSER, vaIn, vaOut);
end;

procedure TMyExternal.writelnfile(const filename,content: WideString); safecall;
var
  myFile : TextFile;
  fname,path: string;
begin
  fname:=stringreplace(filename,'/','\',[rfReplaceAll]);
  AssignFile(myFile, fname);
  if (not SysUtils.FileExists(fname)) then
  begin
    forcedirectories(extractfilepath(fname));
    rewrite(myfile)
  end
  else
    append(myfile);
  writeln(myFile, content);
  CloseFile(myFile);
end;

procedure TMyExternal.writefile(const filename,content: WideString); safecall;
var
  myFile : TextFile;
  fname,path: string;
begin
  fname:=stringreplace(filename,'/','\',[rfReplaceAll]);
  path:=extractfilepath(fname);
  forcedirectories(path);
  AssignFile(myFile, fname);
  ReWrite(myFile);
  write(myFile, content);
  CloseFile(myFile);
end;

function TMyExternal.readfile(const FileName: WideString;rename:integer): WideString; safecall;
var
  FileStream : TFileStream;
  ResultString: AnsiString;
  fname,OldFilename: string;
  sl:Tstringlist;
  i: integer;
  StrLen : integer;
begin
  fname:=stringreplace(filename,'/','\',[rfReplaceAll]);
  if (FileExists(fname)) then
  begin
    i:=1;
    if (rename=1) then
    begin
      repeat
        OldFilename:= ChangeFileExt(fname, '')+inttostr(i)+'.old';
        inc(i);
        until not FileExists(OldFilename);
      //deletefile(PAnsiChar(OldFilename));
      RenameFile(fname, OldFilename);
    end
    else
      OldFilename:=fname;
    FileStream:= TFileStream.Create(OldFilename, fmOpenRead or fmShareDenyWrite);
    try
      if FileStream.Size>0 then
      begin
        SetLength(ResultString, FileStream.Size);
        FileStream.Read(Pointer(ResultString)^, FileStream.Size);
        //fmMain.mFileRead.lines.add(inttostr(ord(ResultString[i])));
      end;
    finally
      FileStream.Free;
    end;

    Result:= ResultString;
  end;
end;

function TMyExternal.readfilearray(const FileName: WideString): WideString; safecall;
var
  FileStream : TFileStream;
  ResultString: AnsiString;
  fname,OldFilename: string;
  sl:Tstringlist;
  i: integer;
  StrLen : integer;
begin
  fname:=stringreplace(filename,'/','\',[rfReplaceAll]);
  if (FileExists(fname)) then
  begin
    FileStream:= TFileStream.Create(fname, fmOpenRead or fmShareDenyWrite);
    try
      if FileStream.Size>0 then
      begin
        SetLength(ResultString, FileStream.Size);
        FileStream.Read(Pointer(ResultString)^, FileStream.Size);
      end;
    finally
      FileStream.Free;
    end;
    sl:=TStringList.create();
    //showMessage(IntToStr(Length( ResultString )));


    for i := 1 to Length( ResultString ) do sl.add(inttostr(ord(ResultString[i])));
    result:=sl.text;
    sl.Free;
  end;
end;

procedure TMyExternal.HideURL;
begin
  ShowSBMsg('');
end;

procedure TMyExternal.ShowSBMsg(const Msg: string);
var
  HintAct: THintAction;
begin
  HintAct := THintAction.Create(nil);
  try
    HintAct.Hint := Msg;
    HintAct.Execute;
  finally
    HintAct.Free;
  end;
  fmMain.StatusBar1.simpleText:=Msg;

end;

procedure TMyExternal.ShowURL(const ProgID: WideString);
begin
  ShowSBMsg(
    'http://www.delphidabbler.com/software?id=' + ProgID
  );
end;


procedure TMyExternal.EditFile(const url: WideString); safecall;
var
  myFile: TextFile;
begin

  //filename:=uppercase(uid)+'.'+ext;
  {
  fmMain.fileId := IntToStr(fileId);
  with (fmMain) do
  begin
    SaveDialog1.DefaultExt:='.'+uppercase(edituid)+'.'+ext;
    SaveDialog1.FileName:=ChangeFileExt(filename,'.'+uppercase(edituid)+'.'+ext);
    if (SaveDialog1.Execute) then
    begin
      localfilename:=fmMain.SaveDialog1.FileName;
      //localfilename:='d:\'+filename;
      if not fileExists(localfilename) then
      begin
        hostfilename:= uppercase(uid)+'.'+ext;
        filenameurl:=domainurl+'aim-content/'+ext+'/'+hostfilename;
      //showmessage(filenameurl);
        downloadFile(url,localfilename);
      end;
      wordopen(localfilename);
      //callfunction('editfile',itemId,filename);
    end;
  end;
  }
end;

procedure TMyExternal.filedownload(const url: WideString); safecall;
//var   localfilename: string;
begin
  html.callfunction(fmMain.Webbrowser, 'reply', 'start');
  fmMain.SetIcon(1);
  fmMain.filenameurl:=url;
  fmMain.localfilename:=GetEnvironmentVariable('TMP')+'\'+extractfilename(stringReplace(url,'/','\',[rfReplaceAll]));
  //fmMain.localfilename:='C:\aliconnect\'+extractfilename(stringReplace(url,'/','\',[rfReplaceAll]));

  if not fileExists(fmMain.localfilename) then
    downloadFile(url,fmmain.localfilename);
  run(fmmain.localfilename);
  fmMain.SetIcon(0);
  fmmain.tUpload.Enabled:=true;
  callfunction(fmMain.WebBrowser,'send','{"filedownload":"'+url+'"}');
  //fmmain.Show;
end;


procedure PostKeyEx32(key: Word; const shift: TShiftState; specialkey: Boolean);
type
  TShiftKeyInfo = record
    shift: Byte;
    vkey: Byte;
  end;
  byteset = set of 0..7;
const
  shiftkeys: array [1..3] of TShiftKeyInfo =
    ((shift: Ord(ssCtrl); vkey: VK_CONTROL),
    (shift: Ord(ssShift); vkey: VK_SHIFT),
    (shift: Ord(ssAlt); vkey: VK_MENU));
var
  flag: DWORD;
  bShift: ByteSet absolute shift;
  i: Integer;
begin
  for i := 1 to 3 do
  begin
    if shiftkeys[i].shift in bShift then
      keybd_event(shiftkeys[i].vkey, MapVirtualKey(shiftkeys[i].vkey, 0), 0, 0);
  end; { For }
  if specialkey then
    flag := KEYEVENTF_EXTENDEDKEY
  else
    flag := 0;

  keybd_event(key, MapvirtualKey(key, 0), flag, 0);
  flag := flag or KEYEVENTF_KEYUP;
  keybd_event(key, MapvirtualKey(key, 0), flag, 0);

  for i := 3 downto 1 do
  begin
    if shiftkeys[i].shift in bShift then
      keybd_event(shiftkeys[i].vkey, MapVirtualKey(shiftkeys[i].vkey, 0),
        KEYEVENTF_KEYUP, 0);
  end; { For }
end; { PostKeyEx32 }


procedure keybd_click(key: integer);
begin
  keybd_event(key, 0, 0, 0);
  keybd_event(key, 0 , KEYEVENTF_KEYUP,0);
end;

procedure postString(s:string);
var
  i,key: integer;
  s1:string;
  c:char;
begin
  if s='F12' then keybd_click(VK_F12)
  else for i:=1 to length(s) do
  begin
    c:=s[i];
    key:=ord(c);
      //showmessage(inttostr(key));
    if ((key>=65) and (key<=90)) or (key>=33) and (key<=47) or (pos(s[i],':"| <>?{}~')>0) then
    begin
      keybd_event(VK_SHIFT, 0, 0, 0);
      keybd_event(VkKeyScan(c), 0, 0, 0);
      keybd_event(VkKeyScan(c), 0, KEYEVENTF_KEYUP, 0);
      keybd_event(VK_SHIFT, 0, KEYEVENTF_KEYUP, 0);
    end
    else if (key=13) then
    begin
      keybd_click(VK_RETURN);
      {
      keybd_event(VK_RETURN, 0, 0, 0);
      keybd_event(VK_RETURN, 0 , KEYEVENTF_KEYUP,0);
      }
    end
    else
    begin
      keybd_event(VkKeyScan(c), 0, 0, 0);
      keybd_event(VkKeyScan(c), 0 , KEYEVENTF_KEYUP,0);
    end;
  end;
end;

function TMyExternal.SendToApp(const appname,line,par: WideString):Widestring; safecall;
var
  npadhandle: HWND;
  appliname: String;
begin
  //Showmessage(line);
  result:= '';


  if (line>'') then
  begin
  appliname:=appname;
  //showmessage(appliname);
  //appliname:='Notepad';
  //npadhandle := FindWindow('Notepad', nil);
  //npadhandle := FindWindow('PCSWS:Main:00400000', nil);
  npadhandle := FindWindow(PAnsiChar(appliname), nil);

  if npadhandle <> 0 then
    begin
      SetForegroundWindow(npadhandle);
      //SendMessage(npadhandle, WM_SYSCOMMAND, SC_RESTORE, 0);
      if (par='') then SendMessage(npadhandle, WM_SYSCOMMAND, SC_RESTORE, 0);
      postString(line);
      if (par='focus') then SetForegroundWindow(application.Handle);
    end
  else
    begin
      Run('C:\Users\Max van Kampen\Desktop\Platform.AS4');
      result:= 'Application not active';
    end;
  //
  //keybd_event(VK_SHIFT, 0, 0, 0);
  //keybd_event(Ord('A'), 0, 0, 0);
  //keybd_event(VK_SHIFT, 0, KEYEVENTF_KEYUP, 0);


  {Presses the Left Window Key and starts the Run}
  {keybd_event(VK_LWIN, 0, 0, 0);
  keybd_event(Ord('R'), 0, 0, 0);
  keybd_event(VK_LWIN, 0, KEYEVENTF_KEYUP, 0);
  }
  //notepad := FindWindow('notepad', nil);

  //application.MainForm.SetFocus;
  end;
end;

procedure TMyExternal.dataSet(const name,data: WideString); safecall;
begin
  fmMain.lDataName.Caption:=name;
  fmMain.mData.Text:=data;
  fmMain.btDoData.Click;
end;

procedure TMyExternal.sendVar(const name,value: WideString); safecall;
begin
  fmMain.vList.Values[name]:=value;
end;

procedure TMyExternal.setVar(const name,value: WideString); safecall;
begin
  fmAIMOPC.sendToOpc(name,value);
end;

procedure TMyExternal.mailimport(const sessionId,hostId,userId: WideString); safecall;
begin
  fmMain.edSessionId.Text:=sessionId;
  fmMain.edHostId.Text:=hostId;
  fmMain.edUserId.Text:=userId;
  fmMain.btMailImport.click();
end;

procedure TMyExternal.contactimport(const sessionId,hostId,userId: WideString); safecall;
begin
  fmMain.edSessionId.Text:=sessionId;
  fmMain.edHostId.Text:=hostId;
  fmMain.edUserId.Text:=userId;
  fmMain.btOlSyncContacts.click();
end;

procedure TMyExternal.opcSetVar(const itemId: WideString); safecall;
begin
  fmAIMOPC.opcSetVar(itemId);
end;

procedure TMyExternal.opcSet(const itemId,value: WideString); safecall;
begin
  fmAIMOPC.writeItem(itemId,value);
end;

procedure TMyExternal.opcConnect(const servername: WideString); safecall;
begin
  if (not assigned(fmAIMOPC)) then Application.CreateForm(TfmAIMOPC, fmAIMOPC);
  fmAIMOPC.show();
  with fmAIMOPC do 
  begin
    if not OpcServer.Active then
    begin//()OpcServer.Active     := false;              // disconnect from old server
      OpcServer.ServerName:=servername;
      OpcServer.Active:= true;
    end;
    OPCGroup.OPCItems.RemoveAll;                  // remove old item from group
    lvRead.items.clear;
  end;
end;

procedure TMyExternal.opcDisconnect(); safecall;
begin
  with fmAIMOPC do
  begin
    OpcServer.Active     := false;              // disconnect from old server
    OPCGroup.OPCItems.RemoveAll;                  // remove old item from group
    lvRead.items.clear;
  end;
end;

function TMyExternal.GetPrecis(const ProgID: WideString): WideString;
begin
  Result := fData.Values[ProgId];
end;

procedure TMyExternal.geturl(const url: WideString); safecall;
begin
  fmMain.mBody.Text:='';
  fmMain.wbGetHtml.Navigate(url);
end;

procedure TMyExternal.getHtml(); safecall;
begin
  {
  mbody.Text:=trim(document.body.innerhtml);  // to get html
  setinputvalue(webbrowser,'htmlinp',mbody.Text);
  callfunction(webbrowser,'uploadhtml',URL);
  }
end;

end.

{$A8,B-,C+,D+,E-,F-,G+,H+,I+,J-,K-,L+,M-,N+,O+,P+,Q-,R-,S-,T-,U-,V+,W-,X+,Y+,Z1}

unit fAimBrowser;

interface

uses
  SysUtils, OleCtrls, SHDocVw, Classes, Controls, ComCtrls, Forms,
  UExternalContainer, Menus, dOPCGUI, dOPCIntf, dOPCComn, dOPCDA, dOPC,
  Windows, Messages, Variants, Graphics, Dialogs, StdCtrls, ToolWin,
  ExtCtrls, StdActns, ActnList, DB, AlcnObj, ADODB, Grids, ValEdit, shellapi,
  ImgList;

const
  WM_ICONTRAY = wm_user + 555;

type
  MouseLLHookStruct = record
    pt          : TPoint;
    mouseData   : cardinal;
    flags       : cardinal;
    time        : cardinal;
    dwExtraInfo : cardinal;
  end;
  TfmMain = class(TForm)
    StatusBar1: TStatusBar;
    WebBrowser: TWebBrowser;
    PageControl1: TPageControl;
    MainMenu1: TMainMenu;
    Connect1: TMenuItem;
    Reload1: TMenuItem;
    TabSheet2: TTabSheet;
    Memo1: TMemo;
    tUpload: TTimer;
    Sync1: TMenuItem;
    Contacts1: TMenuItem;
    ToolBar1: TToolBar;
    ProgressBar1: TProgressBar;
    tDocLoad: TTimer;
    Button1: TButton;
    TabSheet1: TTabSheet;
    mSync: TMemo;
    btOlSyncContactsStart: TButton;
    TabSheet3: TTabSheet;
    mData: TMemo;
    lDataName: TLabel;
    btDoData: TButton;
    btOlSyncContacts: TButton;
    mRow: TMemo;
    mLog: TMemo;
    btMailImport: TButton;
    edCnt: TEdit;
    SaveDialog1: TSaveDialog;
    TabSheet4: TTabSheet;
    mBody: TMemo;
    ActionList1: TActionList;
    EditCut1: TEditCut;
    EditCopy1: TEditCopy;
    EditPaste1: TEditPaste;
    EditSelectAll1: TEditSelectAll;
    EditUndo1: TEditUndo;
    EditDelete1: TEditDelete;
    conn: TADOConnection;
    dLI: TADataSet;
    dsLI: TADataSource;
    tScan: TTimer;
    TabSheet5: TTabSheet;
    mLinks: TMemo;
    TabSheet6: TTabSheet;
    edAdres: TEdit;
    murl: TMemo;
    TabSheet7: TTabSheet;
    mTemp: TMemo;
    TabSheet8: TTabSheet;
    vList: TValueListEditor;
    TabSheet9: TTabSheet;
    ToolBar2: TToolBar;
    Button3: TButton;
    Button5: TButton;
    TabSheet10: TTabSheet;
    mMailItem: TMemo;
    Button4: TButton;
    TabSheet11: TTabSheet;
    edSessionId: TEdit;
    edHostId: TEdit;
    edUserId: TEdit;
    ilIcons: TImageList;
    mPostData: TMemo;
    wbGetHtml: TWebBrowser;
    TabSheet12: TTabSheet;
    mFileRead: TMemo;
    TabSheet13: TTabSheet;
    WebBrowserScan: TWebBrowser;
    Memo2: TMemo;
    Memo3: TMemo;
    Button2: TButton;
    tStop: TTimer;
    procedure FormShow(Sender: TObject);
    procedure FormHide(Sender: TObject);
    procedure FormCreate(Sender: TObject);
    procedure Reload1Click(Sender: TObject);
    procedure tUploadTimer(Sender: TObject);
    procedure FormDestroy(Sender: TObject);
    procedure WebBrowser1DownloadComplete(Sender: TObject);
    procedure tDocLoadTimer(Sender: TObject);
    procedure btOlSyncContactsStartClick(Sender: TObject);
    procedure btDoDataClick(Sender: TObject);
    procedure WebBrowser1DocumentComplete(Sender: TObject;
      const pDisp: IDispatch; var URL: OleVariant);
    procedure WebBrowserDocumentComplete(Sender: TObject;
      const pDisp: IDispatch; var URL: OleVariant);
    procedure tScanTimer(Sender: TObject);
    procedure Button3Click(Sender: TObject);
    procedure Button5Click(Sender: TObject);
    procedure wbGetHtmlDocumentComplete(Sender: TObject;
      const pDisp: IDispatch; var URL: OleVariant);
    procedure btMailImportClick(Sender: TObject);
    procedure Button4Click(Sender: TObject);
    procedure btOlSyncContactsClick(Sender: TObject);
    procedure FormActivate(Sender: TObject);
    procedure Button2Click(Sender: TObject);
    procedure WebBrowserBeforeNavigate2(Sender: TObject;
      const pDisp: IDispatch; var URL, Flags, TargetFrameName, PostData,
      Headers: OleVariant; var Cancel: WordBool);
    procedure WebBrowserDownloadBegin(Sender: TObject);
    procedure WebBrowserScanDocumentComplete(Sender: TObject;
      const pDisp: IDispatch; var URL: OleVariant);
    procedure WebBrowserScanDownloadComplete(Sender: TObject);
    procedure WebBrowserScanNavigateComplete2(Sender: TObject;
      const pDisp: IDispatch; var URL: OleVariant);
    procedure WebBrowserScanCommandStateChange(Sender: TObject;
      Command: Integer; Enable: WordBool);
    procedure WebBrowserScanDownloadBegin(Sender: TObject);
    procedure WebBrowserScanBeforeNavigate2(Sender: TObject;
      const pDisp: IDispatch; var URL, Flags, TargetFrameName, PostData,
      Headers: OleVariant; var Cancel: WordBool);
    procedure WebBrowserScanStatusTextChange(Sender: TObject;
      const Text: WideString);
    procedure WebBrowserScanProgressChange(Sender: TObject; Progress,
      ProgressMax: Integer);
    procedure WebBrowserScanPropertyChange(Sender: TObject;
      const szProperty: WideString);
    procedure tStopTimer(Sender: TObject);

  private
    fContainer: TExternalContainer;
    dorefresh,searching:boolean;
       TrayIconData: TNotifyIconData;

    procedure MyMessages(var Msg: TMsg; var Handled: Boolean);
  public
    ipage,iletter:integer;
     FIconNumber: Integer;
    fileId,localfilename,filenameurl,hostfilename,step,u,url,host: string;
    pageloaded: boolean;
    procedure EditLocalFile(itemId,userId: integer;const uid,ext: WideString); safecall;
    procedure TrayMessage(var Msg: TMessage); message WM_ICONTRAY ;
    procedure SetIcon(i:integer);


  end;

  const letters:array [0..25] of string = ('a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z');
  function LowLevelMouseHookProc(nCode, wParam, lParam : integer) : integer; stdcall;
  function KeyboardHookProc(Code: Integer; WordParam: Word; LongParam: LongInt): LongInt; stdcall;

var
  fmMain: TfmMain;
  mHook : cardinal;
  KBHook1,KBHook: HHook;

implementation

{$R *.dfm}

uses uAlicon, ComObj,Html,OutlookXP,ActiveX,typinfo,MSHTML,IdHTTP,WinSock,fCommService;

const
  olItemMail = 0;
  olFolderDeleted=3	;
  olFolderOutbox=4	;
  olFolderSent=5	;
  olFolderInbox=6	;
  olFolderCalendar=9	;
  olFolderContacts=10	;
  olFolderJournal=11	;
  olFolderNotes=12	;
  olFolderTasks=13	;

function LowLevelMouseHookProc(nCode, wParam, lParam : integer) : integer; stdcall;
// possible wParam values: WM_LBUTTONDOWN, WM_LBUTTONUP, WM_MOUSEMOVE, WM_MOUSEWHEEL, WM_RBUTTONDOWN, WM_RBUTTONUP
var
  info : ^MouseLLHookStruct absolute lParam;
begin
  result := CallNextHookEx(mHook, nCode, wParam, lParam);
  with info^ do begin
    fmMain.StatusBar1.SimpleText      := 'X:'+IntToStr(pt.x)+',Y:'+ IntToStr(pt.y);
  if(fmMain.pageloaded and (fmMain.webbrowser.LocationURL>''))then
    html.callfunction(fmMain.webbrowser,'activitytracker','{X:'+IntToStr(pt.x)+',Y:'+ IntToStr(pt.y)+'}');
  end;
end;

function GetCharFromVirtualKey(Key: Word): string;
var
    keyboardState: TKeyboardState;
    asciiResult: Integer;
begin
    GetKeyboardState(keyboardState);
    SetLength(Result, 2) ;
    asciiResult := ToAscii(key, MapVirtualKey(key, 0), keyboardState, @Result[1], 0) ;
    case asciiResult of
      0: Result := '';
      1: SetLength(Result, 1) ;
      2:;
      else
        Result := '';
    end;
end;

function KeyboardHookProc(Code: Integer; WordParam: Word; LongParam: LongInt) : LongInt;
begin
  fmMain.StatusBar1.SimpleText      := 'key'+GetCharFromVirtualKey(WordParam)+'-'+IntToStr(WordParam)+'-'+IntToStr(LongParam)+'-'+IntToStr(Code);
  if(fmMain.pageloaded and (fmMain.webbrowser.LocationURL>''))then
    html.callfunction(fmMain.webbrowser,'activitytracker','{S:"'+GetCharFromVirtualKey(WordParam)+'"}');
  Result:=0;
  if Code < 0 then Result := CallNextHookEx(KBHook1, Code, WordParam, LongParam) ;
end;


procedure TfmMain.FormCreate(Sender: TObject);
const
  WH_MOUSE_LL = 14;
  WH_KEYBOARD_LL = 13;
var  FileName: String;

function GetHardDiskSerial(const DriveLetter: Char): string;
var
  NotUsed:     DWORD;
  VolumeFlags: DWORD;
  VolumeInfo:  array[0..MAX_PATH] of Char;
  VolumeSerialNumber: DWORD;
begin
  GetVolumeInformation(PChar(DriveLetter + ':\'), 
    nil, SizeOf(VolumeInfo), @VolumeSerialNumber, NotUsed,
    VolumeFlags, nil, 0);
  Result := Format('%8.8X', [VolumeSerialNumber]) 
end; 

begin
  mHook := SetWindowsHookEx(WH_MOUSE_LL, @LowLevelMouseHookProc, hInstance, 0);
  KBHook1:=SetWindowsHookEx(WH_KEYBOARD, @KeyboardHookProc, HInstance, GetCurrentThreadId()) ;
  KBHook:=SetWindowsHookEx(WH_KEYBOARD_LL, @KeyboardHookProc, hInstance, 0) ;
  //boundsrect:=screen.WorkAreaRect;

  Left:=Width-396;

  Width:=396;
  align:=alRight;

  //Height:=Height+3;
  //WebBrowser.Silent := True;



  //domainurl:='localhost';
  fContainer := TExternalContainer.Create(WebBrowser);
  //Application.OnMessage := MyMessages; // maakt dubbele tekens, waarom deze functie aanroep?


  with TrayIconData do
  begin
    cbSize := SizeOf(TrayIconData);
    Wnd := Handle;
    uID := 0;
    uFlags := NIF_MESSAGE + NIF_ICON + NIF_TIP;
    uCallbackMessage := WM_ICONTRAY;
    hIcon := Application.Icon.Handle;
    StrPCopy(szTip, Application.Title);
  end;


  Shell_NotifyIcon(NIM_ADD, @TrayIconData);

  fmMain.SetIcon(0);


  //domainurl:='https://rt.aliconnect.nl/';
  //domainurl:='http://alicon.nl';
  //domainurl:='https://aliconnect.nl';
  //domainurl:='http://localhost/api/v1/ctrl';

  //callfunction(webbrowser,'setvar','USERNAME","'+GetEnvironmentVariable('USERNAME'));
  //callfunction(webbrowser,'setvar','COMPUTERNAME","'+GetEnvironmentVariable('COMPUTERNAME'));
  //callfunction(webbrowser,'setvar','USERDOMAIN","'+GetEnvironmentVariable('USERDOMAIN'));
  //callfunction(webbrowser,'setvar','WORKGROUP","'+GetEnvironmentVariable('WORKGROUP'));
  //host:='https://aliconnect.nl/aliconnect/aliconnector';


  host:='https://aliconnect.nl/v1/api/aliconnector/';

  fmMain.WebBrowser.Align:=alClient;
  // fmMain.wbGetHtml.Align:=alBottom;




  //host:='https://aliconnect.nl/auth/';
  //host:='http://localhost/auth/';
  //host:='http://localhost/api/v1/app/aliconnector/';

  if (paramCount>0) then host:=paramStr(1);
  FileName:=ExtractFilePath(application.ExeName)+'index.html';
  if FileExists(FileName) then host:=FileName;
  //if (paramCount>0) then domainurl:=domainurl+'&'+paramStr(1);
  //host:='https://aliconnect.nl/api/v1/app';
  //host:='https://rt.aliconnect.nl';
  //host:='http://localhost/api/v1/app';
  //host:='http://localhost';



  domainurl:=host+'/?serial='+GetHardDiskSerial('c')+'&computername='+GetEnvironmentVariable('COMPUTERNAME')+'&userdomain='+GetEnvironmentVariable('USERDOMAIN')+'&username='+GetEnvironmentVariable('USERNAME');
  //domainurl:='http://localhost';
  //toolbar1.Visible:=false;
  //PageControl1.Visible:=false;
  //domainurl:='localhost/app/lmp/storten/op/?t=3';


  //domainurl:='http://172.20.4.201/app/lmp/storten/op/';
  //domainurl:=domainurl+'/?account=login';
  //domainurl:='http://www.aliconnect.nl/?account=login';
  //showmessage(GetEnvironmentVariable('USERNAME')+GetEnvironmentVariable('COMPUTERNAME'));


  //WebBrowserScan.Navigate('https://polyestershoppen.nl/lakken/dd-lak-hoogglans-0-5kg-35.html');


  rooturl:=domainurl;

  // rooturl:='https://polyestershoppen.nl/lakken/dd-lak-hoogglans-0-5kg-35.html';

  reload1.Click;

  //OleInitialize(nil);

end;

procedure TfmMain.MyMessages(var Msg: TMsg; var Handled: Boolean);
var
  X, Y: Integer;
  document,
  E: OleVariant;
  s:string;
  ipos:integer;
  action,filename:string;
  name,value:string;
begin
  Handled := False;

{
  if (IsDialogMessage(webbrowser.Handle, Msg) ) then
  begin
    X := LOWORD(Msg.lParam);
    memo1.lines.add(DateTimeToSTr(now())+'new event '+IntToStr(X));
  end;
}
   {
  if (Msg.message = WM_LBUTTONDOWN) and IsDialogMessage(webbrowser.Handle, Msg) then
  begin
    X := LOWORD(Msg.lParam);
    Y := HIWORD(Msg.lParam);
    document := webbrowser.Document;
    E := document.elementFromPoint(X, Y);
    if E.getAttribute('name')<>null then
    begin
      name:=E.getAttribute('name');
    end;

    StatusBar1.SimpleText := 'You clicked on:' + name+': '+E.outerHTML;
  end;
  }
    //memo1.Lines.add('You clicked on:' + E.innerHTML);
    //s:=E.outerHTML;
    {
    if E.getAttribute('name')<>null then
    begin
      name:=E.getAttribute('name');
      OPCGroup.OPCItems.ItemIds[name].WriteSync(E.getAttribute('newvalue'));
    end;
    }
    
    {
    if (copy(s,0,5)='<span') then
    begin
      ipos:=pos('itemId',s);
      s:=copy(s,ipos+8,9999);
      ipos:=pos('"',s);
      itemId :=copy(s,0,ipos-1);

      ipos:=pos('action',s);
      s:=copy(s,ipos+8,9999);
      ipos:=pos('"',s);
      action :=copy(s,0,ipos-1);

      ipos:=pos('filename',s);
      s:=copy(s,ipos+10,9999);
      ipos:=pos('"',s);
      filename :=copy(s,0,ipos-1);

      memo1.Lines.add(action+' on '+filename);

      if (action='edit') then loadfileandopen(itemId,filename);
    end;

  end;
  }
end;


procedure TfmMain.FormShow(Sender: TObject);
begin
  if (assigned(fmAIMOPC)) then fmAIMOPC.show();
  if (pageloaded) then callfunction(webbrowser,'focusapp','');
  //fmMain.hide;
  //  WebBrowser1.Navigate(ExtractFilePath(ParamStr(0)) + 'Article22.html');
end;

procedure TfmMain.FormHide(Sender: TObject);
begin
//  fContainer.Free;
end;


procedure TfmMain.TrayMessage(var Msg: TMessage);
begin
  case Msg.lParam of
    WM_LBUTTONDOWN:
    begin
      if fmMain.Visible then fmMain.Hide
      else
      begin
        fmMain.Show;
      end;
    end;
    WM_RBUTTONDOWN:
    begin
      //ShowMessage('Right button clicked - let''s HIDE the Form!');
      fmMain.Hide;
    end;
  end;
end;

procedure TfmMain.SetIcon(i:integer);
var LIcon: TIcon;
begin
  LIcon := TIcon.Create;
  try
    ilIcons.GetIcon(i, LIcon);
    with TrayIconData do
    begin
      hIcon := LIcon.Handle;
    end;
    Shell_NotifyIcon(NIM_MODIFY, @TrayIconData);
  finally
    LIcon.Free;
  end;
end;

procedure TfmMain.Reload1Click(Sender: TObject);
begin
  webbrowser.Navigate(rooturl);
end;

procedure openword(filename:string);
begin
end;

procedure TfmMain.EditLocalFile(itemId,userId: integer;const uid,ext: WideString);
var
  myFile: TextFile;
  filename,localfilename,filenameurl:string;
begin
{
  filename:=uppercase(uid)+'.'+ext;
  SaveDialog1.DefaultExt='.'+ext;
  SaveDialog1.FileName=uppercase(uid)+'.'+ext;
  if (SaveDialog1.Execute) then
  begin
    localfilename:=SaveDialog1.FileName;
    self.itemId := IntToStr(itemId);
    if not fileExists(localfilename) then
    begin
      self.itemId:=IntToStr(itemId);
      filenameurl:=domainurl+'aim-content/'+ext+'/'+filename;
    //showmessage(filenameurl);
      downloadFile(PChar(filenameurl),PChar(localfilename));
    end;
    openword(localfilename);
    activefilename:=localfilename;
    //callfunction('editfile',itemId,filename);
  end;
}
end;

procedure TfmMain.tUploadTimer(Sender: TObject);
begin
  //tUpload.Enabled:=false;
  if (localfilename>'') then
  begin
    if FileInUse(localfilename) then
    begin
      StatusBar1.SimpleText:='in use '+localfilename;
    end
    else
    begin
      StatusBar1.SimpleText:='upload '+localfilename;
      //if messageDlg('Bewerken '+localfilename+' afgerond, bestand uploaden?',mtConfirmation, [mbYes, mbNo],0) = mrYes then
      //begin
      tUpload.Enabled:=false;
      SetIcon(1);
      uploadfile(localfilename,filenameurl);
      DeleteFile(PChar(localfilename));
      callfunction(WebBrowser,'send','{"fileupload":"'+filenameurl+'"}');
      SetIcon(0);

      //end;
      localfilename:='';
    end;
  end;
  //tUpload.Enabled:=true;

end;


procedure TfmMain.FormDestroy(Sender: TObject);
begin
  OleUninitialize;
  Shell_NotifyIcon(NIM_DELETE, @TrayIconData);
  UnhookWindowsHookEx(mHook);
  UnHookWindowsHookEx(KBHook);
end;

procedure TfmMain.WebBrowser1DownloadComplete(Sender: TObject);
var
  vRefresh : OleVariant;
begin
  pageloaded:=true;
   {
    if (WebBrowser.ReadyState = READYSTATE_COMPLETE) then
    begin
      if (GetElementIdValue(WebBrowser, 'input', 'aimBrowserResult', 'value')>'') then
        callfunction(WebBrowser,'aimbrowser.init','1','','');
      if (GetElementId(WebBrowser,'loginform')>'') then
      begin
        setinputvalue(WebBrowser,'email',paramstr(2));
        setinputvalue(WebBrowser,'password1',paramstr(3));
      end;
    end
    else
      tDocLoad.Enabled:=true;
                }
end;

procedure TfmMain.tDocLoadTimer(Sender: TObject);
begin
    tDocLoad.Enabled:=false;
    WebBrowser1DownloadComplete(sender);
end;

procedure TfmMain.btOlSyncContactsStartClick(Sender: TObject);
begin
  //callfunction(WebBrowser,'ol.sync.start()','','','');
end;

procedure TfmMain.btDoDataClick(Sender: TObject);
begin
  WebBrowserScan.Navigate('https://polyestershoppen.nl/lakken');

  //if (lDataname.Caption='om.contactsGet') then btOlSyncContacts.click;
end;

procedure TfmMain.WebBrowser1DocumentComplete(Sender: TObject;
  const pDisp: IDispatch; var URL: OleVariant);
begin
  if dorefresh then
  begin
    dorefresh:=false;
    webbrowser.Refresh;
  end
end;

procedure TfmMain.WebBrowserDocumentComplete(Sender: TObject;
  const pDisp: IDispatch; var URL: OleVariant);
var
  Document: IHtmlDocument2;
  col: IHTMLElementCollection;
  el: IHTMLElement;
  form : IHTMLFormElement;
  i: integer;
  s:string;
begin
pageloaded:=true;
{  edAdres.text:=url;

  murl.lines.add(url);
  tScan.Enabled:=true;
  document := webbrowser.document as IHtmlDocument2;
  mbody.Text:=trim(document.body.innerhtml);  // to get html
}

  //memo1.lines.add(trim(document.body.innertext));  // to get text

  //fmMain.hide;

  //showmessage(GetEnvironmentVariable('USERNAME')+GetEnvironmentVariable('COMPUTERNAME'));
  //callfunction(fmMain.WebBrowser,'setVar','');

end;

procedure TfmMain.tScanTimer (Sender: TObject);
var
  Document: IHtmlDocument2;
  col: IHTMLElementCollection;
  el: IHTMLElement;
  form : IHTMLFormElement;
  i,cnt: integer;
  b:boolean;
  s:string;
begin
  tscan.enabled:=false;
  if step='li_start' then
  begin
    webbrowser.Navigate('https://www.linkedin.com/home');
    u:='';
    ipage:=1;
    iletter:=0;
    step:='li_login';
    tScan.interval:=1000;
  end
  else if (step='li_login') then
  begin
    setinputvalue(webbrowser,'login-email',dLi.fieldbyname('email').AsString);
    setinputvalue(webbrowser,'login-password',dLi.fieldbyname('password').AsString);
    col := (WebBrowser.Document as IHTMLDocument3).getElementsByName('login-email');
    el := col.item(0, 0) as IHTMLElement;
    form := WebFormGet(0, WebBrowser.Document AS IHTMLDocument2) ;
    form.submit;
    i:=pos('https://www.linkedin.com/profile/view',mbody.text);
    s:=copy(mbody.text,i,200);
    i:=pos('"',s);
    s:=copy(s,0,i-1);
    //showmessage(s);
    webbrowser.navigate(s);
    step:='li_savepage';
    tScan.interval:=6000;
  end
  else if (step='li_savepage') then
  begin
    s:=mbody.text;
    i:=pos('newUrlWithVanity=',s);
    s:=copy(s,i+18,500);
    s:=copy(s,0,pos('''',s)-1);
    if (u='') then u:=s;
    ExecProc(conn,'auth.linkedinpagesave',[copy(mLinks.lines[0],1,100),s,u,mbody.text]);
    step:='li_verwerk';
    webbrowser.navigate('http://localhost/aim/linkedin/verwerk.php?u='+u+'&n='+s);
  end
  else if (step='li_verwerk') then
  begin
    mLinks.lines.Delete(0);
    step:='li_getlink';
  end
  else if (step='li_search') then
  begin
    s:=mbody.text;
    mLinks.clear;
    i:=pos('class="title main-headline" href="',s);
    cnt:=0;
    while (i>0) do
    begin
      s:=copy(s,i+34,9999999);
      i:=pos('&amp;',s);
      mLinks.lines.add(copy(s,0,i-1));
      s:=copy(s,i,9999999);
      i:=pos('class="title main-headline" href="',s);
    end;
    step:='li_getlink';
  end;

  if (step='li_getlink') then
  begin
    if (mLinks.lines.Count>0) then
    begin
      b:=true;
      while b do
      begin
        with uAlicon.TempSet(self,conn,'EXEC auth.linkedinPageCheck',[copy(mLinks.lines[0],1,100)]) do
        begin
          if fieldbyname('pageId').isnull then
            b:=false
          else
            mLinks.lines.Delete(0);
          if mLinks.lines.Count=0 then b:=false;
          free;
        end;
      end;
    end;
    if (mLinks.lines.Count>0) then
    begin
      step:='li_savepage';
      webbrowser.navigate(mLinks.lines[0]);
      tScan.interval:=6000;
    end
    else
    begin
      step:='li_search';
      webbrowser.navigate('https://www.linkedin.com/vsearch/f?type=all&keywords='+letters[iletter]+'&page_num='+inttostr(ipage)+'&pt=people');
      inc(iletter);
      if (iletter>25) and (ipage<2) then
      begin
        inc(ipage);
        iletter:=0;
      end;
      tScan.interval:=2000;
    end
  end;
end;

procedure TfmMain.Button3Click(Sender: TObject);
begin
  //callfunction(WebBrowser,'sendMessage','{"naam":"max"}');
  callfunction(WebBrowser,'sendMessage','{"print":"proving1","src":"https://airo.aliconnect.nl/sites/airo/doc/doc.php?html&id=21737344&dataname=faktuur"}');
end;

procedure TfmMain.Button5Click(Sender: TObject);
var
  vaIn, vaOut: OleVariant;
begin
  WebBrowser.ControlInterface.ExecWB(OLECMDID_PAGESETUP, OLECMDEXECOPT_PROMPTUSER,
    vaIn, vaOut);
end;

procedure TfmMain.wbGetHtmlDocumentComplete(Sender: TObject;
  const pDisp: IDispatch; var URL: OleVariant);
var
  vaIn, vaOut: OleVariant;
begin
  wbGetHtml.ControlInterface.ExecWB(OLECMDID_PRINT, OLECMDEXECOPT_DONTPROMPTUSER, vaIn, vaOut);
  callfunction(WebBrowser,'printurldone','{"printurl":"'+URL+'"}');
  //fmMain.wbGetHtml.Align:=alNone;
end;


function IsObjectAvailable(const ClassName: string): Boolean;
var
  ClassID: TCLSID;
begin
  Result := Succeeded(CLSIDFromProgID(PWideChar(WideString(ClassName)),ClassID));
end;


function IsObjectActive(const ClassName: string): Boolean;
var
  ClassID: TCLSID;
  Unknown: IUnknown;
begin
  Result := False;
  if Succeeded(CLSIDFromProgID(PWideChar(WideString(ClassName)), ClassID)) then
    Result := Succeeded(GetActiveObject(ClassID, nil, Unknown));
end;



procedure TfmMain.btMailImportClick(Sender: TObject);
const
  olMailItem = 0;
  firstline = '<div class=Section1>';

  olFolderDeleted=3	;
  olFolderOutbox=4	;
  olFolderSent=5	;
  olFolderInbox=6	;
  olFolderCalendar=9	;
  olFolderContacts=10	;
  olFolderJournal=11	;
  olFolderNotes=12	;
  olFolderTasks=13	;

var
  Outlook: OleVariant;
  MailItem: variant;
  mailsubject,mailbody: string;
  MSapp, objNameSpace, Folder, FolderItems, objResultitems, Item, objCount: OleVariant;
  s,q,entryId,par,parfiles:string;
  dt:TDateTime;
  contactItemId,sFile: string;
  AttachCount,ItemsCount,mycount,i,ia:integer;
  modified:boolean;
  PostVars,row,res,entry,pars: TStringList;
  IdHTTP1: TIdHTTP;
  Stream: TStringStream;
  StringStream: TStringStream;
  FileStream: TFileStream;

function addpar(name,value:string):string;
var s:string;
begin
  if (value>'') then begin
    PostVars.Values[name] := value;
  end;
end;

begin
  inherited;
  mPostData.text:='Start mail import';

  IdHTTP1:= TIdHTTP.Create(nil);
  PostVars := TStringList.Create;
  try
    Outlook := GetActiveOleObject('Outlook.Application') ;
  except
    Outlook:= CreateOleObject('Outlook.Application');
  end;

  objNameSpace := Outlook.GetNamespace('MAPI');
  Folder := objNameSpace.GetDefaultFolder(olFolderInbox);
  Folder:=Outlook.ActiveExplorer;
  //Items:=Outlook.ActiveExplorer.Selection;
  //FolderItems:=Folder.Items;
  //Folder := objNameSpace.CurrentFolder;
  //Items:=Folder.Items;
       ItemsCount := Folder.Selection.Count ;
       //ItemsCount := 1;

  mMailItem.lines.clear;
  for i:= 1 to ItemsCount do begin
    Item:=Folder.Selection[i];
    //addpar('Name',Item.SenderName+'; '+DateTimeToStr(Item.SentOn)+'; '+Item.Subject);


    //addpar('Attachments',objItem.Attachments);
    AttachCount := Item.Attachments.Count ;
    if (AttachCount>0) then begin
      parfiles:='';
      for ia:= 1 to AttachCount do begin
        sFile := ExtractFilePath(application.ExeName)+'\'+Item.Attachments.Item[ia].FileName;
        Item.Attachments.Item[ia].SaveAsFile(sFile);
        mMailItem.lines.add('Index:'+IntToStr(Item.Attachments.Item[ia].Index));
        mMailItem.lines.add('FileName:'+Item.Attachments.Item[ia].FileName);
        mMailItem.lines.add('DisplayName:'+Item.Attachments.Item[ia].DisplayName);
        mMailItem.lines.add('FileName:'+Item.Attachments.Item[ia].FileName);
        mMailItem.lines.add('PathName:'+Item.Attachments.Item[ia].PathName);
        //mMailItem.lines.add('Position:'+Item.Attachments.Item[ia].Position);
        mMailItem.lines.add('Size:'+IntToStr(Item.Attachments.Item[ia].Size));
        mMailItem.lines.add('Type:'+IntToStr(Item.Attachments.Item[ia].Type));
        //mMailItem.lines.add('Session:'+Item.Attachments.Item[ia].Session);
        //mMailItem.lines.add('Class:'+Item.Attachments.Item[ia].Class);
        //uploadfile(sFile,Item.Attachments.Item[ia].FileName);
        parfiles:=parfiles+'{"filename":"'+stringReplace(Item.Attachments.Item[ia].FileName+'","src":"/content/'+Item.Attachments.Item[ia].FileName,'\','/\',[rfReplaceAll])+'"},';
        DeleteFile(PChar(sFile));
      end;
      Delete(parfiles, Length(parfiles), 1);
      addpar('Files','['+parfiles+']');
    end;
  end;

  //if (Item.BodyFormat = olFormatHTML) then addpar('Description',stringReplace(stringReplace(stringReplace(Item.HTMLBody,'\','/\',[rfReplaceAll]),#13,'\n',[rfReplaceAll]),#10,'\n',[rfReplaceAll]))
  //else addpar('Description',stringReplace(stringReplace(stringReplace(stringReplace(Item.Body,'\','/\',[rfReplaceAll]),#13#10#13#10,'</p><p>',[rfReplaceAll]),#13#10,' ',[rfReplaceAll]),#10,'<br>',[rfReplaceAll]));

  addpar('Subject',Item.Subject);
  addpar('keyName',Item.EntryID);
  addpar('classId','1109');
  addpar('hostId',edHostId.text);
  addpar('userId','0');
  //addpar('host','localhost');
  addpar('sessionId',edSessionId.text);
  addpar('exec','mailimport');
  addpar('Categories',Item.Categories);
  addpar('Companies',Item.Companies);
  addpar('ConversationID',Item.ConversationID);
  addpar('ConversationIndex',Item.ConversationIndex);
  addpar('ConversationTopic',Item.ConversationTopic);

  addpar('SenderEmailAddress',Item.SenderEmailAddress);
  addpar('SenderEmailType',Item.SenderEmailType);
  addpar('SenderName',Item.SenderName);
  addpar('SendUsingAccount',Item.SendUsingAccount);
  addpar('Sent',Item.Sent);
  addpar('To',Item.To);
  addpar('CC',Item.CC);
  addpar('BCC',Item.BCC);
  addpar('ReceivedByEntryID',Item.ReceivedByEntryID);
  addpar('ReceivedByName',Item.ReceivedByName);
  //addpar('Description',stringReplace(stringReplace(stringReplace(Item.HTMLBody,#13,'\r',[rfReplaceAll]),#10,'\n',[rfReplaceAll]),'\','/\',[rfReplaceAll]));
  //addpar('Description','HGFHJFHFHJF');

  addpar('CreationTime',DateTimeToStr(Item.CreationTime));
  addpar('LastModificationTime',DateTimeToStr(Item.LastModificationTime));
  addpar('SentOn',DateTimeToStr(Item.SentOn));
  addpar('ReceivedTime',DateTimeToStr(Item.ReceivedTime));

  addpar('DeferredDeliveryTime',DateTimeToStr(Item.DeferredDeliveryTime));
  addpar('ExpiryTime',DateTimeToStr(Item.ExpiryTime));

  addpar('IsMarkedAsTask',Item.IsMarkedAsTask);
  addpar('TaskSubject',Item.TaskSubject);
  addpar('TaskStartDate',DateTimeToStr(Item.TaskStartDate));
  addpar('TaskDueDate',DateTimeToStr(Item.TaskDueDate));
  addpar('TaskCompletedDate',DateTimeToStr(Item.TaskCompletedDate));

  addpar('FlagRequest',Item.FlagRequest);
  addpar('Importance',Item.Importance);
  addpar('IsConflict',Item.IsConflict);
  addpar('Size',Item.Size);

  //addpar('Body',stringReplace(stringReplace(Item.Body,#13,'\r',[rfReplaceAll]),#10,'\n',[rfReplaceAll]));
  //addpar('Body',stringReplace(stringReplace(Item.Body,#13,'\r',[rfReplaceAll]),#10,'\n',[rfReplaceAll]));
  //addpar('Body',Item.Body);
  addpar('HTMLBody',Item.HTMLBody);
  try
    Application.ProcessMessages;
    try
      IdHTTP1.HandleRedirects := True;
      IdHTTP1.Post('http://www.alicon.nl/api/v1/index.php', PostVars, Stream);
      //IdHTTP1.Post('http://localhost/api/v1/index.php', PostVars, Stream);
      //result:=true;
    except
    //on E: Exception do
      ShowMessage('Error encountered during POST: ');
    end;
  finally
    //if (Stream.DataString>'') then showmessage(Stream.DataString);
    PostVars.Free;
  end;
  VarClear(MailItem);
  VarClear(Outlook);
end;

procedure TfmMain.btOlSyncContactsClick(Sender: TObject);
var
  MSapp,objNameSpace, objFolder, objFolderitems, objResultitems, objItem, objCount: OleVariant;
  s,q,entryId:string;
  dt:TDateTime;
  mailsubject,mailbody,contactItemId: string;
  mycount,i,l:integer;
  modified:boolean;
  PostVars,ItemVars,res,entry: TStringList;
  IdHTTP1: TIdHTTP;
  Stream: TStringStream;

  function addpar(name,value:string):string;
  var s:string;
  begin
    if (value<>ItemVars.Values[name]) then PostVars.Values[name] := value;
  end;

  procedure add(p:variant);
  begin
    if s>'' then s:=s+',';
    s:=s+'''';
    try
      s:=s+StringReplace(StringReplace(StringReplace(trim(varToStr(p)),'''','''''',[rfReplaceAll]),'&','#38;',[rfReplaceAll]),#13,'#13',[rfReplaceAll]);
    except;
    end;
    s:=s+'''';
  end;

  function aimwritecontact:string;
  begin
    addpar('LastModificationTime',objItem.LastModificationTime);
    addpar('Title',objItem.Title);
    addpar('FirstName',objItem.FirstName);
    addpar('NickName',objItem.NickName);
    addpar('Initials',objItem.Initials);
    addpar('MiddleName',objItem.MiddleName);
    addpar('LastName',objItem.LastName);
    addpar('Suffix',objItem.Suffix);
    addpar('Gender',objItem.Gender);
    addpar('Profession',objItem.Profession);
    addpar('Hobby',objItem.Hobby);
    if (objItem.Birthday<>'1-1-4501') then addpar('Birthday',objItem.Birthday);
    if (objItem.Anniversary<>'1-1-4501') then addpar('Anniversary',objItem.Anniversary);
    addpar('Spouse',objItem.Spouse);
    addpar('Body',objItem.Body);
    addpar('HomeAddressStreet',objItem.HomeAddressStreet);
    addpar('HomeAddressPostalCode',objItem.HomeAddressPostalCode);
    addpar('HomeAddressCity',objItem.HomeAddressCity);
    addpar('HomeAddressState',objItem.HomeAddressState);
    addpar('HomeAddressCountry',objItem.HomeAddressCountry);
    addpar('HomeAddressPostOfficeBox',objItem.HomeAddressPostOfficeBox);
    addpar('MobileTelephoneNumber',objItem.MobileTelephoneNumber);
    addpar('HomeTelephoneNumber',objItem.HomeTelephoneNumber);
    addpar('Home2TelephoneNumber',objItem.Home2TelephoneNumber);
    addpar('OtherTelephoneNumber',objItem.OtherTelephoneNumber);
    addpar('CarTelephoneNumber',objItem.CarTelephoneNumber);
    addpar('PagerNumber',objItem.PagerNumber);
    addpar('RadioTelephoneNumber',objItem.RadioTelephoneNumber);
    addpar('HomeFaxNumber',objItem.HomeFaxNumber);
    addpar('TelexNumber',objItem.TelexNumber);
    addpar('CallbackTelephoneNumber',objItem.CallbackTelephoneNumber);
    addpar('PrimaryTelephoneNumber',objItem.PrimaryTelephoneNumber);
    addpar('Email1Address',objItem.Email1Address);
    addpar('Email1DisplayName',objItem.Email1DisplayName);
    addpar('Email2Address',objItem.Email2Address);
    addpar('Email2DisplayName',objItem.Email2DisplayName);
    addpar('Email3Address',objItem.Email3Address);
    addpar('Email3DisplayName',objItem.Email3DisplayName);
    addpar('PersonalHomePage',objItem.PersonalHomePage);
    addpar('CompanyName',objItem.CompanyName);
    addpar('CompanyMainTelephoneNumber',objItem.CompanyMainTelephoneNumber);
    addpar('BusinessTelephoneNumber',objItem.BusinessTelephoneNumber);
    addpar('Business2TelephoneNumber',objItem.Business2TelephoneNumber);
    addpar('BusinessFaxNumber',objItem.BusinessFaxNumber);
    addpar('OtherFaxNumber',objItem.OtherFaxNumber);
    addpar('Department',objItem.Department);
    addpar('Companies',objItem.Companies);
    addpar('OfficeLocation',objItem.OfficeLocation);
    addpar('JobTitle',objItem.JobTitle);
    addpar('ManagerName',objItem.ManagerName);
    addpar('AssistantName',objItem.AssistantName);
    addpar('AssistantTelephoneNumber',objItem.AssistantTelephoneNumber);
    addpar('WebPage',objItem.WebPage);
    addpar('BusinessHomePage',objItem.BusinessHomePage);
    addpar('BusinessAddressStreet',objItem.BusinessAddressStreet);
    addpar('BusinessAddressPostalCode',objItem.BusinessAddressPostalCode);
    addpar('BusinessAddressCity',objItem.BusinessAddressCity);
    addpar('BusinessAddressState',objItem.BusinessAddressState);
    addpar('BusinessAddressCountry',objItem.BusinessAddressCountry);
    addpar('BusinessAddressPostOfficeBox',objItem.BusinessAddressPostOfficeBox);
    addpar('OtherAddressStreet',objItem.OtherAddressStreet);
    addpar('OtherAddressPostalCode',objItem.OtherAddressPostalCode);
    addpar('OtherAddressCity',objItem.OtherAddressCity);
    addpar('OtherAddressCountry',objItem.OtherAddressCountry);
    addpar('OtherAddressState',objItem.OtherAddressState);
    addpar('OtherAddressPostOfficeBox',objItem.OtherAddressPostOfficeBox);
    addpar('SelectedMailingAddress',objItem.SelectedMailingAddress);
    addpar('CustomerID',objItem.CustomerID);
    addpar('ComputerNetworkName',objItem.ComputerNetworkName);
    //addpar('Parent',objItem.Parent);
    addpar('Sensitivity',objItem.Sensitivity);
    addpar('User1',objItem.User1);
    addpar('User2',objItem.User2);
    addpar('User3',objItem.User3);
    addpar('User4',objItem.User4);
    addpar('UserCertificate',objItem.UserCertificate);
  end;

  procedure outlookcleancontact();
  begin
  if (trim(objItem.Title)='') then objItem.Title:='';
    if (trim(objItem.PrimaryTelephoneNumber)='') then  objItem.PrimaryTelephoneNumber:='';
    if (trim(objItem.CallbackTelephoneNumber)='') then  objItem.CallbackTelephoneNumber:='';
    if (trim(objItem.MobileTelephoneNumber)='') then  objItem.MobileTelephoneNumber:='';
    if (trim(objItem.HomeTelephoneNumber)='') then  objItem.HomeTelephoneNumber:='';
    if (trim(objItem.Home2TelephoneNumber)='') then  objItem.Home2TelephoneNumber:='';
    if (trim(objItem.BusinessTelephoneNumber)='') then  objItem.BusinessTelephoneNumber:='';
    if (trim(objItem.Business2TelephoneNumber)='') then  objItem.Business2TelephoneNumber:='';
    if (trim(objItem.OtherTelephoneNumber)='') then  objItem.OtherTelephoneNumber:='';
    if (trim(objItem.CarTelephoneNumber)='') then  objItem.CarTelephoneNumber:='';
    if (trim(objItem.PagerNumber)='') then  objItem.PagerNumber:='';
    if (trim(objItem.RadioTelephoneNumber)='') then  objItem.RadioTelephoneNumber:='';
    if (trim(objItem.BusinessFaxNumber)='') then  objItem.BusinessFaxNumber:='';
    if (trim(objItem.OtherFaxNumber)='') then  objItem.OtherFaxNumber:='';
    if (trim(objItem.TelexNumber)='') then  objItem.TelexNumber:='';
    //else if (trimobjItem.FirstName:='';
    if (trim(objItem.NickName)='') then  objItem.NickName:='';
    if (trim(objItem.Initials)='') then  objItem.Initials:='';
    if (trim(objItem.MiddleName)='') then  objItem.MiddleName:='';
    if (trim(objItem.LastName)='') then  objItem.LastName:='';
    if (trim(objItem.Suffix)='') then  objItem.Suffix:='';
    if (trim(objItem.Profession)='') then  objItem.Profession:='';
    if (trim(objItem.Hobby)='') then  objItem.Hobby:='';
    if (trim(objItem.Spouse)='') then  objItem.Spouse:='';
    if (trim(objItem.Body)='') then  objItem.Body:='';
    if (trim(objItem.HomeAddressStreet)='') then  objItem.HomeAddressStreet:='';
    if (trim(objItem.HomeAddressPostalCode)='') then  objItem.HomeAddressPostalCode:='';
    if (trim(objItem.HomeAddressCity)='') then  objItem.HomeAddressCity:='';
    if (trim(objItem.HomeAddressState)='') then  objItem.HomeAddressState:='';
    if (trim(objItem.HomeAddressCountry)='') then  objItem.HomeAddressCountry:='';
    if (trim(objItem.HomeAddressPostOfficeBox)='') then  objItem.HomeAddressPostOfficeBox:='';
    if (trim(objItem.Email1Address)='') then  objItem.Email1Address:='';
    if (trim(objItem.Email1DisplayName)='') then  objItem.Email1DisplayName:='';
    if (trim(objItem.Email2Address)='') then  objItem.Email2Address:='';
    if (trim(objItem.Email2DisplayName)='') then  objItem.Email2DisplayName:='';
    if (trim(objItem.Email3Address)='') then  objItem.Email3Address:='';
    if (trim(objItem.Email3DisplayName)='') then  objItem.Email3DisplayName:='';
    if (trim(objItem.PersonalHomePage)='') then  objItem.PersonalHomePage:='';
    if (trim(objItem.Department)='') then  objItem.Department:='';
    if (trim(objItem.Companies)='') then  objItem.Companies:='';
    if (trim(objItem.OfficeLocation)='') then  objItem.OfficeLocation:='';
    if (trim(objItem.JobTitle)='') then  objItem.JobTitle:='';
    if (trim(objItem.ManagerName)='') then  objItem.ManagerName:='';
    if (trim(objItem.AssistantName)='') then  objItem.AssistantName:='';
    if (trim(objItem.AssistantTelephoneNumber)='') then  objItem.AssistantTelephoneNumber:='';
    if (trim(objItem.WebPage)='') then  objItem.WebPage:='';
    if (trim(objItem.OtherAddressStreet)='') then  objItem.OtherAddressStreet:='';
    if (trim(objItem.OtherAddressPostalCode)='') then  objItem.OtherAddressPostalCode:='';
    if (trim(objItem.OtherAddressCity)='') then  objItem.OtherAddressCity:='';
    if (trim(objItem.OtherAddressCountry)='') then  objItem.OtherAddressCountry:='';
    if (trim(objItem.OtherAddressState)='') then  objItem.OtherAddressState:='';
    if (trim(objItem.OtherAddressPostOfficeBox)='') then  objItem.OtherAddressPostOfficeBox:='';
    if (trim(objItem.CustomerID)='') then  objItem.CustomerID:='';
    if (trim(objItem.ComputerNetworkName)='') then  objItem.ComputerNetworkName:='';
    if (trim(objItem.User1)='') then  objItem.User1:='';
    if (trim(objItem.User2)='') then  objItem.User2:='';
    if (trim(objItem.User3)='') then  objItem.User3:='';
    if (trim(objItem.User4)='') then  objItem.User4:='';
    if (trim(objItem.UserCertificate)='') then  objItem.UserCertificate:='';
    if (trim(objItem.CompanyName)='') then  objItem.CompanyName:='';
    if (trim(objItem.CompanyMainTelephoneNumber)='') then  objItem.CompanyMainTelephoneNumber:='';
    if (trim(objItem.BusinessHomePage)='') then  objItem.BusinessHomePage:='';
    if (trim(objItem.BusinessAddressStreet)='') then  objItem.BusinessAddressStreet:='';
    if (trim(objItem.BusinessAddressPostalCode)='') then  objItem.BusinessAddressPostalCode:='';
    if (trim(objItem.BusinessAddressCity)='') then  objItem.BusinessAddressCity:='';
    if (trim(objItem.BusinessAddressState)='') then  objItem.BusinessAddressState:='';
    if (trim(objItem.BusinessAddressCountry)='') then  objItem.BusinessAddressCountry:='';
    if (trim(objItem.BusinessAddressPostOfficeBox)='') then  objItem.BusinessAddressPostOfficeBox:='';
  end;

  procedure outlookwritecontact(name,value: string);
  begin
    mLog.Lines.Add(name+'='+value);
    if (name='Title') then objItem.Title:=value
    else if (name='FirstName') then objItem.FirstName:=value
    else if (name='NickName') then objItem.NickName:=value
    else if (name='Initials') then objItem.Initials:=value
    else if (name='MiddleName') then objItem.MiddleName:=value
    else if (name='LastName') then objItem.LastName:=value
    else if (name='Suffix') then objItem.Suffix:=value
    else if (name='Profession') then objItem.Profession:=value
    else if (name='Hobby') then objItem.Hobby:=value
    else if (name='Spouse') then objItem.Spouse:=value
    else if (name='Body') then objItem.Body:=value
    else if (name='HomeAddressStreet') then objItem.HomeAddressStreet:=value
    else if (name='HomeAddressPostalCode') then objItem.HomeAddressPostalCode:=value
    else if (name='HomeAddressCity') then objItem.HomeAddressCity:=value
    else if (name='HomeAddressState') then objItem.HomeAddressState:=value
    else if (name='HomeAddressCountry') then objItem.HomeAddressCountry:=value
    else if (name='HomeAddressPostOfficeBox') then objItem.HomeAddressPostOfficeBox:=value
    else if (name='PrimaryTelephoneNumber') then objItem.PrimaryTelephoneNumber:=value
    else if (name='CallbackTelephoneNumber') then objItem.CallbackTelephoneNumber:=value
    else if (name='MobileTelephoneNumber') then objItem.MobileTelephoneNumber:=value
    else if (name='HomeTelephoneNumber') then objItem.HomeTelephoneNumber:=value
    else if (name='Home2TelephoneNumber') then objItem.Home2TelephoneNumber:=value
    else if (name='BusinessTelephoneNumber') then objItem.BusinessTelephoneNumber:=value
    else if (name='Business2TelephoneNumber') then objItem.Business2TelephoneNumber:=value
    else if (name='OtherTelephoneNumber') then objItem.OtherTelephoneNumber:=value
    else if (name='CarTelephoneNumber') then objItem.CarTelephoneNumber:=value
    else if (name='PagerNumber') then objItem.PagerNumber:=value
    else if (name='RadioTelephoneNumber') then objItem.RadioTelephoneNumber:=value
    else if (name='BusinessFaxNumber') then objItem.BusinessFaxNumber:=value
    else if (name='OtherFaxNumber') then objItem.OtherFaxNumber:=value
    else if (name='TelexNumber') then objItem.TelexNumber:=value
    else if (name='Email1Address') then objItem.Email1Address:=value
    else if (name='Email1DisplayName') then objItem.Email1DisplayName:=value
    else if (name='Email2Address') then objItem.Email2Address:=value
    else if (name='Email2DisplayName') then objItem.Email2DisplayName:=value
    else if (name='Email3Address') then objItem.Email3Address:=value
    else if (name='Email3DisplayName') then objItem.Email3DisplayName:=value
    else if (name='PersonalHomePage') then objItem.PersonalHomePage:=value
    else if (name='Department') then objItem.Department:=value
    else if (name='Companies') then objItem.Companies:=value
    else if (name='OfficeLocation') then objItem.OfficeLocation:=value
    else if (name='JobTitle') then objItem.JobTitle:=value
    else if (name='ManagerName') then objItem.ManagerName:=value
    else if (name='AssistantName') then objItem.AssistantName:=value
    else if (name='AssistantTelephoneNumber') then objItem.AssistantTelephoneNumber:=value
    else if (name='WebPage') then objItem.WebPage:=value
    else if (name='OtherAddressStreet') then objItem.OtherAddressStreet:=value
    else if (name='OtherAddressPostalCode') then objItem.OtherAddressPostalCode:=value
    else if (name='OtherAddressCity') then objItem.OtherAddressCity:=value
    else if (name='OtherAddressCountry') then objItem.OtherAddressCountry:=value
    else if (name='OtherAddressState') then objItem.OtherAddressState:=value
    else if (name='OtherAddressPostOfficeBox') then objItem.OtherAddressPostOfficeBox:=value
    else if (name='CustomerID') then objItem.CustomerID:=value
    else if (name='ComputerNetworkName') then objItem.ComputerNetworkName:=value
    else if (name='User1') then objItem.User1:=value
    else if (name='User2') then objItem.User2:=value
    else if (name='User3') then objItem.User3:=value
    else if (name='User4') then objItem.User4:=value
    else if (name='UserCertificate') then objItem.UserCertificate:=value
    else if (name='CompanyName') then objItem.CompanyName:=value
    else if (name='CompanyMainTelephoneNumber') then objItem.CompanyMainTelephoneNumber:=value
    else if (name='BusinessHomePage') then objItem.BusinessHomePage:=value
    else if (name='BusinessAddressStreet') then objItem.BusinessAddressStreet:=value
    else if (name='BusinessAddressPostalCode') then objItem.BusinessAddressPostalCode:=value
    else if (name='BusinessAddressCity') then objItem.BusinessAddressCity:=value
    else if (name='BusinessAddressState') then objItem.BusinessAddressState:=value
    else if (name='BusinessAddressCountry') then objItem.BusinessAddressCountry:=value
    else if (name='BusinessAddressPostOfficeBox') then objItem.BusinessAddressPostOfficeBox:=value
  end;

begin
//  items1.ge
//  items1.Sort();
//  OutlookApplication1.Connect;
//  NameSpace1:=OutlookApplication1.GetNamespace('MAPI');
//  folders1.Connect;
//  objFolder.Display;
  //entry := TStringList.Create;
  //memo1.Lines.clear;

  IdHTTP1:= TIdHTTP.Create(nil);
  MSapp := OleConnect('Outlook.Application');
  objNameSpace := MSapp.GetNamespace('MAPI');
  objFolder := objNameSpace.GetDefaultFolder(olFolderContacts);

  //PostVars := TStringList.Create;

{
  Postvars.Values['naam']:='Max';
  Postvars.Values['naam2']:='Max2';
  Postvars.Add('naam3=Piet');

  ShowMessage(Postvars.Values['naam3']);
  exit;
}



  objCount:=objFolder.Items;
  myCount:=objCount.Count;
  //myCount:=10;
  ProgressBar1.Position:=0;
  ProgressBar1.Max:=myCount;
  mPostData.text:='';
  for i:= 1 to mycount do
  begin
    ProgressBar1.Position:=i;
    PostVars := TStringList.Create;
    ItemVars := TStringList.Create;
    objItem:=objFolder.Items(i);
    if (objItem.Class=40) then
    begin
      PostVars.Values['userId']:=edUserId.text;
      PostVars.Values['exec']:='contactget';
      PostVars.Values['keyName']:=objItem.EntryID;
      IdHTTP1.HandleRedirects := True;
      //IdHTTP1.Post('http://www.alicon.nl/api/v1/index.php', PostVars);
      Stream := TStringStream.Create('');
      IdHTTP1.Post('http://localhost/api/v1/index.php', PostVars, Stream);
      ItemVars.Text:=Stream.DataString;

      //mPostData.Lines.add('Data ontvangen');
      //mPostData.Lines.add(Stream.DataString);
      //showmessage(Stream.DataString);

      PostVars.Text:='';
      Stream := TStringStream.Create('');
      aimwritecontact();

      mPostData.Lines.add('Data vergeleken');
      mPostData.Lines.add(PostVars.Text);
      if (PostVars.Text>'') then
      begin
        mPostData.Lines.add('Data upload');
        PostVars.Values['classId']:='1005';
        PostVars.Values['hostId']:='0';
        PostVars.Values['userId']:=edUserId.text;
        PostVars.Values['sessionId']:=edSessionId.text;
        PostVars.Values['exec']:='contactimport';
        PostVars.Values['keyName']:=objItem.EntryID;
        try
          seticon(1);
          Application.ProcessMessages;
          try
            IdHTTP1.HandleRedirects := True;
            //IdHTTP1.Post('http://www.alicon.nl/api/v1/index.php', PostVars);
            IdHTTP1.Post('http://localhost/api/v1/index.php', PostVars, Stream);
            //result:=true;
          except
          //on E: Exception do
            ShowMessage('Error encountered during POST: ');
          end;
        finally
          if (Stream.DataString>'') then mPostData.lines.add(Stream.DataString);
          seticon(0);
        end;

      end;
    end;
  end;
  PostVars.Free;
  Stream.Free;

  exit;






  res := TStringList.Create;
  //row := TStringList.Create;
  //PostVars.Values['exec'] := 'om.contactsGet';
  //res.Text:=getresult(domainurl+'/aim/db/index.php',PostVars);
  res.Text:=mData.text;
  //mSync.clear;
  //mSync.text:=res.text;
  //exit;
  mlog.Clear;
  
  contactItemId:='';
  if (res.Count>0) then
  begin
    ProgressBar1.Max:=res.Count;
    for i:=0 to res.Count-1 do
    begin
      ProgressBar1.Position:=i;
      mrow.lines.Text:=stringReplace(res[i],';',#13,[rfReplaceAll]);
      //exit;
      //showmessage(mrow.lines.Values['field']);
      if (mrow.lines.Values['EntryID']>'') then
      begin
        objItem:=objNameSpace.GetItemFromID(mrow.lines.Values['EntryID']) ;
        //outlookcleancontact();
      end
      else
      begin
        objItem:=MSapp.CreateItem(olContactItem);
      end;
      for l:=2 to mrow.lines.Count-1 do
      begin
        outlookwritecontact(mrow.lines.Names[l],mrow.Lines.ValueFromIndex[l]);
      end;
      objItem.Save;
      {
        mrow.Lines.Names[l];

      mrow.lines.ValueFromIndex
        if (modified) then
        begin
          objItem.Save;
          modified:=false;
          mSync.lines.Add(ProcedureCommand('EXEC om.itemContactSyncEntryId',[ContactItemId,objItem.EntryID,objItem.LastModificationTime]));
        end;

        if (ContactItemId>'') then
          entry.Add(objItem.EntryID+'='+DateTimeToStr(objItem.LastModificationTime));

        ContactItemId:=mrow.lines.Values['ContactItemId'];
        if (mrow.lines.Values['value']>'') then
        begin
          entryId:=trim(mrow.lines.Values['value']);
          objItem:=objNameSpace.GetItemFromID(entryId);
          entry.Add(entryId+'='+mrow.lines.Values['modifiedDt']);
        end
        else
        begin
          objItem:=MSapp.CreateItem(olContactItem);
        end;
      end
      else //if (row.Values['name']<>'EntryID') then
      begin
        //showmessage(mrow.lines.Values['modifiedDt']);
        //if (objItem.LastModificationTime>'1-1-4000') or ( (mrow.lines.Values['modifiedDt']>'') and (objItem.LastModificationTime<StrToDateTime(mrow.lines.Values['modifiedDt']))) then
        begin
          //memo1.lines.add(row.Values['name']+'='+row.Values['value']);
          modified:=true;
          outlookwritecontact(mrow.lines.Values['field'],mrow.lines.Values['value']);
        end;
      end;
      }
    end;
    exit;

    if (modified) then
    begin
      objItem.Save;
      mSync.lines.Add(ProcedureCommand('EXEC om.itemContactSyncEntryId',[mrow.lines.Values['ContactItemId'],objItem.EntryID,objItem.LastModificationTime]));
    end;
    if (ContactItemId>'') then
      entry.Add(objItem.EntryID+'='+DateTimeToStr(objItem.LastModificationTime));

    if mSync.lines.text>'' then
    begin
      PostVars := TStringList.Create;
      res := TStringList.Create;
      //mrow.lines := TStringList.Create;
      //PostVars.Values['query'] := memo1.text;
      //db memo1.text:=getresult(domainurl+'aim/db/aim-details.php',PostVars);


      //PostVars.Free;
      //res.Free;
      //row.Free;
    end;
  end;

  exit;

  objCount:=objFolder.Items;
  myCount:=objCount.Count;
  //myCount:=20;
  ProgressBar1.Max:=myCount;

  for i:= 1 to mycount do
//  while VarIsEmpty(objItem) = False do //i<=mycount do
  begin
//    inc(i);
    ProgressBar1.Position:=i;
//    showmessage(objItem.LastName);
    objItem:=objFolder.Items(i);

    if (entry.Values[objItem.EntryID]>'') then dt:=StrToDateTime(entry.Values[objItem.EntryID]) else dt:=StrToDateTime('1-1-1900');
    //memo1.lines.add(DateTimeToStr(dt)+' '+DateTimeToStr(TDateTime(objItem.LastModificationTime)));

    if (objItem.Class=40) and ( varToStr(objItem.LastModificationTime)<>DateTimeToStr(dt)) then //and (TDateTime(objItem.LastModificationTime) > dt ) then
    begin
      memo1.lines.Add(aimwritecontact());
      //memo1.lines.Add(objItem.FullName);
    end;

  end;

  PostVars := TStringList.Create;
  res := TStringList.Create;
  //mrow.lines := TStringList.Create;
  PostVars.Values['contacts'] := memo1.text;
  PostVars.Values['action'] := 'synccontacts';
  res.Text:=getresult(domainurl+'aim/db/aim-details.php',PostVars);

  exit;



  //dmIp.ExecProc('EXEC om.itemContactSyncGetLastModificationTime',[]);
  //dt:=StrToDateTime(dmIp.fieldByName('LastModificationTime'));
//  showmessage(DateTimeToStr(dt));

//  objFolder.Items.sort('LastName');

//  objResultitems := objFolder.Items;
//  objResultitems.Sort('LastName');
//  objItem:=objResultitems.getfirst;
//  showmessage(objItem.LastName);
//  objItem:=objFolder.Items.getlast;
//  showmessage(objItem.LastName);
//  objItem:=objFolder.Items.getfirst;
//  showmessage(objItem.LastName);
//ContactItem1.Connect;
//showmessage(ContactItem1.LastName);


//  showmessage(objItem.LastModificationTime);
//  objItem:=objFolder.items.getnext;
//  showmessage(objItem.LastModificationTime);
  i:=1;
  memo1.Lines.clear;
  for i:= 1 to 20 do //mycount do
//  while VarIsEmpty(objItem) = False do //i<=mycount do
  begin
//    inc(i);
    ProgressBar1.Position:=i;
//    showmessage(objItem.LastName);
    objItem:=objFolder.Items(i);
    s:='';
    if (objItem.Class=40) then //and (TDateTime(objItem.LastModificationTime) > dt ) then
    begin
      aimwritecontact();
      //memo1.lines.Add(s);
    end;
//    objItem:=objFolder.items.getnext;
  end;
//  memo1.lines.Add('EXEC om.itemContactSyncUpdates');

  PostVars := TStringList.Create;
  res := TStringList.Create;
  //row := TStringList.Create;
  PostVars.Values['contacts'] := memo1.text;
  PostVars.Values['action'] := 'synccontacts';
  res.Text:=getresult(domainurl+'aim/db/aim-details.php',PostVars);
  //PostVars.Free;
  //res.Free;
  //row.Free;

  //memo1.Text:=res.Text;
  //exit;
  memo1.lines.Clear;

  for i:=0 to res.Count-1 do
  begin
    mrow.lines.Text:=stringReplace(res[i],';',#13,[rfReplaceAll]);
    //memo1.Text:=row.Text;

    entryId:=trim(mrow.lines.Values['EntryID']);
    if entryId>'' then
      objItem:=objNameSpace.GetItemFromID(entryId)
    else
      objItem:=MSapp.CreateItem(olContactItem);

    if (objItem.Title<>mrow.lines.Values['Title']) then objItem.Title:=mrow.lines.Values['Title'];
{
    if (objItem.FirstName<>row.Values['FirstName']) then	    objItem.FirstName:=row.Values['FirstName'];
    if (objItem.NickName<>row.Values['NickName']) then	    objItem.NickName:=row.Values['NickName'];
    if (objItem.Initials<>row.Values['Initials']) then	    objItem.Initials:=row.Values['Initials'];
    if (objItem.MiddleName<>row.Values['MiddleName']) then	    objItem.MiddleName:=row.Values['MiddleName'];
    if (objItem.LastName<>row.Values['LastName']) then	    objItem.LastName:=row.Values['LastName'];
    if (objItem.Suffix<>row.Values['Suffix']) then	    objItem.Suffix:=row.Values['Suffix'];
    if (objItem.Profession<>row.Values['Profession']) then	    objItem.Profession:=row.Values['Profession'];
    if (objItem.Hobby<>row.Values['Hobby']) then	    objItem.Hobby:=row.Values['Hobby'];
    if (objItem.Spouse<>row.Values['Spouse']) then	    objItem.Spouse:=row.Values['Spouse'];
    if (objItem.Body<>row.Values['Body']) then	    objItem.Body:=row.Values['Body'];
    if (objItem.HomeAddressStreet<>row.Values['HomeAddressStreet']) then	    objItem.HomeAddressStreet:=row.Values['HomeAddressStreet'];
    if (objItem.HomeAddressPostalCode<>row.Values['HomeAddressPostalCode']) then	    objItem.HomeAddressPostalCode:=row.Values['HomeAddressPostalCode'];
    if (objItem.HomeAddressCity<>row.Values['HomeAddressCity']) then	    objItem.HomeAddressCity:=row.Values['HomeAddressCity'];
    if (objItem.HomeAddressState<>row.Values['HomeAddressState']) then	    objItem.HomeAddressState:=row.Values['HomeAddressState'];
    if (objItem.HomeAddressCountry<>row.Values['HomeAddressCountry']) then	    objItem.HomeAddressCountry:=row.Values['HomeAddressCountry'];
    if (objItem.HomeAddressPostOfficeBox<>row.Values['HomeAddressPostOfficeBox']) then	    objItem.HomeAddressPostOfficeBox:=row.Values['HomeAddressPostOfficeBox'];
    if (objItem.PrimaryTelephoneNumber<>row.Values['PrimaryTelephoneNumber']) then	    objItem.PrimaryTelephoneNumber:=row.Values['PrimaryTelephoneNumber'];
    if (objItem.CallbackTelephoneNumber<>row.Values['CallbackTelephoneNumber']) then	    objItem.CallbackTelephoneNumber:=row.Values['CallbackTelephoneNumber'];
    if (objItem.MobileTelephoneNumber<>row.Values['MobileTelephoneNumber']) then	    objItem.MobileTelephoneNumber:=row.Values['MobileTelephoneNumber'];
    if (objItem.HomeTelephoneNumber<>row.Values['HomeTelephoneNumber']) then	    objItem.HomeTelephoneNumber:=row.Values['HomeTelephoneNumber'];
    if (objItem.Home2TelephoneNumber<>row.Values['Home2TelephoneNumber']) then	    objItem.Home2TelephoneNumber:=row.Values['Home2TelephoneNumber'];
    if (objItem.BusinessTelephoneNumber<>row.Values['BusinessTelephoneNumber']) then	    objItem.BusinessTelephoneNumber:=row.Values['BusinessTelephoneNumber'];
    if (objItem.Business2TelephoneNumber<>row.Values['Business2TelephoneNumber']) then	    objItem.Business2TelephoneNumber:=row.Values['Business2TelephoneNumber'];
    if (objItem.OtherTelephoneNumber<>row.Values['OtherTelephoneNumber']) then	    objItem.OtherTelephoneNumber:=row.Values['OtherTelephoneNumber'];
    if (objItem.CarTelephoneNumber<>row.Values['CarTelephoneNumber']) then	    objItem.CarTelephoneNumber:=row.Values['CarTelephoneNumber'];
    if (objItem.PagerNumber<>row.Values['PagerNumber']) then	    objItem.PagerNumber:=row.Values['PagerNumber'];
    if (objItem.RadioTelephoneNumber<>row.Values['RadioTelephoneNumber']) then	    objItem.RadioTelephoneNumber:=row.Values['RadioTelephoneNumber'];
    if (objItem.BusinessFaxNumber<>row.Values['BusinessFaxNumber']) then	    objItem.BusinessFaxNumber:=row.Values['BusinessFaxNumber'];
    if (objItem.OtherFaxNumber<>row.Values['OtherFaxNumber']) then	    objItem.OtherFaxNumber:=row.Values['OtherFaxNumber'];
    if (objItem.TelexNumber<>row.Values['TelexNumber']) then	    objItem.TelexNumber:=row.Values['TelexNumber'];
    if (objItem.Email1Address<>row.Values['Email1Address']) then	    objItem.Email1Address:=row.Values['Email1Address'];
    if (objItem.Email1DisplayName<>row.Values['Email1DisplayName']) then	    objItem.Email1DisplayName:=row.Values['Email1DisplayName'];
    if (objItem.Email2Address<>row.Values['Email2Address']) then	    objItem.Email2Address:=row.Values['Email2Address'];
    if (objItem.Email2DisplayName<>row.Values['Email2DisplayName']) then	    objItem.Email2DisplayName:=row.Values['Email2DisplayName'];
    if (objItem.Email3Address<>row.Values['Email3Address']) then	    objItem.Email3Address:=row.Values['Email3Address'];
    if (objItem.Email3DisplayName<>row.Values['Email3DisplayName']) then	    objItem.Email3DisplayName:=row.Values['Email3DisplayName'];
    if (objItem.PersonalHomePage<>row.Values['PersonalHomePage']) then	    objItem.PersonalHomePage:=row.Values['PersonalHomePage'];
    if (objItem.Department<>row.Values['Department']) then	    objItem.Department:=row.Values['Department'];
    if (objItem.Companies<>row.Values['Companies']) then	    objItem.Companies:=row.Values['Companies'];
    if (objItem.OfficeLocation<>row.Values['OfficeLocation']) then	    objItem.OfficeLocation:=row.Values['OfficeLocation'];
    if (objItem.JobTitle<>row.Values['JobTitle']) then	    objItem.JobTitle:=row.Values['JobTitle'];
    if (objItem.ManagerName<>row.Values['ManagerName']) then	    objItem.ManagerName:=row.Values['ManagerName'];
    if (objItem.AssistantName<>row.Values['AssistantName']) then	    objItem.AssistantName:=row.Values['AssistantName'];
    if (objItem.AssistantTelephoneNumber<>row.Values['AssistantTelephoneNumber']) then	    objItem.AssistantTelephoneNumber:=row.Values['AssistantTelephoneNumber'];
    if (objItem.WebPage<>row.Values['WebPage']) then	    objItem.WebPage:=row.Values['WebPage'];
    if (objItem.OtherAddressStreet<>row.Values['OtherAddressStreet']) then	    objItem.OtherAddressStreet:=row.Values['OtherAddressStreet'];
    if (objItem.OtherAddressPostalCode<>row.Values['OtherAddressPostalCode']) then	    objItem.OtherAddressPostalCode:=row.Values['OtherAddressPostalCode'];
    if (objItem.OtherAddressCity<>row.Values['OtherAddressCity']) then	    objItem.OtherAddressCity:=row.Values['OtherAddressCity'];
    if (objItem.OtherAddressCountry<>row.Values['OtherAddressCountry']) then	    objItem.OtherAddressCountry:=row.Values['OtherAddressCountry'];
    if (objItem.OtherAddressState<>row.Values['OtherAddressState']) then	    objItem.OtherAddressState:=row.Values['OtherAddressState'];
    if (objItem.OtherAddressPostOfficeBox<>row.Values['OtherAddressPostOfficeBox']) then	    objItem.OtherAddressPostOfficeBox:=row.Values['OtherAddressPostOfficeBox'];
    if (objItem.CustomerID<>row.Values['CustomerID']) then	    objItem.CustomerID:=row.Values['CustomerID'];
    if (objItem.ComputerNetworkName<>row.Values['ComputerNetworkName']) then	    objItem.ComputerNetworkName:=row.Values['ComputerNetworkName'];
    if (objItem.User1<>row.Values['User1']) then	    objItem.User1:=row.Values['User1'];
    if (objItem.User2<>row.Values['User2']) then	    objItem.User2:=row.Values['User2'];
    if (objItem.User3<>row.Values['User3']) then	    objItem.User3:=row.Values['User3'];
    if (objItem.User4<>row.Values['User4']) then	    objItem.User4:=row.Values['User4'];
    if (objItem.UserCertificate<>row.Values['UserCertificate']) then	    objItem.UserCertificate:=row.Values['UserCertificate'];
    if (objItem.CompanyName<>row.Values['CompanyName']) then	    objItem.CompanyName:=row.Values['CompanyName'];
    if (objItem.CompanyMainTelephoneNumber<>row.Values['CompanyMainTelephoneNumber']) then	    objItem.CompanyMainTelephoneNumber:=row.Values['CompanyMainTelephoneNumber'];
    if (objItem.BusinessHomePage<>row.Values['BusinessHomePage']) then	    objItem.BusinessHomePage:=row.Values['BusinessHomePage'];
    if (objItem.BusinessAddressStreet<>row.Values['BusinessAddressStreet']) then objItem.BusinessAddressStreet:=row.Values['BusinessAddressStreet'];
    if (objItem.BusinessAddressPostalCode<>row.Values['BusinessAddressPostalCode']) then	    objItem.BusinessAddressPostalCode:=row.Values['BusinessAddressPostalCode'];
    if (objItem.BusinessAddressCity<>row.Values['BusinessAddressCity']) then	    objItem.BusinessAddressCity:=row.Values['BusinessAddressCity'];
    if (objItem.BusinessAddressState<>row.Values['BusinessAddressState']) then	    objItem.BusinessAddressState:=row.Values['BusinessAddressState'];
    if (objItem.BusinessAddressCountry<>row.Values['BusinessAddressCountry']) then	    objItem.BusinessAddressCountry:=row.Values['BusinessAddressCountry'];
    if (objItem.BusinessAddressPostOfficeBox<>row.Values['BusinessAddressPostOfficeBox']) then	    objItem.BusinessAddressPostOfficeBox:=row.Values['BusinessAddressPostOfficeBox'];
                   }

    objItem.Save;

    memo1.lines.Add(ProcedureCommand('EXEC om.itemContactSyncEntryId',[mrow.lines.Values['ContactItemId'],objItem.EntryID,objItem.LastModificationTime]));
  end;

  if memo1.lines.text>'' then
  begin
    PostVars := TStringList.Create;
    res := TStringList.Create;
    //row := TStringList.Create;
    PostVars.Values['query'] := memo1.text;
    memo1.text:=getresult(domainurl+'aim/db/aim-details.php',PostVars);
    //PostVars.Free;
    //res.Free;
    //row.Free;
  end;
  ProgressBar1.Position:=0;
end;

procedure TfmMain.Button4Click(Sender: TObject);
var
  WordApp, NewDoc: Variant;
begin
  try
    WordApp := GetActiveOleObject('Word.Application') ;
  except
    WordApp:= CreateOleObject('Word.Application');
  end;

  { Creates a Microsoft Word application. }
  //WordApp := CreateOleObject('Word.Application');
  { Creates a new Microsoft Word document. }
  NewDoc := WordApp.Documents.Add;
  { Inserts the text 'Hello World!' in the document. }
  WordApp.Selection.TypeText('Hello World!');
  WordApp.Application.Visible:=true;

  WordApp.Activate;
  { Saves the document on the disk. }
  //NewDoc.SaveAs('my_new_document.doc');
  { Closes Microsoft Word. }
  //WordApp.Quit;
  { Releases the interface by assigning the Unassigned constant to the Variant variables. }
  NewDoc := Unassigned;
  WordApp := Unassigned;
end;


procedure TfmMain.FormActivate(Sender: TObject);
begin
  webbrowser.SetFocus;
end;

procedure TfmMain.Button2Click(Sender: TObject);
begin
  WebBrowserScan.Stop;
  //wbGetHtml.ControlInterface.ExecWB(OLECMDID_PRINT, OLECMDEXECOPT_DONTPROMPTUSER, vaIn, vaOut);
end;

procedure TfmMain.WebBrowserBeforeNavigate2(Sender: TObject;
  const pDisp: IDispatch; var URL, Flags, TargetFrameName, PostData,
  Headers: OleVariant; var Cancel: WordBool);
begin
  pageloaded:=false;
end;

procedure TfmMain.WebBrowserDownloadBegin(Sender: TObject);
begin
  pageloaded:=false;
end;

function GetHtml(var WebBrowser: TWebBrowser): String;
var Doc: IHTMLDocument2;      // current HTML document
begin
  Doc := WebBrowser.Document as IHTMLDocument2;
  result := Doc.body.innerHTML;
end;

function GetBrowserHtml(const webBrowser: TWebBrowser): String;
var
  strStream: TStringStream;
  adapter: IStream;
  browserStream: IPersistStreamInit;
begin
  strStream := TStringStream.Create('');
  try
    browserStream := webBrowser.Document as IPersistStreamInit;
    adapter := TStreamAdapter.Create(strStream,soReference);
    if (browserStream = nil) then exit;
    browserStream.Save(adapter,true);
    result := strStream.DataString;
  finally
  end;
  strStream.Free();
end;

procedure uploadHtml(const WebBrowser: TWebBrowser);
var s: string;
begin
  s := GetBrowserHtml(WebBrowser);
  if (s>'') then
  begin
    Html.uploadData('http://localhost/sites/airo/shoppen/test.php', s);
    //Memo2.Text := s;
  end;
end;


procedure TfmMain.WebBrowserScanDocumentComplete(Sender: TObject;
  const pDisp: IDispatch; var URL: OleVariant);
begin
  Memo3.lines.add('WebBrowserScanDocumentComplete');
  uploadHtml(WebBrowserScan);
  WebBrowserScan.Stop;
end;

procedure TfmMain.WebBrowserScanDownloadComplete(Sender: TObject);
begin
  Memo3.lines.add('WebBrowserScanDownloadComplete');
  //Memo2.Text := GetBrowserHtml(WebBrowserScan);
end;

procedure TfmMain.WebBrowserScanNavigateComplete2(Sender: TObject;
  const pDisp: IDispatch; var URL: OleVariant);
begin
  Memo3.lines.add('WebBrowserScanNavigateComplete2');
  //Memo2.Text := GetBrowserHtml(WebBrowserScan);
  //tStop.enabled:=true;

  //Memo2.Text := GetBrowserHtml(WebBrowserScan);
end;

procedure TfmMain.WebBrowserScanCommandStateChange(Sender: TObject;
  Command: Integer; Enable: WordBool);
begin
  Memo3.lines.add('WebBrowserScanCommandStateChange');
  uploadHtml(WebBrowserScan);
  //Memo2.Text := GetBrowserHtml(WebBrowserScan);
  //Memo2.Text := GetBrowserHtml(WebBrowserScan);

end;

procedure TfmMain.WebBrowserScanDownloadBegin(Sender: TObject);
begin
  Memo3.lines.add('WebBrowserScanDownloadBegin');
  //Memo2.Text := GetBrowserHtml(WebBrowserScan);

end;

procedure TfmMain.WebBrowserScanBeforeNavigate2(Sender: TObject;
  const pDisp: IDispatch; var URL, Flags, TargetFrameName, PostData,
  Headers: OleVariant; var Cancel: WordBool);
begin
  Memo3.lines.add('WebBrowserScanBeforeNavigate2');
  //Memo2.Text := GetBrowserHtml(WebBrowserScan);
end;

procedure TfmMain.WebBrowserScanStatusTextChange(Sender: TObject;
  const Text: WideString);
begin
  Memo3.lines.add('WebBrowserScanStatusTextChange');
  //Memo2.Text := GetBrowserHtml(WebBrowserScan);
end;

procedure TfmMain.WebBrowserScanProgressChange(Sender: TObject; Progress,
  ProgressMax: Integer);
begin
  Memo3.lines.add('WebBrowserScanProgressChange');
  //Memo2.Text := GetBrowserHtml(WebBrowserScan);
end;

procedure TfmMain.WebBrowserScanPropertyChange(Sender: TObject;
  const szProperty: WideString);
begin
  Memo3.lines.add('WebBrowserScanPropertyChange');
  //Memo2.Text := GetBrowserHtml(WebBrowserScan);
end;

procedure TfmMain.tStopTimer(Sender: TObject);
begin
  //WebBrowserScan.Stop;
end;

end.

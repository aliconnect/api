unit fCommService;

interface

uses
  Windows, Messages, SysUtils, Variants, Classes, Graphics, Controls, Forms,
  Dialogs, dOPCIntf, dOPCComn, dOPCDA, dOPC, StdCtrls, dOPCGUI, dOPCDlgBrowse,
  ComCtrls, dOPCAE, Grids, DBGrids, AlcnObj, ToolWin, DB, ADODB, ExtCtrls, iniFiles,
  ScktComp, OleCtrls, SHDocVw, IdBaseComponent, IdComponent,
  IdTCPConnection, IdTCPClient, IdIOHandler, IdIOHandlerStream, ImgList,
  AlcnActns, DBActns, ActnList, DBCtrls, Menus, Buttons;

type
  TfmAIMOPC = class(TForm)
    StatusBar: TStatusBar;
    OPCServer: TdOPCServer;
    GUI: TdOPCGUI;
    tUpdate: TTimer;
    PageControl1: TPageControl;
    TabSheet1: TTabSheet;
    TabSheet2: TTabSheet;
    ServerSocket1: TServerSocket;
    ClientSocket1: TClientSocket;
    PageControl2: TPageControl;
    TabSheet5: TTabSheet;
    mLog: TMemo;
    ToolBar2: TToolBar;
    edHostName: TEdit;
    edHostIp: TEdit;
    edHostPort: TEdit;
    btHostStart: TButton;
    cbHostActive: TCheckBox;
    cbLog: TCheckBox;
    TabSheet6: TTabSheet;
    ToolBar1: TToolBar;
    btRun: TButton;
    mData: TMemo;
    ToolBar3: TToolBar;
    edSendHost: TEdit;
    edSendPort: TEdit;
    edSendText: TEdit;
    btIpSend: TButton;
    cbClientConnected: TCheckBox;
    tsWeb: TTabSheet;
    WebBrowser1: TWebBrowser;
    Button2: TButton;
    TabSheet3: TTabSheet;
    mSend: TMemo;
    Button4: TButton;
    cbConnectToHost: TCheckBox;
    Button3: TButton;
    TabSheet4: TTabSheet;
    IdTCPClient1: TIdTCPClient;
    ToolBar4: TToolBar;
    Button5: TButton;
    Button6: TButton;
    mResult: TMemo;
    cAim: TADOConnection;
    dtItems: TADataSet;
    dsItems: TADataSource;
    dsSrv: TADataSource;
    dtSrv: TADataSet;
    ImageList2: TImageList;
    ActionList1: TActionList;
    DataSetFirst1: TDataSetFirst;
    DataSetPrior1: TDataSetPrior;
    DataSetNext1: TDataSetNext;
    DataSetLast1: TDataSetLast;
    DataSetRequery1: TDataSetRequery;
    DataSetEdit1: TDataSetEdit;
    DataSetCancel1: TDataSetCancel;
    DataSetPost1: TDataSetPost;
    DataSetInsert1: TDataSetInsert;
    DataSetCopy1: TDataSetCopy;
    DataSetDelete1: TDataSetDelete;
    DataSetSort1: TDataSetSort;
    DataSetSortDesc1: TDataSetSortDesc;
    DataSetFind1: TDataSetFind;
    DataSetFilter1: TDataSetFilter;
    DataSetFilterSet1: TDataSetFilterSet;
    DataGridEdit1: TDataGridEdit;
    DataGridToExcel1: TDataGridToExcel;
    dtSrvid: TIntegerField;
    dtSrvservername: TStringField;
    PopupMenu1: TPopupMenu;
    Edit1: TMenuItem;
    ToolBar5: TToolBar;
    ServerCombo: TDBComboBox;
    btConnect: TButton;
    bDisconnect: TButton;
    spView: TSpeedButton;
    cbUpdate: TCheckBox;
    eMs: TEdit;
    pOpcTree: TPanel;
    Splitter3: TSplitter;
    TreeView1: TTreeView;
    lbOpcItems: TListBox;
    lvRead: TListView;
    BottomPanel: TPanel;
    Label18: TLabel;
    Label19: TLabel;
    Label20: TLabel;
    Label21: TLabel;
    LServer: TLabel;
    LVersion: TLabel;
    LState: TLabel;
    LInfo: TLabel;
    Splitter1: TSplitter;
    Button1: TButton;
    procedure FormCreate(Sender: TObject);
    procedure btReloadClick(Sender: TObject);
    procedure cbUpdateClick(Sender: TObject);
    procedure tUpdateTimer(Sender: TObject);
    procedure btHostStartClick(Sender: TObject);
    procedure ServerSocket1ClientConnect(Sender: TObject;
      Socket: TCustomWinSocket);
    procedure ServerSocket1ClientDisconnect(Sender: TObject;
      Socket: TCustomWinSocket);
    procedure ServerSocket1ClientError(Sender: TObject;
      Socket: TCustomWinSocket; ErrorEvent: TErrorEvent;
      var ErrorCode: Integer);
    procedure ServerSocket1ClientRead(Sender: TObject;
      Socket: TCustomWinSocket);
    procedure ServerSocket1ClientWrite(Sender: TObject;
      Socket: TCustomWinSocket);
    procedure btRunClick(Sender: TObject);
    procedure OPCServerDatachange(Sender: TObject;
      ItemList: TdOPCItemList);
    procedure btIpSendClick(Sender: TObject);
    procedure ClientSocket1Connect(Sender: TObject;
      Socket: TCustomWinSocket);
    procedure Button2Click(Sender: TObject);
    procedure ClientSocket1Disconnect(Sender: TObject;
      Socket: TCustomWinSocket);
    procedure Button4Click(Sender: TObject);
    procedure Button3Click(Sender: TObject);
    procedure ClientSocket1Read(Sender: TObject; Socket: TCustomWinSocket);
    procedure Button5Click(Sender: TObject);
    procedure Button6Click(Sender: TObject);
    procedure ServerComboDropDown(Sender: TObject);
    procedure bDisconnectClick(Sender: TObject);
    procedure TreeView1Change(Sender: TObject; Node: TTreeNode);
    procedure OPCServerConnect(Sender: TObject);
    procedure getTreeClick(Sender: TObject);
    procedure Button10Click(Sender: TObject);
    procedure lvReadEdited(Sender: TObject; Item: TListItem;
      var S: String);
    procedure TreeView1Expanding(Sender: TObject; Node: TTreeNode;
      var AllowExpansion: Boolean);
    procedure addRowClick(Sender: TObject);
    procedure lbOpcItemsDblClick(Sender: TObject);
    procedure Edit1Click(Sender: TObject);
    procedure OPCServerWriteComplete(Sender: TObject;
      ItemList: TdOPCItemList);
    procedure Button1Click(Sender: TObject);
  private
    { Private declarations }
    procedure ShowLeafsInListBox(Folder: TdOPCBrowseItem);
  public
    { Public declarations }
    lastUpdate: TDateTime;
    inifile: TIniFile;
    OPCGroup : TdOPCGroup;
    //opcServerName: string;
    procedure log(s:string);
    procedure writeItem (opcitem:TdOpcItem;newValue:string);overload;
    procedure writeItem (itemId,newValue:string); overload;

    procedure sendToOpc(name,value:string);
    procedure opcSetVar(itemId:string);
  end;

  TdataOpcItem = class
    //oldValue: string;
    //commandText: string;
    //opcItemId: integer;
    id: string;
    lvItem: TListItem;
    write: boolean;
    bm: TBookMark;
  end;

  TdataListItem = class
    opcItem: TdOpcItem;
  end;

var
  fmAIMOPC: TfmAIMOPC;

implementation

{$R *.dfm}

uses uAlicon, mshtml, html, fAimBrowser;
procedure TfmAIMOPC.log(s:string);
begin
  s:=DateTimeToStr(now())+' - '+s;
  statusbar.SimpleText:=s;
  if cbLog.Checked then mLog.lines.add(s);
end;


procedure TfmAIMOPC.FormCreate(Sender: TObject);
var
  i:integer;
  Host, IP, Err: string;
begin
{  inifile:=TIniFile.Create(changefileext(application.ExeName,'.ini'));
  if (inifile.ReadString('db','connectionstring','')>'') then
  begin
    cAim.close;
    cAim.connectionstring:=inifile.ReadString('db','connectionstring','');
    cAim.Open;
  end;
  if (cAim.Connected) then
  begin
  //gridload(self);
    dtSrv.close;
    dtSrv.Parameters[0].Value:=paramStr(1);
    dtSrv.Open;
    dtItems.Open;
  end;

  if GetIPFromHost(Host, IP, Err) then
  begin
    edHostName.Text := Host;
    edHostIp.Text := IP;
    edSendHost.Text := IP;
  end
  else
    MessageDlg(Err, mtError, [mbOk], 0);
  i:=1;
  while i<=paramCount do
  begin
    if paramStr(i)='-ipstart' then btHostStart.Click
    else if paramStr(i)='-hostport' then begin edHostPort.Text:=paramStr(i+1); inc(i); end
    else if paramStr(i)='-opcserver' then begin ServerCombo.Text:=paramStr(i+1); inc(i); end
    ;
    inc(i);
  end;
  if edHostPort.Text>'' then btHostStart.Click;

//  tUpdate.Enabled:=true;
}
  OPCGroup := OPCServer.OPCGroups.Add('AimOpcGroup'); // create new group
//  btConnect.Click;
end;


procedure TfmAIMOPC.cbUpdateClick(Sender: TObject);
begin
  tUpdate.Enabled:=cbUpdate.Checked;
end;


procedure TfmAIMOPC.sendToOpc(name,value:string);
begin
  try
    OPCGroup.OPCItems.ItemIds[name].WriteASync(value);
    log('Sending '+name+'='+value+' DONE');
  except
    log('Sending '+name+'='+value+' FAIL');
  end;

end;

procedure TfmAIMOPC.opcSetVar(itemId:string);
var
  id: integer;
  Item   : TdOPCItem;
begin
  Item:=OPCGroup.OPCItems.AddItem(itemId);
  Item.Data:=TdataOpcItem.Create;
  TdataOpcItem(Item.Data).lvItem:=lvRead.Items.Add;
  TdataOpcItem(Item.Data).lvItem.Data:=TdataListItem.Create;
  TdataListItem(TdataOpcItem(Item.Data).lvItem.Data).opcItem:=Item;
  TdataOpcItem(Item.Data).lvItem.Caption:=Item.ValueStr;
  TdataOpcItem(Item.Data).lvItem.SubItems.add(Item.ItemID);
  TdataOpcItem(Item.Data).lvItem.SubItems.add('');
  TdataOpcItem(Item.Data).lvItem.SubItems.add('');
  TdataOpcItem(Item.Data).lvItem.SubItems.add('');
  TdataOpcItem(Item.Data).lvItem.SubItems.add('');
  TdataOpcItem(Item.Data).lvItem.SubItems.add('');
  TdataOpcItem(Item.Data).lvItem.SubItems.add('');
  TdataOpcItem(Item.Data).lvItem.SubItems.add('');
  TdataOpcItem(Item.Data).lvItem.SubItems.add('');
end;

procedure TfmAIMOPC.btHostStartClick(Sender: TObject);
begin
  if not ServerSocket1.Active then
  begin
    ServerSocket1.Port := StrToInt(edHostPort.Text);
    ServerSocket1.Active := True;
    cbHostActive.Checked:=true;
    btHostStart.Caption:='Stop';
  end
  else
  begin
    ServerSocket1.Active := False;
    cbHostActive.Checked:=false;
    btHostStart.Caption:='Start';
  end;

end;

procedure TfmAIMOPC.ServerSocket1ClientConnect(Sender: TObject;
  Socket: TCustomWinSocket);
begin
  cbClientConnected.Checked:=true;
end;

procedure TfmAIMOPC.ServerSocket1ClientDisconnect(Sender: TObject;
  Socket: TCustomWinSocket);
begin
  cbClientConnected.Checked:=false;
end;

procedure TfmAIMOPC.ServerSocket1ClientError(Sender: TObject;
  Socket: TCustomWinSocket; ErrorEvent: TErrorEvent;
  var ErrorCode: Integer);
begin
  log('Client Error');
end;

procedure TfmAIMOPC.ServerSocket1ClientRead(Sender: TObject;
  Socket: TCustomWinSocket);
var
  i:integer;
  sRec : string;
begin
  for i := 0 to ServerSocket1.Socket.ActiveConnections-1 do
  begin
    with ServerSocket1.Socket.Connections[i] do
    begin
      sRec := ReceiveText;
      if sRec <> '' then
      begin
        mData.Text:=sRec;
        log('IP Received from '+RemoteAddress + ' data "' + sRec + '"');
        btRun.click;
      end;
    end;
  end;
end;

procedure TfmAIMOPC.ServerSocket1ClientWrite(Sender: TObject;
  Socket: TCustomWinSocket);
begin
//  log('Client Write');
end;

procedure TfmAIMOPC.btRunClick(Sender: TObject);
var
  i,p:integer;
  s,servername,itemname,value,host,port:string;
begin
  with mData do
  begin
    for i:= 0 to Lines.Count-1 do
    begin
      s:=lines[i];
      p:=pos(#9,s);
      servername:=copy(s,0,p-1);
      s:=copy(s,p+1,99999);
      p:=pos(#9,s);
      itemname:=copy(s,0,p-1);
      value:=copy(s,p+1,99999);
      if (servername=ServerCombo.Text) then
      begin
        log('Sending to '+servername+' item '+itemname+' = '+value);
        try
          OPCGroup.OPCItems.ItemIds[itemname].WriteASync(value);
          log('Sending to '+servername+' item '+itemname+' = '+value+' DONE');
        except
          log('Sending to '+servername+' item '+itemname+' = '+value+' FAIL');
        end;
      end
      else if (pos('http://',s)>0) then
      begin
        tsWeb.Show;
        WebBrowser1.SetFocus;
        webbrowser1.Navigate(s);
      end
      else if (pos(':',servername)>0) then
      begin
        edSendHost.Text:=copy(servername,0,pos(':',servername)-1);
        edSendPort.Text:=copy(servername,pos(':',servername)+1,9999);
        edSendText.Text:=value;
        btIpSend.Click;
      end;
    end
  end;
end;


procedure TfmAIMOPC.btIpSendClick(Sender: TObject);
begin
  if (edSendText.Text>'') then
  begin
    ClientSocket1.Socket.SendText(edSendText.Text+#13+#10);
    Log('IP Send to '+edSendHost.Text+':'+edSendport.Text+' data "'+edSendText.Text+'"');
  end;
end;

procedure TfmAIMOPC.ClientSocket1Connect(Sender: TObject;
  Socket: TCustomWinSocket);
begin
  cbConnectToHost.Checked:=true;
  if (mSend.Text>'') then
  begin
      ClientSocket1.Socket.SendText(mSend.Text+#13+#10);
      Log('IP Send to '+edSendHost.Text+':'+edSendport.Text+' data "'+mSend.Text+#13+#10+'"');
  end;
end;



procedure TfmAIMOPC.Button2Click(Sender: TObject);
var i:integer;s:string;
begin

    for i:=1 to 1000 do s:=s+'insert test into test () values jjhgasjhasdfinsert test into test () values jjhgasjhasdfinsert test into test () values jjhgasjhasdf';
WebFormFieldValueSet(WebBrowser1.Document AS IHTMLDocument2,0,'q',s);
WebFormSubmit(WebBrowser1.Document AS IHTMLDocument2,0);

end;

procedure TfmAIMOPC.ClientSocket1Disconnect(Sender: TObject;
  Socket: TCustomWinSocket);
begin
  cbConnectToHost.Checked:=false;
end;

procedure TfmAIMOPC.Button4Click(Sender: TObject);
begin
  with ClientSocket1 do
  begin
    if active then
      Active :=  false;
    Port :=  StrToInt(edSendPort.text);
    Host :=  edSendHost.Text;
    Active :=  true;
  end;

end;

procedure TfmAIMOPC.Button3Click(Sender: TObject);
var i:integer;
begin
  with ClientSocket1 do
  begin
    if active then
      Active :=  false;
    Port :=  StrToInt(edSendPort.text);
    Host :=  edSendHost.Text;
    Active :=  true;
  end;
end;

procedure TfmAIMOPC.ClientSocket1Read(Sender: TObject;
  Socket: TCustomWinSocket);
begin
  Log(Socket.ReceiveText);
  ClientSocket1.Active:=false;
end;

procedure TfmAIMOPC.Button5Click(Sender: TObject);
var s:string;
begin
IdTCPClient1.Host:='www.alicon.nl';
IdTCPClient1.Port:=80;
IdTCPClient1.connect;
IdTCPClient1.SendCmd(mSend.Text);
mresult.Clear;
  s:=IdTCPClient1.ReadLn;
  while s>'' do
  begin
    mresult.Lines.Add(s);
    s:=IdTCPClient1.ReadLn(#10);
  end;
  while s='' do
  begin
    mresult.Lines.Add(s);
    s:=IdTCPClient1.ReadLn(#10);
  end;
  while s>'' do
  begin
    mresult.Lines.Add(s);
    try
      s:=IdTCPClient1.ReadLn(#10);
    except;
    end;
  end;
end;

procedure TfmAIMOPC.Button6Click(Sender: TObject);
var
  s:string;
begin
end;

procedure TfmAIMOPC.ServerComboDropDown(Sender: TObject);
begin
  if trim(ServerCombo.Items.Text) = '' then  // if no OPC Servernames loaded
  begin
    Screen.Cursor := crHourGlass;
    GetOPCDAServers(ServerCombo.Items);        // get Servernames from registry
    Screen.Cursor := crDefault;
  end;

end;


procedure BranchesToTreeView(Browser: TdOPCBrowser; Tree: TTreeView; Node : TTreeNode = nil);
var
  i       : integer;
  S       : TdOPCBrowseItems;
  NewNode : TTreeNode;
  Folder  : TdOPCBrowseItem;
begin
  if Node = nil then                //  if root folder
  begin
    Browser.MovetoRoot;
    Node := Tree.Items.AddChild(nil,'Root');
    Folder  := TdOPCBrowseItem.Create;
    Folder.Assign(Browser.CurrentPosition);
    Node.Data := Folder;
    Node.HasChildren:=true;
  end
  else if node.Count=0 then
  begin
    Browser.MoveTo(Node.data);
    Browser.ShowBranches;            // get all Branches in this level from OPC Server
    S := TdOPCBrowseItems.Create;
    S.Assign(Browser.Items);         // save Items in new StringList
    for i := 0 to S.Count-1 do       // for all Items in stringlist
    begin
        NewNode := Tree.Items.AddChild(Node,S[i].Name);
        Folder  := TdOPCBrowseItem.Create;
        Folder.Assign(S[i]);
        NewNode.HasChildren:=S.Items[i].HasChilds;//.Count>0;//(S.Items[i]);
        NewNode.Data := Folder;
        NewNode.SelectedIndex := 1;
        {
        if Browser.MoveDown(S.Items[i]) then               // one Level down
        begin
          BranchesToTreeView(Browser,Tree,NewNode);  // rekusive call
          Browser.MoveUp;                            // back to old Level
        end;
        }
    end;
    S.Free;
  end;
end;

procedure TfmAIMOPC.TreeView1Expanding(Sender: TObject; Node: TTreeNode;
  var AllowExpansion: Boolean);
begin
  BranchesToTreeView(OpcServer.Browser,TreeView1,Node);  // rekusive call
end;

procedure TfmAIMOPC.ShowLeafsInListBox(Folder: TdOPCBrowseItem);
var
  i: integer;
begin
  OpcServer.Browser.MoveTo(Folder);               // Move to given Folder
  OpcServer.Browser.ShowLeafs;                    // get all Items from Folder
  lbOpcItems.Clear;
  lbOpcItems.Items.BeginUpdate;
  for i := 0 to OpcServer.Browser.Items.Count -1 do
  begin
     //ListBox1.Items.Add(OpcServer.Browser.Items[i].Name); // show items in listbox
     lbOpcItems.Items.Add(OpcServer.Browser.Items[i].itemId); // show items in listbox
  end;
  lbOpcItems.Items.EndUpdate;
end;

procedure TfmAIMOPC.TreeView1Change(Sender: TObject; Node: TTreeNode);
begin
  if (Node = nil) or (Node.Data = nil) then
    exit;
  if OPCServer.Active then    // only if connected to opc server
    ShowLeafsInListBox(TdOPCBrowseItem(Node.Data));  // if Tree change then show leafs in Path

end;

procedure TfmAIMOPC.getTreeClick(Sender: TObject);
begin
  pOpcTree.Visible:=spView.down;
end;

procedure TfmAIMOPC.bDisconnectClick(Sender: TObject);
begin
  OpcServer.Active     := false;              // disconnect from old server
end;

procedure TfmAIMOPC.OPCServerConnect(Sender: TObject);
var
  State : tServerStateRec;
begin
  State := OPCServer.GetState;
  LServer.Caption  := OpcServer.Servername;
  LState.Caption   := State.StatusInfo;
  LInfo.Caption    := State.VendorInfo;
  LVersion.Caption := State.Version + '  ' + OpcServer.ServerTypeName;
end;

procedure TfmAIMOPC.Button10Click(Sender: TObject);
begin
//OPCGroup.OPCItems.ItemIds[dtItems.FieldByName('itemId').AsString].WriteASync(edValueSet.Text);
end;

procedure TfmAIMOPC.lvReadEdited(Sender: TObject; Item: TListItem;
  var S: String);
begin
  TdataListItem(Item.Data).opcItem.WriteASync(s);
  item.SubItems[1]:=DateTimeToStr(now());
  log('WRITE '+TdataListItem(Item.Data).opcItem.ItemId+' = '+s);
end;

procedure TfmAIMOPC.writeItem (opcitem:TdOpcItem;newValue:string);
begin
  with opcitem do
  begin
    //tdataOpcItem(data).lvItem.Caption:=newValue;
    tdataOpcItem(data).lvItem.SubItems[1]:=DateTimeToStr(now());
    tdataOpcItem(data).lvItem.SubItems[3]:=newValue;
    log('WRITE '+opcItem.ItemId+' = '+newValue);
    WriteASync(newValue);
  end;
end;

procedure TfmAIMOPC.writeItem (itemId,newValue:string);
begin
  writeItem (OPCGroup.OPCItems.ItemIds[itemId],newValue);
end;

procedure TfmAIMOPC.tUpdateTimer(Sender: TObject);
var
  List,Row,PostVars : TStringList;
  opcitem:TdOpcItem;
  data:string;
  i:integer;

begin
  tUpdate.Enabled:=false;
  if (cAim.connected) then with tempset(self,cAim,'opc.writeGet',[dtSrv.FieldByName('id').AsString]) do
  begin
    while not eof do
    begin
      writeitem(FieldByName('itemId').AsString,FieldByName('value').AsString);
      next;
    end;
    free;
  end
  else
  begin
    PostVars := TStringList.Create;
    PostVars.Values['exec'] := 'opc.writeget';
    PostVars.Values['srvId'] := paramStr(1);
    data:=getresult('http://localhost/aim/connector/index.php',PostVars);
    List := TStringList.Create;
    Row := TStringList.Create;
    ExtractStrings([';'], [], PChar(data), List);
    for i:= 0 to List.Count-1 do
    begin
      Row.clear;
      ExtractStrings(['='], [], PChar(List[i]), Row);
      writeitem(Row[0],Row[1]);
    end;
    Row.Free;
    List.Free;
  end;
  tUpdate.Enabled:=cbUpdate.checked;
end;

procedure TfmAIMOPC.addRowClick(Sender: TObject);
var
  Item   : TdOPCItem;
begin
  with dtItems do //TempSet(self,cAim,'EXEC opc.itemsGet',[dtSrv.fieldbyname('id').AsInteger]) do
  begin
    if (fieldbyname('itemId').AsString>'') then
    try
      Item:=OPCGroup.OPCItems.AddItem(fieldbyname('itemId').AsString);
      Item.Data:=TdataOpcItem.Create;
      TdataOpcItem(Item.Data).id:=fieldbyname('id').asString;
      TdataOpcItem(Item.Data).write:=fieldbyname('write').AsBoolean;
      TdataOpcItem(Item.Data).bm:=getBookmark;//fieldbyname('itemId').AsInteger;
      TdataOpcItem(Item.Data).lvItem:=lvRead.Items.Add;
      TdataOpcItem(Item.Data).lvItem.Data:=TdataListItem.Create;
      TdataListItem(TdataOpcItem(Item.Data).lvItem.Data).opcItem:=Item;
      TdataOpcItem(Item.Data).lvItem.Caption:=Item.ValueStr;
      TdataOpcItem(Item.Data).lvItem.SubItems.add(Item.ItemID);
      TdataOpcItem(Item.Data).lvItem.SubItems.add('');
      TdataOpcItem(Item.Data).lvItem.SubItems.add('');
      TdataOpcItem(Item.Data).lvItem.SubItems.add('');
      TdataOpcItem(Item.Data).lvItem.SubItems.add('');
      TdataOpcItem(Item.Data).lvItem.SubItems.add('');
      TdataOpcItem(Item.Data).lvItem.SubItems.add('');
      TdataOpcItem(Item.Data).lvItem.SubItems.add('');
      TdataOpcItem(Item.Data).lvItem.SubItems.add('');
      if (TdataOpcItem(Item.Data).write) and (Item.ValueStr<>fieldbyname('value').AsString) then
        Item.WriteAsync(fieldbyname('value').AsString);
      //TdataOpcItem(Item.Data).fromPlc:=fieldbyname('fromPlc').AsBoolean;
    except
      Caption:=Caption+' NIET BESCHIKBAAR';
    end;
  end;
end;



procedure TfmAIMOPC.btReloadClick(Sender: TObject);
var
  //Item   : TdOPCItem;
  s,data,servername: string;
  PostVars : TStringList;
  List,Row: TStrings;
  i: integer;
  item: TDOpcItem;
  //prevbm: TBookmark;
begin
{
  with dtSrv do if active then
  begin
    if modified then post;
    servername:=dtSrv.fieldbyname('servername').asstring;
  end
  else
  begin
    //getservername form webserver
    PostVars := TStringList.Create;
    PostVars.Values['exec'] := 'om.srv';
    PostVars.Values['srvId'] := paramStr(1);
    data:=getresult('http://localhost/aim/connector/index.php',PostVars);
    List := TStringList.Create;
    Row := TStringList.Create;
    try
      ExtractStrings([';'], [], PChar(data), List);
      servername:=List[0];
    finally
    end;
    //servername:='PhoenixContact.AX-Server.21';
  end;
  }
  OpcServer.Active     := false;              // disconnect from old server
  OPCGroup.OPCItems.RemoveAll;                  // remove old item from group
  OpcServer.ServerName:=ServerCombo.Text;
  OpcServer.Active:= true;
  TreeView1.Items.clear;
  BranchesToTreeView(OpcServer.Browser,TreeView1); // get all Pathes from OPC Server
  if TreeView1.Items.Count > 0 then
  begin
    TreeView1.Items[0].Selected := true;
    TreeView1.Items[0].Expanded := true;
  end;

  {
  if (servername>'') then
  begin
    ServerCombo.Text:=servername;
    OpcServer.ServerName:=servername;
    if (OpcServer.ServerName>'') then OpcServer.Active:= true;               // connect to Server
    lvRead.Items.Clear;
    OPCGroup.OPCItems.RemoveAll;                  // remove old item from group
    with dtItems do if active then//TempSet(self,cAim,'EXEC opc.itemsGet',[dtSrv.fieldbyname('id').AsInteger]) do
    begin
      requery;
      while not eof do
      begin
        addRowClick(sender);
        next;
      end;
    end
    else
    begin
      //getdata from webserver
      for i:= 1 to List.Count-1 do
      begin
        //showmessage(List[i]);
        Row.clear;
        ExtractStrings([','], [], PChar(List[i]), Row);
        try
          //showmessage(List[i]+'-'+Row[0]+'-'+Row[1]+'-'+Row[2]);

          Item:=OPCGroup.OPCItems.AddItem(Row[0]); // itemId
          Item.Data:=TdataOpcItem.Create;
          TdataOpcItem(Item.Data).id:=Row[1];
          TdataOpcItem(Item.Data).write:=StrToBool(Row[2]);
          TdataOpcItem(Item.Data).lvItem:=lvRead.Items.Add;
          TdataOpcItem(Item.Data).lvItem.Data:=TdataListItem.Create;
          TdataListItem(TdataOpcItem(Item.Data).lvItem.Data).opcItem:=Item;
          TdataOpcItem(Item.Data).lvItem.Caption:=Item.ValueStr;
          TdataOpcItem(Item.Data).lvItem.SubItems.add(Item.ItemID);
          TdataOpcItem(Item.Data).lvItem.SubItems.add('');
          TdataOpcItem(Item.Data).lvItem.SubItems.add('');
          TdataOpcItem(Item.Data).lvItem.SubItems.add('');
          TdataOpcItem(Item.Data).lvItem.SubItems.add('');
          TdataOpcItem(Item.Data).lvItem.SubItems.add('');
          TdataOpcItem(Item.Data).lvItem.SubItems.add('');
          TdataOpcItem(Item.Data).lvItem.SubItems.add('');
          TdataOpcItem(Item.Data).lvItem.SubItems.add('');
          if (TdataOpcItem(Item.Data).write) then writeItem(Item,trim(Row[3]));
          //TdataOpcItem(Item.Data).fromPlc:=fieldbyname('fromPlc').AsBoolean;
        except
          Caption:=Caption+' NIET BESCHIKBAAR';
        end;
      end;
      Row.Free;
      List.Free;
    end;
  end;
}
  //getTreeclick(sender);
end;

procedure TfmAIMOPC.lbOpcItemsDblClick(Sender: TObject);
var
  id: integer;
  itemId :string;
  Item   : TdOPCItem;
begin
  itemId:=lbOpcItems.Items[lbOpcItems.ItemIndex];
  Item:=OPCGroup.OPCItems.AddItem(itemId);
  Item.Data:=TdataOpcItem.Create;
  TdataOpcItem(Item.Data).lvItem:=lvRead.Items.Add;
  TdataOpcItem(Item.Data).lvItem.Data:=TdataListItem.Create;
  TdataListItem(TdataOpcItem(Item.Data).lvItem.Data).opcItem:=Item;
  TdataOpcItem(Item.Data).lvItem.Caption:=Item.ValueStr;
  TdataOpcItem(Item.Data).lvItem.SubItems.add(Item.ItemID);
  TdataOpcItem(Item.Data).lvItem.SubItems.add('');
  TdataOpcItem(Item.Data).lvItem.SubItems.add('');
  TdataOpcItem(Item.Data).lvItem.SubItems.add('');
  TdataOpcItem(Item.Data).lvItem.SubItems.add('');
  TdataOpcItem(Item.Data).lvItem.SubItems.add('');
  TdataOpcItem(Item.Data).lvItem.SubItems.add('');
  TdataOpcItem(Item.Data).lvItem.SubItems.add('');
  TdataOpcItem(Item.Data).lvItem.SubItems.add('');

  {
      TdataOpcItem(Item.Data).id:=fieldbyname('id').asString;
      TdataOpcItem(Item.Data).write:=fieldbyname('write').AsBoolean;
      TdataOpcItem(Item.Data).bm:=getBookmark;//fieldbyname('itemId').AsInteger;
      TdataOpcItem(Item.Data).lvItem:=lvRead.Items.Add;
      TdataOpcItem(Item.Data).lvItem.Data:=TdataListItem.Create;
      TdataListItem(TdataOpcItem(Item.Data).lvItem.Data).opcItem:=Item;
      TdataOpcItem(Item.Data).lvItem.Caption:=Item.ValueStr;
      TdataOpcItem(Item.Data).lvItem.SubItems.add(Item.ItemID);
      TdataOpcItem(Item.Data).lvItem.SubItems.add('');
      TdataOpcItem(Item.Data).lvItem.SubItems.add('');
      TdataOpcItem(Item.Data).lvItem.SubItems.add('');
      TdataOpcItem(Item.Data).lvItem.SubItems.add('');
      TdataOpcItem(Item.Data).lvItem.SubItems.add('');
      TdataOpcItem(Item.Data).lvItem.SubItems.add('');
      TdataOpcItem(Item.Data).lvItem.SubItems.add('');
      TdataOpcItem(Item.Data).lvItem.SubItems.add('');
      if (TdataOpcItem(Item.Data).write) and (Item.ValueStr<>fieldbyname('value').AsString) then
        Item.WriteAsync(fieldbyname('value').AsString);
      //TdataOpcItem(Item.Data).fromPlc:=fieldbyname('fromPlc').AsBoolean;
    except
      Caption:=Caption+' NIET BESCHIKBAAR';
    end;
  end;begin


  with TempSet(self,cAim,'EXEC om.itemAdd @classId=52,@masterId='+dtSrv.fieldbyname('id').AsString+',@name='''+lbOpcItems.Items[lbOpcItems.ItemIndex]+'''',[]) do
  begin
    id:=fieldbyname('id').AsInteger;
    free;
  end;
  with dtItems do
  begin
    insert;
    fieldbyname('id').AsInteger:=id;
    fieldbyname('itemId').AsString:=lbOpcItems.Items[lbOpcItems.ItemIndex];
    fieldbyname('srvId').AsInteger:=dtSrv.fieldbyname('id').AsInteger;
    post;
    addRowclick(sender);
  end;

  }
end;

procedure TfmAIMOPC.Edit1Click(Sender: TObject);
begin
  lvRead.Selected.EditCaption;
end;

procedure TfmAIMOPC.OPCServerDatachange(Sender: TObject;
  ItemList: TdOPCItemList);
var
  i:integer;
  prevbm: TBookmark;
  s:string;
  PostVars : TStringList;
begin
  for i:= 0 to ItemList.Count-1 do with ItemList.Items[i] do
  begin
    begin
      //log('READ '+ItemId+' = '+ValueStr);
      TdataOpcItem(data).lvItem.SubItems[1]:=DateTimeToStr(now());
      TdataOpcItem(Data).lvItem.SubItems[2]:=QualityAsString;
      TdataOpcItem(data).lvItem.Caption:=ValueStr;
      TdataOpcItem(Data).lvItem.SubItems[5]:=ValueStr;

      callfunction(fmMain.WebBrowser,'setVar','{itemId:"'+ItemId+'",value:"'+stringreplace(ValueStr,'"','\"',[rfReplaceAll])+'"}');
      //callfunction(fmMain.WebBrowser,'setVar','');

      if (ValueStr<>TdataOpcItem(Data).lvItem.SubItems[3]) and (ValueStr<>TdataOpcItem(Data).lvItem.SubItems[6]) then
      begin
        TdataOpcItem(Data).lvItem.SubItems[6]:=ValueStr;
        {
        if cAim.Connected then
          cAim.Execute('EXEC opc.itemSet '+TdataOpcItem(data).id+','+QuotedStr(ValueStr))
        else
        begin
          s:=s+TdataOpcItem(data).id+','+QuotedStr(ValueStr)+';';
        end;
        }
      end;
    end;
  end;

  {
  if (s>'') then
  begin
    PostVars := TStringList.Create;
    PostVars.Values['exec'] := 'om.itemset';
    PostVars.Values['items'] := s;
    getresult('http://localhost/aim/connector/index.php',PostVars);
  end;
  }

end;

procedure TfmAIMOPC.OPCServerWriteComplete(Sender: TObject;
  ItemList: TdOPCItemList);
var
  i:integer;
  item: TDOpcItem;
begin
  for i:= 0 to ItemList.Count-1 do
  begin
    Item:=ItemList.Items[i];
    TdataOpcItem(Item.Data).lvItem.Caption:=Item.Value;
    TdataOpcItem(Item.Data).lvItem.SubItems[1]:=DateTimeToStr(now());
    TdataOpcItem(Item.Data).lvItem.SubItems[2]:=Item.QualityAsString;
    TdataOpcItem(Item.Data).lvItem.SubItems[4]:=Item.WantValue;
  end;
  //sdgsd
end;

procedure TfmAIMOPC.Button1Click(Sender: TObject);
begin
  writeItem('Bucket Brigade.Int1','2');
end;

end.

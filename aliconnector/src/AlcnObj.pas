unit AlcnObj;

interface


uses Grids, Windows, Classes, DB, AdoDB, DBGrids, Controls, ExtCtrls, ComCtrls, Graphics;

const clReadOnly = $00F7F7F7;

type
  { Dataset objects }
  TADataSet = class(TADODataSet)
  private
    FUniqueTable: string;
    FRequery: boolean;
    FCheckPost: boolean;
    FBeforeDelete: TDataSetNotifyEvent;
  protected
    property CheckPost : boolean read FCheckPost write FCheckPost default true;
    procedure SetUniqueTable(const Value: string);
    procedure SetRequery(const Value: boolean);
    procedure DoBeforeDelete; override;
    procedure DoAfterPost; override;
    procedure DoAfterScroll; override;
  public
    property BeforeDelete: TDataSetNotifyEvent read FBeforeDelete write FBeforeDelete;
    procedure Post; override;
    procedure PostDirect;
  published
    property UniqueTable: string read FUniqueTable write SetUniqueTable;
    property DoRequery: boolean read FRequery write SetRequery default False;
  end;

  { DataSource objects }
  TADataSource = class(TDataSource)
  end;

  { DataControl objects }
  TADBGrid = class(TDBGrid)
  private
  protected
    procedure CellClick(Column: TColumn); override;
    procedure KeyDown(var Key: Word; Shift: TShiftState); override;
    procedure KeyPress(var Key: Char); override;
    procedure DrawColumnCell(const Rect: TRect; DataCol: Integer;
      Column: TColumn; State: TGridDrawState); override;
    procedure DoEnter; override;
    procedure DoExit; override;
    procedure TitleClick(Column: TColumn); override;
    function DoMouseWheelDown(Shift: TShiftState; MousePos: TPoint): Boolean; override;
    function DoMouseWheelUp(Shift: TShiftState; MousePos: TPoint): Boolean; override;
    procedure MouseDown(Button: TMouseButton; Shift: TShiftState;
      X, Y: Integer); override;
  public
    GridName: String;
    constructor Create(AOwner: TComponent); override;
    destructor Destroy; override;
    procedure SetRowHeights(Index: Longint; Value: Integer);
    procedure LoadColumns(Agridname: string = '');
    procedure SaveColumns(Agridname: string = '');
  published
    property bevelkind;
  end;

  TdGrid = class(TADBGrid)
  public
    dSet: TADataSet;
    dSource: TADataSource;
    constructor Create(AOwner: TComponent); override;
  end;

  { Visual objects }
  TAImage = class(TImage)
  private
  protected
  public
    Pulse,Blink,BlinkVisible: Boolean;
    ObjectID: Integer;
    Value: String;
    IPadres: string;
    Filename: string;
    Down: boolean;
    Timer: TTimer;
    OldBitmap: TBitmap;
    constructor Create(AOwner: TComponent); override;
    procedure ImageTimer(Sender: TObject);
    procedure Toggle(ADown: boolean);
    procedure SetBlink(ABlink: boolean);
    procedure TogglePulse;
    procedure LoadFromFile(Afilename: string);
  published
  end;

  TAPanel = class(TPanel)
  private
    Corner: string;
    bgColor: integer;
  protected
    procedure Paint; override;
  public
    constructor Create(AOwner: TComponent); override;
    procedure RoundCorner(ACorner: string; ABgColor: TColor = clBlack);
  published
  end;

  { Visual objects }
  TDataTreeview = class(TTreeView)
  private
  protected
  public
  published
  end;

procedure GridLoad(c: TComponent);
procedure GridSave(c: TComponent);
var defaultConnection: TADOConnection;

implementation

uses
  DBConsts, SysUtils, ShellAPI, Find, Forms, DBCtrls,
  Dialogs, fColumnPicker, fTimer, Math;

const GridProcedure = 'SELECT * FROM grid WHERE gridname = ';

procedure GridLoad(c: TComponent);
var
  i: integer;
begin
  for i:=0 to c.ComponentCount-1 do
  begin
    if c.Components[i].ClassType=TADBGrid then
      TADBGrid(c.Components[i]).LoadColumns;
    if c.Components[i].ComponentCount>0 then
      GridLoad(c.Components[i]);
  end;
end;

procedure GridSave(c: TComponent);
var
  i: integer;
begin
  for i:=0 to c.ComponentCount-1 do
  begin
    if c.Components[i].ClassType=TADBGrid then
      TADBGrid(c.Components[i]).SaveColumns;
    if c.Components[i].ComponentCount>0 then
      GridSave(c.Components[i]);
  end;
end;

constructor TAPanel.Create(AOwner: TComponent);
begin
  inherited Create(AOwner);
  bevelouter:=bvNone;
  caption:='';
end;

procedure TAPanel.Paint;
var
  i: integer;
begin
  inherited;
  if pos('lb',corner)>0 then
  begin
    for i:=0 to 3 do canvas.Pixels[0,i]:=bgcolor;
    for i:=0 to 3 do canvas.Pixels[i,0]:=bgcolor;
    canvas.Pixels[1,1]:=color;
  end;
  if pos('rb',corner)>0 then
  begin
    for i:=0 to 3 do canvas.Pixels[width-1,i]:=bgcolor;
    for i:=0 to 3 do canvas.Pixels[width-1-i,0]:=bgcolor;
    canvas.Pixels[width-2,1]:=color;
  end;
  if pos('lo',corner)>0 then
  begin
    for i:=0 to 3 do canvas.Pixels[0,height-1-i]:=bgcolor;
    for i:=0 to 3 do canvas.Pixels[i,height-1]:=bgcolor;
    canvas.Pixels[1,height-2]:=color;
  end;
  if pos('ro',corner)>0 then
  begin
    for i:=0 to 3 do canvas.Pixels[width-1,height-1-i]:=bgcolor;
    for i:=0 to 3 do canvas.Pixels[width-1-i,height-1]:=bgcolor;
    canvas.Pixels[width-2,height-2]:=bgcolor;
  end;
end;

procedure TAPanel.RoundCorner(ACorner: string; ABgColor: TColor = clBlack);
begin
  corner:=ACorner;
  bgcolor:=ABgColor;
  repaint;
end;


function ActiveFieldName: string;
begin
  ActiveFieldname:='';
  with screen do
  begin
  with ActiveControl do if InheritsFrom(tDBEdit) or InheritsFrom(tDBListBox) then
    ActiveFieldname:=(ActiveControl as tDbEdit).DataField;
  with ActiveControl do if InheritsFrom(tDBGrid) then
    ActiveFieldname:=(ActiveControl as tDbGrid).SelectedField.FieldName;
  end;
end;

{ TADataSet}

procedure TADataSet.SetUniqueTable(const Value: string);
begin
  FUniqueTable := Value;
end;

procedure TADataSet.SetRequery(const Value: boolean);
begin
  FRequery := Value;
end;

procedure TADataSet.DoBeforeDelete;
begin
  if FUniqueTable > '' then
    Self.Properties['Unique Table'].Value := FUniqueTable;
  if Assigned(FBeforeDelete) then FBeforeDelete(Self);
end;

procedure TADataSet.DoAfterPost;
var
  bm: tBookMark;
begin
  inherited;
  if DoRequery then
  begin
    bm:=GetBookMark;
    self.Requery;
    if BookMarkValid(bm) then
      GotoBookmark(bm);
    FreeBookmark(bm);
  end;
end;

procedure TADataSet.DoAfterScroll;
var
  s: string;
begin
  inherited;
{
  with application do if (MainForm<>nil) then with mainform do if Showing then
    if (FindComponent('StatusBar')<>nil) then
      with FindComponent('StatusBar') as TStatusBar do if panels.Count>0 then Panels[0].Text:=IntToStr(RecNo);
}
  with application do if assigned(MainForm) then with mainform do if Showing then
  if assigned(FindComponent('StatusBar')) then
  with (FindComponent('StatusBar') as tStatusBar) do
  begin
    if state=dsInsert then
      s:='nieuw'
    else
    begin
      s:=IntToStr(RecNo)+' van '+IntToStr(RecordCount);
      if Filtered and (Filter>'') then
        s:=s+' '+Filter;
    end;
    if panels.Count>0 then
      panels[0].Text:=s
    else
      simpletext:=s;
  end;
end;

procedure TADataSet.Post;
var
  i: integer;
begin
{  if CheckPost then
  case state of
    dsEdit, dsInsert :
      begin
        i:=MessageDlg('Wilt u wijzigingen opslaan?',mtConfirmation, [mbYes, mbNo, mbCancel], 0);
        if i=mrYes then inherited;
        if i=mrNo then Cancel;
        if i=mrCancel then Abort;
      end;
  end
  else}
    inherited;
end;

procedure TADataSet.PostDirect;
begin
  CheckPost:= false;
  Post;
  CheckPost:= true;
end;

{ TADBDataSource }

{
procedure TADataSource.DataEvent;
var
  s: string;
begin
  inherited;
{
  with application do if (MainForm<>nil) then with mainform do if Showing then
    if (FindComponent('StatusBar')<>nil) then
      with FindComponent('StatusBar') as TStatusBar do if panels.Count>0 then Panels[0].Text:=IntToStr(RecNo);


  with application do if assigned(MainForm) then with mainform do if Showing then
  if assigned(FindComponent('StatusBar')) then
  with (FindComponent('StatusBar') as tStatusBar) do
  begin
    if state=dsInsert then
      s:='nieuw'
    else
    begin
      s:=IntToStr(RecNo)+' van '+IntToStr(RecordCount);
      if Filtered and (Filter>'') then
        s:=s+' '+Filter;
    end;
    if panels.Count>0 then
      panels[0].Text:=s
    else
      simpletext:=s;
  end;
end;

}

{ TADBGrid }

procedure TADBGrid.CellClick(Column: TColumn);
begin
  if not column.ReadOnly then
    EditorMode:=true;
  inherited CellClick(Column);
end;

procedure TADBGrid.KeyDown(var Key: Word; Shift: TShiftState);
var
  bm: tBookmark;
  iInd,iCol: integer;
begin
  inherited;

    case key of
    VK_ESCAPE : if assigned (DataSource.DataSet) and datasource.DataSet.Filtered then
      begin
        bm:=DataSource.DataSet.GetBookmark;
        DataSource.DataSet.Filter:='';
        DataSource.DataSet.Filtered:=false;
        DataSource.DataSet.GotoBookmark(bm);
        DataSource.DataSet.FreeBookmark(bm);
      end;
{
    VK_DELETE : if ssCtrl in Shift then
      begin
        if MessageDlg('Wilt u record '+Columns[selectedindex].Field.AsString+' verwijderen?',mtConfirmation,[mbYes,mbNo],0) = mrYes then
        begin
          Datasource.DataSet.Delete;
        end;
      end;
}
  end;
end;

procedure TADBGrid.KeyPress(var Key: Char);
begin
  inherited;
  if (trim(key)>'') and ( ReadOnly or SelectedField.ReadOnly or Columns[selectedindex].ReadOnly ) then
  begin
{
    with DataSource.DataSet do with SelectedField do
      if (SelectedField.FieldKind=fkData) and (fielddefs.Find(FieldName).DataType=ftBoolean) and (key = 'x') and CanModify then
      begin
        Edit;
        AsBoolean:=not AsBoolean;
     //   if AsBoolean then asstring:='0' else asstring:='1';
        Abort;
      end;
    end;
}
    if application.FindComponent('fmFind')=nil then
      tFmFind.Create(application).name:='fmFind';
    with application.FindComponent('fmFind') as tfmFind do
    begin
      Find(datasource.DataSet,SelectedField.FieldName,self,Key);
      show;
    end;
  end;
end;

constructor TADBGrid.Create(AOwner: TComponent);
begin
  inherited Create(AOwner);
//  Datasource:=TDatasource.Create(self);
//  DataSource.DataSet:=TADODataset.Create(self);
  BorderStyle:= bsNone;
  BevelOuter:= bvNone;
  BevelInner:= bvLowered;
//  BevelKind:= bkSoft;
  Options:=Options-[dgCancelOnExit];
//  GridLoad(self);
//  dmAlcn.
//  dmAlcn..pmGrid.Create(AOwner);
//  EdgeBorders:=[ebLeft,ebTop,ebRight,ebBottom];
//  ReadOnly:= False;
//  Options := [dgTitles, dgColumnResize, dgColLines, dgConfirmDelete, dgCancelOnExit];
//  Color:=clReadOnly;
end;

destructor TADBGrid.Destroy;
begin
  inherited Destroy;
end;

procedure TADBGrid.LoadColumns(Agridname: string = '');
var
  ss: tStringStream;
  i: integer;
begin
  if AGridName>'' then
    Gridname:=AGridName
  else
    Gridname:=extractfilename(application.ExeName)+'.'+Owner.ClassName+'.'+Name;
  if assigned(Datasource) then
  with tAdoDataset.Create(self) do
  begin
    if assigned(DefaultConnection) then
      Connection:=DefaultConnection
    else
      Connection:=TAdoDataset(self.DataSource.DataSet).Connection;
    commandtext:=GridProcedure+' '+quotedstr(gridname);
    open;
    if not fieldbyname('columns').IsNull then
    begin
      ss:=tStringStream.Create('');
      tBlobField(fieldbyname('columns')).SaveToStream(ss);
      ss.Position:=0;
      self.Columns.LoadFromStream(ss);
      ss.Free;
    end
    else
    begin
      Columns.Clear;
      Columns.RebuildColumns;
      for i:= 0 to Columns.Count-1 do
        Columns[i].Width:=Min(Columns[i].Width,300);
    end;
    with fieldbyname('width') do if not isnull then Width:=AsInteger;
    with fieldbyname('height') do if not isnull then height:=AsInteger;
    free;
  end;
end;

procedure TADBGrid.SaveColumns(Agridname: string = '');
var
  ss: tStringStream;
begin
  if AGridName>'' then
    Gridname:=AGridName;
  if GridName='' then
    Gridname:=extractfilename(application.ExeName)+'.'+Owner.ClassName+'.'+Name;
  ss:=tStringStream.Create('');
  if assigned(DataSource) and assigned(Datasource.dataset) then //and assigned (TAdoDataset(dbGrid.Datasource.dataset).connection) then
  begin
    if not assigned(Columns) then
      Columns.RebuildColumns;
    Columns.SaveToStream(ss);
    with tAdoDataset.Create(self) do
    begin
      if assigned(DefaultConnection) then
        Connection:=DefaultConnection
      else
        Connection:=TAdoDataset(self.DataSource.DataSet).Connection;
      commandtext:=GridProcedure+' '+quotedstr(gridname);
      open;
      if eof then
      begin
        insert;
        fieldbyname('gridname').AsString:=gridName;
      end
      else
        edit;
      ss.Position:=0;
      tBlobField(fieldbyname('columns')).LoadFromStream(ss);
      fieldbyname('width').AsInteger:=Width;
      fieldbyname('height').AsInteger:=Height;
      post;
      free;
    end;
  end;
  ss.Free;
end;

procedure TADBGrid.SetRowHeights(Index: Longint; Value: Integer);
begin
  RowHeights[Index]:=Value;
end;

procedure TADBGrid.DrawColumnCell(const Rect: TRect; DataCol: Integer;
      Column: TColumn; State: TGridDrawState);
const
  IsChecked : array[Boolean] of Integer =
      (DFCS_BUTTONCHECK, DFCS_BUTTONCHECK or DFCS_CHECKED);
var
  cb,ct: tColor;
  DrawState: Integer;
  DrawRect: TRect;
begin
  inherited;
  with column do if field<>nil then
  begin
    if column.Field.ReadOnly then
    begin
      Canvas.Brush.Color := clReadOnly;
      Canvas.Font.Color := clDefault;
    end;
    if (TDataLink(DataLink).ActiveRecord=Row-1) then
    begin
      if (focused) or (editormode) then //(gdFocused in State) then
      begin
        if (gdSelected in State) then
        begin
          Canvas.Brush.Color := clWhite;
          Canvas.Font.Color := clDefault;
        end
        else
        begin
          if ReadOnly then
            Canvas.Brush.Color := clInactiveCaption
          else
            Canvas.Brush.Color := clHighlight;
          Canvas.Font.Color := clHighlightText;
        end;
      end
      else
      begin
        Canvas.Brush.Color := clScrollBar;
        Canvas.Font.Color := clDefault;
      end;
    end;

    inherited DrawColumnCell(Rect, DataCol, Column, State);

    if column.Field.DataType<>ftBoolean then
      DefaultDrawColumnCell(Rect, DataCol, Column, State);
  end;
{
  if (gdSelected in State) then
  begin
    if Focused then
    begin
      if (readonly or column.ReadOnly) then
        cb:=clGray
      else
        cb:=clHighLight;
      ct:=clHighLightText;
    end
    else
    begin
      cb:=clInactiveBorder;
      ct:=clWindowText;
    end;
    Canvas.Brush.Color := cb;
    Canvas.Font.Color := ct;
    DefaultDrawColumnCell(Rect, DataCol, Column, State);
  end;

  if not (gdfocused in state) and (gdfixed in state) then
    Canvas.Brush.Color := clgreen;
  DefaultDrawColumnCell(Rect, DataCol, Column, State);

  if assigned(Datasource)
  and assigned (datasource.DataSet)
  and Datasource.DataSet.active and (Datasource.DataSet.FieldDefs.IndexOf(Column.Field.FieldName)>0) and (Datasource.DataSet.FieldDefs.Find(Column.Field.FieldName).DataType=ftBoolean) then
  begin
    TBooleanField(Column.Field).DisplayValues:='X;';
    DrawRect:=Rect;
    InflateRect(DrawRect,-1,-1);
    DrawState := ISChecked[Column.Field.AsBoolean];
    Canvas.FillRect(Rect);
    DrawFrameControl(Canvas.Handle, DrawRect, DFC_BUTTON, DrawState);
  end;
}
end;

procedure TADBGrid.DoEnter;
begin
  inherited;
  Options:=Options-[dgRowSelect];
  if not readonly then
    options:=options+[dgTabs,dgEditing];
end;

procedure TADBGrid.DoExit;
begin
  inherited;
//  with DataSource.DataSet do if active and Modified then post;
  Options:=Options-[dgTabs,dgEditing];//+[dgRowSelect];
end;

procedure TADBGrid.TitleClick(Column: TColumn);
begin
  inherited TitleClick(Column);
end;

function TADBGrid.DoMouseWheelDown(Shift: TShiftState; MousePos: TPoint): Boolean;
begin
  Datasource.DataSet.Next;
//  inherited DoMouseWheelDown(Shift, MousePos);
end;

function TADBGrid.DoMouseWheelUp(Shift: TShiftState; MousePos: TPoint): Boolean;
begin
  Datasource.DataSet.Prior;
//  inherited DoMouseWheelUp(Shift, MousePos);
end;

procedure TADBGrid.MouseDown(Button: TMouseButton;
  Shift: TShiftState; X, Y: Integer);
begin
  inherited;              
    if (Button=mbRight) and (y<16) then //and (X>top) and (X<top+20) then
      with TfmColumnPicker.Create(application) do
        ShowPicker(self);
end;

constructor TdGrid.Create(AOwner: TComponent);
begin
  inherited Create(AOwner);
  dSet:=TADataset.Create(self);
  dSet.Name:='dSet';
  dSource:=TADatasource.Create(self);
  dSource.Name:='dSource';
  dSource.DataSet:=dSet;
  Datasource:=dSource;
end;

constructor TAImage.Create(AOwner: TComponent);
begin
  inherited Create(AOwner);
{
  if not assigned (fmAlcnObj) then
    fmAlcnObj:=TfmAlcnObj.Create(AOwner);
}
  OldBitmap:= TBitmap.Create;
  Pulse:=False;
  Blink:=False;
  Timer:=tTimer.Create(self);
  with Timer do
  begin
    Enabled:=false;
    Interval:=100;
    OnTimer:=fTimer.fmAlcnObj.TBlink;
  end;
end;

procedure TAImage.ImageTimer(Sender: TObject);
begin
  Toggle(false);
  Timer.Enabled:=false;
end;

procedure TAImage.Toggle(ADown: boolean);
begin
  down:=ADown;
  if filename>'' then
  begin
    if Down then
      Picture.LoadFromFile(changefileext(filename,'_sel'+extractfileext(filename)))
    else
      Picture.LoadFromFile(filename);
  end;
end;

procedure TAImage.SetBlink(ABlink: boolean);
begin
//  visible:=true;
  Timer.Interval:=500;
  Blink:=ABlink;
  Timer.Enabled:=ABlink;
end;


procedure TAImage.TogglePulse;
begin
  Timer.enabled:=false;
  Timer.Interval:=100;
  Timer.enabled:=true;
  Pulse:=True;
  Toggle(true);
end;

procedure TAImage.LoadFromFile(AFileName: string);
begin
  filename:=AFileName;
  Picture.LoadFromFile(filename);
  width:=picture.Bitmap.Width;
  height:=picture.Bitmap.height;
end;




end.



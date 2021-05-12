unit AlcnActns;

interface

uses Grids, Windows, Classes, DB, AdoDB, DBGrids, ActnList;

type
  { DataSet actions }
  TADataAction = class(TAction)
  private
    FDataSource: TDataSource;
    procedure SeTDataSource(Value: TDataSource);
  protected
    function GeTDataSet(Target: TObject): TAdoDataSet; virtual;
    procedure Notification(AComponent: TComponent; Operation: TOperation); override;
  public
    function HandlesTarget(Target: TObject): Boolean; override;
    property DataSource: TDataSource read FDataSource write SeTDataSource;
  end;

  TDataAutoEdit = class(TADataAction)
  public
    constructor Create(AOwner: TComponent); override;
    procedure ExecuteTarget(Target: TObject); override;
    procedure UpdateTarget(Target: TObject); override;
  published
    property DataSource;
  end;

  TDataGridEdit = class(TADataAction)
  public
    procedure ExecuteTarget(Target: TObject); override;
    procedure UpdateTarget(Target: TObject); override;
  end;

  TDataGridToExcel = class(TADataAction)
  public
    procedure ExecuteTarget(Target: TObject); override;
    procedure UpdateTarget(Target: TObject); override;
  end;

  TDataSetRequery = class(TADataAction)
  public
    procedure ExecuteTarget(Target: TObject); override;
    procedure UpdateTarget(Target: TObject); override;
  published
    property DataSource;
  end;

  TDataSetDelete = class(TADataAction)
  public
    procedure ExecuteTarget(Target: TObject); override;
    procedure UpdateTarget(Target: TObject); override;
  published
    property DataSource;
  end;

  TDataSetCopy = class(TADataAction)
  public
    procedure ExecuteTarget(Target: TObject); override;
    procedure UpdateTarget(Target: TObject); override;
  published
    property DataSource;
  end;

  TDataSetSort = class(TADataAction)
  public
    procedure ExecuteTarget(Target: TObject); override;
    procedure UpdateTarget(Target: TObject); override;
  published
    property DataSource;
  end;

  TDataSetSortDesc = class(TADataAction)
  public
    procedure ExecuteTarget(Target: TObject); override;
    procedure UpdateTarget(Target: TObject); override;
  published
    property DataSource;
  end;

  TDataSetFilter = class(TADataAction)
  public
    procedure ExecuteTarget(Target: TObject); override;
    procedure UpdateTarget(Target: TObject); override;
  published
    property DataSource;
  end;

  TDataSetFilterSet = class(TADataAction)
  public
    procedure ExecuteTarget(Target: TObject); override;
    procedure UpdateTarget(Target: TObject); override;
  published
    property DataSource;
  end;

  TDataSetFind = class(TADataAction)
  public
    procedure ExecuteTarget(Target: TObject); override;
    procedure UpdateTarget(Target: TObject); override;
  published
    property DataSource;
  end;

{
  if MessageDlg('Wilt u record '+Columns[selectedindex].Field.AsString+' verwijderen?',mtConfirmation,[mbYes,mbNo],0) = mrYes then
  begin
    Datasource.DataSet.Delete;
  end;
}


procedure GridToExcel(dbGrid:TDBGrid;FileName:string);

implementation

uses
  AlcnObj, DBConsts, SysUtils, ShellAPI, Find, Forms, DBCtrls, Graphics, Controls,
  Math, Variants, ComObj, ComCtrls, Dialogs;

function ActiveFieldName: string;
begin
  ActiveFieldname:='';
  with screen do
  begin
  with ActiveControl do if InheritsFrom(TDBEdit) or InheritsFrom(TDBListBox) then
    ActiveFieldname:=(ActiveControl as TDBEdit).DataField;
  with ActiveControl do if InheritsFrom(TDBGrid) then
    ActiveFieldname:=(ActiveControl as TDBGrid).SelectedField.FieldName;
  end;
end;

{ TDataSetAction }

function TADataAction.GetDataSet(Target: TObject): TAdoDataSet;
begin
  { We could cast Target as a TADataSource since HandlesTarget "should" be
    called before ExecuteTarget and UpdateTarget, however, we're being safe. }
  Result := tAdoDataSet((Target as TDataSource).DataSet);
end;

function TADataAction.HandlesTarget(Target: TObject): Boolean;
begin
  { Only handle Target if we don't already have a DataSource assigned and the
    Target is a TDataSource with a non nil DataSet assigned. }
  Result := (DataSource <> nil) and (Target = DataSource) and
    (DataSource.DataSet <> nil) or (DataSource = nil) and
    (Target is TDataSource) and (TDataSource(Target).DataSet <> nil);
end;

procedure TADataAction.Notification(AComponent: TComponent;
  Operation: TOperation);
begin
  inherited Notification(AComponent, Operation);
  if (Operation = opRemove) and (AComponent = DataSource) then DataSource := nil;
end;

procedure TADataAction.SeTDataSource(Value: TDataSource);
begin
  if Value <> FDataSource then
  begin
    FDataSource := Value;
    if Value <> nil then Value.FreeNotification(Self);
  end;
end;

{ TADataAutoEdit }

constructor TDataAutoEdit.Create(AOwner: TComponent);
begin
  inherited Create(AOwner);
  AutoCheck:=True;
end;

procedure TDataAutoEdit.ExecuteTarget(Target: TObject);
begin
  with (Target as TDatasource) do
    AutoEdit := not AutoEdit;
end;

procedure TDataAutoEdit.UpdateTarget(Target: TObject);
begin
  with GetDataSet(Target) do
    Enabled := Active;
  with (Target as TDataSource) do
    AutoEdit := not Checked;
end;

{ TADBGridEdit }

procedure TDataGridEdit.ExecuteTarget(Target: TObject);
var iind,icol: integer;
begin
  if assigned(screen.ActiveControl) and screen.ActiveControl.InheritsFrom(TDBGrid) then
  begin
    with (screen.ActiveControl as tDBGrid) do
      begin
        if not (dgEditing in options) then
        begin
          EditorMode:=false;
          ReadOnly:=false;
          Color:=clWindow;
          Options:=Options+[dgEditing,dgTabs];
          with DataSource.DataSet do
            if modified then Post;
{
          iInd:=SelectedIndex;
          for iCol:= 0 to columns.Count-1 do
            if (dgEditing in Options) and not columns[iCol].ReadOnly then
              columns[iCol].color:=clWindow
            else
              columns[iCol].color:=clReadOnly;
          SelectedIndex:=iInd;
}
        end
        else
        begin
          EditorMode:=false;
//          Color:=clReadOnly;
          ReadOnly:=true;
//          for iCol:= 0 to columns.Count-1 do
//            columns[iCol].color:=Color;
          Options:=Options-[dgTabs,dgEditing,dgIndicator];
        end;
      end;
  end;
end;

procedure TDataGridEdit.UpdateTarget(Target: TObject);
begin
  with GetDataSet(Target) do if Active and assigned(application.MainForm.FindComponent('StatusBar')) then
  with (application.MainForm.FindComponent('StatusBar') as tStatusBar) do
  begin
    if state=dsInsert then
      SimpleText:='nieuw'
    else
    begin
      SimpleText:=IntToStr(RecNo)+' van '+IntToStr(RecordCount);
      if Filtered and (Filter>'') then
        SimpleText:=SimpleText+' '+Filter;
    end;
  end;
  Enabled := assigned(screen.ActiveControl) and screen.ActiveControl.InheritsFrom(TDBGrid);
  if enabled then with (screen.ActiveControl as tDBGrid) do
    Checked := not (dgEditing in options);
end;

{ TADBGridToExcel }

procedure TDataGridToExcel.ExecuteTarget(Target: TObject);
begin
  GridToExcel(screen.ActiveControl as tDBGrid,'');
end;

procedure TDataGridToExcel.UpdateTarget(Target: TObject);
begin
  Enabled := assigned(screen.ActiveControl) and screen.ActiveControl.InheritsFrom(TDBGrid);
end;

{ TADataFind }

procedure TDataSetFind.ExecuteTarget(Target: TObject);
var
  bm: tBookmark;
  Control: TWinControl;
begin
  with screen do
  begin
    Control:=activecontrol;
    if ActiveFieldName>'' then
    begin
      if application.FindComponent('fmFind')=nil then
        tFmFind.Create(application).name:='fmFind';
      with application.FindComponent('fmFind') as tfmFind do
      begin
        Find(GetDataSet(target),ActiveFieldName,control);
        show;
      end;
    end;
  end;
end;

procedure TDataSetFind.UpdateTarget(Target: TObject);
begin
  with screen do with GetDataSet(Target) do
    Enabled := Active and assigned(ActiveControl)
    and ( ActiveControl.InheritsFrom(TDBEdit) or ActiveControl.InheritsFrom(TDBListBox) or ActiveControl.InheritsFrom(TDBGrid) );
end;

{ TADataRequery }

procedure TDataSetRequery.ExecuteTarget(Target: TObject);
var
  bm: tBookmark;
begin
  with GetDataSet(Target) do
  begin
    bm:=GetBookmark;
    Requery;
    if BookmarkValid(bm) then
      GotoBookmark(bm);
    FreeBookmark(bm);
  end;
end;

procedure TDataSetRequery.UpdateTarget(Target: TObject);
begin
  with GetDataSet(Target) do
    Enabled := Active;
end;

{ TADataDelete }

procedure TDataSetDelete.ExecuteTarget(Target: TObject);
begin
  with GetDataSet(Target) do if MessageDlg('Wilt u record '+Fields[0].AsString+' verwijderen?',mtConfirmation,[mbYes,mbNo],0) = mrYes then
  begin
    Datasource.DataSet.Delete;
  end;
end;

procedure TDataSetDelete.UpdateTarget(Target: TObject);
begin
  with GetDataSet(Target) do
    Enabled := Active;
end;

{ TADataCopy }

procedure TDataSetCopy.ExecuteTarget(Target: TObject);
var i: integer;
    s: tStrings;
begin
  with GetDataSet(Target) do
  begin
    s:=tStringList.Create;
    for i:= 0 to fieldcount-1 do
      s.Add(FieldByname(Fields[i].FieldName).AsString);
    Insert;
    for i:= 0 to fieldcount-1 do
      if Fields[i].CanModify and (fields[i].ProviderFlags<>[]) and (fields[i].AutoGenerateValue<>arAutoInc) then Fields[i].AsString:=s[i];
    s.Destroy;
  end;
end;

procedure TDataSetCopy.UpdateTarget(Target: TObject);
begin
  with GetDataSet(Target) do
    Enabled := Active and (target as TDataSource).AutoEdit;
end;

{ TADataSort }

procedure TDataSetSort.ExecuteTarget(Target: TObject);
var
  bm: tBookmark;
begin
  with GetDataSet(Target) do
  begin
    bm:=GetBookmark;
    IndexFieldNames:='['+ActiveFieldName+']';
    if BookmarkValid(bm) then
      GotoBookmark(bm);
    FreeBookmark(bm);
  end;
end;

procedure TDataSetSort.UpdateTarget(Target: TObject);
begin
  with GetDataSet(Target) do
    Enabled := Active
    and assigned(screen.ActiveControl)
    and screen.ActiveControl.InheritsFrom(TDBgrid)
    and ((screen.ActiveControl as TDBGrid).SelectedField.FieldKind=fkData);
end;

{ TADataSorTADataesc }

procedure TDataSetSortDesc.ExecuteTarget(Target: TObject);
var
  bm: tBookmark;
begin
  with GetDataSet(Target) do
  begin
    bm:=GetBookmark;
    IndexFieldNames:='['+ActiveFieldName+'] DESC';
    if BookmarkValid(bm) then
      GotoBookmark(bm);
    FreeBookmark(bm);
  end;
end;

procedure TDataSetSortDesc.UpdateTarget(Target: TObject);
begin
  with GetDataSet(Target) do
    Enabled := Active
    and assigned(screen.ActiveControl)
    and screen.ActiveControl.InheritsFrom(TDBgrid)
    and ((screen.ActiveControl as TDBGrid).SelectedField.FieldKind=fkData);
end;

{ TADataFilter }

procedure TDataSetFilter.ExecuteTarget(Target: TObject);
var
  bm: tBookmark;
begin
  with GetDataSet(Target) do
  begin
    bm:=GetBookmark;
    Filter:='';
    Filtered:=False;
    if BookmarkValid(bm) then
      GotoBookmark(bm);
    FreeBookmark(bm);
  end;
end;

procedure TDataSetFilter.UpdateTarget(Target: TObject);
begin
  with GetDataSet(Target) do
  begin
    Enabled := Active and Filtered and (Filter>'');
    Checked := Active and Filtered and (Filter>'');
  end;
end;

{ TADataSetFilter }

procedure TDataSetFilterSet.ExecuteTarget(Target: TObject);
var
  bm: tBookmark;
begin
  with GetDataSet(Target) do
  begin
    bm:=GetBookmark;
    Filter:='['+FieldByName(ActiveFieldName).FieldName+']='+QuotedStr(FieldByName(ActiveFieldName).AsString);
    Filtered:=True;
    if BookmarkValid(bm) then
      GotoBookmark(bm);
    FreeBookmark(bm);
  end;
end;

procedure TDataSetFilterSet.UpdateTarget(Target: TObject);
begin
  with GetDataSet(Target) do
    Enabled := Active;
end;

procedure GridToExcel(dbGrid:TDBGrid;FileName:string);
const
  xlWBATWorksheet = -4167;
var
  bStart: tbookmark;
  ColWidth,Rows,Cols: Integer;
  XLApp, Sheet, Data: OLEVariant;
  i, j: Integer;
  ds: tAdoDataSet;
  s:string;

  function RefToCell(ARow, ACol: Integer): string;
  begin
    Result := Chr(Ord('A') + ACol - 1) + IntToStr(ARow);
  end;

  function RefCol(ACol: integer): string;
  begin
    result:=chr(ord('A')+Acol-1);
  end;

begin
  with DBGrid do
  begin
    // Prepare Data
    Cols:=min(Columns.Count,26);
    Rows:=DataSource.DataSet.RecordCount;
    Data := VarArrayCreate([1, Rows, 1, Cols], varVariant);
    with DataSource.DataSet do
      begin
      DisableControls;
      bstart:=getbookmark;
      first;
      i:=0;
      while not Eof do
        begin
        for j:= 0 to Cols-1 do
          begin
          Data[i+1,j+1]:=FieldByName(Columns[j].FieldName).Value;
          end;
        Inc(i);
        next;
        end;
      gotobookmark(bstart);
      freebookmark(bstart);
      EnableControls;
      end;
    // Create Excel-OLE Object
    XLApp := CreateOleObject('Excel.Application');
    try
      // Hide Excel
      XLApp.Visible := False;
      // Add new Workbook
      XLApp.Workbooks.Add(xlWBatWorkSheet);
      Sheet := XLApp.Workbooks[1].WorkSheets[1];
      Sheet.Name := Name;
      // Fill up the sheet
      for j:= 0 to Cols-1 do
        begin
        Sheet.Range[RefToCell(1,j+1)].Value:=Columns[j].Title.Caption;
  //      ColWidth:=round(Columns[j].Width/6);
  //      Sheet.Columns[RefCol(j+1)].ColumnWidth:=ColWidth;
        if Columns[j].Field.DataType=ftString then Sheet.Columns[RefCol(j+1)].NumberFormat:='@';
        if Columns[j].Field.DataType=ftWideString then Sheet.Columns[RefCol(j+1)].NumberFormat:='@';
        if Columns[j].Field.DataType=ftDateTime then Sheet.Columns[RefCol(j+1)].NumberFormat:='dd-mm-jjjj';
        if Columns[j].Field.DataType=ftTime then Sheet.Columns[RefCol(j+1)].NumberFormat:='hh:mm:ss';
        end;
      Sheet.rows['1'].Interior.ColorIndex:=15;
      Sheet.Range[RefToCell(2, 1), RefToCell(Rows+1,Cols)].Value := Data;
      Sheet.Range[RefToCell(2, 1), RefToCell(Rows+1,Cols)].VerticalAlignment := 1;
      Sheet.cells.entirecolumn.autofit;
      Sheet.cells.AutoFilter;
      // Save Excel Worksheet
      XLApp.Visible := True;
  {    try
        XLApp.Workbooks[1].SaveAs(AFileName);
        Result := True;
      except
        // Error ?
      end;
  }
    finally
      // Quit Excel
      if not VarIsEmpty(XLApp) then
        begin
        XLApp.DisplayAlerts := False;
  //      XLApp.Quit;
        XLAPP := Unassigned;
        Sheet := Unassigned;
        end;
      end;
    end;
end;

end.


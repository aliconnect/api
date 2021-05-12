unit fColumnPicker;

interface

uses
  Windows, Messages, SysUtils, Variants, Classes, Graphics, Controls, Forms,
  Dialogs, StdCtrls, Grids, DBGrids, AlcnObj, ExtCtrls, Menus, DB, ADODB;

type
  TfmColumnPicker = class(TForm)
    lbFields: TListBox;
    lbVisible: TListBox;
    Splitter1: TSplitter;
    pmKolom: TPopupMenu;
    Kolomenschalen1: TMenuItem;
    Kolomeninlezen1: TMenuItem;
    Kollomenopslaan1: TMenuItem;
    Kolommenreset1: TMenuItem;
    parent1: TMenuItem;
    Wijzigtitel1: TMenuItem;
    Panel1: TPanel;
    edTitle: TEdit;
    Label1: TLabel;
    Label2: TLabel;
    mPickList: TMemo;
    ADOConnection1: TADOConnection;
    procedure lbFieldsDblClick(Sender: TObject);
    procedure lbVisibleDblClick(Sender: TObject);
    procedure Kolomenschalen1Click(Sender: TObject);
    procedure Kollomenopslaan1Click(Sender: TObject);
    procedure Kolomeninlezen1Click(Sender: TObject);
    procedure Kolommenreset1Click(Sender: TObject);
    procedure lbVisibleDragOver(Sender, Source: TObject; X, Y: Integer;
      State: TDragState; var Accept: Boolean);
    procedure lbVisibleDragDrop(Sender, Source: TObject; X, Y: Integer);
    procedure FormClose(Sender: TObject; var Action: TCloseAction);
    procedure FormDeactivate(Sender: TObject);
    procedure lbVisibleClick(Sender: TObject);
    procedure edTitleChange(Sender: TObject);
    procedure mPickListChange(Sender: TObject);
  protected
      procedure CreateParams(var Params: TCreateParams); override;
  private
    { Private declarations }
    grid: TADBGrid;
  public
    { Public declarations }
//    DefaultConnection: TAdoConnection;
    procedure ShowPicker(dbGrid: tADBGrid);
  end;

procedure gridDefaultConnection(ConnString: string);

var
  fmColumnPicker: TfmColumnPicker;

implementation

{$R *.dfm}

uses math;

//const GridProcedure = '[bisApp].app.GridGet';
const GridProcedure = 'SELECT * FROM grid WHERE gridname = ';

procedure gridDefaultConnection(ConnString: string);
begin
  with TAdoConnection.Create(Application) do
  begin
    Name:='DefaultConnection';
    ConnectionString:=ConnString;
    Loginprompt:=False;
  end;
end;

procedure TfmColumnPicker.CreateParams(var Params: TCreateParams);
begin
  Inherited CreateParams(Params);
  with Params do
  begin
//    ExStyle := Params.ExStyle or WS_EX_APPWINDOW;
    WndParent := GetDesktopwindow;
  end;
end;

procedure TfmColumnPicker.ShowPicker(dbGrid: tADBGrid);
var i: integer;
  s1,s2: string;
begin
  Grid:=dbGrid;
  with lbFields do
    begin
    Clear;
    lbVisible.Clear;
    s1:=grid.DataSource.DataSet.FieldList.DelimitedText;
    i:=0;
    while i<Grid.Columns.Count do
      begin
      if pos(Grid.Columns.Items[i].FieldName,s1)=0 then Grid.Columns.Delete(i);
      inc(i);
      end;
    s2:='';
    for i:= 0 to Grid.Columns.Count-1 do
      s2:=s2+Grid.Columns.Items[i].FieldName+',';
    for i:= 0 to grid.DataSource.DataSet.FieldCount-1 do
      if pos(grid.DataSource.DataSet.Fields[i].FieldName,s2)=0 then
        items.Add(grid.DataSource.DataSet.Fields[i].FieldName);
    for i:= 0 to grid.Columns.Count-1 do
      lbVisible.items.Add(grid.Columns[i].FieldName);
    end;
  show;
end;

procedure TfmColumnPicker.lbFieldsDblClick(Sender: TObject);
begin
  with Grid.Columns.Add do
    FieldName:=lbFields.Items[lbFields.ItemIndex];
  lbVisible.Items.Add(lbFields.Items[lbFields.ItemIndex]);
  lbFields.DeleteSelected;
end;

procedure TfmColumnPicker.lbVisibleDblClick(Sender: TObject);
begin
  Grid.Columns[lbVisible.ItemIndex].Free;
  lbFields.Items.Add(lbVisible.Items[lbVisible.ItemIndex]);
  lbVisible.DeleteSelected;
end;

procedure TfmColumnPicker.Kolomenschalen1Click(Sender: TObject);
var
  i: integer;
begin
  with Grid do
  begin
    Columns.RebuildColumns;
    for i:= 0 to Columns.Count-1 do
      Columns[i].Width:=Max(Min(Columns[i].Field.Size,300),20);
//    width:=Width-50;
//    Height:=Height-50;
  end;
end;

procedure TfmColumnPicker.Kollomenopslaan1Click(Sender: TObject);
begin
  inherited;
  grid.SaveColumns;
end;

procedure TfmColumnPicker.Kolomeninlezen1Click(Sender: TObject);
begin
  grid.LoadColumns;
end;

procedure TfmColumnPicker.Kolommenreset1Click(Sender: TObject);
begin
  grid.Columns.Clear;
  grid.Columns.RebuildColumns;
end;

procedure TfmColumnPicker.lbVisibleDragOver(Sender, Source: TObject; X,
  Y: Integer; State: TDragState; var Accept: Boolean);
var
  t:tpoint;
  i:integer;
begin
  accept:=source=lbVisible;
  if accept then
  begin
    t.X:=x;
    t.Y:=y;
    i:=lbVisible.ItemIndex;
    lbVisible.ClearSelection;
//    lbVisible.ItemIndex:=i;
    lbVisible.Selected[lbVisible.ItemAtPos(t,true)]:=true;
    lbVisible.Selected[i]:=true;
//    lbVisible.Selected[lbVisible.ItemIndex]:=true;
  end;
end;

procedure TfmColumnPicker.lbVisibleDragDrop(Sender, Source: TObject; X,
  Y: Integer);
var t:tpoint;
begin
  t.X:=x;
  t.Y:=y;
  grid.Columns[lbVisible.ItemIndex].Index:=lbVisible.ItemAtPos(t,true);
  lbVisible.Items.Move(lbVisible.ItemIndex,lbVisible.ItemAtPos(t,true));
end;

procedure TfmColumnPicker.FormClose(Sender: TObject;
  var Action: TCloseAction);
begin
  action:=caFree;
end;

procedure TfmColumnPicker.FormDeactivate(Sender: TObject);
begin
  close;
end;

procedure TfmColumnPicker.lbVisibleClick(Sender: TObject);
begin
  edTitle.text:=grid.Columns[lbVisible.ItemIndex].Title.Caption;
  mPickList.Lines.text:=grid.Columns[lbVisible.ItemIndex].PickList.Text;
end;

procedure TfmColumnPicker.edTitleChange(Sender: TObject);
begin
  grid.Columns[lbVisible.ItemIndex].Title.Caption:=edTitle.text;
end;

procedure TfmColumnPicker.mPickListChange(Sender: TObject);
begin
  grid.Columns[lbVisible.ItemIndex].PickList.Text:=mPickList.Lines.text;
end;

end.

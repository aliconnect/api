unit Find;

interface

uses
  Windows, Messages, SysUtils, Variants, Classes, Graphics, Controls, Forms,
  Dialogs, ComCtrls, StdCtrls, DB, ADODB, Menus, ActnList, StdActns, Mask,
  DBCtrls, Grids, DBGrids;

type
  TfmFind = class(TForm)
    ADODataSet1: TADODataSet;
    pmFilter: TPopupMenu;
    Filter1: TMenuItem;
    Sluiten1: TMenuItem;
    N1: TMenuItem;
    Vorig1: TMenuItem;
    Volgend1: TMenuItem;
    ActionList1: TActionList;
    ActionFind: TAction;
    SearchFind1: TSearchFind;
    SearchFindNext1: TSearchFindNext;
    SearchReplace1: TSearchReplace;
    SearchFindFirst1: TSearchFindFirst;
    lFilter: TLabel;
    Label2: TLabel;
    cbFindField: TComboBox;
    Button2: TButton;
    Label1: TLabel;
    edFind: TEdit;
    cbVolledigVeld: TCheckBox;
    Button1: TButton;
    procedure FormDeactivate(Sender: TObject);
    procedure FilterClick(Sender: TObject);
    procedure tsReplaceShow(Sender: TObject);
    procedure tsFindShow(Sender: TObject);
    procedure AnnulerenClick(Sender: TObject);
    procedure Vorig1Click(Sender: TObject);
    procedure Volgend1Click(Sender: TObject);
    procedure FormClose(Sender: TObject; var Action: TCloseAction);
    procedure ActionFindExecute(Sender: TObject);
    procedure cbFindFieldDropDown(Sender: TObject);
  protected
    procedure CreateParams(var Params: TCreateParams); override;
  private
    { Private declarations }
    Control: tWinControl;
    ActiveDataset: tDataset;
    lOldFilter: boolean;
    sOldFilter: string;
  public
    { Public declarations }
    procedure Find(Dataset: tDataset; FieldName: string; Control: tWinControl); overload;
    procedure Find(Dataset: tDataset; FieldName: string; Control: tWinControl; Default: string); overload;
  end;

var
  fmFind: TfmFind;

implementation

{$R *.dfm}

uses uAlicon;

procedure tfmFind.CreateParams(var Params: TCreateParams);
begin
  Inherited CreateParams(Params);
  with Params do begin
    ExStyle := ExStyle or WS_EX_APPWINDOW; //or WS_EX_TOPMOST;
    WndParent := GetDesktopwindow;
//    WndParent := Application.mainform.Handle;// GetDesktopwindow;
  end;
end;

procedure tfmFind.Find(Dataset: tDataset; FieldName: string; Control: tWinControl; Default: string);
begin
Find(Dataset,Fieldname,Control);
edFind.Text:=Default;
edFind.SelStart:=999;
end;

procedure tfmFind.Find(Dataset: tDataset; FieldName: string; Control: tWinControl);
begin
self.ActiveDataset:=Dataset;
self.Control:=Control;
    lOldFilter:=Dataset.Filtered;
    sOldFilter:=Dataset.Filter;
Show;
cbFindField.Text:=FieldName;
//cbFindField.Text:='alles';
//cbFindField.ItemIndex:=1;
//edFind.Text:=Dataset.fieldByName(FieldName).AsString;
//edFind.Clear;
edFind.SelectAll;
edFind.SetFocus;
end;

procedure TfmFind.FormDeactivate(Sender: TObject);
begin
  Close;
end;

procedure TfmFind.FilterClick(Sender: TObject);
var
  s,prepost: string;
  i: integer;
  IsNumber: Boolean;
begin
  IsNumber:= true; //IsStrANumber(edFind.Text) ;    MKAN
  if cbVolledigVeld.Checked then
    prepost:=''
  else
    prepost:='%';
  with ActiveDataset do
  begin
    s:='';
    if cbFindField.Text='alles' then
    begin
      for i:=0 to fields.Count-1 do
      begin
        if (Fields[i].FieldKind=fkData) and ((Fields[i].ClassType=tWideStringField) or (Fields[i].ClassType=tStringField)) then
        begin
          if s>'' then
            s:=s+' or ';
          s:=s+'['+Fields[i].FieldName+'] like '+quotedstr(prepost+edFind.Text+prepost)+' ';
        end;
//        if (Fields[i].FieldKind=fkData) and ((Fields[i].ClassType=tIntegerField) or (Fields[i].ClassType=tLargeIntField) or (Fields[i].ClassType=tDateTimeField)) then
        if (Fields[i].FieldKind=fkData) and IsNumber and ((Fields[i].ClassType=tIntegerField) or (Fields[i].ClassType=tLargeIntField)) then
        begin
          if s>'' then
            s:=s+' or ';
          s:=s+'['+Fields[i].FieldName+'] = '+quotedstr(edFind.Text)+' ';
        end;
      end;
    end
    else if cbVolledigVeld.Checked or (fieldbyname(cbFindField.Text).ClassType=tIntegerField) or (fieldbyname(cbFindField.Text).ClassType=tLargeIntField) then
      s:= '['+cbFindField.Text+'] = '+quotedstr(edFind.Text)
    else
      s:= '['+cbFindField.Text+'] LIKE '+quotedstr('%'+edFind.Text+'%');
    filter:=s;
    filtered:=true;
  end;
end;

procedure TfmFind.tsReplaceShow(Sender: TObject);
begin
cbFindField.Text:=cbFindField.Text;
edFind.Text:=edFind.Text;
edFind.SetFocus;
end;

procedure TfmFind.tsFindShow(Sender: TObject);
begin
//cbFindField.Text:=cbFindField.Text;
edFind.Text:=edFind.Text;
edFind.SetFocus;
end;

procedure TfmFind.AnnulerenClick(Sender: TObject);
begin
Close;
end;

procedure TfmFind.Vorig1Click(Sender: TObject);
begin
self.ActiveDataset.Prior;
end;

procedure TfmFind.Volgend1Click(Sender: TObject);
begin
self.ActiveDataset.Next;
end;

procedure TfmFind.FormClose(Sender: TObject; var Action: TCloseAction);
begin
//self.Control.SetFocus;
with screen do if ActiveControl<>nil then ActiveControl.SetFocus;
end;

procedure TfmFind.ActionFindExecute(Sender: TObject);
begin
with screen do if ActiveControl<>nil then
  begin
  //if SearchFind1.Enabled then SearchFind1.Execute;
  if SearchReplace1.Enabled then SearchReplace1.Execute;
  if activecontrol.ClassType=tDBEdit then with activecontrol as tDBEdit do
    fmFind.Find(DataSource.DataSet,Datafield,activecontrol);
  if activecontrol.ClassType=tDBGrid then with activecontrol as tDBGrid do
    fmFind.Find(DataSource.DataSet,SelectedField.FieldName,activecontrol);
  end;
end;

procedure TfmFind.cbFindFieldDropDown(Sender: TObject);
var
  i: integer;
begin
//  cbFindField.Items:=ActiveDataset.FieldList;
  cbFindField.Items.Text:='alles';
  with ActiveDataset do
    for i:= 0 to fields.Count-1 do
      if (Fields[i].FieldKind=fkData) and ((Fields[i].ClassType=tWideStringField) or (Fields[i].ClassType=tStringField) or (Fields[i].ClassType=tIntegerField) or (Fields[i].ClassType=tLargeIntField) or (Fields[i].ClassType=tDateTimeField)) then
        cbFindField.Items.Add(Fields[i].FieldName);
end;

end.















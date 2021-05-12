unit fDialog;

interface

uses
  Windows, Messages, SysUtils, Variants, Classes, Graphics, Controls, Forms,
  Dialogs, StdCtrls, ExtCtrls, jpeg;

type
  TfmDialog = class(TForm)
    lMsg: TLabel;
    btOK: TButton;
    btCancel: TButton;
    Image1: TImage;
    procedure btOKClick(Sender: TObject);
    procedure FormCreate(Sender: TObject);
    procedure btCancelClick(Sender: TObject);
  protected
    procedure CreateParams(var Params: TCreateParams); override;
  private
    { Private declarations }
  public
    { Public declarations }
    Resultvalue: boolean;
  end;

var
  fmDialog: TfmDialog;

implementation

{$R *.dfm}

procedure TfmDialog.CreateParams(var Params: TCreateParams);
begin
  Inherited CreateParams(Params);
  with Params do begin
    ExStyle := ExStyle or WS_EX_APPWINDOW or WS_EX_TOPMOST;
    WndParent := GetDesktopwindow;
  end;
end;

procedure TfmDialog.btOKClick(Sender: TObject);
begin
  ResultValue:= True;
  Close;
end;

procedure TfmDialog.FormCreate(Sender: TObject);
begin
  ResultValue:= False;
end;

procedure TfmDialog.btCancelClick(Sender: TObject);
begin
  close;
end;

end.

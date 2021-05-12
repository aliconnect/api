unit fTimer;

interface

uses
  Windows, Messages, SysUtils, Variants, Classes, Graphics, Controls, Forms,
  Dialogs, ExtCtrls;

type
  TfmAlcnObj = class(TForm)
    Timer1: TTimer;
    procedure TBlink(Sender: TObject);
  private
    { Private declarations }
  public
    { Public declarations }
  end;

var
  fmAlcnObj: TfmAlcnObj;

implementation

{$R *.dfm}

uses AlcnObj;

procedure TfmAlcnObj.TBlink(Sender: TObject);
var
  r: TRect;
begin
  with TAImage(TTimer(sender).Owner) do
  begin
    if Pulse then
    begin
      Toggle(false);
      Pulse:=false;
    end
    else
    begin
{
      BlinkVisible:=Blink and not BlinkVisible;
      r:=Rect(0,0,Width,Height);
      with picture do if not BlinkVisible then
      begin
        if OldBitmap.Empty then
        begin
          OldbitMap.Width:=Bitmap.Width;
          OldbitMap.Height:=Bitmap.Height;
          OldBitmap.Canvas.CopyRect(r,Bitmap.Canvas,r);
        end;
        Bitmap.Canvas.FillRect(r);
      end
      else
      begin
        r:=Rect(0,0,OldBitmap.Width,OldBitmap.Height);

        Bitmap.Canvas.CopyRect(r,OldBitmap.Canvas,r);
//        picture.Bitmap.Empty;
      end;
}
      Visible:=Blink and not Visible;
    end;
    Timer.Enabled:=Blink;
  end;
end;

end.

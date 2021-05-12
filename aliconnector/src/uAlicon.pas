unit uAlicon;

interface

uses pngimage, DBCtrls, DBGrids, Classes, Windows, Controls, Graphics, Forms, ADODB, DB, mshtml;

const
  wdPropertyTitle = $00000001;
  wdPropertySubject = $00000002;
  wdPropertyAuthor = $00000003;
  wdPropertyKeywords = $00000004;
  wdPropertyComments = $00000005;
  wdPropertyTemplate = $00000006;
  wdPropertyLastAuthor = $00000007;
  wdPropertyRevision = $00000008;
  wdPropertyAppName = $00000009;
  wdPropertyTimeLastPrinted = $0000000A;
  wdPropertyTimeCreated = $0000000B;
  wdPropertyTimeLastSaved = $0000000C;
  wdPropertyVBATotalEdit = $0000000D;
  wdPropertyPages = $0000000E;
  wdPropertyWords = $0000000F;
  wdPropertyCharacters = $00000010;
  wdPropertySecurity = $00000011;
  wdPropertyCategory = $00000012;
  wdPropertyFormat = $00000013;
  wdPropertyManager = $00000014;
  wdPropertyCompany = $00000015;
  wdPropertyBytes = $00000016;
  wdPropertyLines = $00000017;
  wdPropertyParas = $00000018;
  wdPropertySlides = $00000019;
  wdPropertyNotes = $0000001A;
  wdPropertyHiddenSlides = $0000001B;
  wdPropertyMMClips = $0000001C;
  wdPropertyHyperlinkBase = $0000001D;
  wdPropertyCharsWSpaces = $0000001E;

  msoPropertyTypeNumber = 1;
  msoPropertyTypeBoolean = 2;
  msoPropertyTypeDate = 3;
  msoPropertyTypeString = 4;

  clLightRed = $7F7FFF;
  clLightYellow = $7FE9FF;
  clLightGreen = $8EFF7F;

//StateId
Offline	=	0	;
Aborting	=	1	;
Aborted	=	2	;
Clearing	=	3	;
Stopping	=	4	;
Stopped	=	5	;
Resetting	=	6	;
Idle	=	7	;
Starting	=	8	;
Execute	=	9	;
Completing	=	10	;
Completed	=	11	;
Holding	=	12	;
Held	=	13	;
UnHolding	=	14	;
Suspending	=	15	;
Suspended	=	16	;
UnSuspended	=	17	;

//CommandId
commandAbort	=	1	;
commandClear	=	2	;
commandStop	=	3	;
commandReset	=	4	;
commandStart	=	5	;
commandComplete	=	6	;
commandHold	=	7	;
commandUnHold	=	8	;
commandSuspend	=	9	;
commandUnSuspend	=	10	;




type
  THackDBGrid = class(TDBGrid);

procedure Run (sDoc:string; parameter: string = '');
procedure MakeDir(Dir: String);
function LoginUserName: string;
function GetComputerNetName: string;
function ShellLinkFilename(linkfile: String): string;
function FileInUse(FileName: string): Boolean;
function DSiFileTimeToDateTime(fileTime: TFileTime; var dateTime: TDateTime): boolean;
function DSiGetFileTimes(const fileName: string; var creationTime, lastAccessTime, lastModificationTime: TDateTime): boolean;
function GetFileDateTime(FileName: string): TDateTime;
function IsDir (FileName: string): Boolean;
Function GetUFID(Filename: String): String;
function GetFileID(Filename: String; var VolID, LowOrder, HighOrder: integer): Boolean;
function FileSize(fileName : wideString) : Int64;
function SetFileDate(Const FileName : String; Const FileDate : TDateTime): Boolean;
procedure SetFileCreationTime(const FileName: string; const DateTime: TDateTime);
function IsFileInUse(fName : string) : boolean;

function FileIsReadOnly (FileName: String): Boolean;
//function SetFileReadOnly (FileName: String; ReadOnly: Boolean = True): Boolean;
function FileSetHidden(FileName:string; hidden: boolean = True):integer;
function FileSetReadOnly(FileName:string; readonly: boolean = True):integer;

function CompCreateOld(FormClass: TFormClass; objname: string): TComponent;
function OleConnect(applname: string):OleVariant;
procedure WordOpen(filename: olevariant);
procedure WordOpenId(filename: olevariant;id: integer);
procedure FrontPageOpen(filename: olevariant);
procedure WordFileOpen(filename: olevariant;id: integer = -1);
//procedure FileOpen(filename: olevariant;id: integer = -1);

function IsStrANumber(const S: string): Boolean;
function instr(Substr,s: string): boolean;

procedure FieldSet(field: TField;Value: Variant);
function ProcedureCommand (StoredProcedure: string; Param: array of variant): string;
function ExecProc (c: TAdoConnection; StoredProcedure: string; Param: array of variant): string;
function TempSet (Sender: TComponent; c: TAdoConnection; StoredProcedure: string; Param: array of variant): TAdoDataset;
procedure DataUpdateField (c: TAdoConnection; TableName,Field,FieldID: string; ID, Value: variant);
procedure DataFieldSet (DataSet: TDataset; FieldName: string; Value: variant);
procedure DataRequery (dt: TDataset);
procedure DataSetPost (DataSet: TDataSet);
function VarToSqlStr(Value: Variant): string;

function GetSubString (sLine,sPrefix,sPostFix: string): string;
function GetMidString (sLine,sPrefix,sPostFix: string): string;

procedure PropertiesDialog(FileName: string);
function isImage(filename: string): boolean;
function isMovie(filename: string): boolean;

function InClasstype(Sender: TObject; ClassRef: TClass): boolean;
function CopyFileTo(const Source, Destination: string): Boolean;
function DataFieldFileSave (Field: TField; Filename: string):boolean;
function DataFieldFileLoad (Field: TField; Filename: string):boolean;
function DataFieldPngSave (dbImage: TDbImage;fieldname: string;trans:integer = 0): TPngObject;
function bmpRescale(Picture: TPicture;maxWidth,maxHeight:integer):TPicture;
function DataFieldBmpToPng (Picture: TPicture;field: TField;trans:integer = 0): TPngObject;
function DataFieldPngLoad (Field: TField): TPngObject;
function SafeFileToDataField(fileName: string;field: TField):boolean;
function SafeFileFromDataField(fileName: string;field: TField):boolean;

function StripHTMLTags(strHTML: string): string;
function CleanupHTML(strHTML: string): string;

function str_replace(subject: string;search,replace: array of string):string;
function ConvertJPG2BMP(FileName:String):TBitmap;

function DialogAkkoord(const Msg: string; Default: Boolean = False): Boolean;

function RightStr (Const Str: String; Size: Word): String;
function MidStr (Const Str: String; From, Size: Word): String;
function LeftStr (Const Str: String; Size: Word): String;

procedure RotateBitmap(Bmp: TBitmap; Rads: Single; AdjustSize: Boolean = True; BkColor: TColor = clNone);

function paramGet(par,default:string):string;
function GetIPFromHost (var HostName, IPaddr, WSAErr: string): Boolean;

function getParam (param:string;default:string = ''):string;

function WebFormNames(const document: IHTMLDocument2): TStringList;
function WebFormGet(const formNumber: integer; const document: IHTMLDocument2): IHTMLFormElement;
function WebFormFields(const document: IHTMLDocument2; const formName : string): TStringList;
function WebFormFieldValue(   const document: IHTMLDocument2;   const formNumber : integer;   const fieldName : string): string;
procedure WebFormFieldValueSet(const document: IHTMLDocument2; const formNumber: integer; const fieldName, newValue: string) ;
procedure WebFormSubmit(const document: IHTMLDocument2;const formNumber: integer) ;

function forceDeleteFile(pFileName:pAnsiChar):boolean;

type
  TOlContactItem = class
  public
    FirstName: WideString;
  end;

const
 NONE              = $00; //Blank number
 INET_USERAGENT    = 'Mozilla/4.0, Indy Library (Windows; en-US)';
 INET_REDIRECT_MAX = 10;


implementation

uses winSock,OleServer, WordXP, ShellApi, SysUtils, ComObj, ShlObj, ActiveX, Dialogs, Variants, StrUtils, fWait, fDialog;

function forceDeleteFile(pFileName:pAnsiChar):boolean;
begin
 windows.setFileAttributes(pFileName,NONE);//clear file attributes
 result:=windows.deleteFile(pFileName);    //then delete the file
end;




function getParam (param:string;default:string = ''):string;
var i:integer;
begin
  for i:= 0 to paramCount-1 do
  begin
    if paramStr(i)=param then
      result:=paramStr(i+1)
  end;
  if result='' then
    result:=default;
end;

function GetIPFromHost (var HostName, IPaddr, WSAErr: string): Boolean;
type
  Name = array[0..100] of Char; 
  PName = ^Name; 
var 
  HEnt: pHostEnt;
  HName: PName; 
  WSAData: TWSAData; 
  i: Integer; 
begin 
  Result := False;     
  if WSAStartup($0101, WSAData) <> 0 then begin 
    WSAErr := 'Winsock is not responding."'; 
    Exit; 
  end; 
  IPaddr := ''; 
  New(HName);
  if GetHostName(HName^, SizeOf(Name)) = 0 then
  begin 
    HostName := StrPas(HName^); 
    HEnt := GetHostByName(HName^); 
    for i := 0 to HEnt^.h_length - 1 do 
     IPaddr :=
      Concat(IPaddr,
      IntToStr(Ord(HEnt^.h_addr_list^[i])) + '.'); 
    SetLength(IPaddr, Length(IPaddr) - 1); 
    Result := True; 
  end
  else begin 
   case WSAGetLastError of
    WSANOTINITIALISED:WSAErr:='WSANotInitialised';
    WSAENETDOWN      :WSAErr:='WSAENetDown'; 
    WSAEINPROGRESS   :WSAErr:='WSAEInProgress'; 
   end; 
  end; 
  Dispose(HName); 
  WSACleanup; 
end;


function paramGet(par,default:string):string;
var i:integer;
begin
  i:=1;
  result:=default;
  while i<paramCount do
  begin
    if paramStr(i)=par then
    begin
      result:=paramStr(i+1);
      exit;
    end;
    inc(i);
  end;
end;




procedure RotateBitmap(Bmp: TBitmap; Rads: Single; AdjustSize: Boolean = True; BkColor: TColor = clNone);
var
  C: Single;
  S: Single;
  XForm: tagXFORM;
  Tmp: TBitmap;
begin
  C := Cos(Rads);
  S := Sin(Rads);
  XForm.eM11 := C;
  XForm.eM12 := S;
  XForm.eM21 := -S;
  XForm.eM22 := C;
  Tmp := TBitmap.Create;
  try
    Tmp.TransparentColor := Bmp.TransparentColor;
    Tmp.TransparentMode := Bmp.TransparentMode;
    Tmp.Transparent := Bmp.Transparent;
    Tmp.Canvas.Brush.Color := BkColor;
    if AdjustSize then
    begin
      Tmp.Width := Round(Bmp.Width * Abs(C) + Bmp.Height * Abs(S));
      Tmp.Height := Round(Bmp.Width * Abs(S) + Bmp.Height * Abs(C));
      XForm.eDx := (Tmp.Width - Bmp.Width * C + Bmp.Height * S) / 2;
      XForm.eDy := (Tmp.Height - Bmp.Width * S - Bmp.Height * C) / 2;
    end
    else
    begin
      Tmp.Width := Bmp.Width;
      Tmp.Height := Bmp.Height;
      XForm.eDx := (Bmp.Width - Bmp.Width * C + Bmp.Height * S) / 2;
      XForm.eDy := (Bmp.Height - Bmp.Width * S - Bmp.Height * C) / 2;
    end;
    SetGraphicsMode(Tmp.Canvas.Handle, GM_ADVANCED);
    SetWorldTransform(Tmp.Canvas.Handle, XForm);
    BitBlt(Tmp.Canvas.Handle, 0, 0, Tmp.Width, Tmp.Height, Bmp.Canvas.Handle,
      0, 0, SRCCOPY);
    Bmp.Assign(Tmp);
  finally
    Tmp.Free;
  end;
end;




function RightStr (Const Str: String; Size: Word): String;
 begin
   if Size > Length(Str) then Size := Length(Str) ;
   RightStr := Copy(Str, Length(Str)-Size+1, Size)
 end;

function MidStr (Const Str: String; From, Size: Word): String;
 begin
   MidStr := Copy(Str, From, Size)
 end;

function LeftStr (Const Str: String; Size: Word): String;
 begin
   LeftStr := Copy(Str, 1, Size)
 end;

function DialogAkkoord(const Msg: string; Default: Boolean = false): Boolean;
begin
  with TfmDialog.Create(application) do
  begin
    lMsg.Caption:=Msg;
{
    if default then
      btOK.Default:=True
    else
      btCancel.Default:=True;
}
    ShowModal;
    Result:=ResultValue;
    Free;
  end;
end;


function FileIsReadOnly (FileName: String): Boolean;
begin
Result := GetFileAttributes (PChar (FileName)) and FILE_ATTRIBUTE_READONLY > 0;
end;

function ConvertJPG2BMP(FileName:String):TBitmap;
var
  pic: TPicture;
begin
  pic := TPicture.Create;
  pic.LoadFromFile(FileName);
  result:=TBitmap.create;
  result.Assign(pic.Graphic);
  pic.Free;
end;

function str_replace(subject: string;search,replace: array of string):string;
var
  i: integer;
begin
  for i:=0 to length(replace)-1 do
    subject:=StringReplace(subject,search[i],replace[i],[rfReplaceAll]);
  result:=subject;
end;

function GetComputerNetName: string;
 var
   buffer: array[0..255] of char;
   size: dword;
 begin
   size := 256;
   if GetComputerName(buffer, size) then
     Result := buffer
   else
     Result := ''
 end;

function GetFileDateTime(FileName: string): TDateTime;
var intFileAge: LongInt;
begin
  intFileAge := FileAge(FileName);
  if intFileAge = -1 then
    Result := 0
  else
    Result := FileDateToDateTime(intFileAge)
end;

function GetSubString (sLine,sPrefix,sPostFix: string): string;
var
  istart,iend: integer;
  sResult: string;
begin
  if pos(sPrefix,sLine)=0 then sResult:=''
  else
  begin
    iStart:=pos(sPrefix,sLine);
    iEnd:=posEx(sPostfix,sLine,iStart)+1;
    sResult:=copy(sLine,iStart,iEnd-iStart);
  end;
  result:=sResult;
end;

function GetMidString (sLine,sPrefix,sPostFix: string): string;
var
  istart,iend: integer;
  sResult: string;
begin
  if pos(sPrefix,sLine)=0 then sResult:=''
  else
  begin
    iStart:=pos(sPrefix,sLine)+Length(sPrefix);
    iEnd:=posEx(sPostfix,sLine,iStart);
    sResult:=copy(sLine,iStart,iEnd-iStart);
  end;
  result:=sResult;
end;

function isImage(filename: string): boolean;
begin
  if pos(lowercase(extractfileext(filename)),'.png.gif.jpg.bmp')>0 then
    result:=true
  else
    result:=false;
end;

function isMovie(filename: string): boolean;
begin
  if pos(lowercase(extractfileext(filename)),'.mov.mts.mp4.3gp')>0 then
    result:=true
  else
    result:=false;
end;

procedure PropertiesDialog(FileName: string);
var
  sei: TShellExecuteInfo;
begin
  FillChar(sei, SizeOf(sei), 0);
  sei.cbSize := SizeOf(sei);
  sei.lpFile := PChar(FileName);
  sei.lpVerb := 'properties';
  sei.fMask  := SEE_MASK_INVOKEIDLIST;
  ShellExecuteEx(@sei);
end;

procedure FrontPageOpen(filename: olevariant);
var
  wrd: HWND;
  oleApplication,oledocument: olevariant;
begin
//  try
//    oleApplication := GetActiveOleObject('Frontpage.Application') ;
//  except
    oleApplication := CreateOleObject('Frontpage.Application');
//  end;
  oledocument:=oleapplication.ActiveWebWindow.PageWindows.Add(FileName);
//  WordAppl.Application.Visible:=true;
  oleApplication.ActivePageWindow.ViewMode := 1;
  oleApplication.ActivePageWindow.Activate;
//  oleApplication.ActiveWeb.Refresh;

   try
       wrd := FindWindow('FrontPageExplorerWindow40', nil);
       If wrd <> 0 then
         begin
         ShowWindow(wrd, SW_HIDE);
         ShowWindow(wrd, SW_MAXIMIZE);
         end;
   except on E: Exception do
       begin
       E.Free;
       end;
   end;

end;

procedure WordFileOpen(filename: olevariant;id: integer = -1);
begin
  if AnsiContainsText('.doc.mht',extractfileext(filename)) then
    WordOpen(filename);
end;

function CompCreateOld(FormClass: TFormClass;objname: string): TComponent;
var
  c: TComponent;
begin
  with application do
  begin
    c:=FindComponent(objname);
    if c=nil then
      c:=FormClass.Create(application);
    c.name:=objname;
  end;
  result:=c;
end;

procedure SetFileCreationTime(const FileName: string; const DateTime: TDateTime);
const
  FILE_WRITE_ATTRIBUTES = $0100;
var
  Handle: THandle;
  SystemTime: TSystemTime;
  FileTime: TFileTime;
begin
  Handle := CreateFile(PChar(FileName), FILE_WRITE_ATTRIBUTES,
    FILE_SHARE_READ or FILE_SHARE_WRITE, nil, OPEN_EXISTING,
    FILE_ATTRIBUTE_NORMAL, 0);
  if Handle=INVALID_HANDLE_VALUE then
    RaiseLastOSError;
  try
    DateTimeToSystemTime(DateTime, SystemTime);
    if not SystemTimeToFileTime(SystemTime, FileTime) then
      RaiseLastOSError;
    if not LocalFileTimeToFileTime(FileTime,FileTime) then
      RaiseLastOSError;
    if not SetFileTime(Handle, @FileTime, nil, nil) then
      RaiseLastOSError;
  finally
    CloseHandle(Handle);
  end;
end;

function SetFileDate(
    Const FileName : String;
    Const FileDate : TDateTime): Boolean;
 var
   FileHandle : THandle;
   FileSetDateResult : Integer;
 begin
   try
    try
     FileHandle := FileOpen (FileName,fmOpenWrite OR fmShareDenyNone) ;
     if FileHandle > 0 Then begin
      FileSetDateResult :=
        FileSetDate(
          FileHandle,
          DateTimeToFileDate(FileDate)) ;
        result := (FileSetDateResult = 0) ;
      end;
    except
     Result := False;
    end;
   finally
    FileClose (FileHandle) ;
   end;
end;

function DSiFileTimeToDateTime(fileTime: TFileTime; var dateTime: TDateTime): boolean;
var
  sysTime: TSystemTime;
begin
  Result := FileTimeToSystemTime(fileTime, sysTime);
  if Result then
    dateTime := SystemTimeToDateTime(sysTime);
end; { DSiFileTimeToDateTime }

function  DSiGetFileTimes(const fileName: string; var creationTime, lastAccessTime,
  lastModificationTime: TDateTime): boolean;
var
  fileHandle            : cardinal;
  fsCreationTime        : TFileTime;
  fsLastAccessTime      : TFileTime;
  fsLastModificationTime: TFileTime;
begin
  Result := false;
  fileHandle := CreateFile(PChar(fileName), GENERIC_READ, FILE_SHARE_READ, nil,
    OPEN_EXISTING, 0, 0);
  if fileHandle <> INVALID_HANDLE_VALUE then try
    Result :=
      GetFileTime(fileHandle, @fsCreationTime, @fsLastAccessTime, @fsLastModificationTime)
      and FileTimeToLocalFileTime(fsCreationTime,fsCreationTime)
      and FileTimeToLocalFileTime(fsLastAccessTime,fsLastAccessTime)
      and FileTimeToLocalFileTime(fsLastModificationTime,fsLastModificationTime)
      and DSiFileTimeToDateTime(fsCreationTime, creationTime)
      and DSiFileTimeToDateTime(fsLastAccessTime, lastAccessTime)
      and DSiFileTimeToDateTime(fsLastModificationTime, lastModificationTime)
      ;
  finally
    CloseHandle(fileHandle);
  end;
end; { DSiGetFileTimes }


function FileSize(fileName : wideString) : Int64;
 var
   sr : TSearchRec;
 begin
   if FindFirst(fileName, faAnyFile, sr ) = 0 then
      result := Int64(sr.FindData.nFileSizeHigh) shl Int64(32) + Int64(sr.FindData.nFileSizeLow)
   else
      result := -1;

   FindClose(sr) ;
 end;

procedure DataSetPost (DataSet: TDataSet);
begin
  with dataset do if (state = dsInsert) or (state = dsedit) then post;
end;


function DataFieldFileSave (Field: TField; Filename: string):boolean;
var
  blob: TStream;
  fs: TFileStream;
begin
    result:=false;
    if ForceDirectories(extractfilepath(filename)) then
    with field.DataSet do
    begin
      blob := CreateBlobStream(field, bmRead);
      try
        blob.Seek(0, soFromBeginning);
        with TFileStream.Create(Filename, fmCreate) do
          try
            CopyFrom(blob, blob.Size)
          finally
            Free;
            result:=true;
          end;
      finally
        blob.Free
      end;
    end;
end;

function DataFieldFileLoad (Field: TField; Filename: string):boolean;
var
  blob: TStream;
  fs: TFileStream;
  isEdited: boolean;
begin
    result:=false;
    with field.DataSet do
    begin
    isEdited:=(state=dsInsert) or (state=dsEdit);
      if not Isedited then
        edit;
      blob := CreateBlobStream(field, bmRead);
      try
        blob.Seek(0, soFromBeginning);
        fs := TFileStream.Create(filename, fmOpenRead or fmShareDenyWrite);
        try
          blob.CopyFrom(fs, fs.Size)
        finally
          fs.Free;
          result:=true;
        end;
      finally
        blob.Free
      end;
      if not Isedited then
        post;
      end;
end;

function DataFieldPngSave (dbImage: TDbImage;fieldname: string;trans:integer = 0): TPngObject;
var
  bmp,Bitmap: TBitmap;
  S : TMemoryStream;
  png:TPngObject;
  transColor: TColor;
  X,Y: integer;
begin
  S := TMemoryStream.Create;
  png := TPngObject.Create;
  png.Assign(dbImage.Picture.Graphic);

  if trans=1 then
  begin
    png.TransparentColor := png.Pixels[0,0];
    png.Transparent := true;
  end
  else if trans=2 then
  begin
    transColor:=png.Pixels[0,0];
    with png do
    begin
      for Y := 0 to Height - 1 do
      begin
        x:=0;
        while (Pixels[X,Y]=transColor) and (x<width) do
        begin
          Pixels[X,Y] :=  rgb(200,100,200);
          inc(x);
        end;
        x:=width-1;
        while (Pixels[X,Y]=transColor) and (x>0) do
        begin
          Pixels[X,Y] :=  rgb(200,100,200);
          dec(x);
        end;
      end;
    end;
    png.TransparentColor := rgb(200,100,200);
    png.Transparent := true;
  end;

  png.SaveToStream(s);
  s.Position:=0;

  with dbImage.Field.DataSet do
  begin
    Edit;
    dbImage.Field.Clear;
    TBlobField(FieldByName(fieldname)).LoadFromStream(s);
    Post;
  end;
  s.Free;
  result:=png;
end;

function bmpRescale(Picture: TPicture;maxWidth,maxHeight:integer):TPicture;
var
  scaleW,scaleH,scale: real;
  r: TRect;
begin
  result:=TPicture.Create;
  result.Assign(Picture.Graphic);
  if result.Bitmap.Width>maxWidth then
    scaleW:=result.Bitmap.Width/maxWidth
  else
    scaleW:=1;

  if result.Bitmap.Height>maxHeight then
    scaleH:=result.Bitmap.Height/maxHeight
  else
    scaleH:=1;

  if scaleW>scaleH then scale:=scaleW else scale:=scaleH;
  r:=rect(0,0,round(result.Bitmap.Width/scale),round(result.Bitmap.Height/scale));

  result.Bitmap.Canvas.StretchDraw(r,result.Graphic);
  result.Bitmap.Width:=r.Right;
  result.Bitmap.Height:=r.Bottom;

end;

function SafeFileToDataField(fileName: string;field: TField):boolean;
var
  S : TMemoryStream;
begin
  S := TMemoryStream.Create;
  S.LoadFromFile(filename);
  with field.DataSet do
  begin
    Edit;
    field.Clear;
    TBlobField(field).LoadFromStream(s);
    Post;
  end;
  s.Free;
end;

function SafeFileFromDataField(fileName: string;field: TField):boolean;
var
  S : TMemoryStream;
begin
//  application.MainForm.Cursor:=crSqlWait;
  S := TMemoryStream.Create;
  with field.DataSet do
  begin
    TBlobField(field).SaveToStream(s);
  end;
  s.Position:=0;
  S.SaveToFile(filename);
  s.Free;
//  application.MainForm.Cursor:=crDefault;
end;



function DataFieldBmpToPng (Picture: TPicture;field: TField;trans:integer = 0): TPngObject;
var
  S : TMemoryStream;
  png:TPngObject;
  transColor: TColor;
  X,Y: integer;
begin
  S := TMemoryStream.Create;

  png := TPngObject.Create;
  png.Assign( Picture.Graphic);

  if trans=1 then // all trans
  begin
    png.TransparentColor := png.Pixels[0,0];
    png.Transparent := true;
  end
  else if trans=2 then // outside trans
  begin
    transColor:=png.Pixels[0,0];
    with png do
    begin
      for Y := 0 to Height - 1 do
      begin
        x:=0;
        while (Pixels[X,Y]=transColor) and (x<width) do
        begin
          Pixels[X,Y] :=  rgb(200,100,200);
          inc(x);
        end;
        x:=width-1;
        while (Pixels[X,Y]=transColor) and (x>0) do
        begin
          Pixels[X,Y] :=  rgb(200,100,200);
          dec(x);
        end;
      end;
    end;
    png.TransparentColor := rgb(200,100,200);
    png.Transparent := true;
  end;

  png.SaveToStream(s);
  s.Position:=0;

  with field.DataSet do
  begin
    Edit;
    field.Clear;
    TBlobField(field).LoadFromStream(s);
    Post;
  end;
  s.Free;
  result:=png;
end;


function DataFieldPngLoad (Field: TField): TPngObject;
var
    S: TMemoryStream;
    png: TPngObject;
begin
  with field.DataSet do if not eof then if not field.IsNull then
  begin
    S := TMemoryStream.Create;
    TBlobField(Field).SaveToStream(s);
    s.Position:=0;
    png:=TPngObject.Create;
    png.LoadFromStream(s);
    result:=png;
    S.Free;
  end
  else
    result:=nil;
end;

procedure FieldSet(field: TField;Value: Variant);
begin
  field.DataSet.Edit;
  field.Value:=Value;
  field.DataSet.Post;
end;

function CopyFileTo(const Source, Destination: string): Boolean;
begin
  Result := CopyFile(PChar(Source), PChar(Destination), true);
end;


function instr(Substr,s: string): boolean;
begin
  result:=pos(Substr,s)>0;
end;


function InClasstype(Sender: TObject; ClassRef: TClass): boolean;
var
  SenderClass: TClass;
begin
  SenderClass:= Sender.ClassType;
  while (SenderClass <> nil) and (SenderClass <> ClassRef) do
  begin
    SenderClass := SenderClass.ClassParent;
  end;
  Result:=Assigned(SenderClass);
end;

Function GetUFID(Filename: String): String;
Var
  hFile      : tHandle;
  FileInfo   : BY_HANDLE_FILE_INFORMATION;
  HighOrder,
  LowOrder   : Int64;
Begin
  // Get Filehandle ... Warning: Works only under WinNT and higher !!!
  hFile := CreateFile(pChar(Filename), 0, FILE_SHARE_READ, nil, OPEN_EXISTING, FILE_FLAG_BACKUP_SEMANTICS, 0);
  If hFile <> INVALID_HANDLE_VALUE then
  Begin
    If (GetFileInformationByHandle(hFile, FileInfo) = True) then
    Begin
      // Specifies the high-order word of a unique identifier associated with the file/folder
      HighOrder := FileInfo.nFileIndexHigh;
      // Specifies the low-order word of a unique identifier associated with the
      // file. This identifier and the volume serial number uniquely identify a file/folder
      LowOrder  := FileInfo.nFileIndexLow;
      Result    := Format('[%s-%s-%s]', [IntToStr(FileInfo.dwVolumeSerialNumber), IntToStr(LowOrder), IntToStr(HighOrder)]);
    End
    Else Result := '';
  End
  else Result := '';
  CloseHandle(hFile); //Release Handle
End;

function GetFileID(Filename: String; var VolID, LowOrder, HighOrder: integer): Boolean;
Var
  hFile      : tHandle;
  FileInfo   : BY_HANDLE_FILE_INFORMATION;
Begin
  // Get Filehandle ... Warning: Works only under WinNT and higher !!!
  hFile := CreateFile(pChar(Filename), 0, FILE_SHARE_READ, nil, OPEN_EXISTING, FILE_FLAG_BACKUP_SEMANTICS, 0);
  If hFile <> INVALID_HANDLE_VALUE then
  Begin
    If (GetFileInformationByHandle(hFile, FileInfo) = True) then
    Begin
      // Specifies the high-order word of a unique identifier associated with the file/folder
      HighOrder := FileInfo.nFileIndexHigh;
      // Specifies the low-order word of a unique identifier associated with the
      // file. This identifier and the volume serial number uniquely identify a file/folder
      LowOrder  := FileInfo.nFileIndexLow;
      VolID:=FileInfo.dwVolumeSerialNumber;
      Result    := true;
    End
    Else Result := false;
  End
  else Result := false;
  CloseHandle(hFile); //Release Handle
End;


function IsDir (FileName: string): Boolean;
begin
  result:=((FileGetAttr(FileName) and faDirectory ) > 0)
end;

function IsStrANumber(const S: string): Boolean;
var
  P: PChar;
begin
  P      := PChar(S);
  Result := False;
  while P^ <> #0 do
  begin
    if not (P^ in ['0'..'9']) then Exit;
    Inc(P);
  end;
  Result := True;
end;



function OleConnect(applname: string):OleVariant;
var
  Appl: OleVariant;
begin
  try
    Appl := GetActiveOleObject(applname) ;
  except
    Appl:= CreateOleObject(applname);
  end;
  Result:=Appl;
end;

procedure WordOpen(filename: olevariant);
var
  wordappl,worddoc: olevariant;
begin
  try
    WordAppl := GetActiveOleObject('Word.Application') ;
  except
    WordAppl:= CreateOleObject('Word.Application');
  end;
  worddoc:=WordAppl.Documents.Open(FileName,EmptyParam,EmptyParam,EmptyParam,EmptyParam,EmptyParam,EmptyParam,EmptyParam,EmptyParam,EmptyParam,EmptyParam,EmptyParam,EmptyParam,EmptyParam,EmptyParam);
  //WordDoc.Fields.update;
  WordAppl.Application.Visible:=true;
  WordAppl.Activate;
  worddoc.Activate;
end;

procedure WordOpenId(filename: olevariant;id: integer);
var
  wordappl,worddoc: olevariant;
begin
  try
    WordAppl := GetActiveOleObject('Word.Application') ;
  except
    WordAppl:= CreateOleObject('Word.Application');
  end;
  worddoc:=WordAppl.Documents.Open(FileName,EmptyParam,EmptyParam,EmptyParam,EmptyParam,EmptyParam,EmptyParam,EmptyParam,EmptyParam,EmptyParam,EmptyParam,EmptyParam,EmptyParam,EmptyParam,EmptyParam);
  if id>=0 then
  begin
    try
      WordDoc.CustomDocumentProperties['DocID'].Value:=id;
    except
      WordDoc.CustomDocumentProperties.Add('DocID',False,msoPropertyTypeNumber,id,False);
    end;
  end;
  WordAppl.Application.Visible:=true;
  worddoc.Activate;
end;

{
procedure FileOpen(filename: olevariant;id: integer = -1);
begin
  if AnsiContainsText('.doc.mht',extractfileext(filename)) then
    WordOpen(filename);
end;
}

function SetFileReadOnly (FileName: String; ReadOnly: Boolean = True): Boolean;
begin
  if not FileExists (FileName) then
    Result := False
  else
  begin
    if ReadOnly then
      Result := SetFileAttributes (PChar (FileName), GetFileAttributes (PChar (FileName)) or FILE_ATTRIBUTE_READONLY)
    else
      Result := SetFileAttributes (PChar (FileName), FILE_ATTRIBUTE_NORMAL);
  end;
end;

function FileSetHidden(FileName:string; hidden: boolean = True):integer;
begin
if hidden then
  result:=FileSetAttr(FileName,FileGetAttr(FileName) or fahidden)
else
  result:=FileSetAttr(FileName,FileGetAttr(FileName) and not fahidden);
end;

function FileSetReadOnly(FileName:string; readonly: boolean = True):integer;
begin
if readonly then
  result:=FileSetAttr(FileName,FileGetAttr(FileName) or faReadOnly)
else
  result:=FileSetAttr(FileName,FileGetAttr(FileName) and not faReadOnly);
end;

function ShellLinkFilename(linkfile: String): string;
var
  AnObj: IUnknown;
  ShLink: IShellLink;
  PFile: IPersistFile;
  WFileName: WideString;
  Data: TWin32FindData;
  pwHotKey: word;
  Int: Integer;
  Buffer: array [0..255] of char;
  Arguments: string;
  Description: string;
  ProgramFile: string;
begin
  AnObj := CreateComObject(CLSID_ShellLink);
  ShLink := AnObj as IShellLink;
  PFile := AnObj as IPersistFile;
//Load
  WFileName := LinkFile;
  PFile.Load(PWChar(WFileName), STGM_READ);
//GetLink properties
//Parameters
  ShLink.GetArguments(Buffer,SizeOf(Buffer));
  Arguments := Buffer;
//Description
  ShLink.GetDescription(Buffer,SizeOf(Buffer));
  Description := Buffer;
//Shelllink
  ShLink.GetPath(Buffer, Sizeof(Buffer), Data, SLGP_UNCPRIORITY);
  ProgramFile := Buffer;
  result:=ProgramFile;
//Work Dir
  ShLink.GetWorkingDirectory(Buffer, Sizeof(Buffer));
//  WorkingDirectory := Buffer;
end;

procedure Run (sDoc:string; parameter: string = '');
begin
{
  if not FileExists(sDoc) then
    showmessage('Bestand niet beschikbaar, controleer uw rechten.'+#13+sDoc)
  else
}
    ShellExecute(0, nil, pchar(trim(sDoc)), pchar(trim(parameter)), nil, SW_NORMAL);
end;

function Loginusername: string;
const
  cnMaxUserNameLen = 254;
var
  sUserName     : string;
  dwUserNameLen : DWord;
  i: integer;
begin
  dwUserNameLen := cnMaxUserNameLen-1;
  SetLength( sUserName, cnMaxUserNameLen );
  GetUserName(
    PChar( sUserName ),
    dwUserNameLen );
  SetLength( sUserName, dwUserNameLen-1 );
  Result := sUserName;
  for i:= 0 to ParamCount-1 do
    if copy(ParamStr(i),1,6)='/u' then Result:=ParamStr(i+1)
end;

procedure MakeDir(Dir: String);
  function Last(What: String; Where: String): Integer;
  var
    Ind : Integer;
  begin
    Result := 0;
    for Ind := (Length(Where)-Length(What)+1) downto 1 do
        if Copy(Where, Ind, Length(What)) = What then begin
           Result := Ind;
           Break;
        end;
  end;

var
  PrevDir : String;
  Ind     : Integer;
begin
  if Copy(Dir,2,1) <> ':' then
     if Copy(Dir,3,1) <> '\' then
        if Copy(Dir,1,1) = '\' then
           Dir := 'C:'+Dir
        else
           Dir := 'C:\'+Dir
     else
        Dir := 'C:'+Dir;
  if not DirectoryExists(Dir) then begin
     Ind     := Last('\', Dir);         //  Position of the last '\'
     PrevDir := Copy(Dir, 1, Ind-1);    //  Previous directory
     if not DirectoryExists(PrevDir) then
        MakeDir(PrevDir);
     CreateDir(Dir);
  end;
end;


function IsFileInUse(fName : string) : boolean;
 var
   HFileRes : HFILE;
   Res: string[6];
 
   function CheckAttributes(FileNam: string; CheckAttr: string): Boolean;
   var
     fa: Integer;
   begin
     fa := GetFileAttributes(PChar(FileNam)) ;
     Res := '';
 
     if (fa and FILE_ATTRIBUTE_NORMAL) <> 0 then
     begin
       Result := False;
       Exit;
     end;
 
     if (fa and FILE_ATTRIBUTE_ARCHIVE) <> 0 then
 Res := Res + 'A';
     if (fa and FILE_ATTRIBUTE_COMPRESSED) <> 0 then
 Res := Res + 'C';
     if (fa and FILE_ATTRIBUTE_DIRECTORY) <> 0 then
 Res := Res + 'D';
     if (fa and FILE_ATTRIBUTE_HIDDEN) <> 0 then
 Res := Res + 'H';
     if (fa and FILE_ATTRIBUTE_READONLY) <> 0 then
 Res := Res + 'R';
     if (fa and FILE_ATTRIBUTE_SYSTEM) <> 0 then
 Res := Res + 'S';
 
     Result := AnsiContainsText(Res, CheckAttr) ;
   end; (*CheckAttributes*)
 
   procedure SetAttr(fName: string) ;
   var
     Attr: Integer;
   begin
     Attr := 0;
     if AnsiContainsText(Res, 'A') then
 Attr := Attr + FILE_ATTRIBUTE_ARCHIVE;
     if AnsiContainsText(Res, 'C') then
 Attr := Attr + FILE_ATTRIBUTE_COMPRESSED;
     if AnsiContainsText(Res, 'D') then
 Attr := Attr + FILE_ATTRIBUTE_DIRECTORY;
     if AnsiContainsText(Res, 'H') then
 Attr := Attr + FILE_ATTRIBUTE_HIDDEN;
     if AnsiContainsText(Res, 'S') then
 Attr := Attr + FILE_ATTRIBUTE_SYSTEM;
 
     SetFileAttributes(PChar(fName), Attr) ;
   end; (*SetAttr*)
 begin //IsFileInUse
   if CheckAttributes(fName, 'R') then
   begin
   Result := False;
 
   if not FileExists(fName) then exit;
 
     if MessageDlg(ExtractFileName(fName) + ' is a READ-ONLY file.' + #13#10 + 'Do you wish to clear the READ-ONLY flag???', mtConfirmation, [mbYes, mbNo], 0) = mrNo then
     begin
       Result := True;
       Exit;
     end;
   end;
 
   SetFileAttributes(PChar(fName), FILE_ATTRIBUTE_NORMAL) ;
 
   SetAttr(fName) ;
 
   HFileRes := CreateFile(pchar(fName), GENERIC_READ or GENERIC_WRITE, 0, nil, OPEN_EXISTING, FILE_ATTRIBUTE_NORMAL, 0) ;
   Result := (HFileRes = INVALID_HANDLE_VALUE) ;
   if not Result then CloseHandle(HFileRes) ;
 end; //IsFileInUse


function FileInUse(FileName: string): Boolean;
var hFileRes: HFILE;
begin
  Result := False;
  if not FileExists(FileName) then exit;
  hFileRes := CreateFile(PChar(FileName),
                                    GENERIC_READ or GENERIC_WRITE,
                                    0,
                                    nil,
                                    OPEN_EXISTING,
                                    FILE_ATTRIBUTE_NORMAL,
                                    0);
  Result := (hFileRes = INVALID_HANDLE_VALUE);
  if not Result then
    CloseHandle(hFileRes);
end;

function VarToSqlStr(Value: Variant): string;
var
  s: string;
begin
  if VarIsNull(value) then
    s:='NULL'
  else if VarIsNumeric(value) or varIsType(value,varBoolean) then
    s:=VarToStr(value)
  else
    s:=QuotedStr(VarToStr(value));
  Result:=s;
end;

function ProcedureCommand (StoredProcedure: string; Param: array of variant): string;
var
  i: integer;
  pars: string;
begin
  i:=0;
  while i<length(Param) do
  begin
    if i>0 then
//      StoredProcedure:=StoredProcedure+',';
      pars:=pars+',';
    if false then //Copy(VarToStr(Param[i]),1,1)='@' then
    begin
      pars:=pars+' '+VarToStr(Param[i])+'='+VarToSqlStr(Param[i+1]);
      inc(i);
    end
    else
    begin
      pars:=pars+' '+VarToSqlStr(Param[i]);
    end;
    inc(i);
  end;
if pos('CALL',StoredProcedure)>0 then
  result:= StoredProcedure+' ('+pars+')'
else
  result:= StoredProcedure+' '+pars;

end;

function ExecProc (c: TAdoConnection; StoredProcedure: string; Param: array of variant): string;
begin
  try
    c.Execute(ProcedureCommand(StoredProcedure,Param));
  except;
    ExecProc (c,StoredProcedure,Param);
  end;
end;

function TempSet (Sender: TComponent; c: TAdoConnection; StoredProcedure: string; Param: array of variant): TAdoDataset;
begin
  Result:=TAdoDataset.Create(Sender);
  with Result do
  begin
    connection:=c;
    commandtext:=ProcedureCommand(StoredProcedure,Param);
    try
      open;
    except;
    end;
  end;
end;

procedure DataUpdateField (c: TAdoConnection; TableName,Field,FieldID: string; ID, Value: variant);
begin
  c.Execute('update ['+TableName+'] set ['+field+'] = '+VarToSqlStr(Value)+' where ['+FieldID+'] = '+VarToSqlStr(ID));
end;

procedure DataFieldSet (DataSet: TDataset; FieldName: string; Value: variant);
begin
  with Dataset do
  begin
    edit;
    FieldByname(FieldName).Value:=Value;
    post;
  end;
end;


procedure DataRequery (dt: TDataset);
var
  bm: tBookmark;
begin
  with dt as TAdoDataset do
  begin
    bm:=GetBookmark;
    Requery();
    GotoBookmark(bm);
    FreeBookmark(bm);
  end;
end;

function StripHTMLTags(strHTML: string): string;
var
  P: PChar;
  P1: Char;
  InTag: integer;
  InPrg: boolean;
  i, intResultLength: Integer;
begin
//  strHTML := StringReplace(strHTML, #13+#10, ' ', [rfReplaceAll]);
  strHTML := StringReplace(strHTML, '<br>', #13+#10+'<br>', [rfReplaceAll,rfIgnorecase]);
  strHTML := StringReplace(strHTML, '<p', #13+#10+'<p', [rfReplaceAll]);
  strHTML := StringReplace(strHTML, '<h', #13+#10+'<h', [rfReplaceAll]);
  strHTML := StringReplace(strHTML, '<l', #13+#10+'<l', [rfReplaceAll]);
  strHTML := StringReplace(strHTML, '<?', #13+#10+'<?'+#13+#10, [rfReplaceAll]);
  strHTML := StringReplace(strHTML, '?>', #13+#10+'?>'+#13+#10, [rfReplaceAll]);
//  strHTML := StringReplace(strHTML, ';', ';'+#13+#10, [rfReplaceAll]);
  strHTML := StringReplace(strHTML, #9,  '',  [rfReplaceAll]);
  strHTML := StringReplace(strHTML, '  ',  ' ',  [rfReplaceAll]);
//  strHTML := StringReplace(strHTML, '</',  ' </',  [rfReplaceAll]);
  strHTML:=strHTML+'      ';

  P := PChar(strHTML);
  Result := '';

  InTag := 0;
  repeat
    case P^ of
      '<': Inc(InTag);
      '>': begin Dec(InTag); if P1='?' then InPrg:=false; end;
//      #13, #10: Result := Result + ' '; {do nothing}
      '?': if P1='<' then InPrg:=true;
      else
        if not InPrg and (InTag=0) then
        begin
          if (P^ in [#9, #32]) and ((P+1)^ in [#10, #13, #32, #9]) then
          else
            Result := Result + P^;
        end;
    end;
    P1:=P^;
    Inc(P);
  until (P^ = #0);

  {convert system characters}
  Result := StringReplace(Result, '&quot;', '"',  [rfReplaceAll]);
  Result := StringReplace(Result, '&apos;', '''', [rfReplaceAll]);
  Result := StringReplace(Result, '&gt;',   '>',  [rfReplaceAll]);
  Result := StringReplace(Result, '&lt;',   '<',  [rfReplaceAll]);
  Result := StringReplace(Result, '&amp;',  '&',  [rfReplaceAll]);
  Result := StringReplace(Result, '&nbsp;',  ' ',  [rfReplaceAll]);
  Result := Trim(Result);
//  Result := StringReplace(Result, '.',  '.'+#13+#10,  [rfReplaceAll]);
  {here you may add another symbols from RFC if you need}
end;

function CleanupHTML(strHTML: string): string;
const
  cr = #13+#10;
var
  P: PChar;
  P1: Char;
  tag: string;
  InTag,EndTag,FinishTag,InCode: boolean;
  i, intResultLength, TagNr: Integer;
begin
  P := PChar(strHTML);
  Result := '';
  TagNr:=0;
  InCode:=false;
  tag:='';

  repeat
    case P^ of
      '<':
        begin
          if (P+1)^='?' then
            begin InCode:=True; Result:=Result + cr; end
          else
            begin InTag:=true; Endtag:=false; end;
        end;
      '>':
        begin
          if (P-1)^='?' then
            InCode:=True
          else
            EndTag:=true;
        end;
    end;

    if InCode then
    begin
      Result := result + p^
    end
    else if InTag then
    begin
      if (P^='<') and ( ((P+1)^='p') or ((P+1)^='h') or ((P+1)^='t') or ((P+1)^='l') ) then
      begin
        Result:=Result + cr + P^;
        InTag:=false;
      end
      else
      begin
        tag:=tag+P^;
        if EndTag then
        begin
          if
            (pos('<div',tag)>0) or (pos('</div',tag)>0)
            or (pos('<span',tag)>0) or (pos('</span',tag)>0)
            or (pos('<sub',tag)>0) or (pos('</sub',tag)>0)
          then
            tag:='';

          Result := result + tag;
          tag:='';
          Endtag:=false;
          InTag:=false;
        end;
      end;
    end
    else
    begin
      case P^ of
        #13: Result := Result + ' ';
        #10,#9: Result := Result + '';
        else
          Result := Result + p^;
      end;
    end;
    if (p^='>') and ((P-1)^='?') then
      InCode:=false;
    Inc(P);
  until (P^ = #0);
  Result := StringReplace(Result, '<form', cr+'<form',  [rfReplaceAll]);
  Result := StringReplace(Result, '<input', cr+'<input',  [rfReplaceAll]);
end;

function WebFormNames(const document: IHTMLDocument2): TStringList; var   forms : IHTMLElementCollection;   form : IHTMLFormElement;   idx : integer; begin   forms := document.Forms as IHTMLElementCollection;   result := TStringList.Create;   for idx := 0 to -1 + forms.length do   begin     form := forms.item(idx,0) as IHTMLFormElement;     result.Add(form.name) ;   end; end;
function WebFormGet(const formNumber: integer; const document: IHTMLDocument2): IHTMLFormElement;
var   forms : IHTMLElementCollection;
begin
forms := document.Forms as IHTMLElementCollection;
result := forms.Item(formNumber,'') as IHTMLFormElement
end;
function WebFormFields(const document: IHTMLDocument2; const formName : string): TStringList; var   form : IHTMLFormElement;   field : IHTMLElement;   fName : string;   idx : integer; begin   form := WebFormGet(0, document) ;    result := TStringList.Create;   for idx := 0 to -1 + form.length do   begin     field := form.item(idx, '') as IHTMLElement;      if field = nil then Continue;     fName := field.id;      if field.tagName = 'INPUT' then fName := (field as IHTMLInputElement).name;     if field.tagName = 'SELECT' then fName := (field as IHTMLSelectElement).name;     if field.tagName = 'TEXTAREA' then fName := (field as IHTMLTextAreaElement).name;      result.Add(fName) ;   end; end;
function WebFormFieldValue(   const document: IHTMLDocument2;   const formNumber : integer;   const fieldName : string): string; var   form : IHTMLFormElement;   field: IHTMLElement; begin   form := WebFormGet(formNumber, Document) ;   field := form.Item(fieldName,'') as IHTMLElement;   if field = nil then Exit;    if field.tagName = 'INPUT' then result := (field as IHTMLInputElement).value;   if field.tagName = 'SELECT' then result := (field as IHTMLSelectElement).value;   if field.tagName = 'TEXTAREA' then result := (field as IHTMLTextAreaElement).value; end;

procedure WebFormFieldValueSet(const document: IHTMLDocument2; const formNumber: integer; const fieldName, newValue: string) ;
var   form : IHTMLFormElement;   field: IHTMLElement;
begin
form := WebFormGet(formNumber, Document) ;
field := form.Item(fieldName,'') as IHTMLElement;
if field = nil then Exit;
if field.tagName = 'INPUT' then (field as IHTMLInputElement).value := newValue;
if field.tagName = 'SELECT' then (field as IHTMLSelectElement).value := newValue;
if field.tagName = 'TEXTAREA' then (field as IHTMLTextAreaElement).value := newValue;
end;

procedure WebFormSubmit(const document: IHTMLDocument2;const formNumber: integer) ; var   form : IHTMLFormElement;   field: IHTMLElement; begin   form := WebFormGet(formNumber, Document) ;    form.submit; end;

end.

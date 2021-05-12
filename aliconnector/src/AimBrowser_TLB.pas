unit AimBrowser_TLB;

// ************************************************************************ //
// WARNING                                                                    
// -------                                                                    
// The types declared in this file were generated from data read from a       
// Type Library. If this type library is explicitly or indirectly (via        
// another type library referring to this type library) re-imported, or the   
// 'Refresh' command of the Type Library Editor activated while editing the   
// Type Library, the contents of this file will be regenerated and all        
// manual modifications will be lost.                                         
// ************************************************************************ //

// PASTLWTR : 1.2
// File generated on 23-3-2021 18:28:14 from Type Library described below.

// ************************************************************************  //
// Type Lib: C:\aliconnect\aliconnector\aliconnector.tlb (1)
// LIBID: {517F7078-5E73-4E5A-B8A2-8F0FF14EF21B}
// LCID: 0
// Helpfile: 
// HelpString: AIM Browser
// DepndLst: 
//   (1) v2.0 stdole, (C:\Windows\SysWOW64\stdole2.tlb)
// ************************************************************************ //
{$TYPEDADDRESS OFF} // Unit must be compiled without type-checked pointers. 
{$WARN SYMBOL_PLATFORM OFF}
{$WRITEABLECONST ON}
{$VARPROPSETTER ON}
interface

uses Windows, ActiveX, Classes, Graphics, StdVCL, Variants;
  

// *********************************************************************//
// GUIDS declared in the TypeLibrary. Following prefixes are used:        
//   Type Libraries     : LIBID_xxxx                                      
//   CoClasses          : CLASS_xxxx                                      
//   DISPInterfaces     : DIID_xxxx                                       
//   Non-DISP interfaces: IID_xxxx                                        
// *********************************************************************//
const
  // TypeLibrary Major and minor versions
  AimBrowserMajorVersion = 1;
  AimBrowserMinorVersion = 0;

  LIBID_AimBrowser: TGUID = '{517F7078-5E73-4E5A-B8A2-8F0FF14EF21B}';

  IID_IMyExternal: TGUID = '{4F995D09-CF9E-4042-993E-C71A8AED661E}';
type

// *********************************************************************//
// Forward declaration of types defined in TypeLibrary                    
// *********************************************************************//
  IMyExternal = interface;
  IMyExternalDisp = dispinterface;

// *********************************************************************//
// Interface: IMyExternal
// Flags:     (4416) Dual OleAutomation Dispatchable
// GUID:      {4F995D09-CF9E-4042-993E-C71A8AED661E}
// *********************************************************************//
  IMyExternal = interface(IDispatch)
    ['{4F995D09-CF9E-4042-993E-C71A8AED661E}']
    function GetPrecis(const ProgID: WideString): WideString; safecall;
    procedure ShowURL(const ProgID: WideString); safecall;
    procedure HideURL; safecall;
    procedure EditFile(const url: WideString); safecall;
    function SendToApp(const appname: WideString; const line: WideString; const par: WideString): WideString; safecall;
    procedure dataSet(const name: WideString; const data: WideString); safecall;
    procedure sendVar(const name: WideString; const value: WideString); safecall;
    procedure setVar(const name: WideString; const value: WideString); safecall;
    procedure print; safecall;
    procedure printurl(const url: WideString); safecall;
    procedure mailimport(const sessionId: WideString; const hostId: WideString; 
                         const userId: WideString); safecall;
    procedure filedownload(const url: WideString); safecall;
    procedure contactimport(const sessionId: WideString; const hostId: WideString; 
                            const userId: WideString); safecall;
    procedure hide; safecall;
    procedure show; safecall;
    procedure writefile(const filename: WideString; const content: WideString); safecall;
    function readfile(const filename: WideString; rename: SYSINT): WideString; safecall;
    procedure writelnfile(const filename: WideString; const content: WideString); safecall;
    procedure opcSetVar(const itemId: WideString); safecall;
    procedure opcConnect(const servername: WideString); safecall;
    procedure opcDisconnect; safecall;
    procedure opcSet(const itemId: WideString; const value: WideString); safecall;
    procedure getHtml; safecall;
    function readfilearray(const filename: WideString): WideString; safecall;
  end;

// *********************************************************************//
// DispIntf:  IMyExternalDisp
// Flags:     (4416) Dual OleAutomation Dispatchable
// GUID:      {4F995D09-CF9E-4042-993E-C71A8AED661E}
// *********************************************************************//
  IMyExternalDisp = dispinterface
    ['{4F995D09-CF9E-4042-993E-C71A8AED661E}']
    function GetPrecis(const ProgID: WideString): WideString; dispid 201;
    procedure ShowURL(const ProgID: WideString); dispid 202;
    procedure HideURL; dispid 203;
    procedure EditFile(const url: WideString); dispid 204;
    function SendToApp(const appname: WideString; const line: WideString; const par: WideString): WideString; dispid 205;
    procedure dataSet(const name: WideString; const data: WideString); dispid 206;
    procedure sendVar(const name: WideString; const value: WideString); dispid 207;
    procedure setVar(const name: WideString; const value: WideString); dispid 208;
    procedure print; dispid 209;
    procedure printurl(const url: WideString); dispid 210;
    procedure mailimport(const sessionId: WideString; const hostId: WideString; 
                         const userId: WideString); dispid 211;
    procedure filedownload(const url: WideString); dispid 212;
    procedure contactimport(const sessionId: WideString; const hostId: WideString; 
                            const userId: WideString); dispid 213;
    procedure hide; dispid 214;
    procedure show; dispid 215;
    procedure writefile(const filename: WideString; const content: WideString); dispid 216;
    function readfile(const filename: WideString; rename: SYSINT): WideString; dispid 217;
    procedure writelnfile(const filename: WideString; const content: WideString); dispid 218;
    procedure opcSetVar(const itemId: WideString); dispid 219;
    procedure opcConnect(const servername: WideString); dispid 220;
    procedure opcDisconnect; dispid 221;
    procedure opcSet(const itemId: WideString; const value: WideString); dispid 222;
    procedure getHtml; dispid 223;
    function readfilearray(const filename: WideString): WideString; dispid 224;
  end;

implementation

uses ComObj;

end.

object fmAIMOPC: TfmAIMOPC
  Left = 506
  Top = 391
  Width = 997
  Height = 572
  BorderIcons = [biSystemMenu]
  Caption = 'AIM Communication Server'
  Color = clBtnFace
  Font.Charset = DEFAULT_CHARSET
  Font.Color = clWindowText
  Font.Height = -11
  Font.Name = 'MS Sans Serif'
  Font.Style = []
  OldCreateOrder = False
  Visible = True
  OnCreate = FormCreate
  PixelsPerInch = 96
  TextHeight = 13
  object StatusBar: TStatusBar
    Left = 0
    Top = 514
    Width = 981
    Height = 19
    Panels = <>
  end
  object PageControl1: TPageControl
    Left = 0
    Top = 0
    Width = 981
    Height = 514
    ActivePage = TabSheet1
    Align = alClient
    Style = tsFlatButtons
    TabOrder = 1
    object tsWeb: TTabSheet
      Caption = 'Web service'
      ImageIndex = 2
      object WebBrowser1: TWebBrowser
        Left = 0
        Top = 0
        Width = 1132
        Height = 483
        Align = alClient
        TabOrder = 0
        ControlData = {
          4C000000FF740000EB3100000100000001020000000000000000000000000000
          000000004C000000000000000000000001000000E0D057007335CF11AE690800
          2B2E12620A000000000000004C0000000114020000000000C000000000000046
          8000000000000000000000000000000000000000000000000000000000000000
          00000000000000000100000000000000000000000000000000000000}
      end
      object Button2: TButton
        Left = 63
        Top = 28
        Width = 75
        Height = 25
        Caption = 'Button2'
        TabOrder = 1
        OnClick = Button2Click
      end
    end
    object TabSheet2: TTabSheet
      Caption = 'IP'
      ImageIndex = 1
      ParentShowHint = False
      ShowHint = True
      object PageControl2: TPageControl
        Left = 0
        Top = 79
        Width = 973
        Height = 404
        ActivePage = TabSheet3
        Align = alClient
        TabOrder = 0
        object TabSheet5: TTabSheet
          Caption = 'Log'
          object mLog: TMemo
            Left = 0
            Top = 0
            Width = 936
            Height = 358
            Align = alClient
            Font.Charset = DEFAULT_CHARSET
            Font.Color = clWindowText
            Font.Height = -11
            Font.Name = 'Monospac821 BT'
            Font.Style = []
            ParentFont = False
            ScrollBars = ssBoth
            TabOrder = 0
          end
        end
        object TabSheet6: TTabSheet
          Caption = 'Data'
          ImageIndex = 1
          object ToolBar1: TToolBar
            Left = 0
            Top = 0
            Width = 936
            Height = 29
            Caption = 'ToolBar1'
            TabOrder = 0
            object btRun: TButton
              Left = 0
              Top = 2
              Width = 75
              Height = 22
              Caption = 'Run'
              TabOrder = 0
              OnClick = btRunClick
            end
          end
          object mData: TMemo
            Left = 0
            Top = 29
            Width = 936
            Height = 329
            Align = alClient
            Font.Charset = DEFAULT_CHARSET
            Font.Color = clWindowText
            Font.Height = -11
            Font.Name = 'Monospac821 BT'
            Font.Style = []
            ParentFont = False
            TabOrder = 1
          end
        end
        object TabSheet3: TTabSheet
          Caption = 'TabSheet3'
          ImageIndex = 2
          object mSend: TMemo
            Left = 0
            Top = 0
            Width = 965
            Height = 376
            Align = alClient
            Font.Charset = DEFAULT_CHARSET
            Font.Color = clWindowText
            Font.Height = -11
            Font.Name = 'Monospac821 BT'
            Font.Style = []
            Lines.Strings = (
              'GET /aim/sql.php?q=select+top+20+*+from+om.item HTTP/1.1'
              'Host: www.alicon.nl'
              '')
            ParentFont = False
            TabOrder = 0
          end
        end
        object TabSheet4: TTabSheet
          Caption = 'TabSheet4'
          ImageIndex = 3
          object mResult: TMemo
            Left = 0
            Top = 0
            Width = 965
            Height = 376
            Align = alClient
            Lines.Strings = (
              'mResult')
            TabOrder = 0
          end
        end
      end
      object ToolBar2: TToolBar
        Left = 0
        Top = 0
        Width = 973
        Height = 25
        AutoSize = True
        ButtonHeight = 21
        Caption = 'ToolBar2'
        TabOrder = 1
        object edHostIp: TEdit
          Left = 0
          Top = 2
          Width = 121
          Height = 21
          Hint = 'Service Host IP'
          TabOrder = 1
        end
        object edHostPort: TEdit
          Left = 121
          Top = 2
          Width = 55
          Height = 21
          Hint = 'Service Host Port'
          TabOrder = 2
          Text = '23'
        end
        object edHostName: TEdit
          Left = 176
          Top = 2
          Width = 121
          Height = 21
          Hint = 'Host name'
          ReadOnly = True
          TabOrder = 0
        end
        object btHostStart: TButton
          Left = 297
          Top = 2
          Width = 43
          Height = 21
          Caption = 'Start'
          TabOrder = 3
          OnClick = btHostStartClick
        end
        object cbHostActive: TCheckBox
          Left = 340
          Top = 2
          Width = 64
          Height = 21
          Caption = 'Active'
          TabOrder = 4
        end
        object cbLog: TCheckBox
          Left = 404
          Top = 2
          Width = 56
          Height = 21
          Caption = 'Log'
          TabOrder = 5
        end
        object cbClientConnected: TCheckBox
          Left = 460
          Top = 2
          Width = 97
          Height = 21
          Caption = 'Connection'
          TabOrder = 6
        end
      end
      object ToolBar3: TToolBar
        Left = 0
        Top = 25
        Width = 973
        Height = 25
        AutoSize = True
        ButtonHeight = 21
        Caption = 'ToolBar3'
        TabOrder = 2
        object edSendHost: TEdit
          Left = 0
          Top = 2
          Width = 121
          Height = 21
          Hint = 'Send to Host IP'
          TabOrder = 0
        end
        object edSendPort: TEdit
          Left = 121
          Top = 2
          Width = 55
          Height = 21
          Hint = 'Sent to Host Port'
          TabOrder = 1
          Text = '23'
        end
        object edSendText: TEdit
          Left = 176
          Top = 2
          Width = 295
          Height = 21
          Hint = 'Send string'
          TabOrder = 2
        end
        object btIpSend: TButton
          Left = 471
          Top = 2
          Width = 59
          Height = 21
          Caption = 'Send'
          TabOrder = 3
          OnClick = btIpSendClick
        end
        object Button4: TButton
          Left = 530
          Top = 2
          Width = 75
          Height = 21
          Caption = 'Connect'
          TabOrder = 4
          OnClick = Button4Click
        end
        object cbConnectToHost: TCheckBox
          Left = 605
          Top = 2
          Width = 97
          Height = 21
          Caption = 'Connected'
          TabOrder = 5
        end
        object Button3: TButton
          Left = 702
          Top = 2
          Width = 75
          Height = 21
          Caption = 'Button3'
          TabOrder = 6
          OnClick = Button3Click
        end
      end
      object ToolBar4: TToolBar
        Left = 0
        Top = 50
        Width = 973
        Height = 29
        Caption = 'ToolBar4'
        TabOrder = 3
        object Button5: TButton
          Left = 0
          Top = 2
          Width = 75
          Height = 22
          Caption = 'Button5'
          TabOrder = 0
          OnClick = Button5Click
        end
        object Button6: TButton
          Left = 75
          Top = 2
          Width = 75
          Height = 22
          Caption = 'Button6'
          TabOrder = 1
          OnClick = Button6Click
        end
      end
    end
    object TabSheet1: TTabSheet
      Caption = 'OPC server'
      object Splitter1: TSplitter
        Left = 417
        Top = 29
        Height = 393
      end
      object ToolBar5: TToolBar
        Left = 0
        Top = 0
        Width = 973
        Height = 29
        ButtonHeight = 21
        Caption = 'ToolBar5'
        TabOrder = 0
        object ServerCombo: TDBComboBox
          Left = 0
          Top = 2
          Width = 241
          Height = 21
          DataField = 'servername'
          DataSource = dsSrv
          ItemHeight = 13
          TabOrder = 0
          OnDropDown = ServerComboDropDown
        end
        object btConnect: TButton
          Left = 241
          Top = 2
          Width = 75
          Height = 21
          Caption = 'Connect'
          TabOrder = 1
          OnClick = btReloadClick
        end
        object bDisconnect: TButton
          Left = 316
          Top = 2
          Width = 72
          Height = 21
          Caption = 'Disconnect'
          TabOrder = 2
          OnClick = bDisconnectClick
        end
        object spView: TSpeedButton
          Left = 388
          Top = 2
          Width = 58
          Height = 21
          AllowAllUp = True
          GroupIndex = 1
          Caption = 'View'
          OnClick = getTreeClick
        end
        object eMs: TEdit
          Left = 446
          Top = 2
          Width = 42
          Height = 21
          TabOrder = 4
          Text = '300'
        end
        object cbUpdate: TCheckBox
          Left = 488
          Top = 2
          Width = 65
          Height = 21
          Caption = 'Update'
          Checked = True
          State = cbChecked
          TabOrder = 3
          OnClick = cbUpdateClick
        end
        object Button1: TButton
          Left = 553
          Top = 2
          Width = 75
          Height = 21
          Caption = 'Button1'
          TabOrder = 5
          OnClick = Button1Click
        end
      end
      object pOpcTree: TPanel
        Left = 0
        Top = 29
        Width = 417
        Height = 393
        Align = alLeft
        BevelOuter = bvNone
        Caption = 'pOpcTree'
        TabOrder = 1
        Visible = False
        object Splitter3: TSplitter
          Left = 209
          Top = 0
          Height = 393
        end
        object TreeView1: TTreeView
          Left = 0
          Top = 0
          Width = 209
          Height = 393
          Align = alLeft
          HideSelection = False
          Images = ImageList2
          Indent = 19
          ReadOnly = True
          TabOrder = 0
          OnChange = TreeView1Change
          OnExpanding = TreeView1Expanding
        end
        object lbOpcItems: TListBox
          Left = 212
          Top = 0
          Width = 205
          Height = 393
          Align = alClient
          ItemHeight = 13
          TabOrder = 1
          OnDblClick = lbOpcItemsDblClick
        end
      end
      object lvRead: TListView
        Left = 420
        Top = 29
        Width = 553
        Height = 393
        Align = alClient
        Columns = <
          item
            Caption = 'Value'
            Width = 100
          end
          item
            Caption = 'ItemId'
            Width = 200
          end
          item
            Caption = 'Modified'
            Width = 200
          end
          item
            Caption = 'Quality'
            Width = 100
          end
          item
            Caption = 'Target'
            Width = 100
          end
          item
            Caption = 'Writen'
            Width = 100
          end
          item
            Caption = 'Received'
            Width = 100
          end
          item
            Caption = 'Send'
            Width = 100
          end>
        HideSelection = False
        PopupMenu = PopupMenu1
        TabOrder = 2
        ViewStyle = vsReport
        OnEdited = lvReadEdited
      end
      object BottomPanel: TPanel
        Left = 0
        Top = 422
        Width = 973
        Height = 61
        Align = alBottom
        BevelOuter = bvNone
        TabOrder = 3
        object Label18: TLabel
          Left = 7
          Top = 7
          Width = 31
          Height = 13
          Caption = 'Server'
        end
        object Label19: TLabel
          Left = 7
          Top = 26
          Width = 35
          Height = 13
          Caption = 'Version'
        end
        object Label20: TLabel
          Left = 503
          Top = 6
          Width = 25
          Height = 13
          Caption = 'State'
        end
        object Label21: TLabel
          Left = 503
          Top = 25
          Width = 54
          Height = 13
          Caption = 'Vendor info'
        end
        object LServer: TLabel
          Left = 78
          Top = 7
          Width = 404
          Height = 13
          AutoSize = False
          Caption = 'LServer'
        end
        object LVersion: TLabel
          Left = 78
          Top = 26
          Width = 404
          Height = 13
          AutoSize = False
          Caption = 'LVersion'
        end
        object LState: TLabel
          Left = 574
          Top = 6
          Width = 404
          Height = 13
          AutoSize = False
          Caption = 'LState'
        end
        object LInfo: TLabel
          Left = 574
          Top = 25
          Width = 404
          Height = 32
          AutoSize = False
          Caption = 'LInfo'
          WordWrap = True
        end
      end
    end
  end
  object OPCServer: TdOPCServer
    Active = False
    ClientName = 'dOPC DA Client'
    KeepAlive = 0
    Version = '4.30'
    OnConnect = OPCServerConnect
    Protocol = coCOM
    Params.Strings = (
      'xml-user='
      'xml-pass='
      'xml-proxy=')
    OPCGroups = <>
    OPCGroupDefault.IsActive = True
    OPCGroupDefault.UpdateRate = 100
    OPCGroupDefault.LocaleId = 0
    OPCGroupDefault.TimeBias = 0
    ConnectDelay = 300
    OnDatachange = OPCServerDatachange
    OnWriteComplete = OPCServerWriteComplete
    Left = 704
  end
  object GUI: TdOPCGUI
    AllowedControls.Strings = (
      'TControl'
      'TStyledControl')
    OPCServer = OPCServer
    Items = <>
    UseTags = True
    Left = 736
  end
  object tUpdate: TTimer
    Enabled = False
    Interval = 300
    OnTimer = tUpdateTimer
    Left = 600
  end
  object ServerSocket1: TServerSocket
    Active = False
    Port = 0
    ServerType = stNonBlocking
    OnClientConnect = ServerSocket1ClientConnect
    OnClientDisconnect = ServerSocket1ClientDisconnect
    OnClientRead = ServerSocket1ClientRead
    OnClientWrite = ServerSocket1ClientWrite
    OnClientError = ServerSocket1ClientError
    Left = 640
  end
  object ClientSocket1: TClientSocket
    Active = False
    ClientType = ctNonBlocking
    Port = 0
    OnConnect = ClientSocket1Connect
    OnDisconnect = ClientSocket1Disconnect
    OnRead = ClientSocket1Read
    Left = 664
  end
  object IdTCPClient1: TIdTCPClient
    MaxLineAction = maException
    ReadTimeout = 0
    Port = 0
    Left = 768
  end
  object cAim: TADOConnection
    ConnectionString = 'FILE NAME=..\bin\aim.udl'
    LoginPrompt = False
    Provider = 'SQLOLEDB.1'
    Left = 800
  end
  object dtItems: TADataSet
    Connection = cAim
    CursorType = ctStatic
    CommandText = 'select * from opc.items'#13#10'where srvId = :id'
    DataSource = dsSrv
    MasterFields = 'id'
    Parameters = <
      item
        Name = 'id'
        Attributes = [paSigned, paNullable]
        DataType = ftInteger
        Precision = 10
        Value = 1
      end>
    Left = 960
  end
  object dsItems: TADataSource
    DataSet = dtItems
    Left = 992
  end
  object dsSrv: TADataSource
    DataSet = dtSrv
    Left = 912
  end
  object dtSrv: TADataSet
    Connection = cAim
    CursorType = ctStatic
    CommandText = 'select * from opc.server where id = :id'
    Parameters = <
      item
        Name = 'id'
        Attributes = [paSigned]
        DataType = ftInteger
        Precision = 10
        Size = 4
        Value = 1
      end>
    Left = 880
    object dtSrvid: TIntegerField
      FieldName = 'id'
    end
    object dtSrvservername: TStringField
      FieldName = 'servername'
      Size = 50
    end
  end
  object ImageList2: TImageList
    Left = 1032
    Bitmap = {
      494C0101020004000C0010001000FFFFFFFFFF10FFFFFFFFFFFFFFFF424D3600
      0000000000003600000028000000400000001000000001002000000000000010
      000000000000000000000000000000000000000000000274AC000274AC000274
      AC000274AC000274AC000274AC000274AC000274AC000274AC000274AC000274
      AC000274AC000274AC000000000000000000000000000274AC000274AC000274
      AC000274AC000274AC000274AC000274AC000274AC000274AC000274AC000274
      AC000274AC000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000274AC0049BEEE000274AC0091EF
      FC004BBFF0004BBFF0004BBFF0004BBFF0004BBFF0004BBFF0004BBFF0004BBF
      F000289CCF009BECFA000274AC00000000000274AC00168ABE0041B5E40063D2
      F8004FC2F2004FC2F2004FC2F2004FC2F2004FC2F2004FC2F2004FC2F2004FC2
      F2002297C9000F83B90000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000274AC0051C4F3000274AC0095ED
      FB0054C8F50054C8F50054C8F50054C8F50054C8F50054C8F50054C8F50054C8
      F500289CCF009BECFA000274AC00000000000274AC0035A9D8001D91C40071DC
      F90053C6F60053C6F60053C6F60053C6F60053C6F60053C6F60053C6F60053C6
      F600269BCD00B8F2F9000274AC00000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000274AC005ACCF6000274AC009BEC
      FA005FD2F9005FD2F9005FD2F9005FD2F9005FD2F9005FD2F9005FD2F9005FD2
      F900289CCF00A2EDFA000274AC00000000000274AC0059CBF7000274AC0098F5
      FC005ECFF8005ECFF8005ECFF8005ECFF8005ECFF80061D1F8005ECFF8005ECF
      F8002A9FD000B8F2F9000274AC00000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000274AC005FD2F9000274AC00A2ED
      FA006ADCFA006ADCFA006ADCFA006ADCFA006ADCFA006ADCFA006ADCFA006ADC
      FA0032A6D800AAEFFA000274AC00000000000274AC005ECFF8000B7FB60071DC
      F90078E6FB006CDAF9006CDAF9006CDAF9006CDAF9006CDAF9006CDAF9006CDA
      F90030A4D400B8F2F900097DB400000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000274AC006ADCFA000274AC00AAEF
      FA0073E5FB0073E5FB0073E5FB0073E5FB0073E5FB0073E5FB0073E5FB0073E5
      FB0032A6D800AAEFFA000274AC00000000000274AC006CDAF9002A9FD0003BAF
      DF0098F5FC0074E2FA0074E2FA0074E2FA0074E2FA0074E2FA0074E2FA0074E2
      FA0035A9D800B8F2F900B8F2F9000274AC000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000274AC0071E2FB000274AC00C7F2
      FA00B8F2FC00B8F2FC00B8F2FC00B8F2FC00B8F2FC00B8F2FC00B8F2FC00B8F2
      FC005ACCF600C7F2FA000274AC00000000000274AC0074E2FA005CCDF7000F83
      B900D6F6FA00B8F2F900B8F2F900B8F2F900B8F2F900B8F2F900B8F2F900B8F2
      F90071DCF900D6F6FA00C3F3F9000274AC000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000274AC0078E9FC000274AC000274
      AC000274AC000274AC000274AC000274AC000274AC000274AC000274AC000274
      AC000274AC000274AC000274AC00000000000274AC007DEBFC007DEBFC000B7F
      B6000274AC000274AC000274AC000274AC000274AC000274AC000274AC000274
      AC000274AC000274AC000274AC000274AC000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000274AC0084F1FD0084F1FD0084F1
      FD0084F1FD0084F1FD0084F1FD0084F1FD0084F1FD0084F1FD0084F1FD0084F1
      FD000273AB000000000000000000000000000274AC0083F1FD0084F3FD0084F3
      FD0083F1FD0084F3FD0084F3FD0083F1FD0084F3FD0083F1FD0084F3FD0084F3
      FD000273AB000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000274AC00C7F2FA0089F4FD0089F4
      FD0089F4FD0089F4FD0089F4FD0089F4FD0089F4FD0089F4FD0089F4FD0089F4
      FD000273AB000000000000000000000000000274AC00D6F6FA0089F6FD0089F6
      FD0089F6FD008BF7FD008BF7FD0089F6FD008BF7FD008BF7FD0089F6FD008BF7
      FD000273AB000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      000000000000000000000000000000000000000000000274AC00C7F2FA008DF2
      FD008DF2FD008DF2FD000274AC000274AC000274AC000274AC000274AC000274
      AC0000000000000000000000000000000000000000000274AC00D6F6FA008EF7
      FD008EF7FD008EF7FD000274AC000274AC000274AC000274AC000274AC000274
      AC00000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      00000000000000000000000000000000000000000000000000000274AC000274
      AC000274AC000274AC0000000000000000000000000000000000000000000000
      00000000000000000000000000000000000000000000000000000274AC000274
      AC000274AC000274AC0000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      000000000000000000000000000000000000424D3E000000000000003E000000
      2800000040000000100000000100010000000000800000000000000000000000
      000000000000000000000000FFFFFF0080038007000000000001000300000000
      0001000100000000000100010000000000010001000000000001000000000000
      0001000000000000000100000000000000070007000000000007000700000000
      800F800F00000000C3FFC3FF00000000FFFFFFFF00000000FFFFFFFF00000000
      FFFFFFFF00000000FFFFFFFF0000000000000000000000000000000000000000
      000000000000}
  end
  object ActionList1: TActionList
    Left = 840
    object DataSetFirst1: TDataSetFirst
      Category = 'Data'
      Caption = 'Eerste'
      ImageIndex = 7
    end
    object DataSetPrior1: TDataSetPrior
      Category = 'Data'
      Caption = 'Vorige'
      ImageIndex = 8
    end
    object DataSetNext1: TDataSetNext
      Category = 'Data'
      Caption = 'Volgende'
      ImageIndex = 9
    end
    object DataSetLast1: TDataSetLast
      Category = 'Data'
      Caption = 'Laatste'
      ImageIndex = 10
    end
    object DataSetRequery1: TDataSetRequery
      Category = 'Data'
      Caption = '&Verversen'
      ImageIndex = 6
      ShortCut = 116
    end
    object DataSetEdit1: TDataSetEdit
      Category = 'Data'
      Caption = 'Wijzigen'
      ImageIndex = 20
      ShortCut = 113
    end
    object DataSetCancel1: TDataSetCancel
      Category = 'Data'
      Caption = 'Annuleren'
      ImageIndex = 4
    end
    object DataSetPost1: TDataSetPost
      Category = 'Data'
      Caption = 'Opslaan'
      ImageIndex = 3
      ShortCut = 16467
    end
    object DataSetInsert1: TDataSetInsert
      Category = 'Data'
      Caption = 'Toevoegen'
      ImageIndex = 0
      ShortCut = 16462
    end
    object DataSetCopy1: TDataSetCopy
      Category = 'Data'
      Caption = '&Kopieren'
      Hint = 'Record kopieeren'
      ImageIndex = 1
    end
    object DataSetDelete1: TDataSetDelete
      Category = 'Data'
      Caption = 'Verwijderen'
      ImageIndex = 2
    end
    object DataSetSort1: TDataSetSort
      Category = 'Data'
      Caption = 'Sorteren oplopend'
      ImageIndex = 11
      ShortCut = 16457
    end
    object DataSetSortDesc1: TDataSetSortDesc
      Category = 'Data'
      Caption = 'Sorteren aflopend'
      ImageIndex = 12
      ShortCut = 24649
    end
    object DataSetFind1: TDataSetFind
      Category = 'Data'
      Caption = 'Zoeken'
      ImageIndex = 13
      ShortCut = 16454
    end
    object DataSetFilter1: TDataSetFilter
      Category = 'Data'
      Caption = 'Filter'
      ImageIndex = 15
    end
    object DataSetFilterSet1: TDataSetFilterSet
      Category = 'Data'
      Caption = 'Filter op huidige selectie'
      ImageIndex = 14
    end
    object DataGridEdit1: TDataGridEdit
      Category = 'Data'
      Caption = 'DataGridEdit1'
    end
    object DataGridToExcel1: TDataGridToExcel
      Category = 'Data'
      Caption = 'Exporteren naar Excel'
      ImageIndex = 29
    end
  end
  object PopupMenu1: TPopupMenu
    Left = 1072
    object Edit1: TMenuItem
      Caption = 'Edit'
      ShortCut = 113
      OnClick = Edit1Click
    end
  end
end

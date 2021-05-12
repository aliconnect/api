object fmColumnPicker: TfmColumnPicker
  Left = 737
  Top = 39
  Width = 449
  Height = 487
  Caption = 'Kolomselectie'
  Color = clBtnFace
  Font.Charset = DEFAULT_CHARSET
  Font.Color = clWindowText
  Font.Height = -11
  Font.Name = 'MS Sans Serif'
  Font.Style = []
  OldCreateOrder = False
  Position = poScreenCenter
  OnClose = FormClose
  OnDeactivate = FormDeactivate
  PixelsPerInch = 96
  TextHeight = 13
  object Splitter1: TSplitter
    Left = 176
    Top = 0
    Height = 368
  end
  object lbFields: TListBox
    Left = 179
    Top = 0
    Width = 254
    Height = 368
    Align = alClient
    BevelEdges = [beLeft]
    BevelKind = bkTile
    BorderStyle = bsNone
    ItemHeight = 13
    PopupMenu = pmKolom
    TabOrder = 0
    OnDblClick = lbFieldsDblClick
  end
  object lbVisible: TListBox
    Left = 0
    Top = 0
    Width = 176
    Height = 368
    Align = alLeft
    BevelEdges = [beLeft]
    BevelKind = bkTile
    BorderStyle = bsNone
    DragMode = dmAutomatic
    ItemHeight = 13
    MultiSelect = True
    PopupMenu = pmKolom
    TabOrder = 1
    OnClick = lbVisibleClick
    OnDblClick = lbVisibleDblClick
    OnDragDrop = lbVisibleDragDrop
    OnDragOver = lbVisibleDragOver
  end
  object Panel1: TPanel
    Left = 0
    Top = 368
    Width = 433
    Height = 80
    Align = alBottom
    TabOrder = 2
    object Label1: TLabel
      Left = 7
      Top = 7
      Width = 20
      Height = 13
      Caption = 'Titel'
    end
    object Label2: TLabel
      Left = 150
      Top = 7
      Width = 37
      Height = 13
      Caption = 'PickList'
    end
    object edTitle: TEdit
      Left = 7
      Top = 20
      Width = 137
      Height = 21
      TabOrder = 0
      OnChange = edTitleChange
    end
    object mPickList: TMemo
      Left = 150
      Top = 20
      Width = 176
      Height = 58
      ScrollBars = ssVertical
      TabOrder = 1
      OnChange = mPickListChange
    end
  end
  object pmKolom: TPopupMenu
    Left = 53
    Top = 91
    object Kolomenschalen1: TMenuItem
      Caption = 'Kolommen schalen'
      OnClick = Kolomenschalen1Click
    end
    object Kolomeninlezen1: TMenuItem
      Caption = 'Kolommen inlezen'
      ShortCut = 16460
      OnClick = Kolomeninlezen1Click
    end
    object Kollomenopslaan1: TMenuItem
      Caption = 'Kolommen opslaan'
      ShortCut = 16467
      OnClick = Kollomenopslaan1Click
    end
    object Kolommenreset1: TMenuItem
      Caption = 'Kolommen reset'
      OnClick = Kolommenreset1Click
    end
    object parent1: TMenuItem
      Caption = 'Ownername'
    end
    object Wijzigtitel1: TMenuItem
      Caption = 'Wijzig titel'
    end
  end
  object ADOConnection1: TADOConnection
    Left = 238
    Top = 70
  end
end

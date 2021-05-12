object fmFind: TfmFind
  Left = 348
  Top = 217
  BorderIcons = [biSystemMenu, biHelp]
  BorderStyle = bsDialog
  Caption = 'Zoeken en vervangen'
  ClientHeight = 123
  ClientWidth = 408
  Color = clBtnFace
  Font.Charset = DEFAULT_CHARSET
  Font.Color = clWindowText
  Font.Height = -11
  Font.Name = 'MS Sans Serif'
  Font.Style = []
  FormStyle = fsStayOnTop
  OldCreateOrder = False
  PopupMenu = pmFilter
  Position = poMainFormCenter
  OnClose = FormClose
  OnDeactivate = FormDeactivate
  PixelsPerInch = 96
  TextHeight = 13
  object lFilter: TLabel
    Left = 7
    Top = 154
    Width = 3
    Height = 13
  end
  object Label2: TLabel
    Left = 7
    Top = 35
    Width = 51
    Height = 13
    Caption = 'Zoeken in:'
  end
  object Label1: TLabel
    Left = 7
    Top = 7
    Width = 64
    Height = 13
    Caption = 'Zoeken naar:'
  end
  object cbFindField: TComboBox
    Left = 91
    Top = 35
    Width = 309
    Height = 21
    ItemHeight = 13
    TabOrder = 0
    OnDropDown = cbFindFieldDropDown
  end
  object Button2: TButton
    Left = 210
    Top = 91
    Width = 92
    Height = 22
    Caption = 'V&erzamelen'
    Default = True
    TabOrder = 1
    OnClick = FilterClick
  end
  object edFind: TEdit
    Left = 91
    Top = 7
    Width = 309
    Height = 21
    TabOrder = 2
  end
  object cbVolledigVeld: TCheckBox
    Left = 7
    Top = 91
    Width = 58
    Height = 17
    Caption = '&Exact'
    TabOrder = 3
  end
  object Button1: TButton
    Left = 308
    Top = 91
    Width = 92
    Height = 22
    Caption = 'Annuleren'
    TabOrder = 4
    OnClick = AnnulerenClick
  end
  object ADODataSet1: TADODataSet
    Parameters = <>
    Left = 263
    Top = 3
  end
  object pmFilter: TPopupMenu
    Left = 291
    Top = 3
    object Filter1: TMenuItem
      Caption = 'Filter'
      ShortCut = 13
      OnClick = FilterClick
    end
    object Sluiten1: TMenuItem
      Caption = 'Sluiten'
      ShortCut = 27
      OnClick = AnnulerenClick
    end
    object N1: TMenuItem
      Caption = '-'
    end
    object Vorig1: TMenuItem
      Caption = 'Vorig'
      ShortCut = 38
      OnClick = Vorig1Click
    end
    object Volgend1: TMenuItem
      Caption = 'Volgend'
      ShortCut = 40
      OnClick = Volgend1Click
    end
  end
  object ActionList1: TActionList
    Left = 319
    Top = 3
    object ActionFind: TAction
      Caption = 'ActionFind'
      ImageIndex = 12
      ShortCut = 16454
      OnExecute = ActionFindExecute
    end
    object SearchFind1: TSearchFind
      Category = 'Search'
      Caption = '&Find...'
      Hint = 'Find|Finds the specified text'
      ImageIndex = 34
      ShortCut = 16454
    end
    object SearchFindNext1: TSearchFindNext
      Category = 'Search'
      Caption = 'Find &Next'
      Hint = 'Find Next|Repeats the last find'
      ImageIndex = 33
      ShortCut = 114
    end
    object SearchReplace1: TSearchReplace
      Category = 'Search'
      Caption = '&Replace'
      Hint = 'Replace|Replaces specific text with different text'
      ImageIndex = 32
    end
    object SearchFindFirst1: TSearchFindFirst
      Category = 'Search'
      Caption = 'F&ind First'
      Hint = 'Find First|Finds the first occurance of specified text'
    end
  end
end

USE [aim1]
GO
ALTER VIEW [item].[vw]
AS
	SELECT
		I.[ID]
		--,S.name as [schema]
		,I.[schema]
		,item.schemaPath(I.id) AS schemaPath
		,item.tagname(I.id) AS Tagname
		,I.[schema] as [typical]
		,'Company('+CAST(I.hostID AS VARCHAR(20))+')' as [Host]
	  ,I.[UID]
	  ,I.[Name]
	  ,ISNULL(ISNULL(I.[Title],I.[Name]),I.[KeyName]) AS DisplayName
	  ,I.[Title]
	  ,I.[Subject]
	  ,I.[Summary]
	  ,I.header0
	  ,I.header1
	  ,I.header2
	  ,I.[Description]
	  ,item.classId(I.id, I.hostID) AS ClassID
	  ,I.[HostID]
	  ,I.[UserID]
		,I.[MasterID]
	  ,I.[DetailID]
		--,AM.[LinkID] AS [MasterID]
	  ,I.[InheritedID]
	  ,I.[SrcID]
	  ,I.[ParentID]
	  ,I.[KeyID]
	  ,I.[CreatedByID]
	  ,I.[OwnerID]
	  ,I.[DeletedByID]
	  ,I.[LastModifiedByID]
	  ,I.[CreatedDateTime]
	  ,I.[LastModifiedDateTime]
	  ,I.[DeletedDateTime]
	  ,I.[StartDateTime]
	  ,I.[EndDateTime]
	  ,I.[FinishDateTime]
	  ,I.[LastIndexDateTime]
	  ,I.[IsSelected]
	  ,I.[IsDisabled]
	  ,I.[IsPublic]
	  ,I.[IsClone]
	  ,I.[IsChecked]
	  ,I.[HasChildren]
	  ,I.[HasAttachements]
	  ,I.[MessageCount]
	  ,I.[ChildIndex]
	  ,I.[State]
	  ,I.[Categories]
	  ,I.[Prefix]
	  ,I.[Tag]
	  ,I.[KeyName]
	  ,I.[GroupName]
	  ,I.[filterfields]
	  ,I.[Location]
	  ,I.[secret]
	  ,I.[server]
	  ,I.[secret_uid]
	  ,I.[Scope]
	  ,I.[Data]
	  ,I.[files]
		,'Contact('+CAST(I.CreatedByID AS VARCHAR(20))+')' [CreatedBy]
		,'Contact('+CAST(I.LastModifiedByID AS VARCHAR(20))+')' [LastModifiedBy]
		--,item.schemaName(I.InheritedID)+'('+CAST(I.InheritedID AS VARCHAR(20))+')' as [Inherited]
		,ISNULL(I.detailID,I.id) ItemID
		,CASE WHEN I.SrcID=I.MasterID THEN 1 ELSE 0 END AS IsClass
		,C.Title AS CreatedByTitle
	FROM
		item.dv I
		--INNER JOIN item.dv S ON S.ID = I.ClassID
		LEFT OUTER JOIN item.dv C ON C.ID = I.CreatedByID
GO

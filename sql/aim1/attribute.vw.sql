USE [aim1]
GO
ALTER VIEW [attribute].[vw]
AS
	SELECT
		F.Name AttributeName
		,A.AttributeID
		,A.ItemID
		,A.HostID
		,A.UserID
		,A.NameID
		,A.ClassID
		,A.LinkID
		,ISNULL(CONVERT(NVARCHAR(MAX),I.header0),A.Value)Value
		,A.CreatedDateTime
		,A.LastModifiedDateTime
		,A.LastModifiedByID
		,A.Scope
		,A.Data
		,I.[schema]
		,I.ID
		FROM attribute.dv A
		INNER JOIN attribute.name F ON F.id = A.NameID
		LEFT OUTER JOIN item.dv I ON I.ID = A.LinkID
GO

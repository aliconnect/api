USE [aim1]
GO
ALTER VIEW [item].[attribute]
AS
	WITH 
	attribute (AttributeID,ItemID,HostID,UserID,NameID,ClassID,LinkID,Value,CreatedDateTime,LastModifiedDateTime,LastModifiedByID,Scope,Data) AS (
		SELECT A.AttributeID,A.ItemID,A.HostID,A.UserID,A.NameID,A.ClassID,A.LinkID,A.Value,A.CreatedDateTime,A.LastModifiedDateTime,A.LastModifiedByID,A.Scope,A.Data
		FROM attribute.dv A
		UNION 
		SELECT A.AttributeID,A.LinkID,A.HostID,A.UserID,A.NameID,A.ClassID,A.ItemID,A.Value,A.CreatedDateTime,A.LastModifiedDateTime,A.LastModifiedByID,A.Scope,A.Data
		FROM attribute.dv A
		WHERE NameID = 2185
	)
	SELECT
		F.name AS AttributeName
		,A.AttributeID,A.LinkID,A.HostID,A.UserID,A.NameID,A.ClassID,A.ItemID,ISNULL(I.header0,A.Value)Value,A.CreatedDateTime,A.LastModifiedDateTime,A.LastModifiedByID,A.Scope,A.Data
		FROM attribute A
		INNER JOIN attribute.name F ON F.id = A.NameID
		LEFT OUTER JOIN item.dv I ON I.ID = A.LinkID
GO

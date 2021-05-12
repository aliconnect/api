USE [aim1]
GO
ALTER VIEW [item].[children] AS 
	SELECT 
		A.linkID AS MasterID,
		CONVERT(INT,A.Data) idx,
		A.HostID,
		S.LinkID SrcID,
		I.[schema],
		I.UID,
		I.Title,
		I.Subject,
		I.Summary,
		I.[ID],
		I.InheritedID,
		item.schemaPath(I.id) AS schemaPath,
		I.[Name],
		I.header0,
		I.header1,
		I.header2
	FROM attribute.dv A
	INNER JOIN item.vw I ON I.id = A.itemId AND A.NameID = 980 
	LEFT OUTER JOIN attribute.dv S ON S.itemID = A.itemId AND S.NameID = 2173 AND S.HostID=A.HostID
	WHERE A.hostID IS NOT NULL AND A.LinkID IS NOT NULL
GO

USE [aim1]
GO
ALTER PROCEDURE [item].[build_data] @id BIGINT
AS
	SET NOCOUNT ON
	DECLARE @T TABLE(level INT, NameID INT, ItemID BIGINT, LinkID BIGINT, HostID BIGINT)
	;WITH P1(level,NameID,ItemID,LinkID,HostID)
	AS (SELECT -1,I.NameID,I.ItemID,I.LinkID,I.HostID
	FROM attribute.dt I
	WHERE I.NameID = 980 AND I.ItemID = @ID
	UNION ALL
	SELECT level-1,I.NameID,I.ItemID,I.LinkID,I.HostID
	FROM P1
	INNER JOIN attribute.dt I ON I.NameID = 980 AND I.ItemID = P1.LinkID and level>-10
	),
	P2(level,NameID,ItemID,LinkID,HostID)
	AS (SELECT 0,I.NameID,I.ItemID,I.LinkID,I.HostID
	FROM attribute.dt I
	WHERE I.NameID = 980 AND I.ItemID = @ID
	UNION ALL
	SELECT level+1,I.NameID,I.ItemID,I.LinkID,I.HostID
	FROM P2
	INNER JOIN attribute.dt I ON I.NameID = 980 AND I.LinkID = P2.ItemID and level<10
	)
	INSERT @T
	SELECT * FROM P1
	UNION ALL
	SELECT * FROM P2
	SELECT [schema],I.ID,I.MasterID,UID,Title,Subject,Summary 
	FROM (SELECT DISTINCT ItemID FROM @T) T INNER JOIN item.children I ON I.id = T.ItemID
	INSERT aimhis.his.export (client_id,id,export_dt)
	SELECT DISTINCT HostId,ItemId,getdate()
	FROM @T I
	LEFT OUTER JOIN aimhis.his.export E ON E.client_id = I.HostID AND E.id = I.ItemId
	WHERE E.id IS NULL
	--SELECT [schema],I.ID,I.MasterID,UID,Title,Subject,Summary FROM (SELECT DISTINCT ItemID FROM @T) T INNER JOIN item.vw I ON I.id = T.ItemID
	;WITH P( level,NameID,ItemID,LinkID,RootID)
	AS (SELECT -1,I.NameID,I.ItemID,I.LinkID,I.ItemID
	FROM attribute.dt I
	INNER JOIN @T T ON I.NameID = 1157 AND I.ItemID = T.ItemID
	UNION ALL
	SELECT level-1,I.NameID,I.ItemID,I.LinkID,P.RootID
	FROM P
	INNER JOIN attribute.dt I ON I.NameID = 1157 AND I.LinkID = P.ItemID and level>-10
	)
	SELECT T.RootID ItemID,A.NameID,A.AttributeName,A.Value,A.LinkID FROM P T INNER JOIN attribute.vw A ON A.ItemID = T.RootID
GO

USE [aim1]
GO
ALTER VIEW [item].[allattributes]
AS
	with
	items (id, masterid, srcid) AS (
		SELECT id, masterid, ISNULL(ISNULL(inheritedId,srcID),classId) FROM item.dv
	), 
	src (level, id, srcId) AS (
		SELECT 0, id, srcid
		FROM items
		where masterid = 3563392
		UNION ALL
		SELECT level+1, src.id, items.srcid
		FROM src
		INNER JOIN items ON items.id = src.srcid and level<50			
	)
	select * from 
	(SELECT src.id, AttributeName, Value FROM attribute.vw a inner join src ON a.itemID = src.srcId AND a.Value IS NOT NULL) p 
	PIVOT ( MAX(Value) FOR AttributeName IN ( Name,Master,Tag,Src ) ) AS pvt
GO

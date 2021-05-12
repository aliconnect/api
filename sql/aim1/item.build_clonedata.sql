USE [aim1]
GO
ALTER PROCEDURE [item].[build_clonedata] @itemId BIGINT
AS
	SET NOCOUNT ON
	;WITH clones (itemId, cloneId) AS (
		SELECT linkId, itemId FROM attribute.dt WHERE nameId=2173 AND linkId IS NOT NULL
	)
	,children (masterId, itemId, srcId, title, schemaName, mastersrcId, header0, header1, header2, hasChildren) AS (
		SELECT A.linkId, A.ItemId, S.itemId, I.title, I.[schema], SM.itemId, I.header0, I.header1, I.header2, I.hasChildren
		FROM attribute.dt A
		INNER JOIN item.dv I ON A.nameId=980 AND I.id = A.ItemID
		LEFT OUTER JOIN clones S ON S.cloneID = I.id
		LEFT OUTER JOIN clones SM ON SM.cloneID = A.linkId
	)
	,itemtree (level, masterId, itemId, srcId, title, schemaName, mastersrcId) AS (
		SELECT 0, masterId, itemId, srcId, title, schemaName, mastersrcId
		FROM children
		WHERE masterId = @itemId
		UNION ALL
		SELECT level+1, C.masterId, C.itemId, C.srcId, C.title, C.schemaName, C.mastersrcId
		FROM itemtree
		INNER JOIN children C ON C.masterId = itemtree.itemId --AND level<2
	)
	,clonetree (level, masterId, itemId, srcId, title, schemaName, header0, header1, header2, hasChildren) AS (
		SELECT DISTINCT 0, C.masterId, C.itemId, C.srcId, C.title, C.schemaName, C.header0, C.header1, C.header2, C.hasChildren
		FROM children C
		INNER JOIN clones ON clones.cloneId = @itemId AND C.masterId = clones.itemId
		UNION ALL
		SELECT level+1, C.masterId, C.itemId, C.srcId, C.title, C.schemaName, C.header0, C.header1, C.header2, C.hasChildren
		FROM clonetree
		INNER JOIN children C ON C.masterId = clonetree.itemId --AND level<2
	)

	SELECT CT.*,IT.itemId AS cloneId,item.schemaNameArray(CT.itemId) as allOf
	FROM (select distinct * from clonetree) CT
	LEFT OUTER JOIN itemtree IT ON CT.itemId = IT.srcId AND IT.masterSrcId = CT.masterId
	ORDER BY CT.level
GO

USE [aim1]
GO
ALTER PROCEDURE [item].[build_link_data] @itemId BIGINT, @level TINYINT = 10
AS
	SET NOCOUNT ON
	SET @level = 5
	DECLARE @hostId BIGINT
	SELECT @hostId = hostID FROM item.dt WHERE id = @itemId
	DECLARE @links TABLE (level TINYINT, fromId BIGINT, toId BIGINT, category VARCHAR(50))

	;WITH 
	link (fromId, toId, name) AS (
		SELECT itemID, linkId, 'link' FROM attribute.dt WHERE nameId = 2185
		UNION 
		SELECT itemID, linkId, 'parent' FROM attribute.dt WHERE nameId = 980
		UNION 
		SELECT itemID, linkId, 'copyfrom' FROM attribute.dt WHERE nameId = 1157
	),
	fromlink (level, fromId, toId, name) AS (
		SELECT 0, link.fromId, link.toId, link.name
		FROM link
		WHERE fromId = @itemID
		UNION ALL
		SELECT level+1, link.fromId, link.toId, link.name
		FROM fromlink
		INNER JOIN link ON fromlink.fromId = link.toId AND level<@level
	),
	tolink (level, fromId, toId, name) AS (
		SELECT 0, link.fromId, link.toId, link.name
		FROM link
		WHERE toId = @itemID
		UNION ALL
		SELECT level+1, link.fromId, link.toId, link.name
		FROM tolink
		INNER JOIN link ON tolink.toId = link.fromId AND level<@level
	)
	INSERT @links 
	SELECT 0, fromId, toId, name FROM fromlink
	UNION	SELECT 0, fromId, toId, name  FROM tolink

	--SELECT * FROM @links 


	SELECT item.schemaPath(id) schemaPath,id,id [key],header1,name,tag,title,isnull(title,id) text 
	FROM item.dv 
	WHERE id IN (SELECT fromId FROM @links UNION SELECT toId FROM @links )
	
	SELECT L.*,fromId[from],toId[to],category[text],toId[parent],fromId[key],isnull(F.title,F.id) textFrom, isnull(T.title,T.id) text1
	FROM @links L
	INNER JOIN item.dt F ON F.id = L.fromId
	INNER JOIN item.dt T ON T.id = L.toId
GO

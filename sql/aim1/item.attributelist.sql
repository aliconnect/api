USE [aim1]
GO
ALTER VIEW [item].[attributelist]
as
	WITH
	src (level, id, srcId) AS (
		SELECT 1, i.id, i.srcId from item.dt i 
		UNION ALL  
		SELECT level+1, i.id, i.srcId from item.dt i inner join src on i.id=src.srcid
	)
	select i.id as rootId,AttributeName,AttributeID,ItemID,HostID,UserID,NameID,ClassID,LinkID,Value,CreatedDateTime,LastModifiedDateTime,LastModifiedByID,Scope,Data
	from src i
	inner join attribute.vw a on a.itemid = i.srcId
	union all
	select id,'name' as name,null,id,hostId,userId,null,null,null,name,null,lastModifiedDateTime,null,null,null from item.dt
	union all
	select id,'masterId' as name,null,id,hostId,userId,null,null,masterId,null,null,lastModifiedDateTime,null,null,null from item.dt
GO

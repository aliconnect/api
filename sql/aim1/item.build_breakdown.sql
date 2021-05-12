USE [aim1]
GO
ALTER procedure [item].[build_breakdown] @id bigint as
	DECLARE @i TABLE (id bigint, masterId bigint, idx int);
	SET NOCOUNT ON;
	WITH host (id) as (
		select hostid from item.dt where id=@id
	),
	class (id,name) as (
		select id,name from item.dt where classid=0 and hostid in (select id from host)
		--and name in ('Item','Folder','Enterprise','Site','Area','ProcessCell','Unit','EquipmentModule','ControlModule','System','Product','Control','ControlIO','Attribute','Device','Location','Loc','dms_System','dms_Location','dms_Group')
	),
	item (id, masterId, srcId, classId, header0) as (
		select id, masterId, isnull(inheritedId,srcId)srcId, classId, header0
		from item.dt where deletedDateTime is null 
		and hostId in (select id from host) 
		--and classid in (select id from class)
	),
	attr (id, nameid, linkid, value, srcid, data) as (
		select a.itemid, a.nameid, a.linkid, isnull(i.header0,value)value, i.srcid, a.data
		from attribute.dt a
		inner join host h on h.id = a.hostid
		left outer join item i on i.id = a.linkid
		where a.linkid is not null or a.value is not null
	),
	child (id, childid, idx) as (
		select linkid, id, data from attr where nameid=980 and linkid is not null 
		and id in (select id from item) 
		and linkid in (select id from item)
	),
	children (level, id, childid) AS (
		select 0, masterid, id from item where id = @id
		UNION ALL  
		SELECT level+1, child.id, child.childid 
		FROM child INNER JOIN children ON child.id=children.childid AND level < 20
	),
	src (id, level) AS (
		SELECT DISTINCT childid,0 from children 
		UNION ALL 
		SELECT item.srcid, level+1 FROM item INNER JOIN src ON item.id = src.id AND level <10 AND src.id <> 10
	),
	i (id) as (
		select distinct id from src
	)
	--select * from child where id = 3682793
	--select * from item.dt where masterid = 3682793
	--return
	--select * from class where id = 1008
	--return
	--select * from src
	--return



	INSERT @i 
	SELECT i.id, child.id, child.idx 
	FROM i LEFT OUTER JOIN child ON child.childid = i.id

	--select * from item.vw where id in (select id from @i) --and id = 3681039
	select i.ID,i.MasterID,i.idx,schemaPath,header0,header1,header2,ClassID,HostID,UserID,SrcID,InheritedID,IsSelected,IsDisabled,HasChildren,ChildIndex,
	item.getattributevalue(i.id, 'Tag') as Tag,
	item.getattributevalue(i.id, 'Prefix') as Prefix,
	item.getattributevalue(i.id, 'Name') as Name
	from @i i
	inner join item.vw item on item.id = i.id
	select * from attribute.vw where id in (select id from @i) and (value is not null or linkid is not null)
GO



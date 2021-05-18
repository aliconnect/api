USE [aim1]
GO
ALTER PROCEDURE [item].[build_2to1] @id bigint 
as
	SET NOCOUNT ON
	DECLARE @i TABLE (id bigint, masterId bigint, idx int)
	;with host (id) as (
		select hostid from item.dt where id=@id
	),
	class (id,name) as (
		select id,name from item.dt where classid=0 and hostid in (select id from host)--name in ('Item','Folder','Enterprise','Site','Area','ProcessCell','Unit','EquipmentModule','ControlModule','System','Product','Control','ControlIO','Attribute','Device','Location','Loc','dms_System','dms_Location','dms_Group')
	),
	item (id, masterId, srcId, classId, header0) as (
		select 
			id, masterId, isnull(isnull(inheritedId,srcId),classid)srcId, classId, header0
		from 
			item.dt where deletedDateTime is null 
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
		select linkid, id, data from attr where nameid=980 and linkid is not null and id in (select id from item) and linkid in (select id from item)
	),
	children (level, id, childid) AS (
		select 0, masterid, id from item where id = @id
		UNION ALL  
		SELECT level+1, child.id, child.childid from child INNER JOIN children ON child.id=children.childid
	),
	src (id) AS (
		select distinct childid from children 
		union all
		SELECT item.srcid from item inner join src on item.id = src.id
	),
	i (id) as (
		select id from src
		union
		select id from class where id in (select classid from src s inner join item.dt i on i.id = s.id)
	)
	--select * from class --where id=3684738
	--return
	--select * from class where id=3684738


	insert @i 
	select i.id, child.id, child.idx 
	from i
	left outer join child on child.childid = i.id

	SELECT * FROM item.vw1 WHERE primaryKey IN (SELECT id FROM @i)-- and primaryKey in (3683216,3682136,3489512) --and classid=0
	SELECT * FROM attribute.vw1 WHERE id IN (SELECT id FROM @i)-- and id in (3683216,3682136,3489512)
GO
EXEC [item].[build_2to1] 3683132


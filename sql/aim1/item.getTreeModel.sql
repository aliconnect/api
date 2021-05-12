USE [aim1]
GO
ALTER PROCEDURE [item].[getTreeModel] @id INT
AS
	EXEC aim.[api].[getItemModelTree] @id
	RETURN
	SET NOCOUNT ON
	;WITH P ( id,detailID,srcID,masterID,level,path) AS (
		SELECT id,detailID,srcID,CONVERT(BIGINT,null),1,CONVERT (VARCHAR (5000),'')
		FROM item.dt
		WHERE id = @id AND isSelected=1
		UNION ALL
		--SELECT I.id,I.detailID,I.srcID,P.id,level+1,CONVERT (VARCHAR (5000),path+STR (I.idx))
		SELECT I.id,I.detailID,I.srcID,P.id,level+1,CONVERT (VARCHAR (5000),path+STR (0))
		FROM P
		INNER JOIN item.dt I ON I.masterID = ISNULL (P.detailID,P.id) AND level<10 AND ISNULL (isSelected,1)=1--AND ISNULL (I.selected,1)=1
		INNER JOIN item.dt D ON D.id = ISNULL (I.detailID,I.id)
	)
	SELECT I.id as itemID,I.name,I.title,P.masterID,item.schemaName (I.id) as [schema],P1.*--,P.level,I.idx
	FROM P
	INNER JOIN item.dt I ON I.id = P.id
	INNER JOIN item.dt D ON D.id=ISNULL (I.detailID,I.id)
	LEFT OUTER JOIN item.class C ON C.id = D.classID
	INNER JOIN (SELECT I.id,F.attributeName name,F.value FROM attribute.vw F INNER JOIN P I ON F.id IN (I.id,I.srcID)) X PIVOT (max (value) FOR name in (w,h,depth,x,y,z,r,rx,ry,rz,children,shape,geo,dx,dy,dz,fx,PowerKVA,Air,Water)) P1 ON P1.id=I.id
	where path is not null
	ORDER BY path
GO
EXEC [item].[getTreeModel] 2745257
EXEC aim.[api].[getItemModelTree] 2745257

--exec [item].[build] 3683132
--exec [item].[build_map] 3683132
--exec [item].[build_node_data] 3683132
GO

--EXEC aim.[api].[getItemModelTree] 2670421


--EXEC [item].build_map 3677243


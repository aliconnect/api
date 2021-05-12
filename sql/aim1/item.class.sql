USE [aim1]
GO
ALTER VIEW [item].[class]
AS
	SELECT I.id,I.hostID,I.classID,I.masterID,I.srcID,I.name,I.name class,S.name AS schemaname,S.name AS [schema]
	FROM item.dv I
	LEFT OUTER JOIN item.dv S ON S.id = I.srcId
	WHERE
	I.classId = 0
GO

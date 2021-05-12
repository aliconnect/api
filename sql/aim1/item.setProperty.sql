USE [aim1]
GO
ALTER PROCEDURE [item].[setProperty] @id VARCHAR(50),@name VARCHAR(50), @value VARCHAR(500)
AS
	IF @value>'' SET @value=''''+@value+''''; ELSE SET @value='NULL'
	EXEC ('UPDATE item.dt SET ['+@name+']='+@value+' WHERE [ID]='+@id)
GO
